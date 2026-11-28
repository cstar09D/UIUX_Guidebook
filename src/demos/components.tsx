import { DemoSelect } from "./select-controls";
import { shareServices } from "./share-services.mjs";
import { InputMetrics } from "./input-metrics";
import { measureText, limitText } from "./input-metrics.mjs";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SceneProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
function envelope(
  t: number,
  start: number,
  enter: number,
  end: number,
  exit: number,
) {
  return t < end ? ease((t - start) / enter) : 1 - ease((t - end) / exit);
}
function MockApp({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mock-app">
      <div className="mock-top">
        <span className="mock-brand" /> <span className="mock-dot" />
        <span className="mock-dot" />
      </div>
      <div className="mock-lines">
        <i />
        <i />
        <i />
      </div>
      {children}
    </div>
  );
}
function useNativeDialog(
  open: boolean,
  reduced: boolean,
  kind: "modal" | "sheet",
) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      if (!reduced)
        el.animate(
          kind === "sheet"
            ? [
                { transform: "translateY(100%)" },
                { transform: "translateY(0)" },
              ]
            : [
                { opacity: 0, transform: "translateY(8px) scale(.98)" },
                { opacity: 1, transform: "translateY(0) scale(1)" },
              ],
          {
            duration: kind === "sheet" ? 320 : 220,
            easing: "cubic-bezier(.2,0,0,1)",
          },
        );
    }
    if (!open && el.open) el.close();
  }, [open, reduced, kind]);
  useEffect(
    () => () => {
      const el = ref.current;
      if (el) {
        el.getAnimations().forEach((a) => a.cancel());
        if (el.open) el.close();
      }
    },
    [],
  );
  const close = () => {
    const el = ref.current;
    if (!el?.open || closing.current) return;
    closing.current = true;
    if (reduced) {
      el.close();
      closing.current = false;
      return;
    }
    const animation = el.animate(
      kind === "sheet"
        ? [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }]
        : [
            { opacity: 1, transform: "translateY(0) scale(1)" },
            { opacity: 0, transform: "translateY(8px) scale(.98)" },
          ],
      { duration: kind === "sheet" ? 220 : 180, easing: "ease-in" },
    );
    animation.finished
      .then(() => {
        el.close();
        closing.current = false;
      })
      .catch(() => {
        closing.current = false;
      });
  };
  return { ref, close };
}
export function ModalScene({
  preview = false,
  time = 1400,
  reduced = false,
}: SceneProps) {
  const metricUid = useId();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedName, setSavedName] = useState("나의 작업 공간");
  const [name, setName] = useState("나의 작업 공간");
  const { ref, close } = useNativeDialog(open, reduced, "modal");
  const e = envelope(time, 600, 220, 2100, 180);
  const content = (
    <>
      <button className="demo-close" aria-label="모달 닫기" onClick={close}>
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
      <span className="demo-symbol">✦</span>
      <h2 id="modal-title">작업 공간 설정</h2>
      <p>함께 일하는 공간에 이름을 지어주세요.</p>
      <label className="demo-label">
        공간 이름
        <input
          id={`${metricUid}-name`}
          value={name}
          onChange={(event) => setName(limitText(event.target.value, 30))}
        />
      </label>
      <InputMetrics value={name} inputId={`${metricUid}-name`} limit={30} />
      <div className="demo-actions">
        <button onClick={close}>취소</button>
        <button
          className="demo-primary"
          onClick={() => {
            setSavedName(name);
            setSaved(true);
            close();
          }}
        >
          변경 저장
        </button>
      </div>
    </>
  );
  return (
    <div
      className={`scene scene-modal ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <MockApp>
        <div className="mock-action">작업 공간 설정</div>
      </MockApp>
      {!preview && (
        <div className="demo-center">
          <span className="demo-eyebrow">WORKSPACE</span>
          <h2>{savedName}</h2>
          <p>
            {saved
              ? "변경 사항을 저장했어요."
              : "설정을 열고, 배경과 포커스의 변화를 확인하세요."}
          </p>
          <button
            className="demo-primary"
            onClick={() => {
              setName(savedName);
              setOpen(true);
            }}
          >
            설정 열기
          </button>
          <span className="demo-help" role="status">
            {saved ? "저장 완료" : "Esc로 닫을 수 있어요"}
          </span>
        </div>
      )}
      {preview ? (
        <>
          <div className="mini-backdrop" style={{ opacity: e }} />
          <div
            className="mini-modal"
            style={{
              opacity: e,
              transform: `translateY(calc(-50% + ${(1 - e) * 8}px)) scale(${0.98 + 0.02 * e})`,
            }}
          >
            <span className="mini-symbol">✦</span>
            <strong>작업 공간 설정</strong>
            <label className="mini-modal-input">
              <span>공간 이름</span>
              <input readOnly value="나의 작업 공간" tabIndex={-1} />
            </label>
            <div>
              <b>취소</b>
              <b className="mini-blue">변경 저장</b>
            </div>
          </div>
          {time > 2280 && <span className="mini-saved">설정을 저장했어요</span>}
        </>
      ) : (
        <dialog
          ref={ref}
          className="demo-dialog"
          aria-labelledby="modal-title"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClose={() => setOpen(false)}
        >
          {content}
        </dialog>
      )}
    </div>
  );
}
function SheetActionIcon({ index }: { index: number }) {
  return (
    <svg
      className="sheet-action-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {index === 0 ? (
        <>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.5 10.5 7-4m-7 7 7 4" />
        </>
      ) : index === 1 ? (
        <path d="m16 3 5 5-12 12H4v-5zM14 5l5 5" />
      ) : (
        <path d="M4 8h16v13H4zM3 3h18v5H3zM9 12h6" />
      )}
    </svg>
  );
}

export function SheetScene({
  preview = false,
  time = 1600,
  reduced = false,
}: SceneProps) {
  const [open, setOpen] = useState(false),
    [sharing, setSharing] = useState(false),
    [copyFailure, setCopyFailure] = useState(false),
    [copyError, setCopyError] = useState("");
  const [choice, setChoice] = useState("선택하지 않음");
  const [offset, setOffset] = useState(0);
  const drag = useRef<number | null>(null);
  const { ref, close } = useNativeDialog(open, reduced, "sheet");
  useEffect(() => {
    if (open && sharing)
      ref.current
        ?.querySelector<HTMLButtonElement>("[data-share-service]")
        ?.focus();
  }, [open, sharing, ref]);
  const e = envelope(time, 600, 320, 2400, 220);
  const options = [
    ["공유하기", "링크로 함께 보기"],
    ["이름 바꾸기", "내가 찾기 쉬운 이름으로"],
    ["보관하기", "목록에서 잠시 치우기"],
  ];
  return (
    <div
      className={`scene scene-sheet ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <MockApp>
        <div className="mock-card">
          <span className="mock-card-icon">▤</span>
          <strong>이번 주 디자인 노트</strong>
          <span>방금 수정했어요</span>
        </div>
      </MockApp>
      {preview ? (
        <>
          <div className="mini-backdrop" style={{ opacity: e }} />
          <div
            className="mini-sheet"
            style={{ transform: `translateY(${(1 - e) * 110}%)` }}
          >
            <i className="sheet-handle" />
            <strong>노트 관리</strong>
            {options.map(([title], i) => (
              <div
                className={`mini-sheet-row ${time > 1900 && i === 0 ? "selected" : ""}`}
                key={title}
              >
                <span className="sheet-row-icon">
                  <SheetActionIcon index={i} />
                </span>
                {title}
                <span className="option-chevron" aria-hidden="true">
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
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="demo-center">
            <span className="demo-eyebrow">MY NOTES</span>
            <h2>이번 주 디자인 노트</h2>
            <p>노트를 어떻게 관리할까요?</p>
            <button className="demo-primary" onClick={() => setOpen(true)}>
              노트 메뉴 열기
            </button>
            <span className="demo-help" role="status">
              {choice === "선택하지 않음"
                ? "패널을 아래로 끌거나 닫기 버튼을 눌러보세요."
                : choice}
            </span>
          </div>
          <dialog
            ref={ref}
            className="demo-dialog demo-sheet"
            aria-labelledby="sheet-title"
            onCancel={(event) => {
              event.preventDefault();
              close();
            }}
            onClose={() => {
              setOpen(false);
              setSharing(false);
              setCopyError("");
              setOffset(0);
            }}
            style={
              offset ? { transform: `translateY(${offset}px)` } : undefined
            }
          >
            <div
              className="sheet-drag-area"
              onPointerDown={(event) => {
                drag.current = event.clientY;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (drag.current !== null)
                  setOffset(Math.max(0, event.clientY - drag.current));
              }}
              onPointerUp={(event) => {
                const amount =
                  drag.current === null ? 0 : event.clientY - drag.current;
                drag.current = null;
                if (amount > (ref.current?.offsetHeight || 300) * 0.25) close();
                setOffset(0);
              }}
              onPointerCancel={() => {
                drag.current = null;
                setOffset(0);
              }}
            >
              <i className="sheet-handle" />
            </div>
            <button
              className="demo-close"
              aria-label="바텀시트 닫기"
              onClick={close}
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
            <h2 id="sheet-title">{sharing ? "공유하기" : "노트 관리"}</h2>
            <p>원하는 작업을 선택하세요.</p>
            {!sharing &&
              options.map(([title, sub], i) => (
                <button
                  className="sheet-option"
                  key={title}
                  onClick={() => {
                    if (title === "공유하기") {
                      setSharing(true);
                      setCopyError("");
                      return;
                    }
                    setChoice(`${title} 선택 완료`);
                    close();
                  }}
                >
                  <span className="sheet-option-icon">
                    <SheetActionIcon index={i} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{sub}</small>
                  </span>
                  <span className="option-chevron" aria-hidden="true">
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
                  </span>
                </button>
              ))}
            {sharing && (
              <section className="sheet-share-content">
                <p>서비스를 선택하세요. 외부 게시·전송은 하지 않습니다.</p>
                <div className="foundation-share-services">
                  {shareServices.map(([id, name, glyph]) => (
                    <button
                      type="button"
                      key={id}
                      data-share-service={name}
                      onClick={() => {
                        if (id === "link" && copyFailure) {
                          setCopyError(
                            "복사 실패 모의예요. 실패 옵션을 해제하고 다시 누르세요.",
                          );
                          return;
                        }
                        setChoice(
                          id === "link"
                            ? "링크 복사를 모의 완료했어요. 실제 클립보드는 변경하지 않습니다."
                            : `${name} 공유를 선택했어요. 실제 게시·전송은 하지 않습니다.`,
                        );
                        close();
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
                <label className="foundation-option">
                  <input
                    data-sheet-copy-failure
                    type="checkbox"
                    checked={copyFailure}
                    onChange={(e) => setCopyFailure(e.target.checked)}
                  />
                  링크 복사 실패 모의
                </label>
                <p
                  className="foundation-error"
                  role={copyError ? "alert" : undefined}
                >
                  {copyError}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSharing(false);
                    setCopyError("");
                    requestAnimationFrame(() =>
                      ref.current
                        ?.querySelector<HTMLButtonElement>(".sheet-option")
                        ?.focus(),
                    );
                  }}
                >
                  노트 메뉴로 돌아가기
                </button>
              </section>
            )}
          </dialog>
        </>
      )}
    </div>
  );
}
const questions = [
  [
    "어떤 방식으로 사용할 수 있나요?",
    "목록에서 모양을 살펴보고, 상세에서 직접 조작할 수 있어요. 키보드의 Tab과 Enter도 사용해 보세요.",
  ],
  [
    "코드는 자유롭게 사용할 수 있나요?",
    "예제 코드를 복사해 프로젝트에 맞게 바꿔보세요. 실제 서비스에서는 데이터 연결과 접근성을 추가로 확인하세요.",
  ],
  [
    "모바일에서도 사용할 수 있나요?",
    "네. 화면 크기와 입력 방식에 맞춰 배치가 달라집니다. 단순한 폭 변경과 실제 기기 검증은 구분해 주세요.",
  ],
];
export function AccordionScene({
  preview = false,
  time = 2500,
  reduced = false,
}: SceneProps) {
  const [opened, setOpened] = useState<number[]>([0]);
  const [multiple, setMultiple] = useState(false);
  const uid = useId();
  const amount = (index: number) =>
    preview
      ? index === 0
        ? envelope(time, 600, 200, 1900, 180)
        : index === 1
          ? ease((time - 1900) / 200)
          : 0
      : opened.includes(index)
        ? 1
        : 0;
  return (
    <div
      className={`scene scene-accordion ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="faq-wrap">
        {!preview && (
          <>
            <span className="demo-eyebrow">FREQUENT QUESTIONS</span>
            <h2>자주 묻는 질문</h2>
            <label className="demo-check">
              <input
                type="checkbox"
                checked={multiple}
                onChange={(e) => {
                  setMultiple(e.target.checked);
                  setOpened([]);
                }}
              />
              여러 항목 동시에 열기
            </label>
          </>
        )}
        <div className="faq-items">
          {questions.map(([title, answer], i) => (
            <section
              className={amount(i) > 0.01 ? "faq-item is-open" : "faq-item"}
              key={title}
            >
              <h3>
                <button
                  aria-expanded={amount(i) > 0.01}
                  aria-controls={`${uid}-panel-${i}`}
                  onClick={() =>
                    setOpened((previous) =>
                      previous.includes(i)
                        ? previous.filter((v) => v !== i)
                        : multiple
                          ? [...previous, i]
                          : [i],
                    )
                  }
                >
                  <span className="faq-question">{title}</span>
                  <span
                    aria-hidden="true"
                    className="faq-chevron"
                    style={
                      preview
                        ? { transform: `rotate(${amount(i) * 180}deg)` }
                        : undefined
                    }
                  >
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
                </button>
              </h3>
              <div
                id={`${uid}-panel-${i}`}
                className="faq-body"
                inert={amount(i) === 0}
                style={{ gridTemplateRows: `${amount(i)}fr` }}
              >
                <div>
                  <p>
                    {preview
                      ? [
                          "화면에서 직접 조작하며 확인하세요.",
                          "필요한 부분을 복사해서 사용하세요.",
                          "작은 화면에도 유연하게 대응해요.",
                        ][i]
                      : answer}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
        {!preview && (
          <p className="demo-help">
            제목에 포커스를 두고 Enter 또는 Space로 펼쳐보세요.
          </p>
        )}
      </div>
    </div>
  );
}
export function SkeletonScene({
  preview = false,
  time = 1100,
  reduced = false,
  paused = false,
}: SceneProps) {
  const [phase, setPhase] = useState("loading");
  const [result, setResult] = useState("success");
  const [delay, setDelay] = useState(1400);
  const [run, setRun] = useState(0);
  const elapsed = useRef(0);
  useEffect(() => {
    if (preview || phase !== "loading" || paused) return;
    let frame = 0,
      last: number | undefined;
    const step = (now: number) => {
      if (last !== undefined) elapsed.current += now - last;
      last = now;
      if (elapsed.current >= delay) {
        setPhase(result);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [preview, phase, paused, delay, result, run]);
  const reload = () => {
    elapsed.current = 0;
    setPhase("loading");
    setRun((v) => v + 1);
  };
  const loading = preview ? time < 1800 : phase === "loading";
  const loaded = preview ? time >= 1800 : phase === "success";
  const shimmer = preview ? clamp((time - 600) / 1200) : undefined;
  return (
    <div
      className={`scene scene-skeleton ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""} ${paused ? "is-paused" : ""}`}
    >
      <div className="skeleton-demo">
        {!preview && (
          <div className="loading-options">
            <label>
              결과
              <DemoSelect
                aria-label="로딩 결과"
                value={result}
                onChange={(e) => setResult(e.target.value)}
              >
                <option value="success">성공</option>
                <option value="empty">빈 결과</option>
                <option value="error">오류</option>
              </DemoSelect>
            </label>
            <label>
              대기 시간
              <DemoSelect
                aria-label="대기 시간"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
              >
                <option value={800}>0.8초</option>
                <option value={1400}>1.4초</option>
                <option value={3000}>3초</option>
              </DemoSelect>
            </label>
            <button className="demo-primary" onClick={reload}>
              다시 불러오기
            </button>
          </div>
        )}
        <div className="profile-card" aria-busy={loading}>
          {loading ? (
            <div className="skeleton-content" aria-hidden="true">
              <div className="profile-heading">
                <span className="skeleton-shape skeleton-avatar" />
                <div>
                  <span className="skeleton-shape skeleton-title" />
                  <span className="skeleton-shape skeleton-subtitle" />
                </div>
              </div>
              <span className="skeleton-shape skeleton-cover" />
              <div className="skeleton-lines">
                <i className="skeleton-shape" />
                <i className="skeleton-shape" />
              </div>
              {!reduced && (
                <span
                  className="shimmer"
                  style={
                    preview
                      ? {
                          animation: "none",
                          transform: `translateX(${-120 + (shimmer || 0) * 260}%)`,
                        }
                      : undefined
                  }
                />
              )}
            </div>
          ) : loaded ? (
            <div
              className="loaded-profile"
              style={
                preview ? { opacity: ease((time - 1800) / 160) } : undefined
              }
            >
              <div className="profile-heading">
                <span className="profile-avatar">J</span>
                <div>
                  <strong>지수의 디자인 기록</strong>
                  <span>새로운 아이디어를 기록해요</span>
                </div>
              </div>
              <div className="profile-cover">
                <span>
                  Small ideas,
                  <br />
                  better interfaces.
                </span>
                <i />
                <b />
              </div>
              <div className="profile-bottom">
                <strong>매일 조금씩, 더 나은 화면</strong>
                <span>방금 업데이트됨</span>
              </div>
            </div>
          ) : (
            <div className="loading-result">
              <span>{phase === "error" ? "!" : "∅"}</span>
              <strong>
                {phase === "error" ? "불러오지 못했어요" : "아직 기록이 없어요"}
              </strong>
              <p>
                {phase === "error"
                  ? "다시 시도할 수 있어요."
                  : "첫 기록을 추가하면 여기에 표시돼요."}
              </p>
              <button
                onClick={phase === "error" ? reload : () => setPhase("success")}
              >
                {phase === "error" ? "다시 시도" : "첫 기록 추가"}
              </button>
            </div>
          )}
        </div>
        {!preview && (
          <p className="demo-help" role="status">
            {loading
              ? "샘플 데이터를 불러오는 중이에요."
              : loaded
                ? "콘텐츠를 불러왔어요."
                : phase === "error"
                  ? "모의 오류 상태입니다."
                  : "데이터가 없는 상태입니다."}
          </p>
        )}
      </div>
    </div>
  );
}
const cities = ["서울", "서귀포", "서산", "부산", "제주"];
export function ComboScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState("");
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId();
  const composing = useRef(false);
  const pOpen = preview && time >= 1100 && time < 2000;
  const pText = preview
    ? time < 600
      ? ""
      : time < 2000
        ? "서"
        : "서귀포"
    : text;
  const results = preview
    ? cities.filter((c) => c.includes("서"))
    : cities.filter((c) => c.includes(text));
  const shown = preview ? pOpen : open;
  const index = preview ? (time > 1500 ? 1 : 0) : active;
  useEffect(() => {
    if (preview) return;
    const onOutside = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [preview]);
  const select = (value: string) => {
    setText(value);
    setSelected(value);
    input.current?.focus();
    setOpen(false);
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      composing.current ||
      e.nativeEvent.isComposing ||
      e.nativeEvent.keyCode === 229
    )
      return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((n) =>
        open
          ? Math.max(
              0,
              Math.min(
                results.length - 1,
                n + (e.key === "ArrowDown" ? 1 : -1),
              ),
            )
          : e.key === "ArrowDown"
            ? 0
            : Math.max(0, results.length - 1),
      );
    }
    if (e.key === "Enter" && open) {
      e.preventDefault();
      if (results[active]) select(results[active]);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };
  return (
    <div
      className={`scene scene-combo ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div
        className="combo-demo"
        ref={wrapper}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            setOpen(false);
        }}
      >
        {!preview && (
          <>
            <span className="demo-eyebrow">NEXT DESTINATION</span>
            <h2>다음 여행은 어디로?</h2>
            <p>도시를 입력하거나 목록에서 선택해 보세요.</p>
          </>
        )}
        <label className="demo-label" htmlFor={`${uid}-input`}>
          여행할 도시
        </label>
        <div className={`combo-input ${shown ? "has-focus" : ""}`}>
          <input
            id={`${uid}-input`}
            ref={input}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={shown}
            aria-controls={`${uid}-list`}
            aria-activedescendant={
              shown && results[index] ? `${uid}-option-${index}` : undefined
            }
            value={pText}
            placeholder="도시 이름을 입력하세요"
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setText(e.target.value);
              setActive(0);
              setSelected("");
              setOpen(true);
            }}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={(e) => {
              composing.current = false;
              setText(e.currentTarget.value);
              setActive(0);
            }}
            onKeyDown={key}
          />
          <button
            tabIndex={-1}
            aria-label="도시 목록 열기"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              input.current?.focus();
              setOpen(!open);
            }}
          >
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
          </button>
        </div>
        <InputMetrics value={pText} inputId={`${uid}-input`} />
        {shown && (
          <div
            className="combo-list"
            id={`${uid}-list`}
            role="listbox"
            aria-label="추천 도시"
            style={
              preview
                ? {
                    opacity: ease((time - 1100) / 120),
                    transform: `translateY(${4 * (1 - ease((time - 1100) / 120))}px)`,
                  }
                : undefined
            }
          >
            {results.length ? (
              results.map((city, i) => (
                <div
                  key={city}
                  id={`${uid}-option-${i}`}
                  role="option"
                  aria-selected={i === index}
                  className={i === index ? "active" : ""}
                  onMouseDown={(e) => e.preventDefault()}
                  onPointerMove={() => setActive(i)}
                  onClick={() => select(city)}
                >
                  <span className="city-marker" />
                  {city}
                  <span>{i === index ? "선택" : ""}</span>
                </div>
              ))
            ) : (
              <div className="combo-empty" role="status">
                일치하는 도시가 없어요.
              </div>
            )}
          </div>
        )}
        {!preview && (
          <p className="demo-help" role="status">
            {selected
              ? `${selected} 선택 완료`
              : "방향키로 이동 · Enter로 선택 · Esc로 닫기"}
          </p>
        )}
      </div>
    </div>
  );
}
const initialRows = [
  ["데일리 노트", "2", "18,000"],
  ["위클리 플래너", "1", "24,000"],
  ["아이디어 카드", "3", "12,000"],
  ["미니 메모", "2", "6,000"],
];
export function GridScene({
  preview = false,
  time = 1000,
  reduced = false,
}: SceneProps) {
  const [rows, setRows] = useState(initialRows.map((r) => [...r]));
  const [cell, setCell] = useState([0, 1]);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("2");
  const [message, setMessage] = useState(
    "수량 셀을 두 번 누르거나 Enter로 편집하세요.",
  );
  const refs = useRef<(HTMLTableCellElement | null)[][]>([]);
  const statusId = useId();
  const [invalid, setInvalid] = useState(false);
  const r = preview ? 0 : cell[0],
    c = preview ? (time < 600 ? 0 : 1) : cell[1];
  const edit = preview ? time >= 1200 && time < 2400 : editing;
  const focus = (row: number, col: number) => {
    setCell([row, col]);
    refs.current[row]?.[col]?.focus();
  };
  const begin = () => {
    if (cell[1] !== 1) {
      setMessage("이 예제에서는 수량 열을 편집할 수 있어요.");
      return;
    }
    setValue(rows[cell[0]][1]);
    setInvalid(false);
    setEditing(true);
  };
  const commit = () => {
    const number = Number(value);
    if (!/^\d+$/.test(value) || number < 1 || number > 99) {
      setInvalid(true);
      setMessage("수량은 1~99의 정수로 입력해 주세요.");
      return false;
    }
    setInvalid(false);
    setRows((previous) =>
      previous.map((row, i) =>
        i === cell[0] ? [row[0], String(number), row[2]] : row,
      ),
    );
    setEditing(false);
    setMessage(`${rows[cell[0]][0]} 수량을 ${number}개로 변경했어요.`);
    refs.current[cell[0]]?.[1]?.focus();
    return true;
  };
  const onKey = (
    e: KeyboardEvent<HTMLTableCellElement>,
    row: number,
    col: number,
  ) => {
    if (editing) return;
    let next = [row, col];
    if (e.key === "ArrowRight") next = [row, Math.min(2, col + 1)];
    else if (e.key === "ArrowLeft") next = [row, Math.max(0, col - 1)];
    else if (e.key === "ArrowDown") next = [Math.min(3, row + 1), col];
    else if (e.key === "ArrowUp") next = [Math.max(0, row - 1), col];
    else if (e.key === "Home") next = [row, 0];
    else if (e.key === "End") next = [row, 2];
    else if (e.key === "Enter" || e.key === "F2") {
      e.preventDefault();
      begin();
      return;
    } else return;
    e.preventDefault();
    focus(next[0], next[1]);
  };
  return (
    <div
      className={`scene scene-grid ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="grid-demo">
        <div className="grid-heading">
          <span className="demo-eyebrow">INVENTORY</span>
          <strong>작은 문구점</strong>
          <span className="grid-count">4개 품목</span>
        </div>
        <div className="grid-scroll">
          <table
            role="grid"
            aria-label="문구 재고 편집"
            aria-rowcount={5}
            aria-colcount={3}
          >
            <thead>
              <tr role="row">
                {["품목", "수량", "가격"].map((label) => (
                  <th role="columnheader" key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr role="row" key={i}>
                  {row.map((item, j) => (
                    <td
                      key={j}
                      ref={(el) => {
                        refs.current[i] ??= [];
                        refs.current[i][j] = el;
                      }}
                      role="gridcell"
                      aria-selected={i === r && j === c}
                      aria-readonly={j !== 1}
                      tabIndex={i === r && j === c ? 0 : -1}
                      className={`${i === r && j === c ? "selected" : ""} ${i === r && j === c && edit ? "editing" : ""}`}
                      onFocus={() => {
                        if (!editing) setCell([i, j]);
                      }}
                      onClick={() => {
                        if (editing) return;
                        focus(i, j);
                      }}
                      onDoubleClick={() => {
                        if (j === 1) {
                          setCell([i, j]);
                          setValue(rows[i][1]);
                          setInvalid(false);
                          setEditing(true);
                        }
                      }}
                      onKeyDown={(e) => onKey(e, i, j)}
                    >
                      {edit && i === r && j === c ? (
                        preview ? (
                          <span className="grid-edit-preview">
                            {time > 1800 ? "3" : "2"}
                            <i />
                          </span>
                        ) : (
                          <input
                            aria-label={`${row[0]} 수량`}
                            aria-invalid={invalid}
                            aria-describedby={statusId}
                            autoFocus
                            inputMode="numeric"
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value);
                              setInvalid(false);
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === "Enter") {
                                e.preventDefault();
                                commit();
                              }
                              if (e.key === "Escape") {
                                e.preventDefault();
                                setEditing(false);
                                setMessage("변경을 취소했어요.");
                                refs.current[r]?.[c]?.focus();
                              }
                              if (e.key === "Tab") {
                                e.preventDefault();
                                if (commit()) focus(r, e.shiftKey ? 0 : 2);
                              }
                            }}
                          />
                        )
                      ) : preview && i === 0 && j === 1 && time >= 2400 ? (
                        "3"
                      ) : (
                        item
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!preview && (
          <>
            <p className="demo-help" id={statusId} role="status">
              {message}
            </p>
            <span className="demo-keyboard-hint">
              방향키 이동 · Enter/F2 편집 · Enter 확정 · Esc 취소
            </span>
          </>
        )}
      </div>
    </div>
  );
}
