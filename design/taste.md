# Taste — závazná pravidla designu „Rodinné album"

Vkusová pravidla pro každého (člověka i agenta), kdo sahá na UI. Doplňují
[tokens.md](tokens.md). „Don't" sekce vychází z anti-AI-aesthetics pravidel
článku [Building a Design System in Claude Design](https://www.mindstudio.ai/blog/build-design-system-claude-design-no-ai-aesthetics),
zkonkretizovaných pro tento projekt.

## Don't — čeho se držet dál

1. **Žádný Inter, DM Sans ani Nunito.** UI text je systémový sans
   (`system-ui` → Segoe UI / SF / Roboto), nadpisy výhradně Fraunces.
2. **Žádná gradientová pozadí** — hero, karty, tlačítka, nic. Plochý teplý
   papír (`--canvas`) je pozadí všeho.
3. **Zaoblená karta nesmí být hlavní strukturální vzor.** Karty jen tam, kde
   jde o skutečnou kolekci objektů (knihovna packů). Formuláře, nastavení
   a detail = editorial layout přímo na canvasu, členěný whitespace.
4. **Žádné dekorativní ikony a emoji** u položek seznamů a na tlačítkách —
   text stačí („Play Now", ne „▶ Play Now"). Jediná výjimka: ❤️ ve footeru
   (hlas značky).
5. **Bordery šetřit.** Sekce odděluje whitespace, ne `<hr>` ani border-top.
   Hairline (`--hairline`) jen tam, kde whitespace nestačí — např. čárkovaný
   prázdný polaroid jako affordance „sem patří fotka".
6. **Žádná modrá / indigo / fialová mimo tokeny.** Akcent je terakota;
   `#6366f1` a spol. jsou zakázané (vyhlíží „AI default").
   **vždy ostré rohy** — zaoblená fotka v albu neexistuje.
8. **Žádný glassmorphism, blur, neon, glow.** Stíny jen teplé a měkké
   (hnědý základ), nikdy černé/modré, nikdy spolu s borderem.
9. **Fotky nikdy full-bleed bez úpravy** — vždy polaroid podle tokens.md
   (rámeček, sépie, natočení).
10. **Mikrotexty česky a vřele** — tón „rodinný večer", ne enterprise UI.

## Do — podpisová gesta (opakovat všude)

- Polaroid jako jediný způsob zobrazení fotky v UI mimo presenter.
- Fraunces na nadpisu = první věc, kterou oko potká na každé obrazovce.
- Terakota vyhrazená primární akci — na obrazovce zpravidla jediné
  terakotové tlačítko.
- Kicker (malé kapitálky, `--ink-muted`) jako nadpis sekce formuláře.
- Hover „narovná fotku" — jediný hravý moment na kartě.

## Reference

- Záběry aktuálního stavu: `screenshots/album/` (`yarn screenshots`).
- Porovnání s předchozí variantou: `screenshots/indigo/`.
