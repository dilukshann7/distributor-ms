# Distributor Management System - Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     User                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - name: String                                                                   │
│ - email: String                                                                  │
│ - password: String                                                               │
│ - role: String                                                                   │
│ - phone: String                                                                  │
│ - address: String                                                                │
│ - status: String                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllUsers(): Promise                                                         │
│ + createUser(user: Object): Promise                                              │
│ + updateUser(id: Int, user: Object): Promise                                     │
│ + deleteUser(id: Int): Promise                                                   │
│ + getProfileData(user: Object): Object                                           │
│ + exportEmployeeReport(): Promise                                                │
│ + logout(): Promise                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        △
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
          ┌──────────┴─────────┐ ┌─────┴──────┐ ┌────────┴────────┐
          │       Owner        │ │   Manager  │ │ AssistantManager│
          ├────────────────────┤ ├────────────┤ ├─────────────────┤
          │ - userId: Int      │ │ - userId:  │ │ - userId: Int   │
          │                    │ │   Int      │ │ - salary: Float │
          ├────────────────────┤ ├────────────┤ │ - bonus: Float  │
          │                    │ │            │ │ - attendance:   │
          └────────────────────┘ └────────────┘ │   String        │
                                                 │ - performance   │
                     ┌──────────────────┬────────┤   Rating: Int   │
                     │                  │        ├─────────────────┤
          ┌──────────┴─────────┐ ┌─────┴──────┐ │ + getAll():     │
          │      Cashier       │ │  Salesman  │ │   Promise       │
          ├────────────────────┤ ├────────────┤ │ + findById(id): │
          │ - userId: Int      │ │ - userId:  │ │   Promise       │
          │ - salary: Float    │ │   Int      │ │ + create(data): │
          │ - bonus: Float     │ │ - sales    │ │   Promise       │
          │ - attendance:      │ │   Target:  │ │ + update(id,    │
          │   String           │ │   Float    │ │   data): Promise│
          │ - performance      │ │ - total    │ │ + delete(id):   │
          │   Rating: Int      │ │   Sales:   │ │   Promise       │
          ├────────────────────┤ │   Float    │ └─────────────────┘
          │ + getAllCashiers():│ │ - commission│
          │   Promise          │ │   Float    │
          │ + findCashierById  │ │ - salary:  │
          │   (id): Promise    │ │   Float    │
          │ + createCashier    │ │ - bonus:   │
          │   (data): Promise  │ │   Float    │
          │ + updateCashier(id,│ │ - attendance│
          │   data): Promise   │ │   String   │
          │ + deleteCashier(id)│ │ - performance│
          │   Promise          │ │   Rating:  │
          └────────────────────┘ │   Int      │
                                 ├────────────┤
          ┌──────────────────┬──┤ + getAllSalesmen│
          │                  │  │   (): Promise│
          │                  │  │ + findSalesman│
     ┌────┴────────┐  ┌──────┴──┤   ById(id):│
     │ StockKeeper │  │  Driver │   Promise  │
     ├─────────────┤  ├─────────┤ + createSalesman│
     │ - userId:   │  │ - userId│   (data):  │
     │   Int       │  │   Int   │   Promise  │
     │ - salary:   │  │ - vehicle│ + updateSalesman│
     │   Float     │  │   Id:   │   (id,data):│
     │ - bonus:    │  │   String│   Promise  │
     │   Float     │  │ - vehicle│ + deleteSalesman│
     │ - attendance│  │   Type: │   (id):    │
     │   String    │  │   String│   Promise  │
     │ - performance│ │ - license│ + exportSalesman│
     │   Rating:   │  │   Number│   Report   │
     │   Int       │  │   String│   (startDate,│
     ├─────────────┤  │ - current│   endDate):│
     │ + getAllStock│ │   Location│   Promise│
     │   Keepers():│  │   String│            │
     │   Promise   │  │ - salary│            │
     │ + findStock │  │   Float │            │
     │   KeeperById│  │ - bonus:│            │
     │   (id):     │  │   Float │            │
     │   Promise   │  │ - attendance│        │
     │ + createStock│ │   String│            │
     │   Keeper    │  │ - performance│       │
     │   (data):   │  │   Rating:│           │
     │   Promise   │  │   Int   │            │
     │ + updateStock│ ├─────────┤            │
     │   Keeper(id,│  │ + getAllDrivers│     │
     │   data):    │  │   (): Promise│       │
     │   Promise   │  │ + findDriverById│    │
     │ + deleteStock│ │   (id): │            │
     │   Keeper(id)│  │   Promise│           │
     │   Promise   │  │ + createDriver│      │
     │ + export    │  │   (data):│           │
     │   StockReport│ │   Promise│           │
     │   (): Promise│ │ + updateDriver│      │
     └─────────────┘  │   (id,data):│        │
                      │   Promise│           │
     ┌──────────────┬─┤ + deleteDriver│      │
     │              │ │   (id): │            │
     │              │ │   Promise│           │
