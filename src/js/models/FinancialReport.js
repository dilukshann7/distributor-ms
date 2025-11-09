import axios from "axios";

export class FinancialReport {
  constructor(data) {
    this.id = data.id;
    this.reportType = data.reportType; // daily, weekly, monthly, annual
    this.reportPeriod = data.reportPeriod;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.totalSales = data.totalSales;
    this.totalExpenses = data.totalExpenses;
    this.netProfit = data.netProfit;
    this.profitMargin = data.profitMargin;
    this.generatedBy = data.generatedBy;
    this.generatedAt = data.generatedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getMonthlyOverview() {
    const apiURL = "http://localhost:3000/api/financial-overview";
    return axios.get(apiURL);
  }
}
