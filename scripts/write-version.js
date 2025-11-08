import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const version = { version: new Date().toISOString() };
fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version, null, 2));
console.log('Wrote public/version.json', version);

// scripts/write-version.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read package.json without using `import` assertions
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// write the version file (update path as needed)
const outPath = path.join(__dirname, '..', 'dist', 'version.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ version: pkg.version }, null, 2));
console.log('Wrote version', pkg.version);