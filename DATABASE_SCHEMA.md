# Distribution Management System - Database Schema

## Overview
This document outlines the complete database schema for the ADP Namasinghe Distribution Management System. The schema supports nine user roles with comprehensive features for inventory, sales, deliveries, and financial management.

---

## **1. User/Employee Class**

Manages all system users including staff and administrators.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `name` (String) - Full name
- `email` (String, unique) - Email address for login
- `password` (String, hashed) - Encrypted password
- `role` (Enum) - User role: Owner, Manager, Assistant Manager, Stock Keeper, Cashier, Supplier, Distributor, Salesman, Driver
- `phone` (String) - Contact number
- `salary` (Decimal) - Monthly salary
- `bonus` (Decimal) - Performance bonus
- `attendance` (Integer/Percentage) - Attendance rate
- `status` (Enum) - Active, Inactive, On Leave
- `performance` (Enum) - Excellent, Good, Average, Poor
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Has many Tasks (as assignee)
- Has many SalesOrders (as salesman)
- Has many Deliveries (as driver)
- Has many Transactions (as cashier)
- Has many StockAudits (as auditor)

---

## **2. Product/Inventory Class**

Manages all product inventory and stock information.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `name` (String) - Product name
- `sku` (String, unique) - Stock Keeping Unit code
- `quantity` (Integer) - Current stock quantity
- `minStock` (Integer) - Minimum stock threshold
- `maxStock` (Integer) - Maximum stock capacity
- `price` (Decimal) - Unit price
- `status` (Enum) - In Stock, Low Stock, Critical, Out of Stock
- `expiryDate` (Date) - Product expiry date
- `batchNumber` (String) - Batch identification
- `location` (String) - Warehouse location (e.g., "A1-01")
- `unit` (String) - Unit of measurement (Boxes, Cartons, Bottles, etc.)
- `supplierId` (Foreign Key) - Reference to Supplier
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Supplier
- Has many OrderItems
- Has many StockAudits

---

## **3. Supplier Class**

Manages supplier information and contracts.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `name` (String) - Contact person name
- `companyName` (String) - Company name
- `email` (String) - Contact email
- `phone` (String) - Contact phone number
- `address` (String) - Business address
- `contractStartDate` (Date) - Contract start date
- `contractEndDate` (Date) - Contract end date
- `paymentTerms` (String) - Payment terms and conditions
- `status` (Enum) - Active, Inactive
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Has many Products
- Has many PurchaseOrders
- Has many Invoices
- Has many Shipments

---

## **4. PurchaseOrder Class**

Manages orders placed with suppliers.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `poNumber` (String, unique) - Purchase Order number
- `supplierId` (Foreign Key) - Reference to Supplier
- `orderDate` (Date) - Order placement date
- `expectedDate` (Date) - Expected delivery date
- `receivedDate` (Date, nullable) - Actual receipt date
- `totalItems` (Integer) - Total number of items
- `totalAmount` (Decimal) - Total order value
- `status` (Enum) - Pending, Received, Partial, Issues
- `notes` (Text) - Additional notes
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Supplier
- Has many Shipments
- Has one Invoice

---

## **5. Shipment Class**

Tracks incoming shipments from suppliers.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `shipmentNumber` (String, unique) - Shipment tracking number
- `poId` (Foreign Key) - Reference to PurchaseOrder
- `supplierId` (Foreign Key) - Reference to Supplier
- `trackingNumber` (String) - Carrier tracking number
- `status` (Enum) - Pending, In Transit, Delivered, Issue
- `issue` (String, nullable) - Issue description if any
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to PurchaseOrder
- Belongs to Supplier

---

## **6. Customer/Buyer Class**

Manages customer information and purchase history.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `name` (String) - Customer name
- `email` (String) - Customer email
- `phone` (String) - Contact number
- `address` (String) - Delivery address
- `totalPurchases` (Integer) - Total number of purchases
- `totalSpent` (Decimal) - Total amount spent
- `lastVisit` (Date) - Last transaction date
- `status` (Enum) - Active, Inactive, VIP
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Has many SalesOrders
- Has many Refunds
- Has many CustomerFeedback

---

## **7. SalesOrder Class**

