import { LitElement, html } from "lit";
import { PurchaseInvoice } from "../../models/PurchaseInvoice.js";
import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class InvoicesPayments extends LitElement {
  static properties = {
    invoices: { type: Array },
    orders: { type: Array },
    view: { type: String },
    viewingInvoice: { type: Object },
  };

  constructor() {
    super();
    this.invoices = [];
    this.orders = [];
    this.view = "list";
    this.viewingInvoice = null;
    this.getInvoices();
    this.getOrders();
  }

  createRenderRoot() {
    return this;
  }

  async getInvoices() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await PurchaseInvoice.getAll();
      this.invoices = response.data.filter(
        (invoice) => invoice.supplierId === Number(id),
      );
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching invoices:", error);
      this.invoices = [];
    }
  }

  async getOrders() {
    try {
      const id = window.location.search.split("id=")[1];
      const response = await PurchaseOrder.getAll();
      this.orders = response.data.filter((po) => po.supplierId === Number(id));
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }

  async switchToAdd() {
    this.view = "create";
    this.viewingInvoice = null;
    await this.getOrders();
    this.requestUpdate();
  }

  switchToView(invoiceId) {
    this.viewingInvoice = this.invoices.find(
      (inv) => inv.id === parseInt(invoiceId),
    );
    this.view = "view";
    this.requestUpdate();
  }

  switchToList() {
    this.view = "list";
    this.viewingInvoice = null;
    this.requestUpdate();
  }

  submitForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const invoiceData = {
      invoiceNumber: rawData.invoiceNumber,
      status: rawData.status,
      notes: rawData.notes || null,

      purchaseOrderId: parseInt(rawData.purchaseOrderId, 10),
      supplierId: parseInt(window.location.search.split("id=")[1], 10),

      totalAmount: parseFloat(rawData.totalAmount),
      paidAmount: rawData.paidAmount ? parseFloat(rawData.paidAmount) : null,

      invoiceDate: new Date(rawData.invoiceDate),
      dueDate: new Date(rawData.dueDate),
    };

    PurchaseInvoice.create(invoiceData)
      .then(() => {
        this.switchToList();
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
      });
  }

  render() {
    if (this.view === "create") {
      return this.renderCreateForm();
    }
    if (this.view === "view") {
      return this.renderViewInvoice();
    }
    return this.renderList();
  }

  renderList() {
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Invoices & Payments</h3>
          <p class="section-subtitle">Manage invoices and payment records</p>
        </div>

        <div class="card-container">
          <div class="card-header flex items-center justify-between">
            <h3 class="card-title">Invoice History</h3>
            <button
              @click=${this.switchToAdd}
              class="btn-primary flex items-center gap-2 text-sm font-medium"
            >
              <span .innerHTML=${getIconHTML("plus")}></span>
              Generate Invoice
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Invoice ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Issue Date</th>
                  <th class="table-header">Due Date</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.invoices.map(
                  (invoice) => html`
                    <tr class="table-row">
                      <td class="table-cell-bold">${invoice.id}</td>
                      <td class="px-6 py-4 text-sm text-indigo-600 font-medium">
                        ${invoice.purchaseOrderId}
                      </td>
                      <td class="table-cell-bold">
                        Rs. ${invoice.totalAmount}
                      </td>
                      <td class="table-cell">
                        ${new Date(invoice.invoiceDate)
                          .toISOString()
                          .split("T")[0]}
                      </td>
                      <td class="table-cell">
                        ${new Date(invoice.dueDate).toISOString().split("T")[0]}
                      </td>
                      <td class="table-cell">
                        <span
                          class="status-badge ${invoice.status === "paid"
                            ? "status-green"
                            : invoice.status === "pending"
                              ? "status-yellow"
                              : "status-red"}"
                        >
                          ${invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                        </span>
                      </td>
                      <td class="table-cell">
                        <div class="flex items-center gap-2">
                          <button
                            class="text-indigo-600 hover:text-indigo-800 transition-colors view-invoice-btn"
                            @click=${() => this.switchToView(invoice.id)}
                            title="View"
                          >
                            <span .innerHTML=${getIconHTML("eye")}></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderCreateForm() {
    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Generate Invoice</h3>
            <p class="section-subtitle">Create a new invoice record</p>
          </div>
        </div>

        <form
          id="createInvoiceForm"
          class="card-container"
          @submit=${this.submitForm}
        >
          <div class="p-8 space-y-8">
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("hash")}
                ></span>
                References & IDs
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Invoice Number</label
                  >
                  <input
                    type="text"
                    name="invoiceNumber"
                    required
                    class="input-field"
                    placeholder="e.g. INV-2023-001"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Purchase Order</label
                  >
                  <select name="purchaseOrderId" required class="input-field">
                    <option value="">-- Select Purchase Order --</option>
                    ${this.orders.map(
                      (order) => html`
                        <option value="${order.id}">
                          Order #${order.id} - Rs. ${order.totalAmount}
                          (${order.status})
                        </option>
                      `,
                    )}
                  </select>
                  <p class="text-xs text-gray-500">
                    Select from existing purchase orders
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("calendar")}
                ></span>
                Dates & Financials
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Invoice Date</label
                  >
                  <input
                    type="date"
                    name="invoiceDate"
                    required
                    class="input-field"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Due Date</label
                  >
                  <input
                    type="date"
                    name="dueDate"
                    required
                    class="input-field"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Total Amount (LKR)</label
                  >
                  <div class="relative">
                    <span
                      class="absolute left-4 top-2.5 text-gray-500 font-medium"
                      >Rs.</span
                    >
                    <input
                      type="number"
                      name="totalAmount"
                      required
                      min="0"
                      step="0.01"
                      class="input-field pl-12"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Paid Amount
                    <span class="text-gray-400 font-normal"
                      >(Optional)</span
                    ></label
                  >
                  <div class="relative">
                    <span
                      class="absolute left-4 top-2.5 text-gray-500 font-medium"
                      >Rs.</span
                    >
                    <input
                      type="number"
                      name="paidAmount"
                      min="0"
                      step="0.01"
                      class="input-field pl-12"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("file-text")}
                ></span>
                Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Status</label
                  >
                  <select name="status" class="input-field">
                    <option value="pending" selected>Pending</option>
                    <option value="draft">Draft</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Notes / Terms</label
                  >
                  <textarea
                    name="notes"
                    rows="3"
                    class="input-field"
                    placeholder="Enter payment terms or additional notes..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              type="button"
              @click=${this.switchToList}
              class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button type="submit" class="btn-primary flex items-center gap-2">
              <span .innerHTML=${getIconHTML("check-circle")}></span>
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderViewInvoice() {
    const invoice = this.viewingInvoice;
    if (!invoice) return this.renderList();

    return html`
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="section-header">Invoice Details</h3>
            <p class="section-subtitle">View invoice information</p>
          </div>
          <button
            @click=${this.switchToList}
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
          >
            <span .innerHTML=${getIconHTML("x")}></span>
            Close
          </button>
        </div>

        <div class="card-container">
          <div class="p-8 space-y-8">
            <!-- Invoice Header -->
            <div class="border-b border-gray-200 pb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">
                    Invoice ${invoice.invoiceNumber}
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Invoice ID: #${invoice.id}
                  </p>
                </div>
                <div>
                  <span
                    class="status-badge ${invoice.status === "paid"
                      ? "status-green"
                      : invoice.status === "pending"
                        ? "status-yellow"
                        : "status-red"} text-base px-4 py-2"
                  >
                    ${invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <!-- Invoice Details Grid -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("file-text")}
                ></span>
                Invoice Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">
                    Purchase Order ID
                  </p>
                  <p class="text-lg font-semibold text-gray-900">
                    #${invoice.purchaseOrderId}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">
                    Supplier ID
                  </p>
                  <p class="text-lg font-semibold text-gray-900">
                    #${invoice.supplierId}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">
                    Invoice Date
                  </p>
                  <p class="text-lg font-semibold text-gray-900">
                    ${new Date(invoice.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-medium text-gray-600 mb-1">Due Date</p>
                  <p class="text-lg font-semibold text-gray-900">
                    ${new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <!-- Financial Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4
                class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <span
                  class="w-5 h-5 text-indigo-600"
                  .innerHTML=${getIconHTML("trending-up")}
                ></span>
                Payment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  class="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                >
                  <p class="text-sm font-medium text-indigo-600 mb-1">
                    Total Amount
                  </p>
                  <p class="text-2xl font-bold text-indigo-900">
                    Rs. ${invoice.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p class="text-sm font-medium text-green-600 mb-1">
                    Paid Amount
                  </p>
                  <p class="text-2xl font-bold text-green-900">
                    Rs. ${(invoice.paidAmount || 0).toFixed(2)}
                  </p>
                </div>
                <div
                  class="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                >
                  <p class="text-sm font-medium text-yellow-600 mb-1">
                    Balance
                  </p>
                  <p class="text-2xl font-bold text-yellow-900">
                    Rs.
                    ${(
                      invoice.balance ||
                      invoice.totalAmount - (invoice.paidAmount || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            ${invoice.notes
              ? html`
                  <div class="border-t border-gray-100 pt-8">
                    <h4
                      class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                    >
                      <span
                        class="w-5 h-5 text-indigo-600"
                        .innerHTML=${getIconHTML("file-text")}
                      ></span>
                      Notes
                    </h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                      <p class="text-gray-700">${invoice.notes}</p>
                    </div>
                  </div>
                `
              : ""}

            <!-- Timestamps -->
            <div class="border-t border-gray-100 pt-8">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600"
              >
                <div>
                  <span class="font-medium">Created:</span>
                  ${new Date(invoice.createdAt).toLocaleString()}
                </div>
                <div>
                  <span class="font-medium">Last Updated:</span>
                  ${new Date(invoice.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div
            class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4"
          >
            <button
              @click=${this.switchToList}
              class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("invoices-payments", InvoicesPayments);
