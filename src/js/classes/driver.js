import logo from "../../assets/logo-tr.png";

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
        <img src="${logo}" alt="Logo" class="w-32 h-32 mx-auto my-6"/>

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
    this.deliveries = [
      {
        id: "DEL-001",
        buyer: "ABC Retail Store",
        address: "123 Main Street, Colombo",
        phone: "+94 11 234 5678",
        items: 5,
        date: "2024-10-20",
        time: "09:00 AM",
        status: "pending",
      },
      {
        id: "DEL-002",
        buyer: "XYZ Supermarket",
        address: "456 Market Road, Colombo",
        phone: "+94 11 345 6789",
        items: 8,
        date: "2024-10-20",
        time: "10:30 AM",
        status: "in-transit",
      },
      {
        id: "DEL-003",
        buyer: "Quick Shop",
        address: "789 Commercial Ave, Colombo",
        phone: "+94 11 456 7890",
        items: 3,
        date: "2024-10-20",
        time: "12:00 PM",
        status: "pending",
      },
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
          ${this.deliveries
            .map(
              (delivery) => `
            <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">${
                    delivery.buyer
                  }</h3>
                  <p class="text-sm text-gray-500">${delivery.id}</p>
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
                    <p class="text-sm text-gray-900">${
                      delivery.items
                    } products</p>
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
          `
            )
            .join("")}
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
              {
                stop: 1,
                name: "ABC Retail Store",
                address: "123 Main Street",
                time: "09:00 AM",
                status: "pending",
              },
              {
                stop: 2,
                name: "XYZ Supermarket",
                address: "456 Market Road",
                time: "10:30 AM",
                status: "current",
              },
              {
                stop: 3,
                name: "Quick Shop",
                address: "789 Commercial Ave",
                time: "12:00 PM",
                status: "pending",
              },
            ]
              .map(
                (stop) => `
              <div class="flex items-start gap-4 p-4 rounded-lg border-2 ${
                stop.status === "current"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-gray-50"
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
            `
              )
              .join("")}
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
  constructor() {
    this.deliveries = [
      {
        id: "DEL-001",
        orderId: "ORD-2024-105",
        customer: "ABC Retail Store",
        address: "123 Main Street, Downtown",
        items: 15,
        deliveryTime: "09:30 AM",
        status: "pending",
        hasSignature: false,
        hasPhoto: false,
      },
      {
        id: "DEL-002",
        orderId: "ORD-2024-106",
        customer: "XYZ Supermarket",
        address: "456 Market Road",
        items: 20,
        deliveryTime: "10:45 AM",
        status: "completed",
        hasSignature: true,
        hasPhoto: true,
        signature: "John Doe",
        notes: "Delivered in good condition",
      },
      {
        id: "DEL-003",
        orderId: "ORD-2024-107",
        customer: "Quick Shop",
        address: "789 Commercial Ave",
        items: 10,
        deliveryTime: "12:00 PM",
        status: "in-transit",
        hasSignature: false,
        hasPhoto: false,
      },
    ];
  }

  render() {
    const completed = this.deliveries.filter(
      (d) => d.status === "completed"
    ).length;
    const pending = this.deliveries.filter(
      (d) => d.status === "pending"
    ).length;
    const inTransit = this.deliveries.filter(
      (d) => d.status === "in-transit"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
          <p class="text-gray-600 mt-1">Capture signatures and delivery confirmations</p>
        </div>

        <!-- POD Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Total Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.deliveries.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Completed</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${completed}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">In Transit</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">${inTransit}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">${pending}</p>
          </div>
        </div>

        <!-- Delivery Cards -->
        <div class="space-y-4">
          ${this.deliveries
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
                    delivery.customer
                  }</h4>
                  <p class="text-sm text-gray-600">${delivery.address}</p>
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
                      : delivery.status === "in-transit"
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
                      delivery.id
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Order ID</p>
                    <p class="text-sm font-semibold text-green-600">${
                      delivery.orderId
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Items</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.items
                    } items</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Delivery Time</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.deliveryTime
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
                    <!-- Signature Upload -->
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
                      <div class="text-center">
                        <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        <h5 class="font-semibold text-gray-900 mb-1">Customer Signature</h5>
                        <p class="text-sm text-gray-600 mb-3">Capture signature for delivery confirmation</p>
                        <div class="flex gap-2 justify-center">
                          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                            Capture Signature
                          </button>
                          <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                            Upload File
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Photo Upload -->
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
                      <div class="text-center">
                        <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <h5 class="font-semibold text-gray-900 mb-1">Delivery Photo</h5>
                        <p class="text-sm text-gray-600 mb-3">Upload photo proof of delivery</p>
                        <div class="flex gap-2 justify-center">
                          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                            Take Photo
                          </button>
                          <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                            Upload Image
                          </button>
                        </div>
                      </div>
                    </div>

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

        <!-- POD Guidelines -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-blue-900 mb-1">Proof of Delivery Guidelines</h5>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Always capture customer signature before leaving</li>
                <li>• Take clear photos showing delivered items</li>
                <li>• Note any damaged packaging or discrepancies</li>
                <li>• Ensure delivery address matches order details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

class PaymentCollection {
  constructor() {
    this.payments = [
      {
        id: "PAY-001",
        orderId: "ORD-2024-105",
        customer: "ABC Retail Store",
        amount: 45000,
        paymentMethod: "cash",
        status: "collected",
        collectedAt: "09:35 AM",
      },
      {
        id: "PAY-002",
        orderId: "ORD-2024-106",
        customer: "XYZ Supermarket",
        amount: 67500,
        paymentMethod: "pending",
        status: "pending",
        dueAmount: 67500,
      },
      {
        id: "PAY-003",
        orderId: "ORD-2024-107",
        customer: "Quick Shop",
        amount: 32000,
        paymentMethod: "card",
        status: "collected",
        collectedAt: "12:15 PM",
      },
    ];
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

        <!-- Payment Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Total Amount</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">Rs. ${(
              totalAmount / 1000
            ).toFixed(0)}K</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Collected</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">Rs. ${(
              collected / 1000
            ).toFixed(0)}K</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">Rs. ${(
              pending / 1000
            ).toFixed(0)}K</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Transactions</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">${collectedCount}/${
      this.payments.length
    }</p>
          </div>
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
                      payment.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      payment.customer
                    }</td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">Rs. ${payment.amount.toFixed(
                      2
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 capitalize">${
                      payment.paymentMethod
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.collectedAt || "-"
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "collected"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }">
                        ${
                          payment.status === "collected"
                            ? "Collected"
                            : "Pending"
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.status === "pending"
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

        <!-- Payment Summary -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm mb-1">Total Collected Today</p>
              <p class="text-4xl font-bold">Rs. ${collected.toFixed(2)}</p>
            </div>
            <div class="text-right">
              <p class="text-green-100 text-sm mb-1">Collection Rate</p>
              <p class="text-4xl font-bold">${(
                (collected / totalAmount) *
                100
              ).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <!-- Payment Guidelines -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-yellow-900 mb-1">Payment Collection Guidelines</h5>
              <ul class="text-sm text-yellow-800 space-y-1">
                <li>• Count cash carefully before accepting payment</li>
                <li>• Provide receipt for all collected payments</li>
                <li>• Record payment immediately after collection</li>
                <li>• Report any payment discrepancies immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

class VehicleTracking {
  constructor() {
    this.vehicleInfo = {
      vehicleNo: "DMS-VH-001",
      model: "Toyota Hiace",
      driver: "Mike Anderson",
      currentLocation: "Downtown Area, Main Street",
      speed: 45,
      fuel: 75,
      mileage: 12450,
      lastUpdated: "2 mins ago",
    };

    this.todayStats = {
      distanceCovered: 45.5,
      fuelConsumed: 12.5,
      stops: 5,
      avgSpeed: 42,
    };

    this.recentLocations = [
      {
        time: "02:30 PM",
        location: "Downtown Area, Main Street",
        status: "moving",
      },
      {
        time: "02:15 PM",
        location: "XYZ Supermarket, Market Road",
        status: "stopped",
      },
      { time: "01:45 PM", location: "Commercial District", status: "moving" },
      {
        time: "01:30 PM",
        location: "ABC Retail Store, Main Street",
        status: "stopped",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Vehicle Tracking</h3>
          <p class="text-gray-600 mt-1">Monitor vehicle location and performance</p>
        </div>

        <!-- Vehicle Info Card -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-green-100 text-sm">Vehicle Number</p>
              <p class="text-3xl font-bold">${this.vehicleInfo.vehicleNo}</p>
            </div>
            <div class="bg-white bg-opacity-20 rounded-full p-4">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-green-100 text-sm">Model</p>
              <p class="font-semibold">${this.vehicleInfo.model}</p>
            </div>
            <div>
              <p class="text-green-100 text-sm">Driver</p>
              <p class="font-semibold">${this.vehicleInfo.driver}</p>
            </div>
          </div>
        </div>

        <!-- Live Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Speed</p>
                <p class="text-3xl font-bold text-blue-600 mt-2">${
                  this.vehicleInfo.speed
                }</p>
                <p class="text-xs text-gray-500">km/h</p>
              </div>
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Fuel Level</p>
                <p class="text-3xl font-bold text-green-600 mt-2">${
                  this.vehicleInfo.fuel
                }%</p>
                <p class="text-xs text-gray-500">Remaining</p>
              </div>
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Mileage</p>
                <p class="text-3xl font-bold text-purple-600 mt-2">${(
                  this.vehicleInfo.mileage / 1000
                ).toFixed(1)}K</p>
                <p class="text-xs text-gray-500">Total km</p>
              </div>
              <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Last Update</p>
                <p class="text-xl font-bold text-orange-600 mt-2">${
                  this.vehicleInfo.lastUpdated
                }</p>
                <p class="text-xs text-gray-500">Status: Active</p>
              </div>
              <svg class="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Current Location -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start gap-4">
            <div class="bg-green-100 rounded-full p-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">Current Location</h4>
              <p class="text-gray-700">${this.vehicleInfo.currentLocation}</p>
              <p class="text-sm text-gray-500 mt-1">Updated ${
                this.vehicleInfo.lastUpdated
              }</p>
            </div>
            <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              View on Map
            </button>
          </div>
        </div>

        <!-- Today's Stats -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Today's Statistics</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">${
                  this.todayStats.distanceCovered
                }</p>
                <p class="text-sm text-gray-600">Distance (km)</p>
              </div>

              <div class="text-center">
                <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">${
                  this.todayStats.fuelConsumed
                }</p>
                <p class="text-sm text-gray-600">Fuel Used (L)</p>
              </div>

              <div class="text-center">
                <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">${
                  this.todayStats.stops
                }</p>
                <p class="text-sm text-gray-600">Stops Made</p>
              </div>

              <div class="text-center">
                <div class="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">${
                  this.todayStats.avgSpeed
                }</p>
                <p class="text-sm text-gray-600">Avg Speed (km/h)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location History -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Locations</h3>
          </div>
          <div class="divide-y divide-gray-200">
            ${this.recentLocations
              .map(
                (loc) => `
              <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full ${
                    loc.status === "moving" ? "bg-blue-100" : "bg-green-100"
                  } flex items-center justify-center">
                    <svg class="w-6 h-6 ${
                      loc.status === "moving"
                        ? "text-blue-600"
                        : "text-green-600"
                    }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      ${
                        loc.status === "moving"
                          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>'
                          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'
                      }
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">${loc.location}</p>
                    <p class="text-sm text-gray-500">${loc.time}</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                  loc.status === "moving"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }">
                  ${loc.status === "moving" ? "Moving" : "Stopped"}
                </span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
}

class DeliveryStatus {
  constructor() {
    this.deliveries = [
      {
        id: "DEL-001",
        orderId: "ORD-2024-105",
        customer: "ABC Retail Store",
        address: "123 Main Street",
        items: 15,
        priority: "high",
        status: "completed",
        startTime: "08:45 AM",
        completedTime: "09:30 AM",
        notes: "Delivered successfully",
      },
      {
        id: "DEL-002",
        orderId: "ORD-2024-106",
        customer: "XYZ Supermarket",
        address: "456 Market Road",
        items: 20,
        priority: "normal",
        status: "in-progress",
        startTime: "10:00 AM",
        estimatedTime: "11:00 AM",
        notes: "On the way",
      },
      {
        id: "DEL-003",
        orderId: "ORD-2024-107",
        customer: "Quick Shop",
        address: "789 Commercial Ave",
        items: 10,
        priority: "normal",
        status: "pending",
        estimatedTime: "12:30 PM",
        notes: "Scheduled for afternoon",
      },
      {
        id: "DEL-004",
        orderId: "ORD-2024-108",
        customer: "Metro Store",
        address: "321 Business District",
        items: 25,
        priority: "high",
        status: "pending",
        estimatedTime: "02:00 PM",
        notes: "Urgent delivery",
      },
    ];
  }

  render() {
    const completed = this.deliveries.filter(
      (d) => d.status === "completed"
    ).length;
    const inProgress = this.deliveries.filter(
      (d) => d.status === "in-progress"
    ).length;
    const pending = this.deliveries.filter(
      (d) => d.status === "pending"
    ).length;
    const highPriority = this.deliveries.filter(
      (d) => d.priority === "high"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery Status</h3>
          <p class="text-gray-600 mt-1">Update and track delivery status in real-time</p>
        </div>

        <!-- Status Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed</p>
            <p class="text-3xl font-bold text-green-600 mt-2">${completed}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">In Progress</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${inProgress}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">${pending}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <p class="text-gray-600 text-sm">High Priority</p>
            <p class="text-3xl font-bold text-red-600 mt-2">${highPriority}</p>
          </div>
        </div>

        <!-- Status Update Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Quick Status Update</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Delivery ID</label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select delivery...</option>
                ${this.deliveries
                  .map(
                    (d) =>
                      `<option value="${d.id}">${d.id} - ${d.customer}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Failed</option>
                <option>Rescheduled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input type="text" placeholder="Add notes..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <button class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Update Status
          </button>
        </div>

        <!-- Deliveries List -->
        <div class="space-y-4">
          ${this.deliveries
            .map(
              (delivery) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
              delivery.status === "completed"
                ? "border-green-600"
                : delivery.status === "in-progress"
                ? "border-blue-600"
                : delivery.priority === "high"
                ? "border-red-600"
                : "border-yellow-600"
            }">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-bold text-gray-900">${
                        delivery.customer
                      }</h4>
                      ${
                        delivery.priority === "high"
                          ? `
                        <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          High Priority
                        </span>
                      `
                          : ""
                      }
                    </div>
                    <p class="text-sm text-gray-600 mb-1">${
                      delivery.address
                    }</p>
                    <p class="text-xs text-gray-500">${delivery.orderId}</p>
                  </div>
                  <span class="px-4 py-2 rounded-full text-sm font-semibold ${
                    delivery.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : delivery.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }">
                    ${
                      delivery.status === "completed"
                        ? "Completed"
                        : delivery.status === "in-progress"
                        ? "In Progress"
                        : "Pending"
                    }
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Delivery ID</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.id
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Items</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.items
                    } items</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">${
                      delivery.status === "completed"
                        ? "Start Time"
                        : "Estimated Time"
                    }</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.status === "completed"
                        ? delivery.startTime
                        : delivery.estimatedTime
                    }</p>
                  </div>
                  ${
                    delivery.completedTime
                      ? `
                    <div>
                      <p class="text-xs text-gray-500">Completed</p>
                      <p class="text-sm font-semibold text-green-600">${delivery.completedTime}</p>
                    </div>
                  `
                      : `
                    <div>
                      <p class="text-xs text-gray-500">Status</p>
                      <p class="text-sm font-semibold text-gray-900">${delivery.notes}</p>
                    </div>
                  `
                  }
                </div>

                <!-- Status Timeline -->
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full ${
                          delivery.status === "completed" ||
                          delivery.status === "in-progress"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        } flex items-center justify-center text-white">
                          ${
                            delivery.status === "completed" ||
                            delivery.status === "in-progress"
                              ? "✓"
                              : "1"
                          }
                        </div>
                        <div class="flex-1 h-1 ${
                          delivery.status === "completed" ||
                          delivery.status === "in-progress"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }"></div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1 ml-1">Assigned</p>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full ${
                          delivery.status === "completed" ||
                          delivery.status === "in-progress"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        } flex items-center justify-center text-white">
                          ${
                            delivery.status === "completed" ||
                            delivery.status === "in-progress"
                              ? "✓"
                              : "2"
                          }
                        </div>
                        <div class="flex-1 h-1 ${
                          delivery.status === "completed"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }"></div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1 ml-1">In Transit</p>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full ${
                          delivery.status === "completed"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        } flex items-center justify-center text-white">
                          ${delivery.status === "completed" ? "✓" : "3"}
                        </div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1 ml-1">Delivered</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                  ${
                    delivery.status === "pending"
                      ? `
                    <button class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Start Delivery
                    </button>
                  `
                      : delivery.status === "in-progress"
                      ? `
                    <button class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Mark Complete
                    </button>
                  `
                      : `
                    <button class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                      View Details
                    </button>
                  `
                  }
                  <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Contact
                  </button>
                  <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Navigate
                  </button>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Delivery Tips -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-blue-900 mb-1">Delivery Best Practices</h5>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Update status immediately after each delivery</li>
                <li>• Prioritize high-priority deliveries first</li>
                <li>• Contact customer if you're running late</li>
                <li>• Report any issues or delays promptly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export function renderDriverDashboard(container) {
  const dashboard = new DriverDashboard(container);
  dashboard.render();
}
