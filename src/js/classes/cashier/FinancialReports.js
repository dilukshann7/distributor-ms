export class FinancialReports {
  render() {
    return `
      <div class="cashier-section-spacing">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Financial Reports</h3>
          <p class="cashier-subtitle">View and generate financial reports and analytics</p>
        </div>

        <div class="cashier-card">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Export Reports</h4>
          <div class="grid grid-cols-1 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
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
}
