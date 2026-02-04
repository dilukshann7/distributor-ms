import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

// Get all shipments
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const shipments = await prisma.shipment.findMany({
      include: {
        purchaseOrder: {
          include: {
            order: true,
            supplier: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: shipments,
    });
  }),
);

// Get shipment by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const shipment = await prisma.shipment.findUnique({
      where: { id: parseInt(id) },
      include: {
        purchaseOrder: {
          include: {
            order: true,
            supplier: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  }),
);

// Create new shipment
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const shipmentData = {
      shipmentNumber: req.body.shipmentNumber,
      purchaseOrderId: parseInt(req.body.purchaseOrderId),
      supplierId: parseInt(req.body.supplierId),
      shipmentDate: new Date(req.body.shipmentDate),
      expectedDeliveryDate: new Date(req.body.expectedDeliveryDate),
      carrier: req.body.carrier,
      status: req.body.status || "pending",
    };

    if (req.body.actualDeliveryDate) {
      shipmentData.actualDeliveryDate = new Date(req.body.actualDeliveryDate);
    }
    if (req.body.notes) {
      shipmentData.notes = req.body.notes;
    }

    const shipment = await prisma.shipment.create({
      data: shipmentData,
      include: {
        purchaseOrder: {
          include: {
            order: true,
            supplier: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: shipment,
      message: "Shipment created successfully",
    });
  }),
);

// Update shipment
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      shipmentNumber,
      shipmentDate,
      expectedDeliveryDate,
      actualDeliveryDate,
      carrier,
      status,
      notes,
    } = req.body;

    const updateData = {};
    if (shipmentNumber) updateData.shipmentNumber = shipmentNumber;
    if (shipmentDate) updateData.shipmentDate = new Date(shipmentDate);
    if (expectedDeliveryDate)
      updateData.expectedDeliveryDate = new Date(expectedDeliveryDate);
    if (actualDeliveryDate !== undefined)
      updateData.actualDeliveryDate = actualDeliveryDate
        ? new Date(actualDeliveryDate)
        : null;
    if (carrier) updateData.carrier = carrier;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const shipment = await prisma.shipment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        purchaseOrder: {
          include: {
            order: true,
            supplier: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: shipment,
      message: "Shipment updated successfully",
    });
  }),
);

// Delete shipment
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.shipment.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Shipment deleted successfully",
    });
  }),
);

export default router;
