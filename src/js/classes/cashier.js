import logo from "../../assets/logo-tr.png";
import "../../css/cashier-style.css";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { SalesTransaction } from "./cashier/SalesTransaction.js";
import { FinancialReports } from "./cashier/FinancialReports.js";

class CashierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "sales";
    this.isSidebarOpen = true;
    this.currentTime = new Date().toLocaleTimeString();
    this.sections = {
      sales: new SalesTransaction(this.container),
      reports: new FinancialReports(this.container),
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
    this.attachEventListeners();
  }

  renderSidebar() {
    const menuItems = [
      { id: "sales", label: "Sales Transaction", icon: "dollar" },
      { id: "reports", label: "Financial Reports", icon: "bar-chart" },
    ];

    return `
      <aside class="-translate-x-full lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-cyan-700 to-cyan-800 text-white transition-transform duration-300 z-30 overflow-y-auto">
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
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="cashier-header">
        <div>
          <h2 class="cashier-page-title">Cashier Dashboard</h2>
          <p class="cashier-subtitle">Manage transactions and payments</p>
        </div>

        <div class="flex items-center gap-6">
          <button id="notificationBtn" class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sectionInstance = this.sections[section];
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

    window.notificationPanel = this.notificationPanel;
    this.notificationPanel.attachEventListeners();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const sectionInstance = this.sections[section];
    if (sectionInstance.attachEventListeners) {
      sectionInstance.attachEventListeners();
    }

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

export function renderCashierDashboard(container) {
  const dashboard = new CashierDashboard(container);
  return dashboard.render();
}
