from dataclasses import dataclass
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

@dataclass
class UsageTier:
    name: str
    min_usage: int
    max_usage: int
    price: Decimal
    currency: str
    stripe_price_id: str

@dataclass
class UserUsage:
    user_id: str
    year_month: str
    usage: int
    ttl: int

@dataclass
class Payment:
    user_id: str
    payment_id: str
    amount: Decimal
    currency: str
    status: str
    created_at: datetime
    credits_added: int
    stripe_payment_id: Optional[str] = None
