import { Task } from "../../models/Task.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class TaskAssignment {
  constructor(container) {
    this.container = container;
    this.tasks = [];
    this.view = "list";
    this.editingTask = null;
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
    if (this.view === "add") {
      return this.renderAddForm();
    }
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
    /*html*/
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Task Assignment</h3>
            <p class="manager-header-subtitle">Assign and track staff tasks and responsibilities</p>
          </div>
          <button onclick="window.managerDashboard.sections.tasks.showAddFormHandler()" class="manager-btn-primary">
            ${getIconHTML("plus")}
            Assign Task
          </button>
        </div>

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
                        task.assigneeId
                      }</span>
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="manager-badge ${this.getPriorityColor(
                        task.priority
                      )}">
                        ${task.priority.toUpperCase()}
                      </span>
                      <span class="text-xs text-gray-600">Due: ${new Date(
                        task.dueDate
                      ).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button onclick="window.managerDashboard.sections.tasks.showEditFormHandler(${
                    task.id
                  })" class="manager-btn-icon-blue">
                    ${getIconHTML("edit")}
                  </button>
                  <button onclick="window.managerDashboard.sections.tasks.deleteTaskHandler(${
                    task.id
                  })" class="manager-btn-icon-red">
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

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Assign New Task</h3>
            <p class="manager-header-subtitle">Create and assign a task to team members</p>
          </div>
        </div>

        <form id="addTaskForm" class="manager-card-overflow" onsubmit="window.managerDashboard.sections.tasks.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Task Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("clipboard").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Task Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Task Title <span class="text-red-600">*</span></label>
                  <input type="text" name="title" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Prepare monthly sales report">
                </div>
                
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Task description and requirements"></textarea>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Assignee ID <span class="text-red-600">*</span></label>
                  <input type="number" name="assigneeId" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Employee ID">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Assigner ID <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="assignerId" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Manager ID">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Due Date <span class="text-red-600">*</span></label>
                  <input type="date" name="dueDate" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Priority <span class="text-red-600">*</span></label>
                  <select name="priority" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="" disabled selected>Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Pending" selected>Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="2" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Additional notes"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.managerDashboard.sections.tasks.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              ${getIconHTML("check-circle")}
              Create Task
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const task = this.editingTask;
    if (!task) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Edit Task</h3>
            <p class="manager-header-subtitle">Update task information</p>
          </div>
        </div>

        <form id="editTaskForm" class="manager-card-overflow" onsubmit="window.managerDashboard.sections.tasks.submitEditForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Task Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("clipboard").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Task Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Task Title <span class="text-red-600">*</span></label>
                  <input type="text" name="title" required value="${task.title}" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Prepare monthly sales report">
                </div>
                
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="description" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Task description and requirements">${task.description || ""}</textarea>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Assignee ID <span class="text-red-600">*</span></label>
                  <input type="number" name="assigneeId" required value="${task.assigneeId}" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Employee ID">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Assigner ID <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="number" name="assignerId" value="${task.assignerId || ""}" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Manager ID">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Due Date <span class="text-red-600">*</span></label>
                  <input type="date" name="dueDate" required value="${task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""}" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Priority <span class="text-red-600">*</span></label>
                  <select name="priority" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
                    <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
                    <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Notes <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="notes" rows="2" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Additional notes">${task.notes || ""}</textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.managerDashboard.sections.tasks.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              ${getIconHTML("check-circle")}
              Update Task
            </button>
          </div>
        </form>
      </div>
    `;
  }

  showAddFormHandler() {
    this.view = "add";
    this.refresh();
  }

  showEditFormHandler(taskId) {
    this.editingTask = this.tasks.find((t) => t.id === taskId);
    this.view = "edit";
    this.refresh();
  }

  hideFormHandler() {
    this.view = "list";
    this.editingTask = null;
    this.refresh();
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description") || null,
      assigneeId: parseInt(formData.get("assigneeId")),
      assignerId: formData.get("assignerId") ? parseInt(formData.get("assignerId")) : null,
      dueDate: new Date(formData.get("dueDate")),
      priority: formData.get("priority"),
      status: formData.get("status"),
      notes: formData.get("notes") || null,
    };

    Task.create(taskData)
      .then(() => {
        this.getTasks().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        alert("Error creating task. Please try again.");
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description") || null,
      assigneeId: parseInt(formData.get("assigneeId")),
      assignerId: formData.get("assignerId") ? parseInt(formData.get("assignerId")) : null,
      dueDate: new Date(formData.get("dueDate")),
      priority: formData.get("priority"),
      status: formData.get("status"),
      notes: formData.get("notes") || null,
    };

    Task.update(this.editingTask.id, taskData)
      .then(() => {
        this.getTasks().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Error updating task. Please try again.");
      });
  }

  deleteTaskHandler(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    Task.delete(taskId)
      .then(() => {
        this.getTasks().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        alert("Error deleting task. Please try again.");
      });
  }

  refresh() {
    const content = this.container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
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
