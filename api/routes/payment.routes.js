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
        salesOrder: {
          include: {
            order: true,
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(payments);
  }),
);

/**
 * POST /api/payments
 * Create a new payment for a sales order
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const paymentData = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Get the sales order with its base order
      const salesOrder = await tx.salesOrder.findUnique({
        where: { id: paymentData.salesOrderId },
        include: { order: true },
      });

      if (!salesOrder) {
        throw new Error("Sales order not found");
      }

      // Check if payment amount matches order total
      if (paymentData.amount !== salesOrder.order.totalAmount) {
        throw new Error("Payment amount must equal the full order amount");
      }

      // Create the payment
      const newPayment = await tx.payment.create({
        data: paymentData,
      });

      // Update sales order payment status
      await tx.salesOrder.update({
        where: { id: paymentData.salesOrderId },
        data: {
          paymentStatus: "paid",
        },
      });

      return newPayment;
    });

    res.status(201).json(result);
  }),
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

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Update sales order payment status
      await tx.salesOrder.update({
        where: { id: payment.salesOrderId },
        data: { paymentStatus: status },
      });

      // Update payment
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: { status },
        include: {
          salesOrder: {
            include: {
              order: true,
              customer: true,
            },
          },
        },
      });

      return updatedPayment;
    });

    res.json(result);
  }),
);

export default router;