Manages customer sales orders.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `orderNumber` (String, unique) - Order reference number
- `customerId` (Foreign Key) - Reference to Customer
- `salesmanId` (Foreign Key) - Reference to Employee (Salesman)
- `orderDate` (DateTime) - Order placement timestamp
- `subtotal` (Decimal) - Order subtotal
- `tax` (Decimal) - Tax amount
- `total` (Decimal) - Total amount including tax
- `status` (Enum) - Pending, Processing, Completed, Cancelled
- `paymentMethod` (Enum) - Cash, Card, Cheque, Credit
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Customer
- Belongs to Employee (Salesman)
- Has many OrderItems
- Has one Transaction
- Has one Delivery
- Has one Receipt

---

## **8. OrderItem Class**

Junction table connecting SalesOrders and Products.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `orderId` (Foreign Key) - Reference to SalesOrder
- `productId` (Foreign Key) - Reference to Product
- `quantity` (Integer) - Quantity ordered
- `unitPrice` (Decimal) - Price per unit
- `totalPrice` (Decimal) - Line total (quantity × unitPrice)
- `discount` (Decimal, nullable) - Discount applied

### Relationships:
- Belongs to SalesOrder
- Belongs to Product

---

## **9. Transaction/Payment Class**

Records all payment transactions.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `transactionId` (String, unique) - Transaction reference number
- `orderId` (Foreign Key) - Reference to SalesOrder
- `cashierId` (Foreign Key) - Reference to Employee (Cashier)
- `amount` (Decimal) - Transaction amount
- `paymentMethod` (Enum) - Cash, Card, Cheque, Mobile Payment
- `referenceNumber` (String, nullable) - Payment reference (e.g., cheque number)
- `status` (Enum) - Completed, Pending, Failed
- `timestamp` (DateTime) - Transaction timestamp
- `createdAt` (DateTime) - Record creation timestamp

### Relationships:
- Belongs to SalesOrder
- Belongs to Employee (Cashier)
- Has one Receipt
- Has one Refund (optional)

---

## **10. Receipt Class**

Manages transaction receipts.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `receiptNumber` (String, unique) - Receipt number
- `transactionId` (Foreign Key) - Reference to Transaction
- `orderId` (Foreign Key) - Reference to SalesOrder
- `amount` (Decimal) - Receipt amount
- `status` (Enum) - Printed, Pending, Emailed
- `printedAt` (DateTime, nullable) - Print timestamp
- `createdAt` (DateTime) - Record creation timestamp

### Relationships:
- Belongs to Transaction
- Belongs to SalesOrder

---

## **11. Refund Class**

Manages customer refunds and returns.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `refundNumber` (String, unique) - Refund reference number
- `transactionId` (Foreign Key) - Reference to original Transaction
- `customerId` (Foreign Key) - Reference to Customer
- `amount` (Decimal) - Refund amount
- `reason` (String) - Reason for refund
- `status` (Enum) - Approved, Pending, Rejected
- `processedBy` (Foreign Key) - Reference to Employee who processed
- `createdAt` (DateTime) - Record creation timestamp
- `processedAt` (DateTime, nullable) - Processing timestamp

### Relationships:
- Belongs to Transaction
- Belongs to Customer
- Belongs to Employee (processor)

---

## **12. Delivery Class**

Manages delivery operations and tracking.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `deliveryNumber` (String, unique) - Delivery reference number
- `orderId` (Foreign Key) - Reference to SalesOrder
- `driverId` (Foreign Key) - Reference to Employee (Driver)
- `vehicleId` (Foreign Key) - Reference to Vehicle
- `destination` (String) - Delivery address
- `route` (Text/JSON) - Route information
- `status` (Enum) - Pending, In Transit, Delivered, Failed
- `estimatedTime` (DateTime) - Estimated delivery time
- `actualTime` (DateTime, nullable) - Actual delivery time
- `proofOfDelivery` (String) - Image/file path for POD
- `signature` (String) - Image/file path for signature
- `notes` (Text) - Delivery notes
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to SalesOrder
- Belongs to Employee (Driver)
- Belongs to Vehicle

---

## **13. Task Class**

