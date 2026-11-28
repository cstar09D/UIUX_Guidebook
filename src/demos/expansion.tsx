import { useEffect, useId, useRef, type ReactNode } from "react";
import { formatTextMetrics, measureText } from "./input-metrics.mjs";

type ExpansionProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
type ScenarioController = ReturnType<typeof createScenarioController>;
/** The same controller and initial tree power React, plain HTML and the thumbnail. */
export function createScenarioController(
  root: HTMLElement,
  presets: Record<string, () => void>,
  preview = false,
) {
  const removers: (() => void)[] = [],
    timers = new Set<ReturnType<typeof setTimeout>>();
  let current = "default",
    initialized = false,
    ready = false;
  const config = (
    window as unknown as { __DEMO__?: { id?: string; nonce?: string } }
  ).__DEMO__;
  const send = (type: string, state?: string) => {
    if (
      !preview &&
      ready &&
      config?.nonce &&
      config.id === root.dataset.expansion
    )
      parent.postMessage(
        { type, nonce: config.nonce, id: config.id, state },
        "*",
      );
  };
  const cancel = () => {
    timers.forEach(clearTimeout);
    timers.clear();
  };
  const controller = {
    on(
      target: EventTarget,
      type: string,
      handler: (event: any) => void,
      options?: AddEventListenerOptions,
    ) {
      if (preview) return;
      target.addEventListener(type, handler, options);
      removers.push(() => target.removeEventListener(type, handler, options));
    },
    later(fn: () => void, ms: number) {
      if (preview) return;
      const timer = setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    },
    cancel,
    cleanup(fn: () => void) {
      removers.push(fn);
    },
    state(key: string) {
      if (Object.hasOwn(presets, key)) {
        current = key;
        send("demo:state", key);
      }
    },
    set(key: string, force = false) {
      if (!Object.hasOwn(presets, key)) return false;
      if (initialized && current === key && !force) return true;
      cancel();
      presets[key]();
      current = key;
      initialized = true;
      send("demo:state", key);
      return true;
    },
    ready() {
      ready = true;
      send("demo:ready");
    },
    destroy() {
      cancel();
      removers.forEach((fn) => fn());
    },
  };
  controller.on(window, "message", (event: MessageEvent) => {
    if (
      !config?.nonce ||
      config.id !== root.dataset.expansion ||
      event.source !== parent ||
      event.data?.nonce !== config.nonce ||
      event.data?.id !== config.id
    )
      return;
    if (event.data.command === "hello") send("demo:ready");
    if (
      event.data.command === "scenario" &&
      typeof event.data.value === "string"
    )
      controller.set(event.data.value);
  });
  return controller;
}
function useExpansion(
  root: { current: HTMLElement | null },
  attach: (root: HTMLElement, preview?: boolean) => ScenarioController,
  preview: boolean,
  state: string,
) {
  const controller = useRef<ScenarioController | null>(null);
  useEffect(() => {
    if (!root.current) return;
    controller.current = attach(root.current, preview);
    return () => {
      controller.current?.destroy();
      controller.current = null;
    };
  }, [attach, preview, root]);
  useEffect(() => {
    if (preview) controller.current?.set(state, true);
  }, [preview, state]);
}
function ExpansionFrame({
  kind,
  title,
  children,
  root,
  preview,
}: {
  kind: string;
  title: string;
  children: ReactNode;
  root: { current: HTMLDivElement | null };
  preview: boolean;
}) {
  return (
    <div
      ref={root}
      data-expansion={kind}
      className={`scene expansion-scene scene-${kind} ${["split-view", "mega-menu", "scroll-reveal", "stagger-animation", "scroll-snap", "parallax-scroll"].includes(kind) ? "layout-demo-scene" : ""} ${["notification-center", "hover-card", "inline-edit", "infinite-scroll", "swipe-actions", "pull-to-refresh"].includes(kind) ? "flow-demo-scene" : ""} ${["password-field", "otp-input", "multi-select", "number-stepper", "time-picker", "rating"].includes(kind) ? "input-demo-scene" : ""} ${preview ? "is-preview" : ""}`}
    >
      <div className="expansion-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
function ExpansionIcon({
  kind,
}: {
  kind: "bell" | "down" | "more" | "close" | "search";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "bell" ? (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </>
      ) : kind === "down" ? (
        <path d="m6 9 6 6 6-6" />
      ) : kind === "more" ? (
        <>
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </>
      ) : kind === "search" ? (
        <>
          <circle cx="10" cy="10" r="6" />
          <path d="m15 15 5 5" />
        </>
      ) : (
        <path d="m6 6 12 12M18 6 6 18" />
      )}
    </svg>
  );
}
export function attachBadge(root: HTMLElement, preview = false) {
  const count = root.querySelector<HTMLElement>("[data-badge]")!,
    button = root.querySelector<HTMLElement>("[data-bell]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!,
    tone = root.querySelector<HTMLElement>("[data-status-badge]")!,
    zero = root.querySelector<HTMLInputElement>("[data-show-zero]")!;
  let value = 3;
  const render = () => {
    count.textContent = value > 99 ? "99+" : String(value);
    count.hidden = value === 0 && !zero.checked;
    button.setAttribute("aria-label", `알림 ${value}개 확인`);
    status.textContent = `미확인 알림 ${value}개${value > 99 ? " · 화면에는 99+로 표시해요." : ""}`;
  };
  const setCount = (n: number) => {
    value = n;
    tone.hidden = true;
    render();
  };
  const api = createScenarioController(
    root,
    {
      default: () => setCount(3),
      unread: () => setCount(5),
      overflow: () => setCount(137),
      zero: () => setCount(0),
      status: () => {
        setCount(3);
        tone.hidden = false;
      },
    },
    preview,
  );
  api.on(root, "click", (event: MouseEvent) => {
    const action = (event.target as Element).closest<HTMLElement>(
      "[data-badge-action]",
    )?.dataset.badgeAction;
    if (!action) return;
    if (action === "add") value++;
    if (action === "read") value = Math.max(0, value - 1);
    if (action === "all") value = 0;
    render();
    api.state(value === 0 ? "zero" : value > 99 ? "overflow" : "unread");
  });
  api.on(button, "click", () => {
    status.textContent = `${value}개의 미확인 알림이 있어요. 아래 버튼으로 읽음 처리를 비교하세요.`;
  });
  api.on(zero, "change", render);
  api.set("default", true);
  api.ready();
  return api;
}
export function BadgeScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachBadge,
    preview,
    ["default", "unread", "overflow", "zero"][
      Math.min(3, Math.floor(time / 1200))
    ],
  );
  return (
    <ExpansionFrame
      root={root}
      kind="badge"
      title="숫자로 알려주는 알림"
      preview={preview}
    >
      <div className="expansion-badge-example">
        <button data-bell className="expansion-bell" aria-label="알림 3개 확인">
          <ExpansionIcon kind="bell" />
          <span data-badge className="expansion-badge">
            3
          </span>
        </button>
        <div>
          <strong>내 알림</strong>
          <p>알림 버튼 옆에서 미확인 개수를 확인해요.</p>
        </div>
      </div>
      <span data-status-badge className="expansion-status-badge" hidden>
        승인 대기
      </span>
      <div className="expansion-controls">
        <button data-badge-action="add">알림 추가</button>
        <button data-badge-action="read">1개 읽기</button>
        <button data-badge-action="all">모두 읽기</button>
      </div>
      <label className="expansion-check">
        <input data-show-zero type="checkbox" />
        0개도 표시
      </label>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        미확인 알림 3개
      </p>
    </ExpansionFrame>
  );
}
export function attachChips(root: HTMLElement, preview = false) {
  const list = root.querySelector<HTMLElement>("[data-chips]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!,
    select = root.querySelector<HTMLSelectElement>("[data-chip-mode]")!;
  const labels = ["기획", "디자인", "개발"];
  let selected = new Set<string>(),
    removed = new Set<string>();
  const render = () => {
    list.replaceChildren();
    for (const label of labels) {
      if (removed.has(label)) continue;
      const wrap = document.createElement("span");
      wrap.className = "expansion-chip";
      const chip = document.createElement(
        select.value === "readonly" ? "span" : "button",
      );
      chip.textContent = label;
      chip.className = "expansion-chip-label";
      if (chip instanceof HTMLButtonElement) {
        chip.type = "button";
        chip.dataset.chip = label;
        chip.setAttribute("aria-pressed", String(selected.has(label)));
      }
      wrap.append(chip);
      if (select.value === "removable") {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.dataset.removeChip = label;
        remove.className = "expansion-chip-remove";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `${label} 태그 삭제`);
        wrap.append(remove);
      }
      list.append(wrap);
    }
    status.textContent =
      select.value === "readonly"
        ? "분류 라벨은 읽기 전용이에요."
        : `선택 ${selected.size}개${select.value === "limit" ? " / 최대 2개" : ""} · ${removed.size ? "초기화로 삭제한 태그를 복원할 수 있어요." : "항목을 선택해 보세요."}`;
  };
  const preset = (mode: string, values: string[] = []) => {
    select.value = mode;
    selected = new Set(values);
    removed.clear();
    render();
  };
  const api = createScenarioController(
    root,
    {
      default: () => preset("select"),
      selected: () => preset("select", ["디자인"]),
      removable: () => preset("removable", ["기획", "디자인"]),
      limit: () => preset("limit", ["기획", "디자인"]),
      readonly: () => preset("readonly"),
    },
    preview,
  );
  api.on(select, "change", () => {
    selected.clear();
    removed.clear();
    render();
    api.state(
      select.value === "readonly"
        ? "readonly"
        : select.value === "removable"
          ? "removable"
          : select.value === "limit"
            ? "limit"
            : "default",
    );
  });
  api.on(root, "click", (e: MouseEvent) => {
    const target = (e.target as Element).closest<HTMLElement>(
      "[data-chip],[data-remove-chip],[data-chips-reset]",
    );
    if (!target) return;
    if (target.hasAttribute("data-chips-reset")) {
      api.set("default", true);
      return;
    }
    const remove = target.dataset.removeChip,
      label = remove || target.dataset.chip!;
    if (remove) {
      removed.add(label);
      selected.delete(label);
      render();
      (list.querySelector("button") || select).focus();
      api.state("removable");
      return;
    }
    if (selected.has(label)) selected.delete(label);
    else if (select.value === "limit" && selected.size >= 2) {
      status.textContent =
        "최대 2개까지 선택할 수 있어요. 선택한 항목은 해제할 수 있습니다.";
      api.state("limit");
      return;
    } else selected.add(label);
    render();
    list.querySelector<HTMLButtonElement>(`[data-chip="${label}"]`)?.focus();
    api.state(
      select.value === "removable"
        ? "removable"
        : select.value === "limit"
          ? "limit"
          : selected.size
            ? "selected"
            : "default",
    );
  });
  api.set("default", true);
  api.ready();
  return api;
}
export function ChipScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachChips,
    preview,
    ["default", "selected", "removable", "limit"][
      Math.min(3, Math.floor(time / 1200))
    ],
  );
  return (
    <ExpansionFrame
      root={root}
      kind="chip-tag"
      title="작은 항목의 세 가지 역할"
      preview={preview}
    >
      <label className="expansion-label">
        사용 형태
        <select data-chip-mode defaultValue="select">
          <option value="select">선택 칩</option>
          <option value="removable">삭제 가능한 칩</option>
          <option value="limit">최대 2개 선택</option>
          <option value="readonly">읽기 전용 태그</option>
        </select>
      </label>
      <div data-chips className="expansion-chips">
        <span className="expansion-chip">
          <button className="expansion-chip-label" aria-pressed="false">
            기획
          </button>
        </span>
        <span className="expansion-chip">
          <button className="expansion-chip-label" aria-pressed="false">
            디자인
          </button>
        </span>
        <span className="expansion-chip">
          <button className="expansion-chip-label" aria-pressed="false">
            개발
          </button>
        </span>
      </div>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        선택 0개
      </p>
      <button data-chips-reset>선택·삭제 초기화</button>
    </ExpansionFrame>
  );
}
export function attachAvatar(root: HTMLElement, preview = false) {
  const image = root.querySelector<HTMLImageElement>("[data-avatar-image]")!,
    fallback = root.querySelector<HTMLElement>("[data-avatar-fallback]")!,
    single = root.querySelector<HTMLElement>("[data-avatar-single]")!,
    group = root.querySelector<HTMLElement>("[data-avatar-group]")!,
    panel = root.querySelector<HTMLElement>("[data-members]")!,
    trigger = root.querySelector<HTMLButtonElement>("[data-members-open]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!;
  const show = (mode: string) => {
    single.hidden = mode === "group" || mode === "expanded";
    group.hidden = !single.hidden;
    image.hidden = mode === "fallback" || mode === "missing";
    fallback.hidden = !image.hidden;
    fallback.textContent = mode === "missing" ? "?" : "민지";
    single.querySelector("strong")!.textContent =
      mode === "missing" ? "알 수 없는 사용자" : "민지";
    single.querySelector("small")!.textContent =
      mode === "missing" ? "사용자 정보 없음" : "프로덕트 디자이너";
    single.setAttribute(
      "aria-label",
      mode === "missing" ? "이름을 알 수 없는 사용자" : "민지 프로필",
    );
    panel.hidden = mode !== "expanded";
    trigger.setAttribute("aria-expanded", String(!panel.hidden));
    status.textContent =
      mode === "fallback"
        ? "사진을 불러오지 못하면 이름으로 표시해요."
        : mode === "missing"
          ? "이름과 사진이 없으면 기본 아이콘과 설명을 제공해요."
          : mode === "group" || mode === "expanded"
            ? "6명 중 3명만 표시하고 +3으로 전체를 확인해요."
            : "이미지와 이름으로 사용자를 구분해요.";
  };
  const api = createScenarioController(
    root,
    {
      default: () => show("default"),
      fallback: () => show("fallback"),
      missing: () => show("missing"),
      group: () => show("group"),
      expanded: () => show("expanded"),
    },
    preview,
  );
  api.on(image, "error", () => {
    show("fallback");
    api.state("fallback");
  });
  api.on(root, "click", (event: MouseEvent) => {
    const kind = (event.target as Element).closest<HTMLElement>(
      "[data-avatar-mode]",
    )?.dataset.avatarMode;
    if (kind) api.set(kind, true);
  });
  api.on(trigger, "click", () => {
    const next = panel.hidden ? "expanded" : "group";
    show(next);
    api.state(next);
    if (next === "expanded")
      panel.querySelector<HTMLButtonElement>("button")?.focus();
  });
  const close = () => {
    show("group");
    api.state("group");
    trigger.focus();
  };
  api.on(root.querySelector("[data-members-close]")!, "click", close);
  api.on(root, "keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && !panel.hidden) {
      event.preventDefault();
      close();
    }
  });
  api.on(document, "pointerdown", (event: PointerEvent) => {
    if (!panel.hidden && !group.contains(event.target as Node)) {
      show("group");
      api.state("group");
    }
  });
  api.set("default", true);
  api.ready();
  return api;
}
export function AvatarScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    uid = useId();
  useExpansion(
    root,
    attachAvatar,
    preview,
    ["default", "fallback", "group", "expanded"][
      Math.min(3, Math.floor(time / 1200))
    ],
  );
  const portrait =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#dce9ff"/><circle cx="50" cy="38" r="18" fill="#6591dc"/><path d="M15 100c0-42 70-42 70 0" fill="#365e9e"/></svg>',
    );
  return (
    <ExpansionFrame
      root={root}
      kind="avatar"
      title="함께 만드는 사람들"
      preview={preview}
    >
      <div
        data-avatar-single
        className="expansion-avatar-person"
        role="img"
        aria-label="민지 프로필"
      >
        <span className="expansion-avatar">
          <img data-avatar-image src={portrait} alt="" />
          <span data-avatar-fallback hidden>
            민지
          </span>
        </span>
        <span>
          <strong>민지</strong>
          <small>프로덕트 디자이너</small>
        </span>
      </div>
      <div data-avatar-group className="expansion-avatar-group" hidden>
        <div className="expansion-avatar-stack">
          <span className="expansion-avatar">민지</span>
          <span className="expansion-avatar">서준</span>
          <span className="expansion-avatar">지우</span>
          <button
            data-members-open
            className="expansion-avatar"
            aria-label="나머지 참여자 3명 보기"
            aria-expanded="false"
            aria-controls={`${uid}-members`}
          >
            +3
          </button>
        </div>
        <div
          data-members
          id={`${uid}-members`}
          className="expansion-members"
          hidden
        >
          <div>
            <strong>전체 참여자 6명</strong>
            <button data-members-close aria-label="참여자 목록 닫기">
              <ExpansionIcon kind="close" />
            </button>
          </div>
          <ul>
            {["민지", "서준", "지우", "하린", "도윤", "서연"].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="expansion-controls">
        <button data-avatar-mode="default">사진</button>
        <button data-avatar-mode="fallback">사진 실패</button>
        <button data-avatar-mode="missing">정보 없음</button>
        <button data-avatar-mode="group">참여자 그룹</button>
      </div>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        이미지와 이름으로 사용자를 구분해요.
      </p>
    </ExpansionFrame>
  );
}
export function attachCommand(root: HTMLElement, preview = false) {
  const dialog = root.querySelector<HTMLDialogElement>("dialog")!,
    open = root.querySelector<HTMLButtonElement>("[data-command-open]")!,
    input = root.querySelector<HTMLInputElement>("[data-query]")!,
    list = root.querySelector<HTMLElement>("[data-results]")!,
    empty = root.querySelector<HTMLElement>("[data-empty]")!,
    feedback = root.querySelector<HTMLElement>("[data-command-feedback]")!,
    retry = root.querySelector<HTMLButtonElement>("[data-retry]")!,
    metrics = root.querySelector<HTMLElement>("[data-query-metrics]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!;
  const commands = [
    ["new", "새 문서 만들기", "문서 생성"],
    ["home", "대시보드로 이동", "홈 메인 페이지"],
    ["notes", "디자인 노트 열기", "기록 디자인 문서"],
    ["settings", "설정 열기", "환경설정"],
    ["theme", "테마 변경", "밝은 어두운"],
    ["members", "팀원 보기", "사용자 참여자"],
    ["search", "전체 검색", "자료 찾기"],
    ["help", "도움말 열기", "가이드 사용법"],
  ];
  let results = commands,
    active = 0,
    busy = false,
    last = "new";
  const announce = (text: string) => {
    feedback.textContent = text;
  };
  const render = () => {
    const query = input.value.trim().normalize("NFKC").toLocaleLowerCase();
    results = commands.filter((c) =>
      `${c[1]} ${c[2]}`.normalize("NFKC").toLocaleLowerCase().includes(query),
    );
    active = Math.max(0, Math.min(active, results.length - 1));
    list.replaceChildren();
    for (const [index, item] of results.entries()) {
      const option = document.createElement("div");
      option.id = `${list.id}-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === active));
      option.dataset.command = item[0];
      option.textContent = item[1];
      list.append(option);
    }
    empty.hidden = results.length > 0;
    input.setAttribute("aria-expanded", String(!dialog.hidden));
    if (results.length)
      input.setAttribute("aria-activedescendant", `${list.id}-${active}`);
    else input.removeAttribute("aria-activedescendant");
    metrics.textContent = formatTextMetrics(input.value);
    if (!preview)
      list
        .querySelector('[aria-selected="true"]')
        ?.scrollIntoView({ block: "nearest" });
  };
  const show = () => {
    dialog.hidden = false;
    if (!preview && !dialog.open) dialog.showModal();
    render();
    if (!preview) input.focus();
  };
  const close = () => {
    api.cancel();
    busy = false;
    input.disabled = false;
    dialog.close();
    dialog.hidden = true;
    input.setAttribute("aria-expanded", "false");
    if (!preview) open.focus();
    api.state("default");
  };
  const loading = () => {
    busy = true;
    input.disabled = true;
    retry.hidden = true;
    announce("명령을 실행하는 중이에요.");
  };
  const failed = () => {
    busy = false;
    input.disabled = false;
    retry.hidden = false;
    announce("명령을 실행하지 못했어요. 검색어와 선택한 명령을 유지했습니다.");
  };
  const execute = (id: string) => {
    if (busy || !commands.some((c) => c[0] === id)) return;
    last = id;
    loading();
    api.state("loading");
    api.later(() => {
      if (fail.checked) {
        fail.checked = false;
        failed();
        api.state("error");
        input.focus();
        return;
      }
      const command = commands.find((c) => c[0] === last)!;
      status.textContent = `${command[1]} 명령을 실행했어요. 외부 페이지로 이동하지 않는 예제입니다.`;
      close();
    }, 600);
  };
  const reset = (query = "") => {
    busy = false;
    input.disabled = false;
    input.value = query;
    active = 0;
    retry.hidden = true;
    announce("방향키로 고르고 Enter로 실행하세요.");
    show();
  };
  const api = createScenarioController(
    root,
    {
      default: () => {
        dialog.close();
        dialog.hidden = true;
        input.disabled = false;
        busy = false;
        retry.hidden = true;
        input.value = "";
        active = 0;
        status.textContent =
          "예: 디자인, 설정, 새 문서 · Ctrl+K / ⌘K로도 열 수 있어요.";
      },
      open: () => reset(),
      empty: () => reset("없는 명령"),
      loading: () => {
        reset();
        loading();
        api.later(() => {
          busy = false;
          input.disabled = false;
          announce("예제 로딩이 끝났어요. 명령을 선택해 보세요.");
          api.state("open");
          if (!preview) input.focus();
        }, 900);
      },
      error: () => {
        reset("문서");
        failed();
      },
    },
    preview,
  );
  api.on(open, "click", () => {
    reset();
    api.state("open");
  });
  api.on(root.querySelector("[data-command-close]")!, "click", close);
  api.on(dialog, "cancel", (e: Event) => {
    e.preventDefault();
    close();
  });
  api.on(dialog, "click", (e: MouseEvent) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        close();
    }
  });
  api.on(document, "keydown", (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (dialog.open) close();
      else {
        reset();
        api.state("open");
      }
    }
  });
  api.on(input, "input", () => {
    active = 0;
    render();
    retry.hidden = true;
    announce(
      results.length
        ? `${results.length}개 명령을 찾았어요.`
        : "검색어를 바꾸거나 지워보세요.",
    );
    api.state(results.length ? "open" : "empty");
  });
  api.on(input, "keydown", (e: KeyboardEvent) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) {
        active =
          (active + (e.key === "ArrowDown" ? 1 : results.length - 1)) %
          results.length;
        render();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) execute(results[active][0]);
    }
  });
  api.on(list, "pointermove", (e: PointerEvent) => {
    const item = (e.target as Element).closest<HTMLElement>("[data-command]");
    const next = results.findIndex((c) => c[0] === item?.dataset.command);
    if (next >= 0 && active !== next) {
      active = next;
      render();
    }
  });
  api.on(list, "click", (e: MouseEvent) => {
    const id = (e.target as Element).closest<HTMLElement>("[data-command]")
      ?.dataset.command;
    if (id) execute(id);
  });
  api.on(retry, "click", () => execute(last));
  api.set("default", true);
  api.ready();
  return api;
}
export function CommandScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    uid = useId();
  useExpansion(
    root,
    attachCommand,
    preview,
    ["default", "open", "empty", "error"][Math.min(3, Math.floor(time / 1200))],
  );
  return (
    <ExpansionFrame
      root={root}
      kind="command-palette"
      title="찾아서 바로 실행하기"
      preview={preview}
    >
      <button data-command-open className="expansion-command-trigger">
        <ExpansionIcon kind="search" />
        <span>명령이나 페이지 검색</span>
        <kbd>⌘K</kbd>
      </button>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        예: 디자인, 설정, 새 문서 · Ctrl+K / ⌘K
      </p>
      <dialog
        hidden
        className="expansion-command-dialog"
        aria-labelledby={`${uid}-title`}
      >
        <div className="expansion-dialog-heading">
          <h3 id={`${uid}-title`}>명령 팔레트</h3>
          <button data-command-close aria-label="명령 팔레트 닫기">
            <ExpansionIcon kind="close" />
          </button>
        </div>
        <label className="expansion-label">
          검색어
          <input
            data-query
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="false"
            aria-controls={`${uid}-results`}
            placeholder="예: 디자인, 설정, 새 문서"
            autoComplete="off"
          />
        </label>
        <p data-query-metrics className="expansion-metrics">
          0자 · 0 byte (UTF-8)
        </p>
        <div
          data-results
          id={`${uid}-results`}
          className="expansion-command-results"
          role="listbox"
          aria-label="실행할 명령"
        />
        <p data-empty hidden>
          일치하는 명령이 없어요. 검색어를 바꿔보세요.
        </p>
        <p
          data-command-feedback
          className="expansion-status"
          role={preview ? undefined : "status"}
        >
          방향키로 고르고 Enter로 실행하세요.
        </p>
        <button data-retry hidden>
          다시 실행
        </button>
        <label className="expansion-check">
          <input data-fail type="checkbox" />
          다음 실행 실패 모의
        </label>
      </dialog>
    </ExpansionFrame>
  );
}
export function attachContext(root: HTMLElement, preview = false) {
  const area = root.querySelector<HTMLElement>("[data-context-target]")!,
    trigger = root.querySelector<HTMLButtonElement>("[data-context-open]")!,
    menu = root.querySelector<HTMLElement>("[data-context-menu]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!,
    undo = root.querySelector<HTMLButtonElement>("[data-context-undo]")!,
    lock = root.querySelector<HTMLInputElement>("[data-context-lock]")!,
    note = root.querySelector<HTMLElement>("[data-context-note]")!;
  const editor = root.querySelector<HTMLElement>("[data-context-editor]")!,
    nameInput = root.querySelector<HTMLInputElement>("[data-context-name]")!,
    nameMetrics = root.querySelector<HTMLElement>("[data-name-metrics]")!;
  let archived = false,
    title = "이번 주 디자인 노트";
  const items = () =>
    Array.from(
      menu.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
    );
  const hide = (focus = true) => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (focus && !preview) trigger.focus();
  };
  const render = () => {
    note.textContent = archived ? `${title} · 보관됨` : title;
    trigger.setAttribute(
      "aria-label",
      archived ? "보관된 노트 작업 메뉴" : "노트 작업 메뉴",
    );
    root.querySelector<HTMLButtonElement>(
      '[data-context-action="archive"]',
    )!.disabled = lock.checked || archived;
    undo.hidden = !archived;
  };
  const open = (x?: number, y?: number) => {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    menu.style.left = "0px";
    menu.style.top = "0px";
    render();
    const r = area.getBoundingClientRect(),
      bounds = root.getBoundingClientRect(),
      mr = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(4, Math.min((x ?? r.left + 20) - bounds.left, Math.min(bounds.width, window.innerWidth - bounds.left) - mr.width - 8))}px`;
    menu.style.top = `${Math.max(4, Math.min((y ?? r.top + 45) - bounds.top, window.innerHeight - bounds.top - mr.height - 8))}px`;
    if (!preview) items()[0]?.focus();
  };
  const reset = () => {
    archived = false;
    title = "이번 주 디자인 노트";
    editor.hidden = true;
    lock.checked = false;
    render();
    hide(false);
    status.textContent =
      "행을 우클릭하거나 더보기 버튼을 누르세요. Shift+F10도 사용할 수 있어요.";
  };
  const api = createScenarioController(
    root,
    {
      default: reset,
      open: () => {
        reset();
        open();
      },
      disabled: () => {
        reset();
        lock.checked = true;
        open();
        status.textContent =
          "보관 권한이 없는 예제입니다. 다른 작업은 사용할 수 있어요.";
      },
      archived: () => {
        reset();
        archived = true;
        render();
        hide(false);
        status.textContent = "노트를 보관했어요. 보관 취소로 되돌릴 수 있어요.";
      },
      edge: () => {
        reset();
        const r = area.getBoundingClientRect();
        open(r.right - 2, r.bottom - 2);
      },
    },
    preview,
  );
  api.on(trigger, "click", () => {
    if (!menu.hidden) {
      hide();
      api.state("default");
    } else {
      open();
      api.state("open");
    }
  });
  api.on(area, "contextmenu", (e: MouseEvent) => {
    e.preventDefault();
    open(e.clientX, e.clientY);
    api.state("open");
  });
  api.on(area, "keydown", (e: KeyboardEvent) => {
    if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
      e.preventDefault();
      open();
      api.state("open");
    }
  });
  api.on(menu, "keydown", (e: KeyboardEvent) => {
    const a = items(),
      index = a.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      hide();
      api.state("default");
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? a.length - 1
            : (index + (e.key === "ArrowDown" ? 1 : a.length - 1)) % a.length;
      a[next]?.focus();
    } else if (e.key === "Tab") {
      hide(false);
      api.state("default");
    }
  });
  api.on(menu, "click", (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLButtonElement>(
      "[data-context-action]",
    );
    if (!button || button.disabled) return;
    const action = button.dataset.contextAction;
    hide();
    if (action === "archive") {
      archived = true;
      render();
      status.textContent = "노트를 보관했어요. 아래에서 취소할 수 있어요.";
      api.state("archived");
    } else {
      if (action === "rename") {
        editor.hidden = false;
        nameInput.value = title;
        nameMetrics.textContent = formatTextMetrics(title, 30);
        nameInput.focus();
        status.textContent = "이름을 2~30자로 바꾸거나 취소하세요.";
      } else
        status.textContent =
          "복사를 모의 실행했어요. 실제 클립보드를 바꾸지 않습니다.";
      api.state("default");
    }
  });
  const cancelName = () => {
    editor.hidden = true;
    trigger.focus();
    status.textContent = "이름 변경을 취소했어요.";
  };
  const saveName = () => {
    const value = nameInput.value.trim();
    const count = measureText(value).characters;
    if (count < 2 || count > 30) {
      status.textContent =
        "이름은 2~30자로 입력하세요. 입력 내용은 유지됩니다.";
      nameInput.setAttribute("aria-invalid", "true");
      nameInput.focus();
      return;
    }
    title = value;
    editor.hidden = true;
    nameInput.removeAttribute("aria-invalid");
    render();
    status.textContent = "노트 이름을 변경했어요.";
    trigger.focus();
  };
  api.on(nameInput, "input", () => {
    nameMetrics.textContent = formatTextMetrics(nameInput.value, 30);
    nameInput.removeAttribute("aria-invalid");
  });
  api.on(nameInput, "keydown", (e: KeyboardEvent) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") {
      e.preventDefault();
      saveName();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelName();
    }
  });
  api.on(root.querySelector("[data-context-save-name]")!, "click", saveName);
  api.on(
    root.querySelector("[data-context-cancel-name]")!,
    "click",
    cancelName,
  );
  api.on(undo, "click", () => {
    archived = false;
    render();
    status.textContent = "보관을 취소했어요.";
    trigger.focus();
    api.state("default");
  });
  api.on(lock, "change", () => {
    render();
    api.state(lock.checked ? "disabled" : "default");
  });
  api.on(document, "pointerdown", (e: PointerEvent) => {
    if (
      !menu.hidden &&
      !menu.contains(e.target as Node) &&
      !trigger.contains(e.target as Node)
    ) {
      hide(false);
      api.state(archived ? "archived" : "default");
    }
  });
  api.on(window, "resize", () => {
    // The parent's state help can resize this iframe. Keep the open state and
    // recompute its position instead of closing/reopening in a feedback loop.
    if (!menu.hidden) open();
  });
  api.set("default", true);
  api.ready();
  return api;
}
export function ContextScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    uid = useId();
  useExpansion(
    root,
    attachContext,
    preview,
    ["default", "open", "disabled", "archived"][
      Math.min(3, Math.floor(time / 1200))
    ],
  );
  return (
    <ExpansionFrame
      root={root}
      kind="context-menu"
      title="대상에 맞는 작업 메뉴"
      preview={preview}
    >
      <div
        data-context-target
        className="expansion-context-target"
        tabIndex={0}
        aria-label="디자인 노트 작업 대상"
      >
        <div>
          <strong data-context-note>이번 주 디자인 노트</strong>
          <p>우클릭 · Shift+F10 · 더보기</p>
        </div>
        <button
          data-context-open
          aria-haspopup="menu"
          aria-label="노트 작업 메뉴"
          aria-expanded="false"
          aria-controls={`${uid}-menu`}
        >
          <ExpansionIcon kind="more" />
        </button>
      </div>
      <div
        data-context-menu
        id={`${uid}-menu`}
        className="expansion-context-menu"
        role="menu"
        aria-label="노트 작업"
        hidden
      >
        <button role="menuitem" data-context-action="copy">
          사본 복사
        </button>
        <button role="menuitem" data-context-action="rename">
          이름 변경
        </button>
        <button role="menuitem" data-context-action="archive">
          보관하기
        </button>
      </div>
      <label className="expansion-check">
        <input data-context-lock type="checkbox" />
        보관 권한 없음 모의
      </label>
      <div data-context-editor hidden>
        <label className="expansion-label">
          노트 이름
          <input data-context-name autoComplete="off" />
        </label>
        <p data-name-metrics className="expansion-metrics">
          0 / 30자 · 0 byte (UTF-8)
        </p>
        <div className="expansion-controls">
          <button data-context-save-name>이름 저장</button>
          <button data-context-cancel-name>취소</button>
        </div>
      </div>
      <button data-context-undo hidden>
        보관 취소
      </button>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        행을 우클릭하거나 더보기 버튼을 누르세요.
      </p>
    </ExpansionFrame>
  );
}
export function attachSplit(root: HTMLElement, preview = false) {
  const main = root.querySelector<HTMLButtonElement>("[data-main-save]")!,
    trigger = root.querySelector<HTMLButtonElement>("[data-save-options]")!,
    menu = root.querySelector<HTMLElement>("[data-save-menu]")!,
    status = root.querySelector<HTMLElement>("[data-status]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!;
  let busy = false,
    last = "현재 문서";
  const close = (focus = false) => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (focus && !preview) trigger.focus();
  };
  const setBusy = (value: boolean) => {
    busy = value;
    main.disabled = value;
    trigger.disabled = value;
    main.textContent = value ? "저장 중…" : "저장";
    root.setAttribute("aria-busy", String(value));
  };
  const success = () => {
    setBusy(false);
    status.textContent = `${last} 저장을 완료했어요.`;
    status.dataset.tone = "success";
  };
  const failed = () => {
    setBusy(false);
    status.textContent =
      "저장하지 못했어요. 입력은 유지됩니다. 저장 버튼으로 다시 시도하세요.";
    status.dataset.tone = "error";
  };
  const save = (label: string) => {
    if (busy) return;
    last = label;
    close();
    setBusy(true);
    status.textContent = `${label} 저장 중이에요.`;
    delete status.dataset.tone;
    api.state("saving");
    api.later(() => {
      if (fail.checked) {
        fail.checked = false;
        failed();
        api.state("error");
      } else {
        success();
        api.state("success");
      }
      if (!preview) main.focus();
    }, 650);
  };
  const reset = () => {
    setBusy(false);
    close();
    fail.checked = false;
    delete status.dataset.tone;
    status.textContent = "저장은 바로 실행하고, 화살표는 추가 옵션만 열어요.";
  };
  const api = createScenarioController(
    root,
    {
      default: reset,
      open: () => {
        reset();
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
      },
      saving: () => {
        reset();
        setBusy(true);
        status.textContent = "현재 문서 저장 중이에요.";
        api.later(() => {
          success();
          api.state("success");
        }, 900);
      },
      success: () => {
        reset();
        last = "현재 문서";
        success();
      },
      error: () => {
        reset();
        failed();
      },
    },
    preview,
  );
  api.on(main, "click", () => save("현재 문서"));
  api.on(trigger, "click", () => {
    if (menu.hidden) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      menu.querySelector<HTMLButtonElement>("button")?.focus();
      api.state("open");
    } else {
      close(true);
      api.state("default");
    }
  });
  api.on(menu, "click", (e: MouseEvent) => {
    const label = (e.target as Element).closest<HTMLElement>("[data-save-kind]")
      ?.dataset.saveKind;
    if (label) save(label);
  });
  api.on(menu, "keydown", (e: KeyboardEvent) => {
    const a = Array.from(menu.querySelectorAll<HTMLButtonElement>("button")),
      index = a.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      api.state("default");
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const n =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? a.length - 1
            : (index + (e.key === "ArrowDown" ? 1 : a.length - 1)) % a.length;
      a[n]?.focus();
    } else if (e.key === "Tab") {
      close();
      api.state("default");
    }
  });
  api.on(document, "pointerdown", (e: PointerEvent) => {
    if (
      !menu.hidden &&
      !menu.contains(e.target as Node) &&
      !trigger.contains(e.target as Node)
    ) {
      close();
      api.state("default");
    }
  });
  api.set("default", true);
  api.ready();
  return api;
}
export function SplitButtonScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    uid = useId();
  useExpansion(
    root,
    attachSplit,
    preview,
    ["default", "open", "saving", "success"][
      Math.min(3, Math.floor(time / 1200))
    ],
  );
  return (
    <ExpansionFrame
      root={root}
      kind="split-button"
      title="바로 저장하거나 옵션 고르기"
      preview={preview}
    >
      <div className="expansion-note">
        <strong>새로운 서비스 아이디어</strong>
        <p>기본 동작과 추가 작업을 구분해 보세요.</p>
      </div>
      <div className="expansion-split-wrap">
        <div className="expansion-split">
          <button data-main-save>저장</button>
          <button
            data-save-options
            aria-label="추가 저장 옵션"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-controls={`${uid}-options`}
          >
            <ExpansionIcon kind="down" />
          </button>
        </div>
        <div
          data-save-menu
          id={`${uid}-options`}
          className="expansion-save-menu"
          role="menu"
          aria-label="저장 옵션"
          hidden
        >
          <button role="menuitem" data-save-kind="다른 이름의 문서">
            다른 이름으로 저장
          </button>
          <button role="menuitem" data-save-kind="문서 사본">
            사본 저장
          </button>
        </div>
      </div>
      <label className="expansion-check">
        <input data-fail type="checkbox" />
        다음 저장 실패 모의
      </label>
      <p
        data-status
        className="expansion-status"
        role={preview ? undefined : "status"}
      >
        저장은 바로 실행하고, 화살표는 추가 옵션만 열어요.
      </p>
    </ExpansionFrame>
  );
}

