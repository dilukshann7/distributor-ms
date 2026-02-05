# 📚 Super Simple Project Documentation - Distributor Management System

> **For Complete Beginners**: This guide explains everything in the simplest way possible, like you're learning it for the first time!

## Table of Contents
1. [🎯 What is This Project? (ELI5)](#-what-is-this-project-eli5)
2. [🏗️ The Big Picture - How Everything Works Together](#️-the-big-picture---how-everything-works-together)
3. [💻 Technologies Used (Simple Explanations)](#-technologies-used-simple-explanations)
4. [📁 All Files Explained (What Each File Does)](#-all-files-explained-what-each-file-does)
5. [🗄️ Database Explained (Where We Store Information)](#️-database-explained-where-we-store-information)
6. [🔄 How Data Moves (Step by Step Examples)](#-how-data-moves-step-by-step-examples)
7. [🎨 Frontend Explained (The Pretty Part You See)](#-frontend-explained-the-pretty-part-you-see)
8. [⚙️ Backend Explained (The Smart Part Behind the Scenes)](#️-backend-explained-the-smart-part-behind-the-scenes)
9. [🔐 Login & Security (How We Know It's Really You)](#-login--security-how-we-know-its-really-you)
10. [✨ Cool Features This Project Has](#-cool-features-this-project-has)
11. [🚀 How to Run This on Your Computer](#-how-to-run-this-on-your-computer)
12. [🌍 How to Put This on the Internet](#-how-to-put-this-on-the-internet)

---

## 🎯 What is This Project? (ELI5)

### Imagine This...
You know how Amazon tracks packages, manages warehouses, and delivers products? This project does something similar but for a **distribution company** (a business that buys products in bulk and sells them to stores/customers).

### What Problem Does It Solve?
Before this system, the company had to:
- ❌ Track inventory with pen and paper (messy!)
- ❌ Call drivers to check delivery status (time-consuming!)
- ❌ Manually calculate payments and invoices (lots of mistakes!)
- ❌ Not know which products sell best (guessing!)

### After Using This System:
- ✅ Track every product on the computer (organized!)
- ✅ See exactly where drivers are and what they're delivering (real-time!)
- ✅ Automatically calculate everything (accurate!)
- ✅ See reports showing what's selling best (smart decisions!)

### Who Uses This System?
**10 Different Types of Users**, each sees a different screen:

1. **👑 Owner** - The boss. Sees everything, makes big decisions
2. **👔 Manager** - Manages daily operations, approves orders
3. **🧑‍💼 Assistant Manager** - Helps the manager
4. **📦 Stock Keeper** - Manages warehouse inventory
5. **💰 Cashier** - Handles money and payments
6. **🚚 Driver** - Delivers products to customers
7. **💼 Salesman** - Takes orders from customers
8. **📊 Distributor** - Distributes products to different areas
9. **🏭 Supplier** - Companies that provide products to restock
10. **👥 Customer** - People/businesses buying products

### Real World Example:
**Scenario**: A store wants to buy 100 bottles of Coca-Cola

1. **Salesman** creates the order in the system
2. **Stock Keeper** checks if we have 100 bottles
3. **Manager** approves the order
4. **Driver** gets notification to deliver
5. **Customer** receives the products
6. **Cashier** collects payment
7. **Owner** sees the profit in the dashboard

All of this happens through this ONE system! 🎉

---

## 🏗️ The Big Picture - How Everything Works Together

### Think of it Like a Restaurant 🍽️

**Frontend (The Dining Area):**
- This is what customers see
- Pretty menus, tables, decorations
- Waiters take your order here
- **In our project**: The website you see in your browser

**Backend (The Kitchen):**
- This is where the magic happens
- Chefs cook the food
- No customers allowed here
- **In our project**: The server that processes everything

**Database (The Storage Room):**
- Where all ingredients are stored
- Keeps track of what you have
- Organized in shelves and boxes
- **In our project**: Where all data is saved (users, orders, products)

### How They Talk to Each Other:

```
┌─────────────────────┐
│   YOUR BROWSER      │  ← You see a beautiful website
│   (Frontend)        │    Click buttons, fill forms
└──────────┬──────────┘
           │
           │ "Hey server, I need order data!"
           │ (HTTP Request)
           ▼
┌─────────────────────┐
│   SERVER            │  ← Receives request
│   (Backend)         │    Does calculations
└──────────┬──────────┘    Checks if user is allowed
           │
           │ "Give me orders from database!"
           │ (Query)
           ▼
┌─────────────────────┐
│   DATABASE          │  ← Sends back data
│   (PostgreSQL)      │    Orders, users, products, etc.
└──────────┬──────────┘
           │
           │ Orders data goes back
           ▼
┌─────────────────────┐
│   SERVER            │  ← Formats the data nicely
│   (Backend)         │    Sends back to browser
└──────────┬──────────┘
           │
           │ "Here's your orders!"
           │ (HTTP Response)
           ▼
┌─────────────────────┐
│   YOUR BROWSER      │  ← Shows the orders on screen!
│   (Frontend)        │    You see a nice table
└─────────────────────┘
```

**Simple Analogy:**
- **Browser** = You asking for food
- **Server** = Waiter taking your order to kitchen
- **Database** = Kitchen storing and preparing food
- Data flows: You → Waiter → Kitchen → Waiter → You (with food!)

---

## 💻 Technologies Used (Simple Explanations)

### 🔧 Backend Technologies (Behind the Scenes)

#### 1. **Node.js** 🟢
**What it is**: Lets you run JavaScript outside the browser (on a computer/server)

**Why we use it**: 
- Same language (JavaScript) for both website and server = easier!
- Fast and popular
- Lots of helpful libraries

**Real-life comparison**: Like having one translator who speaks both English and Spanish, instead of needing two different translators.

---

#### 2. **Express.js** 🚂
**What it is**: A tool that makes building a server super easy

**Why we use it**:
- Handles website requests (like when you click "Submit")
- Organizes our code neatly
- Makes routing simple (routing = deciding what happens when someone visits /login or /orders)

**Real-life comparison**: Like a receptionist who directs people to different rooms in a building.

**Example**:
```javascript
// When someone visits /hello, show "Hello World!"
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});
```

---

#### 3. **Prisma** 🔷
**What it is**: Helps us talk to the database without writing complex SQL

**Why we use it**:
- Instead of writing confusing SQL commands, we write simple JavaScript
- Prevents typos and errors
- Auto-generates helpful code

**Real-life comparison**: Like using Google Translate instead of learning a new language from scratch.

**Example**:
```javascript
// Get user with email
const user = await prisma.user.findUnique({ 
  where: { email: 'john@example.com' } 
});

// Without Prisma, you'd write:
// SELECT * FROM users WHERE email = 'john@example.com';
```

---

#### 4. **PostgreSQL** 🐘
**What it is**: A database (like a super organized Excel spreadsheet)

**Why we use it**:
- Stores ALL our data (users, orders, products)
- Very reliable (won't lose your data)
- Handles thousands of records easily
- Free to use!

**Real-life comparison**: Like a giant filing cabinet with perfectly organized folders.

**What it stores**:
- 👤 Users (name, email, password)
- 📦 Products (name, price, quantity)
- 📋 Orders (who ordered, what they ordered)
- 🚚 Deliveries (where, when, who's delivering)

---

#### 5. **Express-Session** 🍪
**What it is**: Remembers who's logged in

**Why we use it**:
- You don't have to login on every page
- Keeps you logged in even if you refresh the page
- Secure (others can't pretend to be you)

**Real-life comparison**: Like getting a hand stamp at an amusement park so you don't need to buy a new ticket for every ride.

---

### 🎨 Frontend Technologies (The Pretty Part)

#### 1. **HTML & JavaScript** 📝
**What it is**: The building blocks of websites

**Why we use it**:
- HTML = Structure (like the skeleton)
- JavaScript = Behavior (makes things move and react)
- No complicated frameworks = easier to understand

**Real-life comparison**: 
- HTML = Blueprint of a house
- CSS = Paint and decorations
- JavaScript = Electricity and plumbing

---

#### 2. **Tailwind CSS** 🎨
**What it is**: Pre-made styling classes to make things look pretty FAST

**Why we use it**:
- No need to write custom CSS (cascading style sheets)
- Just add classes like `bg-blue-500` for blue background
- Consistent design everywhere

**Real-life comparison**: Like having a box of LEGO pieces instead of carving each piece from wood.

**Example**:
```html
<!-- Old way (writing custom CSS) -->
<style>
  .my-button {
    background-color: blue;
    color: white;
    padding: 10px;
    border-radius: 5px;
  }
</style>
<button class="my-button">Click Me</button>

<!-- Tailwind way (use pre-made classes) -->
<button class="bg-blue-500 text-white p-4 rounded">Click Me</button>
```

---

#### 3. **Webpack** 📦
**What it is**: Combines all your code files into one neat package

**Why we use it**:
- Bundles 100 files into 1 file = faster loading
- Minifies code (removes spaces) = smaller file size
- Hot reload = see changes instantly while coding

**Real-life comparison**: Like packing your clothes into a suitcase instead of carrying each item separately.

---

#### 4. **Lit** ✨
**What it is**: Helps create reusable website components

**Why we use it**:
- Create components once, use them everywhere
- Super lightweight (tiny file size)
- Modern and fast

**Real-life comparison**: Like having Tupperware containers you can reuse, instead of using plastic wrap every time.

---

#### 5. **Axios** 📡
**What it is**: Makes it easy to send requests to the server

**Why we use it**:
- Simpler than built-in `fetch`
- Better error messages
- Automatically converts data to JSON

**Real-life comparison**: Like having a phone with speed dial instead of typing the full number every time.

**Example**:
```javascript
// Get orders from server
const response = await axios.get('/api/orders');
console.log(response.data); // Your orders!
```

---

### 🛠️ Helper Tools

#### 1. **jsPDF** 📄
**What it does**: Creates PDF files in the browser
**Why**: So users can download reports as PDF files

#### 2. **bcrypt** 🔒
**What it does**: Scrambles passwords so hackers can't read them
**Why**: Security! Never store passwords as plain text

#### 3. **dotenv** 🔐
**What it does**: Keeps secret keys in a separate file
**Why**: Don't put passwords in your code!

#### 4. **CORS** 🌐
**What it does**: Allows browser to talk to server
**Why**: Security feature - browsers block requests by default

---

## 📁 All Files Explained (What Each File Does)

### 🌳 Project Structure (Like a Family Tree)

```
distributor-ms/                    ← Main folder (the house)
│
├── 📄 package.json                ← Shopping list (what packages we need)
├── 📄 .env                        ← Secret passwords (NEVER share this!)
├── 📄 webpack.config.js           ← Instructions for bundling files
├── 📄 tailwind.config.js          ← Styling rules
├── 📄 README.md                   ← Quick project info
│
├── 📁 src/                        ← FRONTEND (what you see)
│   ├── 📄 index.html              ← The main HTML page
│   ├── 📄 index.js                ← Starting point (loads everything)
│   │
│   ├── 📁 css/                    ← All styling files
│   │   ├── style.css              ← Global styles (for everyone)
│   │   ├── owner-style.css        ← Owner's special styles
│   │   ├── manager-style.css      ← Manager's special styles
│   │   └── ...                    ← (one for each role)
│   │
│   ├── 📁 js/                     ← All JavaScript code
│   │   ├── 📄 login.js            ← Login page
│   │   ├── 📄 404.js              ← "Page not found" error
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── router.js          ← 🚦 Decides which page to show
│   │   │
│   │   ├── 📁 classes/            ← Dashboards for each role
│   │   │   ├── owner.js           ← Owner's dashboard
│   │   │   ├── manager.js         ← Manager's dashboard
│   │   │   ├── driver.js          ← Driver's dashboard
│   │   │   └── ...                ← (one file per role)
│   │   │
│   │   ├── 📁 components/         ← Reusable UI pieces
│   │   │   └── NotificationPanel.js
│   │   │
│   │   └── 📁 utils/              ← Helper functions
│   │       ├── reportUtils.js
│   │       └── pdfReportTemplate.js
│   │
│   └── 📁 assets/                 ← Images, logos, icons
│
├── 📁 api/                        ← BACKEND (the brain)
│   ├── 📄 server.js               ← 🧠 Main server file (MOST IMPORTANT)
│   ├── 📄 SessionHandling.js      ← Handles login sessions
│   │
│   ├── 📁 routes/                 ← All API endpoints
│   │   ├── auth.routes.js         ← Login/logout
│   │   ├── user.routes.js         ← User management
│   │   ├── product.routes.js      ← Product management
│   │   ├── order.routes.js        ← Order management
│   │   ├── delivery.routes.js     ← Delivery management
│   │   ├── payment.routes.js      ← Payment management
│   │   └── ...                    ← (15+ route files)
│   │
│   └── 📁 utils/                  ← Helper functions
│       └── asyncHandler.js        ← Error handling helper
│
└── 📁 prisma/                     ← DATABASE stuff
    ├── 📄 schema.prisma           ← 🗄️ Database blueprint
    ├── 📄 seed.js                 ← Sample data for testing
    └── 📁 migrations/             ← Database version history
```

---

### 📄 Important Files Explained (One by One)

#### **1. package.json** (The Shopping List)
**What it does**: Lists all the packages (libraries) our project needs

**Think of it like**: A grocery list before going shopping
- You write down what you need
- npm goes to the store and gets everything
- Keeps track of versions (like "buy version 2.0 of milk")

**Important commands inside**:
```json
"scripts": {
  "dev": "Start development server",
  "build": "Create production version",
  "server": "Start backend server"
}
```

**How to use**: Run `npm install` to get everything on the list!

---

#### **2. .env** (The Secret File) 🔐
**What it does**: Stores passwords and secret keys

**Think of it like**: Your diary with a lock on it
- Database password
- Secret key for sessions
- API keys

**Example**:
```
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
SESSION_SECRET=super-secret-random-string-here
```

**⚠️ IMPORTANT**: NEVER upload this to GitHub! It's in `.gitignore` for safety.

---

#### **3. src/index.html** (The Main Page)
**What it does**: The only HTML file in the entire project!

**Think of it like**: An empty picture frame
- Just has a `<div id="app">` tag
- JavaScript fills in everything else
- This is called a "Single Page Application" (SPA)

**Why only one HTML file?**
- Everything updates dynamically (no page reloads!)
- Faster navigation
- Modern web app style

---

#### **4. src/index.js** (The Starting Point)
**What it does**: First JavaScript file that runs

**Think of it like**: Turning on a light switch
- Imports all CSS files
- Starts the router
- Gets everything ready

**Actual code**:
```javascript
import "./css/style.css";        // Load all styles
import { router } from "./js/middleware/router.js";  // Load router

window.addEventListener("DOMContentLoaded", router);  // Start when page loads!
```

---

#### **5. src/js/middleware/router.js** (The Traffic Controller) 🚦
**What it does**: Decides which dashboard to show based on:
- Are you logged in?
- What's your role?

**Think of it like**: A security guard at a building
- Checks your ID badge (are you logged in?)
- Sends you to the right floor (your dashboard)

**Flow**:
```
User visits website
    ↓
Router checks: Are they logged in?
    ↓
NO → Show login page
YES → Check their role (Owner? Manager? Driver?)
    ↓
Show correct dashboard for their role
```

---

#### **6. src/js/classes/owner.js** (Owner Dashboard)
**What it does**: Creates the Owner's dashboard page

**Think of it like**: Designing a room for the owner
- Fetches data from server (orders, users, sales)
- Creates HTML to display everything nicely
- Adds buttons that do things when clicked

**Pattern** (same for all role files):
```javascript
export async function renderOwnerDashboard(container) {
  // 1. Get data from server
  const data = await fetch('/api/analytics').then(r => r.json());
  
  // 2. Create HTML
  const html = `<h1>Welcome, Owner!</h1>
                <p>Total Sales: $${data.totalSales}</p>`;
  
  // 3. Put HTML on the page
  container.innerHTML = html;
  
  // 4. Make buttons work
  document.querySelector('#someButton').addEventListener('click', doSomething);
}
```

---

#### **7. api/server.js** (The Heart of the Backend) ❤️
**What it does**: The MAIN server file - everything starts here!

**Think of it like**: The manager of a restaurant
- Receives all orders (requests)
- Delegates to different chefs (route handlers)
- Sends back the food (responses)

**What it sets up**:
```javascript
import express from 'express';
const app = express();

// 1. Middleware (helpers that run before every request)
app.use(express.json());        // Understand JSON data
app.use(sessionMiddleware);     // Handle login sessions

// 2. Routes (connect URLs to code)
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
// ... more routes

// 3. Start listening for requests
app.listen(3000, () => {
  console.log('Server running on port 3000!');
});
```

---

#### **8. api/routes/auth.routes.js** (Login System)
**What it does**: Handles login, logout, checking if you're logged in

**Think of it like**: The bouncer at a club
- Checks if your username/password is correct
- Lets you in if valid
- Remembers you so you don't have to show ID again

**Main endpoints**:
```javascript
POST /api/login     → "Let me in!" (checks credentials)
GET /api/check-auth → "Am I still logged in?" (checks session)
POST /api/logout    → "I'm leaving" (destroys session)
```

---

#### **9. api/routes/order.routes.js** (Order Management)
**What it does**: Everything related to orders

**Think of it like**: An order clerk
- Create new orders
- View existing orders
- Update order status
- Delete orders

**Main endpoints**:
```javascript
GET /api/orders          → Get all orders
GET /api/orders/:id      → Get one specific order
POST /api/orders         → Create new order
PUT /api/orders/:id      → Update an order
DELETE /api/orders/:id   → Delete an order
```

---

#### **10. prisma/schema.prisma** (Database Blueprint) 🗺️
**What it does**: Defines EVERYTHING in the database

**Think of it like**: An architect's blueprint for a building
- What tables exist (User, Product, Order, etc.)
- What fields each table has (name, email, price, etc.)
- How tables connect to each other (User has many Orders)

**Example**:
```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  role     String
  
  orders Order[]   // One user can have many orders
}

model Order {
  id          Int    @id @default(autoincrement())
  userId      Int
  totalAmount Float
  status      String
  
  user User @relation(fields: [userId], references: [id])
}
```

**How to use**:
- Edit this file when you want to add/change database structure
- Run `npx prisma migrate dev` to update the database
- Run `npx prisma generate` to create helper code

---

## 🗄️ Database Explained (Where We Store Information)

### What is a Database?

**Think of it like**: A super organized filing cabinet
- Each drawer = a table (Users, Products, Orders)
- Each folder in a drawer = a row (one user, one product)
- Each label on a folder = a field (name, price, email)

### Our Database Has 20 Tables (Types of Data)

```
📊 DATABASE TABLES
│
├── 👤 USER TABLES (Who's in the system)
│   ├── User (everyone's basic info)
│   ├── Owner (boss profile)
│   ├── Manager (manager profile)
│   ├── Driver (driver profile + vehicle info)
│   ├── Salesman (salesman profile + sales target)
│   ├── Cashier (cashier profile)
│   ├── StockKeeper (stock keeper profile)
│   ├── Supplier (supplier profile)
│   ├── Distributor (distributor profile)
│   └── AssistantManager (assistant manager profile)
│
├── 📦 PRODUCT TABLES (What we sell)
│   ├── Product (items in warehouse)
│   └── Supply (raw materials from suppliers)
│
├── 📋 ORDER TABLES (Buying and selling)
│   ├── Order (base order info)
│   ├── SalesOrder (orders from customers)
│   ├── PurchaseOrder (orders to suppliers)
│   └── RetailOrder (walk-in customer orders)
│
├── 🧾 INVOICE TABLES (Money tracking)
│   ├── Invoice (base invoice info)
│   ├── SalesInvoice (bills for customers)
│   ├── PurchaseInvoice (bills from suppliers)
│   └── Payment (payment records)
│
├── 🚚 LOGISTICS TABLES (Moving stuff)
│   ├── Delivery (outgoing deliveries)
│   └── Shipment (incoming shipments)
│
└── 👥 OTHER TABLES
    ├── Customer (customer info)
    ├── Task (todo items for employees)
    ├── Cart (shopping cart for retail)
    └── CustomerFeedback (reviews)
```

---

### Simple Examples of Each Table

#### **👤 User Table** (Everyone in the System)
Stores basic info for ALL users:

| id | name | email | password | role | phone |
|----|------|-------|----------|------|-------|
| 1 | John | john@mail.com | ••••• | owner | 555-0001 |
| 2 | Sarah | sarah@mail.com | ••••• | driver | 555-0002 |
| 3 | Mike | mike@mail.com | ••••• | salesman | 555-0003 |

**Fields**:
- `id`: Unique number for each user
- `name`: Person's name
- `email`: Used for login (must be unique!)
- `password`: Secret password (scrambled for security)
- `role`: What job they do (owner, driver, cashier, etc.)
- `phone`: Contact number
- `address`: Where they live

---

#### **🚗 Driver Table** (Extra Info for Drivers)
Connected to User table - stores driver-specific info:

| id | userId | vehicleId | licenseNumber | salary |
|----|--------|-----------|---------------|--------|
| 1 | 2 | VAN-001 | DL123456 | 50000 |

**Why separate from User?**
- Not everyone needs vehicle info (only drivers!)
- Keeps User table clean and simple
- One User → One Driver (one-to-one relationship)

---

#### **📦 Product Table** (Things We Sell)

| id | name | sku | price | quantity | category |
|----|------|-----|-------|----------|----------|
| 1 | Coca Cola 1L | CC-1L-001 | 120 | 500 | Beverages |
| 2 | Pepsi 1.5L | PP-1.5L-002 | 150 | 300 | Beverages |
| 3 | Bread | BR-001 | 80 | 200 | Food |

**Fields**:
- `id`: Unique product number
- `name`: Product name
- `sku`: Stock Keeping Unit (like a barcode)
- `price`: How much it costs
- `quantity`: How many we have in stock
- `category`: What type of product (Beverages, Food, etc.)

---

#### **📋 Order Table** (Customer Orders)

| id | orderNumber | customerId | totalAmount | status | orderDate |
|----|-------------|------------|-------------|--------|-----------|
| 1 | ORD-2024-001 | 5 | 50000 | delivered | 2024-01-15 |
| 2 | ORD-2024-002 | 3 | 25000 | pending | 2024-01-16 |

**Fields**:
- `id`: Unique order number
- `orderNumber`: Human-readable order ID
- `customerId`: Who ordered (links to Customer table)
- `totalAmount`: Total price
- `status`: pending, processing, delivered, completed
- `orderDate`: When they ordered
- `items`: List of products ordered (stored as JSON)

---

#### **🧾 Payment Table** (Money Received)

| id | salesOrderId | amount | paymentDate | paymentMethod | status |
|----|--------------|--------|-------------|---------------|--------|
| 1 | 10 | 50000 | 2024-01-16 | cash | completed |
| 2 | 11 | 25000 | 2024-01-17 | bank_transfer | completed |

---

### How Tables Connect (Relationships)

**Example**: A customer makes an order

```
┌──────────┐         ┌──────────┐         ┌───────────┐
│ Customer │────┐    │  Order   │────┐    │  Product  │
│          │    │    │          │    │    │           │
│ id: 5    │    └───→│ id: 100  │    └───→│ id: 1     │
│ name:    │         │ customer │         │ name:     │
│ "Shop A" │         │ Id: 5    │         │ Coca Cola │
└──────────┘         └──────────┘         └───────────┘

Customer #5 placed Order #100 which includes Product #1
```

**Relationships**:
1. **One-to-Many**: One Customer → Many Orders
2. **One-to-Many**: One Order → Many Products
3. **One-to-One**: One User → One Driver profile

---

### Fun Analogy for Database 🎪

**Imagine a School**:
- **User table** = List of ALL people (students, teachers, principal)
- **Teacher table** = Extra info only for teachers (subjects they teach)
- **Student table** = Extra info only for students (grade, class)
- **Class table** = Courses offered
- **Enrollment table** = Who's taking which class

When a student enrolls in a class:
1. Find the student in Student table
2. Find the class in Class table  
3. Create a link in Enrollment table

**Same in our project**:
When a customer creates an order:
1. Find customer in Customer table
2. Find products in Product table
3. Create new row in Order table (with links to customer & products)

---

## 🔄 How Data Moves (Step by Step Examples)

### Story 1: A Customer Logs In 🔐

**Step 1**: Customer opens website `http://localhost:8080`

```
Browser → Downloads index.html
       → Runs index.js
       → Router starts
```

**Step 2**: Router checks "Is user logged in?"

```
Browser → Sends request to: GET /api/check-auth
Server  → Checks database for session
        → Session not found!
Server  → Responds: { isAuth: false }
Browser → Shows login page
```

**Step 3**: User enters email & password, clicks "Login"

```
Browser → Collects form data:
          { email: "john@example.com", password: "12345" }
       → Sends: POST /api/login

Server  → Searches database for user with that email
        → Found user!
        → Checks if password matches
        → Password correct! ✅
        → Creates session in database
        → Sends cookie to browser
        → Responds: Redirect to /owner

Browser → Saves cookie automatically
        → Navigates to /owner dashboard
        → Sends GET /api/check-auth (with cookie)
        
Server  → Reads cookie
        → Finds session in database
        → User IS logged in!
        → Responds: { isAuth: true, user: { role: "owner" } }

Browser → Shows owner dashboard
```

**Simple Version**:
1. You type email/password → Click login
2. Server checks if correct → Yes!
3. Server remembers you (session + cookie)
4. Browser shows your dashboard
5. Next time you visit → Server remembers you!

---

### Story 2: Salesman Creates an Order 📋

**Step 1**: Salesman opens "Create Order" page

```
Browser → Loads salesman dashboard
        → Sends: GET /api/customers (get all customers)
        → Sends: GET /api/products (get all products)

Server  → Queries database:
          - Customers table
          - Products table
        → Responds with lists

Browser → Shows dropdowns with customers & products
```

**Step 2**: Salesman fills the order form

```
Customer selected: "ABC Store" (id: 10)
Products added:
  - Coca Cola 1L × 100 bottles = $12,000
  - Pepsi 1.5L × 50 bottles = $7,500
  Total = $19,500

Delivery address: "123 Main Street"
Clicks "Create Order" button
```

**Step 3**: Browser sends order to server

```
Browser → Sends: POST /api/sales-orders
          Body: {
            customerId: 10,
            items: [
              { productId: 1, quantity: 100, price: 12000 },
              { productId: 2, quantity: 50, price: 7500 }
            ],
            totalAmount: 19500,
            deliveryAddress: "123 Main Street"
          }

Server  → Receives request
        → Checks if salesman is logged in ✅
        → Validates data:
          - Does customer exist? ✅
          - Do we have enough stock? ✅
```

**Step 4**: Server creates order in database

```
Server → Starts transaction (all-or-nothing):

Step 4a: Create Order
INSERT INTO Order VALUES (
  orderNumber: "ORD-2024-001",
  orderType: "sales",
  totalAmount: 19500,
  status: "pending"
)
→ Gets order ID: 100

Step 4b: Create SalesOrder
INSERT INTO SalesOrder VALUES (
  orderId: 100,
  customerId: 10,
  paymentStatus: "unpaid"
)

Step 4c: Reduce stock
UPDATE Product SET quantity = quantity - 100 WHERE id = 1
UPDATE Product SET quantity = quantity - 50 WHERE id = 2

→ Commit transaction (save everything!)

Server → Responds: { success: true, orderId: 100 }
```

**Step 5**: Browser shows success message

```
Browser → Receives response
        → Shows: "Order created successfully! Order #100"
        → Refreshes order list
```

**Simple Version**:
1. Salesman picks customer and products
2. Clicks "Create Order"
3. Data goes to server
4. Server saves to database (Order + reduce stock)
5. Browser shows "Success!"

---

### Story 3: Driver Delivers Order 🚚

**Step 1**: Driver opens app

```
Browser → Sends: GET /api/deliveries?driverId=5&status=pending
Server  → Queries database for deliveries assigned to driver #5
        → Finds 3 pending deliveries
        → Responds with list

Browser → Shows list:
          [1] Order #100 → ABC Store, 123 Main St
          [2] Order #101 → XYZ Shop, 456 Oak Ave
          [3] Order #102 → QRS Mart, 789 Elm Rd
```

**Step 2**: Driver delivers to first location

```
Driver clicks: "Mark as Delivered" for Order #100

Browser → Sends: PUT /api/deliveries/20
          Body: {
            status: "delivered",
            deliveredDate: "2024-01-15 14:30:00"
          }

Server  → Updates database:
          UPDATE Delivery SET 
            status = "delivered",
            deliveredDate = "2024-01-15 14:30:00"
          WHERE id = 20

        → Also updates related SalesOrder:
          UPDATE SalesOrder SET 
            paymentStatus = "pending"
          WHERE deliveryId = 20

        → Responds: { success: true }

Browser → Removes delivery from "pending" list
        → Shows: "Delivery marked as complete! ✅"
```

**Simple Version**:
1. Driver sees list of deliveries
2. Goes to location → delivers products
3. Marks as "Delivered" in app
4. Database updates status
5. Delivery disappears from pending list

---

### Story 4: Manager Views Reports 📊

**Step 1**: Manager clicks "Analytics"

```
Browser → Sends multiple requests at once:
          GET /api/analytics/sales?period=month
          GET /api/analytics/top-products
          GET /api/analytics/delivery-stats
```

**Step 2**: Server calculates statistics

```
Server (for sales):
→ Queries database:
  SELECT SUM(totalAmount) as totalSales,
         COUNT(*) as orderCount
  FROM Order
  WHERE orderDate >= '2024-01-01'
  AND orderDate <= '2024-01-31'

→ Result: { totalSales: 500000, orderCount: 45 }
→ Responds with JSON

Server (for top products):
→ Complex query counting products in orders
→ Result: [
    { product: "Coca Cola", sold: 5000 },
    { product: "Pepsi", sold: 3500 }
  ]

Server (for deliveries):
→ Calculates average delivery time
→ Counts on-time vs late deliveries
→ Result: { avgTime: 45, onTimePercent: 92 }
```

**Step 3**: Browser creates charts

```
Browser → Receives all data
        → Uses Chart.js library to create graphs:
          - Bar chart for sales
          - Pie chart for top products
          - Line chart for delivery performance
        → Displays everything beautifully
```

**Step 4**: Manager exports to PDF

```
Manager clicks "Export PDF"

Browser → Uses jsPDF library
        → Formats all data into PDF document
        → Adds tables and charts
        → Downloads file: "sales-report-jan-2024.pdf"

(No server needed for PDF - happens in browser!)
```

**Simple Version**:
1. Manager opens analytics page
2. Browser asks server for data
3. Server counts and calculates from database
4. Browser creates pretty charts
5. Manager can download as PDF

---

### Visual: Complete Data Flow 🌊

```
┌─────────────┐
│   USER      │ "I want to create an order"
└──────┬──────┘
       │
       │ 1. Fill form & click button
       ▼
┌─────────────┐
│  BROWSER    │ "Let me send this data..."
└──────┬──────┘
       │
       │ 2. POST /api/orders + data
       ▼
┌─────────────┐
│   SERVER    │ "Checking... You're allowed!"
└──────┬──────┘
       │
       │ 3. Save to database
       ▼
┌─────────────┐
│  DATABASE   │ "Saved! Here's ID: 100"
└──────┬──────┘
       │
       │ 4. Return success
       ▼
┌─────────────┐
│   SERVER    │ "Order created successfully!"
└──────┬──────┘
       │
       │ 5. Send response
       ▼
┌─────────────┐
│  BROWSER    │ "Showing success message..."
└──────┬──────┘
       │
       │ 6. Display to user
       ▼
┌─────────────┐
│   USER      │ "Yay! Order created! 🎉"
└─────────────┘
```

---

## 🎨 Frontend Explained (The Pretty Part You See)

### What is Frontend?

**Frontend** = Everything you see and interact with
- The buttons you click
- The forms you fill out
- The tables showing data
- The pretty colors and animations

**Think of it like**: The dining area of a restaurant
- Customers (users) see and interact with this part
- Pretty decorations (CSS)
- Menus (forms and buttons)

---

### Single Page Application (SPA) 📄

**What's an SPA?**
Normal websites: Click link → New page loads (whole screen refreshes) ❌
Our website: Click link → Only content changes (super fast!) ✅

**Example**:
```
You're on Owner Dashboard
Click "Orders" link
→ URL changes to /owner/orders
→ Only the content area updates
→ NO full page reload!
→ Feels like using an app (smooth!)
```

**How it works**:
1. Load `index.html` once (just an empty shell)
2. JavaScript fills in all the content
3. When you click link → JavaScript swaps content
4. Browser thinks it's a new page (URL changes) but it's not!

---

###Router.js - The Traffic Controller 🚦

**This file decides what you see!**

```javascript
// Simplified version
async function router() {
  // 1. Check if logged in
  const response = await fetch('/api/check-auth');
  const data = await response.json();
  
  // 2. Not logged in? Show login page
  if (!data.isAuth) {
    showLoginPage();
    return;
  }
  
  // 3. Logged in! Show their dashboard
  if (data.user.role === 'owner') {
    showOwnerDashboard();
  } else if (data.user.role === 'manager') {
    showManagerDashboard();
  } else if (data.user.role === 'driver') {
    showDriverDashboard();
  }
  // ... etc for all roles
}
```

**What it does**:
1. Checks if you're logged in
2. If NOT → kicks you to login page
3. If YES → shows your specific dashboard

---

### Dashboard Components 📊

Each role gets their own dashboard file:
- `owner.js` → Owner's dashboard
- `manager.js` → Manager's dashboard
- `driver.js` → Driver's dashboard
- etc...

**Pattern every dashboard follows**:

```javascript
// Example: owner.js
export async function renderOwnerDashboard(container) {
  
  // STEP 1: Get data from server
  const stats = await fetch('/api/analytics/overview').then(r => r.json());
  const users = await fetch('/api/users').then(r => r.json());
  
  // STEP 2: Create HTML
  const html = `
    <div class="dashboard">
      <h1>Welcome, Owner! 👑</h1>
      
      <div class="stats-cards">
        <div class="card">
          <h3>Total Sales</h3>
          <p class="big-number">$${stats.totalSales}</p>
        </div>
        <div class="card">
          <h3>Orders Today</h3>
          <p class="big-number">${stats.ordersToday}</p>
        </div>
      </div>
      
      <table>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
        ${users.map(user => `
          <tr>
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
          </tr>
        `).join('')}
      </table>
      
      <button id="export-btn">Export Report</button>
    </div>
  `;
  
  // STEP 3: Put HTML on the page
  container.innerHTML = html;
  
  // STEP 4: Make buttons do things
  document.getElementById('export-btn').addEventListener('click', () => {
    exportToPDF();
  });
}
```

**Breaking it down**:
1. **Fetch data**: Ask server for information
2. **Build HTML**: Create the structure (like building with LEGO)
3. **Render**: Put it on the screen
4. **Add interactivity**: Make buttons work

---

### Tailwind CSS - Instant Styling 🎨

Instead of writing CSS from scratch, use pre-made classes!

**Old way** (lots of work):
```html
<style>
  .my-button {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
  }
  .my-button:hover {
    background-color: darkblue;
  }
</style>

<button class="my-button">Click Me</button>
```

**Tailwind way** (quick!):
```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</button>
```

**Common classes**:
- `bg-blue-500` = blue background
- `text-white` = white text
- `p-4` = padding
- `rounded` = rounded corners
- `hover:bg-red-500` = turn red on hover
- `flex` = flexbox layout
- `grid` = grid layout

---

### State Management (Remembering Things) 🧠

**What is "state"?**
State = Information the app needs to remember

**Example states**:
- Is user logged in?
- What page are we on?
- Is the menu open?
- What products are in cart?

**Where we store state**:
1. **Server (session)**: Login info, user role
   - Survives page refresh ✅
   - Secure ✅
   
2. **JavaScript variables**: Temporary UI state
   - Lost on page refresh ❌
   - Fast ✅
   
3. **Browser localStorage**: Persistent local data
   - Survives page refresh ✅
   - Only on this computer ⚠️

**Example**:
```javascript
// User logged in? → Server session
let isLoggedIn = await checkAuth();

// Menu open? → JavaScript variable
let menuOpen = false;

// Dark mode preference? → localStorage
localStorage.setItem('theme', 'dark');
```

---

## ⚙️ Backend Explained (The Smart Part Behind the Scenes)

### What is Backend?

**Backend** = The server that does all the work
- Receives requests from browser
- Talks to database
- Processes data
- Sends responses back

**Think of it like**: The kitchen in a restaurant
- Customers don't see it
- This is where food (data) is prepared
- Chefs (server code) do the work

---

### Express Server - The Foundation 🏗️

**Express** makes building a server EASY!

**Simplified server.js**:
```javascript
import express from 'express';
const app = express();

// MIDDLEWARE (helpers that run before your code)
app.use(express.json());  // Understand JSON data
app.use(sessionMiddleware);  // Handle logins

// ROUTES (different URLs do different things)
app.get('/api/orders', async (req, res) => {
  // Get all orders from database
  const orders = await prisma.order.findMany();
  res.json(orders);  // Send back as JSON
});

app.post('/api/orders', async (req, res) => {
  // Create new order
  const newOrder = await prisma.order.create({
    data: req.body
  });
  res.json({ success: true, order: newOrder });
});

// START SERVER
app.listen(3000, () => {
  console.log('Server running on port 3000! 🚀');
});
```

---

### REST API (How Browser Talks to Server) 🗣️

**REST** = Rules for how browser and server communicate

**HTTP Methods** (like verbs):
- `GET` = "Give me data" (read)
- `POST` = "Create something new"
- `PUT` = "Update something"
- `DELETE` = "Remove something"

**URLs are resources**:
- `/api/users` = All users
- `/api/users/5` = User with ID 5
- `/api/orders` = All orders
- `/api/orders/100` = Order with ID 100

**Examples**:
```javascript
// Get all products
GET /api/products
→ Returns: [{ id: 1, name: "Coke" }, { id: 2, name: "Pepsi" }]

// Get one product
GET /api/products/1
→ Returns: { id: 1, name: "Coke", price: 120 }

// Create new product
POST /api/products
Body: { name: "Sprite", price: 110 }
→ Returns: { success: true, productId: 3 }

// Update product
PUT /api/products/1
Body: { price: 130 }
→ Returns: { success: true }

// Delete product
DELETE /api/products/1
→ Returns: { success: true, message: "Product deleted" }
```

---

### Route Files (Organized Endpoints) 📁

Each route file handles one type of thing:

**auth.routes.js** (Login/Logout):
```javascript
router.post('/login', async (req, res) => {
  // Check username/password
  // Create session
  // Redirect to dashboard
});

router.post('/logout', async (req, res) => {
  // Destroy session
  // Redirect to login
});
```

**order.routes.js** (Orders):
```javascript
router.get('/orders', async (req, res) => {
  // Get all orders
});

router.post('/orders', async (req, res) => {
  // Create new order
});

router.put('/orders/:id', async (req, res) => {
  // Update order
});
```

**Why separate files?**
- Organized (easy to find things!)
- Can work on different features without conflicts
- Each person can work on different route file

---

### Prisma ORM (Talking to Database) 💬

**Without Prisma** (hard):
```javascript
const result = await db.query(
  'SELECT * FROM users WHERE email = ? AND password = ?',
  [email, password]
);
```

**With Prisma** (easy):
```javascript
const user = await prisma.user.findUnique({
  where: { email: email }
});
```

**Benefits**:
- ✅ No SQL needed (just JavaScript!)
- ✅ Auto-complete in code editor
- ✅ Catches errors before running
- ✅ Easier to read and understand

**Common Prisma operations**:
```javascript
// Get all
const users = await prisma.user.findMany();

// Get one
const user = await prisma.user.findUnique({ where: { id: 1 } });

// Create
const newUser = await prisma.user.create({
  data: { name: "John", email: "john@example.com" }
});

// Update
await prisma.user.update({
  where: { id: 1 },
  data: { name: "Johnny" }
});

// Delete
await prisma.user.delete({ where: { id: 1 } });

// Get with related data
const order = await prisma.order.findUnique({
  where: { id: 100 },
  include: { 
    customer: true,  // Include customer info
    products: true   // Include products
  }
});
```

---

### Middleware (Helpers That Run First) 🛡️

**Middleware** = Code that runs BEFORE your route handler

**Think of it like**: Security checkpoints at airport
- Everyone goes through security before boarding

**Example - Check if logged in**:
```javascript
function requireAuth(req, res, next) {
  if (!req.session.isAuth) {
    return res.status(401).json({ error: 'Not logged in!' });
  }
  next();  // ✅ Logged in, continue to route
}

// Use it on routes that need login
app.get('/api/orders', requireAuth, async (req, res) => {
  // This only runs if user is logged in!
  const orders = await prisma.order.findMany();
  res.json(orders);
});
```

**Common middleware**:
1. `express.json()` - Parse JSON from requests
2. `express.static()` - Serve files (HTML, CSS, images)
3. `cors()` - Allow cross-origin requests
4. `session()` - Handle login sessions
5. `requireAuth()` - Check if logged in (custom)

---

### Single Page Application (SPA) Approach

**What is an SPA?**
- Loads one HTML page initially
- Dynamically updates content without full page reloads
- Faster navigation and better user experience

**How it Works:**
1. Browser loads `index.html` (empty shell with `<div id="app">`)
2. Webpack bundle.js loads and executes
3. Router checks current URL and user authentication
4. Appropriate dashboard renders into `#app` div
5. User clicks link → router changes URL → new view renders (NO page reload)

### Component Structure

**Dashboard Components** (in `js/classes/`)
Each role has its own dashboard file that:
- Exports a `renderXDashboard(container)` function
- Fetches necessary data from APIs
- Builds HTML string (can be template literals)
- Injects HTML into container: `container.innerHTML = html`
- Attaches event listeners for interactivity

**Example Structure (owner.js):**
```javascript
export async function renderOwnerDashboard(container) {
  // 1. Fetch data
  const stats = await fetch('/api/analytics/overview').then(r => r.json());
  const users = await fetch('/api/users').then(r => r.json());
  
  // 2. Build HTML
  const html = `
    <div class="dashboard">
      <h1>Owner Dashboard</h1>
      <div class="stats">
        <div class="stat-card">
          <h3>Total Sales</h3>
          <p>${stats.totalSales}</p>
        </div>
        <!-- More stats -->
      </div>
      <div class="users-table">
        <!-- Users list -->
      </div>
    </div>
  `;
  
  // 3. Render
  container.innerHTML = html;
  
  // 4. Attach listeners
  document.querySelectorAll('.user-row').forEach(row => {
    row.addEventListener('click', handleUserClick);
  });
}
```

### State Management

**No Framework = Manual State Management**
- Session state: Managed by backend (user info in session)
- UI state: Stored in JavaScript variables within each component
- Data fetching: Direct API calls when needed
- Form state: HTML form elements (native browser state)

**Communication Between Components:**
- Custom events: `window.dispatchEvent(new CustomEvent('orderCreated'))`
- Direct function calls: Import and call functions from other modules
- Shared utility functions: In `js/utils/`

### Styling Strategy

**Tailwind CSS Classes:**
- Utility-first approach: `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">`
- Role-specific overrides: Each role has custom CSS file (e.g., `owner-style.css`)
- Responsive design: Tailwind breakpoints (`md:`, `lg:`, etc.)

**Why separate CSS files per role?**
- Different color schemes for each dashboard
- Custom components specific to roles
- Easier to maintain role-specific styles

---

## 8. Backend Architecture

### RESTful API Design

**REST Principles:**
- **Resources**: Represented by URLs (e.g., `/api/orders`)
- **HTTP Methods**: 
  - GET: Read data
  - POST: Create new resource
  - PUT/PATCH: Update existing resource
  - DELETE: Remove resource
- **Stateless**: Each request contains all necessary info
- **JSON**: Data format for requests and responses

**Typical Route Handler:**
```javascript
router.get('/orders/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;  // Get ID from URL
  
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { customer: true, items: true }  // Join related data
  });
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);  // Send JSON response
}));
```

### Middleware Chain

Requests flow through middleware in order:

```
Request
  │
  ├─→ express.static()      [Serve static files from /dist]
  │
  ├─→ cors()                [Enable CORS]
  │
  ├─→ express.json()        [Parse JSON body]
  │
  ├─→ session middleware    [Load/create session]
  │
  ├─→ Route handler         [Your API logic]
  │
  └─→ Error handler         [Catch errors]
      │
      └─→ Response
```

**What Each Middleware Does:**

1. **express.static('dist')**
   - Serves bundled frontend files
   - If request is for `/bundle.js`, serve from `dist/bundle.js`

2. **cors()**
   - Adds CORS headers to responses
   - Allows frontend (port 8080) to call backend (port 3000)

3. **express.json()**
   - Parses incoming JSON request bodies
   - Makes data available in `req.body`

4. **Session Middleware**
   - Loads session from database using cookie
   - Attaches session to `req.session`
   - Saves session back to database after response

5. **Route Handler**
   - Your custom logic for the endpoint
   - Queries database, processes data, sends response

6. **Error Handler**
   - Catches any errors thrown in route handlers
   - Sends appropriate error response

### Database Access Layer (Prisma)

**Why ORM over Raw SQL?**
- **Type Safety**: Prisma knows your database schema, provides autocomplete
- **Easier Queries**: 
  ```javascript
  // Prisma
  await prisma.user.findMany({ where: { role: 'manager' } })
  
  // Raw SQL
  await db.query('SELECT * FROM User WHERE role = ?', ['manager'])
  ```
- **Relations**: Easily load related data
  ```javascript
  await prisma.order.findUnique({
    where: { id: 123 },
    include: { 
      customer: true,
      salesOrder: { include: { delivery: true } }
    }
  })
  ```
- **Migrations**: Database changes tracked and version-controlled

**Prisma Client Singleton:**
```javascript
// Only create one instance, reuse everywhere
const prisma = new PrismaClient();

// Use in routes
const users = await prisma.user.findMany();
```

### Error Handling

**asyncHandler Utility:**
Wraps async route handlers to catch errors:
```javascript
// utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/orders', asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
  // If error occurs, automatically caught and sent to error handler
}));
```

**Global Error Handler:**
```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});
```

---

## 9. Authentication & Authorization

### Session-Based Authentication

**Why Sessions instead of JWT?**
- Simpler for monolithic architecture
- Easy to invalidate (logout)
- Server controls session lifetime
- Good for traditional web apps

**How it Works:**

1. **User Logs In:**
   ```
   POST /api/login
   { email: 'user@example.com', password: 'secret123' }
   
   Backend:
   ├─→ Find user in database
   ├─→ Verify password
   ├─→ Create session: req.session.isAuth = true
   ├─→ Save to database (via Prisma Session Store)
   └─→ Send cookie to browser: Set-Cookie: connect.sid=abc123...
   ```

2. **Subsequent Requests:**
   ```
   GET /api/orders
   Cookie: connect.sid=abc123...
   
   Backend:
   ├─→ Read cookie value
   ├─→ Load session from database
   ├─→ Attach to req.session
   └─→ req.session.isAuth === true → User is logged in
   ```

3. **User Logs Out:**
   ```
   POST /api/logout
   
   Backend:
   ├─→ Delete session from database
   ├─→ Clear cookie: res.clearCookie('connect.sid')
   └─→ User must log in again
   ```

### Authorization (Role-Based Access Control)

**Frontend Authorization:**
Router checks user role before rendering dashboard:
```javascript
// router.js
if (data.user.role === 'owner') {
  renderOwnerDashboard();
} else if (data.user.role === 'manager') {
  renderManagerDashboard();
}
// etc.
```

**Backend Authorization:**
Middleware checks permissions before processing request:
```javascript
// Middleware example (should be added)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.isAuth) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  };
}

// Usage
router.delete('/users/:id', requireRole('owner', 'manager'), async (req, res) => {
  // Only owners and managers can delete users
});
```

**Current Implementation Note:**
The project currently relies primarily on frontend role-checking. **For production, backend authorization middleware should be added** to all sensitive routes.

---

## 10. Key Features Breakdown

### Feature 1: Inventory Management

**What it does:**
- Tracks all products in warehouse
- Records stock levels, locations, expiry dates
- Updates quantities when orders placed or shipments received

**Files Involved:**
- Frontend: `stock-keeper.js`, `manager.js`
- Backend: `product.routes.js`
- Database: `Product` model

**Data Flow:**
1. Stock Keeper views inventory: `GET /api/products`
2. New shipment arrives: `POST /api/shipments` → Updates product quantities
3. Order placed: Stock automatically reduced in order creation transaction

### Feature 2: Order Processing

**What it does:**
- Creates orders from customers (Sales Orders)
- Creates orders to suppliers (Purchase Orders)
- Tracks order status from creation to completion

**Order Lifecycle:**
```
1. Created     → Order saved to database
2. Authorized  → Manager approves
3. Processing  → Items being prepared
4. Shipped     → Out for delivery (SalesOrder) or Arrived (PurchaseOrder)
5. Delivered   → Customer received / Stock received
6. Completed   → Payment collected, order closed
```

**Files Involved:**
- Frontend: `salesman.js`, `manager.js`, `cashier.js`
- Backend: `order.routes.js`, `salesorder.route.js`, `purchaseorder.routes.js`
- Database: `Order`, `SalesOrder`, `PurchaseOrder` models

### Feature 3: Delivery Management

**What it does:**
- Assigns deliveries to drivers
- Tracks delivery status and locations
- Records proof of delivery

**Process:**
1. Manager creates delivery schedule: `POST /api/deliveries`
2. Driver views assigned deliveries: `GET /api/deliveries?driverId=X`
3. Driver updates location in real-time
4. Driver marks delivered: `PUT /api/deliveries/:id`
5. System triggers invoice generation

**Files Involved:**
- Frontend: `driver.js`, `manager.js`
- Backend: `delivery.routes.js`
- Database: `Delivery`, `Driver` models

### Feature 4: Financial Tracking

**What it does:**
- Generates invoices for orders
- Tracks payments received from customers
- Tracks payments made to suppliers
- Produces financial reports

**Invoice Types:**
- **Sales Invoice**: For customer orders (money coming in)
- **Purchase Invoice**: For supplier orders (money going out)

**Payment Flow:**
```
Sales Order Created
  ↓
Sales Invoice Generated (status: pending)
  ↓
Customer Pays → Payment Record Created
  ↓
Invoice Updated (status: paid)
  ↓
Analytics Updated (revenue tracking)
```

**Files Involved:**
- Frontend: `cashier.js`, `owner.js`, `manager.js`
- Backend: `payment.routes.js`, `salesinvoice.routes.js`, `purchaseinvoice.routes.js`
- Database: `Invoice`, `Payment`, `SalesInvoice`, `PurchaseInvoice` models

### Feature 5: Employee Management

**What it does:**
- Manages all employee records
- Tracks attendance, performance, salary
- Assigns tasks to employees

**Employee Roles:**
- **Management**: Owner, Manager, Assistant Manager
- **Operations**: Salesman, Distributor, Cashier
- **Logistics**: Driver, Stock Keeper
- **External**: Supplier

**Task Assignment:**
1. Manager creates task: `POST /api/tasks`
2. Assigns to employee (assigneeId)
3. Employee views tasks: `GET /api/tasks?assigneeId=X`
4. Employee completes task: `PUT /api/tasks/:id { status: 'completed' }`

**Files Involved:**
- Frontend: `manager.js`, role-specific dashboards
- Backend: `employee.routes.js`, `task.routes.js`, `user.routes.js`
- Database: `User`, `Task`, role-specific models

### Feature 6: Analytics & Reporting

**What it does:**
- Generates sales reports (daily, weekly, monthly)
- Analyzes top-selling products
- Tracks delivery performance
- Customer feedback analysis
- Export reports as PDF

**Report Types:**
- **Sales Analytics**: Total revenue, orders count, average order value
- **Product Analytics**: Best sellers, slow-moving items, stock alerts
- **Delivery Analytics**: On-time delivery rate, average delivery time
- **Employee Analytics**: Performance ratings, sales by salesman
- **Customer Analytics**: Top customers, feedback scores

**PDF Export:**
Uses jsPDF library to generate PDFs client-side:
```javascript
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF();
doc.text('Sales Report', 14, 15);
doc.autoTable({
  head: [['Order#', 'Customer', 'Amount', 'Date']],
  body: ordersData
});
doc.save('sales-report.pdf');
```

**Files Involved:**
- Frontend: `owner.js`, `manager.js`, `js/utils/pdfReportTemplate.js`
- Backend: `analytics.routes.js`
- Database: Aggregates data from multiple models

---

## 11. Development Setup

### Prerequisites

**Required Software:**
- **Node.js** (v18 or higher): JavaScript runtime
- **PostgreSQL** (v14 or higher): Database
- **npm** (comes with Node.js): Package manager
- **Git**: Version control

### Installation Steps

**1. Clone Repository:**
```bash
git clone <repository-url>
cd distributor-ms
```

**2. Install Dependencies:**
```bash
npm install
```
This installs all packages listed in `package.json` and runs `postinstall` script (generates Prisma client).

**3. Configure Environment Variables:**
Create `.env` file in root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/distributor_db"
SESSION_SECRET="your-random-secret-key-here"
NODE_ENV="development"
PORT=3000
```

**Explanation:**
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for encrypting sessions
- `NODE_ENV`: 'development' or 'production'
- `PORT`: Backend server port (default 3000)

**4. Setup Database:**
```bash
# Create database tables from schema
npx prisma migrate dev --name init

# (Optional) Seed with test data
npx prisma db seed
```

**5. Start Development Servers:**

**Terminal 1 - Backend:**
```bash
npm run server
```
Starts Express server on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Starts Webpack dev server on http://localhost:8080

**6. Access Application:**
Open browser and go to http://localhost:8080

### Development Workflow

**Making Changes:**

1. **Frontend Changes:**
   - Edit files in `src/`
   - Webpack auto-reloads browser (hot reload)
   - Check browser console for errors

2. **Backend Changes:**
   - Edit files in `api/`
   - Manually restart server (Ctrl+C, then `npm run server`)
   - Or use nodemon: `nodemon api/server.js`

3. **Database Schema Changes:**
   - Edit `prisma/schema.prisma`
   - Run: `npx prisma migrate dev --name description-of-change`
   - Run: `npx prisma generate` (regenerate client)
   - Restart backend server

4. **CSS Changes:**
   - Edit files in `src/css/`
   - Webpack auto-recompiles and reloads

### Useful Commands

```bash
# Build for production
npm run build

# View database in browser
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format

# Check for migration issues
npx prisma migrate status

# Generate Prisma client (after schema changes)
npx prisma generate
```

### Debugging Tips

**Backend Debugging:**
- Check terminal running server for error logs
- Add `console.log()` statements in route handlers
- Use Prisma Studio to inspect database: `npx prisma studio`
- Test APIs with Postman or curl

**Frontend Debugging:**
- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for API request/response
- Use `debugger;` statement to pause execution

**Database Debugging:**
- Run: `npx prisma studio` to view data in GUI
- Check migration files in `prisma/migrations/`
- View SQL logs by enabling in `schema.prisma`:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  generator client {
    provider = "prisma-client-js"
    log      = ["query", "info", "warn", "error"]
  }
  ```

---

## 12. Deployment

### Vercel Deployment (Recommended for this project)

**Why Vercel?**
- Easy deployment for Node.js + static frontend
- Free tier available
- Automatic HTTPS
- CI/CD integration with Git
- Serverless functions for backend

**Deployment Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow prompts to configure project.

4. **Configure Environment Variables:**
   In Vercel dashboard:
   - Add `DATABASE_URL` (use cloud PostgreSQL like Neon, Supabase, or Railway)
   - Add `SESSION_SECRET`
   - Set `NODE_ENV=production`

5. **Configure Build:**
   Vercel uses `vercel.json` configuration:
   - Backend runs as serverless function
   - Frontend builds with `npm run build`
   - Static files served from `dist/`

6. **Deploy Database:**
   Options:
   - **Neon**: Free PostgreSQL (https://neon.tech)
   - **Supabase**: Free PostgreSQL with extra features (https://supabase.com)
   - **Railway**: Simple deployment (https://railway.app)

   After setting up database:
   - Run migrations: `npx prisma migrate deploy`
   - Seed data (if needed): `npx prisma db seed`

### Alternative: Traditional Server Deployment

**Requirements:**
- VPS or cloud server (AWS, DigitalOcean, etc.)
- Node.js installed
- PostgreSQL installed or cloud database
- Nginx (for reverse proxy)

**Setup:**

1. **Clone repo on server:**
   ```bash
   git clone <repo-url>
   cd distributor-ms
   npm install
   ```

2. **Configure environment:**
   Create `.env` with production values

3. **Build frontend:**
   ```bash
   npm run build
   ```

4. **Setup PostgreSQL:**
   ```bash
   # Create database
   createdb distributor_db
   
   # Run migrations
   npx prisma migrate deploy
   ```

5. **Start backend with PM2:**
   ```bash
   npm install -g pm2
   pm2 start api/server.js --name distributor-api
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location /api {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
     
     location / {
       root /path/to/distributor-ms/dist;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

7. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Environment Variables for Production

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# Session
SESSION_SECRET="super-long-random-secret-key-here"

# Environment
NODE_ENV="production"

# Server
PORT=3000

# Optional
REDIS_URL="redis://host:port" # If using Redis for sessions
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS enabled (SSL certificate)
- [ ] Session secret is strong and unique
- [ ] Passwords hashed with bcrypt (implement in auth.routes.js)
- [ ] CORS configured for production domain
- [ ] Error logging setup (consider Sentry, LogRocket)
- [ ] Database backups configured
- [ ] Rate limiting added (prevent API abuse)
- [ ] Input validation added (prevent SQL injection, XSS)
- [ ] Security headers added (helmet middleware)

---

## Summary for Beginners

### The Big Picture

This project is a **web application** that helps manage a distribution business. Think of it like an operating system for a company that delivers products to customers.

**Key Concepts:**

1. **Frontend** (What You See):
   - The website interface users interact with
   - Built with HTML, CSS, and JavaScript
   - Runs in the browser
   - Each role (Owner, Manager, Driver, etc.) has their own dashboard

2. **Backend** (Behind the Scenes):
   - The server that processes requests
   - Handles business logic (creating orders, calculating totals, etc.)
   - Connects to database
   - Ensures security (who can do what)

3. **Database** (Where Data Lives):
   - PostgreSQL stores all data permanently
   - Tables for users, orders, products, deliveries, etc.
   - Relationships between tables (e.g., an order belongs to a customer)

4. **Authentication** (Security):
   - Login system to verify who you are
   - Sessions to keep you logged in
   - Role-based permissions (what you can do)

### How It All Works Together

```
USER OPENS WEBSITE
     ↓
BROWSER LOADS FRONTEND CODE
     ↓
FRONTEND CHECKS IF USER IS LOGGED IN (via API call)
     ↓
IF LOGGED IN → Show dashboard for their role
IF NOT → Show login page
     ↓
USER PERFORMS ACTION (e.g., creates order)
     ↓
FRONTEND SENDS REQUEST TO BACKEND
     ↓
BACKEND VALIDATES & PROCESSES
     ↓
DATABASE STORES/RETRIEVES DATA
     ↓
BACKEND SENDS RESPONSE TO FRONTEND
     ↓
FRONTEND UPDATES UI
```

### Technologies in Simple Terms

- **Node.js**: Lets us use JavaScript on the server (not just in browser)
- **Express**: Makes building APIs easier (handles HTTP requests)
- **Prisma**: Talks to database using JavaScript (no need to write SQL)
- **PostgreSQL**: Stores all the data (like Excel but much more powerful)
- **Webpack**: Bundles all code files into one for faster loading
- **Tailwind CSS**: Provides ready-made styling classes (makes things look good fast)
- **Sessions**: Remembers who you are so you don't have to login every time

### Key Takeaways

1. **Separation of Concerns**: Frontend displays data, Backend processes data, Database stores data
2. **API-Based Communication**: Frontend and backend talk via HTTP requests (REST API)
3. **Role-Based System**: Different users see different interfaces based on their job
4. **Database-Driven**: All important data persists in PostgreSQL
5. **Session-Based Auth**: Server maintains user sessions for security

### Next Steps for Learning

1. **Understand HTTP**: Learn about GET, POST, PUT, DELETE
2. **Learn SQL Basics**: Understand how databases work
3. **Study Express Routing**: How URLs map to functions
4. **Explore Prisma Docs**: How to query database with Prisma
5. **Learn JavaScript Async**: Promises, async/await, handling API calls
6. **Study REST API Design**: Best practices for API structure

---

## Additional Resources

### Official Documentation
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs
- Webpack: https://webpack.js.org/concepts
- Tailwind CSS: https://tailwindcss.com/docs

### Learning Resources
- MDN Web Docs (JavaScript): https://developer.mozilla.org
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- REST API Design: https://restfulapi.net
- Database Design: https://www.databasestar.com

### Tools
- Prisma Studio: Visual database editor
- Postman: API testing
- VS Code: Code editor with great Node.js support
- pgAdmin: PostgreSQL management tool

---

## Authors & License

**Project Authors:**
- Anjana Dulan Wijerathna
- Dilukshan Niranjan
- Melisha Devaraj
- Pabodhini Tharaka Perera

**License:** MIT

**Academic Institution:** NIBM (National Institute of Business Management)

**Project Type:** Final Year Project - BSc (Hons) in Software Engineering

---

*This documentation was created to help new developers understand the project structure, technologies, and data flow. For specific implementation questions, refer to the code comments and official library documentation.*

## 🔐 Login & Security (How We Know It's Really You)

### Session-Based Authentication 🍪

**What is a session?**
A session = Server remembers you're logged in

**Think of it like**: Getting a wristband at an amusement park
- You show ID once at entrance (login)
- Get a wristband (session cookie)
- Don't need to show ID again for every ride
- Wristband expires at end of day (session timeout)

---

### How Login Works (Step by Step)

**Step 1: You enter username/password**
`
Browser: "Here's email: john@example.com and password: secret123"
→ Sends POST /api/login
`

**Step 2: Server checks if correct**
`
Server: "Let me check the database..."
→ Finds user with email john@example.com
→ Compares passwords
→ Match! ✅
`

**Step 3: Server creates session**
`
Server: "Creating session..."
→ Generates random session ID: "abc123xyz789"
→ Saves in database: "User #5 is logged in"
→ Sends cookie to browser: "connect.sid=abc123xyz789"
`

**Step 4: Browser saves cookie**
`
Browser: "Saving cookie..."
→ Stores cookie automatically
→ Will send this cookie with EVERY request
`

**Step 5: Future requests**
`
Browser wants to view orders
→ Sends: GET /api/orders
→ Includes: Cookie: connect.sid=abc123xyz789

Server: "Let me check this cookie..."
→ Looks up session in database
→ Finds: User #5 is logged in
→ Allows request ✅
→ Sends back orders
`

---

### Session vs JWT (Why we use sessions)

**Sessions** (what we use):
- ✅ Server controls everything
- ✅ Easy to logout (delete session)
- ✅ Secure
- ❌ Server must store sessions (uses memory)

**JWT** (alternative):
- ✅ No server storage needed
- ❌ Hard to logout (token stays valid)
- ❌ Token can get big
- ❌ Can't revoke immediately

**For this project, sessions are better because**:
- Simpler to understand
- Easy to implement
- Good for monolithic architecture
- Can logout properly

---

### Role-Based Access Control (RBAC) 👮

**What is RBAC?**
Different users can do different things based on their ROLE

**Example roles and permissions**:
`
Owner (👑 BOSS):
  ✅ Can do EVERYTHING
  ✅ View all reports
  ✅ Manage users
  ✅ View finances

Manager (👔 SUPERVISOR):
  ✅ Approve orders
  ✅ View reports
  ✅ Manage employees
  ❌ Can't delete other managers

Driver (🚚 DELIVERY):
  ✅ View assigned deliveries
  ✅ Mark as delivered
  ❌ Can't create orders
  ❌ Can't see finances

Cashier (💰 MONEY):
  ✅ Process payments
  ✅ Generate invoices
  ❌ Can't approve orders
  ❌ Can't manage inventory
`

---

### How We Check Permissions

**Frontend (router.js)**:
`javascript
// Only show pages they're allowed to see
if (user.role === 'driver') {
  showDriverDashboard();  // ✅ Can see
  // They can't even navigate to owner dashboard
}
`

**Backend (middleware)**:
`javascript
// Check before processing request
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Not allowed!' });
    }
    next();  // ✅ Allowed
  };
}

// Only owners and managers can delete users
router.delete('/users/:id', requireRole('owner', 'manager'), async (req, res) => {
  // Delete user
});
`

---

### Security Best Practices 🔒

**1. Never Store Plain Passwords**
`javascript
// ❌ BAD (anyone who hacks database can see passwords)
password: "secret123"

// ✅ GOOD (scrambled with bcrypt)
password: "..."  // Impossible to reverse!
`

**2. Use HTTPS in Production**
- HTTP = Data sent as plain text (hackers can read!)
- HTTPS = Data encrypted (scrambled, secure!)

**3. Secure Session Cookies**
`javascript
cookie: {
  secure: true,    // Only send over HTTPS
  httpOnly: true,  // Can't access via JavaScript (prevents XSS)
  sameSite: 'lax'  // Prevents CSRF attacks
}
`

**4. Validate All Input**
`javascript
// ❌ BAD (trust user input)
const email = req.body.email;

// ✅ GOOD (check if valid)
const email = req.body.email;
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Invalid email' });
}
`

---

## ✨ Cool Features This Project Has

### Feature 1: Track Inventory 📦

**What it does**: Knows exactly what products we have, how many, and where

**How it works**:
1. Stock keeper adds products to system
2. When order placed → quantity automatically reduced
3. When shipment arrives → quantity automatically increased
4. Low stock alert → warns when running out

**Example**:
`
Product: Coca Cola 1L
Quantity: 500 bottles
Location: Warehouse A, Shelf 5
Status: ✅ In Stock

(Customer orders 100 bottles)
→ System automatically updates:
Quantity: 400 bottles
`

---

### Feature 2: Create & Track Orders ��

**What it does**: Manages entire order lifecycle

**Order Flow**:
`
1. Created → Salesman creates order
2. Authorized → Manager approves
3. Processing → Warehouse prepares items
4. Shipped → Driver picks up
5. Delivered → Customer receives
6. Completed → Payment collected
`

**Different Order Types**:
- **Sales Order**: Selling to customers (money coming in)
- **Purchase Order**: Buying from suppliers (money going out)
- **Retail Order**: Walk-in customers (immediate sale)

---

### Feature 3: Delivery Management 🚚

**What it does**: Tracks deliveries from warehouse to customer

**How driver uses it**:
1. Opens app → Sees list of deliveries
2. Each delivery shows:
   - Customer name and address
   - Products to deliver
   - Route map
3. Driver delivers → Marks as "Delivered"
4. System updates:
   - Delivery status
   - Invoice generated
   - Customer notified

**Manager features**:
- Assign deliveries to drivers
- Track all deliveries on map
- See delivery performance (on-time vs late)

---

### Feature 4: Handle Payments 💰

**What it does**: Tracks all money in and out

**Payment Flow**:
`
Order Created
   ↓
Invoice Generated (Amount: ,000, Status: Unpaid)
   ↓
Customer Pays (Cash/Bank Transfer/Check)
   ↓
Cashier Records Payment
   ↓
Invoice Updated (Status: Paid ✅)
   ↓
Owner Sees Updated Revenue Report
`

**Reports**:
- Total sales today/week/month
- Pending payments (who owes money)
- Top customers (who buys most)
- Payment methods breakdown

---

### Feature 5: Employee Management 👥

**What it does**: Manages all employees in system

**Employee Info Tracked**:
- Basic: Name, email, phone, address
- Role: Owner, Manager, Driver, Salesman, etc.
- Performance: Sales targets, ratings, attendance
- Salary: Base salary, bonuses, commissions

**Task Assignment**:
`
Manager creates task:
  - Title: "Restock Warehouse A"
  - Assigned to: Stock Keeper #3
  - Due date: Tomorrow
  - Priority: High

Stock Keeper sees task in their dashboard
  → Completes task
  → Marks as complete
  → Manager gets notified ✅
`

---

### Feature 6: Analytics & Reports 📊

**What it does**: Generates business intelligence reports

**Reports Available**:
1. **Sales Report**: Total sales, order count, trends
2. **Product Report**: Best sellers, slow movers, stock levels
3. **Delivery Report**: On-time rate, average time, driver performance
4. **Employee Report**: Sales by salesman, driver ratings
5. **Customer Report**: Top customers, feedback scores

**Export to PDF**: Click button → Download professional report!

---

## 🚀 How to Run This on Your Computer

### Step 1: Install Required Software

**You need these 3 things**:

**1. Node.js** (JavaScript runner)
- Download from: https://nodejs.org
- Get version 18 or higher
- Check: Run "@en;node --version" in terminal
- Should show: 18.0.0 or higher

**2. PostgreSQL** (Database)
- Download from: https://www.postgresql.org/download
- Install with default settings
- Remember the password you set!

**3. Git** (Version control)
- Download from: https://git-scm.com
- Install with default settings

---

### Step 2: Download the Project

**Option A: Clone from GitHub**
`ash
git clone <repository-url>
cd distributor-ms
`

**Option B: Download ZIP**
- Download ZIP file
- Extract to folder
- Open folder in terminal

---

### Step 3: Install Dependencies

`ash
npm install
`

**What this does**:
- Reads package.json
- Downloads ALL libraries listed
- Puts them in 
ode_modules/ folder
- Takes 2-5 minutes (downloads ~200 packages)

**You'll see lots of text scrolling** - that's normal! ✅

---

### Step 4: Setup Environment Variables

Create a file named .env in the root folder:

`nv
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/distributor_db"
SESSION_SECRET="make-this-a-long-random-string-abc123xyz789"
NODE_ENV="development"
PORT=3000
`

**Replace**:
- yourpassword → Your PostgreSQL password
- make-this-a-long-random-string... → Any random text (for security)

---

### Step 5: Setup Database

**Create the database**:
`ash
# Opens PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE distributor_db;

# Exit
\q
`

**Run migrations** (create tables):
`ash
npx prisma migrate dev
`

**Add sample data** (optional):
`ash
npx prisma db seed
`

---

### Step 6: Start the Project

**Open 2 terminals** (yes, you need TWO!)

**Terminal 1 - Start Backend**:
`ash
npm run server
`
You should see: Server running on port 3000! 🚀

**Terminal 2 - Start Frontend**:
`ash
npm run dev
`
You should see: webpack compiled successfully

---

### Step 7: Open in Browser

Go to: **http://localhost:8080**

**You should see the login page!** 🎉

**Test Credentials** (if you ran seed):
- Email: owner@example.com
- Password: password123

---

### Troubleshooting 🔧

**Problem: "Cannot connect to database"**
`ash
# Check if PostgreSQL is running
# Windows: Check Services → PostgreSQL
# Mac/Linux: ps aux | grep postgres

# Check if database exists
psql -U postgres -c "\l"
`

**Problem: "Port 3000 already in use"**
`ash
# Change port in .env
PORT=3001

# Or stop other process using port 3000
`

**Problem: "Module not found"**
`ash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
`

---

## 🌍 How to Put This on the Internet

### Option 1: Vercel (Easiest - Recommended) ⚡

**Vercel** = Free hosting for frontend + backend

**Step 1: Create Vercel account**
- Go to: https://vercel.com
- Sign up (free!)

**Step 2: Install Vercel CLI**
`ash
npm install -g vercel
`

**Step 3: Setup Database** (online)
Go to: https://neon.tech (free PostgreSQL)
- Create account
- Create database
- Copy connection URL

**Step 4: Configure Environment**
`ash
vercel
# Follow prompts
# Add environment variables when asked:
# - DATABASE_URL (from Neon)
# - SESSION_SECRET
`

**Step 5: Deploy!**
`ash
vercel --prod
`

**Done!** You'll get a URL like: https://your-project.vercel.app 🎉

---

### Option 2: Traditional Server (DigitalOcean, AWS, etc.)

**Requirements**:
- VPS (Virtual Private Server)
- -10/month

**Steps** (simplified):
1. Get a server (Ubuntu Linux recommended)
2. Install Node.js and PostgreSQL
3. Clone your project
4. Run 
pm install
5. Setup PM2 (keeps server running)
6. Setup Nginx (web server)
7. Get SSL certificate (HTTPS)

**This is more advanced** - follow a VPS deployment tutorial

---

## 📚 Learning Resources

### If You Want to Learn More

**JavaScript Basics**:
- MDN Web Docs: https://developer.mozilla.org
- FreeCodeCamp: https://www.freecodecamp.org

**Node.js**:
- Official Docs: https://nodejs.org/docs
- Node.js Tutorial: https://www.w3schools.com/nodejs

**Express.js**:
- Official Guide: https://expressjs.com/en/guide
- Express Tutorial: https://www.tutorialspoint.com/expressjs

**Prisma**:
- Official Docs: https://www.prisma.io/docs
- Prisma Tutorial: https://www.prisma.io/docs/getting-started

**PostgreSQL**:
- Official Tutorial: https://www.postgresql.org/docs/current/tutorial.html
- PostgreSQL Exercises: https://pgexercises.com

**Tailwind CSS**:
- Official Docs: https://tailwindcss.com/docs
- Tailwind UI: https://tailwindui.com (components)

---

## 🎓 Final Words for Beginners

### Don't Be Overwhelmed!

This is a BIG project with many parts. **You don't need to understand everything at once!**

**Start small**:
1. ✅ Run the project (get it working)
2. ✅ Explore the features (click around)
3. ✅ Read one section of docs at a time
4. ✅ Make small changes (change text, colors)
5. ✅ Gradually understand more

**Remember**:
- 🚶‍♂️ Every expert was once a beginner
- 📖 Learning takes time (be patient!)
- 🔨 Build things to learn faster
- 🤝 Ask questions when stuck
- 🎉 Celebrate small wins!

---

## 👥 Project Team

**Developed by**:
- Anjana Dulan Wijerathna
- Dilukshan Niranjan
- Melisha Devaraj
- Pabodhini Tharaka Perera

**Academic Project**:
- Institution: NIBM (National Institute of Business Management)
- Program: BSc (Hons) in Software Engineering
- Year: Final Year Project

**License**: MIT (Free to use and modify!)

---

## 🆘 Need Help?

### Common Questions

**Q: I'm stuck on an error, what do I do?**
A: Copy the error message → Google it → Check Stack Overflow

**Q: How do I add a new feature?**
A: 
1. Understand what it should do
2. Find similar code in project
3. Copy and modify
4. Test it!

**Q: Can I use this for my own project?**
A: Yes! It's MIT licensed (free to use)

**Q: How do I learn more about [specific topic]?**
A: Check the "Learning Resources" section above

---

*This documentation was made EXTRA simple for complete beginners! If something is still confusing, that's okay - learning takes time. Keep practicing! 💪*

