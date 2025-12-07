import { Driver } from "../../models/Driver.js";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Delivery } from "../../models/Delivery.js";
import { Feedback } from "../../models/Feedback.js";
import { SalesOrder } from "../../models/SalesOrder.js";

export class ProofOfDelivery {
  constructor(container) {
    this.container = container;
    this.deliveries = [];
    this.feedbacks = [];
    this.getProofDeliveries();
    window.proofOfDelivery = this;
  }

  async getProofDeliveries() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await Driver.findById(id);
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  async completeDelivery(deliveryId) {
    try {
      await Delivery.update(deliveryId, {
        status: "completed",
        deliveredDate: new Date(),
      });
      await SalesOrder.update(deliveryId, { status: "delivered" });
      const comments = document.getElementById(
        `feedback-${deliveryId}-comments`
      ).value;
      if (comments && comments.trim() !== "") {
        await Feedback.create({
          deliveryId: deliveryId,
          comments: comments,
          customerId: this.deliveries.driverId,
        });
      }
      await this.refresh();
    } catch (error) {
      console.error("Error completing delivery:", error);
    }
  }

  async refresh() {
    await this.getProofDeliveries();
    const content = this.container.querySelector('.space-y-6');
    if (content) {
      content.outerHTML = this.render();
    } else {
      this.container.innerHTML = this.render();
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
            <p class="text-gray-600 mt-1">Deliveries</p>
          </div>
          <p class="text-gray-600">No deliveries found for this driver.</p>
        </div>
      `;
    }

    return `
      <div class="space-y-6">
        <div>
          <h3 class="driver-title">Proof of Delivery</h3>
          <p class="driver-subtitle">Deliveries</p>
        </div>

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
                  </div>
                `
                    : `
                    <div class="space-y-4 mb-5">
                      <input type="text" id="feedback-${
                        delivery.id
                      }-comments" placeholder="Comments" class="driver-input w-full" />
                    </div>

                  <div class="space-y-4">
                    <button onclick="window.proofOfDelivery.completeDelivery(${
                      delivery.id
                    })" class="driver-btn-primary driver-btn-action w-full">
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
