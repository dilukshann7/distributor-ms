import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Order } from "./Order";
import { Invoice } from "./Invoice";
import { Driver } from "./Drivers";
import { SalesOrder } from "./SalesOrder";
import { Product } from "./Product";
import {
  filterOrdersByDateRange,
  filterInvoicesByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils.js";

export class Report {
  constructor() {
    this.orders = [];
    this.products = [];
    this.shipments = [];
    this.invoices = [];
  }

  static async exportSupplierReport(startDate, endDate) {
    try {
      const orderResponse = await SalesOrder.getAll();
      const allOrders = orderResponse.data || [];

      const invoiceResponse = await Invoice.getAll();
      const allInvoices = invoiceResponse.data || []; // Filter orders based on the date range

      const filteredOrders = filterOrdersByDateRange(
        allOrders,
        startDate,
        endDate
      );

      // Filter invoices based on the date range
      const filteredInvoices = filterInvoicesByDateRange(
        allInvoices,
        startDate,
        endDate
      );

      const doc = new jsPDF(); // Title

      doc.setFontSize(18);
      doc.text("Supplier Report", 14, 20); // Date range

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
        `Total Invoice Amount: ${formatCurrency(totalInvoiceAmount)}`,
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

  static async exportStockReport() {
    try {
      const productResponse = await Product.getAll();
      const allProducts = productResponse.data || [];

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Stock Report", 14, 20);

      doc.setFontSize(11);
      doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 28);

      const totalProducts = allProducts.length;
      const totalStockValue = allProducts.reduce(
        (sum, product) =>
          sum +
          parseFloat(product.price || 0) * parseFloat(product.quantity || 0),
        0
      );
      const lowStockItems = allProducts.filter(
        (product) => product.quantity <= product.minStock
      ).length;

      doc.setFontSize(10);
      doc.text(`Total Products: ${totalProducts}`, 14, 36);
      doc.text(`Total Stock Value: ${formatCurrency(totalStockValue)}`, 14, 42);
      doc.text(`Low Stock Items: ${lowStockItems}`, 14, 48);

      autoTable(doc, {
        startY: 56,
        head: [
          [
            "Product ID",
            "Name",
            "SKU",
            "Category",
            "Quantity",
            "Price",
            "Min Stock",
            "Max Stock",
            "Location",
            "Status",
          ],
        ],
        body: allProducts.map((product) => [
          product.id || "N/A",
          product.name || "N/A",
          product.sku || "N/A",
          product.category || "N/A",
          product.quantity || 0,
          formatCurrency(product.price),
          product.minStock || 0,
          product.maxStock || 0,
          product.location || "N/A",
          product.status || "N/A",
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [147, 51, 234] },
      });

      const timestamp = new Date().toISOString().split("T")[0];
      doc.save(`stock-report-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
