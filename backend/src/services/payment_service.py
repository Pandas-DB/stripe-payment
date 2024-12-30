# services/payment_service.py
import boto3
from datetime import datetime
from typing import Optional
from decimal import Decimal
import uuid
from models import Payment
import os

class PaymentService:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table(os.environ['PAYMENTS_TABLE'])

    def create_payment(self, user_id: str, amount: Decimal, currency: str, 
                      credits: int, stripe_payment_id: Optional[str] = None) -> Payment:
        payment = Payment(
            user_id=user_id,
            payment_id=str(uuid.uuid4()),
            amount=amount,
            currency=currency,
            status='pending',
            created_at=datetime.now(),
            credits_added=credits,
            stripe_payment_id=stripe_payment_id
        )
        
        self.table.put_item(Item={
            'userId': payment.user_id,
            'paymentId': payment.payment_id,
            'amount': str(payment.amount),
            'currency': payment.currency,
            'status': payment.status,
            'createdAt': payment.created_at.isoformat(),
            'creditsAdded': payment.credits_added,
            'stripePaymentId': payment.stripe_payment_id
        })
        
        return payment

    def update_payment_status(self, user_id: str, payment_id: str, status: str):
        self.table.update_item(
            Key={
                'userId': user_id,
                'paymentId': payment_id
            },
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={
                '#status': 'status'
            },
            ExpressionAttributeValues={
                ':status': status
            }
        )
