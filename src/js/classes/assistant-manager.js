import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { PaymentVerification } from "./assistant-manager/PaymentVerification.js";
import { DeliveryStockMaintenance } from "./assistant-manager/DeliveryStockMaintenance.js";
import { DriverManagement } from "./assistant-manager/DriverManagement.js";
import { DistributionRecords } from "./assistant-manager/DistributionRecords.js";

class AssistantManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "payments";
    this.isSidebarOpen = true;
  }

  render() {
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto">
            <div class="p-8">
              ${this.renderSection(this.currentSection)}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderSidebar() {
    const menuItems = [
      { id: "payments", label: "Payment Verification", icon: "dollar" },
      { id: "delivery-stock", label: "Delivery & Stock", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "truck" },
      { id: "distribution", label: "Distribution Records", icon: "bar-chart" },
    ];
    return `
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-amber-700 to-amber-800 text-white transition-transform duration-300 z-30 overflow-y-auto">
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
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      payments: new PaymentVerification(),
      "delivery-stock": new DeliveryStockMaintenance(),
      drivers: new DriverManagement(),
      distribution: new DistributionRecords(),
    };
    const sectionInstance = sections[section];
    if (section === "emergency") {
      await sectionInstance.getEmergencyData();
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
    content.innerHTML = `<div class="p-8">${await this.renderSection(
      section
    )}</div>`;

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
