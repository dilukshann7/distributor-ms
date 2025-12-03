export class ReturnsAndCancellations {
  constructor(container) {
    this.container = container;
    this.returns = [
      {
        id: "RTN-001",
        orderId: "ORD-2024-105",
        customer: "ABC Store",
        product: "Floor Cleaner",
        quantity: 5,
        reason: "Damaged packaging",
        requestDate: "2025-01-19",
        status: "pending",
      },
      {
        id: "RTN-002",
        orderId: "ORD-2024-098",
        customer: "XYZ Market",
        product: "Handwash",
        quantity: 10,
        reason: "Wrong product delivered",
        requestDate: "2025-01-18",
        status: "approved",
      },
      {
        id: "RTN-003",
        orderId: "ORD-2024-112",
        customer: "Quick Mart",
        product: "Dish Liquid",
        quantity: 3,
        reason: "Quality issue",
        requestDate: "2025-01-19",
        status: "pending",
      },
    ];

    this.cancellations = [
      {
        id: "CAN-001",
        orderId: "ORD-2024-115",
        customer: "Metro Shop",
        items: 8,
        value: 45000,
        reason: "Customer request",
        requestDate: "2025-01-19",
        status: "pending",
      },
      {
        id: "CAN-002",
        orderId: "ORD-2024-110",
        customer: "City Store",
        items: 15,
        value: 87000,
        reason: "Stock unavailable",
        requestDate: "2025-01-18",
        status: "approved",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
          <div>
            <h2 class="sm-header-title">Returns & Cancellations</h2>
            <p class="sm-text-muted">Manage product returns and order cancellations</p>
          </div>  
        <!-- Returns Table -->
        <div class="sm-card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Product Returns</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="sm-table-header">Return ID</th>
                  <th class="sm-table-header">Order ID</th>
                  <th class="sm-table-header">Customer</th>
                  <th class="sm-table-header">Product</th>
                  <th class="sm-table-header">Quantity</th>
                  <th class="sm-table-header">Reason</th>
                  <th class="sm-table-header">Date</th>
                  <th class="sm-table-header">Status</th>
                  <th class="sm-table-header">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.returns
                  .map(
                    (returnItem) => `
                  <tr class="sm-table-row">
                    <td class="sm-table-cell-main">${returnItem.id}</td>
                    <td class="px-6 py-4 text-sm text-sky-600 font-medium">${
                      returnItem.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      returnItem.customer
                    }</td>
                    <td class="sm-table-cell">${returnItem.product}</td>
                    <td class="sm-table-cell">${returnItem.quantity}</td>
                    <td class="sm-table-cell">${returnItem.reason}</td>
                    <td class="sm-table-cell">${returnItem.requestDate}</td>
                    <td class="px-6 py-4">
                      <span class="sm-badge ${
                        returnItem.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : returnItem.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          returnItem.status.charAt(0).toUpperCase() +
                          returnItem.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        returnItem.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                          <button class="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                        </div>
                      `
                          : `<button class="text-sky-600 hover:text-sky-800 text-sm font-medium">View</button>`
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cancellations Table -->
        <div class="sm-card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Order Cancellations</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="sm-table-header">Cancellation ID</th>
                  <th class="sm-table-header">Order ID</th>
                  <th class="sm-table-header">Customer</th>
                  <th class="sm-table-header">Items</th>
                  <th class="sm-table-header">Value</th>
                  <th class="sm-table-header">Reason</th>
                  <th class="sm-table-header">Date</th>
                  <th class="sm-table-header">Status</th>
                  <th class="sm-table-header">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.cancellations
                  .map(
                    (cancel) => `
                  <tr class="sm-table-row">
                    <td class="sm-table-cell-main">${cancel.id}</td>
                    <td class="px-6 py-4 text-sm text-sky-600 font-medium">${
                      cancel.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      cancel.customer
                    }</td>
                    <td class="sm-table-cell">${cancel.items} items</td>
                    <td class="sm-table-cell-main">Rs. ${cancel.value.toFixed(
                      2
                    )}</td>
                    <td class="sm-table-cell">${cancel.reason}</td>
                    <td class="sm-table-cell">${cancel.requestDate}</td>
                    <td class="px-6 py-4">
                      <span class="sm-badge ${
                        cancel.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : cancel.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          cancel.status.charAt(0).toUpperCase() +
                          cancel.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        cancel.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800 text-sm font-medium">Approve</button>
                          <button class="text-red-600 hover:text-red-800 text-sm font-medium">Reject</button>
                        </div>
                      `
                          : `<button class="text-sky-600 hover:text-sky-800 text-sm font-medium">View</button>`
                      }
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
}
