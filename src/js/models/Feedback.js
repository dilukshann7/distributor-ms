import axios from "axios";
// Feedback Class
export class Feedback {
  constructor(data) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.orderId = data.orderId;
    this.rating = data.rating;
    this.comment = data.comment;
    this.category = data.category;
    this.status = data.status;
    this.response = data.response;
    this.respondedBy = data.respondedBy;
    this.respondedAt = data.respondedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/customer-feedbacks";

    return axios.get(apiURL);
  }
}
