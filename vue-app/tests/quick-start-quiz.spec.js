/**
 * Acceptance test: Quick start quiz from card (Spustit).
 *
 * Kontrakt: specs/quick-start-quiz.spec.md – z karty jde kvíz spustit hned
 * tlačítkem „Spustit" s výchozím nastavením (bez časovače, všechny 3 otázky,
 * původní pořadí), nebo otevřít „Nastavení kvízu" z menu karty.
 *
 * Vrstva: jsdom (komponenta + Pinia + vue-router), selektory v
 * tests/support/landing-page.js. Viz TESTING.md.
 */
import { describe, it, expect } from 'vitest';
import { renderLanding, quizPacks } from './support/landing-page.js';

describe('Quick start quiz', () => {
  it('na kartě nabízí výrazné „Spustit" i „Nastavení kvízu" v menu', async () => {
    const page = await renderLanding();
    const card = page.card(quizPacks[0]);

    expect(card.getByRole('button', { name: /Spustit/i })).toBeInTheDocument();
    await page.openCardMenu(quizPacks[0]);
    expect(card.getByRole('menuitem', { name: /Nastavení kvízu/i })).toBeInTheDocument();
  });

  it('Spustit spustí kvíz okamžitě s výchozím nastavením', async () => {
    const page = await renderLanding();

    await page.playNow(quizPacks[0]);

    expect(page.currentPath()).toBe('/presenter');
    // Žádné vlastní nastavení – výchozí stav.
    expect(page.store.quizSettings).toBeNull();
    // Všechny 3 otázky na fotku zůstávají dostupné.
    expect(page.store.totalQuestions).toBe(3);
  });

  it('Spustit spustí správný vybraný balíček', async () => {
    const page = await renderLanding();

    await page.playNow(quizPacks[1]);

    expect(page.store.currentPackId).toBe(quizPacks[1].id);
  });

  it('Nastavení kvízu otevře konfiguraci místo okamžitého startu', async () => {
    const page = await renderLanding();

    await page.customize(quizPacks[0]);

    expect(page.currentPath()).toBe(`/customize/${quizPacks[0].id}`);
  });
});
