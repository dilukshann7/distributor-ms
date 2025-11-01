class StockKeeperDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "inventory";
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
      { id: "inventory", label: "Inventory Management", icon: "package" },
      { id: "receiving", label: "Receiving & Shipment", icon: "inbox" },
      { id: "alerts", label: "Low Stock Alerts", icon: "alert-circle" },
      { id: "reports", label: "Stock Reports", icon: "bar-chart" },
      { id: "barcode", label: "Barcode Scanning", icon: "barcode" },
      { id: "auditing", label: "Stock Auditing", icon: "check-square" },
    ];

    return `
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-purple-600 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-purple-600">Stock Keeper</h1>
          <p class="text-sm text-gray-500 mt-1">Inventory Management System</p>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-gray-200 bg-purple-50">
          <div class="text-sm text-gray-600">
            <p class="font-medium text-purple-700">Quick Stats</p>
            <div class="mt-2 space-y-1 text-xs">
              <p>Total Items: <span class="font-bold text-purple-600">1,245</span></p>
              <p>Low Stock: <span class="font-bold text-red-600">23</span></p>
              <p>Last Audit: <span class="font-bold">Today</span></p>
            </div>
          </div>
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
          <h2 class="text-2xl font-bold text-gray-800">Stock Management</h2>
          <p class="text-sm text-gray-500">Manage inventory, track stock levels, and generate reports</p>
        </div>

        <div class="flex items-center gap-4">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-800">John Doe</p>
              <p class="text-xs text-gray-500">Stock Keeper</p>
            </div>
            <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              ${this.getIcon("user")}
            </button>
            <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              ${this.getIcon("log-out")}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  renderSection(section) {
    const sections = {
      inventory: new InventoryManagement(),
      receiving: new ReceivingShipment(),
      alerts: new LowStockAlerts(),
      reports: new StockReports(),
      barcode: new BarcodeScanning(),
      auditing: new StockAuditing(),
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
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-purple-100 text-purple-700 font-medium";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-100";
      }
    });
  }

  getIcon(name) {
    const icons = {
      package: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      inbox: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>',
      "alert-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "bar-chart": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      barcode: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
      "check-square": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      "log-out": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      search: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      "alert-triangle": '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      clock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "check-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class InventoryManagement {
  constructor() {
    this.searchTerm = "";
    this.inventoryItems = [
      { id: 1, name: "Air Freshener", sku: "AF-001", quantity: 450, minStock: 100, maxStock: 500, expiryDate: "2025-12-31", batchNumber: "BATCH-2024-001", location: "A1-01", unit: "Boxes" },
      { id: 2, name: "Handwash", sku: "HW-002", quantity: 45, minStock: 100, maxStock: 300, expiryDate: "2025-06-15", batchNumber: "BATCH-2024-002", location: "B2-03", unit: "Cartons" },
      { id: 3, name: "Car Interior Spray", sku: "CIS-003", quantity: 320, minStock: 150, maxStock: 400, expiryDate: "2026-03-20", batchNumber: "BATCH-2024-003", location: "C1-05", unit: "Boxes" },
      { id: 4, name: "Dish Liquid", sku: "DL-004", quantity: 78, minStock: 200, maxStock: 500, expiryDate: "2025-09-10", batchNumber: "BATCH-2024-004", location: "A3-02", unit: "Bottles" },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Inventory Management</h3>
            <p class="text-gray-600 mt-1">Add, edit, and manage inventory items</p>
          </div>
          <button class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Item
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="mb-6 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search by name or SKU..." class="bg-transparent flex-1 outline-none text-gray-700" id="searchInput" />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Item Name</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Min/Max</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Expiry Date</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Batch #</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.inventoryItems.map((item) => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="py-3 px-4 text-gray-800 font-medium">${item.name}</td>
                    <td class="py-3 px-4 text-gray-600">${item.sku}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-sm font-medium ${
                        item.quantity < item.minStock
                          ? "bg-red-100 text-red-700"
                          : item.quantity > item.maxStock
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }">
                        ${item.quantity} ${item.unit}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-600 text-sm">${item.minStock} / ${item.maxStock}</td>
                    <td class="py-3 px-4 text-gray-600">${item.expiryDate}</td>
                    <td class="py-3 px-4 text-gray-600 text-sm">${item.batchNumber}</td>
                    <td class="py-3 px-4 text-gray-600 font-medium">${item.location}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      </div>
    `;
  }
}

