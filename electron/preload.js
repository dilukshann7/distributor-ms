// Preload script - minimal for security
// Context isolation is enabled, so this is empty by default
// Add IPC handlers here if needed for native features

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  isElectron: true,
});
