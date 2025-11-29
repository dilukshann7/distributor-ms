import { Task } from "../../models/Task.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class OperationsMonitor {
  constructor() {
    this.tasks = [];
  }

  async getTasks() {
    try {
      const response = await Task.getAll();
      this.tasks = response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      this.tasks = [];
    }
  }

  render() {
    return `
      <div class="owner-section-container">
        <div class="owner-card p-6">
          <h3 class="owner-section-title">Today's Tasks</h3>
          <div class="space-y-3">
            ${this.tasks
              .map(
                (task) => `
              <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">${task.title}</p>
                  <p class="text-sm text-gray-500 mt-1">Assigned to: ${
                    task.assignee.name
                  }</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">${new Date(
                    task.dueDate
                  ).toLocaleDateString()}</span>
                  <span class="owner-badge ${
                    task.status === "Completed"
                      ? "owner-badge-success"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "owner-badge-warning"
                  }">
                    ${task.status}
                  </span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }
}
