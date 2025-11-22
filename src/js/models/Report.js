import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Order } from "./Order";
import { Invoice } from "./Invoice";
import { Driver } from "./Drivers";

export class Report {
  constructor() {
    this.orders = [];
    this.products = [];
    this.shipments = [];
    this.invoices = [];
  }

  static filterOrdersByDateRange(orders, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });
  }

  static filterInvoicesByDateRange(invoices, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      return invoiceDate >= start && invoiceDate <= end;
    });
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  static formatCurrency(amount) {
    return `LKR ${parseFloat(amount || 0).toFixed(2)}`;
  }

  static async exportSalesmanReport(startDate, endDate) {
    try {
      const orderResponse = await Order.getAll();
      const allOrders = orderResponse.data || [];

      const filteredOrders = this.filterOrdersByDateRange(
        allOrders,
        startDate,
        endDate
      );

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Sales Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${this.formatDate(startDate)} - ${this.formatDate(
          endDate
        )}`,
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
      doc.text(
        `Total Sales Amount: ${this.formatCurrency(totalAmount)}`,
        14,
        42
      );

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
          this.formatDate(order.orderDate),
          order.status || "N/A",
          this.formatCurrency(order.totalAmount),
          order.dueDate ? this.formatDate(order.dueDate) : "N/A",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [14, 165, 233] },
      });

      doc.save(`sales-report-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }

  static async exportSupplierReport(startDate, endDate) {
    try {
      const orderResponse = await Order.getAll();
      const allOrders = orderResponse.data || [];

      const invoiceResponse = await Invoice.getAll();
      const allInvoices = invoiceResponse.data || []; // Filter orders based on the date range

      const filteredOrders = this.filterOrdersByDateRange(
        allOrders,
        startDate,
        endDate
      );

      // Filter invoices based on the date range
      const filteredInvoices = this.filterInvoicesByDateRange(
        allInvoices,
        startDate,
        endDate
      );

      const doc = new jsPDF(); // Title

      doc.setFontSize(18);
      doc.text("Supplier Report", 14, 20); // Date range

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${this.formatDate(startDate)} - ${this.formatDate(
          endDate
        )}`,
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
      doc.text(
        `Total Order Amount: ${this.formatCurrency(totalAmount)}`,
        14,
        42
      ); // Orders Table

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
          this.formatDate(order.orderDate),
          order.status || "N/A",
          this.formatCurrency(order.totalAmount),
          order.dueDate ? this.formatDate(order.dueDate) : "N/A",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue color for orders
      }); // Invoice section header and summary

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
        `Total Invoice Amount: ${this.formatCurrency(totalInvoiceAmount)}`,
        14,
        invoiceStartY + 14
      ); // Invoice table

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
          this.formatDate(invoice.invoiceDate),
          invoice.dueDate ? this.formatDate(invoice.dueDate) : "N/A",
          invoice.status || "N/A",
          this.formatCurrency(invoice.totalAmount),
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
