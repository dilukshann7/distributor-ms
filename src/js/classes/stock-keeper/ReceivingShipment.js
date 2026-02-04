import { LitElement, html } from "lit";
import { Shipment } from "../../models/Shipment.js";
import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { Supplier } from "../../models/Supplier.js";
import { Supply } from "../../models/Supply.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class ReceivingShipment extends LitElement {
  static properties = {
    shipments: { type: Object },
    orders: { type: Array },
    activeTab: { type: String },
    view: { type: String },
    editingShipment: { type: Object },
    suppliers: { type: Array },
    products: { type: Array },
    tempItems: { type: Array },
    selectedSupplierId: { type: String },
  };

  constructor() {
    super();
    this.shipments = { in_transit: [], received: [] };
    this.orders = [];
    this.activeTab = "pending";
    this.view = "list";
    this.editingShipment = null;
    this.suppliers = [];
    this.products = [];
    this.tempItems = [];
    this.selectedSupplierId = "";
    this.getShipments();
    this.getOrders();
    this.loadSuppliers();
    this.loadSupply();
  }

  createRenderRoot() {
    return this;
  }

  async getOrders() {
    try {
      const response = await PurchaseOrder.getAll();
      this.orders =
        response.data.filter((po) => po.order?.status === "pending") || [];
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  async loadSuppliers() {
    try {
      const response = await Supplier.getAll();
      this.suppliers = response.data || [];
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading suppliers:", error);
      this.suppliers = [];
    }
  }

  async loadSupply() {
    try {
      const response = await Supply.getAll();
      this.products = response.data || [];
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
    }
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = {
        in_transit: response.data.filter(
          (s) => s.status === "in_transit" || s.status === "pending",
        ),
        received: response.data.filter((s) => s.status === "received"),
      };
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = { in_transit: [], received: [] };
    }
  }

  handleTabClick(tab) {
    this.activeTab = tab;
    this.requestUpdate();
  }

  // --- Item Management Methods ---

  handleSupplierChange(e) {
    this.selectedSupplierId = e.target.value;
    this.tempItems = []; // Clear items when supplier changes
    if (this.selectedSupplierId) {
      this.addItemRow(); // Add one initial row
    }
  }

  addItemRow() {
    this.tempItems = [
      ...this.tempItems,
      { productId: "", quantity: 1, price: 0 },
    ];
  }

  removeItemRow(index) {
    if (this.tempItems.length > 1) {
      this.tempItems = this.tempItems.filter((_, i) => i !== index);
    } else {
      alert("At least one item is required");
    }
  }

  handleItemProductChange(index, productId) {
    const product = this.products.find((p) => p.id === parseInt(productId));
    const newItems = [...this.tempItems];

    if (product) {
      newItems[index] = {
        ...newItems[index],
        productId: productId,
        price: product.price,
        name: product.name,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        productId: "",
        price: 0,
        name: "",
      };
    }

    this.tempItems = newItems;
  }

  handleItemQuantityChange(index, quantity) {
    const val = parseInt(quantity) || 0;
    const newItems = [...this.tempItems];
    newItems[index].quantity = val;
    this.tempItems = newItems;
  }

  get calculatedTotal() {
    return this.tempItems.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);
  }

  // --- Actions ---

  async markAsReceived(shipmentId) {
    if (!confirm("Mark this shipment as received?")) {
      return;
    }

    try {
      const shipmentData = {
        status: "received",
        actualDeliveryDate: new Date().toISOString(),
      };

      await Shipment.update(shipmentId, shipmentData);
      await this.getShipments();
      await this.getOrders();
      alert("Shipment marked as received successfully!");
    } catch (error) {
      console.error("Error marking shipment as received:", error);
      alert("Failed to update shipment. Please try again.");
    }
  }

  switchToAdd() {
    this.view = "add";
    this.editingShipment = null;
    this.selectedSupplierId = "";
    this.tempItems = [];
    this.requestUpdate();
  }

  switchToList() {
    this.view = "list";
    this.editingShipment = null;
    this.requestUpdate();
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const items = this.tempItems
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => {
        const product = this.products.find(
          (p) => p.id === parseInt(item.productId),
        );
        return {
          name: product ? product.name : "Unknown Product",
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        };
      });

    if (items.length === 0) {
      alert("Please add at least one valid item");
      return;
    }

    const orderData = {
      supplierId: parseInt(formData.get("supplierId")),
      orderNumber: `PO-${Date.now()}`,
      orderDate: new Date(formData.get("orderDate")).toISOString(),
      dueDate: new Date(formData.get("dueDate")).toISOString(),
      totalAmount: this.calculatedTotal,
      status: "pending",
      items: items,
    };

    PurchaseOrder.create(orderData)
      .then(() => {
        return Promise.all([this.getShipments(), this.getOrders()]);
      })
      .then(() => {
        this.switchToList();
      })
      .catch((error) => {
        console.error("Error creating purchase order:", error);
        alert("Failed to create purchase order. Please try again.");
      });
  }

  render() {
    if (this.view === "add") {
      return this.renderAddForm();
    }
    return this.renderList();
  }

  renderList() {
    return html`
      <div class="space-y-6 p-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Receiving & Shipment</h3>
            <p class="sk-text-muted">Track incoming and outgoing shipments</p>
          </div>
          <button @click=${this.switchToAdd} class="sk-btn-primary px-4">
            <span .innerHTML=${getIconHTML("plus")}></span>
            New Order
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200">
          <div class="flex border-b border-gray-200">
            ${[
              { id: "pending", label: "Pending", icon: "clock" },
              { id: "received", label: "Received", icon: "check-circle" },
              { id: "in_transit", label: "In Transit", icon: "alert-circle" },
            ].map(
              (tab) => html`
                <button
                  @click=${() => this.handleTabClick(tab.id)}
                  class="tab-btn flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${this
                    .activeTab === tab.id
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-800"}"
                >
                  <span .innerHTML=${getIconHTML(tab.icon)}></span>
                  ${tab.label}
                </button>
              `,
            )}
          </div>

          <div class="p-6 space-y-4" id="shipmentsContainer">
            ${this.renderShipments(this.activeTab)}
          </div>
        </div>
      </div>
    `;
  }

  renderShipments(period) {
    if (period === "pending") {
      return this.renderOrders();
    }

    const list = this.shipments[period] || [];
    if (list.length === 0) {
      return html`<div class="text-sm text-gray-600">
        No shipments found for ${period.replace("_", " ")}
      </div>`;
    }

    return list.map(
      (shipment) => html`
        <div
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">
                ${shipment.shipmentNumber}
              </h4>
              <p class="text-sm sk-text-muted">
                PO: ${shipment.purchaseOrderId}
              </p>
              <p class="text-sm text-gray-600">
                Items:
                ${shipment.order?.items
                  ?.filter((item) => item && item.name)
                  .map(
                    (item) =>
                      `${item.name}${
                        item.quantity ? ` (x${item.quantity})` : ""
                      }`,
                  )
                  .join(", ") || "No items"}
              </p>
              ${period === "in_transit"
                ? html`
                    <p class="text-sm text-gray-500 mt-1">
                      Expected:
                      ${new Date(
                        shipment.expectedDeliveryDate,
                      ).toLocaleDateString()}
                    </p>
                  `
                : ""}
            </div>
            <div class="text-right flex flex-col items-end gap-2">
              ${period === "received"
                ? html`<p class="text-sm text-green-600 font-medium">
                    Received:
                    ${new Date(
                      shipment.actualDeliveryDate,
                    ).toLocaleDateString()}
                  </p>`
                : html`<p class="text-sm text-indigo-600 font-medium">
                    Status: In Transit
                  </p>`}
              ${period === "in_transit"
                ? html`
                    <button
                      @click=${() => this.markAsReceived(shipment.id)}
                      class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <span
                        .innerHTML=${getIconHTML("check-circle").replace(
                          'class="w-5 h-5"',
                          'class="w-4 h-4"',
                        )}
                      ></span>
                      Mark as Received
                    </button>
                  `
                : ""}
            </div>
          </div>
        </div>
      `,
    );
  }

  renderOrders() {
    const list = this.orders || [];
    if (list.length === 0) {
      return html`<div class="text-sm text-gray-600">
        No pending orders found
      </div>`;
    }

    return list.map(
      (order) => html`
        <div
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">Order #${order.id}</h4>
              <p class="text-sm sk-text-muted">
                Order Date: ${new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p class="text-sm text-gray-600">
                Items:
                ${Array.isArray(order.items)
                  ? order.items
                      .filter((item) => item && item.name)
                      .map(
                        (item) =>
                          `${item.name}${
                            item.quantity ? ` (x${item.quantity})` : ""
                          }`,
                      )
                      .join(", ")
                  : "No items"}
              </p>
              <p class="text-sm text-gray-600">
                Total:
                ${order.totalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "LKR",
                })}
              </p>
            </div>
            <div class="text-right">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                Pending
              </span>
              <p class="text-sm text-gray-600 mt-2">
                Due: ${new Date(order.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      `,
    );
  }

  renderAddForm() {
    const availableProducts = this.selectedSupplierId
      ? this.products.filter(
          (p) => p.supplierId === parseInt(this.selectedSupplierId),
        )
      : [];

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">New Order Request</h3>
            <p class="sk-text-muted">Create a new order request for supplier</p>
          </div>
        </div>

        <form
          id="addShipmentForm"
          class="sk-card"
          @submit=${this.submitAddForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4 class="sk-subheader">
                <span
                  class="w-5 h-5 text-purple-600 block mr-2"
                  .innerHTML=${getIconHTML("clipboard-list")}
                ></span>
                Order Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Supplier</label>
                  <select
                    name="supplierId"
                    required
                    class="sk-input"
                    @change=${this.handleSupplierChange}
                    .value=${this.selectedSupplierId}
                  >
                    <option value="">Select Supplier</option>
                    ${this.suppliers.map(
                      (supplier) => html`
                        <option value="${supplier.id}">
                          ${supplier.companyName ||
                          supplier.user?.name ||
                          "Supplier " + supplier.id}
                        </option>
                      `,
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Order Date</label>
                  <input
                    type="date"
                    name="orderDate"
                    required
                    class="sk-input"
                    value="${new Date().toISOString().split("T")[0]}"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Due Date</label>
                  <input type="date" name="dueDate" required class="sk-input" />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Total Amount (LKR)</label>
                  <input
                    type="number"
                    name="totalAmount"
                    required
                    min="0"
                    step="0.01"
                    class="sk-input"
                    placeholder="Auto-calculated"
                    .value=${this.calculatedTotal.toFixed(2)}
                    readonly
                  />
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <span
                  class="w-5 h-5 text-purple-600 block mr-2"
                  .innerHTML=${getIconHTML("package")}
                ></span>
                Order Items
              </h4>
              <div class="space-y-4">
                <div id="itemsContainer">
                  ${this.tempItems.map(
                    (item, index) => html`
                      <div
                        class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 item-row sm-card-sub"
                      >
                        <div class="space-y-2">
                          <label class="sk-label">Product</label>
                          <select
                            required
                            class="sk-input product-select"
                            @change=${(e) =>
                              this.handleItemProductChange(
                                index,
                                e.target.value,
                              )}
                            .value=${item.productId}
                            ?disabled=${!this.selectedSupplierId}
                          >
                            <option value="">
                              ${this.selectedSupplierId
                                ? "Select product"
                                : "Select supplier first"}
                            </option>
                            ${availableProducts.map(
                              (p) => html`
                                <option value="${p.id}">${p.name}</option>
                              `,
                            )}
                          </select>
                        </div>
                        <div class="space-y-2">
                          <label class="sk-label">Quantity</label>
                          <input
                            type="number"
                            required
                            min="1"
                            class="sk-input item-quantity"
                            placeholder="e.g. 10"
                            @input=${(e) =>
                              this.handleItemQuantityChange(
                                index,
                                e.target.value,
                              )}
                            .value=${item.quantity}
                          />
                        </div>
                        <div class="space-y-2">
                          <label class="sk-label">Price (LKR)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            class="sk-input item-price"
                            placeholder="e.g. 100"
                            .value=${item.price}
                            readonly
                          />
                        </div>
                        <div class="space-y-2">
                          <label class="sk-label">Subtotal (LKR)</label>
                          <input
                            type="number"
                            class="sk-input item-subtotal"
                            placeholder="0.00"
                            .value=${(
                              (item.price || 0) * (item.quantity || 0)
                            ).toFixed(2)}
                            readonly
                          />
                        </div>
                        ${this.tempItems.length > 1
                          ? html`
                              <div class="col-span-full flex justify-end">
                                <button
                                  type="button"
                                  class="text-red-500 text-sm hover:text-red-700"
                                  @click=${() => this.removeItemRow(index)}
                                >
                                  Remove Item
                                </button>
                              </div>
                            `
                          : ""}
                      </div>
                    `,
                  )}
                </div>
                <button
                  type="button"
                  @click=${this.addItemRow}
                  class="sk-btn-secondary text-sm"
                  ?disabled=${!this.selectedSupplierId}
                >
                  <span .innerHTML=${getIconHTML("plus")}></span>
                  Add Another Item
                </button>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.switchToList}
              class="sk-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <span .innerHTML=${getIconHTML("check-circle")}></span>
              Create Order
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("receiving-shipment", ReceivingShipment);
