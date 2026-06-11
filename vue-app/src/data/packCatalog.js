// Katalog balíčků – jediný zdroj výchozích dat balíčků (fotky + otázky).
// Knihovna (packLibraryStore) nad katalogem aplikuje uložené ruční úpravy.
//
// Otázka v katalogu může nést `placeholder: true` – automaticky připravený
// návrh, který v UI dostane štítek a při první ruční úpravě se stane
// autorskou otázkou (štítek zmizí, úprava se uloží).

import { quizData } from './quizData.js';
import { quizPacks } from './quizPacks.js';

function builtInCatalog() {
  return quizPacks.map(pack => ({
    id: pack.id,
    title: pack.title,
    description: pack.description,
    thumbnail: pack.thumbnail,
    color: pack.color,
    photos: pack.photoIndices
      .map(index => quizData[index])
      .filter(Boolean)
      .map(item => ({
        image: item.image,
        questions: item.questions.map(question => ({
          ...question,
          options: [...question.options],
        })),
      })),
  }));
}

let catalogSource = builtInCatalog;

/** Vrátí aktuální katalog balíčků (výchozí = vestavěná data). */
export function getPackCatalog() {
  return catalogSource();
}

/**
 * Testovací háček: podstrčí jiný zdroj katalogu (žádná síť/disk v testech,
 * viz TESTING.md). `null` vrátí vestavěný katalog.
 */
export function setPackCatalogSource(source) {
  catalogSource = source ?? builtInCatalog;
}

export function resetPackCatalogSource() {
  catalogSource = builtInCatalog;
}
