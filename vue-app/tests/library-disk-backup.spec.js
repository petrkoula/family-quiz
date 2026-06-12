/**
 * Acceptance test: Library backup stored beside the photo folders.
 *
 * Kontrakt: specs/library-disk-backup.spec.md. Záloha „vedle složek" se
 * vstřikuje deterministicky (fake backup přes setLibraryBackup), zapamatovaný
 * stav žije v localStorage (jsdom), mezi testy se čistí v resetCatalog().
 *
 * Vrstva: jsdom, selektory v tests/support/reload-page.js.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderLandingForReload, resetCatalog } from './support/reload-page.js';

afterEach(() => resetCatalog());

const FOLDERS = [
  { id: 'family-vintage', photos: ['IMG_4246_1.jpg', 'IMG_4246_2.jpg'] },
  { id: 'celebrations', photos: ['IMG_4246_10.jpg', 'IMG_4246_11.jpg'] },
];

/** Fake záloha: drží stav v paměti, test ho může číst i předvyplnit. */
function makeFakeBackup(initial = null) {
  return {
    state: initial,
    load() {
      return this.state;
    },
    save(state) {
      this.state = JSON.parse(JSON.stringify(state));
    },
  };
}

/** Záloha s ručním titulkem a autorskou otázkou — „cizí" stav vůči složkám. */
function backedUpLibrary() {
  return {
    packs: [
      {
        id: 'svatba',
        title: 'Moje Svatba',
        description: '',
        color: '#4a90e2',
        thumbnail: 'svatba/a.jpg',
        photos: [
          {
            image: 'svatba/a.jpg',
            questions: [{ text: 'Kdo chytil kytici?', options: ['Teta', 'Babička'], correct: 0 }],
          },
        ],
      },
    ],
  };
}

describe('Library backup beside the photo folders', () => {
  // Scénář 1 — změny knihovny se zrcadlí do zálohy
  it('první sync i obnovení knihovny zapíšou aktuální stav do zálohy', async () => {
    let folders = [...FOLDERS];
    const backup = makeFakeBackup();
    const page = await renderLandingForReload({ folders: () => folders, backup });

    // první návštěva naplnila knihovnu ze složek → záloha ji zrcadlí
    expect(backup.state.packs.map(p => p.id)).toEqual(['family-vintage', 'celebrations']);

    folders = [...FOLDERS, { id: 'vylety', photos: ['IMG_9.jpg'] }];
    await page.clickLibraryReload();

    expect(backup.state.packs.map(p => p.id)).toContain('vylety');
  });

  // Scénář 2 — zapamatovaný stav má přednost před zálohou
  it('další návštěva ukáže zapamatovanou knihovnu, ne obsah zálohy', async () => {
    const backup = makeFakeBackup();
    const first = await renderLandingForReload({ folders: () => FOLDERS, backup });
    expect(first.cardTitles()).toHaveLength(2);
    first.unmount();

    // mezi návštěvami se záloha rozešla se zapamatovaným stavem
    backup.state = backedUpLibrary();

    const second = await renderLandingForReload({ folders: () => FOLDERS, backup });
    expect(second.cardTitles()).not.toContain('Moje Svatba');
    expect(second.cardTitles()).toEqual(['Family Vintage', 'Celebrations']);
  });

  // Scénář 3 — ztracená paměť prohlížeče se obnoví ze zálohy
  it('bez zapamatovaného stavu se knihovna obnoví ze zálohy včetně titulků a otázek', async () => {
    const backup = makeFakeBackup(backedUpLibrary());
    const page = await renderLandingForReload({ folders: () => FOLDERS, backup });

    expect(page.cardTitles()).toEqual(['Moje Svatba']);
    expect(page.questionCount('Moje Svatba')).toBe(1);
    page.unmount();

    // obnovený stav je zapamatovaný pro příští návštěvu i bez zálohy
    backup.state = null;
    const next = await renderLandingForReload({ folders: () => FOLDERS, backup });
    expect(next.cardTitles()).toEqual(['Moje Svatba']);
  });

  // Scénář 4 — obnova ze zálohy tiše nesyncuje složky
  it('po obnově ze zálohy se změny složek objeví až po obnovení knihovny', async () => {
    const backup = makeFakeBackup(backedUpLibrary());
    const page = await renderLandingForReload({ folders: () => FOLDERS, backup });

    // vidím zálohu, ne aktuální složky…
    expect(page.cardTitles()).toEqual(['Moje Svatba']);

    // …a složky se promítnou až explicitním obnovením (nové packy
    // s humanizovaným titulkem dle quiz-library-sync.spec.md)
    await page.clickLibraryReload();
    expect(page.cardTitles()).toEqual(['Family Vintage', 'Celebrations']);
  });

  // Scénář 5 — bez paměti a bez zálohy se knihovna naplní ze složek
  it('první návštěva bez zálohy naplní knihovnu z aktuálních složek', async () => {
    const backup = makeFakeBackup(null);
    const page = await renderLandingForReload({ folders: () => FOLDERS, backup });

    expect(page.cardTitles()).toEqual(['Family Vintage', 'Celebrations']);
  });

  // Scénář 6 — záloha, do které nejde zapisovat (produkce), nic nerozbije
  it('s nedostupnou zálohou appka funguje a stav se pamatuje v prohlížeči', async () => {
    // bez vstřiknuté zálohy běží výchozí backend, který v testu nikam nedosáhne
    const first = await renderLandingForReload({ folders: () => FOLDERS });
    await first.clickLibraryReload();
    expect(first.libraryReloadResult()).toMatch(/aktuální/i);
    first.unmount();

    const second = await renderLandingForReload({ folders: () => FOLDERS });
    expect(second.cardTitles()).toEqual(['Family Vintage', 'Celebrations']);
  });
});
