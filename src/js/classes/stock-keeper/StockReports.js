export class StockReports {
  constructor(container) {
    this.container = container;
    this.startDate = "";
    this.endDate = "";
    this.dailyData = [
      { date: "Mon", inbound: 120, outbound: 95, balance: 25 },
      { date: "Tue", inbound: 150, outbound: 110, balance: 40 },
      { date: "Wed", inbound: 100, outbound: 130, balance: -30 },
      { date: "Thu", inbound: 200, outbound: 85, balance: 115 },
      { date: "Fri", inbound: 180, outbound: 120, balance: 60 },
      { date: "Sat", inbound: 90, outbound: 75, balance: 15 },
      { date: "Sun", inbound: 110, outbound: 100, balance: 10 },
    ];

    this.weeklyData = [
      { week: "Week 1", items: 450, value: 12500 },
      { week: "Week 2", items: 520, value: 14200 },
      { week: "Week 3", items: 380, value: 10800 },
      { week: "Week 4", items: 610, value: 16500 },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Reports</h3>
            <p class="sk-text-muted">Daily stock movements</p>
          </div>
        </div>

        
        <div class="sk-card p-6">
          <h4 class="font-bold text-gray-900 mb-4">Generate Reports</h4>
          <div class="grid grid-cols-1 gap-4">
            <button class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export to PDF
            </button>
          
          </div>
        </div>
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  attachEventListeners(container) {
    const form = container.querySelector("#dateRangeForm");
    const clearBtn = container.querySelector("#clearFilterBtn");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        this.startDate = formData.get("startDate");
        this.endDate = formData.get("endDate");
        this.refresh(this.container);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.startDate = "";
        this.endDate = "";
        this.refresh(this.container);
      });
    }
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      this.attachEventListeners(content);
    }
  }
}
