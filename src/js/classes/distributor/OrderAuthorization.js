import { SalesOrder } from "../../models/SalesOrder.js";

export class OrderAuthorization {
  constructor(container) {
    this.container = container;
    this.pendingOrders = [];
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

  approveOrder(orderId) {
    if (confirm("Approve this order?")) {
      const orderData = {
        status: "processing",
      };

      SalesOrder.update(orderId, orderData)
        .then(() => {
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

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Order Authorization</h3>
          <p class="text-gray-600 mt-1">Authorize and approve pending orders</p>
        </div>

        <!-- Pending Orders -->
        <div class="dist-card">
          
          <div class="divide-y divide-gray-200">
            ${this.pendingOrders
              .map(
                (order) => `
              <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${
                        order.orderNumber
                      }</h4>
                      
                      </span>
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

                <div class="flex gap-3">
                  <button class="approve-order-btn flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2" onclick="window.distributorDashboard.sections.authorization.approveOrder('${
                    order.id
                  }')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Approve
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
              .join("")}
          </div>
        </div>

        
      </div>
    `;
  }
}
