// Product/Inventory Class
export class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.quantity = data.quantity;
    this.minStock = data.minStock;
    this.maxStock = data.maxStock;
    this.location = data.location;
    this.supplierId = data.supplierId;
    this.batchNumber = data.batchNumber;
    this.expiryDate = data.expiryDate;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Static methods
  static async create(productData) {}
  static async findById(id) {}
  static async findBySku(sku) {}
<<<<<<< Updated upstream
  static async getAll(filters) {}
=======
  static async getAll(params) {
    try {
      const products = await prisma.product.findMany();
      return products; // returns plain JSON
    } catch (e) {
      console.error("Error fetching products:", e);
      throw e;
    } finally {
      await prisma.$disconnect();
    }
  }
>>>>>>> Stashed changes
  static async search(searchTerm) {}
  static async getLowStockItems() {}
  static async getCriticalStockItems() {}
  static async getExpiringProducts(days) {}
  static async getBySupplier(supplierId) {}
  static async getStockValue() {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async addStock(quantity, batchNumber, expiryDate) {}
  async removeStock(quantity) {}
  async adjustStock(newQuantity, reason) {}
  async checkStockStatus() {}
  async isLowStock() {}
  async isCritical() {}
  async isExpiringSoon(days) {}
  async updatePrice(newPrice) {}
  async updateLocation(newLocation) {}
  async getStockHistory(startDate, endDate) {}
  async getOrderHistory() {}
  async calculateReorderQuantity() {}
  async getSupplier() {}
  async createStockAlert() {}
}
