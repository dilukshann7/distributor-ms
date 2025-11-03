# Method Calls Guide - Distribution Management System

This document outlines where model methods should be called in each dashboard page/section.

## 🔑 Important Distinction

### Methods to call in `init()` (Page Load)
These methods **fetch and display initial data** when the page loads:
- `getAll()`, `getPending()`, `getActive()` - Fetch lists of data
- `getTotalSales()`, `calculateNetProfit()` - Get summary statistics
- `getAverageRating()`, `getStockValue()` - Calculate metrics for display

### Methods to call in Event Handlers (User Actions)
These methods **respond to user interactions** and should NOT be in `init()`:
- `create()`, `update()`, `delete()` - CRUD operations triggered by buttons
- `approve()`, `reject()`, `process()` - Action methods on button click
- `print()`, `email()`, `export()` - Generation/output methods
- `assignTo()`, `notifyAssignee()` - Workflow actions
- `addItem()`, `removeItem()` - Cart/list modifications

**Rule of thumb:** If it requires a button click or form submission, it goes in an event handler, NOT in `init()`.

## Owner Dashboard

### 1. Financial Overview Page (FinancialOverview class)
**Location:** `src/js/classes/owner.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Financial Reports
await FinancialReport.getMonthlyReport(year, month)
await FinancialReport.calculateTotalSales()
await FinancialReport.calculateTotalExpenses()
await FinancialReport.calculateNetProfit()

// Cash Flow
await CashFlow.getTotalInflow(startDate, endDate)
await CashFlow.getTotalOutflow(startDate, endDate)
await CashFlow.getNetFlow(startDate, endDate)
await CashFlow.getMonthlySummary(year, month)

// Transactions
await Transaction.getTotalAmount(startDate, endDate)
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When user changes date range
await FinancialReport.getMonthlyReport(newYear, newMonth)

// When exporting report
await report.exportToPDF()
await report.exportToExcel()
```

### 2. Employee Management Page (EmployeeManagement class)
**Location:** `src/js/classes/owner.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get all employees
const employees = await User.getAll(filters)

// For each employee, display their info:
for (let employee of employees) {
  const attendanceRate = await employee.getAttendanceRate(startDate, endDate)
  const salary = await employee.calculateSalary()
  const tasks = await employee.getAssignedTasks()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When updating employee performance (button click)
await employee.updatePerformance(performanceRating)

// When creating new employee (form submit)
await User.create(employeeData)

// When editing employee (save button)
await employee.update(updatedData)

// When deleting employee (delete button)
await employee.delete()
```

### 3. Inventory Control Page (InventoryControl class)
**Location:** `src/js/classes/owner.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get products
const products = await Product.getAll(filters)
const lowStockItems = await Product.getLowStockItems()
const criticalStockItems = await Product.getCriticalStockItems()
const stockValue = await Product.getStockValue()

// For each product, display status:
for (let product of products) {
  await product.checkStockStatus()
  const isLow = await product.isLowStock()
  const isCritical = await product.isCritical()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When adjusting stock (button click)
await product.updateStock(newQuantity)

// When adding new product (form submit)
await Product.create(productData)

// When editing product (save button)
await product.update(updatedData)

// When setting reorder level (input change)
await product.setReorderLevel(level)
```

### 4. Operations Monitor Page (OperationsMonitor class)
**Location:** `src/js/classes/owner.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Tasks
const tasks = await Task.getAll(filters)
const pendingTasks = await Task.getPending()
const overdueTasks = await Task.getOverdue()

// Orders and Deliveries
const todaysOrders = await SalesOrder.getTodaysOrders()
const todaysDeliveries = await Delivery.getTodaysDeliveries()
const inTransitDeliveries = await Delivery.getInTransit()
const completedDeliveries = await Delivery.getCompleted()
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When marking task complete (checkbox/button)
await task.markCompleted()

// When reassigning task (dropdown change)
await task.assignTo(newEmployeeId)

// When updating delivery status (button click)
await delivery.updateStatus(newStatus)

// When filtering/refreshing data (filter button)
await Task.getAll(newFilters)
```

### 5. Reports & Analytics Page (ReportsSection class)
**Location:** `src/js/classes/owner.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Reports
await FinancialReport.getDailyReport(date)
await FinancialReport.getWeeklyReport(year, week)
await FinancialReport.getMonthlyReport(year, month)

// Sales Analysis
const totalSales = await SalesOrder.getTotalSales(startDate, endDate)
const salesmen = await User.findByRole('salesman')

// For each salesman, display their stats:
for (let salesman of salesmen) {
  const orders = await salesman.getSalesOrders()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When changing report period (date picker)
await FinancialReport.getMonthlyReport(newYear, newMonth)

// When exporting report (export button)
await report.exportToPDF()
await report.exportToExcel()
await report.exportToCSV()

// When generating custom report (generate button)
await FinancialReport.generateCustomReport(params)
```

