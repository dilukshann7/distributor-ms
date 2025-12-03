import { SalesInvoice } from "../../models/SalesInvoice.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class PaymentCollection {
  constructor(container) {
    this.container = container;
    this.payments = [];
  }

  async getPayments() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await SalesInvoice.findById(id);
      this.payments = response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      this.payments = [];
    }
  }

  render() {
    if (!Array.isArray(this.payments)) {
      this.payments = [];
    }

    return `
      <div class="space-y-6">
        <div>
          <h3 class="driver-title">Payment Collection</h3>
          <p class="driver-subtitle">Record and manage cash-on-delivery payments</p>
        </div>

        <!-- Payment Collection Form -->
        <div class="driver-panel p-6">
          <h4 class="driver-card-title mb-4">Quick Payment Entry</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="driver-label-text">Order ID</label>
              <input type="text" placeholder="Enter order ID" class="driver-input" />
            </div>
            <div>
              <label class="driver-label-text">Amount</label>
              <input type="number" placeholder="Enter amount" class="driver-input" />
            </div>
            <div>
              <label class="driver-label-text">Payment Method</label>
              <select class="driver-input">
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile Payment</option>
                <option>Check</option>
              </select>
            </div>
          </div>
          <button class="driver-btn-primary driver-btn-action w-full">
            <div class="w-5 h-5">${getIconHTML("plus")}</div>
            Record Payment
          </button>
        </div>

        <!-- Payment List -->
        <div class="driver-panel">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Today's Payments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="driver-table-th">Payment ID</th>
                  <th class="driver-table-th">Order ID</th>
                  <th class="driver-table-th">Customer</th>
                  <th class="driver-table-th">Amount</th>
                  <th class="driver-table-th">Method</th>
                  <th class="driver-table-th">Time</th>
                  <th class="driver-table-th">Status</th>
                  <th class="driver-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .filter((payment) => payment && payment.salesOrder)
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="driver-table-td font-semibold">${
                      payment.id || "N/A"
                    }</td>
                    <td class="driver-table-td text-green-600 font-medium">${
                      payment.salesOrder?.orderNumber || "N/A"
                    }</td>
                    <td class="driver-table-td">${
                      payment.salesOrder?.customerName || "N/A"
                    }</td>
                    <td class="driver-table-td font-bold">Rs. ${
                      payment.salesOrder?.totalAmount?.toFixed(2) || "0.00"
                    }</td>
                    <td class="driver-table-td text-gray-600 capitalize">${
                      payment.paymentMethod || "N/A"
                    }</td>
                    <td class="driver-table-td text-gray-600">${
                      payment.collectedAt || "N/A"
                    }</td>
                    <td class="px-6 py-4">
                      <span class="driver-badge ${
                        payment.salesOrder?.status === "confirmed"
                          ? "driver-badge-completed"
                          : "driver-badge-pending"
                      }">
                       ${
                         payment.salesOrder?.status?.toLowerCase() ===
                         "confirmed"
                           ? "Confirmed"
                           : "Pending"
                       }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.delivery.status === "pending"
                          ? `
                        <button class="text-green-600 hover:text-green-800 font-medium text-sm">Collect</button>
                      `
                          : `
                        <button class="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                      `
                      }
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
}
