import { LitElement, html } from "lit";
import { Product } from "../../models/Product.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class StockView extends LitElement {
  static properties = {
    inventory: { type: Array },
    loading: { type: Boolean },
    searchTerm: { type: String },
  };

  constructor() {
    super();
    this.inventory = [];
    this.loading = true;
    this.searchTerm = "";
    this.getProducts();
  }

  createRenderRoot() {
    return this;
  }

  async getProducts() {
    try {
      this.loading = true;
      const response = await Product.getAll();
      this.inventory = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.inventory = [];
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
  }

  getFilteredInventory() {
    if (!this.searchTerm) return this.inventory;
    return this.inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(this.searchTerm) ||
        item.sku.toLowerCase().includes(this.searchTerm) ||
        item.category?.toLowerCase().includes(this.searchTerm),
    );
  }

  render() {
    const filteredInventory = this.getFilteredInventory();

    return html`
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Inventory</h3>
            <p class="text-gray-600 text-sm mt-1">
              View current stock levels and product information
            </p>
          </div>
        </div>

        ${this.loading
          ? html`
              <div class="flex justify-center items-center py-12">
                <div class="text-gray-600">Loading stock data...</div>
              </div>
            `
          : html`
              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Name
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          SKU
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price (Rs.)
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      ${filteredInventory.length === 0
                        ? html`
                            <tr>
                              <td
                                colspan="7"
                                class="px-6 py-8 text-center text-gray-500"
                              >
                                No products found
                              </td>
                            </tr>
                          `
                        : filteredInventory.map(
                            (item) => html`
                              <tr class="hover:bg-gray-50 transition-colors">
                                <td
                                  class="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                                >
                                  ${item.name}
                                </td>
                                <td
                                  class="px-6 py-4 whitespace-nowrap text-gray-600"
                                >
                                  ${item.sku}
                                </td>
                                <td
                                  class="px-6 py-4 whitespace-nowrap text-gray-600"
                                >
                                  ${item.category || "-"}
                                </td>
                                <td
                                  class="px-6 py-4 whitespace-nowrap text-gray-900"
                                >
                                  ${item.quantity} units
                                </td>
                                <td
                                  class="px-6 py-4 whitespace-nowrap text-gray-900"
                                >
                                  ${item.price.toFixed(2)}
                                </td>
                                <td
                                  class="px-6 py-4 whitespace-nowrap text-gray-600"
                                >
                                  ${item.location || "-"}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                  <span
                                    class="px-2 py-1 text-xs font-semibold rounded-full ${item.status ===
                                    "In Stock"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "Low Stock"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"}"
                                  >
                                    ${item.status}
                                  </span>
                                </td>
                              </tr>
                            `,
                          )}
                    </tbody>
                  </table>
                </div>
              </div>
            `}
      </div>
    `;
  }
}

customElements.define("stock-view", StockView);
