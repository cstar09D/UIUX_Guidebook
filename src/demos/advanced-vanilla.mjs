import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url),
  compiled = buildSync({
    entryPoints: ["src/demos/advanced.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }),
  module = { exports: {} };
runInNewContext(compiled.outputFiles[0].text, {
  module,
  exports: module.exports,
  require,
});
const names = {
  "tree-view": "TreeScene",
  carousel: "CarouselScene",
  "data-table": "DataTableScene",
  snackbar: "SnackbarScene",
  "empty-state": "EmptyStateScene",
  sorting: "SortingScene",
  filtering: "FilteringScene",
  "load-more": "LoadMoreScene",
  "drag-and-drop": "DragDropScene",
  "responsive-layout": "ResponsiveScene",
  "sticky-header": "StickyHeaderScene",
  easing: "EasingScene",
};
export const advancedMarkup = Object.fromEntries(
  Object.entries(names).map(([id, name]) => [
    id,
    renderToStaticMarkup(createElement(module.exports[name])),
  ]),
);
const dataRows = [
  {
    id: "guide",
    name: "화면 가이드",
    owner: "나",
    cost: 11000,
    month: "11",
    kind: "디자인",
  },
  {
    id: "research",
    name: "사용자 조사",
    owner: "민지",
    cost: 9000,
    month: "11",
    kind: "기획",
  },
  {
    id: "tokens",
    name: "디자인 토큰",
    owner: "나",
    cost: 11000,
    month: "12",
    kind: "디자인",
  },
  {
    id: "plan",
    name: "운영 계획",
    owner: "준호",
    cost: 5000,
    month: "11",
    kind: "기획",
  },
];
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
function setupTree() {
  const tree = document.querySelector(".advanced-tree"),
    result = document.querySelector(".advanced-result");
  const nodes = [
    { id: "projects", name: "프로젝트", children: ["design", "research"] },
    {
      id: "design",
      name: "디자인",
      parent: "projects",
      children: ["guide", "tokens"],
    },
    { id: "guide", name: "화면 가이드", parent: "design" },
    { id: "tokens", name: "디자인 토큰", parent: "design" },
    { id: "research", name: "사용자 조사", parent: "projects" },
    { id: "archive", name: "보관함", children: ["history"] },
    { id: "history", name: "이전 기록", parent: "archive" },
  ];
  const icons = {
    folder: tree.querySelector('[data-tree="projects"]>.advanced-tree-row>svg')
      .outerHTML,
    file: tree.querySelector('[data-tree="research"]>.advanced-tree-row>svg')
      .outerHTML,
    chevron: tree.querySelector(".advanced-tree-row>i").innerHTML,
  };
  let expanded = ["projects"],
    active = "projects",
    selected = "";
  const item = (id) => nodes.find((n) => n.id === id);
  function visible() {
    const values = [];
    const visit = (id) => {
      values.push(id);
      if (expanded.includes(id)) item(id).children?.forEach(visit);
    };
    nodes.filter((n) => !n.parent).forEach((n) => visit(n.id));
    return values;
  }
  function render(focus = false) {
    const node = (id) => {
      const n = item(id),
        open = expanded.includes(id);
      return `<li role="treeitem" data-tree="${id}" tabindex="${active === id ? 0 : -1}" aria-labelledby="tree-${id}" aria-selected="${selected === id}" ${n.children ? `aria-expanded="${open}"` : ""}><span class="advanced-tree-row"><i class="${open ? "is-open" : ""}">${n.children ? icons.chevron : ""}</i>${n.children ? icons.folder : icons.file}<span id="tree-${id}">${n.name}</span></span>${n.children ? `<ul role="group" ${open ? "" : "hidden"}>${n.children.map(node).join("")}</ul>` : ""}</li>`;
    };
    tree.innerHTML = nodes
      .filter((n) => !n.parent)
      .map((n) => node(n.id))
      .join("");
    result.textContent = selected
      ? `${item(selected).name} 선택`
      : "폴더를 펼쳐 문서를 선택하세요.";
    if (focus) tree.querySelector(`[data-tree="${active}"]`).focus();
  }
  const focus = (id) => {
    active = id;
    tree
      .querySelectorAll("[data-tree]")
      .forEach((el) => (el.tabIndex = el.dataset.tree === active ? 0 : -1));
    tree.querySelector(`[data-tree="${active}"]`).focus();
  };
  function activate(id) {
    active = id;
    selected = id;
    if (item(id).children)
      expanded = expanded.includes(id)
        ? expanded.filter((n) => n !== id)
        : [...expanded, id];
    render(true);
  }
  tree.onclick = (e) => {
    const row = e.target.closest("[data-tree]");
    if (row) activate(row.dataset.tree);
  };
  tree.onkeydown = (e) => {
    if (e.isComposing) return;
    const row = e.target.closest("[data-tree]");
    if (!row) return;
    const id = row.dataset.tree,
      n = item(id),
      list = visible(),
      index = list.indexOf(id);
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Home",
        "End",
        "Enter",
        " ",
      ].includes(e.key)
    )
      e.preventDefault();
    if (e.key === "ArrowDown")
      focus(list[Math.min(index + 1, list.length - 1)]);
    else if (e.key === "ArrowUp") focus(list[Math.max(0, index - 1)]);
    else if (e.key === "Home") focus(list[0]);
    else if (e.key === "End") focus(list.at(-1));
    else if (e.key === "ArrowRight" && n.children) {
      if (expanded.includes(id)) focus(n.children[0]);
      else {
        expanded.push(id);
        render(true);
      }
    } else if (e.key === "ArrowLeft") {
      if (n.children && expanded.includes(id)) {
        expanded = expanded.filter((v) => v !== id);
        render(true);
      } else if (n.parent) focus(n.parent);
    } else if (e.key === "Enter" || e.key === " ") activate(id);
    else if (e.key.length === 1) {
      const after = [...list.slice(index + 1), ...list.slice(0, index + 1)],
        found = after.find((v) => item(v).name.startsWith(e.key));
      if (found) focus(found);
    }
  };
  render();
}
function setupCarousel() {
  const root = document.querySelector(".advanced-card"),
    slide = root.querySelector(".advanced-slide"),
    status = root.querySelector(".advanced-status"),
    dots = [...root.querySelectorAll("[data-slide]")];
  const slides = [
    [
      "프로젝트의 첫 화면",
      "FIRST IMPRESSION",
      "처음 방문한 사람이 다음 행동을 찾게 해요.",
    ],
    ["읽기 좋은 목록", "CLEAR CONTENT", "같은 정보는 같은 위치에서 비교해요."],
    [
      "작은 상태 안내",
      "HELPFUL FEEDBACK",
      "저장·실패·빈 결과를 구분해 안내해요.",
    ],
  ];
  let index = 0;
  function render() {
    slide.className = `advanced-slide slide-${index}`;
    slide.setAttribute("aria-label", `${index + 1} / 3`);
    slide.querySelector("strong").textContent = slides[index][0];
    slide.querySelector(".advanced-kicker").textContent = slides[index][1];
    slide.querySelector("p").textContent = slides[index][2];
    dots.forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
    status.textContent = `${index + 1} / 3 · ${slides[index][0]}`;
  }
  root.querySelectorAll("[data-slide-step]").forEach(
    (b) =>
      (b.onclick = () => {
        index = (index + Number(b.dataset.slideStep) + 3) % 3;
        render();
      }),
  );
  dots.forEach(
    (b) =>
      (b.onclick = () => {
        index = Number(b.dataset.slide);
        render();
      }),
  );
}
function setupTable(rows) {
  const root = document.querySelector(".advanced-card"),
    table = root.querySelector("table"),
    select = root.querySelector("select"),
    failure = root.querySelector("[type=checkbox]"),
    status = root.querySelector(".advanced-status");
  let month = "all";
  function render() {
    const shown = rows.filter((r) => month === "all" || r.month === month);
    table.querySelector("caption").textContent =
      (month === "all" ? "전체 기간" : `${month}월`) +
      " 프로젝트 비용 · 읽기용 표";
    table.querySelector("tbody").innerHTML = shown.length
      ? shown
          .map(
            (r) =>
              `<tr><th scope="row">${esc(r.name)}</th><td>${r.owner}</td><td>${r.cost.toLocaleString("ko-KR")}원</td><td><button type="button" data-detail="${r.id}" aria-label="${esc(r.name)} 상세">상세</button></td></tr>`,
          )
          .join("")
      : '<tr><td colspan="4">이 기간의 자료가 없어요. 다른 월을 선택하세요.</td></tr>';
    table.querySelector("tfoot td").textContent = shown.length + "건";
    table.querySelectorAll("tfoot td")[1].textContent =
      shown.reduce((n, r) => n + r.cost, 0).toLocaleString("ko-KR") + "원";
    status.className = "advanced-status";
    status.role = "status";
    status.textContent = `${shown.length}개 항목 · 셀 편집 없이 비교해요.`;
  }
  root.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    if (failure.checked) {
      status.className = "advanced-error";
      status.role = "alert";
      status.textContent = "조회하지 못했어요. 기존 표를 유지합니다.";
      return;
    }
    month = select.value;
    render();
  };
  table.onclick = (e) => {
    const button = e.target.closest("[data-detail]");
    if (!button) return;
    status.textContent =
      rows.find((r) => r.id === button.dataset.detail).name +
      " 비용 항목을 확인했어요.";
  };
}
function setupSnackbar() {
  const root = document.querySelector(".advanced-card"),
    bar = root.querySelector(".advanced-snackbar"),
    trigger = root.querySelector(".advanced-controls button"),
    restore = root.querySelector(".advanced-controls button[hidden]"),
    note = root.querySelector(".advanced-note strong"),
    status = root.querySelector(".advanced-status");
  let archived = false,
    open = false,
    hover = false,
    focused = false,
    remaining = 6000,
    started = 0,
    timer;
  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, remaining - (performance.now() - started));
    }
  }
  function schedule() {
    stop();
    if (!open || hover || focused) return;
    started = performance.now();
    timer = setTimeout(() => {
      timer = undefined;
      open = false;
      bar.hidden = true;
      status.textContent = "알림은 사라졌지만 보관함에서 복원할 수 있어요.";
    }, remaining);
  }
  function render() {
    bar.hidden = !open;
    restore.hidden = !archived;
    trigger.setAttribute("aria-disabled", String(archived));
    note.textContent = archived ? "보관함으로 이동한 회의 노트" : "회의 노트";
  }
  function undo() {
    stop();
    archived = false;
    open = false;
    render();
    status.textContent = "보관을 취소했어요.";
    trigger.focus();
  }
  trigger.onclick = () => {
    if (archived) return;
    stop();
    archived = true;
    open = true;
    hover = false;
    focused = false;
    remaining = 6000;
    render();
    status.textContent = "회의 노트를 보관했어요.";
    schedule();
  };
  restore.onclick = undo;
  bar.querySelector("[data-undo]").onclick = undo;
  bar.querySelector("[data-dismiss]").onclick = () => {
    stop();
    open = false;
    render();
    status.textContent = "알림을 닫았어요. 보관 상태는 유지됩니다.";
    trigger.focus();
  };
  bar.onmouseenter = () => {
    hover = true;
    stop();
  };
  bar.onmouseleave = () => {
    hover = false;
    schedule();
  };
  bar.onfocusin = () => {
    focused = true;
    stop();
  };
  bar.onfocusout = (e) => {
    if (!bar.contains(e.relatedTarget)) {
      focused = false;
      schedule();
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      stop();
      open = false;
      render();
      status.textContent = "알림을 닫았어요. 보관 상태는 유지됩니다.";
      trigger.focus();
    }
  });
}
function setupEmpty() {
  const root = document.querySelector(".advanced-card"),
    area = root.querySelector(".advanced-empty-area"),
    status = root.querySelector(".advanced-status");
  const iconEmpty = area.querySelector("svg").outerHTML;
  const iconError =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>';
  let mode = "initial",
    phase = "empty",
    fail = false,
    timer;
  const failure = document.createElement("label");
  failure.className = "advanced-check";
  failure.hidden = true;
  failure.innerHTML = '<input type="checkbox">재시도 실패 모의';
  area.after(failure);
  failure.querySelector("input").onchange = (e) => (fail = e.target.checked);
  function render() {
    const copy =
      mode === "initial"
        ? [
            "아직 노트가 없어요",
            "첫 노트로 아이디어를 남겨 보세요.",
            "첫 노트 만들기",
          ]
        : mode === "filtered"
          ? [
              "조건에 맞는 노트가 없어요",
              "노트는 있지만 현재 조건과 맞지 않아요.",
              "필터 초기화",
            ]
          : [
              "노트를 불러오지 못했어요",
              "데이터가 없는지 아직 확인하지 못했어요.",
              "다시 불러오기",
            ];
    root
      .querySelectorAll("[data-empty-mode]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.emptyMode === mode)),
      );
    area.setAttribute("aria-busy", String(phase === "loading"));
    failure.hidden = mode !== "error";
    failure.querySelector("input").disabled = phase === "loading";
    area.innerHTML =
      phase === "data"
        ? `<ul class="advanced-simple-list"><li>첫 번째 아이디어</li>${mode === "initial" ? "" : "<li>다음 작업 메모</li>"}</ul>`
        : phase === "loading"
          ? '<p role="status">노트를 다시 불러오는 중이에요.</p>'
          : `${mode === "error" ? iconError : iconEmpty}<h3>${copy[0]}</h3><p>${copy[1]}</p><button type="button" class="demo-primary" data-empty-action>${copy[2]}</button>`;
    status.textContent =
      phase === "data"
        ? `노트 ${mode === "initial" ? 1 : 2}개를 표시해요.`
        : phase === "loading"
          ? "조회 중"
          : mode === "error"
            ? "실패와 데이터 없음은 다른 상태입니다."
            : "빈 상태에서 다음 행동을 안내해요.";
  }
  root.querySelectorAll("[data-empty-mode]").forEach(
    (b) =>
      (b.onclick = () => {
        clearTimeout(timer);
        mode = b.dataset.emptyMode;
        phase = "empty";
        render();
      }),
  );
  area.onclick = (e) => {
    if (!e.target.closest("[data-empty-action]")) return;
    if (mode !== "error") {
      phase = "data";
      render();
      const target = area.querySelector("ul");
      target.tabIndex = -1;
      target.focus();
      return;
    }
    phase = "loading";
    render();
    timer = setTimeout(() => {
      phase = fail ? "empty" : "data";
      render();
      const target = area.querySelector(phase === "data" ? "ul" : "button");
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    }, 450);
  };
  render();
}
function setupSorting(rows) {
  const select = document.querySelector("select"),
    list = document.querySelector(".advanced-sort-list"),
    status = document.querySelector(".advanced-status"),
    labels = {
      original: "기본순",
      low: "금액 낮은순",
      high: "금액 높은순",
      name: "이름순",
    };
  select.onchange = () => {
    list.innerHTML = sortRows(rows, select.value)
      .map(
        (r) =>
          `<li data-row="${r.id}"><span>${esc(r.name)}</span><strong>${r.cost.toLocaleString("ko-KR")}원</strong></li>`,
      )
      .join("");
    status.textContent =
      labels[select.value] + " · 같은 금액은 원래 순서를 유지해요.";
  };
}
function setupFiltering(rows) {
  const root = document.querySelector(".advanced-card"),
    wrapper = root.querySelector(".advanced-filter-select"),
    select = wrapper.querySelector(".select-trigger"),
    popup = wrapper.querySelector(".select-popup"),
    options = [...popup.querySelectorAll("[data-filter-option]")],
    check = root.querySelector("[type=checkbox]"),
    chips = root.querySelector(".advanced-filter-chips"),
    status = root.querySelector(".advanced-status");
  const kinds = [
    ["all", "전체 분류"],
    ["기획", "기획"],
    ["디자인", "디자인"],
    ["개발", "개발"],
  ];
  let content = root.querySelector(".advanced-simple-list"),
    kind = "all",
    mine = false,
    open = false,
    active = 0,
    typed = "",
    typedAt = 0;
  function place() {
    if (!open) return;
    const r = select.getBoundingClientRect(),
      below = innerHeight - r.bottom - 12,
      above = r.top - 12,
      flip = below < 126 && above > below;
    popup.classList.toggle("opens-up", flip);
    popup.style.maxHeight =
      Math.max(44, Math.min(184, flip ? above : below)) + "px";
  }
  function renderSelect() {
    select.querySelector("[data-filter-value]").textContent = kinds.find(
      ([value]) => value === kind,
    )[1];
    select.setAttribute("aria-expanded", String(open));
    select.classList.toggle("is-open", open);
    popup.hidden = !open;
    if (open) select.setAttribute("aria-activedescendant", options[active].id);
    else select.removeAttribute("aria-activedescendant");
    options.forEach((option, i) => {
      option.classList.toggle("active", i === active);
      option.setAttribute("aria-selected", String(i === active));
      option.querySelector("span").textContent =
        kinds[i][0] === kind ? "✓" : "";
    });
    place();
  }
  function render() {
    const shown = filterRows(rows, kind, mine);
    renderSelect();
    check.checked = mine;
    chips.innerHTML =
      (kind === "all"
        ? ""
        : `<button type="button" data-clear-kind>${kind} 해제</button>`) +
      (mine
        ? '<button type="button" data-clear-mine>내 담당 해제</button>'
        : "");
    const next = document.createElement(shown.length ? "ul" : "div");
    next.className = shown.length
      ? "advanced-simple-list"
      : "advanced-filter-empty";
    next.innerHTML = shown.length
      ? shown
          .map(
            (r) =>
              `<li data-row="${r.id}"><strong>${esc(r.name)}</strong><span>${r.kind} · ${r.owner}</span></li>`,
          )
          .join("")
      : '<p>조건에 맞는 항목이 없어요.</p><button type="button" data-clear-all>필터 초기화</button>';
    content.replaceWith(next);
    content = next;
    status.textContent = `${shown.length}개 결과 · 적용한 조건을 함께 표시해요.`;
  }
  function expand() {
    active = kinds.findIndex(([value]) => value === kind);
    open = true;
    renderSelect();
    options[active].scrollIntoView({ block: "nearest" });
  }
  function choose(index, focus = true) {
    kind = kinds[index][0];
    open = false;
    typed = "";
    render();
    if (focus) select.focus();
  }
  select.onclick = () => {
    if (open) {
      open = false;
      renderSelect();
    } else expand();
  };
  select.onkeydown = (e) => {
    if (e.isComposing || e.keyCode === 229 || e.ctrlKey || e.metaKey) return;
    if (e.key === "Tab") {
      if (open) choose(active, false);
      return;
    }
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        open = false;
        renderSelect();
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else expand();
      return;
    }
    if (
      ["ArrowDown", "ArrowUp", "Home", "End", "PageUp", "PageDown"].includes(
        e.key,
      )
    ) {
      e.preventDefault();
      active =
        e.key === "Home" || e.key === "PageUp"
          ? 0
          : e.key === "End" || e.key === "PageDown"
            ? kinds.length - 1
            : !open
              ? kinds.findIndex(([value]) => value === kind)
              : Math.max(
                  0,
                  Math.min(
                    kinds.length - 1,
                    active + (e.key === "ArrowDown" ? 1 : -1),
                  ),
                );
      open = true;
      renderSelect();
      options[active].scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key.length === 1 && !e.altKey) {
      e.preventDefault();
      const now = Date.now();
      typed = now - typedAt < 800 ? typed + e.key : e.key;
      typedAt = now;
      const prefix = [...typed].every((c) => c === typed[0]) ? typed[0] : typed;
      for (let step = 1; step <= kinds.length; step++) {
        const index = (active + step) % kinds.length;
        if (kinds[index][1].startsWith(prefix)) {
          active = index;
          open = true;
          renderSelect();
          options[active].scrollIntoView({ block: "nearest" });
          break;
        }
      }
    }
  };
  options.forEach((option, i) => {
    option.onpointermove = () => {
      active = i;
      renderSelect();
    };
    option.onmousedown = (e) => e.preventDefault();
    option.onclick = () => choose(i);
  });
  wrapper.onfocusout = (e) => {
    if (!wrapper.contains(e.relatedTarget)) {
      open = false;
      renderSelect();
    }
  };
  document.addEventListener("pointerdown", (e) => {
    if (!wrapper.contains(e.target)) {
      open = false;
      renderSelect();
    }
  });
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, true);
  check.onchange = () => {
    mine = check.checked;
    render();
  };
  root.onclick = (e) => {
    if (e.target.closest("[data-clear-kind]")) {
      kind = "all";
      render();
      select.focus();
    } else if (e.target.closest("[data-clear-mine]")) {
      mine = false;
      render();
      check.focus();
    } else if (e.target.closest("[data-clear-all]")) {
      kind = "all";
      mine = false;
      render();
      select.focus();
    }
  };
  renderSelect();
}

