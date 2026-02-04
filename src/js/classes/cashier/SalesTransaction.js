import { LitElement, html } from "lit";
import { Cart } from "../../models/Cart.js";
import { RetailOrder } from "../../models/RetailOrder.js";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Product } from "../../models/Product.js";

export class SalesTransaction extends LitElement {
  static properties = {
    cartItems: { type: Array },
    products: { type: Array },
    selectedProduct: { type: Object },
    retailOrders: { type: Array },
  };

  constructor() {
    super();
    this.cartItems = [];
    this.products = [];
    this.selectedProduct = null;
    this.retailOrders = null;
    this.getRetailOrders();
    this.getProducts();
  }

  createRenderRoot() {
    return this;
  }

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.products = response.data.map((product) => ({
        name: product.name,
        price: product.price,
      }));
      console.log("Fetched products:", this.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      this.products = [];
    }
  }

  async getRetailOrders() {
    try {
      const response = await RetailOrder.getAll();

      if (response.data && response.data.length > 0) {
        const completedOrders = response.data.filter(
          (order) => order.order?.status === "completed",
        );
        this.retailOrders = completedOrders.length > 0 ? completedOrders : null;
      } else {
        this.retailOrders = null;
      }
    } catch (error) {
      console.error("Error fetching retail orders:", error);
      this.retailOrders = null;
    }
  }

  handleProductChange(e) {
    const selectedProductName = e.target.value;
    this.selectedProduct = this.products.find(
      (p) => p.name === selectedProductName,
    );
    this.requestUpdate();
  }

  handleQuantityChange(e) {
    this.requestUpdate();
  }

  getQuantity() {
    const quantityInput = this.querySelector("#quantityInput");
    return quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  }

  getTotalPrice() {
    if (this.selectedProduct) {
      const quantity = this.getQuantity();
      return (this.selectedProduct.price * quantity).toFixed(2);
    }
    return "0.00";
  }

  async addToCart() {
    if (!this.selectedProduct) {
      alert("Please select a product");
      return;
    }

    const quantity = this.getQuantity();
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const total = parseFloat(this.getTotalPrice());

    const existingItem = this.cartItems.find(
      (item) => item.name === this.selectedProduct.name,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      this.cartItems = [
        ...this.cartItems,
        {
          name: this.selectedProduct.name,
          quantity: quantity,
          price: this.selectedProduct.price,
          total: total,
        },
      ];
    }

    this.selectedProduct = null;
    this.requestUpdate();
  }

  removeFromCart(index) {
    this.cartItems = this.cartItems.filter((_, i) => i !== index);
    this.requestUpdate();
  }

  async proceedToPayment() {
    if (this.cartItems.length === 0) {
      alert("Cart is empty. Please add items before proceeding to payment.");
      return;
    }

    try {
      const subtotal = this.cartItems.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax;

      const cartData = {
        items: this.cartItems,
        totalAmount: totalAmount,
        status: "processed",
      };

      const cartResponse = await Cart.create(cartData);
      const createdCart = cartResponse.data;

      const orderNumber = `RO-${Date.now()}`;
      const orderData = {
        orderNumber: orderNumber,
        cartId: createdCart.id,
        status: "completed",
      };

      await RetailOrder.create(orderData);

      alert(`Order ${orderNumber} created successfully!`);

      this.cartItems = [];
      await this.getRetailOrders();
      this.requestUpdate();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  }

  render() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return html`
      <div class="cashier-section-spacing">
        <div class="cashier-grid-layout">
          <div class="lg:col-span-2 cashier-card">
            <h3 class="cashier-section-title mb-4 flex items-center gap-2">
              Add Product to Sale
            </h3>
            <div class="space-y-4">
              <div>
                <label class="cashier-label">Product Name</label>
                <select
                  id="productSelect"
                  class="cashier-input"
                  @change=${this.handleProductChange}
                >
                  <option value="" disabled selected>Select a product</option>
                  ${this.products.map(
                    (product) =>
                      html`<option value="${product.name}">
                        ${product.name}
                      </option>`,
                  )}
                </select>
              </div>
              <div class="cashier-grid-2col">
                <div>
                  <label class="cashier-label">Quantity</label>
                  <input
                    id="quantityInput"
                    type="number"
                    placeholder="0"
                    class="cashier-input"
                    min="1"
                    value="1"
                    @input=${this.handleQuantityChange}
                  />
                </div>
                <div>
                  <label class="cashier-label">Total Price</label>
                  <input
                    id="priceInput"
                    type="number"
                    placeholder="0.00"
                    class="cashier-input"
                    .value=${this.getTotalPrice()}
                    readonly
                  />
                </div>
              </div>
              <button
                class="cashier-btn-primary cashier-btn-icon"
                @click=${this.addToCart}
              >
                <span .innerHTML=${getIconHTML("plus")}></span>
                Add to Cart
              </button>
            </div>
          </div>

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
              <button
                class="cashier-btn-primary mt-4"
                @click=${this.proceedToPayment}
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>

        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">
              Cart Items (${this.cartItems.length})
            </h3>
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
                ${this.cartItems.map(
                  (item, index) => html`
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${item.name}</td>
                      <td class="cashier-table-cell">${item.quantity}</td>
                      <td class="cashier-table-cell">
                        Rs. ${item.price.toFixed(2)}
                      </td>
                      <td class="cashier-table-cell font-semibold">
                        Rs. ${item.total.toFixed(2)}
                      </td>
                      <td class="cashier-table-cell">
                        <button
                          class="cashier-btn-delete"
                          @click=${() => this.removeFromCart(index)}
                        >
                          <span .innerHTML=${getIconHTML("trash")}></span>
                        </button>
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div class="cashier-card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="cashier-section-title">Payment History</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="cashier-table-head">
                <tr>
                  <th class="cashier-table-header">Order ID</th>
                  <th class="cashier-table-header">Amount</th>
                  <th class="cashier-table-header">Time</th>
                  <th class="cashier-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.retailOrders && this.retailOrders.length > 0
                  ? this.retailOrders.map(
                      (retailOrder) => html`
                        <tr class="cashier-table-row">
                          <td class="cashier-table-cell">
                            ${retailOrder.order?.orderNumber || retailOrder.id}
                          </td>
                          <td class="cashier-table-cell font-semibold">
                            Rs.
                            ${(
                              retailOrder.order?.totalAmount ||
                              retailOrder.cart?.totalAmount ||
                              0
                            ).toFixed(2)}
                          </td>
                          <td class="cashier-table-cell text-gray-600">
                            ${new Date(
                              retailOrder.order?.createdAt ||
                                retailOrder.createdAt,
                            ).toLocaleString()}
                          </td>
                          <td class="cashier-table-cell">
                            <span
                              class="cashier-badge ${(retailOrder.order
                                ?.status || retailOrder.status) === "completed"
                                ? "cashier-badge-success"
                                : (retailOrder.order?.status ||
                                      retailOrder.status) === "pending"
                                  ? "cashier-badge-warning"
                                  : "cashier-badge-error"}"
                            >
                              ${(
                                retailOrder.order?.status ||
                                retailOrder.status ||
                                ""
                              )
                                .charAt(0)
                                .toUpperCase() +
                              (
                                retailOrder.order?.status ||
                                retailOrder.status ||
                                ""
                              ).slice(1)}
                            </span>
                          </td>
                        </tr>
                      `,
                    )
                  : html`<tr>
                      <td
                        colspan="4"
                        class="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No payment history available
                      </td>
                    </tr> `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("sales-transaction", SalesTransaction);
