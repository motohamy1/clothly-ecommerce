/**
 * Patches node_modules/lightswind after install.
 *
 * lightswind/plugin.js emits `@property --border-angle { syntax: <angle> ... }`
 * with an UNQUOTED syntax descriptor. Per the CSS spec, the `syntax` descriptor
 * must be a quoted string, so PostCSS/lightningcss fail with:
 *   "Parsing CSS source code failed ... Unexpected token Delim('<')"
 *
 * The correct form (already used elsewhere in the same file) is `syntax: "<angle>"`.
 * This script rewrites the bad emission so `npm run dev` / `npm run build` work
 * even after a fresh `npm install`.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  {
    file: path.join(__dirname, '..', 'node_modules', 'lightswind', 'plugin.js'),
    from: 'syntax: "<angle>",',
    to: `syntax: '"<angle>"',`,
  },
  {
    file: path.join(__dirname, '..', 'node_modules', 'lightswind', 'lightswindv1.0.css'),
    from: 'syntax: <angle>;',
    to: 'syntax: "<angle>";',
  },
];

for (const { file, from, to } of targets) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes(from)) continue; // already patched or upstream fixed
  fs.writeFileSync(file, source.split(from).join(to));
  console.log(`[fix-lightswind-css] patched ${path.relative(process.cwd(), file)}`);
}
