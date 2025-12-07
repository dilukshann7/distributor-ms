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
    /*html*/
    return `
      <div class="space-y-6">
        <div>
          <h3 class="manager-header-title">Customer Feedback</h3>
          <p class="manager-header-subtitle">Review and respond to customer feedback</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="manager-card">
            <p class="text-gray-600 text-sm">Average Rating</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${(
              this.feedback.reduce((sum, item) => sum + item.rating, 0) /
                this.feedback.length || 0
            ).toFixed(1)}
            </p>
            <div class="flex gap-1 mt-2">
              ${[1, 2, 3, 4, 5]
                .map(
                  () => `
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              `
                )
                .join("")}
            </div>
          </div>
          <div class="manager-card">
            <p class="text-gray-600 text-sm">Total Feedback</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.feedback.length
            }</p>
          </div>
          <div class="manager-card">
            <p class="text-gray-600 text-sm">Pending Reviews</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">1</p>
          </div>
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
                      item.customerId
                    }</h4>
                    <div class="flex gap-1">
                      ${Array(item.rating)
                        .fill(0)
                        .map(
                          () => `
                        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      `
                        )
                        .join("")}
                    </div>
                    <span class="text-xs text-gray-500">${item.createdAt}</span>
                  </div>
                  <p class="text-gray-600 mt-2">${item.comment}</p>
                  <span class="inline-block mt-3 manager-badge ${
                    item.status === "Resolved"
                      ? "manager-badge-green"
                      : item.status === "Pending"
                      ? "manager-badge-yellow"
                      : "manager-badge-blue"
                  }">
                    ${item.status}
                  </span>
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
