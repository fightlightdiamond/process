#!/usr/bin/env node
/**
 * Generator for Model interfaces
 *
 * Usage: node tools/generators/generate-model.js <name> [--fields=<fields>]
 * Example: node tools/generators/generate-model.js product --fields=name:string,price:number
 */

const path = require("path");
const { generateFileHeader, getPath } = require("./lib/config");
const {
  toPascalCase,
  toUpperCase,
  writeFile,
  parseArgs,
  parseFields,
  ensureDir,
} = require("./lib/utils");

const { name, options } = parseArgs(process.argv.slice(2));

if (!name) {
  console.error("❌ Error: Please provide a name");
  console.log(
    "Usage: node tools/generators/generate-model.js <name> [--fields=<fields>]"
  );
  process.exit(1);
}

const Name = toPascalCase(name);
const NAME = toUpperCase(name);
const modelsPath = getPath("models");

ensureDir(modelsPath);

// Parse fields
let fields = [{ name: "id", type: "string" }];
if (options.fields) {
  fields = [{ name: "id", type: "string" }, ...parseFields(options.fields)];
} else {
  fields.push({ name: "name", type: "string" });
}

const fieldsString = fields.map((f) => `  ${f.name}: ${f.type};`).join("\n");

const content = `${generateFileHeader(
  `${NAME}-001`,
  `${Name} model interfaces and types`
)}export interface ${Name} {
${fieldsString}
}

export interface ${Name}State {
  ${name}s: ${Name}[];
  loading: boolean;
  error: string | null;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
}
`;

writeFile(path.join(modelsPath, `${name}.model.ts`), content);

console.log(`
🎉 Model "${Name}" generated!

📄 Fields: ${fields.map((f) => f.name).join(", ")}
`);
