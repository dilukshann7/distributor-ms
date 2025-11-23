import { getIconHTML } from "../../../assets/icons";

export class StockAuditing {
  constructor() {
    this.audits = [
      {
        id: 1,
        date: "2024-10-15",
        itemName: "Air Freshener",
        sku: "AF-001",
        physicalCount: 445,
        systemCount: 450,
        discrepancy: -5,
        status: "minor",
        auditor: "John Doe",
      },
      {
        id: 2,
        date: "2024-10-15",
        itemName: "Handwash",
        sku: "HW-002",
        physicalCount: 42,
        systemCount: 45,
        discrepancy: -3,
        status: "minor",
        auditor: "John Doe",
      },
      {
        id: 3,
        date: "2024-10-14",
        itemName: "Car Interior Spray",
        sku: "CIS-003",
        physicalCount: 318,
        systemCount: 320,
        discrepancy: -2,
        status: "resolved",
        auditor: "Jane Smith",
      },
      {
        id: 4,
        date: "2024-10-14",
        itemName: "Dish Liquid",
        sku: "DL-004",
        physicalCount: 85,
        systemCount: 78,
        discrepancy: 7,
        status: "resolved",
        auditor: "Jane Smith",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Auditing</h3>
            <p class="sk-text-muted">Physical inventory counts and discrepancy tracking</p>
          </div>
          <button class="sk-btn-primary px-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Start New Audit
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          ${[
            {
              label: "Total Audits",
              value: "24",
              icon: "check-circle",
              color: "text-green-600",
            },
            {
              label: "Discrepancies",
              value: "4",
              icon: "alert-circle",
              color: "text-yellow-600",
            },
            {
              label: "Resolved",
              value: "2",
              icon: "check-circle",
              color: "text-blue-600",
            },
            {
              label: "Accuracy Rate",
              value: "98.5%",
              icon: "trending-up",
              color: "text-purple-600",
            },
          ]
            .map(
              (stat) => `
            <div class="sk-card p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 font-medium">${stat.label}</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">${
                    stat.value
                  }</p>
                </div>
                ${getIconHTML(stat.icon)}
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Audits Table -->
        <div class="sk-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="sk-table-header">Date</th>
                  <th class="sk-table-header">Item</th>
                  <th class="sk-table-header">Physical Count</th>
                  <th class="sk-table-header">System Count</th>
                  <th class="sk-table-header">Discrepancy</th>
                  <th class="sk-table-header">Status</th>
                  <th class="sk-table-header">Auditor</th>
                  <th class="sk-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.audits
                  .map(
                    (audit) => `
                  <tr class="sk-table-row">
                    <td class="sk-table-cell">${audit.date}</td>
                    <td class="py-3 px-4">
                      <div>
                        <p class="font-medium text-gray-900">${
                          audit.itemName
                        }</p>
                        <p class="text-xs text-gray-600">${audit.sku}</p>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-900 font-medium">${
                      audit.physicalCount
                    }</td>
                    <td class="py-3 px-4 text-gray-900 font-medium">${
                      audit.systemCount
                    }</td>
                    <td class="py-3 px-4">
                      <span class="font-bold ${
                        audit.discrepancy < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }">
                        ${audit.discrepancy > 0 ? "+" : ""}${audit.discrepancy}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusColor(
                        audit.status
                      )}">
                        ${
                          audit.status.charAt(0).toUpperCase() +
                          audit.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="sk-table-cell">${audit.auditor}</td>
                    <td class="py-3 px-4">
                      <button class="text-purple-600 hover:text-purple-800 font-medium text-sm">
                        Review
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

        <!-- Audit Instructions -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h5 class="font-semibold text-purple-900 mb-1">Audit Best Practices</h5>
              <ul class="text-sm text-purple-800 space-y-1">
                <li>• Conduct regular audits to maintain inventory accuracy</li>
                <li>• Count items during low-activity periods for better accuracy</li>
                <li>• Document all discrepancies and investigate root causes</li>
                <li>• Use barcode scanning for faster and more accurate counts</li>
                <li>• Update system counts immediately after physical verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case "minor":
        return "sk-badge-yellow";
      case "major":
        return "sk-badge-red";
      case "resolved":
        return "sk-badge-green";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
}
