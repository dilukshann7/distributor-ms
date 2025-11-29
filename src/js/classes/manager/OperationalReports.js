export class OperationalReports {
  render() {
    return `
        <div class=" space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="manager-header-title">Reports & Analytics</h2>
              <p class="manager-header-subtitle">Generate and view business reports</p>
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
