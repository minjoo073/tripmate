const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS = path.join(__dirname, '..', 'docs');
const BASE = '/tripmate';

// 1. Fix asset paths: /_expo/ → /tripmate/_expo/  and favicon
execSync(
  `find "${DOCS}" -name '*.html' -exec sed -i '' ` +
  `'s|src="/_expo/|src="/tripmate/_expo/|g; s|href="/favicon.ico"|href="/tripmate/favicon.ico"|g' {} +`
);

// 2. Inject URL-strip script into every HTML file before </head>
const stripScript =
  `<script>(function(){` +
  `var p=location.pathname;` +
  `if(p.startsWith('${BASE}')){` +
  `history.replaceState(null,'',p.slice(${BASE.length})||'/');` +
  `}` +
  `})();</script>`;

function injectScript(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes(stripScript)) return;
  html = html.replace('</head>', stripScript + '</head>');
  fs.writeFileSync(filePath, html);
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full);
    else if (entry.name.endsWith('.html')) injectScript(full);
  }
}

walkDir(DOCS);

// 3. .nojekyll
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

// 4. 404.html fallback
fs.copyFileSync(
  path.join(DOCS, '+not-found.html'),
  path.join(DOCS, '404.html')
);

console.log('postbuild done');
