import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/payments
 * Get all payments
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const payments = await prisma.payment.findMany({
      include: {
        salesOrder: true,
      },
    });
    res.json(payments);
  })
);

/**
 * POST /api/payments
 * Create a new payment
 */
router.post(
  "/",
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

/**
 * PUT /api/payments/:id
 * Update a payment status
 */
router.put(
  "/:id",
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

export default router;
