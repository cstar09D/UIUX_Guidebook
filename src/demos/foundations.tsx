import { InputMetrics } from "./input-metrics";
import { measureText, limitText } from "./input-metrics.mjs";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
type SceneProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
function FoundationFrame({
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
      className={`scene foundation-scene scene-${kind} ${preview ? "is-preview" : ""}`}
    >
      <div className="foundation-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
export function ButtonScene({ preview = false, time = 1700 }: SceneProps) {
  const [phase, setPhase] = useState("idle"),
    [fail, setFail] = useState(false),
    [count, setCount] = useState(0);
  useEffect(() => {
    if (preview || phase !== "pending") return;
    const timer = setTimeout(() => {
      setPhase(fail ? "error" : "success");
      if (!fail) setCount((n) => n + 1);
    }, 650);
    return () => clearTimeout(timer);
  }, [preview, phase, fail]);
  const state = preview
    ? time < 700
      ? "idle"
      : time < 2100
        ? "pending"
        : time < 3300
          ? "success"
          : "idle"
    : phase;
  return (
    <FoundationFrame kind="button" title="디자인 노트 저장" preview={preview}>
      <div className="foundation-document">
        <i />
        <i />
        <i />
        <span>새로운 아이디어를 기록했어요.</span>
      </div>
      <button
        type="button"
        className="demo-primary foundation-primary"
        disabled={state === "pending"}
        onClick={() => {
          if (phase !== "pending") setPhase("pending");
        }}
      >
        {state === "pending" ? "저장 중…" : "노트 저장"}
      </button>
      {!preview && (
        <label className="foundation-option">
          <input
            type="checkbox"
            checked={fail}
            disabled={phase === "pending"}
            onChange={(e) => setFail(e.target.checked)}
          />
          저장 실패 모의
        </label>
      )}
      <p
        className={`foundation-status ${state === "error" ? "foundation-error" : ""}`}
        role={preview ? undefined : state === "error" ? "alert" : "status"}
      >
        {state === "pending"
          ? "저장을 완료할 때까지 기다려 주세요."
          : state === "success"
            ? `저장 완료${preview ? "" : ` · ${count}회`}`
            : state === "error"
              ? "저장하지 못했어요. 노트 저장으로 다시 시도하세요."
              : "버튼을 눌러 작업을 실행하세요."}
      </p>
    </FoundationFrame>
  );
}
function ToolIcon({ kind }: { kind: "copy" | "archive" | "share" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "copy" ? (
        <>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" />
        </>
      ) : kind === "archive" ? (
        <>
          <rect x="3" y="3" width="18" height="5" rx="1" />
          <path d="M5 8v12h14V8M10 12h4" />
        </>
      ) : (
        <>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
        </>
      )}
    </svg>
  );
}
const shareServices = [
  ["kakao", "카카오톡", "톡"],
  ["facebook", "페이스북", "f"],
  ["x", "X", "𝕏"],
  ["band", "밴드", "B"],
  ["link", "링크 복사", "↗"],
] as const;
export function IconButtonScene({ preview = false, time = 1700 }: SceneProps) {
  const [archived, setArchived] = useState(false),
    [message, setMessage] = useState("아이콘 버튼에 키보드로 이동해 보세요.");
  const archive = useRef<HTMLButtonElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const shareButton = useRef<HTMLButtonElement>(null),
    sharePanel = useRef<HTMLDivElement>(null),
    shareId = useId();
  const shared = preview ? time >= 1500 && time < 2300 : shareOpen;
  const closeShare = (focus = true) => {
    setShareOpen(false);
    if (focus) requestAnimationFrame(() => shareButton.current?.focus());
  };
  useEffect(() => {
    if (preview || !shareOpen) return;
    const focus = requestAnimationFrame(() => {
      const panel = sharePanel.current;
      if (!panel) return;
      panel.style.top = "";
      const overflow =
        panel.getBoundingClientRect().bottom - window.innerHeight + 12;
      if (overflow > 0) panel.style.top = `calc(100% + 8px - ${overflow}px)`;
      panel.querySelector<HTMLButtonElement>("[data-share-service]")?.focus();
    });
    const outside = (event: PointerEvent) => {
      if (
        !sharePanel.current?.contains(event.target as Node) &&
        !shareButton.current?.contains(event.target as Node)
      )
        closeShare(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(focus);
      document.removeEventListener("pointerdown", outside);
    };
  }, [preview, shareOpen]);
  const isArchived = preview ? time > 2300 : archived;
  return (
    <FoundationFrame
      kind="icon-button"
      title="노트 도구 모음"
      preview={preview}
    >
      <div className="foundation-tools-shell">
        <div className="foundation-icon-toolbar">
          <button
            type="button"
            aria-label="링크 복사"
            className={
              preview && time > 700 && time < 1500 ? "foundation-highlight" : ""
            }
            onClick={() => {
              setMessage(
                "링크 복사를 모의했어요. 실제 클립보드는 변경하지 않습니다.",
              );
            }}
          >
            <ToolIcon kind="copy" />
          </button>
          <button
            ref={archive}
            type="button"
            aria-label="보관하기"
            disabled={isArchived}
            className={isArchived ? "foundation-highlight is-saved" : ""}
            title={isArchived ? "보관 완료" : "보관하기"}
            onClick={() => {
              setArchived(true);
              setMessage("노트를 보관했어요. 아래에서 취소할 수 있어요.");
            }}
          >
            <ToolIcon kind="archive" />
          </button>
          <button
            type="button"
            ref={shareButton}
            aria-label="공유하기"
            aria-haspopup="dialog"
            aria-expanded={shared}
            aria-controls={`${shareId}-panel`}
            onClick={() => setShareOpen((value) => !value)}
          >
            <ToolIcon kind="share" />
          </button>
        </div>
        {shared && (
          <div
            ref={sharePanel}
            id={`${shareId}-panel`}
            className="foundation-share-panel"
            role="dialog"
            aria-labelledby={`${shareId}-title`}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                closeShare();
              }
            }}
          >
            <div className="foundation-share-heading">
              <strong id={`${shareId}-title`}>공유하기</strong>
              <button
                type="button"
                aria-label="공유 목록 닫기"
                onClick={() => closeShare()}
              >
                ×
              </button>
            </div>
            <p>공유할 서비스를 선택하세요.</p>
            <div className="foundation-share-services">
              {shareServices.map(([id, name, glyph]) => (
                <button
                  key={id}
                  type="button"
                  data-share-service={name}
                  onClick={() => {
                    setMessage(
                      id === "link"
                        ? "링크 복사를 모의했어요. 실제 클립보드는 변경하지 않습니다."
                        : `${name} 공유를 선택했어요. 실제 게시나 외부 전송은 하지 않습니다.`,
                    );
                    closeShare();
                  }}
                >
                  <span
                    className={`foundation-share-logo brand-${id}`}
                    aria-hidden="true"
                  >
                    {glyph}
                  </span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <p className="foundation-share-hint">
              체험용 목록 · 실제 게시 없음
            </p>
          </div>
        )}
      </div>
      <div className="foundation-note">
        <strong>{isArchived ? "보관된 노트" : "이번 주 디자인 노트"}</strong>
        <p>
          {isArchived
            ? "보관함으로 이동했어요."
            : "아이콘은 짧은 도구 영역에서 사용해요."}
        </p>
      </div>
      {!preview && archived && (
        <button
          type="button"
          onClick={() => {
            setArchived(false);
            setMessage("보관을 취소했어요.");
            requestAnimationFrame(() => archive.current?.focus());
          }}
        >
          보관 취소
        </button>
      )}
      <p className="foundation-status" role={preview ? undefined : "status"}>
        {preview
          ? time > 2300
            ? "보관 완료"
            : time >= 1500
              ? "공유 서비스 선택"
              : time > 700
                ? "링크 복사"
                : "이름이 있는 아이콘 버튼"
          : message}
      </p>
    </FoundationFrame>
  );
}
export function ToggleButtonScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const [bold, setBold] = useState(false),
    [italic, setItalic] = useState(false);
  const b = preview ? time >= 800 && time < 3200 : bold,
    i = preview ? time >= 1900 && time < 3200 : italic;
  return (
    <FoundationFrame kind="toggle-button" title="텍스트 서식" preview={preview}>
      <div
        className="foundation-toggle-tools"
        role="group"
        aria-label="문자 서식"
      >
        <button
          type="button"
          aria-pressed={b}
          onClick={() => setBold((v) => !v)}
        >
          굵게
        </button>
        <button
          type="button"
          aria-pressed={i}
          onClick={() => setItalic((v) => !v)}
        >
          기울임
        </button>
      </div>
      <div
        className="foundation-type-sample"
        style={{
          fontWeight: b ? 750 : 400,
          fontStyle: i ? "italic" : "normal",
        }}
      >
        좋은 화면은 작은 선택에서 시작됩니다.
      </div>
      <p className="foundation-status" role={preview ? undefined : "status"}>
        {b ? "굵게 켜짐" : "굵게 꺼짐"} · {i ? "기울임 켜짐" : "기울임 꺼짐"}
      </p>
    </FoundationFrame>
  );
}
export function SegmentedScene({ preview = false, time = 1700 }: SceneProps) {
  const [billing, setBilling] = useState("monthly");
  const uid = useId(),
    value = preview
      ? time < 1500 || time > 3300
        ? "monthly"
        : "yearly"
      : billing;
  return (
    <FoundationFrame
      kind="segmented-control"
      title="결제 주기 선택"
      preview={preview}
    >
      <fieldset className="foundation-segments">
        <legend>청구 주기</legend>
        {[
          ["monthly", "월간"],
          ["yearly", "연간"],
        ].map(([id, label]) => (
          <label key={id} className={value === id ? "selected" : ""}>
            <input
              type="radio"
              name={`${uid}-billing`}
              value={id}
              checked={value === id}
              onChange={() => setBilling(id)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="foundation-price">
        <strong>{value === "monthly" ? "9,000원" : "90,000원"}</strong>
        <span> / {value === "monthly" ? "월" : "년"}</span>
        <p>예시 요금 · 실제 결제는 진행하지 않아요.</p>
      </div>
      <p className="foundation-status" role={preview ? undefined : "status"}>
        {value === "monthly" ? "매월 청구하는 옵션" : "매년 청구하는 옵션"}을
        선택했어요.
      </p>
    </FoundationFrame>
  );
}
export function TextFieldScene({ preview = false, time = 1700 }: SceneProps) {
  const [value, setValue] = useState(""),
    [error, setError] = useState(""),
    [saved, setSaved] = useState("");
  const uid = useId(),
    input = useRef<HTMLInputElement>(null),
    shown = preview
      ? time < 700
        ? ""
        : time < 1800
          ? "디자인"
          : "디자인 팀"
      : value;
  return (
    <FoundationFrame kind="text-field" title="프로젝트 이름" preview={preview}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const text = value.trim();
          if (
            measureText(text).characters < 2 ||
            measureText(text).characters > 30
          ) {
            setError("이름을 2~30자로 입력해 주세요.");
            setSaved("");
            input.current?.focus();
            return;
          }
          setError("");
          setSaved(`“${text}” 이름으로 저장했어요.`);
        }}
      >
        <label className="foundation-label" htmlFor={`${uid}-name`}>
          이름
        </label>
        <p className="foundation-hint" id={`${uid}-hint`}>
          2~30자 · 어떤 프로젝트인지 알아볼 수 있게 적으세요.
        </p>
        <input
          ref={input}
          id={`${uid}-name`}
          className="foundation-input"
          value={shown}
          required
          aria-invalid={!!error}
          aria-describedby={`${uid}-hint ${uid}-name-metrics ${uid}-error`}
          placeholder="예: 디자인 팀"
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
            setSaved("");
          }}
        />
        <InputMetrics value={shown} inputId={`${uid}-name`} limit={30} />
        <p
          id={`${uid}-error`}
          className="foundation-error"
          role={error ? "alert" : undefined}
        >
          {error}
        </p>
        <button className="demo-primary foundation-primary" type="submit">
          이름 저장
        </button>
        <p className="foundation-status" role={preview ? undefined : "status"}>
          {preview ? (time > 2600 ? "이름을 저장했어요." : "") : saved}
        </p>
      </form>
    </FoundationFrame>
  );
}
export function TextareaScene({ preview = false, time = 1700 }: SceneProps) {
  const [value, setValue] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const uid = useId(),
    input = useRef<HTMLTextAreaElement>(null);
  const shown = preview
    ? "회의에서 논의한 개선 내용을 정리합니다.\n입력 오류와 복구 화면을 함께 검토해 주세요.".slice(
        0,
        Math.max(0, Math.floor((time - 400) / 40)),
      )
    : value;
  return (
    <FoundationFrame kind="textarea" title="검토 의견 남기기" preview={preview}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (
            measureText(value.trim()).characters < 10 ||
            measureText(value).characters > 200
          ) {
            setError(
              "의견을 10~200자로 입력해 주세요. 입력 내용은 유지됩니다.",
            );
            setMessage("");
            input.current?.focus();
            return;
          }
          setError("");
          setMessage("검토 의견을 저장했어요.");
        }}
      >
        <label className="foundation-label" htmlFor={`${uid}-feedback`}>
          검토 의견
        </label>
        <p className="foundation-hint" id={`${uid}-hint`}>
          10~200자 · Enter는 줄바꿈입니다.
        </p>
        <textarea
          ref={input}
          className="foundation-textarea"
          id={`${uid}-feedback`}
          value={shown}
          required
          aria-invalid={!!error}
          aria-describedby={`${uid}-hint ${uid}-feedback-metrics ${uid}-error`}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
            setMessage("");
          }}
        />
        <InputMetrics value={shown} inputId={`${uid}-feedback`} limit={200} />

        <p
          id={`${uid}-error`}
          className="foundation-error"
          role={error ? "alert" : undefined}
        >
          {error}
        </p>
        <button type="submit" className="demo-primary foundation-primary">
          의견 저장
        </button>
        <p className="foundation-status" role={preview ? undefined : "status"}>
          {preview
            ? time > 3000
              ? "여러 줄 의견을 저장했어요."
              : "여러 줄의 내용을 입력해요."
            : message}
        </p>
      </form>
    </FoundationFrame>
  );
}
const searchNotes = [
  "모달 대화상자",
  "하단 펼침 패널",
  "접이식 섹션",
  "검색형 선택 목록",
];
export function SearchFieldScene({ preview = false, time = 1700 }: SceneProps) {
  const [value, setValue] = useState(""),
    [query, setQuery] = useState(""),
    [phase, setPhase] = useState("idle"),
    [fail, setFail] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    composing = useRef(false),
    uid = useId();
  useEffect(() => {
    if (preview || phase !== "loading") return;
    const timer = setTimeout(() => setPhase(fail ? "error" : "done"), 400);
    return () => clearTimeout(timer);
  }, [preview, phase, fail]);
  const q = preview ? (time < 650 ? "" : "모달") : query,
    state = preview
      ? time < 650
        ? "idle"
        : time < 1700
          ? "loading"
          : "done"
      : phase,
    items = searchNotes.filter((note) => note.includes(q));
  const clear = () => {
    setValue("");
    setQuery("");
    setPhase("idle");
    input.current?.focus();
  };
  return (
    <FoundationFrame kind="search-field" title="UI 노트 검색" preview={preview}>
      <form
        role="search"
        aria-label="예시 노트 검색"
        onSubmit={(e) => {
          e.preventDefault();
          if (composing.current || phase === "loading") return;
          setQuery(value.trim());
          setPhase(value.trim() ? "loading" : "idle");
        }}
      >
        <label className="foundation-label" htmlFor={`${uid}-search`}>
          검색어
        </label>
        <div className="foundation-search-row">
          <input
            ref={input}
            type="search"
            readOnly={state === "loading"}
            className="foundation-input"
            id={`${uid}-search`}
            placeholder="예: 모달"
            aria-describedby={preview ? undefined : `${uid}-search-help`}
            value={preview ? q : value}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229)
              )
                e.preventDefault();
            }}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            className="demo-primary"
            disabled={state === "loading"}
          >
            검색
          </button>
        </div>
        <InputMetrics value={preview ? q : value} inputId={`${uid}-search`} />
        {!preview && (
          <p className="foundation-search-help" id={`${uid}-search-help`}>
            검색 예시: <strong>모달 · 하단 · 접이식 · 검색형</strong>
            <br />이 체험은 샘플 노트 4개에서 검색합니다. 예시 단어를 입력하고
            Enter 또는 검색 버튼을 누르세요.
          </p>
        )}
        {!preview && (
          <div className="foundation-search-options">
            <button
              type="button"
              disabled={state === "loading"}
              onClick={clear}
            >
              검색 초기화
            </button>
            <label className="foundation-option">
              <input
                type="checkbox"
                checked={fail}
                disabled={phase === "loading"}
                onChange={(e) => setFail(e.target.checked)}
              />
              조회 실패 모의
            </label>
          </div>
        )}
      </form>
      <div
        aria-busy={state === "loading"}
        className="foundation-search-results"
      >
        {state === "done" && items.length > 0 && (
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <p
          className={`foundation-status ${state === "error" ? "foundation-error" : ""}`}
          role={preview ? undefined : state === "error" ? "alert" : "status"}
        >
          {state === "idle"
            ? "검색어를 입력한 뒤 검색하세요."
            : state === "loading"
              ? "검색 결과를 불러오는 중…"
              : state === "error"
                ? "불러오지 못했어요. 검색 버튼으로 다시 시도하세요."
                : items.length
                  ? `“${q}” 검색 결과 ${items.length}개`
                  : `“${q}” 검색 결과가 없어요. 검색어를 바꾸거나 초기화하세요.`}
        </p>
      </div>
    </FoundationFrame>
  );
}
export function SliderScene({ preview = false, time = 1700 }: SceneProps) {
  const [value, setValue] = useState(50),
    [draft, setDraft] = useState("50"),
    [error, setError] = useState("");
  const uid = useId(),
    shown = preview
      ? time < 900
        ? 25
        : time < 2000
          ? 60
          : time < 3100
            ? 80
            : 40
      : value;
  return (
    <FoundationFrame kind="slider" title="음량 조절" preview={preview}>
      <label className="foundation-label" htmlFor={`${uid}-range`}>
        음량
      </label>
      <output className="foundation-volume" htmlFor={`${uid}-range`}>
        {shown}%
      </output>
      <input
        type="range"
        className="foundation-range"
        id={`${uid}-range`}
        min={0}
        max={100}
        step={5}
        value={shown}
        aria-valuetext={`${shown}%`}
        onChange={(e) => {
          setValue(Number(e.target.value));
          setDraft(e.target.value);
          setError("");
        }}
      />
      <div className="foundation-range-ends">
        <span>0%</span>
        <span>100%</span>
      </div>
      {!preview && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(draft);
            if (
              !draft.trim() ||
              !Number.isFinite(n) ||
              n < 0 ||
              n > 100 ||
              n % 5 !== 0
            ) {
              setError("0~100 사이의 5 단위 숫자를 입력해 주세요.");
              return;
            }
            setValue(n);
            setError("");
          }}
        >
          <label className="foundation-label" htmlFor={`${uid}-number`}>
            정확한 값 입력
          </label>
          <div className="foundation-search-row">
            <input
              id={`${uid}-number`}
              className="foundation-input"
              type="number"
              min={0}
              max={100}
              step={5}
              value={draft}
              aria-invalid={!!error}
              aria-describedby={`${uid}-error`}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit">값 적용</button>
          </div>
          <p
            id={`${uid}-error`}
            className="foundation-error"
            role={error ? "alert" : undefined}
          >
            {error}
          </p>
        </form>
      )}
      <p className="foundation-status">
        방향키·Home·End 또는 숫자 입력으로 조절해요.
      </p>
    </FoundationFrame>
  );
}
const crumbTitles = ["작업 공간", "프로젝트", "디자인 가이드"];
const crumbIds = ["workspace", "projects", "design-guide"];
export function BreadcrumbScene({ preview = false, time = 1700 }: SceneProps) {
  const [level, setLevel] = useState(2);
  const heading = useRef<HTMLHeadingElement>(null),
    moved = useRef(false);
  const current = preview
    ? time < 1200
      ? 2
      : time < 2500
        ? 1
        : time < 3300
          ? 0
          : 2
    : level;
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [level]);
  return (
    <FoundationFrame kind="breadcrumb" title="현재 위치 경로" preview={preview}>
      <nav aria-label="현재 위치">
        <ol className="foundation-breadcrumb">
          {crumbTitles.slice(0, current + 1).map((title, i) => (
            <li key={title}>
              {i === current ? (
                <span aria-current="page">{title}</span>
              ) : (
                <a
                  href={`#${crumbIds[i]}`}
                  onClick={(e) => {
                    e.preventDefault();
                    moved.current = true;
                    setLevel(i);
                  }}
                >
                  {title}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="foundation-destination">
        <span className="foundation-folder" aria-hidden="true">
          ▤
        </span>
        <h3 ref={heading} tabIndex={-1} id={crumbIds[current]}>
          {crumbTitles[current]}
        </h3>
        <p>상위 경로를 누르면 해당 위치로 이동해요.</p>
      </div>
      {!preview && (
        <button
          type="button"
          onClick={() => {
            moved.current = true;
            setLevel(2);
          }}
        >
          예시 경로 복원
        </button>
      )}
    </FoundationFrame>
  );
}
const pageNotes = [
  "모달의 목적 정리",
  "입력 오류 검토",
  "팀원 의견 수집",
  "버튼 문구 개선",
  "모바일 시안 공유",
  "접근성 점검",
  "검색 결과 설계",
  "탭 전환 검토",
  "최종 가이드 배포",
];
export function PaginationScene({ preview = false, time = 1700 }: SceneProps) {
  const [page, setPage] = useState(1);
  const heading = useRef<HTMLHeadingElement>(null),
    moved = useRef(false);
  const current = preview
    ? time < 1100
      ? 1
      : time < 2400
        ? 2
        : time < 3400
          ? 3
          : 1
    : page;
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [page]);
  const go = (next: number) => {
    moved.current = true;
    setPage(next);
  };
  return (
    <FoundationFrame
      kind="pagination"
      title="프로젝트 노트 목록"
      preview={preview}
    >
      <h3
        className="foundation-page-heading"
        ref={heading}
        tabIndex={-1}
        id={`page-${current}`}
      >
        {current}페이지 · 전체 9개
      </h3>
      <ul className="foundation-result-list">
        {pageNotes.slice((current - 1) * 3, current * 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <nav aria-label="결과 페이지">
        <ul className="foundation-pagination">
          <li>
            {current > 1 ? (
              <a
                href={`#page-${current - 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(current - 1);
                }}
              >
                이전
              </a>
            ) : (
              <span aria-disabled="true">이전</span>
            )}
          </li>
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <a
                href={`#page-${n}`}
                aria-label={`${n}페이지`}
                aria-current={current === n ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (page !== n) go(n);
                }}
              >
                {n}
              </a>
            </li>
          ))}
          <li>
            {current < 3 ? (
              <a
                href={`#page-${current + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(current + 1);
                }}
              >
                다음
              </a>
            ) : (
              <span aria-disabled="true">다음</span>
            )}
          </li>
        </ul>
      </nav>
      <p className="foundation-status" role={preview ? undefined : "status"}>
        {current} / 3페이지
      </p>
    </FoundationFrame>
  );
}
export function DisclosureScene({ preview = false, time = 1700 }: SceneProps) {
  const [open, setOpen] = useState(false);
  const expanded = preview ? time >= 700 && time < 3000 : open;
  return (
    <FoundationFrame kind="disclosure" title="배송 안내" preview={preview}>
      <p className="foundation-description">기본 배송은 2~3일이 걸려요.</p>
      <details
        className="foundation-details"
        open={expanded}
        onToggle={(e) => {
          if (!preview) setOpen(e.currentTarget.open);
        }}
      >
        <summary>
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
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>추가 배송 조건</span>
        </summary>
        <div>
          <p>도서·산간 지역은 1~2일 더 걸릴 수 있어요.</p>
          <ul>
            <li>추가 배송비는 결제 전에 표시합니다.</li>
            <li>일정이 바뀌면 주문 내역에서 안내합니다.</li>
          </ul>
        </div>
      </details>
      <p className="foundation-status">
        {expanded
          ? "추가 조건이 펼쳐졌어요."
          : "필요한 설명만 펼쳐서 읽어보세요."}
      </p>
    </FoundationFrame>
  );
}
const inlineMessages = {
  info: ["공동 편집 안내", "변경 내용은 팀원과 함께 확인할 수 있어요."],
  success: ["저장을 완료했어요", "최신 변경 내용이 노트에 반영됐어요."],
  warning: [
    "공유 전 확인하세요",
    "노트에 개인정보가 있는지 한 번 더 확인하세요.",
  ],
  error: [
    "노트를 저장하지 못했어요",
    "작성한 내용은 유지됩니다. 다시 시도해 주세요.",
  ],
};
type InlineTone = keyof typeof inlineMessages;
export function InlineAlertScene({ preview = false, time = 1700 }: SceneProps) {
  const [tone, setTone] = useState<InlineTone>("info"),
    [pending, setPending] = useState(false),
    [fail, setFail] = useState(false);
  const retry = useRef<HTMLButtonElement>(null),
    successControl = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (preview || !pending) return;
    const timer = setTimeout(() => {
      setTone(fail ? "error" : "success");
      setPending(false);
      requestAnimationFrame(() => {
        if (!fail) successControl.current?.focus();
        else retry.current?.focus();
      });
    }, 650);
    return () => clearTimeout(timer);
  }, [preview, pending, fail]);
  const shown = preview
    ? time < 900
      ? "info"
      : time < 1800
        ? "warning"
        : time < 2900
          ? "error"
          : "success"
    : tone;
  const [title, body] = inlineMessages[shown];
  return (
    <FoundationFrame
      kind="inline-alert"
      title="작업 영역의 안내"
      preview={preview}
    >
      {!preview && (
        <div
          className="foundation-alert-controls"
          role="group"
          aria-label="알림 상태 선택"
        >
          {(
            [
              ["info", "안내"],
              ["success", "완료"],
              ["warning", "주의"],
              ["error", "실패"],
            ] as const
          ).map(([key, label]) => (
            <button
              ref={key === "success" ? successControl : undefined}
              key={key}
              type="button"
              aria-pressed={tone === key}
              disabled={pending}
              onClick={() => setTone(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <section
        className={`foundation-inline-alert tone-${shown}`}
        role={preview ? undefined : shown === "error" ? "alert" : "status"}
        aria-busy={pending}
      >
        <span className="foundation-alert-icon" aria-hidden="true">
          {shown === "error"
            ? "!"
            : shown === "success"
              ? "✓"
              : shown === "warning"
                ? "△"
                : "i"}
        </span>
        <div>
          <strong>{pending ? "다시 저장하는 중…" : title}</strong>
          <p>{body}</p>
          {shown === "error" && !preview && (
            <button
              ref={retry}
              type="button"
              disabled={pending}
              onClick={() => setPending(true)}
            >
              다시 시도
            </button>
          )}
        </div>
      </section>
      {!preview && (
        <label className="foundation-option">
          <input
            type="checkbox"
            checked={fail}
            disabled={pending}
            onChange={(e) => setFail(e.target.checked)}
          />
          재시도도 실패
        </label>
      )}
      <p className="foundation-description">
        관련 작업 가까이에 남아 있는 메시지예요.
      </p>
    </FoundationFrame>
  );
}
