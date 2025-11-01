export const credentials = {
  owner: { email: "owner@dbms.com", password: "owner", role: "owner" },
  manager: { email: "manager@dbms.com", password: "manager", role: "manager" },
  "assistant-manager": {
    email: "asst@dbms.com",
    password: "assistant",
    role: "assistant-manager",
  },
  "stock-keeper": {
    email: "stock@dbms.com",
    password: "stock",
    role: "stock-keeper",
  },
  cashier: { email: "cashier@dbms.com", password: "cashier", role: "cashier" },
  supplier: {
    email: "supplier@dbms.com",
    password: "supplier",
    role: "supplier",
  },
  distributor: {
    email: "distributor@dbms.com",
    password: "distributor",
    role: "distributor",
  },
  salesman: {
    email: "salesman@dbms.com",
    password: "salesman",
    role: "salesman",
  },
  driver: { email: "driver@dbms.com", password: "driver", role: "driver" },
};

export function renderLogin(container) {
  container.innerHTML = `
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12H3m12 0l-3 3m3-3l-3-3m6-7H9a2 2 0 00-2 2v2m12 12v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Distribution System</h1>
        <p class="text-gray-400">Business Management Platform</p>
      </div>

      <div class="bg-white rounded-xl shadow-2xl p-8 mb-6">
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input id="email" type="email" placeholder="Enter your email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="password" type="password" placeholder="Enter your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" required />
          </div>

          <div id="error" class="hidden p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

          <button id="loginBtn" type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Login
          </button>
        </form>
      </div>

      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 class="text-white font-semibold mb-4 text-sm">Demo Credentials</h3>
        <div class="space-y-2 text-xs">
          ${Object.entries(credentials)
            .map(
              ([r, c]) =>
                `<div class="flex justify-between text-gray-300"><span>${r.replace(
                  "-",
                  " "
                )}:</span><span class="text-gray-400">${c.email} / ${
                  c.password
                }</span></div>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector("#loginForm");
  const emailInput = container.querySelector("#email");
  const passwordInput = container.querySelector("#password");
  const errorDiv = container.querySelector("#error");
  const loginBtn = container.querySelector("#loginBtn");

  // form.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   errorDiv.classList.add("hidden");
  //   loginBtn.disabled = true;
  //   loginBtn.textContent = "Logging in...";
  //
  //   setTimeout(() => {
  //     const email = emailInput.value.trim();
  //     const password = passwordInput.value.trim();
  //
  //     const user = Object.values(credentials).find(
  //       (cred) => cred.email === email && cred.password === password
  //     );
  //
  //     if (user) {
  //       renderDashboard(container, user.role);
  //     } else {
  //       errorDiv.textContent = "Invalid email or password";
  //       errorDiv.classList.remove("hidden");
  //     }
  //
  //     loginBtn.disabled = false;
  //     loginBtn.textContent = "Login";
  //   }, 600);
  // });
    renderDashboard(container, "owner");
}

export function renderDashboard(container, role) {
  if (role === "owner") {
    import("./classes/owner.js").then((module) => {
      module.renderOwnerDashboard(container);
    });
  } else if (role === "manager") {
    import("./classes/manager.js").then((module) => {
      module.renderManagerDashboard(container);
    });
  } else if (role === "assistant-manager") {
    import("./classes/assistant-manager.js").then((module) => {
      module.renderAssistantManagerDashboard(container);
    });
  } else if (role === "stock-keeper") {
    import("./classes/stock-keeper.js").then((module) => {
      module.renderStockKeeperDashboard(container);
    });
  } else if (role === "cashier") {
    import("./classes/cashier.js").then((module) => {
      module.renderCashierDashboard(container);
    });
  } else if (role === "supplier") {
    import("./classes/supplier.js").then((module) => {
      module.renderSupplierDashboard(container);
    });
  } else if (role === "distributor") {
    import("./classes/distributor.js").then((module) => {
      module.renderDistributorDashboard(container);
    });
  } else if (role === "salesman") {
    import("./classes/salesman.js").then((module) => {
      module.renderSalesmanDashboard(container);
    });
  } else if (role === "driver") {
    import("./classes/driver.js").then((module) => {
      module.renderDriverDashboard(container);
    });
  } else {
    container.innerHTML = `
      <div class="text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Welcome, ${role.toUpperCase()}</h2>
        <p class="text-gray-300 mb-6">You are now logged in as <strong>${role}</strong>.</p>
        <button id="logoutBtn" class="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Logout</button>
      </div>
    `;

    container
      .querySelector("#logoutBtn")
      .addEventListener("click", () => renderLogin(container));
  }
}
