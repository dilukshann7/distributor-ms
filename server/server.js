import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const app = express();
import cors from "cors";

const prisma = new PrismaClient();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      include: {
        driverProfile: true,
        managerProfile: true,
        salesmanProfile: true,
        stockKeeperProfile: true,
        cashierProfile: true,
        supplierProfile: true,
        distributorProfile: true,
        assistantManagerProfile: true,
      },
    });
    res.json(users);
  })
);

app.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  })
);

app.post(
  "/api/products",
  asyncHandler(async (req, res) => {
    const productData = req.body;
    const newProduct = await prisma.product.create({
      data: productData,
    });
    res.status(201).json(newProduct);
  })
);

app.put(
  "/api/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productData = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });
    res.json(updatedProduct);
  })
);

app.delete(
  "/api/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  })
);

app.get(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        assigner: true,
      },
    });
    res.json(tasks);
  })
);

app.post(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    const taskData = req.body;
    const newTask = await prisma.task.create({
      data: taskData,
    });
    res.status(201).json(newTask);
  })
);

app.put(
  "/api/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskData = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: taskData,
    });
    res.json(updatedTask);
  })
);

app.delete(
  "/api/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  })
);

app.get(
  "/api/customer-feedbacks",
  asyncHandler(async (req, res) => {
    const feedbacks = await prisma.customerFeedback.findMany();
    res.json(feedbacks);
  })
);

app.get(
  "/api/orders",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
  })
);

app.put(
  "/api/orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const orderData = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: orderData,
    });
    res.json(updatedOrder);
  })
);

app.get(
  "/api/shipments",
  asyncHandler(async (req, res) => {
    const shipments = await prisma.shipment.findMany({
      include: { order: true },
    });
    res.json(shipments);
  })
);

app.get(
  "/api/invoices",
  asyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({});
    res.json(invoices);
  })
);

app.get(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const { top } = req.query;
    const supplies = top
      ? await prisma.supply.findMany({
          orderBy: {
            stock: "desc",
          },
          take: parseInt(top, 10),
        })
      : await prisma.supply.findMany();
    res.json(supplies);
  })
);

app.get(
  "/api/orders/daily",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items;
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      daily: { orders: totalOrders, revenue: totalRevenue, items: totalItems },
    });
  })
);

app.get(
  "/api/orders/weekly",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfWeek,
          lt: lastDayOfWeek,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items; // already JS array
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      weekly: { orders: totalOrders, revenue: totalRevenue, items: totalItems },
    });
  })
);

app.get(
  "/api/orders/monthly",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // start of month
    const firstDayOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items;
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      monthly: {
        orders: totalOrders,
        revenue: totalRevenue,
        items: totalItems,
      },
    });
  })
);

app.get(
  "/api/orders/summary",
  asyncHandler(async (req, res) => {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });
    const shippedOrders = await prisma.order.count({
      where: { status: "shipped" },
    });
    const completedOrders = await prisma.order.count({
      where: { status: "completed" },
    });

    res.json({
      total: totalOrders,
      pending: pendingOrders,
      shipped: shippedOrders,
      completed: completedOrders,
    });
  })
);

app.get(
  "/api/shipments/summary",
  asyncHandler(async (req, res) => {
    const totalShipments = await prisma.shipment.count();
    const pendingShipments = await prisma.shipment.count({
      where: { status: "pending" },
    });
    const inTransitShipments = await prisma.shipment.count({
      where: { status: "in_transit" },
    });
    const deliveredShipments = await prisma.shipment.count({
      where: { status: "delivered" },
    });
    res.json({
      total: totalShipments,
      pending: pendingShipments,
      inTransit: inTransitShipments,
      delivered: deliveredShipments,
    });
  })
);

app.get(
  "/api/sales-orders",
  asyncHandler(async (req, res) => {
    const salesOrders = await prisma.salesOrder.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json(salesOrders);
  })
);

