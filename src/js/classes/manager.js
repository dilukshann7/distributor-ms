import chartBarIcon from "../../assets/icons/chart-bar.svg";
import usersIcon from "../../assets/icons/users.svg";
import checkSquareIcon from "../../assets/icons/check-square.svg";
import packageIcon from "../../assets/icons/package.svg";
import messageSquareIcon from "../../assets/icons/message-square.svg";
import truckIcon from "../../assets/icons/truck.svg";
import bellIcon from "../../assets/icons/bell.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import logOutIcon from "../../assets/icons/log-out.svg";
import menuIcon from "../../assets/icons/menu.svg";
import xIcon from "../../assets/icons/x.svg";
import clockIcon from "../../assets/icons/clock.svg";
import alertCircleIcon from "../../assets/icons/alert-circle.svg";
import plusIcon from "../../assets/icons/plus.svg";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";
import checkCircleIcon from "../../assets/icons/check-circle.svg";
import activityIcon from "../../assets/icons/activity.svg";
import logo from "../../assets/logo-tr.png";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { Product } from "../models/Product.js";
import { Feedback } from "../models/Feedback.js";
import { Delivery } from "../models/Delivery.js";
import filterIcon from "../../assets/icons/filter.svg";
import downloadIcon from "../../assets/icons/download.svg";

class ManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
    this.isSidebarOpen = true;
  }

  async render() {
    /*html*/
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto w-full">
            <div class="p-8">
              ${sectionContent}
            </div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderSidebar() {
    const menuItems = [
      { id: "overview", label: "Employee Oversight", icon: "users" },
      { id: "tasks", label: "Task Assignment", icon: "check-square" },
      { id: "reports", label: "Reports & Analytics", icon: "bar-chart" },
      { id: "stock", label: "Stock Management", icon: "package" },
      { id: "feedback", label: "Customer Feedback", icon: "message-square" },
      { id: "delivery", label: "Delivery Tracking", icon: "truck" },
    ];
    /*html*/
    return `
    
      <!-- Mobile Toggle -->
      <button id="mobileToggle" class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-emerald-600 text-white rounded-lg">
        ${this.isSidebarOpen ? this.getIcon("x") : this.getIcon("menu")}
      </button>

      <!-- Sidebar -->
      <aside class="${
        this.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-emerald-700 to-emerald-900 text-white transition-transform duration-300 z-30 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center gap-3 invert">
            <img src="${logo}" alt="Logo" class="" />
          </div>
        </div>

        <nav class="space-y-2 px-4">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                this.currentSection === item.id
                  ? "bg-white text-emerald-700 font-semibold shadow-lg"
                  : "text-emerald-100  hover:bg-emerald-600"
              }">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>
      </aside>

      <!-- Overlay for mobile -->
      ${
        this.isSidebarOpen
          ? '<div id="mobileOverlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"></div>'
          : ""
      }
    `;
  }

  renderHeader() {
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
          <p class="text-gray-600 text-sm mt-1">Manage operations and team performance</p>
        </div>

        <div class="flex items-center gap-6">
          <!-- Notifications -->
          <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- Settings -->
          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("settings")}
          </button>

          <!-- Logout -->
          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      overview: new EmployeeOversight(),
      tasks: new TaskAssignment(),
      reports: new OperationalReports(),
      stock: new StockManagement(),
      feedback: new CustomerFeedback(),
      delivery: new DeliveryTracking(),
    };
    const sectionInstance = sections[section];
    if (section === "delivery") {
      await sectionInstance.getDeliveries();
    } else if (section === "stock") {
      await sectionInstance.getProducts();
    } else if (section === "tasks") {
      await sectionInstance.getTasks();
    } else if (section === "overview") {
      await sectionInstance.getEmployees();
    } else if (section === "feedback") {
      await sectionInstance.getFeedback();
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

    const mobileToggle = this.container.querySelector("#mobileToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        this.isSidebarOpen = !this.isSidebarOpen;
        this.render();
      });
    }

    const mobileOverlay = this.container.querySelector("#mobileOverlay");
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", () => {
        this.isSidebarOpen = false;
        this.render();
      });
    }
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-white text-emerald-700 font-semibold shadow-lg";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-emerald-100 hover:bg-emerald-600";
      }
    });
  }

  getIcon(name) {
    const icons = {
      users: usersIcon,
      "check-square": checkSquareIcon,
      "bar-chart": chartBarIcon,
      package: packageIcon,
      "message-square": messageSquareIcon,
      truck: truckIcon,
      bell: bellIcon,
      settings: settingsIcon,
      "log-out": logOutIcon,
      menu: menuIcon,
      x: xIcon,
      clock: clockIcon,
      "alert-circle": alertCircleIcon,
      plus: plusIcon,
      edit: editIcon,
      trash: trashIcon,
      "check-circle": checkCircleIcon,
    };
    const src = icons[name];
    if (!src) return "";
    const sizeMap = { menu: "w-6 h-6", x: "w-6 h-6" };
    const cls = sizeMap[name] || "w-5 h-5";

    return `<img src="${src}" class="${cls}" alt="${name}" />`;
  }
}

