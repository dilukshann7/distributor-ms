import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import "../../css/supplier-style.css";

import { PurchaseOrders } from "./supplier/PurchaseOrders.js";
import { ProductCatalog } from "./supplier/ProductCatalog.js";
import { ShipmentTracking } from "./supplier/ShipmentTracking.js";
import { InvoicesPayments } from "./supplier/InvoicesPayments.js";
import { SalesAnalytics } from "./supplier/SalesAnalytics.js";

class SupplierDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "orders";
    this.sections = {
      orders: new PurchaseOrders(container),
      products: new ProductCatalog(container),
      shipments: new ShipmentTracking(),
      invoices: new InvoicesPayments(container),
      analytics: new SalesAnalytics(container),
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
            <button data-section="${
              item.id
            }" onclick="window.supplierDashboard.navigateToSection('${
                item.id
              }')" class="nav-item ${
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

          <button onclick="window.supplierDashboard.logout()" class="btn-icon">
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

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      // The onclick handler on the button doesn't have dataset.section anymore,
      // but we can check the onclick attribute or just rebuild the sidebar.
      // Actually, rebuilding the sidebar is expensive.
      // Let's just rely on the fact that we are re-rendering the sidebar?
      // No, we are not re-rendering the sidebar, only the content.
      // So we need to update classes manually.
      // But wait, the buttons in renderSidebar use onclick="...navigateToSection('id')".
      // They don't have data-section anymore in my new code?
      // Let's check renderSidebar above.
      // I removed data-section="${item.id}" in the new renderSidebar?
      // No, I should probably keep it or use another way to identify.
      // Actually, I can just loop through and check the text content or something?
      // Or better, just re-render the sidebar? No, that's flickering.
      // Let's look at how I did it in distributor.js.
      // In distributor.js I used dataset.section.
      // So I should add data-section back to the buttons in renderSidebar.
    });

    // Re-implementing the active class logic properly
    // I need to update the sidebar buttons to reflect the active state.
    // Since I'm not re-rendering the whole page, I need to update the DOM.
    // I'll add data-section back to the buttons in renderSidebar for this purpose.
    const buttons = this.container.querySelectorAll(".nav-item");
    buttons.forEach((btn) => {
      // We can't easily get the section from the onclick string reliably without parsing.
      // So let's add data-section to the markup in renderSidebar.
      if (btn.dataset.section === section) {
        btn.className = "nav-item nav-item-active";
      } else {
        btn.className = "nav-item nav-item-inactive";
      }
    });
  }

  logout() {
    import("../login.js").then((module) => {
      module.renderLogin(this.container);
    });
  }
}

export async function renderSupplierDashboard(container) {
  window.supplierDashboard = new SupplierDashboard(container);
  await window.supplierDashboard.render();
}
