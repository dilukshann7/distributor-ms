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

  // Static methods
  static async create(feedbackData) {}
  static async findById(id) {}
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/customer-feedbacks";

    return axios.get(apiURL);
  }
  static async getByCustomer(customerId) {}
  static async getByOrder(orderId) {}
  static async getByRating(rating) {}
  static async getPending() {}
  static async getResolved() {}
  static async getAverageRating(startDate, endDate) {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async markPending() {}
  async markInReview() {}
  async markResolved() {}
  async getCustomer() {}
  async getOrder() {}
  async addResponse(response) {}
  async notifyCustomer() {}
  async escalate() {}
  async generateReport() {}
}
