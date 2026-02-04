import { LitElement, html } from "lit";
import { Feedback } from "../../models/Feedback.js";

export class CustomerFeedback extends LitElement {
  static properties = {
    feedback: { type: Array },
  };

  constructor() {
    super();
    this.feedback = [];
    this.getFeedback();
  }

  createRenderRoot() {
    return this;
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
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="manager-header-title">Customer Feedback</h3>
          <p class="manager-header-subtitle">
            Review and respond to customer feedback
          </p>
        </div>
        <div class="space-y-4">
          ${this.feedback.map(
            (item) => html`
              <div class="manager-card">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <h4 class="font-semibold text-gray-900">
                        ${item.customer.name}
                      </h4>
                    </div>
                    <p class="text-gray-600 mt-2">${item.comment}</p>
                  </div>
                </div>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("customer-feedback", CustomerFeedback);
