import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
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
        const orderDate = new Date(order.order?.orderDate || order.orderDate);
        return orderDate >= start && orderDate <= end;
      });

      const doc = preparePdfDoc("Small Order Report", new Date());

      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.cart?.totalAmount || 0),
        0,
      );

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Sales Summary",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Total Revenue", value: formatCurrency(totalAmount) },
          {
            label: "Date Range",
            value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
          },
        ],
        yPos,
      );

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Order Details", 14, yPos + 5);

      exportTable(
        doc,
        ["Order Number", "Order ID", "Items", "Amount", "Date"],
        filteredOrders.map((order) => [
          order.orderNumber || "N/A",
          order.id,
          order.cart.items.map((item) => item.productName).join(", "),
          formatCurrency(order.cart?.totalAmount || 0),
          formatDate(new Date(order.order?.orderDate || order.orderDate)),
        ]),
        {
          startY: yPos + 10,
          fontSize: 9,
          headColor: [6, 182, 212], // Cyan
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: "auto" },
            3: { cellWidth: 30, halign: "right" },
            4: { cellWidth: 30, halign: "center" },
          },
        },
      );

      // Add Footer
      addFooter(doc);

      doc.save(
        `small_order_report_${formatDate(startDate)}_to_${formatDate(
          endDate,
        )}.pdf`,
      );
    } catch (error) {
      console.error("Error exporting small order report:", error);
      throw error;
    }
  }
}
