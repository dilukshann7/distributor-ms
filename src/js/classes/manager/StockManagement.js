import { LitElement, html } from "lit";
import { Product } from "../../models/Product.js";
import { Supplier } from "../../models/Supplier.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class StockManagement extends LitElement {
  static properties = {
    inventory: { type: Array },
    suppliers: { type: Array },
    view: { type: String },
    editingProduct: { type: Object },
  };

  constructor() {
    super();
    this.inventory = [];
    this.suppliers = [];
    this.view = "list";
    this.editingProduct = null;
    this.getProducts();
    this.getSuppliers();
  }

  createRenderRoot() {
    return this;
  }

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.inventory = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.inventory = [];
    }
  }

  async getSuppliers() {
    try {
      const response = await Supplier.getAll();
      this.suppliers = response.data;
      console.log("Suppliers fetched:", this.suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      this.suppliers = [];
    }
  }

  showAddFormHandler() {
    this.view = "add";
  }

  showEditFormHandler(productId) {
    this.editingProduct = this.inventory.find((p) => p.id === productId);
    this.view = "edit";
  }

  hideFormHandler() {
    this.view = "list";
    this.editingProduct = null;
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const productData = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || null,
      category: formData.get("category"),
      price: parseFloat(formData.get("price")),
      quantity: parseInt(formData.get("quantity")),
      minStock: parseInt(formData.get("minStock")),
      maxStock: formData.get("maxStock")
        ? parseInt(formData.get("maxStock"))
        : null,
      location: formData.get("location") || null,
      supplierId: formData.get("supplierId")
        ? parseInt(formData.get("supplierId"))
        : null,
      batchNumber: formData.get("batchNumber") || null,
      expiryDate: formData.get("expiryDate")
        ? new Date(formData.get("expiryDate"))
        : null,
      status: formData.get("status"),
    };

    Product.create(productData)
      .then(() => {
        this.getProducts().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        alert("Error creating product. Please try again.");
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const productData = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || null,
      category: formData.get("category"),
      price: parseFloat(formData.get("price")),
      quantity: parseInt(formData.get("quantity")),
      minStock: parseInt(formData.get("minStock")),
      maxStock: formData.get("maxStock")
        ? parseInt(formData.get("maxStock"))
        : null,
      location: formData.get("location") || null,
      supplierId: formData.get("supplierId")
        ? parseInt(formData.get("supplierId"))
        : null,
      batchNumber: formData.get("batchNumber") || null,
      expiryDate: formData.get("expiryDate")
        ? new Date(formData.get("expiryDate"))
        : null,
      status: formData.get("status"),
    };

    Product.update(this.editingProduct.id, productData)
      .then(() => {
        this.getProducts().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Error updating product. Please try again.");
      });
  }

  deleteProductHandler(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    Product.delete(productId)
      .then(() => {
        this.getProducts().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
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
            <h3 class="manager-header-title">Stock Management</h3>
            <p class="manager-header-subtitle">Monitor and manage inventory levels</p>
          </div>
          <button @click=${this.showAddFormHandler} class="manager-btn-primary">
            <div .innerHTML=${getIconHTML("plus")}></div>
            Add Product
          </button>
        </div>

        <div class="manager-card-overflow">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="manager-table-header">
                <tr>
                  <th class="manager-table-th">Product Name</th>
                  <th class="manager-table-th">SKU</th>
                  <th class="manager-table-th">Quantity</th>
                  <th class="manager-table-th">Min Stock</th>
                  <th class="manager-table-th">Status</th>
                  <th class="manager-table-th">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.inventory.map((item) => html`
                  <tr class="manager-table-row">
                    <td class="manager-table-td font-medium text-gray-900">${item.name}</td>
                    <td class="manager-table-td text-gray-600">${item.sku}</td>
                    <td class="manager-table-td text-gray-900">${item.quantity} units</td>
                    <td class="manager-table-td text-gray-900">${item.minStock} units</td>
                    <td class="manager-table-td">
                      <span class="manager-badge ${
                        item.status === "In Stock"
                          ? "manager-badge-green"
                          : item.status === "Low Stock"
                          ? "manager-badge-yellow"
                          : "manager-badge-red"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="manager-table-td flex gap-2">
                      <button @click=${() => this.showEditFormHandler(item.id)} class="manager-btn-icon-blue">
                        <div .innerHTML=${getIconHTML("edit")}></div>
                      </button>
                      <button @click=${() => this.deleteProductHandler(item.id)} class="manager-btn-icon-red">
                        <div .innerHTML=${getIconHTML("trash")}></div>
                      </button>
                    </td>
                  </tr>
                `)}
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
            <h3 class="manager-header-title">Add New Product</h3>
            <p class="manager-header-subtitle">Add a new product to inventory</p>
          </div>
        </div>

        <form id="addProductForm" class="manager-card-overflow" @submit=${this.submitAddForm}>
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div class="w-5 h-5 text-emerald-600" .innerHTML=${getIconHTML("package")}></div>
                Product Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Product Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Laptop HP ProBook">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">SKU <span class="text-red-600">*</span></label>
                  <input type="text" name="sku" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. SKU-001">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Category <span class="text-red-600">*</span></label>
                  <input type="text" name="category" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Electronics">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Price (Rs.) <span class="text-red-600">*</span></label>
                  <input type="number" name="price" required step="0.01" min="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 1500.00">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Supplier <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <select name="supplierId" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="">Select Supplier</option>
                    ${this.suppliers.map((supplier) => html`
                      <option value=${supplier.id}>${supplier.companyName}</option>
                    `)}
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Product description"></textarea>
                </div>
              </div>
            </div>

            <!-- Stock Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("box").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Stock Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Quantity <span class="text-red-600">*</span></label>
                  <input type="number" name="quantity" required min="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 100">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Min Stock <span class="text-red-600">*</span></label>
                  <input type="number" name="minStock" required min="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 10">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Max Stock <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="maxStock" min="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 1000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Location <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="location" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Warehouse A">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. BATCH-2024-001">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="In Stock" selected>In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" @click=${this.hideFormHandler} class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
              Add Product
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const product = this.editingProduct;
    if (!product) return this.renderList();

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Edit Product</h3>
            <p class="manager-header-subtitle">Update product information</p>
          </div>
        </div>

        <form id="editProductForm" class="manager-card-overflow" @submit=${this.submitEditForm}>
          <div class="p-8 space-y-8">
            
            <!-- Product Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div class="w-5 h-5 text-emerald-600" .innerHTML=${getIconHTML("package")}></div>
                Product Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Product Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required .value=${product.name} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Laptop HP ProBook">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">SKU <span class="text-red-600">*</span></label>
                  <input type="text" name="sku" required .value=${product.sku} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. SKU-001">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Category <span class="text-red-600">*</span></label>
                  <input type="text" name="category" required .value=${product.category || ""} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Electronics">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Price (Rs.) <span class="text-red-600">*</span></label>
                  <input type="number" name="price" required step="0.01" min="0" .value=${product.price} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 1500.00">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Supplier <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <select name="supplierId" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="">Select Supplier</option>
                    ${this.suppliers.map((supplier) => html`
                      <option value=${supplier.id} ?selected=${product.supplierId === supplier.id}>${supplier.companyName}</option>
                    `)}
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Product description">${product.description || ""}</textarea>
                </div>
              </div>
            </div>

            <!-- Stock Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("box").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Stock Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Quantity <span class="text-red-600">*</span></label>
                  <input type="number" name="quantity" required min="0" .value=${product.quantity} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 100">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Min Stock <span class="text-red-600">*</span></label>
                  <input type="number" name="minStock" required min="0" .value=${product.minStock} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 10">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Max Stock <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="maxStock" min="0" .value=${product.maxStock || ""} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 1000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Location <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="location" .value=${product.location || ""} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Warehouse A">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Batch Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="batchNumber" .value=${product.batchNumber || ""} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. BATCH-2024-001">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Expiry Date <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" name="expiryDate" .value=${product.expiryDate ? new Date(product.expiryDate).toISOString().split("T")[0] : ""} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="In Stock" ?selected=${product.status === "In Stock"}>In Stock</option>
                    <option value="Low Stock" ?selected=${product.status === "Low Stock"}>Low Stock</option>
                    <option value="Out of Stock" ?selected=${product.status === "Out of Stock"}>Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" @click=${this.hideFormHandler} class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
              Update Product
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("stock-management", StockManagement);
