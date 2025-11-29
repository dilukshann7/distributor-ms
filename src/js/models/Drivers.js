import axios from "axios";

export class Driver {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/drivers";
    return axios.get(apiURL);
  }
  static async findById(id) {
    const apiURL = `http://localhost:3000/api/drivers/${id}`;
    return axios.get(apiURL);
  }
}