function setupLoad() {
  const root = document.querySelector(".advanced-card"),
    slot = root.querySelector(".advanced-reading-slot"),
    settings = root.querySelector(".advanced-load-settings"),
    controls = root.querySelector(".advanced-load-controls"),
    failure = root.querySelector("[type=checkbox]"),
    status = root.querySelector("[data-load-count]"),
    feedback = root.querySelector("[data-load-feedback]");
  const items = [
      "첫 화면 설계",
      "정보 구조",
      "입력과 검증",
      "빈 결과 안내",
      "모바일 배치",
      "모션 기준",
    ],
    bodies = [
      "처음 방문한 사람이 이 화면의 목적과 다음 행동을 찾을 수 있게 구성합니다. 제목과 주요 버튼을 먼저 정하고 필요한 정보를 읽는 순서대로 배치하세요.",
      "관련된 정보를 묶고 사용자가 찾는 이름으로 분류합니다. 같은 수준의 항목은 같은 구조로 표시하고 현재 위치와 이동 경로를 알려주세요.",
      "입력란에는 라벨과 조건을 제공하고 오류가 발생한 위치에 원인과 수정 방법을 보여줍니다. 저장 실패 시 작성한 값은 유지하세요.",
      "처음 사용해 자료가 없는 경우, 조건에 맞는 결과가 없는 경우, 조회에 실패한 경우를 구분합니다. 각각 만들기·필터 해제·다시 시도를 안내하세요.",
      "좁은 화면에서도 같은 내용을 자연스럽게 읽을 수 있게 재배치합니다. 긴 문구와 버튼이 잘리지 않는지 실제 사용 가능한 너비에서 확인하세요.",
      "움직임의 거리와 시간, 시작·완료 조건을 함께 정합니다. 모션은 상태 변화를 이해하도록 돕고 실제 저장이나 조회 완료와 혼동되지 않게 하세요.",
    ];
  const reader = document.createElement("div");
  reader.className = "advanced-reading-host";
  root.append(reader);
  let count = 2,
    pending = false,
    error = "",
    selected = -1,
    timer;
  function render() {
    const failed = error.startsWith("추가로");
    slot.innerHTML = `<ul class="advanced-simple-list advanced-load-list" aria-busy="${pending}">${items
      .slice(0, count)
      .map(
        (name, i) =>
          `<li><button type="button" data-load-index="${i}" aria-expanded="${selected === i}" aria-controls="reading-document">${name}</button></li>`,
      )
      .join("")}</ul>`;
    if (reader.dataset.reading !== String(selected)) {
      reader.innerHTML =
        selected >= 0
          ? `<article id="reading-document" class="advanced-reading-document"><span class="advanced-help">읽을거리 본문</span><h3 tabindex="-1">${items[selected]}</h3><p>${bodies[selected]}</p><button type="button" data-load-back>설명 닫기</button></article>`
          : "";
      reader.dataset.reading = String(selected);
    }
    failure.disabled = pending;
    controls.innerHTML =
      (count < items.length
        ? `<button type="button" data-load-more ${pending ? "disabled" : ""}>${pending ? "불러오는 중" : failed ? "다시 불러오기" : "더 보기"}</button>`
        : "") +
      (pending
        ? '<button type="button" data-load-cancel>불러오기 취소</button>'
        : "") +
      '<button type="button" data-load-reset>처음으로</button>';
    status.textContent = `${count} / 6개${count === 6 ? " · 모두 불러왔어요." : pending ? " · 불러오는 중" : ""}`;
    feedback.hidden = !error;
    feedback.className = failed ? "advanced-error" : "advanced-status";
    feedback.role = failed ? "alert" : "status";
    feedback.textContent = error;
  }
  root.onclick = (e) => {
    if (e.target.closest("[data-load-more]")) {
      if (pending) return;
      pending = true;
      error = "";
      render();
      root.querySelector("[data-load-cancel]")?.focus();
      timer = setTimeout(() => {
        const before = count;
        pending = false;
        if (failure.checked) {
          error =
            "추가로 불러오지 못했어요. 기존 항목은 유지됩니다. 실패 모의를 해제하고 다시 불러오세요.";
          render();
          if (!reader.contains(document.activeElement))
            root.querySelector("[data-load-more]")?.focus();
          return;
        }
        count = Math.min(items.length, count + 2);
        error = "";
        render();
        if (!reader.contains(document.activeElement))
          root.querySelector(`[data-load-index="${before}"]`)?.focus();
      }, 900);
    } else if (e.target.closest("[data-load-cancel]")) {
      if (!pending) return;
      clearTimeout(timer);
      pending = false;
      error = "불러오기를 취소했어요. 기존 항목은 유지됩니다.";
      render();
      root.querySelector("[data-load-more]")?.focus();
    } else if (e.target.closest("[data-load-reset]")) {
      clearTimeout(timer);
      pending = false;
      count = 2;
      error = "";
      selected = -1;
      render();
      root.querySelector("[data-load-reset]")?.focus();
    } else if (e.target.closest("[data-load-back]")) {
      const index = selected;
      selected = -1;
      render();
      root.querySelector(`[data-load-index="${index}"]`)?.focus();
    } else {
      const button = e.target.closest("[data-load-index]");
      if (button) {
        selected = Number(button.dataset.loadIndex);
        render();
        reader.querySelector("h3")?.focus({ preventScroll: true });
      }
    }
  };
  render();
}