┌────┴────────┐ ┌───┴─┤ + updateDistributor│      │
│ Distributor │ │Supplier│(id,data):│          │
├─────────────┤ ├────────┤Promise│            │
│ - userId:   │ │ - userId│ + deleteDistributor│
│   Int       │ │   Int  │   (id): │          │
│ - salary:   │ │ - company│   Promise│        │
│   Float     │ │   Name:│        │         │
│ - bonus:    │ │   String│      │         │
│   Float     │ │ - supplier│    │         │
│ - attendance│ │   Type:│        │          │
│   String    │ │   String│       │          │
│ - performance│├────────┤       │           │
│   Rating:   │ │ + getAllSuppliers│        │
│   Int       │ │   (): Promise│  │           │
├─────────────┤ │ + findSupplierById│        │
│ + getAllDistributors│   (id): │ │          │
│   (): Promise│   Promise│    │            │
│ + findDistributor│ + createSupplier│      │
│   ById(id): │ │   (data):│    │            │
│   Promise   │ │   Promise│    │            │
│ + createDistributor│ + updateSupplier│    │
│   (data):   │ │   (id,data):│ │            │
│   Promise   │ │   Promise│    │            │
│ + updateDistributor│ + deleteSupplier│    │
│   (id,data):│ │   (id): │     │            │
│   Promise   │ │   Promise│    │            │
│ + deleteDistributor│ + exportSupplier│    │
│   (id):     │ │   Report(start│ │          │
│   Promise   │ │   Date,endDate)│           │
└─────────────┘ │   Promise│    │            │
                └────────────    │            │
                                └────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   Product                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - name: String                                                                   │
│ - sku: String                                                                    │
│ - description: String                                                            │
│ - category: String                                                               │
│ - price: Float                                                                   │
│ - quantity: Int                                                                  │
│ - location: String                                                               │
│ - supplierId: Int                                                                │
│ - batchNumber: String                                                            │
│ - expiryDate: DateTime                                                           │
│ - status: String                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllProducts(filters: Object): Promise                                       │
│ + createProduct(product: Object): Promise                                        │
│ + updateProduct(id: Int, product: Object): Promise                               │
│ + deleteProduct(id: Int): Promise                                                │
│ + exportInventoryReport(): Promise                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        △
                                        │ supplies
                                        │
                          ┌─────────────┴─────────────┐
                          │        Supplier           │
                          └───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     Order                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - orderNumber: String                                                            │
│ - orderType: String                                                              │
│ - orderDate: DateTime                                                            │
│ - status: String                                                                 │
│ - totalAmount: Float                                                             │
│ - items: Json                                                                    │
│ - notes: String                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllOrders(filters: Object): Promise                                         │
│ + getOrderById(id: Int): Promise                                                 │
│ + getOrdersByType(orderType: String): Promise                                    │
│ + getDailyOrders(): Promise                                                      │
│ + getWeeklyOrders(): Promise                                                     │
│ + getMonthlyOrders(): Promise                                                    │
│ + getOrderSummary(): Promise                                                     │
│ + updateOrder(id: Int, orderData: Object): Promise                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        △
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
          ┌──────────┴─────────┐ ┌─────┴──────────┐ ┌────┴────────────┐
          │   PurchaseOrder    │ │   SalesOrder   │ │   RetailOrder   │
          ├────────────────────┤ ├────────────────┤ ├─────────────────┤
          │ - orderId: Int     │ │ - orderId: Int │ │ - orderId: Int  │
          │ - supplierId: Int  │ │ - customerId:  │ │ - cartId: Int   │
          │ - dueDate: DateTime│ │   Int          │ │                 │
          ├────────────────────┤ │ - customerName:│ ├─────────────────┤
          │ + create(data):    │ │   String       │ │ + getAll():     │
          │   Promise          │ │ - paymentStatus│ │   Promise       │
          │ + getAll():        │ │   String       │ │ + getById(id):  │
          │   Promise          │ │ - driverId: Int│ │   Promise       │
          │ + getById(id):     │ │ - deliveryId:  │ │ + create(data): │
          │   Promise          │ │   Int          │ │   Promise       │
          │ + update(id,data): │ ├────────────────┤ │ + update(id,    │
          │   Promise          │ │ + getAll(      │ │   data): Promise│
          │ + delete(id):      │ │   filters):    │ │ + delete(id):   │
          │   Promise          │ │   Promise      │ │   Promise       │
          │ + getDailyOrders():│ │ + getById(id): │ │ + export        │
          │   Promise          │ │   Promise      │ │   RetailOrder   │
          │ + getWeekly        │ │ + create(data):│ │   Report(start  │
          │   Orders():Promise │ │   Promise      │ │   Date,endDate):│
          │ + getMonthly       │ │ + update(id,   │ │   Promise       │
          │   Orders():Promise │ │   data): Promise│└─────────────────┘
          │ + getSummary():    │ │ + delete(id):  │
          │   Promise          │ │   Promise      │
          └────────────────────┘ │ + assignDriver │
                                 │   (id,driverId)│
                                 │   Promise      │
                                 │ + exportSales  │
                                 │   Report(start │
                                 │   Date,endDate)│
                                 │   Promise      │
                                 └────────────────┘

