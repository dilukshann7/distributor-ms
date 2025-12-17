# API Routes Documentation

This directory contains the refactored API routes for the distributor management system.

## Directory Structure

```
api/
├── Server.js                      # Main server file (clean and minimal)
├── SessionHandling.js             # Session middleware configuration
├── utils/
│   └── asyncHandler.js            # Async error handling utility
└── routes/
    ├── auth.routes.js             # Authentication routes
    ├── user.routes.js             # User management routes
    ├── product.routes.js          # Product CRUD routes
    ├── order.routes.js            # Order, sales order, cart routes
    ├── employee.routes.js         # Employee-specific routes
    ├── customer.routes.js         # Customer and feedback routes
    ├── delivery.routes.js         # Delivery management routes
    ├── payment.routes.js          # Payment processing routes
    ├── supply.routes.js           # Supply, shipment, invoice routes
    ├── task.routes.js             # Task management routes
    └── analytics.routes.js        # Analytics and reporting routes
```

## Route Modules

### 1. **auth.routes.js** - Authentication

- `POST /api/login` - User login
- `GET /api/check-auth` - Check authentication status
- `POST /api/logout` - User logout

### 2. **user.routes.js** - User Management

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user with role-specific profile
- `PUT /api/users/:id` - Update user and profile
- `DELETE /api/users/:id` - Delete user

### 3. **product.routes.js** - Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### 4. **order.routes.js** - Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create an order
- `PUT /api/orders/:id` - Update an order
- `GET /api/sales-orders` - Get all sales orders
- `POST /api/sales-orders` - Create a sales order
- `PUT /api/sales-orders/:id` - Update a sales order
- `DELETE /api/sales-orders/:id` - Delete a sales order
- `GET /api/small-orders` - Get all small orders
- `POST /api/small-orders` - Create a small order
- `GET /api/carts` - Get all carts
- `POST /api/carts` - Create a cart
- `PUT /api/carts/:id` - Update a cart

### 5. **employee.routes.js** - Employees

- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver by ID
- `POST /api/drivers` - Create a driver
- `PUT /api/drivers/:id` - Update a driver
- `GET /api/managers` - Get all managers
- `GET /api/managers/:id` - Get manager by ID
- `GET /api/salesmen` - Get all salesmen
- `GET /api/salesmen/:id` - Get salesman by ID
- `GET /api/stock-keepers` - Get all stock keepers
- `GET /api/stock-keepers/:id` - Get stock keeper by ID
- `POST /api/stock-keepers` - Create a stock keeper
- `PUT /api/stock-keepers/:id` - Update a stock keeper
- `GET /api/cashiers` - Get all cashiers
- `GET /api/cashiers/:id` - Get cashier by ID
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `GET /api/distributors` - Get all distributors
- `GET /api/distributors/:id` - Get distributor by ID
- `GET /api/assistant-managers` - Get all assistant managers
- `GET /api/assistant-managers/:id` - Get assistant manager by ID

### 6. **customer.routes.js** - Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a customer
- `DELETE /api/customers/:id` - Delete a customer
- `GET /api/customers/feedbacks` - Get all customer feedbacks
- `POST /api/customers/feedbacks` - Create customer feedback

### 7. **delivery.routes.js** - Deliveries

- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create a delivery
- `PUT /api/deliveries/:id` - Update a delivery

### 8. **payment.routes.js** - Payments

- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create a payment (with transaction)
- `PUT /api/payments/:id` - Update payment status (with transaction)

### 9. **supply.routes.js** - Supply Chain

- `GET /api/supplies` - Get all supplies (supports ?top=N query)
- `POST /api/supplies` - Create a supply
- `PUT /api/supplies/:id` - Update a supply
- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create a shipment
- `PUT /api/shipments/:id` - Update a shipment
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create an invoice
- `GET /api/sales-invoices` - Get all sales invoices
- `GET /api/sales-invoices/driver/:driverId` - Get sales invoices by driver

### 10. **task.routes.js** - Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### 11. **analytics.routes.js** - Analytics & Reports

- `GET /api/orders/daily` - Get daily order statistics
- `GET /api/orders/summary` - Get order summary by status
- `GET /api/shipments/summary` - Get shipment summary by status
- `GET /api/financial-overview` - Get monthly financial overview

## Benefits of This Structure

1. **Modularity**: Each route file handles a specific domain (auth, products, orders, etc.)
2. **Maintainability**: Easy to find and update specific endpoints
3. **Scalability**: Simple to add new routes or modify existing ones
4. **Clean Server.js**: The main server file is now minimal and focused on configuration
5. **Code Reusability**: Shared utilities like `asyncHandler` are centralized
6. **Better Organization**: Related endpoints are grouped together logically

## Adding New Routes

To add new routes:

1. Create a new route file in `api/routes/` (e.g., `newfeature.routes.js`)
2. Import necessary dependencies (Router, PrismaClient, asyncHandler)
3. Define your routes using the router
4. Export the router as default
5. Import and mount the router in `Server.js`

Example:

```javascript
// In api/routes/newfeature.routes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Your logic here
  })
);

export default router;

// In Server.js
import newFeatureRoutes from "./routes/newfeature.routes.js";
app.use("/api/newfeature", newFeatureRoutes);
```
