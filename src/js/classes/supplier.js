import logo from "../../assets/logo-tr.png";
import { Supply } from "../models/Supply.js";
import { Order } from "../models/Order.js";
import { Shipment } from "../models/Shipment.js";
import { Invoice } from "../models/Invoice.js";
import { getIconHTML } from "../../assets/icons/index.js";
import "../../css/supplier-style.css";
import axios from "axios";

class SupplierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.isSidebarOpen = true;
  }

  async render() {
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto">
            <div class="p-8">
              ${sectionContent}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderSidebar() {
    const menuItems = [
      { id: "orders", label: "Purchase Orders", icon: "shopping-bag" },
      { id: "products", label: "Product Catalog", icon: "package" },
      { id: "shipments", label: "Shipment Tracking", icon: "truck" },
      { id: "invoices", label: "Invoices & Payments", icon: "file-text" },
      { id: "analytics", label: "Sales Analytics", icon: "trending-up" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-indigo-700 text-white rounded-lg">
        ${this.isSidebarOpen ? getIconHTML("x") : getIconHTML("menu")}
      </button>

      <!-- Sidebar -->
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item ${
                this.currentSection === item.id
                  ? "nav-item-active"
                  : "nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-indigo-600">
          <div class="bg-indigo-600 rounded-lg p-4">
            <p class="text-sm text-indigo-100">Supplier Account</p>
            <p class="font-semibold text-white mt-1"></p>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      ${
        this.isSidebarOpen
          ? '<div id="mobileOverlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"></div>'
          : ""
      }
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="section-header">Supplier Dashboard</h2>
          <p class="section-subtitle text-sm">Manage orders, inventory, and shipments</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative btn-icon">
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button class="btn-icon">
            ${getIconHTML("settings")}
          </button>

          <button id="logoutBtn" class="btn-icon">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      orders: new PurchaseOrders(),
      products: new ProductCatalog(),
      shipments: new ShipmentTracking(),
      invoices: new InvoicesPayments(),
      analytics: new SalesAnalytics(),
    };
    const sectionInstance = sections[section];
    if (section === "analytics") {
      await sectionInstance.getSalesData();
    } else if (section === "orders") {
      await sectionInstance.getOrders();
      await sectionInstance.getSummary();
    } else if (section === "products") {
      await sectionInstance.getSupply();
    } else if (section === "shipments") {
      await sectionInstance.getShipments();
    } else if (section === "invoices") {
      await sectionInstance.getInvoices();
    }
    return sectionInstance.render();
  }

  attachEventListeners() {
    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateToSection(section);
      });
    });

    const logoutBtn = this.container.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    const mobileToggle = this.container.querySelector("#mobileToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        this.isSidebarOpen = !this.isSidebarOpen;
        this.render();
      });
    }

    const mobileOverlay = this.container.querySelector("#mobileOverlay");
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", () => {
        this.isSidebarOpen = false;
        this.render();
      });
    }
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    this.attachEventListeners();

    if (section === "analytics") {
      const analytics = new SalesAnalytics();
      analytics.attachListeners(this.container);
    }

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item nav-item-active";
      } else {
        item.className = "nav-item nav-item-inactive";
      }
    });
  }
}

class PurchaseOrders {
  constructor() {
    this.orders = [];
    this.summary = [];
  }

