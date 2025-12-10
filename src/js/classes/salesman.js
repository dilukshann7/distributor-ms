import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { SalesOrders } from "./salesman/SalesOrders.js";
import { StockAvailability } from "./salesman/StockAvailability.js";
import { CustomerAccounts } from "./salesman/CustomerAccounts.js";
import { SalesReports } from "./salesman/SalesReports.js";

class SalesmanDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: document.createElement("sales-orders"),
      stock: document.createElement("stock-availability"),
      customers: document.createElement("customer-accounts"),
      reports: document.createElement("sales-reports"),
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
      { id: "orders", label: "Sales Orders", icon: "shopping-cart" },
      { id: "stock", label: "Stock Availability", icon: "package" },
      { id: "customers", label: "Customer Accounts", icon: "users" },
      { id: "reports", label: "Sales Reports", icon: "bar-chart" },
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
              ${getIconHTML(item.icon)}
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
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-sky-600 rounded-full"></span>
          </button>

          <button onclick="window.salesmanDashboard.logout()" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    window.notificationPanel = this.notificationPanel;
    window.salesmanDashboard = this;
    this.notificationPanel.attachEventListeners();
  }

  logout() {
    import("../login.js").then((module) => {
      module.renderLogin(this.container);
    });
  }

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item sm-nav-item sm-nav-item-active";
      } else {
        item.className = "nav-item sm-nav-item sm-nav-item-inactive";
      }
    });
  }
}

export async function renderSalesmanDashboard(container) {
  const dashboard = new SalesmanDashboard(container);

  dashboard.render();
}
