import json
from fastapi import APIRouter, Depends, HTTPException, Request, Body, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meal, User, Cart
from app.schemas import MealCreate, MealUpdate, UserCreate, UserResponse, MealResponse, UserUpdate, TimeSlot, FullCartSchema, ReviewOut, ReviewCreate
from app.crud import create_meal, get_meal, get_average_rating_for_chef, get_meals, update_meal, delete_meal, get_cart_with_meals, create_or_update_cart, get_chef_orders_by_chef, is_username_unique, get_menu, clear_user_cart
from typing import List, Union
from app.auth import get_current_user, upload_image_and_get_url  # Import authentication dependency

router = APIRouter()

# User Routes
@router.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(id=user.id, username=user.first_name, first_name=user.first_name, last_name=user.last_name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(user_update: UserUpdate, db: Session = Depends(get_db)):
    # Fetch user from the database
    user = db.query(User).filter(User.id == user_update.id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user fields dynamically based on provided values
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)  # Refresh instance to get updated values

    return user


@router.get("/api/check-username/")
def check_username(username: str, db: Session = Depends(get_db)):
    if is_username_unique(db, username):
        return {"available": True}
    else:
        return {"available": False}



# Meal Routes
@router.post("/api/meals", response_model=MealResponse)
async def create_meal_route(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    # Convert the ImmutableMultiDict to a dict
    meal_data = dict(form)
    # Parse the timeslots from JSON if provided
    if "timeslots" in meal_data:
        try:
            meal_data["timeslots"] = json.loads(meal_data["timeslots"])
        except json.JSONDecodeError:
            raise HTTPException(status_code=422, detail="Invalid JSON for timeslots")

    
    # Now, convert meal_data to a MealCreate instance if needed
    try:
        meal = MealCreate(**meal_data)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Error parsing meal data: {str(e)}")
    
    return create_meal(db, meal, seller_id=meal.seller_id)

@router.get("/meals/{meal_id}", response_model=MealResponse)
def get_meal_route(meal_id: int, db: Session = Depends(get_db)):
    meal = get_meal(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

@router.get("/meals/chef/{userId}")
def get_chef_menu(userId: str, db: Session = Depends(get_db)):
    meals = get_menu(db, userId)
    if not meals:
        raise HTTPException(status_code=404, detail="No meals found for this seller")
    return meals

@router.get("/meals/", response_model=List[MealResponse])
def get_meals_route(user_lat: float, user_lon: float, radius: float = 250000.0, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    API endpoint to fetch meals near a given location within a specified radius (in km),
    sorted by distance and paginated.
    """
    return get_meals(db, user_lat, user_lon, radius, skip, limit)



from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import json

@router.put("/api/meals/{meal_id}", response_model=MealResponse)
def update_meal_route(
    meal_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    ingredients: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    quantity: Optional[Union[int, str]] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    unlimited: Optional[bool] = Form(None),
    timeslots: Optional[str] = Form(None),  # JSON string
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    parsed_timeslots = json.loads(timeslots) if timeslots else None

    # Optional: Validate the timeslot structure using Pydantic
    from pydantic import parse_obj_as
    validated_timeslots = parse_obj_as(Optional[List[TimeSlot]], parsed_timeslots)

    image_url = None
    if image:
        image_url = upload_image_and_get_url(image)


    meal_update = MealUpdate(
        name=name,
        description=description,
        ingredients=ingredients,
        price=price,
        quantity=quantity,
        latitude=latitude,
        longitude=longitude,
        unlimited=unlimited,
        timeslots=validated_timeslots,
        image_url=image_url
    )

    updated_meal = update_meal(db, meal_id, meal_update, seller_id=current_user.id)
    if not updated_meal:
        raise HTTPException(status_code=404, detail="Meal not found or unauthorized")

    return updated_meal


@router.delete("/meals/{meal_id}")
def delete_meal_route(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted_meal = delete_meal(db, meal_id)
    if not deleted_meal:
        raise HTTPException(status_code=404, detail="Meal not found or unauthorized")
    return deleted_meal


@router.get("/api/cart/{user_id}", response_model=FullCartSchema)
def get_full_cart(user_id: str, db: Session = Depends(get_db)):
    return get_cart_with_meals(db, user_id)

@router.post("/api/cart/{user_id}")
def update_cart(user_id: str, items: list = Body(...), db: Session = Depends(get_db)):
    return create_or_update_cart(db, user_id, items)

@router.delete("/api/cart/{user_id}/{meal_id}", response_model=FullCartSchema)
def remove_cart_item(user_id: str, meal_id: int, db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    # Deserialize JSON cart items
    try:
        items = json.loads(cart.cart_items) if isinstance(cart.cart_items, str) else cart.cart_items
    except Exception:
        items = []

    # Filter out the meal to remove
    items = [item for item in items if item.get("meal_id") != meal_id]

    # Update the cart_items JSON field
    cart.cart_items = items

    db.commit()
    db.refresh(cart)

    # Return enriched cart data (dict with meal details)
    return get_cart_with_meals(db, user_id)


@router.post("/api/clear-cart")
async def clear_cart(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        clear_user_cart(user.id)  # Replace with your actual database logic
        return {"message": "Cart cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to clear cart")
    
@router.get("/api/orders/{user_id}")
def read_chef_orders(user_id: str, db: Session = Depends(get_db)):
    return get_chef_orders_by_chef(db, user_id)


@router.post("/reviews/create", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(review: ReviewCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_review(db, review, user.id)

@router.get("/meal/{meal_id}", response_model=List[ReviewOut])
def get_reviews_for_meal(meal_id: str, db: Session = Depends(get_db)):
    return get_reviews_for_meal(db, meal_id)

@router.get("/chef/{chef_id}", response_model=List[ReviewOut])
def get_reviews_for_chef(chef_id: str, db: Session = Depends(get_db)):
    return get_reviews_for_chef(db, chef_id)

@router.get("/chef/{chefId}/summary")
def get_chef_rating_summary(chefId: str, db: Session = Depends(get_db)):
    return get_average_rating_for_chef(db, chefId)