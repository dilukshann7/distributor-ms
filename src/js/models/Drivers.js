import axios from "axios";

export class Driver {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.vehicleId = data.vehicleId;
    this.vehicleType = data.vehicleType;
    this.licenseNumber = data.licenseNumber;
    this.phone = data.phone;
    this.email = data.email;
    this.currentLocation = data.currentLocation;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll() {
    const apiURL = "http://localhost:3000/api/drivers";
    return axios.get(apiURL);
  }
}