---

## Manager Dashboard

### 1. Employee Oversight Page (EmployeeOversight class)
**Location:** `src/js/classes/manager.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get employees
const employees = await User.getAll(filters)

// For each employee, display their info:
for (let employee of employees) {
  const attendanceRate = await employee.getAttendanceRate(startDate, endDate)
  const tasks = await employee.getAssignedTasks()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When updating performance rating (button/form submit)
await employee.updatePerformance(performanceRating)

// When viewing employee details (click)
const details = await employee.getFullDetails()

// When filtering employees (filter button)
const filtered = await User.getAll(newFilters)
```

### 2. Task Assignment Page (TaskAssignment class)
**Location:** `src/js/classes/manager.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get tasks
const tasks = await Task.getAll(filters)
const pendingTasks = await Task.getPending()
const inProgressTasks = await Task.getInProgress()
const overdueTasks = await Task.getOverdue()

// For each task, display info:
for (let task of tasks) {
  const assignee = await task.getAssignee()
  const daysRemaining = await task.getDaysRemaining()
}

// Get available employees for assignment dropdown
const employees = await User.getAll()
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When creating new task (form submit)
const task = await Task.create(taskData)
await task.assignTo(employeeId)
await task.notifyAssignee()

// When updating task (edit form submit)
await task.update(updatedData)

// When reassigning task (dropdown change + button)
await task.assignTo(newEmployeeId)
await task.notifyAssignee()

// When marking task complete (checkbox/button)
await task.markCompleted()

// When deleting task (delete button)
await task.delete()
```

### 3. Stock Management Page (StockManagement class)
**Location:** `src/js/classes/manager.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get inventory
const products = await Product.getAll(filters)
const lowStockItems = await Product.getLowStockItems()
const criticalStockItems = await Product.getCriticalStockItems()

// For each product, display status:
for (let product of products) {
  await product.checkStockStatus()
  const isLow = await product.isLowStock()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When adjusting stock (form submit)
await product.updateStock(newQuantity)

// When adding new product (create button)
await Product.create(productData)

// When requesting restock (button click)
await product.requestRestock(quantity)

// When updating product info (edit form)
await product.update(updatedData)
```

### 4. Customer Feedback Page (CustomerFeedback class)
**Location:** `src/js/classes/manager.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get feedback
const allFeedback = await CustomerFeedback.getAll(filters)
const pendingFeedback = await CustomerFeedback.getPending()
const averageRating = await CustomerFeedback.getAverageRating(startDate, endDate)

// For each feedback, display info:
for (let feedback of allFeedback) {
  const customer = await feedback.getCustomer()
  const order = await feedback.getOrder()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When responding to feedback (submit response form)
await feedback.addResponse(response)
await feedback.notifyCustomer()

// When marking as resolved (button click)
await feedback.markResolved()

// When filtering feedback (filter button)
const filtered = await CustomerFeedback.getAll(newFilters)

// When viewing feedback details (click)
const details = await feedback.getFullDetails()
```

### 5. Delivery Tracking Page (DeliveryTracking class)
**Location:** `src/js/classes/manager.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get deliveries
const deliveries = await Delivery.getAll(filters)
const inTransit = await Delivery.getInTransit()
const pending = await Delivery.getPending()
const completed = await Delivery.getCompleted()

// For each delivery, display info:
for (let delivery of deliveries) {
  const order = await delivery.getOrder()
  const driver = await delivery.getDriver()
  const vehicle = await delivery.getVehicle()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When updating delivery status (button/dropdown)
await delivery.updateStatus(newStatus)

// When assigning driver (dropdown + assign button)
await delivery.assignDriver(driverId)

// When assigning vehicle (dropdown + assign button)
await delivery.assignVehicle(vehicleId)

// When viewing delivery details (click)
const details = await delivery.getFullDetails()

// When marking delivery complete (button)
await delivery.markCompleted()
```

---

## Salesman Dashboard

### 1. Sales Orders Page (SalesOrders class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get orders
const orders = await SalesOrder.getAll(filters)
const pendingOrders = await SalesOrder.getPendingOrders()
const todaysOrders = await SalesOrder.getTodaysOrders()

