import { createSessionMiddleware } from "./SessionHandling.js";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get correct directory for this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct location (parent of api folder)
const envPath = path.join(__dirname, "..", ".env");
console.log("Loading .env from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log(
    "DATABASE_URL loaded:",
    process.env.DATABASE_URL
      ? "Yes (starts with: " +
          process.env.DATABASE_URL.substring(0, 30) +
          "...)"
      : "No",
  );
}

import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import supplyRoutes from "./routes/supply.routes.js";
import taskRoutes from "./routes/task.routes.js";
import salesOrderRoutes from "./routes/salesorder.route.js";
import cartRoutes from "./routes/carts.route.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import purchaseOrderRoutes from "./routes/purchaseorder.routes.js";
import retailOrderRoutes from "./routes/retailorder.routes.js";
import purchaseInvoiceRoutes from "./routes/purchaseinvoice.routes.js";
import salesInvoiceRoutes from "./routes/salesinvoice.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

// Health check endpoint for Electron startup
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(createSessionMiddleware());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/retail-orders", retailOrderRoutes);
app.use("/api/purchase-invoices", purchaseInvoiceRoutes);
app.use("/api/sales-invoices", salesInvoiceRoutes);
app.use("/api/shipments", shipmentRoutes);

app.get(/^\/(?!api|dist|assets|static|favicon\.ico).*/, (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
