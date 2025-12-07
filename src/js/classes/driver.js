import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { NotificationPanel } from "../components/NotificationPanel.js";
import { DeliveryDetails } from "./driver/DeliveryDetails.js";
import { ProofOfDelivery } from "./driver/ProofOfDelivery.js";
import { PaymentCollection } from "./driver/PaymentCollection.js";
import { VehicleManagement } from "./driver/VehicleManagement.js";
import { Driver } from "../models/Driver.js";

class DriverDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "deliveries";
    this.sections = {
      deliveries: new DeliveryDetails(this.container),
      proof: new ProofOfDelivery(this.container),
      payment: new PaymentCollection(this.container),
      vehicle: new VehicleManagement(this.container),
    };
    this.notificationPanel = new NotificationPanel(container);
    this.sections.deliveries.getDeliveries();
  }

  async render() {
    await this.notificationPanel.loadTasks();
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="driver-dashboard-container">
        ${this.renderSidebar()}
        <div class="driver-main-content">
          ${this.renderHeader()}
          ${this.notificationPanel.renderPanel()}
          <main id="dashboardContent" class="driver-content-area">
            <div class="driver-section-container">
              ${sectionContent}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();

    if (this.currentSection === "vehicle") {
      const vehicleSection = new VehicleManagement(this.container);
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      vehicleSection.vehicleData = response.data;
      vehicleSection.driverId = id;
      vehicleSection.attachEventListeners();
    }
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

  async renderSection(section) {
    const sectionInstance = this.sections[section];

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
    const logoutBtnHeader = this.container.querySelector("#logoutBtnHeader");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }

    if (logoutBtnHeader) {
      logoutBtnHeader.addEventListener("click", () => {
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
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    if (section === "vehicle") {
      const vehicleSection = new VehicleManagement(this.container);
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      vehicleSection.vehicleData = response.data;
      vehicleSection.driverId = id;
      vehicleSection.attachEventListeners();
    }

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-green-700 font-medium shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-green-100 hover:bg-green-600";
      }
    });
  }

  getCurrentVehicleData() {
    return {
      vehicleId: null,
      vehicleType: null,
      licenseNumber: null,
      currentLocation: null,
    };
  }
}

export async function renderDriverDashboard(container) {
  window.driverDashboard = new DriverDashboard(container);
  await window.driverDashboard.render();
}
