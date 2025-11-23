import logo from "../../assets/logo-tr.png";
import { Product } from "../models/Product.js";
import { Shipment } from "../models/Shipment.js";
import "../../css/stock-keeper-style.css";

class StockKeeperDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "inventory";
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
      { id: "inventory", label: "Inventory", icon: "package" },
      { id: "receiving", label: "Shipment", icon: "inbox" },
      { id: "reports", label: "Stock Reports", icon: "bar-chart" },
      { id: "auditing", label: "Stock Auditing", icon: "check-square" },
    ];
    /*html*/
    return `
      <!-- Sidebar -->
      <aside class="translate-x-0 lg:translate-x-0 fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full  h-auto p-4" />
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item sk-nav-item ${
                this.currentSection === item.id
                  ? "sk-nav-item-active"
                  : "sk-nav-item-inactive"
              }">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="sk-header-title">Stock Management</h2>
          <p class="text-sm text-gray-500">Manage inventory, track stock levels, and generate reports</p>
        </div>

        <div class="flex items-center gap-4">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
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

  async renderSection(section) {
    if (!this.sections) {
      this.sections = {
        inventory: new InventoryManagement(this.container),
        receiving: new ReceivingShipment(this.container),
        reports: new StockReports(this.container),
        auditing: new StockAuditing(),
      };
    }
    const sectionInstance = this.sections[section];
    if (section === "inventory") {
      await sectionInstance.getInventoryItems();
    } else if (section === "receiving") {
      await sectionInstance.getShipments();
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
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    if (section === "receiving") {
      const receivingShipment = new ReceivingShipment(this.container);
      await receivingShipment.renderAndAttach(content);
    } else if (section === "reports") {
      this.sections.reports.attachEventListeners(content);
    }

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item sk-nav-item sk-nav-item-active";
      } else {
        item.className = "nav-item sk-nav-item sk-nav-item-inactive";
      }
    });
  }

  getIcon(name) {
    const icons = {
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      inbox:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>',
      "alert-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "bar-chart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      barcode:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
      "check-square":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      search:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      "alert-triangle":
        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class InventoryManagement {
  constructor(container) {
    this.container = container;
    this.inventoryItems = [];
    this.view = "list";
    this.editingItem = null;
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.inventoryItems = response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.inventoryItems = [];
    }
  }

  render() {
    if (this.view === "add") {
      return this.renderAddForm();
    }
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Inventory Management</h3>
            <p class="sk-text-muted">Add, edit, and manage inventory items</p>
          </div>
          <button onclick="window.stockKeeperDashboard.sections.inventory.switchToAdd()" class="sk-btn-primary px-4">
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
                  <th class="sk-table-header">Item Name</th>
                  <th class="sk-table-header">SKU</th>
                  <th class="sk-table-header">Quantity</th>
                  <th class="sk-table-header">Expiry Date</th>
                  <th class="sk-table-header">Batch #</th>
                  <th class="sk-table-header">Location</th>
                  <th class="sk-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.inventoryItems
                  .map(
                    (item) => `
                  <tr class="sk-table-row">
                    <td class="sk-table-cell-main">${item.name}</td>
                    <td class="sk-table-cell">${item.sku}</td>
                    <td class="py-3 px-4">
                      <span class="sk-badge ${
                        item.quantity < item.minStock
                          ? "sk-badge-red"
                          : item.quantity > item.maxStock
                          ? "sk-badge-yellow"
                          : "sk-badge-green"
                      }">
                        ${item.quantity}
                      </span>
                    </td>
                    
                    <td class="sk-table-cell">${
                      item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "N/A"
                    }</td>
                    <td class="sk-table-cell text-sm">${
                      item.batchNumber ? item.batchNumber : "N/A"
                    }</td>
                    <td class="sk-table-cell font-medium">${item.location}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <button onclick="window.stockKeeperDashboard.sections.inventory.switchToEdit('${
                          item.id
                        }')" class="sk-btn-icon-blue" title="Edit">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="sk-btn-icon-red" title="Delete">
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
      </div>
    `;
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Add New Item</h3>
            <p class="sk-text-muted">Add a new item to your inventory</p>
          </div>
        </div>

        <form id="addItemForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.inventory.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input type="text" name="name" required class="sk-input" placeholder="e.g. Air Freshener">
                </div>
                
                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input type="text" name="sku" required class="sk-input" placeholder="e.g. INV-001">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" class="sk-input" placeholder="e.g. BATCH-001">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input type="text" name="location" required class="sk-input" placeholder="e.g. Warehouse A, Shelf 3">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input type="number" name="quantity" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input type="number" name="minStock" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input type="number" name="maxStock" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2 md:col-span-3">
                  <label class="sk-label">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" class="sk-input">
                </div>

              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.inventory.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Save Item
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const item = this.editingItem;
    if (!item) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Edit Item</h3>
            <p class="sk-text-muted">Update item information</p>
          </div>
        </div>

        <form id="editItemForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.inventory.submitEditForm(event)">
          <div class="p-8 space-y-8">
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input type="text" name="name" required class="sk-input" placeholder="e.g. Air Freshener" value="${
                    item.name
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input type="text" name="sku" required class="sk-input" placeholder="e.g. INV-001" value="${
                    item.sku
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" class="sk-input" placeholder="e.g. BATCH-001" value="${
                    item.batchNumber || ""
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input type="text" name="location" required class="sk-input" placeholder="e.g. Warehouse A, Shelf 3" value="${
                    item.location
                  }">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input type="number" name="quantity" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.quantity
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input type="number" name="minStock" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.minStock
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input type="number" name="maxStock" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.maxStock
                  }">
                </div>
                <div class="space-y-2 md:col-span-3">
                  <label class="sk-label">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" class="sk-input" value="${
                    item.expiryDate || ""
                  }">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.inventory.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Update Item
            </button>
          </div>
        </form>
      </div>
    `;
  }

  switchToAdd() {
    this.view = "add";
    this.editingItem = null;
    this.refresh(this.container);
  }

  switchToEdit(itemId) {
    this.editingItem = this.inventoryItems.find(
      (item) => item.id === parseInt(itemId)
    );
    this.view = "edit";
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingItem = null;
    this.refresh(this.container);
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const itemData = {
      ...rawData,
      quantity: parseInt(rawData.quantity, 10),
      minStock: parseInt(rawData.minStock, 10),
      maxStock: parseInt(rawData.maxStock, 10),
    };

    Product.create(itemData)
      .then(() => {
        this.getInventoryItems().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error creating item:", error);
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const itemData = {
      ...rawData,
      quantity: parseInt(rawData.quantity, 10),
      minStock: parseInt(rawData.minStock, 10),
      maxStock: parseInt(rawData.maxStock, 10),
    };

    Product.update(this.editingItem.id, itemData)
      .then(() => {
        this.getInventoryItems().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}

class ReceivingShipment {
  constructor(container) {
    this.container = container;
    this.shipments = { in_transit: [], received: [], pending: [] };
    this.activeTab = "in_transit";
    this.view = "list";
    this.editingShipment = null;
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = {
        in_transit: response.data.filter((s) => s.status === "in_transit"),
        received: response.data.filter((s) => s.status === "received"),
        pending: response.data.filter((s) => s.status === "pending"),
      };
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = { in_transit: [], received: [], pending: [] };
    }
  }

  render() {
    if (this.view === "add") {
      return this.renderAddForm();
    }
    return this.renderList();
  }

  renderList() {
    return `
      <div class="space-y-6 p-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Receiving & Shipment</h3>
            <p class="sk-text-muted">Track incoming and outgoing shipments</p>
          </div>
          <button onclick="window.stockKeeperDashboard.sections.receiving.switchToAdd()" class="sk-btn-primary px-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Shipment
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200">
          <div class="flex border-b border-gray-200">
            ${[
              { id: "pending", label: "Pending", icon: "clock" },
              { id: "received", label: "Received", icon: "check-circle" },
              { id: "in_transit", label: "In Transit", icon: "alert-circle" },
            ]
              .map(
                (tab) => `
              <button data-tab="${
                tab.id
              }" class="tab-btn flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
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
            ${this.renderShipments("in_transit")}
          </div>
        </div>
      </div>
    `;
  }

  renderShipments(period) {
    const list = this.shipments[period] || [];
    if (list.length === 0) {
      return `<div class="text-sm text-gray-600">No shipments found for ${period.replace(
        "_",
        " "
      )}</div>`;
    }

    return list
      .map(
        (shipment) => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">${
                shipment.shipmentNumber
              }</h4>
              <p class="text-sm sk-text-muted">PO: ${
                shipment.purchaseOrderId
              }</p>
              <p class="text-sm text-gray-600">
                Items: ${
                  shipment.order?.items
                    ?.filter((item) => item && item.name)
                    .map(
                      (item) =>
                        `${item.name}${
                          item.quantity ? ` (x${item.quantity})` : ""
                        }`
                    )
                    .join(", ") || "No items"
                }
              </p>
            </div>
            <div class="text-right">
              ${
                period === "pending"
                  ? `<p class="text-sm text-gray-600">Expected: ${shipment.expectedDeliveryDate}</p>`
                  : ""
              }
              ${
                period === "received"
                  ? `<p class="text-sm text-green-600 font-medium">Received: ${shipment.actualDeliveryDate}</p>`
                  : ""
              }
              ${
                period === "in_transit"
                  ? `<p class="text-sm text-indigo-600 font-medium">Status: In Transit</p>`
                  : ""
              }
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            ${
              period === "pending"
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
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "alert-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }

  // Attach click listeners to tab buttons within a root element
  attachTabListeners(root) {
    const buttons = root.querySelectorAll(".tab-btn");
    const container = root.querySelector("#shipmentsContainer");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab;

        // render shipments into the local container
        container.innerHTML = this.renderShipments(this.activeTab);

        buttons.forEach((b) =>
          b.classList.remove(
            "text-purple-600",
            "border-b-2",
            "border-purple-600"
          )
        );
        btn.classList.add("text-purple-600", "border-b-2", "border-purple-600");
      });
    });
  }

  async renderAndAttach(container) {
    await this.getShipments();
    container.innerHTML = this.render();
    if (this.view === "list") {
      this.attachTabListeners(container);
    }
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">New Shipment</h3>
            <p class="sk-text-muted">Create a new shipment record</p>
          </div>
        </div>

        <form id="addShipmentForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.receiving.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                Shipment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Shipment Number</label>
                  <input type="text" name="shipmentNumber" required class="sk-input" placeholder="e.g. SHP-001">
                </div>
                
                <div class="space-y-2">
                  <label class="sk-label">Purchase Order ID</label>
                  <input type="text" name="purchaseOrderId" required class="sk-input" placeholder="e.g. PO-001">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Expected Delivery Date</label>
                  <input type="date" name="expectedDeliveryDate" required class="sk-input">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Status</label>
                  <select name="status" class="sk-input">
                    <option value="pending" selected>Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="received">Received</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label">Tracking Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="trackingNumber" class="sk-input" placeholder="e.g. TRK-123456">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Shipping Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="space-y-2">
                  <label class="sk-label">Carrier Name</label>
                  <input type="text" name="carrierName" class="sk-input" placeholder="e.g. DHL, FedEx">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Origin Location</label>
                  <input type="text" name="originLocation" class="sk-input" placeholder="e.g. Warehouse A">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="3" class="sk-input" placeholder="Additional notes about the shipment..."></textarea>
                </div>

              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.receiving.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    `;
  }

  switchToAdd() {
    this.view = "add";
    this.editingShipment = null;
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingShipment = null;
    this.refresh(this.container);
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const shipmentData = Object.fromEntries(formData.entries());

    Shipment.create(shipmentData)
      .then(() => {
        this.getShipments().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error creating shipment:", error);
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      if (this.view === "list") {
        this.attachTabListeners(content);
      }
    }
  }
}

class StockReports {
  constructor(container) {
    this.container = container;
    this.startDate = "";
    this.endDate = "";
    this.dailyData = [
      { date: "Mon", inbound: 120, outbound: 95, balance: 25 },
      { date: "Tue", inbound: 150, outbound: 110, balance: 40 },
      { date: "Wed", inbound: 100, outbound: 130, balance: -30 },
      { date: "Thu", inbound: 200, outbound: 85, balance: 115 },
      { date: "Fri", inbound: 180, outbound: 120, balance: 60 },
      { date: "Sat", inbound: 90, outbound: 75, balance: 15 },
      { date: "Sun", inbound: 110, outbound: 100, balance: 10 },
    ];

    this.weeklyData = [
      { week: "Week 1", items: 450, value: 12500 },
      { week: "Week 2", items: 520, value: 14200 },
      { week: "Week 3", items: 380, value: 10800 },
      { week: "Week 4", items: 610, value: 16500 },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Reports</h3>
            <p class="sk-text-muted">Daily stock movements</p>
          </div>
        </div>

        
        <div class="sk-card p-6">
          <h4 class="font-bold text-gray-900 mb-4">Generate Reports</h4>
          <div class="grid grid-cols-1 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export to PDF
            </button>
          
          </div>
        </div>
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  attachEventListeners(container) {
    const form = container.querySelector("#dateRangeForm");
    const clearBtn = container.querySelector("#clearFilterBtn");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        this.startDate = formData.get("startDate");
        this.endDate = formData.get("endDate");
        this.refresh(this.container);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.startDate = "";
        this.endDate = "";
        this.refresh(this.container);
      });
    }
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      this.attachEventListeners(content);
    }
  }
}

class StockAuditing {
  constructor() {
    this.audits = [
      {
        id: 1,
        date: "2024-10-15",
        itemName: "Air Freshener",
        sku: "AF-001",
        physicalCount: 445,
        systemCount: 450,
        discrepancy: -5,
        status: "minor",
        auditor: "John Doe",
      },
      {
        id: 2,
        date: "2024-10-15",
        itemName: "Handwash",
        sku: "HW-002",
        physicalCount: 42,
        systemCount: 45,
        discrepancy: -3,
        status: "minor",
        auditor: "John Doe",
      },
      {
        id: 3,
        date: "2024-10-14",
        itemName: "Car Interior Spray",
        sku: "CIS-003",
        physicalCount: 318,
        systemCount: 320,
        discrepancy: -2,
        status: "resolved",
        auditor: "Jane Smith",
      },
      {
        id: 4,
        date: "2024-10-14",
        itemName: "Dish Liquid",
        sku: "DL-004",
        physicalCount: 85,
        systemCount: 78,
        discrepancy: 7,
        status: "resolved",
        auditor: "Jane Smith",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Auditing</h3>
            <p class="sk-text-muted">Physical inventory counts and discrepancy tracking</p>
          </div>
          <button class="sk-btn-primary px-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Start New Audit
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          ${[
            {
              label: "Total Audits",
              value: "24",
              icon: "check-circle",
              color: "text-green-600",
            },
            {
              label: "Discrepancies",
              value: "4",
              icon: "alert-circle",
              color: "text-yellow-600",
            },
            {
              label: "Resolved",
              value: "2",
              icon: "check-circle",
              color: "text-blue-600",
            },
            {
              label: "Accuracy Rate",
              value: "98.5%",
              icon: "trending-up",
              color: "text-purple-600",
            },
          ]
            .map(
              (stat) => `
            <div class="sk-card p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">${stat.label}</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">${
                    stat.value
                  }</p>
                </div>
                ${this.getStatIcon(stat.icon, stat.color)}
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Audits Table -->
        <div class="sk-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="sk-table-header">Date</th>
                  <th class="sk-table-header">Item</th>
                  <th class="sk-table-header">Physical Count</th>
                  <th class="sk-table-header">System Count</th>
                  <th class="sk-table-header">Discrepancy</th>
                  <th class="sk-table-header">Status</th>
                  <th class="sk-table-header">Auditor</th>
                  <th class="sk-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.audits
                  .map(
                    (audit) => `
                  <tr class="sk-table-row">
                    <td class="sk-table-cell">${audit.date}</td>
                    <td class="py-3 px-4">
                      <div>
                        <p class="font-medium text-gray-900">${
                          audit.itemName
                        }</p>
                        <p class="text-xs text-gray-600">${audit.sku}</p>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-900 font-medium">${
                      audit.physicalCount
                    }</td>
                    <td class="py-3 px-4 text-gray-900 font-medium">${
                      audit.systemCount
                    }</td>
                    <td class="py-3 px-4">
                      <span class="font-bold ${
                        audit.discrepancy < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }">
                        ${audit.discrepancy > 0 ? "+" : ""}${audit.discrepancy}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(
                        audit.status
                      )}">
                        ${
                          audit.status.charAt(0).toUpperCase() +
                          audit.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="sk-table-cell">${audit.auditor}</td>
                    <td class="py-3 px-4">
                      <button class="text-purple-600 hover:text-purple-800 font-medium text-sm">
                        Review
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

        <!-- Audit Instructions -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-purple-900 mb-1">Audit Best Practices</h5>
              <ul class="text-sm text-purple-800 space-y-1">
                <li>• Conduct regular audits to maintain inventory accuracy</li>
                <li>• Count items during low-activity periods for better accuracy</li>
                <li>• Document all discrepancies and investigate root causes</li>
                <li>• Use barcode scanning for faster and more accurate counts</li>
                <li>• Update system counts immediately after physical verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case "minor":
        return "sk-badge-yellow";
      case "major":
        return "sk-badge-red";
      case "resolved":
        return "sk-badge-green";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getStatIcon(icon, color) {
    const icons = {
      "check-circle": `<svg class="w-8 h-8 ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      "alert-circle": `<svg class="w-8 h-8 ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      "trending-up": `<svg class="w-8 h-8 ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>`,
    };
    return icons[icon] || "";
  }
}

export async function renderStockKeeperDashboard(container) {
  window.stockKeeperDashboard = new StockKeeperDashboard(container);
  await window.stockKeeperDashboard.render();
}
