import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";

class AssistantManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "payments";
    this.isSidebarOpen = true;
  }

  render() {
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto">
            <div class="p-8">
              ${this.renderSection(this.currentSection)}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderSidebar() {
    const menuItems = [
      { id: "payments", label: "Payment Verification", icon: "dollar" },
      { id: "delivery-stock", label: "Delivery & Stock", icon: "package" },
      { id: "drivers", label: "Driver Management", icon: "truck" },
      { id: "distribution", label: "Distribution Records", icon: "bar-chart" },
    ];
    return `
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-amber-700 to-amber-800 text-white transition-transform duration-300 z-30 overflow-y-auto">
        <img src="${logo}" alt="Logo" class="w-full invert h-auto p-4" />

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-amber-700 font-semibold shadow-lg"
                  : "text-amber-100 hover:bg-amber-600"
              }">
              ${getIconHTML(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>
      </aside>
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Assistant Manager Dashboard</h2>
          <p class="text-gray-500 text-sm mt-1">Data verification and operational support</p>
        </div>

        <div class="flex items-center gap-6">
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${getIconHTML("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      payments: new PaymentVerification(),
      "delivery-stock": new DeliveryStockMaintenance(),
      drivers: new DriverManagement(),
      distribution: new DistributionRecords(),
    };
    const sectionInstance = sections[section];
    if (section === "emergency") {
      await sectionInstance.getEmergencyData();
    }
    return sectionInstance.render();
  }

  attachEventListeners() {
    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateToSection(section);
      });
    });

    const logoutBtn = this.container.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        import("../login.js").then((module) => {
          module.renderLogin(this.container);
        });
      });
    }
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    content.innerHTML = `<div class="p-8">${await this.renderSection(
      section
    )}</div>`;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-amber-700 font-semibold shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-amber-100 hover:bg-amber-600";
      }
    });
  }
}

class PaymentVerification {
  constructor() {
    this.payments = [
      {
        id: 1,
        type: "Cash Collection",
        amount: 5200,
        source: "Salesman - Ahmed",
        date: "2025-01-19",
        status: "pending",
      },
      {
        id: 2,
        type: "Check Payment",
        amount: 3500,
        source: "Customer - ABC Store",
        date: "2025-01-19",
        status: "verified",
      },
      {
        id: 3,
        type: "Online Transfer",
        amount: 8900,
        source: "Customer - XYZ Retail",
        date: "2025-01-18",
        status: "verified",
      },
      {
        id: 4,
        type: "Cash Collection",
        amount: 2100,
        source: "Salesman - Ravi",
        date: "2025-01-18",
        status: "pending",
      },
      {
        id: 5,
        type: "Check Payment",
        amount: 4500,
        source: "Customer - DEF Mart",
        date: "2025-01-17",
        status: "verified",
      },
    ];
  }

  render() {
    return `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Payment Verification Workflow</h3>
            <p class="text-gray-600 text-sm mt-1">Verify cash and check payments collected by sales team</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      payment.type
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">$${payment.amount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.source
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.date
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                            Verify
                          </button>
                          <button class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      `
                          : ""
                      }
                    </td>
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

class DeliveryStockMaintenance {
  constructor() {
    this.deliveryStock = [
      {
        id: 1,
        product: "Air Freshener",
        quantity: 150,
        location: "Warehouse A",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 2,
        product: "Handwash",
        quantity: 200,
        location: "Warehouse B",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 3,
        product: "Car Interior Spray",
        quantity: 75,
        location: "Warehouse A",
        status: "low",
        deliveryDate: "2025-01-21",
      },
      {
        id: 4,
        product: "Dish Liquid",
        quantity: 300,
        location: "Warehouse C",
        status: "ready",
        deliveryDate: "2025-01-20",
      },
      {
        id: 5,
        product: "Alli Food Products",
        quantity: 50,
        location: "Warehouse B",
        status: "critical",
        deliveryDate: "2025-01-22",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Delivery & Stock Maintenance</h3>
            <p class="text-gray-600 text-sm mt-1">Maintain stock levels for deliveries and distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delivery Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveryStock
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      item.product
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.location
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      item.deliveryDate
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : item.status === "low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${
                          item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">Update</button>
                    </td>
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

class DriverManagement {
  constructor() {
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
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Driver Management & Communication</h3>
            <p class="text-gray-600 text-sm mt-1">Manage drivers and maintain communication system</p>
          </div>
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
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
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
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">Message</button>
                    </td>
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

class DistributionRecords {
  constructor() {
    this.distributionData = [
      { date: "Jan 15", deliveries: 12, items: 450 },
      { date: "Jan 16", deliveries: 15, items: 520 },
      { date: "Jan 17", deliveries: 18, items: 680 },
      { date: "Jan 18", deliveries: 14, items: 490 },
      { date: "Jan 19", deliveries: 16, items: 610 },
    ];

    this.records = [
      {
        id: 1,
        date: "2025-01-19",
        route: "Route A",
        deliveries: 5,
        items: 180,
        status: "completed",
      },
      {
        id: 2,
        date: "2025-01-19",
        route: "Route B",
        deliveries: 8,
        items: 320,
        status: "in-progress",
      },
      {
        id: 3,
        date: "2025-01-18",
        route: "Route C",
        deliveries: 6,
        items: 240,
        status: "completed",
      },
      {
        id: 4,
        date: "2025-01-18",
        route: "Route A",
        deliveries: 4,
        items: 150,
        status: "completed",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Distribution Records</h3>
            <p class="text-gray-600 text-sm mt-1">Access records relevant for distributions</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deliveries</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.records
                  .map(
                    (record) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.date
                    }</td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      record.route
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.deliveries
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      record.items
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }">
                        ${
                          record.status === "completed"
                            ? "Completed"
                            : "In Progress"
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">View</button>
                    </td>
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

export function renderAssistantManagerDashboard(container) {
  const dashboard = new AssistantManagerDashboard(container);
  dashboard.render();
}
