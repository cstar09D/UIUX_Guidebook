const wrap = (name, eyebrow, title, description, body) =>
  `<div class="scene essential-scene scene-${name}"><div class="essential-card"><span class="essential-eyebrow">${eyebrow}</span><h2>${title}</h2><p>${description}</p>${body}</div></div>`;
export const essentialMarkup = {
  checkbox: wrap(
    "checkbox",
    "NOTIFICATIONS",
    "받고 싶은 소식",
    "필요한 항목을 여러 개 선택하세요.",
    '<fieldset class="choice-group"><legend class="demo-sr-only">받을 소식 선택</legend><label class="choice-row choice-all"><input id="check-all" type="checkbox"><span>모두 선택<small>세 가지 소식을 함께 선택해요</small></span></label>' +
      ["댓글 소식", "프로젝트 소식", "업데이트 소식"]
        .map(
          (name) =>
            `<label class="choice-row"><input type="checkbox" data-choice value="${name}"><span>${name}</span></label>`,
        )
        .join("") +
      '</fieldset><div class="essential-result" id="choice-status" role="status">선택한 소식이 없어요.</div>',
  ),
  "radio-group": wrap(
    "radio",
    "DELIVERY",
    "배송 방법 선택",
    "두 방법 중 한 가지만 선택하세요.",
    '<fieldset class="choice-group" aria-describedby="radio-status"><legend class="demo-sr-only">배송 방법</legend>' +
      [
        ["standard", "일반 배송", "2~3일 내 도착 · 무료"],
        ["express", "빠른 배송", "다음 날 도착 · 3,000원"],
      ]
        .map(
          ([id, name, help]) =>
            `<label class="choice-row"><input name="delivery" type="radio" value="${id}" required><span>${name}<small>${help}</small></span></label>`,
        )
        .join("") +
      '</fieldset><div class="essential-actions"><button id="radio-reset">선택 초기화</button><button id="radio-confirm" class="demo-primary">선택 확인</button></div><p id="radio-status" class="essential-caption" role="status">방향키 또는 Space로 선택할 수 있어요.</p>',
  ),
  switch: wrap(
    "switch",
    "PREFERENCES",
    "이메일 알림 설정",
    "설정은 전환한 뒤 모의 저장됩니다.",
    '<div class="switch-row"><div><label for="notification-switch">이메일 알림</label><span>새 댓글과 프로젝트 소식을 받아요.</span></div><input id="notification-switch" class="essential-switch" type="checkbox" role="switch" aria-describedby="switch-status"></div><div class="essential-result" id="switch-result">꺼짐</div><label class="essential-check"><input type="checkbox" id="switch-failure">저장 실패 모의</label><p id="switch-status" class="essential-caption" role="status">알림이 꺼져 있어요.</p>',
  ),
  select: wrap(
    "select",
    "DIGEST",
    "요약 주기 설정",
    "정해진 목록에서 한 값을 선택해요.",
    '<span class="essential-label" id="digest-label">요약 주기</span><div class="select-illustration" id="digest-picker"><div id="digest-select" class="select-preview-value select-trigger" role="combobox" tabindex="0" aria-labelledby="digest-label" aria-haspopup="listbox" aria-expanded="false" aria-controls="digest-options" aria-required="true" aria-invalid="false" aria-describedby="select-status"><span id="digest-text">주기를 선택하세요</span><span class="select-chevron" aria-hidden="true"><svg class="demo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></span></div><div id="digest-options" class="select-preview-options select-popup" role="listbox" aria-labelledby="digest-label" hidden>' +
      [
        ["weekly", "매주"],
        ["monthly", "매월"],
        ["quarterly", "분기별"],
      ]
        .map(
          ([value, title], index) =>
            `<div id="digest-option-${index}" role="option" data-value="${value}" aria-selected="false">${title}<span aria-hidden="true"></span></div>`,
        )
        .join("") +
      '</div><input type="hidden" name="digest" id="digest-value" value=""></div><div class="essential-actions"><button id="select-reset">초기화</button><button id="select-apply" class="demo-primary">설정 적용</button></div><p id="select-status" class="essential-caption" role="status">선택 후 설정 적용을 눌러주세요.</p>',
  ),
  tabs: wrap(
    "tabs",
    "PROJECT SPACE",
    "우리 팀 프로젝트",
    "",
    '<label class="essential-check"><input type="checkbox" id="manual-tabs">수동 활성화 (Enter로 전환)</label><div class="essential-tablist" role="tablist" aria-label="프로젝트 정보">' +
      ["개요", "활동", "멤버"]
        .map(
          (name, i) =>
            `<button type="button" id="info-tab-${i}" data-tab="${i}" role="tab" aria-controls="info-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${name}</button>`,
        )
        .join("") +
      '<span class="essential-tab-indicator"></span></div>' +
      [
        [
          "▤",
          "함께 만드는 디자인 노트",
          "이번 주 프로젝트의 목표와 일정을 한눈에 확인해요.",
          ["UI 패턴 정리", "금요일까지 첫 시안 공유"],
        ],
        [
          "◷",
          "최근 활동",
          "팀이 남긴 변경 기록을 시간순으로 살펴봐요.",
          ["지수 · 새 메모 추가", "민준 · 시안 검토 완료"],
        ],
        [
          "◉",
          "함께하는 멤버",
          "프로젝트에 참여 중인 팀원을 확인해요.",
          ["지수 · 디자이너", "민준 · 프론트엔드"],
        ],
      ]
        .map(
          ([icon, title, body, items], i) =>
            `<div role="tabpanel" tabindex="0" id="info-panel-${i}" aria-labelledby="info-tab-${i}" class="essential-tabpanel" ${i ? "hidden" : ""}><span class="essential-panel-icon">${icon}</span><strong>${title}</strong><p>${body}</p><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></div>`,
        )
        .join("") +
      '<p class="essential-caption" id="tabs-hint">좌우 방향키로 탐색 · 포커스와 함께 패널 전환</p>',
  ),
  tooltip: wrap(
    "tooltip",
    "QUICK HELP",
    "나중에 다시 볼 노트",
    "보관 버튼에 마우스를 올리거나 키보드로 포커스를 옮겨보세요.",
    '<div class="tooltip-anchor" id="tooltip-anchor"><button class="tooltip-trigger" id="archive-note" aria-describedby="archive-tip"><svg class="sheet-action-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 8h16v13H4zM3 3h18v5H3zM9 12h6"/></svg><span>보관하기</span></button><span id="archive-tip" role="tooltip" class="essential-tooltip" hidden>노트를 목록에서 보관함으로 옮겨요.</span></div><button class="essential-help-button" id="tooltip-help" aria-expanded="false" aria-controls="inline-tooltip-help">도움말 보기</button><p id="inline-tooltip-help" class="essential-inline-help" hidden>보관한 노트는 삭제되지 않으며 보관함에서 다시 꺼낼 수 있어요.</p><p id="tooltip-status" class="essential-caption" role="status">터치에서는 도움말 보기를 이용하세요.</p>',
  ).replace(
    'class="essential-card"',
    'class="essential-card tooltip-demo-card"',
  ),
  popover:
    '<div class="scene essential-scene scene-popover"><div class="essential-card"><div class="popover-toolbar"><div><span class="essential-eyebrow">MY NOTES</span><strong>프로젝트 노트</strong></div><button id="view-trigger" popovertarget="view-popover" aria-expanded="false" aria-controls="view-popover">보기 설정</button></div><div class="popover-list" id="view-list">' +
    ["리서치 메모", "이번 주 할 일", "아이디어 모음"]
      .map((item) => `<div><span>▤</span>${item}</div>`)
      .join("") +
    '</div><div id="view-popover" popover="auto" role="dialog" aria-labelledby="view-title" class="essential-popover"><h2 id="view-title">보기 설정</h2><p>목록의 간격을 선택하세요.</p><fieldset class="choice-group"><legend class="demo-sr-only">표시 밀도</legend><label class="choice-row"><input type="radio" name="view-density" value="comfortable" checked><span>여유롭게</span></label><label class="choice-row"><input type="radio" name="view-density" value="compact"><span>촘촘하게</span></label></fieldset><div class="essential-actions"><button id="popover-close">닫기</button><button id="popover-apply" class="demo-primary">적용</button></div></div><p class="essential-caption" id="popover-status" role="status">기본 보기 · 배경을 누르거나 Esc로 닫아보세요.</p></div></div>',
  toast: wrap(
    "toast",
    "SAVE & FEEDBACK",
    "디자인 노트",
    "",
    '<div class="toast-note-preview"><i></i><i></i><i></i><span>새로운 아이디어를 기록했어요.</span></div><div class="essential-actions"><button id="notify-save" class="demo-primary">저장 완료 알림</button><button id="notify-fail">저장 실패 보기</button></div><p class="essential-caption">알림은 5초 뒤 사라져요. 마우스·포커스가 알림 안에 있으면 시간을 멈춥니다.</p><div id="notify-error" class="essential-inline-error" role="alert" hidden><strong>노트를 저장하지 못했어요.</strong><p>작성한 내용은 남아 있어요. 다시 저장해 주세요.</p><button id="notify-retry">다시 저장</button></div><button id="notify-history-toggle" class="essential-help-button" aria-expanded="false" aria-controls="notify-history">최근 알림 보기</button><ul id="notify-history" class="essential-history" hidden><li>아직 알림이 없어요.</li></ul>',
  ).replace(
    "</div></div>",
    '</div><div class="essential-toast-slot" id="toast-slot"><div class="demo-sr-only" id="toast-announcer" role="status" aria-live="polite" aria-atomic="true"></div><div class="essential-toast" id="toast-notice" hidden><span class="toast-check">✓</span><div id="toast-message" aria-hidden="true"></div><button id="toast-close" aria-label="알림 닫기"><svg class="demo-close-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></div></div>',
  ),
};
function setupCheckbox() {
  const parent = document.querySelector("#check-all"),
    items = [...document.querySelectorAll("[data-choice]")],
    status = document.querySelector("#choice-status");
  function render() {
    const count = items.filter((item) => item.checked).length;
    parent.checked = count === items.length;
    parent.indeterminate = count > 0 && count < items.length;
    status.textContent = count
      ? `${count}개 소식을 선택했어요.`
      : "선택한 소식이 없어요.";
  }
  parent.onchange = () => {
    items.forEach((item) => (item.checked = parent.checked));
    render();
  };
  items.forEach((item) => (item.onchange = render));
  render();
}
function setupRadio() {
  const choices = [...document.querySelectorAll("[name=delivery]")],
    status = document.querySelector("#radio-status");
  function message(text, error = false) {
    status.className = error ? "essential-error" : "essential-caption";
    status.role = error ? "alert" : "status";
    status.textContent = text;
    choices.forEach((item) =>
      item.closest("label").classList.toggle("choice-selected", item.checked),
    );
  }
  choices.forEach(
    (item) => (item.onchange = () => message("선택 확인을 눌러 적용하세요.")),
  );
  document.querySelector("#radio-reset").onclick = () => {
    choices.forEach((item) => (item.checked = false));
    message("선택을 초기화했어요.");
  };
  document.querySelector("#radio-confirm").onclick = () => {
    const chosen = choices.find((item) => item.checked);
    message(
      chosen
        ? `${chosen.value === "standard" ? "일반" : "빠른"} 배송을 선택했어요.`
        : "배송 방법을 하나 선택해 주세요.",
      !chosen,
    );
  };
}
function setupSwitch() {
  const control = document.querySelector("#notification-switch"),
    failure = document.querySelector("#switch-failure"),
    status = document.querySelector("#switch-status"),
    result = document.querySelector("#switch-result");
  let previous = false,
    timer;
  control.onchange = () => {
    const requested = control.checked,
      failed = failure.checked;
    control.disabled = true;
    failure.disabled = true;
    result.textContent = "저장 중…";
    status.className = "essential-caption";
    status.textContent = "설정을 저장하는 중이에요.";
    clearTimeout(timer);
    timer = setTimeout(() => {
      control.checked = failed ? previous : requested;
      control.disabled = false;
      failure.disabled = false;
      status.textContent = failed
        ? "저장하지 못했어요. 이전 설정으로 되돌렸습니다. 다시 켜거나 꺼보세요."
        : requested
          ? "이메일 알림을 켰어요."
          : "이메일 알림을 껐어요.";
      status.className = failed ? "essential-error" : "essential-caption";
      result.textContent = control.checked ? "켜짐" : "꺼짐";
      previous = control.checked;
    }, 700);
  };
}
function setupSelect() {
  const trigger = document.querySelector("#digest-select"),
    wrapper = document.querySelector("#digest-picker"),
    list = document.querySelector("#digest-options"),
    field = document.querySelector("#digest-value"),
    text = document.querySelector("#digest-text"),
    status = document.querySelector("#select-status"),
    options = [...list.querySelectorAll('[role="option"]')];
  let open = false,
    active = 0,
    applied = "",
    typed = "",
    typedAt = 0;
  const label = (value) =>
    options
      .find((option) => option.dataset.value === value)
      ?.childNodes[0].textContent.trim() || "";
  function message(error = false) {
    trigger.setAttribute("aria-invalid", String(error));
    status.className = error ? "essential-error" : "essential-caption";
    status.role = error ? "alert" : "status";
    status.textContent = error
      ? "요약 주기를 선택한 뒤 적용해 주세요."
      : applied
        ? field.value !== applied
          ? `현재 적용: ${label(applied)}. 새 선택은 설정 적용을 눌러 반영하세요.`
          : `${label(applied)} 요약으로 적용했어요.`
        : "선택 후 설정 적용을 눌러주세요.";
  }
  function place() {
    if (!open) return;
    const rect = trigger.getBoundingClientRect(),
      below = innerHeight - rect.bottom - 12,
      above = rect.top - 12;
    const flip = below < 126 && above > below;
    list.classList.toggle("opens-up", flip);
    list.style.maxHeight =
      Math.max(44, Math.min(168, flip ? above : below)) + "px";
  }
  function render() {
    list.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    trigger.classList.toggle("is-open", open);
    if (open) trigger.setAttribute("aria-activedescendant", options[active].id);
    else trigger.removeAttribute("aria-activedescendant");
    text.textContent = label(field.value) || "주기를 선택하세요";
    options.forEach((option, index) => {
      option.classList.toggle("active", open && index === active);
      option.setAttribute("aria-selected", String(open && index === active));
      option.querySelector("span").textContent =
        field.value === option.dataset.value ? "✓" : "";
    });
    place();
    if (open) options[active].scrollIntoView({ block: "nearest" });
  }
  function close() {
    open = false;
    render();
  }
  function expand() {
    active = Math.max(
      0,
      options.findIndex((option) => option.dataset.value === field.value),
    );
    open = true;
    render();
  }
  function choose(index, focus = true) {
    field.value = options[index].dataset.value;
    typed = "";
    close();
    message();
    if (focus) trigger.focus();
  }
  trigger.onclick = () => {
    if (open) close();
    else expand();
  };
  trigger.onkeydown = (event) => {
    if (
      event.isComposing ||
      event.keyCode === 229 ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key === "Tab") {
      if (open) choose(active, false);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else expand();
      return;
    }
    if (
      ["ArrowDown", "ArrowUp", "Home", "End", "PageUp", "PageDown"].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      const current = Math.max(
        0,
        options.findIndex((option) => option.dataset.value === field.value),
      );
      active =
        event.key === "Home" || event.key === "PageUp"
          ? 0
          : event.key === "End" || event.key === "PageDown"
            ? options.length - 1
            : !open
              ? current
              : Math.max(
                  0,
                  Math.min(
                    options.length - 1,
                    active + (event.key === "ArrowDown" ? 1 : -1),
                  ),
                );
      open = true;
      render();
      return;
    }
    if (event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      typed = now - typedAt < 800 ? typed + event.key : event.key;
      typedAt = now;
      const prefix = [...typed].every((char) => char === typed[0])
        ? typed[0]
        : typed;
      for (let step = 1; step <= options.length; step++) {
        const index = (active + step) % options.length;
        if (
          options[index].childNodes[0].textContent.trim().startsWith(prefix)
        ) {
          active = index;
          open = true;
          render();
          break;
        }
      }
    }
  };
  options.forEach((option, index) => {
    option.onpointermove = () => {
      active = index;
      render();
    };
    option.onmousedown = (event) => event.preventDefault();
    option.onclick = () => choose(index);
  });
  wrapper.onfocusout = (event) => {
    if (!wrapper.contains(event.relatedTarget)) close();
  };
  document.addEventListener("pointerdown", (event) => {
    if (!wrapper.contains(event.target)) close();
  });
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, true);
  document.querySelector("#select-reset").onclick = () => {
    field.value = "";
    applied = "";
    close();
    message();
    trigger.focus();
  };
  document.querySelector("#select-apply").onclick = () => {
    close();
    if (!field.value) {
      message(true);
      trigger.focus();
      return;
    }
    applied = field.value;
    message();
  };
  render();
}

