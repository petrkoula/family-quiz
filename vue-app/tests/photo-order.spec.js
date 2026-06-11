/**
 * Acceptance test: Reorder a pack's photos in the edit screen.
 *
 * Kontrakt: specs/photo-order.spec.md – z menu úprav se vstoupí do reorder
 * módu (boxy se collapsnou na drag-and-drop řádky), tažením se změní pořadí,
 * „Uložit" ho potvrdí a panely se zase rozbalí. Pořadí je vlastnost balíčku:
 * přežije restart a hraje se v prezentaci. „Zrušit" původní pořadí zachová.
 *
 * Vrstva: jsdom (komponenta + Pinia + vue-router), selektory v
 * tests/support/edit-page.js a presenter-page.js. Viz TESTING.md.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderEdit, injectPackCatalog, resetLibraryEnvironment } from './support/edit-page.js';
import { startPresentationForPack } from './support/presenter-page.js';

afterEach(() => {
  resetLibraryEnvironment();
});

const IMAGES = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];

function orderablePack() {
  return [
    {
      id: 'orderable',
      title: 'Orderable',
      description: '',
      thumbnail: 'a.jpg',
      color: '#123456',
      photos: IMAGES.map(image => ({
        image,
        questions: [{ text: `Otázka ${image}`, options: ['Ano', 'Ne'], correct: 0 }],
      })),
    },
  ];
}

describe('Photo order in edit screen', () => {
  // Scénář 1
  it('obrazovka úprav nabízí v menu volbu „Upravit pořadí" a boxy jsou rozbalené', async () => {
    injectPackCatalog(orderablePack());
    const page = await renderEdit('orderable');

    expect(page.hasMenu()).toBe(true);
    expect(page.photoCount()).toBe(4); // rozbalené boxy s otázkami

    await page.openMenu();
    expect(page.canReorder()).toBe(true);
  });

  // Scénář 2
  it('vstup do reorder módu collapsne boxy, ukáže „Uložit" a schová volbu pořadí', async () => {
    injectPackCatalog(orderablePack());
    const page = await renderEdit('orderable');

    await page.startReorder();

    expect(page.isReorderMode()).toBe(true);
    expect(page.reorderItemCount()).toBe(4);
    expect(page.photoCount()).toBe(0); // boxy s otázkami nejsou
    expect(page.hasSaveOrder()).toBe(true);
    expect(page.hasMenu()).toBe(false); // volba pořadí už se nenabízí
  });

  // Scénář 3
  it('přetažení fotky změní pořadí v seznamu', async () => {
    injectPackCatalog(orderablePack());
    const page = await renderEdit('orderable');
    await page.startReorder();

    expect(page.reorderOrder()).toEqual(['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg']);

    // fotku z pozice 1 (index 0) přetáhnu na pozici 3 (index 2)
    await page.dragPhoto(0, 2);

    expect(page.reorderOrder()).toEqual(['b.jpg', 'c.jpg', 'a.jpg', 'd.jpg']);
  });

  // Scénář 4
  it('po „Uložit" se mód opustí, boxy se rozbalí a jsou v novém pořadí', async () => {
    injectPackCatalog(orderablePack());
    const page = await renderEdit('orderable');
    await page.startReorder();
    await page.dragPhoto(0, 2);

    await page.saveOrder();

    expect(page.isReorderMode()).toBe(false);
    expect(page.photoCount()).toBe(4); // boxy zase rozbalené
    expect(page.photoOrder()).toEqual(['b.jpg', 'c.jpg', 'a.jpg', 'd.jpg']);
  });

  // Scénář 5
  it('uložené pořadí přežije zavření a nové otevření aplikace', async () => {
    injectPackCatalog(orderablePack());
    let page = await renderEdit('orderable');
    await page.startReorder();
    await page.dragPhoto(0, 2);
    await page.saveOrder();

    page = await page.reload();

    expect(page.photoOrder()).toEqual(['b.jpg', 'c.jpg', 'a.jpg', 'd.jpg']);
  });

  // Scénář 6
  it('prezentace hraje fotky v uloženém pořadí', async () => {
    injectPackCatalog(orderablePack());
    const page = await renderEdit('orderable');
    await page.startReorder();
    await page.dragPhoto(0, 2);
    await page.saveOrder();

    const presenter = startPresentationForPack('orderable');

    expect(presenter.currentPhotoImage()).toBe('b.jpg');
    await presenter.nextPhoto();
    expect(presenter.currentPhotoImage()).toBe('c.jpg');
    await presenter.nextPhoto();
    expect(presenter.currentPhotoImage()).toBe('a.jpg');
  });

  // Scénář 7
  it('„Zrušit" zahodí změny a pořadí zůstane původní (i po restartu)', async () => {
    injectPackCatalog(orderablePack());
    let page = await renderEdit('orderable');
    await page.startReorder();
    await page.dragPhoto(0, 2);

    await page.cancelReorder();

    expect(page.isReorderMode()).toBe(false);
    expect(page.photoOrder()).toEqual(['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg']);

    page = await page.reload();
    expect(page.photoOrder()).toEqual(['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg']);
  });
});
