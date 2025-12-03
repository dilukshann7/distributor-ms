import { getIconHTML } from "../../../assets/icons/index.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { Payment } from "../../models/Payment.js";

export class PaymentCollection {
  constructor(container) {
    this.container = container;
    this.payments = [];
    this.orders = [];
    this.getSalesOrder();
    this.getPayments();
  }

  async getSalesOrder() {
    try {
      const response = await SalesOrder.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  async getPayments() {
    try {
      const response = await Payment.getAll();
      this.payments = response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      this.payments = [];
    }
  }

  async recordPayment() {
    const orderId = document.getElementById("payment-order-id").value;
    const amount = document.getElementById("payment-amount").value;
    const method = document.getElementById("payment-method").value;

    if (!orderId || !amount || !method) {
      alert("Please fill in all fields");
      return;
    }

    const paymentData = {
      salesOrderId: Number(orderId),
      amount: parseFloat(amount),
      paymentMethod: method,
      paymentDate: new Date().toISOString(),
    };

    try {
      await Payment.create(paymentData);
      await this.getPayments();
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment");
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="driver-title">Payment Collection</h3>
          <p class="driver-subtitle">Record and manage cash-on-delivery payments</p>
        </div>

        <div class="driver-panel p-6">
          <h4 class="driver-card-title mb-4">Quick Payment Entry</h4>
          <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="driver-label-text">Order ID</label>
              <select id="payment-order-id" class="driver-input">
                <option value="">Select Order</option>
                ${this.orders
                  .map(
                    (order) =>
                      `<option value="${order.id}">${
                        order.orderNumber + " - " + order.customerName
                      }</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div>
              <label class="driver-label-text">Amount</label>
              <input id="payment-amount" type="number" placeholder="Enter amount" class="driver-input" />
            </div>
            <div>
              <label class="driver-label-text">Payment Method</label>
              <select id="payment-method" class="driver-input">
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Mobile Payment">Mobile Payment</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>
          <button onclick="window.driverDashboard.recordPayment()" class="driver-btn-primary driver-btn-action w-full">
            <div class="w-5 h-5">${getIconHTML("plus")}</div>
            Record Payment
          </button>
        </div>

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
                      new Date(payment.collectedAt).toLocaleDateString() ||
                      "N/A"
                    }</td>
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