function setupTabs() {
  const tabs = [...document.querySelectorAll("[data-tab]")],
    panels = [...document.querySelectorAll(".essential-tabpanel")],
    manual = document.querySelector("#manual-tabs");
  let active = 0;
  function activate(index) {
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    document.querySelector(".essential-tab-indicator").style.transform =
      `translateX(${index * 100}%)`;
  }
  tabs.forEach((tab, index) => {
    tab.onclick = () => activate(index);
    tab.onkeydown = (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      if (!manual.checked) activate(next);
    };
  });
  manual.onchange = () =>
    (document.querySelector("#tabs-hint").textContent = manual.checked
      ? "좌우 방향키로 탐색 · Enter/Space로 활성화"
      : "좌우 방향키로 탐색 · 포커스와 함께 패널 전환");
  activate(active);
}
function setupTooltip() {
  const anchor = document.querySelector("#tooltip-anchor"),
    trigger = document.querySelector("#archive-note"),
    tip = document.querySelector("#archive-tip"),
    help = document.querySelector("#tooltip-help"),
    inline = document.querySelector("#inline-tooltip-help"),
    status = document.querySelector("#tooltip-status");
  let hover = false,
    focus = false,
    dismissed = false;
  const render = () => (tip.hidden = !(hover || focus) || dismissed);
  anchor.onmouseenter = () => {
    hover = true;
    dismissed = false;
    render();
  };
  anchor.onmouseleave = () => {
    hover = false;
    render();
  };
  trigger.onfocus = () => {
    focus = true;
    dismissed = false;
    render();
  };
  trigger.onblur = () => {
    focus = false;
    render();
  };
  trigger.onkeydown = (event) => {
    if (event.key === "Escape" && !tip.hidden) {
      event.preventDefault();
      event.stopPropagation();
      dismissed = true;
      render();
    }
  };
  trigger.onclick = () => (status.textContent = "노트를 보관했어요.");
  help.onclick = () => {
    inline.hidden = !inline.hidden;
    help.setAttribute("aria-expanded", String(!inline.hidden));
    help.textContent = inline.hidden ? "도움말 보기" : "도움말 접기";
  };
}
function setupPopover() {
  let applied = "comfortable";
  const trigger = document.querySelector("#view-trigger"),
    layer = document.querySelector("#view-popover");
  function place() {
    const a = trigger.getBoundingClientRect(),
      b = layer.getBoundingClientRect();
    layer.style.left = `${Math.max(12, Math.min(a.right - b.width, innerWidth - b.width - 12))}px`;
    layer.style.top = `${a.bottom + 8 + b.height <= innerHeight - 12 ? a.bottom + 8 : Math.max(12, a.top - b.height - 8)}px`;
  }
  layer.addEventListener("beforetoggle", () => {
    if (!layer.matches(":popover-open"))
      document
        .querySelectorAll("[name=view-density]")
        .forEach((input) => (input.checked = input.value === applied));
  });
  layer.addEventListener("toggle", () => {
    const open = layer.matches(":popover-open");
    trigger.setAttribute("aria-expanded", String(open));
    if (open) place();
  });
  window.addEventListener("resize", () => {
    if (layer.matches(":popover-open")) place();
  });
  function close() {
    layer.hidePopover();
    trigger.focus();
  }
  document.querySelector("#popover-close").onclick = close;
  document.querySelector("#popover-apply").onclick = () => {
    applied = document.querySelector("[name=view-density]:checked").value;
    const compact = applied === "compact";
    document.querySelector("#view-list").classList.toggle("compact", compact);
    document.querySelector("#popover-status").textContent =
      (compact ? "촘촘한 보기" : "여유로운 보기") +
      " · 배경을 누르거나 Esc로 닫아보세요.";
    close();
  };
}
function setupToast() {
  const notice = document.querySelector("#toast-notice"),
    message = document.querySelector("#toast-message"),
    announcer = document.querySelector("#toast-announcer"),
    trigger = document.querySelector("#notify-save"),
    error = document.querySelector("#notify-error"),
    history = document.querySelector("#notify-history"),
    slot = document.querySelector("#toast-slot");
  let count = 0,
    timer = 0,
    remaining = 5000,
    started = 0,
    running = false,
    hover = false,
    focus = false;
  function stop() {
    clearTimeout(timer);
    if (running)
      remaining = Math.max(0, remaining - (performance.now() - started));
    running = false;
  }
  function start() {
    stop();
    if (notice.hidden || hover || focus || document.hidden) return;
    started = performance.now();
    running = true;
    timer = setTimeout(() => {
      running = false;
      notice.hidden = true;
      announcer.textContent = "";
    }, remaining);
  }
  function hide() {
    stop();
    notice.hidden = true;
    announcer.textContent = "";
  }
  function notify() {
    if (!error.hidden) trigger.focus();
    stop();
    remaining = 5000;
    count++;
    const text = `노트 ${count} 저장을 완료했어요.`;
    message.textContent = text;
    announcer.textContent = text;
    notice.hidden = false;
    error.hidden = true;
    const row = document.createElement("li");
    row.textContent = text;
    if (count === 1) history.replaceChildren();
    history.prepend(row);
    while (history.children.length > 5) history.lastElementChild.remove();
    start();
  }
  trigger.onclick = notify;
  document.querySelector("#notify-retry").onclick = notify;
  document.querySelector("#notify-fail").onclick = () => {
    hide();
    error.hidden = false;
  };
  document.querySelector("#toast-close").onclick = () => {
    hide();
    trigger.focus();
  };
  slot.onmouseenter = () => {
    hover = true;
    stop();
  };
  slot.onmouseleave = () => {
    hover = false;
    start();
  };
  slot.onfocusin = () => {
    focus = true;
    stop();
  };
  slot.onfocusout = (event) => {
    if (!slot.contains(event.relatedTarget)) {
      focus = false;
      start();
    }
  };
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start(),
  );
  const toggle = document.querySelector("#notify-history-toggle");
  toggle.onclick = () => {
    history.hidden = !history.hidden;
    toggle.setAttribute("aria-expanded", String(!history.hidden));
    toggle.textContent = history.hidden ? "최근 알림 보기" : "최근 알림 접기";
  };
}
export const essentialScript = {
  checkbox: `(${setupCheckbox.toString()})();`,
  "radio-group": `(${setupRadio.toString()})();`,
  switch: `(${setupSwitch.toString()})();`,
  select: `(${setupSelect.toString()})();`,
  tabs: `(${setupTabs.toString()})();`,
  tooltip: `(${setupTooltip.toString()})();`,
  popover: `(${setupPopover.toString()})();`,
  toast: `(${setupToast.toString()})();`,
};
