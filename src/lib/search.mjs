export function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\-_·]+/g, "");
}
export function scoreTerm(term, query) {
  const q = normalize(query);
  if (!q) return 1;
  const names = [term.english, term.pronunciation, term.korean].map(normalize);
  if (names.includes(q)) return 100;
  if (names.some((n) => n.includes(q))) return 80;
  if (
    [...(term.tags || []), ...term.aliases].some((a) =>
      normalize(a).includes(q),
    )
  )
    return 65;
  if (term.keywords.some((k) => normalize(k) === q)) return 60;
  if (
    term.keywords.some(
      (k) => normalize(k).includes(q) || q.includes(normalize(k)),
    )
  )
    return 50;
  const text = normalize(
    [
      term.summary,
      ...(term.tags || []),
      ...term.keywords,
      ...term.aliases,
    ].join(" "),
  );
  const tokens = String(query).trim().split(/\s+/).map(normalize);
  if (tokens.every((t) => text.includes(t))) return 35;
  return 0;
}
