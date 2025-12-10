import { LitElement, html } from "lit";
import { Supplier } from "../../models/Supplier.js";

export class SalesAnalytics extends LitElement {
  static properties = {
    startDate: { type: String },
    endDate: { type: String },
  };

  constructor() {
    super();
    this.startDate = "";
    this.endDate = "";
  }

  createRenderRoot() {
    return this;
  }

  handleStartDateChange(e) {
    this.startDate = e.target.value;
  }

  handleEndDateChange(e) {
    this.endDate = e.target.value;
  }

  exportPdf() {
    if (!this.startDate || !this.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert("Start date must be before end date");
      return;
    }

    Supplier.exportSupplierReport(this.startDate, this.endDate);
    alert("PDF exported successfully");
  }

  render() {
    return html`
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
                <input
                  type="date"
                  id="exportStartDate"
                  class="input-field"
                  .value=${this.startDate}
                  @change=${this.handleStartDateChange}
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="exportEndDate"
                  class="input-field"
                  .value=${this.endDate}
                  @change=${this.handleEndDateChange}
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <button
                @click=${this.exportPdf}
                class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
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
}

customElements.define("sales-analytics", SalesAnalytics);
