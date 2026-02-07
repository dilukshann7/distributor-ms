import { LitElement, html } from "lit";
import { Task } from "../../models/Task.js";
import { getIconHTML } from "../../../assets/icons/index.js";
import { User } from "../../models/User.js";

export class TaskAssignment extends LitElement {
  static properties = {
    tasks: { type: Array },
    view: { type: String },
    users: { type: Array },
    editingTask: { type: Object },
  };

  constructor() {
    super();
    this.tasks = [];
    this.view = "list";
    this.users = [];
    this.editingTask = null;
    this.getTasks();
    this.getUsers();
  }

  createRenderRoot() {
    return this;
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

  async getUsers() {
    try {
      const response = await User.getAll();
      this.users = response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      this.users = [];
    }
  }

  showAddFormHandler() {
    this.view = "add";
  }

  showEditFormHandler(taskId) {
    this.editingTask = this.tasks.find((t) => t.id === taskId);
    this.view = "edit";
  }

  hideFormHandler() {
    this.view = "list";
    this.editingTask = null;
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description") || null,
      assigneeId: parseInt(formData.get("assigneeId")),
      assignerId: formData.get("assignerId")
        ? parseInt(formData.get("assignerId"))
        : null,
      dueDate: new Date(formData.get("dueDate")),
      priority: formData.get("priority"),
      status: formData.get("status"),
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
      assignerId: formData.get("assignerId")
        ? parseInt(formData.get("assignerId"))
        : null,
      dueDate: new Date(formData.get("dueDate")),
      priority: formData.get("priority"),
      status: formData.get("status"),
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
    return html`
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Task Assignment</h3>
            <p class="manager-header-subtitle">
              Assign and track staff tasks and responsibilities
            </p>
          </div>
          <button @click=${this.showAddFormHandler} class="manager-btn-primary">
            <div .innerHTML=${getIconHTML("plus")}></div>
            Assign Task
          </button>
        </div>

        <div class="space-y-3">
          ${this.tasks.map(
            (task) => html`
              <div
                class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-4 flex-1">
                    <div
                      class="mt-1"
                      .innerHTML=${this.getStatusIcon(task.status)}
                    ></div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">${task.title}</h4>
                      <p class="text-sm text-gray-600 mt-1">
                        Assigned to:
                        <span class="font-medium">${task.assignee.name}</span>
                        ${task.assigner.name
                          ? html`<span class="text-gray-400 mx-2">|</span>
                              Assigned by:
                              <span class="font-medium"
                                >${task.assigner.name}</span
                              >`
                          : ""}
                      </p>
                      <div class="flex items-center gap-3 mt-2">
                        <span
                          class="manager-badge ${this.getPriorityColor(
                            task.priority,
                          )}"
                        >
                          ${task.priority.toUpperCase()}
                        </span>
                        <span class="text-xs text-gray-600"
                          >Due:
                          ${new Date(task.dueDate).toLocaleDateString()}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click=${() => this.showEditFormHandler(task.id)}
                      class="manager-btn-icon-blue"
                    >
                      <div .innerHTML=${getIconHTML("edit")}></div>
                    </button>
                    <button
                      @click=${() => this.deleteTaskHandler(task.id)}
                      class="manager-btn-icon-red"
                    >
                      <div .innerHTML=${getIconHTML("trash")}></div>
                    </button>
                  </div>
                </div>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  renderAddForm() {
    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Assign New Task</h3>
            <p class="manager-header-subtitle">
              Create and assign a task to team members
            </p>
          </div>
        </div>

        <form
          id="addTaskForm"
          class="manager-card-overflow"
          @submit=${this.submitAddForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                <div
                  class="w-5 h-5 text-emerald-600"
                  .innerHTML=${getIconHTML("clipboard")}
                ></div>
                Task Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Task Title <span class="text-red-600">*</span></label
                  >
                  <input
                    type="text"
                    name="title"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Prepare monthly sales report"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Task description and requirements"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Assignee ID <span class="text-red-600">*</span></label
                  >
                  <select
                    name="assigneeId"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select an assignee</option>
                    ${this.users.map(
                      (user) => html`
                        <option value=${user.id}>${user.name}</option>
                      `,
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Assigner ID
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <select
                    name="assignerId"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select an assigner</option>
                    ${this.users.map(
                      (user) => html`
                        <option value=${user.id}>${user.name}</option>
                      `,
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Due Date <span class="text-red-600">*</span></label
                  >
                  <input
                    type="date"
                    name="dueDate"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Priority <span class="text-red-600">*</span></label
                  >
                  <select
                    name="priority"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="" disabled selected>Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Status</label
                  >
                  <select
                    name="status"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Pending" selected>Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.hideFormHandler}
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
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

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Edit Task</h3>
            <p class="manager-header-subtitle">Update task information</p>
          </div>
        </div>

        <form
          id="editTaskForm"
          class="manager-card-overflow"
          @submit=${this.submitEditForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                <div
                  class="w-5 h-5 text-emerald-600"
                  .innerHTML=${getIconHTML("clipboard")}
                ></div>
                Task Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Task Title <span class="text-red-600">*</span></label
                  >
                  <input
                    type="text"
                    name="title"
                    required
                    .value=${task.title}
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Prepare monthly sales report"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Description
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="description"
                    rows="3"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Task description and requirements"
                  >
${task.description || ""}</textarea
                  >
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Assignee ID <span class="text-red-600">*</span></label
                  >
                  <select
                    name="assigneeId"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select an assignee</option>
                    ${this.users.map(
                      (user) => html`
                        <option
                          value=${user.id}
                          ?selected=${task.assigneeId === user.id}
                        >
                          ${user.name}
                        </option>
                      `,
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Assigner ID
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <select
                    name="assignerId"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select an assigner</option>
                    ${this.users.map(
                      (user) => html`
                        <option
                          value=${user.id}
                          ?selected=${task.assignerId === user.id}
                        >
                          ${user.name}
                        </option>
                      `,
                    )}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Due Date <span class="text-red-600">*</span></label
                  >
                  <input
                    type="date"
                    name="dueDate"
                    required
                    .value=${task.dueDate
                      ? new Date(task.dueDate).toISOString().split("T")[0]
                      : ""}
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Priority <span class="text-red-600">*</span></label
                  >
                  <select
                    name="priority"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="High" ?selected=${task.priority === "High"}>
                      High
                    </option>
                    <option
                      value="Medium"
                      ?selected=${task.priority === "Medium"}
                    >
                      Medium
                    </option>
                    <option value="Low" ?selected=${task.priority === "Low"}>
                      Low
                    </option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Status</label
                  >
                  <select
                    name="status"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option
                      value="Pending"
                      ?selected=${task.status === "Pending"}
                    >
                      Pending
                    </option>
                    <option
                      value="In Progress"
                      ?selected=${task.status === "In Progress"}
                    >
                      In Progress
                    </option>
                    <option
                      value="Completed"
                      ?selected=${task.status === "Completed"}
                    >
                      Completed
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.hideFormHandler}
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
              Update Task
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("task-assignment", TaskAssignment);
