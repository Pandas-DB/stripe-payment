# Usage-Based Payments Service

A scalable service for managing usage-based payments with Stripe integration. This service provides tiered pricing based on API usage, with support for both credit packs and custom enterprise pricing.

## Features

- 🔄 Usage tracking across multiple services
- 💳 Stripe integration for payment processing
- 📊 Tiered pricing support
- 🏢 Enterprise custom pricing support
- 📈 Usage analytics and reporting
- 🔐 Secure payment processing
- ⚡ Serverless architecture

## Pricing Tiers

| Tier       | Usage Range     | Price | Features                    |
|------------|----------------|-------|----------------------------|
| Free       | 0-1,000        | €0    | Basic API access           |
| Growth     | 1K-100K        | €9    | Extended API + Support     |
| Scale      | 100K-1M        | €79   | Premium features + Support |
| Enterprise | 1M+            | Custom| Custom solutions          |

## Prerequisites

- Python 3.9+
- Node.js 16+
- AWS CLI configured
- Stripe account
- Serverless Framework

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/usage-based-payments.git
cd usage-based-payments
```

2. Set up backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

3. Set up frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables:

Create a `.env` file in both backend and frontend directories:

```env
# Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:4000
```

## Infrastructure Setup

1. Deploy DynamoDB tables:
```bash
cd infrastructure/dynamodb
serverless deploy --stage dev
```

2. Create Stripe products and prices:
```bash
python backend/scripts/setup_stripe.py
```

## Development

1. Start backend locally:
```bash
cd backend
serverless offline
```

2. Start frontend development server:
```bash
cd frontend
npm run dev
```

## Deployment

1. Deploy backend:
```bash
cd backend
serverless deploy --stage prod
```

2. Deploy frontend:
```bash
cd frontend
npm run build
# Deploy build folder to your hosting service
```

## Architecture

### Backend Components

- **UsageService**: Manages API usage tracking
- **PaymentService**: Handles payment records and credit management
- **BillingService**: Integrates with Stripe and manages pricing logic

### Data Storage

- **API Usage Table**: Tracks service usage per user
- **Payments Table**: Records payment history and credit balance

### Frontend Components

- **PricingTiers**: Displays available pricing tiers
- **UsageStats**: Shows current usage metrics
- **PaymentPage**: Handles payment flow

## API Documentation

### Endpoints

#### Usage Tracking
```
GET /api/usage
POST /api/usage/track
```

#### Payments
```
POST /api/checkout/create
POST /api/webhook/stripe
GET /api/credits/balance
```

## Testing

Run backend tests:
```bash
cd backend
pytest
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please email security@yourdomain.com

## Support

For support questions, please open an issue or email support@yourdomain.com
