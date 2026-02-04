import { LitElement, html } from "lit";
import { Delivery } from "../../models/Delivery.js";

export class DistributionRecords extends LitElement {
  static properties = {
    records: { type: Array },
  };

  constructor() {
    super();
    this.records = [];
    this.fetchDistributionData();
  }

  createRenderRoot() {
    return this;
  }

  async fetchDistributionData() {
    try {
      const response = await Delivery.getAll();
      this.records = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching distribution data:", error);
    }
  }

  render() {
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Distribution Records</h3>
          <p class="cashier-subtitle">
            Access records relevant for distributions
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Address
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Delivery Number
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Items
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.records.map(
                  (record) => html`
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 text-sm text-gray-600">
                        ${new Date(record.scheduledDate).toLocaleString()}
                      </td>
                      <td class="px-6 py-4 text-sm font-medium text-gray-900">
                        ${record.deliveryAddress}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">
                        ${record.deliveryNumber}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">
                        ${(record.salesOrders || [])
                          .map((order) => order.order?.items || [])
                          .flat()
                          .map((item) => item.name + " - " + item.quantity)
                          .join(", ")}
                      </td>
                      <td class="px-6 py-4 text-sm">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold ${record.status ===
                          "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"}"
                        >
                          ${record.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">
                        ${record.notes}
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("distribution-records", DistributionRecords);
