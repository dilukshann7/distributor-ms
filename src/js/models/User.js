import axios from "axios";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

export class User {
  static async getAll() {
    const apiURL = "/api/users";
    return axios.get(apiURL);
  }

  static async create(user) {
    const apiURL = "/api/users";
    return axios.post(apiURL, user);
  }

  static async update(id, user) {
    const apiURL = `/api/users/${id}`;
    return axios.put(apiURL, user);
  }

  static async delete(id) {
    const apiURL = `/api/users/${id}`;
    return axios.delete(apiURL);
  }

  static getProfileData(user) {
    const profileKeys = [
      "driverProfile",
      "managerProfile",
      "salesmanProfile",
      "stockKeeperProfile",
      "cashierProfile",
      "supplierProfile",
      "distributorProfile",
      "assistantManagerProfile",
    ];

    for (const key of profileKeys) {
      if (user[key]) {
        return user[key];
      }
    }
    return null;
  }

  static async exportEmployeeReport() {
    try {
      const response = await User.getAll();
      const users = response.data || [];

      const doc = preparePdfDoc("Employee Report", new Date());

      const totalEmployees = users.length;
      const activeEmployees = users.filter(
        (u) => u.status === "Active" || u.status === "active",
      ).length; // Assuming status values
      const compensation = users.reduce(
        (acc, user) => {
          const profile = User.getProfileData(user);
          const salary = parseFloat(profile?.salary || 0);
          const bonus = parseFloat(profile?.bonus || 0);
          if (!Number.isNaN(salary) && salary > 0) {
            acc.totalSalary += salary;
            acc.salaryCount += 1;
          }
          if (!Number.isNaN(bonus) && bonus > 0) {
            acc.totalBonus += bonus;
            acc.bonusCount += 1;
          }
          return acc;
        },
        { totalSalary: 0, salaryCount: 0, totalBonus: 0, bonusCount: 0 },
      );
      const averageSalary =
        compensation.salaryCount > 0
          ? compensation.totalSalary / compensation.salaryCount
          : 0;
      const averageBonus =
        compensation.bonusCount > 0
          ? compensation.totalBonus / compensation.bonusCount
          : 0;

      // Summary
      let yPos = 40;
      yPos = addSummarySection(
        doc,
        "Workforce Overview",
        [
          { label: "Total Employees", value: totalEmployees.toString() },
          { label: "Active Status", value: activeEmployees.toString() },
          { label: "Avg Salary", value: formatCurrency(averageSalary) },
          { label: "Avg Bonus", value: formatCurrency(averageBonus) },
        ],
        yPos,
      );

      // Detailed Table
      doc.setFontSize(14);
      doc.text("Employee Roster", 14, yPos + 5);

      const tableData = users.map((user) => {
        const profile = User.getProfileData(user);

        return [
          user.name || "N/A",
          user.email || "N/A",
          user.role || "N/A",
          profile?.performanceRating?.toString() || "N/A",
          profile?.salary ? formatCurrency(profile.salary) : "N/A",
          profile?.bonus ? formatCurrency(profile.bonus) : "N/A",
          user.status || "N/A",
          user.phone || "N/A",
        ];
      });

      exportTable(
        doc,
        [
          "Name",
          "Email",
          "Role",
          "Performance",
          "Salary",
          "Bonus",
          "Status",
          "Phone",
        ],
        tableData,
        {
          startY: yPos + 10,
          fontSize: 9,
          headColor: [41, 128, 185],
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 40 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 18 },
            5: { cellWidth: 18 },
            6: { cellWidth: 18 },
            7: { cellWidth: 25 },
          },
        },
      );

      // Add Footer
      addFooter(doc);

      doc.save(`employee_report_${formatDate(new Date())}.pdf`);
    } catch (error) {
      console.error("Error exporting employee report:", error);
      throw error;
    }
  }

  static async logout() {
    const apiURL = "/api/logout";
    return axios.post(apiURL);
  }
}
