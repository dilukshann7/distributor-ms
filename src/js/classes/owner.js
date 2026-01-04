import { getIconHTML } from "../../assets/icons/index.js";
import logo from "../../assets/logo-tr.png";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { User } from "../models/User.js";
import { EmployeeManagement } from "./owner/EmployeeManagement.js";
import { InventoryControl } from "./owner/InventoryControl.js";
import { OperationsMonitor } from "./owner/OperationsMonitor.js";
import { ReportsSection } from "./owner/ReportsSection.js";

class OwnerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "employees";
    this.sections = {
      employees: document.createElement("employee-management"),
      inventory: document.createElement("inventory-control"),
      operations: document.createElement("operations-monitor"),
      reports: document.createElement("reports-section"),
    };
    window.ownerDashboard = this;
    this.notificationPanel = new NotificationPanel(this.container);
  }

  async render() {
    await this.notificationPanel.loadTasks();
    
    this.container.innerHTML = `
      <div class="owner-dashboard-container">
        ${this.renderSidebar()}
        <div class="owner-main-content">
          ${this.renderHeader()}
          ${this.notificationPanel.renderPanel()}
          <main id="dashboardContent" class="owner-content-area">
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
      { id: "employees", label: "Employee Management", icon: "users" },
      { id: "inventory", label: "Inventory Control", icon: "package" },
      { id: "operations", label: "Operations Monitor", icon: "activity" },
      { id: "reports", label: "Reports & Analytics", icon: "file-text" },
    ];

    return `
      <aside class="owner-sidebar">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div>
              <img src="${logo}" alt="Logo" />
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item owner-nav-item ${
                this.currentSection === item.id
                  ? "owner-nav-item-active"
                  : "owner-nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span class="text-sm font-medium">${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-gray-200 space-y-2">

          <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            ${getIconHTML("log-out")}
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="owner-header">
        <div>
          <h2 class="owner-header-title">Owner Dashboard</h2>
          <p class="owner-header-subtitle">Manage operations and team performance</p>
        </div>
        <div class="flex items-center gap-4 ml-8">
          <button id="notificationBtn" class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
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
        User.logout();
      });
    }

    window.notificationPanel = this.notificationPanel;
    this.notificationPanel.attachEventListeners();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item owner-nav-item owner-nav-item-active";
      } else {
        item.className = "nav-item owner-nav-item owner-nav-item-inactive";
      }
    });
  }
}

export function renderOwnerDashboard(container) {
  const dashboard = new OwnerDashboard(container);
  return dashboard.render();
}
