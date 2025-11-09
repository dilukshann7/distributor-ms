import logo from "../../assets/logo-tr.png";
import { SalesOrder } from "../models/SalesOrder.js";
import { Product } from "../models/Product.js";
import { Customer } from "../models/Customer.js";
import axios from "axios";

class SalesmanDashboard {
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
      { id: "orders", label: "Sales Orders", icon: "shopping-cart" },
      { id: "stock", label: "Stock Availability", icon: "package" },
      { id: "customers", label: "Customer Accounts", icon: "users" },
      { id: "reports", label: "Sales Reports", icon: "bar-chart" },
      { id: "returns", label: "Returns Cancellations", icon: "rotate-ccw" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-sky-700 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
      <div class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-sky-700 to-sky-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
                <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-sky-500 text-white shadow-lg"
                  : "text-sky-100 hover:bg-sky-600"
              }">
              ${this.getIcon(item.icon)}
              <span class="font-medium">${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-sky-600">
          <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-100 hover:bg-sky-600 transition-all">
            ${this.getIcon("log-out")}
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </div>

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
          <h2 class="text-2xl font-bold text-gray-900">Sales Management Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage orders, customers, and sales activities</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-sky-600 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="text-right">
              <p class="font-medium text-gray-800">Sarah Johnson</p>
              <p class="text-xs text-gray-600">Sales Executive</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold">
              SJ
            </div>
          </div>

          <button id="logoutBtnHeader" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      orders: new SalesOrders(),
      stock: new StockAvailability(),
      customers: new CustomerAccounts(),
      reports: new SalesReports(),
      returns: new ReturnsAndCancellations(),
    };
    const sectionInstance = sections[section];
    if (section === "orders") {
      await sectionInstance.getOrders();
    } else if (section === "stock") {
      await sectionInstance.getInventoryItems();
    } else if (section === "customers") {
      await sectionInstance.getCustomers();
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
    const logoutBtnHeader = this.container.querySelector("#logoutBtnHeader");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    if (logoutBtnHeader) {
      logoutBtnHeader.addEventListener("click", () => {
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

    if (section === "reports") {
      const reports = new SalesReports();
      reports.attachListeners(this.container);
    }

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-sky-500 text-white shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sky-100 hover:bg-sky-600";
      }
    });
  }

  getIcon(name) {
    const icons = {
      "shopping-cart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      users:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      "bar-chart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      "rotate-ccw":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>',
      tag: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      eye: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      phone:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
      mail: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    };
    return icons[name] || "";
  }
}

class SalesOrders {
  constructor() {
    this.orders = [];
  }

