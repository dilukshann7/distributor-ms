import axios from "axios";

// Task Class
export class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.assigneeId = data.assigneeId;
    this.assignerId = data.assignerId;
    this.dueDate = data.dueDate;
    this.priority = data.priority;
    this.status = data.status;
    this.completedDate = data.completedDate;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Static methods
  static async create(taskData) {}
  static async findById(id) {}
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/tasks";

    return axios.get(apiURL);
  }
  static async getByAssignee(assigneeId) {}
  static async getByStatus(status) {}
  static async getPending() {}
  static async getInProgress() {}
  static async getCompleted() {}
  static async getOverdue() {}
  static async getByPriority(priority) {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async assignTo(employeeId) {}
  async markPending() {}
  async markInProgress() {}
  async markCompleted() {}
  async updatePriority(priority) {}
  async updateDueDate(dueDate) {}
  async getAssignee() {}
  async getAssigner() {}
  async addComment(comment) {}
  async getComments() {}
  async notifyAssignee() {}
  async sendReminder() {}
  async isOverdue() {}
  async getDaysRemaining() {}
  async getDaysOverdue() {}
}
