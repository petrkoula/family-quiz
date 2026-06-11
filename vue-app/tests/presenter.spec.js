/**
 * Acceptance test: Presenter view (chování řízené klávesnicí).
 *
 * Kontrakt: keyboard sekce v CLAUDE.md – Mezerník přepíná otázky, ↑↓ cyklují
 * otázky, A odhalí odpověď, ←→ přepínají fota a navigace fota je blokovaná,
 * dokud jsou otázky viditelné.
 *
 * Vrstva: jsdom (chování komponenty + Pinia store), selektory v
 * tests/support/presenter-page.js. Viz TESTING.md.
 */
import { describe, it, expect } from 'vitest';
import { renderPresenter } from './support/presenter-page.js';

describe('Presenter view', () => {
  it('se načte na prvním fotu ve fullscreen režimu', () => {
    const page = renderPresenter();

    expect(page.photoProgress()).toBe('Foto 1 / 23');
    expect(page.isQuestionsVisible()).toBe(false);
    expect(page.controlsHint()).toContain('Mezerník zobrazí otázky');
  });

  it('Mezerníkem zobrazí a znovu skryje otázky', async () => {
    const page = renderPresenter();

    await page.toggleQuestions();
    expect(page.isQuestionsVisible()).toBe(true);
    expect(page.controlsHint()).toContain('Mezerník skryje');

    await page.toggleQuestions();
    expect(page.isQuestionsVisible()).toBe(false);
    expect(page.controlsHint()).toContain('Mezerník zobrazí otázky');
  });

  it('ESC skryje otevřené otázky', async () => {
    const page = renderPresenter();

    await page.toggleQuestions();
    expect(page.isQuestionsVisible()).toBe(true);

    await page.hideWithEsc();
    expect(page.isQuestionsVisible()).toBe(false);
  });

  it('↑↓ cyklují mezi otázkami daného fota', async () => {
    const page = renderPresenter();
    await page.toggleQuestions();

    const first = page.questionText();

    await page.nextQuestion();
    const second = page.questionText();
    expect(second).not.toBe(first);

    await page.previousQuestion();
    expect(page.questionText()).toBe(first);
  });

  it('A odhalí správnou odpověď', async () => {
    const page = renderPresenter();
    await page.toggleQuestions();

    expect(page.revealedCorrectAnswer()).toBeNull();

    await page.revealAnswer();
    expect(page.revealedCorrectAnswer()).not.toBeNull();
  });

  it('←→ přepínají mezi foty, když jsou otázky skryté', async () => {
    const page = renderPresenter();

    await page.nextPhoto();
    expect(page.photoProgress()).toBe('Foto 2 / 23');

    await page.previousPhoto();
    expect(page.photoProgress()).toBe('Foto 1 / 23');
  });

  it('blokuje přepnutí fota, dokud jsou otázky viditelné', async () => {
    const page = renderPresenter();
    await page.toggleQuestions();

    await page.nextPhoto();

    expect(page.photoProgress()).toBe('Foto 1 / 23');
    expect(page.isQuestionsVisible()).toBe(true);
  });
});
