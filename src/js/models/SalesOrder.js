import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
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

      const doc = preparePdfDoc("Sales Order Report", new Date());

      const totalOrders = filteredOrders.length;
      const totalValue = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.subtotal || 0),
        0
      );

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Sales Overview",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Total Revenue", value: formatCurrency(totalValue) },
          {
            label: "Date Range",
            value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
          },
        ],
        yPos
      );

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Order Details", 14, yPos + 5);

      exportTable(
        doc,
        [
          "Order ID",
          "Customer ID",
          "Date",
          "Status",
          "Total Amount",
          "Due Date",
        ],
        filteredOrders.map((order) => [
          order.id,
          order.customerId,
          formatDate(order.orderDate),
          order.status,
          formatCurrency(order.subtotal),
          order.orderDate ? formatDate(order.orderDate) : "N/A",
        ]),
        {
          startY: yPos + 10,
          headColor: [59, 130, 246], // Blue
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30, halign: "center" },
            3: { cellWidth: 30, halign: "center" },
            4: { cellWidth: 30, halign: "right" },
            5: { cellWidth: 30, halign: "center" },
          },
        }
      );

      // Add Footer
      addFooter(doc);

      doc.save(`sales-orders-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