  async getOrders() {
    try {
      const response = await Order.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  async getSummary() {
    try {
      const response = await Order.getSummary();
      this.summary = response.data;
    } catch (error) {
      console.error("Error fetching order summary:", error);
      this.summary = {};
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="stat-card stat-card-border-indigo">
            <div class="flex items-center justify-between">
              <div>
                <p class="stat-label">Total Orders</p>
                <p class="stat-value">${this.summary.total || 0}</p>
              </div>
              ${getIconHTML("shopping-bag").replace('class="w-5 h-5"', 'class="w-10 h-10 text-indigo-600"')}
            </div>
          </div>

          <div class="stat-card stat-card-border-yellow">
            <div class="flex items-center justify-between">
              <div>
                <p class="stat-label">Pending</p>
                <p class="stat-value-colored text-yellow-600">${this.summary.pending || 0}</p>
              </div>
              ${getIconHTML("clock").replace('class="w-5 h-5"', 'class="w-10 h-10 text-yellow-600"')}
            </div>
          </div>

          <div class="stat-card stat-card-border-blue">
            <div class="flex items-center justify-between">
              <div>
                <p class="stat-label">Shipped</p>
                <p class="stat-value-colored text-blue-600">${this.summary.shipped || 0}</p>
              </div>
              ${getIconHTML("truck").replace('class="w-5 h-5"', 'class="w-10 h-10 text-blue-600"')}
            </div>
          </div>

          <div class="stat-card stat-card-border-green">
            <div class="flex items-center justify-between">
              <div>
                <p class="stat-label">Completed</p>
                <p class="stat-value-colored text-green-600">${this.summary.completed || 0}</p>
              </div>
              ${getIconHTML("check-circle").replace('class="w-5 h-5"', 'class="w-10 h-10 text-green-600"')}
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Recent Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Order Date</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Total</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders
                  .map(
                    (order) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${order.id}</td>
                    <td class="table-cell">
                      ${new Date(order.orderDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell-bold">
                      ${order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                    </td>
                    <td class="table-cell">${order.totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "LKR",
                    })}</td>
                    <td class="table-cell">${new Date(order.dueDate).toISOString().split("T")[0]}</td>
                    <td class="table-cell">
                      <span class="status-badge ${this.getStatusColor(order.dueDate)}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td class="table-cell flex gap-2">
                      <button class="btn-action text-blue-600" title="View">
                        ${getIconHTML("eye")}
                      </button>
                      <button class="btn-action text-green-600" title="Edit">
                        ${getIconHTML("edit")}
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    const statusMap = {
      pending: "status-yellow",
      confirmed: "status-blue",
      shipped: "status-indigo",
      delivered: "status-green",
    };
    return statusMap[status] || "status-gray";
  }
}

class ProductCatalog {
  constructor() {
    this.products = [];
  }

  async getSupply() {
    try {
      const response = await Supply.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching supplies:", error);
      this.products = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="section-header">Product Catalog</h3>
            <p class="section-subtitle">Manage your product offerings</p>
          </div>
          <button class="btn-primary flex items-center gap-2">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="card-container">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Product Name</th>
                  <th class="table-header">SKU</th>
                  <th class="table-header">Category</th>
                  <th class="table-header">Price</th>
                  <th class="table-header">Stock</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.products
                  .map(
                    (product) => `
                  <tr class="table-row">
                    <td class="table-cell-medium">${product.name}</td>
                    <td class="table-cell">${product.sku}</td>
                    <td class="table-cell">${product.category}</td>
                    <td class="table-cell-bold">Rs. ${product.price}</td>
                    <td class="table-cell">${product.stock} units</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        product.status === "In Stock" ? "status-green" : "status-yellow"
                      }">
                        ${product.status}
                      </span>
                    </td>
                    <td class="table-cell flex gap-2">
                      <button class="btn-action text-blue-600">
                        ${getIconHTML("edit")}
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

class ShipmentTracking {
  constructor() {
    this.shipments = [];
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = response.data;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = [];
    }
  }

  render() {
    const preparingCount = this.shipments.filter((s) => s.status === "pending").length;
    const inTransitCount = this.shipments.filter((s) => s.status === "in-transit").length;
    const deliveredCount = this.shipments.filter((s) => s.status === "delivered").length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Shipment Tracking</h3>
          <p class="section-subtitle">Track all shipments and delivery status</p>
        </div>

        <!-- Shipment Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="stat-card stat-card-border-indigo">
            <p class="stat-label">Total Shipments</p>
            <p class="stat-value">${this.shipments.length}</p>
          </div>
          <div class="stat-card stat-card-border-yellow">
            <p class="stat-label">Preparing</p>
            <p class="stat-value-colored text-yellow-600">${preparingCount}</p>
          </div>
          <div class="stat-card stat-card-border-blue">
            <p class="stat-label">In Transit</p>
            <p class="stat-value-colored text-blue-600">${inTransitCount}</p>
          </div>
          <div class="stat-card stat-card-border-green">
            <p class="stat-label">Delivered</p>
            <p class="stat-value-colored text-green-600">${deliveredCount}</p>
          </div>
        </div>

        <!-- Shipments Table -->
        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Active Shipments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Shipment ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Carrier</th>
                  <th class="table-header">Est. Delivery</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.shipments
                  .map(
                    (shipment) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${shipment.id}</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${shipment.purchaseOrderId}</td>
                    <td class="table-cell">
                      ${shipment.order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                    </td>
                    <td class="table-cell">${shipment.carrier}</td>
                    <td class="table-cell">${shipment.expectedDeliveryDate}</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        shipment.status === "delivered"
                          ? "status-green"
                          : shipment.status === "in-transit"
                          ? "status-blue"
                          : "status-yellow"
                      }">
                        ${
                          shipment.status === "delivered"
                            ? "Delivered"
                            : shipment.status === "in-transit"
                            ? "In Transit"
                            : "Preparing"
                        }
                      </span>
                    </td>
                    <td class="table-cell">
                      <button class="text-indigo-600 hover:text-indigo-800 font-medium" title="Track">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

class InvoicesPayments {
  constructor() {
    this.invoices = [];
  }

  async getInvoices() {
    try {
      const response = await Invoice.getAll();
      this.invoices = response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      this.invoices = [];
    }
  }

  render() {
    const totalInvoices = this.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = this.invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = this.invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const overdueAmount = this.invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Invoices & Payments</h3>
          <p class="section-subtitle">Manage invoices and payment records</p>
        </div>

        <!-- Financial Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="stat-card stat-card-border-indigo">
            <p class="stat-label">Total Invoiced</p>
            <p class="stat-value">Rs. ${totalInvoices.toFixed(2)}</p>
          </div>
          <div class="stat-card stat-card-border-green">
            <p class="stat-label">Paid</p>
            <p class="stat-value-colored text-green-600">Rs. ${paidAmount.toFixed(2)}</p>
          </div>
          <div class="stat-card stat-card-border-yellow">
            <p class="stat-label">Pending</p>
            <p class="stat-value-colored text-yellow-600">Rs. ${pendingAmount.toFixed(2)}</p>
          </div>
          <div class="stat-card stat-card-border-red">
            <p class="stat-label">Overdue</p>
            <p class="stat-value-colored text-red-600">Rs. ${overdueAmount.toFixed(2)}</p>
          </div>
        </div>

        <!-- Invoices Table -->
        <div class="card-container">
          <div class="card-header flex items-center justify-between">
            <h3 class="card-title">Invoice History</h3>
            <button class="btn-primary flex items-center gap-2 text-sm font-medium">
              ${getIconHTML("plus")}
              Generate Invoice
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Invoice ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Issue Date</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.invoices
                  .map(
                    (invoice) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${invoice.id}</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${invoice.purchaseOrderId}</td>
                    <td class="table-cell-bold">Rs. ${invoice.totalAmount}</td>
                    <td class="table-cell">
                      ${new Date(invoice.invoiceDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell">
                      ${new Date(invoice.dueDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        invoice.status === "paid"
                          ? "status-green"
                          : invoice.status === "pending"
                          ? "status-yellow"
                          : "status-red"
                      }">
                        ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td class="table-cell">
                      <div class="flex items-center gap-2">
                        <button class="text-indigo-600 hover:text-indigo-800 transition-colors" title="View">
                          ${getIconHTML("eye")}
                        </button>
                        <button class="text-blue-600 hover:text-blue-800 transition-colors" title="Download">
                          ${getIconHTML("download")}
                        </button>
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

class SalesAnalytics {
  constructor() {
    this.topProducts = [];
    this.salesData = [];
    this.summary = [];
  }

  async getTopProducts() {
    try {
      const response = await Supply.getMostStocked(3);
      this.topProducts = response.data;
    } catch (error) {
      console.error("Error fetching top products:", error);
      this.topProducts = [];
    }
  }

  async getSalesData() {
    try {
      const response = await Order.getDailyOrders();
      const dailyOrders = response.data;

      const weeklyResponse = await Order.getWeeklyOrders();
      const weeklyOrders = weeklyResponse.data;

      const monthlyResponse = await Order.getMonthlyOrders();
      const monthlyOrders = monthlyResponse.data;
      this.salesData = {
        daily: dailyOrders,
        weekly: weeklyOrders,
        monthly: monthlyOrders,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
      this.salesData = {
        daily: { orders: 0, revenue: 0, items: 0 },
        weekly: { orders: 0, revenue: 0, items: 0 },
        monthly: { orders: 0, revenue: 0, items: 0 },
      };
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Sales Analytics</h3>
          <p class="section-subtitle">View sales performance and trends</p>
        </div>

        <!-- Period Selector -->
        <div class="card-container">
          <div class="p-6">
            <div class="flex gap-2 mb-6">
              <button class="period-selector period-selector-active">Daily</button>
              <button class="period-selector period-selector-inactive">Weekly</button>
              <button class="period-selector period-selector-inactive">Monthly</button>
            </div>

            <!-- Sales Stats -->
            <div class="stats">
              Please Wait...
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="card-container">
          <div class="p-6">
            <h4 class="card-title mb-4">Export Analytics</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Export to PDF
              </button>
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export to Excel
              </button>
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachListeners(container) {
    const periodSelectors = container.querySelectorAll(".period-selector");
    if (periodSelectors.length > 0) {
      periodSelectors.forEach((btn) => {
        if (btn.textContent.trim() === "Daily") {
          btn.className = "period-selector period-selector-active";
        } else {
          btn.className = "period-selector period-selector-inactive";
        }
      });

      this.handlePeriodChange("daily", container).catch((e) =>
        console.error("Error initializing analytics:", e)
      );

      periodSelectors.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const periodText = button.textContent.trim();

          periodSelectors.forEach((btn) => {
            btn.className = "period-selector period-selector-inactive";
          });

          button.className = "period-selector period-selector-active";

          if (periodText === "Daily") {
            await this.handlePeriodChange("daily", container);
          } else if (periodText === "Weekly") {
            await this.handlePeriodChange("weekly", container);
          } else if (periodText === "Monthly") {
            await this.handlePeriodChange("monthly", container);
          }
        });
      });
    }
  }

  async handlePeriodChange(period, container) {
    const statSelector = container.querySelector(".stats");
    const apiURL = "http://localhost:3000/api/supplier/overall-summary";
    const summary = await axios.get(apiURL);

    this.period = period;
    const periodLabel = period === "daily" ? "Today" : period === "weekly" ? "This Week" : "This Month";
    const data = summary.data[period];

    statSelector.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="analytics-card-blue">
          <p class="text-gray-700 text-sm font-medium">Total Orders</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">${data.orders}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-green">
          <p class="text-gray-700 text-sm font-medium">Revenue</p>
          <p class="text-3xl font-bold text-green-600 mt-2">${data.revenue}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-indigo">
          <p class="text-gray-700 text-sm font-medium">Items Sold</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">${data.items}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>
      </div>
    `;
  }
}

export async function renderSupplierDashboard(container) {
  const dashboard = new SupplierDashboard(container);
  await dashboard.render();
}
