import { getIconHTML } from "../../../assets/icons/index.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { Payment } from "../../models/Payment.js";

export class PaymentCollection {
  constructor(container, parentDashboard) {
    this.container = container;
    this.parentDashboard = parentDashboard;
    this.payments = [];
    this.orders = [];
    this.getSalesOrder();
    this.getPayments();
    window.paymentCollection = this;
    window.addEventListener("load", () => {
      this.attachEventListeners();
    });
  }

  async attachEventListeners() {
    const recordButton = this.container.querySelector(".driver-btn-action");
    if (recordButton) {
      recordButton.addEventListener("click", async () => {
        await this.recordPayment();
        await this.parentDashboard.navigateToSection("payment");
        this.attachEventListeners();
      });
    }
  }

  async getSalesOrder() {
    try {
      const response = await SalesOrder.getAll();
      this.orders = response.data.filter(
        (order) => order.paymentStatus === "unpaid"
      );

      console.log(this.orders);
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

  handleOrderSelection() {
    const orderSelect = document.getElementById("payment-order-id");
    const amountInput = document.getElementById("payment-amount");

    const selectedOrderId = orderSelect.value;
    if (selectedOrderId) {
      const order = this.orders.find((o) => o.id === Number(selectedOrderId));
      if (order) {
        amountInput.value = order.subtotal.toFixed(2);
        amountInput.readOnly = true;
      }
    } else {
      amountInput.value = "";
      amountInput.readOnly = false;
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

    const order = this.orders.find((o) => o.id === Number(orderId));
    if (order && parseFloat(amount) !== order.subtotal) {
      alert(
        "Payment must be for the full order amount. Partial payments are not allowed."
      );
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
      await SalesOrder.update(Number(orderId), { paymentStatus: "paid" });
      await this.getPayments();
      await this.getSalesOrder();

      const content = document.getElementById("dashboardContent");
      if (content) {
        content.innerHTML = `<div class="driver-section-container">${this.render()}</div>`;
      }

      alert("Payment recorded successfully");
    } catch (error) {
      console.error("Error recording payment:", error);
      alert(error.message || "Failed to record payment");
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
          <h4 class="driver-card-title mb-4">Record Full Payment</h4>
          <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="driver-label-text">Order ID</label>
              <select id="payment-order-id" class="driver-input" onchange="window.paymentCollection.handleOrderSelection()">
                <option value="">Select Order</option>
                ${this.orders
                  .map(
                    (order) =>
                      `<option value="${order.id}">${
                        order.orderNumber +
                        " - " +
                        order.customerName +
                        " (Rs. " +
                        order.subtotal.toFixed(2) +
                        ")"
                      }</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div>
              <label class="driver-label-text">Full Amount</label>
              <input id="payment-amount" type="number" placeholder="Select order first" class="driver-input bg-gray-100" readonly />
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
          <button class="driver-btn-primary driver-btn-action w-full">
            <div class="w-5 h-5">${getIconHTML("plus")}</div>
            Record Full Payment
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
                  <th class="driver-table-th">Date & Time</th>
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
                      payment.salesOrderId || "N/A"
                    }</td>
                    <td class="driver-table-td">${
                      payment.salesOrder?.customerName || "N/A"
                    }</td>
                    <td class="driver-table-td font-bold">Rs. ${
                      payment.amount.toFixed(2) || "0.00"
                    }</td>
                    <td class="driver-table-td text-gray-600 capitalize">${
                      payment.paymentMethod || "N/A"
                    }</td>
                    <td class="driver-table-td text-gray-600">${
                      new Date(payment.paymentDate).toLocaleString() || "N/A"
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