// For each order, display info:
for (let order of orders) {
  const customer = await order.getCustomer()
  const items = await order.getItems()
  const total = await order.calculateTotal()
}

// Get customers for dropdown
const customers = await Customer.getAll()

// Get products for order items
const products = await Product.getAll()
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When creating new order (submit form)
const order = await SalesOrder.create(orderData)
await order.addItem(productId, quantity, unitPrice)
await order.calculateTotal()
await order.createTransaction(paymentMethod, amount)

// When adding item to order (add item button)
await order.addItem(productId, quantity, unitPrice)
await order.calculateTotal()

// When removing item from order (remove button)
await order.removeItem(itemId)
await order.calculateTotal()

// When updating order (edit form submit)
await order.update(updatedData)

// When canceling order (cancel button)
await order.cancel()

// When generating invoice (button click)
await order.generateInvoice()

// When sending confirmation (button click)
await order.sendConfirmationEmail()
```

### 2. Stock Availability Page (StockAvailability class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get products
const products = await Product.getAll(filters)
const lowStockItems = await Product.getLowStockItems()
const criticalStockItems = await Product.getCriticalStockItems()

// For each product, display availability:
for (let product of products) {
  await product.checkStockStatus()
  const isLow = await product.isLowStock()
  const isCritical = await product.isCritical()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When checking specific product availability (search/click)
await product.checkStock()

// When filtering products (filter button)
const filtered = await Product.getAll(newFilters)

// When viewing product details (click)
const details = await product.getFullDetails()
```

### 3. Customer Accounts Page (CustomerAccounts class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get customers
const customers = await Customer.getAll(filters)
const topCustomers = await Customer.getTopCustomers(limit)

