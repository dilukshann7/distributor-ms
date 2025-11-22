import { SalesOrder } from "../../models/SalesOrder.js";

export class OrderManagement {
  constructor() {
    this.orders = [];
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

  render() {
    return this.renderList();
  }

  renderList() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Order Management</h3>
            <p class="text-gray-600 mt-1">Manage and track all distribution orders</p>
          </div>
        </div>

        <div class="dist-card">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="dist-table-th">Order ID</th>
                <th class="dist-table-th">Buyer</th>
                <th class="dist-table-th">Items</th>
                <th class="dist-table-th">Total</th>
                <th class="dist-table-th">Status</th>
                <th class="dist-table-th">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.orders
                .map(
                  (order) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="dist-table-td font-semibold text-gray-800">${
                    order.orderNumber
                  }</td>
                  <td class="dist-table-td text-gray-700">${
                    order.customerName
                  }</td>
                  <td class="dist-table-td text-gray-700">${
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
                  <td class="dist-table-td font-semibold text-gray-800">Rs. ${
                    order.subtotal
                  }</td>
                  <td class="dist-table-td">
                    <span class="dist-badge ${this.getStatusColor(
                      order.status
                    )}">
                      ${
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1).replace("-", " ")
                      }
                    </span>
                  </td>
                  <td class="dist-table-td text-gray-600">${new Date(
                    order.orderDate
                  ).toLocaleDateString()}</td>
                  
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

  getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "authorized":
        return "bg-blue-100 text-blue-800";
      case "in-transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
