import logo from "../assets/logo-tr.png";
import { getIconHTML } from "../assets/icons/index.js";

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
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/20 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-slate-700/30 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div class="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        

        <div class="w-full max-w-md">
          <div class="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <span class="text-white">${getIconHTML("lock-closed").replace(
                  "w-5 h-5",
                  "w-8 h-8"
                )}</span>
              </div>
              <h2 class="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p class="text-white/80">Enter your credentials to access your account</p>
            </div>

            <form id="loginForm" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-white/90">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                    ${getIconHTML("at-symbol")}
                  </div>
                  <input id="email" type="email" placeholder="you@example.com"
                    class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/40 outline-none transition-all text-white placeholder-white/50" required />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-semibold text-white/90">Password</label>
                  <button type="button" id="togglePassword" class="text-sm text-white/80 hover:text-white font-medium">Show</button>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                    ${getIconHTML("lock-closed")}
                  </div>
                  <input id="password" type="password" placeholder="Enter your password"
                    class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/40 outline-none transition-all text-white placeholder-white/50" required />
                </div>
              </div>

              <div id="error" class="hidden p-4 bg-red-500/20 backdrop-blur-sm border-l-4 border-red-400 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-red-300">
                    ${getIconHTML("alert-circle")}
                  </span>
                  <span id="errorText" class="text-white font-medium text-sm"></span>
                </div>
              </div>

              <button id="loginBtn" type="submit"
                class="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-3.5 rounded-xl font-semibold hover:bg-white/30 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                <span id="loginBtnText">Sign In</span>
                <span id="loginBtnIcon">${getIconHTML("arrow-right")}</span>
                <svg id="loginBtnSpinner" class="hidden w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>
          </div>

          <div class="mt-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-sm flex items-center gap-2">
                <span class="text-white/80">
                  ${getIconHTML("info").replace("w-5 h-5", "w-4 h-4")}
                </span>
                Demo Credentials
              </h3>
              <button id="toggleCredentials" class="text-xs text-white/80 hover:text-white font-medium flex items-center gap-1">
                <span>Show</span>
                <span id="toggleCredentialsIcon">${getIconHTML(
                  "chevron-down"
                ).replace("w-5 h-5", "w-4 h-4")}</span>
              </button>
            </div>
            <div id="credentialsList" class="hidden space-y-2 max-h-64 overflow-y-auto">
              ${Object.entries(credentials)
                .map(
                  ([r, c]) =>
                    `<div class="flex items-center justify-between text-xs p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer group border border-white/20" onclick="document.querySelector('#email').value='${
                      c.email
                    }';document.querySelector('#password').value='${
                      c.password
                    }';">
                      <span class="font-semibold text-white capitalize">${r.replace(
                        "-",
                        " "
                      )}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-white/70">${c.email}</span>
                        <span class="text-white/50">•</span>
                        <span class="text-white/70">${c.password}</span>
                        <span class="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          ${getIconHTML("chevron-right").replace(
                            "w-5 h-5",
                            "w-4 h-4"
                          )}
                        </span>
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
    toggleCredentials.querySelector(
      "#toggleCredentialsIcon > svg"
    ).style.transform = isHidden ? "" : "rotate(180deg)";
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
