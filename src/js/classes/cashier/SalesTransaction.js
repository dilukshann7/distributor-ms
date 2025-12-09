import { Cart } from "../../models/Cart.js";
import { smallOrder } from "../../models/SmallOrder.js";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Product } from "../../models/Product.js";

export class SalesTransaction {
  constructor(container) {
    this.container = container;
    this.cartItems = [];
    this.products = [];
    this.selectedProduct = null;
  }

  async initialize() {
    await this.getSmallOrder();
    await this.getProducts();
    return this.render();
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

  async createCart() {
    try {
      const cartData = {
        items: [],
        totalAmount: 0,
      };
      const response = await Cart.create(cartData);
      return response.data;
    } catch (error) {
      console.error("Error creating cart:", error);
      return null;
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
    } catch (error) {
      console.error("Error fetching small order:", error);
      this.smallOrder = null;
    }
  }

  attachEventListeners() {
    const productSelect = this.container.querySelector("#productSelect");
    const quantityInput = this.container.querySelector("#quantityInput");
    const priceInput = this.container.querySelector("#priceInput");
    const addToCartButton = this.container.querySelector(
      ".cashier-btn-primary.cashier-btn-icon"
    );
    const proceedButton = this.container.querySelector(
      ".cashier-btn-primary.mt-4"
    );

    if (productSelect) {
      productSelect.addEventListener("change", (e) => {
        const selectedProductName = e.target.value;
        this.selectedProduct = this.products.find(
          (p) => p.name === selectedProductName
        );
        this.updateTotalPrice(quantityInput, priceInput);
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener("input", () => {
        this.updateTotalPrice(quantityInput, priceInput);
      });
    }

    if (addToCartButton) {
      addToCartButton.addEventListener("click", async () => {
        await this.addToCart(productSelect, quantityInput, priceInput);
      });
    }

    if (proceedButton) {
      proceedButton.addEventListener("click", async () => {
        await this.proceedToPayment();
      });
    }
  }

  updateTotalPrice(quantityInput, priceInput) {
    if (this.selectedProduct && quantityInput && priceInput) {
      const quantity = parseInt(quantityInput.value) || 0;
      const totalPrice = this.selectedProduct.price * quantity;
      priceInput.value = totalPrice.toFixed(2);
    }
  }

  async addToCart(productSelect, quantityInput, priceInput) {
    if (!this.selectedProduct) {
      alert("Please select a product");
      return;
    }

    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const total = parseFloat(priceInput.value);

    const existingItem = this.cartItems.find(
      (item) => item.name === this.selectedProduct.name
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      this.cartItems.push({
        name: this.selectedProduct.name,
        quantity: quantity,
        price: this.selectedProduct.price,
        total: total,
      });
    }

    productSelect.value = "";
    quantityInput.value = "1";
    priceInput.value = "0.00";
    this.selectedProduct = null;

    const contentArea = this.container.querySelector("#dashboardContent > div");
    if (contentArea) {
      contentArea.innerHTML = this.render();
    } else {
      this.container.innerHTML = this.render();
    }
    this.attachEventListeners();
  }

  async proceedToPayment() {
    if (this.cartItems.length === 0) {
      alert("Cart is empty. Please add items before proceeding to payment.");
      return;
    }

    try {
      const subtotal = this.cartItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax;

      const cartData = {
        items: this.cartItems,
        totalAmount: totalAmount,
        status: "active",
      };

      const cartResponse = await Cart.create(cartData);
      const createdCart = cartResponse.data;

      const orderNumber = `ORD-${Date.now()}`;
      const orderData = {
        orderNumber: orderNumber,
        cartId: createdCart.id,
        status: "completed",
      };

      await smallOrder.create(orderData);

      alert(`Order ${orderNumber} created successfully!`);

      this.cartItems = [];
      const contentArea = this.container.querySelector(
        "#dashboardContent > div"
      );
      if (contentArea) {
        contentArea.innerHTML = await this.initialize();
      } else {
        this.container.innerHTML = await this.initialize();
      }
      this.attachEventListeners();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  }

  render() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return `
      <div class="cashier-section-spacing">
        <div class="cashier-grid-layout">
          <div class="lg:col-span-2 cashier-card">
            <h3 class="cashier-section-title mb-4 flex items-center gap-2">
              Add Product to Sale
            </h3>
            <div class="space-y-4">
              <div>
                <label class="cashier-label">Product Name</label>
                <select id="productSelect" class="cashier-input">
                  <option value="" disabled selected>Select a product</option>
                  ${this.products
                    .map(
                      (product) =>
                        `<option value="${product.name}">${product.name}</option>`
                    )
                    .join("")}
                </select>
              </div>
              <div class="cashier-grid-2col">
                <div>
                  <label class="cashier-label">Quantity</label>
                  <input id="quantityInput" type="number" placeholder="0" class="cashier-input" min="1" value="1" />
                </div>
                <div>
                  <label class="cashier-label">Total Price</label>
                  <input id="priceInput" type="number" placeholder="0.00" class="cashier-input" value="0.00" readonly />
                </div>
              </div>
              <button class="cashier-btn-primary cashier-btn-icon">
                ${getIconHTML("plus")}
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
              <button class="cashier-btn-primary mt-4">
                Make Payment
              </button>
            </div>
          </div>
        </div>

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
                ${
                  this.smallOrder && this.smallOrder.length > 0
                    ? this.smallOrder
                        .map(
                          (order) => `
                    <tr class="cashier-table-row">
                      <td class="cashier-table-cell">${order.cart.id}</td>
                      <td class="cashier-table-cell font-semibold">Rs. ${order.cart.totalAmount.toFixed(
                        2
                      )}</td>
                      <td class="cashier-table-cell text-gray-600">${new Date(
                        order.createdAt
                      ).toLocaleString()}</td>
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
