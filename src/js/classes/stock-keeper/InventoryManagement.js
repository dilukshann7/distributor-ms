import { Product } from "../../models/Product.js";
import { Supplier } from "../../models/Supplier.js";

export class InventoryManagement {
  constructor(container) {
    this.container = container;
    this.inventoryItems = [];
    this.allInventoryItems = [];
    this.suppliers = [];
    this.view = "list";
    this.editingItem = null;
    this.getInventoryItems();
    this.getSuppliers();
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.allInventoryItems = response.data;
      this.inventoryItems = response.data;
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
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      this.suppliers = [];
    }
  }

  async handleSearch() {
    try {
      const searchInput = document.getElementById("searchInput");
      const searchTerm = searchInput.value.toLowerCase();
      this.inventoryItems = this.allInventoryItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.sku.toLowerCase().includes(searchTerm)
        );
      });
      this.refresh(this.container);

      const newSearchInput = document.getElementById("searchInput");
      newSearchInput.focus();
      newSearchInput.value = searchTerm;
      newSearchInput.setSelectionRange(searchTerm.length, searchTerm.length);
    } catch (error) {
      console.error("Error searching inventory items:", error);
    }
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
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Inventory Management</h3>
            <p class="sk-text-muted">Add, edit, and manage inventory items</p>
          </div>
          <button onclick="window.stockKeeperDashboard.sections.inventory.switchToAdd()" class="sk-btn-primary px-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Item
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="mb-6 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input oninput="window.stockKeeperDashboard.sections.inventory.handleSearch()" type="text" placeholder="Search by name or SKU..." class="bg-transparent flex-1 outline-none text-gray-700" id="searchInput" />
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
                ${this.inventoryItems
                  .map(
                    (item) => `
                  <tr class="sk-table-row">
                    <td class="sk-table-cell-main">${item.name}</td>
                    <td class="sk-table-cell">${item.sku}</td>
                    <td class="py-3 px-4">
                      <span class="sk-badge ${
                        item.quantity < item.minStock
                          ? "sk-badge-red"
                          : item.quantity > item.maxStock
                          ? "sk-badge-yellow"
                          : "sk-badge-green"
                      }">
                        ${item.quantity}
                      </span>
                    </td>
                    
                    <td class="sk-table-cell">${
                      item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "N/A"
                    }</td>
                    <td class="sk-table-cell text-sm">${
                      item.batchNumber ? item.batchNumber : "N/A"
                    }</td>
                    <td class="sk-table-cell font-medium">${item.location}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <button onclick="window.stockKeeperDashboard.sections.inventory.switchToEdit('${
                          item.id
                        }')" class="sk-btn-icon-blue" title="Edit">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="sk-btn-icon-red" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
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

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Add New Item</h3>
            <p class="sk-text-muted">Add a new item to your inventory</p>
          </div>
        </div>

        <form id="addItemForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.inventory.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input type="text" name="name" required class="sk-input" placeholder="e.g. Air Freshener">
                </div>
                
                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input type="text" name="sku" required class="sk-input" placeholder="e.g. INV-001">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Category</label>
                  <input type="text" name="category" required class="sk-input" placeholder="e.g. Electronics">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Supplier <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <select name="supplierId" class="sk-input">
                    <option value="">Select Supplier</option>
                    ${this.suppliers
                      .map(
                        (supplier) =>
                          `<option value="${supplier.id}">${supplier.companyName}</option>`
                      )
                      .join("")}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" class="sk-input" placeholder="e.g. BATCH-001">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input type="text" name="location" required class="sk-input" placeholder="e.g. Warehouse A, Shelf 3">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="sk-input" placeholder="Product description"></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input type="number" name="quantity" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input type="number" name="minStock" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input type="number" name="maxStock" required min="0" step="1" class="sk-input" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Price</label>
                  <input type="number" name="price" required min="0" step="0.01" class="sk-input" placeholder="0.00">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" class="sk-input">
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
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.inventory.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Save Item
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const item = this.editingItem;
    if (!item) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">Edit Item</h3>
            <p class="sk-text-muted">Update item information</p>
          </div>
        </div>

        <form id="editItemForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.inventory.submitEditForm(event)">
          <div class="p-8 space-y-8">
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Item Name</label>
                  <input type="text" name="name" required class="sk-input" placeholder="e.g. Air Freshener" value="${
                    item.name
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">SKU</label>
                  <input type="text" name="sku" required class="sk-input" placeholder="e.g. INV-001" value="${
                    item.sku
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Category</label>
                  <input type="text" name="category" required class="sk-input" placeholder="e.g. Electronics" value="${
                    item.category || ""
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Supplier <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <select name="supplierId" class="sk-input">
                    <option value="">Select Supplier</option>
                    ${this.suppliers
                      .map(
                        (supplier) =>
                          `<option value="${supplier.id}" ${
                            item.supplierId === supplier.id ? "selected" : ""
                          }>${supplier.companyName}</option>`
                      )
                      .join("")}
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" class="sk-input" placeholder="e.g. BATCH-001" value="${
                    item.batchNumber || ""
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Location</label>
                  <input type="text" name="location" required class="sk-input" placeholder="e.g. Warehouse A, Shelf 3" value="${
                    item.location
                  }">
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="sk-label">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="sk-input" placeholder="Product description">${
                    item.description || ""
                  }</textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                Stock Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Quantity</label>
                  <input type="number" name="quantity" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.quantity
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Min Stock</label>
                  <input type="number" name="minStock" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.minStock
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Max Stock</label>
                  <input type="number" name="maxStock" required min="0" step="1" class="sk-input" placeholder="0" value="${
                    item.maxStock
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Price</label>
                  <input type="number" name="price" required min="0" step="0.01" class="sk-input" placeholder="0.00" value="${
                    item.price
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" class="sk-input" value="${
                    item.expiryDate
                      ? new Date(item.expiryDate).toISOString().split("T")[0]
                      : ""
                  }">
                </div>
                <div class="space-y-2">
                  <label class="sk-label">Status</label>
                  <select name="status" class="sk-input">
                    <option value="In Stock" ${
                      item.status === "In Stock" ? "selected" : ""
                    }>In Stock</option>
                    <option value="Low Stock" ${
                      item.status === "Low Stock" ? "selected" : ""
                    }>Low Stock</option>
                    <option value="Out of Stock" ${
                      item.status === "Out of Stock" ? "selected" : ""
                    }>Out of Stock</option>
                  </select>
                </div>
              </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.inventory.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Update Item
            </button>
          </div>
        </form>
      </div>
    `;
  }

  switchToAdd() {
    this.view = "add";
    this.editingItem = null;
    this.refresh(this.container);
  }

  switchToEdit(itemId) {
    this.editingItem = this.inventoryItems.find(
      (item) => item.id === parseInt(itemId)
    );
    this.view = "edit";
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingItem = null;
    this.refresh(this.container);
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

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
