import axios from "axios";

export class Feedback {
  static async getAll(filters) {
    const apiURL = "/api/customers/feedbacks";

    return axios.get(apiURL);
  }

  static async create(feedback) {
    const apiURL = "/api/customers/feedbacks";
    return axios.post(apiURL, feedback);
  }
}
