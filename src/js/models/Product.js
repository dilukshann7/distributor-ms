import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

export class Product {
  static async getAll(filters) {
    const apiURL = "/api/products";
    return axios.get(apiURL);
  }

  static async create(product) {
    const apiURL = "/api/products";
    return axios.post(apiURL, product);
  }

  static async update(id, product) {
    const apiURL = `/api/products/${id}`;
    return axios.put(apiURL, product);
  }

  static async delete(id) {
    const apiURL = `/api/products/${id}`;
    return axios.delete(apiURL);
  }

  static async exportInventoryReport() {
    const response = await Product.getAll();
    const products = response.data || [];

    const doc = preparePdfDoc("Inventory Valuation Report", new Date());

    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity < 10).length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;

    // Status breakdown
    const statusCounts = products.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    let yPos = 40;

    // Executive Summary using new helper
    yPos = addSummarySection(
      doc,
      "Executive Summary",
      [
        { label: "Total Products", value: totalProducts.toString() },
        { label: "Total Inventory Value", value: formatCurrency(totalValue) },
        { label: "Total Units", value: totalQuantity.toString() },
        { label: "Low Stock (<10)", value: lowStock.toString() },
        { label: "Out of Stock", value: outOfStock.toString() },
      ],
      yPos
    );

    // Add Status Breakdown section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, "bold");
    doc.text("Status Breakdown", 14, yPos + 5);

    const statusData = Object.entries(statusCounts).map(([status, count]) => [
      status,
      count.toString(),
      `${((count / totalProducts) * 100).toFixed(1)}%`,
    ]);

    exportTable(doc, ["Status", "Count", "Percentage"], statusData, {
      startY: yPos + 10,
      theme: "striped",
      headColor: [52, 73, 94],
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 30, halign: "center" },
      },
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    // Add Detailed Inventory section
    doc.setFontSize(14);
    doc.text("Detailed Inventory", 14, yPos);

    // Sort products by status and quantity
    const sortedProducts = [...products].sort((a, b) => {
      if (a.quantity === 0 && b.quantity !== 0) return -1;
      if (a.quantity !== 0 && b.quantity === 0) return 1;
      if (a.quantity < 10 && b.quantity >= 10) return -1;
      if (a.quantity >= 10 && b.quantity < 10) return 1;
      return a.name.localeCompare(b.name);
    });

    exportTable(
      doc,
      [
        "Product Name",
        "SKU",
        "Quantity",
        "Unit Price",
        "Total Value",
        "Status",
      ],
      sortedProducts.map((product) => [
        product.name,
        product.sku,
        product.quantity.toString(),
        formatCurrency(product.price),
        formatCurrency(product.price * product.quantity),
        product.status,
      ]),
      {
        startY: yPos + 5,
        headColor: [41, 128, 185],
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 25, halign: "right" },
          4: { cellWidth: 28, halign: "right" },
          5: { cellWidth: 25, halign: "center" },
        },
      }
    );

    // Add footer
    addFooter(doc);

    doc.save(`inventory_report_${new Date().toISOString().split("T")[0]}.pdf`);
  }
}
