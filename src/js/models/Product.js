import axios from "axios";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { formatCurrency, formatDate } from "../utils/reportUtils.js";

export class Product {
  static async getAll(filters) {
    const apiURL = "/api/products";

    return axios.get(apiURL);
  }

  static async create(product) {
    const apiURL = "/api/products";

    return axios.post(apiURL, product);
  }

  static async update(id, product) {
    const apiURL = `/api/products/${id}`;

    return axios.put(apiURL, product);
  }

  static async delete(id) {
    const apiURL = `/api/products/${id}`;

    return axios.delete(apiURL);
  }

  static async exportInventoryReport() {
    const response = await Product.getAll();
    const products = response.data || [];

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${formatDate(new Date())}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [["Product Name", "SKU", "Quantity", "Price", "Status"]],
      body: products.map((product) => [
        product.name,
        product.sku,
        product.quantity,
        formatCurrency(product.price),
        product.status,
      ]),
    });

    doc.save("inventory_report.pdf");
  }
}
