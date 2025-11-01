class ManagerDashboard {
  constructor(container) {
    this.container = container;
    this.currentSection = "overview";
    this.isSidebarOpen = true;
  }

  render() {
    this.container.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        ${this.renderSidebar()}
        <div class="flex-1 flex flex-col overflow-hidden">
          ${this.renderHeader()}
          <main id="dashboardContent" class="flex-1 overflow-auto w-full">
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
      { id: "overview", label: "Employee Oversight", icon: "users" },
      { id: "tasks", label: "Task Assignment", icon: "check-square" },
      { id: "reports", label: "Reports & Analytics", icon: "bar-chart" },
      { id: "stock", label: "Stock Management", icon: "package" },
      { id: "feedback", label: "Customer Feedback", icon: "message-square" },
      { id: "delivery", label: "Delivery Tracking", icon: "truck" },
    ];

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
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold">DBMS</h2>
              <p class="text-xs text-emerald-100">Manager Portal</p>
            </div>
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
                  : "text-emerald-100 hover:bg-emerald-600"
              }">
              ${this.getIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
            )
            .join("")}
        </nav>

        <div class="absolute bottom-6 left-6 right-6 p-4 bg-emerald-600 rounded-lg">
          <p class="text-sm text-emerald-100">Manager Account</p>
          <p class="font-semibold text-white mt-1">John Manager</p>
        </div>
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

  renderSection(section) {
    const sections = {
      overview: new EmployeeOversight(),
      tasks: new TaskAssignment(),
      reports: new OperationalReports(),
      stock: new StockManagement(),
      feedback: new CustomerFeedback(),
      delivery: new DeliveryTracking(),
    };
    return sections[section].render();
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

  navigateToSection(section) {
    this.currentSection = section;
    const content = this.container.querySelector("#dashboardContent");
    content.innerHTML = `<div class="p-8">${this.renderSection(section)}</div>`;

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
      users:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      "check-square":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
      "bar-chart":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      package:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      "message-square":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
      truck:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      settings:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      "log-out":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
      menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
      x: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      clock:
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      "alert-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      plus: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>',
      edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      trash:
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      "check-circle":
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    return icons[name] || "";
  }
}

