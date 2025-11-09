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
  }

  renderSidebar() {
    const menuItems = [
      { id: "deliveries", label: "Delivery Details", icon: "package" },
      { id: "proof", label: "Proof of Delivery", icon: "file-check" },
      { id: "payment", label: "Payment Collection", icon: "credit-card" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-green-700 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
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

        <div class="p-4 border-t border-green-600">
          <button id="logoutBtn" class="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium">
            ${this.getIcon("log-out")}
            Logout
          </button>
        </div>
      </div>

      <!-- Overlay for mobile -->
      ${
        this.isSidebarOpen
          ? '<div id="mobileOverlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"></div>'
          : ""
      }
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

          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="text-right">
              <p class="font-medium text-gray-800">Michael Chen</p>
              <p class="text-xs text-gray-600">Delivery Driver</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
              MC
            </div>
          </div>

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
    };
    const sectionInstance = sections[section];
    if (section === "deliveries") {
      await sectionInstance.getDeliveries();
    } else if (section === "proof") {
      await sectionInstance.getProofDeliveries();
    } else if (section === "payment") {
      await sectionInstance.getPayments();
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

    const mobileToggle = this.container.querySelector("#mobileToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        this.isSidebarOpen = !this.isSidebarOpen;
        this.render();
      });
    }

    const mobileOverlay = this.container.querySelector("#mobileOverlay");
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", () => {
        this.isSidebarOpen = false;
        this.render();
      });
    }
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

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
    if (!this.deliveries || !this.deliveries.deliveries) {
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
    const totalAmount = this.payments.reduce((sum, p) => sum + p.amount, 0);
    const collected = this.payments
      .filter((p) => p.status === "collected")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = this.payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const collectedCount = this.payments.filter(
      (p) => p.status === "collected"
    ).length;

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
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      payment.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-green-600 font-medium">${
                      payment.salesOrder.orderNumber
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      payment.salesOrder.customerName
                    }</td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">Rs. ${payment.salesOrder.totalAmount.toFixed(
                      2
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 capitalize">${
                      payment.paymentMethod
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.collectedAt
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.salesOrder.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }">
                       ${
                         (console.log(payment.salesOrder.status),
                         payment.salesOrder.status?.toLowerCase() ===
                         "confirmed"
                           ? "Confirmed"
                           : "Pending")
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

export async function renderDriverDashboard(container) {
  const dashboard = new DriverDashboard(container);
  await dashboard.render();
}
