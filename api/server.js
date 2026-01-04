import { createSessionMiddleware } from "./SessionHandling.js";
import express from "express";
import "dotenv/config";
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
import smallOrderRoutes from "./routes/smallorder.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
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
app.use("/api/small-orders", smallOrderRoutes);

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
