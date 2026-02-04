import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/purchase-invoices
 * Get all purchase invoices with base invoice data
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const purchaseInvoices = await prisma.purchaseInvoice.findMany({
      include: {
        invoice: {
          include: {
            order: true,
          },
        },
        purchaseOrder: {
          include: {
            order: true,
          },
        },
        supplier: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        invoice: {
          id: "desc",
        },
      },
    });
    res.json(purchaseInvoices);
  }),
);

/**
 * GET /api/purchase-invoices/:id
 * Get a specific purchase invoice
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            order: true,
          },
        },
        purchaseOrder: {
          include: {
            order: true,
            supplier: true,
          },
        },
        supplier: true,
      },
    });

    if (!purchaseInvoice) {
      return res.status(404).json({ error: "Purchase invoice not found" });
    }

    res.json(purchaseInvoice);
  }),
);

/**
 * POST /api/purchase-invoices
 * Create a new purchase invoice
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      invoiceNumber,
      purchaseOrderId,
      supplierId,
      invoiceDate,
      dueDate,
      totalAmount,
      notes,
    } = req.body;

    // Get the purchase order to link to its base order
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create base Invoice
      const baseInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          invoiceType: "purchase",
          orderId: purchaseOrder.orderId,
          invoiceDate: new Date(invoiceDate),
          dueDate: dueDate ? new Date(dueDate) : null,
          totalAmount,
          status: "pending",
          notes,
        },
      });

      // Create PurchaseInvoice child
      const purchaseInvoice = await tx.purchaseInvoice.create({
        data: {
          invoiceId: baseInvoice.id,
          purchaseOrderId,
          supplierId,
          balance: totalAmount,
        },
        include: {
          invoice: true,
          purchaseOrder: true,
          supplier: true,
        },
      });

      return purchaseInvoice;
    });

    res.status(201).json(result);
  }),
);

/**
 * PUT /api/purchase-invoices/:id
 * Update a purchase invoice
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { dueDate, totalAmount, notes, status, paidAmount, balance } =
      req.body;

    const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!purchaseInvoice) {
      return res.status(404).json({ error: "Purchase invoice not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update base Invoice
      if (dueDate || totalAmount || notes || status) {
        await tx.invoice.update({
          where: { id: purchaseInvoice.invoiceId },
          data: {
            ...(dueDate && { dueDate: new Date(dueDate) }),
            ...(totalAmount && { totalAmount }),
            ...(notes !== undefined && { notes }),
            ...(status && { status }),
          },
        });
      }

      // Update PurchaseInvoice child
      const updated = await tx.purchaseInvoice.update({
        where: { id },
        data: {
          ...(paidAmount !== undefined && { paidAmount }),
          ...(balance !== undefined && { balance }),
        },
        include: {
          invoice: true,
          purchaseOrder: true,
          supplier: true,
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

/**
 * POST /api/purchase-invoices/:id/pay
 * Mark a purchase invoice as paid
 */
router.post(
  "/:id/pay",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { amount } = req.body;

    const purchaseInvoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!purchaseInvoice) {
      return res.status(404).json({ error: "Purchase invoice not found" });
    }

    const newPaidAmount = (purchaseInvoice.paidAmount || 0) + amount;
    const newBalance = purchaseInvoice.invoice.totalAmount - newPaidAmount;
    const newStatus = newBalance <= 0 ? "paid" : "partial";

    const result = await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: purchaseInvoice.invoiceId },
        data: { status: newStatus },
      });

      const updated = await tx.purchaseInvoice.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          balance: Math.max(0, newBalance),
          paidDate: newBalance <= 0 ? new Date() : null,
        },
        include: {
          invoice: true,
          purchaseOrder: true,
          supplier: true,
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

export default router;
