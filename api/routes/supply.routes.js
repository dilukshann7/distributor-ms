import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/supplies
 * Get all supplies (with optional top filter)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { top } = req.query;
    const supplies = top
      ? await prisma.supply.findMany({
          orderBy: {
            stock: "desc",
          },
          take: parseInt(top, 10),
          include: { supplier: true },
        })
      : await prisma.supply.findMany({
          include: { supplier: true },
        });
    res.json(supplies);
  })
);

/**
 * POST /api/supplies
 * Create a new supply
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const supplyData = req.body;
    const newSupply = await prisma.supply.create({
      data: supplyData,
    });
    res.status(201).json(newSupply);
  })
);

/**
 * PUT /api/supplies/:id
 * Update a supply
 */
router.put(
  "/:id",
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

/**
 * GET /api/shipments
 * Get all shipments
 */
router.get(
  "/shipments",
  asyncHandler(async (req, res) => {
    const shipments = await prisma.shipment.findMany({
      include: { order: true },
    });
    res.json(shipments);
  })
);

/**
 * POST /api/shipments
 * Create a new shipment
 */
router.post(
  "/shipments",
  asyncHandler(async (req, res) => {
    const shipmentData = req.body;
    const newShipment = await prisma.shipment.create({
      data: shipmentData,
    });
    res.status(201).json(newShipment);
  })
);

/**
 * PUT /api/shipments/:id
 * Update a shipment
 */
router.put(
  "/shipments/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const shipmentData = req.body;
    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: shipmentData,
    });
    res.json(updatedShipment);
  })
);

/**
 * GET /api/invoices
 * Get all invoices
 */
router.get(
  "/invoices",
  asyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({});
    res.json(invoices);
  })
);

/**
 * POST /api/invoices
 * Create a new invoice
 */
router.post(
  "/invoices",
  asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    const newInvoice = await prisma.invoice.create({
      data: invoiceData,
    });
    res.status(201).json(newInvoice);
  })
);

/**
 * GET /api/sales-invoices
 * Get all sales invoices
 */
router.get(
  "/sales-invoices",
  asyncHandler(async (req, res) => {
    const salesInvoices = await prisma.salesInvoice.findMany({
      include: {
        salesOrder: true,
        delivery: true,
      },
    });

    res.json(salesInvoices);
  })
);

/**
 * GET /api/sales-invoices/driver/:driverId
 * Get sales invoices for a specific driver
 */
router.get(
  "/sales-invoices/driver/:driverId",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.driverId);

    const salesInvoices = await prisma.salesInvoice.findMany({
      where: {
        delivery: {
          driverId: driverId,
        },
      },
      include: {
        salesOrder: true,
        delivery: true,
      },
    });

    res.json(salesInvoices);
  })
);

export default router;
