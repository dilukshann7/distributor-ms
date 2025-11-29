import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeManagement {
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
    return `
      <div class="p-8 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Employee Management</h2>
            <p class="text-gray-500 mt-1">Manage staff, salaries, and performance</p>
          </div>
          <button onclick="window.ownerDashboard.sections.employees.showAddFormHandler()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
            ${getIconHTML("plus")}
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
                    <td class="px-6 py-4 text-sm text-gray-900">${emp.salary.toLocaleString(
                      "en-us",
                      { style: "currency", currency: "LKR" }
                    )}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${emp.bonus.toLocaleString(
                      "en-us",
                      { style: "currency", currency: "LKR" }
                    )}</td>
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
                        ${getIconHTML("eye")}
                      </button>
                      <button onclick="window.ownerDashboard.sections.employees.showEditFormHandler(${
                        emp.id
                      })" class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                        ${getIconHTML("edit")}
                      </button>
                      <button onclick="window.ownerDashboard.sections.employees.deleteEmployeeHandler(${
                        emp.id
                      })" class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600">
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
      <div class="max-w-4xl mx-auto p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Add New Employee</h3>
            <p class="text-gray-500 mt-1">Create a new employee account</p>
          </div>
        </div>

        <form id="addEmployeeForm" class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden" onsubmit="window.ownerDashboard.sections.employees.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Password <span class="text-red-600">*</span></label>
                  <input type="password" name="password" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter full address"></textarea>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled selected>Select role</option>
                    <option value="Salesman">Salesman</option>
                    <option value="Driver">Driver</option>
                    <option value="Stock Keeper">Stock Keeper</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Active" selected>Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Performance Rating</label>
                  <input type="number" name="performanceRating" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 5000">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.ownerDashboard.sections.employees.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
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
      <div class="max-w-4xl mx-auto p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Edit Employee</h3>
            <p class="text-gray-500 mt-1">Update employee information</p>
          </div>
        </div>

        <form id="editEmployeeForm" class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden" onsubmit="window.ownerDashboard.sections.employees.submitEditForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required value="${
                    emp.name
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required value="${
                    emp.email
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" value="${
                    emp.phone || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Password <span class="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <input type="password" name="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter new password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter full address">${
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
                  'class="w-5 h-5 text-blue-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                    <option value="Manager" ${
                      emp.role === "Manager" ? "selected" : ""
                    }>Manager</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Performance Rating</label>
                  <input type="number" name="performanceRating" value="${
                    emp.performanceRating || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" value="${
                    emp.salary || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" value="${
                    emp.bonus || ""
                  }" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 5000">
                </div>
              </div>    
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.ownerDashboard.sections.employees.hideFormHandler()" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
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
      content.innerHTML = this.render();
    }
  }
}
