import { effectDefinitions } from "./effect-definitions";
import type { Term } from "./catalog";
export const effectSeeds: Term[] = effectDefinitions.map((d, index) => ({
  id: d.id,
  demoId: d.id,
  english: d.name,
  pronunciation: d.pronunciation,
  korean: d.korean,
  category: d.category,
  summary: d.summary,
  aliases: [...d.aliases],
  keywords: [...d.keywords],
  hidden: false,
  order: 51 + index,
  revision: 1,
}));
export const pointerOnlyEffects = effectDefinitions
  .filter((d) => d.pointerOnly)
  .map((d) => d.id);
