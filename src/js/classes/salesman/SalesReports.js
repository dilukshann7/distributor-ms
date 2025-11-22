import { Report } from "../../models/Report.js";

export class SalesReports {
  constructor() {
    this.container = null;
  }

  render() {
    setTimeout(() => {
      this.container = document.querySelector("#dashboardContent");
    }, 0);
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Sales Reports</h2>
          <p class="text-gray-600 mt-1">View and export sales reports</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Export Reports</h4>
          <div class="grid grid-cols-1 gap-4">
          <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" id="exportStartDate" class="input-field" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="exportEndDate" class="input-field" />
              </div>
            </div>
            <button onclick="$s.reports.exportPdf()" class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async exportPdf() {
    const startDateInput = document.querySelector("#exportStartDate");
    const endDateInput = document.querySelector("#exportEndDate");

    const startDate = startDateInput?.value;
    const endDate = endDateInput?.value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date must be before end date");
      return;
    }

    try {
      await Report.exportSalesmanReport(startDate, endDate);
      alert("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  }
}