function setupDrag() {
  const list = document.querySelector(".advanced-drag-list"),
    root = list.parentElement,
    status = document.querySelector(".advanced-status"),
    grip = list.querySelector(".advanced-grip").innerHTML;
  const original = [
    { id: "research", name: "자료 조사" },
    { id: "design", name: "화면 설계" },
    { id: "prototype", name: "프로토타입" },
  ];
  let order = [...original];
  function render() {
    list.innerHTML = order
      .map(
        (task, i) =>
          `<li data-drag-row="${task.id}"><span class="advanced-grip" aria-hidden="true">${grip}</span><strong>${task.name}</strong><div class="advanced-row-actions"><button type="button" data-move="-1" aria-label="${task.name} 위로 이동" ${i === 0 ? "disabled" : ""}>위로</button><button type="button" data-move="1" aria-label="${task.name} 아래로 이동" ${i === order.length - 1 ? "disabled" : ""}>아래로</button></div></li>`,
      )
      .join("");
  }
  function move(id, to) {
    const from = order.findIndex((r) => r.id === id);
    if (from < 0 || to < 0 || to >= order.length) return;
    const name = order[from].name;
    order = reorderItems(order, from, to);
    render();
    status.textContent = `${name} · ${to + 1}번째로 이동했어요.`;
    list
      .querySelector(`[data-drag-row="${id}"] button:not(:disabled)`)
      ?.focus();
  }
  root.onclick = (e) => {
    const button = e.target.closest("[data-move]");
    if (button) {
      const row = button.closest("[data-drag-row]"),
        i = order.findIndex((r) => r.id === row.dataset.dragRow);
      move(row.dataset.dragRow, i + Number(button.dataset.move));
    }
  };
  const controller = attachSortableDrag(
    root,
    move,
    (message) => (status.textContent = message),
  );
  document.querySelector("[data-drag-reset]").onclick = () => {
    controller.cancel();
    order = [...original];
    render();
    status.textContent = "원래 순서로 돌아왔어요.";
  };
}
function setupResponsive() {
  const root = document.querySelector(".advanced-card"),
    box = root.querySelector(".advanced-responsive-demo"),
    grid = root.querySelector(".advanced-responsive-grid"),
    status = root.querySelector(".advanced-status");
  function measure() {
    const width = Math.round(box.getBoundingClientRect().width);
    status.textContent = `실제 ${box.clientWidth - 24}px · ${getComputedStyle(grid).gridTemplateColumns.split(" ").length}열 배치`;
  }
  root.querySelectorAll("[data-layout]").forEach(
    (b) =>
      (b.onclick = () => {
        const narrow = b.dataset.layout === "narrow";
        box.style.width = narrow ? "260px" : "520px";
        box.classList.toggle("is-narrow", narrow);
        root
          .querySelectorAll("[data-layout]")
          .forEach((button) =>
            button.setAttribute("aria-pressed", String(button === b)),
          );
        measure();
      }),
  );
  new ResizeObserver(measure).observe(box);
  measure();
}
function setupSticky() {
  const box = document.querySelector(".advanced-sticky-viewport"),
    title = box.querySelector(".advanced-sticky-title"),
    check = document.querySelector("[type=checkbox]"),
    status = document.querySelector(".advanced-status");
  function update() {
    status.textContent = `${Math.round(box.scrollTop)}px 이동 · ${check.checked ? "제목 고정 중" : "일반 흐름"}`;
  }
  check.onchange = () => {
    title.classList.toggle("is-unpinned", !check.checked);
    update();
  };
  box.onscroll = update;
  document
    .querySelectorAll("[data-scroll]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          box.scrollTo({ top: b.dataset.scroll === "middle" ? 180 : 0 })),
    );
}
function setupEasing() {
  const root = document.querySelector(".advanced-card"),
    select = root.querySelector("select"),
    dots = [...root.querySelectorAll(".advanced-ease-track>i")],
    labels = [...root.querySelectorAll(".advanced-ease-label")],
    start = root.querySelector("[data-easing-start]"),
    reset = root.querySelector("[data-easing-reset]"),
    status = root.querySelector(".advanced-status");
  let frame = 0;
  function render(p) {
    [p, easingProgress(p, select.value)].forEach((value, i) => {
      dots[i].style.left = value * 100 + "%";
      dots[i].style.transform = `translateX(-${value * 100}%)`;
      labels[i].querySelector("span").textContent =
        Math.round(value * 100) + "%";
    });
    labels[1].querySelector("strong").textContent = select.value;
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    start.disabled = false;
    render(0);
    status.textContent = "같은 거리·1200ms에서 비교해 보세요.";
  }
  select.onchange = stop;
  reset.onclick = stop;
  start.onclick = () => {
    if (frame) return;
    const began = performance.now();
    start.disabled = true;
    render(0);
    status.textContent = "두 점 모두 1200ms 동안 이동해요.";
    const tick = (now) => {
      const p = Math.min(1, (now - began) / 1200);
      render(p);
      if (p === 1) {
        frame = 0;
        start.disabled = false;
        status.textContent = "같은 시간에 같은 종점에 도착했어요.";
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
}
const setups = {
  "tree-view": setupTree,
  carousel: setupCarousel,
  "data-table": setupTable,
  snackbar: setupSnackbar,
  "empty-state": setupEmpty,
  sorting: setupSorting,
  filtering: setupFiltering,
  "load-more": setupLoad,
  "drag-and-drop": setupDrag,
  "responsive-layout": setupResponsive,
  "sticky-header": setupSticky,
  easing: setupEasing,
};
export const advancedScript = Object.fromEntries(
  Object.entries(setups).map(([id, setup]) => {
    const helpers =
      id === "sorting"
        ? `const sortRows=${module.exports.sortRows.toString()};`
        : id === "filtering"
          ? `const filterRows=${module.exports.filterRows.toString()};`
          : id === "drag-and-drop"
            ? `const reorderItems=${module.exports.reorderItems.toString()};const dragInsertIndex=${module.exports.dragInsertIndex.toString()};const attachSortableDrag=${module.exports.attachSortableDrag.toString()};`
            : id === "easing"
              ? `const easingProgress=${module.exports.easingProgress.toString()};`
              : "";
    return [
      id,
      `(()=>{const esc=${escapeHTML.toString()};${helpers}(${setup.toString()})(${["data-table", "sorting", "filtering"].includes(id) ? JSON.stringify(dataRows) : ""});})();`,
    ];
  }),
);
