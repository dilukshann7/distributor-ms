import axios from "axios";

export class Feedback {
  static async getAll(filters) {
    const apiURL = "/api/customer-feedbacks";

    return axios.get(apiURL);
  }

  static async create(feedback) {
    const apiURL = "/api/customer-feedbacks";
    return axios.post(apiURL, feedback);
  }
}
