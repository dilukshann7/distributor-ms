import axios from "axios";
import { User } from "./User";

export class AssistantManager extends User {
  static async getAll() {
    const apiURL = "/api/assistant-managers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/assistant-managers/${id}`;
    return axios.get(apiURL);
  }

  static async create(assistantManagerData) {
    const apiURL = "/api/assistant-managers";
    return axios.post(apiURL, assistantManagerData);
  }

  static async update(id, assistantManagerData) {
    const apiURL = `/api/assistant-managers/${id}`;
    return axios.put(apiURL, assistantManagerData);
  }

  static async delete(id) {
    const apiURL = `/api/assistant-managers/${id}`;
    return axios.delete(apiURL);
  }
}