app.get(
  "/api/drivers",
  asyncHandler(async (req, res) => {
    const drivers = await prisma.driver.findMany({
      include: {
        user: true,
        deliveries: {
          include: {
            salesOrders: true,
          },
        },
      },
    });

    res.json(drivers);
  })
);

app.get(
  "/api/drivers/:id",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.id, 10);

    if (isNaN(driverId)) {
      return res.status(400).json({ error: "Invalid driver ID" });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: true,
        deliveries: {
          include: {
            salesOrders: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  })
);

app.get(
  "/api/deliveries",
  asyncHandler(async (req, res) => {
    const deliveries = await prisma.delivery.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        salesOrders: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        scheduledDate: "desc",
      },
    });

    res.json(deliveries);
  })
);

app.get(
  "/api/customers",
  asyncHandler(async (req, res) => {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  })
);

app.get(
  "/api/sales-invoices",
  asyncHandler(async (req, res) => {
    const salesInvoices = await prisma.salesInvoice.findMany({
      include: {
        salesOrder: true, // include linked SalesOrder
        delivery: true, // include linked Delivery
      },
    });

    res.json(salesInvoices);
  })
);

app.get(
  "/api/sales-invoices/driver/:driverId",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.driverId);

    const salesInvoices = await prisma.salesInvoice.findMany({
      where: {
        delivery: {
          driverId: driverId, // filter invoices where the linked delivery has this driver
        },
      },
      include: {
        salesOrder: true, // include linked sales order
        delivery: true, // include linked delivery
      },
    });

    res.json(salesInvoices);
  })
);

app.get(
  "/api/carts",
  asyncHandler(async (req, res) => {
    const carts = await prisma.cart.findMany();
    res.json(carts);
  })
);

app.get(
  "/api/small-orders",
  asyncHandler(async (req, res) => {
    const smallOrders = await prisma.smallOrder.findMany({
      include: {
        cart: true,
      },
    });
    res.json(smallOrders);
  })
);

app.get(
  "/api/financial-overview",
  asyncHandler(async (req, res) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    for (let month = 1; month < 13; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 1);
      const salesOrders = await prisma.salesOrder.findMany({
        where: {
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      const orders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      const income = salesOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const expenses = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const profit = income - expenses;
      monthlyData.push({ month, income, expenses, profit });
    }
    res.json(monthlyData);
  })
);

app.post(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const supplyData = req.body;
    const newSupply = await prisma.supply.create({
      data: supplyData,
    });
    res.status(201).json(newSupply);
  })
);

app.put(
  "/api/supplies/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const supplyData = req.body;
    const updatedSupply = await prisma.supply.update({
      where: { id },
      data: supplyData,
    });
    res.json(updatedSupply);
  })
);

app.post(
  "/api/invoices",
  asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    const newInvoice = await prisma.invoice.create({
      data: invoiceData,
    });
    res.status(201).json(newInvoice);
  })
);

app.post(
  "/api/sales-orders",
  asyncHandler(async (req, res) => {
    const orderData = req.body;
    const newOrder = await prisma.salesOrder.create({
      data: orderData,
    });
    res.status(201).json(newOrder);
  })
);

app.put(
  "/api/sales-orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const orderData = req.body;

    const updatedOrder = await prisma.salesOrder.update({
      where: { id },
      data: orderData,
    });
    res.json(updatedOrder);
  })
);

app.delete(
  "/api/sales-orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.salesOrder.delete({ where: { id } });
    res.status(204).send();
  })
);

app.delete(
  "/api/customers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.customer.delete({ where: { id } });
    res.status(204).send();
  })
);

app.post(
  "/api/customers",
  asyncHandler(async (req, res) => {
    const customerData = req.body;
    const newCustomer = await prisma.customer.create({
      data: customerData,
    });
    res.status(201).json(newCustomer);
  })
);

app.post(
  "/api/shipments",
  asyncHandler(async (req, res) => {
    const shipmentData = req.body;
    const newShipment = await prisma.shipment.create({
      data: shipmentData,
    });
    res.status(201).json(newShipment);
  })
);

