import axios from "axios";
import { User } from "./User";
import {
  filterOrdersByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { SalesOrder } from "./SalesOrder";

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
        endDate
      );

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Sales Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        14,
        28
      );

      const totalOrders = filteredOrders.length;
      const subtotal = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.subtotal || 0),
        0
      );

      doc.setFontSize(10);
      doc.text(`Total Orders: ${totalOrders}`, 14, 36);
      doc.text(`Total Sales Amount: ${formatCurrency(subtotal)}`, 14, 42);

      autoTable(doc, {
        startY: 50,
        head: [
          ["Order ID", "Customer Name", "Date", "Status", "Subtotal", "Items"],
        ],
        body: filteredOrders.map((order) => [
          order.id || "N/A",
          order.customerName || "N/A",
          formatDate(order.orderDate),
          order.status || "N/A",
          formatCurrency(order.subtotal),
          `${order.items
            .map((element) => element.name + " x " + element.quantity)
            .join(", ")}`,
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [14, 165, 233] },
      });

      doc.save(`sales-report-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
