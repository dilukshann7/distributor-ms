import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

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

      const getOrderItems = (salesOrder) => {
        const rawItems = salesOrder.order?.items ?? salesOrder.items;
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
      const totalItems = filteredOrders.reduce((sum, salesOrder) => {
        const items = getOrderItems(salesOrder);
        const itemCount = items.reduce(
          (itemSum, item) => itemSum + (item.quantity || 0),
          0,
        );
        return sum + itemCount;
      }, 0);
      const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
      const averageItemsPerOrder =
        totalOrders > 0 ? totalItems / totalOrders : 0;
      const uniqueCustomers = new Set(
        filteredOrders.map(
          (salesOrder) =>
            salesOrder.customer?.name || salesOrder.customerName || "Unknown",
        ),
      ).size;

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Sales Overview",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Total Revenue", value: formatCurrency(totalValue) },
          {
            label: "Avg Order Value",
            value: formatCurrency(averageOrderValue),
          },
          {
            label: "Avg Items / Order",
            value: averageItemsPerOrder.toFixed(1),
          },
          { label: "Unique Customers", value: uniqueCustomers.toString() },
          {
            label: "Date Range",
            value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
          },
        ],
        yPos,
      );

      const customerTotals = new Map();
      filteredOrders.forEach((salesOrder) => {
        const customerName =
          salesOrder.customer?.name || salesOrder.customerName || "Unknown";
        const orderTotal = parseFloat(salesOrder.order?.totalAmount || 0);
        const items = getOrderItems(salesOrder);

        if (!customerTotals.has(customerName)) {
          customerTotals.set(customerName, {
            orders: 0,
            totalAmount: 0,
            items: new Map(),
          });
        }

        const entry = customerTotals.get(customerName);
        entry.orders += 1;
        entry.totalAmount += orderTotal;
        items.forEach((item) => {
          const name = item.name || "Item";
          const qty = item.quantity || 0;
          entry.items.set(name, (entry.items.get(name) || 0) + qty);
        });
      });

      const customerEntries = Array.from(customerTotals.entries()).sort(
        (a, b) => b[1].totalAmount - a[1].totalAmount,
      );
      const customerRows = customerEntries.map(([customerName, data]) => {
        const itemSummary = Array.from(data.items.entries())
          .map(([name, qty]) => `${name} (${qty})`)
          .join(", ");

        return [
          customerName,
          data.orders.toString(),
          itemSummary || "No items",
          formatCurrency(data.totalAmount),
        ];
      });

      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Summary", 14, yPos + 5);

      exportTable(
        doc,
        ["Customer", "Orders", "Items", "Total Revenue"],
        customerRows,
        {
          startY: yPos + 10,
          headColor: [30, 64, 175],
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 16, halign: "center" },
            2: { cellWidth: "auto" },
            3: { cellWidth: 28, halign: "right" },
          },
        },
      );

      let detailsY = doc.lastAutoTable?.finalY || yPos + 20;
      if (detailsY > 240) {
        doc.addPage();
        detailsY = 20;
      }

      const sortedOrders = [...filteredOrders].sort((a, b) => {
        const dateA = new Date(a.order?.orderDate || a.orderDate || 0);
        const dateB = new Date(b.order?.orderDate || b.orderDate || 0);
        return dateB - dateA;
      });

      // Detailed Table
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Order Details", 14, detailsY + 5);
      if (sortedOrders.length === 0) {
        doc.setFontSize(10);
        doc.text("No orders found for the selected range.", 14, detailsY + 12);
      }

      exportTable(
        doc,
        [
          "Order Number",
          "Customer",
          "Date",
          "Items",
          "Status",
          "Total Amount",
          "Payment Status",
        ],
        sortedOrders.map((salesOrder) => [
          salesOrder.order?.orderNumber || salesOrder.id,
          salesOrder.customer?.name || salesOrder.customerName || "Unknown",
          formatDate(salesOrder.order?.orderDate || salesOrder.orderDate),
          getOrderItems(salesOrder)
            .reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
            .toString(),
          salesOrder.order?.status || "pending",
          formatCurrency(salesOrder.order?.totalAmount || 0),
          salesOrder.paymentStatus,
        ]),
        {
          startY: detailsY + 10,
          headColor: [59, 130, 246], // Blue
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 32 },
            2: { cellWidth: 22, halign: "center" },
            3: { cellWidth: 16, halign: "center" },
            4: { cellWidth: 22, halign: "center" },
            5: { cellWidth: 28, halign: "right" },
            6: { cellWidth: 25, halign: "center" },
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
