import logo from "../../assets/logo-tr.png";

class AssistantManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
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
      { id: "overview", label: "Data Verification", icon: "check-circle" },
      { id: "payments", label: "Payment Verification", icon: "dollar" },
      { id: "schedules", label: "Schedule Mgmt", icon: "calendar" },
      { id: "delivery-stock", label: "Delivery & Stock", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "truck" },
      { id: "distribution", label: "Distribution Records", icon: "bar-chart" },
      { id: "emergency", label: "Emergency Data", icon: "alert-circle" },
    ];
    /*html*/
    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-amber-700 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
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
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-amber-600 text-amber-100 text-xs">
          <p>© 2025 Distribution System</p>
        </div>
      </aside>

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
          <h2 class="text-2xl font-bold text-gray-800">Assistant Manager Dashboard</h2>
          <p class="text-gray-500 text-sm mt-1">Data verification and operational support</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="text-right">
              <p class="font-medium text-gray-800">Sarah Johnson</p>
              <p class="text-xs text-gray-500">Assistant Manager</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
              SJ
            </div>
          </div>

          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      overview: new DataVerification(),
      payments: new PaymentVerification(),
      schedules: new ScheduleManagement(),
      "delivery-stock": new DeliveryStockMaintenance(),
      drivers: new DriverManagement(),
      distribution: new DistributionRecords(),
      emergency: new EmergencyDataRetrieval(),
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

  navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    content.innerHTML = `<div class="p-8">${this.renderSection(section)}</div>`;

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

  getIcon(name) {
    const icons = {
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      dollar:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      calendar:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      truck:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "bar-chart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      "alert-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      "x-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class DataVerification {
  constructor() {
    this.verificationItems = [
      {
        id: 1,
        type: "Employee Record",
        description: "Salary entry for John Smith - $2,500",
        status: "pending",
        date: "2025-01-19",
      },
      {
        id: 2,
        type: "Expense Entry",
        description: "Fuel expense - $450",
        status: "verified",
        date: "2025-01-18",
      },
      {
        id: 3,
        type: "Inventory Update",
        description: "Stock count mismatch - 50 units",
        status: "rejected",
        date: "2025-01-18",
      },
      {
        id: 4,
        type: "Order Record",
        description: "Customer order #1024 - $3,200",
        status: "pending",
        date: "2025-01-19",
      },
      {
        id: 5,
        type: "Delivery Record",
        description: "Route delivery completion",
        status: "verified",
        date: "2025-01-17",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Entries</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">247</p>
              </div>
              <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Verified</p>
                <p class="text-3xl font-bold text-green-600 mt-2">189</p>
              </div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending</p>
                <p class="text-3xl font-bold text-yellow-600 mt-2">42</p>
              </div>
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Rejected</p>
                <p class="text-3xl font-bold text-red-600 mt-2">16</p>
              </div>
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Recent Entries for Verification</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.verificationItems
                  .map(
                    (item) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-800 font-medium">${
                      item.type
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.description
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.date
                    }</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        ${this.getStatusIcon(item.status)}
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${this.getStatusBadge(
                          item.status
                        )}">
                          ${
                            item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)
                          }
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        item.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                            Verify
                          </button>
                          <button class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      `
                          : ""
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

  getStatusIcon(status) {
    switch (status) {
      case "verified":
        return '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      case "pending":
        return '<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      case "rejected":
        return '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      default:
        return '<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }
  }

  getStatusBadge(status) {
    const badges = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  }
}

class PaymentVerification {
  constructor() {
    this.payments = [
      {
        id: 1,
        type: "Cash Collection",
        amount: 5200,
        source: "Salesman - Ahmed",
        date: "2025-01-19",
        status: "pending",
      },
      {
        id: 2,
        type: "Check Payment",
        amount: 3500,
        source: "Customer - ABC Store",
        date: "2025-01-19",
        status: "verified",
      },
      {
        id: 3,
        type: "Online Transfer",
        amount: 8900,
        source: "Customer - XYZ Retail",
        date: "2025-01-18",
        status: "verified",
      },
      {
        id: 4,
        type: "Cash Collection",
        amount: 2100,
        source: "Salesman - Ravi",
        date: "2025-01-18",
        status: "pending",
      },
      {
        id: 5,
        type: "Check Payment",
        amount: 4500,
        source: "Customer - DEF Mart",
        date: "2025-01-17",
        status: "verified",
      },
    ];
  }

  render() {
    const totalPending = this.payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalVerified = this.payments
      .filter((p) => p.status === "verified")
      .reduce((sum, p) => sum + p.amount, 0);

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Collected</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">$${(
                  totalPending + totalVerified
                ).toLocaleString()}</p>
              </div>
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Verified</p>
                <p class="text-3xl font-bold text-green-600 mt-2">$${totalVerified.toLocaleString()}</p>
              </div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending Verification</p>
                <p class="text-3xl font-bold text-yellow-600 mt-2">$${totalPending.toLocaleString()}</p>
              </div>
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Payment Verification Workflow</h3>
            <p class="text-gray-600 text-sm mt-1">Verify cash and check payments collected by sales team</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      payment.type
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">$${payment.amount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.source
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.date
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                            Verify
                          </button>
                          <button class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      `
                          : ""
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

class ScheduleManagement {
  constructor() {
    this.schedules = [
      {
        id: 1,
        employee: "Ahmed Hassan",
        role: "Salesman",
        date: "2025-01-20",
        shift: "Morning (8AM - 4PM)",
        tasks: 5,
        status: "confirmed",
      },
      {
        id: 2,
        employee: "Ravi Kumar",
        role: "Driver",
        date: "2025-01-20",
        shift: "Full Day (6AM - 6PM)",
        tasks: 3,
        status: "confirmed",
      },
      {
        id: 3,
        employee: "Maria Garcia",
        role: "Stock Keeper",
        date: "2025-01-20",
        shift: "Afternoon (12PM - 8PM)",
        tasks: 4,
        status: "pending",
      },
      {
        id: 4,
        employee: "John Smith",
        role: "Salesman",
        date: "2025-01-21",
        shift: "Morning (8AM - 4PM)",
        tasks: 6,
        status: "confirmed",
      },
      {
        id: 5,
        employee: "Lisa Wong",
        role: "Cashier",
        date: "2025-01-21",
        shift: "Full Day (6AM - 6PM)",
        tasks: 2,
        status: "confirmed",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Scheduled</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">24</p>
              </div>
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Confirmed</p>
                <p class="text-3xl font-bold text-green-600 mt-2">20</p>
              </div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending</p>
                <p class="text-3xl font-bold text-yellow-600 mt-2">4</p>
              </div>
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Absent</p>
                <p class="text-3xl font-bold text-red-600 mt-2">0</p>
              </div>
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Staff Schedule</h3>
            <p class="text-gray-600 text-sm mt-1">Manage and organize staff schedules and shifts</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shift</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tasks</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.schedules
                  .map(
                    (schedule) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      schedule.employee
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      schedule.role
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      schedule.date
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      schedule.shift
                    }</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      schedule.tasks
                    } tasks</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          schedule.status.charAt(0).toUpperCase() +
                          schedule.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
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

class DeliveryStockMaintenance {
  constructor() {
    this.deliveryStock = [
      {
        id: 1,
        product: "Air Freshener",
        quantity: 150,
        location: "Warehouse A",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 2,
        product: "Handwash",
        quantity: 200,
        location: "Warehouse B",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 3,
        product: "Car Interior Spray",
        quantity: 75,
        location: "Warehouse A",
        status: "low",
        deliveryDate: "2025-01-21",
      },
      {
        id: 4,
        product: "Dish Liquid",
        quantity: 300,
        location: "Warehouse C",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 5,
        product: "Alli Food Products",
        quantity: 50,
        location: "Warehouse B",
        status: "critical",
        deliveryDate: "2025-01-22",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Items</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">775</p>
              </div>
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Ready for Delivery</p>
                <p class="text-3xl font-bold text-green-600 mt-2">650</p>
              </div>
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Low Stock</p>
                <p class="text-3xl font-bold text-yellow-600 mt-2">75</p>
              </div>
              <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Critical</p>
                <p class="text-3xl font-bold text-red-600 mt-2">50</p>
              </div>
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Delivery Stock Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Delivery & Stock Maintenance</h3>
            <p class="text-gray-600 text-sm mt-1">Maintain stock levels for deliveries and distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delivery Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveryStock
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      item.product
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.location
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.deliveryDate
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : item.status === "low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${
                          item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">Update</button>
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

class DriverManagement {
  constructor() {
    this.drivers = [
      {
        id: 1,
        name: "Ravi Kumar",
        phone: "+94 71 234 5678",
        vehicle: "Van - VH-2024",
        status: "active",
        currentRoute: "Route A - 5 stops",
        lastUpdate: "2 mins ago",
      },
      {
        id: 2,
        name: "Ahmed Hassan",
        phone: "+94 77 345 6789",
        vehicle: "Truck - VH-2025",
        status: "active",
        currentRoute: "Route B - 8 stops",
        lastUpdate: "5 mins ago",
      },
      {
        id: 3,
        name: "Carlos Rodriguez",
        phone: "+94 76 456 7890",
        vehicle: "Van - VH-2023",
        status: "inactive",
        currentRoute: "Completed",
        lastUpdate: "30 mins ago",
      },
      {
        id: 4,
        name: "Maria Santos",
        phone: "+94 70 567 8901",
        vehicle: "Truck - VH-2026",
        status: "active",
        currentRoute: "Route C - 6 stops",
        lastUpdate: "1 min ago",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Drivers</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">4</p>
              </div>
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Active</p>
                <p class="text-3xl font-bold text-green-600 mt-2">3</p>
              </div>
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Inactive</p>
                <p class="text-3xl font-bold text-gray-600 mt-2">1</p>
              </div>
              <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Routes Active</p>
                <p class="text-3xl font-bold text-amber-600 mt-2">3</p>
              </div>
              <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Driver Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Driver Management & Communication</h3>
            <p class="text-gray-600 text-sm mt-1">Manage drivers and maintain communication system</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Driver Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Current Route</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Update</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.drivers
                  .map(
                    (driver) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      driver.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        ${driver.phone}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      driver.vehicle
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        ${driver.currentRoute}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${
                          driver.status.charAt(0).toUpperCase() +
                          driver.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      driver.lastUpdate
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">Message</button>
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

class DistributionRecords {
  constructor() {
    this.distributionData = [
      { date: "Jan 15", deliveries: 12, items: 450 },
      { date: "Jan 16", deliveries: 15, items: 520 },
      { date: "Jan 17", deliveries: 18, items: 680 },
      { date: "Jan 18", deliveries: 14, items: 490 },
      { date: "Jan 19", deliveries: 16, items: 610 },
    ];

    this.records = [
      {
        id: 1,
        date: "2025-01-19",
        route: "Route A",
        deliveries: 5,
        items: 180,
        status: "completed",
      },
      {
        id: 2,
        date: "2025-01-19",
        route: "Route B",
        deliveries: 8,
        items: 320,
        status: "in-progress",
      },
      {
        id: 3,
        date: "2025-01-18",
        route: "Route C",
        deliveries: 6,
        items: 240,
        status: "completed",
      },
      {
        id: 4,
        date: "2025-01-18",
        route: "Route A",
        deliveries: 4,
        items: 150,
        status: "completed",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Deliveries</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">75</p>
              </div>
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Items Distributed</p>
                <p class="text-3xl font-bold text-green-600 mt-2">2,750</p>
              </div>
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Completed</p>
                <p class="text-3xl font-bold text-emerald-600 mt-2">72</p>
              </div>
              <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">In Progress</p>
                <p class="text-3xl font-bold text-amber-600 mt-2">3</p>
              </div>
              <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>


        <!-- Distribution Records Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Distribution Records</h3>
            <p class="text-gray-600 text-sm mt-1">Access records relevant for distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deliveries</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.records
                  .map(
                    (record) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.date
                    }</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      record.route
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.deliveries
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.items
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }">
                        ${
                          record.status === "completed"
                            ? "Completed"
                            : "In Progress"
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">View</button>
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

class EmergencyDataRetrieval {
  constructor() {
    this.backups = [
      {
        id: 1,
        name: "Full System Backup",
        date: "2025-01-19 23:00",
        size: "2.4 GB",
        status: "available",
        type: "Full",
      },
      {
        id: 2,
        name: "Employee Records Backup",
        date: "2025-01-19 12:00",
        size: "450 MB",
        status: "available",
        type: "Partial",
      },
      {
        id: 3,
        name: "Financial Data Backup",
        date: "2025-01-18 23:00",
        size: "890 MB",
        status: "available",
        type: "Partial",
      },
      {
        id: 4,
        name: "Inventory Backup",
        date: "2025-01-18 12:00",
        size: "320 MB",
        status: "available",
        type: "Partial",
      },
    ];

    this.recoveryLogs = [
      {
        id: 1,
        action: "Data Export",
        timestamp: "2025-01-19 14:30",
        user: "Admin",
        status: "success",
      },
      {
        id: 2,
        action: "Backup Verification",
        timestamp: "2025-01-19 10:15",
        user: "System",
        status: "success",
      },
      {
        id: 3,
        action: "Data Recovery Test",
        timestamp: "2025-01-18 16:45",
        user: "Admin",
        status: "success",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Backups</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">4</p>
              </div>
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Available</p>
                <p class="text-3xl font-bold text-green-600 mt-2">4</p>
              </div>
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Last Backup</p>
                <p class="text-lg font-bold text-gray-900 mt-2">23:00</p>
                <p class="text-xs text-gray-500">Today</p>
              </div>
              <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Size</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">4.0 GB</p>
              </div>
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Available Backups -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Available Backups</h3>
              <p class="text-gray-600 text-sm mt-1">Retrieve data in case of emergency</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Backup Name</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  ${this.backups
                    .map(
                      (backup) => `
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">${backup.name}</td>
                      <td class="px-6 py-4 text-sm text-gray-600">${backup.date}</td>
                      <td class="px-6 py-4 text-sm text-gray-600">${backup.size}</td>
                      <td class="px-6 py-4">
                        <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                          </svg>
                          Retrieve
                        </button>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recovery Logs -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Recovery Logs</h3>
              <p class="text-gray-600 text-sm mt-1">Data retrieval and recovery history</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  ${this.recoveryLogs
                    .map(
                      (log) => `
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                        log.action
                      }</td>
                      <td class="px-6 py-4 text-sm text-gray-600">${
                        log.timestamp
                      }</td>
                      <td class="px-6 py-4 text-sm text-gray-600">${
                        log.user
                      }</td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ${
                            log.status.charAt(0).toUpperCase() +
                            log.status.slice(1)
                          }
                        </span>
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
      </div>
    `;
  }
}

export function renderAssistantManagerDashboard(container) {
  const dashboard = new AssistantManagerDashboard(container);
  dashboard.render();
}