Manages task assignments and tracking.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `title` (String) - Task title
- `description` (Text) - Detailed description
- `assigneeId` (Foreign Key) - Reference to Employee (assignee)
- `assignedBy` (Foreign Key) - Reference to Employee (manager)
- `dueDate` (Date) - Task deadline
- `priority` (Enum) - High, Medium, Low
- `status` (Enum) - Pending, In Progress, Completed
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Employee (assignee)
- Belongs to Employee (assigner)

---

## **14. StockAudit Class**

Records inventory audit results.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `auditDate` (Date) - Date of audit
- `productId` (Foreign Key) - Reference to Product
- `physicalCount` (Integer) - Physical inventory count
- `systemCount` (Integer) - System recorded count
- `discrepancy` (Integer) - Calculated difference (physicalCount - systemCount)
- `status` (Enum) - Minor, Major, Resolved
- `auditorId` (Foreign Key) - Reference to Employee (auditor)
- `notes` (Text) - Audit notes
- `createdAt` (DateTime) - Record creation timestamp

### Relationships:
- Belongs to Product
- Belongs to Employee (auditor)

---

## **15. CashFlow Class**

Tracks daily cash flow movements.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `date` (Date) - Transaction date
- `inflow` (Decimal) - Money received
- `outflow` (Decimal) - Money spent
- `netFlow` (Decimal) - Calculated net (inflow - outflow)
- `description` (String) - Transaction description
- `category` (Enum) - Sales, Purchase, Salary, Expense, Refund, etc.
- `createdAt` (DateTime) - Record creation timestamp

### Relationships:
- None (aggregate data)

---

## **16. CustomerFeedback Class**

Manages customer feedback and reviews.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `customerId` (Foreign Key) - Reference to Customer
- `orderId` (Foreign Key, nullable) - Reference to SalesOrder
- `rating` (Integer) - Rating 1-5 stars
- `comment` (Text) - Feedback text
- `status` (Enum) - Pending, In Review, Resolved
- `createdAt` (DateTime) - Record creation timestamp
- `resolvedAt` (DateTime, nullable) - Resolution timestamp

### Relationships:
- Belongs to Customer
- Belongs to SalesOrder (optional)

---

## **17. Invoice Class**

Manages supplier invoices and payments.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `invoiceNumber` (String, unique) - Invoice number
- `supplierId` (Foreign Key) - Reference to Supplier
- `poId` (Foreign Key, nullable) - Reference to PurchaseOrder
- `amount` (Decimal) - Invoice amount
- `dueDate` (Date) - Payment due date
- `paidDate` (Date, nullable) - Actual payment date
- `status` (Enum) - Pending, Paid, Overdue, Partial
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Supplier
- Belongs to PurchaseOrder (optional)

---

## **18. Promotion Class**

Manages promotional campaigns and discounts.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `name` (String) - Promotion name
- `description` (Text) - Promotion details
- `discountPercentage` (Decimal) - Discount percentage
- `startDate` (Date) - Promotion start date
- `endDate` (Date) - Promotion end date
- `applicableProducts` (JSON/Array) - Array of product IDs
- `status` (Enum) - Active, Inactive, Expired
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Many-to-Many with Products (through applicableProducts)

---

## **19. Vehicle Class**

Manages delivery vehicle fleet.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `vehicleNumber` (String, unique) - Registration number
- `type` (String) - Vehicle type (Truck, Van, etc.)
- `capacity` (Decimal) - Load capacity
- `driverId` (Foreign Key, nullable) - Currently assigned driver
- `status` (Enum) - Active, Maintenance, Inactive
- `lastMaintenance` (Date) - Last maintenance date
- `nextMaintenance` (Date) - Next scheduled maintenance
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships:
- Belongs to Employee (Driver)
- Has many Deliveries

---

## **20. FinancialReport Class**

Stores generated financial reports.

### Attributes:
- `id` (Primary Key) - Unique identifier
- `reportType` (Enum) - Daily, Weekly, Monthly, Annual
- `period` (String) - Period identifier (e.g., "2024-10-19" or "2024-Week-42")
- `totalSales` (Decimal) - Total sales for period
- `totalExpenses` (Decimal) - Total expenses for period
- `netProfit` (Decimal) - Calculated profit (sales - expenses)
- `generatedBy` (Foreign Key) - Reference to Employee
- `createdAt` (DateTime) - Report generation timestamp

