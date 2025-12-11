import { getIconHTML } from "../assets/icons/index.js";
import { navigateTo } from "./middleware/router.js";
import chihuahua from "../assets/404.gif";

export function render404(container) {
  container.innerHTML = `
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/20 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-slate-700/30 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center justify-center gap-8">
        <div class="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-2xl">
            <img class="w-64 h-64" src="${chihuahua}" alt="Chihuahua Laughing GIF">
        </div>
        
        <div class="text-center">
          <h1 class="text-6xl font-black text-white mb-2 drop-shadow-lg">
            Dhenne Homba Revert Venna
          </h1>
          <p class="text-xl text-white/80 font-medium mb-6">
            Got your ass that was tryna sneak into other peoples profiles... 
          </p>
          <button onclick="window.history.back()" 
            class="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 mx-auto">
            ${getIconHTML("arrow-right")}
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
