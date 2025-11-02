// OrderItem Class
export class OrderItem {
  constructor(data) {
    this.id = data.id;
    this.orderId = data.orderId;
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.unitPrice = data.unitPrice;
    this.discount = data.discount;
    this.total = data.total;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Static methods
  static async create(itemData) {}
  static async findById(id) {}
  static async getByOrder(orderId) {}
  static async getByProduct(productId) {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async calculateTotal() {}
  async applyDiscount(discountAmount) {}
  async getProduct() {}
  async getOrder() {}
  async updateQuantity(newQuantity) {}
  async updatePrice(newPrice) {}
  async checkStock() {}
}
