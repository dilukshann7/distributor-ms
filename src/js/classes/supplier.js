import logo from "../../assets/logo-tr.png";
import { Supply } from "../models/Supply.js";
import { Order } from "../models/Order.js";
import { Shipment } from "../models/Shipment.js";
import { Invoice } from "../models/Invoice.js";
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
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
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
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-indigo-700 font-semibold shadow-lg"
                  : "text-indigo-100 hover:bg-indigo-600"
              }">
              ${this.getIcon(item.icon)}
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
          <h2 class="text-2xl font-bold text-gray-900">Supplier Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage orders, inventory, and shipments</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("settings")}
          </button>

          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
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

    const periodSelectors = this.container.querySelectorAll(".period-selector");
    // Period selector logic has been moved into SalesAnalytics.attachListeners()
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
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-indigo-700 font-semibold shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-indigo-100 hover:bg-indigo-600";
      }
    });
  }

  getIcon(name) {
    const icons = {
      "shopping-bag":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      archive:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>',
      truck:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "file-text":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      clipboard:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
      "trending-up":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      settings:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      eye: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      download:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
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
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Orders</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">${
                  this.summary.total || 0
                }</p>
              </div>
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending</p>
                <p class="text-3xl font-bold text-yellow-600 mt-2">${
                  this.summary.pending || 0
                }</p>
              </div>
              <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Shipped</p>
                <p class="text-3xl font-bold text-blue-600 mt-2">${
                  this.summary.shipped || 0
                }</p>
              </div>
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Completed</p>
                <p class="text-3xl font-bold text-green-600 mt-2">${
                  this.summary.completed || 0
                }</p>
              </div>
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders
                  .map(
                    (order) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      order.id
                    }</td>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      ${new Date(order.orderDate).toISOString().split("T")[0]}
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${order.items
                        .map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")}
                      
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${order.totalAmount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "LKR",
                      }
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      new Date(order.dueDate).toISOString().split("T")[0]
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(
                        order.dueDate
                      )}">
                        ${
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                      <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
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
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            <h3 class="text-2xl font-bold text-gray-900">Product Catalog</h3>
            <p class="text-gray-600 mt-1">Manage your product offerings</p>
          </div>
          <button class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Product
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.products
                  .map(
                    (product) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      product.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      product.sku
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      product.category
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">Rs. ${
                      product.price
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      product.stock
                    } units</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${product.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                      <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
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
    const preparingCount = this.shipments.filter(
      (s) => s.status === "pending"
    ).length;
    const inTransitCount = this.shipments.filter(
      (s) => s.status === "in-transit"
    ).length;
    const deliveredCount = this.shipments.filter(
      (s) => s.status === "delivered"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Shipment Tracking</h3>
          <p class="text-gray-600 mt-1">Track all shipments and delivery status</p>
        </div>

        <!-- Shipment Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
            <p class="text-gray-600 text-sm">Total Shipments</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.shipments.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Preparing</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">${preparingCount}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">In Transit</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${inTransitCount}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Delivered</p>
            <p class="text-3xl font-bold text-green-600 mt-2">${deliveredCount}</p>
          </div>
        </div>

        <!-- Shipments Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Active Shipments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shipment ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Carrier</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Est. Delivery</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.shipments
                  .map(
                    (shipment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      shipment.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${
                      shipment.purchaseOrderId
                    }</td>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      ${shipment.order.items
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ")}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      shipment.carrier
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      shipment.expectedDeliveryDate
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        shipment.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : shipment.status === "in-transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
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
                    <td class="px-6 py-4 text-sm">
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
    const totalInvoices = this.invoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
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
          <h3 class="text-2xl font-bold text-gray-900">Invoices & Payments</h3>
          <p class="text-gray-600 mt-1">Manage invoices and payment records</p>
        </div>

        <!-- Financial Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
            <p class="text-gray-600 text-sm">Total Invoiced</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">Rs. ${totalInvoices.toFixed(
              2
            )}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Paid</p>
            <p class="text-3xl font-bold text-green-600 mt-2">Rs. ${paidAmount.toFixed(
              2
            )}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">Rs. ${pendingAmount.toFixed(
              2
            )}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <p class="text-gray-600 text-sm">Overdue</p>
            <p class="text-3xl font-bold text-red-600 mt-2">Rs. ${overdueAmount.toFixed(
              2
            )}</p>
          </div>
        </div>

        <!-- Invoices Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Invoice History</h3>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Generate Invoice
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.invoices
                  .map(
                    (invoice) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      invoice.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${
                      invoice.purchaseOrderId
                    }</td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">Rs. ${
                      invoice.totalAmount
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      ${
                        new Date(invoice.invoiceDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      ${new Date(invoice.dueDate).toISOString().split("T")[0]}
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${
                          invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <div class="flex items-center gap-2">
                        <button class="text-indigo-600 hover:text-indigo-800 transition-colors" title="View">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button class="text-blue-600 hover:text-blue-800 transition-colors" title="Download">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                          </svg>
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
          <h3 class="text-2xl font-bold text-gray-900">Sales Analytics</h3>
          <p class="text-gray-600 mt-1">View sales performance and trends</p>
        </div>

        <!-- Period Selector -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex gap-2 mb-6">
            <button class="period-selector px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">Daily</button>
            <button class="period-selector px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">Weekly</button>
            <button class="period-selector px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">Monthly</button>
          </div>

          <!-- Sales Stats -->
          <div class="stats">
            Please Wait...
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Export Analytics</h4>
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
      
    `;
  }

  attachListeners(container) {
    const periodSelectors = container.querySelectorAll(".period-selector");
    // initialize default
    if (periodSelectors.length > 0) {
      // mark Daily as active by default
      periodSelectors.forEach((btn) => {
        if (btn.textContent.trim() === "Daily") {
          btn.classList.add("bg-indigo-600", "text-white");
          btn.classList.remove("bg-gray-200", "text-gray-700");
        } else {
          btn.classList.remove("bg-indigo-600", "text-white");
          btn.classList.add("bg-gray-200", "text-gray-700");
        }
      });

      // initialize stats
      this.handlePeriodChange("daily", container).catch((e) =>
        console.error("Error initializing analytics:", e)
      );

      periodSelectors.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const periodText = button.textContent.trim(); // "Daily", "Weekly", "Monthly"

          periodSelectors.forEach((btn) => {
            btn.classList.remove("bg-indigo-600", "text-white");
            btn.classList.add("bg-gray-200", "text-gray-700");
          });

          button.classList.add("bg-indigo-600", "text-white");
          button.classList.remove("bg-gray-200", "text-gray-700");

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
    if (this.period === "daily") {
      statSelector.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <p class="text-gray-700 text-sm font-medium">Total Orders</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">${summary.data.daily.orders}</p>
              <p class="text-xs text-gray-600 mt-2">Today</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <p class="text-gray-700 text-sm font-medium">Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">${summary.data.daily.revenue}</p>
              <p class="text-xs text-gray-600 mt-2">Today</p>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-indigo-600 mt-2">${summary.data.daily.items}</p>
              <p class="text-xs text-gray-600 mt-2">Today</p>
            </div>
          </div>`;
    } else if (this.period === "weekly") {
      statSelector.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <p class="text-gray-700 text-sm font-medium">Total Orders</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">${summary.data.weekly.orders}</p>
              <p class="text-xs text-gray-600 mt-2">This Week</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <p class="text-gray-700 text-sm font-medium">Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">${summary.data.weekly.revenue}</p>
              <p class="text-xs text-gray-600 mt-2">This Week</p>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-indigo-600 mt-2">${summary.data.weekly.items}</p>
              <p class="text-xs text-gray-600 mt-2">This Week</p>
            </div>
          </div>`;
    } else if (this.period === "monthly") {
      statSelector.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <p class="text-gray-700 text-sm font-medium">Total Orders</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">${summary.data.monthly.orders}</p>
              <p class="text-xs text-gray-600 mt-2">This Month</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <p class="text-gray-700 text-sm font medium">Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">${summary.data.monthly.revenue}</p>
              <p class="text-xs text-gray-600 mt-2">This Month</p>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-indigo-600 mt-2">${summary.data.monthly.items}</p>
              <p class="text-xs text-gray-600 mt-2">This Month</p>
            </div>
          </div>`;
    }
  }
}

export async function renderSupplierDashboard(container) {
  const dashboard = new SupplierDashboard(container);
  await dashboard.render();
}
