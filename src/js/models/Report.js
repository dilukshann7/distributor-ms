import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Order } from "./Order";
import { Invoice } from "./Invoice";
import { Driver } from "./Driver.js";
import { SalesOrder } from "./SalesOrder";
import { Product } from "./Product";
import {
  filterOrdersByDateRange,
  filterInvoicesByDateRange,
  formatDate,
  formatCurrency,
} from "../utils/reportUtils.js";

export class Report {
  constructor() {
    this.orders = [];
    this.products = [];
    this.shipments = [];
    this.invoices = [];
  }
}
