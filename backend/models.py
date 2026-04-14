from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class Product(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    sku: str
    name: str
    unit: str
    price: float
    stock_on_hand: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class SubscriptionItem(BaseModel):
    sku: str
    quantity: int


class Subscription(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_stub_id: str
    items: List[SubscriptionItem]
    frequency: str  # "daily" or "weekly"
    start_date: datetime
    next_run_at: datetime
    status: str  # "active" or "paused"
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class Order(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    subscription_id: PyObjectId
    user_stub_id: str
    items: List[SubscriptionItem]
    scheduled_for: datetime
    status: str  # "created", "blocked", "delivered"
    reason: Optional[str] = None
    inventory_check: Optional[List[dict]] = None
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Request/Response Models
class ProductCreate(BaseModel):
    sku: str
    name: str
    unit: str
    price: float
    stock_on_hand: int
    image_url: Optional[str] = None
    description: Optional[str] = None


class ProductUpdate(BaseModel):
    stock_on_hand: int


class SubscriptionCreate(BaseModel):
    user_stub_id: str
    items: List[SubscriptionItem]
    frequency: str
    start_date: Optional[datetime] = None

    @field_validator('frequency')
    @classmethod
    def validate_frequency(cls, v):
        if v not in ["daily", "weekly"]:
            raise ValueError('Frequency must be "daily" or "weekly"')
        return v


class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    items: Optional[List[SubscriptionItem]] = None
    frequency: Optional[str] = None
