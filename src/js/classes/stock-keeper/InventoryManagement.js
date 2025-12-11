import { LitElement, html } from "lit";
import { Product } from "../../models/Product.js";
import { Supplier } from "../../models/Supplier.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class InventoryManagement extends LitElement {
  static properties = {
    inventoryItems: { type: Array },
    allInventoryItems: { type: Array },
    suppliers: { type: Array },
    view: { type: String },
    editingItem: { type: Object },
    searchTerm: { type: String },
  };

  constructor() {
    super();
    this.inventoryItems = [];
    this.allInventoryItems = [];
    this.suppliers = [];
    this.view = "list";
    this.editingItem = null;
    this.searchTerm = "";
    this.getInventoryItems();
    this.getSuppliers();
  }

  createRenderRoot() {
    return this;
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.allInventoryItems = response.data;
      this.inventoryItems = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.inventoryItems = [];
      this.allInventoryItems = [];
    }
  }

  async getSuppliers() {
    try {
      const response = await Supplier.getAll();
      this.suppliers = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      this.suppliers = [];
    }
  }

  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    this.inventoryItems = this.allInventoryItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm)
      );
    });
    this.requestUpdate();
  }

  switchToAdd() {
    this.view = "add";
    this.editingItem = null;
    this.requestUpdate();
  }

  switchToEdit(itemId) {
    this.editingItem = this.inventoryItems.find(
      (item) => item.id === parseInt(itemId)
    );
    this.view = "edit";
    this.requestUpdate();
  }

  switchToList() {
    this.view = "list";
    this.editingItem = null;
    this.requestUpdate();
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const itemData = {
      ...rawData,
      quantity: parseInt(rawData.quantity, 10),
      minStock: parseInt(rawData.minStock, 10),
      maxStock: parseInt(rawData.maxStock, 10),
      price: parseFloat(rawData.price),
      supplierId: rawData.supplierId
        ? parseInt(rawData.supplierId, 10)
        : undefined,
      expiryDate: rawData.expiryDate
        ? new Date(rawData.expiryDate).toISOString()
        : undefined,
      batchNumber: rawData.batchNumber || undefined,
      description: rawData.description || undefined,
    };

    Product.create(itemData)
      .then(() => {
        this.getInventoryItems().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error creating item:", error);
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const itemData = {
      ...rawData,
      quantity: parseInt(rawData.quantity, 10),
      minStock: parseInt(rawData.minStock, 10),
      maxStock: parseInt(rawData.maxStock, 10),
      price: parseFloat(rawData.price),
      supplierId: rawData.supplierId
        ? parseInt(rawData.supplierId, 10)
        : undefined,
      expiryDate: rawData.expiryDate
        ? new Date(rawData.expiryDate).toISOString()
        : undefined,
      batchNumber: rawData.batchNumber || undefined,
      description: rawData.description || undefined,
    };

    Product.update(this.editingItem.id, itemData)
      .then(() => {
        this.getInventoryItems().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  }

  render() {
    if (this.view === "add") {
      return this.renderAddForm();
    }
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
    return html`
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Inventory Management</h3>
            <p class="sk-text-muted">Add, edit, and manage inventory items</p>
          </div>
          <button @click=${this.switchToAdd} class="sk-btn-primary px-4">
            <span .innerHTML=${getIconHTML("plus")}></span>
            Add Item
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div
            class="mb-6 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"
          >
            <span
              class="text-gray-400"
              .innerHTML=${getIconHTML("search")}
            ></span>
            <input
              @input=${this.handleSearch}
              type="text"
              placeholder="Search by name or SKU..."
              class="bg-transparent flex-1 outline-none text-gray-700"
              id="searchInput"
              .value=${this.searchTerm}
            />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="sk-table-header">Item Name</th>
                  <th class="sk-table-header">SKU</th>
                  <th class="sk-table-header">Quantity</th>
                  <th class="sk-table-header">Expiry Date</th>
                  <th class="sk-table-header">Batch #</th>
                  <th class="sk-table-header">Location</th>
                  <th class="sk-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.inventoryItems.map(
                  (item) => html`
                    <tr class="sk-table-row">
                      <td class="sk-table-cell-main">${item.name}</td>
                      <td class="sk-table-cell">${item.sku}</td>
                      <td class="py-3 px-4">
                        <span
                          class="sk-badge ${item.quantity < item.minStock
                            ? "sk-badge-red"
                            : item.quantity > item.maxStock
                            ? "sk-badge-yellow"
                            : "sk-badge-green"}"
                        >
                          ${item.quantity}
                        </span>
                      </td>

                      <td class="sk-table-cell">
                        ${item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td class="sk-table-cell text-sm">
                        ${item.batchNumber ? item.batchNumber : "N/A"}
                      </td>
                      <td class="sk-table-cell font-medium">
                        ${item.location}
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <button
                            @click=${() => this.switchToEdit(item.id)}
                            class="sk-btn-icon-blue"
                            title="Edit"
                          >
                            <span
                              .innerHTML=${getIconHTML("edit").replace(
                                "w-5 h-5",
                                "w-4 h-4"
                              )}
                            ></span>
                          </button>
                          <button class="sk-btn-icon-red" title="Delete">
                            <span
                              .innerHTML=${getIconHTML("trash").replace(
                                "w-5 h-5",
                                "w-4 h-4"
                              )}
                            ></span>
                          </button>
                        </div>
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

  renderAddForm() {
    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Add New Item</h3>
            <p class="sk-text-muted">Add a new item to your inventory</p>
          </div>
        </div>

        <form id="addItemForm" class="sk-card" @submit=${this.submitAddForm}>
          <div class="p-8 space-y-8">
            <div>
              <h4 class="sk-subheader">
                <span
                  class="text-purple-600"
                  .innerHTML=${getIconHTML("package")}
                ></span>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    class="sk-input"
                    placeholder="e.g. Air Freshener"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    class="sk-input"
                    placeholder="e.g. INV-001"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    class="sk-input"
                    placeholder="e.g. Electronics"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label"
                    >Supplier
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <select name="supplierId" class="sk-input">
                    <option value="">Select Supplier</option>
                    ${this.suppliers.map(
                      (supplier) => html`
                        <option value="${supplier.id}">
                          ${supplier.companyName}
                        </option>
                      `
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sk-label"
                    >Batch Number
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input
                    type="text"
                    name="batchNumber"
                    class="sk-input"
                    placeholder="e.g. BATCH-001"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    class="sk-input"
                    placeholder="e.g. Warehouse A, Shelf 3"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label"
                    >Description
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="description"
                    rows="3"
                    class="sk-input"
                    placeholder="Product description"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <span
                  class="text-purple-600"
                  .innerHTML=${getIconHTML("trend-up")}
                ></span>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input
                    type="number"
                    name="maxStock"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    class="sk-input"
                    placeholder="0.00"
                  />
                </div>

                <div class="space-y-2">
                  <label class="sk-label"
                    >Expiry Date
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input type="date" name="expiryDate" class="sk-input" />
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Status</label>
                  <select name="status" class="sk-input">
                    <option value="In Stock" selected>In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
            >
              <button
                type="button"
                @click=${this.switchToList}
                class="sk-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" class="sk-btn-primary">
                <span .innerHTML=${getIconHTML("check-circle")}></span>
                Save Item
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const item = this.editingItem;
    if (!item) return this.renderList();

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Edit Item</h3>
            <p class="sk-text-muted">Update item information</p>
          </div>
        </div>

        <form id="editItemForm" class="sk-card" @submit=${this.submitEditForm}>
          <div class="p-8 space-y-8">
            <div>
              <h4 class="sk-subheader">
                <span
                  class="text-purple-600"
                  .innerHTML=${getIconHTML("package")}
                ></span>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    class="sk-input"
                    placeholder="e.g. Air Freshener"
                    value="${item.name}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    class="sk-input"
                    placeholder="e.g. INV-001"
                    value="${item.sku}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    class="sk-input"
                    placeholder="e.g. Electronics"
                    value="${item.category || ""}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label"
                    >Supplier
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <select name="supplierId" class="sk-input">
                    <option value="">Select Supplier</option>
                    ${this.suppliers.map(
                      (supplier) => html`
                        <option
                          value="${supplier.id}"
                          ?selected=${item.supplierId === supplier.id}
                        >
                          ${supplier.companyName}
                        </option>
                      `
                    )}
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="sk-label"
                    >Batch Number
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input
                    type="text"
                    name="batchNumber"
                    class="sk-input"
                    placeholder="e.g. BATCH-001"
                    value="${item.batchNumber || ""}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    class="sk-input"
                    placeholder="e.g. Warehouse A, Shelf 3"
                    value="${item.location}"
                  />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label"
                    >Description
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="description"
                    rows="3"
                    class="sk-input"
                    placeholder="Product description"
                  >
${item.description || ""}</textarea
                  >
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <span
                  class="text-purple-600"
                  .innerHTML=${getIconHTML("trend-up")}
                ></span>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                    value="${item.quantity}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                    value="${item.minStock}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input
                    type="number"
                    name="maxStock"
                    required
                    min="0"
                    step="1"
                    class="sk-input"
                    placeholder="0"
                    value="${item.maxStock}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    class="sk-input"
                    placeholder="0.00"
                    value="${item.price}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label"
                    >Expiry Date
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input
                    type="date"
                    name="expiryDate"
                    class="sk-input"
                    value="${item.expiryDate
                      ? new Date(item.expiryDate).toISOString().split("T")[0]
                      : ""}"
                  />
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Status</label>
                  <select name="status" class="sk-input">
                    <option
                      value="In Stock"
                      ?selected=${item.status === "In Stock"}
                    >
                      In Stock
                    </option>
                    <option
                      value="Low Stock"
                      ?selected=${item.status === "Low Stock"}
                    >
                      Low Stock
                    </option>
                    <option
                      value="Out of Stock"
                      ?selected=${item.status === "Out of Stock"}
                    >
                      Out of Stock
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
            >
              <button
                type="button"
                @click=${this.switchToList}
                class="sk-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" class="sk-btn-primary">
                <span .innerHTML=${getIconHTML("check-circle")}></span>
                Update Item
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("inventory-management", InventoryManagement);
