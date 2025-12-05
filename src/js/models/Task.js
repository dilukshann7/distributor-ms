import axios from "axios";

export class Task {
  static async getAll(filters) {
    const apiURL = "/api/tasks";

    return axios.get(apiURL);
  }

  static async create(task) {
    const apiURL = "/api/tasks";

    return axios.post(apiURL, task);
  }

  static async update(id, task) {
    const apiURL = `/api/tasks/${id}`;

    return axios.put(apiURL, task);
  }

  static async delete(id) {
    const apiURL = `/api/tasks/${id}`;

    return axios.delete(apiURL);
  }
}
