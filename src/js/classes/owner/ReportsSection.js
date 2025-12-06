import { getIconHTML } from "../../../assets/icons/index.js";

export class ReportsSection {
  constructor(container) {
    this.container = container;
  }

  render() {
    return `
      <div class="owner-section-container">
        <div>
          <h3 class="section-header">Reports & Analytics</h3>
          <p class="section-subtitle">Generate and view business reports</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-2">Financial Report</h4>
              
              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" id="financial-report-start" class="input-field" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" id="financial-report-end" class="input-field" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  ${getIconHTML("download")}
                  Generate Financial Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
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
                <button class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  ${getIconHTML("download")}
                  Generate Sales Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-4">Inventory Report</h4>

              <div class="grid grid-cols-1 gap-4">
                <button class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  ${getIconHTML("download")}
                  Generate Inventory Report
                </button>
              </div>
            </div>
          </div>

          <div class="card-container">
            <div class="p-6">
              <h4 class="card-title mb-4">Employee Report</h4>

              <div class="grid grid-cols-1 gap-4">
                <button class="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  ${getIconHTML("download")}
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
