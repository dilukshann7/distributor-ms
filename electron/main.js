import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle portable path for userData
if (process.env.PORTABLE_EXECUTABLE_DIR) {
  app.setPath(
    "userData",
    path.join(process.env.PORTABLE_EXECUTABLE_DIR, "distributor-ms-data"),
  );
}

// V8 optimizations for faster startup
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512");
app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");

let mainWindow = null;
let serverProcess = null;
const SERVER_PORT = 3000;

// Get the correct base path for resources
function getAppBasePath() {
  if (app.isPackaged) {
    // When packaged, files are in app.asar
    return path.dirname(app.getAppPath());
  }
  return path.join(__dirname, "..");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: "ADP Namasinghe Distribution Management System",
    autoHideMenuBar: true,
    show: false, // Don't show until ready
    backgroundColor: "#1a1a2e",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      devTools: true, // Enable dev tools for debugging
    },
  });

  // Remove menu bar for cleaner look
  mainWindow.setMenu(null);

  // Wait for page to be ready before showing (faster perceived startup)
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Load the app with error handling
  mainWindow.loadURL(`http://localhost:${SERVER_PORT}`).catch((err) => {
    console.error("Failed to load URL:", err);
    // Show error page
    mainWindow.loadURL(`data:text/html,<html><body style="background:#1a1a2e;color:white;font-family:Arial;padding:50px;text-align:center;"><h1>Server Connection Failed</h1><p>Could not connect to the application server on port ${SERVER_PORT}</p><p>Please check the console logs for details.</p></body></html>`);
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    // For packaged apps, server.js is in app.asar.unpacked
    const basePath = getAppBasePath();

    let serverPath, cwd;
    if (app.isPackaged) {
      // Server files should be in app.asar.unpacked for Node to access them
      serverPath = path.join(basePath, "app.asar.unpacked", "api", "server.js");
      cwd = path.join(basePath, "app.asar.unpacked");

      // Check if unpacked exists, otherwise try regular asar path
      if (!fs.existsSync(serverPath)) {
        serverPath = path.join(app.getAppPath(), "api", "server.js");
        cwd = app.getAppPath();
      }
    } else {
      serverPath = path.join(__dirname, "..", "api", "server.js");
      cwd = path.join(__dirname, "..");
    }

    console.log("Starting server from:", serverPath);
    console.log("CWD:", cwd);
    console.log("App is packaged:", app.isPackaged);

    // Find node executable
    let nodeExe = "node";
    if (process.platform === "win32") {
      // Try to use bundled Node.js or system Node
      const bundledNode = path.join(basePath, "node.exe");
      if (fs.existsSync(bundledNode)) {
        nodeExe = bundledNode;
      }
    }

    serverProcess = spawn(nodeExe, [serverPath], {
      cwd: cwd,
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: SERVER_PORT.toString(),
      },
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    let resolved = false;

    serverProcess.stdout.on("data", (data) => {
      console.log(`Server: ${data}`);
      // Quick check if server logged it's running
      if (!resolved && data.toString().includes("running on")) {
        resolved = true;
        setTimeout(resolve, 300);
      }
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on("error", (err) => {
      console.error("Failed to start server:", err);
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    serverProcess.on("exit", (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Health check fallback
    let healthCheckAttempts = 0;
    const maxAttempts = 30;

    const checkHealth = async () => {
      if (resolved) return;

      healthCheckAttempts++;
      try {
        const response = await fetch(
          `http://localhost:${SERVER_PORT}/api/health`,
        ).catch(() => null);
        if (response && response.ok) {
          console.log("Server is ready!");
          if (!resolved) {
            resolved = true;
            resolve();
          }
          return;
        }
      } catch (e) {
        // Server not ready yet
      }

      if (healthCheckAttempts < maxAttempts && !resolved) {
        setTimeout(checkHealth, 500);
      } else if (!resolved) {
        // Proceed anyway after max attempts - server might still be starting
        console.log("Server health check timeout, proceeding...");
        resolved = true;
        resolve();
      }
    };

    // Start health checking after a brief delay
    setTimeout(checkHealth, 1000);
  });
}

function stopServer() {
  if (serverProcess) {
    console.log("Stopping server...");
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", serverProcess.pid, "/f", "/t"]);
    } else {
      serverProcess.kill("SIGTERM");
    }
    serverProcess = null;
  }
}

// Single instance lock for portability
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      await startServer();
      createWindow();
    } catch (error) {
      console.error("Failed to start application:", error);
      app.quit();
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  stopServer();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  stopServer();
});

app.on("quit", () => {
  stopServer();
});
