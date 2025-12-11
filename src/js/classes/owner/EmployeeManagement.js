import { LitElement, html } from "lit";
import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeManagement extends LitElement {
  static properties = {
    employees: { type: Array },
    view: { type: String },
    editingEmployee: { type: Object },
  };

  constructor() {
    super();
    this.employees = [];
    this.view = "list";
    this.editingEmployee = null;
    this.getEmployees();
  }

  createRenderRoot() {
    return this;
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
  }

  showEditFormHandler(employeeId) {
    this.editingEmployee = this.employees.find((emp) => emp.id === employeeId);
    this.view = "edit";
  }

  hideFormHandler() {
    this.view = "list";
    this.editingEmployee = null;
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
    return html`
      <div class="owner-section-container">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="owner-title">Employee Management</h2>
            <p class="owner-subtitle">Manage staff, salaries, and performance</p>
          </div>
          <button @click=${this.showAddFormHandler} class="owner-btn-primary">
            <div .innerHTML=${getIconHTML("plus")}></div>
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
                ${this.employees.map((emp) => html`
                  <tr class="owner-table-tr">
                    <td class="owner-table-td font-medium text-gray-900">${emp.name}</td>
                    <td class="owner-table-td text-gray-500">${emp.role}</td>
                    <td class="owner-table-td text-gray-900">${emp.salary.toLocaleString("en-us", { style: "currency", currency: "LKR" })}</td>
                    <td class="owner-table-td text-gray-900">${emp.bonus.toLocaleString("en-us", { style: "currency", currency: "LKR" })}</td>
                    <td class="owner-table-td">
                      <div class="flex items-center gap-2">
                        <span class="text-gray-900 font-medium">${emp.attendance}%</span>
                      </div>
                    </td>
                    <td class="owner-table-td text-gray-900">${emp.performanceRating}</td>
                    <td class="owner-table-td">
                      <span class="owner-badge ${emp.status === "Active" ? "owner-badge-success" : "owner-badge-danger"}">
                        ${emp.status}
                      </span>
                    </td>
                    <td class="owner-table-td flex items-center gap-2">
                      <button @click=${() => this.showEditFormHandler(emp.id)} class="owner-btn-icon">
                        <div .innerHTML=${getIconHTML("edit")}></div>
                      </button>
                      <button @click=${() => this.deleteEmployeeHandler(emp.id)} class="owner-btn-icon-danger">
                        <div .innerHTML=${getIconHTML("trash")}></div>
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAddForm() {
    return html`
      <div class="owner-form-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="owner-title">Add New Employee</h3>
            <p class="owner-subtitle">Create a new employee account</p>
          </div>
        </div>

        <form id="addEmployeeForm" class="owner-card" @submit=${this.submitAddForm}>
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="owner-section-title">
                <div class="w-5 h-5 text-blue-600" .innerHTML=${getIconHTML("user")}></div>
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

            <div class="border-t border-gray-100 pt-8">
              <h4 class="owner-section-title">
                <div class="w-5 h-5 text-blue-600" .innerHTML=${getIconHTML("briefcase")}></div>
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
            <button type="button" @click=${this.hideFormHandler} class="owner-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="owner-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
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

    return html`
      <div class="owner-form-container">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="owner-title">Edit Employee</h3>
            <p class="owner-subtitle">Update employee information</p>
          </div>
        </div>

        <form id="editEmployeeForm" class="owner-card" @submit=${this.submitEditForm}>
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="owner-section-title">
                <div class="w-5 h-5 text-blue-600" .innerHTML=${getIconHTML("user")}></div>
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required .value=${emp.name} class="owner-input" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="owner-label">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required .value=${emp.email} class="owner-input" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" .value=${emp.phone || ""} class="owner-input" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Password <span class="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <input type="password" name="password" class="owner-input" placeholder="Enter new password">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="owner-label">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="owner-input" placeholder="Enter full address">${emp.address || ""}</textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="owner-section-title">
                <div class="w-5 h-5 text-blue-600" .innerHTML=${getIconHTML("briefcase")}></div>
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="owner-label">Role <span class="text-red-600">*</span></label>
                  <select name="role" required class="owner-input">
                    <option value="Salesman" ?selected=${emp.role === "Salesman"}>Salesman</option>
                    <option value="Driver" ?selected=${emp.role === "Driver"}>Driver</option>
                    <option value="Stock Keeper" ?selected=${emp.role === "Stock Keeper"}>Stock Keeper</option>
                    <option value="Distributor" ?selected=${emp.role === "Distributor"}>Distributor</option>
                    <option value="Assistant Manager" ?selected=${emp.role === "Assistant Manager"}>Assistant Manager</option>
                    <option value="Cashier" ?selected=${emp.role === "Cashier"}>Cashier</option>
                    <option value="Supplier" ?selected=${emp.role === "Supplier"}>Supplier</option>
                    <option value="Manager" ?selected=${emp.role === "Manager"}>Manager</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Status</label>
                  <select name="status" class="owner-input">
                    <option value="Active" ?selected=${emp.status === "Active"}>Active</option>
                    <option value="On Leave" ?selected=${emp.status === "On Leave"}>On Leave</option>
                    <option value="Inactive" ?selected=${emp.status === "Inactive"}>Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Attendance <span class="text-gray-400 font-normal">(Days)</span></label>
                  <input type="text" name="attendance" .value=${emp.attendance || ""} class="owner-input" placeholder="e.g. 22/30">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Performance Rating</label>
                  <input type="number" name="performanceRating" .value=${emp.performanceRating || ""} class="owner-input" placeholder="e.g. 5">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Salary <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="salary" step="0.01" .value=${emp.salary || ""} class="owner-input" placeholder="e.g. 50000">
                </div>

                <div class="space-y-2">
                  <label class="owner-label">Bonus <span class="text-gray-400 font-normal">(LKR)</span></label>
                  <input type="number" name="bonus" step="0.01" .value=${emp.bonus || ""} class="owner-input" placeholder="e.g. 5000">
                </div>
              </div>    
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" @click=${this.hideFormHandler} class="owner-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="owner-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
              Update Employee
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("employee-management", EmployeeManagement);
