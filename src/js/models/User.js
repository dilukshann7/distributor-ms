import axios from "axios";

// User/Employee Class
export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.phone = data.phone;
    this.address = data.address;
    this.salary = data.salary;
    this.bonus = data.bonus;
    this.attendance = data.attendance;
    this.performanceRating = data.performanceRating;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Static methods - Authentication & Authorization
  static async login(email, password) {}
  static async logout(userId) {}
  static async resetPassword(email) {}
  static async validateToken(token) {}

  // Instance methods - Authentication
  async updatePassword(oldPassword, newPassword) {}
  async verifyPassword(password) {}
  hasPermission(permission) {}
  hasRole(role) {}

  // Static methods - Employee Management
  static async create(employeeData) {}
  static async findById(id) {}
  static async findByEmail(email) {}
  static async findByRole(role) {}
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/users";

    return axios.get(apiURL);
  }
  static async search(searchTerm) {}

  // Instance methods - Employee Management
  async update(updateData) {}
  async delete() {}
  async activate() {}
  async deactivate() {}
  async calculateSalary() {}
  async updateAttendance(date, status) {}
  async getAttendanceRate(startDate, endDate) {}
  async updatePerformance(performanceRating) {}
  async getAssignedTasks() {}
  async getCompletedTasks(startDate, endDate) {}
  async getSalesOrders() {}
  async getDeliveries() {}
  async getTransactions() {}
}
