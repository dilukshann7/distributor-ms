import logo from "../../assets/logo-tr.png";
import { Supply } from "../models/Supply.js";
import { Order } from "../models/Order.js";
import { Shipment } from "../models/Shipment.js";
import { Invoice } from "../models/Invoice.js";
import { getIconHTML } from "../../assets/icons/index.js";
import "../../css/supplier-style.css";
import axios from "axios";
import { Product } from "../models/Product.js";

class SupplierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: new PurchaseOrders(),
      products: new ProductCatalog(),
      shipments: new ShipmentTracking(),
      invoices: new InvoicesPayments(),
      analytics: new SalesAnalytics(),
    };
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

    if (this.currentSection === "orders") {
    }
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

  renderSidebar() {
    const menuItems = [
      { id: "orders", label: "Purchase Orders", icon: "shopping-bag" },
      { id: "products", label: "Product Catalog", icon: "package" },
      { id: "shipments", label: "Shipment Tracking", icon: "truck" },
      { id: "invoices", label: "Invoices & Payments", icon: "file-text" },
      { id: "analytics", label: "Sales Analytics", icon: "trending-up" },
    ];

    return `
      <aside class="fixed lg:relative w-64 h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${item.id}" class="nav-item ${
                this.currentSection === item.id
                  ? "nav-item-active"
                  : "nav-item-inactive"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-indigo-600">
          <div class="bg-indigo-600 rounded-lg p-4">
            <p class="text-sm text-indigo-100">Supplier Account</p>
            <p class="font-semibold text-white mt-1"></p>
          </div>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="section-header">Supplier Dashboard</h2>
          <p class="section-subtitle text-sm">Manage orders, inventory, and shipments</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative btn-icon">
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button id="logoutBtn" class="btn-icon">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sectionInstance = this.sections[section];
    if (section === "analytics") {
      await sectionInstance.getSalesData();
    } else if (section === "orders") {
      await sectionInstance.getOrders();
      await sectionInstance.getSummary();
    } else if (section === "products") {
      await sectionInstance.getSupply();
    } else if (section === "shipments") {
      await sectionInstance.getShipments();
    } else if (section === "invoices") {
      await sectionInstance.getInvoices();
    }
    return sectionInstance.render();
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const sectionInstance = this.sections[section];

    if (
      section === "products" ||
      section === "invoices" ||
      section === "analytics"
    ) {
      if (typeof sectionInstance.attachListeners === "function") {
        sectionInstance.attachListeners(this.container);
      }
    }

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "nav-item nav-item-active";
      } else {
        item.className = "nav-item nav-item-inactive";
      }
    });
  }
}

class PurchaseOrders {
  constructor() {
    this.orders = [];
    this.summary = [];
  }

  async getOrders() {
    try {
      const response = await Order.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  async getSummary() {
    try {
      const response = await Order.getSummary();
      this.summary = response.data;
    } catch (error) {
      console.error("Error fetching order summary:", error);
      this.summary = {};
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Purchase Orders</h3>
          <p class="section-subtitle">Manage purchase orders</p>
        </div>
        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Recent Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Order Date</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Total</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders
                  .map(
                    (order) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${order.id}</td>
                    <td class="table-cell">
                      ${new Date(order.orderDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell-bold">
                      ${order.items
                        .map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")}
                    </td>
                    <td class="table-cell">${order.totalAmount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "LKR",
                      }
                    )}</td>
                    <td class="table-cell">${
                      new Date(order.dueDate).toISOString().split("T")[0]
                    }</td>
                    <td class="table-cell">
                      <span class="status-badge ${this.getStatusColor(
                        order.dueDate
                      )}">
                        ${
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="table-cell gap-2">
                      <button class="btn-action text-blue-600" title="View">
                        ${getIconHTML("eye")}
                      </button>
                      <button class="btn-action text-green-600" title="Edit">
                        ${getIconHTML("edit")}
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
      </div>
    `;
  }

  getStatusColor(status) {
    const statusMap = {
      pending: "status-yellow",
      confirmed: "status-blue",
      shipped: "status-indigo",
      delivered: "status-green",
    };
    return statusMap[status] || "status-gray";
  }
}

class ProductCatalog {
  constructor() {
    this.products = [];
    this.view = "list";
  }