export function attachPassword(root: HTMLElement, preview = false) {
  const input = root.querySelector<HTMLInputElement>("[data-password]")!,
    toggle = root.querySelector<HTMLButtonElement>("[data-reveal]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!,
    metrics = root.querySelector<HTMLElement>("[data-metrics]")!;
  const mode = root.querySelector<HTMLSelectElement>("[data-password-mode]")!;
  const changeMode = () => {
    input.autocomplete =
      mode.value === "login" ? "current-password" : "new-password";
    root.querySelector<HTMLElement>("[data-password-rules]")!.hidden =
      mode.value === "login";
    root.querySelector<HTMLElement>("[data-password-help]")!.textContent =
      mode.value === "login"
        ? "로그인 예제 · 아무 값이나 입력해 표시·숨기기를 비교하세요. 실제 인증은 하지 않습니다."
        : "연습용 값 Travel2026! · 영문과 숫자를 포함한 8자 이상";
    result.textContent = "";
    input.removeAttribute("aria-invalid");
  };
  const check = () => ({
    length: measureText(input.value).characters >= 8,
    letter: /[a-zA-Z]/.test(input.value),
    number: /[0-9]/.test(input.value),
  });
  const render = () => {
    metrics.textContent = formatTextMetrics(input.value);
    for (const [key, valid] of Object.entries(check())) {
      const item = root.querySelector<HTMLElement>(`[data-rule="${key}"]`)!;
      item.dataset.valid = String(valid);
      item.textContent = `${valid ? "✓" : "○"} ${key === "length" ? "8자 이상" : key === "letter" ? "영문 포함" : "숫자 포함"}`;
    }
    toggle.textContent = input.type === "password" ? "표시" : "숨기기";
    toggle.setAttribute(
      "aria-label",
      input.type === "password" ? "비밀번호 표시" : "비밀번호 숨기기",
    );
    toggle.setAttribute("aria-pressed", String(input.type === "text"));
  };
  const set = (value: string, visible = false, message = "") => {
    mode.value = "new";
    changeMode();
    input.value = value;
    input.type = visible ? "text" : "password";
    result.textContent = message;
    input.removeAttribute("aria-invalid");
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => set(""),
      empty: () => set(""),
      masked: () => set("Travel2026!"),
      visible: () => set("Travel2026!", true),
      invalid: () => {
        set("abc", false, "영문과 숫자를 포함해 8자 이상 입력하세요.");
        input.setAttribute("aria-invalid", "true");
      },
      valid: () =>
        set(
          "Travel2026!",
          false,
          "예제 조건을 충족했어요. 실제 계정에는 저장하지 않습니다.",
        ),
    },
    preview,
  );
  controller.on(input, "input", () => {
    render();
    result.textContent = "";
    input.removeAttribute("aria-invalid");
    controller.state(
      input.type === "text" ? "visible" : input.value ? "masked" : "empty",
    );
  });
  controller.on(toggle, "click", () => {
    const start = input.selectionStart,
      end = input.selectionEnd;
    input.type = input.type === "password" ? "text" : "password";
    render();
    input.focus();
    if (start !== null) input.setSelectionRange(start, end);
    controller.state(input.type === "text" ? "visible" : "masked");
  });
  controller.on(root.querySelector("form")!, "submit", (event: SubmitEvent) => {
    event.preventDefault();
    const valid =
      mode.value === "login"
        ? !!input.value
        : Object.values(check()).every(Boolean);
    input.setAttribute("aria-invalid", String(!valid));
    result.textContent = valid
      ? "예제 조건을 충족했어요. 실제 계정에는 저장하지 않습니다."
      : mode.value === "login"
        ? "비밀번호를 입력하세요. 실제 계정 인증은 진행하지 않습니다."
        : "영문과 숫자를 포함해 8자 이상 입력하세요.";
    controller.state(valid ? "valid" : "invalid");
    if (!valid) input.focus();
  });
  controller.on(mode, "change", () => {
    changeMode();
    controller.state("default");
  });
  controller.on(input, "keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.isComposing || event.keyCode === 229))
      event.preventDefault();
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function PasswordScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachPassword,
    preview,
    ["empty", "masked", "visible", "valid"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="password-field"
      title="새 비밀번호 설정"
      root={root}
      preview={preview}
    >
      <label className="expansion-label">
        입력 용도
        <select data-password-mode defaultValue="new">
          <option value="new">새 비밀번호 설정</option>
          <option value="login">로그인</option>
        </select>
      </label>
      <form noValidate>
        <label className="input-demo-label" htmlFor={id}>
          비밀번호 <span>(필수)</span>
        </label>
        <p id={`${id}-help`} data-password-help className="input-demo-help">
          연습용 값 Travel2026!을 입력해 보세요.
        </p>
        <div className="input-demo-inline">
          <input
            id={id}
            data-password
            type="password"
            autoComplete="new-password"
            aria-describedby={`${id}-help ${id}-rules ${id}-result`}
          />
          <button
            type="button"
            data-reveal
            aria-label="비밀번호 표시"
            aria-pressed="false"
          >
            표시
          </button>
        </div>
        <div
          className="input-demo-rules"
          data-password-rules
          id={`${id}-rules`}
        >
          <span data-rule="length">○ 8자 이상</span>
          <span data-rule="letter">○ 영문 포함</span>
          <span data-rule="number">○ 숫자 포함</span>
        </div>
        <small className="input-demo-metrics" data-metrics>
          0자 · 0 byte (UTF-8)
        </small>
        <button type="submit" className="demo-primary">
          조건 확인
        </button>
        <p
          className="input-demo-result"
          id={`${id}-result`}
          data-result
          role="status"
        />
      </form>
    </ExpansionFrame>
  );
}
export function attachOtp(root: HTMLElement, preview = false) {
  const input = root.querySelector<HTMLInputElement>("[data-otp]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!,
    resend = root.querySelector<HTMLButtonElement>("[data-resend]")!,
    verify = root.querySelector<HTMLButtonElement>("[data-verify]")!,
    clock = root.querySelector<HTMLElement>("[data-clock]")!,
    metrics = root.querySelector<HTMLElement>("[data-metrics]")!;
  let expires = 0,
    cooldown = 0,
    expired = false,
    complete = false;
  const render = () => {
    root.querySelectorAll<HTMLElement>("[data-slot]").forEach((slot, i) => {
      slot.textContent = input.value[i] || "·";
      slot.dataset.active = String(
        i === Math.min(input.selectionStart ?? input.value.length, 5),
      );
    });
    metrics.textContent = formatTextMetrics(input.value, 6);
    verify.disabled = input.value.length !== 6 || expired || complete;
    const left = Math.max(0, Math.ceil((expires - Date.now()) / 1000)),
      wait = Math.max(0, Math.ceil((cooldown - Date.now()) / 1000));
    clock.textContent = expired
      ? "유효 시간이 만료됐어요. 재전송하세요."
      : complete
        ? "인증 완료"
        : `유효 시간 ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    resend.disabled = wait > 0;
    resend.textContent = wait ? `재전송 (${wait}초)` : "인증번호 재전송";
  };
  const tick = () => {
    if (!expired && !complete && Date.now() >= expires) {
      expired = true;
      result.textContent = "코드가 만료됐어요. 재전송 후 새 코드를 입력하세요.";
      controller.state("expired");
    }
    render();
    if (!complete && (!expired || cooldown > Date.now()))
      controller.later(tick, 250);
  };
  const setup = (value = "", state = "editing") => {
    controller.cancel();
    input.value = value;
    expired = state === "expired";
    complete = false;
    expires = Date.now() + 120000;
    cooldown = state === "expired" ? Date.now() + 5000 : 0;
    input.removeAttribute("aria-invalid");
    result.textContent =
      state === "error"
        ? "번호가 일치하지 않아요. 예제 코드 123456을 입력하세요."
        : state === "expired"
          ? "만료된 코드는 사용할 수 없어요. 재전송 대기 후 다시 요청하세요."
          : "";
    if (state === "error") input.setAttribute("aria-invalid", "true");
    render();
    controller.later(tick, 250);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(),
      editing: () => setup("12"),
      complete: () => setup("123456"),
      error: () => setup("654321", "error"),
      expired: () => setup("123456", "expired"),
      success: () => {
        setup("123456");
        complete = true;
        result.textContent =
          "인증을 모의 완료했어요. 실제 문자·계정은 변경하지 않습니다.";
        render();
      },
    },
    preview,
  );
  controller.on(input, "input", (e: InputEvent) => {
    if (e.isComposing) return;
    const position = input.selectionStart ?? input.value.length,
      before = input.value.slice(0, position).replace(/[^0-9]/g, "").length;
    input.value = input.value.replace(/[^0-9]/g, "").slice(0, 6);
    input.setSelectionRange(Math.min(before, 6), Math.min(before, 6));
    complete = false;
    input.removeAttribute("aria-invalid");
    result.textContent = "";
    render();
    controller.state(
      expired ? "expired" : input.value.length === 6 ? "complete" : "editing",
    );
  });
  controller.on(input, "keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.isComposing || event.keyCode === 229))
      event.preventDefault();
  });
  controller.on(input, "click", render);
  controller.on(input, "keyup", render);
  controller.on(input, "compositionend", () =>
    input.dispatchEvent(new Event("input", { bubbles: true })),
  );
  controller.on(root.querySelector("form")!, "submit", (e: SubmitEvent) => {
    e.preventDefault();
    if (!expired && Date.now() >= expires) {
      expired = true;
      result.textContent = "코드가 만료됐어요. 재전송 후 새 코드를 입력하세요.";
      render();
      controller.state("expired");
    }
    if (expired || complete || input.value.length !== 6) return;
    if (input.value === "123456") {
      complete = true;
      result.textContent =
        "인증을 모의 완료했어요. 실제 문자·계정은 변경하지 않습니다.";
      controller.state("success");
    } else {
      input.setAttribute("aria-invalid", "true");
      result.textContent =
        "번호가 일치하지 않아요. 예제 코드 123456을 입력하세요.";
      controller.state("error");
      input.focus();
    }
    render();
  });
  controller.on(resend, "click", () => {
    if (Date.now() < cooldown) return;
    setup();
    cooldown = Date.now() + 5000;
    result.textContent =
      "새 예제 코드 123456을 발급했어요. 5초 후 재전송할 수 있어요.";
    render();
    controller.state("editing");
    input.focus();
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function OtpScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachOtp,
    preview,
    ["default", "editing", "complete", "success"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="otp-input"
      title="인증번호 확인"
      root={root}
      preview={preview}
    >
      <form noValidate>
        <label className="input-demo-label" htmlFor={id}>
          6자리 인증번호
        </label>
        <p className="input-demo-help" id={`${id}-help`}>
          예제 코드: 123456 · 실제 문자 발송 없음
        </p>
        <div className="input-demo-otp">
          <div className="input-demo-slots" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <span data-slot key={i}>
                ·
              </span>
            ))}
          </div>
          <input
            data-otp
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-describedby={`${id}-help ${id}-result`}
            aria-label="6자리 인증번호"
          />
        </div>
        <small data-metrics className="input-demo-metrics">
          0 / 6자 · 0 byte (UTF-8)
        </small>
        <p data-clock className="input-demo-help">
          유효 시간 2:00
        </p>
        <div className="expansion-controls">
          <button data-verify className="demo-primary" type="submit">
            인증 확인
          </button>
          <button data-resend type="button">
            인증번호 재전송
          </button>
        </div>
        <p
          data-result
          id={`${id}-result`}
          className="input-demo-result"
          role="status"
        />
      </form>
    </ExpansionFrame>
  );
}

export function attachMultiSelect(root: HTMLElement, preview = false) {
  const input = root.querySelector<HTMLInputElement>("[data-query]")!,
    list = root.querySelector<HTMLElement>("[data-options]")!,
    chips = root.querySelector<HTMLElement>("[data-tokens]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!,
    free = root.querySelector<HTMLInputElement>("[data-free]")!;
  const options = [
    { id: "plan", label: "기획" },
    { id: "design", label: "디자인" },
    { id: "front", label: "프론트엔드" },
    { id: "back", label: "백엔드" },
  ];
  let selected: typeof options = [],
    active = -1,
    opened = false,
    candidates: typeof options = [];
  const normalize = (v: string) =>
    v.normalize("NFKC").trim().toLocaleLowerCase();
  const render = () => {
    chips.replaceChildren();
    for (const item of selected) {
      const token = document.createElement("button");
      token.type = "button";
      token.className = "input-demo-token";
      token.dataset.remove = item.id;
      token.setAttribute("aria-label", `${item.label} 선택 제거`);
      token.textContent = `${item.label} ×`;
      chips.append(token);
    }
    const query = normalize(input.value);
    candidates = options.filter(
      (o) =>
        !selected.some((s) => s.id === o.id) &&
        normalize(o.label).includes(query),
    );
    if (
      free.checked &&
      query &&
      !options.some((o) => normalize(o.label) === query) &&
      !selected.some((o) => normalize(o.label) === query)
    )
      candidates.push({ id: `custom:${query}`, label: input.value.trim() });
    active = Math.max(-1, Math.min(active, candidates.length - 1));
    list.replaceChildren();
    candidates.forEach((o, i) => {
      const row = document.createElement("div");
      row.id = `${input.id}-option-${i}`;
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(i === active));
      row.setAttribute("aria-disabled", String(selected.length >= 3));
      row.dataset.index = String(i);
      row.textContent = o.id.startsWith("custom:")
        ? `“${o.label}” 새 태그 추가`
        : o.label;
      list.append(row);
    });
    if (!candidates.length) {
      const empty = document.createElement("p");
      empty.textContent = query
        ? "일치하는 후보가 없어요. 다른 검색어를 입력하세요."
        : "선택 가능한 후보가 없어요.";
      list.append(empty);
    }
    list.hidden = !opened;
    input.setAttribute("aria-expanded", String(opened));
    if (opened && active >= 0)
      input.setAttribute(
        "aria-activedescendant",
        `${input.id}-option-${active}`,
      );
    else input.removeAttribute("aria-activedescendant");
    root.querySelector<HTMLElement>("[data-metrics]")!.textContent =
      formatTextMetrics(input.value);
    root.querySelector<HTMLElement>("[data-count]")!.textContent =
      `${selected.length} / 3개 선택`;
  };
  const publish = () =>
    controller.state(
      selected.length === 3
        ? "limit"
        : input.value && !candidates.length
          ? "empty"
          : selected.length
            ? "selected"
            : opened
              ? "search"
              : "default",
    );
  const choose = (i: number) => {
    const item = candidates[i];
    if (!item) return;
    if (selected.length >= 3) {
      result.textContent =
        "최대 3개까지 선택할 수 있어요. 기존 항목을 먼저 제거하세요.";
      controller.state("limit");
      return;
    }
    if (!selected.some((s) => normalize(s.label) === normalize(item.label)))
      selected.push(item);
    input.value = "";
    active = 0;
    result.textContent = `${item.label} 선택. ${selected.length}개가 선택됐어요.`;
    opened = true;
    render();
    publish();
    input.focus();
  };
  const preset = (ids: string[], query = "", open = false) => {
    selected = options.filter((o) => ids.includes(o.id));
    input.value = query;
    free.checked = false;
    opened = open;
    active = 0;
    result.textContent = "";
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => preset([]),
      search: () => preset([], "디", true),
      empty: () => preset([], "서울", true),
      selected: () => preset(["plan", "design"]),
      limit: () => preset(["plan", "design", "front"], "", true),
    },
    preview,
  );
  controller.on(input, "focus", () => {
    opened = true;
    render();
  });
  controller.on(input, "input", (e: InputEvent) => {
    if (e.isComposing) return;
    opened = true;
    active = 0;
    result.textContent = "";
    render();
    publish();
  });
  controller.on(input, "compositionend", () =>
    input.dispatchEvent(new Event("input", { bubbles: true })),
  );
  controller.on(input, "keydown", (e: KeyboardEvent) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      opened = true;
      active =
        (active + (e.key === "ArrowDown" ? 1 : -1) + candidates.length) %
        Math.max(1, candidates.length);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (opened) choose(Math.max(0, active));
    } else if (e.key === "Escape") {
      opened = false;
      render();
    } else if (e.key === "Backspace" && !input.value && selected.length) {
      e.preventDefault();
      chips.querySelector<HTMLButtonElement>("button:last-child")?.focus();
    }
  });
  controller.on(list, "mousedown", (e: MouseEvent) => e.preventDefault());
  controller.on(list, "click", (e: MouseEvent) => {
    const option = (e.target as Element).closest<HTMLElement>("[data-index]");
    if (option) choose(Number(option.dataset.index));
  });
  const remove = (target: HTMLElement) => {
    const index = selected.findIndex((o) => o.id === target.dataset.remove);
    if (index < 0) return;
    const removed = selected.splice(index, 1)[0];
    result.textContent = `${removed.label} 선택을 제거했어요.`;
    render();
    publish();
    input.focus();
  };
  controller.on(chips, "click", (e: MouseEvent) => {
    const token = (e.target as Element).closest<HTMLElement>("[data-remove]");
    if (token) remove(token);
  });
  controller.on(chips, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      const token = (e.target as Element).closest<HTMLElement>("[data-remove]");
      if (token) remove(token);
    }
  });
  controller.on(free, "change", () => {
    active = 0;
    opened = true;
    render();
    publish();
  });
  controller.on(document, "pointerdown", (e: PointerEvent) => {
    if (!root.contains(e.target as Node)) {
      opened = false;
      render();
    }
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function MultiSelectScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachMultiSelect,
    preview,
    ["default", "search", "selected", "limit"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="multi-select"
      title="함께할 분야 선택"
      root={root}
      preview={preview}
    >
      <label className="input-demo-label" htmlFor={id}>
        참여 분야 <span>(최대 3개)</span>
      </label>
      <div className="input-demo-multi">
        <div data-tokens className="input-demo-tokens" />
        <input
          data-query
          id={id}
          role="combobox"
          aria-expanded="false"
          aria-controls={`${id}-options`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="예: 디자인, 프론트엔드"
        />
      </div>
      <div
        data-options
        id={`${id}-options`}
        role="listbox"
        aria-label="분야 후보"
        className="input-demo-options"
        hidden
      />
      <small data-metrics data-counter-for={id} className="input-demo-metrics">
        0자 · 0 byte (UTF-8)
      </small>
      <div className="input-demo-between">
        <span data-count>0 / 3개 선택</span>
        <label className="expansion-check">
          <input type="checkbox" data-free />새 태그 허용
        </label>
      </div>
      <p className="input-demo-help">
        검색 예시: “디” → 디자인만 표시 · “서울” → 결과 없음
      </p>
      <p data-result className="input-demo-result" role="status" />
    </ExpansionFrame>
  );
}

export function validateQuantity(value: string) {
  if (!value.trim()) return "수량을 입력하세요. 1~10개를 주문할 수 있어요.";
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number))
    return "수량은 소수 없이 정수로 입력하세요.";
  if (number < 1 || number > 10)
    return "수량은 1개 이상 10개 이하로 입력하세요.";
  return "";
}
export function attachNumber(root: HTMLElement, preview = false) {
  const input = root.querySelector<HTMLInputElement>("[data-number]")!,
    minus = root.querySelector<HTMLButtonElement>("[data-minus]")!,
    plus = root.querySelector<HTMLButtonElement>("[data-plus]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!;
  let committed = 1;
  const render = () => {
    const n = Number(input.value),
      valid = !validateQuantity(input.value);
    minus.disabled = valid && n <= 1;
    plus.disabled = valid && n >= 10;
    root.querySelector<HTMLElement>("[data-total]")!.textContent = valid
      ? `예상 금액 ${(n * 12000).toLocaleString("ko-KR")}원`
      : "유효한 수량을 입력하면 금액을 계산해요.";
  };
  const set = (v: string) => {
    input.value = v;
    result.textContent = "";
    input.removeAttribute("aria-invalid");
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => set("1"),
      minimum: () => set("1"),
      normal: () => set("4"),
      maximum: () => set("10"),
      invalid: () => {
        set("11");
        result.textContent = validateQuantity("11");
        input.setAttribute("aria-invalid", "true");
      },
    },
    preview,
  );
  const commit = () => {
    const error = validateQuantity(input.value);
    input.setAttribute("aria-invalid", String(Boolean(error)));
    result.textContent =
      error ||
      `${input.value}개로 수량을 확인했어요. 실제 주문은 하지 않습니다.`;
    if (!error) {
      committed = Number(input.value);
      controller.state(
        committed === 1 ? "minimum" : committed === 10 ? "maximum" : "normal",
      );
    } else controller.state("invalid");
    render();
  };
  const step = (delta: number) => {
    const n = validateQuantity(input.value) ? committed : Number(input.value);
    input.value = String(Math.min(10, Math.max(1, n + delta)));
    commit();
  };
  controller.on(minus, "click", () => step(-1));
  controller.on(plus, "click", () => step(1));
  controller.on(input, "input", () => {
    result.textContent = "";
    input.removeAttribute("aria-invalid");
    render();
  });
  controller.on(input, "blur", commit);
  controller.on(root.querySelector("form")!, "submit", (e: SubmitEvent) => {
    e.preventDefault();
    commit();
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function NumberScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachNumber,
    preview,
    ["minimum", "normal", "maximum", "invalid"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="number-stepper"
      title="주문 수량"
      root={root}
      preview={preview}
    >
      <form noValidate>
        <label className="input-demo-label" htmlFor={id}>
          디자인 노트 · 권당 12,000원
        </label>
        <p className="input-demo-help" id={`${id}-help`}>
          1~10개 · 1개씩 증감 · 길게 누르기는 지원하지 않아요.
        </p>
        <div className="input-demo-stepper">
          <button type="button" data-minus aria-label="수량 1개 줄이기">
            −
          </button>
          <input
            data-number
            id={id}
            type="number"
            inputMode="numeric"
            min="1"
            max="10"
            step="1"
            defaultValue="1"
            aria-describedby={`${id}-help ${id}-result`}
          />
          <button type="button" data-plus aria-label="수량 1개 늘리기">
            +
          </button>
        </div>
        <p data-total className="input-demo-help">
          예상 금액 12,000원
        </p>
        <button className="demo-primary" type="submit">
          수량 확인
        </button>
        <p
          className="input-demo-result"
          role="status"
          data-result
          id={`${id}-result`}
        />
      </form>
    </ExpansionFrame>
  );
}

export function validateTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59)
    return "HH:mm 형식으로 입력하세요. 예: 09:30";
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  if (minutes < 540 || minutes > 1080) return "운영 시간은 09:00~18:00입니다.";
  if (minutes % 30 !== 0) return "30분 간격으로 선택하세요. 예: 09:00, 09:30";
  if (minutes >= 720 && minutes < 780)
    return "12:00~13:00은 예약할 수 없어요. 13:00 이후를 선택하세요.";
  return "";
}
export function attachTime(root: HTMLElement, preview = false) {
  const input = root.querySelector<HTMLInputElement>("[data-time]")!,
    list = root.querySelector<HTMLElement>("[data-times]")!,
    toggle = root.querySelector<HTMLButtonElement>("[data-open-times]")!,
    display = root.querySelector<HTMLInputElement>("[data-ampm]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!;
  let selected = "",
    active = 0;
  const slots = Array.from({ length: 19 }, (_, i) => {
    const m = 540 + i * 30;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  });
  const label = (time: string) => {
    if (!display.checked) return time;
    const [h, m] = time.split(":").map(Number);
    return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${String(m).padStart(2, "0")}`;
  };
  const open = (value: boolean) => {
    list.hidden = !value;
    toggle.setAttribute("aria-expanded", String(value));
  };
  const render = () => {
    list.replaceChildren();
    slots.forEach((time, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.timeOption = time;
      b.setAttribute("role", "option");
      b.setAttribute("aria-selected", String(time === selected));
      b.setAttribute("aria-disabled", String(Boolean(validateTime(time))));
      b.tabIndex = i === active ? 0 : -1;
      b.textContent = label(time) + (validateTime(time) ? " · 예약 불가" : "");
      list.append(b);
    });
    root.querySelector<HTMLElement>("[data-metrics]")!.textContent =
      formatTextMetrics(input.value);
  };
  const setup = (v: string, opened = false) => {
    input.value = v;
    selected = validateTime(v) ? "" : v;
    result.textContent = "";
    input.removeAttribute("aria-invalid");
    display.checked = false;
    active = Math.max(0, slots.indexOf(v));
    render();
    open(opened);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(""),
      empty: () => setup(""),
      available: () => {
        setup("09:30", true);
        result.textContent = "09:30 예약 가능 · 아직 실제 예약하지 않았어요.";
      },
      unavailable: () => {
        setup("12:00", true);
        result.textContent = validateTime("12:00");
        input.setAttribute("aria-invalid", "true");
      },
      invalid: () => {
        setup("24:00");
        result.textContent = validateTime("24:00");
        input.setAttribute("aria-invalid", "true");
      },
    },
    preview,
  );
  const commit = () => {
    const error = validateTime(input.value);
    input.setAttribute("aria-invalid", String(Boolean(error)));
    if (error) {
      selected = "";
      result.textContent = error;
      controller.state(
        input.value === "12:00" || input.value === "12:30"
          ? "unavailable"
          : "invalid",
      );
    } else {
      selected = input.value;
      active = Math.max(0, slots.indexOf(selected));
      result.textContent = `${label(selected)} 선택 완료 · 기준 시간대 Asia/Seoul`;
      controller.state("available");
    }
    render();
  };
  controller.on(toggle, "click", () => {
    const show = list.hidden;
    open(show);
    if (show)
      list
        .querySelector<HTMLButtonElement>(`button:nth-child(${active + 1})`)
        ?.focus();
  });
  controller.on(input, "input", () => {
    input.removeAttribute("aria-invalid");
    result.textContent = "";
    root.querySelector<HTMLElement>("[data-metrics]")!.textContent =
      formatTextMetrics(input.value);
  });
  controller.on(root.querySelector("form")!, "submit", (e: SubmitEvent) => {
    e.preventDefault();
    commit();
  });
  controller.on(display, "change", () => {
    render();
    if (selected)
      result.textContent = `${label(selected)} 선택 완료 · 기준 시간대 Asia/Seoul`;
  });
  controller.on(list, "click", (e: MouseEvent) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(
      "[data-time-option]",
    );
    if (!b) return;
    if (b.getAttribute("aria-disabled") === "true") {
      result.textContent =
        "12:00~13:00은 예약할 수 없어요. 13:00 이후를 선택하세요.";
      return;
    }
    input.value = b.dataset.timeOption!;
    commit();
    if (b.getAttribute("aria-disabled") !== "true") {
      open(false);
      input.focus();
    }
  });
  controller.on(list, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      open(false);
      toggle.focus();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      active =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? 18
            : (active + (e.key === "ArrowDown" ? 1 : -1) + 19) % 19;
      render();
      list
        .querySelector<HTMLButtonElement>(`button:nth-child(${active + 1})`)
        ?.focus();
    }
  });
  controller.on(input, "keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      open(false);
      toggle.focus();
    }
    if (event.key === "ArrowDown" && event.altKey) {
      event.preventDefault();
      open(true);
      list
        .querySelector<HTMLButtonElement>(`button:nth-child(${active + 1})`)
        ?.focus();
    }
  });
  controller.on(document, "pointerdown", (event: PointerEvent) => {
    if (!root.contains(event.target as Node)) open(false);
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function TimeScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachTime,
    preview,
    ["empty", "available", "unavailable", "available"][
      Math.floor(time / 1200) % 4
    ],
  );
  return (
    <ExpansionFrame
      kind="time-picker"
      title="상담 시간 예약"
      root={root}
      preview={preview}
    >
      <form noValidate>
        <label className="input-demo-label" htmlFor={id}>
          예약 시각
        </label>
        <p className="input-demo-help" id={`${id}-help`}>
          09:00~18:00 · 30분 간격 · 12시~13시 예약 불가
        </p>
        <div className="input-demo-inline">
          <input
            data-time
            id={id}
            type="text"
            inputMode="text"
            autoComplete="off"
            placeholder="예: 09:30"
            aria-describedby={`${id}-help ${id}-result`}
          />
          <button
            data-open-times
            type="button"
            aria-expanded="false"
            aria-controls={`${id}-times`}
            aria-label="예약 시간 목록"
            aria-haspopup="listbox"
          >
            <ExpansionIcon kind="down" />
          </button>
        </div>
        <small
          data-metrics
          data-counter-for={id}
          className="input-demo-metrics"
        >
          0자 · 0 byte (UTF-8)
        </small>
        <div
          data-times
          id={`${id}-times`}
          className="input-demo-time-options"
          role="listbox"
          aria-label="예약 시간 후보"
          hidden
        />
        <div className="input-demo-between">
          <label className="expansion-check">
            <input data-ampm type="checkbox" />
            오전·오후로 표시
          </label>
          <button className="demo-primary" type="submit">
            시간 적용
          </button>
        </div>
        <p
          data-result
          id={`${id}-result`}
          role="status"
          className="input-demo-result"
        />
      </form>
    </ExpansionFrame>
  );
}

