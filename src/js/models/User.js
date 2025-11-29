import axios from "axios";

export class User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/users";

    return axios.get(apiURL);
  }

  static async create(user) {
    const apiURL = "http://localhost:3000/api/users";

    return axios.post(apiURL, user);
  }

  static async update(id, user) {
    const apiURL = `http://localhost:3000/api/users/${id}`;

    return axios.put(apiURL, user);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/users/${id}`;

    return axios.delete(apiURL);
  }
}
