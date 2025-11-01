class DistributorDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
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
      { id: "orders", label: "Order Management", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "users" },
      { id: "stock", label: "Stock Tracking", icon: "map-pin" },
      { id: "routes", label: "Delivery Routes", icon: "truck" },
      { id: "delivery", label: "Proof of Delivery", icon: "check-circle" },
      { id: "authorization", label: "Order Authorization", icon: "lock" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-orange-700 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
      <div class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-orange-700 to-orange-800 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <div class="p-6 border-b border-orange-600">
          <h1 class="text-2xl font-bold">Distributor</h1>
          <p class="text-orange-200 text-sm mt-1">Distribution Management</p>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-orange-600 text-white shadow-lg"
                  : "text-orange-100 hover:bg-orange-600/50"
              }">
              ${this.getIcon(item.icon)}
              <span class="font-medium">${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-orange-600 bg-orange-900/50">
          <p class="text-xs text-orange-200">Distribution System v1.0</p>
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
          <h2 class="text-2xl font-bold text-gray-800">Distribution Management System</h2>
          <p class="text-gray-600 text-sm mt-1">Manage orders, drivers, and deliveries</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="text-right">
              <p class="font-medium text-gray-800">John Distributor</p>
              <p class="text-xs text-gray-600">Distributor</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
          </div>

          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  renderSection(section) {
    const sections = {
      orders: new OrderManagement(),
      drivers: new DriverManagement(),
      stock: new StockTracking(),
      routes: new DeliveryRoutes(),
      delivery: new ProofOfDelivery(),
      authorization: new OrderAuthorization(),
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
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-orange-600 text-white shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-orange-100 hover:bg-orange-600/50";
      }
    });
  }

  getIcon(name) {
    const icons = {
      package: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      "map-pin": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      truck: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "check-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      lock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      eye: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      phone: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
      "alert-triangle": '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    };
    return icons[name] || "";
  }
}

class OrderManagement {
  constructor() {
    this.orders = [
      { id: "ORD-001", buyer: "ABC Retail Store", items: 5, total: "$2,500", status: "pending", date: "2024-10-19", authorized: false },
      { id: "ORD-002", buyer: "XYZ Supermarket", items: 8, total: "$4,200", status: "authorized", date: "2024-10-18", authorized: true },
      { id: "ORD-003", buyer: "Quick Shop", items: 3, total: "$1,800", status: "in-transit", date: "2024-10-17", authorized: true },
      { id: "ORD-004", buyer: "Metro Mart", items: 12, total: "$6,500", status: "delivered", date: "2024-10-16", authorized: true },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Order Management</h3>
            <p class="text-gray-600 mt-1">Manage and track all distribution orders</p>
          </div>
          <button class="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Order
          </button>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Buyer</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Auth</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.orders.map((order) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-gray-800">${order.id}</td>
                  <td class="px-6 py-4 text-gray-700">${order.buyer}</td>
                  <td class="px-6 py-4 text-gray-700">${order.items}</td>
                  <td class="px-6 py-4 font-semibold text-gray-800">${order.total}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(order.status)}">
                      ${order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                      order.authorized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }">
                      ${order.authorized ? "Yes" : "No"}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-600">${order.date}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button class="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "authorized":
        return "bg-blue-100 text-blue-800";
      case "in-transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}

class DriverManagement {
  constructor() {
    this.drivers = [
      { id: 1, name: "Ravi Kumar", phone: "+94 71 234 5678", vehicle: "Van - VH-2024", status: "active", currentRoute: "Route A - 5 stops", lastUpdate: "2 mins ago" },
      { id: 2, name: "Ahmed Hassan", phone: "+94 77 345 6789", vehicle: "Truck - VH-2025", status: "active", currentRoute: "Route B - 8 stops", lastUpdate: "5 mins ago" },
      { id: 3, name: "Carlos Rodriguez", phone: "+94 76 456 7890", vehicle: "Van - VH-2023", status: "inactive", currentRoute: "Completed", lastUpdate: "30 mins ago" },
      { id: 4, name: "Maria Santos", phone: "+94 70 567 8901", vehicle: "Truck - VH-2026", status: "active", currentRoute: "Route C - 6 stops", lastUpdate: "1 min ago" },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Drivers</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">4</p>
              </div>
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Active</p>
                <p class="text-3xl font-bold text-green-600 mt-2">3</p>
              </div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Inactive</p>
                <p class="text-3xl font-bold text-gray-600 mt-2">1</p>
              </div>
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Routes Active</p>
                <p class="text-3xl font-bold text-amber-600 mt-2">3</p>
              </div>
              <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Driver Management & Communication</h3>
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
              <tbody>
                ${this.drivers.map((driver) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${driver.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      ${driver.phone}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${driver.vehicle}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${driver.currentRoute}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        driver.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }">
                        ${driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${driver.lastUpdate}</td>
                    <td class="px-6 py-4">
                      <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Message</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

class StockTracking {
  constructor() {
    this.stockLocations = [
      { id: 1, orderId: "ORD-001", product: "Air Freshener", quantity: 100, location: "Warehouse A - Shelf 5", status: "ready", lastUpdated: "2024-10-19 10:30 AM" },
      { id: 2, orderId: "ORD-002", product: "Handwash", quantity: 250, location: "Warehouse B - Shelf 12", status: "ready", lastUpdated: "2024-10-19 09:15 AM" },
      { id: 3, orderId: "ORD-003", product: "Dish Liquid", quantity: 75, location: "Warehouse A - Shelf 8", status: "in-transit", lastUpdated: "2024-10-19 11:00 AM" },
      { id: 4, orderId: "ORD-004", product: "Car Interior Spray", quantity: 150, location: "Warehouse C - Shelf 3", status: "ready", lastUpdated: "2024-10-19 08:45 AM" },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Stock Location Tracking</h3>
          <p class="text-gray-600 mt-1">Track specific stock locations for received orders</p>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Items Tracked</p>
                <p class="text-3xl font-bold text-gray-800 mt-2">575</p>
              </div>
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Ready for Delivery</p>
                <p class="text-3xl font-bold text-green-600 mt-2">3</p>
              </div>
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">In Transit</p>
                <p class="text-3xl font-bold text-blue-600 mt-2">1</p>
              </div>
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Stock Locations by Order</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.stockLocations.map((item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-800">${item.orderId}</td>
                    <td class="px-6 py-4 text-gray-700">${item.product}</td>
                    <td class="px-6 py-4 text-gray-700">${item.quantity} units</td>
                    <td class="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${item.location}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(item.status)}">
                        ${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600 text-sm">${item.lastUpdated}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}

class DeliveryRoutes {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-orange-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Delivery Routes</h3>
          <p class="text-gray-600">Optimize and manage delivery routes</p>
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
          <svg class="w-16 h-16 text-orange-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Proof of Delivery</h3>
          <p class="text-gray-600">Manage delivery confirmations and signatures</p>
        </div>
      </div>
    `;
  }
}

class OrderAuthorization {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-orange-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Order Authorization</h3>
          <p class="text-gray-600">Authorize and approve pending orders</p>
        </div>
      </div>
    `;
  }
}

export function renderDistributorDashboard(container) {
  const dashboard = new DistributorDashboard(container);
  dashboard.render();
}
