import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import "../../css/salesman-style.css";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { SalesOrders } from "./salesman/SalesOrders.js";
import { StockAvailability } from "./salesman/StockAvailability.js";
import { CustomerAccounts } from "./salesman/CustomerAccounts.js";
import { SalesReports } from "./salesman/SalesReports.js";
import { ReturnsAndCancellations } from "./salesman/ReturnsAndCancellations.js";

class SalesmanDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: new SalesOrders(container),
      stock: new StockAvailability(container),
      customers: new CustomerAccounts(container),
      reports: new SalesReports(container),
      returns: new ReturnsAndCancellations(container),
    };
    this.notificationPanel = new NotificationPanel(container);
  }

  async render() {
    await this.notificationPanel.loadTasks();
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          ${this.notificationPanel.renderPanel()}
          <main id="dashboardContent" class="flex-1 overflow-auto">
            <div class="p-8">
              ${sectionContent}
            </div>
          </main>
        </div>
      </div>
    `;
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
            }" onclick="window.salesmanDashboard.navigateToSection('${
                item.id
              }')" class="nav-item sm-nav-item ${
                this.currentSection === item.id
                  ? "sm-nav-item-active"
                  : "sm-nav-item-inactive"
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
          <h2 class="sm-header-title">Salesman Dashboard</h2>
          <p class="sm-text-muted text-sm">Manage orders, customers, and sales activities</p>
        </div>

        <div class="flex items-center gap-6">
          <button id="notificationBtn" class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-sky-600 rounded-full"></span>
          </button>

          <button onclick="window.salesmanDashboard.logout()" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sectionInstance = this.sections[section];

    return sectionInstance.render();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");

    const sectionInstance = this.sections[section];

    const sectionContent = sectionInstance.render();

    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item sm-nav-item sm-nav-item-active";
      } else {
        item.className = "nav-item sm-nav-item sm-nav-item-inactive";
      }
    });
  }

  logout() {
    import("../login.js").then((module) => {
      module.renderLogin(this.container);
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
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
    };
    return icons[name] || "";
  }
}

export async function renderSalesmanDashboard(container) {
  window.salesmanDashboard = new SalesmanDashboard(container);
  window.notificationPanel = window.salesmanDashboard.notificationPanel;
  window.salesmanDashboard.notificationPanel.attachEventListeners();
  await window.salesmanDashboard.render();

  window.$s = window.salesmanDashboard.sections;
}
