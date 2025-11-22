import { Driver } from "../../models/Drivers.js";

export class DriverManagement {
  constructor() {
    this.drivers = [];
  }

  async getDrivers() {
    try {
      const response = await Driver.getAll();
      this.drivers = response.data;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      this.drivers = [];
    }
  }

  render() {
    return `
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
                ${this.drivers
                  .map(
                    (driver) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="dist-table-td text-sm font-medium text-gray-800">${
                      driver.name
                    }</td>
                    <td class="dist-table-td text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      ${driver.phone}
                    </td>
                    <td class="dist-table-td text-sm text-gray-600">${
                      driver.licenseNumber
                    }</td>
                    <td class="dist-table-td text-sm text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${driver.currentLocation}
                    </td>
                    <td class="dist-table-td">
                      <span class="dist-badge ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${
                          driver.status.charAt(0).toUpperCase() +
                          driver.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="dist-table-td text-sm text-gray-600">${new Date(
                      driver.updatedAt
                    ).toLocaleDateString()}</td>
                    
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
