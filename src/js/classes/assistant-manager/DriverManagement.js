import { getIconHTML } from "../../../assets/icons/index.js";
import { Driver } from "../../models/Driver.js";

export class DriverManagement {
  constructor(container, parentDashboard) {
    this.container = container;
    this.parentDashboard = parentDashboard;
    this.drivers = [];
    this.fetchDrivers();
  }

  async fetchDrivers() {
    try {
      const response = await Driver.getAll();
      this.drivers = response.data;
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Driver Management & Communication</h3>
          <p class="cashier-subtitle">Manage drivers and maintain communication system</p>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Driver Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Current Route</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Update</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.drivers
                  .map(
                    (driver) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      driver.user.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        ${getIconHTML("phone").replace(
                          'class="w-5 h-5"',
                          'class="w-4 h-4 text-gray-400"'
                        )}
                        ${driver.user.phone}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${`${driver.licenseNumber} - ${driver.vehicleType}`}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        ${getIconHTML("map-pin").replace(
                          'class="w-5 h-5"',
                          'class="w-4 h-4 text-amber-500"'
                        )}
                        ${driver.currentLocation}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${
                          driver.user.status.charAt(0).toUpperCase() +
                          driver.user.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${new Date(
                      driver.user.updatedAt
                    ).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
