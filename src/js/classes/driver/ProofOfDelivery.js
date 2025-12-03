import { Driver } from "../../models/Drivers.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class ProofOfDelivery {
  constructor(container) {
    this.container = container;
    this.deliveries = [];
    this.getProofDeliveries();
  }

  async getProofDeliveries() {
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
      return `
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
            <p class="text-gray-600 mt-1">Capture signatures and delivery confirmations</p>
          </div>
          <p class="text-gray-600">No deliveries found for this driver.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-6">
        <div>
          <h3 class="driver-title">Proof of Delivery</h3>
          <p class="driver-subtitle">Capture signatures and delivery confirmations</p>
        </div>

        <!-- Delivery Cards -->
        <div class="space-y-4">
          ${this.deliveries.deliveries
            .map(
              (delivery) => `
            <div class="driver-panel border ${
              delivery.status === "completed"
                ? "border-green-300"
                : delivery.status === "in-transit"
                ? "border-orange-300"
                : "border-gray-200"
            }">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h4 class="driver-card-title">${delivery.deliveryNumber}</h4>
                  <p class="text-sm text-gray-600">${
                    delivery.deliveryAddress
                  }</p>
                </div>
                <span class="driver-badge ${
                  delivery.status === "completed"
                    ? "driver-badge-completed"
                    : delivery.status === "in-transit"
                    ? "driver-badge-transit-orange"
                    : "driver-badge-pending"
                }">
                  ${
                    delivery.status === "completed"
                      ? "Completed"
                      : delivery.status === "in_transit"
                      ? "In Transit"
                      : "Pending"
                  }
                </span>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p class="driver-label">Delivery ID</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      delivery.deliveryNumber
                    }</p>
                  </div>
                  <div>
                    <p class="driver-label">Order ID</p>
                    <p class="text-sm font-semibold text-green-600">${
                      delivery.id
                    }</p>
                  </div>
                  <div>
                    <p class="driver-label">Items</p>
                    <p class="text-sm font-semibold text-gray-900">
                      ${delivery.salesOrders
                        .flatMap((order) => order.items || [])
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p class="driver-label">Delivery Time</p>
                    <p class="text-sm font-semibold text-gray-900">${new Date(
                      delivery.scheduledDate
                    ).toLocaleString()}</p>
                  </div>
                </div>

                ${
                  delivery.status === "completed"
                    ? `
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-5 h-5 text-green-600">${getIconHTML(
                        "check-circle"
                      )}</div>
                      <p class="font-semibold text-green-900">Delivery Completed</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p class="text-xs text-green-700">Signature Captured</p>
                        <p class="text-sm font-semibold text-green-900">${
                          delivery.signature
                        }</p>
                      </div>
                      <div>
                        <p class="text-xs text-green-700">Photo Evidence</p>
                        <p class="text-sm font-semibold text-green-900">${
                          delivery.hasPhoto ? "Yes ✓" : "No"
                        }</p>
                      </div>
                    </div>
                    ${
                      delivery.notes
                        ? `<p class="text-sm text-green-800 mt-3"><span class="font-semibold">Notes:</span> ${delivery.notes}</p>`
                        : ""
                    }
                  </div>
                `
                    : `
                  <!-- Upload Forms -->
                  <div class="space-y-4">
            
                    <!-- Delivery Notes -->
                    <div>
                      <label class="driver-label-text">Delivery Notes</label>
                      <textarea class="driver-input" rows="3" placeholder="Add any delivery notes or observations..."></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button class="driver-btn-primary driver-btn-action w-full">
                      <div class="w-5 h-5">${getIconHTML("check")}</div>
                      Complete Delivery
                    </button>
                  </div>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        
      </div>
    `;
  }
}
