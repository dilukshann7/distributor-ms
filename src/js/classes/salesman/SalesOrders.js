import { SalesOrder } from "../../models/SalesOrder.js";
import { Product } from "../../models/Product.js";
import { Customer } from "../../models/Customer.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class SalesOrders {
  constructor(container) {
    this.container = container;
    this.orders = [];
    this.products = [];
    this.customers = [];
    this.view = "list";
    this.editingOrder = null;
  }

  async getOrders() {
    try {
      const response = await SalesOrder.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      this.orders = [];
    }
  }

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.products = [];
    }
  }

  async getCustomers() {
    try {
      const response = await Customer.getAll();
      this.customers = response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.customers = [];
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
            <h2 class="sm-header-title">Sales Orders</h2>
            <p class="sm-text-muted">Create and manage customer sales orders</p>
          </div>
          <button onclick="window.salesmanDashboard.sections.orders.showFormHandler()" class="sm-btn-primary">
            ${getIconHTML("plus")}
            New Order
          </button>
        </div>

        <div class="sm-card">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="sm-table-header">Order ID</th>
                <th class="sm-table-header">Customer</th>
                <th class="sm-table-header">Date</th>
                <th class="sm-table-header">Items</th>
                <th class="sm-table-header">Total</th>
                <th class="sm-table-header">Status</th>
                <th class="sm-table-header">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.orders
                .map(
                  (order) => `
                <tr class="sm-table-row">
                  <td class="sm-table-cell-main">${order.id}</td>
                  <td class="sm-table-cell">${order.customerName}</td>
                  <td class="sm-table-cell">${new Date(
                    order.orderDate
                  ).toLocaleDateString()}</td>
                  <td class="sm-table-cell">${
                    order.items
                      ?.filter((item) => item && item.name)
                      .map(
                        (item) =>
                          `${item.name}${
                            item.quantity ? ` (x${item.quantity})` : ""
                          }`
                      )
                      .join(", ") || "No items"
                  }</td>
                  <td class="sm-table-cell font-semibold text-gray-900">Rs. ${order.subtotal.toLocaleString()}</td>
                  <td class="px-6 py-4">
                    <span class="sm-badge ${this.getStatusColor(order.status)}">
                      ${
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 flex gap-2">
                    <button class="sm-btn-icon-blue" onclick="window.salesmanDashboard.sections.orders.switchToEdit('${
                      order.id
                    }')">
                      ${getIconHTML("edit")}
                    </button>
                    <button class="sm-btn-icon-red" onclick="window.salesmanDashboard.sections.orders.deleteOrder('${
                      order.id
                    }')">
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
    `;
  }

  renderAddForm() {
    return `
      <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sm-header-title">Create New Sales Order</h3>
            <p class="sm-text-muted">Add a new order to the system</p>
          </div>
        </div>

        <form id="addOrderForm" class="sm-card" onsubmit="window.salesmanDashboard.sections.orders.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sm-subheader">
                ${getIconHTML("shopping-cart").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Order Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sm-label">Order Number</label>
                  <input type="text" name="orderNumber" required class="sm-input" placeholder="e.g. ORD-2024-001">
                </div>
                
                <div class="space-y-2">
                  <label class="sm-label">Customer</label>
                  <select name="customerId" required class="sm-input">
                    <option value="">-- Select Customer --</option>
                    ${this.customers
                      .map(
                        (customer) => `
                      <option value="${customer.id}" data-name="${customer.name}">
                        ${customer.name}
                      </option>
                    `
                      )
                      .join("")}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Order Date</label>
                  <input type="date" name="orderDate" required class="sm-input">
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Total Amount (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-gray-500 font-medium">Rs.</span>
                    <input type="number" id="subtotal" name="subtotal" required min="0" step="0.01" class="sm-input pl-12" placeholder="0.00" readonly>
                  </div>
                  <p class="text-xs text-gray-500">Calculated automatically from items</p>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Status</label>
                  <select name="status" class="sm-input">
                    <option value="pending" selected>Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Authorized</label>
                  <select name="authorized" class="sm-input">
                    <option value="false" selected>No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sm-label">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="3" class="sm-input" placeholder="Enter order notes or special instructions..."></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sm-subheader">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Order Items
              </h4>
              <div class="space-y-4" id="itemsContainer">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 item-row sm-card-sub">
                  <div class="space-y-2 md:col-span-2">
                    <label class="block sm-label">Product</label>
                    <select name="productId[]" required class="sm-input bg-white product-select" data-row="0" onchange="window.salesmanDashboard.sections.orders.updateSubtotal(this.closest('.item-row'))">
                      <option value="">-- Select Product --</option>
                      ${this.products
                        .map(
                          (product) => `
                        <option value="${product.id}" data-name="${
                            product.name
                          }" data-price="${product.price}" data-stock="${
                            product.quantity
                          }">
                          ${product.name} - Rs. ${product.price.toFixed(
                            2
                          )} (Stock: ${product.quantity})
                        </option>
                      `
                        )
                        .join("")}
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="block sm-label">Quantity</label>
                    <input type="number" name="itemQuantity[]" required min="1" class="sm-input bg-white item-quantity" data-row="0" placeholder="1" oninput="window.salesmanDashboard.sections.orders.updateSubtotal(this.closest('.item-row'))">
                  </div>
                  <div class="space-y-2">
                    <label class="block sm-label">Subtotal</label>
                    <input type="text" class="sm-input bg-gray-100" data-row="0" readonly placeholder="Rs. 0.00">
                  </div>
                  <div class="space-y-2">
                    <label class="block sm-label">Action</label>
                    <button type="button" class="remove-item-btn sm-btn-danger-light" onclick="window.salesmanDashboard.sections.orders.removeItemRow(this)">
                      ${getIconHTML("trash")}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" onclick="window.salesmanDashboard.sections.orders.addItemRow()" class="sm-btn-secondary-accent">
                ${getIconHTML("plus")}
                Add Another Item
              </button>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.salesmanDashboard.sections.orders.switchToList()" class="sm-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sm-btn-primary">
              ${getIconHTML("check-circle")}
              Create Order
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const order = this.editingOrder;
    if (!order) return this.renderList();

    return `
      <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sm-header-title">Edit Sales Order</h3>
            <p class="sm-text-muted">Update order information</p>
          </div>
        </div>

        <form id="editOrderForm" class="sm-card" onsubmit="window.salesmanDashboard.sections.orders.submitEditForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sm-subheader">
                ${getIconHTML("shopping-cart").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Order Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sm-label">Order Number</label>
                  <input type="text" name="orderNumber" required class="sm-input" value="${
                    order.orderNumber || ""
                  }">
                </div>
                
                <div class="space-y-2">
                  <label class="sm-label">Customer Name</label>
                  <input type="text" name="customerName" required class="sm-input bg-gray-100" value="${
                    order.customerName || ""
                  }" readonly>
                  <p class="text-xs text-gray-500">Customer cannot be changed</p>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Order Date</label>
                  <input type="date" name="orderDate" required class="sm-input" value="${
                    order.orderDate ? order.orderDate.split("T")[0] : ""
                  }">
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Total Amount (LKR)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-gray-500 font-medium">Rs.</span>
                    <input type="number" name="subtotal" required min="0" step="0.01" class="sm-input pl-12" value="${
                      order.subtotal || 0
                    }">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Status</label>
                  <select name="status" class="sm-input">
                    <option value="pending" ${
                      order.status === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="confirmed" ${
                      order.status === "confirmed" ? "selected" : ""
                    }>Confirmed</option>
                    <option value="delivered" ${
                      order.status === "delivered" ? "selected" : ""
                    }>Delivered</option>
                    <option value="cancelled" ${
                      order.status === "cancelled" ? "selected" : ""
                    }>Cancelled</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Authorized</label>
                  <select name="authorized" class="sm-input">
                    <option value="false" ${
                      !order.authorized ? "selected" : ""
                    }>No</option>
                    <option value="true" ${
                      order.authorized ? "selected" : ""
                    }>Yes</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sm-label">Payment Status</label>
                  <select name="paymentStatus" class="sm-input">
                    <option value="pending" ${
                      order.paymentStatus === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="paid" ${
                      order.paymentStatus === "paid" ? "selected" : ""
                    }>Paid</option>
                    <option value="failed" ${
                      order.paymentStatus === "failed" ? "selected" : ""
                    }>Failed</option>
                    <option value="refunded" ${
                      order.paymentStatus === "refunded" ? "selected" : ""
                    }>Refunded</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="sm-label">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="3" class="sm-input">${
                    order.notes || ""
                  }</textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sm-subheader">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Order Items
              </h4>
              <div class="sm-card-sub">
                <p class="text-sm text-gray-600 mb-2">Current Items:</p>
                <ul class="list-disc list-inside text-sm text-gray-700">
                  ${
                    order.items
                      ? order.items
                          .map(
                            (item) =>
                              `<li>${item.name} - Quantity: ${item.quantity}</li>`
                          )
                          .join("")
                      : "<li>No items</li>"
                  }
                </ul>
                <p class="text-xs text-gray-500 mt-2">Note: Item editing not available. Cancel and create a new order if items need to be changed.</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.salesmanDashboard.sections.orders.switchToList()" class="sm-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sm-btn-primary">
              ${getIconHTML("check-circle")}
              Update Order
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async showFormHandler() {
    await this.getProducts();
    await this.getCustomers();
    this.view = "add";
    this.editingOrder = null;
    this.refresh(this.container);
  }

  switchToEdit(orderId) {
    this.editingOrder = this.orders.find((o) => o.id === parseInt(orderId));
    this.view = "edit";
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingOrder = null;
    this.refresh(this.container);
  }

  deleteOrder(orderId) {
    if (
      confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      SalesOrder.delete(orderId)
        .then(() => {
          this.getOrders().then(() => this.switchToList());
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
          alert("Error deleting order. Please try again.");
        });
    }
  }

  calculateTotal() {
    const rows = this.container.querySelectorAll(".item-row");
    let total = 0;

    rows.forEach((row) => {
      const subtotalInput = row.querySelector(".item-subtotal");
      if (subtotalInput && subtotalInput.value) {
        const subtotal = parseFloat(
          subtotalInput.value.replace("Rs. ", "").replace(",", "")
        );
        if (!isNaN(subtotal)) {
          total += subtotal;
        }
      }
    });

    const subtotalInput = this.container.querySelector("#subtotal");
    if (subtotalInput) {
      subtotalInput.value = total.toFixed(2);
    }
  }

  updateSubtotal(row) {
    const productSelect = row.querySelector(".product-select");
    const quantityInput = row.querySelector(".item-quantity");
    const subtotalInput = row.querySelector(".item-subtotal");

    if (productSelect && quantityInput && subtotalInput) {
      const selectedOption = productSelect.options[productSelect.selectedIndex];
      const price = parseFloat(selectedOption.dataset.price || 0);
      const quantity = parseInt(quantityInput.value || 0);
      const stock = parseInt(selectedOption.dataset.stock || 0);

      if (quantity > stock && stock > 0) {
        alert(`Only ${stock} units available in stock!`);
        quantityInput.value = stock;
        return;
      }

      const subtotal = price * quantity;
      subtotalInput.value = `Rs. ${subtotal.toFixed(2)}`;
      this.calculateTotal();
    }
  }

  addItemRow() {
    const itemsContainer = this.container.querySelector("#itemsContainer");
    const rowCount = itemsContainer.querySelectorAll(".item-row").length;
    const newRow = document.createElement("div");
    newRow.className =
      "grid grid-cols-1 md:grid-cols-5 gap-4 item-row sm-card-sub";
    newRow.innerHTML = `
      <div class="space-y-2 md:col-span-2">
        <select name="productId[]" required class="sm-input bg-white product-select" data-row="${rowCount}" onchange="window.salesmanDashboard.sections.orders.updateSubtotal(this.closest('.item-row'))">
          <option value="">-- Select Product --</option>
          ${this.products
            .map(
              (product) => `
            <option value="${product.id}" data-name="${
                product.name
              }" data-price="${product.price}" data-stock="${product.quantity}">
              ${product.name} - Rs. ${product.price.toFixed(2)} (Stock: ${
                product.quantity
              })
            </option>
          `
            )
            .join("")}
        </select>
      </div>
      <div class="space-y-2">
        <input type="number" name="itemQuantity[]" required min="1" class="sm-input bg-white item-quantity" data-row="${rowCount}" placeholder="1" oninput="window.salesmanDashboard.sections.orders.updateSubtotal(this.closest('.item-row'))">
      </div>
      <div class="space-y-2">
        <input type="text" class="sm-input bg-gray-100" data-row="${rowCount}" readonly placeholder="Rs. 0.00">
      </div>
      <div class="space-y-2">
        <button type="button" class="remove-item-btn sm-btn-danger-light" onclick="window.salesmanDashboard.sections.orders.removeItemRow(this)">
          ${getIconHTML("trash")}
          Remove
        </button>
      </div>
    `;
    itemsContainer.appendChild(newRow);
  }

  removeItemRow(btn) {
    const row = btn.closest(".item-row");
    const itemsContainer = this.container.querySelector("#itemsContainer");
    if (itemsContainer.querySelectorAll(".item-row").length > 1) {
      row.remove();
      this.calculateTotal();
    } else {
      alert("At least one item is required");
    }
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const productIds = formData.getAll("productId[]");
    const itemQuantities = formData.getAll("itemQuantity[]");

    const items = productIds
      .map((productId, index) => {
        const product = this.products.find((p) => p.id === parseInt(productId));
        return {
          name: product?.name || "Unknown",
          quantity: parseInt(itemQuantities[index], 10),
        };
      })
      .filter((item) => item.quantity > 0);

    if (items.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const customerId = parseInt(formData.get("customerId"));
    const customer = this.customers.find((c) => c.id === customerId);

    const orderData = {
      orderNumber: formData.get("orderNumber"),
      customerName: customer?.name || "Unknown Customer",
      customerId: customerId,
      orderDate: new Date(formData.get("orderDate")).toISOString(),
      status: formData.get("status"),
      paymentStatus: "unpaid", // default
      notes: formData.get("notes") || null,
      items: items,
      subtotal: parseFloat(formData.get("subtotal")),
    };

    SalesOrder.create(orderData)
      .then(() => {
        this.getOrders().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        alert("Error creating order. Please try again.");
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const orderData = {
      orderNumber: formData.get("orderNumber"),
      orderDate: new Date(formData.get("orderDate")).toISOString(),
      subtotal: parseFloat(formData.get("subtotal")),
      status: formData.get("status"),
      paymentStatus: formData.get("paymentStatus"),
      notes: formData.get("notes") || null,
    };

    SalesOrder.update(this.editingOrder.id, orderData)
      .then(() => {
        this.getOrders().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        alert("Error updating order. Please try again.");
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }

  getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
