// Jednorázový záběr referenční appky (Bubble) pro design srovnání.
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const URL = 'https://koulapetr.bubbleapps.io/version-test/';

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    join(process.env.LOCALAPPDATA ?? '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const found = candidates.find(p => p && existsSync(p));
  if (!found) {
    console.error('Chrome nenalezen');
    process.exit(1);
  }
  return found;
}

const outDir = resolve('..', 'screenshots', '_reference');
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: true,
  protocolTimeout: 60000,
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: join(outDir, 'bubble-landing.png'), fullPage: false });
  await page.screenshot({ path: join(outDir, 'bubble-landing-full.png'), fullPage: true });

  // Vytáhni použité fonty a barvy z computed styles
  const styles = await page.evaluate(() => {
    const seen = { fonts: {}, colors: {}, bgs: {} };
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      const text = (el.childNodes[0]?.nodeType === 3 && el.textContent.trim().slice(0, 40)) || '';
      if (text) {
        const key = `${cs.fontFamily} | ${cs.fontSize} | ${cs.fontWeight}`;
        seen.fonts[key] = seen.fonts[key] || text;
        seen.colors[cs.color] = seen.colors[cs.color] || text;
      }
      const bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') {
        seen.bgs[bg] = (seen.bgs[bg] ?? 0) + 1;
      }
    }
    return seen;
  });
  console.log(JSON.stringify(styles, null, 2));
} finally {
  await browser.close();
}
console.log('OK');
