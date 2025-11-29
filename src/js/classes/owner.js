import { getIconHTML } from "../../assets/icons/index.js";
import logo from "../../assets/logo-tr.png";
import { EmployeeManagement } from "./owner/EmployeeManagement.js";
import { InventoryControl } from "./owner/InventoryControl.js";
import { OperationsMonitor } from "./owner/OperationsMonitor.js";
import { ReportsSection } from "./owner/ReportsSection.js";

class OwnerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "employees";
  }

  async render() {
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto bg-gray-50">
            <div class="p-8 text-center text-gray-500">Loading...</div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();

    // Load initial section content
    const content = this.container.querySelector("#dashboardContent");
    const html = await this.renderSection(this.currentSection);
    content.innerHTML = html;
  }

  renderSidebar() {
    const menuItems = [
      { id: "employees", label: "Employee Management", icon: "users" },
      { id: "inventory", label: "Inventory Control", icon: "package" },
      { id: "operations", label: "Operations Monitor", icon: "activity" },
      { id: "reports", label: "Reports & Analytics", icon: "file-text" },
    ];

    return `
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
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
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                this.currentSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }">
              ${this.getIcon(item.icon)}
              <span class="text-sm font-medium">${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-gray-200 space-y-2">

          <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            ${this.getIcon("log-out")}
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div class="flex-1 max-w-md">
          <div class="relative">
            ${getIconHTML("search")}
            <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div class="flex items-center gap-4 ml-8">
          <button class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

    
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      employees: new EmployeeManagement(this.container),
      inventory: new InventoryControl(),
      operations: new OperationsMonitor(),
      reports: new ReportsSection(),
    };
    
    this.sections = sections;
    window.ownerDashboard = this;

    const sectionInstance = sections[section];

    if (section === "inventory") {
      await sectionInstance.getInventory();
    } else if (section === "employees") {
      await sectionInstance.getEmployees();
    } else if (section === "operations") {
      await sectionInstance.getTasks();
    } else if (section === "overview") {
      await sectionInstance.getMonthly();
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

    // Show loading state
    content.innerHTML =
      '<div class="p-8 text-center text-gray-500">Loading...</div>';

    // Load and render section
    const html = await this.renderSection(section);
    content.innerHTML = html;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100";
      }
    });
  }

  getIcon(name) {
    return getIconHTML(name);
  }
}

export async function renderOwnerDashboard(container) {
  const dashboard = new OwnerDashboard(container);
  await dashboard.render();
}