app.post(
  "/api/users",
  asyncHandler(async (req, res) => {
    const userData = req.body;
    const { role } = userData;

    const newUser = await prisma.$transaction(async (prisma) => {
      const {
        vehicleId,
        vehicleType,
        licenseNumber,
        salesTarget,
        companyName,
        supplierType,
        attendance,
        performanceRating,
        salary,
        bonus,
        ...userFields
      } = userData;
      const user = await prisma.user.create({
        data: userFields,
      });

      switch (role) {
        case "Driver":
          await prisma.driver.create({
            data: {
              userId: user.id,
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Manager":
          await prisma.manager.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case "Salesman":
          await prisma.salesman.create({
            data: {
              userId: user.id,
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Stock Keeper":
          await prisma.stockKeeper.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Cashier":
          await prisma.cashier.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Supplier":
          await prisma.supplier.create({
            data: {
              userId: user.id,
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
          });
          break;
        case "Distributor":
          await prisma.distributor.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Assistant Manager":
          await prisma.assistantManager.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
      }
      return user;
    });

    res.status(201).json(newUser);
  })
);

app.put(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userData = req.body;
    const { role } = userData;

    const updatedUser = await prisma.$transaction(async (prisma) => {
      const {
        vehicleId,
        vehicleType,
        licenseNumber,
        salesTarget,
        companyName,
        supplierType,
        attendance,
        performanceRating,
        salary,
        bonus,
        ...userFields
      } = userData;
      const user = await prisma.user.update({
        where: { id },
        data: userFields,
      });

      switch (role) {
        case "Driver":
          await prisma.driver.upsert({
            where: { userId: id },
            update: {
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Manager":
          await prisma.manager.upsert({
            where: { userId: id },
            update: {},
            create: {
              userId: id,
            },
          });
          break;
        case "Salesman":
          await prisma.salesman.upsert({
            where: { userId: id },
            update: {
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Stock Keeper":
          await prisma.stockKeeper.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Cashier":
          await prisma.cashier.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Supplier":
          await prisma.supplier.upsert({
            where: { userId: id },
            update: {
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
            create: {
              userId: id,
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
          });
          break;
        case "Distributor":
          await prisma.distributor.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Assistant Manager":
          await prisma.assistantManager.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
      }

      return user;
    });

    res.json(updatedUser);
  })
);

app.delete(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  })
);

app.post(
  "/api/drivers",
  asyncHandler(async (req, res) => {
    const driverData = req.body;
    const newDriver = await prisma.driver.create({
      data: driverData,
      include: { user: true },
    });
    res.status(201).json(newDriver);
  })
);

app.put(
  "/api/drivers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const driverData = req.body;
    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: driverData,
      include: { user: true },
    });
    res.json(updatedDriver);
  })
);

app.get(
  "/api/stock-keepers",
  asyncHandler(async (req, res) => {
    const stockKeepers = await prisma.stockKeeper.findMany({
      include: { user: true },
    });
    res.json(stockKeepers);
  })
);

app.get(
  "/api/stock-keepers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const stockKeeper = await prisma.stockKeeper.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!stockKeeper) {
      return res.status(404).json({ error: "Stock Keeper not found" });
    }
    res.json(stockKeeper);
  })
);

app.post(
  "/api/stock-keepers",
  asyncHandler(async (req, res) => {
    const stockKeeperData = req.body;
    const newStockKeeper = await prisma.stockKeeper.create({
      data: stockKeeperData,
      include: { user: true },
    });
    res.status(201).json(newStockKeeper);
  })
);

app.put(
  "/api/stock-keepers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const stockKeeperData = req.body;
    const updatedStockKeeper = await prisma.stockKeeper.update({
      where: { id },
      data: stockKeeperData,
      include: { user: true },
    });
    res.json(updatedStockKeeper);
  })
);

app.get(
  "/api/managers",
  asyncHandler(async (req, res) => {
    const managers = await prisma.manager.findMany({
      include: { user: true },
    });
    res.json(managers);
  })
);

app.get(
  "/api/managers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const manager = await prisma.manager.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    res.json(manager);
  })
);

