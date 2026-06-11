# GUIDE: Čistý start aplikace (lokální provoz)

Krátký návod, jak rozjet Family Quiz lokálně od nuly — od fotek po spuštěnou
prezentaci.

## 1. Nakopíruj fotky

Fotky patří do **kořenové složky `images/`, jedna podsložka = jeden kvíz**:

```
c:\dev\quiz\images\
  family-vintage\     ← jeden kvíz
    IMG_001.jpg
    IMG_002.jpg
  oslavy-2026\        ← další kvíz
    party1.jpg
    party2.png
```

- Název složky určuje kvíz: `oslavy-2026` → karta **„Oslavy 2026"**
  (titulek se humanizuje; už známé kvízy si nechají svůj vlastní titulek).
- Podporované formáty: **jpg / jpeg / png**. Ostatní soubory se ignorují.
- Prázdná složka se přeskočí (není z ní kvíz).

## 2. Spusť aplikaci

```bash
cd vue-app
yarn install     # jen poprvé
yarn dev
```

→ otevři **http://localhost:5173**

## 3. Co se stane

- **První návštěva**: knihovna se sama naplní z aktuálních složek —
  každá složka je karta s počtem fotek a otázek.
- **Otázky**: fotka, ke které existují ruční otázky (banka v
  `vue-app/src/data/quizData.js`, párováno podle jména souboru), je dostane;
  ostatní fotky dostanou **placeholder „Doplň otázku"** — kvíz jde hrát hned,
  jen je vidět, že otázky čekají na doplnění (žádná odpověď není označená
  jako správná).
- **Stav se zapamatuje** (localStorage) — další otevření appky ukáže knihovnu
  okamžitě z cache, **disk se znovu nečte**.

## 4. Změny fotek za provozu

Změny na disku se projeví **jen na explicitní kliknutí** (nic se nesynchronizuje
samo):

| Co jsem udělal | Kam kliknout | Co uvidím |
|---|---|---|
| přidal/smazal fotky v jedné složce | **↻ Reload** na kartě kvízu | „Přidáno: X, Odebráno: Y" |
| přidal/smazal celé složky (kvízy) | **⟳ Obnovit knihovnu** (nahoře) | „Přidáno kvízů: X, Odebráno kvízů: Y, Aktualizováno: Z" |
| nic se nezměnilo | kterékoli z toho | „Pack je aktuální" / „Knihovna je aktuální" |

„Obnovit knihovnu" je **plný sync** — srovná seznam kvízů i fotky uvnitř
všech kvízů najednou.

## 5. Hraní

- **Play Now** na kartě = okamžitý start s výchozím nastavením.
- **Customize** = časovač, počet otázek na fotku, zamíchání.
- V prezentaci: `MEZERNÍK` otázky, `↑↓` přepínání otázek, `A` odhalení
  odpovědi, `←→` další/předchozí foto, `F` fullscreen, `ESC` zavřít.

## Reset do čistého stavu

Zapamatovanou knihovnu smažeš v DevTools konzoli:

```js
localStorage.removeItem('quiz-library-v1')
```

a obnov stránku — proběhne znovu „první návštěva" z aktuálních složek.

## Testy

```bash
cd vue-app
yarn test        # exit 0 = vše zelené; jinak čti test-results/<suite>.failures.txt
```

Detaily metodiky: [TESTING.md](TESTING.md). Specifikace chování: `specs/*.spec.md`.