### Relationships:
- Belongs to Employee (report generator)

---

## Database Relationships Summary

### One-to-Many Relationships:
- **Supplier** → Products (One supplier supplies many products)
- **Supplier** → PurchaseOrders (One supplier has many purchase orders)
- **Supplier** → Shipments (One supplier sends many shipments)
- **Customer** → SalesOrders (One customer makes many orders)
- **Employee (Salesman)** → SalesOrders (One salesman handles many orders)
- **Employee (Driver)** → Deliveries (One driver makes many deliveries)
- **Employee (Cashier)** → Transactions (One cashier processes many transactions)
- **SalesOrder** → OrderItems (One order contains many items)
- **Product** → OrderItems (One product appears in many orders)
- **Vehicle** → Deliveries (One vehicle used for many deliveries)

### One-to-One Relationships:
- **SalesOrder** ↔ Transaction (One order has one transaction)
- **Transaction** ↔ Receipt (One transaction has one receipt)
- **SalesOrder** ↔ Delivery (One order has one delivery)
- **PurchaseOrder** ↔ Invoice (One PO typically has one invoice)

### Many-to-Many Relationships:
- **Products** ↔ **SalesOrders** (through OrderItems junction table)
- **Products** ↔ **Promotions** (through applicableProducts array/JSON)

---

## Indexes Recommendations

For optimal query performance, create indexes on:

1. **User/Employee**: `email`, `role`, `status`
2. **Product**: `sku`, `supplierId`, `status`
3. **Customer**: `email`, `phone`, `status`
4. **SalesOrder**: `orderNumber`, `customerId`, `salesmanId`, `orderDate`, `status`
5. **Transaction**: `transactionId`, `orderId`, `cashierId`, `timestamp`
6. **Delivery**: `deliveryNumber`, `orderId`, `driverId`, `status`
7. **PurchaseOrder**: `poNumber`, `supplierId`, `status`
8. **Receipt**: `receiptNumber`, `transactionId`
9. **Refund**: `refundNumber`, `transactionId`, `status`
10. **Task**: `assigneeId`, `status`, `dueDate`

---

## Data Validation Rules

### Required Fields:
- All `name`, `email`, `phone` fields
- All status fields must have default values
- All foreign keys must reference valid records

### Unique Constraints:
- Employee: `email`
- Product: `sku`
- All number fields: `orderNumber`, `transactionId`, `receiptNumber`, etc.

### Business Rules:
1. `minStock` must be less than `maxStock`
2. `quantity` cannot be negative
3. Order `total` = `subtotal` + `tax`
4. `discrepancy` = `physicalCount` - `systemCount`
5. `netFlow` = `inflow` - `outflow`
6. `netProfit` = `totalSales` - `totalExpenses`
7. Employee with role "Driver" can only be assigned to Deliveries
8. Employee with role "Cashier" can only be assigned to Transactions
9. Employee with role "Salesman" can only be assigned to SalesOrders

---

## Security Considerations

1. **Password Storage**: All passwords must be hashed using bcrypt or similar
2. **Role-Based Access**: Implement middleware to check user roles before data access
3. **Audit Trail**: Track all CREATE, UPDATE, DELETE operations with timestamps
4. **Data Encryption**: Encrypt sensitive fields like payment information
5. **API Rate Limiting**: Implement rate limiting to prevent abuse

---

## Version History

- **v1.0** - Initial schema design (2024-11-02)
  - 20 core entities
  - Complete relationships mapping
  - Index recommendations
  - Business rules documentation

---

## Notes

- All DateTime fields should store timezone information (UTC recommended)
- All Decimal fields for currency should use appropriate precision (e.g., DECIMAL(10,2))
- JSON fields require database support (PostgreSQL, MySQL 5.7+, etc.)
- Consider implementing soft deletes for critical data (add `deletedAt` field)
- Implement database migrations for version control
- Use database views for complex reporting queries
- Consider partitioning large tables (e.g., Transactions, OrderItems) by date

---

**End of Database Schema Documentation**
