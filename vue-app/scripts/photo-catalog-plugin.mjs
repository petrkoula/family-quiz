// Dev-server photo catalog (see specs/quiz-library-sync.spec.md).
//
// Serves two things straight from the images root, reading the filesystem AT
// REQUEST TIME so folder changes are visible on the next reload click:
//
//   GET /__catalog/packs              -> [{ id, photos: [...] }, ...]
//   GET /__catalog/packs/:id/photos   -> ["a.jpg", ...]
//   GET /images/<pack>/<file>         -> streams the image file
//
// Roots are candidates; the first existing one wins:
//   ../images        — repo root (local dev, single source of truth)
//   public/images    — docker dev (./images is volume-mounted there)
//
// Production has no dev server: the catalog endpoints simply don't exist and
// the app's catalog sources fall back to "no changes" (a hosted store replaces
// them later via setPhotoCatalogSource/setPackCatalogSource).

import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const IMAGE_RE = /\.(jpe?g|png)$/i;
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

/** Sorted image filenames directly inside a folder; non-images excluded. */
export function listPhotosIn(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && IMAGE_RE.test(entry.name))
    .map(entry => entry.name)
    .sort();
}

/** Each non-empty subfolder of the images root is a pack. */
export function listPackFolders(imagesRoot) {
  if (!existsSync(imagesRoot)) return [];
  return readdirSync(imagesRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => ({ id: entry.name, photos: listPhotosIn(join(imagesRoot, entry.name)) }))
    .filter(pack => pack.photos.length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function sendJson(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function makeHandler(roots) {
  const findRoot = () => roots.find(root => existsSync(root)) ?? null;

  return (req, res, next) => {
    const url = (req.url || '').split('?')[0];
    const root = findRoot();

    if (url === '/__catalog/packs') {
      return sendJson(res, root ? listPackFolders(root) : []);
    }

    const photosMatch = url.match(/^\/__catalog\/packs\/([^/]+)\/photos$/);
    if (photosMatch) {
      const dir = root && join(root, decodeURIComponent(photosMatch[1]));
      return sendJson(res, dir && existsSync(dir) ? listPhotosIn(dir) : []);
    }

    if (url.startsWith('/images/') && root) {
      const rel = decodeURIComponent(url.slice('/images/'.length));
      const file = normalize(join(root, rel));
      if (!file.startsWith(normalize(root))) {
        res.statusCode = 403;
        return res.end();
      }
      if (existsSync(file) && statSync(file).isFile()) {
        res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream');
        return createReadStream(file).pipe(res);
      }
      // fall through — Vite's public dir may still serve it
    }

    next();
  };
}

/** @param {{roots: string[]}} options candidate image roots, first existing wins */
export function photoCatalogPlugin({ roots }) {
  return {
    name: 'photo-catalog',
    configureServer(server) {
      server.middlewares.use(makeHandler(roots));
    },
    configurePreviewServer(server) {
      server.middlewares.use(makeHandler(roots));
    },
  };
}
