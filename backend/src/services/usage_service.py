# services/billing_service.py
import stripe
from typing import Optional
from models import UsageTier
from services.usage_service import UsageService
from services.payment_service import PaymentService
from config import USAGE_TIERS
import os

class BillingService:
    def __init__(self):
        stripe.api_key = os.environ['STRIPE_SECRET_KEY']
        self.usage_service = UsageService()
        self.payment_service = PaymentService()

    def get_current_tier(self, user_id: str) -> UsageTier:
        current_usage = self.usage_service.aggregate_user_usage(user_id)
        
        for tier in USAGE_TIERS:
            if tier.min_usage <= current_usage < tier.max_usage:
                return tier
        
        return USAGE_TIERS[-1]  # Enterprise tier

    def create_checkout_session(self, user_id: str) -> str:
        current_tier = self.get_current_tier(user_id)
        
        if current_tier.name == 'Enterprise':
            raise ValueError('Enterprise tier requires custom quote')
            
        if current_tier.name == 'Free':
            raise ValueError('Current usage within free tier')

        session = stripe.checkout.Session.create(
            line_items=[{
                'price': current_tier.stripe_price_id,
                'quantity': 1
            }],
            mode='payment',
            success_url=f"{os.environ['FRONTEND_URL']}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.environ['FRONTEND_URL']}/payment/cancel",
            client_reference_id=user_id,
        )
        
        # Create pending payment record
        self.payment_service.create_payment(
            user_id=user_id,
            amount=current_tier.price,
            currency=current_tier.currency,
            credits=current_tier.max_usage - current_tier.min_usage,
            stripe_payment_id=session.payment_intent
        )
        
        return session.url

    def handle_stripe_webhook(self, event: stripe.Event):
        if event.type == 'checkout.session.completed':
            session = event.data.object
            self._process_successful_payment(session)

    def _process_successful_payment(self, session):
        user_id = session.client_reference_id
        payment_intent = session.payment_intent
        
        # Update payment status
        payments = self.payment_service.get_payments_by_stripe_id(payment_intent)
        if payments:
            payment = payments[0]
            self.payment_service.update_payment_status(
                user_id=payment.user_id,
                payment_id=payment.payment_id,
                status='completed'
            )
            # Add credits logic here

