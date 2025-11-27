from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime, Boolean, func, Index, Table
from sqlalchemy.dialects.postgresql import JSONB, JSON, UUID
from datetime import datetime
from app.database import Base
from uuid import uuid4

Base = declarative_base()


order_meal_association = Table(
    "order_meal_association",
    Base.metadata,
    Column("order_id", String, ForeignKey("orders.id"), primary_key=True),
    Column("meal_id", Integer, ForeignKey("meals.id"), primary_key=True)
)



class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, unique=True, index=True)  # Firebase UID
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    age = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    profile_picture = Column(String, nullable=True)
    role = Column(String, default="buyer")  # buyer, seller, admin
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    rating = Column(String, nullable=True)

    meals = relationship("Meal", back_populates="seller")
    orders = relationship("Order", back_populates="buyer")
    orders_received = relationship("ChefOrder", foreign_keys="[ChefOrder.chef_id]", back_populates="chef")

    # Reviews the user wrote (as a buyer)
    reviews = relationship("Review", back_populates="reviewer", foreign_keys="[Review.reviewer_id]")

    # Reviews the user received (as a chef)
    received_reviews = relationship("Review", back_populates="chef", foreign_keys="[Review.chef_id]")


    created_at = Column(DateTime, default=func.now())  # Auto timestamp
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    is_verified = Column(Boolean, default=False)  # Firebase handles verification, but can store locally too

class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    ingredients = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timeslots = Column(JSONB, nullable=False)
    unlimited = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    seller = relationship("User", back_populates="meals")
    reviews = relationship("Review", back_populates="meal", cascade="all, delete")
    
    # Many-to-Many Relationship
    orders = relationship("Order", secondary=order_meal_association, back_populates="meals")

    __table_args__ = (Index('idx_meal_location', 'latitude', 'longitude'),)


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=str(uuid4()))
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, completed, canceled
    created_at = Column(DateTime, default=datetime.utcnow)

    buyer = relationship("User", back_populates="orders")
    
    # Many-to-Many Relationship
    meals = relationship("Meal", secondary=order_meal_association, back_populates="orders")

class ChefOrder(Base):
    __tablename__ = "chef_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    chef_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chef = relationship("User", foreign_keys=[chef_id], back_populates="orders_received")
    meal = relationship("Meal")

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    cart_items = Column(JSON, nullable=False, default=[])  # JSON column to store cart items
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    reviewer_id = Column(String, ForeignKey("users.id"))
    chef_id = Column(String, ForeignKey("users.id"))
    meal_id = Column(Integer, ForeignKey("meals.id"))
    order_id = Column(String, ForeignKey("orders.id"))

    rating = Column(Integer)
    review_text = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    meal = relationship("Meal", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews")
    chef = relationship("User", foreign_keys=[chef_id], back_populates="received_reviews")