  async getOrders() {
    try {
      const response = await SalesOrder.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      this.orders = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Sales Orders</h2>
            <p class="text-gray-600 mt-1">Create and manage customer sales orders</p>
          </div>
          <button id="toggleFormBtn" class="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Order
          </button>
        </div>

        <div id="orderFormContainer" class="hidden">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-sky-600">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Create New Order</h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input type="text" placeholder="Enter customer name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Product Code</label>
                <input type="text" placeholder="Enter product code" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" placeholder="Enter quantity" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input type="number" placeholder="Enter price" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div class="flex gap-3">
              <button class="flex-1 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium">Create Order</button>
              <button id="cancelFormBtn" class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">Cancel</button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.orders
                .map(
                  (order) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">${
                    order.id
                  }</td>
                  <td class="px-6 py-4 text-gray-700">${order.customerName}</td>
                  <td class="px-6 py-4 text-gray-700">${order.orderDate}</td>
                  <td class="px-6 py-4 text-gray-700">${
                    order.items
                      ?.filter((item) => item && item.name)
                      .map(
                        (item) =>
                          `${item.name}${
                            item.quantity ? ` (x${item.quantity})` : ""
                          }`
                      )
                      .join(", ") || "No items"
                  }</td>
                  <td class="px-6 py-4 font-semibold text-gray-900">Rs. ${order.totalAmount.toLocaleString()}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getStatusColor(
                      order.status
                    )}">
                      ${
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 flex gap-2">
                    <button class="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
    `;
  }

  attachEventListeners(container) {
    const toggleBtn = container.querySelector("#toggleFormBtn");
    const cancelBtn = container.querySelector("#cancelFormBtn");
    const formContainer = container.querySelector("#orderFormContainer");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        formContainer.classList.toggle("hidden");
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        formContainer.classList.add("hidden");
      });
    }
  }

  getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}

class StockAvailability {
  constructor() {
    this.products = [];
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.products = [];
    }
  }

  render() {
    const totalProducts = this.products.length;
    const inStock = this.products.filter((p) => p.status === "in-stock").length;
    const lowStock = this.products.filter(
      (p) => p.status === "low-stock"
    ).length;
    const critical = this.products.filter(
      (p) => p.status === "critical"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-3xl font-bold text-gray-900">Stock Availability</h3>
          <p class="text-gray-600 mt-1">Check real-time product inventory</p>
        </div>

        

        <!-- Search Bar -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex gap-4">
            <input type="text" placeholder="Search by product name or SKU..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
            <button class="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium">Search</button>
          </div>
        </div>

        <!-- Stock Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Product Inventory</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
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
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      product.quantity
                    }</td>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-sky-600">Rs. ${product.price.toFixed(
                      2
                    )}</td>
                    
                    <td class="px-6 py-4">
                      <button class="text-sky-600 hover:text-sky-800 font-medium text-sm">View Details</button>
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

class CustomerAccounts {
  constructor() {
    this.customers = [];
  }

  async getCustomers() {
    try {
      const response = await Customer.getAll();
      this.customers = response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.customers = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Customer Accounts</h2>
            <p class="text-gray-600 mt-1">Manage customer information and purchase history</p>
          </div>
          <button class="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Customer
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact Info</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Orders</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.customers
                .map(
                  (customer) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">${
                    customer.name
                  }</td>
                  <td class="px-6 py-4 text-gray-700">${customer.contact}</td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1">
                      <a href="tel:${
                        customer.phone
                      }" class="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        ${customer.phone}
                      </a>
                      <a href="mailto:${
                        customer.email
                      }" class="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        ${customer.email}
                      </a>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-700 font-semibold">${
                    customer.totalPurchases
                  }</td>
                  <td class="px-6 py-4 text-gray-700 font-semibold">Rs. ${customer.totalSpent.toLocaleString()}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }">
                      ${
                        customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 flex gap-2">
                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
    `;
  }
}

class SalesReports {
  constructor() {
    this.salesData = {
      daily: { orders: 0, revenue: 0, items: 0 },
      weekly: { orders: 0, revenue: 0, items: 0 },
      monthly: { orders: 0, revenue: 0, items: 0 },
    };
  }

