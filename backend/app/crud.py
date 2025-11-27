import json
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Meal, Cart, User, ChefOrder, Order, Review
from app.schemas import MealCreate, MealUpdate, MealResponse, ChefOrderCreate, ChefOrderResponse, ReviewCreate
from math import radians, cos, sin, sqrt, atan2, dist
from typing import List, Optional
from fastapi import HTTPException
from datetime import datetime, timedelta
from firebase_admin import auth


# Create a new meal
def create_meal(db: Session, meal: MealCreate, seller_id: str) -> Meal:

    if isinstance(meal.quantity, str):
        try:
            # If the quantity is a string, convert it to an integer (if possible)
            meal.quantity = int(meal.quantity)
        except ValueError:
            # If the string can't be converted to an integer, set to a default value (99999999)
            meal.quantity = 99999999
    elif meal.quantity is None:
        # If quantity is None, set to a default value (99999999)
        meal.quantity = 99999999


    for slot in meal.timeslots:
        try:
            start_time = datetime.strptime(slot.start, "%H:%M").time()
            end_time = datetime.strptime(slot.end, "%H:%M").time()
        except ValueError:
            raise HTTPException(status_code=422, detail=f"Invalid time format in timeslots: {slot.start}, {slot.end}")
        
        if start_time >= end_time:
            raise HTTPException(status_code=422, detail=f"Start time must be before end time in timeslot: {slot.start}, {slot.end}")

    db_meal = Meal(
        name=meal.name,
        description=meal.description,
        ingredients=meal.ingredients,
        price=meal.price,
        quantity=meal.quantity,
        image_url=meal.image_url,
        seller_id=seller_id,
        latitude=meal.latitude,
        longitude=meal.longitude,
        unlimited=meal.unlimited,
        timeslots=[slot.dict() for slot in meal.timeslots],  # Convert Pydantic model to dict
    )
    try:
        db.add(db_meal)
        db.commit()
        db.refresh(db_meal)
        return db_meal
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Calculate distance between two locations (returns kilometers)
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Returns distance in kilometers between two latitude/longitude points using Haversine formula."""
    R = 6371  # Radius of Earth in km
    dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * atan2(sqrt(a), sqrt(1 - a))

# Get a meal by ID (raises 404 if not found)
def get_meal(db: Session, meal_id: int) -> Optional[Meal]:
    meal = db.get(Meal, meal_id)
    if meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

def get_menu(db: Session, seller_id: str,):
    meals = db.query(Meal).filter(Meal.seller_id == seller_id).all()
    return meals if meals else []

# Fetch nearby meals with distance calculation
def get_meals(db: Session, user_lat: float, user_lon: float, radius: float = 10, skip: int = 0, limit: int = 10) -> List[MealResponse]:
    """
    Retrieve meals within a given radius (km) from the user's location, sorted by distance.
    Supports pagination with `skip` and `limit`.
    Each returned Meal object has an extra attribute 'distance'.
    """
    earth_radius_m = 6371000  # Earth's radius in km

    # Haversine formula for calculating distance in SQLAlchemy
    distance_formula = (
        earth_radius_m
        * func.acos(
            func.cos(func.radians(user_lat))
            * func.cos(func.radians(Meal.latitude))
            * func.cos(func.radians(Meal.longitude) - func.radians(user_lon))
            + func.sin(func.radians(user_lat))
            * func.sin(func.radians(Meal.latitude))
        )
    ).label("distance")

    query = (
        db.query(Meal, distance_formula)
        .filter(Meal.latitude.isnot(None), Meal.longitude.isnot(None))
        .filter(distance_formula < radius)  # Only meals within the radius
        .order_by(distance_formula)
        .offset(skip)
        .limit(limit)
    )

    results = query.all()  # results is a list of tuples: (Meal, distance)
    meals_with_distance = []
    for meal, distance in results:
        meal.distance = round(distance)  # Attach the extra field
        meals_with_distance.append(meal)
        
    return meals_with_distance


# Update a meal (raises 404 if not found)
def update_meal(db: Session, meal_id: int, meal_update: MealUpdate, seller_id: str) -> Meal:
    db_meal = db.query(Meal).filter(Meal.id == meal_id, Meal.seller_id == seller_id).first()
    
    if not db_meal:
        raise HTTPException(status_code=404, detail="Meal not found or unauthorized")

    update_data = meal_update.dict(exclude_unset=True)
    update_data = {k: v for k, v in update_data.items() if v is not None}  # ✅ Skip overwriting with None

    for key, value in update_data.items():
        setattr(db_meal, key, value)

    try:
        db.commit()
        db.refresh(db_meal)
        return db_meal
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")



# Delete a meal (raises 404 if not found)
def delete_meal(db: Session, meal_id: int) -> dict:
    db_meal = get_meal(db, meal_id)  # Reuses `get_meal()` to check existence

    try:
        db.delete(db_meal)
        db.commit()
        return {"message": "Meal deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    


def get_cart_with_meals(db: Session, user_id: str):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        return {"user_id": user_id, "cart_items": []}

    try:
        items = json.loads(cart.cart_items) if isinstance(cart.cart_items, str) else cart.cart_items
    except Exception:
        items = []

    enriched_items = []

    for item in items:
        meal = db.query(Meal).filter(Meal.id == item.get("meal_id")).first()
        if meal:
            enriched_items.append({
                "meal_id": item.get("meal_id"),
                "quantity": item.get("quantity", 1),
                "meal": meal
            })

    return {
        "user_id": user_id,
        "cart_items": enriched_items
    }


def create_or_update_cart(db: Session, user_id: str, items: list):
    updated_items = []
    for item in items:
        meal = db.query(Meal).filter(Meal.id == item["meal_id"]).first()
        if not meal:
            continue  # Skip invalid items
        
        updated_items.append({
            "meal_id": meal.id,
            "name": meal.name,
            "price": meal.price,  # Ensure price is included
            "quantity": item.get("quantity", 1)
        })

    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    
    if cart:
        cart.cart_items = updated_items  # Update existing cart
    else:
        cart = Cart(user_id=user_id, cart_items=updated_items)
        db.add(cart)

    db.commit()
    db.refresh(cart)
    return cart

def cleanup_old_carts(db: Session, days_old: int = 30):
    expiration_date = datetime.utcnow() - timedelta(days=days_old)
    old_carts = db.query(Cart).filter(Cart.updated_at < expiration_date).all()
    for cart in old_carts:
        db.delete(cart)
    db.commit()
    return len(old_carts)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str):
    try:
        # Try to get the user from Firebase
        firebase_user = auth.get_user_by_email(email)
    except auth.UserNotFoundError:
        # If not found, create in Firebase
        firebase_user = auth.create_user(email=email)

    # Now check if the user exists in your PostgreSQL DB
    user = db.query(User).filter(User.id == firebase_user.uid).first()
    if user:
        return user

    # If the Firebase user exists but not in DB, create a new DB record
    username = email.split('@')[0]

    # Fill all NOT NULL fields (avoid IntegrityError)
    new_user = User(
        id=firebase_user.uid,
        email=email,
        username=username,
        first_name="New",
        last_name="User",
        gender="Not specified",
        age=0,
        role="buyer",
        is_verified=False,
        rating=0
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user




    

def is_username_unique(db: Session, username: str) -> bool:
    return db.query(User).filter(User.username == username).first() is None

def create_chef_order(db: Session, chef_id: int, order_id: int, meal_id: int, status: str = "pending") -> ChefOrder:
    chef_order = ChefOrder(
        chef_id=chef_id,
        order_id=order_id,
        meal_id=meal_id,
        status=status
    )
    try:
        db.add(chef_order)
        db.commit()
        db.refresh(chef_order)
        return chef_order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get all ChefOrders for a specific chef
def get_chef_orders_by_chef(db: Session, chef_id: str) -> List[ChefOrderResponse]:
    return db.query(ChefOrder).filter(ChefOrder.chef_id == chef_id).all()

# Get all ChefOrders for a specific order
def get_chef_orders_by_order(db: Session, order_id: int) -> List[ChefOrderResponse]:
    return db.query(ChefOrder).filter(ChefOrder.order_id == order_id).all()

# Delete a ChefOrder (raises 404 if not found)
def delete_chef_order(db: Session, chef_order_id: int) -> dict:
    chef_order = db.get(ChefOrder, chef_order_id)
    if chef_order is None:
        raise HTTPException(status_code=404, detail="ChefOrder not found")

    try:
        db.delete(chef_order)
        db.commit()
        return {"message": "ChefOrder deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
# Creates chekout receipt (full order)
def create_order(db: Session, metadata):
    """
    Creates an order and associated ChefOrder entries.
    
    :param db: Database session.
    :param order_data: OrderCreate schema containing order details.
    :return: The newly created order.
    """
    try:
        # Extract metadata
        order_id = metadata.get("order_id")
        buyer_id = metadata.get("buyer_id")
        total_price = float(metadata.get("total_price"))
        meals_json = metadata.get("meals", "[]")
        meals_data = json.loads(meals_json)

        # Extract meal IDs from the provided data
        meal_ids = [meal["id"] for meal in meals_data if "id" in meal]

        # Fetch the Meal instances from the database
        meal_instances = db.query(Meal).filter(Meal.id.in_(meal_ids)).all()

        # Ensure all meals exist in the database
        if len(meal_instances) != len(meal_ids):
            raise HTTPException(status_code=400, detail="Some meals not found.")

        # Create the order
        new_order = Order(
            id=order_id,
            buyer_id=buyer_id,
            total_price=total_price
        )
        db.add(new_order)
        db.commit()

        return new_order

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
def clear_user_cart(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if cart:
        cart.cart_items = []  # Assuming items is a relationship
        db.commit()


def create_review(db: Session, review_data: ReviewCreate, user_id: str):
    # Ensure order is completed and belongs to this user
    order = db.query(Order).filter_by(id=review_data.order_id, user_id=user_id, status="completed").first()
    if not order:
        raise HTTPException(status_code=403, detail="You can only review completed orders.")

    # Prevent duplicate review for the same order
    existing = db.query(Review).filter_by(order_id=review_data.order_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already exists for this order.")

    review = Review(**review_data.dict(), reviewer_id=user_id)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_reviews_for_meal(db: Session, meal_id: str):
    return db.query(Review).filter_by(meal_id=meal_id).order_by(Review.created_at.desc()).all()

def get_reviews_for_chef(db: Session, chef_id: str):
    return db.query(Review).filter_by(chef_id=chef_id).order_by(Review.created_at.desc()).all()

def get_average_rating_for_chef(db: Session, chefId: str):
    result = db.query(func.avg(Review.rating), func.count(Review.id)).filter_by(chef_id=chefId).first()
    return {
        "average_rating": round(float(result[0]), 1) if result[0] else 0.0,
        "review_count": result[1]
    }

