import { getIconHTML } from "../../../assets/icons/index.js";

export class DriverManagement {
  constructor(container) {
    this.container = container;
    this.drivers = [
      {
        id: 1,
        name: "Ravi Kumar",
        phone: "+94 71 234 5678",
        vehicle: "Van - VH-2024",
        status: "active",
        currentRoute: "Route A - 5 stops",
        lastUpdate: "2 mins ago",
      },
      {
        id: 2,
        name: "Ahmed Hassan",
        phone: "+94 77 345 6789",
        vehicle: "Truck - VH-2025",
        status: "active",
        currentRoute: "Route B - 8 stops",
        lastUpdate: "5 mins ago",
      },
      {
        id: 3,
        name: "Carlos Rodriguez",
        phone: "+94 76 456 7890",
        vehicle: "Van - VH-2023",
        status: "inactive",
        currentRoute: "Completed",
        lastUpdate: "30 mins ago",
      },
      {
        id: 4,
        name: "Maria Santos",
        phone: "+94 70 567 8901",
        vehicle: "Truck - VH-2026",
        status: "active",
        currentRoute: "Route C - 6 stops",
        lastUpdate: "1 min ago",
      },
    ];
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
                      driver.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        ${getIconHTML("phone").replace(
                          'class="w-5 h-5"',
                          'class="w-4 h-4 text-gray-400"'
                        )}
                        ${driver.phone}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      driver.vehicle
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        ${getIconHTML("map-pin").replace(
                          'class="w-5 h-5"',
                          'class="w-4 h-4 text-amber-500"'
                        )}
                        ${driver.currentRoute}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      driver.lastUpdate
                    }</td>
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
