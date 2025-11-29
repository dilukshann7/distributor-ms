import logo from "../../assets/logo-tr.png";
import { Cart } from "../models/Cart.js";
import "../../css/cashier-style.css";
import { smallOrder } from "../models/SmallOrder.js";
import { getIconHTML } from "../../assets/icons/index.js";

class CashierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "sales";
    this.isSidebarOpen = true;
    this.currentTime = new Date().toLocaleTimeString();
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
      <div class="cashier-sidebar ${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="cashier-nav-item nav-item ${
                this.currentSection === item.id
                  ? "cashier-nav-item-active"
                  : "cashier-nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-cyan-600">
          <button id="logoutBtn" class="cashier-nav-item cashier-nav-item-inactive">
            ${getIconHTML("log-out")}
            <span>Logout</span>
          </button>
        </div>
      </div>
    `;
  }

  renderHeader() {
    return `
      <div class="cashier-header">
        <div>
          <h2 class="cashier-page-title">Cashier Dashboard</h2>
          <p class="cashier-subtitle">Manage transactions and payments</p>
        </div>

        <div class="flex items-center gap-6">
          <div class="relative">
            ${getIconHTML("bell")}
            <span class="cashier-notification-badge">3</span>
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
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "cashier-nav-item nav-item cashier-nav-item-active";
      } else {
        item.className = "cashier-nav-item nav-item cashier-nav-item-inactive";
      }
    });
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
      <div class="cashier-section-spacing">
        <div class="cashier-grid-layout">
          <!-- Add Product Form -->
          <div class="lg:col-span-2 cashier-card">
            <h3 class="cashier-section-title mb-4 flex items-center gap-2">
              Add Product to Sale
            </h3>
            <div class="space-y-4">
              <div>
                <label class="cashier-label">Product Name</label>
                <input type="text" placeholder="Enter product name" class="cashier-input" />
              </div>
              <div class="cashier-grid-2col">
                <div>
                  <label class="cashier-label">Quantity</label>
                  <input type="number" placeholder="0" class="cashier-input" />
                </div>
                <div>
                  <label class="cashier-label">Price</label>
                  <input type="number" placeholder="0.00" class="cashier-input" />
                </div>
              </div>
              <button class="cashier-btn-primary cashier-btn-icon">
                ${getIconHTML("plus")}
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cashier-card-gradient">
            <h3 class="cashier-section-title mb-4">Cart Summary</h3>
            <div class="space-y-3">
              <div class="cashier-summary-row">
                <span>Subtotal:</span>
                <span class="font-semibold">Rs. ${subtotal.toFixed(2)}</span>
              </div>
              <div class="cashier-summary-row">
                <span>Tax (10%):</span>
                <span class="font-semibold">Rs. ${tax.toFixed(2)}</span>
              </div>
              <div class="cashier-divider cashier-total-row">
                <span>Total:</span>
                <span>Rs. ${total.toFixed(2)}</span>
              </div>
              <button class="cashier-btn-primary mt-4">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">Cart Items (${
              this.cartItems.length
            })</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="cashier-table-head">
                <tr>
                  <th class="cashier-table-header">Product</th>
                  <th class="cashier-table-header">Quantity</th>
                  <th class="cashier-table-header">Price</th>
                  <th class="cashier-table-header">Total</th>
                  <th class="cashier-table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.cartItems
                  .map(
                    (item) => `
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${item.name}</td>
                      <td class="cashier-table-cell">${item.quantity}</td>
                      <td class="cashier-table-cell">Rs. ${item.price.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell font-semibold">Rs. ${item.total.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell">
                        <button class="cashier-btn-delete">
                          ${getIconHTML("trash")}
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
        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">Payment History</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="cashier-table-head">
                <tr>
                  <th class="cashier-table-header">Method</th>
                  <th class="cashier-table-header">Amount</th>
                  <th class="cashier-table-header">Time</th>
                  <th class="cashier-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  this.smallOrder && this.smallOrder.length > 0
                    ? this.smallOrder
                        .map(
                          (order) => `
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${order.paymentMethod}</td>
                      <td class="cashier-table-cell font-semibold">Rs. ${order.cart.totalAmount.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell text-gray-600">${
                        order.createdAt
                      }</td>
                      <td class="cashier-table-cell">
                        <span class="cashier-badge ${
                          order.status === "completed"
                            ? "cashier-badge-success"
                            : order.status === "pending"
                            ? "cashier-badge-warning"
                            : "cashier-badge-error"
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
                        .join("")
                    : '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No payment history available</td></tr>'
                }
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
