import axios from "axios";
import { SalesOrder } from "./SalesOrder";
import { Invoice } from "./Invoice";
import {
  filterOrdersByDateRange,
  filterInvoicesByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { User } from "./User";

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
      const orderResponse = await SalesOrder.getAll();
      const allOrders = orderResponse.data || [];

      const invoiceResponse = await Invoice.getAll();
      const allInvoices = invoiceResponse.data || [];

      const filteredOrders = filterOrdersByDateRange(
        allOrders,
        startDate,
        endDate
      );

      const filteredInvoices = filterInvoicesByDateRange(
        allInvoices,
        startDate,
        endDate
      );

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Supplier Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        14,
        28
      );

      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.totalAmount || 0),
        0
      );

      doc.setFontSize(10);
      doc.text(`Total Orders: ${totalOrders}`, 14, 36);
      doc.text(`Total Order Amount: ${formatCurrency(totalAmount)}`, 14, 42); // Orders Table

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
          formatCurrency(order.totalAmount),
          order.dueDate ? formatDate(order.dueDate) : "N/A",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue color for orders
      });

      const invoiceStartY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.text("Invoices", 14, invoiceStartY);

      const totalInvoices = filteredInvoices.length;
      const totalInvoiceAmount = filteredInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.totalAmount || 0),
        0
      );

      doc.setFontSize(10);
      doc.text(`Total Invoices: ${totalInvoices}`, 14, invoiceStartY + 8);
      doc.text(
        `Total Invoice Amount: ${formatCurrency(totalInvoiceAmount)}`,
        14,
        invoiceStartY + 14
      );

      autoTable(doc, {
        startY: invoiceStartY + 20,
        head: [
          [
            "Invoice ID",
            "Order ID",
            "Supplier ID",
            "Invoice Date",
            "Due Date",
            "Status",
            "Total Amount",
          ],
        ],
        body: filteredInvoices.map((invoice) => [
          invoice.id || "N/A",
          invoice.purchaseOrderId || "N/A",
          invoice.supplierId || "N/A",
          formatDate(invoice.invoiceDate),
          invoice.dueDate ? formatDate(invoice.dueDate) : "N/A",
          invoice.status || "N/A",
          formatCurrency(invoice.totalAmount),
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94] },
      });

      doc.save(`purchase-orders-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
