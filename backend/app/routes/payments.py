import json
import stripe
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, Request
import os
from dotenv import load_dotenv
import stripe
from app.schemas import OrderCreate
from app.models import Order, Meal, ChefOrder
from uuid import uuid4
from app.database import get_db
from app.crud import get_user_by_email, create_user, create_order

# Load environment variables from .env file
load_dotenv()

# Access the Stripe key securely from environment variables
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

if not STRIPE_SECRET_KEY:
    raise ValueError("STRIPE_SECRET_KEY environment variable is not set")

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/api/create-checkout-session")
async def create_checkout_session(order: OrderCreate, db: Session = Depends(get_db)):
    # Generate a unique order ID (but do not create the order yet)
    order_id = str(uuid4())

    # Get or create the user (buyer)
    user = get_user_by_email(db, order.email)
    if not user:
        user = create_user(db, order.email)

    # Prepare metadata. For meals, we assume order.meals is a list of dicts.
    metadata = {
        "order_id": order_id,
        "buyer_id": user.id,
        "total_price": str(order.total_price),
        "meals": json.dumps(order.meals),
    }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            success_url="http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": order.email},  # Use appropriate product name
                        "unit_amount": int(order.total_price * 100),  # Amount in cents
                    },
                    "quantity": 1,
                }
            ],
            metadata=metadata,
        )
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]

        # Retrieve metadata
        metadata = session_data.get("metadata", {})
        meals_json = metadata.get("meals", "[]")
        meals_data = json.loads(meals_json)

        # Convert meal IDs from the metadata to a list.
        meal_ids = [meal["id"] for meal in meals_data if "id" in meal]

        # Query the Meal model to get the Meal instances
        meal_instances = db.query(Meal).filter(Meal.id.in_(meal_ids)).all()

        new_order = create_order(metadata)

        # Loop through meals and create a ChefOrder for each one
        for meal in meal_instances:
            chef_order = ChefOrder(
                chef_id=meal.seller_id,  # Fetch chef from the meal
                order_id=new_order.id,
                meal_id=meal.id,
                status="pending",
            )
            db.add(chef_order)

        db.commit()  # Commit all chef orders

    return {"status": "success"}
