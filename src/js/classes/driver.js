import logo from "../../assets/logo-tr.png";
import { Driver } from "../models/Drivers.js";
import { SalesInvoice } from "../models/SalesInvoice.js";

class DriverDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "deliveries";
    this.isSidebarOpen = true;
  }

  async render() {
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto">
            <div class="p-8">
              ${sectionContent}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();

    // Attach vehicle management listeners if on vehicle section
    if (this.currentSection === "vehicle") {
      const vehicleSection = new VehicleManagement();
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
      { id: "proof", label: "Proof of Delivery", icon: "file-check" },
      { id: "payment", label: "Payment Collection", icon: "credit-card" },
      { id: "vehicle", label: "Vehicle Management", icon: "truck" },
    ];

    return `
      <div class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-green-700 to-green-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
                <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-green-700 font-medium shadow-lg"
                  : "text-green-100 hover:bg-green-600"
              }">
              ${this.getIcon(item.icon)}
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
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Driver Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage deliveries and routes efficiently</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
          </button>

          <button id="logoutBtnHeader" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      deliveries: new DeliveryDetails(),
      proof: new ProofOfDelivery(),
      payment: new PaymentCollection(),
      vehicle: new VehicleManagement(),
    };
    const sectionInstance = sections[section];
    if (section === "deliveries") {
      await sectionInstance.getDeliveries();
    } else if (section === "proof") {
      await sectionInstance.getProofDeliveries();
    } else if (section === "payment") {
      await sectionInstance.getPayments();
    } else if (section === "vehicle") {
      await sectionInstance.getVehicleDetails();
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
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    // Attach event listeners for vehicle management section
    if (section === "vehicle") {
      const vehicleSection = new VehicleManagement();
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
    // Helper method to get current vehicle data for event listener attachment
    return {
      vehicleId: null,
      vehicleType: null,
      licenseNumber: null,
      currentLocation: null,
    };
  }

  getIcon(name) {
    const icons = {
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      "map-pin":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      "file-check":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "credit-card":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      truck:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      phone:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
      clock:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "alert-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class DeliveryDetails {
  constructor() {
    this.deliveries = [];
  }

  async getDeliveries() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      console.log(response.data);
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    if (
      !this.deliveries ||
      !this.deliveries.deliveries ||
      !Array.isArray(this.deliveries.deliveries)
    ) {
      return `<p class="text-gray-600">No deliveries found for this driver.</p>`;
    }

    return `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Today's Deliveries</h2>
        <p class="text-gray-600">View and manage all delivery details for today</p>
      </div>

      <div class="grid gap-4">
        ${this.deliveries.deliveries
          .map((delivery) => {
            // Concatenate all sales order items
            const items =
              delivery.salesOrders
                .flatMap((so) => so.items || [])
                .map((item) => `${item.name} (x${item.quantity})`)
                .join(", ") || "No items";

            return `
              <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Delivery #${
                      delivery.deliveryNumber
                    }</h3>
                    <p class="text-sm text-gray-500">ID: ${delivery.id}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-sm font-medium ${
                    delivery.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }">
                    ${delivery.status === "pending" ? "Pending" : "In Transit"}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Address</p>
                      <p class="text-sm text-gray-900">${
                        delivery.deliveryAddress
                      }</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Contact</p>
                      <p class="text-sm text-gray-900">${
                        this.deliveries.phone || "N/A"
                      }</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Items</p>
                      <p class="text-sm text-gray-900">${items}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Scheduled Time</p>
                      <p class="text-sm text-gray-900">${new Date(
                        delivery.scheduledDate
                      ).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  }
}

class ProofOfDelivery {
  constructor() {
    this.deliveries = [];
  }

  async getProofDeliveries() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      console.log(response.data);
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    if (
      !this.deliveries ||
      !this.deliveries.deliveries ||
      !Array.isArray(this.deliveries.deliveries)
    ) {
      return `
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
            <p class="text-gray-600 mt-1">Capture signatures and delivery confirmations</p>
          </div>
          <p class="text-gray-600">No deliveries found for this driver.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
          <p class="text-gray-600 mt-1">Capture signatures and delivery confirmations</p>
        </div>

        <!-- Delivery Cards -->
        <div class="space-y-4">
          ${this.deliveries.deliveries
            .map(
              (delivery) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border ${
              delivery.status === "completed"
                ? "border-green-300"
                : delivery.status === "in-transit"
                ? "border-orange-300"
                : "border-gray-200"
            }">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h4 class="text-lg font-bold text-gray-900">${
                    delivery.deliveryNumber
                  }</h4>
                  <p class="text-sm text-gray-600">${
                    delivery.deliveryAddress
                  }</p>
                </div>
                <span class="px-4 py-2 rounded-full text-sm font-semibold ${
                  delivery.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : delivery.status === "in-transit"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-yellow-100 text-yellow-800"
                }">
                  ${
                    delivery.status === "completed"
                      ? "Completed"
                      : delivery.status === "in_transit"
                      ? "In Transit"
                      : "Pending"
                  }
                </span>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p class="text-xs text-gray-500">Delivery ID</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.deliveryNumber
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Order ID</p>
                    <p class="text-sm font-semibold text-green-600">${
                      delivery.id
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Items</p>
                    <p class="text-sm font-semibold text-gray-900">
                      ${delivery.salesOrders
                        .flatMap((order) => order.items || [])
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Delivery Time</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.scheduledDate
                    }</p>
                  </div>
                </div>

                ${
                  delivery.status === "completed"
                    ? `
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p class="font-semibold text-green-900">Delivery Completed</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p class="text-xs text-green-700">Signature Captured</p>
                        <p class="text-sm font-semibold text-green-900">${
                          delivery.signature
                        }</p>
                      </div>
                      <div>
                        <p class="text-xs text-green-700">Photo Evidence</p>
                        <p class="text-sm font-semibold text-green-900">${
                          delivery.hasPhoto ? "Yes ✓" : "No"
                        }</p>
                      </div>
                    </div>
                    ${
                      delivery.notes
                        ? `<p class="text-sm text-green-800 mt-3"><span class="font-semibold">Notes:</span> ${delivery.notes}</p>`
                        : ""
                    }
                  </div>
                `
                    : `
                  <!-- Upload Forms -->
                  <div class="space-y-4">
            
                    <!-- Delivery Notes -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Notes</label>
                      <textarea class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="3" placeholder="Add any delivery notes or observations..."></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      Complete Delivery
                    </button>
                  </div>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        
      </div>
    `;
  }
}

class PaymentCollection {
  constructor() {
    this.payments = [];
  }

  async getPayments() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await SalesInvoice.findById(id);
      this.payments = response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      this.payments = [];
    }
  }

  render() {
    if (!Array.isArray(this.payments)) {
      this.payments = [];
    }

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Payment Collection</h3>
          <p class="text-gray-600 mt-1">Record and manage cash-on-delivery payments</p>
        </div>

        <!-- Payment Collection Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Quick Payment Entry</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input type="text" placeholder="Enter order ID" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input type="number" placeholder="Enter amount" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile Payment</option>
                <option>Check</option>
              </select>
            </div>
          </div>
          <button class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Record Payment
          </button>
        </div>

        <!-- Payment List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Today's Payments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .filter((payment) => payment && payment.salesOrder)
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      payment.id || "N/A"
                    }</td>
                    <td class="px-6 py-4 text-sm text-green-600 font-medium">${
                      payment.salesOrder?.orderNumber || "N/A"
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      payment.salesOrder?.customerName || "N/A"
                    }</td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">Rs. ${
                      payment.salesOrder?.totalAmount?.toFixed(2) || "0.00"
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600 capitalize">${
                      payment.paymentMethod || "N/A"
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.collectedAt || "N/A"
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.salesOrder?.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }">
                       ${
                         payment.salesOrder?.status?.toLowerCase() ===
                         "confirmed"
                           ? "Confirmed"
                           : "Pending"
                       }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.delivery.status === "pending"
                          ? `
                        <button class="text-green-600 hover:text-green-800 font-medium text-sm">Collect</button>
                      `
                          : `
                        <button class="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                      `
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

class VehicleManagement {
  constructor() {
    this.vehicleData = null;
    this.driverId = null;
  }

  async getVehicleDetails() {
    try {
      this.driverId = window.location.search.split("id=")[1];
      const response = await Driver.findById(this.driverId);
      this.vehicleData = response.data;
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      this.vehicleData = null;
    }
  }

  render() {
    if (!this.vehicleData) {
      return `<p class="text-gray-600">Unable to load vehicle details.</p>`;
    }

    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Vehicle Management</h2>
          <p class="text-gray-600">Update and manage your vehicle information</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form id="vehicleForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle ID
                </label>
                <input 
                  type="text" 
                  id="vehicleId" 
                  value="${this.vehicleData.vehicleId || ""}" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter vehicle ID"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select 
                  id="vehicleType" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select vehicle type</option>
                  <option value="truck" ${
                    this.vehicleData.vehicleType === "truck" ? "selected" : ""
                  }>Truck</option>
                  <option value="van" ${
                    this.vehicleData.vehicleType === "van" ? "selected" : ""
                  }>Van</option>
                  <option value="motorcycle" ${
                    this.vehicleData.vehicleType === "motorcycle"
                      ? "selected"
                      : ""
                  }>Motorcycle</option>
                  <option value="car" ${
                    this.vehicleData.vehicleType === "car" ? "selected" : ""
                  }>Car</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input 
                  type="text" 
                  id="licenseNumber" 
                  value="${this.vehicleData.licenseNumber || ""}" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter license number"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    id="currentLocation" 
                    value="${this.vehicleData.currentLocation || ""}" 
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter current location"
                  />
                  <button 
                    type="button" 
                    id="gpsBtn"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    title="Use GPS to get current location"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    GPS
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Update Vehicle Details
              </button>
              <button 
                type="button" 
                id="resetBtn"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>

          <div id="messageContainer" class="mt-4"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById("vehicleForm");
    const resetBtn = document.getElementById("resetBtn");
    const gpsBtn = document.getElementById("gpsBtn");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetForm();
      });
    }

    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => {
        this.getCurrentLocation();
      });
    }
  }

  async handleSubmit() {
    const vehicleId = document.getElementById("vehicleId").value;
    const vehicleType = document.getElementById("vehicleType").value;
    const licenseNumber = document.getElementById("licenseNumber").value;
    const currentLocation = document.getElementById("currentLocation").value;

    const updatedData = {
      vehicleId: vehicleId || null,
      vehicleType: vehicleType || null,
      licenseNumber: licenseNumber || null,
      currentLocation: currentLocation || null,
    };

    try {
      await Driver.update(this.driverId, updatedData);
      this.showMessage("Vehicle details updated successfully!", "success");
      await this.getVehicleDetails();
    } catch (error) {
      console.error("Error updating vehicle details:", error);
      this.showMessage(
        "Failed to update vehicle details. Please try again.",
        "error"
      );
    }
  }

  resetForm() {
    document.getElementById("vehicleId").value =
      this.vehicleData.vehicleId || "";
    document.getElementById("vehicleType").value =
      this.vehicleData.vehicleType || "";
    document.getElementById("licenseNumber").value =
      this.vehicleData.licenseNumber || "";
    document.getElementById("currentLocation").value =
      this.vehicleData.currentLocation || "";
    this.showMessage("Form reset to original values.", "info");
  }

  getCurrentLocation() {
    const gpsBtn = document.getElementById("gpsBtn");
    const locationInput = document.getElementById("currentLocation");

    if (!navigator.geolocation) {
      this.showMessage(
        "Geolocation is not supported by your browser.",
        "error"
      );
      return;
    }

    // Disable button and show loading state
    gpsBtn.disabled = true;
    gpsBtn.innerHTML = `
      <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      Getting...
    `;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use OpenStreetMap's Nominatim for reverse geocoding (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "DistributorMS/1.0",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;

          locationInput.value = address;
          this.showMessage("Location fetched successfully!", "success");
        } catch (error) {
          console.error("Error fetching address:", error);
          // Fallback to coordinates if reverse geocoding fails
          locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(
            6
          )}`;
          this.showMessage(
            "Using coordinates (address lookup unavailable).",
            "info"
          );
        } finally {
          // Restore button state
          gpsBtn.disabled = false;
          gpsBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            GPS
          `;
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        this.showMessage(errorMessage, "error");

        // Restore button state
        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          GPS
        `;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  showMessage(message, type) {
    const messageContainer = document.getElementById("messageContainer");
    if (!messageContainer) return;

    const bgColor =
      type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-blue-100 border-blue-400 text-blue-700";

    messageContainer.innerHTML = `
      <div class="${bgColor} border px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">${message}</span>
      </div>
    `;

    setTimeout(() => {
      messageContainer.innerHTML = "";
    }, 5000);
  }
}

export async function renderDriverDashboard(container) {
  const dashboard = new DriverDashboard(container);
  await dashboard.render();
}
