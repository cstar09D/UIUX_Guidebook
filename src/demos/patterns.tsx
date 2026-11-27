import { InputMetrics } from "./input-metrics";
import { measureText, limitText } from "./input-metrics.mjs";
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
function PatternFrame({
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
      className={`scene pattern-scene scene-${kind} ${preview ? "is-preview" : ""}`}
    >
      <div className="pattern-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
function showPatternDialog(
  dialog: HTMLDialogElement | null,
  selector = "button",
) {
  if (dialog && !dialog.open) {
    dialog.showModal();
    dialog.querySelector<HTMLElement>(selector)?.focus();
  }
}
function PatternIcon({
  kind,
}: {
  kind: "plus" | "close" | "trash" | "note" | "list";
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "trash" ? (
        <>
          <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
        </>
      ) : kind === "note" ? (
        <>
          <path d="M14 2H5v20h14V7zM14 2v6h5M8 13h8M8 17h5" />
        </>
      ) : kind === "list" ? (
        <>
          <path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" />
        </>
      ) : kind === "close" ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M12 5v14M5 12h14" />
      )}
    </svg>
  );
}
export function FabScene({ preview = false, time = 1700 }: SceneProps) {
  const [notes, setNotes] = useState([{ id: 1, name: "이번 주 아이디어" }]);
  const [name, setName] = useState(""),
    [error, setError] = useState(""),
    [variant, setVariant] = useState("single"),
    [expanded, setExpanded] = useState(false),
    [kind, setKind] = useState("노트"),
    [message, setMessage] = useState(""),
    [removed, setRemoved] = useState<{
      item: { id: number; name: string };
      index: number;
    } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    fab = useRef<HTMLButtonElement>(null),
    uid = useId(),
    sequence = useRef(1);
  const speed = preview ? time >= 2000 : variant === "speed",
    showActions = preview ? time >= 2300 && time < 3200 : expanded;
  const added = preview && time >= 3200;
  const shown = added ? [...notes, { id: 2, name: "다음 아이디어" }] : notes;
  const create = (type: string) => {
    setKind(type);
    setName("");
    setError("");
    setExpanded(false);
    showPatternDialog(dialog.current, "input");
  };
  const form = (
    <>
      <h3 id={`${uid}-title`}>새 {kind} 만들기</h3>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length < 2 || name.trim().length > 40) {
            setError("이름을 2~40자로 입력해 주세요.");
            dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
            return;
          }
          setNotes((v) => [
            ...v,
            { id: ++sequence.current, name: name.trim() },
          ]);
          setMessage(`${kind} ‘${name.trim()}’를 추가했어요.`);
          dialog.current?.close();
        }}
      >
        <label className="pattern-label" htmlFor={`${uid}-name`}>
          {kind} 이름
        </label>
        <input
          id={`${uid}-name`}
          className="pattern-input"
          value={preview ? "다음 아이디어" : name}
          aria-invalid={!!error}
          aria-describedby={`${uid}-error`}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        <InputMetrics
          value={preview ? "다음 아이디어" : name}
          inputId={`${uid}-name`}
        />
        <p
          id={`${uid}-error`}
          className="pattern-error"
          role={error ? "alert" : undefined}
        >
          {error}
        </p>
        <div className="pattern-actions">
          <button type="button" onClick={() => dialog.current?.close()}>
            취소
          </button>
          <button className="demo-primary" type="submit">
            {kind} 만들기
          </button>
        </div>
      </form>
    </>
  );
  return (
    <PatternFrame
      kind="floating-action-button"
      title="나의 아이디어"
      preview={preview}
    >
      {!preview && (
        <div
          className="pattern-variants"
          role="group"
          aria-label="액션 버튼 형태"
        >
          <button
            data-variant="single"
            aria-pressed={variant === "single"}
            onClick={() => {
              setVariant("single");
              setExpanded(false);
            }}
          >
            단일 버튼
          </button>
          <button
            data-variant="speed"
            aria-pressed={speed}
            onClick={() => {
              setVariant("speed");
              setExpanded(false);
            }}
          >
            펼침 버튼
          </button>
        </div>
      )}
      <div
        className="pattern-workspace"
        onKeyDown={(e) => {
          if (e.key === "Escape" && expanded) {
            e.preventDefault();
            setExpanded(false);
            fab.current?.focus();
          }
        }}
      >
        <ul className="pattern-note-list">
          {shown.map((note, i) => (
            <li key={note.id} data-note={note.id}>
              <span>{note.name}</span>
              {!preview && (
                <button
                  type="button"
                  className="pattern-delete"
                  aria-label={`${note.name} 삭제`}
                  onClick={() => {
                    setRemoved({ item: note, index: i });
                    setNotes((v) => v.filter((n) => n.id !== note.id));
                    setMessage(
                      `‘${note.name}’를 삭제했어요. 되돌릴 수 있어요.`,
                    );
                    requestAnimationFrame(() => fab.current?.focus());
                  }}
                >
                  <PatternIcon kind="trash" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {!shown.length && (
          <p className="pattern-empty">
            아직 항목이 없어요. 아래 버튼으로 추가하세요.
          </p>
        )}
        <button
          ref={fab}
          className={`pattern-fab ${preview && time > 600 ? "is-emphasized" : ""}`}
          aria-label={
            speed
              ? showActions
                ? "추가 메뉴 닫기"
                : "추가 메뉴 열기"
              : "새 노트 만들기"
          }
          aria-expanded={speed ? showActions : undefined}
          aria-controls={speed ? `${uid}-actions` : undefined}
          onClick={() => (speed ? setExpanded((v) => !v) : create("노트"))}
        >
          <PatternIcon kind={speed && showActions ? "close" : "plus"} />
        </button>
        <div
          className="pattern-speed-actions"
          id={`${uid}-actions`}
          role="group"
          aria-label="추가할 항목"
          hidden={!speed || !showActions}
        >
          <button
            type="button"
            data-create="노트"
            onClick={() => create("노트")}
          >
            <span>새 노트</span>
            <PatternIcon kind="note" />
          </button>
          <button
            type="button"
            data-create="체크리스트"
            onClick={() => create("체크리스트")}
          >
            <span>새 체크리스트</span>
            <PatternIcon kind="list" />
          </button>
        </div>
      </div>
      {preview && time >= 900 && time < 2000 ? (
        <div className="pattern-mini-layer">
          <div>{form}</div>
        </div>
      ) : null}
      {!preview && (
        <dialog
          ref={dialog}
          className="pattern-dialog"
          aria-labelledby={`${uid}-title`}
          onClose={() => fab.current?.focus()}
        >
          {form}
        </dialog>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {preview
          ? speed
            ? "보조 행동 펼치기"
            : "버튼으로 새 노트 추가"
          : `${notes.length}개 항목 · ${message || "추가 버튼과 항목별 삭제를 사용해 보세요."}`}
      </p>
      {!preview && (
        <button
          type="button"
          className="pattern-undo"
          hidden={!removed}
          onClick={() => {
            if (!removed) return;
            setNotes((v) => {
              const next = [...v];
              next.splice(
                Math.min(removed.index, next.length),
                0,
                removed.item,
              );
              return next;
            });
            setRemoved(null);
            setMessage("항목을 복원했어요.");
            fab.current?.focus();
          }}
        >
          삭제 되돌리기
        </button>
      )}
    </PatternFrame>
  );
}
const DATE_MIN = "2026-11-01",
  DATE_MAX = "2026-12-31";
function dateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}
function dateObject(value: string) {
  return new Date(`${value}T00:00:00Z`);
}
export function appointmentDateError(value: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(dateObject(value).getTime()) ||
    dateISO(dateObject(value)) !== value
  )
    return "YYYY-MM-DD 형식의 실제 날짜를 입력해 주세요.";
  if (value < DATE_MIN || value > DATE_MAX)
    return "예시 예약 기간은 2026-11-01~2026-12-31입니다.";
  if (dateObject(value).getUTCDay() === 0 || value === "2026-11-26")
    return "일요일과 11월 26일은 예약할 수 없어요. 다른 날짜를 골라 주세요.";
  return "";
}
function Calendar({
  month,
  active,
  selected,
  preview,
  onMove,
  onChoose,
  range,
  rangeMode = false,
}: {
  month: number;
  active: string;
  selected: string;
  preview: boolean;
  onMove: (iso: string) => void;
  onChoose: (iso: string) => void;
  range?: { start: string; end: string };
  rangeMode?: boolean;
}) {
  const first = new Date(Date.UTC(2026, month, 1));
  const start = new Date(first);
  start.setUTCDate(1 - first.getUTCDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    return date;
  });
  const move = (event: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const date = dateObject(iso);
    let delta = 0;
    if (event.key === "ArrowRight") delta = 1;
    else if (event.key === "ArrowLeft") delta = -1;
    else if (event.key === "ArrowDown") delta = 7;
    else if (event.key === "ArrowUp") delta = -7;
    else if (event.key === "Home") delta = -date.getUTCDay();
    else if (event.key === "End") delta = 6 - date.getUTCDay();
    else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const targetMonth =
        date.getUTCMonth() + (event.key === "PageDown" ? 1 : -1);
      const day = Math.min(
        date.getUTCDate(),
        new Date(Date.UTC(2026, targetMonth + 1, 0)).getUTCDate(),
      );
      onMove(dateISO(new Date(Date.UTC(2026, targetMonth, day))));
      return;
    } else return;
    event.preventDefault();
    date.setUTCDate(date.getUTCDate() + delta);
    onMove(dateISO(date));
  };
  return (
    <table
      className="pattern-calendar"
      role={preview ? undefined : "grid"}
      aria-multiselectable={rangeMode ? true : undefined}
      aria-label={`2026년 ${month + 1}월 예약일`}
    >
      <thead>
        <tr>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <th key={day} scope="col">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(
          {
            length: rangeMode
              ? Math.ceil(
                  (first.getUTCDay() +
                    new Date(Date.UTC(2026, month + 1, 0)).getUTCDate()) /
                    7,
                )
              : 6,
          },
          (_, row) => (
            <tr key={row}>
              {days.slice(row * 7, row * 7 + 7).map((date) => {
                const iso = dateISO(date),
                  inMonth = date.getUTCMonth() === month,
                  invalid = !!(rangeMode
                    ? travelDateError(iso)
                    : appointmentDateError(iso));
                return (
                  <td
                    key={iso}
                    aria-selected={
                      rangeMode
                        ? !!range?.start &&
                          iso >= range.start &&
                          iso <= (range.end || range.start)
                        : selected === iso
                    }
                    className={
                      rangeMode &&
                      range?.start &&
                      range.end &&
                      iso > range.start &&
                      iso < range.end
                        ? "in-range"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={active === iso ? 0 : -1}
                      aria-label={`${iso}${invalid ? " 예약 불가" : ""}`}
                      aria-disabled={invalid}
                      className={`${inMonth ? "" : "other-month"} ${active === iso ? "is-active" : ""} ${(rangeMode ? iso === range?.start || iso === range?.end : selected === iso) ? "is-selected" : ""}`}
                      onKeyDown={(e) => move(e, iso)}
                      onClick={() => onChoose(iso)}
                    >
                      {date.getUTCDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}
function SingleDatePicker({
  preview = false,
  time = 1700,
  controls,
}: SceneProps & { controls?: ReactNode }) {
  const [value, setValue] = useState(""),
    [saved, setSaved] = useState(""),
    [error, setError] = useState(""),
    [month, setMonth] = useState(10),
    [active, setActive] = useState("2026-11-16"),
    [calendarError, setCalendarError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    field = useRef<HTMLInputElement>(null),
    calendarButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const uid = useId();
  const move = (iso: string) => {
    if (iso < DATE_MIN || iso > DATE_MAX) return;
    setActive(iso);
    setMonth(dateObject(iso).getUTCMonth());
  };
  useEffect(() => {
    if (preview || !open) return;
    showPatternDialog(dialog.current, `[data-date="${active}"]`);
    dialog.current
      ?.querySelector<HTMLElement>(`[data-date="${active}"]`)
      ?.focus();
  }, [open, active, month, preview]);
  const choose = (iso: string) => {
    const issue = appointmentDateError(iso);
    if (issue) {
      setCalendarError(issue);
      return;
    }
    setValue(iso);
    setSaved("");
    setError("");
    setOpen(false);
    dialog.current?.close();
  };
  const calendar = (
    <>
      <div className="pattern-calendar-header">
        <button
          type="button"
          aria-label="이전 달"
          aria-disabled={month === 10}
          onClick={() => {
            if (month > 10) move("2026-11-16");
          }}
        >
          이전 달
        </button>
        <h3 aria-live={preview ? undefined : "polite"}>
          2026년 {preview ? 11 : month + 1}월
        </h3>
        <button
          type="button"
          aria-label="다음 달"
          aria-disabled={month === 11}
          onClick={() => {
            if (month < 11) move("2026-12-16");
          }}
        >
          다음 달
        </button>
      </div>
      <Calendar
        month={preview ? 10 : month}
        active={preview ? (time >= 1800 ? "2026-11-18" : "2026-11-16") : active}
        selected={preview && time >= 2200 ? "2026-11-18" : value}
        preview={preview}
        onMove={move}
        onChoose={choose}
      />
      {!preview && (
        <>
          <p className="pattern-calendar-help">
            방향키 이동 · Home/End 주 이동 · PageUp/Down 월 이동
          </p>
          <p className="pattern-error" role="status">
            {calendarError}
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              dialog.current?.close();
            }}
          >
            달력 닫기
          </button>
        </>
      )}
    </>
  );
  return (
    <PatternFrame kind="date-picker" title="상담 날짜 예약" preview={preview}>
      {controls}
      {preview ? (
        <div className="pattern-preview-calendar">{calendar}</div>
      ) : (
        <>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const issue = appointmentDateError(value);
              setError(issue);
              if (issue) {
                setSaved("");
                field.current?.focus();
                return;
              }
              setSaved(`${value} 예약을 선택했어요.`);
            }}
          >
            <label className="pattern-label" htmlFor={`${uid}-date`}>
              예약 날짜
            </label>
            <p id={`${uid}-hint`} className="pattern-help">
              예시: 2026-11-01~12-31 · 일요일과 11/26 제외
            </p>
            <div className="pattern-input-row">
              <input
                ref={field}
                id={`${uid}-date`}
                className="pattern-input"
                placeholder="YYYY-MM-DD"
                value={value}
                aria-invalid={!!error}
                aria-describedby={`${uid}-hint ${uid}-error`}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                  setSaved("");
                }}
              />
              <button
                ref={calendarButton}
                type="button"
                aria-label="예약 달력 열기"
                onClick={() => {
                  const initial = !appointmentDateError(value)
                    ? value
                    : "2026-11-16";
                  move(initial);
                  setCalendarError("");
                  setOpen(true);
                }}
              >
                달력
              </button>
            </div>
            <p
              id={`${uid}-error`}
              className="pattern-error"
              role={error ? "alert" : undefined}
            >
              {error}
            </p>
            <button className="demo-primary" type="submit">
              날짜 적용
            </button>
          </form>
          <dialog
            ref={dialog}
            className="pattern-dialog pattern-date-dialog"
            aria-label="예약 날짜 선택"
            onCancel={() => setOpen(false)}
            onClose={() => {
              setOpen(false);
              calendarButton.current?.focus();
            }}
          >
            {calendar}
          </dialog>
        </>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {preview
          ? time >= 2200
            ? "11월 18일 선택"
            : "예약할 날짜를 골라요"
          : saved || "직접 입력하거나 달력에서 선택하세요."}
      </p>
    </PatternFrame>
  );
}
export function travelDateError(value: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(dateObject(value).getTime()) ||
    dateISO(dateObject(value)) !== value
  )
    return "YYYY-MM-DD 형식의 실제 날짜를 입력해 주세요.";
  return value < DATE_MIN || value > DATE_MAX
    ? "여행 기간은 2026-11-01~2026-12-31 안에서 선택해 주세요."
    : "";
}
export function travelRangeError(start: string, end: string) {
  return (
    travelDateError(start) ||
    travelDateError(end) ||
    (end <= start ? "종료일은 시작일 다음 날 이후로 선택해 주세요." : "")
  );
}
export function DateRangePickerScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const [draft, setDraft] = useState({ start: "", end: "" }),
    [applied, setApplied] = useState({ start: "", end: "" }),
    [month, setMonth] = useState(10),
    [active, setActive] = useState("2026-11-16"),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const calendar = useRef<HTMLDivElement>(null),
    uid = useId();
  const shown = preview
    ? {
        start: time >= 800 ? "2026-11-16" : "",
        end: time >= 2000 ? "2026-11-20" : "",
      }
    : draft;
  const nights =
    shown.start && shown.end
      ? (dateObject(shown.end).getTime() - dateObject(shown.start).getTime()) /
        86400000
      : 0;
  const move = (iso: string) => {
    if (iso < DATE_MIN || iso > DATE_MAX) return;
    setActive(iso);
    setMonth(dateObject(iso).getUTCMonth());
    requestAnimationFrame(() =>
      calendar.current
        ?.querySelector<HTMLElement>(`[data-date="${iso}"]`)
        ?.focus(),
    );
  };
  const choose = (iso: string) => {
    const issue = travelDateError(iso);
    if (issue) {
      setError(issue);
      return;
    }
    setMessage("");
    setError("");
    if (draft.end || !draft.start || iso <= draft.start)
      setDraft({ start: iso, end: "" });
    else setDraft({ start: draft.start, end: iso });
    setActive(iso);
  };
  return (
    <PatternFrame
      kind="date-range-picker"
      title="여행 기간 선택"
      preview={preview}
    >
      {!preview && (
        <>
          <p className="pattern-help">
            2026년 11~12월 · 최소 1박 · 주말 선택 가능
          </p>
          <dl className="pattern-range-summary">
            <div>
              <dt>시작일</dt>
              <dd data-range="start">{shown.start || "선택 전"}</dd>
            </div>
            <div>
              <dt>마감일</dt>
              <dd data-range="end">{shown.end || "선택 전"}</dd>
            </div>
            <div>
              <dt>여행 기간</dt>
              <dd data-range="nights">{nights ? `${nights}박` : "선택 중"}</dd>
            </div>
          </dl>
        </>
      )}
      <div
        ref={calendar}
        className={
          preview ? "pattern-preview-calendar" : "pattern-inline-calendar"
        }
      >
        <div className="pattern-calendar-header">
          <button
            type="button"
            aria-label="이전 달"
            aria-disabled={month === 10}
            onClick={() => month > 10 && move("2026-11-16")}
          >
            이전 달
          </button>
          <h3 aria-live={preview ? undefined : "polite"}>
            2026년 {preview ? 11 : month + 1}월
          </h3>
          <button
            type="button"
            aria-label="다음 달"
            aria-disabled={month === 11}
            onClick={() => month < 11 && move("2026-12-16")}
          >
            다음 달
          </button>
        </div>
        {!preview && (
          <p className="pattern-range-prompt" role="status">
            {shown.end
              ? `${nights}박 선택 · 기간 적용으로 확정하세요.`
              : shown.start
                ? `시작 ${shown.start} · 마감일을 고르세요.`
                : "시작일을 먼저 선택하세요."}
          </p>
        )}
        <Calendar
          month={preview ? 10 : month}
          active={
            preview ? (time >= 2000 ? "2026-11-20" : "2026-11-16") : active
          }
          selected=""
          range={shown}
          rangeMode
          preview={preview}
          onMove={move}
          onChoose={choose}
        />
      </div>
      {!preview && (
        <>
          <p className="pattern-calendar-help">
            방향키 이동 · PageUp/Down 월 이동
          </p>
          <p
            id={`${uid}-error`}
            className="pattern-error"
            role={error ? "alert" : undefined}
          >
            {error}
          </p>
          <div className="pattern-actions">
            <button
              type="button"
              onClick={() => {
                setDraft(applied);
                setError("");
                setMessage(
                  applied.end
                    ? "마지막 적용 기간으로 돌아왔어요."
                    : "선택을 취소했어요.",
                );
              }}
            >
              선택 취소
            </button>
            <button
              type="button"
              className="demo-primary"
              aria-describedby={`${uid}-error`}
              onClick={() => {
                const issue = travelRangeError(draft.start, draft.end);
                if (issue) {
                  setError(
                    !draft.start
                      ? "달력에서 시작일과 마감일을 선택해 주세요."
                      : !draft.end
                        ? "달력에서 마감일을 선택해 주세요."
                        : issue,
                  );
                  calendar.current
                    ?.querySelector<HTMLElement>(`[data-date="${active}"]`)
                    ?.focus();
                  return;
                }
                setApplied(draft);
                setError("");
                setMessage(
                  `${draft.start} ~ ${draft.end} · ${nights}박 여행을 적용했어요.`,
                );
              }}
            >
              기간 적용
            </button>
          </div>
        </>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {preview
          ? shown.end
            ? "11월 16일~20일 · 4박"
            : "시작일과 마감일 선택"
          : message || "선택한 범위가 달력에 이어서 표시됩니다."}
      </p>
    </PatternFrame>
  );
}
export function DatePickerScene({ preview = false, time = 1700 }: SceneProps) {
  return <SingleDatePicker preview={preview} time={time} />;
}
export function uploadFileError(
  file: { name: string; size: number; type: string } | undefined,
) {
  if (!file) return "파일을 먼저 선택해 주세요.";
  if (!/\.(pdf|png|jpe?g)$/i.test(file.name))
    return "PDF·PNG·JPG 파일만 선택할 수 있어요.";
  if (file.size === 0 || file.size > 2 * 1024 * 1024)
    return "비어 있지 않은 2MB 이하 파일을 선택해 주세요.";
  const expectedType = /\.pdf$/i.test(file.name)
    ? "application/pdf"
    : /\.png$/i.test(file.name)
      ? "image/png"
      : "image/jpeg";
  if (file.type && file.type !== expectedType)
    return "파일 형식과 확장자가 일치하는지 확인해 주세요.";
  return "";
}
export function FileUploadScene({ preview = false, time = 1700 }: SceneProps) {
  const [file, setFile] = useState<File | null>(null),
    [phase, setPhase] = useState("idle"),
    [percent, setPercent] = useState(0),
    [error, setError] = useState(""),
    [fail, setFail] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId();
  useEffect(() => {
    if (preview || phase !== "uploading") return;
    const timer = setInterval(
      () => setPercent((p) => Math.min(100, p + 10)),
      160,
    );
    return () => clearInterval(timer);
  }, [phase, preview]);
  useEffect(() => {
    if (phase !== "uploading") return;
    if (fail && percent >= 70) {
      setPhase("error");
      setError("전송 실패 모의입니다. 파일은 유지했어요. 다시 시작해 주세요.");
    } else if (percent === 100) setPhase("done");
  }, [phase, percent, fail]);
  const choose = (selected: File | undefined) => {
    if (phase === "uploading") return;
    const issue = uploadFileError(selected);
    setFile(issue ? null : selected!);
    setError(issue);
    setPhase(issue ? "error" : "ready");
    setPercent(0);
    if (input.current) input.current.value = "";
  };
  const p = preview ? Math.min(100, Math.max(0, (time - 800) / 22)) : percent;
  const status = preview
    ? time < 800
      ? "idle"
      : time < 3000
        ? "uploading"
        : "done"
    : phase;
  return (
    <PatternFrame kind="file-upload" title="자료 파일 첨부" preview={preview}>
      <div
        className="pattern-upload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (phase === "uploading") return;
          if (e.dataTransfer.files.length !== 1) {
            setFile(null);
            setPhase("error");
            setPercent(0);
            setError("한 번에 파일 한 개만 선택해 주세요.");
            return;
          }
          choose(e.dataTransfer.files[0]);
        }}
      >
        <span aria-hidden="true">⇧</span>
        <label className="pattern-label" htmlFor={`${uid}-file`}>
          첨부 파일 선택
        </label>
        {!preview && (
          <input
            ref={input}
            id={`${uid}-file`}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            aria-invalid={!!error}
            disabled={phase === "uploading"}
            onChange={(e) => choose(e.target.files?.[0])}
            aria-describedby={`${uid}-hint ${uid}-error`}
          />
        )}
        <p id={`${uid}-hint`} className="pattern-help">
          PDF·PNG·JPG · 2MB 이하 · 로컬 전송 모의
        </p>
      </div>
      <p className="pattern-file-name">
        {preview
          ? time >= 800
            ? "디자인-가이드.pdf"
            : "선택한 파일 없음"
          : file
            ? `${file.name} · ${Math.ceil(file.size / 1024)}KB`
            : "선택한 파일 없음"}
      </p>
      {(status === "uploading" || status === "done") && (
        <progress aria-label="첨부 진행률" value={p} max={100} />
      )}
      <p
        id={`${uid}-error`}
        className="pattern-error"
        role={error ? "alert" : undefined}
      >
        {error}
      </p>
      {!preview && (
        <>
          <label className="pattern-check">
            <input
              type="checkbox"
              checked={fail}
              disabled={phase === "uploading"}
              onChange={(e) => setFail(e.target.checked)}
            />
            전송 실패 모의
          </label>
          <div className="pattern-actions">
            <button
              className="demo-primary"
              disabled={phase === "uploading"}
              onClick={() => {
                const issue = uploadFileError(file || undefined);
                if (issue) {
                  setError(issue);
                  input.current?.focus();
                  return;
                }
                setError("");
                setPercent(0);
                setPhase("uploading");
              }}
            >
              전송 시작
            </button>
            {phase === "uploading" ? (
              <button
                onClick={() => {
                  setPhase("cancelled");
                  setError("");
                }}
              >
                전송 취소
              </button>
            ) : (
              <button
                onClick={() => {
                  setFile(null);
                  setPhase("idle");
                  setPercent(0);
                  setError("");
                }}
              >
                파일 지우기
              </button>
            )}
          </div>
        </>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {status === "done"
          ? "전송 모의 완료 · 실제 파일은 전송하지 않아요."
          : status === "uploading"
            ? "파일을 처리하는 중…"
            : status === "cancelled"
              ? "전송을 취소했어요. 선택한 파일로 다시 시작할 수 있어요."
              : "파일을 선택한 후 전송을 시작하세요."}
      </p>
    </PatternFrame>
  );
}
const destinations = [
  ["home", "홈"],
  ["saved", "저장한 노트"],
  ["profile", "내 정보"],
];
export function DrawerScene({ preview = false, time = 1700 }: SceneProps) {
  const [view, setView] = useState("home");
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const shown = preview ? (time < 2000 ? "home" : "saved") : view;
  const links = (
    <>
      <h3 id={`${uid}-drawer`}>작업 공간 탐색</h3>
      <nav aria-label="작업 공간 메뉴">
        {destinations.map(([id, label]) => (
          <a
            key={id}
            href={`#drawer-${id}`}
            aria-current={shown === id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setView(id);
              dialog.current?.close();
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <button onClick={() => dialog.current?.close()}>탐색 메뉴 닫기</button>
    </>
  );
  return (
    <PatternFrame
      kind="navigation-drawer"
      title="디자인 작업 공간"
      preview={preview}
    >
      <div className="pattern-workspace">
        <button
          aria-haspopup="dialog"
          onClick={() => showPatternDialog(dialog.current, "a")}
        >
          탐색 메뉴 열기
        </button>
        <h3 ref={heading} tabIndex={-1}>
          {destinations.find((row) => row[0] === shown)?.[1]}
        </h3>
        <p className="pattern-help">
          {shown === "home"
            ? "팀의 최신 기록을 모았어요."
            : shown === "saved"
              ? "보관한 자료 3개를 확인하세요."
              : "프로필과 작업 환경을 관리해요."}
        </p>
      </div>
      {preview && time >= 700 && time < 2900 ? (
        <div className="pattern-mini-layer pattern-drawer-preview">
          <div>{links}</div>
        </div>
      ) : null}
      {!preview && (
        <dialog
          ref={dialog}
          className="pattern-dialog pattern-drawer"
          aria-labelledby={`${uid}-drawer`}
        >
          {links}
        </dialog>
      )}
    </PatternFrame>
  );
}
export function BottomNavScene({ preview = false, time = 1700 }: SceneProps) {
  const [view, setView] = useState("home"),
    [memo, setMemo] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const shown = preview
    ? time < 900
      ? "home"
      : time < 2200
        ? "saved"
        : time < 3300
          ? "profile"
          : "home"
    : view;
  const uid = useId();
  return (
    <PatternFrame
      kind="bottom-navigation"
      title="나의 노트 앱"
      preview={preview}
    >
      <div className="pattern-mobile-app">
        <div className="pattern-app-content">
          <h3 ref={heading} tabIndex={-1}>
            {destinations.find((row) => row[0] === shown)?.[1]}
          </h3>
          {shown === "home" ? (
            <>
              <label className="pattern-label" htmlFor={`${uid}-memo`}>
                이어 쓰는 메모
              </label>
              <input
                id={`${uid}-memo`}
                className="pattern-input"
                value={preview ? "아이디어 기록" : memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <InputMetrics
                value={preview ? "아이디어 기록" : memo}
                inputId={`${uid}-memo`}
              />
              <p className="pattern-help">
                다른 화면에 다녀와도 입력을 유지해요.
              </p>
            </>
          ) : (
            <p className="pattern-help">
              {shown === "saved"
                ? "저장한 노트 3개"
                : "내 작업 공간 · 로컬 예제"}
            </p>
          )}
        </div>
        <nav className="pattern-bottom-nav" aria-label="주요 화면">
          {destinations.map(([id, label], index) => (
            <a
              href={`#bottom-${id}`}
              key={id}
              aria-current={id === shown ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setView(id);
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              <span aria-hidden="true">{["⌂", "▤", "○"][index]}</span>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </PatternFrame>
  );
}
export function MenuButtonScene({ preview = false, time = 1700 }: SceneProps) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0),
    [pinned, setPinned] = useState(false),
    [copies, setCopies] = useState(0),
    [archived, setArchived] = useState(false),
    [message, setMessage] = useState("동작 메뉴에서 노트를 관리해 보세요.");
  const wrapper = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    after = useRef<HTMLButtonElement>(null),
    restore = useRef<HTMLButtonElement>(null),
    items = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const shown = preview ? time >= 700 && time < 2900 : open;
  useEffect(() => {
    if (!preview && open) items.current[active]?.focus();
  }, [open, active, preview]);
  useEffect(() => {
    if (preview) return;
    const outside = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [preview]);
  const close = (focus = true) => {
    setOpen(false);
    if (focus) trigger.current?.focus();
  };
  const act = (index: number) => {
    if (index === 0) {
      setCopies((v) => v + 1);
      setMessage("노트 사본을 만들었어요.");
    }
    if (index === 1) {
      setPinned((v) => !v);
      setMessage(
        pinned ? "상단 고정을 해제했어요." : "노트를 상단에 고정했어요.",
      );
    }
    if (index === 2) {
      setArchived(true);
      setMessage("노트를 보관했어요. 되돌릴 수 있어요.");
    }
    close(index !== 2);
    if (index === 2) requestAnimationFrame(() => restore.current?.focus());
  };
  return (
    <PatternFrame kind="menu-button" title="노트 동작 메뉴" preview={preview}>
      <div
        className="pattern-menu-anchor"
        ref={wrapper}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            setOpen(false);
        }}
      >
        <div className="pattern-note-heading">
          <strong>
            {archived ? "보관된 노트" : "팀 회의 기록"}
            {pinned ? " · 고정" : ""}
          </strong>
          <button
            ref={trigger}
            aria-haspopup="menu"
            aria-expanded={shown}
            aria-controls={`${uid}-menu`}
            disabled={archived}
            onClick={() => {
              setActive(0);
              setOpen(!open);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setActive(e.key === "ArrowUp" ? 2 : 0);
                setOpen(true);
              }
            }}
          >
            동작 메뉴
          </button>
        </div>
        <div
          role="menu"
          aria-label="노트 동작"
          id={`${uid}-menu`}
          hidden={!shown}
          className="pattern-action-menu"
        >
          {[
            "사본 만들기",
            pinned ? "고정 해제" : "상단에 고정",
            "보관하기",
          ].map((label, index) => (
            <button
              key={index}
              ref={(node) => {
                items.current[index] = node;
              }}
              role="menuitem"
              tabIndex={-1}
              className={
                preview && time >= 1600 && index === 1 ? "is-active" : ""
              }
              onClick={() => act(index)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((index + (e.key === "ArrowDown" ? 1 : 2)) % 3);
                } else if (e.key === "Home" || e.key === "End") {
                  e.preventDefault();
                  setActive(e.key === "Home" ? 0 : 2);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  close();
                } else if (e.key === "Tab") {
                  e.preventDefault();
                  close(false);
                  (e.shiftKey ? trigger.current : after.current)?.focus();
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="pattern-help">
        사본 {preview && time >= 2900 ? 1 : copies}개
      </p>
      {archived ? (
        <button
          ref={restore}
          onClick={() => {
            setArchived(false);
            setMessage("보관을 취소했어요.");
            requestAnimationFrame(() => trigger.current?.focus());
          }}
        >
          보관 취소
        </button>
      ) : null}
      <button
        ref={after}
        onClick={() => setMessage("팀 회의 기록을 열었어요.")}
      >
        노트 열기
      </button>
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {preview
          ? time >= 2900
            ? "상단 고정 완료"
            : "메뉴로 행동을 선택해요"
          : message}
      </p>
    </PatternFrame>
  );
}
export function StepperScene({ preview = false, time = 1700 }: SceneProps) {
  const [step, setStep] = useState(0),
    [name, setName] = useState(""),
    [scope, setScope] = useState(""),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    field = useRef<HTMLInputElement>(null),
    firstRadio = useRef<HTMLInputElement>(null);
  const uid = useId();
  const current = preview ? (time < 1000 ? 0 : time < 2200 ? 1 : 2) : step;
  const finished = preview ? time >= 3200 : done;
  const navigate = (next: number) => {
    setStep(next);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  };
  return (
    <PatternFrame kind="stepper" title="프로젝트 만들기" preview={preview}>
      <ol className="pattern-steps" aria-label="작성 단계">
        {["기본 정보", "공개 범위", "검토"].map((title, index) => (
          <li
            key={title}
            aria-current={!finished && current === index ? "step" : undefined}
            className={
              index < current || finished
                ? "is-complete"
                : index === current
                  ? "is-current"
                  : ""
            }
          >
            <span>{index < current || finished ? "✓" : index + 1}</span>
            {index < current && !finished && !preview ? (
              <button onClick={() => navigate(index)}>{title} 다시 편집</button>
            ) : (
              <strong>{title}</strong>
            )}
          </li>
        ))}
      </ol>
      {finished ? (
        <div className="pattern-complete">
          <strong>프로젝트를 만들었어요.</strong>
          <p>
            {preview ? "디자인 스터디" : name} ·{" "}
            {preview || scope === "private" ? "나만 보기" : "팀 공개"}
          </p>
          {!preview && (
            <button
              onClick={() => {
                setDone(false);
                setName("");
                setScope("");
                navigate(0);
              }}
            >
              새로 작성
            </button>
          )}
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (
              step === 0 &&
              (name.trim().length < 2 || name.trim().length > 30)
            ) {
              setError("프로젝트 이름을 2~30자로 입력해 주세요.");
              field.current?.focus();
              return;
            }
            if (step === 1 && !scope) {
              setError("공개 범위를 선택해 주세요.");
              firstRadio.current?.focus();
              return;
            }
            if (step === 2) {
              setDone(true);
              return;
            }
            navigate(step + 1);
          }}
        >
          <h3 ref={heading} tabIndex={-1}>
            {
              [
                "기본 정보를 입력하세요",
                "공개 범위를 선택하세요",
                "입력 내용을 확인하세요",
              ][current]
            }
          </h3>
          {current === 0 ? (
            <>
              <label className="pattern-label" htmlFor={`${uid}-name`}>
                프로젝트 이름
              </label>
              <input
                ref={field}
                id={`${uid}-name`}
                className="pattern-input"
                value={preview ? "디자인 스터디" : name}
                aria-invalid={!!error}
                aria-describedby={`${uid}-error`}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
              <InputMetrics
                value={preview ? "디자인 스터디" : name}
                inputId={`${uid}-name`}
              />
            </>
          ) : current === 1 ? (
            <fieldset aria-describedby={`${uid}-error`}>
              <legend>공개 범위</legend>
              {[
                ["private", "나만 보기"],
                ["team", "팀 공개"],
              ].map(([id, title], index) => (
                <label className="pattern-check" key={id}>
                  <input
                    ref={index === 0 ? firstRadio : undefined}
                    type="radio"
                    name={`${uid}-scope`}
                    value={id}
                    checked={preview ? id === "private" : scope === id}
                    onChange={() => {
                      setScope(id);
                      setError("");
                    }}
                  />
                  {title}
                </label>
              ))}
            </fieldset>
          ) : (
            <dl className="pattern-review">
              <dt>프로젝트 이름</dt>
              <dd>{preview ? "디자인 스터디" : name}</dd>
              <dt>공개 범위</dt>
              <dd>
                {preview || scope === "private" ? "나만 보기" : "팀 공개"}
              </dd>
            </dl>
          )}
          <p
            id={`${uid}-error`}
            className="pattern-error"
            role={error ? "alert" : undefined}
          >
            {error}
          </p>
          {!preview && (
            <div className="pattern-actions">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => navigate(step - 1)}
              >
                이전 단계
              </button>
              <button type="submit" className="demo-primary">
                {step === 2 ? "프로젝트 만들기" : "다음 단계"}
              </button>
            </div>
          )}
        </form>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {finished
          ? "작성 완료"
          : `${current + 1}/3단계 · 이전 단계로 돌아가도 입력을 유지해요.`}
      </p>
    </PatternFrame>
  );
}
export function CardScene({ preview = false, time = 1700 }: SceneProps) {
  const [saved, setSaved] = useState(false),
    [detail, setDetail] = useState(false);
  const link = useRef<HTMLAnchorElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const selected = preview ? time >= 1800 && time < 3300 : saved;
  return (
    <PatternFrame kind="card" title="추천 디자인 노트" preview={preview}>
      {detail ? (
        <section className="pattern-card-detail">
          <h3 ref={heading} tabIndex={-1}>
            접근성 점검 노트
          </h3>
          <p>
            키보드로 모든 행동에 접근하고 오류를 문장으로 설명하는지 확인하세요.
          </p>
          <button
            onClick={() => {
              setDetail(false);
              requestAnimationFrame(() => link.current?.focus());
            }}
          >
            카드로 돌아가기
          </button>
        </section>
      ) : (
        <article
          className={`pattern-content-card ${preview && time > 700 ? "is-hovered" : ""}`}
        >
          <div className="pattern-card-cover" aria-hidden="true">
            <i />
            <i />
            <span>UI NOTES</span>
          </div>
          <div className="pattern-content-body">
            <span className="pattern-help">디자인 · 5분 읽기</span>
            <h3>
              <a
                ref={link}
                href="#card-note"
                onClick={(e) => {
                  e.preventDefault();
                  setDetail(true);
                  requestAnimationFrame(() => heading.current?.focus());
                }}
              >
                접근성 점검 노트
              </a>
            </h3>
            <p>작은 개선으로 더 많은 사용자가 편하게 이용하게 만들어요.</p>
            <button
              className="pattern-save"
              aria-label="노트 저장"
              aria-pressed={selected}
              onClick={() => setSaved((v) => !v)}
            >
              {selected ? "저장됨" : "노트 저장"}
            </button>
          </div>
        </article>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {selected
          ? "저장한 노트 1개"
          : "카드를 열거나 노트를 따로 저장해 보세요."}
      </p>
    </PatternFrame>
  );
}
const listNotes = ["접근성 가이드", "컴포넌트 명세", "모션 노트"];
export function ListScene({ preview = false, time = 1700 }: SceneProps) {
  const [completed, setCompleted] = useState<string[]>([]),
    [hide, setHide] = useState(false),
    [opened, setOpened] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const filter = useRef<HTMLInputElement>(null);
  const done = preview
    ? time < 1100
      ? []
      : time < 2300
        ? [listNotes[0]]
        : listNotes
    : completed;
  const filtered = (preview ? time >= 3100 : hide)
    ? listNotes.filter((note) => !done.includes(note))
    : listNotes;
  return (
    <PatternFrame kind="list" title="검토할 문서" preview={preview}>
      {!preview && (
        <label className="pattern-check">
          <input
            ref={filter}
            type="checkbox"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
          />
          완료 항목 숨기기
        </label>
      )}
      {filtered.length ? (
        <ul className="pattern-document-list">
          {filtered.map((note, index) => (
            <li key={note}>
              <span className="pattern-doc-icon" aria-hidden="true">
                ▤
              </span>
              <div>
                <a
                  href={`#list-note-${listNotes.indexOf(note)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpened(note);
                    requestAnimationFrame(() => heading.current?.focus());
                  }}
                >
                  {note}
                </a>
                <small>{done.includes(note) ? "검토 완료" : "검토 대기"}</small>
              </div>
              <button
                aria-label={`${note} 완료 표시`}
                aria-pressed={done.includes(note)}
                onClick={() => {
                  setCompleted((current) =>
                    current.includes(note)
                      ? current.filter((v) => v !== note)
                      : [...current, note],
                  );
                  if (hide)
                    requestAnimationFrame(() => filter.current?.focus());
                }}
              >
                {done.includes(note) ? "완료" : "미완료"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pattern-empty">
          <strong>남은 검토 문서가 없어요.</strong>
          <p>완료 문서를 다시 보려면 숨기기를 해제하세요.</p>
          <button
            onClick={() => {
              setHide(false);
              requestAnimationFrame(() => filter.current?.focus());
            }}
          >
            전체 문서 보기
          </button>
        </div>
      )}
      {opened && (
        <section className="pattern-opened-note">
          <h3 ref={heading} tabIndex={-1}>
            {opened}
          </h3>
          <p>
            선택한 문서의 상세 내용입니다. 목록의 완료 표시는 별도로 변경하세요.
          </p>
        </section>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        전체 3개 · 완료 {done.length}개 · 표시 {filtered.length}개
      </p>
    </PatternFrame>
  );
}
export function AlertDialogScene({ preview = false, time = 1700 }: SceneProps) {
  const [deleted, setDeleted] = useState(false),
    [pending, setPending] = useState(false),
    [fail, setFail] = useState(false),
    [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    safe = useRef<HTMLButtonElement>(null),
    restore = useRef<HTMLButtonElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const uid = useId();
  useEffect(() => {
    if (preview || !pending) return;
    const timer = setTimeout(() => {
      setPending(false);
      if (fail) {
        setError(
          "삭제하지 못했어요. 문서는 유지됩니다. 다시 시도하거나 취소하세요.",
        );
        requestAnimationFrame(() => safe.current?.focus());
      } else {
        setDeleted(true);
        dialog.current?.close();
        requestAnimationFrame(() => restore.current?.focus());
      }
    }, 650);
    return () => clearTimeout(timer);
  }, [pending, fail, preview]);
  const contents = (
    <>
      <span className="pattern-warning-symbol" aria-hidden="true">
        !
      </span>
      <h3 id={`${uid}-title`}>문서를 삭제할까요?</h3>
      <p id={`${uid}-description`}>
        ‘회의 기록’ 한 개를 삭제합니다. 이 예제는 로컬 상태이며 아래에서 되돌릴
        수 있어요.
      </p>
      <p className="pattern-error" role={error ? "alert" : undefined}>
        {error}
      </p>
      <div className="pattern-actions">
        <button
          ref={safe}
          disabled={pending}
          onClick={() => dialog.current?.close()}
        >
          취소
        </button>
        <button
          className="pattern-danger"
          disabled={pending}
          onClick={() => setPending(true)}
        >
          {pending ? "삭제 중…" : "문서 삭제"}
        </button>
      </div>
    </>
  );
  return (
    <PatternFrame
      kind="alert-dialog"
      title="중요한 삭제 확인"
      preview={preview}
    >
      <div className="pattern-workspace">
        <strong>
          {(preview ? time >= 3000 : deleted) ? "삭제된 문서" : "회의 기록"}
        </strong>
        {!preview && (
          <>
            <label className="pattern-check">
              <input
                type="checkbox"
                checked={fail}
                onChange={(e) => setFail(e.target.checked)}
              />
              삭제 실패 모의
            </label>
            {deleted ? (
              <button
                ref={restore}
                onClick={() => {
                  setDeleted(false);
                  setError("");
                  requestAnimationFrame(() => trigger.current?.focus());
                }}
              >
                문서 복원
              </button>
            ) : (
              <button
                ref={trigger}
                className="pattern-danger"
                onClick={() => {
                  setError("");
                  showPatternDialog(dialog.current);
                }}
              >
                문서 삭제 요청
              </button>
            )}
          </>
        )}
      </div>
      {preview && time >= 700 && time < 3000 ? (
        <div className="pattern-mini-layer">
          <div>{contents}</div>
        </div>
      ) : null}
      {!preview && (
        <dialog
          ref={dialog}
          role="alertdialog"
          aria-modal="true"
          className="pattern-dialog"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-description`}
          onCancel={(e) => {
            if (pending) e.preventDefault();
          }}
        >
          {contents}
        </dialog>
      )}
      <p className="pattern-status" role={preview ? undefined : "status"}>
        {deleted
          ? "문서를 삭제했어요. 복원할 수 있어요."
          : "실행 전 결과와 취소 방법을 확인하세요."}
      </p>
    </PatternFrame>
  );
}
export function ProgressScene({ preview = false, time = 1700 }: SceneProps) {
  const [phase, setPhase] = useState("idle"),
    [value, setValue] = useState(0),
    [fail, setFail] = useState(false);
  const start = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (preview || phase !== "running") return;
    const timer = setInterval(
      () => setValue((p) => Math.min(100, p + 10)),
      220,
    );
    return () => clearInterval(timer);
  }, [phase, preview]);
  useEffect(() => {
    if (phase !== "running") return;
    if (fail && value >= 60) {
      setPhase("error");
    } else if (value === 100) setPhase("done");
  }, [value, phase, fail]);
  const percent = preview
    ? Math.min(100, Math.max(0, Math.floor((time - 600) / 24)))
    : value;
  const state = preview
    ? time < 600
      ? "idle"
      : time < 3000
        ? "running"
        : "done"
    : phase;
  return (
    <PatternFrame kind="progress-bar" title="보고서 생성" preview={preview}>
      <div className="pattern-progress-graphic" aria-hidden="true">
        ▤
      </div>
      <label className="pattern-label">보고서 생성 진행률</label>
      <progress aria-label="보고서 생성 진행률" value={percent} max={100} />
      <strong className="pattern-percent" aria-hidden="true">
        {percent}%
      </strong>
      {!preview && (
        <>
          <label className="pattern-check">
            <input
              type="checkbox"
              checked={fail}
              disabled={phase === "running"}
              onChange={(e) => setFail(e.target.checked)}
            />
            60%에서 실패 모의
          </label>
          <div className="pattern-actions">
            <button
              ref={start}
              className="demo-primary"
              disabled={phase === "running"}
              onClick={() => {
                setValue(0);
                setPhase("running");
              }}
            >
              보고서 생성 시작
            </button>
            {phase === "running" && (
              <button
                onClick={() => {
                  setPhase("cancelled");
                  requestAnimationFrame(() => start.current?.focus());
                }}
              >
                생성 취소
              </button>
            )}
          </div>
        </>
      )}
      <p
        className={`pattern-status ${state === "error" ? "pattern-error" : ""}`}
        role={preview ? undefined : state === "error" ? "alert" : "status"}
      >
        {state === "done"
          ? "보고서 생성 모의가 완료됐어요."
          : state === "running"
            ? "보고서를 생성하는 중이에요."
            : state === "error"
              ? "60%에서 실패했어요. 실패 모의를 해제한 뒤 다시 시작하세요."
              : state === "cancelled"
                ? "생성을 취소했어요. 다시 시작하면 0%부터 진행해요."
                : "시작하면 실제 진행값을 숫자와 막대로 보여줘요."}
      </p>
    </PatternFrame>
  );
}
export function SpinnerScene({ preview = false, time = 1700 }: SceneProps) {
  const [phase, setPhase] = useState("idle"),
    [result, setResult] = useState("success"),
    [slow, setSlow] = useState(false);
  const start = useRef<HTMLButtonElement>(null);
  const uid = useId();
  useEffect(() => {
    if (preview || phase !== "loading") return;
    const notice = setTimeout(() => setSlow(true), 1000),
      timer = setTimeout(() => {
        setPhase(
          result === "success"
            ? "done"
            : result === "empty"
              ? "empty"
              : "error",
        );
        setSlow(false);
      }, 2400);
    return () => {
      clearTimeout(notice);
      clearTimeout(timer);
    };
  }, [phase, result, preview]);
  const state = preview
    ? time < 600
      ? "idle"
      : time < 2800
        ? "loading"
        : "done"
    : phase;
  return (
    <PatternFrame
      kind="loading-spinner"
      title="최근 노트 불러오기"
      preview={preview}
    >
      <div className="pattern-spinner-area" aria-busy={state === "loading"}>
        {state === "loading" ? (
          <div
            className="pattern-spinner"
            aria-hidden="true"
            style={
              preview
                ? { animation: "none", transform: `rotate(${time * 0.4}deg)` }
                : undefined
            }
          />
        ) : (
          <div className="pattern-spinner-result" aria-hidden="true">
            {state === "done" ? "✓" : state === "error" ? "!" : "▤"}
          </div>
        )}
        {state === "done" && (
          <ul className="pattern-note-list">
            <li>오늘의 디자인 기록</li>
          </ul>
        )}
      </div>
      {!preview && (
        <>
          <fieldset disabled={phase === "loading"}>
            <legend>예시 조회 결과</legend>
            {[
              ["success", "정상 결과"],
              ["empty", "빈 결과"],
              ["error", "오류"],
            ].map(([id, label]) => (
              <label className="pattern-check" key={id}>
                <input
                  type="radio"
                  name={`${uid}-result`}
                  checked={result === id}
                  onChange={() => setResult(id)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <div className="pattern-actions">
            <button
              ref={start}
              className="demo-primary"
              disabled={phase === "loading"}
              onClick={() => {
                setSlow(false);
                setPhase("loading");
              }}
            >
              노트 불러오기
            </button>
            {phase === "loading" && (
              <button
                onClick={() => {
                  setPhase("cancelled");
                  setSlow(false);
                  requestAnimationFrame(() => start.current?.focus());
                }}
              >
                조회 취소
              </button>
            )}
            {phase === "empty" && (
              <button
                onClick={() => {
                  setPhase("done");
                  requestAnimationFrame(() => start.current?.focus());
                }}
              >
                첫 노트 만들기
              </button>
            )}
          </div>
        </>
      )}
      <p
        className={`pattern-status ${state === "error" ? "pattern-error" : ""}`}
        role={preview ? undefined : state === "error" ? "alert" : "status"}
      >
        {state === "loading"
          ? slow
            ? "예상보다 오래 걸려요. 기다리거나 조회를 취소할 수 있어요."
            : "노트를 불러오는 중…"
          : state === "done"
            ? "노트 1개를 불러왔어요."
            : state === "empty"
              ? "아직 노트가 없어요. 첫 노트를 만들어 보세요."
              : state === "error"
                ? "연결 실패 모의입니다. 결과 설정을 바꾸고 다시 불러오세요."
                : state === "cancelled"
                  ? "조회를 취소했어요. 필요할 때 다시 시작하세요."
                  : "조회 버튼을 누르면 처리 상태를 보여줘요."}
      </p>
    </PatternFrame>
  );
}
