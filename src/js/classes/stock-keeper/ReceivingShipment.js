import { Shipment } from "../../models/Shipment.js";
import { Order } from "../../models/Order.js";
import { Supplier } from "../../models/Supplier.js";
import { Supply } from "../../models/Supply.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class ReceivingShipment {
  constructor(container) {
    this.container = container;
    this.shipments = { in_transit: [], received: [] };
    this.orders = [];
    this.activeTab = "pending";
    this.view = "list";
    this.editingShipment = null;
    this.suppliers = [];
    this.products = [];
    this.getShipments();
    this.getOrders();
    this.loadSuppliers();
    this.loadSupply();
  }

  async getOrders() {
    try {
      const response = await Order.getAll();
      this.orders =
        response.data.filter((order) => order.status === "pending") || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      this.orders = [];
    }
  }
  async loadSuppliers() {
    try {
      const response = await Supplier.getAll();
      this.suppliers = response.data || [];
    } catch (error) {
      console.error("Error loading suppliers:", error);
      this.suppliers = [];
    }
  }

  async loadSupply() {
    try {
      const response = await Supply.getAll();
      this.products = response.data || [];
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
    }
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = {
        in_transit: response.data.filter(
          (s) => s.status === "in_transit" || s.status === "pending"
        ),
        received: response.data.filter((s) => s.status === "received"),
      };
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = { in_transit: [], received: [] };
    }
  }

  // Attach click listeners to tab buttons within a root element
  attachTabListeners(root) {
    const buttons = root.querySelectorAll(".tab-btn");
    const container = root.querySelector("#shipmentsContainer");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab;

        // render shipments into the local container
        container.innerHTML = this.renderShipments(this.activeTab);

        buttons.forEach((b) =>
          b.classList.remove(
            "text-purple-600",
            "border-b-2",
            "border-purple-600"
          )
        );
        btn.classList.add("text-purple-600", "border-b-2", "border-purple-600");
      });
    });
  }

  async renderAndAttach(container) {
    await this.getShipments();
    await this.getOrders();
    container.innerHTML = this.render();
    if (this.view === "list") {
      this.attachTabListeners(container);
    }
  }

  addItemRow() {
    const container = document.getElementById("itemsContainer");
    const newRow = document.createElement("div");
    newRow.className = "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 item-row";

    const supplierId = document.getElementById("supplierSelect").value;
    const supplierProducts = this.products.filter(
      (p) => p.supplierId === parseInt(supplierId)
    );

    newRow.innerHTML = `
      <div class="space-y-2">
        <label class="sk-label">Product</label>
        <select name="itemProduct[]" required class="sk-input product-select" onchange="window.stockKeeperDashboard.sections.receiving.onProductChange(this)">
          <option value="">Select product</option>
          ${supplierProducts
            .map(
              (product) => `
            <option value="${product.id}" data-price="${product.price}" data-name="${product.name}">${product.name}</option>
          `
            )
            .join("")}
        </select>
      </div>
      <div class="space-y-2">
        <label class="sk-label">Quantity</label>
        <input type="number" name="itemQuantity[]" required min="1" class="sk-input item-quantity" placeholder="e.g. 10" oninput="window.stockKeeperDashboard.sections.receiving.updateRowSubtotal(this)">
      </div>
      <div class="space-y-2">
        <label class="sk-label">Price (LKR)</label>
        <input type="number" name="itemPrice[]" required min="0" step="0.01" class="sk-input item-price" placeholder="e.g. 100" readonly>
      </div>
      <div class="space-y-2">
        <label class="sk-label">Subtotal (LKR)</label>
        <input type="number" class="sk-input item-subtotal" placeholder="0.00" readonly>
      </div>
    `;
    container.appendChild(newRow);
  }

  onSupplierChange(supplierId) {
    const productSelects = document.querySelectorAll(".product-select");
    const addItemBtn = document.getElementById("addItemBtn");

    if (supplierId) {
      const supplierProducts = this.products.filter(
        (p) => p.supplierId === parseInt(supplierId)
      );

      productSelects.forEach((select) => {
        select.disabled = false;
        select.innerHTML =
          '<option value="">Select product</option>' +
          supplierProducts
            .map(
              (product) =>
                `<option value="${product.id}" data-price="${product.price}" data-name="${product.name}">${product.name}</option>`
            )
            .join("");
      });

      addItemBtn.disabled = false;
    } else {
      productSelects.forEach((select) => {
        select.disabled = true;
        select.innerHTML = '<option value="">Select supplier first</option>';
      });
      addItemBtn.disabled = true;
    }

    this.calculateTotal();
  }

  onProductChange(selectElement) {
    const row = selectElement.closest(".item-row");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.dataset.price || 0;
    const priceInput = row.querySelector(".item-price");
    const quantityInput = row.querySelector(".item-quantity");
    const subtotalInput = row.querySelector(".item-subtotal");

    priceInput.value = price;

    const quantity = parseInt(quantityInput.value) || 0;
    const subtotal = price * quantity;
    subtotalInput.value = subtotal.toFixed(2);

    this.calculateTotal();
  }

  updateRowSubtotal(quantityInput) {
    const row = quantityInput.closest(".item-row");
    const priceInput = row.querySelector(".item-price");
    const subtotalInput = row.querySelector(".item-subtotal");

    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const subtotal = quantity * price;

    subtotalInput.value = subtotal.toFixed(2);
    this.calculateTotal();
  }

  calculateTotal() {
    const subtotalInputs = document.querySelectorAll(".item-subtotal");
    let total = 0;

    subtotalInputs.forEach((input) => {
      const value = parseFloat(input.value) || 0;
      total += value;
    });

    const totalAmountInput = document.getElementById("totalAmount");
    if (totalAmountInput) {
      totalAmountInput.value = total.toFixed(2);
    }
  }

  async markAsReceived(shipmentId) {
    if (!confirm("Mark this shipment as received?")) {
      return;
    }

    try {
      const shipmentData = {
        status: "received",
        actualDeliveryDate: new Date().toISOString(),
      };

      await Shipment.update(shipmentId, shipmentData);

      // Refresh the shipments data
      await this.getShipments();
      await this.getOrders();

      // Re-render the current tab
      const container = document.getElementById("shipmentsContainer");
      if (container) {
        container.innerHTML = this.renderShipments(this.activeTab);
      }

      alert("Shipment marked as received successfully!");
    } catch (error) {
      console.error("Error marking shipment as received:", error);
      alert("Failed to update shipment. Please try again.");
    }
  }

  switchToAdd() {
    this.view = "add";
    this.editingShipment = null;
    this.refresh(this.container);
  }

  switchToList() {
    this.view = "list";
    this.editingShipment = null;
    this.refresh(this.container);
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const itemProducts = formData.getAll("itemProduct[]");
    const itemQuantities = formData.getAll("itemQuantity[]");
    const itemPrices = formData.getAll("itemPrice[]");

    const items = itemProducts.map((productId, index) => {
      const product = this.products.find((p) => p.id === parseInt(productId));
      return {
        name: product ? product.name : "Unknown Product",
        productId: parseInt(productId),
        quantity: parseInt(itemQuantities[index]),
        price: parseFloat(itemPrices[index]),
      };
    });

    const orderData = {
      supplierId: parseInt(formData.get("supplierId")),
      orderDate: new Date(formData.get("orderDate")).toISOString(),
      dueDate: new Date(formData.get("dueDate")).toISOString(),
      totalAmount: parseFloat(formData.get("totalAmount")),
      status: "pending",
      items: items,
    };

    Order.create(orderData)
      .then(() => {
        return Promise.all([this.getShipments(), this.getOrders()]);
      })
      .then(() => {
        this.switchToList();
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        alert("Failed to create order. Please try again.");
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
      if (this.view === "list") {
        this.attachTabListeners(content);
      }
    }
  }

  render() {
    if (this.view === "add") {
      return this.renderAddForm();
    }
    return this.renderList();
  }

  renderList() {
    return `
      <div class="space-y-6 p-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="sk-header-title">Receiving & Shipment</h3>
            <p class="sk-text-muted">Track incoming and outgoing shipments</p>
          </div>
          <button onclick="window.stockKeeperDashboard.sections.receiving.switchToAdd()" class="sk-btn-primary px-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Order
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200">
          <div class="flex border-b border-gray-200">
            ${[
              { id: "pending", label: "Pending", icon: "clock" },
              { id: "received", label: "Received", icon: "check-circle" },
              { id: "in_transit", label: "In Transit", icon: "alert-circle" },
            ]
              .map(
                (tab) => `
              <button data-tab="${
                tab.id
              }" class="tab-btn flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                  this.activeTab === tab.id
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-800"
                }">
                ${getIconHTML(tab.icon)}
                ${tab.label}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="p-6 space-y-4" id="shipmentsContainer">
            ${this.renderShipments(this.activeTab)}
          </div>
        </div>
      </div>
    `;
  }

  renderShipments(period) {
    // For pending tab, show orders instead of shipments
    if (period === "pending") {
      return this.renderOrders();
    }

    const list = this.shipments[period] || [];
    if (list.length === 0) {
      return `<div class="text-sm text-gray-600">No shipments found for ${period.replace(
        "_",
        " "
      )}</div>`;
    }

    return list
      .map(
        (shipment) => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">${
                shipment.shipmentNumber
              }</h4>
              <p class="text-sm sk-text-muted">PO: ${
                shipment.purchaseOrderId
              }</p>
              <p class="text-sm text-gray-600">
                Items: ${
                  shipment.order?.items
                    ?.filter((item) => item && item.name)
                    .map(
                      (item) =>
                        `${item.name}${
                          item.quantity ? ` (x${item.quantity})` : ""
                        }`
                    )
                    .join(", ") || "No items"
                }
              </p>
              ${
                period === "in_transit"
                  ? `
                <p class="text-sm text-gray-500 mt-1">
                  Expected: ${new Date(
                    shipment.expectedDeliveryDate
                  ).toLocaleDateString()}
                </p>
              `
                  : ""
              }
            </div>
            <div class="text-right flex flex-col items-end gap-2">
              ${
                period === "received"
                  ? `<p class="text-sm text-green-600 font-medium">Received: ${new Date(
                      shipment.actualDeliveryDate
                    ).toLocaleDateString()}</p>`
                  : `<p class="text-sm text-indigo-600 font-medium">Status: In Transit</p>`
              }
              ${
                period === "in_transit"
                  ? `
                <button 
                  onclick="window.stockKeeperDashboard.sections.receiving.markAsReceived(${
                    shipment.id
                  })" 
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                  ${getIconHTML("check-circle").replace(
                    'class="w-5 h-5"',
                    'class="w-4 h-4"'
                  )}
                  Mark as Received
                </button>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  renderOrders() {
    const list = this.orders || [];
    if (list.length === 0) {
      return `<div class="text-sm text-gray-600">No pending orders found</div>`;
    }

    return list
      .map(
        (order) => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">Order #${order.id}</h4>
              <p class="text-sm sk-text-muted">Order Date: ${new Date(
                order.orderDate
              ).toLocaleDateString()}</p>
              <p class="text-sm text-gray-600">
                Items: ${
                  Array.isArray(order.items)
                    ? order.items
                        .filter((item) => item && item.name)
                        .map(
                          (item) =>
                            `${item.name}${
                              item.quantity ? ` (x${item.quantity})` : ""
                            }`
                        )
                        .join(", ")
                    : "No items"
                }
              </p>
              <p class="text-sm text-gray-600">
                Total: ${order.totalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "LKR",
                })}
              </p>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
              <p class="text-sm text-gray-600 mt-2">Due: ${new Date(
                order.dueDate
              ).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="sk-header-title">New Order Request</h3>
            <p class="sk-text-muted">Create a new order request for supplier</p>
          </div>
        </div>

        <form id="addShipmentForm" class="sk-card" onsubmit="window.stockKeeperDashboard.sections.receiving.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <div>
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Order Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="sk-label">Supplier</label>
                  <select name="supplierId" id="supplierSelect" required class="sk-input" onchange="window.stockKeeperDashboard.sections.receiving.onSupplierChange(this.value)">
                    <option value="">Select Supplier</option>
                    ${this.suppliers
                      .map(
                        (supplier) => `
                      <option value="${supplier.id}">${
                          supplier.companyName ||
                          supplier.user?.name ||
                          "Supplier " + supplier.id
                        }</option>
                    `
                      )
                      .join("")}
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Order Date</label>
                  <input type="date" name="orderDate" required class="sk-input" value="${
                    new Date().toISOString().split("T")[0]
                  }">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Due Date</label>
                  <input type="date" name="dueDate" required class="sk-input">
                </div>

                <div class="space-y-2">
                  <label class="sk-label">Total Amount (LKR)</label>
                  <input type="number" name="totalAmount" id="totalAmount" required min="0" step="0.01" class="sk-input" placeholder="Auto-calculated" readonly>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-8">
              <h4 class="sk-subheader">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Order Items
              </h4>
              <div class="space-y-4">
                <div id="itemsContainer">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 item-row">
                    <div class="space-y-2">
                      <label class="sk-label">Product</label>
                      <select name="itemProduct[]" required class="sk-input product-select" onchange="window.stockKeeperDashboard.sections.receiving.onProductChange(this)" disabled>
                        <option value="">Select supplier first</option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label class="sk-label">Quantity</label>
                      <input type="number" name="itemQuantity[]" required min="1" class="sk-input item-quantity" placeholder="e.g. 10" oninput="window.stockKeeperDashboard.sections.receiving.updateRowSubtotal(this)">
                    </div>
                    <div class="space-y-2">
                      <label class="sk-label">Price (LKR)</label>
                      <input type="number" name="itemPrice[]" required min="0" step="0.01" class="sk-input item-price" placeholder="e.g. 100" readonly>
                    </div>
                    <div class="space-y-2">
                      <label class="sk-label">Subtotal (LKR)</label>
                      <input type="number" class="sk-input item-subtotal" placeholder="0.00" readonly>
                    </div>
                  </div>
                </div>
                <button type="button" onclick="window.stockKeeperDashboard.sections.receiving.addItemRow()" class="sk-btn-secondary text-sm" id="addItemBtn" disabled>
                  Add Another Item
                </button>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="window.stockKeeperDashboard.sections.receiving.switchToList()" class="sk-btn-secondary">
              Cancel
            </button>
            <button type="submit" class="sk-btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Create Order
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
