import axios from "axios";
import { User } from "./User.js";
import {
  preparePdfDoc,
  exportTable,
  addFooter,
  addSummarySection,
} from "../utils/pdfReportTemplate.js";
import { Product } from "./Product.js";
import { formatCurrency } from "../utils/reportUtils.js";

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
    return Product.exportInventoryReport();
  }
}
