import * as DemoSelectReact from "react";

/** Preserve the real select as the value/form source; enhance only its presentation. */
export function enhanceDemoSelects(root: ParentNode) {
  const cleanups: (() => void)[] = [];
  const updates: (() => void)[] = [];
  root
    .querySelectorAll<HTMLSelectElement>("select:not([multiple]):not([size])")
    .forEach((select, index) => {
      if (
        select.closest("[inert], .is-preview") ||
        select.dataset.enhancedSelect
      )
        return;
      const wrap = document.createElement("span");
      wrap.className = "demo-select";
      select.before(wrap);
      wrap.append(select);
      select.dataset.enhancedSelect = "true";
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "demo-select-trigger";
      trigger.setAttribute("role", "combobox");
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      const value = document.createElement("span");
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      arrow.setAttribute("viewBox", "0 0 24 24");
      arrow.setAttribute("fill", "none");
      arrow.setAttribute("stroke", "currentColor");
      arrow.setAttribute("stroke-width", "2");
      arrow.setAttribute("aria-hidden", "true");
      arrow.innerHTML = '<path d="m6 9 6 6 6-6"/>';
      trigger.append(value, arrow);
      wrap.append(trigger);
      const nativeFocus = select.focus;
      select.focus = (options?: FocusOptions) => trigger.focus(options);
      cleanups.push(() => {
        select.focus = nativeFocus;
      });
      const popup = document.createElement("div");
      popup.className = "demo-select-popup";
      popup.setAttribute("role", "listbox");
      popup.id = `${select.id || "demo-select"}-${index}-${Math.random().toString(36).slice(2, 8)}-options`;
      popup.hidden = true;
      (
        select.closest(".scene") ||
        select.closest("dialog") ||
        document.body
      ).append(popup);
      trigger.setAttribute("aria-controls", popup.id);
      let active = select.selectedIndex,
        opened = false,
        prefix = "",
        typedAt = 0;
      const on = (target: EventTarget, name: string, fn: EventListener) => {
        target.addEventListener(name, fn);
        cleanups.push(() => target.removeEventListener(name, fn));
      };
      const close = () => {
        opened = false;
        popup.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        trigger.removeAttribute("aria-activedescendant");
      };
      const label = () =>
        select.getAttribute("aria-label") ||
        Array.from(select.labels || [])
          .map((item) =>
            Array.from(item.childNodes)
              .filter((node) => node.nodeType === 3)
              .map((node) => node.textContent)
              .join(" ")
              .trim(),
          )
          .join(" ") ||
        select.name ||
        "옵션 선택";
      const paint = () => {
        const text = select.selectedOptions[0]?.textContent || "선택하세요";
        if (value.textContent !== text) value.textContent = text;
        trigger.disabled = select.disabled;
        trigger.setAttribute("aria-label", label());
        trigger.setAttribute(
          "aria-invalid",
          select.getAttribute("aria-invalid") || "false",
        );
        trigger.setAttribute("aria-required", String(select.required));
        for (const attribute of ["aria-describedby", "aria-errormessage"]) {
          const content = select.getAttribute(attribute);
          if (content) trigger.setAttribute(attribute, content);
          else trigger.removeAttribute(attribute);
        }
        popup.setAttribute("aria-label", label());
        Array.from(popup.children).forEach((option, i) => {
          option.setAttribute(
            "aria-selected",
            String(i === select.selectedIndex),
          );
          option.classList.toggle("is-active", i === active);
        });
        if (opened && active >= 0)
          trigger.setAttribute(
            "aria-activedescendant",
            `${popup.id}-${active}`,
          );
        if (select.disabled) close();
      };
      const place = () => {
        if (!opened) return;
        if (!trigger.isConnected || !trigger.getClientRects().length) {
          close();
          return;
        }
        const box = trigger.getBoundingClientRect();
        if (
          box.bottom <= 0 ||
          box.top >= innerHeight ||
          box.right <= 0 ||
          box.left >= innerWidth
        ) {
          close();
          return;
        }
        const width = Math.min(Math.max(box.width, 150), innerWidth - 24);
        const below = innerHeight - box.bottom - 12;
        const above = box.top - 12;
        const up = below < Math.min(220, popup.scrollHeight) && above > below;
        const height = Math.min(240, Math.max(40, up ? above : below));
        popup.style.cssText = `position:fixed;width:${width}px;left:${Math.max(12, Math.min(box.left, innerWidth - width - 12))}px;max-height:${height}px;top:${up ? Math.max(12, box.top - Math.min(popup.scrollHeight, height) - 5) : box.bottom + 5}px`;
      };
      const choose = (i: number) => {
        if (select.options[i]?.disabled) return;
        select.selectedIndex = i;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
        close();
        paint();
        trigger.focus();
      };
      const rebuild = () => {
        popup.replaceChildren(
          ...Array.from(select.options).map((option, i) => {
            const row = document.createElement("div");
            row.id = `${popup.id}-${i}`;
            row.setAttribute("role", "option");
            row.setAttribute("aria-disabled", String(option.disabled));
            row.textContent = option.textContent;
            row.addEventListener("pointermove", () => {
              if (!option.disabled) {
                active = i;
                paint();
              }
            });
            row.addEventListener("pointerdown", (event) =>
              event.preventDefault(),
            );
            row.addEventListener("click", () => choose(i));
            return row;
          }),
        );
        paint();
        place();
      };
      const expand = () => {
        if (trigger.disabled) return;
        active = Math.max(0, select.selectedIndex);
        opened = true;
        popup.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        paint();
        place();
        popup.children[active]?.scrollIntoView({ block: "nearest" });
      };
      const move = (direction: number, edge?: boolean) => {
        const options = Array.from(select.options);
        let next = edge
          ? direction > 0
            ? 0
            : options.length - 1
          : active + direction;
        while (next >= 0 && next < options.length && options[next].disabled)
          next += direction;
        if (next >= 0 && next < options.length) active = next;
        paint();
        popup.children[active]?.scrollIntoView({ block: "nearest" });
      };
      on(trigger, "click", (event) => {
        event.preventDefault();
        paint();
        opened ? close() : expand();
      });
      on(trigger, "keydown", ((event: globalThis.KeyboardEvent) => {
        if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey)
          return;
        if (event.key === "Escape") {
          if (opened) {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          return;
        }
        if (event.key === "Tab") {
          close();
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const wasOpen = opened;
          if (!opened) expand();
          if (wasOpen || ["Home", "End"].includes(event.key))
            move(
              ["ArrowDown", "Home"].includes(event.key) ? 1 : -1,
              ["Home", "End"].includes(event.key),
            );
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          opened ? choose(active) : expand();
        } else if (event.key.length === 1) {
          event.preventDefault();
          const now = Date.now();
          prefix = now - typedAt < 700 ? prefix + event.key : event.key;
          typedAt = now;
          if (!opened) expand();
          const i = Array.from(select.options).findIndex(
            (option) =>
              !option.disabled &&
              option.text.toLowerCase().startsWith(prefix.toLowerCase()),
          );
          if (i >= 0) {
            active = i;
            paint();
            popup.children[i]?.scrollIntoView({ block: "nearest" });
          }
        }
      }) as EventListener);
      on(document, "pointerdown", ((event: globalThis.PointerEvent) => {
        if (
          !wrap.contains(event.target as Node) &&
          !popup.contains(event.target as Node)
        )
          close();
      }) as EventListener);
      on(document, "focusin", ((event: globalThis.FocusEvent) => {
        if (
          !wrap.contains(event.target as Node) &&
          !popup.contains(event.target as Node)
        )
          close();
      }) as EventListener);
      on(select, "change", paint);
      if (select.form) on(select.form, "reset", () => queueMicrotask(paint));
      on(document, "demo:select-sync", paint);
      on(window, "resize", place);
      const scroll = () => place();
      document.addEventListener("scroll", scroll, true);
      cleanups.push(() => document.removeEventListener("scroll", scroll, true));
      const observer = new MutationObserver(rebuild);
      observer.observe(select, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "selected", "label", "aria-invalid"],
      });
      const syncObserver = new MutationObserver(paint);
      syncObserver.observe((root as Element).closest?.(".scene") || root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-state"],
      });
      cleanups.push(() => {
        observer.disconnect();
        syncObserver.disconnect();
        popup.remove();
        select.removeAttribute("data-enhanced-select");
        wrap.before(select);
        wrap.remove();
      });
      rebuild();
      updates.push(paint);
    });
  return {
    sync: () => updates.forEach((update) => update()),
    destroy: () => cleanups.reverse().forEach((cleanup) => cleanup()),
  };
}

export function DemoSelect(
  props: DemoSelectReact.SelectHTMLAttributes<HTMLSelectElement> & {
    ref?: DemoSelectReact.Ref<HTMLSelectElement>;
  },
) {
  const root = DemoSelectReact.useRef<HTMLSpanElement>(null);
  const instance = DemoSelectReact.useRef<ReturnType<
    typeof enhanceDemoSelects
  > | null>(null);
  DemoSelectReact.useEffect(() => {
    if (root.current) instance.current = enhanceDemoSelects(root.current);
    return () => {
      instance.current?.destroy();
      instance.current = null;
    };
  }, []);
  DemoSelectReact.useEffect(() => {
    instance.current?.sync();
  });
  return (
    <span className="demo-select-host" ref={root}>
      <select {...props} />
    </span>
  );
}
