from decimal import Decimal

USAGE_TIERS = [
    UsageTier(
        name="Free",
        min_usage=0,
        max_usage=1000,
        price=Decimal("0"),
        currency="EUR",
        stripe_price_id="free_tier"
    ),
    UsageTier(
        name="Growth",
        min_usage=1001,
        max_usage=100000,
        price=Decimal("9"),
        currency="EUR",
        stripe_price_id="price_growth_tier"
    ),
    UsageTier(
        name="Scale",
        min_usage=100001,
        max_usage=1000000,
        price=Decimal("79"),
        currency="EUR",
        stripe_price_id="price_scale_tier"
    ),
    UsageTier(
        name="Enterprise",
        min_usage=1000001,
        max_usage=float('inf'),
        price=Decimal("0"),
        currency="EUR",
        stripe_price_id="price_enterprise_tier"
    )
]

