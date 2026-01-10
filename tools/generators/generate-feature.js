#!/usr/bin/env node
/**
 * Generator for complete feature (model + service + store)
 *
 * Usage: node tools/generators/generate-feature.js <name> [--fields=<fields>]
 * Example: node tools/generators/generate-feature.js product --fields=name:string,price:number
 */

const { execSync } = require("child_process");
const path = require("path");
const { toPascalCase, parseArgs } = require("./lib/utils");
const { getPath } = require("./lib/config");

const { name, options } = parseArgs(process.argv.slice(2));

if (!name) {
  console.error("❌ Error: Please provide a feature name");
  console.log(
    "Usage: node tools/generators/generate-feature.js <name> [--fields=<fields>]"
  );
  process.exit(1);
}

const Name = toPascalCase(name);
const fieldsArg = options.fields ? `--fields=${options.fields}` : "";
const generatorsPath = __dirname;

console.log(`\n🚀 Generating feature: ${Name}\n${"=".repeat(50)}`);

try {
  console.log("\n📦 Step 1: Generating Model...");
  execSync(
    `node "${path.join(
      generatorsPath,
      "generate-model.js"
    )}" ${name} ${fieldsArg}`,
    { stdio: "inherit" }
  );

  console.log("\n📡 Step 2: Generating API Service...");
  execSync(
    `node "${path.join(generatorsPath, "generate-api-service.js")}" ${name}`,
    { stdio: "inherit" }
  );

  console.log("\n🏪 Step 3: Generating Store...");
  execSync(`node "${path.join(generatorsPath, "generate-store.js")}" ${name}`, {
    stdio: "inherit",
  });

  console.log(`\n${"=".repeat(50)}`);
  console.log(`\n🎉 Feature "${Name}" generated successfully!\n`);
  console.log(`📁 Created:
   - ${getPath("models")}/${name}.model.ts
   - ${getPath("services")}/${name}-api.service.ts
   - ${getPath("store")}/${name}/

📝 Next: ng g c components/${name}-container
`);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
