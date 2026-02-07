import axios from "axios";
import { User } from "./User.js";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { Product } from "./Product.js";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

export class StockKeeper extends User {
  static async getAll() {
    const apiURL = "/api/stock-keepers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.get(apiURL);
  }

  static async create(stockKeeperData) {
    const apiURL = "/api/stock-keepers";
    return axios.post(apiURL, stockKeeperData);
  }

  static async update(id, stockKeeperData) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.put(apiURL, stockKeeperData);
  }

  static async delete(id) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.delete(apiURL);
  }

  static async exportStockReport() {
    try {
      const productResponse = await Product.getAll();
      const allProducts = productResponse.data || [];

      const doc = preparePdfDoc("Inventory Status Report", new Date());

      const totalProducts = allProducts.length;
      const totalStockValue = allProducts.reduce(
        (sum, product) =>
          sum +
          parseFloat(product.price || 0) * parseFloat(product.quantity || 0),
        0,
      );
      const lowStockItems = allProducts.filter(
        (product) => product.quantity < 10,
      ).length;

      const outOfStockItems = allProducts.filter(
        (product) => product.quantity === 0,
      ).length;

      // Summary
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Inventory Overview",
        [
          { label: "Total SKUs", value: totalProducts.toString() },
          {
            label: "Total Stock Value",
            value: formatCurrency(totalStockValue),
          },
          { label: "Low Stock Items", value: lowStockItems.toString() },
          { label: "Out of Stock", value: outOfStockItems.toString() },
        ],
        yPos,
      );

      // Stock Table
      doc.setFontSize(14);
      doc.text("Stock Details", 14, yPos + 5);

      exportTable(
        doc,
        ["Product", "SKU", "Category", "Qty", "Price", "Status", "Location"],
        allProducts.map((product) => [
          product.name || "N/A",
          product.sku || "N/A",
          product.category || "N/A",
          product.quantity || 0,
          formatCurrency(product.price),
          product.status || "N/A",
          product.location || "N/A",
        ]),
        {
          startY: yPos + 10,
          headColor: [147, 51, 234], // Purple
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 25 },
            2: { cellWidth: 30 },
            3: { cellWidth: 15, halign: "center" },
            4: { cellWidth: 25, halign: "right" },
            5: { cellWidth: 25, halign: "center" },
            6: { cellWidth: 25 },
          },
        },
      );

      // Add Footer
      addFooter(doc);

      const timestamp = new Date().toISOString().split("T")[0];
      doc.save(`stock-report-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
