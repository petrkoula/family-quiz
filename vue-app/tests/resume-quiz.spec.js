/**
 * Acceptance test: Resume a quiz in progress.
 *
 * Kontrakt: specs/resume-quiz.spec.md – Esc opustí běžící kvíz zpět do
 * knihovny, karta rozehraného kvízu nabídne „Pokračovat" a návrat pokračuje
 * na stejné fotce. Čerstvý start (Spustit) rozehraný stav ruší.
 *
 * Vrstva: jsdom (Landing ↔ Presenter přes skutečný router), selektory v
 * tests/support/resume-page.js. Viz TESTING.md.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderApp, quizPacks } from './support/resume-page.js';

afterEach(() => localStorage.clear());

describe('Resume quiz', () => {
  // Scénář 1
  it('Esc vrátí z běžícího kvízu do knihovny a kvíz zůstane rozehraný', async () => {
    const app = await renderApp();

    await app.playNow(quizPacks[0]);
    expect(app.currentPath()).toBe('/presenter');

    await app.pressEsc();

    expect(app.currentPath()).toBe('/');
    expect(app.store.isPackInProgress(quizPacks[0].id)).toBe(true);
  });

  // Scénář 2
  it('karta rozehraného kvízu ukáže „Pokračovat", ostatní dál „Spustit"', async () => {
    const app = await renderApp();

    await app.playNow(quizPacks[0]);
    await app.pressEsc();

    expect(app.resumeButton(quizPacks[0])).not.toBeNull();
    expect(app.playNowButton(quizPacks[0])).toBeNull();
    expect(app.playNowButton(quizPacks[1])).not.toBeNull();
    expect(app.resumeButton(quizPacks[1])).toBeNull();
  });

  // Scénář 3
  it('„Pokračovat" se vrátí do presenteru na stejnou fotku', async () => {
    const app = await renderApp();

    await app.playNow(quizPacks[0]);
    await app.nextPhoto();
    await app.nextPhoto();
    expect(app.photoProgress()).toMatch(/^Foto 3 \//);

    await app.pressEsc();
    await app.resume(quizPacks[0]);

    expect(app.currentPath()).toBe('/presenter');
    expect(app.photoProgress()).toMatch(/^Foto 3 \//);
  });

  // Scénář 4
  it('Esc s otevřenými otázkami jen skryje otázky, presenter zůstává', async () => {
    const app = await renderApp();

    await app.playNow(quizPacks[0]);
    await app.showQuestions();
    expect(app.questionsVisible()).toBe(true);

    await app.pressEsc();

    expect(app.questionsVisible()).toBe(false);
    expect(app.currentPath()).toBe('/presenter');
  });

  // Scénář 5
  it('čerstvý start přes Spustit zruší předchozí rozehraný kvíz', async () => {
    const app = await renderApp();

    await app.playNow(quizPacks[0]);
    await app.nextPhoto();
    await app.pressEsc();
    expect(app.store.isPackInProgress(quizPacks[0].id)).toBe(true);

    await app.playNow(quizPacks[1]);

    expect(app.photoProgress()).toMatch(/^Foto 1 \//);
    expect(app.store.isPackInProgress(quizPacks[0].id)).toBe(false);
    expect(app.store.quizInProgress).toBe(false);
  });
});
