export function measureText(value) {
  const text = String(value ?? "");
  const characters =
    typeof Intl.Segmenter === "function"
      ? Array.from(
          new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(text),
        ).length
      : Array.from(text).length;
  let bytes = 0;
  for (const character of text) {
    const point = character.codePointAt(0) ?? 0;
    bytes += point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
  }
  return { characters, bytes };
}
export function formatTextMetrics(value, limit) {
  const { characters, bytes } = measureText(value);
  return `${characters}${limit ? ` / ${limit}` : ""}자 · ${bytes} byte (UTF-8)`;
}
export function limitText(value, limit) {
  const text = String(value ?? "");
  return typeof Intl.Segmenter === "function"
    ? Array.from(
        new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(text),
        (item) => item.segment,
      )
        .slice(0, limit)
        .join("")
    : Array.from(text).slice(0, limit).join("");
}
export function setupTextMetrics() {
  const bind = () => {
    for (const field of document.querySelectorAll(
      'input:not([type]),input[type="text"],input[type="search"],input[type="email"],textarea',
    )) {
      if (
        field.readOnly ||
        field.inputMode === "numeric" ||
        field.placeholder === "YYYY-MM-DD"
      )
        continue;
      if (!field.id)
        field.id = "text-metric-" + Math.random().toString(36).slice(2);
      let counter = Array.from(
        document.querySelectorAll("[data-counter-for]"),
      ).find((node) => node.getAttribute("data-counter-for") === field.id);
      if (!counter) {
        counter = document.createElement("p");
        counter.className = "input-metrics";
        counter.setAttribute("data-counter-for", field.id);
        if (field.dataset.hardLimit || field.dataset.metricLimit)
          counter.dataset.maxChars =
            field.dataset.hardLimit || field.dataset.metricLimit;
        const wrapper = field.closest(
          ".combo-input,.foundation-search-row,label",
        );
        (wrapper || field).after(counter);
      }
      if (!counter.id) counter.id = field.id + "-metrics";
      const descriptions = new Set(
        (field.getAttribute("aria-describedby") || "")
          .split(/\s+/)
          .filter(Boolean),
      );
      descriptions.add(counter.id);
      field.setAttribute("aria-describedby", [...descriptions].join(" "));
      const hard = Number(field.dataset.hardLimit);
      if (hard) field.value = limitText(field.value, hard);
      const max = Number(counter.dataset.maxChars) || undefined,
        text = formatTextMetrics(field.value, max);
      if (counter.textContent !== text) counter.textContent = text;
      counter.classList.toggle(
        "is-over-limit",
        !!max && measureText(field.value).characters > max,
      );
    }
  };
  for (const event of ["input", "change", "click", "keydown", "reset"])
    document.addEventListener(event, () => queueMicrotask(bind));
  new MutationObserver(bind).observe(document.body, {
    childList: true,
    subtree: true,
  });
  bind();
}
