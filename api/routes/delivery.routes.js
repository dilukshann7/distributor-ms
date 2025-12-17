import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/deliveries
 * Get all deliveries
 */
router.get(
  "/",
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

/**
 * POST /api/deliveries
 * Create a new delivery
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { driverId, vehicleId, ...deliveryData } = req.body;
    const newDelivery = await prisma.delivery.create({
      data: {
        ...deliveryData,
        vehicleId: vehicleId || 0,
        driver: {
          connect: { id: driverId },
        },
      },
      include: {
        driver: true,
        salesOrders: true,
      },
    });
    res.status(201).json(newDelivery);
  })
);

/**
 * PUT /api/deliveries/:id
 * Update a delivery
 */
router.put(
  "/:id",
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

export default router;
