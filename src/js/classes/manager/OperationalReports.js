import { LitElement, html } from "lit";
import { getIconHTML } from "../../../assets/icons/index.js";
import { Product } from "../../models/Product.js";
import { SalesOrder } from "../../models/SalesOrder.js";
import { User } from "../../models/User.js";
import { CashFlowReport } from "../../models/CashFlowReport.js";

export class OperationalReports extends LitElement {
  static properties = {};

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

  exportCashFlowReport() {
    const startDateInput = document.getElementById("cash-flow-start").value;
    const endDateInput = document.getElementById("cash-flow-end").value;

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

    CashFlowReport.exportCashFlowReport(startDate, endDate);
    alert("Cash Flow Report exported successfully");
  }

  render() {
    return html`
      <div class=" space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="manager-header-title">Reports & Analytics</h2>
            <p class="manager-header-subtitle">
              Generate and view business reports
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="card-container col-span-2">
            <div class="p-6">
              <h4 class="card-title mb-2">Sales Report</h4>

              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Start Date</label
                  >
                  <input
                    type="date"
                    id="sales-report-start"
                    class="input-field"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >End Date</label
                  >
                  <input
                    type="date"
                    id="sales-report-end"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button
                  @click=${this.exportSalesReport}
                  class="manager-btn-large"
                >
                  <div .innerHTML=${getIconHTML("download")}></div>
                  Generate Sales Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container col-span-2">
            <div class="p-6">
              <h4 class="card-title mb-2">Cash Flow Report</h4>

              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Start Date</label
                  >
                  <input type="date" id="cash-flow-start" class="input-field" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >End Date</label
                  >
                  <input type="date" id="cash-flow-end" class="input-field" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button
                  @click=${this.exportCashFlowReport}
                  class="manager-btn-large bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <div .innerHTML=${getIconHTML("download")}></div>
                  Generate Cash Flow Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-4">Inventory Report</h4>

              <div class="grid grid-cols-1 gap-4">
                <button
                  @click=${this.exportInventoryReport}
                  class="manager-btn-large"
                >
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
                <button
                  @click=${this.exportEmployeeReport}
                  class="manager-btn-large"
                >
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

customElements.define("operational-reports", OperationalReports);
