const sheetActionIcons = [
  '<svg class="sheet-action-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/></svg>',
  '<svg class="sheet-action-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m16 3 5 5-12 12H4v-5zM14 5l5 5"/></svg>',
  '<svg class="sheet-action-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 8h16v13H4zM3 3h18v5H3zM9 12h6"/></svg>',
];
import { advancedMarkup, advancedScript } from "./advanced-vanilla.mjs";
import { effectMarkup, effectScript } from "./effects-vanilla.mjs";
import { backgroundMarkup, backgroundScript } from "./backgrounds-vanilla.mjs";
import { patternMarkup, patternScript } from "./patterns-vanilla.mjs";
import { foundationMarkup, foundationScript } from "./foundations-vanilla.mjs";
import { essentialMarkup, essentialScript } from "./essentials-vanilla.mjs";
const base = (name, heading, body) =>
  `<div class="scene scene-${name}"><div class="demo-center"><span class="demo-eyebrow">INTERACTIVE EXAMPLE</span><h2>${heading}</h2>${body}</div></div>`;
export const markup = {
  modal:
    base(
      "modal",
      "나의 작업 공간",
      '<p id="saved">설정을 열고 배경과 포커스를 확인하세요.</p><button class="demo-primary" id="open">설정 열기</button>',
    ) +
    '<dialog class="demo-dialog" id="dialog" aria-labelledby="title"><button class="demo-close" data-close aria-label="모달 닫기"><svg class="demo-close-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></button><span class="demo-symbol">✦</span><h2 id="title">작업 공간 설정</h2><p>함께 일하는 공간에 이름을 지어주세요.</p><label class="demo-label">공간 이름<input id="name" value="나의 작업 공간" maxlength="30"></label><div class="demo-actions"><button data-close>취소</button><button id="save" class="demo-primary">변경 저장</button></div></dialog>',
  "bottom-sheet":
    base(
      "sheet",
      "이번 주 디자인 노트",
      '<p>노트를 어떻게 관리할까요?</p><button class="demo-primary" id="open">노트 메뉴 열기</button><p id="saved" role="status" class="demo-help">닫기 버튼 또는 핸들을 아래로 끌어보세요.</p>',
    ) +
    '<dialog class="demo-dialog demo-sheet" id="dialog" aria-labelledby="title"><div class="sheet-drag-area" id="handle"><i class="sheet-handle"></i></div><button class="demo-close" data-close aria-label="바텀시트 닫기"><svg class="demo-close-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></button><h2 id="title">노트 관리</h2><p>원하는 작업을 선택하세요.</p>' +
    ["공유하기", "이름 바꾸기", "보관하기"]
      .map(
        (s, i) =>
          `<button class="sheet-option" data-choice="${s}"><span class="sheet-option-icon">${sheetActionIcons[i]}</span><span><strong>${s}</strong><small>노트를 편리하게 관리하세요</small></span><span class="option-chevron" aria-hidden="true"><svg class="demo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg></span></button>`,
      )
      .join("") +
    "</dialog>",
  accordion:
    '<div class="scene scene-accordion"><div class="faq-wrap"><span class="demo-eyebrow">FREQUENT QUESTIONS</span><h2>자주 묻는 질문</h2><label class="demo-check"><input type="checkbox" id="multiple">여러 항목 동시에 열기</label><div class="faq-items">' +
    [
      [
        "어떤 방식으로 사용할 수 있나요?",
        "목록에서 모양을 확인하고 상세에서 직접 조작해 보세요.",
      ],
      [
        "코드는 자유롭게 사용할 수 있나요?",
        "예제 코드를 복사해 프로젝트에 맞게 바꿀 수 있어요.",
      ],
      [
        "모바일에서도 사용할 수 있나요?",
        "화면 크기와 입력 방식에 맞춰 확인해 주세요.",
      ],
    ]
      .map(
        ([q, a], i) =>
          `<section class="faq-item ${i === 0 ? "is-open" : ""}"><h3><button data-accordion="${i}" aria-expanded="${i === 0}" aria-controls="panel-${i}"><span class="faq-question">${q}</span><span class="faq-chevron" aria-hidden="true"><svg class="demo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></span></button></h3><div id="panel-${i}" class="faq-body" style="grid-template-rows:${i === 0 ? 1 : 0}fr" ${i === 0 ? "" : "inert"}><div><p>${a}</p></div></div></section>`,
      )
      .join("") +
    "</div></div></div>",
  skeleton:
    '<div class="scene scene-skeleton"><div class="skeleton-demo"><div class="loading-options"><label>결과<select id="result" aria-label="로딩 결과"><option value="success">성공</option><option value="empty">빈 결과</option><option value="error">오류</option></select></label><label>대기 시간<select id="delay" aria-label="대기 시간"><option value="800">0.8초</option><option value="1400" selected>1.4초</option><option value="3000">3초</option></select></label><button id="reload" class="demo-primary">다시 불러오기</button></div><div class="profile-card" id="profile" aria-busy="true"></div><p id="status" class="demo-help" role="status"></p></div></div>',
  combobox:
    '<div class="scene scene-combo"><div class="combo-demo" id="combo"><span class="demo-eyebrow">NEXT DESTINATION</span><h2>다음 여행은 어디로?</h2><p>도시를 입력하거나 목록에서 선택해 보세요.</p><label class="demo-label" for="city">여행할 도시</label><div class="combo-input"><input id="city" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="cities" placeholder="도시 이름을 입력하세요"><button id="expand" tabindex="-1" aria-label="도시 목록 열기"><svg class="demo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></button></div><div id="cities" role="listbox" aria-label="추천 도시" class="combo-list" hidden></div><p id="status" role="status" class="demo-help">방향키로 이동 · Enter 선택 · Esc 닫기</p></div></div>',
  "data-grid":
    '<div class="scene scene-grid"><div class="grid-demo"><div class="grid-heading"><span class="demo-eyebrow">INVENTORY</span><strong>작은 문구점</strong><span class="grid-count">4개 품목</span></div><div class="grid-scroll"><table role="grid" aria-label="문구 재고 편집"><thead><tr role="row"><th role="columnheader">품목</th><th role="columnheader">수량</th><th role="columnheader">가격</th></tr></thead><tbody>' +
    [
      ["데일리 노트", 2, "18,000"],
      ["위클리 플래너", 1, "24,000"],
      ["아이디어 카드", 3, "12,000"],
      ["미니 메모", 2, "6,000"],
    ]
      .map(
        (row, r) =>
          `<tr role="row">${row.map((v, c) => `<td role="gridcell" data-r="${r}" data-c="${c}" aria-readonly="${c !== 1}" aria-selected="${r === 0 && c === 1}" tabindex="${r === 0 && c === 1 ? 0 : -1}" class="${r === 0 && c === 1 ? "selected" : ""}">${v}</td>`).join("")}</tr>`,
      )
      .join("") +
    '</tbody></table></div><p class="demo-help" role="status" id="status">수량 셀을 두 번 누르거나 Enter로 편집하세요.</p><span class="demo-keyboard-hint">방향키 이동 · Enter/F2 편집 · Enter 확정 · Esc 취소</span></div></div>',
};
for (const id of ["modal", "bottom-sheet"])
  markup[id] =
    markup[id].replace("</div></div><dialog", "</div><dialog") + "</div>";