export function attachRating(root: HTMLElement, preview = false) {
  const group = root.querySelector<HTMLElement>("[data-stars]")!,
    result = root.querySelector<HTMLElement>("[data-result]")!,
    mode = root.querySelector<HTMLSelectElement>("[data-rating-mode]")!,
    clear = root.querySelector<HTMLButtonElement>("[data-clear]")!,
    summary = root.querySelector<HTMLElement>("[data-rating-summary]")!;
  let value = 0,
    hover = 0;
  const render = () => {
    const readonly = mode.value === "readonly",
      disabled = mode.value === "disabled";
    group.hidden = readonly;
    root.querySelector<HTMLElement>("[data-static-rating]")!.hidden = !readonly;
    for (const input of group.querySelectorAll<HTMLInputElement>("input")) {
      input.checked = Number(input.value) === value;
      input.disabled = disabled;
      input.closest<HTMLElement>("label")!.dataset.lit = String(
        Number(input.value) <= (hover || value),
      );
    }
    summary.textContent = readonly
      ? "평균 4.5 / 5점 · 리뷰 120개"
      : hover
        ? `${hover}점 미리보기 · 아직 확정하지 않았어요.`
        : value
          ? `내 평가 ${value} / 5점`
          : "아직 평가하지 않았어요.";
    clear.disabled = readonly || disabled || !value;
  };
  const set = (n: number, m = "input", h = 0) => {
    value = n;
    mode.value = m;
    hover = h;
    result.textContent =
      m === "disabled" ? "제출 완료 예제 · 평가 수정이 제한되어 있어요." : "";
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => set(0),
      empty: () => set(0),
      hover: () => set(0, "input", 3),
      selected: () => set(4),
      readonly: () => set(0, "readonly"),
      disabled: () => set(3, "disabled"),
    },
    preview,
  );
  controller.on(group, "pointerover", (e: PointerEvent) => {
    const label = (e.target as Element).closest<HTMLElement>("[data-star]");
    if (label && mode.value === "input") {
      hover = Number(label.dataset.star);
      render();
      controller.state("hover");
    }
  });
  controller.on(group, "pointerleave", () => {
    hover = 0;
    render();
    controller.state(value ? "selected" : "empty");
  });
  controller.on(group, "change", (e: Event) => {
    if (mode.value !== "input") return;
    value = Number((e.target as HTMLInputElement).value);
    hover = 0;
    result.textContent = `${value}점을 선택했어요. 실제 리뷰를 제출하지 않습니다.`;
    render();
    controller.state("selected");
  });
  controller.on(clear, "click", () => {
    value = 0;
    hover = 0;
    result.textContent = "평가를 지웠어요. 미응답 상태입니다.";
    render();
    controller.state("empty");
    group.querySelector<HTMLInputElement>("input")?.focus();
  });
  controller.on(mode, "change", () => {
    hover = 0;
    result.textContent =
      mode.value === "disabled"
        ? "제출 완료 예제 · 평가 수정이 제한되어 있어요."
        : "";
    render();
    controller.state(
      mode.value === "input" ? (value ? "selected" : "empty") : mode.value,
    );
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function RatingScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachRating,
    preview,
    ["empty", "hover", "selected", "readonly"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="rating"
      title="이용 경험을 평가해 주세요"
      root={root}
      preview={preview}
    >
      <label className="expansion-label">
        예제 유형
        <select data-rating-mode defaultValue="input">
          <option value="input">별점 입력</option>
          <option value="readonly">평균 평점 표시</option>
          <option value="disabled">평가 변경 불가</option>
        </select>
      </label>
      <fieldset className="input-demo-rating" data-stars>
        <legend>만족도 (1~5점)</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} data-star={n}>
            <input
              type="radio"
              name={`${id}-rating`}
              value={n}
              aria-label={`${n}점`}
            />
            <span aria-hidden="true">★</span>
          </label>
        ))}
      </fieldset>
      <div
        data-static-rating
        className="input-demo-static-rating"
        hidden
        aria-label="평균 5점 만점에 4.5점, 리뷰 120개"
      >
        <span aria-hidden="true">
          ★★★★<i>★</i>
        </span>
      </div>
      <p data-rating-summary className="input-demo-help">
        아직 평가하지 않았어요.
      </p>
      <button type="button" data-clear>
        평가 지우기
      </button>
      <p className="input-demo-result" data-result role="status" />
    </ExpansionFrame>
  );
}

