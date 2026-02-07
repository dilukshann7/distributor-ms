import axios from "axios";
import { User } from "./User.js";
import { formatDate, formatCurrency } from "../utils/reportUtils.js";
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

      const getOrderItems = (order) => {
        const rawItems = order.order?.items ?? order.items;
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

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.order?.orderDate || order.orderDate);
        return orderDate >= start && orderDate <= end;
      });

      const doc = preparePdfDoc("Sales Report", new Date());

      const totalOrders = filteredOrders.length;
      const subtotal = filteredOrders.reduce((sum, order) => {
        const total =
          order.order?.totalAmount || order.subtotal || order.totalAmount || 0;
        return sum + parseFloat(total || 0);
      }, 0);

      const averageOrderValue = totalOrders > 0 ? subtotal / totalOrders : 0;
      const totalItems = filteredOrders.reduce((sum, order) => {
        const items = getOrderItems(order);
        const itemCount = items.reduce(
          (itemSum, item) => itemSum + (item.quantity || 0),
          0,
        );
        return sum + itemCount;
      }, 0);
      const averageItemsPerOrder =
        totalOrders > 0 ? totalItems / totalOrders : 0;
      const uniqueCustomers = new Set(
        filteredOrders.map(
          (order) => order.customer?.name || order.customerName || "Unknown",
        ),
      ).size;

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
      filteredOrders.forEach((order) => {
        const customerName =
          order.customer?.name || order.customerName || "Unknown";
        const orderTotal = parseFloat(
          order.order?.totalAmount || order.subtotal || order.totalAmount || 0,
        );
        const items = getOrderItems(order);

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
      doc.text("Customer Summary", 14, yPos + 5);

      exportTable(
        doc,
        ["Customer", "Orders", "Items", "Total Sales"],
        customerRows,
        {
          startY: yPos + 10,
          headColor: [8, 145, 178],
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 16, halign: "center" },
            2: { cellWidth: "auto" },
            3: { cellWidth: 30, halign: "right" },
          },
        },
      );

      let detailsY = (doc.lastAutoTable?.finalY || yPos) + 15;
      if (detailsY > 250) {
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
      doc.text("Detailed Sales Data", 14, detailsY + 5);
      if (sortedOrders.length === 0) {
        doc.setFontSize(10);
        doc.text("No sales found for the selected range.", 14, detailsY + 12);
      }

      exportTable(
        doc,
        ["Order ID", "Customer Name", "Date", "Status", "Items", "Total"],
        sortedOrders.map((order) => [
          order.id || "N/A",
          order.customer?.name || order.customerName || "N/A",
          formatDate(order.order?.orderDate || order.orderDate),
          order.order?.status || order.status || "N/A",
          getOrderItems(order)
            .reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
            .toString(),
          formatCurrency(
            order.order?.totalAmount || order.subtotal || order.totalAmount,
          ),
        ]),
        {
          startY: detailsY + 10,
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
