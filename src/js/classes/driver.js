import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { DeliveryDetails } from "./driver/DeliveryDetails.js";
import { ProofOfDeliveryDriver } from "./driver/ProofOfDeliveryDriver.js";
import { PaymentCollection } from "./driver/PaymentCollection.js";
import { VehicleManagement } from "./driver/VehicleManagement.js";

class DriverDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "deliveries";
    this.sections = {
      deliveries: document.createElement("delivery-details"),
      proof: document.createElement("proof-of-delivery-driver"),
      payment: document.createElement("payment-collection"),
      vehicle: document.createElement("vehicle-management"),
    };
    this.notificationPanel = new NotificationPanel(container);
  }

  async render() {
    await this.notificationPanel.loadTasks();

    this.container.innerHTML = `
      <div class="driver-dashboard-container">
        ${this.renderSidebar()}
        <div class="driver-main-content">
          ${this.renderHeader()}
          ${this.notificationPanel.renderPanel()}
          <main id="dashboardContent" class="driver-content-area">
            <div class="driver-section-container"></div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
    this.renderCurrentSection();
  }

  renderSidebar() {
    const menuItems = [
      { id: "deliveries", label: "Delivery Details", icon: "package" },
      { id: "proof", label: "Proof of Delivery", icon: "check-circle" },
      { id: "payment", label: "Payment Collection", icon: "credit-card" },
      { id: "vehicle", label: "Vehicle Management", icon: "truck" },
    ];

    return `
      <div class="driver-sidebar">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item driver-nav-item ${
                this.currentSection === item.id
                  ? "driver-nav-item-active"
                  : "driver-nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
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
      <header class="driver-header">
        <div>
          <h2 class="driver-title">Driver Dashboard</h2>
          <p class="driver-subtitle">Manage deliveries and routes efficiently</p>
        </div>

        <div class="flex items-center gap-6">
          <button id="notificationBtn" class="relative driver-header-btn">
            ${getIconHTML("bell")}
          </button>

          <button id="logoutBtnHeader" class="driver-header-btn">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  renderCurrentSection() {
    const content = this.container.querySelector(
      "#dashboardContent .driver-section-container"
    );

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
    window.driverDashboard = this;
    this.notificationPanel.attachEventListeners();
  }

  logout() {
    import("../login.js").then((module) => {
      module.renderLogin(this.container);
    });
  }

  navigateToSection(section) {
    this.currentSection = section;
    this.renderCurrentSection();

    const navItems = this.container.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item driver-nav-item driver-nav-item-active";
      } else {
        item.className = "nav-item driver-nav-item driver-nav-item-inactive";
      }
    });
  }
}

export async function renderDriverDashboard(container) {
  const dashboard = new DriverDashboard(container);
  dashboard.render();
}
