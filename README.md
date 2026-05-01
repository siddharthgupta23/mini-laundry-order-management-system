# Mini Laundry Order Management System

Simple, assignment-focused full-stack project for a dry cleaning store.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Tailwind CSS, Axios

## Final Folder Structure

```text
mini laundry order management system/
  backend/
    config/
    controllers/
    models/
    routes/
    server.js
  frontend/
    src/
      components/
      pages/
      services/
    App.jsx
    index.html
```

## Features Implemented

- Create order with:
  - `customerName`
  - `phoneNumber`
  - `garments[]` (`type`, `quantity`, `pricePerItem`)
- Automatic total bill calculation
- Unique order ID generation
- Default order status = `RECEIVED`
- Status workflow update:
  - `RECEIVED -> PROCESSING -> READY -> DELIVERED`
- View orders list with filters:
  - status
  - customer name (partial)
  - phone number (partial)
- Dashboard data:
  - total orders
  - total revenue
  - orders count per status
- Responsive frontend with:
  - Create Order page
  - Orders List page
  - Dashboard page
  - Loading states and basic validation

## Setup Instructions

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/laundry_assignment
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## API Endpoints

Base URL: `http://localhost:5000/api`

- `POST /orders` - Create order
- `PATCH /orders/:orderId/status` - Update status
- `GET /orders` - List orders with filters
- `GET /dashboard` - Dashboard summary
- `GET /health` - Health check

### Sample Request - Create Order

```json
{
  "customerName": "Amit Verma",
  "phoneNumber": "9876543210",
  "garments": [
    { "type": "Shirt", "quantity": 3, "pricePerItem": 40 },
    { "type": "Pants", "quantity": 2, "pricePerItem": 60 }
  ],
  "estimatedDeliveryDate": "2026-05-05"
}
```

### Sample Response - Dashboard

```json
{
  "totalOrders": 12,
  "totalRevenue": 4860,
  "ordersPerStatus": {
    "RECEIVED": 3,
    "PROCESSING": 4,
    "READY": 2,
    "DELIVERED": 3
  }
}
```

## AI Usage Report

### Tools Used

- Cursor (primary coding assistant)
- ChatGPT (prompt drafting and cleanup ideas)
- Copilot (quick inline suggestions)

### Sample Prompts Used

- "Build a mini laundry order management API with create, update status, list, and dashboard."
- "Simplify this MERN project for assignment scope and remove authentication."
- "Refactor folder structure to backend/frontend only and clean unused files."

### What AI Got Wrong

- Added unnecessary authentication and role logic for this assignment.
- Introduced extra files and docs outside required scope.
- Created frontend complexity not needed for this evaluation.

### What Was Fixed Manually

- Removed auth and protected routes.
- Simplified backend to assignment-required APIs only.
- Reduced frontend to only Dashboard, Orders List, and Create Order pages.
- Cleaned root folder to only `backend` and `frontend`.
- Fixed API/Frontend mismatches and validated final build/run flow.

## Tradeoffs

### Skipped (intentionally)

- No user authentication
- No advanced state management
- No test suite (to keep scope and speed aligned with assignment)
- No complex admin roles or permissions

### If More Time Was Available

- Add unit/integration tests
- Add CSV/PDF invoice export
- Add better notification system
- Add Docker setup for one-command local run
# 🧺 Mini Laundry Order Management System

A lightweight, AI-first order management system for dry cleaning stores. Built in **72 hours** using Node.js, Express, and pure JavaScript frontend with heavy AI assistance.

**Live Demo:** http://localhost:3000 (after setup)

---

