import { getIconHTML } from "../../../assets/icons/index.js";

export class OperationalReports {
  constructor() {
    this.salesData = [
      {
        salesman: "Priya Singh",
        sales: 125000,
        target: 100000,
        commission: 12500,
      },
      {
        salesman: "Rajesh Kumar",
        sales: 98000,
        target: 100000,
        commission: 9800,
      },
      {
        salesman: "Amit Patel",
        sales: 145000,
        target: 100000,
        commission: 14500,
      },
      {
        salesman: "Neha Sharma",
        sales: 112000,
        target: 100000,
        commission: 11200,
      },
    ];
  }

  render() {
    return `
        <div class=" space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <p class="text-gray-500 mt-1">Generate and view business reports</p>
            </div>
            <div class="flex gap-3">
              <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors">
                ${getIconHTML("filter")}
                Filter
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                ${getIconHTML("download")}
                Export All
              </button>
            </div>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${this.renderReportCard(
              "Financial Report",
              "Income, expenses, and profit analysis",
              "Today"
            )}
            ${this.renderReportCard(
              "Sales Report",
              "Salesman performance and targets",
              "Today"
            )}
            ${this.renderReportCard(
              "Inventory Report",
              "Stock levels and movements",
              "Yesterday"
            )}
            ${this.renderReportCard(
              "Employee Report",
              "Attendance and performance metrics",
              "2 days ago"
            )}
          </div>
        </div>
      `;
  }

  renderReportCard(title, description, lastGenerated) {
    return `
        <div class="bg-white rounded-lg shadow p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
          <p class="text-sm text-gray-500 mt-1">${description}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm text-gray-500">Last generated: ${lastGenerated}</span>
          </div>
        </div>
      `;
  }
}
