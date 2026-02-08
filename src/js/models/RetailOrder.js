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

      const getOrderItems = (retailOrder) => {
        const rawItems = retailOrder.order?.items ?? retailOrder.cart?.items;
        if (!rawItems) return [];
        if (Array.isArray(rawItems)) return rawItems;
        if (typeof rawItems === "string") {
          try {
            const parsed = JSON.parse(rawItems);
            return Array.isArray(parsed) ? parsed : [];
          } catch (error) {
            return [];
          }
        }
        return [];
      };

      const formatItemSummary = (items) =>
        items
          .map((item) => {
            const name = item.name || item.productName || "Item";
            const qty = item.quantity || 1;
            return `${name} (${qty})`;
          })
          .join(", ");

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredOrders = allOrders.filter((retailOrder) => {
        const orderDate = new Date(retailOrder.order?.orderDate || new Date());
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
      const totalItems = filteredOrders.reduce((sum, retailOrder) => {
        const items = getOrderItems(retailOrder);
        const itemCount = items.reduce(
          (itemSum, item) => itemSum + (item.quantity || 1),
          0,
        );
        return sum + itemCount;
      }, 0);
      const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
      const averageItemsPerOrder =
        totalOrders > 0 ? totalItems / totalOrders : 0;

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Retail Sales Summary",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Total Revenue", value: formatCurrency(totalAmount) },
          {
            label: "Avg Order Value",
            value: formatCurrency(averageOrderValue),
          },
          {
            label: "Avg Items / Order",
            value: averageItemsPerOrder.toFixed(1),
          },
          {
            label: "Date Range",
            value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
          },
        ],
        yPos,
      );

      const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.order?.orderDate || 0);
        const dateB = new Date(b.order?.orderDate || 0);
        return dateB - dateA;
      });

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Order Details", 14, yPos + 5);
      if (sortedOrders.length === 0) {
        doc.setFontSize(10);
        doc.text("No orders found for the selected range.", 14, yPos + 12);
      }

      exportTable(
        doc,
        ["Order Number", "Order ID", "Items", "Amount", "Date"],
        sortedOrders.map((retailOrder) => [
          retailOrder.order?.orderNumber || "N/A",
          retailOrder.id,
          formatItemSummary(getOrderItems(retailOrder)) || "No items",
          formatCurrency(
            retailOrder.order?.totalAmount ||
              retailOrder.cart?.totalAmount ||
              0,
          ),
          formatDate(retailOrder.order?.orderDate || new Date()),
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
