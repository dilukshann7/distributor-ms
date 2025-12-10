import { LitElement, html } from "lit";
import { Driver } from "../../models/Driver.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class DriverManagement extends LitElement {
  static properties = {
    drivers: { type: Array },
  };

  constructor() {
    super();
    this.drivers = [];
    this.getDrivers();
  }

  createRenderRoot() {
    return this;
  }

  async getDrivers() {
    try {
      const response = await Driver.getAll();
      this.drivers = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching drivers:", error);
      this.drivers = [];
    }
  }

  render() {
    return html`
    <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Driver Management & Communication</h3>
            <p class="text-gray-600 mt-1">Manage drivers and maintain communication system</p>
          </div>
        </div>
        <div class="dist-card">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="dist-table-th">Driver Name</th>
                  <th class="dist-table-th">Contact</th>
                  <th class="dist-table-th">Vehicle</th>
                  <th class="dist-table-th">Current Route</th>
                  <th class="dist-table-th">Status</th>
                  <th class="dist-table-th">Last Update</th>
                </tr>
              </thead>
              <tbody>
                ${this.drivers.map(
                  (driver) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="dist-table-td text-sm font-medium text-gray-800">${
                      driver.user.name
                    }</td>
                    <td class="dist-table-td text-sm text-gray-600 flex items-center gap-2">
                      <span class="text-gray-400" .innerHTML=${getIconHTML(
                        "phone"
                      ).replace("w-5 h-5", "w-4 h-4")}></span>
                      ${driver.user.phone}
                    </td>
                    <td class="dist-table-td text-sm text-gray-600">${
                      driver.licenseNumber
                    }</td>
                    <td class="dist-table-td text-sm text-gray-600 flex items-center gap-2">
                      <span class="text-amber-500" .innerHTML=${getIconHTML(
                        "map-pin"
                      ).replace("w-5 h-5", "w-4 h-4")}></span>
                      ${driver.currentLocation}
                    </td>
                    <td class="dist-table-td">
                      <span class="dist-badge ${
                        driver.user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${
                          driver.user.status.charAt(0).toUpperCase() +
                          driver.user.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="dist-table-td text-sm text-gray-600">${new Date(
                      driver.user.updatedAt
                    ).toLocaleDateString()}</td>
                    
                  </tr>
                `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define("driver-management-dist", DriverManagement);
