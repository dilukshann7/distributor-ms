# ADP Namasinghe Distribution Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Express](https://img.shields.io/badge/express-v5.0-blue)
![Prisma](https://img.shields.io/badge/prisma-v6.0-indigo)

> **Academic Project:** This system was developed as the final year project for the first year of the **BSc (Hons) in Software Engineering** at **NIBM**.

A comprehensive **Distribution Management System** designed to streamline operations for ADP Namasinghe. This full-stack application manages the entire supply chain workflow, including inventory tracking, order processing, delivery management, employee oversight, and financial reporting.

## Key Features

- **Role-Based Access Control (RBAC):** Secure login and distinct dashboards for various roles:
  - **Management:** Owner, Manager, Assistant Manager
  - **Operations:** Distributor, Salesman, Cashier
  - **Logistics & Supply:** Stock Keeper, Driver, Supplier
- **Inventory & Stock Management:** Real-time tracking of stock levels, receiving shipments, and stock availability reports.
- **Order Management:** Complete lifecycle management from order authorization to processing and invoicing.
- **Logistics & Delivery:** Delivery route planning, driver management, and proof of delivery tracking.
- **Financials:** Invoicing, payment collection, supplier payments, and sales reports.
- **Employee Management:** Employee oversight, task assignment, and performance monitoring.
- **Analytics & Reporting:** Detailed analytics for sales, operations, and customer feedback with PDF export capabilities.

## Technical Architecture

This project follows a **Monolithic Architecture** with a clear separation of concerns between the frontend view layer and backend API services.

### Backend (Node.js & Express)

- **API Design:** RESTful API architecture serving JSON data to the client.
- **Database Access:** Uses **Prisma ORM** for type-safe database queries against a relational database (PostgreSQL).
- **Session Management:** Implements stateful sessions using `express-session` backed by a database store (`@quixo3/prisma-session-store`) for persistence across server restarts.
- **Routing:** Modularized route handlers (e.g., `auth.routes.js`, `order.routes.js`) to organize API logic.

### Frontend (Vanilla JS & Lit)

- **Single Page Application (SPA):** Uses a custom client-side router (`router.js`) using the History API to manage navigation without page reloads.
- **Component-Based:** Utilizes **Lit** libraries for lightweight, efficient web components.
- **Styling:** Styled with **Tailwind CSS** for a responsive and modern design system.
- **Dynamic Rendering:** Dashboards and views are lazily loaded based on the authenticated user's role.

### Security & Data

- **Authentication:** Session-based authentication flow.
- **Authorization:** Middleware checks verify user roles before granting access to specific API endpoints and frontend routes.
- **Data Integrity:** Foreign key constraints and transaction management ensure data consistency across complex supply chain operations.

## Tech Stack

**Backend:**

- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **ORM:** Prisma
- **Session Store:** Prisma Session Store

**Frontend:**

- **Core:** HTML5, JavaScript (ES6+)
- **UI Framework:** Tailwind CSS
- **Component Library:** Lit
- **Build Tool:** Webpack

**Utilities:**

- **PDF Generation:** jsPDF & jsPDF-AutoTable
- **HTTP Client:** Axios

## Project Structure

```
distributor-ms/
├── api/                # Backend Application
│   ├── routes/         # REST API Route Definitions
│   ├── utils/          # Backend Utilities (Async handlers, etc.)
│   └── server.js       # Entry point & Express configuration
├── src/                # Frontend Application
│   ├── assets/         # Static Assets (Images, Icons)
│   ├── css/            # Tailwind imports & Custom styles
│   ├── js/             # Client-side Logic
│   │   ├── classes/    # Business Logic & Dashboard Renderers
│   │   ├── components/ # Reusable UI Components
│   │   ├── middleware/ # Client-side Router
│   │   ├── models/     # Data Models
│   │   └── index.js    # Frontend Entry Point
│   └── index.html      # Main HTML Template
├── prisma/             # Database Schema & Migrations
└── ...config files     # Configuration (Tailwind, Webpack, etc.)
```

## Installation & Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/dilukshann7/distributor-ms.git
    cd distributor-ms
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure your environment variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/distributor_db"
    SESSION_SECRET="your_secure_random_string"
    PORT=3000
    ```

4.  **Database Setup:**
    Apply Prisma migrations to create the database schema:

    ```bash
    npx prisma migrate dev
    ```

5.  **Build Frontend:**
    Compile the frontend assets using Webpack:

    ```bash
    npm run build
    ```

6.  **Run the Server:**
    Start the application:
    ```bash
    npm run server
    ```
    _For development with hot-reloading:_
    ```bash
    npm run dev
    ```

## API Endpoints Overview

The API is structured under `/api` with the following main resources:

- **Auth:** `/api/auth` (Login, Logout, Session Check)
- **Core Entities:** `/api/users`, `/api/products`, `/api/orders`
- **Operations:** `/api/deliveries`, `/api/tasks`, `/api/supplies`
- **Finance:** `/api/payments`, `/api/analytics`

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the `package.json` file for details.

## Authors

- Dilukshan Niranjan
- Melisha Devaraj
- Pabodhini Tharaka Perera
- Anjana Dulan Wijerathna
