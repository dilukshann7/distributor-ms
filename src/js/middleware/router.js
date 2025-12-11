import { renderLogin } from "../login.js";
import { renderAssistantManagerDashboard } from "../classes/assistant-manager.js";
import { renderCashierDashboard } from "../classes/cashier.js";
import { renderDistributorDashboard } from "../classes/distributor.js";
import { renderDriverDashboard } from "../classes/driver.js";
import { renderManagerDashboard } from "../classes/manager.js";
import { renderOwnerDashboard } from "../classes/owner.js";
import { renderSalesmanDashboard } from "../classes/salesman.js";
import { renderStockKeeperDashboard } from "../classes/stock-keeper.js";
import { renderSupplierDashboard } from "../classes/supplier.js";
import { render404 } from "../404.js";

const routes = {
  "/": renderLogin,
  "/owner": renderOwnerDashboard,
  "/manager": renderManagerDashboard,
  "/assistant-manager": renderAssistantManagerDashboard,
  "/stock-keeper": renderStockKeeperDashboard,
  "/cashier": renderCashierDashboard,
  "/supplier": renderSupplierDashboard,
  "/distributor": renderDistributorDashboard,
  "/salesman": renderSalesmanDashboard,
  "/driver": renderDriverDashboard,
  "/404": render404,
};

export async function router() {
  const path = window.location.pathname;
  const container = document.getElementById("app");

  if (path === "/") {
    renderLogin(container);
    return;
  }

  try {
    const response = await fetch("/api/check-auth");
    const data = await response.json();

    if (!data.isAuth) {
      navigateTo("/");
      return;
    }

    if (path === "/404") {
      render404(container);
      return;
    }

    const startPath = path.split("/")[1];

    if (data.user.role === startPath && routes[path]) {
      routes[path](container);
    } else {
      navigateTo("/404");
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    navigateTo("/");
  }
}

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  router();
}

window.addEventListener("popstate", router);
