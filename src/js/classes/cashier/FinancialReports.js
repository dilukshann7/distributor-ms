import { LitElement, html } from "lit";
import { smallOrder } from "../../models/SmallOrder";

export class FinancialReports extends LitElement {
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

  async exportPdf() {
    if (!this.startDate || !this.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert("Start date must be before end date");
      return;
    }

    try {
      await smallOrder.exportSmallOrderReport(
        new Date(this.startDate),
        new Date(this.endDate)
      );
      alert("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  }

  render() {
    return html`
      <div class="cashier-section-spacing">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Financial Reports</h3>
          <p class="cashier-subtitle">
            View and generate financial reports and analytics
          </p>
        </div>

        <div class="cashier-card">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">
            Export Reports
          </h4>
          <div class="grid grid-cols-1 gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <label class="cashier-label">Start Date</label>
                <input
                  type="date"
                  id="exportStartDate"
                  class="cashier-input"
                  .value=${this.startDate}
                  @change=${this.handleStartDateChange}
                />
              </div>
              <div class="space-y-2">
                <label class="cashier-label">End Date</label>
                <input
                  type="date"
                  id="exportEndDate"
                  class="cashier-input"
                  .value=${this.endDate}
                  @change=${this.handleEndDateChange}
                />
              </div>
            </div>
            <button
              id="exportPdfBtn"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              @click=${this.exportPdf}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("financial-reports", FinancialReports);
