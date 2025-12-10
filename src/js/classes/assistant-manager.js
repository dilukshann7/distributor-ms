import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";

class AssistantManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "payments";
    this.sections = {
      payments: document.createElement("payment-verification"),
      "delivery-stock": document.createElement("delivery-stock-maintenance"),
      drivers: document.createElement("driver-management"),
      distribution: document.createElement("distribution-records"),
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
      { id: "payments", label: "Payment Verification", icon: "dollar" },
      { id: "delivery-stock", label: "Delivery & Stock", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "truck" },
      { id: "distribution", label: "Distribution Records", icon: "bar-chart" },
    ];
    return `
      <aside class="-translate-x-full lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-amber-700 to-amber-800 text-white transition-transform duration-300 z-30 overflow-y-auto">
        
      <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-amber-700 font-semibold shadow-lg"
                  : "text-amber-100 hover:bg-amber-600"
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
          <h2 class="text-2xl font-bold text-gray-800">Assistant Manager Dashboard</h2>
          <p class="text-gray-500 text-sm mt-1">Data verification and operational support</p>
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
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    window.notificationPanel = this.notificationPanel;
    window.assistantManagerDashboard = this;
    this.notificationPanel.attachEventListeners();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-amber-700 font-semibold shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-amber-100 hover:bg-amber-600";
      }
    });
  }
}

export function renderAssistantManagerDashboard(container) {
  const dashboard = new AssistantManagerDashboard(container);
  dashboard.render();
}
