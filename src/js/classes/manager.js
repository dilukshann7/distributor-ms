import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { EmployeeOversight } from "./manager/EmployeeOversight.js";
import { TaskAssignment } from "./manager/TaskAssignment.js";
import { OperationalReports } from "./manager/OperationalReports.js";
import { StockManagement } from "./manager/StockManagement.js";
import { CustomerFeedback } from "./manager/CustomerFeedback.js";
import { DeliveryTracking } from "./manager/DeliveryTracking.js";

class ManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
  }

  async render() {
    /*html*/
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto w-full">
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
      { id: "overview", label: "Employee Oversight", icon: "users" },
      { id: "tasks", label: "Task Assignment", icon: "check-square" },
      { id: "reports", label: "Reports & Analytics", icon: "chart-bar" },
      { id: "stock", label: "Stock Management", icon: "package" },
      { id: "feedback", label: "Customer Feedback", icon: "message-square" },
      { id: "delivery", label: "Delivery Tracking", icon: "truck" },
    ];

    return `
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-emerald-700 to-emerald-900 text-white transition-transform duration-300 z-30 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center gap-3 invert">
            <img src="${logo}" alt="Logo" class="" />
          </div>
        </div>

        <nav class="space-y-2 px-4">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="manager-nav-item ${
                this.currentSection === item.id
                  ? "manager-nav-item-active"
                  : "manager-nav-item-inactive"
              }">
              ${this.getIcon(item.icon)}
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
          <h2 class="manager-header-title">Manager Dashboard</h2>
          <p class="manager-header-subtitle">Manage operations and team performance</p>
        </div>

        <div class="flex items-center gap-6">
          <!-- Notifications -->
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      overview: new EmployeeOversight(this.container),
      tasks: new TaskAssignment(),
      reports: new OperationalReports(),
      stock: new StockManagement(),
      feedback: new CustomerFeedback(),
      delivery: new DeliveryTracking(),
    };
    this.sections = sections;
    window.managerDashboard = this;
    const sectionInstance = sections[section];
    if (section === "delivery") {
      await sectionInstance.getDeliveries();
    } else if (section === "stock") {
      await sectionInstance.getProducts();
    } else if (section === "tasks") {
      await sectionInstance.getTasks();
    } else if (section === "overview") {
      await sectionInstance.getEmployees();
    } else if (section === "feedback") {
      await sectionInstance.getFeedback();
    }
    return sectionInstance.render();
  }

  attachEventListeners() {
    const navItems = this.container.querySelectorAll(".manager-nav-item");
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

    const navItems = this.container.querySelectorAll(".manager-nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "manager-nav-item manager-nav-item-active";
      } else {
        item.className = "manager-nav-item manager-nav-item-inactive";
      }
    });
  }

  getIcon(name) {
    return getIconHTML(name);
  }
}

export function renderManagerDashboard(container) {
  const dashboard = new ManagerDashboard(container);
  return dashboard.render();
}
