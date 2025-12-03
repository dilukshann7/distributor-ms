export class DistributionRecords {
  constructor() {
    this.distributionData = [
      { date: "Jan 15", deliveries: 12, items: 450 },
      { date: "Jan 16", deliveries: 15, items: 520 },
      { date: "Jan 17", deliveries: 18, items: 680 },
      { date: "Jan 18", deliveries: 14, items: 490 },
      { date: "Jan 19", deliveries: 16, items: 610 },
    ];

    this.records = [
      {
        id: 1,
        date: "2025-01-19",
        route: "Route A",
        deliveries: 5,
        items: 180,
        status: "completed",
      },
      {
        id: 2,
        date: "2025-01-19",
        route: "Route B",
        deliveries: 8,
        items: 320,
        status: "in-progress",
      },
      {
        id: 3,
        date: "2025-01-18",
        route: "Route C",
        deliveries: 6,
        items: 240,
        status: "completed",
      },
      {
        id: 4,
        date: "2025-01-18",
        route: "Route A",
        deliveries: 4,
        items: 150,
        status: "completed",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Distribution Records</h3>
            <p class="text-gray-600 text-sm mt-1">Access records relevant for distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deliveries</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.records
                  .map(
                    (record) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.date
                    }</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      record.route
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.deliveries
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.items
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }">
                        ${
                          record.status === "completed"
                            ? "Completed"
                            : "In Progress"
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">View</button>
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
