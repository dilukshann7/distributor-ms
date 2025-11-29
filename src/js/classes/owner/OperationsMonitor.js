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
      <div class="p-8 space-y-6">
        <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Today's Tasks</h3>
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
                  <span class="px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
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
