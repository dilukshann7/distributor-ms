import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeManagement {
  constructor(container) {
    this.container = container;
    this.employees = [];
    this.view = "list";
    this.editingEmployee = null;
    this.getEmployees();
  }

  async getEmployees() {
    try {
      const response = await User.getAll();
      this.employees = response.data.map((user) => {
        const profile = this.getProfile(user);
        return {
          ...user,
          salary: profile?.salary || 0,
          bonus: profile?.bonus || 0,
          attendance: profile?.attendance || "0",
          performanceRating: profile?.performanceRating || 0,
        };
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      this.employees = [];
    }
  }

  getProfile(user) {
    const profileMap = {
      Driver: user.driverProfile,
      Salesman: user.salesmanProfile,
      "Stock Keeper": user.stockKeeperProfile,
      Cashier: user.cashierProfile,
      Distributor: user.distributorProfile,
      "Assistant Manager": user.assistantManagerProfile,
      Manager: user.managerProfile,
      Supplier: user.supplierProfile,
    };
    return profileMap[user.role];
  }

  showAddFormHandler() {
    this.view = "add";
    this.view = "add";
    this.container.querySelector("#dashboardContent").innerHTML = this.render();
  }

  showEditFormHandler(employeeId) {
    this.editingEmployee = this.employees.find((emp) => emp.id === employeeId);
    this.view = "edit";
    this.editingEmployee = this.employees.find((emp) => emp.id === employeeId);
    this.view = "edit";
    this.container.querySelector("#dashboardContent").innerHTML = this.render();
  }

  hideFormHandler() {
    this.view = "list";
    this.editingEmployee = null;
    this.view = "list";
    this.editingEmployee = null;
    this.container.querySelector("#dashboardContent").innerHTML = this.render();
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
      <div class="owner-section-container">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="owner-title">Employee Management</h2>
            <p class="owner-subtitle">Manage staff, salaries, and performance</p>
          </div>
          <button onclick="window.ownerDashboard.sections.employees.showAddFormHandler()" class="owner-btn-primary">
            ${getIconHTML("plus")}
            Add Employee
          </button>
        </div>

        <div class="owner-card">
          <div class="overflow-x-auto">
            <table class="owner-table">
              <thead class="owner-table-head">
                <tr>
                  <th class="owner-table-th">Name</th>
                  <th class="owner-table-th">Role</th>
                  <th class="owner-table-th">Salary</th>
                  <th class="owner-table-th">Bonus</th>
                  <th class="owner-table-th">Attendance</th>
                  <th class="owner-table-th">Performance Rating</th>
                  <th class="owner-table-th">Status</th>
                  <th class="owner-table-th">Actions</th>
                </tr>
              </thead>
              <tbody class="owner-table-body">
                ${this.employees
                  .map(
                    (emp) => `
                  <tr class="owner-table-tr">
                    <td class="owner-table-td font-medium text-gray-900">${
                      emp.name
                    }</td>
                    <td class="owner-table-td text-gray-500">${emp.role}</td>
                    <td class="owner-table-td text-gray-900">${emp.salary.toLocaleString(
                      "en-us",
                      { style: "currency", currency: "LKR" }
                    )}</td>
                    <td class="owner-table-td text-gray-900">${emp.bonus.toLocaleString(
                      "en-us",
                      { style: "currency", currency: "LKR" }
                    )}</td>
                    <td class="owner-table-td">
                      <div class="flex items-center gap-2">
                        <span class="text-gray-900 font-medium">${
                          emp.attendance
                        }%</span>
                      </div>
                    </td>
                    <td class="owner-table-td text-gray-900">${
                      emp.performanceRating
                    }</td>
                    <td class="owner-table-td">
                      <span class="owner-badge ${
                        emp.status === "Active"
                          ? "owner-badge-success"
                          : "owner-badge-danger"
                      }">
                        ${emp.status}
                      </span>
                    </td>
                    <td class="owner-table-td flex items-center gap-2">
                      <button onclick="window.ownerDashboard.sections.employees.showEditFormHandler(${
                        emp.id
                      })" class="owner-btn-icon">
                        ${getIconHTML("edit")}
                      </button>
                      <button onclick="window.ownerDashboard.sections.employees.deleteEmployeeHandler(${
                        emp.id
                      })" class="owner-btn-icon-danger">
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
      <div class="owner-form-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="owner-title">Add New Employee</h3>
            <p class="owner-subtitle">Create a new employee account</p>
          </div>
        </div>

        <form id="addEmployeeForm" class="owner-card" onsubmit="window.ownerDashboard.sections.employees.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="owner-section-title">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required class="owner-input" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="owner-label">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required class="owner-input" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" class="owner-input" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Password <span class="text-red-600">*</span></label>
                  <input type="password" name="password" required class="owner-input" placeholder="Enter password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="owner-label">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="owner-input" placeholder="Enter full address"></textarea>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="owner-section-title">
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="owner-input">
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
                  <label class="owner-label">Status</label>
                  <select name="status" class="owner-input">
                    <option value="Active" selected>Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" class="owner-input" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Performance Rating</label>
                  <input type="number" name="performanceRating" class="owner-input" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" class="owner-input" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" class="owner-input" placeholder="e.g. 5000">
                </div>
              </div>    
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.ownerDashboard.sections.employees.hideFormHandler()" class="owner-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="owner-btn-primary">
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
      <div class="owner-form-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="owner-title">Edit Employee</h3>
            <p class="owner-subtitle">Update employee information</p>
          </div>
        </div>

        <form id="editEmployeeForm" class="owner-card" onsubmit="window.ownerDashboard.sections.employees.submitEditForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Personal Information -->
            <div>
              <h4 class="owner-section-title">
                ${getIconHTML("user").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required value="${
                    emp.name
                  }" class="owner-input" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="owner-label">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required value="${
                    emp.email
                  }" class="owner-input" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" value="${
                    emp.phone || ""
                  }" class="owner-input" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Password <span class="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <input type="password" name="password" class="owner-input" placeholder="Enter new password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="owner-label">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="owner-input" placeholder="Enter full address">${
                    emp.address || ""
                  }</textarea>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="owner-section-title">
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-blue-600"'
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="owner-input">
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
                  <label class="owner-label">Status</label>
                  <select name="status" class="owner-input">
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
                  <label class="owner-label">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" value="${
                    emp.attendance || ""
                  }" class="owner-input" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Performance Rating</label>
                  <input type="number" name="performanceRating" value="${
                    emp.performanceRating || ""
                  }" class="owner-input" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" value="${
                    emp.salary || ""
                  }" class="owner-input" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" value="${
                    emp.bonus || ""
                  }" class="owner-input" placeholder="e.g. 5000">
                </div>
              </div>    
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.ownerDashboard.sections.employees.hideFormHandler()" class="owner-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="owner-btn-primary">
              ${getIconHTML("check-circle")}
              Update Employee
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
