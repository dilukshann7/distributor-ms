import { Driver } from "../../models/Drivers.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class DeliveryDetails {
  constructor() {
    this.deliveries = [];
  }

  async getDeliveries() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      console.log(response.data);
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    if (
      !this.deliveries ||
      !this.deliveries.deliveries ||
      !Array.isArray(this.deliveries.deliveries)
    ) {
      return `<p class="text-gray-600">No deliveries found for this driver.</p>`;
    }

    return `
    <div class="space-y-6">
      <div>
        <h2 class="driver-title mb-2">Today's Deliveries</h2>
        <p class="driver-subtitle">View and manage all delivery details for today</p>
      </div>

      <div class="grid gap-4">
        ${this.deliveries.deliveries
          .map((delivery) => {
            // Concatenate all sales order items
            const items =
              delivery.salesOrders
                .flatMap((so) => so.items || [])
                .map((item) => `${item.name} (x${item.quantity})`)
                .join(", ") || "No items";

            return `
              <div class="driver-card">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="driver-card-title">Delivery #${
                      delivery.deliveryNumber
                    }</h3>
                    <p class="driver-label">ID: ${delivery.id}</p>
                  </div>
                  <span class="driver-badge ${
                    delivery.status === "pending"
                      ? "driver-badge-pending"
                      : "driver-badge-transit"
                  }">
                    ${delivery.status === "pending" ? "Pending" : "In Transit"}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="flex items-start gap-3">
                    <div class="w-4 h-4 text-green-600 mt-1 flex-shrink-0">${getIconHTML(
                      "map-pin"
                    )}</div>
                    <div>
                      <p class="driver-label">Address</p>
                      <p class="driver-value">${delivery.deliveryAddress}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-4 h-4 text-green-600 mt-1 flex-shrink-0">${getIconHTML(
                      "phone"
                    )}</div>
                    <div>
                      <p class="driver-label">Contact</p>
                      <p class="driver-value">${
                        delivery.salesOrders[0].customer.phone || "N/A"
                      }</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-4 h-4 text-green-600 mt-1 flex-shrink-0">${getIconHTML(
                      "package"
                    )}</div>
                    <div>
                      <p class="driver-label">Items</p>
                      <p class="driver-value">${items}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-4 h-4 text-green-600 mt-1 flex-shrink-0">${getIconHTML(
                      "clock"
                    )}</div>
                    <div>
                      <p class="driver-label">Scheduled Time</p>
                      <p class="driver-value">${new Date(
                        delivery.scheduledDate
                      ).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button class="driver-btn-primary driver-btn-full">
                  View Details
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  }
}
