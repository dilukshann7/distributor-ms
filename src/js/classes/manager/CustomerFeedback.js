import { Feedback } from "../../models/Feedback.js";

export class CustomerFeedback {
  constructor(container) {
    this.container = container;
    this.feedback = [];
    this.getFeedback();
  }

  async getFeedback() {
    try {
      const response = await Feedback.getAll();
      this.feedback = response.data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      this.feedback = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="manager-header-title">Customer Feedback</h3>
          <p class="manager-header-subtitle">Review and respond to customer feedback</p>
        </div>
        <div class="space-y-4">
          ${this.feedback
            .map(
              (item) => `
            <div class="manager-card">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h4 class="font-semibold text-gray-900">${
                      item.customer.name
                    }</h4>
                    
                    <span class="text-xs text-gray-500">${new Date(
                      item.createdAt
                    ).toLocaleDateString()}</span>
                  </div>
                  <p class="text-gray-600 mt-2">${item.comment}</p>
                  
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
}
