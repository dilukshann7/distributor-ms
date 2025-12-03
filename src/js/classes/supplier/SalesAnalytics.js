import { Supply } from "../../models/Supply.js";
import { Order } from "../../models/Order.js";
import { Report } from "../../models/Report.js";
import axios from "axios";

export class SalesAnalytics {
  constructor(container) {
    this.container = container;
    this.topProducts = [];
    this.salesData = [];
    this.summary = [];
    this.period = "daily";
    this.getTopProducts();
    this.getSalesData();
  }

  async getTopProducts() {
    try {
      const response = await Supply.getMostStocked(3);
      this.topProducts = response.data;
    } catch (error) {
      console.error("Error fetching top products:", error);
      this.topProducts = [];
    }
  }

  async getSalesData() {
    try {
      const response = await Order.getDailyOrders();
      const dailyOrders = response.data;

      const weeklyResponse = await Order.getWeeklyOrders();
      const weeklyOrders = weeklyResponse.data;

      const monthlyResponse = await Order.getMonthlyOrders();
      const monthlyOrders = monthlyResponse.data;
      this.salesData = {
        daily: dailyOrders,
        weekly: weeklyOrders,
        monthly: monthlyOrders,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
      this.salesData = {
        daily: { orders: 0, revenue: 0, items: 0 },
        weekly: { orders: 0, revenue: 0, items: 0 },
        monthly: { orders: 0, revenue: 0, items: 0 },
      };
    }
  }

  render() {
    // We need to trigger the initial load of stats after render
    setTimeout(() => {
      this.handlePeriodChange(this.period).catch((e) =>
        console.error("Error initializing analytics:", e)
      );
    }, 0);

    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Sales Analytics</h3>
          <p class="section-subtitle">View sales performance and trends</p>
        </div>

        <div class="card-container">
          <div class="p-6">
            <div class="flex gap-2 mb-6">
              <button onclick="window.supplierDashboard.sections.analytics.changePeriod('daily')" class="period-selector ${
                this.period === "daily"
                  ? "period-selector-active"
                  : "period-selector-inactive"
              }">Daily</button>
              <button onclick="window.supplierDashboard.sections.analytics.changePeriod('weekly')" class="period-selector ${
                this.period === "weekly"
                  ? "period-selector-active"
                  : "period-selector-inactive"
              }">Weekly</button>
              <button onclick="window.supplierDashboard.sections.analytics.changePeriod('monthly')" class="period-selector ${
                this.period === "monthly"
                  ? "period-selector-active"
                  : "period-selector-inactive"
              }">Monthly</button>
            </div>

            <div class="stats">
              Please Wait...
            </div>
          </div>
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

  async changePeriod(period) {
    this.period = period;
    // Re-render the buttons state
    this.refresh(this.container);
    // Fetch and update stats
    await this.handlePeriodChange(period);
  }

  async handlePeriodChange(period) {
    const statSelector = this.container.querySelector(".stats");
    if (!statSelector) return;

    const apiURL = "http://localhost:3000/api/supplier/overall-summary";
    const summary = await axios.get(apiURL);

    const periodLabel =
      period === "daily"
        ? "Today"
        : period === "weekly"
        ? "This Week"
        : "This Month";
    const data = summary.data[period];

    statSelector.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="analytics-card-blue">
          <p class="text-gray-700 text-sm font-medium">Total Orders</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">${data.orders}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-green">
          <p class="text-gray-700 text-sm font-medium">Revenue</p>
          <p class="text-3xl font-bold text-green-600 mt-2">${data.revenue}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
        </div>

        <div class="analytics-card-indigo">
          <p class="text-gray-700 text-sm font-medium">Items Sold</p>
          <p class="text-3xl font-bold text-indigo-600 mt-2">${data.items}</p>
          <p class="text-xs text-gray-600 mt-2">${periodLabel}</p>
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

    Report.exportSupplierReport(startDate, endDate);
    alert("PDF exported successfully");
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
