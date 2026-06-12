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
  Hrát jde okamžitě (Spustit) — fotky bez otázek zatím ukazují placeholder
  **„Doplň otázku"** (žádná odpověď není označená jako správná).
- **Doplň otázky** a klikni **↻ Reload** na kartě — placeholdery se nahradí
  tvými otázkami; ručně napsané otázky reload nikdy nepřepíše.
- **Hrej** — Rychlý (Spustit) nebo Vlastní (Customize), viz bod 5.

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

## 5. Hraj — Rychlý nebo Vlastní

- **Rychlý** (▶ Spustit na kartě) — prezentace startuje okamžitě s výchozím
  nastavením: bez časovače, všechny 3 otázky na fotku, původní pořadí.
- **Vlastní** (⚙ Customize na kartě) — před startem si nastavíš časovač,
  počet otázek na fotku a zamíchání fotek/otázek; pak **Start Quiz**
  (nebo **Skip** pro výchozí nastavení).
- Přehled ovládání zobrazíš kdykoli v prezentaci klávesou **?**.