class EmployeeOversight {
  constructor() {
    this.employees = [];
  }

  async getEmployees() {
    try {
      const response = await User.getAll();
      this.employees = response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      this.employees = [];
    }
  }

  render() {
    /*html*/
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Employee Oversight</h3>
            <p class="text-gray-600 mt-1">Monitor team performance, attendance, and schedules</p>
          </div>
          <button class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <img src="${plusIcon}" class="w-5 h-5 invert" alt="add" />
            Add Employee
          </button>
        </div>

        <!-- Employee List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900">Staff Directory</h4>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendance</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Performance</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.employees
                  .map(
                    (emp) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      emp.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${emp.role}</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${emp.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      emp.attendance
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.performance === "Excellent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${emp.performanceRating || "N/A"}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                      <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <img src="${editIcon}" class="w-4 h-4" alt="edit" />
                      </button>
                      <button class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <img src="${trashIcon}" class="w-4 h-4" alt="delete" />
                      </button>
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

class TaskAssignment {
  constructor() {
    this.tasks = [];
  }

  async getTasks() {
    try {
      const response = await Task.getAll();
      this.tasks = response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      this.tasks = [];
    }
  }

  render() {
    /*html*/
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Task Assignment</h3>
            <p class="text-gray-600 mt-1">Assign and track staff tasks and responsibilities</p>
          </div>
          <button id="assignTaskBtn" class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <img src="${plusIcon}" class="w-5 h-5" alt="add" />
            Assign Task
          </button>
        </div>

        <!-- Task Form -->
        ${
          this.showForm
            ? /*html*/
              `
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Create New Task</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Task Title" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                <option>Select Assignee</option>
                <option>Ahmed Hassan</option>
                <option>Fatima Khan</option>
                <option>Rajesh Kumar</option>
              </select>
              <input type="date" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                <option>Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <textarea placeholder="Task Description" class="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" rows="3"></textarea>
            <div class="flex gap-2 mt-4">
              <button class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">Create Task</button>
              <button id="cancelTaskBtn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
            </div>
          </div>
        `
            : ""
        }

        <!-- Tasks List -->
        <div class="space-y-3">
          ${this.tasks
            .map(
              /*html*/
              (task) => `
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4 flex-1">
                  <div class="mt-1">${this.getStatusIcon(task.status)}</div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${task.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">
                      Assigned to: <span class="font-medium">${
                        task.assignee
                      }</span>
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="text-xs font-semibold px-2 py-1 rounded ${this.getPriorityColor(
                        task.priority
                      )}">
                        ${task.priority}
                      </span>
                      <span class="text-xs text-gray-600">Due: ${
                        task.dueDate
                      }</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <img src="${editIcon}" class="w-4 h-4" alt="edit" />
                  </button>
                  <button class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <img src="${trashIcon}" class="w-4 h-4" alt="delete" />
                  </button>
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

  getStatusIcon(status) {
    switch (status) {
      case "Completed":
        return '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      case "In Progress":
        return '<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      default:
        return '<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }
  }

  getPriorityColor(priority) {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  }
}

class OperationalReports {
  constructor() {
    this.salesData = [
      {
        salesman: "Priya Singh",
        sales: 125000,
        target: 100000,
        commission: 12500,
      },
      {
        salesman: "Rajesh Kumar",
        sales: 98000,
        target: 100000,
        commission: 9800,
      },
      {
        salesman: "Amit Patel",
        sales: 145000,
        target: 100000,
        commission: 14500,
      },
      {
        salesman: "Neha Sharma",
        sales: 112000,
        target: 100000,
        commission: 11200,
      },
    ];
  }

  render() {
    return `
        <div class=" space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <p class="text-gray-500 mt-1">Generate and view business reports</p>
            </div>
            <div class="flex gap-3">
              <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors">
                <img src="${filterIcon}" class="w-4 h-4" alt="filter" />
                Filter
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                <img src="${downloadIcon}" class="w-4 h-4" alt="export" />
                Export All
              </button>
            </div>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${this.renderReportCard(
              "Financial Report",
              "Income, expenses, and profit analysis",
              "Today"
            )}
            ${this.renderReportCard(
              "Sales Report",
              "Salesman performance and targets",
              "Today"
            )}
            ${this.renderReportCard(
              "Inventory Report",
              "Stock levels and movements",
              "Yesterday"
            )}
            ${this.renderReportCard(
              "Employee Report",
              "Attendance and performance metrics",
              "2 days ago"
            )}
          </div>
        </div>
      `;
  }

  renderReportCard(title, description, lastGenerated) {
    return `
        <div class="bg-white rounded-lg shadow p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
          <p class="text-sm text-gray-500 mt-1">${description}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm text-gray-500">Last generated: ${lastGenerated}</span>
          </div>
        </div>
      `;
  }
}

class StockManagement {
  constructor() {
    this.inventory = [];
  }

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.inventory = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.inventory = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Stock Management</h3>
            <p class="text-gray-600 mt-1">Monitor and manage inventory levels</p>
          </div>
          <button class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Product
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Min Stock</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.inventory
                  .map(
                    /*html*/
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      item.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.sku}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.minStock
                    } units</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                      <button class="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">Edit</button>
                      <button class="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium">Delete</button>
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

class CustomerFeedback {
  constructor() {
    this.feedback = [];
  }

  async getFeedback() {
    try {
      const response = await Feedback.getAll();
      this.feedback = response.data;
      console.log("Fetched feedback:", this.feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      this.feedback = [];
    }
  }

  render() {
    /*html*/
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Customer Feedback</h3>
          <p class="text-gray-600 mt-1">Review and respond to customer feedback</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Average Rating</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${(
              this.feedback.reduce((sum, item) => sum + item.rating, 0) /
                this.feedback.length || 0
            ).toFixed(1)}
            </p>
            <div class="flex gap-1 mt-2">
              ${[1, 2, 3, 4, 5]
                .map(
                  () => `
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              `
                )
                .join("")}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Total Feedback</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${
              this.feedback.length
            }</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Pending Reviews</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">1</p>
          </div>
        </div>

        <div class="space-y-4">
          ${this.feedback
            .map(
              (item) => `
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h4 class="font-semibold text-gray-900">${
                      item.customerId
                    }</h4>
                    <div class="flex gap-1">
                      ${Array(item.rating)
                        .fill(0)
                        .map(
                          () => `
                        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      `
                        )
                        .join("")}
                    </div>
                    <span class="text-xs text-gray-500">${item.createdAt}</span>
                  </div>
                  <p class="text-gray-600 mt-2">${item.comment}</p>
                  <span class="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }">
                    ${item.status}
                  </span>
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

class DeliveryTracking {
  constructor() {
    this.deliveries = [];
  }

  async getDeliveries() {
    try {
      const response = await Delivery.getAll();
      this.deliveries = response.data;
      console.log("Fetched deliveries:", this.deliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    /*html*/
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery Tracking</h3>
          <p class="text-gray-600 mt-1">Monitor active deliveries and routes</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Active Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "in_transit").length}
            </p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed Today</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "delivered").length}
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "scheduled").length}
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.length}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Driver</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destination</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ETA</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveries
                  .map(
                    (delivery) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      delivery.deliveryNumber
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      delivery.driver.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      delivery.deliveryAddress
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : delivery.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${delivery.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      delivery.estimatedTime
                    } Minutes</td>
                    <td class="px-6 py-4 text-sm">
                      <button class="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">Track</button>
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

export function renderManagerDashboard(container) {
  const dashboard = new ManagerDashboard(container);
  return dashboard.render();
}
