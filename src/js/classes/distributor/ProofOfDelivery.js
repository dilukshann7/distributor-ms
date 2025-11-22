import { Delivery } from "../../models/Delivery.js";

export class ProofOfDelivery {
  constructor(container) {
    this.container = container;
    this.deliveries = [];
    this.view = "list";
    this.viewingDelivery = null;
  }

  async getDeliveries() {
    try {
      const response = await Delivery.getAll();
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    if (this.view === "details") {
      return this.renderDetails();
    }
    return this.renderList();
  }

  renderList() {
    const deliveredDeliveries = this.deliveries.filter(
      (d) => d.status === "delivered"
    );

    return `
    <div class="space-y-6">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
        <p class="text-gray-600 mt-1">Manage delivery confirmations</p>
      </div>

      <!-- Deliveries Table -->
      <div class="dist-card">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Delivered Records</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="dist-table-th">POD ID</th>
                <th class="dist-table-th">Order ID</th>
                <th class="dist-table-th">Customer</th>
                <th class="dist-table-th">Delivered By</th>
                <th class="dist-table-th">Date & Time</th>
                <th class="dist-table-th">Status</th>
                <th class="dist-table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${deliveredDeliveries
                .map(
                  (delivery) => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td class="dist-table-td text-sm font-semibold text-gray-900">${
                    delivery.deliveryNumber
                  }</td>
                  <td class="dist-table-td text-sm text-orange-600 font-medium">${
                    delivery.id
                  }</td>
                  <td class="dist-table-td">
                    <div>
                      <p class="text-sm font-medium text-gray-900">${
                        delivery.deliveryAddress
                      }</p>
                    </div>
                  </td>
                  <td class="dist-table-td text-sm text-gray-900">${
                    delivery.driver.name
                  }</td>
                  <td class="dist-table-td text-sm text-gray-600">${new Date(
                    delivery.deliveredDate
                  ).toLocaleDateString()}</td>
                  
                  <td class="dist-table-td">
                    <span class="dist-badge bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                  <td class="dist-table-td">
                    <button class="view-delivery-btn text-orange-600 hover:text-orange-800 font-medium text-sm" onclick="window.distributorDashboard.sections.delivery.switchToDetails('${
                      delivery.id
                    }')">View Details</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  }

  renderDetails() {
    const delivery = this.viewingDelivery;
    if (!delivery) return this.renderList();

    return `
      <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Delivery Details</h3>
            <p class="text-gray-600 mt-1">View proof of delivery information</p>
          </div>
          <button onclick="window.distributorDashboard.sections.delivery.switchToList()" class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to List
          </button>
        </div>

        <div class="dist-card">
          <div class="p-8 space-y-8">
            
            <!-- Delivery Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Delivery Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Delivery Number</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.deliveryNumber
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Status</p>
                  <span class="dist-badge bg-green-100 text-green-800 text-base px-4 py-2">
                    ${
                      delivery.status.charAt(0).toUpperCase() +
                      delivery.status.slice(1)
                    }
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Delivery Address</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.deliveryAddress
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Scheduled Date</p>
                  <p class="text-lg font-semibold text-gray-900">${new Date(
                    delivery.scheduledDate
                  ).toLocaleDateString()}</p>
                </div>
                ${
                  delivery.deliveredDate
                    ? `
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Delivered Date</p>
                  <p class="text-lg font-semibold text-gray-900">${new Date(
                    delivery.deliveredDate
                  ).toLocaleString()}</p>
                </div>
                `
                    : ""
                }
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Estimated Time</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.estimatedTime
                  } minutes</p>
                </div>
              </div>
            </div>

            <!-- Driver Information -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Driver Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Driver Name</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.name
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Vehicle ID</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.vehicleId
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Phone</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.phone
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.email
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">License Number</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.licenseNumber
                  }</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Vehicle Type</p>
                  <p class="text-lg font-semibold text-gray-900">${
                    delivery.driver.vehicleType
                  }</p>
                </div>
              </div>
            </div>

            <!-- Sales Orders -->
            ${
              delivery.salesOrders && delivery.salesOrders.length > 0
                ? `
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Sales Orders & Items
              </h4>
              <div class="space-y-4">
                ${delivery.salesOrders
                  .map(
                    (order) => `
                  <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <h5 class="font-semibold text-gray-900 text-lg">Order #${
                          order.orderNumber
                        }</h5>
                        <p class="text-sm text-gray-600 mt-1">${
                          order.customerName
                        }</p>
                      </div>
                      <div class="text-right">
                        <span class="dist-badge ${
                          order.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }">
                          ${
                            order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          }
                        </span>
                        <p class="text-sm text-gray-600 mt-1">Payment: <span class="font-medium ${
                          order.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }">${order.paymentStatus}</span></p>
                      </div>
                    </div>
                    
                    ${
                      order.items && order.items.length > 0
                        ? `
                    <div class="mt-4">
                      <h6 class="text-sm font-semibold text-gray-700 mb-3">Order Items:</h6>
                      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
                        <table class="w-full">
                          <thead class="bg-gray-50">
                            <tr>
                              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            ${order.items
                              .map(
                                (item) => `
                              <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm text-gray-900 font-medium">${
                                  item.name
                                }</td>
                                <td class="px-4 py-3 text-sm text-gray-600 text-right">Rs. ${item.price.toFixed(
                                  2
                                )}</td>
                                <td class="px-4 py-3 text-sm text-gray-900 text-center font-semibold">${
                                  item.quantity
                                }</td>
                                <td class="px-4 py-3 text-sm text-gray-900 text-right font-semibold">Rs. ${(
                                  item.price * item.quantity
                                ).toFixed(2)}</td>
                              </tr>
                            `
                              )
                              .join("")}
                          </tbody>
                          <tfoot class="bg-gray-50">
                            <tr>
                              <td colspan="3" class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Order Total:</td>
                              <td class="px-4 py-3 text-sm font-bold text-orange-600 text-right">Rs. ${order.subtotal.toFixed(
                                2
                              )}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    `
                        : '<p class="text-sm text-gray-600 mt-3">No items in this order</p>'
                    }
                    
                    ${
                      order.notes
                        ? `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <p class="text-xs font-semibold text-gray-700 mb-1">Order Notes:</p>
                      <p class="text-sm text-gray-600">${order.notes}</p>
                    </div>
                    `
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : `
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Sales Orders
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-600 text-center">No sales orders attached</p>
              </div>
            </div>
            `
            }

            <!-- Notes -->
            ${
              delivery.notes
                ? `
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                Notes
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-700">${delivery.notes}</p>
              </div>
            </div>
            `
                : ""
            }

          </div>
        </div>
      </div>
    `;
  }

  switchToDetails(deliveryId) {
    this.viewingDelivery = this.deliveries.find(
      (d) => d.id === parseInt(deliveryId)
    );
    this.view = "details";
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.viewingDelivery = null;
    this.refresh(this.container);
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
