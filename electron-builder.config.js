/**
 * Electron Builder Configuration
 * Builds to win-unpacked directory (not portable exe) using Prisma Cloud
 */
module.exports = {
  appId: "com.adpnamasinghe.distributor-ms",
  productName: "ADP Namasinghe DMS",
  copyright: "Copyright © 2026 ADP Namasinghe & Co.",

  // Directories
  directories: {
    output: "dist/dist-electron",
    buildResources: "electron/resources",
  },

  // Files to include (production dependencies only)
  files: [
    "dist/**/*",
    "api/**/*",
    "prisma/**/*",
    "electron/**/*",
    ".env",
    "package.json",
    // Include only production node_modules
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*",
    "node_modules/prisma/**/*",
    "node_modules/@quixo3/**/*",
    "node_modules/axios/**/*",
    "node_modules/bcrypt/**/*",
    "node_modules/cors/**/*",
    "node_modules/dotenv/**/*",
    "node_modules/express/**/*",
    "node_modules/express-session/**/*",
    "node_modules/jspdf/**/*",
    "node_modules/jspdf-autotable/**/*",
    "node_modules/lit/**/*",
    "node_modules/redis/**/*",
    // Express dependencies
    "node_modules/body-parser/**/*",
    "node_modules/cookie/**/*",
    "node_modules/cookie-parser/**/*",
    "node_modules/cookie-signature/**/*",
    "node_modules/content-disposition/**/*",
    "node_modules/content-type/**/*",
    "node_modules/depd/**/*",
    "node_modules/destroy/**/*",
    "node_modules/encodeurl/**/*",
    "node_modules/escape-html/**/*",
    "node_modules/etag/**/*",
    "node_modules/finalhandler/**/*",
    "node_modules/fresh/**/*",
    "node_modules/http-errors/**/*",
    "node_modules/inherits/**/*",
    "node_modules/merge-descriptors/**/*",
    "node_modules/methods/**/*",
    "node_modules/mime/**/*",
    "node_modules/mime-types/**/*",
    "node_modules/mime-db/**/*",
    "node_modules/ms/**/*",
    "node_modules/on-finished/**/*",
    "node_modules/parseurl/**/*",
    "node_modules/path-to-regexp/**/*",
    "node_modules/proxy-addr/**/*",
    "node_modules/qs/**/*",
    "node_modules/range-parser/**/*",
    "node_modules/raw-body/**/*",
    "node_modules/safe-buffer/**/*",
    "node_modules/safer-buffer/**/*",
    "node_modules/send/**/*",
    "node_modules/serve-static/**/*",
    "node_modules/setprototypeof/**/*",
    "node_modules/statuses/**/*",
    "node_modules/type-is/**/*",
    "node_modules/unpipe/**/*",
    "node_modules/utils-merge/**/*",
    "node_modules/vary/**/*",
    "node_modules/uid-safe/**/*",
    "node_modules/random-bytes/**/*",
    "node_modules/bytes/**/*",
    "node_modules/iconv-lite/**/*",
    "node_modules/once/**/*",
    "node_modules/wrappy/**/*",
    "node_modules/accepts/**/*",
    "node_modules/negotiator/**/*",
    "node_modules/forwarded/**/*",
    "node_modules/ipaddr.js/**/*",
    "node_modules/media-typer/**/*",
    "node_modules/ee-first/**/*",
    "node_modules/debug/**/*",
    "node_modules/object-assign/**/*",
    // Lit dependencies
    "node_modules/@lit/**/*",
    "node_modules/lit-html/**/*",
    "node_modules/lit-element/**/*",
    "node_modules/@lit-labs/**/*",
    // bcrypt native deps
    "node_modules/@mapbox/**/*",
    "node_modules/node-addon-api/**/*",
    // Other dependencies
    "node_modules/follow-redirects/**/*",
    "node_modules/form-data/**/*",
    "node_modules/combined-stream/**/*",
    "node_modules/delayed-stream/**/*",
    "node_modules/asynckit/**/*",
    "node_modules/proxy-from-env/**/*",
    // Exclude unnecessary files from included modules
    "!node_modules/**/test/**/*",
    "!node_modules/**/tests/**/*",
    "!node_modules/**/__tests__/**/*",
    "!node_modules/**/*.test.js",
    "!node_modules/**/*.spec.js",
    "!node_modules/**/*.map",
    "!node_modules/**/*.ts",
    "!node_modules/**/README*",
    "!node_modules/**/CHANGELOG*",
    "!node_modules/**/LICENSE*",
    "!node_modules/**/.npmignore",
  ],

  // Disable ASAR - keep files unpacked for easier debugging and Node access
  asar: false,

  // Windows configuration - build directory only, no installer/portable
  win: {
    target: [
      {
        target: "dir",
        arch: ["x64"],
      },
    ],
  },

  // Compression for smaller size
  compression: "maximum",

  // Remove package scripts for clean build
  removePackageScripts: true,

  // Node modules handling
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
};
