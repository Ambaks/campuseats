# CampusEats MVP

> A full-stack peer-to-peer food marketplace platform connecting campus meal providers with hungry students through location-based discovery and real-time ordering.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.4.0-FFCA28)](https://firebase.google.com/)

---

## Table of Contents
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Design & Implementation](#system-design--implementation)
- [API Documentation](#api-documentation)
- [Screenshots & Demos](#screenshots--demos)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 15+ (or Docker)
- Firebase account (for authentication)
- Stripe account (for payments)

### Running the Application

This project requires **two terminal windows** running simultaneously - one for the backend server and one for the frontend application.

#### Terminal 1: Backend Server

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with:
# DATABASE_URL=postgresql://Ambaks:pass@localhost:5432/campuseats
# FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Start PostgreSQL (if using Docker)
docker-compose up -d db

# Run database migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend API will be running at `http://localhost:8000`
API documentation available at `http://localhost:8000/docs`

#### Terminal 2: Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...

# Start the Next.js development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

### Using Docker Compose (Alternative)

```bash
# Start both backend and database
docker-compose up

# Frontend still needs to run separately
cd frontend && npm run dev
```

---

## Architecture Overview

CampusEats follows a modern **microservices-inspired architecture** with clear separation between the presentation layer (Next.js), business logic (FastAPI), and data persistence (PostgreSQL). The system leverages Firebase for authentication and Stripe for payment processing.

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  Next.js 15 (React 19) + Material-UI + Tailwind CSS        │
│  - Server Components + Client Components                    │
│  - Context API for Global State (Auth, Cart, Orders)       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  API Gateway Layer                          │
│              FastAPI Backend (Python)                       │
│  - RESTful API endpoints                                    │
│  - Pydantic validation                                      │
│  - Firebase token verification                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌─────────┐ ┌──────────────┐
│  PostgreSQL  │ │ Firebase│ │    Stripe    │
│  Database    │ │  Auth   │ │   Payments   │
│  (SQLAlchemy)│ │ Storage │ │   Webhooks   │
└──────────────┘ └─────────┘ └──────────────┘
```

### Key Architectural Decisions

1. **Next.js App Router**: Leverages React Server Components for improved performance and SEO while maintaining client-side interactivity where needed.

2. **Firebase Authentication**: Offloads auth complexity to a managed service, providing secure token-based authentication with minimal backend overhead.

3. **PostgreSQL with JSONB**: Uses relational data for structured entities (Users, Meals, Orders) while leveraging JSONB columns for flexible schema requirements (cart items, meal timeslots).

4. **Stripe Webhooks**: Implements event-driven architecture for payment processing, ensuring atomic order creation only after confirmed payment.

5. **Context API**: Manages global state (authentication, cart, orders) without external dependencies, keeping the bundle size minimal.

---

## Features

### 1. Location-Based Meal Discovery

**[INSERT VIDEO: Home page showing meal discovery with location permission and distance calculations]**

- **Automatic Geolocation**: Browser geolocation API captures user coordinates with fallback handling for denied permissions
- **Haversine Distance Calculation**: Backend implements the spherical distance formula for accurate kilometer/meter calculations:
  ```python
  distance = 6371 * acos(
      cos(radians(user_lat)) * cos(radians(meal_lat)) *
      cos(radians(meal_lon) - radians(user_lon)) +
      sin(radians(user_lat)) * sin(radians(meal_lat))
  )
  ```
- **Color-Coded Distance Indicators**:
  - 🟢 **Green** (#4CAF50): ≤ 500m (walking distance, 5-7 min walk)
  - 🟡 **Yellow** (#FFD700): 500-1000m (short bike ride, 3-5 min)
  - 🟠 **Orange** (#FF6A1D): > 1000m (requires car or longer transit)
- **Spatial Database Indexing**: Composite index on `(latitude, longitude)` enables fast geographic queries
- **Real-time Updates**: Distance recalculates when user location changes

**Technical Implementation**: [frontend/src/app/page.js](frontend/src/app/page.js), [backend/app/crud.py](backend/app/crud.py)

---

### 2. Firebase Authentication System

**[INSERT SCREENSHOT: Login/Registration modal]**

CampusEats implements a secure, token-based authentication flow that synchronizes Firebase auth with a PostgreSQL user database.

#### Registration Flow
```
User fills form → Firebase createUser → Backend POST /api/users →
DB creates user record → AuthContext updates → Profile completion
```

#### Login Flow
```
User credentials → Firebase signIn → onAuthStateChanged fires →
GET /api/users/{uid} → Merge Firebase + DB data → Update context
```

#### Key Features
- Email/password authentication with Firebase validation
- Race condition handling: 404 responses handled gracefully during initial user creation
- Session persistence across browser refreshes
- Automatic token refresh
- Role-based access control (buyer, seller, admin)

**Technical Implementation**:
- Frontend: [frontend/src/app/context/AuthContext.js](frontend/src/app/context/AuthContext.js)
- Backend: [backend/app/auth.py](backend/app/auth.py)
- Database: [backend/app/models.py](backend/app/models.py) - User model

---

### 3. Interactive Meal Cards with 3D Flip Animation

**[INSERT VIDEO: Meal card flip animation showing front and back]**

```css
/* CSS 3D Transform Implementation */
.flip-card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.flip-card:hover {
  transform: rotateY(180deg);
}
```

- **Front Side**: Meal image, seller avatar, rating stars, distance badge
- **Back Side**: Detailed description, ingredients list, price, availability timeslots, "Add to Cart" button
- **Responsive Grid**: Adapts from 2 columns (mobile) to 4 columns (desktop) using Tailwind's grid system
- **Image Optimization**: Next.js Image component with automatic WebP conversion and lazy loading

**Technical Implementation**: [frontend/src/app/components/MealCard.js](frontend/src/app/components/MealCard.js)

---

### 4. Shopping Cart with Hybrid Storage

**[INSERT SCREENSHOT: Shopping cart drawer with items]**

The cart system implements a **dual-storage strategy** that adapts to user authentication state:

| User State | Storage Method | Persistence |
|------------|----------------|-------------|
| Logged Out | LocalStorage | Browser-local |
| Logged In | PostgreSQL | Server-side, multi-device |

#### Cart Operations
- **Add Item**: Checks for duplicates, increments quantity if exists
- **Update Quantity**: Real-time price calculations
- **Remove Item**: Soft delete with confirmation
- **Clear Cart**: Batch delete operation
- **Auto-sync**: LocalStorage → Database on login

#### Database Schema
```sql
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    items JSONB NOT NULL,  -- [{meal_id, name, price, quantity, image_url}]
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_cart_user ON carts(user_id);
```

**Technical Implementation**:
- Frontend: [frontend/src/app/context/CartContext.js](frontend/src/app/context/CartContext.js)
- Backend: [backend/app/crud.py](backend/app/crud.py) - `get_cart()`, `update_cart()`

---

### 5. Stripe Checkout Integration

**[INSERT SCREENSHOT: Checkout page with form fields]**
**[INSERT SCREENSHOT: Stripe payment page]**

CampusEats integrates Stripe Checkout Sessions for PCI-compliant payment processing.

#### Checkout Flow
```
1. User reviews cart → Fills shipping/billing info
2. Frontend POST /api/create-checkout-session
3. Backend creates Stripe Session with metadata:
   - order_id (UUID)
   - buyer_id (Firebase UID)
   - meals (JSON serialized)
   - total_price
4. Redirect to Stripe hosted checkout
5. User completes payment
6. Stripe webhook POST /webhook/stripe
7. Backend verifies signature
8. Creates Order + ChefOrders atomically
9. Redirect to /success page
```

#### Webhook Implementation
```python
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    # Verify webhook signature
    event = stripe.Webhook.construct_event(
        payload, sig_header, WEBHOOK_SECRET
    )

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session["metadata"]

        # Create order in database
        create_order_from_session(db, metadata)
```

**Security Features**:
- Webhook signature verification prevents replay attacks
- Metadata validation ensures data integrity
- Atomic transactions prevent partial order creation
- Idempotency keys prevent duplicate charges

**Technical Implementation**:
- Frontend: [frontend/src/app/checkout/page.js](frontend/src/app/checkout/page.js)
- Backend: [backend/app/routes/payments.py](backend/app/routes/payments.py)

---

### 6. Seller Dashboard (Earn Section)

**[INSERT SCREENSHOT: Seller dashboard with tabs - Menu, Orders, History, Analytics, Settings]**

The seller dashboard provides a comprehensive management interface for meal providers.

#### Menu Management
**[INSERT VIDEO: Creating a new meal with image upload and timeslot configuration]**

- **Meal Creation Form**:
  - Name, description, ingredients (comma-separated)
  - Price (decimal validation)
  - Quantity or unlimited toggle
  - Image upload to Firebase Storage
  - Timeslot configuration (multiple windows supported)

- **Firebase Storage Integration**:
  ```javascript
  const storageRef = ref(storage, `meals/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  ```

- **Timeslot Schema**:
  ```json
  {
    "timeslots": [
      {"start": "11:00", "end": "13:00"},
      {"start": "17:00", "end": "19:00"}
    ]
  }
  ```

#### Order Management
**[INSERT SCREENSHOT: Incoming orders tab with pending orders]**

- Real-time order notifications
- Order details: buyer info, meal, quantity, timestamp
- Status tracking: pending → completed → canceled
- Batch operations for fulfillment

#### Analytics Dashboard
- **Total Sales**: SUM of all completed orders
- **Total Orders**: COUNT of orders
- **Pending Earnings**: SUM of pending orders
- **Chart Visualization**: Revenue over time (Chart.js or Recharts)

**Technical Implementation**:
- [frontend/src/app/earn/page.js](frontend/src/app/earn/page.js)
- [frontend/src/app/components/Menu.js](frontend/src/app/components/Menu.js)
- [backend/app/crud.py](backend/app/crud.py) - CRUD operations

---

### 7. Interactive Map with Mapbox GL

**[INSERT VIDEO: Map view showing meal pins with color-coded borders, clicking on pins, flying to user location]**

The map feature provides a visual representation of nearby meal availability using Mapbox GL JS.

#### Key Features
- **3D Buildings Layer**: Fill-extrusion for realistic urban visualization
- **Custom Meal Markers**: Circular meal image pins with distance-based border colors
- **Pitch & Bearing Controls**: 60° pitch for perspective view
- **User Location Button**: Fly-to animation centering on user coordinates
- **Popup Cards**: Click markers to view meal details (name, price, rating, image)
- **Dynamic Label Visibility**: Road labels appear only at zoom > 17

#### Mapbox Initialization
```javascript
const map = new mapboxgl.Map({
  container: mapContainer.current,
  style: "mapbox://styles/mapbox/streets-v12",
  center: [longitude, latitude],
  zoom: 16,
  pitch: 60,
  bearing: 0,
  antialias: true
});

// Add 3D buildings
map.addLayer({
  id: "3d-buildings",
  source: "osm-buildings",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": "#aaa",
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-opacity": 0.6
  }
});
```

#### Custom Marker Implementation

```javascript
// Distance-based color coding function
function getDistanceColor(distance) {
  if (distance <= 500) return "#4CAF50";        // Green
  if (distance <= 1000) return "#FFD700";       // Yellow
  return "#FF6A1D";                              // Orange
}

meals.forEach(meal => {
  const el = document.createElement("div");
  el.style.backgroundImage = `url(${meal.image_url})`;
  el.style.backgroundSize = "cover";
  el.style.width = "40px";
  el.style.height = "40px";
  el.style.borderRadius = "50%";
  el.style.border = `3px solid ${getDistanceColor(meal.distance)}`;
  el.style.cursor = "pointer";
  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

  new mapboxgl.Marker(el)
    .setLngLat([meal.longitude, meal.latitude])
    .addTo(map);
});
```

**Technical Implementation**: [frontend/src/app/map/page.js](frontend/src/app/map/page.js)

---

### 8. User Profile Management

**[INSERT SCREENSHOT: Profile page with form fields and avatar upload]**

- **Profile Completion Flow**: Prompts new users to complete profile after registration
- **Username Validation**: Real-time uniqueness check against database
- **Avatar Upload**: Cloudinary or Firebase Storage integration
- **Editable Fields**:
  - Personal: First name, last name, age, gender
  - Contact: Email (read-only), phone number
  - Location: Full address for delivery
  - Profile: Username (unique), profile picture
- **Role Badge**: Visual indicator for buyer/seller status

**Technical Implementation**:
- [frontend/src/app/profile/page.js](frontend/src/app/profile/page.js)
- [frontend/src/app/components/ProfileForm.js](frontend/src/app/components/ProfileForm.js)

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.2 | React framework with App Router, Server Components, and built-in optimizations |
| **React** | 19.0 | UI library with concurrent features and improved performance |
| **Material-UI** | 6.4.7 | Component library providing pre-built accessible components |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework for rapid UI development |
| **Mapbox GL** | 3.10.0 | Interactive vector maps with 3D capabilities |
| **Leaflet** | 1.9.4 | Open-source map library for basic mapping features |
| **Firebase** | 11.4.0 | Authentication, storage, and real-time capabilities |
| **Stripe.js** | 6.1.0 | Payment processing and checkout components |
| **React Icons** | 5.5.0 | Icon library with 40+ icon sets |
| **Emotion** | 11.14.0 | CSS-in-JS library for dynamic styling |

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern async Python web framework with automatic OpenAPI documentation |
| **Uvicorn** | ASGI server for running FastAPI with high performance |
| **SQLAlchemy** | ORM for database interactions with support for complex queries |
| **Pydantic** | Data validation using Python type hints |
| **Alembic** | Database migration tool for version control of schema changes |
| **psycopg2** | PostgreSQL adapter for Python |
| **Firebase Admin SDK** | Server-side Firebase integration for token verification |
| **Stripe Python SDK** | Server-side payment processing and webhook handling |

### Database & Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | PostgreSQL 15 | Primary data store with JSONB support for flexible schemas |
| **Caching** | (Future: Redis) | Planned for session storage and API caching |
| **Containerization** | Docker + Docker Compose | Consistent development environments |
| **Authentication** | Firebase Auth | User authentication and authorization |
| **File Storage** | Firebase Storage | Meal and profile image hosting |
| **Payment Gateway** | Stripe | PCI-compliant payment processing |
| **Maps** | Mapbox | Geocoding and interactive maps |

---

## Project Structure

```
CampusEats_MVP/
├── frontend/                          # Next.js React application
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── (pages)/
│   │   │   │   ├── page.js            # Home - Meal discovery
│   │   │   │   ├── profile/page.js    # User profile management
│   │   │   │   ├── earn/page.js       # Seller dashboard
│   │   │   │   ├── checkout/page.js   # Payment checkout
│   │   │   │   ├── success/page.js    # Order confirmation
│   │   │   │   └── map/page.js        # Map view
│   │   │   ├── components/            # Reusable React components
│   │   │   │   ├── AuthSection.js     # Login/Register modal
│   │   │   │   ├── MealCard.js        # 3D flip card
│   │   │   │   ├── MealList.js        # Grid layout
│   │   │   │   ├── CartIcon.js        # Cart drawer
│   │   │   │   ├── Navbar.js          # Bottom navigation
│   │   │   │   ├── ProfileForm.js     # Profile editor
│   │   │   │   ├── Menu.js            # Seller menu manager
│   │   │   │   ├── SearchBar.js       # Search functionality
│   │   │   │   └── MapComponent.js    # Leaflet wrapper
│   │   │   ├── context/               # React Context providers
│   │   │   │   ├── AuthContext.js     # Authentication state
│   │   │   │   ├── CartContext.js     # Shopping cart state
│   │   │   │   └── OrderContext.js    # Order management
│   │   │   ├── services/              # API communication
│   │   │   │   └── api.js             # Fetch wrappers
│   │   │   ├── layout.js              # Root layout
│   │   │   └── globals.css            # Global styles
│   │   └── utils/
│   │       └── firebase.js            # Firebase configuration
│   ├── public/                        # Static assets
│   ├── package.json                   # Frontend dependencies
│   ├── next.config.mjs                # Next.js configuration
│   └── tailwind.config.js             # Tailwind CSS configuration
│
├── backend/                           # FastAPI Python backend
│   ├── app/
│   │   ├── main.py                    # FastAPI application entry
│   │   ├── models.py                  # SQLAlchemy models
│   │   ├── schemas.py                 # Pydantic schemas
│   │   ├── crud.py                    # Database operations
│   │   ├── auth.py                    # Firebase auth integration
│   │   ├── database.py                # Database connection
│   │   ├── routes/
│   │   │   ├── users.py               # User endpoints
│   │   │   ├── meals.py               # Meal endpoints
│   │   │   ├── orders.py              # Order endpoints
│   │   │   ├── payments.py            # Stripe integration
│   │   │   └── cart.py                # Cart endpoints
│   │   └── seed_meal_data.py          # Database seeding script
│   ├── alembic/                       # Database migrations
│   │   └── versions/                  # Migration files
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Docker image definition
│   └── .env                           # Environment variables
│
├── db/                                # Database scripts
│   └── init.sql                       # Initial schema
│
├── docs/                              # Documentation
│   ├── API.md                         # API reference
│   └── README.md                      # Additional docs
│
├── docker-compose.yml                 # Container orchestration
└── README.md                          # This file
```

---

## System Design & Implementation

### Database Schema

#### Entity-Relationship Diagram

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ id (PK)             │──┐
│ email (unique)      │  │
│ username (unique)   │  │
│ first_name          │  │
│ last_name           │  │
│ phone_number        │  │
│ address             │  │
│ profile_picture     │  │
│ role                │  │
│ created_at          │  │
└─────────────────────┘  │
         │               │
         │ 1:N           │ 1:N
         │               │
         ▼               ▼
┌─────────────────────┐ ┌─────────────────────┐
│       Meals         │ │      Orders         │
├─────────────────────┤ ├─────────────────────┤
│ id (PK)             │ │ id (PK)             │
│ name                │ │ buyer_id (FK)       │
│ description         │ │ total_price         │
│ ingredients         │ │ status              │
│ price               │ │ created_at          │
│ quantity            │ └─────────────────────┘
│ image_url           │          │
│ seller_id (FK)      │          │ M:N
│ latitude            │          │
│ longitude           │◄─────────┘
│ timeslots (JSONB)   │  order_meal_association
│ unlimited           │
│ created_at          │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│    ChefOrders       │
├─────────────────────┤
│ id (PK)             │
│ order_id (FK)       │
│ buyer_id (FK)       │
│ meal_id (FK)        │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│       Carts         │
├─────────────────────┤
│ id (PK)             │
│ user_id             │
│ items (JSONB)       │
│ updated_at          │
└─────────────────────┘
```

#### Key Database Design Decisions

1. **JSONB for Timeslots**: Allows flexible storage of multiple time windows without additional tables
2. **Composite Spatial Index**: `CREATE INDEX idx_meal_location ON meals(latitude, longitude)` for fast geo-queries
3. **Many-to-Many Association**: `order_meal_association` enables multiple meals per order
4. **ChefOrders Table**: Denormalized table for seller order management (trades normalization for query performance)
5. **Cascade Deletes**: `ON DELETE CASCADE` for meal deletion removes associated orders/cart items

### API Design Patterns

#### RESTful Conventions
```
GET    /api/resource        # List resources
POST   /api/resource        # Create resource
GET    /api/resource/{id}   # Get single resource
PUT    /api/resource/{id}   # Update resource (full)
PATCH  /api/resource/{id}   # Update resource (partial)
DELETE /api/resource/{id}   # Delete resource
```

#### Query Parameters
```
GET /meals?user_lat=36.14&user_lon=-86.79&radius=10&skip=0&limit=20
```
- `user_lat`, `user_lon`: User coordinates for distance calculation
- `radius`: Maximum distance in kilometers
- `skip`, `limit`: Pagination parameters

#### Error Handling
```json
{
  "detail": {
    "error": "ValidationError",
    "message": "Username already exists",
    "field": "username"
  }
}
```

### State Management Architecture

CampusEats uses **React Context API** for global state management, avoiding external dependencies like Redux.

#### AuthContext
```javascript
const AuthContext = createContext({
  user: null,              // Firebase user + DB data
  loading: true,
  setUser: () => {},
  logout: () => {}
});

// Usage in components
const { user, loading } = useAuth();
if (loading) return <Spinner />;
if (!user) return <LoginPrompt />;
```

#### CartContext
```javascript
const CartContext = createContext({
  cart: [],
  addToCart: (meal) => {},
  removeFromCart: (mealId) => {},
  updateQuantity: (mealId, quantity) => {},
  clearCart: () => {},
  totalPrice: 0,
  itemCount: 0
});
```

### Security Implementation

#### Authentication Flow
1. **Token Verification**: Every protected API request includes `Authorization: Bearer <firebase_token>`
2. **Backend Verification**: FastAPI middleware verifies token with Firebase Admin SDK
3. **User Injection**: Verified user UID injected into request context
4. **Authorization**: Role-based checks for seller-only endpoints

#### Payment Security
- **Webhook Signatures**: Stripe webhook events verified using `stripe.Webhook.construct_event()`
- **Idempotency**: Stripe API requests include idempotency keys to prevent duplicate charges
- **HTTPS Only**: Production deployment enforces HTTPS for all requests
- **Environment Variables**: Sensitive keys stored in `.env` files (never committed)

---

## API Documentation

### Authentication

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "id": "firebase_uid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "buyer"
}
```

#### Get User Profile
```http
GET /api/users/{user_id}
Authorization: Bearer {firebase_token}

Response:
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
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Meals

#### Discover Nearby Meals
```http
GET /meals?user_lat=36.14&user_lon=-86.79&radius=10&skip=0&limit=20

Response:
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
    "distance": 342.5,  // meters
    "seller": {
      "username": "chefmike",
      "profile_picture": "https://...",
      "rating": "4.8"
    }
  }
]
```

#### Create Meal (Seller Only)
```http
POST /api/meals
Authorization: Bearer {firebase_token}
Content-Type: multipart/form-data

{
  "name": "Vegan Buddha Bowl",
  "description": "Plant-based protein bowl",
  "ingredients": "quinoa, chickpeas, avocado, kale",
  "price": 9.99,
  "quantity": 10,
  "unlimited": false,
  "timeslots": [{"start": "12:00", "end": "14:00"}],
  "image": <file>
}
```

### Cart

#### Get Cart
```http
GET /api/cart/{user_id}
Authorization: Bearer {firebase_token}

Response:
{
  "id": 1,
  "user_id": "user_uid",
  "items": [
    {
      "meal_id": 1,
      "name": "Chicken Burrito Bowl",
      "price": 8.99,
      "quantity": 2,
      "image_url": "https://..."
    }
  ],
  "updated_at": "2025-01-15T14:20:00Z"
}
```

#### Update Cart
```http
POST /api/cart/{user_id}
Authorization: Bearer {firebase_token}
Content-Type: application/json

{
  "items": [
    {
      "meal_id": 1,
      "name": "Chicken Burrito Bowl",
      "price": 8.99,
      "quantity": 3,
      "image_url": "https://..."
    }
  ]
}
```

### Payments

#### Create Checkout Session
```http
POST /api/create-checkout-session
Authorization: Bearer {firebase_token}
Content-Type: application/json

{
  "buyer_id": "user_uid",
  "email": "user@example.com",
  "meals": [
    {"meal_id": 1, "quantity": 2}
  ],
  "total_price": 17.98
}

Response:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

#### Stripe Webhook
```http
POST /webhook/stripe
Stripe-Signature: t=...,v1=...

{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": {
        "order_id": "uuid",
        "buyer_id": "user_uid",
        "meals": "[{meal_id: 1, quantity: 2}]",
        "total_price": "17.98"
      }
    }
  }
}
```

### Orders

#### Get User Orders (as Seller)
```http
GET /api/orders/{user_id}
Authorization: Bearer {firebase_token}

Response:
[
  {
    "id": 1,
    "order_id": "order_uuid",
    "buyer_id": "buyer_uid",
    "meal_id": 1,
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

For complete API documentation with request/response schemas, visit `http://localhost:8000/docs` when running the backend server.

---

## Screenshots & Demos

### Home Page - Meal Discovery
**[INSERT VIDEO HERE]**
- Auto-detect user location
- Display meals sorted by distance
- Color-coded distance badges
- Responsive grid layout

### Meal Card Interaction
**[INSERT VIDEO HERE]**
- 3D flip animation on hover
- Front: Image, seller, rating, distance
- Back: Description, ingredients, timeslots, price
- Add to cart button

### Shopping Cart Drawer
**[INSERT SCREENSHOT HERE]**
- Slide-out drawer from right
- Item list with quantity controls
- Real-time total calculation
- Proceed to checkout button

### Checkout Flow
**[INSERT SCREENSHOT HERE: Checkout form]**
- Email and shipping address form
- Order summary with items
- Total calculation
- Stripe payment button

**[INSERT SCREENSHOT HERE: Stripe payment page]**
- Secure Stripe-hosted checkout
- Card payment form
- Test mode indicator

### Seller Dashboard
**[INSERT SCREENSHOT HERE: Menu tab]**
- Meal creation form
- Image upload preview
- Timeslot picker
- Unlimited quantity toggle

**[INSERT SCREENSHOT HERE: Orders tab]**
- Incoming order notifications
- Buyer contact information
- Order details and timing

**[INSERT VIDEO HERE: Creating a meal]**
- Fill out meal form
- Upload image to Firebase
- Configure timeslots
- Save and see on menu

### Map View
**[INSERT VIDEO HERE]**
- 3D buildings with pitch
- Custom meal marker pins
- Click pin to see details
- Fly to user location button
- Zoom controls

### Profile Page
**[INSERT SCREENSHOT HERE]**
- Profile picture upload
- Editable user information
- Username uniqueness validation
- Role badge display

---

## Development Workflow

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/CampusEats_MVP.git
cd CampusEats_MVP
```

#### 2. Configure Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://Ambaks:pass@localhost:5432/campuseats
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-admin-sdk.json
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...
```

#### 3. Initialize Database
```bash
# Using Docker
docker-compose up -d db

# Or install PostgreSQL locally and create database
psql -U postgres
CREATE DATABASE campuseats;
CREATE USER Ambaks WITH PASSWORD 'pass';
GRANT ALL PRIVILEGES ON DATABASE campuseats TO Ambaks;
```

#### 4. Run Migrations
```bash
cd backend
alembic upgrade head
```

#### 5. Seed Database (Optional)
```bash
python -m app.seed_meal_data
```

#### 6. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Testing

#### Backend Tests
```bash
cd backend
pytest tests/ -v
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Code Quality

#### Linting
```bash
# Backend
cd backend
pylint app/

# Frontend
cd frontend
npm run lint
```

#### Formatting
```bash
# Backend
black app/

# Frontend
npm run format
```

### Database Migrations

#### Create New Migration
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

#### Apply Migration
```bash
alembic upgrade head
```

#### Rollback Migration
```bash
alembic downgrade -1
```

---

## Deployment

### Production Considerations

#### Environment Variables
- Store all secrets in environment variables (never commit to Git)
- Use `.env.production` files for production-specific configurations
- Rotate API keys and database credentials regularly

#### Database
- Enable connection pooling for PostgreSQL
- Set up automated backups (daily minimum)
- Create read replicas for scalability
- Index frequently queried columns

#### Frontend
```bash
cd frontend
npm run build
npm start  # or deploy to Vercel
```

#### Backend
```bash
# Using Docker
docker build -t campuseats-backend ./backend
docker run -p 8000:8000 campuseats-backend

# Or using Uvicorn with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Stripe Webhooks
- Update webhook endpoint URL in Stripe Dashboard
- Use webhook signing secret for production
- Test webhook delivery with Stripe CLI

### Recommended Hosting Platforms

| Service | Recommended Provider | Reason |
|---------|---------------------|--------|
| Frontend | Vercel | Optimized for Next.js, automatic deployments, edge network |
| Backend | Railway / Render | Easy Python deployment, automatic HTTPS, database included |
| Database | Supabase / AWS RDS | Managed PostgreSQL, automatic backups, scaling |
| Storage | Firebase Storage | Already integrated, CDN included, generous free tier |
| Maps | Mapbox | Already integrated, 50k free requests/month |

### Performance Optimization

- Enable Next.js Image Optimization
- Implement Redis caching for frequently accessed data
- Use CDN for static assets
- Enable gzip compression
- Implement lazy loading for images
- Use database query caching

---

## Key Technical Achievements

This project demonstrates mastery of the following concepts:

1. **Full-Stack Development**: Seamless integration between Next.js frontend and FastAPI backend
2. **Geospatial Queries**: Haversine formula implementation with database indexing
3. **Real-Time Authentication**: Firebase integration with custom backend synchronization
4. **Payment Processing**: Stripe Checkout with webhook-driven order creation
5. **State Management**: React Context API for global state without external dependencies
6. **Database Design**: Normalized schema with strategic use of JSONB for flexibility
7. **RESTful API Design**: Proper HTTP methods, status codes, and error handling
8. **Security Best Practices**: Token verification, webhook signature validation, environment variables
9. **Responsive UI/UX**: Mobile-first design with Tailwind CSS and Material-UI
10. **Modern React Patterns**: Hooks, Context, Server Components, Client Components
11. **CI/CD Ready**: Docker containerization for consistent environments
12. **Third-Party Integrations**: Firebase, Stripe, Mapbox, PostgreSQL

---

## Future Enhancements

- [ ] Real-time order tracking with WebSockets
- [ ] Push notifications for order updates
- [ ] Rating and review system for sellers
- [ ] Search filters (price range, cuisine type, dietary restrictions)
- [ ] Meal recommendations based on order history
- [ ] Admin dashboard for platform management
- [ ] Email notifications (order confirmation, status updates)
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) capabilities
- [ ] Social sharing features
- [ ] Seller verification system
- [ ] Integration with campus ID systems

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

For questions or collaboration opportunities:
- GitHub: [Your GitHub Profile]
- LinkedIn: [Your LinkedIn Profile]
- Email: your.email@example.com

---

**Built with passion by [Your Name]**
*Software Engineering Intern Candidate*