class EmployeeOversight {
  constructor() {
    this.employees = [
      {
        id: 1,
        name: "Ahmed Hassan",
        role: "Salesman",
        status: "Active",
        attendance: "95%",
        performance: "Excellent",
      },
      {
        id: 2,
        name: "Fatima Khan",
        role: "Driver",
        status: "Active",
        attendance: "92%",
        performance: "Good",
      },
      {
        id: 3,
        name: "Rajesh Kumar",
        role: "Stock Keeper",
        status: "Active",
        attendance: "88%",
        performance: "Good",
      },
      {
        id: 4,
        name: "Maria Santos",
        role: "Cashier",
        status: "On Leave",
        attendance: "85%",
        performance: "Excellent",
      },
      {
        id: 5,
        name: "Hassan Ali",
        role: "Distributor",
        status: "Active",
        attendance: "98%",
        performance: "Excellent",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Employee Oversight</h3>
            <p class="text-gray-600 mt-1">Monitor team performance, attendance, and schedules</p>
          </div>
          <button class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Employee
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Staff</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">15</p>
              </div>
              <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Present Today</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">14</p>
              </div>
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Absent/Late</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">1</p>
              </div>
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
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
                        ${emp.performance}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                      <button class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
    this.tasks = [
      {
        id: 1,
        title: "Deliver to Colombo Central",
        assignee: "Ahmed Hassan",
        dueDate: "Today",
        priority: "High",
        status: "In Progress",
      },
      {
        id: 2,
        title: "Stock Inventory Check",
        assignee: "Rajesh Kumar",
        dueDate: "Today",
        priority: "Medium",
        status: "Pending",
      },
      {
        id: 3,
        title: "Customer Follow-up Calls",
        assignee: "Fatima Khan",
        dueDate: "Tomorrow",
        priority: "Medium",
        status: "Pending",
      },
      {
        id: 4,
        title: "Process Supplier Orders",
        assignee: "Maria Santos",
        dueDate: "Today",
        priority: "High",
        status: "Completed",
      },
      {
        id: 5,
        title: "Vehicle Maintenance Check",
        assignee: "Hassan Ali",
        dueDate: "Tomorrow",
        priority: "Low",
        status: "Pending",
      },
    ];
    this.showForm = false;
  }

  render() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Task Assignment</h3>
            <p class="text-gray-600 mt-1">Assign and track staff tasks and responsibilities</p>
          </div>
          <button id="assignTaskBtn" class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Assign Task
          </button>
        </div>

        <!-- Task Form -->
        ${
          this.showForm
            ? `
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
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
    this.metrics = [
      { label: "Total Orders", value: "248", change: "+12%", color: "blue" },
      {
        label: "Completed Deliveries",
        value: "235",
        change: "+8%",
        color: "green",
      },
      { label: "Pending Tasks", value: "13", change: "-5%", color: "yellow" },
      {
        label: "Customer Satisfaction",
        value: "94%",
        change: "+2%",
        color: "purple",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Operational Reports</h3>
          <p class="text-gray-600 mt-1">Analytics and performance metrics</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.metrics
            .map(
              (metric) => `
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-${metric.color}-600">
              <p class="text-gray-600 text-sm">${metric.label}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">${metric.value}</p>
              <p class="text-xs text-${metric.color}-600 mt-2">${metric.change} from last month</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h4>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Chart visualization would be here</p>
          </div>
        </div>
      </div>
    `;
  }
}

class StockManagement {
  constructor() {
    this.inventory = [
      {
        id: 1,
        name: "Air Freshener",
        sku: "AF-001",
        quantity: 450,
        minStock: 100,
        status: "In Stock",
      },
      {
        id: 2,
        name: "Hand Wash",
        sku: "HW-002",
        quantity: 280,
        minStock: 150,
        status: "In Stock",
      },
      {
        id: 3,
        name: "Car Interior Spray",
        sku: "CIS-003",
        quantity: 85,
        minStock: 100,
        status: "Low Stock",
      },
      {
        id: 4,
        name: "Dish Liquid",
        sku: "DL-004",
        quantity: 320,
        minStock: 200,
        status: "In Stock",
      },
      {
        id: 5,
        name: "Alli Food Products",
        sku: "AFP-005",
        quantity: 45,
        minStock: 100,
        status: "Critical",
      },
    ];
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
    this.feedback = [
      {
        id: 1,
        customer: "John Doe",
        rating: 5,
        comment: "Excellent service and fast delivery!",
        date: "2024-01-15",
        status: "Resolved",
      },
      {
        id: 2,
        customer: "Jane Smith",
        rating: 4,
        comment: "Good products, slight delay in delivery.",
        date: "2024-01-14",
        status: "Pending",
      },
      {
        id: 3,
        customer: "Mike Johnson",
        rating: 5,
        comment: "Very satisfied with the quality!",
        date: "2024-01-13",
        status: "Resolved",
      },
      {
        id: 4,
        customer: "Sarah Williams",
        rating: 3,
        comment: "Product quality could be better.",
        date: "2024-01-12",
        status: "In Review",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Customer Feedback</h3>
          <p class="text-gray-600 mt-1">Review and respond to customer feedback</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600 text-sm">Average Rating</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">4.25</p>
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
                      item.customer
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
                    <span class="text-xs text-gray-500">${item.date}</span>
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
    this.deliveries = [
      {
        id: 1,
        orderId: "ORD-001",
        driver: "Ahmed Hassan",
        destination: "Colombo",
        status: "In Transit",
        eta: "2:30 PM",
      },
      {
        id: 2,
        orderId: "ORD-002",
        driver: "Fatima Khan",
        destination: "Kandy",
        status: "Delivered",
        eta: "Completed",
      },
      {
        id: 3,
        orderId: "ORD-003",
        driver: "Hassan Ali",
        destination: "Galle",
        status: "Pending",
        eta: "4:00 PM",
      },
      {
        id: 4,
        orderId: "ORD-004",
        driver: "Ahmed Hassan",
        destination: "Jaffna",
        status: "In Transit",
        eta: "5:15 PM",
      },
    ];
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery Tracking</h3>
          <p class="text-gray-600 mt-1">Monitor active deliveries and routes</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Active Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">2</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed Today</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">1</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">1</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">4</p>
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
                      delivery.orderId
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      delivery.driver
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      delivery.destination
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
                      delivery.eta
                    }</td>
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
  dashboard.render();
}
