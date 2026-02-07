import logo from "../assets/logo-tr.png";
import { getIconHTML } from "../assets/icons/index.js";
import { navigateTo } from "./middleware/router.js";

export function renderLogin(container) {
  container.innerHTML = `
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-slate-50">
              <span class="text-slate-700">${getIconHTML("lock-closed").replace(
                "w-5 h-5",
                "w-5 h-5",
              )}</span>
            </div>
            <div>
              <p class="text-sm text-slate-500">Welcome back</p>
              <h2 class="text-2xl font-semibold text-slate-900">Sign in</h2>
            </div>
          </div>

          <form method="post" action="/api/login" id="loginForm" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  ${getIconHTML("at-symbol")}
                </div>
                <input id="email" name="email" type="email" placeholder="you@example.com"
                  class="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 outline-none transition-all text-slate-900 placeholder-slate-400" required />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" id="togglePassword" class="text-sm text-slate-500 hover:text-slate-700">Show</button>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  ${getIconHTML("lock-closed")}
                </div>
                <input id="password" name="password" type="password" placeholder="Enter your password"
                  class="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 outline-none transition-all text-slate-900 placeholder-slate-400" required />
              </div>
            </div>

            <div id="error" class="hidden p-3 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-red-500">
                  ${getIconHTML("alert-circle")}
                </span>
                <span id="errorText" class="text-red-700 text-sm font-medium"></span>
              </div>
            </div>

            <button id="loginBtn" type="submit"
              class="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span id="loginBtnText">Sign In</span>
              <span id="loginBtnIcon">${getIconHTML("arrow-right")}</span>
              <svg id="loginBtnSpinner" class="hidden w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

            <p class="text-center text-xs text-slate-500">
              By continuing, you agree to the security policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  `;

  const passwordInput = container.querySelector("#password");
  const togglePasswordBtn = container.querySelector("#togglePassword");

  if (passwordInput && togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
    });
  }
}
