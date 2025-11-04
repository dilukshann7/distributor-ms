import logo from "../../assets/logo-tr.png";

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
       <img src="${logo}" alt="Logo" class="w-32 h-32 mx-auto my-6"/>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
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
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      users:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      "map-pin":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      truck:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      lock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
      bell: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      eye: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      phone:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
      "alert-triangle":
        '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    };
    return icons[name] || "";
  }
}

class OrderManagement {
  constructor() {
    this.orders = [
      {
        id: "ORD-001",
        buyer: "ABC Retail Store",
        items: 5,
        total: "$2,500",
        status: "pending",
        date: "2024-10-19",
        authorized: false,
      },
      {
        id: "ORD-002",
        buyer: "XYZ Supermarket",
        items: 8,
        total: "$4,200",
        status: "authorized",
        date: "2024-10-18",
        authorized: true,
      },
      {
        id: "ORD-003",
        buyer: "Quick Shop",
        items: 3,
        total: "$1,800",
        status: "in-transit",
        date: "2024-10-17",
        authorized: true,
      },
      {
        id: "ORD-004",
        buyer: "Metro Mart",
        items: 12,
        total: "$6,500",
        status: "delivered",
        date: "2024-10-16",
        authorized: true,
      },
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
              ${this.orders
                .map(
                  (order) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-gray-800">${
                    order.id
                  }</td>
                  <td class="px-6 py-4 text-gray-700">${order.buyer}</td>
                  <td class="px-6 py-4 text-gray-700">${order.items}</td>
                  <td class="px-6 py-4 font-semibold text-gray-800">${
                    order.total
                  }</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(
                      order.status
                    )}">
                      ${
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1).replace("-", " ")
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                      order.authorized
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
              `
                )
                .join("")}
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
                ${this.drivers
                  .map(
                    (driver) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      driver.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      ${driver.phone}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      driver.vehicle
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${driver.currentRoute}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
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
                    <td class="px-6 py-4">
                      <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Message</button>
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

class StockTracking {
  constructor() {
    this.stockLocations = [
      {
        id: 1,
        orderId: "ORD-001",
        product: "Air Freshener",
        quantity: 100,
        location: "Warehouse A - Shelf 5",
        status: "ready",
        lastUpdated: "2024-10-19 10:30 AM",
      },
      {
        id: 2,
        orderId: "ORD-002",
        product: "Handwash",
        quantity: 250,
        location: "Warehouse B - Shelf 12",
        status: "ready",
        lastUpdated: "2024-10-19 09:15 AM",
      },
      {
        id: 3,
        orderId: "ORD-003",
        product: "Dish Liquid",
        quantity: 75,
        location: "Warehouse A - Shelf 8",
        status: "in-transit",
        lastUpdated: "2024-10-19 11:00 AM",
      },
      {
        id: 4,
        orderId: "ORD-004",
        product: "Car Interior Spray",
        quantity: 150,
        location: "Warehouse C - Shelf 3",
        status: "ready",
        lastUpdated: "2024-10-19 08:45 AM",
      },
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
                ${this.stockLocations
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-800">${
                      item.orderId
                    }</td>
                    <td class="px-6 py-4 text-gray-700">${item.product}</td>
                    <td class="px-6 py-4 text-gray-700">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${item.location}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(
                        item.status
                      )}">
                        ${
                          item.status.charAt(0).toUpperCase() +
                          item.status.slice(1).replace("-", " ")
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600 text-sm">${
                      item.lastUpdated
                    }</td>
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
  constructor() {
    this.routes = [
      {
        id: "RT-001",
        name: "Route A - Central District",
        driver: "John Driver",
        vehicle: "VAN-123",
        stops: 8,
        distance: "45 km",
        estimatedTime: "3h 30m",
        status: "active",
        completedStops: 5,
        orders: [
          "ORD-001",
          "ORD-002",
          "ORD-003",
          "ORD-004",
          "ORD-005",
          "ORD-006",
          "ORD-007",
          "ORD-008",
        ],
      },
      {
        id: "RT-002",
        name: "Route B - South Zone",
        driver: "Sarah Driver",
        vehicle: "VAN-456",
        stops: 6,
        distance: "32 km",
        estimatedTime: "2h 45m",
        status: "active",
        completedStops: 6,
        orders: [
          "ORD-009",
          "ORD-010",
          "ORD-011",
          "ORD-012",
          "ORD-013",
          "ORD-014",
        ],
      },
      {
        id: "RT-003",
        name: "Route C - North Area",
        driver: "Mike Driver",
        vehicle: "VAN-789",
        stops: 10,
        distance: "58 km",
        estimatedTime: "4h 15m",
        status: "planned",
        completedStops: 0,
        orders: [
          "ORD-015",
          "ORD-016",
          "ORD-017",
          "ORD-018",
          "ORD-019",
          "ORD-020",
          "ORD-021",
          "ORD-022",
          "ORD-023",
          "ORD-024",
        ],
      },
    ];
  }

  render() {
    const activeRoutes = this.routes.filter(
      (r) => r.status === "active"
    ).length;
    const totalStops = this.routes.reduce((sum, r) => sum + r.stops, 0);
    const completedStops = this.routes.reduce(
      (sum, r) => sum + r.completedStops,
      0
    );

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery Routes</h3>
          <p class="text-gray-600 mt-1">Optimize and manage delivery routes</p>
        </div>

        <!-- Route Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">Total Routes</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.routes.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Active Routes</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${activeRoutes}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed Stops</p>
            <p class="text-3xl font-bold text-green-600 mt-2">${completedStops}/${totalStops}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Completion Rate</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">${(
              (completedStops / totalStops) *
              100
            ).toFixed(0)}%</p>
          </div>
        </div>

        <!-- Routes List -->
        <div class="space-y-4">
          ${this.routes
            .map(
              (route) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
              route.status === "active"
                ? "border-blue-600"
                : route.status === "completed"
                ? "border-green-600"
                : "border-gray-400"
            }">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${
                        route.name
                      }</h4>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        route.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : route.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${
                          route.status.charAt(0).toUpperCase() +
                          route.status.slice(1)
                        }
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">Route ID: ${route.id}</p>
                  </div>
                  
                  <div class="flex gap-2">
                    <button class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="View Map">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                      </svg>
                    </button>
                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Route">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Route Details Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Driver</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.driver
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Vehicle</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.vehicle
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Distance</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.distance
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Est. Time</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.estimatedTime
                    }</p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Progress</span>
                    <span class="text-sm font-semibold text-orange-600">${
                      route.completedStops
                    }/${route.stops} stops</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-orange-600 h-2 rounded-full transition-all" style="width: ${
                      (route.completedStops / route.stops) * 100
                    }%"></div>
                  </div>
                </div>

                <!-- Orders List -->
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Orders (${
                    route.orders.length
                  })</p>
                  <div class="flex flex-wrap gap-2">
                    ${route.orders
                      .map(
                        (order, index) => `
                      <span class="px-2 py-1 rounded text-xs font-medium ${
                        index < route.completedStops
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${order}
                      </span>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Route Optimization -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Route Optimization</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Optimize Routes
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Create New Route
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              View Analytics
            </button>
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
        id: "POD-001",
        orderId: "ORD-001",
        customer: "ABC Store",
        address: "123 Main St, Colombo",
        deliveredBy: "John Driver",
        deliveryDate: "2025-01-19 14:30",
        status: "signed",
        signature: true,
        photo: true,
        notes: "Delivered to reception",
      },
      {
        id: "POD-002",
        orderId: "ORD-002",
        customer: "XYZ Market",
        address: "456 Park Ave, Kandy",
        deliveredBy: "Sarah Driver",
        deliveryDate: "2025-01-19 15:15",
        status: "signed",
        signature: true,
        photo: true,
        notes: "Left with security guard",
      },
      {
        id: "POD-003",
        orderId: "ORD-003",
        customer: "Quick Mart",
        address: "789 Lake Rd, Galle",
        deliveredBy: "John Driver",
        deliveryDate: "2025-01-19 16:00",
        status: "pending",
        signature: false,
        photo: false,
        notes: "",
      },
      {
        id: "POD-004",
        orderId: "ORD-004",
        customer: "City Center",
        address: "321 Beach Rd, Negombo",
        deliveredBy: "Mike Driver",
        deliveryDate: "2025-01-19 16:45",
        status: "signed",
        signature: true,
        photo: false,
        notes: "Delivered to manager",
      },
    ];
  }

  render() {
    const signedCount = this.deliveries.filter(
      (d) => d.status === "signed"
    ).length;
    const pendingCount = this.deliveries.filter(
      (d) => d.status === "pending"
    ).length;
    const withPhotos = this.deliveries.filter((d) => d.photo).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
          <p class="text-gray-600 mt-1">Manage delivery confirmations and signatures</p>
        </div>

        <!-- POD Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">Total Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.deliveries.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Signed</p>
            <p class="text-3xl font-bold text-green-600 mt-2">${signedCount}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">${pendingCount}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">With Photos</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${withPhotos}</p>
          </div>
        </div>

        <!-- Deliveries Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Delivery Records</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">POD ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delivered By</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proof</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.deliveries
                  .map(
                    (delivery) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      delivery.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-orange-600 font-medium">${
                      delivery.orderId
                    }</td>
                    <td class="px-6 py-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">${
                          delivery.customer
                        }</p>
                        <p class="text-xs text-gray-600">${delivery.address}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      delivery.deliveredBy
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      delivery.deliveryDate
                    }</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        ${
                          delivery.signature
                            ? '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
                            : '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>'
                        }
                        ${
                          delivery.photo
                            ? '<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
                            : '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>'
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === "signed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          delivery.status.charAt(0).toUpperCase() +
                          delivery.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button class="text-orange-600 hover:text-orange-800 font-medium text-sm">View Details</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Upload POD -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Upload Proof of Delivery</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
              <input type="file" id="signatureUpload" accept="image/*" class="hidden">
              <label for="signatureUpload" class="cursor-pointer">
                <svg class="w-12 h-12 mx-auto text-orange-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                <p class="text-gray-700 font-medium">Upload Signature</p>
                <p class="text-sm text-gray-600 mt-1">Click to upload customer signature</p>
              </label>
            </div>

            <div class="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
              <input type="file" id="photoUpload" accept="image/*" capture="camera" class="hidden">
              <label for="photoUpload" class="cursor-pointer">
                <svg class="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-gray-700 font-medium">Upload Photo</p>
                <p class="text-sm text-gray-600 mt-1">Click to upload delivery photo</p>
              </label>
            </div>
          </div>
        </div>

        <!-- POD Guidelines -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-orange-900 mb-1">Proof of Delivery Guidelines</h5>
              <ul class="text-sm text-orange-800 space-y-1">
                <li>• Always obtain customer signature for all deliveries</li>
                <li>• Take clear photos showing delivered goods and location</li>
                <li>• Note any special instructions or delivery issues</li>
                <li>• Upload proof within 1 hour of delivery completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

class OrderAuthorization {
  constructor() {
    this.pendingOrders = [
      {
        id: "ORD-025",
        customer: "Metro Supermarket",
        items: 15,
        value: 125000,
        requestedBy: "Sales Team",
        requestDate: "2025-01-19 09:30",
        priority: "high",
        notes: "Urgent request - store opening",
      },
      {
        id: "ORD-026",
        customer: "Corner Shop",
        items: 8,
        value: 45000,
        requestedBy: "Sales Team",
        requestDate: "2025-01-19 10:15",
        priority: "normal",
        notes: "Regular monthly order",
      },
      {
        id: "ORD-027",
        customer: "City Mall",
        items: 25,
        value: 280000,
        requestedBy: "Sales Team",
        requestDate: "2025-01-19 11:00",
        priority: "high",
        notes: "New store - first order",
      },
      {
        id: "ORD-028",
        customer: "Beach Store",
        items: 12,
        value: 87000,
        requestedBy: "Sales Team",
        requestDate: "2025-01-19 12:30",
        priority: "normal",
        notes: "Standard delivery",
      },
    ];

    this.authorizedOrders = [
      {
        id: "ORD-024",
        customer: "Quick Mart",
        items: 10,
        value: 68000,
        authorizedBy: "John Distributor",
        authorizedDate: "2025-01-19 08:45",
        status: "approved",
      },
      {
        id: "ORD-023",
        customer: "Food Palace",
        items: 18,
        value: 145000,
        authorizedBy: "John Distributor",
        authorizedDate: "2025-01-19 08:30",
        status: "approved",
      },
    ];
  }

  render() {
    const highPriority = this.pendingOrders.filter(
      (o) => o.priority === "high"
    ).length;
    const totalValue = this.pendingOrders.reduce((sum, o) => sum + o.value, 0);
    const totalItems = this.pendingOrders.reduce((sum, o) => sum + o.items, 0);

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Order Authorization</h3>
          <p class="text-gray-600 mt-1">Authorize and approve pending orders</p>
        </div>

        <!-- Authorization Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p class="text-gray-600 text-sm">Pending Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.pendingOrders.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <p class="text-gray-600 text-sm">High Priority</p>
            <p class="text-3xl font-bold text-red-600 mt-2">${highPriority}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Total Items</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${totalItems}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Total Value</p>
            <p class="text-3xl font-bold text-green-600 mt-2">Rs. ${(
              totalValue / 1000
            ).toFixed(0)}K</p>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Pending Authorization</h3>
          </div>
          <div class="divide-y divide-gray-200">
            ${this.pendingOrders
              .map(
                (order) => `
              <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${
                        order.id
                      }</h4>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        order.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }">
                        ${
                          order.priority === "high" ? "High Priority" : "Normal"
                        }
                      </span>
                    </div>
                    <p class="text-sm font-medium text-gray-700">${
                      order.customer
                    }</p>
                    <p class="text-xs text-gray-600 mt-1">${order.notes}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Items</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      order.items
                    } items</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Order Value</p>
                    <p class="text-sm font-semibold text-green-600">Rs. ${order.value.toFixed(
                      2
                    )}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Requested By</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      order.requestedBy
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Request Date</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      order.requestDate
                    }</p>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Approve
                  </button>
                  <button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject
                  </button>
                  <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Recently Authorized -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recently Authorized Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Authorized By</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.authorizedOrders
                  .map(
                    (order) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-orange-600">${
                      order.id
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      order.customer
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      order.items
                    } items</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">Rs. ${order.value.toFixed(
                      2
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      order.authorizedBy
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      order.authorizedDate
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Approved
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

        <!-- Authorization Guidelines -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-blue-900 mb-1">Authorization Guidelines</h5>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Review order details carefully before authorization</li>
                <li>• Prioritize high-priority and time-sensitive orders</li>
                <li>• Verify customer credit status for large orders</li>
                <li>• Ensure stock availability before approving orders</li>
                <li>• Document reasons for rejected orders</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Approve All Normal
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export Report
            </button>
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filter Orders
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

export function renderDistributorDashboard(container) {
  const dashboard = new DistributorDashboard(container);
  dashboard.render();
}