export function attachNotification(root: HTMLElement, preview = false) {
  const bell = root.querySelector<HTMLButtonElement>("[data-notify-toggle]")!,
    panel = root.querySelector<HTMLElement>("[data-notify-panel]")!,
    list = root.querySelector<HTMLElement>("[data-notify-list]")!,
    filter = root.querySelector<HTMLSelectElement>("[data-notify-filter]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!,
    failure = root.querySelector<HTMLInputElement>("[data-fail]")!;
  const seed = () => [
    {
      id: "n1",
      title: "디자인 검토 요청",
      body: "오늘 오후까지 시안을 검토해 주세요.",
      read: false,
    },
    {
      id: "n2",
      title: "민지가 댓글을 남겼어요",
      body: "버튼 문구를 함께 확인해 주세요.",
      read: false,
    },
    {
      id: "n3",
      title: "새 가이드가 도착했어요",
      body: "입력 오류 사례를 추가했어요.",
      read: false,
    },
    {
      id: "n4",
      title: "일정 변경 안내",
      body: "회의가 내일 오전으로 변경됐어요.",
      read: true,
    },
    {
      id: "n5",
      title: "지난 주 요약",
      body: "완료한 작업을 다시 확인하세요.",
      read: true,
    },
  ];
  let items = seed(),
    pending = false,
    opened = false,
    serverEmpty = false;
  const open = (value: boolean, focus = false) => {
    opened = value;
    panel.hidden = !value;
    bell.setAttribute("aria-expanded", String(value));
    if (focus)
      (value
        ? panel.querySelector<HTMLButtonElement>("[data-notify-close]")
        : bell
      )?.focus();
  };
  const render = (focusId = "", focusIndex = 0) => {
    const active = document.activeElement as HTMLElement | null;
    const previous = list.contains(active)
      ? active?.closest<HTMLElement>("button")
      : null;
    const previousId =
      previous?.dataset.readNotification || previous?.dataset.openNotification;
    const previousRead = !!previous?.dataset.readNotification;
    const previousIndex = previous
      ? Array.from(list.children).findIndex((x) => x.contains(previous))
      : 0;
    const count = items.filter((x) => !x.read).length,
      badge = root.querySelector<HTMLElement>("[data-notify-badge]")!;
    badge.textContent = String(count);
    badge.hidden = count === 0;
    bell.setAttribute(
      "aria-label",
      `알림 ${count}개 미확인 · 알림함 ${opened ? "닫기" : "열기"}`,
    );
    const visible = items.filter((x) => filter.value !== "unread" || !x.read);
    list.replaceChildren();
    for (const item of visible) {
      const li = document.createElement("li");
      li.dataset.unread = String(!item.read);
      const title = document.createElement("button");
      title.type = "button";
      title.dataset.openNotification = item.id;
      title.textContent = item.title;
      title.setAttribute("aria-label", `${item.title} 상세 보기`);
      const mark = document.createElement("button");
      mark.type = "button";
      mark.dataset.readNotification = item.id;
      mark.textContent = item.read ? "읽지 않음으로" : "읽음으로";
      mark.setAttribute(
        "aria-label",
        `${item.title} ${item.read ? "읽지 않음" : "읽음"}으로 표시`,
      );
      const note = document.createElement("small");
      note.textContent = `${item.read ? "읽음" : "미확인"} · ${({ n1: "방금", n2: "5분 전", n3: "1시간 전", n4: "어제", n5: "지난주", n6: "지금" } as Record<string, string>)[item.id] || "예제 알림"}`;
      li.append(title, note, mark);
      list.append(li);
    }
    root.querySelector<HTMLElement>("[data-notify-empty]")!.hidden =
      visible.length > 0;
    root.querySelector<HTMLElement>("[data-notify-empty]")!.textContent =
      items.length
        ? "미확인 알림이 없어요. 전체 목록에서 읽은 알림을 확인하세요."
        : "아직 알림이 없어요. 예제 복원으로 목록을 다시 볼 수 있어요.";
    panel.setAttribute("aria-busy", String(pending));
    root.querySelector<HTMLButtonElement>("[data-notify-refresh]")!.disabled =
      pending;
    root.querySelector<HTMLButtonElement>("[data-notify-all]")!.disabled =
      !count || pending;
    failure.disabled = pending;
    if (focusId) {
      const buttons = Array.from(
        list.querySelectorAll<HTMLButtonElement>("[data-read-notification]"),
      );
      (
        buttons.find((x) => x.dataset.readNotification === focusId) ||
        buttons[Math.min(focusIndex, buttons.length - 1)] ||
        filter
      ).focus();
    } else if (previousId) {
      const buttons = Array.from(
        list.querySelectorAll<HTMLButtonElement>(
          previousRead
            ? "[data-read-notification]"
            : "[data-open-notification]",
        ),
      );
      (
        buttons.find(
          (x) =>
            (previousRead
              ? x.dataset.readNotification
              : x.dataset.openNotification) === previousId,
        ) ||
        buttons[Math.min(Math.max(0, previousIndex), buttons.length - 1)] ||
        filter
      ).focus();
    }
  };
  const reset = (mode = "unread") => {
    items = seed();
    pending = false;
    serverEmpty = mode === "empty";
    filter.value = "all";
    failure.checked = false;
    if (mode === "read") items.forEach((x) => (x.read = true));
    if (serverEmpty) items = [];
    status.textContent =
      mode === "error"
        ? "조회에 실패했어요. 기존 알림은 그대로입니다. 실패 모의를 해제하고 다시 조회하세요."
        : "";
    open(mode !== "closed");
    render();
  };
  const request = () => {
    if (pending) return;
    pending = true;
    status.textContent = "새 알림을 조회하는 중…";
    render();
    controller.state("loading");
    const fail = failure.checked;
    controller.later(() => {
      pending = false;
      if (fail) {
        status.textContent =
          "조회에 실패했어요. 기존 알림은 그대로입니다. 실패 모의를 해제하고 다시 조회하세요.";
        controller.state("error");
      } else {
        if (!serverEmpty && !items.some((x) => x.id === "n6"))
          items.unshift({
            id: "n6",
            title: "새로운 검토가 도착했어요",
            body: "추가된 문서를 확인해 주세요.",
            read: false,
          });
        status.textContent = "조회 완료 · 읽음 상태와 기존 목록을 유지했어요.";
        controller.state(
          items.some((x) => !x.read)
            ? "unread"
            : items.length
              ? "read"
              : "empty",
        );
      }
      render();
    }, 650);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => reset("closed"),
      unread: () => reset(),
      read: () => reset("read"),
      empty: () => reset("empty"),
      loading: () => {
        reset();
        request();
      },
      error: () => reset("error"),
    },
    preview,
  );
  controller.on(bell, "click", () => {
    open(!opened);
    render();
    if (opened)
      controller.state(
        items.some((x) => !x.read) ? "unread" : items.length ? "read" : "empty",
      );
  });
  controller.on(root.querySelector("[data-notify-close]")!, "click", () => {
    open(false, true);
    render();
    controller.state("default");
  });
  controller.on(filter, "change", () => render());
  controller.on(list, "click", (e: MouseEvent) => {
    const target = (e.target as Element).closest<HTMLButtonElement>("button");
    if (!target) return;
    const id =
        target.dataset.readNotification || target.dataset.openNotification,
      item = items.find((x) => x.id === id);
    if (!item) return;
    if (target.dataset.readNotification) {
      const index = Array.from(list.children).findIndex((x) =>
        x.contains(target),
      );
      item.read = !item.read;
      render(item.id, index);
      status.textContent = `“${item.title}” 알림을 ${item.read ? "읽음" : "미확인"}으로 바꿨어요.`;
      controller.state(items.some((x) => !x.read) ? "unread" : "read");
    } else {
      const detail = root.querySelector<HTMLElement>("[data-notify-detail]")!;
      detail.hidden = false;
      detail.textContent = `${item.title} — ${item.body} (상세 열기와 읽음 변경은 별도입니다.)`;
      status.textContent =
        "아래에 알림 상세를 열었어요. 읽음 상태는 바꾸지 않았어요.";
    }
  });
  controller.on(root.querySelector("[data-notify-all]")!, "click", () => {
    items.forEach((x) => (x.read = true));
    status.textContent = "전체 알림을 읽음으로 바꿨어요.";
    render();
    controller.state("read");
  });
  controller.on(root.querySelector("[data-notify-clear]")!, "click", () => {
    items = [];
    serverEmpty = true;
    status.textContent =
      "예제 목록을 비웠어요. 복원으로 다시 시작할 수 있어요.";
    render();
    controller.state("empty");
  });
  controller.on(root.querySelector("[data-notify-restore]")!, "click", () => {
    reset();
    controller.state("unread");
  });
  controller.on(root.querySelector("[data-notify-refresh]")!, "click", request);
  controller.on(root, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && opened) {
      e.preventDefault();
      e.stopPropagation();
      open(false, true);
      render();
      controller.state("default");
    }
  });
  controller.on(document, "pointerdown", (e: PointerEvent) => {
    if (opened && !root.contains(e.target as Node)) {
      open(false);
      render();
      controller.state("default");
    }
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function NotificationScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachNotification,
    preview,
    ["default", "unread", "unread", "read"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="notification-center"
      title="팀의 새로운 소식"
      root={root}
      preview={preview}
    >
      <div className="flow-notify-anchor">
        <button
          type="button"
          data-notify-toggle
          aria-expanded="false"
          aria-controls={`${id}-panel`}
          className="flow-notify-bell"
        >
          <ExpansionIcon kind="bell" />
          <span>알림함</span>
          <b data-notify-badge>3</b>
        </button>
        <section
          data-notify-panel
          id={`${id}-panel`}
          aria-label="알림 목록"
          className="flow-notify-panel"
          hidden
        >
          <div className="flow-heading">
            <strong>알림함</strong>
            <button type="button" data-notify-close aria-label="알림함 닫기">
              <ExpansionIcon kind="close" />
            </button>
          </div>
          <div className="flow-controls">
            <label className="flow-label">
              목록
              <select data-notify-filter defaultValue="all">
                <option value="all">전체</option>
                <option value="unread">미확인만</option>
              </select>
            </label>
            <button data-notify-all type="button">
              모두 읽음
            </button>
          </div>
          <ul data-notify-list className="flow-notify-list" />
          <p data-notify-empty className="flow-note" hidden />
          <div className="flow-controls flow-extra">
            <button type="button" data-notify-refresh>
              새 알림 조회
            </button>
            <button type="button" data-notify-clear>
              목록 비우기
            </button>
            <button type="button" data-notify-restore>
              예제 복원
            </button>
          </div>
          <label className="expansion-check flow-extra">
            <input type="checkbox" data-fail />
            조회 실패 모의
          </label>
        </section>
      </div>
      <p data-notify-detail className="flow-detail" hidden />
      <p data-flow-status className="flow-status" role="status" />
      <p className="flow-note flow-extra">
        알림 5개 · 미확인 3개로 시작합니다. 상세 열기와 읽음 변경을 비교하세요.
      </p>
    </ExpansionFrame>
  );
}

export function attachHoverCard(root: HTMLElement, preview = false) {
  const trigger = root.querySelector<HTMLButtonElement>(
      "[data-hover-trigger]",
    )!,
    card = root.querySelector<HTMLElement>("[data-hover-card]")!,
    pin = root.querySelector<HTMLButtonElement>("[data-hover-pin]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!;
  let opened = false,
    pinned = false,
    dismissed = false;
  const place = () => {
    if (preview || !opened) return;
    const rect = trigger.getBoundingClientRect();
    card.style.width = `${Math.min(300, Math.max(180, innerWidth - 32))}px`;
    const size = card.getBoundingClientRect(),
      left = Math.max(12, Math.min(rect.left, innerWidth - size.width - 12));
    card.style.left = `${left}px`;
    card.style.top = `${Math.max(12, Math.min(rect.bottom + 8, innerHeight - size.height - 12))}px`;
  };
  const render = () => {
    card.hidden = !opened;
    trigger.setAttribute("aria-expanded", String(opened));
    pin.setAttribute("aria-pressed", String(pinned));
    pin.textContent = pinned ? "고정 해제" : "고정해서 보기";
    place();
  };
  const open = () => {
    controller.cancel();
    if (dismissed) return;
    opened = true;
    render();
    controller.state(pinned ? "pinned" : "open");
  };
  const close = (focus = false) => {
    controller.cancel();
    opened = false;
    pinned = false;
    dismissed = true;
    render();
    controller.state("closed");
    if (focus) trigger.focus();
  };
  const schedule = () => {
    controller.cancel();
    if (!pinned)
      controller.later(() => {
        const active = document.activeElement;
        if (card.contains(active) || trigger === active) return;
        opened = false;
        render();
        controller.state("closed");
      }, 180);
  };
  const set = (mode: string) => {
    opened = mode !== "closed";
    pinned = mode === "pinned";
    dismissed = false;
    root.querySelector<HTMLElement>("[data-hover-name]")!.textContent =
      mode === "missing" ? "알 수 없는 사용자" : "김민지";
    root.querySelector<HTMLElement>("[data-hover-bio]")!.textContent =
      mode === "missing"
        ? "공개된 소개가 없어요. 필수 정보는 본 화면에서 안내하세요."
        : mode === "image-error"
          ? "사진을 불러오지 못해 이름의 첫 글자로 대신 표시했어요."
          : "프로덕트 디자이너 · 입력 오류와 회복 흐름을 함께 설계해요.";
    root.querySelector<HTMLElement>("[data-hover-avatar]")!.textContent =
      mode === "missing" ? "?" : "민";
    status.textContent = "";
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => set("closed"),
      closed: () => set("closed"),
      open: () => set("open"),
      pinned: () => set("pinned"),
      missing: () => set("missing"),
      "image-error": () => set("image-error"),
    },
    preview,
  );
  controller.on(trigger, "pointerenter", (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    dismissed = false;
    controller.cancel();
    controller.later(open, 120);
  });
  controller.on(trigger, "pointerleave", schedule);
  controller.on(card, "pointerenter", () => controller.cancel());
  controller.on(card, "pointerleave", schedule);
  controller.on(trigger, "focus", () => {
    if (!dismissed) open();
  });
  controller.on(trigger, "click", () => {
    dismissed = false;
    if (opened) {
      pinned = !pinned;
      render();
      controller.state(pinned ? "pinned" : "open");
    } else {
      pinned = true;
      open();
    }
  });
  controller.on(card, "focusin", () => controller.cancel());
  controller.on(root, "focusout", (e: FocusEvent) => {
    if (!root.contains(e.relatedTarget as Node)) schedule();
  });
  controller.on(pin, "click", () => {
    pinned = !pinned;
    render();
    controller.state(pinned ? "pinned" : "open");
  });
  controller.on(root.querySelector("[data-hover-close]")!, "click", () =>
    close(true),
  );
  controller.on(root.querySelector("[data-hover-profile]")!, "click", () => {
    status.textContent =
      "김민지의 프로필 내용을 체험 안에서 열었어요. 외부 페이지로 이동하지 않습니다.";
  });
  controller.on(root, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && opened) {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    }
  });
  controller.on(document, "pointerdown", (e: PointerEvent) => {
    if (opened && !pinned && !root.contains(e.target as Node)) close();
  });
  controller.on(window, "resize", place);
  controller.set("default");
  controller.ready();
  return controller;
}
export function HoverCardScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachHoverCard,
    preview,
    ["closed", "open", "pinned", "closed"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="hover-card"
      title="누가 만든 문서일까요?"
      root={root}
      preview={preview}
    >
      <p className="flow-note">
        작성자를 떠나기 전에 간단한 프로필을 확인하세요.
      </p>
      <div className="flow-hover-anchor">
        <button
          type="button"
          data-hover-trigger
          aria-expanded="false"
          aria-controls={`${id}-card`}
        >
          김민지 프로필 미리보기
        </button>
        <section
          data-hover-card
          id={`${id}-card`}
          role="dialog"
          aria-label="작성자 프로필 미리보기"
          className="flow-hover-card"
          hidden
        >
          <div className="flow-heading">
            <span className="flow-avatar" data-hover-avatar>
              민
            </span>
            <strong data-hover-name>김민지</strong>
            <button
              type="button"
              data-hover-close
              aria-label="프로필 미리보기 닫기"
            >
              <ExpansionIcon kind="close" />
            </button>
          </div>
          <p data-hover-bio className="flow-note">
            프로덕트 디자이너 · 입력 오류와 회복 흐름을 함께 설계해요.
          </p>
          <div className="flow-controls">
            <button type="button" data-hover-pin aria-pressed="false">
              고정해서 보기
            </button>
            <button type="button" data-hover-profile>
              프로필 내용 보기
            </button>
          </div>
        </section>
      </div>
      <p data-flow-status role="status" className="flow-status" />
      <p className="flow-note flow-extra">
        마우스를 올리거나 Tab으로 이동하세요. 모바일은 탭, Esc는 닫기입니다.
      </p>
    </ExpansionFrame>
  );
}

