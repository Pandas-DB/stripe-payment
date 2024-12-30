# handlers/lambda_functions.py
import json
import stripe
from services.billing_service import BillingService
import os

def create_checkout(event, context):
    billing_service = BillingService()
    # Assuming JWT authorizer
    user_id = event['requestContext']['authorizer']['claims']['sub']
    
    try:
        checkout_url = billing_service.create_checkout_session(user_id)
        return {
            'statusCode': 200,
            'body': json.dumps({'url': checkout_url})
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }

def stripe_webhook(event, context):
    stripe_signature = event['headers']['stripe-signature']
    
    try:
        stripe_event = stripe.Webhook.construct_event(
            payload=event['body'],
            sig_header=stripe_signature,
            secret=os.environ['STRIPE_WEBHOOK_SECRET']
        )
        
        billing_service = BillingService()
        billing_service.handle_stripe_webhook(stripe_event)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'received': True})
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }
