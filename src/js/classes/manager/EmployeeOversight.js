import { User } from "../../models/User.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class EmployeeOversight {
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
            <h3 class="manager-header-title">Employee Oversight</h3>
            <p class="manager-header-subtitle">Monitor team performance, attendance, and schedules</p>
          </div>
          <button class="manager-btn-primary">
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
                        emp.status === "Active"
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
                      <button class="manager-btn-icon-blue">
                        ${getIconHTML("edit")}
                      </button>
                      <button class="manager-btn-icon-red">
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
}
