import axios from "axios";

export class FinancialReport {
  static async getMonthlyOverview() {
    const apiURL = "/api/financial-overview";
    return axios.get(apiURL);
  }
}
