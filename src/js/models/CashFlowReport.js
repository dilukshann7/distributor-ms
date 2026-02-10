import { SalesOrder } from "./SalesOrder.js";
import { RetailOrder } from "./RetailOrder.js";
import { PurchaseOrder } from "./PurchaseOrder.js";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

export class CashFlowReport {
  static async exportCashFlowReport(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [salesResponse, retailResponse, purchaseResponse] = await Promise.all(
      [SalesOrder.getAll(), RetailOrder.getAll(), PurchaseOrder.getAll()],
    );

    const salesOrders = salesResponse.data || [];
    const retailOrders = retailResponse.data || [];
    const purchaseOrders = purchaseResponse.data || [];

    const isInRange = (dateValue) => {
      const date = new Date(dateValue);
      return date >= start && date <= end;
    };

    const getOrderItems = (order) => {
      const rawItems = order.order?.items ?? order.items ?? order.cart?.items;
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

    const filteredSales = salesOrders.filter((order) =>
      isInRange(order.order?.orderDate || order.orderDate),
    );
    const filteredRetail = retailOrders.filter((order) =>
      isInRange(order.order?.orderDate || new Date()),
    );
    const filteredPurchases = purchaseOrders.filter((order) =>
      isInRange(order.order?.orderDate || order.orderDate),
    );

    const salesTotal = filteredSales.reduce(
      (sum, order) => sum + parseFloat(order.order?.totalAmount || 0),
      0,
    );
    const retailTotal = filteredRetail.reduce(
      (sum, order) =>
        sum +
        parseFloat(order.order?.totalAmount || order.cart?.totalAmount || 0),
      0,
    );
    const purchaseTotal = filteredPurchases.reduce(
      (sum, order) => sum + parseFloat(order.order?.totalAmount || 0),
      0,
    );

    const netCashFlow = salesTotal + retailTotal - purchaseTotal;

    const salesByCustomer = new Map();
    filteredSales.forEach((order) => {
      const customerName =
        order.customer?.name || order.customerName || "Unknown";
      const amount = parseFloat(order.order?.totalAmount || 0);
      const items = getOrderItems(order);
      if (!salesByCustomer.has(customerName)) {
        salesByCustomer.set(customerName, {
          totalAmount: 0,
          orders: 0,
          items: new Map(),
        });
      }
      const entry = salesByCustomer.get(customerName);
      entry.totalAmount += amount;
      entry.orders += 1;
      items.forEach((item) => {
        const name = item.name || "Item";
        const qty = item.quantity || 0;
        entry.items.set(name, (entry.items.get(name) || 0) + qty);
      });
    });

    const retailByDate = new Map();
    filteredRetail.forEach((order) => {
      const dateKey = formatDate(order.order?.orderDate || new Date());
      const amount = parseFloat(
        order.order?.totalAmount || order.cart?.totalAmount || 0,
      );
      const items = getOrderItems(order);
      if (!retailByDate.has(dateKey)) {
        retailByDate.set(dateKey, {
          totalAmount: 0,
          orders: 0,
          items: new Map(),
        });
      }
      const entry = retailByDate.get(dateKey);
      entry.totalAmount += amount;
      entry.orders += 1;
      items.forEach((item) => {
        const name = item.name || "Item";
        const qty = item.quantity || 0;
        entry.items.set(name, (entry.items.get(name) || 0) + qty);
      });
    });

    const purchasesBySupplier = new Map();
    filteredPurchases.forEach((order) => {
      const supplierName =
        order.supplier?.companyName || order.supplier?.user?.name || "Unknown";
      const amount = parseFloat(order.order?.totalAmount || 0);
      if (!purchasesBySupplier.has(supplierName)) {
        purchasesBySupplier.set(supplierName, {
          totalAmount: 0,
          orders: 0,
        });
      }
      const entry = purchasesBySupplier.get(supplierName);
      entry.totalAmount += amount;
      entry.orders += 1;
    });

    const doc = preparePdfDoc("Cash Flow Report", new Date());

    let yPos = 40;
    yPos = addSummarySection(
      doc,
      "Cash Flow Overview",
      [
        { label: "Sales Inflow", value: formatCurrency(salesTotal) },
        { label: "Retail Inflow", value: formatCurrency(retailTotal) },
        { label: "Supplier Outflow", value: formatCurrency(purchaseTotal) },
        { label: "Net Cash Flow", value: formatCurrency(netCashFlow) },
        {
          label: "Date Range",
          value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        },
      ],
      yPos,
    );

    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Sales by Customer", 14, yPos + 5);

    const salesRows = Array.from(salesByCustomer.entries())
      .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
      .map(([customerName, data]) => {
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

    exportTable(doc, ["Customer", "Orders", "Items", "Sales"], salesRows, {
      startY: yPos + 10,
      headColor: [30, 64, 175],
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: "auto" },
        3: { cellWidth: 28, halign: "right" },
      },
    });

    let sectionY = (doc.lastAutoTable?.finalY || yPos) + 15;
    if (sectionY > 250) {
      doc.addPage();
      sectionY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Retail Summary", 14, sectionY + 5);

    const retailRows = Array.from(retailByDate.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([dateKey, data]) => {
        const itemSummary = Array.from(data.items.entries())
          .map(([name, qty]) => `${name} (${qty})`)
          .join(", ");
        return [
          dateKey,
          data.orders.toString(),
          itemSummary || "No items",
          formatCurrency(data.totalAmount),
        ];
      });

    exportTable(doc, ["Date", "Orders", "Items", "Sales"], retailRows, {
      startY: sectionY + 10,
      headColor: [6, 182, 212],
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
      },
    });

    sectionY = (doc.lastAutoTable?.finalY || sectionY) + 15;
    if (sectionY > 250) {
      doc.addPage();
      sectionY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Purchases by Supplier", 14, sectionY + 5);

    const purchaseRows = Array.from(purchasesBySupplier.entries())
      .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
      .map(([supplierName, data]) => [
        supplierName,
        data.orders.toString(),
        formatCurrency(data.totalAmount),
      ]);

    exportTable(doc, ["Supplier", "Orders", "Spent"], purchaseRows, {
      startY: sectionY + 10,
      headColor: [22, 163, 74],
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 30, halign: "right" },
      },
    });

    addFooter(doc);

    doc.save(
      `cash-flow-${formatDate(startDate)}-to-${formatDate(endDate)}.pdf`,
    );
  }
}
