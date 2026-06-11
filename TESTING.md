# Memento: jak psát acceptance testy (Vue + agent)

> Krátká instrukce pro lidi i agenty. Cílem je, aby testy šly **ladit**, ne aby
> se generovaly do beztvaré masy, kterou nikdo nesmí editovat.

## Princip: spec je kontrakt, ne kód testu

1. **Nejdřív napiš obecnou specifikaci v Gherkin.**
   `Feature` / `Scenario` / `Given–When–Then` slouží jako čitelný kontrakt —
   popisuje, **co** má appka dělat, jazykem domény. Spec čte člověk i agent.

2. **Spec NEGENERUJ na test kód.**
   Pipeline `spec.json → generator → *.test.js (DO NOT EDIT)` (přístup z ATDDT
   pluginu) se neosvědčil: generované testy mají těžkou nepřímost, nejdou
   editovat a **selektory v nich nevyladíš**. Gherkin zůstává jen jako kontrakt.

3. **Implementuj jeden Use-Case + jeden test, ručně, společně.**
   Vezmi jeden scénář ze specu. Naimplementuj k němu kus appky a **jeden
   skutečný, editovatelný test**. Test piš tak, jak ho vidí uživatel.

4. **Vylaď selektory na reálném UI.**
   Tohle je smysl kroku 3: než škálujeme na desítky testů, na jednom testu si
   ustálíme, jak se na věci v UI ptáme. Až je vzor stabilní, jede se dál
   **test po testu**, ne všechny najednou.

## Anti-pattern (nedělat)

- Napsat 50+ testů dopředu proti UI, které ještě neexistuje nebo se hýbe.
- Generovat testy z Gherkinu a zakázat jejich editaci.
- Selektory přes CSS třídy, regex na text nebo `near()/below()` heuristiku —
  rozbijí se při každém refaktoru a špatně se ladí.

## Konvence selektorů

- Cílit přes **role a přístupný název**: `getByRole('button', { name: 'Uložit' })`.
- Kde role nestačí, přidat do komponenty **`data-testid`** a ptát se
  `getByTestId('timer-duration')`. Nikdy ne `.btn-primary` ani `text(/regex/)`.
- Selektory drž v **helper / page-object vrstvě**, ne roztroušené po testech.
  Když se UI hne, ladíš jedno místo.

## Kam který test patří

- **Chování komponenty** (defaulty, toggly, podmíněné renderování, výběry,
  souhrn) → **jsdom** (Vitest + @testing-library/vue). Rychlé, sem patří většina.
- **Reálné end-to-end** (navigace mezi route, responzivní viewporty, touch,
  „view se načte okamžitě") → **browser e2e** (Playwright), jen pár kritických.

## Pořadí kroků (shrnutí)

```
Gherkin spec (kontrakt)
  └─ vyber 1 scénář
       └─ implementuj 1 UC + 1 test (ručně, editovatelně)
            └─ vylaď selektory, ustáli data-testid konvenci
                 └─ teprve teď přidávej další testy, jeden po druhém
```
