import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { FinancialReports } from "./cashier/FinancialReports.js";
import { SalesTransaction } from "./cashier/SalesTransaction.js";
import { User } from "../models/User.js";

class CashierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "sales";
    this.sections = {
      sales: document.createElement("sales-transaction"),
      reports: document.createElement("financial-reports"),
    };
    this.notificationPanel = new NotificationPanel(container);
  }

  async render() {
    await this.notificationPanel.loadTasks();

    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          ${this.notificationPanel.renderPanel()}
          <main id="dashboardContent" class="flex-1 overflow-auto w-full">
            <div class="p-8"></div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
    this.renderCurrentSection();
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
          `,
            )
            .join("")}
        </nav>

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
          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  renderCurrentSection() {
    const content = this.container.querySelector("#dashboardContent div");
    content.innerHTML = "";

    const sectionComponent = this.sections[this.currentSection];
    if (sectionComponent) {
      content.appendChild(sectionComponent);
    }
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
      logoutBtn.addEventListener("click", async () => {
        await User.logout();
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    window.notificationPanel = this.notificationPanel;
    window.cashierDashboard = this;
    this.notificationPanel.attachEventListeners();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

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
