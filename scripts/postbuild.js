const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs');
const BASE = '/tripmate';

// URL-strip snippet injected into every HTML page before </head>:
// rewrites /tripmate/* back to /* on load so the SPA router sees clean paths.
const stripScript =
  `<script>(function(){` +
  `var p=location.pathname;` +
  `if(p.startsWith('${BASE}')){` +
  `history.replaceState(null,'',p.slice(${BASE.length})||'/');` +
  `}` +
  `})();</script>`;

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function edit(file, transform) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) fs.writeFileSync(file, after);
}

// 1a. HTML: rewrite asset + favicon paths, then inject the URL-strip script.
//      (Pure Node — cross-platform; replaces the old find/sed pipeline.)
walk(DOCS, (file) => {
  if (!file.endsWith('.html')) return;
  edit(file, (html) => {
    html = html
      .split('src="/_expo/').join('src="/tripmate/_expo/')
      .split('href="/favicon.ico"').join('href="/tripmate/favicon.ico"');
    if (!html.includes(stripScript)) {
      html = html.replace('</head>', stripScript + '</head>');
    }
    return html;
  });
});

// 1b. JS bundles: rewrite runtime asset paths.
walk(path.join(DOCS, '_expo'), (file) => {
  if (!file.endsWith('.js')) return;
  edit(file, (js) => js.split('"/assets/').join('"/tripmate/assets/'));
});

// 2. .nojekyll so GitHub Pages serves _expo/ as-is.
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

// 3. SPA 404 fallback.
fs.copyFileSync(
  path.join(DOCS, '+not-found.html'),
  path.join(DOCS, '404.html')
);

// 4. Restore hand-authored static pages (expo export --clear wipes docs/).
const STATIC_PAGES = path.join(__dirname, '..', 'static-pages');
if (fs.existsSync(STATIC_PAGES)) {
  for (const entry of fs.readdirSync(STATIC_PAGES, { withFileTypes: true })) {
    if (entry.isFile()) {
      fs.copyFileSync(path.join(STATIC_PAGES, entry.name), path.join(DOCS, entry.name));
    }
  }
}

console.log('postbuild done');
