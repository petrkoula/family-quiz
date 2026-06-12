/**
 * Acceptance test: Quiz question editing (úprava otázek balíčku).
 *
 * Kontrakt: specs/quiz-question-editing.spec.md – z karty kvízu se otevře
 * obrazovka úprav, otázky jdou upravit (text, možnosti, správná odpověď),
 * úpravy hrají v prezentaci, přežijí restart aplikace a platí limity
 * (max 3 otázky na fotku, 2–4 možnosti).
 *
 * Vrstva: jsdom (komponenta + Pinia + vue-router), selektory v
 * tests/support/edit-page.js. Viz TESTING.md.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderLanding, quizPacks } from './support/landing-page.js';
import { renderEdit, injectPackCatalog, resetLibraryEnvironment } from './support/edit-page.js';
import { startPresentationForPack } from './support/presenter-page.js';
import { fixturePacks } from './support/fixture-library.js';

afterEach(() => {
  resetLibraryEnvironment();
});

describe('Quiz question editing', () => {
  // Scénář 1: obrazovka úprav je dostupná z karty kvízu
  it('z karty kvízu se otevře obrazovka úprav daného balíčku', async () => {
    const page = await renderLanding();

    await page.edit(quizPacks[1]);

    expect(page.currentPath()).toBe(`/edit/${quizPacks[1].id}`);
  });

  it('obrazovka úprav ukáže všechny fotky balíčku s otázkami a správnou odpovědí', async () => {
    const page = await renderEdit('retro-style');

    expect(page.title()).toContain('Úprava kvízu');
    expect(page.hasBackToLibrary()).toBe(true);
    // Balíček „Retro Styl" má 8 fotek (první fotky z kolekce), každá 3 otázky.
    expect(page.photoCount()).toBe(8);
    expect(page.photo(0).questionCount()).toBe(3);

    // První otázka první fotky odpovídá knihovně (fixture) včetně správné odpovědi.
    const expected = fixturePacks[1].photos[0].questions[0];
    const question = page.photo(0).question(0);
    expect(question.text()).toBe(expected.text);
    expect(question.options()).toEqual(expected.options);
    expect(question.correctOption()).toContain(expected.options[expected.correct]);
  });

  // Scénář 2: úprava textu, možností a správné odpovědi
  it('upravená otázka se po uložení ukáže v seznamu včetně nové správné odpovědi', async () => {
    const page = await renderEdit('retro-style');

    const form = await page.photo(0).question(0).edit();
    await form.setText('Kdo je na fotce nejvíc cool?');
    await form.setOption(1, 'Děda v zimě i v létě');
    await form.chooseCorrect(1);
    await form.save();

    const question = page.photo(0).question(0);
    expect(question.text()).toBe('Kdo je na fotce nejvíc cool?');
    expect(question.options()[1]).toBe('Děda v zimě i v létě');
    expect(question.correctOption()).toBe('Děda v zimě i v létě');
  });

  // Scénář 3: upravené otázky hrají v prezentaci
  it('prezentace balíčku hraje upravenou otázku včetně nové správné odpovědi', async () => {
    const page = await renderEdit('retro-style');

    const form = await page.photo(0).question(0).edit();
    await form.setText('Kdo je na fotce nejvíc cool?');
    await form.setOption(1, 'Děda v zimě i v létě');
    await form.chooseCorrect(1);
    await form.save();

    const presenter = startPresentationForPack('retro-style');
    await presenter.toggleQuestions();

    expect(presenter.questionText()).toBe('Kdo je na fotce nejvíc cool?');

    await presenter.revealAnswer();
    expect(presenter.revealedCorrectAnswer()).toBe('Děda v zimě i v létě');
  });

  // Scénář 4: úpravy přežijí restart aplikace
  it('uložená úprava přežije zavření a nové otevření aplikace', async () => {
    let page = await renderEdit('retro-style');

    const form = await page.photo(0).question(0).edit();
    await form.setText('Otázka, která přežije restart');
    await form.save();

    page = await page.reload();

    expect(page.photo(0).question(0).text()).toBe('Otázka, která přežije restart');
  });

  // Scénář 5: úprava navržené (zástupné) otázky z ní udělá autorskou
  it('úprava navržené otázky odstraní štítek návrhu a přetrvá restart', async () => {
    injectPackCatalog([
      {
        id: 'test-pack',
        title: 'Testovací balíček',
        description: 'Balíček s navrženou otázkou',
        thumbnail: 'test.jpg',
        color: '#123456',
        photos: [
          {
            image: 'test.jpg',
            questions: [
              {
                text: 'Navržená otázka?',
                options: ['Ano', 'Ne'],
                correct: 0,
                placeholder: true,
              },
            ],
          },
        ],
      },
    ]);

    let page = await renderEdit('test-pack');
    expect(page.photo(0).question(0).isSuggested()).toBe(true);

    const form = await page.photo(0).question(0).edit();
    await form.setText('Ručně potvrzená otázka?');
    await form.save();

    expect(page.photo(0).question(0).isSuggested()).toBe(false);

    page = await page.reload();
    const question = page.photo(0).question(0);
    expect(question.isSuggested()).toBe(false);
    expect(question.text()).toBe('Ručně potvrzená otázka?');
  });

  // Scénář 6: fotka drží nejvýš tři otázky (a nejméně jednu)
  it('fotka má nejvýš tři otázky – přidat jde až po smazání jedné', async () => {
    const page = await renderEdit('retro-style');
    const photo = page.photo(0);

    // Tři otázky → další přidat nejde.
    expect(photo.questionCount()).toBe(3);
    expect(photo.canAddQuestion()).toBe(false);

    // Po smazání jedné se objeví zbývající dvě a místo na novou.
    await photo.question(2).delete();
    expect(photo.questionCount()).toBe(2);
    expect(photo.canAddQuestion()).toBe(true);

    // Přidání nové otázky (zpět na tři) možnost přidávání zase schová.
    const form = await photo.addQuestion();
    await form.setText('Nová otázka?');
    await form.setOption(0, 'Ano');
    await form.setOption(1, 'Ne');
    await form.save();

    expect(photo.questionCount()).toBe(3);
    expect(photo.question(2).text()).toBe('Nová otázka?');
    expect(photo.canAddQuestion()).toBe(false);
  });

  it('poslední otázka fotky smazat nejde', async () => {
    injectPackCatalog([
      {
        id: 'test-pack',
        title: 'Testovací balíček',
        description: 'Fotka s jedinou otázkou',
        thumbnail: 'test.jpg',
        color: '#123456',
        photos: [
          {
            image: 'test.jpg',
            questions: [{ text: 'Jediná otázka?', options: ['Ano', 'Ne'], correct: 0 }],
          },
        ],
      },
    ]);

    const page = await renderEdit('test-pack');

    expect(page.photo(0).question(0).canDelete()).toBe(false);
  });
});
