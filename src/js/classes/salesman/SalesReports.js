import { LitElement, html } from "lit";
import { Salesman } from "../../models/Salesman.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class SalesReports extends LitElement {
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
      await Salesman.exportReport(this.startDate, this.endDate);
      alert("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  }

  render() {
    return html`
      <div class="space-y-6">
        <div>
          <h2 class="sm-header-title">Sales Reports</h2>
          <p class="sm-text-muted">View and export sales reports</p>
        </div>
        <div class="sm-card p-6">
          <h4 class="sm-subheader">Export Reports</h4>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="sm-label">Start Date</label>
                <input
                  type="date"
                  id="exportStartDate"
                  class="sm-input"
                  .value=${this.startDate}
                  @change=${this.handleStartDateChange}
                />
              </div>
              <div class="space-y-2">
                <label class="sm-label">End Date</label>
                <input
                  type="date"
                  id="exportEndDate"
                  class="sm-input"
                  .value=${this.endDate}
                  @change=${this.handleEndDateChange}
                />
              </div>
            </div>
            <button @click=${this.exportPdf} class="sm-btn-danger">
              <span .innerHTML=${getIconHTML("document")}></span>
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("sales-reports", SalesReports);