export function attachInlineEdit(root: HTMLElement, preview = false) {
  const display = root.querySelector<HTMLElement>("[data-edit-display]")!,
    form = root.querySelector<HTMLFormElement>("[data-edit-form]")!,
    input = root.querySelector<HTMLInputElement>("[data-edit-input]")!,
    edit = root.querySelector<HTMLButtonElement>("[data-edit-start]")!,
    save = root.querySelector<HTMLButtonElement>("[data-edit-save]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!;
  let committed = "이번 주 디자인 노트",
    editing = false,
    pending = false;
  const render = () => {
    display.hidden = editing;
    form.hidden = !editing;
    root.querySelector<HTMLElement>("[data-edit-title]")!.textContent =
      committed;
    save.disabled = pending;
    fail.disabled = pending;
    input.readOnly = pending;
    save.textContent = pending ? "저장 중…" : "변경 저장";
    form.setAttribute("aria-busy", String(pending));
    root.querySelector<HTMLElement>("[data-edit-metrics]")!.textContent =
      formatTextMetrics(input.value, 40);
  };
  const setup = (mode = "reading") => {
    committed = mode === "success" ? "새 UI 가이드" : "이번 주 디자인 노트";
    input.value = ["editing", "saving", "error"].includes(mode)
      ? "새 UI 가이드"
      : committed;
    editing = ["editing", "saving", "error"].includes(mode);
    pending = mode === "saving";
    fail.checked = false;
    input.removeAttribute("aria-invalid");
    status.textContent =
      mode === "error"
        ? "저장하지 못했어요. 입력을 유지했습니다. 다시 저장하거나 취소하세요."
        : mode === "saving"
          ? "변경 사항을 저장하는 중…"
          : mode === "success"
            ? "새 제목을 저장했어요. 실제 문서는 변경하지 않습니다."
            : "";
    status.setAttribute("role", mode === "error" ? "alert" : "status");
    render();
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(),
      reading: () => setup(),
      editing: () => setup("editing"),
      saving: () => {
        setup("saving");
        controller.later(() => {
          pending = false;
          committed = input.value;
          editing = false;
          status.textContent =
            "새 제목을 저장했어요. 실제 문서는 변경하지 않습니다.";
          render();
          controller.state("success");
        }, 650);
      },
      error: () => setup("error"),
      success: () => setup("success"),
    },
    preview,
  );
  const cancel = () => {
    controller.cancel();
    pending = false;
    editing = false;
    input.value = committed;
    input.removeAttribute("aria-invalid");
    status.setAttribute("role", "status");
    status.textContent = "편집을 취소했어요. 원래 제목을 유지합니다.";
    render();
    controller.state("reading");
    edit.focus();
  };
  controller.on(edit, "click", () => {
    editing = true;
    input.value = committed;
    status.textContent = "";
    input.removeAttribute("aria-invalid");
    render();
    controller.state("editing");
    input.focus();
    input.select();
  });
  controller.on(input, "input", () => {
    input.removeAttribute("aria-invalid");
    status.textContent = "";
    root.querySelector<HTMLElement>("[data-edit-metrics]")!.textContent =
      formatTextMetrics(input.value, 40);
  });
  controller.on(input, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.isComposing || e.keyCode === 229))
      e.preventDefault();
  });
  controller.on(root, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && editing) {
      e.preventDefault();
      e.stopPropagation();
      cancel();
    }
  });
  controller.on(root.querySelector("[data-edit-cancel]")!, "click", cancel);
  controller.on(form, "submit", (e: SubmitEvent) => {
    e.preventDefault();
    if (pending) return;
    const next = input.value.trim(),
      length = measureText(next).characters;
    status.setAttribute("role", "status");
    if (length < 2 || length > 40) {
      input.setAttribute("aria-invalid", "true");
      status.textContent =
        "제목은 2~40자로 입력하세요. 입력한 내용은 유지합니다.";
      input.focus();
      controller.state("error");
      return;
    }
    if (next === committed) {
      editing = false;
      status.textContent = "변경된 내용이 없어 저장 요청을 보내지 않았어요.";
      render();
      controller.state("reading");
      edit.focus();
      return;
    }
    pending = true;
    render();
    status.textContent = "변경 사항을 저장하는 중…";
    controller.state("saving");
    const failed = fail.checked;
    controller.later(() => {
      pending = false;
      if (failed) {
        status.setAttribute("role", "alert");
        status.textContent =
          "저장하지 못했어요. 입력을 유지했습니다. 실패 모의를 해제하고 다시 저장하세요.";
        controller.state("error");
        render();
        input.focus();
      } else {
        committed = next;
        editing = false;
        status.textContent =
          "새 제목을 저장했어요. 실제 문서는 변경하지 않습니다.";
        controller.state("success");
        render();
        edit.focus();
      }
    }, 650);
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function InlineEditScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachInlineEdit,
    preview,
    ["reading", "editing", "saving", "success"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="inline-edit"
      title="문서 제목 바로 수정"
      root={root}
      preview={preview}
    >
      <div data-edit-display className="flow-edit-display">
        <strong data-edit-title>이번 주 디자인 노트</strong>
        <button type="button" data-edit-start aria-label="문서 제목 수정">
          수정
        </button>
      </div>
      <form data-edit-form noValidate hidden>
        <label className="flow-label" htmlFor={id}>
          문서 제목 (2~40자)
        </label>
        <input
          data-edit-input
          id={id}
          className="flow-input"
          aria-describedby={`${id}-metrics ${id}-status`}
        />
        <small
          data-edit-metrics
          id={`${id}-metrics`}
          className="input-demo-metrics"
        >
          0 / 40자 · 0 byte (UTF-8)
        </small>
        <div className="flow-controls">
          <button type="submit" data-edit-save className="demo-primary">
            변경 저장
          </button>
          <button type="button" data-edit-cancel>
            취소
          </button>
        </div>
      </form>
      <label className="expansion-check flow-extra">
        <input type="checkbox" data-fail />
        저장 실패 모의
      </label>
      <p
        data-flow-status
        id={`${id}-status`}
        className="flow-status"
        role="status"
      />
      <p className="flow-note flow-extra">
        Enter로 저장 · Esc로 취소 · 다른 곳을 눌러도 자동 저장하지 않아요.
      </p>
    </ExpansionFrame>
  );
}

export function attachInfinite(root: HTMLElement, preview = false) {
  const viewport = root.querySelector<HTMLElement>("[data-feed-viewport]")!,
    list = root.querySelector<HTMLElement>("[data-feed-list]")!,
    sentinel = root.querySelector<HTMLElement>("[data-feed-sentinel]")!,
    button = root.querySelector<HTMLButtonElement>("[data-feed-more]")!,
    auto = root.querySelector<HTMLInputElement>("[data-feed-auto]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!;
  const data = Array.from({ length: 18 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `디자인 기록 ${String(i + 1).padStart(2, "0")}`,
    body: ["첫 화면과 정보 구조", "입력과 오류 복구", "작은 화면의 탐색"][
      i % 3
    ],
  }));
  let cursor = 0,
    pending = false,
    phase = "ready",
    observer: IntersectionObserver | null = null;
  const render = () => {
    button.disabled = pending || cursor >= 18;
    button.textContent = pending
      ? "불러오는 중…"
      : phase === "error"
        ? "다시 불러오기"
        : cursor >= 18
          ? "모든 항목을 확인했어요"
          : "다음 6개 불러오기";
    viewport.setAttribute("aria-busy", String(pending));
    root.querySelector<HTMLElement>("[data-feed-count]")!.textContent =
      `${cursor} / 18개`;
  };
  const append = (end: number) => {
    const existing = new Set(
      Array.from(list.children).map((x) => (x as HTMLElement).dataset.feedId),
    );
    for (const item of data.slice(cursor, end)) {
      if (existing.has(item.id)) continue;
      const li = document.createElement("li");
      li.dataset.feedId = item.id;
      const title = document.createElement("button");
      title.type = "button";
      title.dataset.feedOpen = item.id;
      title.textContent = item.title;
      const text = document.createElement("small");
      text.textContent = item.body;
      li.append(title, text);
      list.append(li);
    }
    cursor = end;
  };
  const setup = (count = 6, mode = "ready") => {
    cursor = 0;
    pending = mode === "loading" || mode === "initial";
    phase = mode;
    list.replaceChildren();
    append(count);
    auto.checked = true;
    fail.checked = false;
    viewport.scrollTop = 0;
    status.textContent =
      mode === "error"
        ? "추가 조회 실패 · 기존 6개를 유지했어요. 다음 6개를 다시 불러오세요."
        : mode === "end"
          ? "마지막 항목입니다. 추가 요청을 보내지 않아요."
          : pending
            ? "기록을 조회하는 중…"
            : "아래로 스크롤하거나 다음 6개 불러오기를 누르세요.";
    render();
  };
  const request = () => {
    if (pending || cursor >= 18) return;
    pending = true;
    phase = "loading";
    status.textContent = "다음 기록을 조회하는 중…";
    render();
    controller.state("loading");
    const failed = fail.checked;
    controller.later(() => {
      pending = false;
      if (failed) {
        phase = "error";
        status.textContent =
          "추가 조회 실패 · 기존 항목과 페이지 위치를 유지했어요. 실패 모의를 해제하고 다시 불러오세요.";
        controller.state("error");
      } else {
        const before = cursor;
        append(Math.min(18, cursor + 6));
        phase = cursor === 18 ? "end" : "ready";
        status.textContent =
          cursor === 18
            ? "18개를 모두 불러왔어요. 마지막 항목입니다."
            : `${cursor - before}개 추가 · 현재 ${cursor}개. 초점은 이동하지 않았어요.`;
        controller.state(phase);
      }
      render();
    }, 650);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(),
      initial: () => {
        setup(0);
        request();
      },
      ready: () => setup(preview ? 12 : 6),
      loading: () => {
        setup();
        request();
      },
      error: () => setup(6, "error"),
      end: () => setup(18, "end"),
    },
    preview,
  );
  controller.on(button, "click", request);
  controller.on(auto, "change", () => {
    status.textContent = auto.checked
      ? "자동 불러오기를 켰어요. 하단에 도달하면 다음 기록을 가져옵니다."
      : "자동 불러오기를 껐어요. 다음 6개 불러오기 버튼을 이용하세요.";
    if (
      auto.checked &&
      viewport.scrollTop + viewport.clientHeight >=
        viewport.scrollHeight - 36 &&
      phase !== "error"
    )
      request();
  });
  controller.on(root.querySelector("[data-feed-reset]")!, "click", () =>
    controller.set("default", true),
  );
  controller.on(list, "click", (e: MouseEvent) => {
    const target = (e.target as Element).closest<HTMLButtonElement>(
      "[data-feed-open]",
    );
    if (target)
      status.textContent = `${target.textContent}을 선택했어요. 목록과 현재 위치는 유지합니다.`;
  });
  controller.set("default");
  if (!preview && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some((x) => x.isIntersecting) &&
          auto.checked &&
          phase !== "error"
        )
          request();
      },
      { root: viewport, rootMargin: "0px 0px 24px 0px" },
    );
    observer.observe(sentinel);
    controller.cleanup(() => observer?.disconnect());
  }
  controller.ready();
  return controller;
}
export function InfiniteScrollScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachInfinite,
    preview,
    ["default", "loading", "ready", "end"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="infinite-scroll"
      title="계속 이어지는 디자인 기록"
      root={root}
      preview={preview}
    >
      <div className="flow-heading">
        <span data-feed-count>6 / 18개</span>
        <label className="expansion-check flow-extra">
          <input type="checkbox" data-feed-auto defaultChecked />
          자동 불러오기
        </label>
      </div>
      <div
        data-feed-viewport
        className="flow-feed-viewport"
        role="region"
        aria-label="기록 내부 스크롤"
        tabIndex={0}
      >
        <ol data-feed-list className="flow-feed-list" />
        <div
          data-feed-sentinel
          className="flow-feed-sentinel"
          aria-hidden="true"
        />
      </div>
      <div className="flow-controls">
        <button data-feed-more type="button">
          다음 6개 불러오기
        </button>
        <button data-feed-reset type="button" className="flow-extra">
          처음부터
        </button>
      </div>
      <label className="expansion-check flow-extra">
        <input data-fail type="checkbox" />
        추가 조회 실패 모의
      </label>
      <p data-flow-status className="flow-status" role="status" />
    </ExpansionFrame>
  );
}

