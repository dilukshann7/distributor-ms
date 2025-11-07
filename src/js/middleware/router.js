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
};

export function router() {
  const path = window.location.pathname;
  const container = document.getElementById("app");
  const page = routes[path] || renderLogin;
  page(container);
}

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  router();
}

window.addEventListener("popstate", router);
