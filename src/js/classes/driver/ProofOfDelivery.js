import { LitElement, html } from "lit";
import { Driver } from "../../models/Driver.js";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Delivery } from "../../models/Delivery.js";
import { Feedback } from "../../models/Feedback.js";
import { SalesOrder } from "../../models/SalesOrder.js";

export class ProofOfDelivery extends LitElement {
  static properties = {
    deliveries: { type: Object },
    driverId: { type: String },
  };

  constructor() {
    super();
    this.deliveries = null;
    this.driverId = null;
    this.getProofDeliveries();
  }

  createRenderRoot() {
    return this;
  }

  async getProofDeliveries() {
    try {
      this.driverId = window.location.search.split("id=")[1];
      const response = await Driver.findById(this.driverId);
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = null;
    }
  }

  async completeDelivery(deliveryId) {
    try {
      await Delivery.update(deliveryId, {
        status: "completed",
        deliveredDate: new Date(),
      });
      await SalesOrder.update(deliveryId, { status: "delivered" });
      
      const commentsInput = this.querySelector(`#feedback-${deliveryId}-comments`);
      const comments = commentsInput?.value;
      
      if (comments && comments.trim() !== "") {
        await Feedback.create({
          deliveryId: deliveryId,
          comments: comments,
          customerId: this.deliveries.driverId,
        });
      }
      await this.getProofDeliveries();
    } catch (error) {
      console.error("Error completing delivery:", error);
    }
  }

  render() {
    if (
      !this.deliveries ||
      !this.deliveries.deliveries ||
      !Array.isArray(this.deliveries.deliveries)
    ) {
      return html`
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
            <p class="text-gray-600 mt-1">Deliveries</p>
          </div>
          <p class="text-gray-600">No deliveries found for this driver.</p>
        </div>
      `;
    }

    return html`
      <div class="space-y-6">
        <div>
          <h3 class="driver-title">Proof of Delivery</h3>
          <p class="driver-subtitle">Deliveries</p>
        </div>

        <div class="space-y-4">
          ${this.deliveries.deliveries.map(
            (delivery) => html`
              <div class="driver-panel border ${delivery.status === "completed"
                ? "border-green-300"
                : delivery.status === "in-transit"
                ? "border-orange-300"
                : "border-gray-200"}">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div>
                    <h4 class="driver-card-title">${delivery.deliveryNumber}</h4>
                    <p class="text-sm text-gray-600">${delivery.deliveryAddress}</p>
                  </div>
                  <span class="driver-badge ${delivery.status === "completed"
                    ? "driver-badge-completed"
                    : delivery.status === "in-transit"
                    ? "driver-badge-transit-orange"
                    : "driver-badge-pending"}">
                    ${delivery.status === "completed"
                      ? "Completed"
                      : delivery.status === "in_transit"
                      ? "In Transit"
                      : "Pending"}
                  </span>
                </div>

                <div class="p-6">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p class="driver-label">Delivery ID</p>
                      <p class="text-sm font-semibold text-gray-900">${delivery.deliveryNumber}</p>
                    </div>
                    <div>
                      <p class="driver-label">Order ID</p>
                      <p class="text-sm font-semibold text-green-600">${delivery.id}</p>
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
                      <p class="text-sm font-semibold text-gray-900">${new Date(delivery.scheduledDate).toLocaleString()}</p>
                    </div>
                  </div>

                  ${delivery.status === "completed"
                    ? html`
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="w-5 h-5 text-green-600" .innerHTML=${getIconHTML("check-circle")}></div>
                            <p class="font-semibold text-green-900">Delivery Completed</p>
                          </div>
                        </div>
                      `
                    : html`
                        <div class="space-y-4 mb-5">
                          <input 
                            type="text" 
                            id="feedback-${delivery.id}-comments" 
                            placeholder="Comments" 
                            class="driver-input w-full" 
                          />
                        </div>

                        <div class="space-y-4">
                          <button 
                            @click=${() => this.completeDelivery(delivery.id)} 
                            class="driver-btn-primary driver-btn-action w-full">
                            <div class="w-5 h-5" .innerHTML=${getIconHTML("check")}></div>
                            Complete Delivery
                          </button>
                        </div>
                      `}
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("proof-of-delivery-driver", ProofOfDelivery);
