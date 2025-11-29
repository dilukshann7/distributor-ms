import axios from "axios";
// Feedback Class
export class Feedback {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/customer-feedbacks";

    return axios.get(apiURL);
  }
}
