export class DeliveryStockMaintenance {
  constructor(container) {
    this.container = container;
    this.deliveryStock = [
      {
        id: 1,
        product: "Air Freshener",
        quantity: 150,
        location: "Warehouse A",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 2,
        product: "Handwash",
        quantity: 200,
        location: "Warehouse B",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 3,
        product: "Car Interior Spray",
        quantity: 75,
        location: "Warehouse A",
        status: "low",
        deliveryDate: "2025-01-21",
      },
      {
        id: 4,
        product: "Dish Liquid",
        quantity: 300,
        location: "Warehouse C",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 5,
        product: "Alli Food Products",
        quantity: 50,
        location: "Warehouse B",
        status: "critical",
        deliveryDate: "2025-01-22",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Delivery & Stock Maintenance</h3>
            <p class="text-gray-600 text-sm mt-1">Maintain stock levels for deliveries and distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delivery Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveryStock
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      item.product
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.location
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.deliveryDate
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : item.status === "low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${
                          item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">Update</button>
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
