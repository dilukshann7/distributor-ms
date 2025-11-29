import { getIconHTML } from "../../../assets/icons/index.js";

export class ReportsSection {
  constructor() {}

  render() {
    return `
      <div class="owner-section-container">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="owner-title">Reports & Analytics</h2>
            <p class="owner-subtitle">Generate and view business reports</p>
          </div>
          <div class="flex gap-3">
            <button class="owner-btn-secondary flex items-center gap-2">
              ${getIconHTML("filter")}
              Filter
            </button>
            <button class="owner-btn-primary">
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
      <div class="owner-card p-5 cursor-pointer hover:shadow-lg transition-shadow">
        <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
        <p class="text-sm text-gray-500 mt-1">${description}</p>
        <div class="flex items-center justify-between mt-3">
          <span class="text-sm text-gray-500">Last generated: ${lastGenerated}</span>
        </div>
      </div>
    `;
  }
}
