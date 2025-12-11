import { LitElement, html } from "lit";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Product } from "../../models/Product.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { User } from "../../models/User.js";

export class ReportsSection extends LitElement {
  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }

  exportEmployeeReport() {
    User.exportEmployeeReport();
    alert("PDF exported successfully");
  }

  exportInventoryReport() {
    Product.exportInventoryReport();
    alert("PDF exported successfully");
  }

  exportSalesReport() {
    const startDateInput = document.getElementById("sales-report-start").value;
    const endDateInput = document.getElementById("sales-report-end").value;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (!startDateInput || !endDateInput) {
      alert("Please select a start and end date.");
      return;
    }

    if (new Date(startDateInput) > new Date(endDateInput)) {
      alert("Start date must be before end date.");
      return;
    }

    SalesOrder.exportSalesReport(startDate, endDate);
    alert("PDF exported successfully");
  }

  render() {
    return html`
      <div class="owner-section-container">
        <div>
          <h3 class="section-header">Reports & Analytics</h3>
          <p class="section-subtitle">Generate and view business reports</p>
        </div>

        <div class="grid grid-cols-2 gap-6">

          <div class="card-container col-span-2">
            <div class="p-6">
              <h4 class="card-title mb-2">Sales Report</h4>
              
              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" id="sales-report-start" class="input-field" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" id="sales-report-end" class="input-field" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button @click=${this.exportSalesReport} class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  <div .innerHTML=${getIconHTML("download")}></div>
                  Generate Sales Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-4">Inventory Report</h4>

              <div class="grid grid-cols-1 gap-4">
                <button @click=${this.exportInventoryReport}
                 class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  <div .innerHTML=${getIconHTML("download")}></div>
                  Generate Inventory Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-4">Employee Report</h4>

              <div class="grid grid-cols-1 gap-4">
                <button @click=${this.exportEmployeeReport} class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  <div .innerHTML=${getIconHTML("download")}></div>
                  Generate Employee Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("reports-section", ReportsSection);