  async getSalesData() {
    try {
      const response = await axios.get("http://localhost:3000/api/salesman/overall-summary");
      this.salesData = response.data;
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
          <h3 class="text-3xl font-bold text-gray-900">Sales Reports</h3>
          <p class="text-gray-600 mt-1">View detailed sales analytics and performance</p>
        </div>

        <!-- Period Selector -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex gap-2 mb-6">
            <button class="period-selector px-4 py-2 bg-sky-600 text-white rounded-lg font-medium">Daily</button>
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
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Export Reports</h4>
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
    
    if (periodSelectors.length > 0) {
      periodSelectors.forEach((btn) => {
        if (btn.textContent.trim() === "Daily") {
          btn.classList.add("bg-sky-600", "text-white");
          btn.classList.remove("bg-gray-200", "text-gray-700");
        } else {
          btn.classList.remove("bg-sky-600", "text-white");
          btn.classList.add("bg-gray-200", "text-gray-700");
        }
      });

      this.handlePeriodChange("daily", container).catch((e) =>
        console.error("Error initializing analytics:", e)
      );

      periodSelectors.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const periodText = button.textContent.trim();

          periodSelectors.forEach((btn) => {
            btn.classList.remove("bg-sky-600", "text-white");
            btn.classList.add("bg-gray-200", "text-gray-700");
          });

          button.classList.add("bg-sky-600", "text-white");
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

    const apiURL = "http://localhost:3000/api/salesman/overall-summary";

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

            <div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-sky-600 mt-2">${summary.data.daily.items}</p>
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

            <div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-sky-600 mt-2">${summary.data.weekly.items}</p>
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
              <p class="text-gray-700 text-sm font-medium">Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">${summary.data.monthly.revenue}</p>
              <p class="text-xs text-gray-600 mt-2">This Month</p>
            </div>

            <div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
              <p class="text-gray-700 text-sm font-medium">Items Sold</p>
              <p class="text-3xl font-bold text-sky-600 mt-2">${summary.data.monthly.items}</p>
              <p class="text-xs text-gray-600 mt-2">This Month</p>
            </div>
          </div>`;
    }
  }
}

class ReturnsAndCancellations {
  constructor() {
    this.returns = [
      {
        id: "RTN-001",
        orderId: "ORD-2024-105",
        customer: "ABC Store",
        product: "Floor Cleaner",
        quantity: 5,
        reason: "Damaged packaging",
        requestDate: "2025-01-19",
        status: "pending",
      },
      {
        id: "RTN-002",
        orderId: "ORD-2024-098",
        customer: "XYZ Market",
        product: "Handwash",
        quantity: 10,
        reason: "Wrong product delivered",
        requestDate: "2025-01-18",
        status: "approved",
      },
      {
        id: "RTN-003",
        orderId: "ORD-2024-112",
        customer: "Quick Mart",
        product: "Dish Liquid",
        quantity: 3,
        reason: "Quality issue",
        requestDate: "2025-01-19",
        status: "pending",
      },
    ];

    this.cancellations = [
      {
        id: "CAN-001",
        orderId: "ORD-2024-115",
        customer: "Metro Shop",
        items: 8,
        value: 45000,
        reason: "Customer request",
        requestDate: "2025-01-19",
        status: "pending",
      },
      {
        id: "CAN-002",
        orderId: "ORD-2024-110",
        customer: "City Store",
        items: 15,
        value: 87000,
        reason: "Stock unavailable",
        requestDate: "2025-01-18",
        status: "approved",
      },
    ];
  }

  render() {
    const pendingReturns = this.returns.filter(
      (r) => r.status === "pending"
    ).length;
    const pendingCancellations = this.cancellations.filter(
      (c) => c.status === "pending"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Returns & Cancellations</h3>
          <p class="text-gray-600 mt-1">Manage product returns and order cancellations</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-sky-600">
            <p class="text-gray-600 text-sm">Total Returns</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.returns.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">Pending Returns</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">${pendingReturns}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Cancellations</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.cancellations.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <p class="text-gray-600 text-sm">Pending Cancellations</p>
            <p class="text-3xl font-bold text-red-600 mt-2">${pendingCancellations}</p>
          </div>
        </div>

        <!-- Returns Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Product Returns</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Return ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.returns
                  .map(
                    (returnItem) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      returnItem.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-sky-600 font-medium">${
                      returnItem.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      returnItem.customer
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      returnItem.product
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      returnItem.quantity
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      returnItem.reason
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      returnItem.requestDate
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        returnItem.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : returnItem.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          returnItem.status.charAt(0).toUpperCase() +
                          returnItem.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        returnItem.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                          <button class="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                        </div>
                      `
                          : `<button class="text-sky-600 hover:text-sky-800 text-sm font-medium">View</button>`
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cancellations Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Order Cancellations</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cancellation ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.cancellations
                  .map(
                    (cancel) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      cancel.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-sky-600 font-medium">${
                      cancel.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      cancel.customer
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      cancel.items
                    } items</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">Rs. ${cancel.value.toFixed(
                      2
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      cancel.reason
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      cancel.requestDate
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        cancel.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : cancel.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          cancel.status.charAt(0).toUpperCase() +
                          cancel.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        cancel.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                          <button class="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                        </div>
                      `
                          : `<button class="text-sky-600 hover:text-sky-800 text-sm font-medium">View</button>`
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Guidelines -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-blue-900 mb-1">Return & Cancellation Policy</h5>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Returns accepted within 7 days of delivery</li>
                <li>• Damaged or defective products eligible for immediate return</li>
                <li>• Cancellations must be processed before order shipment</li>
                <li>• Refunds processed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export async function renderSalesmanDashboard(container) {
  const dashboard = new SalesmanDashboard(container);
  await dashboard.render();

  const content = container.querySelector("#dashboardContent");
  const ordersSection = new SalesOrders();
  ordersSection.attachEventListeners(content);
}
