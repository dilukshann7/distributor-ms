import logo from "../assets/logo-tr.png";
import { getIconHTML } from "../assets/icons/index.js";
import { navigateTo } from "./middleware/router.js";

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

            <form method="post" action="/api/login" id="loginForm" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-white/90">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                    ${getIconHTML("at-symbol")}
                  </div>
                  <input id="email" name="email" type="email" placeholder="you@example.com"
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
                  <input id="password" name="password" type="password" placeholder="Enter your password"
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
        </div>
      </div>
    </div>
  `;
}