┌────────────────────────────────┐
│         smallOrder             │
├────────────────────────────────┤
│                                │
├────────────────────────────────┤
│ + getAllSmallOrders(): Promise │
│ + createSmallOrder(orderData): │
│   Promise                      │
│ + exportSmallOrderReport(      │
│   startDate: Date,             │
│   endDate: Date): Promise      │
└────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   Invoice                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - invoiceNumber: String                                                          │
│ - invoiceType: String                                                            │
│ - orderId: Int                                                                   │
│ - invoiceDate: DateTime                                                          │
│ - dueDate: DateTime                                                              │
│ - totalAmount: Float                                                             │
│ - status: String                                                                 │
│ - notes: String                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllInvoices(filters: Object): Promise                                       │
│ + getInvoiceById(id: Int): Promise                                               │
│ + getInvoicesByType(invoiceType: String): Promise                                │
│ + getInvoiceByOrderId(orderId: Int): Promise                                     │
│ + updateInvoice(id: Int, invoiceData: Object): Promise                           │
│ + getInvoiceSummary(): Promise                                                   │
│ + getOverdueInvoices(): Promise                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        △
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                     │
          ┌──────────┴──────────────┐         ┌───────────┴─────────────┐
          │   PurchaseInvoice       │         │     SalesInvoice        │
          ├─────────────────────────┤         ├─────────────────────────┤
          │ - invoiceId: Int        │         │ - invoiceId: Int        │
          │ - purchaseOrderId: Int  │         │ - salesOrderId: Int     │
          │ - supplierId: Int       │         │ - customerId: Int       │
          │ - paidDate: DateTime    │         │ - deliveryId: Int       │
          │ - paidAmount: Float     │         │ - paymentMethod: String │
          │ - balance: Float        │         │ - items: Json           │
          ├─────────────────────────┤         │ - subtotal: Float       │
          │ + create(data): Promise │         │ - collectedAmount:Float │
          │ + getAll(filters):      │         │ - collectedAt: DateTime │
          │   Promise               │         ├─────────────────────────┤
          │ + getById(id): Promise  │         │ + getAll(filters):      │
          │ + update(id, data):     │         │   Promise               │
          │   Promise               │         │ + getById(id): Promise  │
          │ + markAsPaid(id,        │         │ + getByDriver(driverId):│
          │   paymentData): Promise │         │   Promise               │
          └─────────────────────────┘         │ + create(data): Promise │
                                              │ + update(id, data):     │
                                              │   Promise               │
                                              │ + collect(id,           │
                                              │   collectionData):      │
                                              │   Promise               │
                                              └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  Customer                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - name: String                                                                   │
