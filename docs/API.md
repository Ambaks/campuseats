# CampusEats API Documentation

Base URL: `http://localhost:8000` (Development)

All API endpoints return JSON responses unless otherwise specified.

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Meals](#meals)
- [Cart](#cart)
- [Orders](#orders)
- [Payments](#payments)
- [Reviews](#reviews)

---

## Authentication

CampusEats uses Firebase Authentication. Include the Firebase ID token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <firebase_id_token>
```

---

## Users

### Create User
Creates a new user account after Firebase registration.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "id": "firebase_uid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "buyer"
}
```

**Response:** `200 OK`
```json
{
  "id": "firebase_uid",
  "email": "user@example.com",
  "username": "John",
  "first_name": "John",
  "last_name": "Doe",
  "role": "buyer",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Get User Profile
Retrieve user information by ID.

**Endpoint:** `GET /api/users/{user_id}`

**Response:** `200 OK`
```json
{
  "id": "firebase_uid",
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "address": "123 Campus St",
  "profile_picture": "https://...",
  "role": "buyer",
  "rating": "4.8",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Update User Profile
Update user information.

**Endpoint:** `PUT /api/users/{user_id}`

**Request Body:**
```json
{
  "id": "firebase_uid",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "address": "123 Campus St",
  "profile_picture": "https://..."
}
```

**Response:** `200 OK` (Returns updated user object)

### Check Username Availability
Check if a username is available.

**Endpoint:** `GET /api/check-username/?username={username}`

**Response:** `200 OK`
```json
{
  "available": true
}
```

---

## Meals

### Discover Nearby Meals
Get meals near a specific location.

**Endpoint:** `GET /meals/`

**Query Parameters:**
- `user_lat` (required): User's latitude
- `user_lon` (required): User's longitude
- `radius` (optional): Search radius in km (default: 250000)
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Results per page (default: 10)

**Example:** `GET /meals/?user_lat=36.14&user_lon=-86.79&radius=10&skip=0&limit=20`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Chicken Burrito Bowl",
    "description": "Fresh ingredients with homemade salsa",
    "ingredients": "chicken, rice, beans, cheese, salsa",
    "price": 8.99,
    "quantity": 5,
    "image_url": "https://...",
    "seller_id": "seller_uid",
    "latitude": 36.1447,
    "longitude": -86.8027,
    "timeslots": [
      {"start": "11:00", "end": "13:00"},
      {"start": "17:00", "end": "19:00"}
    ],
    "unlimited": false,
    "created_at": "2025-01-10T08:00:00Z",
    "distance": 342.5,
    "seller": {
      "username": "chefmike",
      "profile_picture": "https://...",
      "rating": "4.8"
    }
  }
]
```

### Get Single Meal
Get details for a specific meal.

**Endpoint:** `GET /meals/{meal_id}`

**Response:** `200 OK` (Returns meal object)

### Get Chef's Menu
Get all meals created by a specific seller.

**Endpoint:** `GET /meals/chef/{user_id}`

**Response:** `200 OK` (Returns array of meal objects)

### Create Meal
Create a new meal listing (Seller only).

**Endpoint:** `POST /api/meals`

**Headers:**
```
Authorization: Bearer <firebase_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (string): Meal name
- `description` (string): Meal description
- `ingredients` (string): Comma-separated ingredients
- `price` (float): Price in USD
- `quantity` (int): Available quantity (optional if unlimited)
- `unlimited` (boolean): Whether meal has unlimited quantity
- `latitude` (float): Pickup location latitude
- `longitude` (float): Pickup location longitude
- `timeslots` (JSON string): Available pickup times
- `seller_id` (string): Seller's user ID
- `image` (file): Meal image

**Example timeslots:**
```json
[
  {"start": "11:00", "end": "13:00"},
  {"start": "17:00", "end": "19:00"}
]
```

**Response:** `200 OK` (Returns created meal object)

### Update Meal
Update an existing meal (Seller only).

**Endpoint:** `PUT /api/meals/{meal_id}`

**Headers:**
```
Authorization: Bearer <firebase_token>
Content-Type: multipart/form-data
```

**Form Data:** (All optional, only include fields to update)
- `name`, `description`, `ingredients`, `price`, `quantity`, `latitude`, `longitude`, `unlimited`, `timeslots`, `image`

**Response:** `200 OK` (Returns updated meal object)

### Delete Meal
Delete a meal listing (Seller only).

**Endpoint:** `DELETE /meals/{meal_id}`

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Response:** `200 OK`

---

## Cart

### Get Cart
Get current user's shopping cart with populated meal details.

**Endpoint:** `GET /api/cart/{user_id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": "user_uid",
  "items": [
    {
      "meal_id": 1,
      "name": "Chicken Burrito Bowl",
      "price": 8.99,
      "quantity": 2,
      "image_url": "https://...",
      "seller_name": "Chef Mike"
    }
  ],
  "updated_at": "2025-01-15T14:20:00Z"
}
```

### Update Cart
Add or update items in cart.

**Endpoint:** `POST /api/cart/{user_id}`

**Request Body:**
```json
[
  {
    "meal_id": 1,
    "name": "Chicken Burrito Bowl",
    "price": 8.99,
    "quantity": 3,
    "image_url": "https://..."
  }
]
```

**Response:** `200 OK` (Returns updated cart object)

### Remove Cart Item
Remove a specific item from cart.

**Endpoint:** `DELETE /api/cart/{user_id}/{meal_id}`

**Response:** `200 OK` (Returns updated cart object)

### Clear Cart
Clear all items from cart.

**Endpoint:** `POST /api/clear-cart`

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Response:** `200 OK`
```json
{
  "message": "Cart cleared successfully"
}
```

---

## Orders

### Get Chef Orders
Get all orders received by a seller/chef.

**Endpoint:** `GET /api/orders/{user_id}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "order_id": "order_uuid",
    "buyer_id": "buyer_uid",
    "meal_id": 1,
    "status": "pending",
    "created_at": "2025-01-15T15:30:00Z",
    "buyer": {
      "username": "johndoe",
      "email": "john@example.com",
      "phone_number": "+1234567890"
    },
    "meal": {
      "name": "Chicken Burrito Bowl",
      "price": 8.99,
      "image_url": "https://..."
    }
  }
]
```

---

## Payments

### Create Checkout Session
Create a Stripe checkout session for payment.

**Endpoint:** `POST /api/create-checkout-session`

**Request Body:**
```json
{
  "buyer_id": "user_uid",
  "email": "user@example.com",
  "meals": [
    {"id": 1, "quantity": 2},
    {"id": 3, "quantity": 1}
  ],
  "total_price": 26.97
}
```

**Response:** `200 OK`
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Stripe Webhook
Handles Stripe payment confirmation webhooks.

**Endpoint:** `POST /webhook/stripe`

**Headers:**
```
stripe-signature: <webhook_signature>
```

**Note:** This endpoint is called by Stripe, not by the frontend.

---

## Reviews

### Create Review
Create a review for a meal and chef.

**Endpoint:** `POST /reviews/create`

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Request Body:**
```json
{
  "chef_id": "chef_uid",
  "meal_id": 1,
  "order_id": "order_uuid",
  "rating": 5,
  "review_text": "Amazing food! Will order again."
}
```

**Response:** `201 Created` (Returns review object)

### Get Meal Reviews
Get all reviews for a specific meal.

**Endpoint:** `GET /meal/{meal_id}`

**Response:** `200 OK` (Returns array of review objects)

### Get Chef Reviews
Get all reviews for a specific chef.

**Endpoint:** `GET /chef/{chef_id}`

**Response:** `200 OK` (Returns array of review objects)

### Get Chef Rating Summary
Get average rating and count for a chef.

**Endpoint:** `GET /chef/{chef_id}/summary`

**Response:** `200 OK`
```json
{
  "average_rating": 4.7,
  "total_reviews": 23
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting in production.

## Interactive Documentation

FastAPI provides interactive API documentation:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
