/**
 * Acceptance test: Landing page (knihovna kvízů).
 *
 * Kontrakt: specs/landing-page.spec.md – stránka ukáže knihovnu karet kvízů
 * s metadaty, „Vytvořte vlastní" sekcí, a z karty jde kvíz spustit (Play Now)
 * nebo přizpůsobit (Customize).
 *
 * Vrstva: jsdom (chování komponenty + Pinia + vue-router), selektory v
 * tests/support/landing-page.js. Viz TESTING.md.
 */
import { describe, it, expect } from 'vitest';
import { renderLanding, quizPacks } from './support/landing-page.js';
import { getPackMetadata } from '@/data/quizPacks';

describe('Landing page', () => {
  it('zobrazí nadpis knihovny a kartu pro každý kvíz', async () => {
    const page = await renderLanding();

    expect(page.title()).toContain('Knihovna Kvízů');
    expect(page.cards()).toHaveLength(quizPacks.length);
  });

  it('na každé kartě ukáže titulek, popis a metadata', async () => {
    const page = await renderLanding();

    for (const pack of quizPacks) {
      const card = page.card(pack);
      const meta = getPackMetadata(pack.id);

      expect(card.getByText(pack.description)).toBeInTheDocument();
      expect(card.getByText(new RegExp(`${meta.photoCount}\\s+fotek`))).toBeInTheDocument();
      expect(card.getByText(new RegExp(`${meta.questionCount}\\s+otázek`))).toBeInTheDocument();
    }
  });

  it('na každé kartě nabídne Play Now i Customize', async () => {
    const page = await renderLanding();

    for (const pack of quizPacks) {
      const card = page.card(pack);
      expect(card.getByRole('button', { name: /Play Now/i })).toBeInTheDocument();
      expect(card.getByRole('button', { name: /Customize/i })).toBeInTheDocument();
    }
  });

  it('ukáže sekci „Vytvořte vlastní"', async () => {
    const page = await renderLanding();

    expect(page.hasCreateYourOwn()).toBe(true);
  });

  it('Play Now spustí prezentaci vybraného kvízu', async () => {
    const page = await renderLanding();

    await page.playNow(quizPacks[0]);

    expect(page.currentPath()).toBe('/presenter');
  });

  it('Customize otevře nastavení vybraného kvízu', async () => {
    const page = await renderLanding();

    await page.customize(quizPacks[1]);

    expect(page.currentPath()).toBe(`/customize/${quizPacks[1].id}`);
  });
});
