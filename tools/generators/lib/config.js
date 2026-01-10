/**
 * Configuration loader for generators
 */

const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "..", "generator.config.json");

let config = null;

function loadConfig() {
  if (config) return config;

  if (fs.existsSync(CONFIG_FILE)) {
    const content = fs.readFileSync(CONFIG_FILE, "utf-8");
    config = JSON.parse(content);
  } else {
    // Default config
    config = {
      project: { name: "Angular App", prefix: "app" },
      author: { default: "developer", updater: "developer" },
      paths: {
        models: "src/app/models",
        services: "src/app/services",
        store: "src/app/store",
        components: "src/app/components",
      },
      api: { baseUrl: "http://localhost:3000" },
      fileHeader: { enabled: true },
    };
  }

  return config;
}

function getConfig() {
  return loadConfig();
}

function getProjectName() {
  return loadConfig().project.name;
}

function getAuthor() {
  return loadConfig().author.default;
}

function getUpdater() {
  return loadConfig().author.updater;
}

function getPath(type) {
  return loadConfig().paths[type] || `src/app/${type}`;
}

function getApiBaseUrl() {
  return loadConfig().api.baseUrl;
}

function isFileHeaderEnabled() {
  return loadConfig().fileHeader.enabled;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function generateFileHeader(bdId, description) {
  if (!isFileHeaderEnabled()) return "";

  const today = getToday();
  return `/**
 * @Project       ${getProjectName()}
 * @BD_ID         ${bdId}
 * @Description   ${description}
 * @Author        ${getAuthor()}
 * @CreatedDate   ${today}
 * @Updater       ${getUpdater()}
 * @LastUpdated   ${today}
 */

`;
}

module.exports = {
  getConfig,
  getProjectName,
  getAuthor,
  getUpdater,
  getPath,
  getApiBaseUrl,
  isFileHeaderEnabled,
  getToday,
  generateFileHeader,
};
