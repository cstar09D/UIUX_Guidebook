import { shareServices } from "./share-services.mjs";
const wrap = (id, title, body) =>
  `<div class="scene foundation-scene scene-${id}"><div class="foundation-card"><h2>${title}</h2>${body}</div></div>`;
export const foundationMarkup = {
  button: wrap(
    "button",
    "디자인 노트 저장",
    '<div class="foundation-document"><i></i><i></i><i></i><span>새로운 아이디어를 기록했어요.</span></div><button id="save-note" type="button" class="demo-primary foundation-primary">노트 저장</button><label class="foundation-option"><input id="save-failure" type="checkbox">저장 실패 모의</label><p id="save-status" class="foundation-status" role="status">버튼을 눌러 작업을 실행하세요.</p>',
  ),
  "icon-button": wrap(
    "icon-button",
    "노트 도구 모음",
    '<div class="foundation-icon-toolbar"><button id="icon-copy" type="button" aria-label="링크 복사"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/></svg></button><button id="icon-archive" type="button" aria-label="보관하기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v12h14V8M10 12h4"/></svg></button><button id="icon-share" type="button" aria-label="공유하기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg></button></div><div class="foundation-note"><strong id="icon-title">이번 주 디자인 노트</strong><p id="icon-description">아이콘은 짧은 도구 영역에서 사용해요.</p></div><button id="icon-undo" type="button" hidden>보관 취소</button><p id="icon-status" class="foundation-status" role="status">아이콘 버튼에 키보드로 이동해 보세요.</p>',
  ),
  "toggle-button": wrap(
    "toggle-button",
    "텍스트 서식",
    '<div class="foundation-toggle-tools" role="group" aria-label="문자 서식"><button id="format-bold" type="button" aria-pressed="false">굵게</button><button id="format-italic" type="button" aria-pressed="false">기울임</button></div><div id="type-sample" class="foundation-type-sample">좋은 화면은 작은 선택에서 시작됩니다.</div><p id="format-status" class="foundation-status" role="status">굵게 꺼짐 · 기울임 꺼짐</p>',
  ),
  "segmented-control": wrap(
    "segmented-control",
    "결제 주기 선택",
    '<fieldset class="foundation-segments"><legend>청구 주기</legend><label class="selected"><input type="radio" name="billing" value="monthly" checked><span>월간</span></label><label><input type="radio" name="billing" value="yearly"><span>연간</span></label></fieldset><div class="foundation-price"><strong id="billing-price">9,000원</strong><span id="billing-unit"> / 월</span><p>예시 요금 · 실제 결제는 진행하지 않아요.</p></div><p id="billing-status" class="foundation-status" role="status">매월 청구하는 옵션을 선택했어요.</p>',
  ),
  "text-field": wrap(
    "text-field",
    "프로젝트 이름",
    '<form id="name-form" novalidate><label class="foundation-label" for="project-name">이름</label><p class="foundation-hint" id="name-hint">2~30자 · 어떤 프로젝트인지 알아볼 수 있게 적으세요.</p><input id="project-name" class="foundation-input" data-metric-limit="30" required aria-describedby="name-hint project-name-metrics name-error" placeholder="예: 디자인 팀"><p id="project-name-metrics" class="input-metrics" data-counter-for="project-name" data-max-chars="30">0 / 30자 · 0 byte (UTF-8)</p><p id="name-error" class="foundation-error" role="alert"></p><button class="demo-primary foundation-primary" type="submit">이름 저장</button><p id="name-status" class="foundation-status" role="status"></p></form>',
  ),
  textarea: wrap(
    "textarea",
    "검토 의견 남기기",
    '<form id="feedback-form" novalidate><label class="foundation-label" for="feedback">검토 의견 (필수)</label><p class="foundation-hint" id="feedback-hint">10~200자 · Enter는 줄바꿈입니다.</p><textarea id="feedback" class="foundation-textarea" required aria-describedby="feedback-hint feedback-count feedback-error"></textarea><div id="feedback-count" class="foundation-count input-metrics" data-counter-for="feedback" data-max-chars="200">0 / 200자</div><p id="feedback-error" class="foundation-error" role="alert"></p><button type="submit" class="demo-primary foundation-primary">의견 저장</button><p id="feedback-status" class="foundation-status" role="status"></p></form>',
  ),
  "search-field": wrap(
    "search-field",
    "UI 노트 검색",
    '<form id="note-search" role="search" aria-label="예시 노트 검색"><label class="foundation-label" for="note-query">검색어</label><div class="foundation-search-row"><input id="note-query" type="search" class="foundation-input" placeholder="예: 모달" aria-describedby="note-search-help"><button id="note-find" type="submit" class="demo-primary">검색</button></div><p class="foundation-search-help" id="note-search-help">검색 예시: <strong>모달 · 하단 · 접이식 · 검색형</strong><br>이 체험은 샘플 노트 4개에서 검색합니다. 예시 단어를 입력하고 Enter 또는 검색 버튼을 누르세요.</p><div class="foundation-search-options"><button id="note-clear" type="button">검색 초기화</button><label class="foundation-option"><input id="note-failure" type="checkbox">조회 실패 모의</label></div></form><div id="note-results" aria-busy="false" class="foundation-search-results"><ul id="note-items" hidden></ul><p id="note-status" class="foundation-status" role="status">검색어를 입력한 뒤 검색하세요.</p></div>',
  ),
  slider: wrap(
    "slider",
    "음량 조절",
    '<label class="foundation-label" for="volume-range">음량</label><output id="volume-output" class="foundation-volume" for="volume-range">50%</output><input id="volume-range" type="range" class="foundation-range" min="0" max="100" step="5" value="50" aria-valuetext="50%"><div class="foundation-range-ends"><span>0%</span><span>100%</span></div><form id="volume-form" novalidate><label class="foundation-label" for="volume-number">정확한 값 입력</label><div class="foundation-search-row"><input id="volume-number" class="foundation-input" type="number" min="0" max="100" step="5" value="50" aria-describedby="volume-error"><button type="submit">값 적용</button></div><p id="volume-error" class="foundation-error" role="alert"></p></form><p class="foundation-status">방향키·Home·End 또는 숫자 입력으로 조절해요.</p>',
  ),
  breadcrumb: wrap(
    "breadcrumb",
    "현재 위치 경로",
    '<nav aria-label="현재 위치"><ol id="crumb-trail" class="foundation-breadcrumb"><li><a href="#workspace" data-level="0">작업 공간</a></li><li><a href="#projects" data-level="1">프로젝트</a></li><li><span aria-current="page">디자인 가이드</span></li></ol></nav><div class="foundation-destination"><span class="foundation-folder" aria-hidden="true">▤</span><h3 id="design-guide" tabindex="-1">디자인 가이드</h3><p>상위 경로를 누르면 해당 위치로 이동해요.</p></div><button id="crumb-reset" type="button">예시 경로 복원</button>',
  ),
  pagination: wrap(
    "pagination",
    "프로젝트 노트 목록",
    '<h3 id="page-1" class="foundation-page-heading" tabindex="-1">1페이지 · 전체 9개</h3><ul id="page-notes" class="foundation-result-list"></ul><nav aria-label="결과 페이지"><ul id="page-controls" class="foundation-pagination"></ul></nav><p id="page-status" class="foundation-status" role="status">1 / 3페이지</p>',
  ),
  disclosure: wrap(
    "disclosure",
    "배송 안내",
    '<p class="foundation-description">기본 배송은 2~3일이 걸려요.</p><details id="delivery-details" class="foundation-details"><summary><svg class="demo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg><span>추가 배송 조건</span></summary><div><p>도서·산간 지역은 1~2일 더 걸릴 수 있어요.</p><ul><li>추가 배송비는 결제 전에 표시합니다.</li><li>일정이 바뀌면 주문 내역에서 안내합니다.</li></ul></div></details><p id="disclosure-status" class="foundation-status">필요한 설명만 펼쳐서 읽어보세요.</p>',
  ),
  "inline-alert": wrap(
    "inline-alert",
    "작업 영역의 안내",
    '<div class="foundation-alert-controls" role="group" aria-label="알림 상태 선택">' +
      [
        ["info", "안내"],
        ["success", "완료"],
        ["warning", "주의"],
        ["error", "실패"],
      ]
        .map(
          ([key, name]) =>
            `<button type="button" data-tone="${key}" aria-pressed="${key === "info"}">${name}</button>`,
        )
        .join("") +
      '</div><section id="inline-message" class="foundation-inline-alert tone-info" role="status" aria-busy="false"><span id="inline-icon" class="foundation-alert-icon" aria-hidden="true">i</span><div><strong id="inline-title">공동 편집 안내</strong><p id="inline-body">변경 내용은 팀원과 함께 확인할 수 있어요.</p><button id="inline-retry" type="button" hidden>다시 시도</button></div></section><label class="foundation-option"><input id="inline-failure" type="checkbox">재시도도 실패</label><p class="foundation-description">관련 작업 가까이에 남아 있는 메시지예요.</p>',
  ),
};
const shareMarkup =
  '<div class="foundation-share-panel" id="icon-share-panel" role="dialog" aria-labelledby="icon-share-title" hidden><div class="foundation-share-heading"><strong id="icon-share-title">공유하기</strong><button type="button" id="share-close" aria-label="공유 목록 닫기">×</button></div><p>공유할 서비스를 선택하세요.</p><div class="foundation-share-services">' +
  shareServices
    .map(
      ([id, name, glyph]) =>
        `<button type="button" data-share-service="${name}"><span class="foundation-share-logo brand-${id}" aria-hidden="true">${glyph}</span><span>${name}</span></button>`,
    )
    .join("") +
  '</div><label class="foundation-option"><input type="checkbox" id="share-copy-failure">링크 복사 실패 모의</label><p id="share-copy-error" class="foundation-error" role="alert"></p><p class="foundation-share-hint">체험용 목록 · 실제 게시 없음</p></div>';
