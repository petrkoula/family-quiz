// Dev-server photo catalog (see specs/quiz-library-sync.spec.md).
//
// Serves two things straight from the images root, reading the filesystem AT
// REQUEST TIME so folder changes are visible on the next reload click:
//
//   GET /__catalog/packs              -> [{ id, photos: [...] }, ...]
//   GET /__catalog/packs/:id/photos   -> ["a.jpg", ...]
//   GET /__catalog/library            -> library backup JSON, or null
//   PUT /__catalog/library            -> writes <root>/library.json (backup
//                                        beside the pack folders, see
//                                        specs/library-disk-backup.spec.md)
//   GET /images/<pack>/<file>         -> streams the image file
//
// Roots are candidates; the first existing one wins:
//   ../images        — repo root (local dev, single source of truth)
//   public/images    — docker dev (./images is volume-mounted there)
//
// Production has no dev server: the catalog endpoints simply don't exist and
// the app's catalog sources fall back to "no changes" (a hosted store replaces
// them later via setPhotoCatalogSource/setPackCatalogSource).

import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, normalize } from 'node:path';

const IMAGE_RE = /\.(jpe?g|png)$/i;
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };
const LIBRARY_FILE = 'library.json';

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

/** Library backup parsed from `<imagesRoot>/library.json`; null when missing/corrupted. */
export function readLibraryFile(imagesRoot) {
  const file = join(imagesRoot, LIBRARY_FILE);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null; // unreadable backup behaves like no backup
  }
}

/** Writes the library backup as human-readable JSON beside the pack folders. */
export function writeLibraryFile(imagesRoot, state) {
  writeFileSync(join(imagesRoot, LIBRARY_FILE), JSON.stringify(state, null, 2) + '\n');
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

    if (url === '/__catalog/library') {
      if (req.method === 'PUT') {
        if (!root) {
          res.statusCode = 503;
          return res.end();
        }
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
          try {
            writeLibraryFile(root, JSON.parse(body));
            res.statusCode = 204;
          } catch {
            res.statusCode = 400; // invalid JSON must never clobber the backup
          }
          res.end();
        });
        return;
      }
      return sendJson(res, root ? readLibraryFile(root) : null);
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
        res.setHeader(
          'Content-Type',
          MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'
        );
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
