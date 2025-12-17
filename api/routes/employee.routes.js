import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/drivers
 * Get all drivers
 */
router.get(
  "/drivers",
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

/**
 * GET /api/drivers/:id
 * Get a specific driver by ID
 */
router.get(
  "/drivers/:id",
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

/**
 * POST /api/drivers
 * Create a new driver
 */
router.post(
  "/drivers",
  asyncHandler(async (req, res) => {
    const driverData = req.body;
    const newDriver = await prisma.driver.create({
      data: driverData,
      include: { user: true },
    });
    res.status(201).json(newDriver);
  })
);

/**
 * PUT /api/drivers/:id
 * Update a driver
 */
router.put(
  "/drivers/:id",
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

/**
 * GET /api/managers
 * Get all managers
 */
router.get(
  "/managers",
  asyncHandler(async (req, res) => {
    const managers = await prisma.manager.findMany({
      include: { user: true },
    });
    res.json(managers);
  })
);

/**
 * GET /api/managers/:id
 * Get a specific manager by ID
 */
router.get(
  "/managers/:id",
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

/**
 * GET /api/salesmen
 * Get all salesmen
 */
router.get(
  "/salesmen",
  asyncHandler(async (req, res) => {
    const salesmen = await prisma.salesman.findMany({
      include: { user: true },
    });
    res.json(salesmen);
  })
);

/**
 * GET /api/salesmen/:id
 * Get a specific salesman by ID
 */
router.get(
  "/salesmen/:id",
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

/**
 * GET /api/stock-keepers
 * Get all stock keepers
 */
router.get(
  "/stock-keepers",
  asyncHandler(async (req, res) => {
    const stockKeepers = await prisma.stockKeeper.findMany({
      include: { user: true },
    });
    res.json(stockKeepers);
  })
);

/**
 * GET /api/stock-keepers/:id
 * Get a specific stock keeper by ID
 */
router.get(
  "/stock-keepers/:id",
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

/**
 * POST /api/stock-keepers
 * Create a new stock keeper
 */
router.post(
  "/stock-keepers",
  asyncHandler(async (req, res) => {
    const stockKeeperData = req.body;
    const newStockKeeper = await prisma.stockKeeper.create({
      data: stockKeeperData,
      include: { user: true },
    });
    res.status(201).json(newStockKeeper);
  })
);

/**
 * PUT /api/stock-keepers/:id
 * Update a stock keeper
 */
router.put(
  "/stock-keepers/:id",
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

/**
 * GET /api/cashiers
 * Get all cashiers
 */
router.get(
  "/cashiers",
  asyncHandler(async (req, res) => {
    const cashiers = await prisma.cashier.findMany({
      include: { user: true },
    });
    res.json(cashiers);
  })
);

/**
 * GET /api/cashiers/:id
 * Get a specific cashier by ID
 */
router.get(
  "/cashiers/:id",
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

/**
 * GET /api/suppliers
 * Get all suppliers
 */
router.get(
  "/suppliers",
  asyncHandler(async (req, res) => {
    const suppliers = await prisma.supplier.findMany({
      include: { user: true },
    });
    res.json(suppliers);
  })
);

/**
 * GET /api/suppliers/:id
 * Get a specific supplier by ID
 */
router.get(
  "/suppliers/:id",
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

/**
 * GET /api/distributors
 * Get all distributors
 */
router.get(
  "/distributors",
  asyncHandler(async (req, res) => {
    const distributors = await prisma.distributor.findMany({
      include: { user: true },
    });
    res.json(distributors);
  })
);

/**
 * GET /api/distributors/:id
 * Get a specific distributor by ID
 */
router.get(
  "/distributors/:id",
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

/**
 * GET /api/assistant-managers
 * Get all assistant managers
 */
router.get(
  "/assistant-managers",
  asyncHandler(async (req, res) => {
    const assistantManagers = await prisma.assistantManager.findMany({
      include: { user: true },
    });
    res.json(assistantManagers);
  })
);

/**
 * GET /api/assistant-managers/:id
 * Get a specific assistant manager by ID
 */
router.get(
  "/assistant-managers/:id",
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

export default router;