class ReceivingShipment {
  constructor() {
    this.activeTab = "pending";
    this.shipments = {
      pending: [
        { id: 1, supplier: "Britol Products Ltd", poNumber: "PO-2024-001", expectedDate: "2024-10-20", items: 5, status: "pending" },
        { id: 2, supplier: "Alli Food Products", poNumber: "PO-2024-002", expectedDate: "2024-10-21", items: 3, status: "pending" },
      ],
      received: [
        { id: 3, supplier: "Britol Products Ltd", poNumber: "PO-2024-003", receivedDate: "2024-10-18", items: 8, status: "received" },
        { id: 4, supplier: "Alli Food Products", poNumber: "PO-2024-004", receivedDate: "2024-10-17", items: 6, status: "received" },
      ],
      issues: [
        { id: 5, supplier: "Britol Products Ltd", poNumber: "PO-2024-005", issue: "Damaged items found", items: 2, status: "issue" },
      ],
    };
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Receiving & Shipment</h3>
            <p class="text-gray-600 mt-1">Track incoming and outgoing shipments</p>
          </div>
          <button class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Shipment
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200">
          <div class="flex border-b border-gray-200">
            ${[
              { id: "pending", label: "Pending", icon: "clock" },
              { id: "received", label: "Received", icon: "check-circle" },
              { id: "issues", label: "Issues", icon: "alert-circle" },
            ]
              .map(
                (tab) => `
              <button data-tab="${tab.id}" class="tab-btn flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                this.activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-800"
              }">
                ${this.getTabIcon(tab.icon)}
                ${tab.label}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="p-6 space-y-4" id="shipmentsContainer">
            ${this.renderShipments()}
          </div>
        </div>
      </div>
    `;
  }

  renderShipments() {
    return this.shipments[this.activeTab]
      .map(
        (shipment) => `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800">${shipment.supplier}</h4>
            <p class="text-sm text-gray-600 mt-1">PO: ${shipment.poNumber}</p>
            <p class="text-sm text-gray-600">Items: ${shipment.items}</p>
          </div>
          <div class="text-right">
            ${this.activeTab === "pending" ? `<p class="text-sm text-gray-600">Expected: ${shipment.expectedDate}</p>` : ""}
            ${this.activeTab === "received" ? `<p class="text-sm text-green-600 font-medium">Received: ${shipment.receivedDate}</p>` : ""}
            ${this.activeTab === "issues" ? `<p class="text-sm text-red-600 font-medium">${shipment.issue}</p>` : ""}
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          ${
            this.activeTab === "pending"
              ? '<button class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Mark Received</button>'
              : ""
          }
          <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">View Details</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  getTabIcon(name) {
    const icons = {
      clock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "check-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "alert-circle": '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class LowStockAlerts {
  constructor() {
    this.alerts = [
      { id: 1, itemName: "Handwash", sku: "HW-002", currentStock: 45, minStock: 100, reorderQuantity: 200, daysUntilStockout: 3, severity: "critical" },
      { id: 2, itemName: "Dish Liquid", sku: "DL-004", currentStock: 78, minStock: 200, reorderQuantity: 300, daysUntilStockout: 5, severity: "high" },
      { id: 3, itemName: "Car Interior Spray", sku: "CIS-003", currentStock: 320, minStock: 150, reorderQuantity: 150, daysUntilStockout: 12, severity: "medium" },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Low Stock Alerts</h3>
          <p class="text-gray-600 mt-1">Items running below minimum stock levels</p>
        </div>

        <div class="grid gap-4">
          ${this.alerts.map((alert) => `
            <div class="border rounded-lg p-6 ${this.getSeverityColor(alert.severity)}">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4 flex-1">
                  <div class="p-3 bg-white rounded-lg">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <h4 class="font-bold text-gray-800 text-lg">${alert.itemName}</h4>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getSeverityBadgeColor(alert.severity)}">
                        ${alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">SKU: ${alert.sku}</p>

                    <div class="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p class="text-xs text-gray-600 font-medium">Current Stock</p>
                        <p class="text-lg font-bold text-gray-800">${alert.currentStock} units</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 font-medium">Minimum Required</p>
                        <p class="text-lg font-bold text-gray-800">${alert.minStock} units</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 font-medium">Reorder Quantity</p>
                        <p class="text-lg font-bold text-gray-800">${alert.reorderQuantity} units</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 font-medium">Days Until Stockout</p>
                        <p class="text-lg font-bold text-red-600">${alert.daysUntilStockout} days</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Reorder Now
                  </button>
                  <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  getSeverityColor(severity) {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  }

  getSeverityBadgeColor(severity) {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
}

class StockReports {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Stock Reports</h3>
          <p class="text-gray-600">Generate comprehensive stock reports and analytics</p>
        </div>
      </div>
    `;
  }
}

class BarcodeScanning {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Barcode Scanning</h3>
          <p class="text-gray-600">Scan barcodes for quick inventory updates</p>
        </div>
      </div>
    `;
  }
}

class StockAuditing {
  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <svg class="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Stock Auditing</h3>
          <p class="text-gray-600">Conduct regular stock audits and reconciliation</p>
        </div>
      </div>
    `;
  }
}

export function renderStockKeeperDashboard(container) {
  const dashboard = new StockKeeperDashboard(container);
  dashboard.render();
}
