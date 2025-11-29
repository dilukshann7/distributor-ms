import axios from "axios";

export class FinancialReport {
  static async getMonthlyOverview() {
    const apiURL = "http://localhost:3000/api/financial-overview";
    return axios.get(apiURL);
  }
}
