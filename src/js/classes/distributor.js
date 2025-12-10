import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { OrderManagement } from "./distributor/OrderManagement.js";
import { DriverManagement } from "./distributor/DriverManagement.js";
import { StockTracking } from "./distributor/StockTracking.js";
import { DeliveryRoutes } from "./distributor/DeliveryRoutes.js";
import { ProofOfDelivery } from "./distributor/ProofOfDelivery.js";
import { OrderAuthorization } from "./distributor/OrderAuthorization.js";

class DistributorDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: new OrderManagement(container),
      drivers: new DriverManagement(container),
      stock: new StockTracking(container),
      routes: new DeliveryRoutes(container),
      delivery: new ProofOfDelivery(container),
      authorization: new OrderAuthorization(container),
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
      { id: "orders", label: "Order Management", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "users" },
      { id: "stock", label: "Stock Tracking", icon: "map-pin" },
      { id: "routes", label: "Delivery Routes", icon: "truck" },
      { id: "delivery", label: "Proof of Delivery", icon: "check-circle" },
      { id: "authorization", label: "Order Authorization", icon: "lock" },
    ];

    return `
      <aside class="lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-orange-700 to-orange-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="dist-nav-item ${
                this.currentSection === item.id
                  ? "dist-nav-item-active"
                  : "dist-nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span class="font-medium">${item.label}</span>
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
          <h2 class="text-2xl font-bold text-gray-800">Distributor Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage orders, drivers, and deliveries</p>
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

  async renderSection(section) {
    const sectionInstance = this.sections[section];

    return sectionInstance.render();
  }

  attachEventListeners() {
    const navItems = this.container.querySelectorAll(".dist-nav-item");

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

    content.innerHTML = `
      <div class="p-8">
        ${sectionContent}
      </div>
    `;

    const navItems = this.container.querySelectorAll(".dist-nav-item");

    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "dist-nav-item dist-nav-item-active";
      } else {
        item.className = "dist-nav-item dist-nav-item-inactive";
      }
    });
  }
}

export function renderDistributorDashboard(container) {
  const dashboard = new DistributorDashboard(container);
  dashboard.render();
}
