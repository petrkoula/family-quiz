/**
 * Acceptance test: Quiz customization (nastavení před spuštěním kvízu).
 *
 * Kontrakt: specs/quiz-customization.spec.md – časovač (default vypnutý),
 * počet otázek na fotku (default 3), zamíchání, živý souhrn, a Start Quiz /
 * Skip, které aplikují, resp. obejdou nastavení.
 *
 * Vrstva: jsdom (komponenta + Pinia + vue-router), selektory v
 * tests/support/customization-page.js. Viz TESTING.md.
 */
import { describe, it, expect } from 'vitest';
import { renderCustomization } from './support/customization-page.js';
import { getPackMetadata } from '@/data/quizPacks';

describe('Quiz customization', () => {
  it('startuje s výchozími hodnotami (časovač vypnutý, 3 otázky)', async () => {
    const page = await renderCustomization();

    expect(page.timerEnabled()).toBe(false);
    expect(page.hasDurationSelect()).toBe(false);
    expect(page.questionsPerPhoto()).toBe(3);
    expect(page.summaryTimer()).toBe('Vypnuto');
  });

  it('po zapnutí časovače ukáže volbu délky a promítne ji do souhrnu', async () => {
    const page = await renderCustomization();

    await page.enableTimer();
    expect(page.hasDurationSelect()).toBe(true);

    await page.setTimerDuration(90);
    expect(page.summaryTimer()).toBe('90s');
  });

  it('přepočítá celkový počet otázek podle voleb na fotku', async () => {
    const page = await renderCustomization('retro-style');
    const photos = getPackMetadata('retro-style').photoCount;

    expect(page.summaryTotalQuestions()).toBe(photos * 3);

    await page.setQuestionsPerPhoto(1);
    expect(page.summaryTotalQuestions()).toBe(photos * 1);
  });

  it('Start Quiz aplikuje nastavení a spustí prezentaci', async () => {
    const page = await renderCustomization('retro-style');

    await page.enableTimer();
    await page.toggleRandomizePhotos();
    await page.setQuestionsPerPhoto(2);
    await page.startQuiz();

    expect(page.currentPath()).toBe('/presenter');
    expect(page.store.quizSettings).toMatchObject({
      timerEnabled: true,
      randomizePhotos: true,
      questionsPerPhoto: 2,
    });
    // Limit otázek na fotku se skutečně aplikoval na data kvízu.
    expect(page.store.totalQuestions).toBe(2);
  });

  it('Skip spustí prezentaci s výchozím nastavením (bez úprav)', async () => {
    const page = await renderCustomization('retro-style');

    await page.enableTimer(); // změna, kterou Skip ignoruje
    await page.skip();

    expect(page.currentPath()).toBe('/presenter');
    expect(page.store.quizSettings).toBeNull();
  });
});
