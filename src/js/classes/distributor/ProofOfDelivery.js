import { Delivery } from "../../models/Delivery.js";

export class ProofOfDelivery {
  constructor(container, parentDashboard) {
    this.container = container;
    this.parentDashboard = parentDashboard;
    this.deliveries = [];
    this.getDeliveries();
  }

  async getDeliveries() {
    try {
      const response = await Delivery.getAll();
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    const deliveredDeliveries = this.deliveries.filter(
      (d) => d.status === "completed"
    );

    return `
    <div class="space-y-6">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">Proof of Delivery</h3>
        <p class="text-gray-600 mt-1">Manage delivery confirmations</p>
      </div>

      <div class="dist-card">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Delivered Records</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="dist-table-th">POD ID</th>
                <th class="dist-table-th">Order ID</th>
                <th class="dist-table-th">Customer</th>
                <th class="dist-table-th">Delivered By</th>
                <th class="dist-table-th">Date & Time</th>
                <th class="dist-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              ${deliveredDeliveries
                .map(
                  (delivery) => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td class="dist-table-td text-sm font-semibold text-gray-900">${
                    delivery.deliveryNumber
                  }</td>
                  <td class="dist-table-td text-sm text-orange-600 font-medium">${
                    delivery.id
                  }</td>
                  <td class="dist-table-td">
                    <div>
                      <p class="text-sm font-medium text-gray-900">${
                        delivery.deliveryAddress
                      }</p>
                    </div>
                  </td>
                  <td class="dist-table-td text-sm text-gray-900">${
                    delivery.driver.user.name
                  }</td>
                  <td class="dist-table-td text-sm text-gray-600">${new Date(
                    delivery.deliveredDate
                  ).toLocaleDateString()}</td>
                  <td class="dist-table-td">
                    <span class="dist-badge bg-green-100 text-green-800">
                      Delivered
                    </span>
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
