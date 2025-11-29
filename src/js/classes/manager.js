import logo from "../../assets/logo-tr.png";
import { getIconHTML } from "../../assets/icons/index.js";
import { EmployeeOversight } from "./manager/EmployeeOversight.js";
import { TaskAssignment } from "./manager/TaskAssignment.js";
import { OperationalReports } from "./manager/OperationalReports.js";
import { StockManagement } from "./manager/StockManagement.js";
import { CustomerFeedback } from "./manager/CustomerFeedback.js";
import { DeliveryTracking } from "./manager/DeliveryTracking.js";

class ManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
    this.showNotifications = false;
    this.managerTasks = [];
  }

  async render() {
    /*html*/
    await this.loadManagerTasks();
    const sectionContent = await this.renderSection(this.currentSection);
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          ${this.renderNotificationPanel()}
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
      { id: "reports", label: "Reports & Analytics", icon: "chart-bar" },
      { id: "stock", label: "Stock Management", icon: "package" },
      { id: "feedback", label: "Customer Feedback", icon: "message-square" },
      { id: "delivery", label: "Delivery Tracking", icon: "truck" },
    ];

    return `
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
            <button data-section="${item.id}" class="manager-nav-item ${
                this.currentSection === item.id
                  ? "manager-nav-item-active"
                  : "manager-nav-item-inactive"
              }">
              ${this.getIcon(item.icon)}
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
          <h2 class="manager-header-title">Manager Dashboard</h2>
          <p class="manager-header-subtitle">Manage operations and team performance</p>
        </div>

        <div class="flex items-center gap-6">
          <button id="notificationBtn" class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("bell")}
            
          </button>
          <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ${this.getIcon("log-out")}
          </button>
        </div>
      </header>
    `;
  }

  renderNotificationPanel() {
    if (!this.showNotifications) return "";

    const pendingTasks = this.managerTasks.filter(
      (t) => t.status !== "Completed"
    );
    const completedTasks = this.managerTasks.filter(
      (t) => t.status === "Completed"
    );

    return `
      <div id="notificationPanel" class="absolute right-0 top-20 w-96 max-h-[600px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 mr-8 overflow-hidden animate-fade-in">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            ${getIconHTML("bell").replace(
              'class="w-5 h-5"',
              'class="w-6 h-6 text-white"'
            )}
            <h3 class="text-white font-bold text-lg">My Tasks</h3>
          </div>
          <button id="closeNotificationBtn" class="text-white hover:bg-emerald-800 rounded-lg p-1 transition-colors">
            ${getIconHTML("x").replace('class="w-5 h-5"', 'class="w-5 h-5"')}
          </button>
        </div>
        <div class="overflow-y-auto max-h-[400px]">
          ${
            pendingTasks.length > 0
              ? `
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h4 class="text-sm font-bold text-gray-700 flex items-center gap-2">
                ${getIconHTML("alert-circle").replace(
                  'class="w-5 h-5"',
                  'class="w-4 h-4 text-amber-600"'
                )}
                Pending Tasks
              </h4>
            </div>
            ${pendingTasks.map((task) => this.renderTaskCard(task)).join("")}
          `
              : `
            <div class="px-4 py-8 text-center text-gray-500">
              ${getIconHTML("check-circle").replace(
                'class="w-5 h-5"',
                'class="w-12 h-12 text-green-500 mx-auto mb-2"'
              )}
              <p class="text-sm">No pending tasks!</p>
            </div>
          `
          }

          ${
            completedTasks.length > 0
              ? `
            <div class="px-4 py-3 bg-gray-50 border-b border-t border-gray-200 mt-2">
              <h4 class="text-sm font-bold text-gray-700 flex items-center gap-2">
                ${getIconHTML("check-circle").replace(
                  'class="w-5 h-5"',
                  'class="w-4 h-4 text-green-600"'
                )}
                Completed Tasks
              </h4>
            </div>
            ${completedTasks
              .slice(0, 3)
              .map((task) => this.renderTaskCard(task))
              .join("")}
          `
              : ""
          }
        </div>        
      </div>
    `;
  }

  renderTaskCard(task) {
    const priorityColors = {
      High: "bg-red-100 text-red-800 border-red-300",
      Medium: "bg-amber-100 text-amber-800 border-amber-300",
      Low: "bg-green-100 text-green-800 border-green-300",
    };

    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
    };

    const isOverdue =
      new Date(task.dueDate) < new Date() && task.status !== "Completed";

    return `
      <div class="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <h5 class="font-semibold text-gray-900 text-sm truncate">${
              task.title
            }</h5>
            ${
              task.description
                ? `<p class="text-xs text-gray-600 mt-1 line-clamp-2">${task.description}</p>`
                : ""
            }
            
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <span class="px-2 py-0.5 rounded text-xs font-semibold border ${
                priorityColors[task.priority] || "bg-gray-100 text-gray-800"
              }">
                ${task.priority}
              </span>
              <span class="px-2 py-0.5 rounded text-xs font-semibold ${
                statusColors[task.status] || "bg-gray-100 text-gray-800"
              }">
                ${task.status}
              </span>
              ${
                isOverdue
                  ? `
                <span class="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                  ${getIconHTML("alert-triangle").replace(
                    'class="w-5 h-5"',
                    'class="w-3 h-3"'
                  )}
                  Overdue
                </span>
              `
                  : ""
              }
            </div>

            <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
              ${getIconHTML("calendar").replace(
                'class="w-5 h-5"',
                'class="w-3.5 h-3.5"'
              )}
              <span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          ${
            task.status !== "Completed"
              ? `
            <button onclick="window.managerDashboard.markTaskComplete(${
              task.id
            })" class="flex-shrink-0 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Mark as complete">
              ${getIconHTML("check-circle").replace(
                'class="w-5 h-5"',
                'class="w-4 h-4"'
              )}
            </button>
          `
              : `
            <div class="flex-shrink-0 p-1.5 text-green-600">
              ${getIconHTML("check-circle").replace(
                'class="w-5 h-5"',
                'class="w-4 h-4"'
              )}
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  async renderSection(section) {
    const sections = {
      overview: new EmployeeOversight(this.container),
      tasks: new TaskAssignment(this.container),
      reports: new OperationalReports(),
      stock: new StockManagement(this.container),
      feedback: new CustomerFeedback(),
      delivery: new DeliveryTracking(),
    };
    this.sections = sections;
    window.managerDashboard = this;
    const sectionInstance = sections[section];
    if (section === "delivery") {
      await sectionInstance.getDeliveries();
    } else if (section === "stock") {
      await sectionInstance.getProducts();
    } else if (section === "tasks") {
      await sectionInstance.getTasks();
      await sectionInstance.getUsers();
    } else if (section === "overview") {
      await sectionInstance.getEmployees();
    } else if (section === "feedback") {
      await sectionInstance.getFeedback();
    }
    return sectionInstance.render();
  }

  attachEventListeners() {
    const navItems = this.container.querySelectorAll(".manager-nav-item");
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

    const notificationBtn = this.container.querySelector("#notificationBtn");
    if (notificationBtn) {
      notificationBtn.addEventListener("click", () => {
        this.toggleNotifications();
      });
    }

    const closeNotificationBtn = this.container.querySelector(
      "#closeNotificationBtn"
    );
    if (closeNotificationBtn) {
      closeNotificationBtn.addEventListener("click", () => {
        this.toggleNotifications();
      });
    }
  }

  async loadManagerTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks");
      const tasks = await response.json();
      // Filter tasks assigned to manager (you can adjust this logic based on your needs)
      // For now, showing all tasks. You can filter by assigneeId === managerId
      this.managerTasks = tasks;
    } catch (error) {
      console.error("Error loading manager tasks:", error);
      this.managerTasks = [];
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    const header = this.container.querySelector("header");
    const notificationPanel =
      this.container.querySelector("#notificationPanel");

    if (this.showNotifications) {
      if (!notificationPanel) {
        header.insertAdjacentHTML("afterend", this.renderNotificationPanel());
        const closeBtn = this.container.querySelector("#closeNotificationBtn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            this.toggleNotifications();
          });
        }
      }
    } else {
      if (notificationPanel) {
        notificationPanel.remove();
      }
    }
  }

  async markTaskComplete(taskId) {
    try {
      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Completed",
          completedDate: new Date(),
        }),
      });

      await this.loadManagerTasks();
      this.toggleNotifications();
      this.toggleNotifications();
    } catch (error) {
      console.error("Error marking task as complete:", error);
      alert("Error updating task. Please try again.");
    }
  }

  async navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    const sectionContent = await this.renderSection(section);
    content.innerHTML = `<div class="p-8">${sectionContent}</div>`;

    const navItems = this.container.querySelectorAll(".manager-nav-item");
    navItems.forEach((item) => {
      if (item.dataset.section === section) {
        item.className = "manager-nav-item manager-nav-item-active";
      } else {
        item.className = "manager-nav-item manager-nav-item-inactive";
      }
    });
  }

  getIcon(name) {
    return getIconHTML(name);
  }
}

export function renderManagerDashboard(container) {
  const dashboard = new ManagerDashboard(container);
  return dashboard.render();
}