│ - email: String                                                                  │
│ - phone: String                                                                  │
│ - address: String                                                                │
│ - businessName: String                                                           │
│ - customerType: String                                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllCustomers(filters: Object): Promise                                      │
│ + createCustomer(customerData: Object): Promise                                  │
│ + deleteCustomer(customerID: Int): Promise                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ 1 places *
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 SalesOrder                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   Payment                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - salesOrderId: Int                                                              │
│ - amount: Float                                                                  │
│ - paymentDate: DateTime                                                          │
│ - paymentMethod: String                                                          │
│ - status: String                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllPayments(filters: Object): Promise                                       │
│ + createPayment(payment: Object): Promise                                        │
│ + updatePayment(paymentId: Int, updates: Object): Promise                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ * belongs to 1
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 SalesOrder                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  Delivery                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - deliveryNumber: String                                                         │
│ - driverId: Int                                                                  │
│ - vehicleId: Int                                                                 │
│ - deliveryAddress: String                                                        │
│ - scheduledDate: DateTime                                                        │
│ - deliveredDate: DateTime                                                        │
│ - estimatedTime: Int                                                             │
│ - status: String                                                                 │
│ - notes: String                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllDeliveries(filters: Object): Promise                                     │
│ + createDelivery(data: Object): Promise                                          │
│ + updateDelivery(id: Int, data: Object): Promise                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ 1 handled by 1
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   Driver                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    Cart                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - items: Json                                                                    │
│ - totalAmount: Float                                                             │
│ - status: String                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllCarts(): Promise                                                         │
│ + createCart(cartData: Object): Promise                                          │
│ + updateCart(cartId: Int, cartData: Object): Promise                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ 1 used in 1
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                RetailOrder                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    Task                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - title: String                                                                  │
│ - description: String                                                            │
│ - assigneeId: Int                                                                │
│ - assignerId: Int                                                                │
│ - dueDate: DateTime                                                              │
│ - priority: String                                                               │
│ - status: String                                                                 │
│ - completedDate: DateTime                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ + getAllTasks(filters: Object): Promise                                          │
│ + createTask(task: Object): Promise                                              │
│ + updateTask(id: Int, task: Object): Promise                                     │
│ + deleteTask(id: Int): Promise                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                │                              │
                │ * assigned to 1              │ * created by 1
                │                              │
                ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    User                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  Shipment                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - shipmentNumber: String                                                         │
│ - purchaseOrderId: Int                                                           │
│ - supplierId: Int                                                                │
│ - shipmentDate: DateTime                                                         │
│ - expectedDeliveryDate: DateTime                                                 │
│ - actualDeliveryDate: DateTime                                                   │
│ - carrier: String                                                                │
│ - status: String                                                                 │
│ - notes: String                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ * belongs to 1
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PurchaseOrder                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               Supply                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - name: String                                                                   │
│ - sku: String                                                                    │
│ - category: String                                                               │
│ - supplierId: Int                                                                │
│ - stock: Int                                                                     │
│ - price: Float                                                                   │
│ - status: String                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                │
                │ * supplied by 1
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               Supplier                                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CustomerFeedback                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ - id: Int                                                                        │
│ - customerId: Int                                                                │
│ - salesOrderId: Int                                                              │
│ - comment: String                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                │                              │
                │ * given by 1                 │ * for 1
                │                              │
                ▼                              ▼
┌─────────────────────────┐      ┌─────────────────────────────────┐
│       Customer          │      │         SalesOrder              │
└─────────────────────────┘      └─────────────────────────────────┘

```

## Key Relationships:

### Inheritance Hierarchy:
- **User** (Parent Class)
  - Owner
  - Manager
  - AssistantManager
  - Cashier
  - Salesman
  - StockKeeper
  - Driver
  - Supplier
  - Distributor

- **Order** (Parent Class - Class Table Inheritance)
  - PurchaseOrder (orders TO suppliers)
  - SalesOrder (orders FROM customers)
  - RetailOrder (walk-in/counter sales)

- **Invoice** (Parent Class - Class Table Inheritance)
  - PurchaseInvoice (invoices FROM suppliers)
  - SalesInvoice (invoices TO customers)

### Associations:
1. **Customer** ──1:*──> **SalesOrder** (places orders)
2. **SalesOrder** ──1:*──> **Payment** (has payments)
3. **Driver** ──1:*──> **Delivery** (handles deliveries)
4. **Driver** ──1:*──> **SalesOrder** (assigned to orders)
5. **Supplier** ──1:*──> **PurchaseOrder** (receives orders)
6. **Supplier** ──1:*──> **Product** (supplies products)
7. **Supplier** ──1:*──> **Supply** (manages supplies)
8. **PurchaseOrder** ──1:*──> **Shipment** (has shipments)
9. **Cart** ──1:1──> **RetailOrder** (used in retail orders)
10. **User** ──1:*──> **Task** (assigned tasks / creates tasks)
11. **Order** ──1:*──> **Invoice** (generates invoices)
12. **Customer** ──1:*──> **CustomerFeedback** (provides feedback)
13. **SalesOrder** ──1:*──> **CustomerFeedback** (receives feedback)
14. **Delivery** ──1:*──> **SalesOrder** (delivers orders)
15. **Delivery** ──1:*──> **SalesInvoice** (links to invoices)

## Legend:
- `+` = Public method
- `-` = Private attribute
- `△` = Inheritance (extends)
- `──>` = Association
- `1:*` = One-to-Many relationship
- `1:1` = One-to-One relationship
