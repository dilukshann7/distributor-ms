import axios from "axios";
import { User } from "./User.js";
import {
  filterOrdersByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils.js";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { SalesOrder } from "./SalesOrder.js";

export class Salesman extends User {
  static async getAll() {
    const apiURL = "/api/salesmen";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.get(apiURL);
  }

  static async create(salesmanData) {
    const apiURL = "/api/salesmen";
    return axios.post(apiURL, salesmanData);
  }

  static async update(id, salesmanData) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.put(apiURL, salesmanData);
  }

  static async delete(id) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.delete(apiURL);
  }

  static async exportReport(startDate, endDate) {
    try {
      const orderResponse = await SalesOrder.getAll();
      const allOrders = orderResponse.data || [];

      const filteredOrders = filterOrdersByDateRange(
        allOrders,
        startDate,
        endDate,
      );

      const doc = preparePdfDoc("Sales Report", new Date());

      const totalOrders = filteredOrders.length;
      const subtotal = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.subtotal || 0),
        0,
      );

      const averageOrderValue = totalOrders > 0 ? subtotal / totalOrders : 0;

      // Add Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Performance Overview",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Total Sales", value: formatCurrency(subtotal) },
          {
            label: "Avg Order Value",
            value: formatCurrency(averageOrderValue),
          },
        ],
        yPos,
      );

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Detailed Sales Data", 14, yPos + 5);

      exportTable(
        doc,
        ["Order ID", "Customer Name", "Date", "Status", "Items", "Subtotal"],
        filteredOrders.map((order) => [
          order.id || "N/A",
          order.customerName || "N/A",
          formatDate(order.orderDate),
          order.status || "N/A",
          order.items
            ? order.items
                .map((element) => `${element.name} (${element.quantity})`)
                .join(", ")
            : "N/A",
          formatCurrency(order.subtotal),
        ]),
        {
          startY: yPos + 10,
          headColor: [14, 165, 233], // Sky blue
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25, halign: "center" },
            3: { cellWidth: 25, halign: "center" },
            4: { cellWidth: "auto" },
            5: { cellWidth: 30, halign: "right" },
          },
        },
      );

      // Add Footer
      addFooter(doc);

      doc.save(`sales-report-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
