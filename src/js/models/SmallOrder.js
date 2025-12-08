import axios from "axios";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { formatDate, formatCurrency } from "../utils/reportUtils.js";

export class smallOrder {
  static async getAll() {
    const apiURL = "/api/small-orders";
    return axios.get(apiURL);
  }

  static async create(orderData) {
    const apiURL = "/api/small-orders";
    return axios.post(apiURL, orderData);
  }

  static async exportSmallOrderReport(startDate, endDate) {
    try {
      const response = await smallOrder.getAll();
      const allOrders = response.data || [];

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Small Order Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        14,
        28
      );

      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.cart?.totalAmount || 0),
        0
      );

      doc.setFontSize(10);
      doc.text(`Total Orders: ${totalOrders}`, 14, 36);
      doc.text(`Total Revenue: ${formatCurrency(totalAmount)}`, 14, 42);

      autoTable(doc, {
        startY: 50,
        head: [["Order Number", "Order ID", "Items", "Amount", "Date"]],
        body: filteredOrders.map((order) => [
          order.orderNumber || "N/A",
          order.id,
          order.cart.items.map((item) => item.productName).join(", "),
          formatCurrency(order.cart?.totalAmount || 0),
          formatDate(new Date(order.createdAt)),
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [6, 182, 212] },
      });

      doc.save(
        `small_order_report_${formatDate(startDate)}_to_${formatDate(
          endDate
        )}.pdf`
      );
    } catch (error) {
      console.error("Error exporting small order report:", error);
      throw error;
    }
  }
}
