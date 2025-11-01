class DriverDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "deliveries";
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
      { id: "deliveries", label: "Delivery Details", icon: "package" },
      { id: "route", label: "Delivery Route", icon: "map-pin" },
      { id: "proof", label: "Proof of Delivery", icon: "file-check" },
      { id: "payment", label: "Payment Collection", icon: "credit-card" },
      { id: "vehicle", label: "Vehicle Tracking", icon: "truck" },
      { id: "status", label: "Delivery Status", icon: "check-circle" },
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
        <div class="p-6 border-b border-green-600">
          <h1 class="text-2xl font-bold">Driver Portal</h1>
          <p class="text-green-100 text-sm mt-1">Distribution System</p>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
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

  renderSection(section) {
    const sections = {
      deliveries: new DeliveryDetails(),
      route: new DeliveryRoute(),
      proof: new ProofOfDelivery(),
      payment: new PaymentCollection(),
      vehicle: new VehicleTracking(),
      status: new DeliveryStatus(),
    };
    return sections[section].render();
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

  navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    content.innerHTML = `<div class="p-8">${this.renderSection(section)}</div>`;

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
      package: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      "map-pin": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      "file-check": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "credit-card": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      truck: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "check-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      phone: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
      clock: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "alert-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class DeliveryDetails {
  constructor() {
    this.deliveries = [
      { id: "DEL-001", buyer: "ABC Retail Store", address: "123 Main Street, Colombo", phone: "+94 11 234 5678", items: 5, date: "2024-10-20", time: "09:00 AM", status: "pending" },
      { id: "DEL-002", buyer: "XYZ Supermarket", address: "456 Market Road, Colombo", phone: "+94 11 345 6789", items: 8, date: "2024-10-20", time: "10:30 AM", status: "in-transit" },
      { id: "DEL-003", buyer: "Quick Shop", address: "789 Commercial Ave, Colombo", phone: "+94 11 456 7890", items: 3, date: "2024-10-20", time: "12:00 PM", status: "pending" },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Today's Deliveries</h2>
          <p class="text-gray-600">View and manage all delivery details for today</p>
        </div>

        <div class="grid gap-4">
          ${this.deliveries.map((delivery) => `
            <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">${delivery.buyer}</h3>
                  <p class="text-sm text-gray-500">${delivery.id}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${
                  delivery.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                }">
                  ${delivery.status === "pending" ? "Pending" : "In Transit"}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Address</p>
                    <p class="text-sm text-gray-900">${delivery.address}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Contact</p>
                    <p class="text-sm text-gray-900">${delivery.phone}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Items</p>
                    <p class="text-sm text-gray-900">${delivery.items} products</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Scheduled Time</p>
                    <p class="text-sm text-gray-900">${delivery.time}</p>
                  </div>
                </div>
              </div>

              <button class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                View Details
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
}

class DeliveryRoute {
  render() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Delivery Route</h2>
          <p class="text-gray-600">Optimized route for today's deliveries</p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-sm text-gray-600 mb-1">Total Distance</p>
            <p class="text-2xl font-bold text-gray-900">24.5 km</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-sm text-gray-600 mb-1">Estimated Time</p>
            <p class="text-2xl font-bold text-gray-900">2h 15m</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-sm text-gray-600 mb-1">Stops Remaining</p>
            <p class="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="font-bold text-gray-900 mb-4">Route Stops</h3>
          <div class="space-y-4">
            ${[
              { stop: 1, name: "ABC Retail Store", address: "123 Main Street", time: "09:00 AM", status: "pending" },
              { stop: 2, name: "XYZ Supermarket", address: "456 Market Road", time: "10:30 AM", status: "current" },
              { stop: 3, name: "Quick Shop", address: "789 Commercial Ave", time: "12:00 PM", status: "pending" },
            ].map((stop) => `
              <div class="flex items-start gap-4 p-4 rounded-lg border-2 ${
                stop.status === "current" ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
              }">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    stop.status === "current" ? "bg-green-600" : "bg-gray-400"
                  }">
                    ${stop.stop}
                  </div>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">${stop.name}</p>
                  <p class="text-sm text-gray-600">${stop.address}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${stop.time}</p>
                  <p class="text-xs text-gray-500 capitalize">${stop.status}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p class="font-medium text-blue-900">Route Optimization</p>
            <p class="text-sm text-blue-800">This route has been optimized for shortest travel time and fuel efficiency.</p>
          </div>
        </div>
      </div>
    `;
  }
}

class ProofOfDelivery {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Proof of Delivery</h3>
          <p class="text-gray-600">Capture signatures and delivery confirmation</p>
        </div>
      </div>
    `;
  }
}

class PaymentCollection {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Collection</h3>
          <p class="text-gray-600">Record and manage cash-on-delivery payments</p>
        </div>
      </div>
    `;
  }
}

class VehicleTracking {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Vehicle Tracking</h3>
          <p class="text-gray-600">Monitor vehicle location and status in real-time</p>
        </div>
      </div>
    `;
  }
}

class DeliveryStatus {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Delivery Status</h3>
          <p class="text-gray-600">Update and track delivery status in real-time</p>
        </div>
      </div>
    `;
  }
}

export function renderDriverDashboard(container) {
  const dashboard = new DriverDashboard(container);
  dashboard.render();
}
