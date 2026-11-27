import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
type SceneProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
function AdvancedFrame({
  kind,
  title,
  preview,
  children,
}: {
  kind: string;
  title: string;
  preview: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`scene advanced-scene scene-${kind} ${preview ? "is-preview" : ""}`}
    >
      <div className="advanced-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
function AdvancedIcon({
  kind,
}: {
  kind: "folder" | "file" | "empty" | "error" | "grip" | "chevron";
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "folder" ? (
        <path d="M3 6h7l2 3h9v11H3z" />
      ) : kind === "file" ? (
        <>
          <path d="M14 3H5v18h14V8zM14 3v5h5M8 13h8M8 17h5" />
        </>
      ) : kind === "empty" ? (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h5M9 17h6" />
        </>
      ) : kind === "error" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        </>
      ) : kind === "chevron" ? (
        <path d="m9 5 7 7-7 7" />
      ) : (
        <>
          <path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" />
        </>
      )}
    </svg>
  );
}
type TreeRecord = {
  id: string;
  name: string;
  parent?: string;
  children?: string[];
};
const treeNodes: TreeRecord[] = [
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
export function visibleTree(open: string[]) {
  const result: string[] = [];
  const visit = (id: string) => {
    result.push(id);
    if (open.includes(id))
      treeNodes.find((n) => n.id === id)?.children?.forEach(visit);
  };
  treeNodes.filter((n) => !n.parent).forEach((n) => visit(n.id));
  return result;
}
export function TreeScene({ preview = false, time = 1700 }: SceneProps) {
  const [expanded, setExpanded] = useState(["projects"]),
    [active, setActive] = useState("projects"),
    [selected, setSelected] = useState("");
  const root = useRef<HTMLUListElement>(null),
    uid = useId();
  const opened = preview
      ? time < 700
        ? []
        : time < 1600
          ? ["projects"]
          : ["projects", "design"]
      : expanded,
    chosen = preview && time >= 2600 ? "tokens" : selected;
  const focus = (id: string) => {
    setActive(id);
    root.current?.querySelector<HTMLElement>(`[data-tree="${id}"]`)?.focus();
  };
  const activate = (id: string) => {
    const item = treeNodes.find((n) => n.id === id)!;
    setActive(id);
    setSelected(id);
    if (item.children)
      setExpanded((v) =>
        v.includes(id) ? v.filter((n) => n !== id) : [...v, id],
      );
  };
  const key = (e: KeyboardEvent<HTMLLIElement>, id: string) => {
    e.stopPropagation();
    if (e.nativeEvent.isComposing) return;
    const item = treeNodes.find((n) => n.id === id)!,
      visible = visibleTree(expanded),
      index = visible.indexOf(id);
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
      focus(visible[Math.min(index + 1, visible.length - 1)]);
    else if (e.key === "ArrowUp") focus(visible[Math.max(0, index - 1)]);
    else if (e.key === "Home") focus(visible[0]);
    else if (e.key === "End") focus(visible.at(-1)!);
    else if (e.key === "ArrowRight" && item.children) {
      if (expanded.includes(id)) focus(item.children[0]);
      else setExpanded((v) => [...v, id]);
    } else if (e.key === "ArrowLeft") {
      if (item.children && expanded.includes(id))
        setExpanded((v) => v.filter((n) => n !== id));
      else if (item.parent) focus(item.parent);
    } else if (e.key === "Enter" || e.key === " ") activate(id);
    else if (e.key.length === 1) {
      const after = [
        ...visible.slice(index + 1),
        ...visible.slice(0, index + 1),
      ];
      const found = after.find((n) =>
        treeNodes.find((r) => r.id === n)!.name.startsWith(e.key),
      );
      if (found) focus(found);
    }
  };
  const node = (id: string): ReactNode => {
    const n = treeNodes.find((r) => r.id === id)!;
    return (
      <li
        key={id}
        data-tree={id}
        role="treeitem"
        tabIndex={active === id ? 0 : -1}
        aria-labelledby={`${uid}-${id}`}
        aria-selected={chosen === id}
        aria-expanded={n.children ? opened.includes(id) : undefined}
        onKeyDown={(e) => key(e, id)}
        onClick={(e) => {
          e.stopPropagation();
          activate(id);
        }}
      >
        <span className="advanced-tree-row">
          <i className={opened.includes(id) ? "is-open" : ""}>
            {n.children && <AdvancedIcon kind="chevron" />}
          </i>
          <AdvancedIcon kind={n.children ? "folder" : "file"} />
          <span id={`${uid}-${id}`}>{n.name}</span>
        </span>
        {n.children && (
          <ul role="group" hidden={!opened.includes(id)}>
            {n.children.map(node)}
          </ul>
        )}
      </li>
    );
  };
  return (
    <AdvancedFrame kind="tree-view" title="프로젝트 문서" preview={preview}>
      <ul
        ref={root}
        className="advanced-tree"
        role="tree"
        aria-label="문서 계층"
      >
        {treeNodes.filter((n) => !n.parent).map((n) => node(n.id))}
      </ul>
      <div className="advanced-result" role={preview ? undefined : "status"}>
        {chosen
          ? `${treeNodes.find((n) => n.id === chosen)?.name} 선택`
          : "폴더를 펼쳐 문서를 선택하세요."}
      </div>
      {!preview && (
        <p className="advanced-help">
          방향키로 탐색 · Enter로 선택 · 펼침과 선택은 구분해요.
        </p>
      )}
    </AdvancedFrame>
  );
}
const carouselSlides = [
  {
    title: "프로젝트의 첫 화면",
    label: "FIRST IMPRESSION",
    body: "처음 방문한 사람이 다음 행동을 찾게 해요.",
  },
  {
    title: "읽기 좋은 목록",
    label: "CLEAR CONTENT",
    body: "같은 정보는 같은 위치에서 비교해요.",
  },
  {
    title: "작은 상태 안내",
    label: "HELPFUL FEEDBACK",
    body: "저장·실패·빈 결과를 구분해 안내해요.",
  },
];
export function CarouselScene({ preview = false, time = 1700 }: SceneProps) {
  const [index, setIndex] = useState(0);
  const current = preview ? Math.floor(time / 1000) % 3 : index,
    item = carouselSlides[current];
  return (
    <AdvancedFrame kind="carousel" title="디자인 읽을거리" preview={preview}>
      <section
        className="advanced-carousel"
        aria-roledescription="캐러셀"
        aria-label="추천 읽을거리"
      >
        <div
          className={`advanced-slide slide-${current}`}
          role="group"
          aria-roledescription="슬라이드"
          aria-label={`${current + 1} / 3`}
        >
          <span className="advanced-kicker">{item.label}</span>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
        <div className="advanced-carousel-controls">
          <button
            type="button"
            data-slide-step="-1"
            onClick={() => setIndex((v) => (v + 2) % 3)}
          >
            이전
          </button>
          <div
            className="advanced-dots"
            role="group"
            aria-label="슬라이드 위치"
          >
            {carouselSlides.map((s, i) => (
              <button
                type="button"
                key={s.title}
                data-slide={i}
                aria-label={`슬라이드 ${i + 1} 보기`}
                aria-pressed={i === current}
                onClick={() => setIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-slide-step="1"
            onClick={() => setIndex((v) => (v + 1) % 3)}
          >
            다음
          </button>
        </div>
      </section>
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {current + 1} / 3 · {item.title}
      </p>
    </AdvancedFrame>
  );
}
type DataRow = {
  id: string;
  name: string;
  owner: string;
  cost: number;
  month: string;
  kind: string;
};
const advancedRows: DataRow[] = [
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
export function DataTableScene({ preview = false, time = 1700 }: SceneProps) {
  const [draft, setDraft] = useState("all"),
    [month, setMonth] = useState("all"),
    [failure, setFailure] = useState(false),
    [error, setError] = useState(""),
    [selected, setSelected] = useState("");
  const chosen = preview
      ? time < 1000
        ? "all"
        : time < 2500
          ? "11"
          : "12"
      : month,
    rows = advancedRows.filter((r) => chosen === "all" || r.month === chosen),
    uid = useId();
  return (
    <AdvancedFrame
      kind="data-table"
      title="프로젝트 비용 현황"
      preview={preview}
    >
      {!preview && (
        <form
          className="advanced-controls"
          onSubmit={(e) => {
            e.preventDefault();
            if (failure) {
              setError("조회하지 못했어요. 기존 표를 유지합니다.");
              return;
            }
            setMonth(draft);
            setError("");
            setSelected("");
          }}
        >
          <label htmlFor={`${uid}-month`}>
            조회 월
            <select
              id={`${uid}-month`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="11">11월</option>
              <option value="12">12월</option>
              <option value="10">10월 · 자료 없음</option>
            </select>
          </label>
          <button type="submit">조회 적용</button>
          <label className="advanced-check">
            <input
              type="checkbox"
              checked={failure}
              onChange={(e) => setFailure(e.target.checked)}
            />
            조회 실패 모의
          </label>
        </form>
      )}
      <div className="advanced-table-scroll">
        <table className="advanced-table">
          <caption>
            {chosen === "all" ? "전체 기간" : `${chosen}월`} 프로젝트 비용 ·
            읽기용 표
          </caption>
          <thead>
            <tr>
              <th scope="col">프로젝트</th>
              <th scope="col">담당</th>
              <th scope="col">비용</th>
              {!preview && <th scope="col">보기</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">{r.name}</th>
                <td>{r.owner}</td>
                <td>{r.cost.toLocaleString("ko-KR")}원</td>
                {!preview && (
                  <td>
                    <button
                      type="button"
                      data-detail={r.id}
                      aria-label={`${r.name} 상세`}
                      onClick={() => setSelected(r.name)}
                    >
                      상세
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={preview ? 3 : 4}>
                  이 기간의 자료가 없어요. 다른 월을 선택하세요.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">합계</th>
              <td>{rows.length}건</td>
              <td>
                {rows.reduce((n, r) => n + r.cost, 0).toLocaleString("ko-KR")}원
              </td>
              {!preview && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
      <p
        className={error ? "advanced-error" : "advanced-status"}
        role={preview ? undefined : error ? "alert" : "status"}
      >
        {error ||
          (selected && `${selected} 비용 항목을 확인했어요.`) ||
          `${rows.length}개 항목 · 셀 편집 없이 비교해요.`}
      </p>
    </AdvancedFrame>
  );
}
export function SnackbarScene({ preview = false, time = 1700 }: SceneProps) {
  const [archived, setArchived] = useState(false),
    [open, setOpen] = useState(false),
    [hover, setHover] = useState(false),
    [focus, setFocus] = useState(false),
    [message, setMessage] = useState("보관 후 실행 취소를 비교해 보세요.");
  const remaining = useRef(6000),
    trigger = useRef<HTMLButtonElement>(null);
  const shownArchived = preview ? time >= 900 && time < 3300 : archived,
    shownBar = preview ? time >= 1000 && time < 3300 : open;
  useEffect(() => {
    if (preview || !open || hover || focus) return;
    const start = performance.now(),
      timer = setTimeout(() => {
        setOpen(false);
        setMessage("알림은 사라졌지만 보관함에서 복원할 수 있어요.");
      }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - start),
      );
    };
  }, [preview, open, hover, focus]);
  useEffect(() => {
    if (preview || !open) return;
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setMessage("알림을 닫았어요. 보관 상태는 유지됩니다.");
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [preview, open]);
  const restore = () => {
    setArchived(false);
    setOpen(false);
    setMessage("보관을 취소했어요.");
    requestAnimationFrame(() => trigger.current?.focus());
  };
  return (
    <AdvancedFrame kind="snackbar" title="노트 보관" preview={preview}>
      <div className="advanced-note">
        <AdvancedIcon kind="file" />
        <strong>
          {shownArchived ? "보관함으로 이동한 회의 노트" : "회의 노트"}
        </strong>
      </div>
      {!preview && (
        <div className="advanced-controls">
          <button
            ref={trigger}
            type="button"
            aria-disabled={archived}
            onClick={() => {
              if (archived) return;
              remaining.current = 6000;
              setArchived(true);
              setOpen(true);
              setHover(false);
              setFocus(false);
              setMessage("회의 노트를 보관했어요.");
            }}
          >
            노트 보관
          </button>
          <button type="button" hidden={!archived} onClick={restore}>
            보관함에서 복원
          </button>
        </div>
      )}
      <div
        className="advanced-snackbar"
        hidden={!shownBar}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setFocus(false);
        }}
      >
        <span role={preview ? undefined : "status"}>노트를 보관했어요.</span>
        <button type="button" data-undo onClick={restore}>
          실행 취소
        </button>
        <button
          type="button"
          data-dismiss
          aria-label="알림 닫기"
          onClick={() => {
            setOpen(false);
            setMessage("알림을 닫았어요. 보관 상태는 유지됩니다.");
            trigger.current?.focus();
          }}
        >
          <svg
            className="demo-close-glyph"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {preview
          ? shownArchived
            ? "보관 결과와 복구 행동"
            : "원래 목록으로 복원"
          : message}
      </p>
      {!preview && (
        <p className="advanced-help">
          6초 후 닫힘 · 알림에 마우스나 초점이 있으면 잠시 유지해요.
        </p>
      )}
    </AdvancedFrame>
  );
}
export function EmptyStateScene({ preview = false, time = 1700 }: SceneProps) {
  const [mode, setMode] = useState("initial"),
    [phase, setPhase] = useState("empty"),
    [fail, setFail] = useState(false);
  const area = useRef<HTMLDivElement>(null),
    previous = useRef("empty");
  useEffect(() => {
    if (preview) return;
    if (phase === "data")
      area.current?.querySelector<HTMLElement>("ul")?.focus();
    else if (previous.current === "loading" && phase === "empty")
      area.current?.querySelector<HTMLElement>("button")?.focus();
    previous.current = phase;
  }, [phase, preview]);
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setTimeout(() => setPhase(fail ? "empty" : "data"), 450);
    return () => clearTimeout(timer);
  }, [phase, fail]);
  const shownMode = preview
      ? time < 1800
        ? "initial"
        : time < 2900
          ? "filtered"
          : "error"
      : mode,
    shownPhase = preview
      ? time >= 1000 && time < 1800
        ? "data"
        : "empty"
      : phase,
    copy =
      shownMode === "initial"
        ? [
            "아직 노트가 없어요",
            "첫 노트로 아이디어를 남겨 보세요.",
            "첫 노트 만들기",
          ]
        : shownMode === "filtered"
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
  return (
    <AdvancedFrame kind="empty-state" title="나의 노트" preview={preview}>
      {!preview && (
        <div
          className="advanced-segments"
          role="group"
          aria-label="빈 상태 상황"
        >
          {[
            ["initial", "첫 사용"],
            ["filtered", "필터 무결과"],
            ["error", "조회 실패"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              data-empty-mode={value}
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setPhase("empty");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div
        ref={area}
        className="advanced-empty-area"
        aria-busy={shownPhase === "loading"}
      >
        {shownPhase === "data" ? (
          <ul className="advanced-simple-list" tabIndex={-1}>
            <li>첫 번째 아이디어</li>
            {shownMode !== "initial" && <li>다음 작업 메모</li>}
          </ul>
        ) : shownPhase === "loading" ? (
          <p role="status">노트를 다시 불러오는 중이에요.</p>
        ) : (
          <>
            <AdvancedIcon kind={shownMode === "error" ? "error" : "empty"} />
            <h3>{copy[0]}</h3>
            <p>{copy[1]}</p>
            <button
              type="button"
              className="demo-primary"
              data-empty-action
              onClick={() => setPhase(mode === "error" ? "loading" : "data")}
            >
              {copy[2]}
            </button>
          </>
        )}
      </div>
      {!preview && mode === "error" && (
        <label className="advanced-check">
          <input
            type="checkbox"
            checked={fail}
            disabled={phase === "loading"}
            onChange={(e) => setFail(e.target.checked)}
          />
          재시도 실패 모의
        </label>
      )}
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {shownPhase === "data"
          ? `노트 ${shownMode === "initial" ? 1 : 2}개를 표시해요.`
          : shownPhase === "loading"
            ? "조회 중"
            : shownMode === "error"
              ? "실패와 데이터 없음은 다른 상태입니다."
              : "빈 상태에서 다음 행동을 안내해요."}
      </p>
    </AdvancedFrame>
  );
}
export function sortRows(rows: DataRow[], mode: string) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const delta =
        mode === "low"
          ? a.row.cost - b.row.cost
          : mode === "high"
            ? b.row.cost - a.row.cost
            : mode === "name"
              ? a.row.name.localeCompare(b.row.name, "ko")
              : 0;
      return delta || a.index - b.index;
    })
    .map((v) => v.row);
}
export function SortingScene({ preview = false, time = 1700 }: SceneProps) {
  const [mode, setMode] = useState("original");
  const chosen = preview
      ? ["original", "low", "high", "name"][Math.floor(time / 1000) % 4]
      : mode,
    rows = sortRows(advancedRows, chosen),
    uid = useId(),
    labels: Record<string, string> = {
      original: "기본순",
      low: "금액 낮은순",
      high: "금액 높은순",
      name: "이름순",
    };
  return (
    <AdvancedFrame kind="sorting" title="프로젝트 정렬" preview={preview}>
      <label className="advanced-label" htmlFor={`${uid}-sort`}>
        정렬 기준
        <select
          id={`${uid}-sort`}
          value={chosen}
          onChange={(e) => setMode(e.target.value)}
        >
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <ol className="advanced-sort-list">
        {rows.map((r) => (
          <li key={r.id} data-row={r.id}>
            <span>{r.name}</span>
            <strong>{r.cost.toLocaleString("ko-KR")}원</strong>
          </li>
        ))}
      </ol>
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {labels[chosen]} · 같은 금액은 원래 순서를 유지해요.
      </p>
    </AdvancedFrame>
  );
}
export function filterRows(rows: DataRow[], kind: string, mine: boolean) {
  return rows.filter(
    (r) => (kind === "all" || r.kind === kind) && (!mine || r.owner === "나"),
  );
}
const filterKinds = [
  ["all", "전체 분류"],
  ["기획", "기획"],
  ["디자인", "디자인"],
  ["개발", "개발"],
] as const;
export function FilteringScene({ preview = false, time = 1700 }: SceneProps) {
  const [kind, setKind] = useState("all"),
    [mine, setMine] = useState(false),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(0),
    [placement, setPlacement] = useState({ above: false, maxHeight: 184 });
  const select = useRef<HTMLDivElement>(null),
    wrapper = useRef<HTMLDivElement>(null),
    check = useRef<HTMLInputElement>(null),
    typeahead = useRef({ text: "", time: 0 });
  const chosen = preview
      ? time < 900
        ? "all"
        : time < 3000
          ? "디자인"
          : "개발"
      : kind,
    onlyMine = preview ? time >= 1800 && time < 3000 : mine,
    rows = filterRows(advancedRows, chosen, onlyMine),
    uid = useId(),
    showList = preview ? time >= 500 && time < 1200 : open;
  const current = () =>
    Math.max(
      0,
      filterKinds.findIndex(([value]) => value === kind),
    );
  const expand = () => {
    setActive(current());
    setOpen(true);
  };
  const choose = (index: number, focus = true) => {
    setKind(filterKinds[index][0]);
    setOpen(false);
    typeahead.current.text = "";
    if (focus) select.current?.focus();
  };
  useEffect(() => {
    if (preview) return;
    const outside = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [preview]);
  useEffect(() => {
    if (preview || !open) return;
    const place = () => {
      const r = select.current?.getBoundingClientRect();
      if (!r) return;
      const below = innerHeight - r.bottom - 12,
        above = r.top - 12,
        flip = below < 126 && above > below;
      setPlacement({
        above: flip,
        maxHeight: Math.max(44, Math.min(184, flip ? above : below)),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [preview, open]);
  useEffect(() => {
    if (open && !preview)
      document
        .getElementById(`${uid}-option-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, preview, uid]);
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (
      e.nativeEvent.isComposing ||
      e.nativeEvent.keyCode === 229 ||
      e.ctrlKey ||
      e.metaKey
    )
      return;
    if (e.key === "Tab") {
      if (open) choose(active, false);
      return;
    }
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
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
      setActive(
        e.key === "Home" || e.key === "PageUp"
          ? 0
          : e.key === "End" || e.key === "PageDown"
            ? filterKinds.length - 1
            : !open
              ? current()
              : Math.max(
                  0,
                  Math.min(
                    filterKinds.length - 1,
                    active + (e.key === "ArrowDown" ? 1 : -1),
                  ),
                ),
      );
      setOpen(true);
      return;
    }
    if (e.key.length === 1 && !e.altKey) {
      e.preventDefault();
      const now = Date.now(),
        query =
          now - typeahead.current.time < 800
            ? typeahead.current.text + e.key
            : e.key;
      typeahead.current = { text: query, time: now };
      const prefix = [...query].every((c) => c === query[0]) ? query[0] : query;
      for (let step = 1; step <= filterKinds.length; step++) {
        const index = (active + step) % filterKinds.length;
        if (filterKinds[index][1].startsWith(prefix)) {
          setActive(index);
          setOpen(true);
          break;
        }
      }
    }
  };
  return (
    <AdvancedFrame
      kind="filtering"
      title="조건으로 노트 찾기"
      preview={preview}
    >
      <div className="advanced-controls advanced-filter-controls">
        <span className="advanced-filter-label" id={`${uid}-kind-label`}>
          분류
        </span>
        <div
          ref={wrapper}
          className="select-illustration advanced-filter-select"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setOpen(false);
          }}
        >
          <div
            ref={select}
            className={`select-preview-value select-trigger ${showList ? "is-open" : ""}`}
            role={preview ? undefined : "combobox"}
            tabIndex={preview ? -1 : 0}
            aria-labelledby={preview ? undefined : `${uid}-kind-label`}
            aria-haspopup={preview ? undefined : "listbox"}
            aria-expanded={preview ? undefined : open}
            aria-controls={preview ? undefined : `${uid}-list`}
            aria-activedescendant={
              !preview && open ? `${uid}-option-${active}` : undefined
            }
            onKeyDown={key}
            onClick={() => (open ? setOpen(false) : expand())}
          >
            <span data-filter-value>
              {filterKinds.find(([value]) => value === chosen)?.[1]}
            </span>
            <span className="select-chevron" aria-hidden="true">
              <svg
                className="demo-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
          <div
            id={`${uid}-list`}
            role={preview ? undefined : "listbox"}
            aria-labelledby={preview ? undefined : `${uid}-kind-label`}
            hidden={!showList}
            className={`select-preview-options select-popup ${!preview && placement.above ? "opens-up" : ""}`}
            style={preview ? undefined : { maxHeight: placement.maxHeight }}
          >
            {filterKinds.map(([value, label], index) => (
              <div
                key={value}
                id={`${uid}-option-${index}`}
                role={preview ? undefined : "option"}
                aria-selected={preview ? undefined : active === index}
                data-filter-option={index}
                className={active === index ? "active" : ""}
                onPointerMove={() => setActive(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
              >
                {label}
                <span aria-hidden="true">{chosen === value ? "✓" : ""}</span>
              </div>
            ))}
          </div>
        </div>
        <label className="advanced-check advanced-filter-mine">
          <input
            ref={check}
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setMine(e.target.checked)}
          />
          내 담당만
        </label>
      </div>
      <div className="advanced-filter-chips">
        {chosen !== "all" && (
          <button
            type="button"
            data-clear-kind
            onClick={() => {
              setKind("all");
              select.current?.focus();
            }}
          >
            {chosen} 해제
          </button>
        )}
        {onlyMine && (
          <button
            type="button"
            data-clear-mine
            onClick={() => {
              setMine(false);
              check.current?.focus();
            }}
          >
            내 담당 해제
          </button>
        )}
      </div>
      {rows.length ? (
        <ul className="advanced-simple-list">
          {rows.map((r) => (
            <li key={r.id} data-row={r.id}>
              <strong>{r.name}</strong>
              <span>
                {r.kind} · {r.owner}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="advanced-filter-empty">
          <p>조건에 맞는 항목이 없어요.</p>
          <button
            type="button"
            data-clear-all
            onClick={() => {
              setKind("all");
              setMine(false);
              select.current?.focus();
            }}
          >
            필터 초기화
          </button>
        </div>
      )}
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {rows.length}개 결과 · 적용한 조건을 함께 표시해요.
      </p>
    </AdvancedFrame>
  );
}

const loadItems = [
  "첫 화면 설계",
  "정보 구조",
  "입력과 검증",
  "빈 결과 안내",
  "모바일 배치",
  "모션 기준",
];
const loadBodies = [
  "처음 방문한 사람이 이 화면의 목적과 다음 행동을 찾을 수 있게 구성합니다. 제목과 주요 버튼을 먼저 정하고 필요한 정보를 읽는 순서대로 배치하세요.",
  "관련된 정보를 묶고 사용자가 찾는 이름으로 분류합니다. 같은 수준의 항목은 같은 구조로 표시하고 현재 위치와 이동 경로를 알려주세요.",
  "입력란에는 라벨과 조건을 제공하고 오류가 발생한 위치에 원인과 수정 방법을 보여줍니다. 저장 실패 시 작성한 값은 유지하세요.",
  "처음 사용해 자료가 없는 경우, 조건에 맞는 결과가 없는 경우, 조회에 실패한 경우를 구분합니다. 각각 만들기·필터 해제·다시 시도를 안내하세요.",
  "좁은 화면에서도 같은 내용을 자연스럽게 읽을 수 있게 재배치합니다. 긴 문구와 버튼이 잘리지 않는지 실제 사용 가능한 너비에서 확인하세요.",
  "움직임의 거리와 시간, 시작·완료 조건을 함께 정합니다. 모션은 상태 변화를 이해하도록 돕고 실제 저장이나 조회 완료와 혼동되지 않게 하세요.",
];
export function LoadMoreScene({ preview = false, time = 1700 }: SceneProps) {
  const [count, setCount] = useState(2),
    [pending, setPending] = useState(false),
    [fail, setFail] = useState(false),
    [error, setError] = useState(""),
    [selected, setSelected] = useState(-1);
  const list = useRef<HTMLUListElement>(null),
    more = useRef<HTMLButtonElement>(null),
    cancel = useRef<HTMLButtonElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    selection = useRef(-1),
    request = useRef<{
      active: boolean;
      token: number;
      timer: ReturnType<typeof setTimeout> | undefined;
    }>({ active: false, token: 0, timer: undefined });
  const failed = error.startsWith("추가로"),
    readingId = useId();
  useEffect(() => {
    if (pending) cancel.current?.focus();
  }, [pending]);
  useEffect(() => {
    if (selected >= 0) heading.current?.focus({ preventScroll: true });
  }, [selected]);
  useEffect(() => {
    if (!pending || !request.current.active) return;
    const token = request.current.token;
    const previous = count,
      timer = setTimeout(() => {
        if (!request.current.active || request.current.token !== token) return;
        request.current.active = false;
        setPending(false);
        if (fail) {
          setError(
            "추가로 불러오지 못했어요. 기존 항목은 유지됩니다. 실패 모의를 해제하고 다시 불러오세요.",
          );
          if (
            !heading.current
              ?.closest("article")
              ?.contains(document.activeElement)
          )
            requestAnimationFrame(() => more.current?.focus());
          return;
        }
        setCount(Math.min(loadItems.length, previous + 2));
        setError("");
        if (
          !heading.current?.closest("article")?.contains(document.activeElement)
        )
          requestAnimationFrame(() =>
            list.current
              ?.querySelector<HTMLElement>(`[data-load-index="${previous}"]`)
              ?.focus(),
          );
      }, 900);
    request.current.timer = timer;
    return () => clearTimeout(timer);
  }, [pending, fail, count]);
  const shown = preview ? (time < 1500 ? 2 : time < 2800 ? 4 : 6) : count;
  return (
    <AdvancedFrame kind="load-more" title="읽을거리 더 보기" preview={preview}>
      <div className="advanced-reading-slot">
        <ul
          ref={list}
          className="advanced-simple-list advanced-load-list"
          aria-busy={!preview && pending}
        >
          {loadItems.slice(0, shown).map((name, i) => (
            <li key={name}>
              <button
                type="button"
                data-load-index={i}
                aria-expanded={preview ? undefined : selected === i}
                aria-controls={preview ? undefined : readingId}
                onClick={() => {
                  selection.current = i;
                  setSelected(i);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {preview && shown < loadItems.length && (
        <div className="advanced-controls advanced-load-controls">
          <button
            type="button"
            data-load-more
            disabled={time >= 900 && time < 1500}
          >
            {time >= 900 && time < 1500 ? "불러오는 중" : "더 보기"}
          </button>
        </div>
      )}
      {!preview && (
        <div className="advanced-load-settings">
          <label className="advanced-check">
            <input
              type="checkbox"
              checked={fail}
              disabled={pending}
              onChange={(e) => setFail(e.target.checked)}
            />
            추가 조회 실패 모의
          </label>
          <div className="advanced-controls advanced-load-controls">
            {count < loadItems.length && (
              <button
                type="button"
                data-load-more
                ref={more}
                disabled={pending}
                onClick={() => {
                  request.current.active = true;
                  request.current.token++;
                  setError("");
                  setPending(true);
                }}
              >
                {pending ? "불러오는 중" : failed ? "다시 불러오기" : "더 보기"}
              </button>
            )}
            {pending && (
              <button
                type="button"
                data-load-cancel
                ref={cancel}
                onClick={() => {
                  if (!request.current.active) return;
                  request.current.active = false;
                  request.current.token++;
                  clearTimeout(request.current.timer);
                  setPending(false);
                  setError("불러오기를 취소했어요. 기존 항목은 유지됩니다.");
                  requestAnimationFrame(() => more.current?.focus());
                }}
              >
                불러오기 취소
              </button>
            )}
            <button
              type="button"
              data-load-reset
              onClick={() => {
                request.current.active = false;
                request.current.token++;
                clearTimeout(request.current.timer);
                setPending(false);
                setCount(2);
                setError("");
                selection.current = -1;
                setSelected(-1);
              }}
            >
              처음으로
            </button>
          </div>
        </div>
      )}
      <p
        className="advanced-status"
        data-load-count
        role={preview ? undefined : "status"}
      >
        {shown} / 6개
        {shown === 6 ? " · 모두 불러왔어요." : pending ? " · 불러오는 중" : ""}
      </p>
      {!preview && (
        <p
          className={failed ? "advanced-error" : "advanced-status"}
          data-load-feedback
          role={failed ? "alert" : "status"}
          hidden={!error}
        >
          {error}
        </p>
      )}
      {!preview && selected >= 0 && (
        <div className="advanced-reading-host">
          <article id={readingId} className="advanced-reading-document">
            <span className="advanced-help">읽을거리 본문</span>
            <h3 ref={heading} tabIndex={-1}>
              {loadItems[selected]}
            </h3>
            <p>{loadBodies[selected]}</p>
            <button
              type="button"
              data-load-back
              onClick={() => {
                const index = selected;
                selection.current = -1;
                setSelected(-1);
                requestAnimationFrame(() =>
                  list.current
                    ?.querySelector<HTMLElement>(`[data-load-index="${index}"]`)
                    ?.focus(),
                );
              }}
            >
              설명 닫기
            </button>
          </article>
        </div>
      )}
    </AdvancedFrame>
  );
}

export function reorderItems<T>(items: T[], from: number, to: number) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length)
    return [...items];
  const result = [...items],
    item = result.splice(from, 1)[0];
  result.splice(to, 0, item);
  return result;
}
const dragTasks = [
  { id: "research", name: "자료 조사" },
  { id: "design", name: "화면 설계" },
  { id: "prototype", name: "프로토타입" },
];
export function dragInsertIndex(
  centers: number[],
  from: number,
  centerY: number,
): number {
  if (from < 0 || from >= centers.length || !Number.isFinite(centerY))
    return -1;
  return centers.filter((center, index) => index !== from && centerY > center)
    .length;
}
export function attachSortableDrag(
  root: HTMLElement,
  onMove: (id: string, to: number) => void,
  announce: (message: string) => void,
) {
  const list = root.querySelector<HTMLOListElement>(".advanced-drag-list")!;
  let drag: {
    id: string;
    pointer: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    from: number;
    to: number;
    moved: boolean;
    ghost: HTMLElement;
    row: HTMLElement;
  } | null = null;
  const rows = () =>
    Array.from(list.querySelectorAll<HTMLElement>("[data-drag-row]"));
  const clear = (notify = false) => {
    if (!drag) return;
    const previous = drag;
    drag = null;
    previous.ghost.remove();
    root.classList.remove("is-pointer-dragging");
    rows().forEach((row) =>
      row.classList.remove("is-dragging", "is-drop-before", "is-drop-after"),
    );
    if (root.hasPointerCapture(previous.pointer))
      root.releasePointerCapture(previous.pointer);
    if (notify) announce("이동을 취소했어요. 원래 순서를 유지합니다.");
  };
  const point = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const left = e.clientX - drag.offsetX,
      top = e.clientY - drag.offsetY;
    drag.ghost.style.transform = `translate3d(${left}px,${top}px,0)`;
    drag.moved ||=
      Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) >= 4;
    const rect = list.getBoundingClientRect(),
      all = rows();
    const inside =
      e.clientX >= rect.left - 8 &&
      e.clientX <= rect.right + 8 &&
      e.clientY >= rect.top - 8 &&
      e.clientY <= rect.bottom + 8;
    drag.to = inside
      ? dragInsertIndex(
          all.map((row) => {
            const r = row.getBoundingClientRect();
            return r.top + r.height / 2;
          }),
          drag.from,
          top + drag.height / 2,
        )
      : -1;
    all.forEach((row) =>
      row.classList.remove("is-drop-before", "is-drop-after"),
    );
    if (drag.moved && drag.to >= 0 && drag.to !== drag.from)
      all[drag.to]?.classList.add(
        drag.to < drag.from ? "is-drop-before" : "is-drop-after",
      );
  };
  const down = (e: PointerEvent) => {
    if (
      drag ||
      e.button !== 0 ||
      e.isPrimary === false ||
      !(e.target instanceof Element) ||
      e.target.closest("button,a,input,textarea,select")
    )
      return;
    const row = e.target.closest<HTMLElement>("[data-drag-row]");
    if (!row || !list.contains(row)) return;
    e.preventDefault();
    root.focus({ preventScroll: true });
    const rect = row.getBoundingClientRect(),
      ghost = row.cloneNode(true) as HTMLElement;
    ghost.removeAttribute("data-drag-row");
    ghost.removeAttribute("id");
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    ghost
      .querySelectorAll("[id]")
      .forEach((node) => node.removeAttribute("id"));
    ghost.className = "advanced-drag-ghost";
    Object.assign(ghost.style, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${rect.left}px,${rect.top}px,0)`,
    });
    root.append(ghost);
    drag = {
      id: row.dataset.dragRow!,
      pointer: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      from: rows().indexOf(row),
      to: rows().indexOf(row),
      moved: false,
      ghost,
      row,
    };
    row.classList.add("is-dragging");
    root.classList.add("is-pointer-dragging");
    root.setPointerCapture(e.pointerId);
    announce(
      `${row.querySelector("strong")?.textContent} · 누른 채 끌고, 파란 선 위치에 놓으세요. Esc로 취소할 수 있어요.`,
    );
  };
  const up = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    point(e);
    const { id, to, from, moved } = drag;
    clear();
    if (moved && to >= 0 && to !== from) onMove(id, to);
    else
      announce(
        to < 0
          ? "목록 밖에 놓아 이동을 취소했어요."
          : moved
            ? "원래 위치에 놓았어요. 순서를 유지합니다."
            : "마우스나 손가락을 누른 채 항목을 끌어 이동하세요.",
      );
  };
  const cancel = (e?: PointerEvent) => {
    if (!e || e.pointerId === drag?.pointer) clear(true);
  };
  const lost = (e: PointerEvent) => cancel(e);
  const key = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape" && drag) {
      e.preventDefault();
      e.stopPropagation();
      clear(true);
    }
  };
  const blur = () => clear(true);
  root.addEventListener("pointerdown", down);
  root.addEventListener("pointermove", point);
  root.addEventListener("pointerup", up);
  root.addEventListener("pointercancel", cancel);
  root.addEventListener("lostpointercapture", lost);
  root.addEventListener("keydown", key);
  window.addEventListener("blur", blur);
  return {
    cancel: clear,
    destroy() {
      clear();
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", point);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", cancel);
      root.removeEventListener("lostpointercapture", lost);
      root.removeEventListener("keydown", key);
      window.removeEventListener("blur", blur);
    },
  };
}
export function DragDropScene({ preview = false, time = 1700 }: SceneProps) {
  const [order, setOrder] = useState(dragTasks),
    [message, setMessage] = useState(
      "항목이나 점 핸들을 누른 채 끌어보세요. 위·아래 버튼으로도 이동할 수 있어요.",
    );
  const root = useRef<HTMLDivElement>(null),
    controller = useRef<ReturnType<typeof attachSortableDrag> | null>(null);
  const shown = preview && time >= 2600 ? reorderItems(dragTasks, 0, 2) : order;
  const move = (id: string, to: number) => {
    const from = order.findIndex((row) => row.id === id);
    if (from < 0 || to < 0 || to >= order.length || from === to) return;
    setOrder(reorderItems(order, from, to));
    setMessage(`${order[from].name} · ${to + 1}번째로 이동했어요.`);
    requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLElement>(
          `[data-drag-row="${id}"] button:not(:disabled)`,
        )
        ?.focus(),
    );
  };
  useEffect(() => {
    if (preview || !root.current) return;
    const instance = attachSortableDrag(root.current, move, setMessage);
    controller.current = instance;
    return () => {
      instance.destroy();
      controller.current = null;
    };
  }, [preview, order]);
  return (
    <AdvancedFrame kind="drag-and-drop" title="작업 우선순위" preview={preview}>
      <div ref={root} tabIndex={-1} className="advanced-sortable-host">
        <ol className="advanced-drag-list">
          {shown.map((task, i) => (
            <li
              key={task.id}
              data-drag-row={task.id}
              className={`${preview && time >= 700 && time < 2600 && task.id === "research" ? "is-dragging is-preview-lifted" : ""} ${preview && time >= 1500 && time < 2600 && task.id === "prototype" ? "is-drop-target" : ""}`}
              style={
                preview && time >= 700 && time < 2600 && task.id === "research"
                  ? {
                      transform: `translate(8px,${Math.min(1, (time - 700) / 1700) * 86}px)`,
                    }
                  : undefined
              }
            >
              <span className="advanced-grip" aria-hidden="true">
                <AdvancedIcon kind="grip" />
              </span>
              <strong>{task.name}</strong>
              {!preview && (
                <div className="advanced-row-actions">
                  <button
                    type="button"
                    disabled={i === 0}
                    data-move="-1"
                    aria-label={`${task.name} 위로 이동`}
                    onClick={() => move(task.id, i - 1)}
                  >
                    위로
                  </button>
                  <button
                    type="button"
                    disabled={i === shown.length - 1}
                    data-move="1"
                    aria-label={`${task.name} 아래로 이동`}
                    onClick={() => move(task.id, i + 1)}
                  >
                    아래로
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      {!preview && (
        <button
          type="button"
          data-drag-reset
          onClick={() => {
            controller.current?.cancel();
            setOrder(dragTasks);
            setMessage("원래 순서로 돌아왔어요.");
          }}
        >
          순서 초기화
        </button>
      )}
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {preview
          ? time >= 2600
            ? "놓은 위치에 순서 반영"
            : "항목을 누른 채 끌어 이동"
          : message}
      </p>
    </AdvancedFrame>
  );
}
export function ResponsiveScene({ preview = false, time = 1700 }: SceneProps) {
  const [narrow, setNarrow] = useState(false),
    [width, setWidth] = useState(0);
  const box = useRef<HTMLDivElement>(null),
    compact = preview ? time >= 1100 && time < 3000 : narrow;
  useEffect(() => {
    if (preview || !box.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [preview]);
  return (
    <AdvancedFrame
      kind="responsive-layout"
      title="폭에 따라 달라지는 배치"
      preview={preview}
    >
      {!preview && (
        <div
          className="advanced-segments"
          role="group"
          aria-label="컨테이너 폭"
        >
          <button
            type="button"
            data-layout="wide"
            aria-pressed={!narrow}
            onClick={() => setNarrow(false)}
          >
            넓게
          </button>
          <button
            type="button"
            data-layout="narrow"
            aria-pressed={narrow}
            onClick={() => setNarrow(true)}
          >
            좁게
          </button>
        </div>
      )}
      <div
        className={`advanced-responsive-stage ${preview ? "is-mini-layout" : ""}`}
      >
        <div
          ref={box}
          className={`advanced-responsive-demo ${compact ? "is-narrow" : ""}`}
          style={
            preview
              ? { width: compact ? 260 : 500, maxWidth: "none" }
              : { width: compact ? 260 : 520 }
          }
        >
          <div className="advanced-responsive-banner">나의 작업 공간</div>
          <div className="advanced-responsive-grid">
            {["최근 노트", "진행 중 작업", "저장한 자료"].map((name, i) => (
              <article key={name}>
                <span>{i + 1}</span>
                <strong>{name}</strong>
                <p>필요한 정보를 같은 순서로 보여줘요.</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {preview
          ? compact
            ? "좁은 폭 · 세로 배치"
            : "넓은 폭 · 가로 배치"
          : `실제 ${width}px · ${width >= 360 ? "3열" : "1열"} 배치`}
      </p>
    </AdvancedFrame>
  );
}
export function StickyHeaderScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const [pinned, setPinned] = useState(true),
    [offset, setOffset] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (preview && box.current)
      box.current.scrollTop =
        time < 500 ? 0 : time >= 3500 ? 0 : ((time - 500) / 3000) * 260;
  }, [preview, time]);
  return (
    <AdvancedFrame
      kind="sticky-header"
      title="스크롤에 남는 제목"
      preview={preview}
    >
      {!preview && (
        <div className="advanced-controls">
          <label className="advanced-check">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            헤더 고정
          </label>
          <button
            type="button"
            data-scroll="middle"
            onClick={() => box.current?.scrollTo({ top: 180 })}
          >
            중간으로 이동
          </button>
          <button
            type="button"
            data-scroll="top"
            onClick={() => box.current?.scrollTo({ top: 0 })}
          >
            맨 위로
          </button>
        </div>
      )}
      <div
        ref={box}
        tabIndex={preview ? -1 : 0}
        className="advanced-sticky-viewport"
        aria-label="문서 스크롤 영역"
        onScroll={(e) => {
          if (!preview) setOffset(Math.round(e.currentTarget.scrollTop));
        }}
      >
        <header
          className={`advanced-sticky-title ${pinned ? "" : "is-unpinned"}`}
        >
          <strong>UI 가이드</strong>
          <span>문서 목차</span>
        </header>
        <div className="advanced-sticky-content">
          {[
            "이름을 붙이는 이유",
            "같은 구조로 정리하기",
            "상태와 다음 행동",
            "작은 화면에서 확인",
          ].map((name, i) => (
            <section key={name}>
              <h3>
                {i + 1}. {name}
              </h3>
              <p>
                문서를 읽는 동안 제목과 현재 맥락을 확인합니다. 고정 요소는 이
                스크롤 영역 안에서만 유지됩니다.
              </p>
            </section>
          ))}
        </div>
      </div>
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {preview
          ? "내용은 이동하고 제목은 남아요."
          : `${offset}px 이동 · ${pinned ? "제목 고정 중" : "일반 흐름"}`}
      </p>
    </AdvancedFrame>
  );
}
export function easingProgress(progress: number, curve: string) {
  const p = Math.max(0, Math.min(1, progress));
  if (curve === "linear" || p === 0 || p === 1) return p;
  const [x1, x2] =
    curve === "ease-in"
      ? [0.42, 1]
      : curve === "ease-out"
        ? [0, 0.58]
        : [0.42, 0.58];
  const cubic = (t: number, a: number, b: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  let low = 0,
    high = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    if (cubic(mid, x1, x2) < p) low = mid;
    else high = mid;
  }
  return cubic((low + high) / 2, 0, 1);
}
export function EasingScene({ preview = false, time = 1700 }: SceneProps) {
  const [curve, setCurve] = useState("ease-in-out"),
    [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false),
    [done, setDone] = useState(false);
  const uid = useId();
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setProgress(p);
      if (p === 1) {
        setPlaying(false);
        setDone(true);
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const p = preview
      ? time >= 3500
        ? 0
        : Math.min(1, Math.max(0, (time - 400) / 2200))
      : progress,
    positions = [p, easingProgress(p, curve)];
  return (
    <AdvancedFrame kind="easing" title="같은 시간, 다른 속도" preview={preview}>
      <label className="advanced-label" htmlFor={`${uid}-curve`}>
        속도 곡선
        <select
          id={`${uid}-curve`}
          value={curve}
          onChange={(e) => {
            setCurve(e.target.value);
            setPlaying(false);
            setProgress(0);
            setDone(false);
          }}
        >
          {["linear", "ease-in", "ease-out", "ease-in-out"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <div className="advanced-ease-lanes">
        {positions.map((value, i) => (
          <div key={i}>
            <div className="advanced-ease-label">
              <strong>{i === 0 ? "linear" : curve}</strong>
              <span>{Math.round(value * 100)}%</span>
            </div>
            <div className="advanced-ease-track">
              <i
                className={i ? "selected-curve" : ""}
                style={{
                  left: `${value * 100}%`,
                  transform: `translateX(-${value * 100}%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {!preview && (
        <div className="advanced-controls">
          <button
            type="button"
            data-easing-start
            disabled={playing}
            onClick={() => {
              setProgress(0);
              setDone(false);
              setPlaying(true);
            }}
          >
            이동 시작
          </button>
          <button
            type="button"
            data-easing-reset
            onClick={() => {
              setPlaying(false);
              setProgress(0);
              setDone(false);
            }}
          >
            초기화
          </button>
        </div>
      )}
      <p className="advanced-status" role={preview ? undefined : "status"}>
        {preview
          ? "같은 종점에 도착하는 속도 차이"
          : playing
            ? "두 점 모두 1200ms 동안 이동해요."
            : done
              ? "같은 시간에 같은 종점에 도착했어요."
              : "같은 거리·1200ms에서 비교해 보세요."}
      </p>
    </AdvancedFrame>
  );
}
