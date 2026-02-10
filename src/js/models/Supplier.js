import axios from "axios";
import { PurchaseOrder } from "./PurchaseOrder.js";
import { PurchaseInvoice } from "./PurchaseInvoice.js";
import {
  filterOrdersByDateRange,
  filterInvoicesByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils.js";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { User } from "./User.js";

export class Supplier extends User {
  static async getAll() {
    const apiURL = "/api/suppliers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.get(apiURL);
  }

  static async create(supplierData) {
    const apiURL = "/api/suppliers";
    return axios.post(apiURL, supplierData);
  }

  static async update(id, supplierData) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.put(apiURL, supplierData);
  }

  static async delete(id) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.delete(apiURL);
  }

  static async exportSupplierReport(startDate, endDate) {
    try {
      const orderResponse = await PurchaseOrder.getAll();
      const allOrders = orderResponse.data || [];

      const invoiceResponse = await PurchaseInvoice.getAll();
      const allInvoices = invoiceResponse.data || [];

      const filteredOrders = filterOrdersByDateRange(
        allOrders.map((order) => ({
          ...order,
          orderDate: order.order?.orderDate || order.orderDate,
        })),
        startDate,
        endDate,
      );

      const filteredInvoices = filterInvoicesByDateRange(
        allInvoices.map((invoice) => ({
          ...invoice,
          invoiceDate: invoice.invoice?.invoiceDate || invoice.invoiceDate,
        })),
        startDate,
        endDate,
      );

      const doc = preparePdfDoc("Supplier Report", new Date());

      // Metrics
      const totalOrders = filteredOrders.length;
      const totalOrderAmount = filteredOrders.reduce(
        (sum, order) =>
          sum + parseFloat(order.order?.totalAmount || order.totalAmount || 0),
        0,
      );

      const totalInvoices = filteredInvoices.length;
      const totalInvoiceAmount = filteredInvoices.reduce(
        (sum, invoice) =>
          sum +
          parseFloat(invoice.invoice?.totalAmount || invoice.totalAmount || 0),
        0,
      );

      // Summary Section
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Key Performance Indicators",
        [
          { label: "Total Orders", value: totalOrders.toString() },
          {
            label: "Total Order Value",
            value: formatCurrency(totalOrderAmount),
          },
          { label: "Total Invoices", value: totalInvoices.toString() },
          {
            label: "Total Invoice Value",
            value: formatCurrency(totalInvoiceAmount),
          },
        ],
        yPos,
      );

      // Orders Section
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Purchase Orders", 14, yPos + 5);

      exportTable(
        doc,
        ["Order ID", "Supplier", "Date", "Status", "Due Date", "Total Amount"],
        filteredOrders.map((order) => [
          order.order?.orderNumber || order.id || "N/A",
          order.supplier?.companyName || order.supplier?.user?.name || "N/A",
          formatDate(order.order?.orderDate || order.orderDate),
          order.order?.status || order.status || "N/A",
          order.dueDate ? formatDate(order.dueDate) : "N/A",
          formatCurrency(order.order?.totalAmount || order.totalAmount || 0),
        ]),
        {
          startY: yPos + 10,
          headColor: [59, 130, 246], // Blue
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 25 },
            2: { cellWidth: 30, halign: "center" },
            3: { cellWidth: 30, halign: "center" },
            4: { cellWidth: 30, halign: "center" },
            5: { cellWidth: 30, halign: "right" },
          },
        },
      );

      // Invoices Section
      // We need to find the Y position after the first table
      yPos = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Invoices", 14, yPos);

      exportTable(
        doc,
        ["Invoice ID", "PO ID", "Date", "Due Date", "Status", "Amount"],
        filteredInvoices.map((invoice) => [
          invoice.invoice?.invoiceNumber || invoice.id || "N/A",
          invoice.purchaseOrderId || "N/A",
          formatDate(invoice.invoice?.invoiceDate || invoice.invoiceDate),
          invoice.invoice?.dueDate
            ? formatDate(invoice.invoice.dueDate)
            : invoice.dueDate
              ? formatDate(invoice.dueDate)
              : "N/A",
          invoice.invoice?.status || invoice.status || "N/A",
          formatCurrency(
            invoice.invoice?.totalAmount || invoice.totalAmount || 0,
          ),
        ]),
        {
          startY: yPos + 5,
          headColor: [34, 197, 94], // Green
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 25 },
            2: { cellWidth: 30, halign: "center" },
            3: { cellWidth: 30, halign: "center" },
            4: { cellWidth: 30, halign: "center" },
            5: { cellWidth: 30, halign: "right" },
          },
        },
      );

      // Add Footer
      addFooter(doc);

      doc.save(`purchase-orders-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
