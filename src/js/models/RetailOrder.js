import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { formatDate, formatCurrency } from "../utils/reportUtils.js";

/**
 * RetailOrder - Walk-in/counter sales (extends base Order)
 * Used for quick point-of-sale transactions
 */
export class RetailOrder {
  static async getAll() {
    const apiURL = "/api/retail-orders";
    return axios.get(apiURL);
  }

  static async getById(id) {
    const apiURL = `/api/retail-orders/${id}`;
    return axios.get(apiURL);
  }

  static async create(orderData) {
    const apiURL = "/api/retail-orders";
    return axios.post(apiURL, orderData);
  }

  static async update(id, orderData) {
    const apiURL = `/api/retail-orders/${id}`;
    return axios.put(apiURL, orderData);
  }

  static async delete(id) {
    const apiURL = `/api/retail-orders/${id}`;
    return axios.delete(apiURL);
  }

  static async exportRetailOrderReport(startDate, endDate) {
    try {
      const response = await RetailOrder.getAll();
      const allOrders = response.data || [];

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredOrders = allOrders.filter((retailOrder) => {
        const orderDate = new Date(
          retailOrder.order?.createdAt || retailOrder.createdAt,
        );
        return orderDate >= start && orderDate <= end;
      });

      const doc = preparePdfDoc("Retail Order Report", new Date());

      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce(
        (sum, retailOrder) =>
          sum +
          parseFloat(
            retailOrder.order?.totalAmount ||
              retailOrder.cart?.totalAmount ||
              0,
          ),
        0,
      );

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Retail Sales Summary",
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
        filteredOrders.map((retailOrder) => [
          retailOrder.order?.orderNumber || "N/A",
          retailOrder.id,
          (retailOrder.order?.items || retailOrder.cart?.items || [])
            .map((item) => item.productName)
            .join(", "),
          formatCurrency(
            retailOrder.order?.totalAmount ||
              retailOrder.cart?.totalAmount ||
              0,
          ),
          formatDate(
            new Date(retailOrder.order?.createdAt || retailOrder.createdAt),
          ),
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
        `retail_order_report_${formatDate(startDate)}_to_${formatDate(
          endDate,
        )}.pdf`,
      );
    } catch (error) {
      console.error("Error exporting retail order report:", error);
      throw error;
    }
  }
}