export function gestureIntent(dx: number, dy: number) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return "pending";
  return Math.abs(dx) > Math.abs(dy) * 1.2
    ? "horizontal"
    : Math.abs(dy) > Math.abs(dx) * 1.2
      ? "vertical"
      : "pending";
}
export function swipeOffset(value: number) {
  return Math.max(-136, Math.min(0, value));
}
export function pullDistance(value: number) {
  return Math.min(96, Math.max(0, value) * 0.5);
}
export function attachSwipe(root: HTMLElement, preview = false) {
  const host = root.querySelector<HTMLElement>("[data-swipe-list]")!,
    undo = root.querySelector<HTMLButtonElement>("[data-swipe-undo]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!;
  const base = () => [
    { id: "s1", title: "자료 조사", body: "참고 사례 모으기" },
    { id: "s2", title: "화면 설계", body: "입력과 오류 흐름" },
    { id: "s3", title: "프로토타입", body: "실제 동작 검토" },
  ];
  let items = base(),
    openId = "",
    pending = false,
    last: {
      item: ReturnType<typeof base>[number];
      index: number;
      verb: string;
    } | null = null,
    drag: {
      id: string;
      x: number;
      y: number;
      pointer: number;
      start: number;
      axis: string;
    } | null = null;
  const paint = (id: string, offset: number) => {
    const row = host.querySelector<HTMLElement>(`[data-swipe-id="${id}"]`);
    if (!row) return;
    row.querySelector<HTMLElement>("[data-swipe-front]")!.style.transform =
      `translateX(${swipeOffset(offset)}px)`;
    row.dataset.open = String(offset <= -68);
    const actions = row.querySelector<HTMLElement>(".flow-swipe-actions")!;
    actions.inert = offset > -68;
    actions.setAttribute("aria-hidden", String(offset > -68));
    row
      .querySelectorAll<HTMLButtonElement>("[data-swipe-action]")
      .forEach((x) => (x.tabIndex = offset <= -68 ? 0 : -1));
  };
  const render = () => {
    if (
      preview &&
      host.children.length === items.length &&
      items.every(
        (item, index) =>
          (host.children[index] as HTMLElement).dataset.swipeId === item.id,
      )
    ) {
      for (const item of items) paint(item.id, openId === item.id ? -136 : 0);
      undo.hidden = !last;
      root.querySelector<HTMLElement>("[data-swipe-empty]")!.hidden =
        items.length > 0;
      return;
    }
    host.replaceChildren();
    for (const item of items) {
      const row = document.createElement("li");
      row.className = "flow-swipe-row";
      row.dataset.swipeId = item.id;
      const actions = document.createElement("div");
      actions.className = "flow-swipe-actions";
      for (const [verb, label] of [
        ["archive", "보관"],
        ["delete", "삭제"],
      ]) {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.swipeAction = verb;
        b.setAttribute("aria-label", `${item.title} ${label}`);
        b.textContent = label;
        b.disabled = pending;
        actions.append(b);
      }
      const front = document.createElement("div");
      front.className = "flow-swipe-front";
      front.dataset.swipeFront = "";
      const text = document.createElement("div"),
        title = document.createElement("strong"),
        body = document.createElement("small");
      title.textContent = item.title;
      body.textContent = item.body;
      text.append(title, body);
      const more = document.createElement("button");
      more.type = "button";
      more.dataset.swipeMore = "";
      more.setAttribute(
        "aria-label",
        `${item.title} 작업 ${openId === item.id ? "닫기" : "열기"}`,
      );
      more.setAttribute("aria-expanded", String(openId === item.id));
      more.textContent = "더보기";
      more.disabled = pending;
      front.append(text, more);
      row.append(actions, front);
      host.append(row);
      paint(item.id, openId === item.id ? -136 : 0);
    }
    undo.hidden = !last;
    undo.disabled = pending;
    root.querySelector<HTMLElement>("[data-swipe-empty]")!.hidden =
      items.length > 0;
    fail.disabled = pending;
  };
  const toggle = (id: string) => {
    openId = openId === id ? "" : id;
    render();
    controller.state(openId ? "open" : "closed");
    host
      .querySelector<HTMLButtonElement>(
        `[data-swipe-id="${id}"] [data-swipe-more]`,
      )
      ?.focus();
  };
  const setup = (mode = "closed") => {
    items = base();
    openId = ["open", "dragging", "error", "pending"].includes(mode)
      ? "s1"
      : "";
    pending = mode === "pending";
    last = null;
    fail.checked = false;
    drag = null;
    status.textContent =
      mode === "error"
        ? "처리하지 못했어요. 원래 항목을 유지합니다. 다시 실행하거나 작업을 닫으세요."
        : "";
    if (mode === "deleted") {
      last = { item: items[0], index: 0, verb: "삭제" };
      items.shift();
      status.textContent =
        "자료 조사 항목을 삭제했어요. 실행 취소로 원래 위치에 복원하세요.";
    }
    render();
    if (mode === "dragging") paint("s1", -60);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(),
      closed: () => setup(),
      dragging: () => setup("dragging"),
      open: () => setup("open"),
      pending: () => {
        setup("open");
        run("s1", "delete");
      },
      deleted: () => setup("deleted"),
      error: () => setup("error"),
    },
    preview,
  );
  const run = (id: string, action: string) => {
    if (pending) return;
    const index = items.findIndex((x) => x.id === id);
    if (index < 0) return;
    pending = true;
    status.textContent = "항목을 처리하는 중…";
    render();
    controller.state("pending");
    const failed = fail.checked;
    controller.later(() => {
      pending = false;
      if (failed) {
        status.textContent =
          "처리하지 못했어요. 원래 항목과 위치를 유지합니다. 실패 모의를 해제하고 다시 실행하세요.";
        render();
        controller.state("error");
        host
          .querySelector<HTMLButtonElement>(
            `[data-swipe-id="${id}"] [data-swipe-action="${action}"]`,
          )
          ?.focus();
        return;
      }
      last = {
        item: items[index],
        index,
        verb: action === "delete" ? "삭제" : "보관",
      };
      items.splice(index, 1);
      openId = "";
      status.textContent = `“${last.item.title}” 항목을 ${last.verb}했어요. 실행 취소로 원래 위치에 복원하세요.`;
      render();
      controller.state("deleted");
      undo.focus();
    }, 550);
  };
  controller.on(host, "click", (e: MouseEvent) => {
    const target = (e.target as Element).closest<HTMLButtonElement>("button"),
      row = target?.closest<HTMLElement>("[data-swipe-id]");
    if (!target || !row) return;
    if (target.hasAttribute("data-swipe-more")) toggle(row.dataset.swipeId!);
    else if (target.dataset.swipeAction)
      run(row.dataset.swipeId!, target.dataset.swipeAction);
  });
  controller.on(host, "pointerdown", (e: PointerEvent) => {
    if (
      pending ||
      drag ||
      !e.isPrimary ||
      e.button !== 0 ||
      (e.target as Element).closest("button")
    )
      return;
    const row = (e.target as Element).closest<HTMLElement>("[data-swipe-id]");
    if (!row) return;
    if (e.pointerType === "mouse") e.preventDefault();
    drag = {
      id: row.dataset.swipeId!,
      x: e.clientX,
      y: e.clientY,
      pointer: e.pointerId,
      start: openId === row.dataset.swipeId ? -136 : 0,
      axis: "pending",
    };
  });
  controller.on(host, "pointermove", (e: PointerEvent) => {
    if (!drag || drag.pointer !== e.pointerId) return;
    const dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (drag.axis === "pending") drag.axis = gestureIntent(dx, dy);
    if (drag.axis === "vertical") {
      drag = null;
      return;
    }
    if (drag.axis !== "horizontal") return;
    e.preventDefault();
    if (!host.hasPointerCapture(e.pointerId))
      host.setPointerCapture(e.pointerId);
    for (const item of items) if (item.id !== drag.id) paint(item.id, 0);
    paint(drag.id, drag.start + dx);
    status.textContent =
      "누른 행이 포인터를 따라 이동 중이에요. 놓아도 자동 삭제하지 않습니다.";
    controller.state("dragging");
  });
  const end = (e: PointerEvent, cancel = false) => {
    if (!drag || drag.pointer !== e.pointerId) return;
    const d = drag;
    drag = null;
    if (host.hasPointerCapture(e.pointerId))
      host.releasePointerCapture(e.pointerId);
    openId =
      !cancel &&
      d.axis === "horizontal" &&
      swipeOffset(d.start + e.clientX - d.x) <= -68
        ? d.id
        : "";
    render();
    status.textContent = cancel
      ? "끌기를 취소했어요. 행을 원래 위치로 돌렸습니다."
      : openId
        ? "보관·삭제 버튼을 열었어요. 원하는 행동을 눌러 실행하세요."
        : "행을 원래 위치로 돌렸어요.";
    controller.state(openId ? "open" : "closed");
  };
  controller.on(host, "pointerup", (e: PointerEvent) => end(e));
  controller.on(host, "pointercancel", (e: PointerEvent) => end(e, true));
  controller.on(host, "lostpointercapture", (e: PointerEvent) => {
    if (drag) end(e, true);
  });
  controller.on(root, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && openId) {
      e.preventDefault();
      e.stopPropagation();
      const id = openId;
      openId = "";
      render();
      controller.state("closed");
      host
        .querySelector<HTMLButtonElement>(
          `[data-swipe-id="${id}"] [data-swipe-more]`,
        )
        ?.focus();
    }
  });
  controller.on(undo, "click", () => {
    if (!last || pending) return;
    const restored = last;
    items.splice(Math.min(last.index, items.length), 0, last.item);
    last = null;
    openId = "";
    render();
    status.textContent = `“${restored.item.title}” 항목을 원래 ${restored.index + 1}번째 위치에 복원했어요.`;
    controller.state("closed");
    host
      .querySelector<HTMLButtonElement>(
        `[data-swipe-id="${restored.item.id}"] [data-swipe-more]`,
      )
      ?.focus();
  });
  controller.on(root.querySelector("[data-swipe-reset]")!, "click", () =>
    controller.set("default", true),
  );
  controller.cleanup(() => {
    if (drag && host.hasPointerCapture(drag.pointer))
      host.releasePointerCapture(drag.pointer);
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function SwipeActionsScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachSwipe,
    preview,
    ["closed", "dragging", "open", "deleted"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="swipe-actions"
      title="노트를 밀어 작업하기"
      root={root}
      preview={preview}
    >
      <p className="flow-note flow-extra">
        행의 제목을 잡고 왼쪽으로 끌어보세요. 더보기 버튼으로도 같은 작업을 열
        수 있어요.
      </p>
      <ul data-swipe-list className="flow-swipe-list" />
      <p data-swipe-empty className="flow-note" hidden>
        모든 예제 노트를 처리했어요. 실행 취소 또는 처음부터를 누르세요.
      </p>
      <div className="flow-controls">
        <button type="button" data-swipe-undo hidden>
          마지막 작업 실행 취소
        </button>
        <button type="button" data-swipe-reset className="flow-extra">
          처음부터
        </button>
      </div>
      <label className="expansion-check flow-extra">
        <input type="checkbox" data-fail />
        보관·삭제 실패 모의
      </label>
      <p data-flow-status className="flow-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachRefresh(root: HTMLElement, preview = false) {
  const viewport = root.querySelector<HTMLElement>("[data-pull-viewport]")!,
    content = root.querySelector<HTMLElement>("[data-pull-content]")!,
    indicator = root.querySelector<HTMLElement>("[data-pull-indicator]")!,
    button = root.querySelector<HTMLButtonElement>("[data-refresh]")!,
    fail = root.querySelector<HTMLInputElement>("[data-fail]")!,
    status = root.querySelector<HTMLElement>("[data-flow-status]")!;
  const base = () =>
    Array.from({ length: 8 }, (_, i) => ({
      id: `old-${i}`,
      title: `팀 소식 ${i + 1}`,
    }));
  let items = base(),
    version = 0,
    pending = false,
    distance = 0,
    gesture: { x: number; y: number; pointer: number; axis: string } | null =
      null,
    touch: { x: number; y: number; axis: string } | null = null;
  const paint = (value: number) => {
    distance = value;
    indicator.style.height = `${value}px`;
    indicator.textContent = pending
      ? "새 소식 조회 중…"
      : value >= 56
        ? "놓으면 새로고침"
        : "아래로 더 당겨 주세요";
    content.style.transform = `translateY(${Math.min(value, 20)}px)`;
  };
  const render = () => {
    const list = root.querySelector<HTMLElement>("[data-pull-list]")!;
    list.replaceChildren();
    for (const item of items) {
      const li = document.createElement("li");
      li.dataset.pullId = item.id;
      li.textContent = item.title;
      list.append(li);
    }
    button.disabled = pending;
    fail.disabled = pending;
    button.textContent = pending ? "새로고침 중…" : "새로고침";
    viewport.setAttribute("aria-busy", String(pending));
    root.querySelector<HTMLElement>("[data-refresh-count]")!.textContent =
      `${items.length}개 소식 · ${version}회 갱신`;
  };
  const setup = (mode = "idle") => {
    items = base();
    version = 0;
    pending = mode === "loading";
    gesture = null;
    touch = null;
    fail.checked = false;
    if (mode === "success") {
      items.unshift({ id: "new-1", title: "새로 도착한 팀 소식 1" });
      version = 1;
    }
    status.textContent =
      mode === "error"
        ? "새로고침에 실패했어요. 기존 8개 소식은 유지됩니다. 다시 시도하세요."
        : mode === "success"
          ? "새 소식 1개를 반영했어요. 기존 항목도 유지했습니다."
          : "";
    render();
    viewport.scrollTop = 0;
    paint(mode === "pulling" ? 28 : mode === "armed" ? 64 : pending ? 44 : 0);
  };
  const controller = createScenarioController(
    root,
    {
      default: () => setup(),
      idle: () => setup(),
      pulling: () => setup("pulling"),
      armed: () => setup("armed"),
      loading: () => {
        setup();
        request();
      },
      success: () => setup("success"),
      error: () => setup("error"),
    },
    preview,
  );
  const request = () => {
    if (pending) return;
    pending = true;
    paint(44);
    render();
    status.textContent = "새 소식을 조회하는 중…";
    controller.state("loading");
    const failed = fail.checked;
    controller.later(() => {
      pending = false;
      paint(0);
      if (failed) {
        status.textContent =
          "새로고침에 실패했어요. 기존 목록을 유지했습니다. 실패 모의를 해제하고 다시 시도하세요.";
        controller.state("error");
      } else {
        version++;
        const next = {
          id: `new-${version}`,
          title: `새로 도착한 팀 소식 ${version}`,
        };
        if (!items.some((x) => x.id === next.id)) items.unshift(next);
        status.textContent =
          "새 소식 1개를 반영했어요. 기존 항목도 유지했습니다.";
        controller.state("success");
      }
      render();
    }, 700);
  };
  const release = (cancel = false) => {
    gesture = null;
    touch = null;
    if (pending) return;
    if (!cancel && distance >= 56) request();
    else {
      paint(0);
      status.textContent = cancel
        ? "당기기를 취소했어요. 기존 목록을 유지합니다."
        : "당기는 거리가 짧아 새로고침하지 않았어요.";
      controller.state("idle");
    }
  };
  controller.on(button, "click", request);
  controller.on(root.querySelector("[data-refresh-reset]")!, "click", () =>
    controller.set("default", true),
  );
  controller.on(viewport, "pointerdown", (e: PointerEvent) => {
    if (
      e.pointerType === "touch" ||
      e.button !== 0 ||
      pending ||
      viewport.scrollTop > 0 ||
      (e.target as Element).closest("button,input")
    )
      return;
    e.preventDefault();
    gesture = {
      x: e.clientX,
      y: e.clientY,
      pointer: e.pointerId,
      axis: "pending",
    };
  });
  controller.on(viewport, "pointermove", (e: PointerEvent) => {
    if (!gesture || gesture.pointer !== e.pointerId) return;
    const dy = e.clientY - gesture.y,
      dx = e.clientX - gesture.x;
    if (gesture.axis === "pending") gesture.axis = gestureIntent(dx, dy);
    if (gesture.axis === "horizontal" || dy < 0) {
      gesture = null;
      return;
    }
    if (gesture.axis !== "vertical") return;
    e.preventDefault();
    if (!viewport.hasPointerCapture(e.pointerId))
      viewport.setPointerCapture(e.pointerId);
    paint(pullDistance(dy));
    controller.state(distance >= 56 ? "armed" : "pulling");
  });
  controller.on(viewport, "pointerup", (e: PointerEvent) => {
    if (!gesture || gesture.pointer !== e.pointerId) return;
    gesture = null;
    if (viewport.hasPointerCapture(e.pointerId))
      viewport.releasePointerCapture(e.pointerId);
    release();
  });
  controller.on(viewport, "pointercancel", () => {
    if (gesture) release(true);
  });
  controller.on(viewport, "lostpointercapture", () => {
    if (gesture) release(true);
  });
  controller.on(
    viewport,
    "touchstart",
    (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        if (touch) release(true);
        return;
      }
      if (pending || viewport.scrollTop > 0) return;
      touch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        axis: "pending",
      };
    },
    { passive: true },
  );
  controller.on(
    viewport,
    "touchmove",
    (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        if (touch) release(true);
        return;
      }
      if (!touch || pending) return;
      const dy = e.touches[0].clientY - touch.y,
        dx = e.touches[0].clientX - touch.x;
      if (touch.axis === "pending") touch.axis = gestureIntent(dx, dy);
      if (touch.axis === "horizontal" || dy <= 0) {
        touch = null;
        return;
      }
      if (touch.axis !== "vertical") return;
      if (e.cancelable) e.preventDefault();
      paint(pullDistance(dy));
      controller.state(distance >= 56 ? "armed" : "pulling");
    },
    { passive: false },
  );
  controller.on(viewport, "touchend", () => {
    if (touch) release();
  });
  controller.on(viewport, "touchcancel", () => release(true));
  controller.cleanup(() => {
    if (gesture && viewport.hasPointerCapture(gesture.pointer))
      viewport.releasePointerCapture(gesture.pointer);
  });
  controller.set("default");
  controller.ready();
  return controller;
}
export function PullRefreshScene({
  preview = false,
  time = 0,
}: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachRefresh,
    preview,
    ["idle", "pulling", "armed", "success"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="pull-to-refresh"
      title="새로운 소식 다시 가져오기"
      root={root}
      preview={preview}
    >
      <div className="flow-heading">
        <span data-refresh-count>8개 소식 · 0회 갱신</span>
        <button type="button" data-refresh>
          새로고침
        </button>
      </div>
      <p className="flow-note flow-extra">
        이 목록의 맨 위에서 아래로 당긴 후 놓으세요. 버튼으로도 같은 동작을 할
        수 있어요.
      </p>
      <div
        data-pull-viewport
        className="flow-pull-viewport"
        role="region"
        aria-label="당겨서 새로고침하는 소식 목록"
        tabIndex={0}
      >
        <div
          data-pull-indicator
          className="flow-pull-indicator"
          aria-hidden="true"
        />
        <div data-pull-content>
          <ul data-pull-list className="flow-pull-list" />
        </div>
      </div>
      <div className="flow-controls flow-extra">
        <label className="expansion-check">
          <input type="checkbox" data-fail />
          새로고침 실패 모의
        </label>
        <button type="button" data-refresh-reset>
          처음부터
        </button>
      </div>
      <p data-flow-status className="flow-status" role="status" />
    </ExpansionFrame>
  );
}

