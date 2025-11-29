import { Cart } from "../../models/Cart.js";
import { smallOrder } from "../../models/SmallOrder.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class SalesTransaction {
  constructor() {
    this.cartItems = [];
  }

  async getCartItems() {
    try {
      const response = await Cart.getAll();
      if (response.data && response.data.length > 0) {
        const cart = response.data[0];
        this.cartItems = cart.items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total,
        }));
      } else {
        this.cartItems = [];
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      this.cartItems = [];
    }
  }

  async getSmallOrder() {
    try {
      const response = await smallOrder.getAll();

      if (response.data && response.data.length > 0) {
        const completedOrders = response.data.filter(
          (order) => order.status === "completed"
        );
        this.smallOrder = completedOrders.length > 0 ? completedOrders : null;
      } else {
        this.smallOrder = null;
      }

      console.log(this.smallOrder);
    } catch (error) {
      console.error("Error fetching small order:", error);
      this.smallOrder = null;
    }
  }

  render() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return `
      <div class="cashier-section-spacing">
        <div class="cashier-grid-layout">
          <!-- Add Product Form -->
          <div class="lg:col-span-2 cashier-card">
            <h3 class="cashier-section-title mb-4 flex items-center gap-2">
              Add Product to Sale
            </h3>
            <div class="space-y-4">
              <div>
                <label class="cashier-label">Product Name</label>
                <input type="text" placeholder="Enter product name" class="cashier-input" />
              </div>
              <div class="cashier-grid-2col">
                <div>
                  <label class="cashier-label">Quantity</label>
                  <input type="number" placeholder="0" class="cashier-input" />
                </div>
                <div>
                  <label class="cashier-label">Price</label>
                  <input type="number" placeholder="0.00" class="cashier-input" />
                </div>
              </div>
              <button class="cashier-btn-primary cashier-btn-icon">
                ${getIconHTML("plus")}
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cashier-card-gradient">
            <h3 class="cashier-section-title mb-4">Cart Summary</h3>
            <div class="space-y-3">
              <div class="cashier-summary-row">
                <span>Subtotal:</span>
                <span class="font-semibold">Rs. ${subtotal.toFixed(2)}</span>
              </div>
              <div class="cashier-summary-row">
                <span>Tax (10%):</span>
                <span class="font-semibold">Rs. ${tax.toFixed(2)}</span>
              </div>
              <div class="cashier-divider cashier-total-row">
                <span>Total:</span>
                <span>Rs. ${total.toFixed(2)}</span>
              </div>
              <button class="cashier-btn-primary mt-4">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">Cart Items (${
              this.cartItems.length
            })</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="cashier-table-head">
                <tr>
                  <th class="cashier-table-header">Product</th>
                  <th class="cashier-table-header">Quantity</th>
                  <th class="cashier-table-header">Price</th>
                  <th class="cashier-table-header">Total</th>
                  <th class="cashier-table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.cartItems
                  .map(
                    (item) => `
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${item.name}</td>
                      <td class="cashier-table-cell">${item.quantity}</td>
                      <td class="cashier-table-cell">Rs. ${item.price.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell font-semibold">Rs. ${item.total.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell">
                        <button class="cashier-btn-delete">
                          ${getIconHTML("trash")}
                        </button>
                      </td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment History -->
        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">Payment History</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="cashier-table-head">
                <tr>
                  <th class="cashier-table-header">Method</th>
                  <th class="cashier-table-header">Amount</th>
                  <th class="cashier-table-header">Time</th>
                  <th class="cashier-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  this.smallOrder && this.smallOrder.length > 0
                    ? this.smallOrder
                        .map(
                          (order) => `
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${order.paymentMethod}</td>
                      <td class="cashier-table-cell font-semibold">Rs. ${order.cart.totalAmount.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell text-gray-600">${
                        order.createdAt
                      }</td>
                      <td class="cashier-table-cell">
                        <span class="cashier-badge ${
                          order.status === "completed"
                            ? "cashier-badge-success"
                            : order.status === "pending"
                            ? "cashier-badge-warning"
                            : "cashier-badge-error"
                        }">
                          ${
                            order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          }
                        </span>
                      </td>
                    </tr>
                  `
                        )
                        .join("")
                    : '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No payment history available</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
