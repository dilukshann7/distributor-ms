import { LitElement, html } from "lit";
import { getIconHTML } from "../../../assets/icons/index.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { Payment } from "../../models/Payment.js";

export class PaymentCollection extends LitElement {
  static properties = {
    payments: { type: Array },
    orders: { type: Array },
    selectedOrderId: { type: String },
    message: { type: Object },
  };

  constructor() {
    super();
    this.payments = [];
    this.orders = [];
    this.selectedOrderId = "";
    this.message = null;
    this.getSalesOrder();
    this.getPayments();
  }

  createRenderRoot() {
    return this;
  }

  async getSalesOrder() {
    try {
      const response = await SalesOrder.getAll();
      this.orders = response.data.filter(
        (order) => order.paymentStatus === "unpaid"
      );
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

  handleOrderSelection(e) {
    this.selectedOrderId = e.target.value;
  }

  async recordPayment(e) {
    e.preventDefault();
    const form = e.target;
    const orderId = form["payment-order-id"].value;
    const amount = form["payment-amount"].value;
    const method = form["payment-method"].value;

    if (!orderId || !amount || !method) {
      this.message = { text: "Please fill in all fields", type: "error" };
      return;
    }

    const order = this.orders.find((o) => o.id === Number(orderId));
    if (order && parseFloat(amount) !== order.subtotal) {
      this.message = {
        text: "Payment must be for the full order amount. Partial payments are not allowed.",
        type: "error"
      };
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
      this.selectedOrderId = "";
      this.message = { text: "Payment recorded successfully!", type: "success" };
    } catch (error) {
      console.error("Error recording payment:", error);
      this.message = { text: error.message || "Failed to record payment", type: "error" };
    }
  }

  renderMessage() {
    if (!this.message) return null;

    const bgColor =
      this.message.type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : this.message.type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-blue-100 border-blue-400 text-blue-700";

    setTimeout(() => {
      this.message = null;
    }, 5000);

    return html`
      <div class="${bgColor} border px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">${this.message.text}</span>
      </div>
    `;
  }

  render() {
    const selectedOrder = this.orders.find((o) => o.id === Number(this.selectedOrderId));
    const amount = selectedOrder ? selectedOrder.subtotal.toFixed(2) : "";

    return html`
      <div class="space-y-6">
        <div>
          <h2 class="driver-title mb-2">Payment Collection</h2>
          <p class="driver-subtitle">Record and manage cash-on-delivery payments</p>
        </div>

        ${this.renderMessage()}

        <div class="driver-panel p-6">
          <h4 class="driver-card-title mb-4">Record Full Payment</h4>
          <form @submit=${this.recordPayment} class="space-y-4">
            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="driver-label-text">Order ID</label>
                <select 
                  name="payment-order-id" 
                  class="driver-input" 
                  @change=${this.handleOrderSelection}
                  .value=${this.selectedOrderId}
                >
                  <option value="">Select Order</option>
                  ${this.orders.map(
                    (order) =>
                      html`<option value="${order.id}">
                        ${order.orderNumber} - ${order.customerName} (Rs. ${order.subtotal.toFixed(2)})
                      </option>`
                  )}
                </select>
              </div>
              <div>
                <label class="driver-label-text">Full Amount</label>
                <input 
                  name="payment-amount" 
                  type="number" 
                  placeholder="Select order first" 
                  class="driver-input bg-gray-100" 
                  .value=${amount}
                  readonly 
                />
              </div>
              <div>
                <label class="driver-label-text">Payment Method</label>
                <select name="payment-method" class="driver-input">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                  <option value="Check">Check</option>
                </select>
              </div>
            </div>
            <button type="submit" class="driver-btn-primary driver-btn-action w-full">
              <div class="w-5 h-5" .innerHTML=${getIconHTML("plus")}></div>
              Record Full Payment
            </button>
          </form>
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
                    (payment) => html`
                      <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td class="driver-table-td font-semibold">${payment.id || "N/A"}</td>
                        <td class="driver-table-td text-green-600 font-medium">${payment.salesOrderId || "N/A"}</td>
                        <td class="driver-table-td">${payment.salesOrder?.customerName || "N/A"}</td>
                        <td class="driver-table-td font-bold">Rs. ${payment.amount.toFixed(2) || "0.00"}</td>
                        <td class="driver-table-td text-gray-600 capitalize">${payment.paymentMethod || "N/A"}</td>
                        <td class="driver-table-td text-gray-600">${new Date(payment.paymentDate).toLocaleString() || "N/A"}</td>
                      </tr>
                    `
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("payment-collection", PaymentCollection);
