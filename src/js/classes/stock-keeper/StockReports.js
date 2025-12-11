import { LitElement, html } from "lit";
import { getIconHTML } from "../../../assets/icons/index.js";
import { StockKeeper } from "../../models/StockKeeper.js";

export class StockReports extends LitElement {
  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }

  async exportPdf() {
    try {
      await StockKeeper.exportStockReport();
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
          <h2 class="text-2xl font-bold text-gray-900">Stock Reports</h2>
          <p class="sk-text-muted">View and export stock reports</p>
        </div>
        <div class="sk-card p-6">
          <h4 class="font-bold text-gray-900 mb-4">Export Reports</h4>
          <div class="grid grid-cols-1 gap-4">
            <button
              @click=${this.exportPdf}
              class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <span .innerHTML=${getIconHTML("download")}></span>
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("stock-reports", StockReports);
