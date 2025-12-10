import { LitElement, html } from "lit";
import { Product } from "../../models/Product.js";

export class StockAvailability extends LitElement {
  static properties = {
    products: { type: Array },
  };

  constructor() {
    super();
    this.products = [];
    this.getInventoryItems();
  }

  createRenderRoot() {
    return this;
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.products = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.products = [];
    }
  }

  render() {
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="sm-header-title">Stock Availability</h3>
          <p class="sm-text-muted">Check real-time product inventory</p>
        </div>

        <div class="sm-card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Product Inventory</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="sm-table-header">Product Name</th>
                  <th class="sm-table-header">SKU</th>
                  <th class="sm-table-header">Category</th>
                  <th class="sm-table-header">Available</th>
                  <th class="sm-table-header">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.products.map(
                  (product) => html`
                    <tr class="sm-table-row">
                      <td class="sm-table-cell-main">${product.name}</td>
                      <td class="sm-table-cell">${product.sku}</td>
                      <td class="sm-table-cell">${product.category}</td>
                      <td class="sm-table-cell font-semibold text-gray-900">
                        ${product.quantity}
                      </td>
                      <td class="sm-table-cell font-semibold text-sky-600">
                        Rs. ${product.price.toFixed(2)}
                      </td>
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

customElements.define("stock-availability", StockAvailability);
