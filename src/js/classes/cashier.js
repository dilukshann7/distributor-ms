import logo from "../../assets/logo-tr.png";
import { Cart } from "../models/Cart.js";
import { smallOrder } from "../models/SmallOrder.js";

class CashierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "sales";
    this.isSidebarOpen = true;
    this.currentTime = new Date().toLocaleTimeString();
    this.startClock();
  }

  startClock() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
      const timeElement = this.container.querySelector("#currentTime");
      if (timeElement) {
        timeElement.textContent = this.currentTime;
      }
    }, 1000);
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
      { id: "sales", label: "Sales Transaction", icon: "dollar" },
      { id: "reports", label: "Financial Reports", icon: "bar-chart" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-cyan-700 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
      <div class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-cyan-700 to-cyan-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
                <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />
        

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-cyan-700 font-semibold shadow-lg"
                  : "text-cyan-100 hover:bg-cyan-600"
              }">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-cyan-600">
          <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cyan-100 hover:bg-cyan-600 transition-all">
            ${this.getIcon("log-out")}
            <span>Logout</span>
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
      <div class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Cashier Dashboard</h2>
          <p class="text-gray-500 text-sm mt-1">Manage transactions and payments</p>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-gray-600">
            ${this.getIcon("clock")}
            <span class="font-mono text-sm" id="currentTime">${
              this.currentTime
            }</span>
          </div>

          <div class="relative">
            ${this.getIcon("bell")}
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>

          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              ${this.getIcon("user")}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">John Doe</p>
              <p class="text-xs text-gray-500">Cashier</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderSection(section) {
    const sections = {
      sales: new SalesTransaction(),
      reports: new FinancialReports(),
    };
    const sectionInstance = sections[section];

    if (section === "sales") {
      await sectionInstance.getCartItems();
      await sectionInstance.getSmallOrder();
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

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-cyan-700 font-semibold shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-cyan-100 hover:bg-cyan-600";
      }
    });
  }

  getIcon(name) {
    const icons = {
      dollar:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "credit-card":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      receipt:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      "trending-up":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
      "rotate-ccw":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>',
      "bar-chart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      users:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      bell: '<svg class="w-5 h-5 text-gray-600 cursor-pointer hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      user: '<svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      trash:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      "shopping-cart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      check:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
      banknote:
        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class SalesTransaction {
  constructor() {
    this.cartItems = [];
  }

  async getCartItems() {
    try {
      const response = await Cart.getAll();
      if (response.data && response.data.length > 0) {
        const cart = response.data[0];
        this.cartItems = cart.items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total,
        }));
      } else {
        this.cartItems = [];
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      this.cartItems = [];
    }
  }

  async getSmallOrder() {
    try {
      const response = await smallOrder.getAll();

      if (response.data && response.data.length > 0) {
        // Filter orders with status "completed"
        const completedOrders = response.data.filter(
          (order) => order.status === "completed"
        );
        this.smallOrder = completedOrders.length > 0 ? completedOrders : null;
      } else {
        this.smallOrder = null;
      }

      console.log(this.smallOrder);
    } catch (error) {
      console.error("Error fetching small order:", error);
      this.smallOrder = null;
    }
  }

  render() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Add Product Form -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              Add Product to Sale
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input type="text" placeholder="Enter product name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" placeholder="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input type="number" placeholder="0.00" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
              </div>
              <button class="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 font-medium">
                ${this.getIcon("plus")}
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-md p-6 border border-cyan-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Cart Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span class="font-semibold">Rs. ${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Tax (10%):</span>
                <span class="font-semibold">Rs. ${tax.toFixed(2)}</span>
              </div>
              <div class="border-t border-cyan-300 pt-3 flex justify-between text-lg font-bold text-cyan-700">
                <span>Total:</span>
                <span>Rs. ${total.toFixed(2)}</span>
              </div>
              <button class="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium mt-4">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Cart Items (${
              this.cartItems.length
            })</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.cartItems
                  .map(
                    (item) => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm text-gray-800">${
                        item.name
                      }</td>
                      <td class="px-6 py-4 text-sm text-gray-800">${
                        item.quantity
                      }</td>
                      <td class="px-6 py-4 text-sm text-gray-800">Rs. ${item.price.toFixed(
                        2
                      )}</td>
                      <td class="px-6 py-4 text-sm font-semibold text-gray-800">Rs. ${item.total.toFixed(
                        2
                      )}</td>
                      <td class="px-6 py-4 text-sm">
                        <button class="text-red-600 hover:text-red-800 transition-colors">
                          ${this.getIcon("trash")}
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
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Payment History</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.smallOrder
                  .map(
                    (order) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-800">${
                      order.paymentMethod
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">Rs. ${order.cart.totalAmount.toFixed(
                      2
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      order.createdAt
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                      </span>
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

  getIcon(name) {
    const icons = {
      "shopping-cart": '<svg class="w-5 h-5 text-cyan-600" ...></svg>',
      plus: '<svg class="w-5 h-5" ...></svg>',
      trash: '<svg class="w-4 h-4" ...></svg>',
    };
    return icons[name] || "";
  }
}

class FinancialReports {
  constructor() {
    this.reportData = {
      daily: { sales: 15280, expenses: 4200, profit: 11080 },
      weekly: { sales: 98500, expenses: 25600, profit: 72900 },
      monthly: { sales: 425000, expenses: 112000, profit: 313000 },
    };
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Financial Reports</h3>
          <p class="text-gray-600 mt-1">View and generate financial reports and analytics</p>
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
}

export function renderCashierDashboard(container) {
  const dashboard = new CashierDashboard(container);
  return dashboard.render();
}
