// Static HTML is generated from the same initial React tree. Exported HTML and
// browser scripts below run independently: no React dependency in the HTML demo.
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url),
  compiled = buildSync({
    entryPoints: ["src/demos/patterns.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  });
const module = { exports: {} };
runInNewContext(compiled.outputFiles[0].text, {
  module,
  exports: module.exports,
  require,
});
const components = {
  "floating-action-button": "FabScene",
  "date-picker": "DatePickerScene",
  "date-range-picker": "DateRangePickerScene",
  "file-upload": "FileUploadScene",
  "navigation-drawer": "DrawerScene",
  "bottom-navigation": "BottomNavScene",
  "menu-button": "MenuButtonScene",
  stepper: "StepperScene",
  card: "CardScene",
  list: "ListScene",
  "alert-dialog": "AlertDialogScene",
  "progress-bar": "ProgressScene",
  "loading-spinner": "SpinnerScene",
};
export const patternMarkup = Object.fromEntries(
  Object.entries(components).map(([id, name]) => [
    id,
    renderToStaticMarkup(createElement(module.exports[name])),
  ]),
);
function setupFab() {
  const root = document.querySelector(".pattern-card"),
    dialog = root.querySelector("dialog"),
    input = dialog.querySelector("input"),
    error = dialog.querySelector(".pattern-error"),
    list = root.querySelector(".pattern-note-list"),
    status = root.querySelector(".pattern-status"),
    fab = root.querySelector(".pattern-fab"),
    actions = root.querySelector(".pattern-speed-actions"),
    undo = root.querySelector(".pattern-undo");
  const deleteTemplate = list.querySelector(".pattern-delete").cloneNode(true),
    plus = fab.innerHTML;
  let speed = false,
    expanded = false,
    count = 1,
    removed = null,
    kind = "노트";
  const empty = document.createElement("p");
  empty.className = "pattern-empty";
  empty.textContent = "아직 항목이 없어요. 아래 버튼으로 추가하세요.";
  empty.hidden = true;
  list.after(empty);
  function message(text) {
    empty.hidden = list.children.length > 0;
    status.textContent = `${list.children.length}개 항목 · ${text}`;
  }
  function expand(value) {
    expanded = value;
    actions.hidden = !speed || !value;
    fab.setAttribute(
      "aria-label",
      speed ? (value ? "추가 메뉴 닫기" : "추가 메뉴 열기") : "새 노트 만들기",
    );
    if (speed) {
      fab.setAttribute("aria-expanded", String(value));
      fab.setAttribute("aria-controls", actions.id);
    } else {
      fab.removeAttribute("aria-expanded");
      fab.removeAttribute("aria-controls");
    }
    fab.innerHTML = value
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
      : plus;
  }
  function create(type) {
    kind = type;
    expand(false);
    input.value = "";
    error.textContent = "";
    input.setAttribute("aria-invalid", "false");
    dialog.querySelector("h3").textContent = `새 ${kind} 만들기`;
    dialog.querySelector("label").textContent = `${kind} 이름`;
    dialog.querySelector('[type="submit"]').textContent = `${kind} 만들기`;
    dialog.showModal();
    input.focus();
  }
  root.querySelectorAll("[data-variant]").forEach(
    (button) =>
      (button.onclick = () => {
        speed = button.dataset.variant === "speed";
        root
          .querySelectorAll("[data-variant]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        expand(false);
      }),
  );
  root
    .querySelectorAll("[data-create]")
    .forEach(
      (button) => (button.onclick = () => create(button.dataset.create)),
    );
  fab.onclick = () => (speed ? expand(!expanded) : create("노트"));
  root.querySelector(".pattern-workspace").onkeydown = (e) => {
    if (e.key === "Escape" && expanded) {
      e.preventDefault();
      expand(false);
      fab.focus();
    }
  };
  list.onclick = (e) => {
    const button = e.target.closest(".pattern-delete");
    if (!button) return;
    const row = button.closest("li");
    removed = { row, index: [...list.children].indexOf(row) };
    row.remove();
    undo.hidden = false;
    message(
      `‘${row.querySelector("span").textContent}’를 삭제했어요. 되돌릴 수 있어요.`,
    );
    fab.focus();
  };
  undo.onclick = () => {
    if (!removed) return;
    list.insertBefore(removed.row, list.children[removed.index] || null);
    removed = null;
    undo.hidden = true;
    message("항목을 복원했어요.");
    fab.focus();
  };
  dialog.querySelector('button[type="button"]').onclick = () => dialog.close();
  dialog.onclose = () => fab.focus();
  dialog.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name.length < 2 || name.length > 40) {
      error.role = "alert";
      error.textContent = "이름을 2~40자로 입력해 주세요.";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    const row = document.createElement("li"),
      text = document.createElement("span"),
      button = deleteTemplate.cloneNode(true);
    row.dataset.note = String(++count);
    text.textContent = name;
    button.setAttribute("aria-label", `${name} 삭제`);
    row.append(text, button);
    list.append(row);
    message(`${kind} ‘${name}’를 추가했어요.`);
    dialog.close();
  };
  input.oninput = () => {
    error.textContent = "";
    input.setAttribute("aria-invalid", "false");
  };
}
function setupDate() {
  const root = document.querySelector(".pattern-card"),
    isRange = false;
  const dialog = root.querySelector("dialog"),
    inputs = [...root.querySelectorAll("form input")],
    input = inputs[0],
    calendarButton = root.querySelector("form button[type=button]"),
    error = root.querySelector("form .pattern-error"),
    status = root.querySelector(".pattern-status"),
    table = dialog.querySelector("table"),
    monthTitle = dialog.querySelector("h3"),
    prev = dialog.querySelector('[aria-label="이전 달"]'),
    next = dialog.querySelector('[aria-label="다음 달"]'),
    calendarError = dialog.querySelector(".pattern-error"),
    prompt = dialog.querySelector(".pattern-range-prompt");
  let month = 10,
    active = "2026-11-16",
    draft = { start: "", end: "" };
  const iso = (d) => d.toISOString().slice(0, 10),
    date = (value) => new Date(value + "T00:00:00Z");
  function issue(value) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(date(value).getTime()) ||
      iso(date(value)) !== value
    )
      return "YYYY-MM-DD 형식의 실제 날짜를 입력해 주세요.";
    if (value < "2026-11-01" || value > "2026-12-31")
      return isRange
        ? "여행 기간은 2026-11-01~2026-12-31 안에서 선택해 주세요."
        : "예시 예약 기간은 2026-11-01~2026-12-31입니다.";
    if (!isRange && (date(value).getUTCDay() === 0 || value === "2026-11-26"))
      return "일요일과 11월 26일은 예약할 수 없어요. 다른 날짜를 골라 주세요.";
    return "";
  }
  function render() {
    monthTitle.textContent = `2026년 ${month + 1}월`;
    table.setAttribute("aria-label", `2026년 ${month + 1}월 예약일`);
    prev.setAttribute("aria-disabled", String(month === 10));
    next.setAttribute("aria-disabled", String(month === 11));
    if (prompt)
      prompt.textContent = draft.end
        ? `${draft.start} ~ ${draft.end} · 새 시작일을 고르면 다시 선택해요.`
        : draft.start
          ? `시작 ${draft.start} · 종료일을 선택하세요.`
          : "시작일을 먼저 선택하세요.";
    const start = new Date(Date.UTC(2026, month, 1));
    start.setUTCDate(1 - start.getUTCDay());
    const body = table.querySelector("tbody");
    body.replaceChildren();
    for (let row = 0; row < 6; row++) {
      const tr = document.createElement("tr");
      for (let col = 0; col < 7; col++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + row * 7 + col);
        const value = iso(d),
          td = document.createElement("td"),
          button = document.createElement("button"),
          selected = isRange
            ? value === draft.start || value === draft.end
            : input.value === value;
        td.setAttribute(
          "aria-selected",
          String(
            isRange
              ? !!draft.start &&
                  value >= draft.start &&
                  value <= (draft.end || draft.start)
              : selected,
          ),
        );
        if (isRange && draft.end && value > draft.start && value < draft.end)
          td.className = "in-range";
        button.type = "button";
        button.dataset.date = value;
        button.tabIndex = value === active ? 0 : -1;
        button.setAttribute(
          "aria-label",
          value + (issue(value) ? " 예약 불가" : ""),
        );
        button.setAttribute("aria-disabled", String(!!issue(value)));
        button.className = `${d.getUTCMonth() === month ? "" : "other-month"} ${value === active ? "is-active" : ""} ${selected ? "is-selected" : ""}`;
        button.textContent = String(d.getUTCDate());
        td.append(button);
        tr.append(td);
      }
      body.append(tr);
    }
  }
  function move(value) {
    if (value < "2026-11-01" || value > "2026-12-31") return;
    active = value;
    month = date(value).getUTCMonth();
    render();
    dialog.querySelector(`[data-date="${active}"]`)?.focus();
  }
  calendarButton.onclick = () => {
    active = !issue(input.value) ? input.value : "2026-11-16";
    month = date(active).getUTCMonth();
    draft =
      isRange &&
      !issue(input.value) &&
      !issue(inputs[1].value) &&
      inputs[1].value > input.value
        ? { start: input.value, end: inputs[1].value }
        : { start: "", end: "" };
    calendarError.textContent = "";
    render();
    dialog.showModal();
    dialog.querySelector(`[data-date="${active}"]`).focus();
  };
  dialog.onclose = () => calendarButton.focus();
  dialog.querySelector(":scope > button").onclick = () => dialog.close();
  prev.onclick = () => {
    if (month > 10) move("2026-11-16");
  };
  next.onclick = () => {
    if (month < 11) move("2026-12-16");
  };
  table.onclick = (e) => {
    const target = e.target.closest("button[data-date]");
    if (!target) return;
    const value = target.dataset.date,
      invalid = issue(value);
    if (invalid) {
      calendarError.textContent = invalid;
      return;
    }
    if (isRange) {
      if (draft.end || !draft.start || value <= draft.start) {
        draft = { start: value, end: "" };
        calendarError.textContent = "";
        move(value);
        return;
      }
      inputs[0].value = draft.start;
      inputs[1].value = value;
    } else input.value = value;
    error.textContent = "";
    inputs.forEach((i) => i.setAttribute("aria-invalid", "false"));
    status.textContent = isRange
      ? "두 날짜를 입력하거나 달력에서 기간을 고르세요."
      : "직접 입력하거나 달력에서 선택하세요.";
    dialog.close();
  };
  table.onkeydown = (e) => {
    const target = e.target.closest("button[data-date]");
    if (!target) return;
    const d = date(target.dataset.date);
    let delta;
    if (e.key === "ArrowRight") delta = 1;
    else if (e.key === "ArrowLeft") delta = -1;
    else if (e.key === "ArrowDown") delta = 7;
    else if (e.key === "ArrowUp") delta = -7;
    else if (e.key === "Home") delta = -d.getUTCDay();
    else if (e.key === "End") delta = 6 - d.getUTCDay();
    else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const targetMonth = d.getUTCMonth() + (e.key === "PageDown" ? 1 : -1);
      move(
        iso(
          new Date(
            Date.UTC(
              2026,
              targetMonth,
              Math.min(
                d.getUTCDate(),
                new Date(Date.UTC(2026, targetMonth + 1, 0)).getUTCDate(),
              ),
            ),
          ),
        ),
      );
      return;
    } else return;
    e.preventDefault();
    d.setUTCDate(d.getUTCDate() + delta);
    move(iso(d));
  };

  inputs.forEach(
    (field) =>
      (field.oninput = () => {
        error.textContent = "";
        inputs.forEach((i) => i.setAttribute("aria-invalid", "false"));
        status.textContent = isRange
          ? "두 날짜를 입력하거나 달력에서 기간을 고르세요."
          : "직접 입력하거나 달력에서 선택하세요.";
      }),
  );
  root.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const invalid =
      issue(input.value) ||
      (isRange
        ? issue(inputs[1].value) ||
          (inputs[1].value <= input.value
            ? "종료일은 시작일 다음 날 이후로 선택해 주세요."
            : "")
        : "");
    error.textContent = invalid;
    error.role = invalid ? "alert" : "status";
    inputs.forEach((i) => i.setAttribute("aria-invalid", String(!!invalid)));
    status.textContent = invalid
      ? "날짜를 확인하고 다시 적용하세요."
      : isRange
        ? `${input.value} ~ ${inputs[1].value} · ${(date(inputs[1].value) - date(input.value)) / 86400000}박 여행을 선택했어요.`
        : `${input.value} 예약을 선택했어요.`;
    if (invalid) (issue(input.value) ? input : inputs.at(-1)).focus();
  };
  render();
}
function setupDateRange() {
  const root = document.querySelector(".pattern-card"),
    table = root.querySelector("table"),
    header = root.querySelector(".pattern-calendar-header"),
    prev = header.querySelector('[aria-label="이전 달"]'),
    next = header.querySelector('[aria-label="다음 달"]'),
    title = header.querySelector("h3"),
    prompt = root.querySelector(".pattern-range-prompt"),
    error = root.querySelector(".pattern-error"),
    status = root.querySelector(".pattern-status"),
    buttons = root.querySelector(".pattern-actions").querySelectorAll("button");
  let month = 10,
    active = "2026-11-16",
    draft = { start: "", end: "" },
    applied = { start: "", end: "" };
  const date = (value) => new Date(value + "T00:00:00Z"),
    iso = (d) => d.toISOString().slice(0, 10);
  function render() {
    title.textContent = `2026년 ${month + 1}월`;
    table.setAttribute("aria-label", `2026년 ${month + 1}월 예약일`);
    prev.setAttribute("aria-disabled", String(month === 10));
    next.setAttribute("aria-disabled", String(month === 11));
    const nights = draft.end
      ? (date(draft.end) - date(draft.start)) / 86400000
      : 0;
    root.querySelector('[data-range="start"]').textContent =
      draft.start || "선택 전";
    root.querySelector('[data-range="end"]').textContent =
      draft.end || "선택 전";
    root.querySelector('[data-range="nights"]').textContent = nights
      ? `${nights}박`
      : "선택 중";
    prompt.textContent = draft.end
      ? `${nights}박 선택 · 기간 적용으로 확정하세요.`
      : draft.start
        ? `시작 ${draft.start} · 마감일을 고르세요.`
        : "시작일을 먼저 선택하세요.";
    const start = new Date(Date.UTC(2026, month, 1));
    start.setUTCDate(1 - start.getUTCDay());
    const body = table.querySelector("tbody");
    body.replaceChildren();
    for (
      let row = 0;
      row <
      Math.ceil(
        (new Date(Date.UTC(2026, month, 1)).getUTCDay() +
          new Date(Date.UTC(2026, month + 1, 0)).getUTCDate()) /
          7,
      );
      row++
    ) {
      const tr = document.createElement("tr");
      for (let col = 0; col < 7; col++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + row * 7 + col);
        const value = iso(d),
          td = document.createElement("td"),
          button = document.createElement("button"),
          invalid = value < "2026-11-01" || value > "2026-12-31";
        td.setAttribute(
          "aria-selected",
          String(
            !!draft.start &&
              value >= draft.start &&
              value <= (draft.end || draft.start),
          ),
        );
        if (draft.end && value > draft.start && value < draft.end)
          td.className = "in-range";
        button.type = "button";
        button.dataset.date = value;
        button.tabIndex = value === active ? 0 : -1;
        button.setAttribute(
          "aria-label",
          value + (invalid ? " 예약 불가" : ""),
        );
        button.setAttribute("aria-disabled", String(invalid));
        button.className = `${d.getUTCMonth() === month ? "" : "other-month"} ${value === active ? "is-active" : ""} ${value === draft.start || value === draft.end ? "is-selected" : ""}`;
        button.textContent = String(d.getUTCDate());
        td.append(button);
        tr.append(td);
      }
      body.append(tr);
    }
  }
  function move(value) {
    if (value < "2026-11-01" || value > "2026-12-31") return;
    active = value;
    month = date(value).getUTCMonth();
    render();
    table.querySelector(`[data-date="${active}"]`)?.focus();
  }
  table.onclick = (e) => {
    const target = e.target.closest("[data-date]");
    if (!target) return;
    const value = target.dataset.date;
    if (value < "2026-11-01" || value > "2026-12-31") {
      error.role = "alert";
      error.textContent = "예시 여행 기간 안에서 선택해 주세요.";
      return;
    }
    draft =
      draft.end || !draft.start || value <= draft.start
        ? { start: value, end: "" }
        : { start: draft.start, end: value };
    error.textContent = "";
    status.textContent = "선택한 범위가 달력에 이어서 표시됩니다.";
    move(value);
  };
  prev.onclick = () => month > 10 && move("2026-11-16");
  next.onclick = () => month < 11 && move("2026-12-16");

  buttons[0].onclick = () => {
    draft = { ...applied };
    error.textContent = "";
    status.textContent = applied.end
      ? "마지막 적용 기간으로 돌아왔어요."
      : "선택을 취소했어요.";
    render();
  };
  buttons[1].onclick = () => {
    if (!draft.start || !draft.end) {
      error.role = "alert";
      error.textContent = !draft.start
        ? "달력에서 시작일과 마감일을 선택해 주세요."
        : "달력에서 마감일을 선택해 주세요.";
      table.querySelector(`[data-date="${active}"]`)?.focus();
      return;
    }
    applied = { ...draft };
    error.textContent = "";
    status.textContent = `${draft.start} ~ ${draft.end} · ${(date(draft.end) - date(draft.start)) / 86400000}박 여행을 적용했어요.`;
  };
  render();
}
function setupUpload() {
  const root = document.querySelector(".pattern-card"),
    input = root.querySelector("input[type=file]"),
    drop = root.querySelector(".pattern-upload"),
    error = root.querySelector(".pattern-error"),
    name = root.querySelector(".pattern-file-name"),
    status = root.querySelector(".pattern-status"),
    failure = root.querySelector("input[type=checkbox]"),
    buttons = root.querySelector(".pattern-actions").querySelectorAll("button"),
    start = buttons[0],
    secondary = buttons[1];
  const image = document.createElement("img"),
    imageBox = document.createElement("div"),
    replace = document.createElement("button");
  imageBox.className = "pattern-image-preview";
  imageBox.hidden = true;
  imageBox.append(image);
  name.after(imageBox);
  replace.type = "button";
  replace.textContent = "파일 교체";
  replace.hidden = true;
  imageBox.after(replace);
  replace.onclick = () => input.click();
  let imageUrl = "",
    imageFile = null;
  const release = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = "";
    image.removeAttribute("src");
  };
  window.addEventListener("pagehide", release);
  image.onerror = () => {
    release();
    image.hidden = true;
    imageBox.textContent =
      "이미지를 표시할 수 없어요. 다른 이미지로 교체하거나 삭제하세요.";
  };
  let file = null,
    phase = "idle",
    percent = 0,
    timer = 0;
  const bar = document.createElement("progress");
  bar.max = 100;
  bar.hidden = true;
  bar.setAttribute("aria-label", "첨부 진행률");
  error.before(bar);
  function issue(selected) {
    if (!selected) return "파일을 먼저 선택해 주세요.";
    if (!/\.(pdf|png|jpe?g)$/i.test(selected.name))
      return "PDF·PNG·JPG 파일만 선택할 수 있어요.";
    if (selected.size === 0 || selected.size > 2 * 1024 * 1024)
      return "비어 있지 않은 2MB 이하 파일을 선택해 주세요.";
    const expectedType = /\.pdf$/i.test(selected.name)
      ? "application/pdf"
      : /\.png$/i.test(selected.name)
        ? "image/png"
        : "image/jpeg";
    if (selected.type && selected.type !== expectedType)
      return "파일 형식과 확장자가 일치하는지 확인해 주세요.";
    return "";
  }
  function render() {
    replace.hidden = !file;
    replace.disabled = phase === "uploading";
    if (file !== imageFile) {
      release();
      imageFile = file;
      imageBox.replaceChildren(image);
      image.hidden = false;
      imageBox.hidden = !file || !/\.(png|jpe?g)$/i.test(file.name);
      if (!imageBox.hidden) {
        imageUrl = URL.createObjectURL(file);
        image.src = imageUrl;
        image.alt = `첨부한 ${file.name} 미리보기`;
      }
    }

    input.setAttribute("aria-invalid", String(!!error.textContent));
    input.disabled = failure.disabled = start.disabled = phase === "uploading";
    secondary.textContent = phase === "uploading" ? "전송 취소" : "파일 지우기";
    name.textContent = file
      ? `${file.name} · ${Math.ceil(file.size / 1024)}KB`
      : "선택한 파일 없음";
    bar.hidden = !["uploading", "done"].includes(phase);
    bar.value = percent;
    status.textContent =
      phase === "done"
        ? "전송 모의 완료 · 실제 파일은 전송하지 않아요."
        : phase === "uploading"
          ? "파일을 처리하는 중…"
          : phase === "cancelled"
            ? "전송을 취소했어요. 선택한 파일로 다시 시작할 수 있어요."
            : "파일을 선택한 후 전송을 시작하세요.";
  }
  function choose(selected) {
    if (phase === "uploading") return;
    const invalid = issue(selected);
    if (!invalid) file = selected;
    phase = invalid ? "error" : "ready";
    percent = 0;
    error.textContent = invalid;
    error.role = invalid ? "alert" : "status";
    input.value = "";
    render();
  }
  input.onchange = () => choose(input.files[0]);
  drop.ondragover = (e) => e.preventDefault();
  drop.ondrop = (e) => {
    e.preventDefault();
    if (phase === "uploading") return;
    if (e.dataTransfer.files.length !== 1) {
      phase = "error";
      percent = 0;
      error.role = "alert";
      error.textContent = "한 번에 파일 한 개만 선택해 주세요.";
      render();
      return;
    }
    choose(e.dataTransfer.files[0]);
  };
  start.onclick = () => {
    const invalid = issue(file);
    if (invalid) {
      error.textContent = invalid;
      error.role = "alert";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    clearInterval(timer);
    phase = "uploading";
    percent = 0;
    error.textContent = "";
    render();
    timer = setInterval(() => {
      percent = Math.min(100, percent + 10);
      if (failure.checked && percent >= 70) {
        clearInterval(timer);
        phase = "error";
        error.role = "alert";
        error.textContent =
          "전송 실패 모의입니다. 파일은 유지했어요. 다시 시작해 주세요.";
      } else if (percent === 100) {
        clearInterval(timer);
        phase = "done";
      }
      render();
    }, 160);
  };
  secondary.onclick = () => {
    clearInterval(timer);
    if (phase === "uploading") phase = "cancelled";
    else {
      file = null;
      phase = "idle";
      percent = 0;
    }
    error.textContent = "";
    render();
  };
  render();
}
function setupDrawer() {
  const root = document.querySelector(".pattern-card"),
    dialog = root.querySelector("dialog"),
    trigger = root.querySelector("[data-drawer-open]"),
    heading = root.querySelector(".pattern-workspace h3"),
    body = root.querySelector(".pattern-workspace p"),
    select = root.querySelector("[data-drawer-mode]"),
    layout = root.querySelector("[data-drawer-layout]"),
    inline = root.querySelector("[data-drawer-inline]");
  const helper = document.createElement("p");
  helper.className = "pattern-help";
  helper.textContent =
    "현재 문서의 관련 자료를 확인합니다. 배경 조작을 막지 않는 보조 패널입니다.";
  inline.append(helper);
  let current = "home";
  const render = () => {
    const compact = layout.clientWidth < 380,
      mode = compact ? "modal" : select.value;
    layout.className = "pattern-drawer-layout mode-" + mode;
    helper.hidden = mode !== "helper";
    inline.hidden = mode === "modal";
    trigger.hidden = mode !== "modal";
    root.querySelector("[data-drawer-policy]").textContent = compact
      ? "작은 화면에서는 모달 드로어로 전환합니다. 현재 문서는 유지돼요."
      : mode === "modal"
        ? "모달은 배경 조작을 막고 닫으면 호출 버튼으로 돌아갑니다."
        : "고정·축약·보조 패널은 배경과 함께 조작할 수 있어요.";
    inline.querySelector("h3").textContent =
      mode === "helper" ? "문서 보조 정보" : "작업 공간 탐색";
    root.querySelectorAll("nav a").forEach((link, i) => {
      const id = ["home", "saved", "profile"][i % 3],
        label = ["홈", "저장한 노트", "내 정보"][i % 3];
      link.setAttribute("aria-label", label);
      link.title = label;
      link.textContent =
        inline.contains(link) && mode === "rail"
          ? ["⌂", "▤", "⚙"][i % 3]
          : label;
      if (id === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  trigger.onclick = () => {
    dialog.showModal();
    dialog.querySelector("a").focus();
  };
  dialog.querySelector("button").onclick = () => dialog.close();
  root.querySelectorAll("nav a").forEach(
    (link, i) =>
      (link.onclick = (e) => {
        e.preventDefault();
        current = ["home", "saved", "profile"][i % 3];
        heading.textContent = ["홈", "저장한 노트", "내 정보"][i % 3];
        body.textContent = [
          "팀의 최신 기록을 모았어요.",
          "보관한 자료 3개를 확인하세요.",
          "프로필과 작업 환경을 관리해요.",
        ][i % 3];
        dialog.close();
        render();
        heading.focus();
      }),
  );
  select.onchange = () => {
    dialog.close();
    render();
  };
  const ro = new ResizeObserver(render);
  ro.observe(layout);
  window.addEventListener("pagehide", () => ro.disconnect(), { once: true });
  render();
}
function setupBottomNav() {
  const root = document.querySelector(".pattern-card"),
    content = root.querySelector(".pattern-app-content"),
    heading = content.querySelector("h3"),
    input = content.querySelector("input"),
    label = content.querySelector("label"),
    body = content.querySelector("p"),
    links = [...root.querySelectorAll("nav a")];
  links.forEach(
    (link, index) =>
      (link.onclick = (e) => {
        e.preventDefault();
        links.forEach((item, i) => {
          if (i === index) item.setAttribute("aria-current", "page");
          else item.removeAttribute("aria-current");
        });
        heading.textContent = ["홈", "저장한 노트", "내 정보"][index];
        input.hidden = label.hidden = index !== 0;
        body.textContent = [
          "다른 화면에 다녀와도 입력을 유지해요.",
          "저장한 노트 3개",
          "내 작업 공간 · 로컬 예제",
        ][index];
        heading.focus();
      }),
  );
}
function setupMenu() {
  const root = document.querySelector(".pattern-card"),
    wrapper = root.querySelector(".pattern-menu-anchor"),
    trigger = wrapper.querySelector("button"),
    menu = wrapper.querySelector("[role=menu]"),
    items = [...menu.querySelectorAll("button")],
    heading = wrapper.querySelector("strong"),
    copiesText = wrapper.nextElementSibling,
    after = [...root.querySelectorAll(":scope > button")][0],
    status = root.querySelector(".pattern-status");
  let open = false,
    active = 0,
    pinned = false,
    copies = 0,
    archived = false;
  const restore = document.createElement("button");
  restore.textContent = "보관 취소";
  restore.hidden = true;
  after.before(restore);
  function render(focus = false) {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    trigger.disabled = archived;
    heading.textContent =
      (archived ? "보관된 노트" : "팀 회의 기록") + (pinned ? " · 고정" : "");
    items[1].textContent = pinned ? "고정 해제" : "상단에 고정";
    copiesText.textContent = `사본 ${copies}개`;
    restore.hidden = !archived;
    if (focus && open) items[active].focus();
  }
  function close(focus = true) {
    open = false;
    render();
    if (focus) trigger.focus();
  }
  trigger.onclick = () => {
    open = !open;
    active = 0;
    render(true);
  };
  trigger.onkeydown = (e) => {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      active = e.key === "ArrowUp" ? 2 : 0;
      open = true;
      render(true);
    }
  };
  items.forEach((item, index) => {
    item.onclick = () => {
      if (index === 0) {
        copies++;
        status.textContent = "노트 사본을 만들었어요.";
      }
      if (index === 1) {
        pinned = !pinned;
        status.textContent = pinned
          ? "노트를 상단에 고정했어요."
          : "상단 고정을 해제했어요.";
      }
      if (index === 2) {
        archived = true;
        status.textContent = "노트를 보관했어요. 되돌릴 수 있어요.";
      }
      close(index !== 2);
      if (index === 2) restore.focus();
    };
    item.onkeydown = (e) => {
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        active =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? 2
              : (index + (e.key === "ArrowDown" ? 1 : 2)) % 3;
        render(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        close(false);
        (e.shiftKey ? trigger : after).focus();
      }
    };
  });
  wrapper.onfocusout = (e) => {
    if (!wrapper.contains(e.relatedTarget)) close(false);
  };
  document.addEventListener("pointerdown", (e) => {
    if (!wrapper.contains(e.target)) close(false);
  });
  restore.onclick = () => {
    archived = false;
    status.textContent = "보관을 취소했어요.";
    render();
    trigger.focus();
  };
  after.onclick = () => (status.textContent = "팀 회의 기록을 열었어요.");
  render();
}
function setupStepper() {
  const root = document.querySelector(".pattern-card"),
    form = root.querySelector("form"),
    heading = form.querySelector("h3"),
    input = form.querySelector("input"),
    error = form.querySelector(".pattern-error"),
    steps = [...root.querySelectorAll(".pattern-steps li")],
    actions = form.querySelector(".pattern-actions"),
    back = actions.querySelector("button[type=button]"),
    next = actions.querySelector("button[type=submit]"),
    status = root.querySelector(".pattern-status");
  let step = 0,
    scope = "",
    done = false;
  const fields = document.createElement("fieldset");
  fields.setAttribute("aria-describedby", error.id);
  fields.innerHTML =
    '<legend>공개 범위</legend><label class="pattern-check"><input type="radio" name="project-scope" value="private">나만 보기</label><label class="pattern-check"><input type="radio" name="project-scope" value="team">팀 공개</label>';
  error.before(fields);
  const review = document.createElement("dl");
  review.className = "pattern-review";
  review.innerHTML =
    "<dt>프로젝트 이름</dt><dd></dd><dt>공개 범위</dt><dd></dd>";
  error.before(review);
  const complete = document.createElement("div");
  complete.className = "pattern-complete";
  complete.innerHTML =
    '<strong>프로젝트를 만들었어요.</strong><p></p><button type="button">새로 작성</button>';
  form.after(complete);
  function render(focus = false) {
    form.hidden = done;
    complete.hidden = !done;
    steps.forEach((item, index) => {
      item.className =
        index < step || done
          ? "is-complete"
          : index === step
            ? "is-current"
            : "";
      if (!done && index === step) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
      item.querySelector("span").textContent =
        index < step || done ? "✓" : String(index + 1);
      const current = item.querySelector("strong,button"),
        label = ["기본 정보", "공개 범위", "검토"][index];
      if (index < step && !done) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label + " 다시 편집";
        button.onclick = () => {
          step = index;
          error.textContent = "";
          render(true);
        };
        current.replaceWith(button);
      } else {
        const strong = document.createElement("strong");
        strong.textContent = label;
        current.replaceWith(strong);
      }
    });
    heading.textContent = [
      "기본 정보를 입력하세요",
      "공개 범위를 선택하세요",
      "입력 내용을 확인하세요",
    ][step];
    input.hidden = form.querySelector("label").hidden = step !== 0;
    fields.hidden = step !== 1;
    review.hidden = step !== 2;
    review.querySelectorAll("dd")[0].textContent = input.value;
    review.querySelectorAll("dd")[1].textContent =
      scope === "private" ? "나만 보기" : "팀 공개";
    back.disabled = step === 0;
    next.textContent = step === 2 ? "프로젝트 만들기" : "다음 단계";
    complete.querySelector("p").textContent =
      `${input.value} · ${scope === "private" ? "나만 보기" : "팀 공개"}`;
    status.textContent = done
      ? "작성 완료"
      : `${step + 1}/3단계 · 이전 단계로 돌아가도 입력을 유지해요.`;
    if (focus) heading.focus();
  }
  input.oninput = () => {
    error.textContent = "";
    input.setAttribute("aria-invalid", "false");
  };
  fields.onchange = (e) => {
    scope = e.target.value;
    error.textContent = "";
  };
  back.onclick = () => {
    step--;
    error.textContent = "";
    render(true);
  };
  form.onsubmit = (e) => {
    e.preventDefault();
    if (
      step === 0 &&
      (input.value.trim().length < 2 || input.value.trim().length > 30)
    ) {
      error.role = "alert";
      error.textContent = "프로젝트 이름을 2~30자로 입력해 주세요.";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    if (step === 1 && !scope) {
      error.role = "alert";
      error.textContent = "공개 범위를 선택해 주세요.";
      fields.querySelector("input").focus();
      return;
    }
    error.textContent = "";
    if (step === 2) done = true;
    else step++;
    render(!done);
  };
  complete.querySelector("button").onclick = () => {
    done = false;
    step = 0;
    scope = "";
    input.value = "";
    fields.querySelectorAll("input").forEach((r) => (r.checked = false));
    render(true);
  };
  render();
}
function setupCard() {
  const root = document.querySelector(".pattern-card"),
    card = root.querySelector("article"),
    link = card.querySelector("a"),
    save = card.querySelector("button"),
    status = root.querySelector(".pattern-status");
  let saved = false;
  const detail = document.createElement("section");
  detail.className = "pattern-card-detail";
  detail.hidden = true;
  detail.innerHTML =
    '<h3 tabindex="-1">접근성 점검 노트</h3><p>키보드로 모든 행동에 접근하고 오류를 문장으로 설명하는지 확인하세요.</p><button>카드로 돌아가기</button>';
  card.after(detail);
  link.onclick = (e) => {
    e.preventDefault();
    card.hidden = true;
    detail.hidden = false;
    detail.querySelector("h3").focus();
  };
  detail.querySelector("button").onclick = () => {
    detail.hidden = true;
    card.hidden = false;
    link.focus();
  };
  save.onclick = () => {
    saved = !saved;
    save.setAttribute("aria-pressed", String(saved));
    save.textContent = saved ? "저장됨" : "노트 저장";
    status.textContent = saved
      ? "저장한 노트 1개"
      : "카드를 열거나 노트를 따로 저장해 보세요.";
  };
}
function setupList() {
  const root = document.querySelector(".pattern-card"),
    list = root.querySelector("ul"),
    rows = [...list.querySelectorAll("li")],
    filter = root.querySelector("input[type=checkbox]"),
    status = root.querySelector(".pattern-status");
  const empty = document.createElement("div");
  empty.className = "pattern-empty";
  empty.innerHTML =
    "<strong>남은 검토 문서가 없어요.</strong><p>완료 문서를 다시 보려면 숨기기를 해제하세요.</p><button>전체 문서 보기</button>";
  list.after(empty);
  const opened = document.createElement("section");
  opened.className = "pattern-opened-note";
  opened.hidden = true;
  opened.innerHTML =
    '<h3 tabindex="-1"></h3><p>선택한 문서의 상세 내용입니다. 목록의 완료 표시는 별도로 변경하세요.</p>';
  empty.after(opened);
  function render() {
    let done = 0,
      shown = 0;
    rows.forEach((row) => {
      const button = row.querySelector("button"),
        completed = button.getAttribute("aria-pressed") === "true";
      if (completed) done++;
      row.hidden = filter.checked && completed;
      if (!row.hidden) shown++;
      row.querySelector("small").textContent = completed
        ? "검토 완료"
        : "검토 대기";
      button.textContent = completed ? "완료" : "미완료";
    });
    empty.hidden = shown !== 0;
    list.hidden = shown === 0;
    status.textContent = `전체 3개 · 완료 ${done}개 · 표시 ${shown}개`;
  }
  rows.forEach((row) => {
    const button = row.querySelector("button"),
      link = row.querySelector("a");
    button.onclick = () => {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("aria-pressed") !== "true"),
      );
      render();
      if (filter.checked) filter.focus();
    };
    link.onclick = (e) => {
      e.preventDefault();
      opened.hidden = false;
      opened.querySelector("h3").textContent = link.textContent;
      opened.querySelector("h3").focus();
    };
  });
  filter.onchange = render;
  empty.querySelector("button").onclick = () => {
    filter.checked = false;
    render();
    filter.focus();
  };
  render();
}
function setupAlert() {
  const root = document.querySelector(".pattern-card"),
    dialog = root.querySelector("dialog"),
    workspace = root.querySelector(".pattern-workspace"),
    trigger = workspace.querySelector("button"),
    name = workspace.querySelector("strong"),
    failure = workspace.querySelector("input"),
    status = root.querySelector(".pattern-status"),
    buttons = [...dialog.querySelectorAll("button")],
    cancel = buttons[0],
    confirm = buttons[1],
    error = dialog.querySelector(".pattern-error");
  let pending = false;
  const restore = document.createElement("button");
  restore.textContent = "문서 복원";
  restore.hidden = true;
  trigger.after(restore);
  trigger.onclick = () => {
    error.textContent = "";
    dialog.showModal();
    cancel.focus();
  };
  cancel.onclick = () => dialog.close();
  dialog.addEventListener("cancel", (e) => {
    if (pending) e.preventDefault();
  });
  confirm.onclick = () => {
    if (pending) return;
    pending = true;
    cancel.disabled = confirm.disabled = true;
    confirm.textContent = "삭제 중…";
    setTimeout(() => {
      pending = false;
      cancel.disabled = confirm.disabled = false;
      confirm.textContent = "문서 삭제";
      if (failure.checked) {
        error.role = "alert";
        error.textContent =
          "삭제하지 못했어요. 문서는 유지됩니다. 다시 시도하거나 취소하세요.";
        cancel.focus();
      } else {
        trigger.hidden = true;
        restore.hidden = false;
        name.textContent = "삭제된 문서";
        status.textContent = "문서를 삭제했어요. 복원할 수 있어요.";
        dialog.close();
        restore.focus();
      }
    }, 650);
  };
  restore.onclick = () => {
    restore.hidden = true;
    trigger.hidden = false;
    name.textContent = "회의 기록";
    error.textContent = "";
    status.textContent = "실행 전 결과와 취소 방법을 확인하세요.";
    trigger.focus();
  };
}
function setupProgress() {
  const root = document.querySelector(".pattern-card"),
    progress = root.querySelector("progress"),
    percent = root.querySelector(".pattern-percent"),
    failure = root.querySelector("input"),
    actions = root.querySelector(".pattern-actions"),
    start = actions.querySelector("button"),
    status = root.querySelector(".pattern-status");
  let timer = 0,
    value = 0,
    phase = "idle";
  const cancel = document.createElement("button");
  cancel.textContent = "생성 취소";
  cancel.hidden = true;
  actions.append(cancel);
  function render() {
    progress.value = value;
    const format = root.querySelector("[data-progress-format]"),
      circle = root.querySelector("[data-progress-circle]");
    progress.hidden = format.value === "circular";
    circle.hidden = format.value === "linear";
    circle.setAttribute("aria-valuenow", String(value));
    root
      .querySelector("[data-progress-arc]")
      .setAttribute("stroke-dashoffset", String(100 - value));
    root.querySelector("[data-progress-number]").textContent = value + "%";
    percent.textContent = value + "%";
    start.disabled = failure.disabled = phase === "running";
    cancel.hidden = phase !== "running";
    status.className =
      phase === "error" ? "pattern-status pattern-error" : "pattern-status";
    status.role = phase === "error" ? "alert" : "status";
    status.textContent =
      phase === "done"
        ? "보고서 생성 모의가 완료됐어요."
        : phase === "running"
          ? "보고서를 생성하는 중이에요."
          : phase === "error"
            ? "60%에서 실패했어요. 실패 모의를 해제한 뒤 다시 시작하세요."
            : phase === "cancelled"
              ? "생성을 취소했어요. 다시 시작하면 0%부터 진행해요."
              : "시작하면 실제 진행값을 숫자와 막대로 보여줘요.";
  }
  start.onclick = () => {
    clearInterval(timer);
    value = 0;
    phase = "running";
    render();
    timer = setInterval(() => {
      value = Math.min(100, value + 10);
      if (failure.checked && value >= 60) {
        phase = "error";
        clearInterval(timer);
      } else if (value === 100) {
        phase = "done";
        clearInterval(timer);
      }
      render();
    }, 220);
  };
  cancel.onclick = () => {
    clearInterval(timer);
    phase = "cancelled";
    render();
    start.focus();
  };
  root.querySelector("[data-progress-format]").onchange = render;
  window.addEventListener("pagehide", () => clearInterval(timer), {
    once: true,
  });
  render();
}
function setupSpinner() {
  const root = document.querySelector(".pattern-card"),
    area = root.querySelector(".pattern-spinner-area"),
    fields = root.querySelector("fieldset"),
    radios = [...fields.querySelectorAll("input")],
    actions = root.querySelector(".pattern-actions"),
    start = actions.querySelector("button"),
    status = root.querySelector(".pattern-status");
  let phase = "idle",
    slow = false,
    timer = 0,
    notice = 0;
  const cancel = document.createElement("button");
  cancel.textContent = "조회 취소";
  cancel.hidden = true;
  actions.append(cancel);
  const create = document.createElement("button");
  create.textContent = "첫 노트 만들기";
  create.hidden = true;
  actions.append(create);
  function render() {
    area.setAttribute("aria-busy", String(phase === "loading"));
    area.replaceChildren();
    if (phase === "loading") {
      const spinner = document.createElement("div");
      spinner.className = "pattern-spinner";
      spinner.setAttribute("aria-hidden", "true");
      area.append(spinner);
    } else {
      const icon = document.createElement("div");
      icon.className = "pattern-spinner-result";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = phase === "done" ? "✓" : phase === "error" ? "!" : "▤";
      area.append(icon);
      if (phase === "done") {
        const list = document.createElement("ul");
        list.className = "pattern-note-list";
        const item = document.createElement("li");
        item.textContent = "오늘의 디자인 기록";
        list.append(item);
        area.append(list);
      }
    }
    fields.disabled = start.disabled = phase === "loading";
    cancel.hidden = phase !== "loading";
    create.hidden = phase !== "empty";
    status.className =
      phase === "error" ? "pattern-status pattern-error" : "pattern-status";
    status.role = phase === "error" ? "alert" : "status";
    status.textContent =
      phase === "loading"
        ? slow
          ? "예상보다 오래 걸려요. 기다리거나 조회를 취소할 수 있어요."
          : "노트를 불러오는 중…"
        : phase === "done"
          ? "노트 1개를 불러왔어요."
          : phase === "empty"
            ? "아직 노트가 없어요. 첫 노트를 만들어 보세요."
            : phase === "error"
              ? "연결 실패 모의입니다. 결과 설정을 바꾸고 다시 불러오세요."
              : phase === "cancelled"
                ? "조회를 취소했어요. 필요할 때 다시 시작하세요."
                : "조회 버튼을 누르면 처리 상태를 보여줘요.";
  }
  start.onclick = () => {
    clearTimeout(timer);
    clearTimeout(notice);
    phase = "loading";
    slow = false;
    const result = radios.findIndex((r) => r.checked);
    render();
    notice = setTimeout(() => {
      slow = true;
      render();
    }, 1000);
    timer = setTimeout(() => {
      clearTimeout(notice);
      phase = ["done", "empty", "error"][result];
      slow = false;
      render();
    }, 2400);
  };
  cancel.onclick = () => {
    clearTimeout(timer);
    clearTimeout(notice);
    phase = "cancelled";
    slow = false;
    render();
    start.focus();
  };
  create.onclick = () => {
    phase = "done";
    render();
    start.focus();
  };
  render();
}
export const patternScript = Object.fromEntries(
  Object.entries({
    "floating-action-button": setupFab,
    "date-picker": setupDate,
    "date-range-picker": setupDateRange,
    "file-upload": setupUpload,
    "navigation-drawer": setupDrawer,
    "bottom-navigation": setupBottomNav,
    "menu-button": setupMenu,
    stepper: setupStepper,
    card: setupCard,
    list: setupList,
    "alert-dialog": setupAlert,
    "progress-bar": setupProgress,
    "loading-spinner": setupSpinner,
  }).map(([id, setup]) => [id, `(${setup.toString()})();`]),
);