// For each customer, display info:
for (let customer of customers) {
  const orders = await customer.getSalesOrders()
  const totalSpent = await customer.getTotalSpent(startDate, endDate)
  const avgOrderValue = await customer.getAverageOrderValue()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When creating new customer (form submit)
await Customer.create(customerData)

// When updating customer info (edit form)
await customer.update(updatedData)

// When viewing customer details (click)
const details = await customer.getFullDetails()

// When filtering customers (filter button)
const filtered = await Customer.getAll(newFilters)
```

### 4. Sales Reports Page (SalesReports class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get sales data
const dailySales = await SalesOrder.getTotalSales(startDate, endDate)
const topProducts = await Product.getAll({ sortBy: 'sales', limit: 10 })

// Get initial report:
await FinancialReport.getDailyReport(date)
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When changing report period (date picker)
await FinancialReport.getDailyReport(newDate)
await FinancialReport.getWeeklyReport(year, week)
await FinancialReport.getMonthlyReport(year, month)

// When exporting report (export button)
await report.exportToPDF()
await report.exportToExcel()
await report.exportToCSV()

// When generating custom report (button)
await FinancialReport.generateCustomReport(params)
```

### 5. Returns & Cancellations Page (ReturnsAndCancellations class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get refunds
const refunds = await Refund.getAll(filters)
const pendingRefunds = await Refund.getPending()
const totalRefunded = await Refund.getTotalRefunded(startDate, endDate)

// For each refund, display info:
for (let refund of refunds) {
  const transaction = await refund.getTransaction()
  const customer = await refund.getCustomer()
}

// Get cancelled orders:
const cancelledOrders = await SalesOrder.getByStatus('cancelled')
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When processing refund (approve button)
await refund.approve(processedBy)

// When rejecting refund (reject button)
await refund.reject(processedBy, reason)

// When creating new refund request (form submit)
await Refund.create(refundData)

// When restocking items (checkbox + button)
await refund.restockItems()

// When generating refund receipt (button)
await refund.generateRefundReceipt()
```

### 6. Promotions & Pricing Page (PromotionsAndPricing class)
**Location:** `src/js/classes/salesman.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get promotions
const promotions = await Promotion.getAll(filters)
const activePromotions = await Promotion.getActive()
const upcomingPromotions = await Promotion.getUpcoming()

// For each promotion, display info:
for (let promotion of promotions) {
  const products = await promotion.getApplicableProducts()
  const isActive = await promotion.isActive()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When calculating discount for order (input change)
const discount = await promotion.calculateDiscount(amount)

// When viewing promotion details (click)
const details = await promotion.getFullDetails()

// When applying promotion to order (button)
await order.applyPromotion(promotionId)

// When filtering promotions (filter button)
const filtered = await Promotion.getAll(newFilters)
```

---

## Cashier Dashboard

### 1. Sales Transaction Page (SalesTransaction class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get products for sale
const products = await Product.getAll(filters)
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When adding to cart (add button)
await product.checkStock()

// When creating transaction (checkout button)
await SalesOrder.create(orderData)
await OrderItem.create(itemData)
await order.calculateTotal()
await order.createTransaction(paymentMethod, amount)

// When removing from cart (remove button)
await order.removeItem(itemId)
await order.calculateTotal()

// When updating quantity (input change)
await product.checkStock()
await order.calculateTotal()
```

### 2. Payment Processing Page (PaymentProcessing class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get transactions
const transactions = await Transaction.getAll(filters)
const todaysTransactions = await Transaction.getTodaysTransactions()
const totalAmount = await Transaction.getTotalAmount(startDate, endDate)
const byPaymentMethod = await Transaction.getByPaymentMethod(method)
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When processing payment (pay button)
await Transaction.create(transactionData)
await transaction.markCompleted()
await transaction.verifyPayment()
await transaction.createReceipt()

// When viewing transaction details (click)
const details = await transaction.getFullDetails()

// When voiding transaction (void button)
await transaction.void()

// When filtering transactions (filter button)
const filtered = await Transaction.getAll(newFilters)
```

### 3. Receipt Management Page (ReceiptManagement class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get receipts
const receipts = await Receipt.getAll(filters)
const printedReceipts = await Receipt.getPrinted()
const pendingReceipts = await Receipt.getPending()

// For each receipt, display info:
for (let receipt of receipts) {
  const transaction = await receipt.getTransaction()
  const order = await receipt.getOrder()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When printing receipt (print button)
await receipt.print()
await receipt.markAsPrinted()

// When emailing receipt (email button + form)
await receipt.email(emailAddress)
await receipt.markAsEmailed()

// When generating PDF (download button)
await receipt.generatePDF()

// When generating HTML preview (preview button)
await receipt.generateHTML()

// When reprinting receipt (reprint button)
await receipt.print()
```

### 4. Cash Flow Summary Page (CashFlowSummary class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get cash flow data
const allCashFlow = await CashFlow.getAll(filters)
const totalInflow = await CashFlow.getTotalInflow(startDate, endDate)
const totalOutflow = await CashFlow.getTotalOutflow(startDate, endDate)
const netFlow = await CashFlow.getNetFlow(startDate, endDate)
const dailySummary = await CashFlow.getDailySummary(date)
const monthlySummary = await CashFlow.getMonthlySummary(year, month)
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When changing date range (date picker)
const newInflow = await CashFlow.getTotalInflow(newStartDate, newEndDate)
const newOutflow = await CashFlow.getTotalOutflow(newStartDate, newEndDate)
const newNetFlow = await CashFlow.getNetFlow(newStartDate, newEndDate)

// When exporting summary (export button)
await cashFlow.exportToExcel()
await cashFlow.exportToPDF()

// When viewing details (click)
const details = await cashFlow.getDetails()
```

### 5. Refund Management Page (RefundManagement class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get refunds
const refunds = await Refund.getAll(filters)
const pendingRefunds = await Refund.getPending()
const approvedRefunds = await Refund.getApproved()
const totalRefunded = await Refund.getTotalRefunded(startDate, endDate)

// For each refund, display info:
for (let refund of refunds) {
  const transaction = await refund.getTransaction()
  const customer = await refund.getCustomer()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When approving refund (approve button)
await refund.approve(processedBy)

// When rejecting refund (reject button)
await refund.reject(processedBy, reason)

// When processing refund (process button)
await refund.process()

// When restocking items (checkbox + button)
await refund.restockItems()

// When generating refund receipt (button)
await refund.generateRefundReceipt()

// When creating new refund (form submit)
await Refund.create(refundData)
```

### 6. Financial Reports Page (FinancialReports class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get reports
await FinancialReport.getDailyReport(date)
await FinancialReport.getWeeklyReport(year, week)
await FinancialReport.getMonthlyReport(year, month)

// Calculate metrics:
await FinancialReport.calculateTotalSales()
await FinancialReport.calculateTotalExpenses()
await FinancialReport.calculateNetProfit()
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When changing report period (date picker)
await FinancialReport.getDailyReport(newDate)
await FinancialReport.getWeeklyReport(newYear, newWeek)
await FinancialReport.getMonthlyReport(newYear, newMonth)

// When exporting reports (export button)
await report.exportToPDF()
await report.exportToExcel()
await report.exportToCSV()

// When generating custom report (button)
await FinancialReport.generateCustomReport(params)
```

### 7. Buyer Tracking Page (BuyerTracking class)
**Location:** `src/js/classes/cashier.js`

**Methods to call in `init()` (Page Load):**
```javascript
// Get buyers/customers
const customers = await Customer.getAll(filters)
const vipCustomers = await Customer.getVIPCustomers()
const topCustomers = await Customer.getTopCustomers(limit)

// For each buyer, display info:
for (let customer of customers) {
  const orders = await customer.getSalesOrders()
  const totalSpent = await customer.getTotalSpent(startDate, endDate)
  const avgOrderValue = await customer.getAverageOrderValue()
}
```

**Methods to call in Event Handlers (User Actions):**
```javascript
// When customer makes purchase (checkout)
await customer.updateLastVisit()
await customer.updateTotalPurchases()

// When promoting to VIP (button click)
await customer.promoteToVIP()

// When viewing customer details (click)
const details = await customer.getFullDetails()

// When updating customer info (edit form)
await customer.update(updatedData)

// When filtering customers (filter button)
const filtered = await Customer.getAll(newFilters)
```

---

## Common Patterns

### ✅ Methods to Call in `init()` (Page Load)
1. Call static methods to **fetch initial data** from the database
2. Store the data in class properties
3. For each item, call instance methods to **get related data or calculate metrics** for display
4. Render the HTML with the fetched data

**Examples:**
- `await Product.getAll()` - Fetch all products
- `await SalesOrder.getTodaysOrders()` - Get today's orders
- `await product.checkStockStatus()` - Check if product is low/critical
- `await customer.getTotalSpent()` - Calculate total spent for display

### ❌ Methods to Call in Event Handlers (User Actions)
1. Call methods that **create, update, or delete** data
2. Call methods that **perform actions** like sending emails, printing, exporting
3. Call methods that **change state** or **trigger workflows**
4. Update the local state
5. Re-render the affected section
6. Show success/error message

**Examples:**
- `await SalesOrder.create()` - Create new order (form submit)
- `await receipt.print()` - Print receipt (button click)
- `await task.assignTo()` - Assign task (dropdown + button)
- `await refund.approve()` - Approve refund (button click)

### Example Flow - Creating a Sales Order:
```javascript
// IN init() - Load initial data
async init() {
  // Fetch data to display
  this.products = await Product.getAll();
  this.customers = await Customer.getAll();
  this.orders = await SalesOrder.getAll();
  
  this.render();
  this.attachEventListeners(); // Setup button handlers
}

// IN EVENT HANDLER - Create order when button clicked
async handleCreateOrder(e) {
  e.preventDefault();
  
  // 1. Get form data
  const orderData = {
    customerId: this.selectedCustomer,
    salesmanId: this.currentUser.id,
    // ... other fields
  };
  
  // 2. Create the order (USER ACTION)
  const order = await SalesOrder.create(orderData);
  
  // 3. Add items to order (USER ACTION)
  for (let item of this.cartItems) {
    await order.addItem(item.productId, item.quantity, item.unitPrice);
  }
  
  // 4. Calculate totals
  await order.calculateSubtotal();
  await order.calculateTax();
  await order.calculateTotal();
  
  // 5. Create transaction (USER ACTION)
  await order.createTransaction(this.paymentMethod, this.amount);
  
  // 6. Generate receipt (USER ACTION)
  const receipt = await order.generateInvoice();
  
  // 7. Send confirmation (USER ACTION)
  await order.sendConfirmationEmail();
  
  // 8. Update UI
  this.orders.push(order);
  this.render();
  this.showSuccessMessage('Order created successfully!');
}
```

---

## Important Notes

1. **All methods marked with `TODO:` in the code need to be implemented**
2. **The `init()` method should be called in the constructor and only contain data fetching**
3. **Action methods (create, update, delete, print, etc.) should be in event handlers, NOT in `init()`**
4. **Methods are async - always use `await`**
5. **Handle errors with try-catch blocks**
6. **Update the UI after successful operations**
7. **Validate data before calling create/update methods**
8. **Show loading states during async operations**
9. **Display success/error messages after user actions**

## Next Steps

For each page section:
1. ✅ Method calls have been added as TODO comments
2. ⏳ Implement the actual API calls in the model files
3. ⏳ Replace hardcoded data with real API responses
4. ⏳ Add error handling
5. ⏳ Add loading states
6. ⏳ Test each functionality

You can now implement the actual logic inside each model method in the `src/js/models/` folder!
