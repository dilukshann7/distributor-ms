import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatCurrency,
  formatDate,
  filterOrdersByDateRange,
} from "../utils/reportUtils.js";

export class SalesOrder {
  static async getAll(filters) {
    const apiURL = "/api/sales-orders";

    return axios.get(apiURL);
  }

  static async create(orderData) {
    const apiURL = "/api/sales-orders";

    return axios.post(apiURL, orderData);
  }

  static async update(id, orderData) {
    const apiURL = "/api/sales-orders/" + id;

    return axios.put(apiURL, orderData);
  }

  static async delete(id) {
    const apiURL = "/api/sales-orders/" + id;

    return axios.delete(apiURL);
  }

  static async exportSalesReport(startDate, endDate) {
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
      doc.text("Supplier/Sales Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        14,
        28
      );

      const totalOrders = filteredOrders.length;

      doc.setFontSize(10);
      doc.text(`Total Orders: ${totalOrders}`, 14, 36);

      autoTable(doc, {
        startY: 50,
        head: [
          [
            "Order ID",
            "Customer ID",
            "Date",
            "Status",
            "Total Amount",
            "Due Date",
          ],
        ],
        body: filteredOrders.map((order) => [
          order.id || "N/A",
          order.customerId || "N/A",
          formatDate(order.orderDate),
          order.status || "N/A",
          formatCurrency(order.subtotal),
          order.orderDate ? formatDate(order.orderDate) : "N/A",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue color for orders
      });

      doc.save(`sales-orders-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
