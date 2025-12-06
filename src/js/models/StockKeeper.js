import axios from "axios";
import { User } from "./User";
import { Product } from "./Product";
import { formatCurrency, formatDate } from "../utils/reportUtils";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

export class StockKeeper extends User {
  static async getAll() {
    const apiURL = "/api/stock-keepers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.get(apiURL);
  }

  static async create(stockKeeperData) {
    const apiURL = "/api/stock-keepers";
    return axios.post(apiURL, stockKeeperData);
  }

  static async update(id, stockKeeperData) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.put(apiURL, stockKeeperData);
  }

  static async delete(id) {
    const apiURL = `/api/stock-keepers/${id}`;
    return axios.delete(apiURL);
  }

  static async exportStockReport() {
    try {
      const productResponse = await Product.getAll();
      const allProducts = productResponse.data || [];

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Stock Report", 14, 20);

      doc.setFontSize(11);
      doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 28);

      const totalProducts = allProducts.length;
      const totalStockValue = allProducts.reduce(
        (sum, product) =>
          sum +
          parseFloat(product.price || 0) * parseFloat(product.quantity || 0),
        0
      );
      const lowStockItems = allProducts.filter(
        (product) => product.quantity <= product.minStock
      ).length;

      doc.setFontSize(10);
      doc.text(`Total Products: ${totalProducts}`, 14, 36);
      doc.text(`Total Stock Value: ${formatCurrency(totalStockValue)}`, 14, 42);
      doc.text(`Low Stock Items: ${lowStockItems}`, 14, 48);

      autoTable(doc, {
        startY: 56,
        head: [
          [
            "Product ID",
            "Name",
            "SKU",
            "Category",
            "Quantity",
            "Price",
            "Min Stock",
            "Max Stock",
            "Location",
            "Status",
          ],
        ],
        body: allProducts.map((product) => [
          product.id || "N/A",
          product.name || "N/A",
          product.sku || "N/A",
          product.category || "N/A",
          product.quantity || 0,
          formatCurrency(product.price),
          product.minStock || 0,
          product.maxStock || 0,
          product.location || "N/A",
          product.status || "N/A",
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [147, 51, 234] },
      });

      const timestamp = new Date().toISOString().split("T")[0];
      doc.save(`stock-report-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
}
