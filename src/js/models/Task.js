import axios from "axios";

export class Task {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/tasks";

    return axios.get(apiURL);
  }

  static async create(task) {
    const apiURL = "http://localhost:3000/api/tasks";

    return axios.post(apiURL, task);
  }

  static async update(id, task) {
    const apiURL = `http://localhost:3000/api/tasks/${id}`;

    return axios.put(apiURL, task);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/tasks/${id}`;

    return axios.delete(apiURL);
  }
}
