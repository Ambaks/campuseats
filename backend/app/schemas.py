from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Union
from datetime import datetime

class UserCreate(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    username: str = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    username: str
    age: str | None
    profile_picture: Optional[str] = None
    rating: str | None
    role: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enables ORM mode for SQLAlchemy compatibility

class UserUpdate(BaseModel):
    id: str
    email: EmailStr | None
    first_name: str | None
    last_name: str | None
    gender: str | None
    age: int | None
    gender: str | None
    username: str | None
    profile_picture: Optional[str] = None
    rating: str | None
    role: str | None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_verified: bool | None
    updated_at: datetime | None

class TimeSlot(BaseModel):
    start: str
    end: str

class MealCreate(BaseModel):
    name: str
    seller_id: str
    description: Optional[str] = None
    ingredients: str
    price: float
    unlimited: bool
    quantity: int | str
    image_url: Optional[str] = None
    latitude: float 
    longitude: float
    timeslots: list[TimeSlot]

class MealUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    ingredients: Optional[str]
    price: Optional[float]
    image_url: Optional[str]
    quantity: Optional[Union[int, str]]
    latitude: Optional[float]
    longitude: Optional[float]
    timeslots: Optional[List[TimeSlot]]
    unlimited: Optional[bool]


class MealResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    ingredients: str
    price: float
    image_url: Optional[str] = None
    quantity: int | str | None
    seller_id: str
    seller: UserResponse
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance: Optional[float] = None  # To include distance in the response if applicable
    timeslots: Optional[list] = None
    unlimited: bool
 

    class Config:
        from_attributes = True


class CartItemSchema(BaseModel):
    meal_id: int
    quantity: int
    meal: MealResponse

class FullCartSchema(BaseModel):
    user_id: str
    cart_items: List[CartItemSchema]


class OrderCreate(BaseModel):
    email: str 
    meals: List 
    total_price: float

class ChefOrderCreate(BaseModel):
    chef_id: int
    order_id: int
    meal_id: int
    status: Optional[str] = "pending"

# Schema for returning a ChefOrder response
class ChefOrderResponse(BaseModel):
    id: int
    chef_id: int
    order_id: int
    meal_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review_text: Optional[str] = None

class ReviewCreate(ReviewBase):
    meal_id: str
    order_id: str
    chef_id: str

class ReviewOut(ReviewBase):
    id: int
    reviewer_id: str
    meal_id: str
    order_id: str
    chef_id: str
    created_at: datetime

    class Config:
        from_attributes = True