#!/usr/bin/env node
// Design screenshots — jednotná sada záběrů pro porovnávání designů.
//
//   yarn screenshots                      # -> screenshots/<git-branch>/
//   yarn screenshots album-v2             # -> screenshots/album-v2/
//   yarn screenshots album-v2 --url=http://localhost:5173
//
// Bez --url si script najde běžící dev server (5173/5180), jinak spustí
// vlastní vite na portu 5199 a po doběhnutí ho zase ukončí. Prohlížeč je
// systémový Chrome/Edge přes puppeteer-core (nic se nestahuje).
//
// Sada záběrů je SHOT_LIST níže — při přidání obrazovky přidej položku tam,
// ať všechny designové varianty sdílí stejné pojmenování i rozměry a dají se
// porovnávat soubor proti souboru.

import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 414, height: 896 };
const CARD = { width: 560, height: 860 };

/**
 * Spustí první kvíz z knihovny přes „Play Now" — presenter tak ukazuje
 * skutečný pack (přímý vstup na /presenter jede na legacy default data
 * s neexistujícími soubory fotek).
 */
async function playFirstPack(page) {
  await page.waitForSelector('[data-testid="quiz-card"]', { timeout: 10000 });
  await page.evaluate(() => {
    const card = document.querySelector('[data-testid="quiz-card"]');
    [...card.querySelectorAll('button')]
      .find((button) => button.textContent.includes('Play Now'))
      ?.click();
  });
  await page.waitForSelector('[data-testid="photo-progress"]', { timeout: 10000 });
}

/**
 * Jeden záběr: route, viewport, volitelný `setup` (akce po načtení routy,
 * např. proklik do presenteru) a `keys` (stisky kláves) před fotkou.
 * `fullPage` vyfotí celou výšku stránky místo viewportu.
 */
const SHOT_LIST = [
  { name: 'landing-desktop', path: '/', viewport: DESKTOP },
  { name: 'landing-full', path: '/', viewport: DESKTOP, fullPage: true },
  { name: 'landing-mobile', path: '/', viewport: MOBILE, fullPage: true },
  { name: 'card-detail', path: '/', viewport: CARD },
  { name: 'customization', path: '/customize/retro-style', viewport: DESKTOP },
  { name: 'presenter-photo', path: '/', viewport: DESKTOP, setup: playFirstPack },
  { name: 'presenter-questions', path: '/', viewport: DESKTOP, setup: playFirstPack, keys: [' '] },
  {
    name: 'presenter-answer',
    path: '/',
    viewport: DESKTOP,
    setup: playFirstPack,
    keys: [' ', 'a'],
  },
];

// Po stisku klávesy nech doběhnout slide-in/reveal animace.
const ANIMATION_MS = 700;

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith('--url='))?.slice('--url='.length);
const label = args.find((a) => !a.startsWith('--')) ?? gitBranchLabel();

function gitBranchLabel() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'snapshot';
  }
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    join(process.env.LOCALAPPDATA ?? '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) {
    console.error('ERROR: Chrome/Edge nenalezen. Nastav cestu v env CHROME_PATH.');
    process.exit(1);
  }
  return found;
}

async function isUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Vrátí { baseUrl, stop } — najde běžící server, nebo spustí vlastní vite. */
async function ensureServer() {
  const candidates = urlArg
    ? [urlArg]
    : ['http://localhost:5173', 'http://localhost:5180'];
  for (const url of candidates) {
    if (await isUp(url)) return { baseUrl: url, stop: () => {} };
  }
  if (urlArg) {
    console.error(`ERROR: server na ${urlArg} neodpovídá.`);
    process.exit(1);
  }

  console.log('Dev server neběží — spouštím vlastní vite na :5199…');
  const viteBin = resolve('node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [viteBin, '--port', '5199', '--strictPort'], {
    stdio: 'ignore',
  });
  const url = 'http://localhost:5199';
  for (let i = 0; i < 60; i++) {
    if (await isUp(url)) return { baseUrl: url, stop: () => child.kill() };
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  console.error('ERROR: vlastní vite se do 30 s nerozběhl.');
  process.exit(1);
}

async function settle(page) {
  // Webfonty (Fraunces) a obrázky musí být vykreslené, jinak se varianty
  // liší fallback fontem místo designem. Lazy obrázky pod foldem se samy
  // nenačtou (a fullPage záběr by měl prázdná místa) — přepni je na eager.
  // Celé čekání je ohraničené, ať jeden rozbitý obrázek nezasekne běh.
  await page.evaluate(
    () =>
      Promise.race([
        Promise.all([
          document.fonts.ready,
          ...[...document.images]
            .map((img) => {
              if (img.loading === 'lazy') img.loading = 'eager';
              return img;
            })
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((done) => {
                  img.addEventListener('load', done, { once: true });
                  img.addEventListener('error', done, { once: true });
                }),
            ),
        ]),
        new Promise((r) => setTimeout(r, 8000)),
      ]),
  );
  await new Promise((r) => setTimeout(r, 250));
}

const { baseUrl, stop } = await ensureServer();
const outDir = resolve('..', 'screenshots', label);
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  headless: true,
  protocolTimeout: 60000,
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

try {
  console.log(`Server: ${baseUrl}  ->  ${outDir}`);
  for (const shot of SHOT_LIST) {
    const page = await browser.newPage();
    await page.setViewport(shot.viewport);
    await page.goto(baseUrl + shot.path, { waitUntil: 'networkidle0', timeout: 30000 });
    await settle(page);

    if (shot.setup) {
      await shot.setup(page);
      await settle(page); // fotky nové routy (presenter) musí doběhnout
    }

    for (const key of shot.keys ?? []) {
      await page.keyboard.press(key);
      await new Promise((r) => setTimeout(r, ANIMATION_MS));
    }

    const file = join(outDir, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: shot.fullPage ?? false });
    console.log(`  OK ${shot.name}.png`);
    await page.close();
  }
} finally {
  await browser.close();
  stop();
}

console.log(`Hotovo: ${SHOT_LIST.length} záběrů v ${outDir}`);
