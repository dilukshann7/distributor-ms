import logo from "../../assets/logo-tr.png";
import { Cart } from "../models/Cart.js";
import "../../css/cashier-style.css";
import { smallOrder } from "../models/SmallOrder.js";
import { getIconHTML } from "../../assets/icons/index.js";
import { SalesTransaction } from "./cashier/SalesTransaction.js";
import { FinancialReports } from "./cashier/FinancialReports.js";

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

export function renderCashierDashboard(container) {
  const dashboard = new CashierDashboard(container);
  return dashboard.render();
}
