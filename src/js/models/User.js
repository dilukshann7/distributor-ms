import axios from "axios";

export class User {
  static async getAll() {
    const apiURL = "/api/users";

    return axios.get(apiURL);
  }

  static async create(user) {
    const apiURL = "/api/users";

    return axios.post(apiURL, user);
  }

  static async update(id, user) {
    const apiURL = `/api/users/${id}`;

    return axios.put(apiURL, user);
  }

  static async delete(id) {
    const apiURL = `/api/users/${id}`;

    return axios.delete(apiURL);
  }
}
