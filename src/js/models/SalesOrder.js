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

/**
 * SalesOrder - Orders FROM customers for delivery (extends base Order)
 * Used for B2B deliveries to customers
 */
export class SalesOrder {
  static async getAll(filters) {
    const apiURL = "/api/sales-orders";
    return axios.get(apiURL, { params: filters });
  }

  static async getById(id) {
    const apiURL = `/api/sales-orders/${id}`;
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

  static async assignDriver(id, driverId) {
    const apiURL = `/api/sales-orders/${id}/assign-driver`;
    return axios.post(apiURL, { driverId });
  }

  static async exportSalesReport(startDate, endDate) {
    try {
      const orderResponse = await SalesOrder.getAll();
      const allOrders = orderResponse.data || [];

      // Filter orders using order.orderDate from the base Order
      const filteredOrders = allOrders.filter((salesOrder) => {
        const orderDate = new Date(
          salesOrder.order?.orderDate || salesOrder.orderDate,
        );
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });

      const doc = preparePdfDoc("Sales Order Report", new Date());

      const totalOrders = filteredOrders.length;
      const totalValue = filteredOrders.reduce(
        (sum, salesOrder) =>
          sum + parseFloat(salesOrder.order?.totalAmount || 0),
        0,
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
        yPos,
      );

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Order Details", 14, yPos + 5);

      exportTable(
        doc,
        [
          "Order Number",
          "Customer",
          "Date",
          "Status",
          "Total Amount",
          "Payment Status",
        ],
        filteredOrders.map((salesOrder) => [
          salesOrder.order?.orderNumber || salesOrder.id,
          salesOrder.customerName,
          formatDate(salesOrder.order?.orderDate),
          salesOrder.order?.status || "pending",
          formatCurrency(salesOrder.order?.totalAmount || 0),
          salesOrder.paymentStatus,
        ]),
        {
          startY: yPos + 10,
          headColor: [59, 130, 246], // Blue
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25, halign: "center" },
            3: { cellWidth: 25, halign: "center" },
            4: { cellWidth: 30, halign: "right" },
            5: { cellWidth: 25, halign: "center" },
          },
        },
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
