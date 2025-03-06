# Showdrop - Campaign Discount Code System

This project is a **mini consumer component** of the Showdrop platform. It allows **local businesses** to launch campaigns and distribute **unique discount codes** to customers who provide their email addresses.

---

## Features

- **Campaign Management**: Create, view, and delete campaigns.
- **Discount Code Handling**: Add manual or auto-generated unique discount codes.
- **Customer Redemption**: Customers can claim one-time-use discount codes.
- **Admin Dashboard**: View campaign statistics and manage discount codes.
- **API-Driven Architecture**: Backend powered by Next.js API routes and PostgreSQL (via Drizzle ORM).

---

## How It Works

1. Users who create accounts can create campaigns, delete campaigns, or generate discount codes through a dashboard. They have the option of randomly generating, or creating their own.
2. Signed or not, users can use their emails to get discount code for whatever campaign.
3. Codes are assigned to user's emails.
4. Admins can monitor their campaign stats like total discount codes. claimed codes, or remaining codes

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn
- **Backend**: Next.js API Routes, Drizzle ORM, PostgreSQL (Neon)
- **Authentication**: Clerk Auth
- **Deployment**: Vercel
- **Testing**: Jest

---

## Installation & Setup

### **Clone the Repository**

```sh
git clone https://github.com/zikrya/Showdrop.git
cd showdrop
```

### Install Dependencies

```bash
nvm use --lts
```

```bash
npm install
# or
yarn install
```

### **Setup Environment Variables**

Create a .env file in the root directory and add the following:

```bash
DATABASE_URL=postgresql://showdrop_owner:npg_rO5ZLpmwczI8@ep-sweet-credit-a5hayri9-pooler.us-east-2.aws.neon.tech/showdrop?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zml0dGluZy1waXJhbmhhLTEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_EfQ4kDKGBlMhkuQNOq2l7HTWb2JUNp5z3A4z9swNQA
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/api/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/api/auth
```

### **Run the Development Server**

```bash
npm run dev
# or
yarn dev
```

### \*_Runnning Tests_

```bash
npm test
# or
npm test
```

### **API Endpoints**

#### Create a Campaign

Endpoint: POST /api/campaigns
Request Body:

```bash
{
  "name": "Summer Sale",
  "description": "Exclusive summer discounts",
  "brandName": "Nike",
  "location": "New York"
}
```

Response:

```bash
{
  "id": "abc123",
  "name": "Summer Sale",
  "description": "Exclusive summer discounts",
  "createdAt": "2025-03-05T12:00:00Z"
}
```

#### Get all Campaigns

Endpoint: GET /api/campaigns
Response:

```bash
[
  {
    "id": "abc123",
    "name": "Summer Sale",
    "brandName": "Nike",
    "location": "New York"
  }
]
```

#### Delete a Campaign

Endpoint: DELETE /api/campaigns/[id]
Response:

```bash
{ "success": true, "message": "Campaign deleted successfully" }

```

#### Add Discount Codes (Manual & Generated)

Endpoint: POST /api/campaigns/[id]/codes
Request Body:

```bash
{
  "codes": ["DISCOUNT50", "SUMMER30"],
  "generate": 5
}
```

Response:

```bash
[
  { "code": "DISCOUNT50" },
  { "code": "SUMMER30" },
  { "code": "ABC123" },
  { "code": "XYZ789" }
]
```

#### Get Campaign Discount Codes

Endpoint: GET /api/campaigns/[id]/codes
Response:

```bash
{
  "total": 10,
  "claimed": 4,
  "remaining": 6,
  "codes": [
    { "code": "DISCOUNT50", "assignedToEmail": "john@example.com" }
  ]
}
```

#### Claim a Discount Code

Endpoint: POST /api/campaigns/[id]/claim
Request Body:

```bash
{ "email": "customer@example.com" }

```

Response:

```bash
{ "code": "SUMMER30" }
```