// A4: shared layout/scroll controllers, used by HTML, React and listing loops.
export function clampSplit(value: number) {
  return Math.max(25, Math.min(75, value));
}
export function attachPanels(root: HTMLElement, preview = false) {
  const area = root.querySelector<HTMLElement>("[data-panels]")!,
    divider = root.querySelector<HTMLElement>("[data-divider]")!,
    status = root.querySelector<HTMLElement>("[data-layout-status]")!;
  let ratio = 50,
    mobile = false,
    tab = "editor",
    drag: number | null = null,
    start = 50;
  const draw = () => {
    area.style.setProperty("--panel-fraction", String(ratio / 100));
    root.dataset.compact = String(mobile);
    divider.setAttribute("aria-valuenow", String(Math.round(ratio)));
    divider.setAttribute(
      "aria-valuetext",
      `편집 ${Math.round(ratio)}%, 결과 ${Math.round(100 - ratio)}%`,
    );
    divider.tabIndex = mobile ? -1 : 0;
    root
      .querySelectorAll<HTMLElement>("[data-panel]")
      .forEach((el) => (el.hidden = mobile && el.dataset.panel !== tab));
    root
      .querySelectorAll<HTMLButtonElement>("[data-panel-tab]")
      .forEach((el) => {
        el.setAttribute("aria-selected", String(el.dataset.panelTab === tab));
        el.tabIndex = el.dataset.panelTab === tab ? 0 : -1;
      });
    root
      .querySelectorAll<HTMLButtonElement>("[data-ratio]")
      .forEach((el) => (el.disabled = mobile));
    status.textContent = mobile
      ? "작은 화면에서는 편집·결과를 탭으로 전환해요. 작성한 내용은 유지됩니다."
      : `편집 ${Math.round(ratio)}% · 결과 ${Math.round(100 - ratio)}% · 25~75% 범위`;
  };
  const release = () => {
    if (drag !== null && divider.hasPointerCapture(drag))
      divider.releasePointerCapture(drag);
    drag = null;
    root.dataset.resizing = "false";
  };
  const set = (value: number) => {
    ratio = clampSplit(value);
    if (drag === null) root.dataset.resizing = "false";
    mobile = !preview && area.clientWidth < 380;
    draw();
  };
  const c = createScenarioController(
    root,
    {
      default: () => {
        set(50);
      },
      balanced: () => set(50),
      dragging: () => {
        set(65);
        root.dataset.resizing = "true";
      },
      minimum: () => set(25),
      maximum: () => set(75),
      compact: () => {
        mobile = true;
        draw();
      },
    },
    preview,
  );
  c.on(divider, "pointerdown", (e: PointerEvent) => {
    if (mobile || e.button !== 0 || drag !== null) return;
    e.preventDefault();
    drag = e.pointerId;
    start = ratio;
    divider.setPointerCapture(e.pointerId);
    root.dataset.resizing = "true";
    c.state("dragging");
  });
  c.on(divider, "pointermove", (e: PointerEvent) => {
    if (drag !== e.pointerId) return;
    const r = area.getBoundingClientRect();
    set(((e.clientX - r.left - 7) / Math.max(1, r.width - 14)) * 100);
  });
  c.on(divider, "pointerup", () => {
    release();
    c.state(
      ratio <= 25
        ? "minimum"
        : ratio >= 75
          ? "maximum"
          : ratio === 50
            ? "balanced"
            : "default",
    );
  });
  c.on(divider, "pointercancel", () => {
    release();
    set(start);
    c.state(ratio === 50 ? "balanced" : "default");
  });
  c.on(divider, "keydown", (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(e.key))
      return;
    e.preventDefault();
    if (e.key === "Escape") {
      release();
      set(start);
    } else
      set(
        e.key === "Home"
          ? 25
          : e.key === "End"
            ? 75
            : ratio + (e.key === "ArrowLeft" ? -5 : 5),
      );
    c.state(
      ratio <= 25
        ? "minimum"
        : ratio >= 75
          ? "maximum"
          : ratio === 50
            ? "balanced"
            : "default",
    );
  });
  root.querySelectorAll<HTMLButtonElement>("[data-ratio]").forEach((b) =>
    c.on(b, "click", () => {
      release();
      set(Number(b.dataset.ratio));
      c.state(
        ratio === 25
          ? "minimum"
          : ratio === 75
            ? "maximum"
            : ratio === 50
              ? "balanced"
              : "default",
      );
    }),
  );
  const choose = (value: string) => {
    tab = value;
    draw();
  };
  root.querySelectorAll<HTMLButtonElement>("[data-panel-tab]").forEach((b) => {
    c.on(b, "click", () => choose(b.dataset.panelTab!));
    c.on(b, "keydown", (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        choose(
          e.key === "Home"
            ? "editor"
            : e.key === "End"
              ? "result"
              : tab === "editor"
                ? "result"
                : "editor",
        );
        root
          .querySelector<HTMLButtonElement>(`[data-panel-tab="${tab}"]`)!
          .focus();
      }
    });
  });
  const input = root.querySelector<HTMLTextAreaElement>("[data-panel-input]")!,
    result = root.querySelector<HTMLElement>("[data-panel-result]")!,
    metrics = root.querySelector<HTMLElement>("[data-panel-metrics]")!;
  c.on(input, "input", () => {
    result.textContent = input.value || "내용을 입력하면 여기에 보여요.";
    metrics.textContent = formatTextMetrics(input.value, 120);
  });
  if (!preview) {
    const observer = new ResizeObserver(() => {
      const next = area.clientWidth < 380;
      if (next !== mobile) {
        const dividerFocused = document.activeElement === divider;
        const activePanel = (
          document.activeElement as Element | null
        )?.closest<HTMLElement>("[data-panel]");
        release();
        mobile = next;
        if (mobile && activePanel && area.contains(activePanel))
          tab = activePanel.dataset.panel!;
        draw();
        if (mobile && dividerFocused)
          root
            .querySelector<HTMLButtonElement>(`[data-panel-tab="${tab}"]`)
            ?.focus();
        c.state(
          mobile
            ? "compact"
            : ratio <= 25
              ? "minimum"
              : ratio >= 75
                ? "maximum"
                : ratio === 50
                  ? "balanced"
                  : "default",
        );
      }
    });
    observer.observe(area);
    c.cleanup(() => {
      observer.disconnect();
      release();
    });
    mobile = area.clientWidth < 380;
  }
  c.set("default");
  c.ready();
  return c;
}
export function PanelsScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachPanels,
    preview,
    ["balanced", "dragging", "maximum", "balanced"][
      Math.floor(time / 1200) % 4
    ],
  );
  return (
    <ExpansionFrame
      kind="split-view"
      title="편집과 결과 나란히 보기"
      root={root}
      preview={preview}
    >
      <div
        role="tablist"
        aria-label="분할 화면 대체"
        className="layout-panel-tabs"
      >
        <button
          role="tab"
          aria-controls={`${id}-editor`}
          data-panel-tab="editor"
          aria-selected="true"
        >
          편집
        </button>
        <button
          role="tab"
          aria-controls={`${id}-result`}
          data-panel-tab="result"
          aria-selected="false"
          tabIndex={-1}
        >
          결과
        </button>
      </div>
      <div data-panels className="layout-panels">
        <section data-panel="editor" id={`${id}-editor`}>
          <strong>편집</strong>
          <textarea
            data-panel-input
            aria-label="미리볼 문구"
            defaultValue="오늘의 UI 노트"
            maxLength={120}
          />
          <small data-panel-metrics>
            {formatTextMetrics("오늘의 UI 노트", 120)}
          </small>
        </section>
        <div
          role="separator"
          aria-label="편집 패널 너비"
          aria-orientation="vertical"
          aria-valuemin={25}
          aria-valuemax={75}
          aria-valuenow={50}
          aria-controls={`${id}-editor`}
          tabIndex={0}
          data-divider
        >
          <span aria-hidden="true">⋮</span>
        </div>
        <section data-panel="result" id={`${id}-result`}>
          <strong>결과</strong>
          <p data-panel-result>오늘의 UI 노트</p>
        </section>
      </div>
      <div className="layout-controls layout-extra">
        <button data-ratio="25">25%</button>
        <button data-ratio="50">50% · 초기화</button>
        <button data-ratio="75">75%</button>
      </div>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachMega(root: HTMLElement, preview = false) {
  const nav = root.querySelector<HTMLElement>("[data-mega-nav]")!,
    buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-mega-group]"),
    ),
    panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-mega-panel]"),
    );
  let group = "",
    current = "첫 화면 설계",
    closing: ReturnType<typeof setTimeout> | undefined;
  const draw = () => {
    buttons.forEach((b) =>
      b.setAttribute("aria-expanded", String(b.dataset.megaGroup === group)),
    );
    panels.forEach((p) => (p.hidden = p.dataset.megaPanel !== group));
    root
      .querySelectorAll<HTMLAnchorElement>("[data-mega-link]")
      .forEach((a) => {
        if (a.dataset.megaLink === current)
          a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    root.querySelector<HTMLElement>("[data-mega-current]")!.textContent =
      current;
  };
  const close = (focus = false) => {
    const previous = group;
    group = "";
    root.dataset.megaCompact = "false";
    draw();
    if (focus) buttons.find((b) => b.dataset.megaGroup === previous)?.focus();
  };
  const c = createScenarioController(
    root,
    {
      default: () => close(),
      closed: () => close(),
      products: () => {
        root.dataset.megaCompact = "false";
        group = "products";
        draw();
      },
      resources: () => {
        root.dataset.megaCompact = "false";
        group = "resources";
        draw();
      },
      selected: () => {
        group = "";
        current = "디자인 토큰";
        draw();
      },
      mobile: () => {
        root.dataset.megaCompact = "true";
        group = "support";
        draw();
      },
    },
    preview,
  );
  buttons.forEach((b) => {
    c.on(b, "click", () => {
      group = group === b.dataset.megaGroup ? "" : b.dataset.megaGroup!;
      draw();
      c.state(
        group === "resources"
          ? "resources"
          : group === "support"
            ? root.clientWidth < 420
              ? "mobile"
              : "default"
            : group
              ? "products"
              : "closed",
      );
    });
    c.on(b, "pointerenter", (e: PointerEvent) => {
      if (
        e.pointerType !== "mouse" ||
        !root.querySelector<HTMLInputElement>("[data-mega-hover]")!.checked
      )
        return;
      clearTimeout(closing);
      group = b.dataset.megaGroup!;
      draw();
    });
  });
  c.on(nav, "pointerenter", () => clearTimeout(closing));
  c.on(nav, "pointerleave", (e: PointerEvent) => {
    if (
      e.pointerType === "mouse" &&
      root.querySelector<HTMLInputElement>("[data-mega-hover]")!.checked
    )
      closing = setTimeout(() => {
        if (!nav.contains(document.activeElement)) close();
      }, 180);
  });
  c.on(root, "click", (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>(
      "[data-mega-link]",
    );
    if (!a) return;
    e.preventDefault();
    current = a.dataset.megaLink!;
    close(true);
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${current} 예제 문서를 선택했어요. 외부 페이지로 이동하지 않습니다.`;
    c.state("selected");
  });
  c.on(root, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && group) {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      c.state("closed");
    }
  });
  c.on(document, "pointerdown", (e: PointerEvent) => {
    if (group && !nav.contains(e.target as Node)) {
      close();
      c.state("closed");
    }
  });
  c.on(nav, "focusout", (e: FocusEvent) => {
    if (e.relatedTarget && !nav.contains(e.relatedTarget as Node)) {
      close();
      c.state("closed");
    }
  });
  c.cleanup(() => clearTimeout(closing));
  c.set("default");
  c.ready();
  return c;
}
export function MegaMenuScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  useExpansion(
    root,
    attachMega,
    preview,
    ["closed", "products", "resources", "selected"][
      Math.floor(time / 1200) % 4
    ],
  );
  return (
    <ExpansionFrame
      kind="mega-menu"
      title="필요한 자료 빠르게 찾기"
      root={root}
      preview={preview}
    >
      <nav aria-label="예제 사이트 탐색" data-mega-nav className="layout-mega">
        <div className="layout-mega-triggers">
          {[
            ["products", "제품"],
            ["resources", "자료"],
            ["support", "지원"],
          ].map(([key, label]) => (
            <button
              key={key}
              data-mega-group={key}
              aria-expanded="false"
              aria-controls={`${id}-${key}`}
            >
              {label}
              <span aria-hidden="true">⌄</span>
            </button>
          ))}
        </div>
        {[
          [
            "products",
            "시작하기",
            "첫 화면 설계",
            "입력과 검증",
            "데이터 탐색",
          ],
          [
            "resources",
            "제작 자료",
            "디자인 토큰",
            "코드 예제",
            "검토 체크리스트",
          ],
          [
            "support",
            "도움받기",
            "자주 묻는 질문",
            "접근성 안내",
            "업데이트 소식",
          ],
        ].map(([key, title, ...links]) => (
          <section
            key={key}
            id={`${id}-${key}`}
            data-mega-panel={key}
            className="layout-mega-panel"
            hidden
          >
            <strong>{title}</strong>
            <div>
              {links.map((label, i) => (
                <a
                  key={label}
                  href={`#${id}-${key}-${i}`}
                  data-mega-link={label}
                >
                  {label}
                  <small>
                    {
                      [
                        "구조와 작업 흐름",
                        "실행 예제와 주의사항",
                        "비교하고 선택하기",
                      ][i]
                    }
                  </small>
                </a>
              ))}
            </div>
          </section>
        ))}
      </nav>
      <article className="layout-mega-document">
        <small>현재 예제 문서</small>
        <h3 data-mega-current>첫 화면 설계</h3>
        <p>메뉴에서 주제를 바꾸어 보세요.</p>
      </article>
      <label className="expansion-check layout-extra">
        <input type="checkbox" data-mega-hover />
        마우스 올려 열기
      </label>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachReveal(root: HTMLElement, preview = false) {
  const viewport = root.querySelector<HTMLElement>("[data-reveal-viewport]")!,
    cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal-card]"),
    ),
    mode = root.querySelector<HTMLSelectElement>("[data-reveal-mode]")!,
    threshold = root.querySelector<HTMLSelectElement>(
      "[data-reveal-threshold]",
    )!;
  let observer: IntersectionObserver | null = null,
    staticMode = false,
    staged = false;
  const seen = new Set<HTMLElement>();
  const showAll = () => {
    cards.forEach((el) => (el.dataset.shown = "true"));
  };
  const setup = (reset = true) => {
    staged = false;
    observer?.disconnect();
    if (reset) seen.clear();
    if (preview) return;
    if (
      staticMode ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      root.dataset.revealEnhanced = "false";
      showAll();
      return;
    }
    root.dataset.revealEnhanced = "true";
    cards.forEach((el) => (el.dataset.shown = String(seen.has(el))));
    observer = new IntersectionObserver(
      (entries) => {
        if (staged || staticMode || document.hidden) return;
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.dataset.shown = "true";
            seen.add(el);
            if (mode.value === "once") observer?.unobserve(el);
          } else if (
            mode.value === "repeat" &&
            !el.contains(document.activeElement)
          )
            el.dataset.shown = "false";
        }
        root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
          `영역 진입 ${seen.size} / ${cards.length}개 · ${mode.value === "once" ? "한 번만" : "재진입마다"}`;
        c.state(
          mode.value === "repeat"
            ? "repeat"
            : seen.size === cards.length
              ? "visible"
              : "revealing",
        );
      },
      { root: viewport, threshold: Number(threshold.value) },
    );
    cards.forEach((el) => {
      if (mode.value !== "once" || !seen.has(el)) observer!.observe(el);
    });
  };
  const preset = (state: string) => {
    observer?.disconnect();
    staticMode = false;
    staged = true;
    seen.clear();
    root.dataset.revealEnhanced = "true";
    cards.forEach((el, i) => {
      const shown = state === "visible" || (state === "revealing" && i < 2);
      el.dataset.shown = String(shown);
      if (shown) seen.add(el);
    });
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      state === "before"
        ? "진입 전 · 목록을 스크롤하거나 Tab으로 카드에 접근해 보세요."
        : `표시 ${seen.size} / ${cards.length}개 · 스크롤하면 실제 진입 감지로 이어집니다.`;
  };
  const c = createScenarioController(
    root,
    {
      default: () => {
        staticMode = false;
        setup();
      },
      before: () => preset("before"),
      revealing: () => preset("revealing"),
      visible: () => preset("visible"),
      repeat: () => {
        mode.value = "repeat";
        staticMode = false;
        setup();
      },
      static: () => {
        staticMode = true;
        setup();
        root.dataset.revealEnhanced = "false";
        showAll();
      },
    },
    preview,
  );
  c.on(mode, "change", () => {
    setup();
    c.state(mode.value === "repeat" ? "repeat" : "default");
  });
  c.on(threshold, "change", setup);
  c.on(root.querySelector("[data-reveal-reset]")!, "click", () => {
    viewport.scrollTop = 0;
    setup();
  });
  c.on(viewport, "focusin", (e: FocusEvent) => {
    const card = (e.target as Element).closest<HTMLElement>(
      "[data-reveal-card]",
    );
    if (card) {
      card.dataset.shown = "true";
      seen.add(card);
      if (!staticMode)
        c.state(
          mode.value === "repeat"
            ? "repeat"
            : seen.size === cards.length
              ? "visible"
              : "revealing",
        );
    }
  });
  c.on(viewport, "scroll", () => {
    if (staticMode) return;
    if (staged) setup(false);
    c.state(
      mode.value === "repeat"
        ? "repeat"
        : seen.size === cards.length
          ? "visible"
          : "revealing",
    );
  });
  c.on(document, "visibilitychange", () => {
    if (document.hidden) observer?.disconnect();
    else if (!staged) setup(false);
  });
  c.cleanup(() => observer?.disconnect());
  c.on(root, "click", (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLElement>(
      "[data-layout-note]",
    );
    if (!button) return;
    const title =
      button.closest("article")?.querySelector("h3")?.textContent ||
      button.textContent;
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${title} 예제를 확인했어요. 외부 이동은 하지 않습니다.`;
  });
  c.set("default");
  c.ready();
  return c;
}
export function RevealScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachReveal,
    preview,
    ["before", "revealing", "visible", "repeat"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="scroll-reveal"
      title="스크롤하며 읽는 제작 과정"
      root={root}
      preview={preview}
    >
      <div className="layout-controls layout-extra">
        <label>
          실행 횟수
          <select data-reveal-mode defaultValue="once">
            <option value="once">한 번만</option>
            <option value="repeat">재진입마다</option>
          </select>
        </label>
        <label>
          진입 비율
          <select data-reveal-threshold defaultValue="0.2">
            <option value="0.2">20%</option>
            <option value="0.6">60%</option>
          </select>
        </label>
        <button data-reveal-reset>처음부터</button>
      </div>
      <div
        className="layout-reveal-viewport"
        data-reveal-viewport
        tabIndex={0}
        role="region"
        aria-label="등장 효과 내부 스크롤"
      >
        {["자료 조사", "화면 설계", "프로토타입", "실무 검토"].map((s, i) => (
          <article data-reveal-card key={s}>
            <span>0{i + 1}</span>
            <h3>{s}</h3>
            <p>
              {
                [
                  "사용자의 상황과 목적을 먼저 확인해요.",
                  "입력과 오류 복구 흐름을 구체화해요.",
                  "직접 조작하고 작은 화면에서도 비교해요.",
                  "결과와 전달할 내용을 함께 정리해요.",
                ][i]
              }
            </p>
            <button data-layout-note>예제 확인</button>
          </article>
        ))}
      </div>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachStagger(root: HTMLElement, preview = false) {
  const list = root.querySelector<HTMLElement>("[data-stagger-list]")!,
    delay = root.querySelector<HTMLSelectElement>("[data-stagger-delay]")!,
    status = root.querySelector<HTMLElement>("[data-layout-status]")!;
  let frame = 0,
    generation = 0;
  const stop = () => {
    generation++;
    cancelAnimationFrame(frame);
    root.dataset.staggerRunning = "false";
  };
  const finish = () => {
    stop();
    list.querySelectorAll<HTMLElement>("li").forEach((el) => {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };
  const run = () => {
    stop();
    const version = generation;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("li"));
    if (preview) {
      cards.forEach((el, i) => {
        el.style.opacity = i < 2 ? "1" : ".18";
        el.style.transform = i < 2 ? "none" : "translateY(14px)";
      });
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      status.textContent = "모션 선호에 따라 전체 내용을 바로 표시했어요.";
      return;
    }
    root.dataset.staggerRunning = "true";
    cards.forEach((el) => {
      el.style.animation = "none";
      el.style.opacity = "0";
    });
    frame = requestAnimationFrame(() => {
      if (version !== generation) return;
      cards.forEach((el, i) => {
        el.style.animation = `layout-arrive 360ms ease ${i * Number(delay.value)}ms both`;
      });
      status.textContent = `${delay.value}ms 간격 · 총 ${360 + 3 * Number(delay.value)}ms · 읽기 순서는 그대로예요.`;
    });
  };
  const c = createScenarioController(
    root,
    {
      default: run,
      simultaneous: () => {
        delay.value = "0";
        run();
      },
      sequential: () => {
        delay.value = "80";
        run();
      },
      restart: run,
      static: () => {
        finish();
        status.textContent = "전체 내용을 정적으로 표시합니다.";
      },
    },
    preview,
  );
  c.on(root.querySelector("[data-stagger-start]")!, "click", () => {
    run();
    c.state("restart");
  });
  c.on(delay, "change", () => {
    run();
    c.state(delay.value === "0" ? "simultaneous" : "sequential");
  });
  c.on(root.querySelector("[data-stagger-order]")!, "click", () => {
    finish();
    Array.from(list.children)
      .reverse()
      .forEach((el) => list.appendChild(el));
    run();
  });
  c.on(list, "focusin", (e: FocusEvent) => {
    const el = (e.target as Element).closest<HTMLElement>("li");
    if (el) {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  });
  c.on(list, "animationend", (e: AnimationEvent) => {
    if (e.target === list.lastElementChild)
      root.dataset.staggerRunning = "false";
  });
  c.on(document, "visibilitychange", () => {
    if (document.hidden) finish();
  });
  c.cleanup(finish);
  c.on(root, "click", (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLElement>(
      "[data-layout-note]",
    );
    if (!button) return;
    const title =
      button.closest("article")?.querySelector("h3")?.textContent ||
      button.textContent;
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${title} 예제를 확인했어요. 외부 이동은 하지 않습니다.`;
  });
  c.set("default");
  c.ready();
  return c;
}
export function StaggerScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachStagger,
    preview,
    ["static", "sequential", "restart", "static"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="stagger-animation"
      title="읽는 순서대로 등장하는 카드"
      root={root}
      preview={preview}
    >
      <div className="layout-controls layout-extra">
        <label>
          항목 간격
          <select data-stagger-delay defaultValue="80">
            <option value="0">0ms · 동시에</option>
            <option value="80">80ms</option>
            <option value="160">160ms</option>
          </select>
        </label>
        <button data-stagger-start>다시 재생</button>
        <button data-stagger-order>순서 뒤집기</button>
      </div>
      <ol data-stagger-list className="layout-stagger-list">
        {["기획 확인", "디자인 검토", "코드 구현", "작동 점검"].map((s, i) => (
          <li key={s} data-stagger-id={i}>
            <button data-layout-note>{s}</button>
            <span>0{i + 1}</span>
          </li>
        ))}
      </ol>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachSnap(root: HTMLElement, preview = false) {
  const viewport = root.querySelector<HTMLElement>("[data-snap-viewport]")!,
    cards = Array.from(root.querySelectorAll<HTMLElement>("[data-snap-card]")),
    mode = root.querySelector<HTMLSelectElement>("[data-snap-mode]")!,
    status = root.querySelector<HTMLElement>("[data-layout-status]")!;
  let current = 0,
    frame = 0;
  const render = () => {
    root.querySelector<HTMLButtonElement>("[data-snap-prev]")!.disabled =
      current === 0;
    root.querySelector<HTMLButtonElement>("[data-snap-next]")!.disabled =
      current === cards.length - 1;
    status.textContent = `${current + 1} / ${cards.length} · ${mode.value === "none" ? "자유 스크롤" : mode.value === "proximity" ? "가까운 위치 정착" : "항목에 정착"}`;
    cards.forEach((el, i) =>
      el.setAttribute("aria-current", String(i === current)),
    );
  };
  const move = (index: number) => {
    current = Math.max(0, Math.min(cards.length - 1, index));
    if (preview) {
      viewport.scrollLeft = current * (cards[0].offsetWidth + 10);
    } else
      viewport.scrollTo({
        left: cards[current].offsetLeft - cards[0].offsetLeft,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    render();
  };
  const apply = (value: string) => {
    mode.value = value;
    viewport.style.scrollSnapType = value === "none" ? "none" : `x ${value}`;
    render();
  };
  const c = createScenarioController(
    root,
    {
      default: () => {
        apply("mandatory");
        move(0);
      },
      free: () => {
        apply("none");
        move(0);
      },
      proximity: () => {
        apply("proximity");
        move(1);
      },
      mandatory: () => {
        apply("mandatory");
        move(1);
      },
      last: () => {
        apply("mandatory");
        move(3);
      },
    },
    preview,
  );
  c.on(root.querySelector("[data-snap-prev]")!, "click", () =>
    move(current - 1),
  );
  c.on(root.querySelector("[data-snap-next]")!, "click", () =>
    move(current + 1),
  );
  c.on(mode, "change", () => {
    apply(mode.value);
    c.state(mode.value === "none" ? "free" : mode.value);
  });
  c.on(viewport, "scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const base = cards[0].offsetLeft;
      current = cards.reduce(
        (best, el, i) =>
          Math.abs(el.offsetLeft - base - viewport.scrollLeft) <
          Math.abs(cards[best].offsetLeft - base - viewport.scrollLeft)
            ? i
            : best,
        0,
      );
      render();
    });
  });
  c.on(viewport, "keydown", (e: KeyboardEvent) => {
    if (e.target !== viewport) return;
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      move(
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? 3
            : current + (e.key === "ArrowLeft" ? -1 : 1),
      );
    }
  });
  if (!preview) {
    const ro = new ResizeObserver(() => move(current));
    ro.observe(viewport);
    c.cleanup(() => ro.disconnect());
  }
  c.cleanup(() => cancelAnimationFrame(frame));
  c.on(root, "click", (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLElement>(
      "[data-layout-note]",
    );
    if (!button) return;
    const title =
      button.closest("article")?.querySelector("h3")?.textContent ||
      button.textContent;
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${title} 예제를 확인했어요. 외부 이동은 하지 않습니다.`;
  });
  c.set("default");
  c.ready();
  return c;
}
export function SnapScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachSnap,
    preview,
    ["free", "proximity", "mandatory", "last"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="scroll-snap"
      title="한 장씩 정착하는 여행 노트"
      root={root}
      preview={preview}
    >
      <label className="layout-select layout-extra">
        정착 강도
        <select data-snap-mode defaultValue="mandatory">
          <option value="none">자유 스크롤</option>
          <option value="proximity">가까운 위치 정착</option>
          <option value="mandatory">항목에 정착</option>
        </select>
      </label>
      <div
        data-snap-viewport
        className="layout-snap-viewport"
        role="region"
        aria-label="여행 노트 가로 스크롤"
        tabIndex={0}
      >
        {["서울", "부산", "제주", "여행 정리"].map((s, i) => (
          <article data-snap-card key={s}>
            <span>JOURNEY 0{i + 1}</span>
            <h3>{s}</h3>
            <p>
              {i === 3
                ? "여행 중 기록한 장소와 이동 경로를 한곳에 정리합니다. 긴 내용은 카드 안에서 모두 읽을 수 있고 다음 장으로 강제 전환하지 않습니다."
                : "가보고 싶은 장소와 여행 계획을 기록해 보세요."}
            </p>
            <button data-layout-note>노트 확인</button>
          </article>
        ))}
      </div>
      <div className="layout-controls">
        <button data-snap-prev>이전</button>
        <button data-snap-next>다음</button>
      </div>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}

export function attachParallax(root: HTMLElement, preview = false) {
  const viewport = root.querySelector<HTMLElement>("[data-depth-viewport]")!,
    back = root.querySelector<HTMLElement>("[data-depth-back]")!,
    front = root.querySelector<HTMLElement>("[data-depth-front]")!,
    mode = root.querySelector<HTMLSelectElement>("[data-depth-mode]")!;
  let frame = 0,
    active = true;
  const render = () => {
    const max = viewport.scrollHeight - viewport.clientHeight,
      p = max > 0 ? Math.max(0, Math.min(1, viewport.scrollTop / max)) : 0,
      reduce =
        !preview && matchMedia("(prefers-reduced-motion: reduce)").matches,
      factor =
        reduce || mode.value === "static"
          ? 0
          : mode.value === "strong"
            ? 1
            : 0.45;
    back.style.transform = `translateY(${Math.round(p * 48 * factor)}px)`;
    front.style.transform = `translateY(${Math.round(-p * 30 * factor)}px)`;
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${Math.round(p * 100)}% · ${factor === 0 ? "정적 배경" : mode.value === "strong" ? "강한 시차" : "약한 시차"}`;
  };
  const schedule = () => {
    if (!active || document.hidden) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  };
  const set = (value: string, position = 0) => {
    mode.value = value;
    viewport.scrollTop = position;
    render();
  };
  const c = createScenarioController(
    root,
    {
      default: () => set("weak"),
      static: () => set("static", 90),
      weak: () => set("weak", 90),
      strong: () => set("strong", 145),
      compact: () => set("static", 90),
    },
    preview,
  );
  c.on(viewport, "scroll", schedule, { passive: true });
  c.on(mode, "change", () => {
    render();
    c.state(mode.value);
  });
  c.on(root.querySelector("[data-depth-reset]")!, "click", () => {
    viewport.scrollTop = 0;
    render();
  });
  c.on(document, "visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else schedule();
  });
  if (!preview) {
    const io = new IntersectionObserver((entries) => {
      active = entries[0]?.isIntersecting ?? false;
      if (active) schedule();
      else cancelAnimationFrame(frame);
    });
    io.observe(root);
    const ro = new ResizeObserver(schedule);
    ro.observe(viewport);
    c.cleanup(() => {
      io.disconnect();
      ro.disconnect();
    });
  }
  c.cleanup(() => cancelAnimationFrame(frame));
  c.on(root, "click", (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLElement>(
      "[data-layout-note]",
    );
    if (!button) return;
    const title =
      button.closest("article")?.querySelector("h3")?.textContent ||
      button.textContent;
    root.querySelector<HTMLElement>("[data-layout-status]")!.textContent =
      `${title} 예제를 확인했어요. 외부 이동은 하지 않습니다.`;
  });
  c.set("default");
  c.ready();
  return c;
}
export function ParallaxScene({ preview = false, time = 0 }: ExpansionProps) {
  const root = useRef<HTMLDivElement>(null);
  useExpansion(
    root,
    attachParallax,
    preview,
    ["static", "weak", "strong", "weak"][Math.floor(time / 1200) % 4],
  );
  return (
    <ExpansionFrame
      kind="parallax-scroll"
      title="속도 차이로 만드는 풍경"
      root={root}
      preview={preview}
    >
      <div className="layout-controls layout-extra">
        <label>
          배경 움직임
          <select data-depth-mode defaultValue="weak">
            <option value="static">정적</option>
            <option value="weak">약한 시차</option>
            <option value="strong">강한 시차</option>
          </select>
        </label>
        <button data-depth-reset>맨 위로</button>
      </div>
      <div
        data-depth-viewport
        className="layout-depth-viewport"
        role="region"
        aria-label="풍경 내부 스크롤"
        tabIndex={0}
      >
        <div className="layout-depth-story">
          <div className="layout-depth-art" aria-hidden="true">
            <div data-depth-back className="layout-depth-back">
              <i />
              <b />
            </div>
            <div data-depth-front className="layout-depth-front">
              <i />
              <b />
            </div>
          </div>
          <div className="layout-depth-copy">
            <small>WEEKEND WALK</small>
            <h3>도시에서 잠깐 벗어나기</h3>
            <p>
              배경과 전경은 다른 속도로 움직이고, 이 문장은 문서의 자연스러운
              속도로 흐릅니다.
            </p>
            <p>아래로 내려 장면의 깊이를 비교해 보세요.</p>
            <p>중요한 정보와 버튼은 장식 효과가 없어도 읽을 수 있어요.</p>
            <button data-layout-note>풍경 노트 확인</button>
          </div>
        </div>
      </div>
      <p data-layout-status className="layout-status" role="status" />
    </ExpansionFrame>
  );
}