function setupDialog(kind) {
  const dialog = document.querySelector("#dialog"),
    reduced =
      window.__DEMO__?.reduced ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
  function close() {
    if (!dialog.open) return;
    if (reduced) {
      dialog.close();
      return;
    }
    dialog
      .animate(
        kind === "sheet"
          ? [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }]
          : [{ opacity: 1 }, { opacity: 0 }],
        { duration: kind === "sheet" ? 220 : 180, easing: "ease-in" },
      )
      .finished.then(() => dialog.close())
      .catch(() => {});
  }
  document.querySelector("#open").onclick = () => {
    if (kind === "modal")
      document.querySelector("#name").value =
        document.querySelector(".demo-center h2").textContent;
    dialog.showModal();
    if (!reduced)
      dialog.animate(
        kind === "sheet"
          ? [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }]
          : [
              { opacity: 0, transform: "translateY(8px) scale(.98)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
        {
          duration: kind === "sheet" ? 320 : 220,
          easing: "cubic-bezier(.2,0,0,1)",
        },
      );
  };
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  dialog.querySelectorAll("[data-close]").forEach((b) => (b.onclick = close));
  if (kind === "modal")
    document.querySelector("#save").onclick = () => {
      document.querySelector(".demo-center h2").textContent =
        document.querySelector("#name").value;
      document.querySelector("#saved").textContent = "변경 사항을 저장했어요.";
      close();
    };
  else {
    dialog.querySelectorAll("[data-choice]").forEach(
      (b) =>
        (b.onclick = () => {
          document.querySelector("#saved").textContent =
            b.dataset.choice + " 선택 완료";
          close();
        }),
    );
    const handle = document.querySelector("#handle");
    let start = null;
    handle.onpointerdown = (e) => {
      start = e.clientY;
      handle.setPointerCapture(e.pointerId);
    };
    handle.onpointermove = (e) => {
      if (start !== null)
        dialog.style.transform = `translateY(${Math.max(0, e.clientY - start)}px)`;
    };
    handle.onpointerup = (e) => {
      if (start !== null && e.clientY - start > dialog.offsetHeight * 0.25)
        close();
      start = null;
      dialog.style.transform = "";
    };
    handle.onpointercancel = () => {
      start = null;
      dialog.style.transform = "";
    };
  }
}
function setupAccordion() {
  const buttons = [...document.querySelectorAll("[data-accordion]")];
  function set(b, value) {
    b.setAttribute("aria-expanded", String(value));
    b.closest("section").classList.toggle("is-open", value);
    const panel = document.getElementById(b.getAttribute("aria-controls"));
    panel.style.gridTemplateRows = value ? "1fr" : "0fr";
    panel.inert = !value;
  }
  buttons.forEach(
    (b) =>
      (b.onclick = () => {
        const next = b.getAttribute("aria-expanded") !== "true";
        if (!document.querySelector("#multiple").checked)
          buttons.forEach((other) => set(other, false));
        set(b, next);
      }),
  );
  document.querySelector("#multiple").onchange = () =>
    buttons.forEach((b) => set(b, false));
}
function setupSkeleton() {
  const card = document.querySelector("#profile"),
    status = document.querySelector("#status");
  let run = 0,
    frame = 0;
  const placeholder =
    '<div class="skeleton-content"><div class="profile-heading"><span class="skeleton-shape skeleton-avatar"></span><div><span class="skeleton-shape skeleton-title"></span><span class="skeleton-shape skeleton-subtitle"></span></div></div><span class="skeleton-shape skeleton-cover"></span><div class="skeleton-lines"><i class="skeleton-shape"></i><i class="skeleton-shape"></i></div><span class="shimmer"></span></div>';
  function reload() {
    cancelAnimationFrame(frame);
    const generation = ++run;
    let elapsed = 0,
      last = null;
    const delay = Number(document.querySelector("#delay").value),
      result = document.querySelector("#result").value;
    card.setAttribute("aria-busy", "true");
    card.innerHTML = placeholder;
    if (
      window.__DEMO__?.reduced ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      card.querySelector(".shimmer").remove();
    status.textContent = "샘플 데이터를 불러오는 중이에요.";
    function tick(now) {
      if (generation !== run) return;
      if (!document.hidden) {
        if (last !== null) elapsed += now - last;
      }
      last = document.hidden ? null : now;
      if (elapsed < delay) {
        frame = requestAnimationFrame(tick);
        return;
      }
      card.setAttribute("aria-busy", "false");
      if (result === "success") {
        card.innerHTML =
          '<div class="loaded-profile"><div class="profile-heading"><span class="profile-avatar">J</span><div><strong>지수의 디자인 기록</strong><span>새로운 아이디어를 기록해요</span></div></div><div class="profile-cover"><span>Small ideas,<br>better interfaces.</span><i></i><b></b></div><div class="profile-bottom"><strong>매일 조금씩, 더 나은 화면</strong><span>방금 업데이트됨</span></div></div>';
        status.textContent = "콘텐츠를 불러왔어요.";
      } else {
        card.innerHTML =
          '<div class="loading-result"><strong>' +
          (result === "error" ? "불러오지 못했어요" : "아직 기록이 없어요") +
          "</strong><p>" +
          (result === "error"
            ? "연결을 확인하고 다시 시도해 주세요."
            : "첫 기록을 추가하면 여기에 표시돼요.") +
          '</p><button id="result-action">' +
          (result === "error" ? "다시 시도" : "첫 기록 추가") +
          "</button></div>";
        card.querySelector("#result-action").onclick = () => {
          if (result === "empty")
            document.querySelector("#result").value = "success";
          reload();
        };
        status.textContent =
          result === "error"
            ? "모의 오류 상태입니다."
            : "데이터가 없는 상태입니다.";
      }
    }
    frame = requestAnimationFrame(tick);
  }
  document.querySelector("#reload").onclick = reload;
  reload();
}
function setupCombo() {
  const input = document.querySelector("#city"),
    list = document.querySelector("#cities"),
    wrap = document.querySelector("#combo");
  const cities = ["서울", "서귀포", "서산", "부산", "제주"];
  let results = cities,
    active = 0,
    composing = false;
  function hide() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }
  function choose(city) {
    input.value = city;
    document.querySelector("#status").textContent = city + " 선택 완료";
    hide();
    input.focus();
    hide();
  }
  function render() {
    results = cities.filter((c) => c.includes(input.value));
    active = Math.max(0, Math.min(active, results.length - 1));
    list.replaceChildren();
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    results.forEach((city, i) => {
      const option = document.createElement("div");
      option.id = "city-" + i;
      option.role = "option";
      option.setAttribute("aria-selected", String(i === active));
      option.className = i === active ? "active" : "";
      option.textContent = city;
      option.onmousedown = (e) => e.preventDefault();
      option.onclick = () => choose(city);
      list.append(option);
    });
    if (results.length)
      input.setAttribute("aria-activedescendant", "city-" + active);
    else {
      input.removeAttribute("aria-activedescendant");
      list.textContent = "일치하는 도시가 없어요.";
    }
  }
  input.oninput = () => {
    active = 0;
    document.querySelector("#status").textContent =
      "방향키로 이동 · Enter 선택 · Esc 닫기";
    render();
  };
  input.oncompositionstart = () => (composing = true);
  input.oncompositionend = () => {
    composing = false;
    active = 0;
    render();
  };
  input.onfocus = render;
  document.querySelector("#expand").onmousedown = (e) => e.preventDefault();
  document.querySelector("#expand").onclick = () => {
    if (list.hidden) {
      input.focus();
      render();
    } else hide();
  };
  input.onkeydown = (e) => {
    if (composing || e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = list.hidden
        ? e.key === "ArrowDown"
          ? 0
          : results.length - 1
        : active + (e.key === "ArrowDown" ? 1 : -1);
      render();
    }
    if (e.key === "Enter" && !list.hidden) {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      hide();
    }
  };
  wrap.onfocusout = (e) => {
    if (!wrap.contains(e.relatedTarget)) hide();
  };
  document.addEventListener("pointerdown", (e) => {
    if (!wrap.contains(e.target)) hide();
  });
}
function setupGrid() {
  const cells = [...document.querySelectorAll("[role=gridcell]")];
  let editing = null;
  function focus(r, c) {
    const cell = cells.find(
      (el) => Number(el.dataset.r) === r && Number(el.dataset.c) === c,
    );
    if (!cell) return;
    cells.forEach((el) => {
      el.tabIndex = el === cell ? 0 : -1;
      el.classList.toggle("selected", el === cell);
      el.setAttribute("aria-selected", String(el === cell));
    });
    cell.focus();
  }
  function edit(cell) {
    if (editing || cell.dataset.c !== "1") return;
    const previous = cell.textContent;
    const input = document.createElement("input");
    input.setAttribute("aria-label", "수량");
    input.setAttribute("aria-describedby", "status");
    input.inputMode = "numeric";
    input.value = previous;
    cell.replaceChildren(input);
    cell.classList.add("editing");
    editing = cell;
    input.focus();
    function finish(save) {
      if (
        save &&
        (!/^\d+$/.test(input.value) ||
          Number(input.value) < 1 ||
          Number(input.value) > 99)
      ) {
        input.setAttribute("aria-invalid", "true");
        document.querySelector("#status").textContent =
          "수량은 1~99의 정수로 입력해 주세요.";
        return false;
      }
      cell.textContent = save ? String(Number(input.value)) : previous;
      cell.classList.remove("editing");
      editing = null;
      cell.focus();
      document.querySelector("#status").textContent = save
        ? "수량을 변경했어요."
        : "변경을 취소했어요.";
      return true;
    }
    input.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        finish(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        finish(false);
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (finish(true)) focus(Number(cell.dataset.r), e.shiftKey ? 0 : 2);
      }
    };
  }
  cells.forEach((cell) => {
    cell.onclick = () => {
      if (!editing) focus(Number(cell.dataset.r), Number(cell.dataset.c));
    };
    cell.ondblclick = () => edit(cell);
    cell.onkeydown = (e) => {
      if (editing) return;
      let r = Number(cell.dataset.r),
        c = Number(cell.dataset.c);
      if (e.key === "ArrowDown") r = Math.min(3, r + 1);
      else if (e.key === "ArrowUp") r = Math.max(0, r - 1);
      else if (e.key === "ArrowRight") c = Math.min(2, c + 1);
      else if (e.key === "ArrowLeft") c = Math.max(0, c - 1);
      else if (e.key === "Home") c = 0;
      else if (e.key === "End") c = 2;
      else if (e.key === "Enter" || e.key === "F2") {
        e.preventDefault();
        edit(cell);
        return;
      } else return;
      e.preventDefault();
      focus(r, c);
    };
  });
}
export const script = {
  modal: `(${setupDialog.toString()})('modal');`,
  "bottom-sheet": `(${setupDialog.toString()})('sheet');`,
  accordion: `(${setupAccordion.toString()})();`,
  skeleton: `(${setupSkeleton.toString()})();`,
  combobox: `(${setupCombo.toString()})();`,
  "data-grid": `(${setupGrid.toString()})();`,
};
Object.assign(
  markup,
  essentialMarkup,
  foundationMarkup,
  patternMarkup,
  advancedMarkup,
  effectMarkup,
  backgroundMarkup,
);
Object.assign(
  script,
  essentialScript,
  foundationScript,
  patternScript,
  advancedScript,
  effectScript,
  backgroundScript,
);
export function vanillaDocument(id, css, reduced = false) {
  return `<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>UI Notes 실행 예제</title><style>body{margin:0}button,input,select{font-family:inherit}[hidden]{display:none!important}${css}</style></head><body>${markup[id]}<script>window.__DEMO__={reduced:${reduced}};if(window.__DEMO__.reduced)document.querySelector('.scene').classList.add('is-reduced');${script[id]}<\/script></body></html>`;
}
