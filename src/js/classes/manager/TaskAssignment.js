import { Task } from "../../models/Task.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class TaskAssignment {
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
    /*html*/
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Task Assignment</h3>
            <p class="manager-header-subtitle">Assign and track staff tasks and responsibilities</p>
          </div>
          <button id="assignTaskBtn" class="manager-btn-primary">
            ${getIconHTML("plus")}
            Assign Task
          </button>
        </div>

        <!-- Task Form -->
        ${
          this.showForm
            ? /*html*/
              `
          <div class="manager-card border-l-4 border-emerald-600">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Create New Task</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Task Title" class="manager-input" />
              <select class="manager-input">
                <option>Select Assignee</option>
                <option>Ahmed Hassan</option>
                <option>Fatima Khan</option>
                <option>Rajesh Kumar</option>
              </select>
              <input type="date" class="manager-input" />
              <select class="manager-input">
                <option>Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <textarea placeholder="Task Description" class="w-full mt-4 manager-input" rows="3"></textarea>
            <div class="flex gap-2 mt-4">
              <button class="manager-btn-primary">Create Task</button>
              <button id="cancelTaskBtn" class="manager-btn-secondary">Cancel</button>
            </div>
          </div>
        `
            : ""
        }

        <!-- Tasks List -->
        <div class="space-y-3">
          ${this.tasks
            .map(
              /*html*/
              (task) => `
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4 flex-1">
                  <div class="mt-1">${this.getStatusIcon(task.status)}</div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${task.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">
                      Assigned to: <span class="font-medium">${
                        task.assignee
                      }</span>
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="manager-badge ${this.getPriorityColor(
                        task.priority
                      )}">
                        ${task.priority}
                      </span>
                      <span class="text-xs text-gray-600">Due: ${
                        task.dueDate
                      }</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="manager-btn-icon-blue">
                    ${getIconHTML("edit")}
                  </button>
                  <button class="manager-btn-icon-red">
                    ${getIconHTML("trash")}
                  </button>
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

  getStatusIcon(status) {
    switch (status) {
      case "Completed":
        return (
          '<div class="text-green-600">' +
          getIconHTML("check-circle") +
          "</div>"
        );
      case "In Progress":
        return '<div class="text-blue-600">' + getIconHTML("clock") + "</div>";
      default:
        return (
          '<div class="text-yellow-600">' +
          getIconHTML("alert-circle") +
          "</div>"
        );
    }
  }

  getPriorityColor(priority) {
    switch (priority) {
      case "High":
        return "manager-badge-red";
      case "Medium":
        return "manager-badge-yellow";
      default:
        return "manager-badge-green";
    }
  }
}