foundationMarkup["icon-button"] = foundationMarkup["icon-button"]
  .replace(
    '<div class="foundation-icon-toolbar">',
    '<div class="foundation-tools-shell"><div class="foundation-icon-toolbar">',
  )
  .replace(
    'id="icon-share" type="button"',
    'id="icon-share" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="icon-share-panel"',
  )
  .replace(
    '</div><div class="foundation-note">',
    "</div>" + shareMarkup + '</div><div class="foundation-note">',
  );
function setupButton() {
  const button = document.querySelector("#save-note"),
    failure = document.querySelector("#save-failure"),
    status = document.querySelector("#save-status");
  let count = 0;
  button.onclick = () => {
    if (button.disabled) return;
    button.disabled = true;
    failure.disabled = true;
    button.textContent = "저장 중…";
    status.role = "status";
    status.className = "foundation-status";
    status.textContent = "저장을 완료할 때까지 기다려 주세요.";
    setTimeout(() => {
      const failed = failure.checked;
      button.disabled = false;
      failure.disabled = false;
      button.textContent = "노트 저장";
      status.role = failed ? "alert" : "status";
      status.className = failed
        ? "foundation-status foundation-error"
        : "foundation-status";
      status.textContent = failed
        ? "저장하지 못했어요. 노트 저장으로 다시 시도하세요."
        : `저장 완료 · ${++count}회`;
    }, 650);
  };
}
function setupIcon() {
  const archive = document.querySelector("#icon-archive"),
    undo = document.querySelector("#icon-undo"),
    status = document.querySelector("#icon-status");
  document.querySelector("#icon-copy").onclick = () => {
    status.textContent =
      "링크 복사를 모의했어요. 실제 클립보드는 변경하지 않습니다.";
  };
  const share = document.querySelector("#icon-share"),
    panel = document.querySelector("#icon-share-panel");
  const close = (focus = true) => {
    panel.hidden = true;
    share.setAttribute("aria-expanded", "false");
    if (focus) share.focus();
  };
  share.onclick = () => {
    if (!panel.hidden) {
      close();
      return;
    }
    document.querySelector("#share-copy-error").textContent = "";
    panel.hidden = false;
    panel.style.top = "";
    const overflow =
      panel.getBoundingClientRect().bottom - window.innerHeight + 12;
    if (overflow > 0) panel.style.top = `calc(100% + 8px - ${overflow}px)`;
    share.setAttribute("aria-expanded", "true");
    panel.querySelector("[data-share-service]").focus();
  };
  document.querySelector("#share-close").onclick = () => close();
  panel.onclick = (event) => {
    const option = event.target.closest("[data-share-service]");
    if (!option) return;
    const name = option.dataset.shareService;
    if (
      name === "링크 복사" &&
      document.querySelector("#share-copy-failure").checked
    ) {
      document.querySelector("#share-copy-error").textContent =
        "복사 실패 모의예요. 실패 옵션을 해제하고 링크 복사를 다시 누르세요.";
      return;
    }
    status.textContent =
      name === "링크 복사"
        ? "링크 복사를 모의했어요. 실제 클립보드는 변경하지 않습니다."
        : `${name} 공유를 선택했어요. 실제 게시나 외부 전송은 하지 않습니다.`;
    close();
  };
  panel.onkeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  };
  document.addEventListener("pointerdown", (event) => {
    if (
      !panel.hidden &&
      !panel.contains(event.target) &&
      !share.contains(event.target)
    )
      close(false);
  });
  archive.onclick = () => {
    archive.disabled = true;
    archive.classList.add("foundation-highlight", "is-saved");
    archive.title = "보관 완료";
    undo.hidden = false;
    document.querySelector("#icon-title").textContent = "보관된 노트";
    document.querySelector("#icon-description").textContent =
      "보관함으로 이동했어요.";
    status.textContent = "노트를 보관했어요. 아래에서 취소할 수 있어요.";
  };
  undo.onclick = () => {
    archive.disabled = false;
    archive.classList.remove("foundation-highlight", "is-saved");
    archive.title = "보관하기";
    undo.hidden = true;
    document.querySelector("#icon-title").textContent = "이번 주 디자인 노트";
    document.querySelector("#icon-description").textContent =
      "아이콘은 짧은 도구 영역에서 사용해요.";
    status.textContent = "보관을 취소했어요.";
    archive.focus();
  };
}
function setupToggle() {
  const bold = document.querySelector("#format-bold"),
    italic = document.querySelector("#format-italic"),
    sample = document.querySelector("#type-sample"),
    status = document.querySelector("#format-status");
  function toggle(button) {
    button.setAttribute(
      "aria-pressed",
      String(button.getAttribute("aria-pressed") !== "true"),
    );
    const b = bold.getAttribute("aria-pressed") === "true",
      i = italic.getAttribute("aria-pressed") === "true";
    sample.style.fontWeight = b ? "750" : "400";
    sample.style.fontStyle = i ? "italic" : "normal";
    status.textContent = `굵게 ${b ? "켜짐" : "꺼짐"} · 기울임 ${i ? "켜짐" : "꺼짐"}`;
  }
  bold.onclick = () => toggle(bold);
  italic.onclick = () => toggle(italic);
}
function setupSegmented() {
  const inputs = [...document.querySelectorAll("[name=billing]")];
  inputs.forEach(
    (input) =>
      (input.onchange = () => {
        const yearly = input.value === "yearly";
        inputs.forEach((item) =>
          item.closest("label").classList.toggle("selected", item.checked),
        );
        document.querySelector("#billing-price").textContent = yearly
          ? "90,000원"
          : "9,000원";
        document.querySelector("#billing-unit").textContent = yearly
          ? " / 년"
          : " / 월";
        document.querySelector("#billing-status").textContent =
          (yearly ? "매년" : "매월") + " 청구하는 옵션을 선택했어요.";
      }),
  );
}
function setupTextField() {
  const input = document.querySelector("#project-name"),
    error = document.querySelector("#name-error"),
    status = document.querySelector("#name-status");
  const form = input.form,
    label = form.querySelector("label"),
    hint = form.querySelector(".foundation-hint"),
    wrap = document.createElement("div");
  wrap.className = "foundation-field-wrap";
  input.before(wrap);
  wrap.append(input, label);
  wrap.after(hint);
  const controls = document.createElement("div");
  controls.className = "foundation-input-options";
  controls.innerHTML =
    '<label class="foundation-option"><input type="checkbox" data-floating>플로팅 라벨</label><label class="foundation-option"><input type="checkbox" data-required checked>필수 입력</label>';
  form.before(controls);
  const required = controls.querySelector("[data-required]");
  const sync = () => {
    wrap.classList.toggle(
      "is-floating",
      controls.querySelector("[data-floating]").checked,
    );
    input.placeholder = controls.querySelector("[data-floating]").checked
      ? " "
      : "예: 디자인 팀";
    input.required = required.checked;
    label.textContent = `이름 (${required.checked ? "필수" : "선택"})`;
    hint.textContent =
      (required.checked ? "2~30자" : "선택 입력 · 입력 시 2~30자") +
      " · 어떤 프로젝트인지 알아볼 수 있게 적으세요.";
    error.textContent = "";
    status.textContent = "";
  };
  controls.onchange = sync;
  sync();
  input.oninput = () => {
    error.textContent = "";
    input.setAttribute("aria-invalid", "false");
    status.textContent = "";
  };
  document.querySelector("#name-form").onsubmit = (e) => {
    e.preventDefault();
    const value = input.value.trim(),
      invalid =
        ((required.checked || !!value) && measureText(value).characters < 2) ||
        measureText(value).characters > 30;
    input.setAttribute("aria-invalid", String(invalid));
    error.textContent = invalid ? "이름을 2~30자로 입력해 주세요." : "";
    status.textContent = invalid
      ? ""
      : value
        ? `“${value}” 이름으로 저장했어요.`
        : "선택 입력을 비워 두었어요. 실제 프로젝트는 저장하지 않습니다.";
    if (invalid) input.focus();
  };
}
function setupTextarea() {
  const input = document.querySelector("#feedback"),
    error = document.querySelector("#feedback-error"),
    status = document.querySelector("#feedback-status"),
    count = document.querySelector("#feedback-count");
  input.oninput = () => {
    error.textContent = "";
    status.textContent = "";
    input.setAttribute("aria-invalid", "false");
    count.textContent = formatTextMetrics(input.value, 200);
    count.classList.toggle(
      "foundation-error",
      measureText(input.value).characters > 200,
    );
  };
  document.querySelector("#feedback-form").onsubmit = (e) => {
    e.preventDefault();
    const invalid =
      measureText(input.value.trim()).characters < 10 ||
      measureText(input.value).characters > 200;
    input.setAttribute("aria-invalid", String(invalid));
    error.textContent = invalid
      ? "의견을 10~200자로 입력해 주세요. 입력 내용은 유지됩니다."
      : "";
    status.textContent = invalid ? "" : "검토 의견을 저장했어요.";
    if (invalid) input.focus();
  };
}
function setupSearch() {
  const notes = [
      "모달 대화상자",
      "하단 펼침 패널",
      "접이식 섹션",
      "검색형 선택 목록",
    ],
    input = document.querySelector("#note-query"),
    button = document.querySelector("#note-find"),
    failure = document.querySelector("#note-failure"),
    results = document.querySelector("#note-results"),
    list = document.querySelector("#note-items"),
    status = document.querySelector("#note-status");
  let composing = false,
    pending = false;
  input.oncompositionstart = () => (composing = true);
  input.oncompositionend = () => (composing = false);
  input.onkeydown = (e) => {
    if (e.key === "Enter" && (e.isComposing || e.keyCode === 229))
      e.preventDefault();
  };
  function clear() {
    input.value = "";
    list.replaceChildren();
    list.hidden = true;
    status.role = "status";
    status.className = "foundation-status";
    status.textContent = "검색어를 입력한 뒤 검색하세요.";
    input.focus();
  }
  document.querySelector("#note-clear").onclick = () => {
    if (!pending) clear();
  };
  document.querySelector("#note-search").onsubmit = (e) => {
    e.preventDefault();
    if (composing || pending) return;
    const query = input.value.trim();
    if (!query) {
      clear();
      return;
    }
    pending = true;
    input.readOnly = true;
    button.disabled = true;
    failure.disabled = true;
    document.querySelector("#note-clear").disabled = true;
    results.setAttribute("aria-busy", "true");
    list.hidden = true;
    status.role = "status";
    status.className = "foundation-status";
    status.textContent = "검색 결과를 불러오는 중…";
    setTimeout(() => {
      pending = false;
      input.readOnly = false;
      button.disabled = false;
      failure.disabled = false;
      document.querySelector("#note-clear").disabled = false;
      results.setAttribute("aria-busy", "false");
      list.replaceChildren();
      if (failure.checked) {
        status.role = "alert";
        status.className = "foundation-status foundation-error";
        status.textContent =
          "불러오지 못했어요. 검색 버튼으로 다시 시도하세요.";
        return;
      }
      const matches = notes.filter((note) => note.includes(query));
      matches.forEach((note) => {
        const row = document.createElement("li");
        row.textContent = note;
        list.append(row);
      });
      list.hidden = !matches.length;
      status.textContent = matches.length
        ? `“${query}” 검색 결과 ${matches.length}개`
        : `“${query}” 검색 결과가 없어요. 검색어를 바꾸거나 초기화하세요.`;
    }, 400);
  };
}
function setupSlider() {
  const range = document.querySelector("#volume-range"),
    number = document.querySelector("#volume-number"),
    output = document.querySelector("#volume-output"),
    error = document.querySelector("#volume-error");
  function apply(value) {
    range.value = value;
    number.value = value;
    output.textContent = value + "%";
    range.setAttribute("aria-valuetext", value + "%");
    error.textContent = "";
    number.setAttribute("aria-invalid", "false");
  }
  range.oninput = () => apply(range.value);
  document.querySelector("#volume-form").onsubmit = (e) => {
    e.preventDefault();
    const value = Number(number.value),
      invalid =
        !number.value.trim() ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100 ||
        value % 5 !== 0;
    if (invalid) {
      error.textContent = "0~100 사이의 5 단위 숫자를 입력해 주세요.";
      number.setAttribute("aria-invalid", "true");
      return;
    }
    apply(value);
  };
}
function setupBreadcrumb() {
  const titles = ["작업 공간", "프로젝트", "디자인 가이드"],
    ids = ["workspace", "projects", "design-guide"],
    trail = document.querySelector("#crumb-trail"),
    heading = document.querySelector(".foundation-destination h3");
  function go(level) {
    trail.replaceChildren();
    titles.slice(0, level + 1).forEach((title, index) => {
      const row = document.createElement("li"),
        item = document.createElement(index === level ? "span" : "a");
      item.textContent = title;
      if (index === level) item.setAttribute("aria-current", "page");
      else {
        item.href = "#" + ids[index];
        item.onclick = (e) => {
          e.preventDefault();
          go(index);
        };
      }
      row.append(item);
      trail.append(row);
    });
    heading.id = ids[level];
    heading.textContent = titles[level];
    heading.focus();
  }
  trail.querySelectorAll("a").forEach(
    (link) =>
      (link.onclick = (e) => {
        e.preventDefault();
        go(Number(link.dataset.level));
      }),
  );
  document.querySelector("#crumb-reset").onclick = () => go(2);
}
function setupPagination() {
  const notes = [
      "모달의 목적 정리",
      "입력 오류 검토",
      "팀원 의견 수집",
      "버튼 문구 개선",
      "모바일 시안 공유",
      "접근성 점검",
      "검색 결과 설계",
      "탭 전환 검토",
      "최종 가이드 배포",
    ],
    heading = document.querySelector(".foundation-page-heading"),
    list = document.querySelector("#page-notes"),
    controls = document.querySelector("#page-controls"),
    status = document.querySelector("#page-status");
  let page = 1;
  function render(focus = false) {
    heading.id = "page-" + page;
    heading.textContent = `${page}페이지 · 전체 9개`;
    list.replaceChildren();
    notes.slice((page - 1) * 3, page * 3).forEach((text) => {
      const row = document.createElement("li");
      row.textContent = text;
      list.append(row);
    });
    controls.replaceChildren();
    for (const [label, target] of [
      ["이전", page - 1],
      ["1", 1],
      ["2", 2],
      ["3", 3],
      ["다음", page + 1],
    ]) {
      const row = document.createElement("li"),
        valid = target >= 1 && target <= 3,
        item = document.createElement(valid ? "a" : "span");
      item.textContent = label;
      if (valid) {
        item.href = "#page-" + target;
        if (/^\d$/.test(label)) {
          item.setAttribute("aria-label", label + "페이지");
          if (target === page) item.setAttribute("aria-current", "page");
        }
        item.onclick = (e) => {
          e.preventDefault();
          if (page !== target) {
            page = target;
            render(true);
          }
        };
      } else item.setAttribute("aria-disabled", "true");
      row.append(item);
      controls.append(row);
    }
    status.textContent = `${page} / 3페이지`;
    if (focus) heading.focus();
  }
  render();
}
function setupDisclosure() {
  const details = document.querySelector("#delivery-details"),
    status = document.querySelector("#disclosure-status");
  details.ontoggle = () =>
    (status.textContent = details.open
      ? "추가 조건이 펼쳐졌어요."
      : "필요한 설명만 펼쳐서 읽어보세요.");
}
function setupInlineAlert() {
  const messages = {
      info: [
        "공동 편집 안내",
        "변경 내용은 팀원과 함께 확인할 수 있어요.",
        "i",
      ],
      success: [
        "저장을 완료했어요",
        "최신 변경 내용이 노트에 반영됐어요.",
        "✓",
      ],
      warning: [
        "공유 전 확인하세요",
        "노트에 개인정보가 있는지 한 번 더 확인하세요.",
        "△",
      ],
      error: [
        "노트를 저장하지 못했어요",
        "작성한 내용은 유지됩니다. 다시 시도해 주세요.",
        "!",
      ],
    },
    region = document.querySelector("#inline-message"),
    title = document.querySelector("#inline-title"),
    body = document.querySelector("#inline-body"),
    icon = document.querySelector("#inline-icon"),
    retry = document.querySelector("#inline-retry"),
    failure = document.querySelector("#inline-failure"),
    buttons = [...document.querySelectorAll("[data-tone]")];
  function show(tone) {
    const message = messages[tone];
    region.className = "foundation-inline-alert tone-" + tone;
    region.role = tone === "error" ? "alert" : "status";
    title.textContent = message[0];
    body.textContent = message[1];
    icon.textContent = message[2];
    retry.hidden = tone !== "error";
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.tone === tone)),
    );
  }
  buttons.forEach(
    (button) => (button.onclick = () => show(button.dataset.tone)),
  );
  retry.onclick = () => {
    retry.disabled = true;
    failure.disabled = true;
    buttons.forEach((button) => (button.disabled = true));
    region.setAttribute("aria-busy", "true");
    title.textContent = "다시 저장하는 중…";
    setTimeout(() => {
      const failed = failure.checked;
      retry.disabled = false;
      failure.disabled = false;
      buttons.forEach((button) => (button.disabled = false));
      region.setAttribute("aria-busy", "false");
      show(failed ? "error" : "success");
      (failed
        ? retry
        : buttons.find((button) => button.dataset.tone === "success")
      ).focus();
    }, 650);
  };
}
export const foundationScript = {
  button: `(${setupButton.toString()})();`,
  "icon-button": `(${setupIcon.toString()})();`,
  "toggle-button": `(${setupToggle.toString()})();`,
  "segmented-control": `(${setupSegmented.toString()})();`,
  "text-field": `(${setupTextField.toString()})();`,
  textarea: `(${setupTextarea.toString()})();`,
  "search-field": `(${setupSearch.toString()})();`,
  slider: `(${setupSlider.toString()})();`,
  breadcrumb: `(${setupBreadcrumb.toString()})();`,
  pagination: `(${setupPagination.toString()})();`,
  disclosure: `(${setupDisclosure.toString()})();`,
  "inline-alert": `(${setupInlineAlert.toString()})();`,
};
