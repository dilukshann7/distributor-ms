import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/sales-invoices
 * Get all sales invoices with base invoice data
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const salesInvoices = await prisma.salesInvoice.findMany({
      include: {
        invoice: {
          include: {
            order: true,
          },
        },
        salesOrder: {
          include: {
            order: true,
            customer: true,
          },
        },
        delivery: true,
      },
      orderBy: {
        invoice: {
          id: "desc",
        },
      },
    });
    res.json(salesInvoices);
  }),
);

/**
 * GET /api/sales-invoices/:id
 * Get a specific sales invoice
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const salesInvoice = await prisma.salesInvoice.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            order: true,
          },
        },
        salesOrder: {
          include: {
            order: true,
            customer: true,
          },
        },
        delivery: true,
      },
    });

    if (!salesInvoice) {
      return res.status(404).json({ error: "Sales invoice not found" });
    }

    res.json(salesInvoice);
  }),
);

/**
 * GET /api/sales-invoices/driver/:driverId
 * Get sales invoices by driver (for delivery collection)
 */
router.get(
  "/driver/:driverId",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.driverId, 10);

    const salesInvoices = await prisma.salesInvoice.findMany({
      where: {
        delivery: {
          driverId,
        },
      },
      include: {
        invoice: {
          include: {
            order: true,
          },
        },
        salesOrder: {
          include: {
            order: true,
            customer: true,
          },
        },
        delivery: true,
      },
    });

    res.json(salesInvoices);
  }),
);

/**
 * POST /api/sales-invoices
 * Create a new sales invoice
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      invoiceNumber,
      salesOrderId,
      customerId,
      deliveryId,
      invoiceDate,
      dueDate,
      totalAmount,
      paymentMethod,
      items,
      subtotal,
      notes,
    } = req.body;

    // Get the sales order to link to its base order
    let orderId;
    if (salesOrderId) {
      const salesOrder = await prisma.salesOrder.findUnique({
        where: { id: salesOrderId },
      });
      if (salesOrder) {
        orderId = salesOrder.orderId;
      }
    }

    if (!orderId) {
      return res
        .status(400)
        .json({ error: "Sales order is required to create a sales invoice" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create base Invoice
      const baseInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          invoiceType: "sales",
          orderId,
          invoiceDate: new Date(invoiceDate || new Date()),
          dueDate: dueDate ? new Date(dueDate) : null,
          totalAmount,
          status: "pending",
          notes,
        },
      });

      // Create SalesInvoice child
      const salesInvoice = await tx.salesInvoice.create({
        data: {
          invoiceId: baseInvoice.id,
          salesOrderId,
          customerId,
          deliveryId,
          paymentMethod,
          items,
          subtotal,
        },
        include: {
          invoice: true,
          salesOrder: {
            include: {
              order: true,
            },
          },
          delivery: true,
        },
      });

      return salesInvoice;
    });

    res.status(201).json(result);
  }),
);

/**
 * PUT /api/sales-invoices/:id
 * Update a sales invoice
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {
      dueDate,
      totalAmount,
      notes,
      status,
      paymentMethod,
      collectedAmount,
      collectedAt,
    } = req.body;

    const salesInvoice = await prisma.salesInvoice.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!salesInvoice) {
      return res.status(404).json({ error: "Sales invoice not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update base Invoice
      if (dueDate || totalAmount || notes || status) {
        await tx.invoice.update({
          where: { id: salesInvoice.invoiceId },
          data: {
            ...(dueDate && { dueDate: new Date(dueDate) }),
            ...(totalAmount && { totalAmount }),
            ...(notes !== undefined && { notes }),
            ...(status && { status }),
          },
        });
      }

      // Update SalesInvoice child
      const updated = await tx.salesInvoice.update({
        where: { id },
        data: {
          ...(paymentMethod && { paymentMethod }),
          ...(collectedAmount !== undefined && { collectedAmount }),
          ...(collectedAt && { collectedAt: new Date(collectedAt) }),
        },
        include: {
          invoice: true,
          salesOrder: {
            include: {
              order: true,
            },
          },
          delivery: true,
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

/**
 * POST /api/sales-invoices/:id/collect
 * Record collection for a sales invoice
 */
router.post(
  "/:id/collect",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { amount, paymentMethod } = req.body;

    const salesInvoice = await prisma.salesInvoice.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!salesInvoice) {
      return res.status(404).json({ error: "Sales invoice not found" });
    }

    const newCollectedAmount = (salesInvoice.collectedAmount || 0) + amount;
    const isFullyCollected =
      newCollectedAmount >= salesInvoice.invoice.totalAmount;

    const result = await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: salesInvoice.invoiceId },
        data: { status: isFullyCollected ? "paid" : "partial" },
      });

      const updated = await tx.salesInvoice.update({
        where: { id },
        data: {
          collectedAmount: newCollectedAmount,
          collectedAt: new Date(),
          ...(paymentMethod && { paymentMethod }),
        },
        include: {
          invoice: true,
          salesOrder: {
            include: {
              order: true,
            },
          },
          delivery: true,
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

export default router;
