import { Payment } from "../../models/Payment.js";

export class PaymentVerification {
  constructor(container) {
    this.container = container;
    this.payments = [];
    this.fetchPayments();
    window.paymentVerificationInstance = this;
  }

  async fetchPayments() {
    try {
      const response = await Payment.getAll();
      this.payments = response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }

  async acceptPayment(paymentId) {
    try {
      await Payment.update(paymentId, { status: "paid" });
      await this.fetchPayments();
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  }

  async rejectPayment(paymentId) {
    try {
      await Payment.update(paymentId, { status: "rejected" });
      await this.fetchPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  }

  render() {
    return `
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Payment Verification Workflow</h3>
            <p class="cashier-subtitle">Verify cash and check payments collected by sales team</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      payment.paymentMethod
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">$${payment.amount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.salesOrder.customerName
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${new Date(
                      payment.paymentDate
                    ).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        payment.salesOrder.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          payment.salesOrder.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                          payment.salesOrder.paymentStatus.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.salesOrder.paymentStatus === "unpaid"
                          ? `
                        <div class="flex gap-2">
                          <button 
                            onclick="this.acceptPayment(${payment.id})" 
                            class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                            Verify
                          </button>
                          <button onclick="this.rejectPayment(${payment.id})" class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      `
                          : ""
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
