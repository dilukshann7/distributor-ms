import { Order } from "../../models/Order.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class PurchaseOrders {
  constructor(container) {
    this.container = container;
    this.orders = [];
    this.summary = [];
    this.view = "list";
    this.editingOrder = null;
  }

  async getOrders() {
    try {
      const response = await Order.getAll();
      this.orders = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  render() {
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Purchase Orders</h3>
          <p class="section-subtitle">Manage purchase orders</p>
        </div>
        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Recent Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Order Date</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Total</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders
                  .map(
                    (order) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${order.id}</td>
                    <td class="table-cell">
                      ${new Date(order.orderDate).toISOString().split("T")[0]}
                    </td>
                    <td class="table-cell-bold">
                      ${order.items
                        .map((i) => `${i.name} (${i.quantity})`)
                        .join(", ")}
                    </td>
                    <td class="table-cell">${order.totalAmount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "LKR",
                      }
                    )}</td>
                    <td class="table-cell">${
                      new Date(order.dueDate).toISOString().split("T")[0]
                    }</td>
                    <td class="table-cell">
                      <span class="status-badge ${this.getStatusColor(
                        order.status
                      )}">
                        ${
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="table-cell gap-2">
                    
                      <button class="btn-action text-green-600 edit-order-btn" onclick="window.supplierDashboard.sections.orders.switchToEdit('${
                        order.id
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

  getStatusColor(status) {
    const statusMap = {
      pending: "status-yellow",
      confirmed: "status-blue",
      shipped: "status-indigo",
      delivered: "status-green",
    };
    return statusMap[status] || "status-gray";
  }

  renderEditForm() {
    const order = this.editingOrder;
    if (!order) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Edit Purchase Order</h3>
            <p class="section-subtitle">Update order information</p>
          </div>
        </div>

        <form id="editOrderForm" class="card-container" onsubmit="window.supplierDashboard.sections.orders.submitEditForm(event)">
          <div class="p-8 space-y-8">
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("shopping-bag").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Order Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order ID</label>
                  <input type="text" class="input-field bg-gray-100" value="${
                    order.id
                  }" disabled>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Customer ID</label>
                  <input type="number" name="customerId" required class="input-field" value="${
                    order.customerId
                  }">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Order Date</label>
                  <input type="date" name="orderDate" required class="input-field" value="${
                    new Date(order.orderDate).toISOString().split("T")[0]
                  }">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Due Date</label>
                  <input type="date" name="dueDate" required class="input-field" value="${
                    new Date(order.dueDate).toISOString().split("T")[0]
                  }">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Total Amount (LKR)</label>
                  <div class="relative">
                    <input type="number" name="totalAmount" required min="0" step="0.01" class="input-field pl-12" value="${
                      order.totalAmount
                    }">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="input-field">
                    <option value="pending" ${
                      order.status === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="confirmed" ${
                      order.status === "confirmed" ? "selected" : ""
                    }>Confirmed</option>
                    <option value="shipped" ${
                      order.status === "shipped" ? "selected" : ""
                    }>Shipped</option>
                    <option value="delivered" ${
                      order.status === "delivered" ? "selected" : ""
                    }>Delivered</option>
                    <option value="cancelled" ${
                      order.status === "cancelled" ? "selected" : ""
                    }>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("package").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-indigo-600"'
                )}
                Order Items
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-2">Current Items:</p>
                <ul class="list-disc list-inside text-sm text-gray-700">
                  ${order.items
                    .map(
                      (item) =>
                        `<li>${item.name} - Quantity: ${item.quantity}</li>`
                    )
                    .join("")}
                </ul>
                <p class="text-xs text-gray-500 mt-2">Note: Item editing not available. Cancel and create a new order if items need to be changed.</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.supplierDashboard.sections.orders.switchToList()" class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Update Order
            </button>
          </div>
        </form>
      </div>
    `;
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

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const orderData = {
      customerId: parseInt(rawData.customerId, 10),
      orderDate: new Date(rawData.orderDate).toISOString(),
      dueDate: new Date(rawData.dueDate).toISOString(),
      totalAmount: parseFloat(rawData.totalAmount),
      status: rawData.status,
    };

    Order.update(this.editingOrder.id, orderData)
      .then(() => {
        this.getOrders().then(() => this.switchToList());
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
