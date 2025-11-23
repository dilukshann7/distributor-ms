import { Shipment } from "../../models/Shipment.js";

export class ReceivingShipment {
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
