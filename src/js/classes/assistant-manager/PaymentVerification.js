export class PaymentVerification {
  constructor(container) {
    this.container = container;
    this.payments = [
      {
        id: 1,
        type: "Cash Collection",
        amount: 5200,
        source: "Salesman - Ahmed",
        date: "2025-01-19",
        status: "pending",
      },
      {
        id: 2,
        type: "Check Payment",
        amount: 3500,
        source: "Customer - ABC Store",
        date: "2025-01-19",
        status: "verified",
      },
      {
        id: 3,
        type: "Online Transfer",
        amount: 8900,
        source: "Customer - XYZ Retail",
        date: "2025-01-18",
        status: "verified",
      },
      {
        id: 4,
        type: "Cash Collection",
        amount: 2100,
        source: "Salesman - Ravi",
        date: "2025-01-18",
        status: "pending",
      },
      {
        id: 5,
        type: "Check Payment",
        amount: 4500,
        source: "Customer - DEF Mart",
        date: "2025-01-17",
        status: "verified",
      },
    ];
  }

  render() {
    return `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Payment Verification Workflow</h3>
            <p class="text-gray-600 text-sm mt-1">Verify cash and check payments collected by sales team</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Type</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .map(
                    (payment) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-800">${
                      payment.type
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">$${payment.amount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.source
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      payment.date
                    }</td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${
                          payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)
                        }
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      ${
                        payment.status === "pending"
                          ? `
                        <div class="flex gap-2">
                          <button class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                            Verify
                          </button>
                          <button class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      `
                          : ""
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
