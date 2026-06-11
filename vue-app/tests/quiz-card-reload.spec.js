/**
 * Acceptance test: Reload a quiz pack from current photo files.
 *
 * Kontrakt: specs/quiz-card-reload.spec.md. Testy se přidávají jeden po druhém
 * (TESTING.md), katalog fotek se vstřikuje deterministicky přes page-object.
 *
 * Vrstva: jsdom (komponenta + Pinia + vue-router + katalog), selektory v
 * tests/support/reload-page.js.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  renderLandingForReload,
  playPackAfterReload,
  resetCatalog,
  quizPacks,
} from './support/reload-page.js';
import { makePlaceholderQuestions } from '@/stores/packLibraryStore';

afterEach(() => resetCatalog());

describe('Reload quiz pack', () => {
  // Scénář 1
  it('na každé kartě nabízí Reload ovládání', async () => {
    const page = await renderLandingForReload();

    expect(page.reloadButtons()).toHaveLength(quizPacks.length);
    expect(page.card('Retro Styl').getByRole('button', { name: /Reload/i })).toBeInTheDocument();
  });

  // Scénář 2
  it('reload zachytí nově přidané fotky (8 → 10)', async () => {
    const page = await renderLandingForReload({
      catalog: (_packId, current) => [...current, 'new-a.jpg', 'new-b.jpg'],
    });

    expect(page.photoCount('Retro Styl')).toBe(8);

    await page.clickReload('Retro Styl');

    expect(page.photoCount('Retro Styl')).toBe(10);
  });

  // Scénář 4
  it('reload odebere smazané fotky (8 → 7)', async () => {
    const page = await renderLandingForReload({
      catalog: (_packId, current) => current.slice(0, 7),
    });

    await page.clickReload('Retro Styl');

    expect(page.photoCount('Retro Styl')).toBe(7);
  });

  // Scénář 6
  it('reload bez změn nechá pack beze změny', async () => {
    const page = await renderLandingForReload(); // výchozí zdroj = no-op

    expect(page.photoCount('Retro Styl')).toBe(8);
    expect(page.questionCount('Retro Styl')).toBe(24);

    await page.clickReload('Retro Styl');

    expect(page.photoCount('Retro Styl')).toBe(8);
    expect(page.questionCount('Retro Styl')).toBe(24);
    expect(page.reloadResult('Retro Styl')).toMatch(/aktuální/i);
  });

  // Scénář 7
  it('metadata zůstanou konzistentní po reloadu (placeholdery se započítají)', async () => {
    const page = await renderLandingForReload({
      catalog: (_packId, current) => [...current, 'new-a.jpg', 'new-b.jpg'],
    });

    expect(page.photoCount('Retro Styl')).toBe(8);
    expect(page.questionCount('Retro Styl')).toBe(24); // 8 × 3

    await page.clickReload('Retro Styl');

    expect(page.photoCount('Retro Styl')).toBe(10);
    expect(page.questionCount('Retro Styl')).toBe(30); // + 2 fotky × 3 placeholdery
  });

  // Scénář 8
  it('po reloadu ukáže souhrn přidaných a odebraných fotek', async () => {
    const page = await renderLandingForReload({
      catalog: (_packId, current) => [...current, 'new-a.jpg', 'new-b.jpg'],
    });

    await page.clickReload('Retro Styl');

    const summary = page.reloadResult('Retro Styl');
    expect(summary).toMatch(/Přidáno: 2/);
    expect(summary).toMatch(/Odebráno: 0/);
  });

  // Scénář 3
  it('nově nalezená fotka má placeholder otázky bez správné odpovědi', async () => {
    // retro-style má 8 fotek; nová je 9. v pořadí.
    const play = await playPackAfterReload('retro-style', {
      catalog: (_packId, current) => [...current, 'new-a.jpg'],
    });

    expect(play.progress()).toBe('Foto 1 / 9');

    await play.goToPhoto(9);
    await play.showQuestions();

    expect(play.questionText()).toBe('Doplň otázku');

    await play.revealAnswer();
    expect(play.revealedCorrectAnswer()).toBeNull();
  });

  // Scénář 9
  it('placeholder otázky ustoupí nově doplněným ručním otázkám', async () => {
    // Dříve synchronizovaný stav: fotka má zapamatované placeholdery,
    // mezitím autor otázky doplnil (banka je pro IMG_4246_1.jpg má).
    localStorage.setItem(
      'quiz-library-v1',
      JSON.stringify({
        packs: [
          {
            id: 'retro-style',
            title: 'Retro Styl',
            description: '',
            color: '#e67e22',
            thumbnail: 'retro-style/IMG_4246_1.jpg',
            photos: [
              { image: 'retro-style/IMG_4246_1.jpg', questions: makePlaceholderQuestions() },
            ],
          },
        ],
      }),
    );

    const play = await playPackAfterReload('retro-style', {
      catalog: (_packId, current) => current, // soubory na disku beze změny
    });

    await play.showQuestions();
    expect(play.questionText()).not.toBe('Doplň otázku');

    await play.revealAnswer();
    expect(play.revealedCorrectAnswer()).not.toBeNull();
  });

  // Scénář 5
  it('existující fotka si po reloadu ponechá své ruční otázky', async () => {
    const play = await playPackAfterReload('retro-style', {
      catalog: (_packId, current) => [...current, 'new-a.jpg'],
    });

    // První fotka je původní – musí mít skutečnou otázku a správnou odpověď.
    await play.showQuestions();

    expect(play.questionText()).not.toBe('Doplň otázku');

    await play.revealAnswer();
    expect(play.revealedCorrectAnswer()).not.toBeNull();
  });
});
