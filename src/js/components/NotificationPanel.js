import { getIconHTML } from "../../assets/icons/index.js";

export class NotificationPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.showNotifications = false;
    this.tasks = [];
    this.apiEndpoint = "http://localhost:3000/api/tasks";
  }

  async loadTasks() {
    try {
      const response = await fetch(this.apiEndpoint);
      let tasks = await response.json();

      this.tasks = tasks;
    } catch (error) {
      console.error("Error loading tasks:", error);
      this.tasks = [];
    }
  }

  renderPanel() {
    if (!this.showNotifications) return "";

    const pendingTasks = this.tasks.filter((t) => t.status !== "Completed");
    const completedTasks = this.tasks.filter((t) => t.status === "Completed");

    return `
      <div id="notificationPanel" class="absolute right-0 top-20 w-96 max-h-[600px] bg-white shadow-lg rounded border border-gray-300 z-50 mr-8 overflow-hidden">
        <div class="bg-gray-700 px-4 py-3 flex items-center justify-between">
          <h3 class="text-white font-semibold">Notifications</h3>
          <button id="closeNotificationBtn" class="text-white hover:text-gray-300">
            ×
          </button>
        </div>
        <div class="overflow-y-auto max-h-[400px]">
          ${
            pendingTasks.length > 0
              ? `
            <div class="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <h4 class="text-sm font-semibold text-gray-700">Pending Tasks</h4>
            </div>
            ${pendingTasks.map((task) => this.renderTaskCard(task)).join("")}
          `
              : `
            <div class="px-4 py-8 text-center text-gray-500">
              <p class="text-sm">No pending tasks</p>
            </div>
          `
          }

          ${
            completedTasks.length > 0
              ? `
            <div class="px-4 py-2 bg-gray-100 border-b border-t border-gray-200 mt-2">
              <h4 class="text-sm font-semibold text-gray-700">Completed Tasks</h4>
            </div>
            ${completedTasks
              .slice(0, 3)
              .map((task) => this.renderTaskCard(task))
              .join("")}
          `
              : ""
          }
        </div>        
      </div>
    `;
  }

  renderTaskCard(task) {
    const priorityColors = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700",
    };

    const statusColors = {
      Pending: "bg-gray-100 text-gray-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
    };

    const isOverdue =
      new Date(task.dueDate) < new Date() && task.status !== "Completed";

    return `
      <div class="px-4 py-3 border-b border-gray-200 hover:bg-gray-50">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <h5 class="font-medium text-gray-900 text-sm">${task.title}</h5>
            ${
              task.description
                ? `<p class="text-xs text-gray-600 mt-1">${task.description}</p>`
                : ""
            }
            
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-0.5 rounded text-xs ${
                priorityColors[task.priority] || "bg-gray-100 text-gray-700"
              }">
                ${task.priority}
              </span>
              <span class="px-2 py-0.5 rounded text-xs ${
                statusColors[task.status] || "bg-gray-100 text-gray-700"
              }">
                ${task.status}
              </span>
              ${
                isOverdue
                  ? `<span class="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">Overdue</span>`
                  : ""
              }
            </div>

            <div class="mt-2 text-xs text-gray-500">
              Due: ${new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>

          ${
            task.status !== "Completed"
              ? `
            <button onclick="window.notificationPanel.markTaskComplete(${task.id})" class="text-green-600 hover:text-green-700 text-sm" title="Mark as complete">
              ✓
            </button>
          `
              : `
            <div class="text-green-600 text-sm">✓</div>
          `
          }
        </div>
      </div>
    `;
  }

  toggle() {
    this.showNotifications = !this.showNotifications;
    const header = this.container.querySelector("header");
    const notificationPanel =
      this.container.querySelector("#notificationPanel");

    if (this.showNotifications) {
      if (!notificationPanel) {
        header.insertAdjacentHTML("afterend", this.renderPanel());
        const closeBtn = this.container.querySelector("#closeNotificationBtn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            this.toggle();
          });
        }
      }
    } else {
      if (notificationPanel) {
        notificationPanel.remove();
      }
    }
  }

  async markTaskComplete(taskId) {
    try {
      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Completed",
          completedDate: new Date(),
        }),
      });

      await this.loadTasks();
      this.toggle();
      this.toggle();

      // Call custom callback if provided
      if (this.options.onTaskComplete) {
        this.options.onTaskComplete(taskId);
      }
    } catch (error) {
      console.error("Error marking task as complete:", error);
      alert("Error updating task. Please try again.");
    }
  }

  attachEventListeners() {
    const notificationBtn = this.container.querySelector("#notificationBtn");
    if (notificationBtn) {
      notificationBtn.addEventListener("click", () => {
        this.toggle();
      });
    }

    const closeNotificationBtn = this.container.querySelector(
      "#closeNotificationBtn"
    );
    if (closeNotificationBtn) {
      closeNotificationBtn.addEventListener("click", () => {
        this.toggle();
      });
    }
  }
}
