import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";

class SupplierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: document.createElement("purchase-orders"),
      products: document.createElement("product-catalog"),
      shipments: document.createElement("shipment-tracking"),
      invoices: document.createElement("invoices-payments"),
      analytics: document.createElement("sales-analytics"),
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
      { id: "orders", label: "Purchase Orders", icon: "shopping-bag" },
      { id: "products", label: "Product Catalog", icon: "package" },
      { id: "shipments", label: "Shipment Tracking", icon: "truck" },
      { id: "invoices", label: "Invoices & Payments", icon: "file-text" },
      { id: "analytics", label: "Sales Analytics", icon: "trending-up" },
    ];

    return `
      <aside class="fixed lg:relative w-64 h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" onclick="window.supplierDashboard.navigateToSection('${
                item.id
              }')" class="nav-item ${
                this.currentSection === item.id
                  ? "nav-item-active"
                  : "nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-indigo-600">
          <div class="bg-indigo-600 rounded-lg p-4">
            <p class="text-sm text-indigo-100">Supplier Account</p>
            <p class="font-semibold text-white mt-1">
              ${this.supplierName}
            </p>
          </div>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="section-header">Supplier Dashboard</h2>
          <p class="section-subtitle text-sm">Manage orders, inventory, and shipments</p>
        </div>

        <div class="flex items-center gap-6">
          <button id="notificationBtn" class="relative btn-icon">
            ${getIconHTML("bell")}
          </button>

          <button onclick="window.supplierDashboard.logout()" class="btn-icon">
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

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item nav-item-active";
      } else {
        item.className = "nav-item nav-item-inactive";
      }
    });
  }

  logout() {
    import("../login.js").then((module) => {
      module.renderLogin(this.container);
    });
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
    window.supplierDashboard = this;
    this.notificationPanel.attachEventListeners();
  }
}

export async function renderSupplierDashboard(container) {
  const dashboard = new SupplierDashboard(container);
  dashboard.render();
}
