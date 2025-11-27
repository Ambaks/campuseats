from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime, Boolean, func, Index, Table
from sqlalchemy.dialects.postgresql import JSONB, JSON
from datetime import datetime
from app.database import Base
from uuid import uuid4

# Association table for many-to-many relationship between orders and meals
order_meal_association = Table(
    "order_meal_association",
    Base.metadata,
    Column("order_id", String, ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True),
    Column("meal_id", Integer, ForeignKey("meals.id", ondelete="CASCADE"), primary_key=True)
)


class User(Base):
    """User model for buyers and sellers"""
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
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    is_verified = Column(Boolean, default=False)

    # Relationships
    meals = relationship("Meal", back_populates="seller", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="buyer")
    orders_received = relationship("ChefOrder", foreign_keys="[ChefOrder.chef_id]", back_populates="chef")
    reviews = relationship("Review", back_populates="reviewer", foreign_keys="[Review.reviewer_id]")
    received_reviews = relationship("Review", back_populates="chef", foreign_keys="[Review.chef_id]")

    # Indexes for performance
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_username', 'username'),
    )


class Meal(Base):
    """Meal model for food items"""
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    ingredients = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)
    seller_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timeslots = Column(JSONB, nullable=False)
    unlimited = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    seller = relationship("User", back_populates="meals")
    reviews = relationship("Review", back_populates="meal", cascade="all, delete-orphan")
    orders = relationship("Order", secondary=order_meal_association, back_populates="meals")

    # Indexes for performance
    __table_args__ = (
        Index('idx_meal_location', 'latitude', 'longitude'),
        Index('idx_meal_seller', 'seller_id'),
    )


class Order(Base):
    """Order model for purchase transactions"""
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    buyer_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, completed, canceled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buyer = relationship("User", back_populates="orders")
    meals = relationship("Meal", secondary=order_meal_association, back_populates="orders")

    # Indexes for performance
    __table_args__ = (
        Index('idx_order_buyer', 'buyer_id'),
        Index('idx_order_status', 'status'),
        Index('idx_order_created', 'created_at'),
    )


class ChefOrder(Base):
    """ChefOrder model for sellers to track incoming orders"""
    __tablename__ = "chef_orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    buyer_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id", ondelete="CASCADE"), nullable=False, index=True)
    chef_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="pending")  # pending, completed, canceled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chef = relationship("User", foreign_keys=[chef_id], back_populates="orders_received")
    meal = relationship("Meal")

    # Indexes for performance
    __table_args__ = (
        Index('idx_chef_order_chef', 'chef_id'),
        Index('idx_chef_order_buyer', 'buyer_id'),
        Index('idx_chef_order_status', 'status'),
    )


class Cart(Base):
    """Cart model for shopping cart functionality"""
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, index=True, nullable=False, unique=True)
    cart_items = Column(JSON, nullable=False, default=list)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Index for performance
    __table_args__ = (
        Index('idx_cart_user', 'user_id'),
    )


class Review(Base):
    """Review model for meal and chef ratings"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reviewer_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    chef_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    review_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    meal = relationship("Meal", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews")
    chef = relationship("User", foreign_keys=[chef_id], back_populates="received_reviews")

    # Indexes for performance
    __table_args__ = (
        Index('idx_review_chef', 'chef_id'),
        Index('idx_review_meal', 'meal_id'),
        Index('idx_review_reviewer', 'reviewer_id'),
    )
