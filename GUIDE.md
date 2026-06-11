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

## 3. Objeví se kvízy — doplň otázky a hrej

- **Kvízy se objeví samy**: každá složka = karta s počtem fotek a otázek.
  Hrát jde okamžitě (Play Now) — fotky bez otázek zatím ukazují placeholder
  **„Doplň otázku"** (žádná odpověď není označená jako správná).
- **Doplň otázky** do banky `vue-app/src/data/quizData.js` — záznam se páruje
  podle jména souboru:

  ```js
  {
    image: 'party1.jpg',
    questions: [
      { text: 'Kdo to je?', options: ['Babička', 'Děda', 'Soused', 'Pes'], correct: 0 },
      // ... celkem 3 otázky
    ],
  },
  ```

- **Ulož, obnov stránku a klikni ↻ Reload na kartě** — placeholdery se nahradí
  tvými otázkami. Už ručně napsané otázky reload nikdy nepřepíše.
- **Hrej** — Play Now na kartě (ovládání viz bod 5).

> Stav knihovny se pamatuje (localStorage) — další otevření appky je okamžité,
> disk se znovu čte jen na kliknutí Reload / Obnovit knihovnu.

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
