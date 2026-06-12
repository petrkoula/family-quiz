/**
 * Acceptance test: Quiz library synced from photo folders, cached locally.
 *
 * Kontrakt: specs/quiz-library-sync.spec.md. Zdroj složek i fotek se vstřikuje
 * deterministicky (fake katalog), zapamatovaný stav žije v localStorage
 * (jsdom), mezi testy se čistí v resetCatalog().
 *
 * Vrstva: jsdom, selektory v tests/support/reload-page.js.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderLandingForReload, resetCatalog } from './support/reload-page.js';

afterEach(() => resetCatalog());

const FOLDERS = [
  { id: 'family-vintage', photos: ['IMG_4246_1.jpg', 'IMG_4246_2.jpg'] },
  { id: 'celebrations', photos: ['IMG_4246_10.jpg', 'IMG_4246_11.jpg', 'IMG_4246_12.jpg'] },
  { id: 'funny', photos: ['IMG_4246_21.jpg'] },
];

describe('Quiz library sync', () => {
  // Scénář 2
  it('knihovna má ovládání pro obnovení z aktuálních složek', async () => {
    const page = await renderLandingForReload();

    expect(page.hasLibraryReloadControl()).toBe(true);
  });

  // Scénář 7 (+ Scénář 1: složka = karta, titulky, počty)
  it('první návštěva naplní knihovnu z aktuálních složek', async () => {
    const page = await renderLandingForReload({ folders: () => FOLDERS });

    // žádná vestavěná data: všechny titulky se humanizují ze jména složky
    expect(page.cardTitles()).toEqual(['Family Vintage', 'Celebrations', 'Funny']);
    expect(page.photoCount('Celebrations')).toBe(3);
    expect(page.photoCount('Funny')).toBe(1);
  });

  // Scénář 1 — známý (zapamatovaný) pack si po obnovení nechá svůj titulek
  it('zapamatovaný pack si po obnovení knihovny nechá svůj titulek', async () => {
    localStorage.setItem(
      'quiz-library-v1',
      JSON.stringify({
        packs: [
          {
            id: 'family-vintage',
            title: 'Rodinná Klasika',
            description: '',
            color: '#4a90e2',
            thumbnail: 'family-vintage/IMG_4246_1.jpg',
            photos: [
              {
                image: 'family-vintage/IMG_4246_1.jpg',
                questions: [{ text: 'Kdo?', options: ['A', 'B'], correct: 0 }],
              },
            ],
          },
        ],
      })
    );
    const page = await renderLandingForReload({ folders: () => FOLDERS });

    await page.clickLibraryReload();

    // známý pack drží vlastní titulek, nově objevené složky se humanizují
    expect(page.cardTitles()).toEqual(['Rodinná Klasika', 'Celebrations', 'Funny']);
  });

  // Scénář 3 + 8
  it('nová složka se po obnovení objeví jako nová karta a souhrn to ohlásí', async () => {
    let folders = [...FOLDERS];
    const page = await renderLandingForReload({ folders: () => folders });

    folders = [...FOLDERS, { id: 'late-night', photos: ['IMG_4246_22.jpg'] }];
    await page.clickLibraryReload();

    expect(page.cardTitles()).toContain('Late Night');
    expect(page.libraryReloadResult()).toMatch(/Přidáno kvízů: 1/);
  });

  // Scénář 4 + 8
  it('smazaná složka po obnovení z knihovny zmizí a souhrn to ohlásí', async () => {
    let folders = [...FOLDERS];
    const page = await renderLandingForReload({ folders: () => folders });

    folders = FOLDERS.filter(f => f.id !== 'funny');
    await page.clickLibraryReload();

    expect(page.cardTitles()).not.toContain('Funny');
    expect(page.libraryReloadResult()).toMatch(/Odebráno kvízů: 1/);
  });

  // Scénář 8 — beze změn
  it('obnovení bez změn hlásí, že knihovna je aktuální', async () => {
    const page = await renderLandingForReload({ folders: () => FOLDERS });

    await page.clickLibraryReload();

    expect(page.libraryReloadResult()).toMatch(/aktuální/i);
  });

  // Scénář 9 — plný sync: obnovení knihovny srovná i fotky uvnitř packu
  it('obnovení knihovny promítne i smazanou fotku uvnitř packu', async () => {
    let folders = [...FOLDERS];
    const page = await renderLandingForReload({ folders: () => folders });

    expect(page.photoCount('Celebrations')).toBe(3);

    folders = FOLDERS.map(f =>
      f.id === 'celebrations' ? { ...f, photos: f.photos.slice(0, 2) } : f
    );
    await page.clickLibraryReload();

    expect(page.photoCount('Celebrations')).toBe(2);
    expect(page.libraryReloadResult()).toMatch(/Aktualizováno: 1/);
  });

  // Scénář 5 — autorské otázky v knihovně přežijí sync; nové fotky dostanou placeholdery
  it('autorské otázky přežijí obnovení knihovny; nová fotka dostane placeholdery', async () => {
    // Zapamatovaný stav: fotka s jednou autorskou otázkou.
    localStorage.setItem(
      'quiz-library-v1',
      JSON.stringify({
        packs: [
          {
            id: 'family-vintage',
            title: 'Rodinná Klasika',
            description: '',
            color: '#4a90e2',
            thumbnail: 'family-vintage/IMG_4246_1.jpg',
            photos: [
              {
                image: 'family-vintage/IMG_4246_1.jpg',
                questions: [
                  { text: 'Kdo chytil kytici?', options: ['Teta', 'Babička'], correct: 0 },
                ],
              },
            ],
          },
        ],
      })
    );
    // Ve složce mezitím přibyla nová fotka.
    const folders = [{ id: 'family-vintage', photos: ['IMG_4246_1.jpg', 'new.jpg'] }];
    const page = await renderLandingForReload({ folders: () => folders });

    await page.clickLibraryReload();

    // 1 autorská otázka zůstala + 3 placeholdery nové fotky
    expect(page.questionCount('Rodinná Klasika')).toBe(4);
  });

  // Scénář 10 — appka nemá žádná vestavěná data
  it('bez zapamatovaného stavu, zálohy i složek je knihovna prázdná', async () => {
    const page = await renderLandingForReload({
      folders: () => null, // zdroj složek nedostupný
      backup: { load: () => null, save() {} }, // žádná záloha
    });

    expect(page.cardTitles()).toEqual([]);
    expect(page.hasCreateYourOwn()).toBe(true);
  });

  // Scénář 6 — stav přežije mezi návštěvami, změny až po refreshi
  it('další návštěva ukáže zapamatovanou knihovnu; změny složek až po obnovení', async () => {
    let folders = [...FOLDERS];
    const first = await renderLandingForReload({ folders: () => folders });
    expect(first.cardTitles()).toHaveLength(3);
    first.unmount();

    // mezi návštěvami přibyla složka
    folders = [...FOLDERS, { id: 'misc', photos: ['IMG_4246.jpg'] }];

    const second = await renderLandingForReload({ folders: () => folders });
    // okamžitě vidím stejnou knihovnu jako minule (bez Misc)…
    expect(second.cardTitles()).toHaveLength(3);
    expect(second.cardTitles()).not.toContain('Misc');

    // …a změna se objeví až po explicitním obnovení
    await second.clickLibraryReload();
    expect(second.cardTitles()).toContain('Misc');
  });
});
