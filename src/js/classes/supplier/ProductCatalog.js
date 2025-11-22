import { Supply } from "../../models/Supply.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class ProductCatalog {
  constructor(container) {
    this.container = container;
    this.products = [];
    this.view = "list";
    this.editingProduct = null;
  }

  async getSupply() {
    try {
      const response = await Supply.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching supplies:", error);
      this.products = [];
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
            <h3 class="section-header">Product Catalog</h3>
            <p class="section-subtitle">Manage your product offerings</p>
          </div>
          <button onclick="window.supplierDashboard.sections.products.switchToAdd()" class="btn-primary flex items-center gap-2">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="card-container">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Product Name</th>
                  <th class="table-header">SKU</th>
                  <th class="table-header">Category</th>
                  <th class="table-header">Price</th>
                  <th class="table-header">Stock</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.products
                  .map(
                    (product) => `
                  <tr class="table-row">
                    <td class="table-cell-medium">${product.name}</td>
                    <td class="table-cell">${product.sku}</td>
                    <td class="table-cell">${product.category}</td>
                    <td class="table-cell-bold">Rs. ${product.price}</td>
                    <td class="table-cell">${product.stock} units</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        product.status === "In Stock"
                          ? "status-green"
                          : "status-yellow"
                      }">
                        ${product.status}
                      </span>
                    </td>
                    <td class="table-cell gap-2">
                      <button class="btn-action text-blue-600 edit-product-btn" onclick="window.supplierDashboard.sections.products.switchToEdit('${
                        product.id
                      }')" title="Edit">
                        ${getIconHTML("edit")}
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
      </div>
    `;
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Add New Supply</h3>
            <p class="section-subtitle">Add a new item to your inventory</p>
          </div>
        </div>

        <form id="addSupplyForm" class="card-container" onsubmit="window.supplierDashboard.sections.products.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Supply Name</label>
                  <input type="text" name="name" required class="input-field" placeholder="e.g. Office Paper A4">
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" name="sku" required class="input-field" placeholder="e.g. SUP-001">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Category <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="category" class="input-field" placeholder="e.g. Stationery">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("trending-up").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Pricing & Inventory
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Price (LKR)</label>
                  <div class="relative">
                    <input type="number" name="price" required min="0" step="0.01" class="input-field pl-12" placeholder="0.00">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input type="number" name="stock" required min="0" step="1" class="input-field" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="input-field">
                    <option value="available" selected>Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="backorder">Backorder</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.supplierDashboard.sections.products.switchToList()" class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Save Supply
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const product = this.editingProduct;
    if (!product) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Edit Product</h3>
            <p class="section-subtitle">Update product information</p>
          </div>
        </div>

        <form id="editSupplyForm" class="card-container" onsubmit="window.supplierDashboard.sections.products.submitEditForm(event)">
          <div class="p-8 space-y-8">
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Supply Name</label>
                  <input type="text" name="name" required class="input-field" placeholder="e.g. Office Paper A4" value="${
                    product.name
                  }">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" name="sku" required class="input-field" placeholder="e.g. SUP-001" value="${
                    product.sku
                  }">
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Category <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="category" class="input-field" placeholder="e.g. Stationery" value="${
                    product.category || ""
                  }">
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("trending-up").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Pricing & Inventory
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Price (LKR)</label>
                  <div class="relative">
                    <input type="number" name="price" required min="0" step="0.01" class="input-field pl-12" placeholder="0.00" value="${
                      product.price
                    }">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input type="number" name="stock" required min="0" class="input-field" placeholder="0" value="${
                    product.stock
                  }">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="input-field">
                    <option value="available" ${
                      product.status === "available" ? "selected" : ""
                    }>Available</option>
                    <option value="unavailable" ${
                      product.status === "unavailable" ? "selected" : ""
                    }>Unavailable</option>
                    <option value="backorder" ${
                      product.status === "backorder" ? "selected" : ""
                    }>Backorder</option>
                    <option value="discontinued" ${
                      product.status === "discontinued" ? "selected" : ""
                    }>Discontinued</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.supplierDashboard.sections.products.switchToList()" class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Update Product
            </button>
          </div>
        </form>
      </div>
    `;
  }

  switchToAdd() {
    this.view = "add";
    this.editingProduct = null;
    this.refresh(this.container);
  }

  switchToEdit(productId) {
    this.editingProduct = this.products.find(
      (p) => p.id === parseInt(productId)
    );
    this.view = "edit";
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingProduct = null;
    this.refresh(this.container);
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const productData = {
      ...rawData,
      stock: parseInt(rawData.stock, 10),
      price: parseFloat(rawData.price),
    };

    Supply.create(productData)
      .then(() => {
        this.getSupply().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error creating supply:", error);
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const productData = {
      ...rawData,
      stock: parseInt(rawData.stock, 10),
      price: parseFloat(rawData.price),
    };

    Supply.update(this.editingProduct.id, productData)
      .then(() => {
        this.getSupply().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating supply:", error);
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
