import logo from "../../assets/logo-tr.png";
import { SalesOrder } from "../models/SalesOrder.js";
import { Product } from "../models/Product.js";
import { Customer } from "../models/Customer.js";
import axios from "axios";

class SalesmanDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
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
      <div class="fixed lg:relative w-64 h-screen bg-gradient-to-b from-sky-700 to-sky-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
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

      </div>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Salesman Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage orders, customers, and sales activities</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-sky-600 rounded-full"></span>
          </button>

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
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");

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

    const sectionContent = sectionInstance.render();

    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    if (section === "orders") {
      sectionInstance.attachEventListeners(this.container);
    } else if (section === "reports") {
      sectionInstance.attachListeners(this.container);
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
    this.products = [];
    this.customers = [];
    this.view = "list";
    this.editingOrder = null;
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

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.products = [];
    }
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
    if (this.view === "add") {
      return this.renderAddForm();
    }
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
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
                  <td class="px-6 py-4 text-gray-700">${new Date(
                    order.orderDate
                  ).toLocaleDateString()}</td>
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
                  <td class="px-6 py-4 font-semibold text-gray-900">Rs. ${order.subtotal.toLocaleString()}</td>
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
                    <button class="edit-order-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" data-order-id="${
                      order.id
                    }">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="delete-order-btn p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" data-order-id="${
                      order.id
                    }">
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

  renderAddForm() {
    return `
      <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Create New Sales Order</h3>
            <p class="text-gray-600 mt-1">Add a new order to the system</p>
          </div>
        </div>

        <form id="addOrderForm" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Order Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order Number</label>
                  <input type="text" name="orderNumber" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="e.g. ORD-2024-001">
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Customer</label>
                  <select name="customerId" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="">-- Select Customer --</option>
                    ${this.customers
                      .map(
                        (customer) => `
                      <option value="${customer.id}" data-name="${customer.name}">
                        ${customer.name}
                      </option>
                    `
                      )
                      .join("")}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order Date</label>
                  <input type="date" name="orderDate" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Total Amount (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-gray-500 font-medium">Rs.</span>
                    <input type="number" id="subtotal" name="subtotal" required min="0" step="0.01" class="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="0.00" readonly>
                  </div>
                  <p class="text-xs text-gray-500">Calculated automatically from items</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="pending" selected>Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Authorized</label>
                  <select name="authorized" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="false" selected>No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="Enter order notes or special instructions..."></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Order Items
              </h4>
              <div class="space-y-4" id="itemsContainer">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 item-row bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div class="space-y-2 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Product</label>
                    <select name="productId[]" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white product-select" data-row="0">
                      <option value="">-- Select Product --</option>
                      ${this.products
                        .map(
                          (product) => `
                        <option value="${product.id}" data-name="${
                            product.name
                          }" data-price="${product.price}" data-stock="${
                            product.quantity
                          }">
                          ${product.name} - Rs. ${product.price.toFixed(
                            2
                          )} (Stock: ${product.quantity})
                        </option>
                      `
                        )
                        .join("")}
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" name="itemQuantity[]" required min="1" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white item-quantity" data-row="0" placeholder="1">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Subtotal</label>
                    <input type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 item-subtotal font-medium text-gray-900" data-row="0" readonly placeholder="Rs. 0.00">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Action</label>
                    <button type="button" class="remove-item-btn w-full px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" id="addItemBtn" class="mt-4 px-6 py-2.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors flex items-center gap-2 font-medium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add Another Item
              </button>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" id="cancelFormBtn" class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Create Order
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const order = this.editingOrder;
    if (!order) return this.renderList();

    return `
      <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Edit Sales Order</h3>
            <p class="text-gray-600 mt-1">Update order information</p>
          </div>
        </div>

        <form id="editOrderForm" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Order Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order Number</label>
                  <input type="text" name="orderNumber" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" value="${
                    order.orderNumber || ""
                  }">
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Customer Name</label>
                  <input type="text" name="customerName" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-gray-100" value="${
                    order.customerName || ""
                  }" readonly>
                  <p class="text-xs text-gray-500">Customer cannot be changed</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order Date</label>
                  <input type="date" name="orderDate" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" value="${
                    order.orderDate ? order.orderDate.split("T")[0] : ""
                  }">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Total Amount (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-gray-500 font-medium">Rs.</span>
                    <input type="number" name="subtotal" required min="0" step="0.01" class="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" value="${
                      order.subtotal || 0
                    }">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="pending" ${
                      order.status === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="confirmed" ${
                      order.status === "confirmed" ? "selected" : ""
                    }>Confirmed</option>
                    <option value="delivered" ${
                      order.status === "delivered" ? "selected" : ""
                    }>Delivered</option>
                    <option value="cancelled" ${
                      order.status === "cancelled" ? "selected" : ""
                    }>Cancelled</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Authorized</label>
                  <select name="authorized" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="false" ${
                      !order.authorized ? "selected" : ""
                    }>No</option>
                    <option value="true" ${
                      order.authorized ? "selected" : ""
                    }>Yes</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Payment Status</label>
                  <select name="paymentStatus" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="pending" ${
                      order.paymentStatus === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="paid" ${
                      order.paymentStatus === "paid" ? "selected" : ""
                    }>Paid</option>
                    <option value="failed" ${
                      order.paymentStatus === "failed" ? "selected" : ""
                    }>Failed</option>
                    <option value="refunded" ${
                      order.paymentStatus === "refunded" ? "selected" : ""
                    }>Refunded</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">${
                    order.notes || ""
                  }</textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Order Items
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-2">Current Items:</p>
                <ul class="list-disc list-inside text-sm text-gray-700">
                  ${
                    order.items
                      ? order.items
                          .map(
                            (item) =>
                              `<li>${item.name} - Quantity: ${item.quantity}</li>`
                          )
                          .join("")
                      : "<li>No items</li>"
                  }
                </ul>
                <p class="text-xs text-gray-500 mt-2">Note: Item editing not available. Cancel and create a new order if items need to be changed.</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" id="cancelEditOrderBtn" class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Update Order
            </button>
          </div>
        </form>
      </div>
    `;
  }

  attachEventListeners(container) {
    const toggleBtn = container.querySelector("#toggleFormBtn");
    const cancelBtn = container.querySelector("#cancelFormBtn");
    const cancelEditBtn = container.querySelector("#cancelEditOrderBtn");
    const addForm = container.querySelector("#addOrderForm");
    const editForm = container.querySelector("#editOrderForm");
    const addItemBtn = container.querySelector("#addItemBtn");
    const editBtns = container.querySelectorAll(".edit-order-btn");
    const deleteBtns = container.querySelectorAll(".delete-order-btn");

    const showFormHandler = async () => {
      await this.getProducts();
      await this.getCustomers();
      this.view = "add";
      this.editingOrder = null;
      this.refresh(container);
    };

    const switchToEdit = (orderId) => {
      this.editingOrder = this.orders.find((o) => o.id === parseInt(orderId));
      this.view = "edit";
      this.refresh(container);
    };

    const switchToList = () => {
      this.view = "list";
      this.editingOrder = null;
      this.refresh(container);
    };

    const deleteOrder = (orderId) => {
      if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        SalesOrder.delete(orderId)
          .then(() => {
            this.getOrders().then(() => switchToList());
          })
          .catch((error) => {
            console.error("Error deleting order:", error);
            alert("Error deleting order. Please try again.");
          });
      }
    };

    const calculateTotal = () => {
      const rows = container.querySelectorAll(".item-row");
      let total = 0;

      rows.forEach((row) => {
        const subtotalInput = row.querySelector(".item-subtotal");
        if (subtotalInput && subtotalInput.value) {
          const subtotal = parseFloat(
            subtotalInput.value.replace("Rs. ", "").replace(",", "")
          );
          if (!isNaN(subtotal)) {
            total += subtotal;
          }
        }
      });

      const subtotalInput = container.querySelector("#subtotal");
      if (subtotalInput) {
        subtotalInput.value = total.toFixed(2);
      }
    };

    const updateSubtotal = (row) => {
      const productSelect = row.querySelector(".product-select");
      const quantityInput = row.querySelector(".item-quantity");
      const subtotalInput = row.querySelector(".item-subtotal");

      if (productSelect && quantityInput && subtotalInput) {
        const selectedOption =
          productSelect.options[productSelect.selectedIndex];
        const price = parseFloat(selectedOption.dataset.price || 0);
        const quantity = parseInt(quantityInput.value || 0);
        const stock = parseInt(selectedOption.dataset.stock || 0);

        if (quantity > stock && stock > 0) {
          alert(`Only ${stock} units available in stock!`);
          quantityInput.value = stock;
          return;
        }

        const subtotal = price * quantity;
        subtotalInput.value = `Rs. ${subtotal.toFixed(2)}`;
        calculateTotal();
      }
    };

    const attachItemListeners = () => {
      const productSelects = container.querySelectorAll(".product-select");
      const quantityInputs = container.querySelectorAll(".item-quantity");

      productSelects.forEach((select) => {
        select.addEventListener("change", (e) => {
          const row = e.target.closest(".item-row");
          updateSubtotal(row);
        });
      });

      quantityInputs.forEach((input) => {
        input.addEventListener("input", (e) => {
          const row = e.target.closest(".item-row");
          updateSubtotal(row);
        });
      });
    };

    const addItemRow = () => {
      const itemsContainer = container.querySelector("#itemsContainer");
      const rowCount = itemsContainer.querySelectorAll(".item-row").length;
      const newRow = document.createElement("div");
      newRow.className =
        "grid grid-cols-1 md:grid-cols-5 gap-4 item-row bg-gray-50 p-4 rounded-lg border border-gray-200";
      newRow.innerHTML = `
        <div class="space-y-2 md:col-span-2">
          <select name="productId[]" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white product-select" data-row="${rowCount}">
            <option value="">-- Select Product --</option>
            ${this.products
              .map(
                (product) => `
              <option value="${product.id}" data-name="${
                  product.name
                }" data-price="${product.price}" data-stock="${
                  product.quantity
                }">
                ${product.name} - Rs. ${product.price.toFixed(2)} (Stock: ${
                  product.quantity
                })
              </option>
            `
              )
              .join("")}
          </select>
        </div>
        <div class="space-y-2">
          <input type="number" name="itemQuantity[]" required min="1" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white item-quantity" data-row="${rowCount}" placeholder="1">
        </div>
        <div class="space-y-2">
          <input type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 item-subtotal font-medium text-gray-900" data-row="${rowCount}" readonly placeholder="Rs. 0.00">
        </div>
        <div class="space-y-2">
          <button type="button" class="remove-item-btn w-full px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Remove
          </button>
        </div>
      `;
      itemsContainer.appendChild(newRow);
      attachRemoveListeners();
      attachItemListeners();
    };

    const attachRemoveListeners = () => {
      const removeBtns = container.querySelectorAll(".remove-item-btn");
      removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const row = e.target.closest(".item-row");
          const itemsContainer = container.querySelector("#itemsContainer");
          if (itemsContainer.querySelectorAll(".item-row").length > 1) {
            row.remove();
            calculateTotal();
          } else {
            alert("At least one item is required");
          }
        });
      });
    };

    const submitAddForm = (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      const productIds = formData.getAll("productId[]");
      const itemQuantities = formData.getAll("itemQuantity[]");

      const items = productIds
        .map((productId, index) => {
          const product = this.products.find(
            (p) => p.id === parseInt(productId)
          );
          return {
            name: product?.name || "Unknown",
            quantity: parseInt(itemQuantities[index], 10),
          };
        })
        .filter((item) => item.quantity > 0);

      if (items.length === 0) {
        alert("Please add at least one item to the order");
        return;
      }

      const customerId = parseInt(formData.get("customerId"));
      const customer = this.customers.find((c) => c.id === customerId);

      const orderData = {
        orderNumber: formData.get("orderNumber"),
        customerName: customer?.name || "Unknown Customer",
        customerId: customerId,
        orderDate: new Date(formData.get("orderDate")).toISOString(),
        status: formData.get("status"),
        paymentStatus: "unpaid", // default
        notes: formData.get("notes") || null,
        items: items,
        subtotal: parseFloat(formData.get("subtotal")),
      };

      SalesOrder.create(orderData)
        .then(() => {
          this.getOrders().then(() => switchToList());
        })
        .catch((error) => {
          console.error("Error creating order:", error);
          alert("Error creating order. Please try again.");
        });
    };

    const submitEditForm = (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      const orderData = {
        orderNumber: formData.get("orderNumber"),
        orderDate: new Date(formData.get("orderDate")).toISOString(),
        subtotal: parseFloat(formData.get("subtotal")),
        status: formData.get("status"),
        paymentStatus: formData.get("paymentStatus"),
        notes: formData.get("notes") || null,
      };

      SalesOrder.update(this.editingOrder.id, orderData)
        .then(() => {
          this.getOrders().then(() => switchToList());
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          alert("Error updating order. Please try again.");
        });
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", showFormHandler);
    }

    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.dataset.orderId;
        switchToEdit(orderId);
      });
    });

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.dataset.orderId;
        deleteOrder(orderId);
      });
    });

    if (cancelBtn) {
      cancelBtn.addEventListener("click", switchToList);
    }

    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", switchToList);
    }

    if (addForm) {
      addForm.addEventListener("submit", submitAddForm);
    }

    if (editForm) {
      editForm.addEventListener("submit", submitEditForm);
    }

    if (addItemBtn) {
      addItemBtn.addEventListener("click", addItemRow);
    }

    attachRemoveListeners();
    attachItemListeners();
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      this.attachEventListeners(container);
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
      const response = await axios.get(
        "http://localhost:3000/api/salesman/overall-summary"
      );
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
  await ordersSection.getOrders();
  ordersSection.attachEventListeners(container);
}
