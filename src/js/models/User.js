import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../utils/reportUtils.js";

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

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Employee Report", 14, 20);

      doc.setFontSize(11);
      doc.text(`Date: ${formatDate(new Date())}`, 14, 28);

      const tableData = users.map((user) => {
        const profile = User.getProfileData(user);

        return [
          user.name || "N/A",
          user.email || "N/A",
          user.role || "N/A",
          profile?.performanceRating?.toString() || "N/A",
          profile?.salary?.toString() || "N/A",
          profile?.bonus?.toString() || "N/A",
          user.status || "N/A",
          user.phone || "N/A",
        ];
      });

      autoTable(doc, {
        startY: 36,
        head: [
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
        ],
        body: tableData,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
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
      });

      doc.save(`employee_report_${formatDate(new Date())}.pdf`);
    } catch (error) {
      console.error("Error exporting employee report:", error);
      throw error;
    }
  }
}