## 📋 Table of Contents
- [Features](#-features)
- [Setup Instructions](#-setup-instructions)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [AI Usage Report](#-ai-usage-report)
- [Project Structure](#-project-structure)
- [Tradeoffs & Future Improvements](#-tradeoffs--future-improvements)
- [Demo & Testing](#-demo--testing)

---

## ✨ Features

### Core Features Implemented ✅
1. **Create Orders**
   - Customer name, phone number, garments with quantities
   - Automatic bill calculation based on garment types
   - Unique Order ID generation (ORD-1000, ORD-1001, etc.)
   - Support for 10 garment types with hardcoded pricing

2. **Order Status Management**
   - 4 status types: RECEIVED → PROCESSING → READY → DELIVERED
   - Update status via API or web UI
   - Status change tracking with timestamps

3. **View Orders**
   - List all orders in real-time dashboard
   - Filter by:
     - Customer name (partial match)
     - Phone number
     - Order status

4. **Dashboard Analytics**
   - Total orders count
   - Total revenue calculation
   - Orders breakdown per status
   - Average order value
   - Completed orders count
   - Auto-refreshes every 5 seconds

### Bonus Features ✅
- Simple, responsive HTML/CSS/JS frontend (no framework bloat)
- REST API with proper HTTP methods
- CORS enabled for cross-origin requests
- Health check endpoint
- Delete order functionality
- Comprehensive API documentation (HTML + Postman)
- In-memory storage for quick prototyping

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Clone/Navigate to the project directory**
   ```bash
   cd "d:\mini launaday order management system"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This installs:
   - `express` - Web framework
   - `cors` - Cross-Origin Resource Sharing
   - `uuid` - Unique ID generation

3. **Verify installation**
   ```bash
   npm list
   ```

---

## ▶️ Running the Application

### Start the server
```bash
npm start
```

You should see:
```
✅ Laundry Order Management System running on http://localhost:3000
📊 Dashboard: http://localhost:3000/dashboard
📝 API Documentation: http://localhost:3000/api-docs.html
```

### Development mode (with auto-reload)
```bash
npm run dev
```

### Access the application
- **Web Dashboard:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs.html
- **API Base URL:** http://localhost:3000/api

---

## 📚 API Documentation

### Complete REST API Reference

#### 1. Create Order
```
POST /api/orders
Content-Type: application/json

Request Body:
{
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "garments": [
    { "type": "shirt", "quantity": 2 },
    { "type": "pants", "quantity": 1 }
  ]
}

Response (201 Created):
{
  "id": "ORD-1000",
  "customerId": "uuid",
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "garments": [
    { "type": "shirt", "quantity": 2, "pricePerItem": 50, "total": 100 },
    { "type": "pants", "quantity": 1, "pricePerItem": 80, "total": 80 }
  ],
  "totalBill": 180,
  "status": "RECEIVED",
  "createdAt": "2024-04-28T10:30:00.000Z",
  "updatedAt": "2024-04-28T10:30:00.000Z"
}
```

#### 2. Get All Orders
```
GET /api/orders
GET /api/orders?status=READY
GET /api/orders?customerName=John
GET /api/orders?customerPhone=9876543210

Response (200 OK):
{
  "total": 2,
  "orders": [
    { "id": "ORD-1000", ... },
    { "id": "ORD-1001", ... }
  ]
}
```

#### 3. Get Single Order
```
GET /api/orders/ORD-1000

Response (200 OK):
{ "id": "ORD-1000", ... }

Response (404 Not Found):
{ "error": "Order not found" }
```

#### 4. Update Order Status
```
PATCH /api/orders/ORD-1000/status
Content-Type: application/json

Request Body:
{ "status": "PROCESSING" }

Valid statuses: RECEIVED | PROCESSING | READY | DELIVERED

Response (200 OK):
{ "id": "ORD-1000", "status": "PROCESSING", ... }
```

#### 5. Get Dashboard Data
```
GET /api/dashboard

Response (200 OK):
{
  "totalOrders": 5,
  "totalRevenue": 1250,
  "ordersPerStatus": {
    "RECEIVED": 2,
    "PROCESSING": 1,
    "READY": 1,
    "DELIVERED": 1
  },
  "averageOrderValue": 250,
  "completedOrders": 1
}
```

#### 6. Delete Order
```
DELETE /api/orders/ORD-1000

Response (200 OK):
{ "message": "Order deleted", "order": { ... } }
```

#### 7. Health Check
```
GET /api/health

Response (200 OK):
{ "status": "healthy", "timestamp": "2024-04-28T12:00:00.000Z" }
```

### Garment Pricing Reference
| Garment Type | Price (₹) |
|---|---|
| Shirt | 50 |
| Pants | 80 |
| Saree | 150 |
| Dress | 120 |
| Blazer | 200 |
| Jacket | 250 |
| Skirt | 100 |
| Tie | 40 |
| Kurta | 100 |
| Dupatta | 60 |

---

## 🤖 AI Usage Report

### Overview
This project was built using **ChatGPT/GitHub Copilot** heavily to accelerate development. Below is a detailed breakdown of how AI was leveraged, what it generated correctly, and what required manual fixes.

### AI Tools Used
1. **GitHub Copilot** - Code generation and completion
2. **ChatGPT-4** - Architecture planning and complex logic

---

### Phase 1: Project Setup & Architecture

**AI Prompt 1:** 
> "Create a Node.js Express server for a laundry order management system with these features: create orders, track status, calculate billing, and dashboard analytics. Use in-memory storage. Give me the complete server.js file."

**What AI Generated:** ✅ Almost perfect!
- Express server setup with all endpoints
- In-memory order storage
- Correct HTTP status codes
- Proper middleware configuration
- All CRUD operations

**What I Fixed:** 
- Added `cors` middleware (AI forgot CORS for frontend integration)
- Fixed the order counter to persist across requests (initial version reset)
- Added proper error handling for invalid garment types
- Improved filtering logic (AI's initial filter was case-sensitive)

**Lesson Learned:** AI is excellent at scaffolding but misses integrations. Always check for middleware requirements when building APIs.

---

### Phase 2: Frontend Dashboard UI

**AI Prompt 2:**
> "Create a modern, responsive HTML/CSS/JavaScript dashboard for a laundry order system. Include forms to create orders, real-time tables showing all orders, status filters, a statistics section, and make it look professional but simple. No frameworks."

**What AI Generated:** ✅ Excellent!
- Clean, responsive grid layout
- Proper form handling
- Real-time data fetching with fetch API
- Color-coded status badges
- Interactive order creation form with dynamic garment fields
- Search/filter functionality

**What I Fixed:**
- The garment selection dropdown didn't sync properly with the text input (fixed with event listeners)
- Initial auto-refresh wasn't triggering on page load (added DOMContentLoaded event)
- The form wasn't clearing after successful submission (manually added form.reset())
- Validation logic for empty garment list was missing

**Lesson Learned:** AI generates good UI structure but misses subtle UX improvements like form persistence and validation edge cases.

---

### Phase 3: API Documentation

**AI Prompt 3:**
> "Create comprehensive API documentation in HTML format for a REST API with 7 endpoints. Include request examples, response examples, query parameters, and pricing table. Make it look professional and easy to read."

**What AI Generated:** ✅ Perfect!
- Well-structured HTML documentation
- Color-coded HTTP methods
- Clear request/response examples
- Proper table formatting
- Pricing reference included

**What I Fixed:**
- Added example Order IDs (ORD-1000 format) to make it more concrete
- Clarified that phone filter is exact match vs name filter is partial match
- Added status transition diagram (conceptually documented)

**Lesson Learned:** AI excels at documentation structure. Minor clarifications needed for context-specific details.

---

### Phase 4: Postman Collection

**AI Prompt 4:**
> "Generate a Postman collection JSON for testing a REST API with these 7 endpoints: POST /orders, GET /orders, GET /orders/:id, PATCH /orders/:id/status, GET /dashboard, DELETE /orders/:id, GET /health. Include example requests with sample data."

**What AI Generated:** ✅ 100% functional!
- Valid Postman 2.1 schema
- All endpoints properly formatted
- Sample request bodies
- Query parameters correctly set up
- No issues encountered

**Lesson Learned:** AI is perfect for structured data formats like JSON collections.

---

### Phase 5: Complex Business Logic Issues

**Problem 1: Garment Pricing Logic**
- **Initial Issue:** AI generated a system that allowed custom prices in requests, which was against the requirement for hardcoded pricing
- **AI Generated:** Dynamic price parameter in request
- **What I Changed:** Removed custom pricing, made it lookup-based only with GARMENT_PRICES constant
- **Why:** Security + consistency (prevents accidental price manipulation)

**Problem 2: Filter Logic**
- **Initial Issue:** Filters didn't work together (AND logic was missing)
- **AI Generated:** Individual if statements without combining logic
- **What I Fixed:** Ensured multiple filters work together (e.g., filter by status AND name)
- **Line:** server.js, getOrders() function

**Problem 3: Order ID Uniqueness**
- **Initial Issue:** Used UUID for Order ID, which looks ugly (uuid-1234-5678...)
- **AI Generated:** UUID-based IDs
- **What I Changed:** Sequential ORD-1000, ORD-1001... format
- **Why:** Better UX for store staff, easier to remember and communicate

---

### Phase 6: README Generation

**AI Prompt 5:**
> "Write a comprehensive README for this laundry order management project that includes: setup instructions, features list, API documentation summary, extensive AI usage report explaining what ChatGPT/Copilot generated, what was wrong, and what I fixed, project structure, and future improvements."

**What AI Generated:** ✅ Great structure
- Clear section organization
- Proper markdown formatting
- Good documentation flow

**What I Fixed:**
- Added specific line numbers and code references
- Included actual prompts I used (AI was generic)
- Added detailed before/after comparisons
- Expanded the AI mistakes section with concrete examples
- Added business logic insights

---

## 📁 Project Structure

```
mini-laundry-order-management/
├── package.json                 # Node.js dependencies
├── server.js                    # Express backend with all API endpoints
├── public/
│   ├── index.html              # Main dashboard UI
│   └── api-docs.html           # API documentation
├── Postman_Collection.json     # Postman API testing collection
└── README.md                   # This file
```

### Key Files Explained

**server.js** (250 lines)
- Express application setup
- In-memory order storage
- 7 REST API endpoints
- GARMENT_PRICES constant
- CORS and JSON middleware
- Error handling

**public/index.html** (550 lines)
- Responsive HTML5 dashboard
- Embedded CSS styling (no external files)
- Vanilla JavaScript (no libraries/frameworks)
- Real-time data fetching
- 4 main sections: Stats, Create Order, View Orders, Update Status

---

## 🔄 Workflow & Usage

### Typical Day Flow

1. **Morning:** Manager starts server (`npm start`)
2. **Customer arrives:** 
   - Opens http://localhost:3000
   - Fills "Create New Order" form with items
   - System generates order ID and bill
3. **Processing:** 
   - Update order status as it moves through stages
   - Dashboard auto-updates every 5 seconds
4. **Reporting:**
   - View dashboard analytics
   - Check total revenue
   - See orders per status
5. **Day-end:** 
   - Can export or screenshot dashboard
   - Data persists in memory during runtime

### Testing with Postman

1. **Import the collection:**
   - Open Postman
   - Import → Postman_Collection.json
   - Requests are ready to use

2. **Test workflow:**
   - Create Order (POST)
   - View Orders (GET)
   - Update Status (PATCH)
   - Check Dashboard (GET)

---

## ⚙️ Tradeoffs & Future Improvements

### What We Did NOT Implement (Intentional Tradeoffs)

| Feature | Reason | Effort | Priority |
|---------|--------|--------|----------|
| **Authentication/Login** | Not needed for internal use in one store | Medium | Low |
| **Database (MongoDB/SQL)** | In-memory sufficient for daily operations; no persistence needed for MVP | High | Medium |
| **Advanced Search** | Filters cover 90% of use cases | Low | Low |
| **Estimated Delivery Date** | Wasn't clear if needed; could add in 30 mins | Low | Low |
| **Beautiful React UI** | Time better spent on API; current UI is functional | High | Low |
| **Mobile App** | Web dashboard is responsive enough | Very High | Low |
| **Email/SMS Notifications** | Out of scope for MVP | High | Medium |

### Why These Tradeoffs?
- **Focus on MVP:** Got a working system in 72 hours
- **AI Leverage:** Spent time iterating with AI, not fighting dependencies
- **Simplicity:** Easier to maintain, debug, and extend

### Future Improvements (Priority Order)

**Phase 2 (Next 24 hours):**
1. Add persistent storage (SQLite or JSON file)
   - Why: Data survives server restart
   - Effort: 2 hours
2. Add estimated delivery date calculation
   - Why: Customers will ask
   - Effort: 1 hour
3. Add receipt/bill printing
   - Why: Store needs receipts
   - Effort: 2 hours

**Phase 3 (Next week):**
1. Basic authentication (password-protected login)
2. Admin dashboard (view old orders, analytics)
3. Export to CSV/Excel
4. Barcode/QR code generation for orders

**Phase 4 (Production):**
1. Database migration (PostgreSQL)
2. Docker containerization
3. CI/CD pipeline
4. Mobile app (React Native)
5. Cloud deployment (AWS/Railway)

---

## 🧪 Demo & Testing

### Quick Test Script

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **Create a test order:**
   - Name: "Ramesh Kumar"
   - Phone: "9876543210"
   - Add garments: 2x Shirt, 1x Pants
   - Click "Create Order"
   - Expected: Order ID ORD-1000, Total ₹180

4. **View dashboard:**
   - Check stats update immediately
   - Total Orders: 1
   - Total Revenue: ₹180

5. **Update status:**
   - Order ID: ORD-1000
   - New Status: PROCESSING
   - Click Update
   - Expected: Status badge changes

6. **Test API directly:**
   ```bash
   # Create order
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "Test User",
       "customerPhone": "1234567890",
       "garments": [{"type": "shirt", "quantity": 1}]
     }'
   
   # Get all orders
   curl http://localhost:3000/api/orders
   
   # Get dashboard
   curl http://localhost:3000/api/dashboard
   ```

### Testing Results

✅ All 7 endpoints tested and working  
✅ Filters working correctly  
✅ Frontend dashboard responsive  
✅ Real-time stats updating  
✅ Status transitions working  
✅ Error handling functional  

---

## 📊 Statistics

- **Total Development Time:** ~16 hours (actual coding + iterations)
- **Time spent with AI:** ~60% (prompts, refinements, debugging)
- **Lines of Code:** ~900 (frontend HTML/CSS/JS + backend)
- **Endpoints:** 7
- **Supported Garment Types:** 10
- **Browser Compatibility:** All modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🎯 Key Learnings

1. **AI is fastest for scaffolding:** Generated 80% of code, but quality needs checks
2. **Frontend is easier than backend:** AI excelled at UI generation
3. **Business logic needs thinking:** AI can't know your edge cases
4. **Iteration > Perfection:** Built MVP first, then refined
5. **Documentation matters:** Took 2 hours but makes huge difference

---


---

## 🙋 Support

If you encounter issues:

1. **Server won't start:**
   ```bash
   npm install
   npm start
   ```

2. **Port already in use:**
   ```bash
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

3. **CORS errors:**
   - The cors middleware should handle this
   - Check that API is on localhost:3000

4. **Orders not showing:**
   - Make sure server is running
   - Check browser console for errors (F12)
   - Try refreshing page

---

**Built with ❤️ using AI assistance | 2024**
