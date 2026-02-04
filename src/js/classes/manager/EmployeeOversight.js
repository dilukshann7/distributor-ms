import { LitElement, html } from "lit";
import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeOversight extends LitElement {
  static properties = {
    employees: { type: Array },
    view: { type: String },
    editingEmployee: { type: Object },
    selectedRole: { type: String },
  };

  constructor() {
    super();
    this.employees = [];
    this.view = "list";
    this.editingEmployee = null;
    this.selectedRole = "";
    this.getEmployees();
  }

  createRenderRoot() {
    return this;
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

  getRoleSpecificFieldsTemplate(role, values = {}) {
    if (role === "Driver") {
      return html`
        <div class="space-y-2">
          <label class="manager-label">Vehicle ID</label>
          <input
            type="text"
            name="vehicleId"
            .value="${values.vehicleId || ""}"
            class="w-full manager-input"
            placeholder="e.g. VEH-001"
          />
        </div>
        <div class="space-y-2">
          <label class="manager-label">Vehicle Type</label>
          <input
            type="text"
            name="vehicleType"
            .value="${values.vehicleType || ""}"
            class="w-full manager-input"
            placeholder="e.g. Truck, Van"
          />
        </div>
        <div class="space-y-2">
          <label class="manager-label">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            .value="${values.licenseNumber || ""}"
            class="w-full manager-input"
            placeholder="e.g. DL123456"
          />
        </div>
      `;
    } else if (role === "Salesman") {
      return html`
        <div class="space-y-2">
          <label class="manager-label">Sales Target</label>
          <input
            type="number"
            name="salesTarget"
            step="0.01"
            .value="${values.salesTarget || ""}"
            class="w-full manager-input"
            placeholder="e.g. 100000"
          />
        </div>
      `;
    } else if (role === "Supplier") {
      return html`
        <div class="space-y-2">
          <label class="manager-label">Company Name</label>
          <input
            type="text"
            name="companyName"
            .value="${values.companyName || ""}"
            class="w-full manager-input"
            placeholder="e.g. ABC Suppliers Ltd"
          />
        </div>
        <div class="space-y-2">
          <label class="manager-label">Supplier Type</label>
          <input
            type="text"
            name="supplierType"
            .value="${values.supplierType || ""}"
            class="w-full manager-input"
            placeholder="e.g. Wholesale, Retail"
          />
        </div>
      `;
    }
    return html``;
  }

  handleRoleChange(e) {
    this.selectedRole = e.target.value;
  }

  showAddFormHandler() {
    this.selectedRole = "";
    this.view = "add";
  }

  showEditFormHandler(employeeId) {
    this.editingEmployee = this.employees.find((emp) => emp.id === employeeId);
    this.selectedRole = this.editingEmployee?.role || "";
    this.view = "edit";
  }

  hideFormHandler() {
    this.view = "list";
    this.editingEmployee = null;
    this.selectedRole = "";
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const role = formData.get("role");
    const employeeData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      password: formData.get("password"),
      role: role,
      status: formData.get("status"),
    };

    if (role !== "Supplier") {
      employeeData.attendance = formData.get("attendance") || null;
      employeeData.performanceRating =
        Number(formData.get("performanceRating")) || null;
      employeeData.salary = Number(formData.get("salary")) || null;
      employeeData.bonus = Number(formData.get("bonus")) || null;
    }

    if (role === "Driver") {
      employeeData.vehicleId = formData.get("vehicleId") || null;
      employeeData.vehicleType = formData.get("vehicleType") || null;
      employeeData.licenseNumber = formData.get("licenseNumber") || null;
    } else if (role === "Salesman") {
      employeeData.salesTarget = Number(formData.get("salesTarget")) || null;
    } else if (role === "Supplier") {
      employeeData.companyName = formData.get("companyName") || null;
      employeeData.supplierType = formData.get("supplierType") || null;
    }

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

    const role = formData.get("role");
    const employeeData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      role: role,
      status: formData.get("status"),
    };

    const password = formData.get("password");
    if (password) {
      employeeData.password = password;
    }

    if (role !== "Supplier") {
      employeeData.attendance = formData.get("attendance") || null;
      employeeData.performanceRating =
        Number(formData.get("performanceRating")) || null;
      employeeData.salary = Number(formData.get("salary")) || null;
      employeeData.bonus = Number(formData.get("bonus")) || null;
    }

    if (role === "Driver") {
      employeeData.vehicleId = formData.get("vehicleId") || null;
      employeeData.vehicleType = formData.get("vehicleType") || null;
      employeeData.licenseNumber = formData.get("licenseNumber") || null;
    } else if (role === "Salesman") {
      employeeData.salesTarget = Number(formData.get("salesTarget")) || null;
    } else if (role === "Supplier") {
      employeeData.companyName = formData.get("companyName") || null;
      employeeData.supplierType = formData.get("supplierType") || null;
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
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Employee Oversight</h3>
            <p class="manager-header-subtitle">
              Monitor team performance, attendance, and schedules
            </p>
          </div>
          <button @click=${this.showAddFormHandler} class="manager-btn-primary">
            <div .innerHTML=${getIconHTML("plus")}></div>
            Add Employee
          </button>
        </div>

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
                ${this.employees.map((emp) => {
                  const roleMap = {
                    Driver: "driverProfile",
                    Manager: "managerProfile",
                    Salesman: "salesmanProfile",
                    "Stock Keeper": "stockKeeperProfile",
                    Cashier: "cashierProfile",
                    Supplier: "supplierProfile",
                    Distributor: "distributorProfile",
                    "Assistant Manager": "assistantManagerProfile",
                  };
                  const profileKey = roleMap[emp.role];
                  const profile = emp[profileKey];
                  const attendance =
                    profile?.attendance || emp.attendance || "N/A";
                  const performanceRating =
                    profile?.performanceRating ||
                    emp.performanceRating ||
                    "N/A";

                  return html`
                    <tr class="manager-table-row">
                      <td class="manager-table-td font-medium text-gray-900">
                        ${emp.name}
                      </td>
                      <td class="manager-table-td text-gray-600">
                        ${emp.role}
                      </td>
                      <td class="manager-table-td">
                        <span
                          class="manager-badge ${emp.status.toLowerCase() ===
                          "active"
                            ? "manager-badge-green"
                            : "manager-badge-yellow"}"
                        >
                          ${emp.status}
                        </span>
                      </td>
                      <td class="manager-table-td text-gray-600">
                        ${attendance}
                      </td>
                      <td class="manager-table-td">
                        <span class="manager-badge">${performanceRating}</span>
                      </td>
                      <td class="manager-table-td flex gap-2">
                        <button
                          @click=${() => this.showEditFormHandler(emp.id)}
                          class="manager-btn-icon-blue"
                        >
                          <div .innerHTML=${getIconHTML("edit")}></div>
                        </button>
                        <button
                          @click=${() => this.deleteEmployeeHandler(emp.id)}
                          class="manager-btn-icon-red"
                        >
                          <div .innerHTML=${getIconHTML("trash")}></div>
                        </button>
                      </td>
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderCommonFields(isSupplier) {
    if (isSupplier) return html``;

    return html`
      <div class="space-y-2">
        <label class="manager-label"
          >Attendance
          <span class="text-gray-400 font-normal">(Days)</span></label
        >
        <input
          type="text"
          name="attendance"
          class="w-full manager-input"
          placeholder="e.g. 22/30"
          .value="${this.editingEmployee?.attendance || ""}"
        />
      </div>

      <div class="space-y-2">
        <label class="manager-label">Performance Rating</label>
        <input
          type="number"
          name="performanceRating"
          class="w-full manager-input"
          placeholder="e.g. 5"
          .value="${this.editingEmployee?.performanceRating || ""}"
        />
      </div>

      <div class="space-y-2">
        <label class="manager-label"
          >Salary <span class="text-gray-400 font-normal">(LKR)</span></label
        >
        <input
          type="number"
          name="salary"
          step="0.01"
          class="w-full manager-input"
          placeholder="e.g. 50000"
          .value="${this.editingEmployee?.salary || ""}"
        />
      </div>

      <div class="space-y-2">
        <label class="manager-label"
          >Bonus <span class="text-gray-400 font-normal">(LKR)</span></label
        >
        <input
          type="number"
          name="bonus"
          step="0.01"
          class="w-full manager-input"
          placeholder="e.g. 5000"
          .value="${this.editingEmployee?.bonus || ""}"
        />
      </div>
    `;
  }

  renderAddForm() {
    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Add New Employee</h3>
            <p class="manager-header-subtitle">Create a new employee account</p>
          </div>
        </div>

        <form
          id="addEmployeeForm"
          class="manager-card-overflow"
          @submit=${this.submitAddForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                <div
                  class="w-5 h-5 text-emerald-600"
                  .innerHTML=${getIconHTML("user")}
                ></div>
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="manager-label"
                    >Full Name <span class="text-red-600">*</span></label
                  >
                  <input
                    type="text"
                    name="name"
                    required
                    class="w-full manager-input"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Email <span class="text-red-600">*</span></label
                  >
                  <input
                    type="email"
                    name="email"
                    required
                    class="w-full manager-input"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Phone Number
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input
                    type="tel"
                    name="phone"
                    class="w-full manager-input"
                    placeholder="e.g. +94771234567"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Password <span class="text-red-600">*</span></label
                  >
                  <input
                    type="password"
                    name="password"
                    required
                    class="w-full manager-input"
                    placeholder="Enter password"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="manager-label"
                    >Address
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="address"
                    rows="3"
                    class="w-full manager-input"
                    placeholder="Enter full address"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"',
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="manager-label"
                    >Role <span class="text-red-600">*</span></label
                  >
                  <select
                    name="role"
                    required
                    class="w-full manager-input"
                    @change=${this.handleRoleChange}
                  >
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
                  <label class="manager-label">Status</label>
                  <select name="status" class="w-full manager-input">
                    <option value="Active" selected>Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                ${this.renderCommonFields(this.selectedRole === "Supplier")}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                ${this.getRoleSpecificFieldsTemplate(this.selectedRole)}
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.hideFormHandler}
              class="manager-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
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

    const driverProfile = emp.driverProfile || {};
    const salesmanProfile = emp.salesmanProfile || {};
    const supplierProfile = emp.supplierProfile || {};

    // Combine current values into one object for the helper
    const specificValues = {
      vehicleId: driverProfile.vehicleId,
      vehicleType: driverProfile.vehicleType,
      licenseNumber: driverProfile.licenseNumber,
      salesTarget: salesmanProfile.salesTarget,
      companyName: supplierProfile.companyName,
      supplierType: supplierProfile.supplierType,
    };

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="manager-header-title">Edit Employee</h3>
            <p class="manager-header-subtitle">Update employee information</p>
          </div>
        </div>

        <form
          id="editEmployeeForm"
          class="manager-card-overflow"
          @submit=${this.submitEditForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                <div
                  class="w-5 h-5 text-emerald-600"
                  .innerHTML=${getIconHTML("user")}
                ></div>
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="manager-label"
                    >Full Name <span class="text-red-600">*</span></label
                  >
                  <input
                    type="text"
                    name="name"
                    required
                    .value=${emp.name}
                    class="w-full manager-input"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Email <span class="text-red-600">*</span></label
                  >
                  <input
                    type="email"
                    name="email"
                    required
                    .value=${emp.email}
                    class="w-full manager-input"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Phone Number
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <input
                    type="tel"
                    name="phone"
                    .value=${emp.phone || ""}
                    class="w-full manager-input"
                    placeholder="e.g. +94771234567"
                  />
                </div>

                <div class="space-y-2">
                  <label class="manager-label"
                    >Password
                    <span class="text-gray-400 font-normal"
                      >(Leave blank to keep current)</span
                    ></label
                  >
                  <input
                    type="password"
                    name="password"
                    class="w-full manager-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="manager-label"
                    >Address
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <textarea
                    name="address"
                    rows="3"
                    class="w-full manager-input"
                    placeholder="Enter full address"
                  >
${emp.address || ""}</textarea
                  >
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4
                class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              >
                ${getIconHTML("briefcase").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-emerald-600"',
                )}
                Employment Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="manager-label"
                    >Role <span class="text-red-600">*</span></label
                  >
                  <select
                    name="role"
                    required
                    class="w-full manager-input"
                    @change=${this.handleRoleChange}
                  >
                    <option
                      value="Salesman"
                      ?selected=${emp.role === "Salesman"}
                    >
                      Salesman
                    </option>
                    <option value="Driver" ?selected=${emp.role === "Driver"}>
                      Driver
                    </option>
                    <option
                      value="Stock Keeper"
                      ?selected=${emp.role === "Stock Keeper"}
                    >
                      Stock Keeper
                    </option>
                    <option
                      value="Distributor"
                      ?selected=${emp.role === "Distributor"}
                    >
                      Distributor
                    </option>
                    <option
                      value="Assistant Manager"
                      ?selected=${emp.role === "Assistant Manager"}
                    >
                      Assistant Manager
                    </option>
                    <option value="Cashier" ?selected=${emp.role === "Cashier"}>
                      Cashier
                    </option>
                    <option
                      value="Supplier"
                      ?selected=${emp.role === "Supplier"}
                    >
                      Supplier
                    </option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="manager-label">Status</label>
                  <select name="status" class="w-full manager-input">
                    <option value="Active" ?selected=${emp.status === "Active"}>
                      Active
                    </option>
                    <option
                      value="On Leave"
                      ?selected=${emp.status === "On Leave"}
                    >
                      On Leave
                    </option>
                    <option
                      value="Inactive"
                      ?selected=${emp.status === "Inactive"}
                    >
                      Inactive
                    </option>
                  </select>
                </div>

                ${this.renderCommonFields(this.selectedRole === "Supplier")}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                ${this.getRoleSpecificFieldsTemplate(
                  this.selectedRole,
                  specificValues,
                )}
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.hideFormHandler}
              class="manager-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" class="manager-btn-primary">
              <div .innerHTML=${getIconHTML("check-circle")}></div>
              Update Employee
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("employee-oversight", EmployeeOversight);
