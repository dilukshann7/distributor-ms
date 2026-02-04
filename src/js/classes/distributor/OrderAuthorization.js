import { LitElement, html } from "lit";
import { SalesOrder } from "../../models/SalesOrder.js";
import { Driver } from "../../models/Driver.js";
import { Delivery } from "../../models/Delivery.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class OrderAuthorization extends LitElement {
  static properties = {
    pendingOrders: { type: Array },
    drivers: { type: Array },
    selectedDrivers: { type: Object },
  };

  constructor() {
    super();
    this.pendingOrders = [];
    this.drivers = [];
    this.selectedDrivers = {};
    this.getPendingOrders();
    this.getDrivers();
  }

  createRenderRoot() {
    return this;
  }

  async getPendingOrders() {
    try {
      const response = await SalesOrder.getAll();
      this.pendingOrders = response.data.filter(
        (order) => order.order?.status === "pending",
      );
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      this.pendingOrders = [];
    }
  }

  async getDrivers() {
    try {
      const response = await Driver.getAll();
      this.drivers = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching drivers:", error);
      this.drivers = [];
    }
  }

  handleDriverSelect(e, orderId) {
    const driverId = e.target.value;
    this.selectedDrivers = {
      ...this.selectedDrivers,
      [orderId]: driverId,
    };
    this.requestUpdate();
  }

  async approveOrder(orderId) {
    const driverId = this.selectedDrivers[orderId];

    if (!driverId) {
      alert("Please assign a driver before approving the order.");
      return;
    }

    if (confirm("Approve this order and assign to selected driver?")) {
      const order = this.pendingOrders.find((o) => o.id === parseInt(orderId));
      const driver = this.drivers.find((d) => d.id === parseInt(driverId));

      if (!order || !driver) {
        alert("Order or driver not found.");
        return;
      }

      const orderData = {
        status: "processing",
        driverId: parseInt(driverId),
      };

      try {
        await SalesOrder.update(orderId, orderData);
        delete this.selectedDrivers[orderId];

        const deliveryNumber = `DEL-${Date.now()}-${orderId}`;

        const deliveryAddress =
          order.order?.notes || `Delivery for ${order.customerName}`;

        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 1);

        const deliveryData = {
          deliveryNumber: deliveryNumber,
          driverId: parseInt(driverId),
          vehicleId: driver.vehicleId ? parseInt(driver.vehicleId) : 0,
          deliveryAddress: deliveryAddress,
          scheduledDate: scheduledDate.toISOString(),
          estimatedTime: 60, // Default 60 minutes
          status: "pending",
          notes: `Order ${order.order?.orderNumber || orderId} - ${order.customerName}`,
        };

        const deliveryResponse = await Delivery.create(deliveryData);
        const deliveryId = deliveryResponse.data.id;

        await SalesOrder.update(orderId, { deliveryId: deliveryId });
        await this.getPendingOrders();
      } catch (error) {
        console.error("Error processing order approval:", error);
        alert("Error processing order approval. Please try again.");
      }
    }
  }

  rejectOrder(orderId) {
    if (
      confirm("Reject and delete this order? This action cannot be undone.")
    ) {
      SalesOrder.delete(orderId)
        .then(() => {
          this.getPendingOrders();
        })
        .catch((error) => {
          console.error("Error rejecting order:", error);
          alert("Error rejecting order. Please try again.");
        });
    }
  }

  render() {
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Order Authorization</h3>
          <p class="text-gray-600 mt-1">
            Authorize and approve pending orders with driver assignment
          </p>
        </div>

        <div class="dist-card">
          <div class="divide-y divide-gray-200">
            ${this.pendingOrders.length === 0
              ? html`<div class="p-6 text-center text-gray-500">
                  No pending orders
                </div>`
              : this.pendingOrders.map(
                  (order) => html`
                    <div class="p-6 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                          <div class="flex items-center gap-3 mb-2">
                            <h4 class="text-lg font-semibold text-gray-900">
                              ${order.order?.orderNumber || "N/A"}
                            </h4>
                          </div>
                          <p class="text-sm font-medium text-gray-700">
                            ${order.customerName}
                          </p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p class="text-xs text-gray-500">Items</p>
                          <p class="text-sm font-semibold text-gray-900">
                            ${(order.order?.items || [])
                              .map((item) => `${item.name} (${item.quantity})`)
                              .join(", ") || "No items"}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Order Value</p>
                          <p class="text-sm font-semibold text-green-600">
                            Rs. ${(order.order?.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Requested By</p>
                          <p class="text-sm font-semibold text-gray-900">
                            ${order.customerName}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Request Date</p>
                          <p class="text-sm font-semibold text-gray-900">
                            ${new Date(
                              order.order?.orderDate || Date.now(),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div
                        class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <label
                          class="block text-sm font-semibold text-gray-900 mb-2"
                          >Assign Driver</label
                        >
                        <select
                          id="driver-select-${order.id}"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          @change=${(e) => this.handleDriverSelect(e, order.id)}
                        >
                          <option value="">Select a driver...</option>
                          ${this.drivers.map(
                            (driver) => html`
                              <option
                                value="${driver.id}"
                                ?selected=${this.selectedDrivers[order.id] ===
                                String(driver.id)}
                              >
                                ${driver.user.name} -
                                ${driver.vehicleType || "N/A"}
                                (${driver.vehicleId || "No Vehicle"})
                              </option>
                            `,
                          )}
                        </select>
                      </div>

                      <div class="flex gap-3">
                        <button
                          class="approve-order-btn flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          @click=${() => this.approveOrder(order.id)}
                        >
                          <span
                            .innerHTML=${getIconHTML("check-circle")}
                          ></span>
                          Approve & Assign
                        </button>
                        <button
                          class="reject-order-btn flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          @click=${() => this.rejectOrder(order.id)}
                        >
                          <span .innerHTML=${getIconHTML("x")}></span>
                          Reject
                        </button>
                      </div>
                    </div>
                  `,
                )}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("order-authorization", OrderAuthorization);
