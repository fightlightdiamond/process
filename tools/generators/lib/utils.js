/**
 * Utility functions for generators
 */

const fs = require("fs");
const path = require("path");

/**
 * Convert string to different cases
 */
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toUpperCase(str) {
  return str.toUpperCase();
}

/**
 * Create directory if not exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write file with logging
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const result = {
    name: null,
    options: {},
  };

  args.forEach((arg, index) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      result.options[key] = value || true;
    } else if (index === 0) {
      result.name = arg.toLowerCase();
    }
  });

  return result;
}

/**
 * Parse fields string to array
 * Example: "name:string,price:number" => [{name: 'name', type: 'string'}, ...]
 */
function parseFields(fieldsStr) {
  if (!fieldsStr) return [];

  return fieldsStr.split(",").map((field) => {
    const [name, type] = field.split(":");
    return { name: name.trim(), type: type?.trim() || "string" };
  });
}

module.exports = {
  toKebabCase,
  toPascalCase,
  toCamelCase,
  toUpperCase,
  ensureDir,
  writeFile,
  parseArgs,
  parseFields,
};
