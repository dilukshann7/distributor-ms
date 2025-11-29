import { Delivery } from "../../models/Delivery.js";

export class DeliveryRoutes {
  constructor() {
    this.routes = [];
  }

  async getDeliveryRoutes() {
    try {
      const response = await Delivery.getAll();
      this.routes = response.data;
    } catch (error) {
      console.error("Error fetching delivery routes:", error);
      this.routes = [];
    }
  }

  render() {
    const activeRoutes = this.routes.filter(
      (r) => r.status === "scheduled" || r.status === "in_transit"
    );

    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery Routes</h3>
          <p class="text-gray-600 mt-1">Optimize and manage delivery routes</p>
        </div>

        <div class="space-y-4">
          ${activeRoutes
            .map(
              (route) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
              route.status === "in_transit"
                ? "border-blue-600"
                : "border-gray-400"
            }">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">${
                        route.deliveryAddress
                      }</h4>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        route.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          route.status.charAt(0).toUpperCase() +
                          route.status.slice(1)
                        }
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">Route ID: ${
                      route.deliveryNumber
                    }</p>
                  </div>
                  
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-500">Driver</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.driver.name
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Vehicle</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.driver.vehicleId
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Distance</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.driver.currentLocation
                    }</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Est. Time</p>
                    <p class="text-sm font-semibold text-gray-900">${
                      route.estimatedTime
                    }</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Orders (${
                    route.salesOrders.length
                  })</p>
                  <div class="flex flex-wrap gap-2">
                    ${route.salesOrders
                      .map(
                        (order, index) => `
                      <span class="px-2 py-1 rounded text-xs font-medium ${
                        index < route.completedStops
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${order.orderNumber}
                      </span>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
}
