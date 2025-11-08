const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const version = { version: new Date().toISOString() };
fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version, null, 2));
console.log('Wrote public/version.json', version);