app.get(
  "/api/salesmen",
  asyncHandler(async (req, res) => {
    const salesmen = await prisma.salesman.findMany({
      include: { user: true },
    });
    res.json(salesmen);
  })
);

app.get(
  "/api/salesmen/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const salesman = await prisma.salesman.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!salesman) {
      return res.status(404).json({ error: "Salesman not found" });
    }
    res.json(salesman);
  })
);

app.get(
  "/api/cashiers",
  asyncHandler(async (req, res) => {
    const cashiers = await prisma.cashier.findMany({
      include: { user: true },
    });
    res.json(cashiers);
  })
);

app.get(
  "/api/cashiers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cashier = await prisma.cashier.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!cashier) {
      return res.status(404).json({ error: "Cashier not found" });
    }
    res.json(cashier);
  })
);

app.get(
  "/api/suppliers",
  asyncHandler(async (req, res) => {
    const suppliers = await prisma.supplier.findMany({
      include: { user: true },
    });
    res.json(suppliers);
  })
);

app.get(
  "/api/suppliers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(supplier);
  })
);

app.get(
  "/api/distributors",
  asyncHandler(async (req, res) => {
    const distributors = await prisma.distributor.findMany({
      include: { user: true },
    });
    res.json(distributors);
  })
);

app.get(
  "/api/distributors/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const distributor = await prisma.distributor.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!distributor) {
      return res.status(404).json({ error: "Distributor not found" });
    }
    res.json(distributor);
  })
);

app.get(
  "/api/assistant-managers",
  asyncHandler(async (req, res) => {
    const assistantManagers = await prisma.assistantManager.findMany({
      include: { user: true },
    });
    res.json(assistantManagers);
  })
);

app.get(
  "/api/assistant-managers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const assistantManager = await prisma.assistantManager.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!assistantManager) {
      return res.status(404).json({ error: "Assistant Manager not found" });
    }
    res.json(assistantManager);
  })
);

app.post(
  "/api/deliveries",
  asyncHandler(async (req, res) => {
    const deliveryData = req.body;
    const newDelivery = await prisma.delivery.create({
      data: deliveryData,
      include: {
        driver: true,
        salesOrders: true,
      },
    });
    res.status(201).json(newDelivery);
  })
);

app.put(
  "/api/deliveries/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const deliveryData = req.body;
    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: deliveryData,
      include: {
        driver: true,
        salesOrders: true,
      },
    });
    res.json(updatedDelivery);
  })
);

app.get(
  "/api/payments",
  asyncHandler(async (req, res) => {
    const payments = await prisma.payment.findMany({
      include: {
        salesOrder: true,
      },
    });
    res.json(payments);
  })
);

app.post(
  "/api/payments",
  asyncHandler(async (req, res) => {
    const paymentData = req.body;

    const result = await prisma.$transaction(async (prisma) => {
      const salesOrder = await prisma.salesOrder.findUnique({
        where: { id: paymentData.salesOrderId },
      });

      if (!salesOrder) {
        throw new Error("Sales order not found");
      }

      if (paymentData.amount !== salesOrder.subtotal) {
        throw new Error("Payment amount must equal the full order amount");
      }

      const newPayment = await prisma.payment.create({
        data: paymentData,
      });

      await prisma.salesOrder.update({
        where: { id: paymentData.salesOrderId },
        data: {
          paymentStatus: "paid",
        },
      });

      return newPayment;
    });

    res.status(201).json(result);
  })
);

app.put(
  "/api/payments/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const result = await prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.findUnique({
        where: { id },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      await prisma.salesOrder.update({
        where: { id: payment.salesOrderId },
        data: { paymentStatus: status },
      });

      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: { status },
        include: { salesOrder: true },
      });

      return updatedPayment;
    });

    res.json(result);
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