  async getSupply() {
    try {
      const response = await Supply.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching supplies:", error);
      this.products = [];
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
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="section-header">Product Catalog</h3>
            <p class="section-subtitle">Manage your product offerings</p>
          </div>
          <button id="addProductBtn" class="btn-primary flex items-center gap-2">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="card-container">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Product Name</th>
                  <th class="table-header">SKU</th>
                  <th class="table-header">Category</th>
                  <th class="table-header">Price</th>
                  <th class="table-header">Stock</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.products
                  .map(
                    (product) => `
                  <tr class="table-row">
                    <td class="table-cell-medium">${product.name}</td>
                    <td class="table-cell">${product.sku}</td>
                    <td class="table-cell">${product.category}</td>
                    <td class="table-cell-bold">Rs. ${product.price}</td>
                    <td class="table-cell">${product.stock} units</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        product.status === "In Stock"
                          ? "status-green"
                          : "status-yellow"
                      }">
                        ${product.status}
                      </span>
                    </td>
                    <td class="table-cell gap-2">
                      <button class="btn-action text-blue-600">
                        ${getIconHTML("edit")}
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
      </div>
    `;
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Add New Supply</h3>
            <p class="section-subtitle">Add a new item to your inventory</p>
          </div>
        </div>

        <form id="addSupplyForm" class="card-container">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Supply Name</label>
                  <input type="text" name="name" required class="input-field" placeholder="e.g. Office Paper A4">
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" name="sku" required class="input-field" placeholder="e.g. SUP-001">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Category <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="category" class="input-field" placeholder="e.g. Stationery">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("trending-up").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Pricing & Inventory
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Price (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2.5 text-gray-500 font-medium">Rs.</span>
                    <input type="number" name="price" required min="0" step="0.01" class="input-field pl-12" placeholder="0.00">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input type="number" name="stock" required min="0" step="1" class="input-field" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="input-field">
                    <option value="available" selected>Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="backorder">Backorder</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" id="cancelSupplyBtn" class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Save Supply
            </button>
          </div>
        </form>
      </div>
    `;
  }

  attachListeners(container) {
    const addBtn = container.querySelector("#addProductBtn");
    const cancelBtn = container.querySelector("#cancelSupplyBtn");
    const cancelBtnFooter = container.querySelector("#cancelSupplyBtn");
    const form = container.querySelector("#addSupplyForm");

    const switchToAdd = () => {
      this.view = "add";
      this.refresh(container);
    };

    const switchToList = () => {
      this.view = "list";
      this.refresh(container);
    };

    const submitForm = (e) => {
      e.preventDefault();
      const form = e.target; // Get the form element from the event
      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData.entries());

      const productData = {
        ...rawData,
        stock: parseInt(rawData.stock, 10),
        price: parseFloat(rawData.price),
      };

      Supply.create(productData)
        .then(() => {
          switchToList();
        })
        .catch((error) => {
          console.error("Error creating supply:", error);
        });
    };

    if (addBtn) addBtn.addEventListener("click", switchToAdd);
    if (cancelBtn) cancelBtn.addEventListener("click", switchToList);
    if (cancelBtnFooter)
      cancelBtnFooter.addEventListener("click", switchToList);
    if (form) form.addEventListener("submit", submitForm);
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      this.attachListeners(container);
    }
  }
}

class ShipmentTracking {
  constructor() {
    this.shipments = [];
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = response.data;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = [];
    }
  }

  render() {
    const preparingCount = this.shipments.filter(
      (s) => s.status === "pending"
    ).length;
    const inTransitCount = this.shipments.filter(
      (s) => s.status === "in-transit"
    ).length;
    const deliveredCount = this.shipments.filter(
      (s) => s.status === "delivered"
    ).length;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Shipment Tracking</h3>
          <p class="section-subtitle">Track all shipments and delivery status</p>
        </div>

        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Active Shipments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Shipment ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Carrier</th>
                  <th class="table-header">Est. Delivery</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.shipments
                  .map(
                    (shipment) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${shipment.id}</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${
                      shipment.purchaseOrderId
                    }</td>
                    <td class="table-cell">
                      ${shipment.order.items
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ")}
                    </td>
                    <td class="table-cell">${shipment.carrier}</td>
                    <td class="table-cell">${shipment.expectedDeliveryDate}</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        shipment.status === "delivered"
                          ? "status-green"
                          : shipment.status === "in-transit"
                          ? "status-blue"
                          : "status-yellow"
                      }">
                        ${
                          shipment.status === "delivered"
                            ? "Delivered"
                            : shipment.status === "in-transit"
                            ? "In Transit"
                            : "Preparing"
                        }
                      </span>
                    </td>
                    <td class="table-cell">
                      <button class="text-indigo-600 hover:text-indigo-800 font-medium" title="Track">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
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
      </div>
    `;
  }
}

class InvoicesPayments {
  constructor() {
    this.invoices = [];
    this.orders = [];
    this.view = "list";
  }

  async getInvoices() {
    try {
      const response = await Invoice.getAll();
      this.invoices = response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      this.invoices = [];
    }
  }

  async getOrders() {
    try {
      const response = await Order.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  render() {
    if (this.view === "create") {
      return this.renderCreateForm();
    }
    return this.renderList();
  }

  renderList() {
    const totalInvoices = this.invoices.reduce(
      (sum, inv) => sum + inv.totalAmount,
      0
    );
    const paidAmount = this.invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = this.invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const overdueAmount = this.invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Invoices & Payments</h3>
          <p class="section-subtitle">Manage invoices and payment records</p>
        </div>

        <div class="card-container">
          <div class="card-header flex items-center justify-between">
            <h3 class="card-title">Invoice History</h3>
            <button id="generateInvoiceBtn" class="btn-primary flex items-center gap-2 text-sm font-medium">
              ${getIconHTML("plus")}
              Generate Invoice
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Invoice ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Issue Date</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.invoices
                  .map(
                    (invoice) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${invoice.id}</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${
                      invoice.purchaseOrderId
                    }</td>
                    <td class="table-cell-bold">Rs. ${invoice.totalAmount}</td>
                    <td class="table-cell">
                      ${
                        new Date(invoice.invoiceDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td class="table-cell">
                      ${new Date(invoice.dueDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        invoice.status === "paid"
                          ? "status-green"
                          : invoice.status === "pending"
                          ? "status-yellow"
                          : "status-red"
                      }">
                        ${
                          invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="table-cell">
                      <div class="flex items-center gap-2">
                        <button class="text-indigo-600 hover:text-indigo-800 transition-colors" title="View">
                          ${getIconHTML("eye")}
                        </button>
                        <button class="text-blue-600 hover:text-blue-800 transition-colors" title="Download">
                          ${getIconHTML("download")}
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

  renderCreateForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Generate Invoice</h3>
            <p class="section-subtitle">Create a new invoice record</p>
          </div>
        </div>

        <form id="createInvoiceForm" class="card-container">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("hash").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                References & IDs
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Invoice Number</label>
                  <input type="text" name="invoiceNumber" required class="input-field" placeholder="e.g. INV-2023-001">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Purchase Order</label>
                  <select name="purchaseOrderId" required class="input-field">
                    <option value="">-- Select Purchase Order --</option>
                    ${this.orders
                      .map(
                        (order) => `
                      <option value="${order.id}">
                        Order #${order.id} - Rs. ${order.totalAmount} (${order.status})
                      </option>
                    `
                      )
                      .join("")}
                  </select>
                  <p class="text-xs text-gray-500">Select from existing purchase orders</p>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Supplier ID</label>
                  <input type="number" name="supplierId" required class="input-field" placeholder="e.g. 50">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("calendar").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Dates & Financials
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Invoice Date</label>
                  <input type="date" name="invoiceDate" required class="input-field">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Due Date</label>
                  <input type="date" name="dueDate" required class="input-field">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Total Amount (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2.5 text-gray-500 font-medium">Rs.</span>
                    <input type="number" name="totalAmount" required min="0" step="0.01" class="input-field pl-12" placeholder="0.00">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Paid Amount <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-2.5 text-gray-500 font-medium">Rs.</span>
                    <input type="number" name="paidAmount" min="0" step="0.01" class="input-field pl-12" placeholder="0.00">
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("file-text").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="input-field">
                    <option value="pending" selected>Pending</option>
                    <option value="draft">Draft</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Notes / Terms</label>
                  <textarea name="notes" rows="3" class="input-field" placeholder="Enter payment terms or additional notes..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" id="cancelInvoiceBtn" class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    `;
  }
  attachListeners(container) {
    const addBtn = container.querySelector("#generateInvoiceBtn");
    const cancelBtn = container.querySelector("#cancelInvoiceBtn");
    const cancelBtnFooter = container.querySelector("#cancelInvoiceBtnFooter");
    const form = container.querySelector("#createInvoiceForm");

    const switchToAdd = async () => {
      this.view = "create";
      await this.getOrders();
      this.refresh(container);
    };

    const switchToList = () => {
      this.view = "list";
      this.refresh(container);
    };

    const submitForm = (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData.entries());

      const invoiceData = {
        invoiceNumber: rawData.invoiceNumber,
        status: rawData.status,
        notes: rawData.notes || null, // Convert empty string to null

        purchaseOrderId: parseInt(rawData.purchaseOrderId, 10),
        supplierId: parseInt(rawData.supplierId, 10),

        totalAmount: parseFloat(rawData.totalAmount),
        paidAmount: rawData.paidAmount ? parseFloat(rawData.paidAmount) : null,

        invoiceDate: new Date(rawData.invoiceDate),
        dueDate: new Date(rawData.dueDate),
      };

      Invoice.create(invoiceData)
        .then(() => {
          switchToList();
        })
        .catch((error) => {
          console.error("Error creating invoice:", error);
        });
    };

    if (addBtn) addBtn.addEventListener("click", switchToAdd);
    if (cancelBtn) cancelBtn.addEventListener("click", switchToList);
    if (cancelBtnFooter)
      cancelBtnFooter.addEventListener("click", switchToList);
    if (form) form.addEventListener("submit", submitForm);
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      this.attachListeners(container);
    }
  }
}

class SalesAnalytics {
  constructor() {
    this.topProducts = [];
    this.salesData = [];
    this.summary = [];
  }

  async getTopProducts() {
    try {
      const response = await Supply.getMostStocked(3);
      this.topProducts = response.data;
    } catch (error) {
      console.error("Error fetching top products:", error);
      this.topProducts = [];
    }
  }

  async getSalesData() {
    try {
      const response = await Order.getDailyOrders();
      const dailyOrders = response.data;

      const weeklyResponse = await Order.getWeeklyOrders();
      const weeklyOrders = weeklyResponse.data;

      const monthlyResponse = await Order.getMonthlyOrders();
      const monthlyOrders = monthlyResponse.data;
      this.salesData = {
        daily: dailyOrders,
        weekly: weeklyOrders,
        monthly: monthlyOrders,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
      this.salesData = {
        daily: { orders: 0, revenue: 0, items: 0 },
        weekly: { orders: 0, revenue: 0, items: 0 },
        monthly: { orders: 0, revenue: 0, items: 0 },
      };
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Sales Analytics</h3>
          <p class="section-subtitle">View sales performance and trends</p>
        </div>

        <!-- Period Selector -->
        <div class="card-container">
          <div class="p-6">
            <div class="flex gap-2 mb-6">
              <button class="period-selector period-selector-active">Daily</button>
              <button class="period-selector period-selector-inactive">Weekly</button>
              <button class="period-selector period-selector-inactive">Monthly</button>
            </div>

            <!-- Sales Stats -->
            <div class="stats">
              Please Wait...
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="card-container">
          <div class="p-6">
            <h4 class="card-title mb-4">Export Analytics</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Export to PDF
              </button>
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export to Excel
              </button>
              <button class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachListeners(container) {
    const periodSelectors = container.querySelectorAll(".period-selector");
    if (periodSelectors.length > 0) {
      periodSelectors.forEach((btn) => {
        if (btn.textContent.trim() === "Daily") {
          btn.className = "period-selector period-selector-active";
        } else {
          btn.className = "period-selector period-selector-inactive";
        }
      });

      this.handlePeriodChange("daily", container).catch((e) =>
        console.error("Error initializing analytics:", e)
      );

      periodSelectors.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const periodText = button.textContent.trim();

          periodSelectors.forEach((btn) => {
            btn.className = "period-selector period-selector-inactive";
          });

          button.className = "period-selector period-selector-active";

          if (periodText === "Daily") {
            await this.handlePeriodChange("daily", container);
          } else if (periodText === "Weekly") {
            await this.handlePeriodChange("weekly", container);
          } else if (periodText === "Monthly") {
            await this.handlePeriodChange("monthly", container);
          }
        });
      });
    }
  }

  async handlePeriodChange(period, container) {
    const statSelector = container.querySelector(".stats");
    const apiURL = "http://localhost:3000/api/supplier/overall-summary";
    const summary = await axios.get(apiURL);

    this.period = period;
    const periodLabel =
      period === "daily"
        ? "Today"
        : period === "weekly"
        ? "This Week"
        : "This Month";
    const data = summary.data[period];

    statSelector.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="analytics-card-blue">
          <p class="text-gray-700 text-sm font-medium">Total Orders</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">${data.orders}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-green">
          <p class="text-gray-700 text-sm font-medium">Revenue</p>
          <p class="text-3xl font-bold text-green-600 mt-2">${data.revenue}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-indigo">
          <p class="text-gray-700 text-sm font-medium">Items Sold</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">${data.items}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>
      </div>
    `;
  }
}

export async function renderSupplierDashboard(container) {
  const dashboard = new SupplierDashboard(container);
  await dashboard.render();
}
