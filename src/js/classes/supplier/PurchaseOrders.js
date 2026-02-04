import { LitElement, html } from "lit";
import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { Shipment } from "../../models/Shipment.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class PurchaseOrders extends LitElement {
  static properties = {
    orders: { type: Array },
    summary: { type: Array },
    view: { type: String },
    editingOrder: { type: Object },
    convertingOrder: { type: Object },
  };

  constructor() {
    super();
    this.orders = [];
    this.summary = [];
    this.view = "list";
    this.editingOrder = null;
    this.convertingOrder = null;
    this.getOrders();
  }

  createRenderRoot() {
    return this;
  }

  async getOrders() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await PurchaseOrder.getAll();
      this.orders = response.data.filter((po) => po.supplierId === Number(id));
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  switchToEdit(orderId) {
    this.editingOrder = this.orders.find((o) => o.id === parseInt(orderId));
    this.view = "edit";
    this.requestUpdate();
  }

  switchToConvert(orderId) {
    this.convertingOrder = this.orders.find((o) => o.id === parseInt(orderId));
    this.view = "convert";
    this.requestUpdate();
  }

  switchToList() {
    this.view = "list";
    this.editingOrder = null;
    this.convertingOrder = null;
    this.requestUpdate();
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const orderData = {
      status: rawData.status,
    };

    PurchaseOrder.update(this.editingOrder.id, orderData)
      .then(() => {
        this.getOrders().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  }

  submitConvertForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const order = this.convertingOrder;

    const shipmentData = {
      shipmentNumber: formData.get("shipmentNumber"),
      purchaseOrderId: order.id,
      supplierId: order.supplierId,
      shipmentDate: new Date(formData.get("shipmentDate")).toISOString(),
      expectedDeliveryDate: new Date(
        formData.get("expectedDeliveryDate"),
      ).toISOString(),
      carrier: formData.get("carrier"),
      status: "pending",
      notes: formData.get("notes") || null,
    };

    Shipment.create(shipmentData)
      .then(() => {
        const orderUpdateData = {
          customerId: order.customerId,
          orderDate: order.order?.orderDate || order.orderDate,
          dueDate: order.dueDate,
          totalAmount: order.order?.totalAmount || order.totalAmount,
          status: "confirmed",
        };
        return PurchaseOrder.update(order.id, orderUpdateData);
      })
      .then(() => {
        this.getOrders().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error converting order to shipment:", error);
        alert("Failed to create shipment. Please try again.");
      });
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

  render() {
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    if (this.view === "convert") {
      return this.renderConvertForm();
    }
    return this.renderList();
  }

  renderList() {
    return html`
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
                ${this.orders.map(
                  (order) => html`
                    <tr class="table-row">
                      <td class="table-cell-bold">${order.id}</td>
                      <td class="table-cell">
                        ${order.order?.orderDate &&
                        !isNaN(new Date(order.order.orderDate))
                          ? new Date(order.order.orderDate)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>
                      <td class="table-cell-bold">
                        ${order.order?.items && Array.isArray(order.order.items)
                          ? order.order.items
                              .map((i) => `${i.name} (${i.quantity})`)
                              .join(", ")
                          : "No items"}
                      </td>
                      <td class="table-cell">
                        ${order.order?.totalAmount != null
                          ? order.order.totalAmount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "LKR",
                            })
                          : "N/A"}
                      </td>
                      <td class="table-cell">
                        ${order.dueDate && !isNaN(new Date(order.dueDate))
                          ? new Date(order.dueDate).toISOString().split("T")[0]
                          : "N/A"}
                      </td>
                      <td class="table-cell">
                        <span
                          class="status-badge ${order.order?.status
                            ? this.getStatusColor(order.order.status)
                            : "bg-gray-100 text-gray-800"}"
                        >
                          ${order.order?.status
                            ? order.order.status.charAt(0).toUpperCase() +
                              order.order.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td class="table-cell gap-2">
                        ${order.order?.status === "pending"
                          ? html`
                              <button
                                class="btn-action text-blue-600"
                                @click=${() => this.switchToConvert(order.id)}
                                title="Convert to Shipment"
                              >
                                <span .innerHTML=${getIconHTML("truck")}></span>
                              </button>
                            `
                          : ""}
                        <button
                          class="btn-action text-green-600 edit-order-btn"
                          @click=${() => this.switchToEdit(order.id)}
                          title="Edit"
                        >
                          <span .innerHTML=${getIconHTML("edit")}></span>
                        </button>
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderEditForm() {
    const order = this.editingOrder;
    if (!order) return this.renderList();

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Update Order Status</h3>
            <p class="section-subtitle">
              Change the status of this purchase order
            </p>
          </div>
        </div>

        <form
          id="editOrderForm"
          class="card-container"
          @submit=${this.submitEditForm}
        >
          <div class="p-8 space-y-8">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-blue-900 mb-2">
                Order Details
              </h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p>
                  <strong>Order Date:</strong>
                  ${order.order?.orderDate &&
                  !isNaN(new Date(order.order.orderDate))
                    ? new Date(order.order.orderDate)
                        .toISOString()
                        .split("T")[0]
                    : "N/A"}
                </p>
                <p>
                  <strong>Due Date:</strong>
                  ${order.dueDate && !isNaN(new Date(order.dueDate))
                    ? new Date(order.dueDate).toISOString().split("T")[0]
                    : "N/A"}
                </p>
                <p>
                  <strong>Total Amount:</strong>
                  ${order.order?.totalAmount != null
                    ? order.order.totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "LKR",
                      })
                    : "N/A"}
                </p>
                <p>
                  <strong>Items:</strong>
                  ${order.order?.items && Array.isArray(order.order.items)
                    ? order.order.items
                        .map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")
                    : "No items"}
                </p>
              </div>
            </div>

            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("shopping-bag")}
                ></span>
                Update Status
              </h4>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700"
                  >Order Status</label
                >
                <select name="status" class="input-field" required>
                  <option
                    value="pending"
                    ?selected=${order.order?.status === "pending"}
                  >
                    Pending
                  </option>
                  <option
                    value="confirmed"
                    ?selected=${order.order?.status === "confirmed"}
                  >
                    Confirmed
                  </option>
                  <option
                    value="shipped"
                    ?selected=${order.order?.status === "shipped"}
                  >
                    Shipped
                  </option>
                  <option
                    value="delivered"
                    ?selected=${order.order?.status === "delivered"}
                  >
                    Delivered
                  </option>
                  <option
                    value="cancelled"
                    ?selected=${order.order?.status === "cancelled"}
                  >
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.switchToList}
              class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              <span .innerHTML=${getIconHTML("check-circle")}></span>
              Update Status
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderConvertForm() {
    const order = this.convertingOrder;
    if (!order) return this.renderList();

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Convert Order to Shipment</h3>
            <p class="section-subtitle">Confirm order and create shipment</p>
          </div>
        </div>

        <form
          id="convertOrderForm"
          class="card-container"
          @submit=${this.submitConvertForm}
        >
          <div class="p-8 space-y-8">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-blue-900 mb-2">
                Order Details
              </h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p>
                  <strong>Order Date:</strong>
                  ${order.order?.orderDate &&
                  !isNaN(new Date(order.order.orderDate))
                    ? new Date(order.order.orderDate)
                        .toISOString()
                        .split("T")[0]
                    : "N/A"}
                </p>
                <p>
                  <strong>Total Amount:</strong>
                  ${order.order?.totalAmount != null
                    ? order.order.totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "LKR",
                      })
                    : "N/A"}
                </p>
                <p>
                  <strong>Items:</strong>
                  ${order.order?.items && Array.isArray(order.order.items)
                    ? order.order.items
                        .map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")
                    : "No items"}
                </p>
              </div>
            </div>

            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("truck")}
                ></span>
                Shipment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Shipment Number</label
                  >
                  <input
                    type="text"
                    name="shipmentNumber"
                    required
                    class="input-field"
                    placeholder="e.g. SHP-001"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Shipment Date</label
                  >
                  <input
                    type="date"
                    name="shipmentDate"
                    required
                    class="input-field"
                    value="${new Date().toISOString().split("T")[0]}"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Expected Delivery Date</label
                  >
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    required
                    class="input-field"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Carrier/Transport</label
                  >
                  <input
                    type="text"
                    name="carrier"
                    required
                    class="input-field"
                    placeholder="e.g. DHL, FedEx"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Notes
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="notes"
                    rows="3"
                    class="input-field"
                    placeholder="Additional notes about the shipment..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.switchToList}
              class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              <span .innerHTML=${getIconHTML("check-circle")}></span>
              Confirm & Create Shipment
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("purchase-orders", PurchaseOrders);
