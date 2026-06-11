/**
 * Acceptance test: Keyboard help overlay v presenteru.
 *
 * Kontrakt: specs/presenter-help-overlay.spec.md — „?" přepíná overlay se
 * všemi ovládacími prvky, ESC ho zavře bez vedlejších efektů.
 *
 * Vrstva: jsdom, selektory v tests/support/presenter-page.js.
 */
import { describe, it, expect } from 'vitest';
import { renderPresenter } from './support/presenter-page.js';

describe('Presenter help overlay', () => {
  // Scénář 1
  it('lišta napovídá, že „?" otevře nápovědu', () => {
    const page = renderPresenter();

    expect(page.helpHint()).toContain('?');
  });

  // Scénář 2
  it('„?" otevře overlay se všemi ovládacími prvky', async () => {
    const page = renderPresenter();

    expect(page.isHelpVisible()).toBe(false);
    await page.toggleHelp();

    expect(page.isHelpVisible()).toBe(true);
    const text = page.helpOverlayText();
    expect(text).toContain('Mezerník'); // otázky
    expect(text).toMatch(/foto/i); // přepínání fotek
    expect(text).toMatch(/otázk/i); // přepínání otázek
    expect(text).toMatch(/odpověď/i); // odhalení odpovědi
    expect(text).toMatch(/obrazovk/i); // fullscreen
    expect(text).toMatch(/zavř|skrý/i); // zavírání/skrývání
  });

  // Scénář 3
  it('„?" podruhé overlay zavře a prezentace zůstane stejná', async () => {
    const page = renderPresenter();
    const progressBefore = page.photoProgress();

    await page.toggleHelp();
    await page.toggleHelp();

    expect(page.isHelpVisible()).toBe(false);
    expect(page.photoProgress()).toBe(progressBefore);
    expect(page.isQuestionsVisible()).toBe(false);
  });

  // Scénář 4
  it('ESC zavře overlay a panel otázek zůstane otevřený', async () => {
    const page = renderPresenter();

    await page.toggleQuestions();
    await page.toggleHelp();
    expect(page.isHelpVisible()).toBe(true);

    await page.hideWithEsc();

    expect(page.isHelpVisible()).toBe(false);
    expect(page.isQuestionsVisible()).toBe(true);
  });

  // Scénář 5
  it('nápověda funguje i při otevřených otázkách', async () => {
    const page = renderPresenter();

    await page.toggleQuestions();
    await page.toggleHelp();
    expect(page.isHelpVisible()).toBe(true);

    await page.toggleHelp();

    expect(page.isHelpVisible()).toBe(false);
    expect(page.isQuestionsVisible()).toBe(true);
  });
});
