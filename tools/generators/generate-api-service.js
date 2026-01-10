#!/usr/bin/env node
/**
 * Generator for API Service
 *
 * Usage: node tools/generators/generate-api-service.js <name> [--endpoint=<url>]
 * Example: node tools/generators/generate-api-service.js user --endpoint=/api/users
 */

const path = require("path");
const { generateFileHeader, getPath, getApiBaseUrl } = require("./lib/config");
const {
  toPascalCase,
  toUpperCase,
  writeFile,
  parseArgs,
  ensureDir,
} = require("./lib/utils");

const { name, options } = parseArgs(process.argv.slice(2));

if (!name) {
  console.error("❌ Error: Please provide a name");
  console.log(
    "Usage: node tools/generators/generate-api-service.js <name> [--endpoint=<url>]"
  );
  process.exit(1);
}

const Name = toPascalCase(name);
const NAME = toUpperCase(name);
const servicesPath = getPath("services");
const baseUrl = getApiBaseUrl();
const endpoint = options.endpoint || `${baseUrl}/${name}s`;

ensureDir(servicesPath);

const content = `${generateFileHeader(
  `${NAME}-001`,
  `HTTP API service for ${Name} CRUD operations`
)}import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ${Name} } from '../models/${name}.model';

@Injectable({ providedIn: 'root' })
export class ${Name}ApiService {
  private readonly apiUrl = '${endpoint}';

  constructor(private http: HttpClient) {}

  getAll(): Observable<${Name}[]> {
    return this.http.get<${Name}[]>(this.apiUrl);
  }

  getById(id: string): Observable<${Name}> {
    return this.http.get<${Name}>(\`\${this.apiUrl}/\${id}\`);
  }

  create(data: Omit<${Name}, 'id'>): Observable<${Name}> {
    return this.http.post<${Name}>(this.apiUrl, data);
  }

  update(id: string, updates: Partial<${Name}>): Observable<${Name}> {
    return this.http.patch<${Name}>(\`\${this.apiUrl}/\${id}\`, updates);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}
`;

writeFile(path.join(servicesPath, `${name}-api.service.ts`), content);

console.log(`
🎉 API Service "${Name}ApiService" generated!

📡 Endpoint: ${endpoint}
`);
