import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/customers
 * Get all customers
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  })
);

/**
 * POST /api/customers
 * Create a new customer
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const customerData = req.body;
    const newCustomer = await prisma.customer.create({
      data: customerData,
    });
    res.status(201).json(newCustomer);
  })
);

/**
 * DELETE /api/customers/:id
 * Delete a customer
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.customer.delete({ where: { id } });
    res.status(204).send();
  })
);

/**
 * GET /api/customer-feedbacks
 * Get all customer feedbacks
 */
router.get(
  "/feedbacks",
  asyncHandler(async (req, res) => {
    const feedbacks = await prisma.customerFeedback.findMany({
      include: {
        customer: true,
        salesOrder: true,
      },
    });
    res.json(feedbacks);
  })
);

/**
 * POST /api/customer-feedbacks
 * Create a new customer feedback
 */
router.post(
  "/feedbacks",
  asyncHandler(async (req, res) => {
    const { deliveryId, comments, rating } = req.body;

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { salesOrders: true },
    });

    if (!delivery || !delivery.salesOrders.length) {
      return res
        .status(400)
        .json({ error: "Delivery not found or has no associated orders" });
    }

    const customerId = delivery.salesOrders[0].customerId;
    const orderId = delivery.salesOrders[0].id;

    const newFeedback = await prisma.customerFeedback.create({
      data: {
        customerId,
        orderId,
        comment: comments,
      },
    });
    res.status(201).json(newFeedback);
  })
);

export default router;
