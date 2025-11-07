import logo from "../../assets/logo.png";
import chartBarIcon from "../../assets/icons/chart-bar.svg";
import usersIcon from "../../assets/icons/users.svg";
import packageIcon from "../../assets/icons/package.svg";
import activityIcon from "../../assets/icons/activity.svg";
import fileTextIcon from "../../assets/icons/file-text.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import logOutIcon from "../../assets/icons/log-out.svg";
import searchIcon from "../../assets/icons/search.svg";
import bellIcon from "../../assets/icons/bell.svg";
import userCircleIcon from "../../assets/icons/user-circle.svg";
import trendUpIcon from "../../assets/icons/trend-up.svg";
import plusIcon from "../../assets/icons/plus.svg";
import eyeIcon from "../../assets/icons/eye.svg";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";
import clockIcon from "../../assets/icons/clock.svg";
import downloadIcon from "../../assets/icons/download.svg";
import filterIcon from "../../assets/icons/filter.svg";
import { Product } from "../models/Product.js";

class OwnerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
  }

  /*html*/
  async render() {
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto bg-gray-50">
            <div class="p-8 text-center text-gray-500">Loading...</div>
          </main>
        </div>
      </div>
    `;
    this.attachEventListeners();
    
    // Load initial section content
    const content = this.container.querySelector("#dashboardContent");
    const html = await this.renderSection(this.currentSection);
    content.innerHTML = html;
  }
  /*html*/
  renderSidebar() {
    const menuItems = [
      { id: "overview", label: "Financial Overview", icon: "chart-bar" },
      { id: "employees", label: "Employee Management", icon: "users" },
      { id: "inventory", label: "Inventory Control", icon: "package" },
      { id: "operations", label: "Operations Monitor", icon: "activity" },
      { id: "reports", label: "Reports & Analytics", icon: "file-text" },
    ];
    /*html*/
    return `
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div>
              <img src="${logo}" alt="Logo" />
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-2">
          ${menuItems
            .map(
              (item) => `
            <button data-section="${
              item.id
            }" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                this.currentSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }">
              ${this.getIcon(item.icon)}
              <span class="text-sm font-medium">${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="p-4 border-t border-gray-200 space-y-2">
          <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            ${this.getIcon("settings")}
            <span class="text-sm font-medium">Settings</span>
          </button>
          <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            ${this.getIcon("log-out")}
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    /*html*/
    return `
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <img src="${searchIcon}" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" alt="search" />
            <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div class="flex items-center gap-4 ml-8">
          <button class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <img src="${bellIcon}" class="w-5 h-5" alt="notifications" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Owner</p>
              <p class="text-xs text-gray-500">Admin Account</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <img src="${userCircleIcon}" class="w-5 h-5 text-white" alt="user" />
            </div>
          </div>
        </div>
      </header>
    `;
  }

  async renderSection(section) {
    const sections = {
      overview: new FinancialOverview(),
      employees: new EmployeeManagement(),
      inventory: new InventoryControl(),
      operations: new OperationsMonitor(),
      reports: new ReportsSection(),
    };
    
    const sectionInstance = sections[section];
    
    // For inventory section, load data first
    if (section === 'inventory') {
      await sectionInstance.getProducts();
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
    
    // Show loading state
    content.innerHTML = '<div class="p-8 text-center text-gray-500">Loading...</div>';
    
    // Load and render section
    const html = await this.renderSection(section);
    content.innerHTML = html;

    const navItems = this.container.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white";
      } else {
        item.className =
          "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100";
      }
    });
  }

  getIcon(name) {
    const icons = {
      "chart-bar": chartBarIcon,
      users: usersIcon,
      package: packageIcon,
      activity: activityIcon,
      "file-text": fileTextIcon,
      settings: settingsIcon,
      "log-out": logOutIcon,
    };
    const src = icons[name];
    return src ? `<img src="${src}" class="w-5 h-5" alt="${name}" />` : "";
  }
}

class FinancialOverview {
  constructor() {
    this.data = [
      { month: "Jan", income: 45000, expenses: 32000, profit: 13000 },
      { month: "Feb", income: 52000, expenses: 35000, profit: 17000 },
      { month: "Mar", income: 48000, expenses: 33000, profit: 15000 },
      { month: "Apr", income: 61000, expenses: 38000, profit: 23000 },
      { month: "May", income: 55000, expenses: 36000, profit: 19000 },
      { month: "Jun", income: 67000, expenses: 40000, profit: 27000 },
    ];
  }

  render() {
    /*html*/
    return `
      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${this.renderStatCard(
            "Total Income",
            "Rs. 328,000",
            "+12.5% from last month",
            "green",
            "dollar"
          )}
          ${this.renderStatCard(
            "Total Expenses",
            "Rs. 181,000",
            "+5.2% from last month",
            "red",
            "trending-down"
          )}
          ${this.renderStatCard(
            "Net Profit",
            "Rs. 147,000",
            "+18.3% from last month",
            "green",
            "pie-chart"
          )}
          ${this.renderStatCard(
            "Profit Margin",
            "44.8%",
            "+2.1% from last month",
            "purple",
            "percent"
          )}
        </div>

        

        <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Monthly Comparison</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Month</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Income</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expenses</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Profit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.data
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      item.month
                    }</td>
                    <td class="px-6 py-4 text-sm text-blue-600 font-medium">Rs. ${item.income.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-red-600 font-medium">Rs. ${item.expenses.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-green-600 font-medium">Rs. ${item.profit.toLocaleString()}</td>
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

  renderStatCard(title, value, change, color, icon) {
    const colors = {
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
    };
    /*html*/
    return `
    
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-2">${title}</p>
            <p class="text-3xl font-bold text-gray-900">${value}</p>
            <p class="text-xs ${
              color === "red" ? "text-red-600" : "text-green-600"
            } mt-2 flex items-center gap-1">
              <img src="${trendUpIcon}" class="w-4 h-4" alt="trend" />
              ${change}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg ${
            colors[color]
          } flex items-center justify-center">
            <span class="text-lg font-bold">${
              icon === "percent" ? "%" : "$"
            }</span>
          </div>
        </div>
      </div>
    `;
  }
}

class EmployeeManagement {
  constructor() {
    this.employees = [
      {
        id: 1,
        name: "Rajesh Kumar",
        role: "Manager",
        salary: 45000,
        bonus: 5000,
        attendance: 95,
        status: "Active",
      },
      {
        id: 2,
        name: "Priya Singh",
        role: "Salesman",
        salary: 30000,
        bonus: 3000,
        attendance: 92,
        status: "Active",
      },
      {
        id: 3,
        name: "Amit Patel",
        role: "Driver",
        salary: 25000,
        bonus: 2000,
        attendance: 88,
        status: "Active",
      },
      {
        id: 4,
        name: "Neha Sharma",
        role: "Stock Keeper",
        salary: 28000,
        bonus: 2500,
        attendance: 96,
        status: "Active",
      },
      {
        id: 5,
        name: "Vikram Desai",
        role: "Cashier",
        salary: 26000,
        bonus: 2200,
        attendance: 90,
        status: "Inactive",
      },
    ];
  }

  render() {
    /*html*/
    return `
      <div class="p-8 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Employee Management</h2>
            <p class="text-gray-500 mt-1">Manage staff, salaries, and performance</p>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
            <img src="${plusIcon}" class="w-4 h-4" alt="add" />
            Add Employee
          </button>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Salary</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bonus</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Attendance</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.employees
                  .map(
                    /*html*/
                    (emp) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${
                      emp.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${emp.role}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">₹${emp.salary.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">₹${emp.bonus.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm">
                      <div class="flex items-center gap-2">
                        <div class="w-32 bg-gray-200 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: ${
                            emp.attendance
                          }%"></div>
                        </div>
                        <span class="text-gray-900 font-medium">${
                          emp.attendance
                        }%</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }">
                        ${emp.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex items-center gap-2">
                      <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                        <img src="${eyeIcon}" class="w-4 h-4" alt="view" />
                      </button>
                      <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                        <img src="${editIcon}" class="w-4 h-4" alt="edit" />
                      </button>
                      <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600">
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

class InventoryControl {
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
    /*html*/
    return `
      <div class="p-8 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Inventory Control</h2>
            <p class="text-gray-500 mt-1">Manage stock levels and product details</p>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
            <img src="${plusIcon}" class="w-4 h-4" alt="add" />
            Add Product
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-3xl font-bold text-gray-900">1,180</p>
            <p class="text-xs text-gray-500">5 products in stock</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p class="text-sm text-gray-500">Low Stock Items</p>
            <p class="text-3xl font-bold text-yellow-600">2</p>
            <p class="text-xs text-yellow-600">Requires attention</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p class="text-sm text-gray-500">Stock Value</p>
            <p class="text-3xl font-bold text-gray-900">₹4,27,500</p>
            <p class="text-xs text-gray-500">Total inventory value</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Min Stock</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.inventory
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${
                      item.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${item.sku}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.minStock
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-900">₹${
                      item.price
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex items-center gap-2">
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

class OperationsMonitor {
  constructor() {
    this.tasks = [
      {
        id: 1,
        title: "Process supplier order",
        status: "Completed",
        assignee: "Rajesh Kumar",
        dueTime: "10:30 AM",
      },
      {
        id: 2,
        title: "Verify stock count",
        status: "In Progress",
        assignee: "Neha Sharma",
        dueTime: "02:00 PM",
      },
      {
        id: 3,
        title: "Prepare delivery routes",
        status: "Pending",
        assignee: "Amit Patel",
        dueTime: "03:30 PM",
      },
      {
        id: 4,
        title: "Process customer payments",
        status: "Completed",
        assignee: "Vikram Desai",
        dueTime: "11:45 AM",
      },
    ];
  }

  render() {
    /*html*/
    return `
      <div class="p-8 space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Operations Monitor</h2>
          <p class="text-gray-500 mt-1">Real-time business operations tracking</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${this.renderStatCard(
            "Active Orders",
            "28",
            "+5 from yesterday",
            "blue",
            "clock"
          )}
          ${this.renderStatCard(
            "Completed Deliveries",
            "24",
            "96% on-time",
            "green",
            "check"
          )}
          ${this.renderStatCard(
            "Pending Tasks",
            "12",
            "3 overdue",
            "yellow",
            "alert"
          )}
          ${this.renderStatCard(
            "Active Staff",
            "14",
            "All present",
            "purple",
            "users"
          )}
        </div>

        <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Today's Tasks</h3>
          <div class="space-y-3">
            ${this.tasks
              .map(
                (task) => `
              <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">${task.title}</p>
                  <p class="text-sm text-gray-500 mt-1">Assigned to: ${
                    task.assignee
                  }</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">${task.dueTime}</span>
                  <span class="px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }">
                    ${task.status}
                  </span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  renderStatCard(title, value, subtitle, color, icon) {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      purple: "bg-purple-100 text-purple-600",
    };

    /*html*/
    return `
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-2">${title}</p>
            <p class="text-3xl font-bold text-gray-900">${value}</p>
            <p class="text-xs text-${color} mt-2">${subtitle}</p>
          </div>
          <div class="w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center">
            <img src="${clockIcon}" class="w-6 h-6" alt="icon" />
          </div>
        </div>
      </div>
    `;
  }
}

class ReportsSection {
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
    /*html*/
    return `
      <div class="p-8 space-y-6">
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

        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Commission Breakdown</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Salesman</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Sales</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Achievement</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commission</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.salesData
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${
                      item.salesman
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">₹${item.sales.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">₹${item.target.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="text-green-600 font-medium">${(
                        (item.sales / item.target) *
                        100
                      ).toFixed(0)}%</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">₹${item.commission.toLocaleString()}</td>
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

  renderReportCard(title, description, lastGenerated) {
    /*html*/
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

export async function renderOwnerDashboard(container) {
  const dashboard = new OwnerDashboard(container);
  await dashboard.render();
}
