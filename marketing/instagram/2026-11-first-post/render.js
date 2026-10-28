const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
  await p.goto('file://' + require('path').resolve(process.argv[2]));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const els = await p.$$('[data-out]');
  for (const e of els) { const n = await e.getAttribute('data-out'); await e.screenshot({ path: n, type: 'jpeg', quality: 92 }); console.log(n); }
  await b.close();
})();
