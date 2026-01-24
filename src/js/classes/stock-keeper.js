import logo from "../../assets/logo-tr.png";
import "../../css/stock-keeper-style.css";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { getIconHTML } from "../../assets/icons/index.js";
import { InventoryManagement } from "./stock-keeper/InventoryManagement.js";
import { ReceivingShipment } from "./stock-keeper/ReceivingShipment.js";
import { StockReports } from "./stock-keeper/StockReports.js";
import { User } from "../models/User.js";

class StockKeeperDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "inventory";
    this.sections = {
      inventory: document.createElement("inventory-management"),
      receiving: document.createElement("receiving-shipment"),
      reports: document.createElement("stock-reports"),
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
      { id: "inventory", label: "Inventory", icon: "package" },
      { id: "receiving", label: "Shipment", icon: "inbox" },
      { id: "reports", label: "Stock Reports", icon: "bar-chart" },
    ];
    return `
      <aside class="translate-x-0 lg:translate-x-0 fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full  h-auto p-4" />
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item sk-nav-item ${
                this.currentSection === item.id
                  ? "sk-nav-item-active"
                  : "sk-nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="sk-header-title">Stock Management</h2>
          <p class="text-sm text-gray-500">Manage inventory, track stock levels, and generate reports</p>
        </div>

        <div class="flex items-center gap-4">
          <button id="notificationBtn" class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
            <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              ${getIconHTML("log-out")}
            </button>
          </div>
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
    window.stockKeeperDashboard = this;
    this.notificationPanel.attachEventListeners();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item sk-nav-item sk-nav-item-active";
      } else {
        item.className = "nav-item sk-nav-item sk-nav-item-inactive";
      }
    });
  }
}

export async function renderStockKeeperDashboard(container) {
  const dashboard = new StockKeeperDashboard(container);
  dashboard.render();
}
