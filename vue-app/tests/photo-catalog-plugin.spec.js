// @vitest-environment node
/**
 * Unit test: čtení složek fotek pro katalog (viz specs/quiz-pack-structure.spec.md
 * — scénáře 1, 3, 5, 6: složka = pack, seřazené fotky, přeskočit prázdné
 * složky, podporované formáty, ne-obrázky vyloučit).
 *
 * Vrstva: node (čistá fs logika), fixture adresář v tmp.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  listPackFolders,
  listPhotosIn,
  readLibraryFile,
  writeLibraryFile,
} from '../scripts/photo-catalog-plugin.mjs';

let root;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'quiz-catalog-'));
  // weddings: mix formátů + ne-obrázek, schválně neabecedně
  mkdirSync(join(root, 'weddings'));
  writeFileSync(join(root, 'weddings', 'b.JPG'), '');
  writeFileSync(join(root, 'weddings', 'a.jpeg'), '');
  writeFileSync(join(root, 'weddings', 'c.png'), '');
  writeFileSync(join(root, 'weddings', 'notes.txt'), '');
  // empty: prázdná složka → není pack
  mkdirSync(join(root, 'empty'));
  // family-70s: jedna fotka
  mkdirSync(join(root, 'family-70s'));
  writeFileSync(join(root, 'family-70s', 'IMG_1.jpg'), '');
});

afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('photo catalog folders', () => {
  it('každá neprázdná podsložka je pack, seřazeno podle id', () => {
    const packs = listPackFolders(root);

    expect(packs.map(p => p.id)).toEqual(['family-70s', 'weddings']);
  });

  it('prázdná složka se přeskočí', () => {
    expect(listPackFolders(root).map(p => p.id)).not.toContain('empty');
  });

  it('vrací jen obrázky (jpg/jpeg/png), seřazené podle jména', () => {
    expect(listPhotosIn(join(root, 'weddings'))).toEqual(['a.jpeg', 'b.JPG', 'c.png']);
  });

  it('neexistující root vrací prázdnou knihovnu', () => {
    expect(listPackFolders(join(root, 'nope'))).toEqual([]);
  });
});

// Záloha knihovny vedle složek (viz specs/library-disk-backup.spec.md).
describe('library backup file beside the pack folders', () => {
  it('bez souboru zálohy vrací null', () => {
    expect(readLibraryFile(root)).toBe(null);
  });

  it('zapsaná záloha leží vedle složek a přečte se zpět beze změny', () => {
    const state = { packs: [{ id: 'weddings', title: 'Svatby' }] };
    writeLibraryFile(root, state);

    expect(readLibraryFile(root)).toEqual(state);
    // soubor je čitelný pro člověka (odsazené víceřádkové JSON)
    expect(readFileSync(join(root, 'library.json'), 'utf8')).toContain('\n');
  });

  it('soubor zálohy se nepočítá mezi packy (packem je jen složka)', () => {
    writeLibraryFile(root, { packs: [] });
    expect(listPackFolders(root).map(p => p.id)).toEqual(['family-70s', 'weddings']);
  });

  it('poškozená záloha se chová jako žádná záloha', () => {
    writeFileSync(join(root, 'library.json'), '{not json');
    expect(readLibraryFile(root)).toBe(null);
  });
});
