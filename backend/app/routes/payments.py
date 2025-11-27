import json
import stripe
import logging
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, Request
import os
from dotenv import load_dotenv
from app.schemas import OrderCreate
from app.models import Order, Meal, ChefOrder
from uuid import uuid4
from app.database import get_db
from app.crud import get_user_by_email, create_user

# Load environment variables
load_dotenv()

# Access the Stripe key securely from environment variables
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if not STRIPE_SECRET_KEY:
    raise ValueError("STRIPE_SECRET_KEY environment variable is not set")
if not WEBHOOK_SECRET:
    logging.warning("STRIPE_WEBHOOK_SECRET environment variable is not set. Webhooks will not work.")

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/api/create-checkout-session")
async def create_checkout_session(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a Stripe checkout session for the order
    
    The actual order is created in the webhook after successful payment
    """
    # Generate a unique order ID (but do not create the order yet)
    order_id = str(uuid4())

    # Get or create the user (buyer)
    user = get_user_by_email(db, order.email)
    if not user:
        user = create_user(db, order.email)

    # Prepare metadata for the webhook
    metadata = {
        "order_id": order_id,
        "buyer_id": user.id,
        "total_price": str(order.total_price),
        "meals": json.dumps(order.meals),
    }

    try:
        # Create line items from meals
        line_items = [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"CampusEats Order",
                        "description": f"Order with {len(order.meals)} item(s)"
                    },
                    "unit_amount": int(order.total_price * 100),  # Amount in cents
                },
                "quantity": 1,
            }
        ]

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/checkout",
            line_items=line_items,
            metadata=metadata,
            customer_email=order.email,
        )
        
        logger.info(f"Created Stripe checkout session: {session.id} for order: {order_id}")
        return {"sessionId": session.id, "url": session.url}
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error creating checkout session: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Payment processing error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events
    
    Creates orders and chef orders after successful payment
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid webhook signature: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]
        
        # Retrieve metadata
        metadata = session_data.get("metadata", {})
        order_id = metadata.get("order_id")
        buyer_id = metadata.get("buyer_id")
        total_price = float(metadata.get("total_price", 0))
        meals_json = metadata.get("meals", "[]")
        
        try:
            meals_data = json.loads(meals_json)
        except json.JSONDecodeError:
            logger.error(f"Invalid meals JSON in webhook metadata: {meals_json}")
            raise HTTPException(status_code=400, detail="Invalid meals data")

        # Extract meal IDs
        meal_ids = [meal.get("id") for meal in meals_data if meal.get("id")]
        
        if not meal_ids:
            logger.error(f"No meal IDs found in webhook metadata for order {order_id}")
            raise HTTPException(status_code=400, detail="No meals in order")

        try:
            # Query the Meal model to get the Meal instances
            meal_instances = db.query(Meal).filter(Meal.id.in_(meal_ids)).all()
            
            if not meal_instances:
                logger.error(f"No meals found for IDs: {meal_ids}")
                raise HTTPException(status_code=404, detail="Meals not found")

            # Create the main order
            new_order = Order(
                id=order_id,
                buyer_id=buyer_id,
                total_price=total_price,
                status="pending"
            )
            db.add(new_order)
            db.flush()  # Flush to get the order ID
            
            logger.info(f"Created order: {order_id} for buyer: {buyer_id}")

            # Create chef orders for each meal
            for meal in meal_instances:
                chef_order = ChefOrder(
                    chef_id=meal.seller_id,
                    order_id=new_order.id,
                    buyer_id=buyer_id,  # Now properly included
                    meal_id=meal.id,
                    status="pending",
                )
                db.add(chef_order)
                logger.info(f"Created chef order for chef: {meal.seller_id}, meal: {meal.id}")

            # Commit all changes
            db.commit()
            logger.info(f"Successfully committed order {order_id} and chef orders")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Database error processing webhook: {str(e)}")
            raise HTTPException(status_code=500, detail="Error creating order")

    return {"status": "success"}
