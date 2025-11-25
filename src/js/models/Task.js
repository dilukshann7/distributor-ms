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

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/tasks";

    return axios.get(apiURL);
  }
}
