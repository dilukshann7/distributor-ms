import { Supplier } from "../../models/Supplier.js";

export class SalesAnalytics {
  constructor(container) {
    this.container = container;
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Sales Analytics</h3>
          <p class="section-subtitle">View sales performance and trends</p>
        </div>
        <div class="card-container">
          <div class="p-6">
            <h4 class="card-title mb-4">Export Analytics</h4>
            
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

            <div class="grid grid-cols-1 gap-4">
              <button onclick="window.supplierDashboard.sections.analytics.exportPdf()" class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Export to PDF
              </button>
          
            </div>
          </div>
        </div>
      </div>
    `;
  }

  exportPdf() {
    const startDateInput = this.container.querySelector("#exportStartDate");
    const endDateInput = this.container.querySelector("#exportEndDate");

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

    Supplier.exportSupplierReport(startDate, endDate);
    alert("PDF exported successfully");
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
