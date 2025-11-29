import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeOversight {
  constructor(container) {
    this.container = container;
    this.employees = [];
    this.view = "list";
    this.editingEmployee = null;
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
    if (this.view === "add") {
      return this.renderAddForm();
    }
    if (this.view === "edit") {
      return this.renderEditForm();
    }
    return this.renderList();
  }

  renderList() {
    /*html*/
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Employee Oversight</h3>
            <p class="manager-header-subtitle">Monitor team performance, attendance, and schedules</p>
          </div>
          <button onclick="window.managerDashboard.sections.overview.showAddFormHandler()" class="manager-btn-primary">
            ${getIconHTML("plus")}
            Add Employee
          </button>
        </div>

        <!-- Employee List -->
        <div class="manager-card-overflow">
          <div class="p-6 border-b border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900">Staff Directory</h4>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="manager-table-header">
                <tr>
                  <th class="manager-table-th">Name</th>
                  <th class="manager-table-th">Role</th>
                  <th class="manager-table-th">Status</th>
                  <th class="manager-table-th">Attendance</th>
                  <th class="manager-table-th">Performance</th>
                  <th class="manager-table-th">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.employees
                  .map(
                    (emp) => `
                  <tr class="manager-table-row">
                    <td class="manager-table-td font-medium text-gray-900">${
                      emp.name
                    }</td>
                    <td class="manager-table-td text-gray-600">${emp.role}</td>
                    <td class="manager-table-td">
                      <span class="manager-badge ${
                        emp.status.toLowerCase() === "active"
                          ? "manager-badge-green"
                          : "manager-badge-yellow"
                      }">
                        ${emp.status}
                      </span>
                    </td>
                    <td class="manager-table-td text-gray-600">${
                      emp.attendance
                    }</td>
                    <td class="manager-table-td">
                      <span class="manager-badge ${
                        emp.performance === "Excellent"
                          ? "manager-badge-blue"
                          : "bg-gray-100 text-gray-800"
                      }">
                        ${emp.performanceRating || "N/A"}
                      </span>
                    </td>
                    <td class="manager-table-td flex gap-2">
                      <button onclick="window.managerDashboard.sections.overview.showEditFormHandler(${
                        emp.id
                      })" class="manager-btn-icon-blue">
                        ${getIconHTML("edit")}
                      </button>
                      <button onclick="window.managerDashboard.sections.overview.deleteEmployeeHandler(${
                        emp.id
                      })" class="manager-btn-icon-red">
                        ${getIconHTML("trash")}
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

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Add New Employee</h3>
            <p class="manager-header-subtitle">Create a new employee account</p>
          </div>
        </div>

        <form id="addEmployeeForm" class="manager-card-overflow" onsubmit="window.managerDashboard.sections.overview.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Password <span class="text-red-600">*</span></label>
                  <input type="password" name="password" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Enter password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Enter full address"></textarea>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="" disabled selected>Select role</option>
                    <option value="Salesman">Salesman</option>
                    <option value="Driver">Driver</option>
                    <option value="Stock Keeper">Stock Keeper</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Active" selected>Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Performance Rating</label>
                  <input type="number" name="performanceRating" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 5000">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.managerDashboard.sections.overview.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              ${getIconHTML("check-circle")}
              Add Employee
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderEditForm() {
    const emp = this.editingEmployee;
    if (!emp) return this.renderList();

    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Edit Employee</h3>
            <p class="manager-header-subtitle">Update employee information</p>
          </div>
        </div>

        <form id="editEmployeeForm" class="manager-card-overflow" onsubmit="window.managerDashboard.sections.overview.submitEditForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required value="${
                    emp.name
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required value="${
                    emp.email
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" value="${
                    emp.phone || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Password <span class="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <input type="password" name="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Enter new password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Enter full address">${
                    emp.address || ""
                  }</textarea>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Salesman" ${
                      emp.role === "Salesman" ? "selected" : ""
                    }>Salesman</option>
                    <option value="Driver" ${
                      emp.role === "Driver" ? "selected" : ""
                    }>Driver</option>
                    <option value="Stock Keeper" ${
                      emp.role === "Stock Keeper" ? "selected" : ""
                    }>Stock Keeper</option>
                    <option value="Distributor" ${
                      emp.role === "Distributor" ? "selected" : ""
                    }>Distributor</option>
                    <option value="Assistant Manager" ${
                      emp.role === "Assistant Manager" ? "selected" : ""
                    }>Assistant Manager</option>
                    <option value="Cashier" ${
                      emp.role === "Cashier" ? "selected" : ""
                    }>Cashier</option>
                    <option value="Supplier" ${
                      emp.role === "Supplier" ? "selected" : ""
                    }>Supplier</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Active" ${
                      emp.status === "Active" ? "selected" : ""
                    }>Active</option>
                    <option value="On Leave" ${
                      emp.status === "On Leave" ? "selected" : ""
                    }>On Leave</option>
                    <option value="Inactive" ${
                      emp.status === "Inactive" ? "selected" : ""
                    }>Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" value="${
                    emp.attendance || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Performance Rating</label>
                  <input type="number" name="performanceRating" value="${
                    emp.performanceRating || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" value="${
                    emp.salary || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" value="${
                    emp.bonus || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 5000">
                </div>
              </div>    
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.managerDashboard.sections.overview.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              ${getIconHTML("check-circle")}
              Update Employee
            </button>
          </div>
        </form>
      </div>
    `;
  }

  showAddFormHandler() {
    this.view = "add";
    this.refresh();
  }

  showEditFormHandler(employeeId) {
    this.editingEmployee = this.employees.find((emp) => emp.id === employeeId);
    this.view = "edit";
    this.refresh();
  }

  hideFormHandler() {
    this.view = "list";
    this.editingEmployee = null;
    this.refresh();
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const employeeData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      password: formData.get("password"),
      role: formData.get("role"),
      status: formData.get("status"),
      attendance: formData.get("attendance") || null,
      performanceRating: Number(formData.get("performanceRating")) || null,
      salary: Number(formData.get("salary")) || null,
      bonus: Number(formData.get("bonus")) || null,
    };

    User.create(employeeData)
      .then(() => {
        this.getEmployees().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error creating employee:", error);
        alert("Error creating employee. Please try again.");
      });
  }

  submitEditForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const employeeData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      role: formData.get("role"),
      status: formData.get("status"),
      attendance: formData.get("attendance") || null,
      performanceRating: Number(formData.get("performanceRating")) || null,
      salary: Number(formData.get("salary")) || null,
      bonus: Number(formData.get("bonus")) || null,
    };

    const password = formData.get("password");
    if (password) {
      employeeData.password = password;
    }

    User.update(this.editingEmployee.id, employeeData)
      .then(() => {
        this.getEmployees().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        alert("Error updating employee. Please try again.");
      });
  }

  deleteEmployeeHandler(employeeId) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    User.delete(employeeId)
      .then(() => {
        this.getEmployees().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee. Please try again.");
      });
  }

  refresh() {
    const content = this.container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
