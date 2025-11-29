import { SalesOrder } from "../../models/SalesOrder.js";
import { Driver } from "../../models/Drivers.js";

export class OrderAuthorization {
  constructor(container) {
    this.container = container;
    this.pendingOrders = [];
    this.drivers = [];
    this.selectedDrivers = {};
  }

  async getPendingOrders() {
    try {
      const response = await SalesOrder.getAll();
      this.pendingOrders = response.data.filter(
        (order) => order.status === "pending"
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
    } catch (error) {
      console.error("Error fetching drivers:", error);
      this.drivers = [];
    }
  }

  selectDriver(orderId, driverId) {
    this.selectedDrivers[orderId] = driverId;
  }

  approveOrder(orderId) {
    const driverId = this.selectedDrivers[orderId];
    
    if (!driverId) {
      alert("Please assign a driver before approving the order.");
      return;
    }

    if (confirm("Approve this order and assign to selected driver?")) {
      const orderData = {
        status: "processing",
        driverId: parseInt(driverId),
      };

      SalesOrder.update(orderId, orderData)
        .then(() => {
          delete this.selectedDrivers[orderId];
          this.getPendingOrders().then(() => this.refresh(this.container));
        })
        .catch((error) => {
          console.error("Error approving order:", error);
          alert("Error approving order. Please try again.");
        });
    }
  }

  rejectOrder(orderId) {
    if (
      confirm("Reject and delete this order? This action cannot be undone.")
    ) {
      SalesOrder.delete(orderId)
        .then(() => {
          this.getPendingOrders().then(() => this.refresh(this.container));
        })
        .catch((error) => {
          console.error("Error rejecting order:", error);
          alert("Error rejecting order. Please try again.");
        });
    }
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }

  getDriverOrders(driverId) {
    return this.pendingOrders.filter(
      (order) => this.selectedDrivers[order.id] === String(driverId)
    );
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Order Authorization</h3>
          <p class="text-gray-600 mt-1">Authorize and approve pending orders with driver assignment</p>
        </div>

        <!-- Pending Orders -->
        <div class="dist-card">
          <div class="divide-y divide-gray-200">
            ${
              this.pendingOrders.length === 0
                ? '<div class="p-6 text-center text-gray-500">No pending orders</div>'
                : this.pendingOrders
                    .map(
                      (order) => `
              <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${
                        order.orderNumber
                      }</h4>
                    </div>
                    <p class="text-sm font-medium text-gray-700">${
                      order.customerName
                    }</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Items</p>
                    <p class="text-sm font-semibold text-gray-900">
                      ${order.items
                        .map((item) => `${item.name} (${item.quantity})`)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Order Value</p>
                    <p class="text-sm font-semibold text-green-600">Rs. ${order.subtotal.toFixed(
                      2
                    )}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Requested By</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      order.customerName
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Request Date</p>
                    <p class="text-sm font-semibold text-gray-900">${new Date(
                      order.orderDate
                    ).toLocaleDateString()}</p>
                  </div>
                </div>

                <!-- Driver Assignment Section -->
                <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Assign Driver</label>
                  <select 
                    id="driver-select-${order.id}"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onchange="window.distributorDashboard.sections.authorization.selectDriver('${
                      order.id
                    }', this.value)"
                  >
                    <option value="">Select a driver...</option>
                    ${this.drivers
                      .map(
                        (driver) => `
                      <option value="${driver.id}" ${
                          this.selectedDrivers[order.id] === String(driver.id)
                            ? "selected"
                            : ""
                        }>
                        ${driver.user.name} - ${driver.vehicleType || "N/A"} (${
                          driver.vehicleId || "No Vehicle"
                        })
                      </option>
                    `
                      )
                      .join("")}
                  </select>
                  
                  ${
                    this.selectedDrivers[order.id]
                      ? `
                    <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                      ${this.renderDriverInfo(
                        this.drivers.find(
                          (d) =>
                            d.id === parseInt(this.selectedDrivers[order.id])
                        )
                      )}
                    </div>
                  `
                      : ""
                  }
                </div>

                <div class="flex gap-3">
                  <button class="approve-order-btn flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2" onclick="window.distributorDashboard.sections.authorization.approveOrder('${
                    order.id
                  }')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Approve & Assign
                  </button>
                  <button class="reject-order-btn flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2" onclick="window.distributorDashboard.sections.authorization.rejectOrder('${
                    order.id
                  }')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    Reject
                  </button>
                </div>
              </div>
            `
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
  }

  renderDriverInfo(driver) {
    if (!driver) return "";

    const assignedOrders = driver.deliveries
      ? driver.deliveries.reduce((count, delivery) => {
          return count + (delivery.salesOrders ? delivery.salesOrders.length : 0);
        }, 0)
      : 0;

    return `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-900">Driver Details</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-500">Name:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.user.name
            }</span>
          </div>
          <div>
            <span class="text-gray-500">Phone:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.user.phone || "N/A"
            }</span>
          </div>
          <div>
            <span class="text-gray-500">Vehicle:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.vehicleType || "N/A"
            } (${driver.vehicleId || "No ID"})</span>
          </div>
          <div>
            <span class="text-gray-500">License:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.licenseNumber || "N/A"
            }</span>
          </div>
          <div>
            <span class="text-gray-500">Location:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.currentLocation || "N/A"
            }</span>
          </div>
          <div>
            <span class="text-gray-500">Active Deliveries:</span>
            <span class="ml-2 font-medium text-gray-900">${
              driver.deliveries?.length || 0
            }</span>
          </div>
        </div>
        
        ${
          driver.deliveries && driver.deliveries.length > 0
            ? `
          <div class="mt-3 pt-3 border-t border-gray-200">
            <p class="text-xs font-semibold text-gray-700 mb-2">Current Deliveries:</p>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              ${driver.deliveries
                .map(
                  (delivery) => `
                <div class="text-xs bg-gray-50 p-2 rounded">
                  <div class="flex justify-between">
                    <span class="font-medium">${delivery.deliveryNumber}</span>
                    <span class="text-gray-500">${delivery.status}</span>
                  </div>
                  <div class="text-gray-600 mt-1">
                    <div>Scheduled: ${new Date(
                      delivery.scheduledDate
                    ).toLocaleDateString()}</div>
                    ${
                      delivery.salesOrders && delivery.salesOrders.length > 0
                        ? `<div>Orders: ${delivery.salesOrders
                            .map((so) => so.orderNumber)
                            .join(", ")}</div>`
                        : ""
                    }
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : '<p class="text-xs text-gray-500 mt-2">No active deliveries</p>'
        }
      </div>
    `;
  }
}
