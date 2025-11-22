import { Customer } from "../../models/Customer.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class CustomerAccounts {
  constructor(container) {
    this.container = container;
    this.customers = [];
    this.view = "list";
  }

  async getCustomers() {
    try {
      const response = await Customer.getAll();
      this.customers = response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.customers = [];
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
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Customer Accounts</h2>
            <p class="text-gray-600 mt-1">Manage customer information and purchase history</p>
          </div>
          <button onclick="$s.customers.showFormHandler()" class="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium">
            ${getIconHTML("plus")}
            Add Customer
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact Info</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Orders</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Loyalty Points</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${this.customers
                .map(
                  (customer) => `
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-900">${
                        customer.name
                      }</span>
                      ${
                        customer.isVIP
                          ? '<span class="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded">VIP</span>'
                          : ""
                      }
                    </div>
                    ${
                      customer.businessName
                        ? `<div class="text-sm text-gray-500">${customer.businessName}</div>`
                        : ""
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1">
                      ${
                        customer.phone
                          ? `
                      <a href="tel:${
                        customer.phone
                      }" class="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                        ${getIconHTML("phone")}
                        ${customer.phone}
                      </a>`
                          : ""
                      }
                      <a href="mailto:${
                        customer.email
                      }" class="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                        ${getIconHTML("mail")}
                        ${customer.email}
                      </a>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-700 font-semibold">${
                    customer.totalPurchases
                  }</td>
                  <td class="px-6 py-4 text-gray-700 font-semibold">Rs. ${customer.totalSpent.toLocaleString()}</td>
                  <td class="px-6 py-4 text-gray-700 font-semibold">${
                    customer.loyaltyPoints
                  }</td>
                  
                  <td class="px-6 py-4 flex gap-2">
                    <button onclick="$s.customers.deleteCustomerHandler(${
                      customer.id
                    })" class="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      ${getIconHTML("trash")}
                    </button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderAddForm() {
    return `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Add New Customer</h3>
            <p class="text-gray-600 mt-1">Create a new customer account</p>
          </div>
        </div>

        <form id="addCustomerForm" class="bg-white rounded-lg shadow-md overflow-hidden" onsubmit="$s.customers.submitAddForm(event)">
          <div class="p-8 space-y-8">
            
            <!-- Customer Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("users").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Customer Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Full Name <span class="text-red-600">*</span></label>
                  <input type="text" name="name" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="e.g. John Doe">
                </div>
                
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Email <span class="text-red-600">*</span></label>
                  <input type="email" name="email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="e.g. john@example.com">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="tel" name="phone" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="e.g. +94771234567">
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Business Name <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="businessName" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="e.g. ABC Corporation">
                </div>

                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea name="address" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="Enter full address with city and postal code"></textarea>
                </div>
              </div>
            </div>

            <!-- Account Details -->
            <div class="border-t border-gray-100 pt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ${getIconHTML("shopping-cart").replace(
                  'class="w-5 h-5"',
                  'class="w-5 h-5 text-sky-600"'
                )}
                Account Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Customer Type</label>
                  <select name="customerType" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="regular" selected>Regular</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="retail">Retail</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="active" selected>Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">VIP Customer</label>
                  <div class="flex items-center h-[42px]">
                    <input type="checkbox" name="isVIP" id="isVIP" class="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500">
                    <label for="isVIP" class="ml-3 text-sm text-gray-700">Mark as VIP customer</label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Initial Loyalty Points</label>
                  <input type="number" name="loyaltyPoints" min="0" value="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="0">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button type="button" onclick="$s.customers.hideFormHandler()" class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2">
              ${getIconHTML("check-circle")}
              Add Customer
            </button>
          </div>
        </form>
      </div>
    `;
  }

  showFormHandler() {
    this.view = "add";
    this.refresh(this.container);
  }

  hideFormHandler() {
    this.view = "list";
    this.refresh(this.container);
  }

  submitAddForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const customerData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
      businessName: formData.get("businessName") || null,
      customerType: formData.get("customerType") || null,
      isVIP: formData.get("isVIP") === "on",
      status: formData.get("status"),
      loyaltyPoints: parseInt(formData.get("loyaltyPoints")) || 0,
      totalPurchases: 0,
      totalSpent: 0,
    };

    Customer.create(customerData)
      .then(() => {
        this.getCustomers().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error creating customer:", error);
        alert("Error creating customer. Please try again.");
      });
  }

  deleteCustomerHandler(customerID) {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    Customer.delete(customerID)
      .then(() => {
        this.getCustomers().then(() => this.hideFormHandler());
      })
      .catch((error) => {
        console.error("Error removing customer:", error);
        alert("Error removing customer. Please try again.");
      });
  }

  refresh(container) {
    const content = container.querySelector("#dashboardContent");
    if (content) {
      content.innerHTML = `<div class="p-8">${this.render()}</div>`;
    }
  }
}
