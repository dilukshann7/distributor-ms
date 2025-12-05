import axios from "axios";
// Feedback Class
export class Feedback {
  static async getAll(filters) {
    const apiURL = "/api/customer-feedbacks";

    return axios.get(apiURL);
  }
}
