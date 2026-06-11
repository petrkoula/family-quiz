# Design tokens — „Rodinné album" (theme: `album`)

Specifikace extrahovaná z implementovaného layoutu (Landing, Customization).
Zdroje pravdy v kódu: `vue-app/src/style.css` (CSS proměnné) a
`vue-app/src/theme.js` (Naive UI `themeOverrides` + `themeName`).
Závazná „don't" pravidla: [taste.md](taste.md). Referenční záběry:
`screenshots/album/` (generuje `yarn screenshots`).

## TYPOGRAPHY

| Úroveň | Písmo | Váha | Velikost | Tracking | Použití |
| --- | --- | --- | --- | --- | --- |
| Display | Fraunces (fallback Georgia) | 600 | 2.8rem | −0.01em | H1 knihovny |
| Title | Fraunces | 600 | 2.1rem | normal | H1 stránky (Nastavení kvízu) |
| Card title | Fraunces | 600 | 1.45rem | normal | H2 na kartě packu |
| Body | system-ui (Segoe UI / SF / Roboto) | 400 | 1–1.05rem | normal | běžný text, labely řádků |
| Small | system-ui | 400 | 0.95rem | normal | metadata, výsledky reloadu |
| Kicker | system-ui | 600 | 0.8rem | +0.06em, UPPERCASE | názvy sekcí formuláře |

- Serif (`--font-display`) **jen nadpisy**; veškerý UI text je systémový sans.
- Fraunces se načítá z Google Fonts v `vue-app/index.html`
  (`opsz 9..144`, váhy 500/600); bez sítě degraduje na Georgia.
- Váhy v UI: 400 běžný text, 500 tlačítka, 600 strong/nadpisy. Nic těžšího.

## COLORS

| Token | Hodnota | Použití |
| --- | --- | --- |
| `--accent` | `#c2512c` | primární akce (Play Now, Start Quiz), aktivní switch |
| `--accent-hover` | `#d86a41` | hover primárních akcí |
| `--accent-pressed` | `#993c1d` | stisk primárních akcí |
| `--accent-soft` | `rgba(194,81,44,.12)` | focus ring, jemné zvýraznění |
| `--ink` | `#3b2f26` | nadpisy, hodnoty, hlavní text |
| `--ink-soft` | `#6b5b4d` | sekundární text, labely, tichá tlačítka |
| `--ink-muted` | `#94826f` | metadata, kickery, placeholder obsah |
| `--canvas` | `#faf5ec` | pozadí stránky (teplý papír) |
| `--surface` | `#fffdf8` | povrch karet |
| `--paper-deep` | `#f1e7d3` | pruh pod polaroidem na kartě |
| `--field-fill` | `#f2e8d8` | výplň formulářových polí (select) |
| `--success` | `#4d7340` | odhalená správná odpověď (presenter), potvrzení |
| `--success-soft` / `--success-ink` | `#eaf1e2` / `#2f4a22` | správná možnost v editoru, stav „aktivní" |
| `--warn-soft` / `--warn-ink` | `#f6e7c1` / `#7a5b10` | badge „Návrh", stavy čekání |
| `--hairline` | `rgba(82,60,39,.12)` | jediná povolená linka (viz taste.md) |
| polaroid white | `#ffffff` | rámeček fotky — jediná čistá bílá v designu |

### Projekce (presenter)

Tmavé „pódium", ať na projektoru vyniknou fotky; panel otázek je papír:

| Místo | Hodnota |
| --- | --- |
| pozadí pódia | `#2a2018` (teplá tma, žádný gradient) |
| jáma fotky | `#1f1812` |
| text na tmavé | `#e8ddcc`, chip pozadí `rgba(232,221,204,.14)` |
| panel otázek | `--canvas`; možnosti `--surface` + `--shadow-soft` |
| odhalená odpověď | `--success` s bílým textem a ✓ |

## SPACING

- **Základní jednotka 4 px**; škála: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 56 / 64.
- Rytmus stránky: vnější padding 3.5–4rem (56–64), mezi sekcemi formuláře
  2.5rem (40), uvnitř sekce 0.85–1rem (12–16), grid karet gap 1.75rem (28 —
  tolerovaný mezikrok), obsah karty padding 24.
- Sekce odděluje **whitespace, ne čáry** — vzdálenost mezi sekcemi musí být
  zřetelně větší než vzdálenosti uvnitř sekce (≈ 2.5×).

## BORDER RADIUS

| Stupeň | Hodnota | Použití |
| --- | --- | --- |
| small | 6px | drobné prvky (Naive `borderRadiusSmall`) |
| medium | 8px | tlačítka, selecty, formulářové prvky (`--radius`) |
| large | 12px | karty (`--radius-lg`) |
| full | pill | jen výjimečně (round tlačítko „Obnovit knihovnu") |
| none | 0 | **polaroidy — fotky mají ostré rohy, vždy** |

## SHADOWS

| Token / místo | Hodnota | Poznámka |
| --- | --- | --- |
| `--shadow-soft` | `0 1px 2px rgba(82,60,39,.05), 0 10px 30px rgba(82,60,39,.08)` | klidová karta |
| hover-lift | `0 4px 10px rgba(82,60,39,.06), 0 18px 40px rgba(82,60,39,.1)` + `translateY(-4px)` | karta pod kurzorem |
| polaroid | `0 1px 2px rgba(82,60,39,.12), 0 10px 24px rgba(82,60,39,.18)` | fotka „položená" na papír |

- Všechny stíny jsou **teplé** (hnědý základ `82,60,39`), nikdy černé/modré.
- Stín nahrazuje border; prvek nemá nikdy obojí.

## IMAGERY (podpisový prvek)

Fotky se nikdy nevkládají jako holé obdélníky — vždy **polaroid**:
bílý rámeček `padding: 10px 10px 30px`, natočení −2° / +1.6° (střídavě po
kartách, `:nth-child(even)`), `filter: sepia(.18) saturate(.92)` pro
sjednocení různorodých rodinných fotek, položený na pruhu `--paper-deep`.
Hover fotku narovná (`rotate(0) scale(1.03)`). Prázdný slot (create-card) =
čárkovaný prázdný polaroid se serifovým „+".

Varianta **mini-polaroid** (editor, reorder): bez natočení — editor je pracovní
plocha; jen bílý rámeček (`8px 8px 22px`), teplý stín a stejná sépie. Výjimka:
presenter ukazuje fotku bez rámečku (maximální plocha na projektoru).

## MOTION

- Ovládací prvky: 0.15–0.2s `ease` (barvy, focus).
- Karty/polaroidy: 0.35s `ease` — zvednutí karty, narovnání fotky.
- Jeden podpisový pohyb na obrazovku; nic se nehýbe samo od sebe.
