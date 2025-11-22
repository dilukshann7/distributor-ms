import logo from "../assets/logo-tr.png";

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
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-800 via-purple-600 to-indigo-400 p-4 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        

        <!-- Right Side - Login Form -->
        <div class="w-full max-w-md">
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p class="text-gray-500">Enter your credentials to access your account</p>
            </div>

            <form id="loginForm" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                  </div>
                  <input id="email" type="email" placeholder="you@example.com"
                    class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400" required />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-semibold text-gray-700">Password</label>
                  <button type="button" id="togglePassword" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Show</button>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input id="password" type="password" placeholder="Enter your password"
                    class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400" required />
                </div>
              </div>

              <div id="error" class="hidden p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span id="errorText" class="text-red-700 font-medium text-sm"></span>
                </div>
              </div>

              <button id="loginBtn" type="submit"
                class="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                <span id="loginBtnText">Sign In</span>
                <svg id="loginBtnIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <svg id="loginBtnSpinner" class="hidden w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>
          </div>

          <!-- Demo Credentials -->
          <div class="mt-6 bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-800 font-bold text-sm flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Demo Credentials
              </h3>
              <button id="toggleCredentials" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <span>Show</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
            <div id="credentialsList" class="hidden space-y-2 max-h-64 overflow-y-auto">
              ${Object.entries(credentials)
                .map(
                  ([r, c]) =>
                    `<div class="flex items-center justify-between text-xs p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group" onclick="document.querySelector('#email').value='${
                      c.email
                    }';document.querySelector('#password').value='${
                      c.password
                    }';">
                      <span class="font-semibold text-gray-700 capitalize">${r.replace(
                        "-",
                        " "
                      )}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-gray-500">${c.email}</span>
                        <span class="text-gray-400">•</span>
                        <span class="text-gray-500">${c.password}</span>
                        <svg class="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector("#loginForm");
  const emailInput = container.querySelector("#email");
  const passwordInput = container.querySelector("#password");
  const errorDiv = container.querySelector("#error");
  const errorText = container.querySelector("#errorText");
  const loginBtn = container.querySelector("#loginBtn");
  const loginBtnText = container.querySelector("#loginBtnText");
  const loginBtnIcon = container.querySelector("#loginBtnIcon");
  const loginBtnSpinner = container.querySelector("#loginBtnSpinner");
  const togglePassword = container.querySelector("#togglePassword");
  const toggleCredentials = container.querySelector("#toggleCredentials");
  const credentialsList = container.querySelector("#credentialsList");

  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.textContent = type === "password" ? "Show" : "Hide";
  });

  toggleCredentials.addEventListener("click", () => {
    credentialsList.classList.toggle("hidden");
    const isHidden = credentialsList.classList.contains("hidden");
    toggleCredentials.querySelector("span").textContent = isHidden
      ? "Show"
      : "Hide";
    toggleCredentials.querySelector("svg").style.transform = isHidden
      ? ""
      : "rotate(180deg)";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorDiv.classList.add("hidden");
    loginBtn.disabled = true;
    loginBtnText.textContent = "Signing in...";
    loginBtnIcon.classList.add("hidden");
    loginBtnSpinner.classList.remove("hidden");

    setTimeout(() => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      const user = Object.values(credentials).find(
        (cred) => cred.email === email && cred.password === password
      );

      if (user) {
        loginBtnText.textContent = "Success!";
        loginBtnSpinner.classList.add("hidden");
        loginBtnIcon.classList.remove("hidden");
        setTimeout(() => {
          renderDashboard(container, user.role);
        }, 500);
      } else {
        errorText.textContent = "Invalid email or password. Please try again.";
        errorDiv.classList.remove("hidden");
        loginBtn.disabled = false;
        loginBtnText.textContent = "Sign In";
        loginBtnSpinner.classList.add("hidden");
        loginBtnIcon.classList.remove("hidden");
      }
    }, 800);
  });
}

export async function renderDashboard(container, role) {
  if (role === "owner") {
    const module = await import("./classes/owner.js");
    await module.renderOwnerDashboard(container);
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
