import { DemoSelect } from "./select-controls";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
export type SceneProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
const notificationOptions = ["댓글 소식", "프로젝트 소식", "업데이트 소식"];
export function CheckboxScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [mode, setMode] = useState("notifications");
  const [confirmed, setConfirmed] = useState(false);
  const options =
    mode === "consent"
      ? [
          "이용약관 (필수)",
          "개인정보 수집·이용 (필수)",
          "혜택 소식 수신 (선택)",
        ]
      : notificationOptions;
  const [selected, setSelected] = useState<string[]>([]);
  const all = useRef<HTMLInputElement>(null);
  const shown = preview
    ? time < 700
      ? []
      : time < 1700
        ? [options[0]]
        : time < 2900
          ? options
          : options.slice(0, 2)
    : selected;
  useEffect(() => {
    if (all.current)
      all.current.indeterminate =
        shown.length > 0 && shown.length < options.length;
  }, [shown.length]);
  return (
    <div
      className={`scene essential-scene scene-checkbox ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">
          {mode === "consent" ? "AGREEMENT" : "NOTIFICATIONS"}
        </span>
        <h2>{mode === "consent" ? "서비스 이용 동의" : "받고 싶은 소식"}</h2>
        <p>
          {mode === "consent"
            ? "필수 2개에 동의하면 계속할 수 있어요. 선택 동의는 거절해도 됩니다."
            : "필요한 항목을 여러 개 선택하세요."}
        </p>
        {!preview && (
          <label className="input-demo-label">
            예제 유형
            <DemoSelect
              className="foundation-input"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setSelected([]);
                setConfirmed(false);
              }}
            >
              <option value="notifications">소식 복수 선택</option>
              <option value="consent">필수·선택 동의</option>
            </DemoSelect>
          </label>
        )}
        <fieldset className="choice-group">
          <legend className="demo-sr-only">
            {mode === "consent" ? "서비스 이용 동의 항목" : "받을 소식 선택"}
          </legend>
          <label className="choice-row choice-all">
            <input
              ref={all}
              type="checkbox"
              checked={shown.length === options.length}
              onChange={(e) => {
                setSelected(e.target.checked ? [...options] : []);
                setConfirmed(false);
              }}
            />
            <span>
              {mode === "consent" ? "전체 동의" : "모두 선택"}
              <small>
                {mode === "consent"
                  ? "선택 동의까지 3개 모두 포함해요"
                  : "세 가지 소식을 함께 선택해요"}
              </small>
            </span>
          </label>
          {options.map((name) => (
            <label key={name} className="choice-row">
              <input
                type="checkbox"
                checked={shown.includes(name)}
                onChange={(e) => {
                  setConfirmed(false);
                  setSelected((values) =>
                    e.target.checked
                      ? [...values, name]
                      : values.filter((v) => v !== name),
                  );
                }}
              />
              <span>{name}</span>
            </label>
          ))}
        </fieldset>
        <div className="essential-result" role={preview ? undefined : "status"}>
          {mode === "consent"
            ? confirmed
              ? "필수 동의를 확인했어요. 실제 가입은 진행하지 않습니다."
              : options.slice(0, 2).every((x) => shown.includes(x))
                ? "필수 2개 충족 · 선택 동의 없이도 계속할 수 있어요."
                : "필수 약관 2개에 동의해 주세요."
            : shown.length === 0
              ? "선택한 소식이 없어요."
              : `${shown.length}개 소식을 선택했어요.`}
        </div>
        {mode === "consent" && (
          <button
            type="button"
            className="demo-primary"
            disabled={!options.slice(0, 2).every((x) => shown.includes(x))}
            onClick={() => setConfirmed(true)}
          >
            동의하고 계속
          </button>
        )}
      </div>
    </div>
  );
}
const shippingOptions = [
  ["standard", "일반 배송", "2~3일 내 도착 · 무료"],
  ["express", "빠른 배송", "다음 날 도착 · 3,000원"],
];
export function RadioScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const uid = useId();
  const value = preview
    ? time < 700
      ? ""
      : time < 2100
        ? "standard"
        : "express"
    : selected;
  const submit = () => {
    setError(!selected);
    setMessage(
      selected
        ? `${shippingOptions.find((row) => row[0] === selected)?.[1]}을 선택했어요.`
        : "배송 방법을 하나 선택해 주세요.",
    );
  };
  return (
    <div
      className={`scene essential-scene scene-radio ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">DELIVERY</span>
        <h2>배송 방법 선택</h2>
        <p>두 방법 중 한 가지만 선택하세요.</p>
        <fieldset className="choice-group" aria-describedby={`${uid}-message`}>
          <legend className="demo-sr-only">배송 방법</legend>
          {shippingOptions.map(([id, title, description]) => (
            <label
              key={id}
              className={`choice-row ${value === id ? "choice-selected" : ""}`}
            >
              <input
                type="radio"
                name={`${uid}-delivery`}
                value={id}
                checked={value === id}
                required
                onChange={() => {
                  setSelected(id);
                  setError(false);
                  setMessage("");
                }}
              />
              <span>
                {title}
                <small>{description}</small>
              </span>
            </label>
          ))}
        </fieldset>
        {!preview && (
          <div className="essential-actions">
            <button
              onClick={() => {
                setSelected("");
                setError(false);
                setMessage("선택을 초기화했어요.");
              }}
            >
              선택 초기화
            </button>
            <button className="demo-primary" onClick={submit}>
              선택 확인
            </button>
          </div>
        )}
        <p
          id={`${uid}-message`}
          role={preview ? undefined : error ? "alert" : "status"}
          className={error ? "essential-error" : "essential-caption"}
        >
          {preview
            ? value
              ? `${value === "standard" ? "일반" : "빠른"} 배송만 선택됨`
              : "배송 방법을 선택하세요."
            : message || "방향키 또는 Space로 선택할 수 있어요."}
        </p>
      </div>
    </div>
  );
}
export function SwitchScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [on, setOn] = useState(false);
  const [pending, setPending] = useState(false);
  const [fail, setFail] = useState(false);
  const [message, setMessage] = useState("알림이 꺼져 있어요.");
  const previous = useRef(false);
  const uid = useId();
  useEffect(() => {
    if (preview || !pending) return;
    const timer = setTimeout(() => {
      if (fail) {
        setOn(previous.current);
        setMessage(
          "저장하지 못했어요. 이전 설정으로 되돌렸습니다. 다시 켜거나 꺼보세요.",
        );
      } else setMessage(on ? "이메일 알림을 켰어요." : "이메일 알림을 껐어요.");
      setPending(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [preview, pending, fail, on]);
  const enabled = preview ? time >= 1000 : on;
  const waiting = preview ? time >= 1000 && time < 2000 : pending;
  return (
    <div
      className={`scene essential-scene scene-switch ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">PREFERENCES</span>
        <h2>이메일 알림 설정</h2>
        <p>설정은 전환한 뒤 모의 저장됩니다.</p>
        <div className="switch-row">
          <div>
            <label htmlFor={`${uid}-switch`}>이메일 알림</label>
            <span>새 댓글과 프로젝트 소식을 받아요.</span>
          </div>
          <input
            id={`${uid}-switch`}
            className="essential-switch"
            type="checkbox"
            role="switch"
            checked={enabled}
            disabled={waiting}
            onChange={(e) => {
              previous.current = on;
              setOn(e.target.checked);
              setPending(true);
              setMessage("설정을 저장하는 중이에요.");
            }}
            aria-describedby={`${uid}-status`}
          />
        </div>
        <div className="essential-result">
          <span className={`essential-state-dot ${enabled ? "on" : ""}`} />
          {waiting ? "저장 중…" : enabled ? "켜짐" : "꺼짐"}
        </div>
        {!preview && (
          <label className="essential-check">
            <input
              type="checkbox"
              checked={fail}
              disabled={pending}
              onChange={(e) => setFail(e.target.checked)}
            />
            저장 실패 모의
          </label>
        )}
        <p
          id={`${uid}-status`}
          className={
            message.startsWith("저장하지")
              ? "essential-error"
              : "essential-caption"
          }
          role={preview ? undefined : "status"}
        >
          {preview
            ? waiting
              ? "변경 내용을 반영하고 있어요."
              : enabled
                ? "설정이 적용됐어요."
                : "필요할 때 알림을 켜세요."
            : message}
        </p>
      </div>
    </div>
  );
}
const digestOptions = [
  ["weekly", "매주"],
  ["monthly", "매월"],
  ["quarterly", "분기별"],
];
export function SelectScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [value, setValue] = useState("");
  const [applied, setApplied] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({ above: false, maxHeight: 168 });
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const uid = useId();
  const shownValue = preview ? (time < 1800 ? "" : "weekly") : value;
  const showList = preview ? time >= 800 && time < 2300 : open;
  const highlighted = preview ? (time >= 1500 ? 0 : -1) : active;
  const label = (id: string) => digestOptions.find((row) => row[0] === id)?.[1];
  const expand = () => {
    setActive(
      Math.max(
        0,
        digestOptions.findIndex((row) => row[0] === value),
      ),
    );
    setOpen(true);
  };
  const choose = (index: number, focus = true) => {
    setValue(digestOptions[index][0]);
    setError(false);
    setOpen(false);
    typeahead.current.text = "";
    if (focus) trigger.current?.focus();
  };
  useEffect(() => {
    if (preview) return;
    const outside = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [preview]);
  useEffect(() => {
    if (preview || !open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = innerHeight - rect.bottom - 12,
        above = rect.top - 12;
      const flip = below < 126 && above > below;
      setPlacement({
        above: flip,
        maxHeight: Math.max(44, Math.min(168, flip ? above : below)),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, preview]);
  useEffect(() => {
    if (!preview && open)
      document
        .getElementById(`${uid}-option-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, preview, uid]);
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229 ||
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
        setOpen(false);
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
        digestOptions.findIndex((row) => row[0] === value),
      );
      setActive(
        event.key === "Home" || event.key === "PageUp"
          ? 0
          : event.key === "End" || event.key === "PageDown"
            ? digestOptions.length - 1
            : !open
              ? current
              : Math.max(
                  0,
                  Math.min(
                    digestOptions.length - 1,
                    active + (event.key === "ArrowDown" ? 1 : -1),
                  ),
                ),
      );
      setOpen(true);
      return;
    }
    if (event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      const now = Date.now(),
        previous = typeahead.current;
      const query =
        now - previous.time < 800 ? previous.text + event.key : event.key;
      typeahead.current = { text: query, time: now };
      const prefix = [...query].every((char) => char === query[0])
        ? query[0]
        : query;
      for (let step = 1; step <= digestOptions.length; step++) {
        const index = (active + step) % digestOptions.length;
        if (digestOptions[index][1].startsWith(prefix)) {
          setActive(index);
          setOpen(true);
          break;
        }
      }
    }
  };
  return (
    <div
      className={`scene essential-scene scene-select ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">DIGEST</span>
        <h2>요약 주기 설정</h2>
        <p>정해진 목록에서 한 값을 선택해요.</p>
        <span className="essential-label" id={`${uid}-label`}>
          요약 주기
        </span>
        <div
          className="select-illustration"
          ref={wrapper}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setOpen(false);
          }}
        >
          <div
            ref={trigger}
            id={`${uid}-select`}
            className={`select-preview-value select-trigger ${showList ? "is-open" : ""}`}
            role={preview ? undefined : "combobox"}
            tabIndex={preview ? -1 : 0}
            aria-labelledby={preview ? undefined : `${uid}-label`}
            aria-haspopup={preview ? undefined : "listbox"}
            aria-expanded={preview ? undefined : open}
            aria-controls={preview ? undefined : `${uid}-list`}
            aria-activedescendant={
              !preview && open ? `${uid}-option-${active}` : undefined
            }
            aria-required={preview ? undefined : true}
            aria-invalid={preview ? undefined : error}
            aria-describedby={preview ? undefined : `${uid}-feedback`}
            onKeyDown={key}
            onClick={() => {
              if (open) setOpen(false);
              else expand();
            }}
          >
            {label(shownValue) || "주기를 선택하세요"}
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
            aria-labelledby={preview ? undefined : `${uid}-label`}
            hidden={!showList}
            className={`select-preview-options select-popup ${!preview && placement.above ? "opens-up" : ""}`}
            style={preview ? undefined : { maxHeight: placement.maxHeight }}
          >
            {digestOptions.map(([id, title], index) => (
              <div
                key={id}
                id={`${uid}-option-${index}`}
                role={preview ? undefined : "option"}
                aria-selected={preview ? undefined : highlighted === index}
                className={highlighted === index ? "active" : ""}
                onPointerMove={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                {title}
                <span aria-hidden="true">{shownValue === id ? "✓" : ""}</span>
              </div>
            ))}
          </div>
          {!preview && <input type="hidden" name="digest" value={value} />}
        </div>
        {!preview && (
          <div className="essential-actions">
            <button
              onClick={() => {
                setValue("");
                setApplied("");
                setError(false);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              초기화
            </button>
            <button
              className="demo-primary"
              onClick={() => {
                setOpen(false);
                if (!value) {
                  setError(true);
                  trigger.current?.focus();
                  return;
                }
                setApplied(value);
              }}
            >
              설정 적용
            </button>
          </div>
        )}
        <p
          id={`${uid}-feedback`}
          role={preview ? undefined : error ? "alert" : "status"}
          className={error ? "essential-error" : "essential-caption"}
        >
          {preview
            ? time > 2600
              ? "매주 요약을 받아요."
              : "목록을 열어 주기를 선택하세요."
            : error
              ? "요약 주기를 선택한 뒤 적용해 주세요."
              : applied
                ? value !== applied
                  ? `현재 적용: ${label(applied)}. 새 선택은 설정 적용을 눌러 반영하세요.`
                  : `${label(applied)} 요약으로 적용했어요.`
                : "선택 후 설정 적용을 눌러주세요."}
        </p>
      </div>
    </div>
  );
}

const tabContent = [
  {
    title: "함께 만드는 디자인 노트",
    body: "이번 주 프로젝트의 목표와 일정을 한눈에 확인해요.",
    items: ["UI 패턴 정리", "금요일까지 첫 시안 공유"],
  },
  {
    title: "최근 활동",
    body: "팀이 남긴 변경 기록을 시간순으로 살펴봐요.",
    items: ["지수 · 새 메모 추가", "민준 · 시안 검토 완료"],
  },
  {
    title: "함께하는 멤버",
    body: "프로젝트에 참여 중인 팀원을 확인해요.",
    items: ["지수 · 디자이너", "민준 · 프론트엔드"],
  },
];
export function TabsScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = preview
    ? time < 1000
      ? 0
      : time < 2200
        ? 1
        : time < 3400
          ? 2
          : 0
    : active;
  const key = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % 3;
    else if (e.key === "ArrowLeft") next = (index + 2) % 3;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 2;
    else return;
    e.preventDefault();
    refs.current[next]?.focus();
    if (!manual) setActive(next);
  };
  return (
    <div
      className={`scene essential-scene scene-tabs ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">PROJECT SPACE</span>
        <h2>우리 팀 프로젝트</h2>
        {!preview && (
          <label className="essential-check">
            <input
              type="checkbox"
              checked={manual}
              onChange={(e) => setManual(e.target.checked)}
            />
            수동 활성화 (Enter로 전환)
          </label>
        )}
        <div
          className="essential-tablist"
          role="tablist"
          aria-label="프로젝트 정보"
        >
          {["개요", "활동", "멤버"].map((label, i) => (
            <button
              type="button"
              ref={(el) => {
                refs.current[i] = el;
              }}
              key={label}
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-controls={`${uid}-panel-${i}`}
              aria-selected={selected === i}
              tabIndex={selected === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => key(e, i)}
            >
              {label}
            </button>
          ))}
          <span
            className="essential-tab-indicator"
            style={{ transform: `translateX(${selected * 100}%)` }}
          />
        </div>
        {tabContent.map((panel, i) => (
          <div
            key={panel.title}
            role="tabpanel"
            tabIndex={0}
            hidden={selected !== i}
            id={`${uid}-panel-${i}`}
            aria-labelledby={`${uid}-tab-${i}`}
            className="essential-tabpanel"
          >
            <span className="essential-panel-icon">{["▤", "◷", "◉"][i]}</span>
            <strong>{panel.title}</strong>
            <p>{panel.body}</p>
            <ul>
              {panel.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        {!preview && (
          <p className="essential-caption">
            좌우 방향키로 탐색 ·{" "}
            {manual ? "Enter/Space로 활성화" : "포커스와 함께 패널 전환"}
          </p>
        )}
      </div>
    </div>
  );
}
export function TooltipScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [help, setHelp] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const uid = useId();
  const isSaved = preview ? time >= 2800 : saved;
  const open = preview
    ? time >= 700 && time < 2600
    : (hover || focus) && !dismissed;
  return (
    <div
      className={`scene essential-scene scene-tooltip ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card tooltip-demo-card">
        <span className="essential-eyebrow">QUICK HELP</span>
        <h2>나중에 다시 볼 노트</h2>
        <p>
          보관 버튼에 마우스를 올리거나
          <br />
          키보드로 포커스를 옮겨보세요.
        </p>
        <div
          className="tooltip-anchor"
          onMouseEnter={() => {
            setHover(true);
            setDismissed(false);
          }}
          onMouseLeave={() => setHover(false)}
        >
          <button
            type="button"
            className={`tooltip-trigger ${isSaved ? "is-saved" : ""}`}
            aria-pressed={isSaved}
            aria-describedby={`${uid}-tip`}
            onFocus={() => {
              setFocus(true);
              setDismissed(false);
            }}
            onBlur={() => setFocus(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && open) {
                e.preventDefault();
                e.stopPropagation();
                setDismissed(true);
              }
            }}
            onClick={() => {
              setSaved(!saved);
              setMessage(
                saved
                  ? "보관을 취소했어요."
                  : "노트를 보관했어요. 다시 누르면 취소할 수 있어요.",
              );
            }}
          >
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
              <path d="M4 8h16v13H4zM3 3h18v5H3zM9 12h6" />
            </svg>
            <span>보관하기</span>
          </button>
          <span
            id={`${uid}-tip`}
            role="tooltip"
            className="essential-tooltip"
            hidden={!open}
          >
            {isSaved
              ? "다시 누르면 보관을 취소해요."
              : "노트를 목록에서 보관함으로 옮겨요."}
          </span>
        </div>
        {!preview && (
          <>
            <button
              className="essential-help-button"
              aria-expanded={help}
              aria-controls={`${uid}-help`}
              onClick={() => setHelp((v) => !v)}
            >
              도움말 {help ? "접기" : "보기"}
            </button>
            <p
              id={`${uid}-help`}
              className="essential-inline-help"
              hidden={!help}
            >
              보관한 노트는 삭제되지 않아요. 같은 버튼을 다시 누르면 보관을
              취소할 수 있어요.
            </p>
            <p className="essential-caption" role="status">
              {message
                ? message
                : open
                  ? "Esc로 설명을 닫을 수 있어요."
                  : "터치에서는 도움말 보기를 이용하세요."}
            </p>
          </>
        )}
        {preview && time >= 2800 && (
          <p className="essential-caption">노트를 보관했어요.</p>
        )}
      </div>
    </div>
  );
}
export function PopoverScene({
  preview = false,
  time = 1700,
  reduced = false,
}: SceneProps) {
  const [open, setOpen] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [appliedDensity, setAppliedDensity] = useState("comfortable");
  const [saved, setSaved] = useState("기본 보기");
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const uid = useId();
  const shown = preview ? time >= 650 && time < 2900 : open;
  useEffect(() => {
    if (preview || !open) return;
    const place = () => {
      const button = trigger.current,
        layer = popover.current;
      if (!button || !layer) return;
      const a = button.getBoundingClientRect(),
        b = layer.getBoundingClientRect();
      const left = Math.max(
        12,
        Math.min(a.right - b.width, innerWidth - b.width - 12),
      );
      const below = a.bottom + 8;
      const top =
        below + b.height <= innerHeight - 12
          ? below
          : Math.max(12, a.top - b.height - 8);
      layer.style.left = `${left}px`;
      layer.style.top = `${top}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [preview, open]);
  const close = () => {
    popover.current?.hidePopover();
    trigger.current?.focus();
  };
  const content = (
    <>
      <h2 id={`${uid}-title`}>보기 설정</h2>
      <p>목록의 간격을 선택하세요.</p>
      <fieldset className="choice-group">
        <legend className="demo-sr-only">표시 밀도</legend>
        {[
          ["comfortable", "여유롭게"],
          ["compact", "촘촘하게"],
        ].map(([id, label], i) => (
          <label className="choice-row" key={id}>
            <input
              type="radio"
              name={`${uid}-density`}
              value={id}
              checked={
                preview ? (time > 1600 ? i === 1 : i === 0) : density === id
              }
              onChange={() => setDensity(id)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="essential-actions">
        <button onClick={close}>닫기</button>
        <button
          className="demo-primary"
          onClick={() => {
            setAppliedDensity(density);
            setSaved(density === "compact" ? "촘촘한 보기" : "여유로운 보기");
            close();
          }}
        >
          적용
        </button>
      </div>
    </>
  );
  return (
    <div
      className={`scene essential-scene scene-popover ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <div className="popover-toolbar">
          <div>
            <span className="essential-eyebrow">MY NOTES</span>
            <strong>프로젝트 노트</strong>
          </div>
          <button
            ref={trigger}
            popoverTarget={`${uid}-popover`}
            aria-expanded={shown}
            aria-controls={`${uid}-popover`}
          >
            보기 설정
          </button>
        </div>
        <div
          className={`popover-list ${(preview ? time >= 2900 : appliedDensity === "compact") ? "compact" : ""}`}
        >
          {["리서치 메모", "이번 주 할 일", "아이디어 모음"].map((item) => (
            <div key={item}>
              <span>▤</span>
              {item}
            </div>
          ))}
        </div>
        {preview ? (
          shown && <div className="popover-preview-panel">{content}</div>
        ) : (
          <div
            ref={popover}
            id={`${uid}-popover`}
            popover="auto"
            role="dialog"
            aria-labelledby={`${uid}-title`}
            className="essential-popover"
            onBeforeToggle={(e) => {
              if (!e.currentTarget.matches(":popover-open"))
                setDensity(appliedDensity);
            }}
            onToggle={(e) => setOpen(e.currentTarget.matches(":popover-open"))}
          >
            {content}
          </div>
        )}
        <p className="essential-caption" role={preview ? undefined : "status"}>
          {preview
            ? time > 3000
              ? "촘촘한 보기로 적용했어요."
              : "버튼 가까이에서 설정을 바꿔요."
            : `${saved} · 배경을 누르거나 Esc로 닫아보세요.`}
        </p>
      </div>
    </div>
  );
}
export function ToastScene({
  preview = false,
  time = 1700,
  reduced = false,
  paused = false,
}: SceneProps) {
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(false);
  const clock = useRef({ id: 0, remaining: 5000 });
  const trigger = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const shown = preview ? time >= 650 && time < 2900 : visible;
  const message = preview ? "디자인 노트를 저장했어요." : history[0] || "";
  useEffect(() => {
    if (preview || !visible || hover || focus || paused) return;
    const current = clock.current;
    const started = performance.now();
    const timer = setTimeout(() => setVisible(false), current.remaining);
    return () => {
      clearTimeout(timer);
      current.remaining = Math.max(
        0,
        current.remaining - (performance.now() - started),
      );
    };
  }, [preview, visible, hover, focus, paused, run]);
  const notify = () => {
    if (error) trigger.current?.focus();
    const id = clock.current.id + 1;
    clock.current = { id, remaining: 5000 };
    setRun(id);
    setHistory((values) =>
      [`노트 ${id} 저장을 완료했어요.`, ...values].slice(0, 5),
    );
    setError(false);
    setVisible(true);
  };
  return (
    <div
      className={`scene essential-scene scene-toast ${preview ? "is-preview" : ""} ${reduced ? "is-reduced" : ""}`}
    >
      <div className="essential-card">
        <span className="essential-eyebrow">SAVE & FEEDBACK</span>
        <h2>디자인 노트</h2>
        <div className="toast-note-preview">
          <i />
          <i />
          <i />
          <span>새로운 아이디어를 기록했어요.</span>
        </div>
        <div className="essential-actions">
          <button ref={trigger} className="demo-primary" onClick={notify}>
            저장 완료 알림
          </button>
          {!preview && (
            <button
              onClick={() => {
                setError(true);
                setVisible(false);
              }}
            >
              저장 실패 보기
            </button>
          )}
        </div>
        {!preview && (
          <>
            <p className="essential-caption">
              알림은 5초 뒤 사라져요. 마우스·포커스가 알림 안에 있으면 시간을
              멈춥니다.
            </p>
            {error && (
              <div className="essential-inline-error" role="alert">
                <strong>노트를 저장하지 못했어요.</strong>
                <p>작성한 내용은 남아 있어요. 다시 저장해 주세요.</p>
                <button onClick={notify}>다시 저장</button>
              </div>
            )}
            <button
              className="essential-help-button"
              aria-expanded={showHistory}
              aria-controls={`${uid}-history`}
              onClick={() => setShowHistory((v) => !v)}
            >
              최근 알림 {showHistory ? "접기" : "보기"}
            </button>
            <ul
              id={`${uid}-history`}
              className="essential-history"
              hidden={!showHistory}
            >
              {history.length ? (
                history.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>아직 알림이 없어요.</li>
              )}
            </ul>
          </>
        )}
      </div>
      <div
        className="essential-toast-slot"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            setFocus(false);
        }}
      >
        <div
          className="demo-sr-only"
          role={preview ? undefined : "status"}
          aria-live="polite"
          aria-atomic="true"
        >
          {shown ? message : ""}
        </div>
        {shown && (
          <div className="essential-toast">
            <span className="toast-check">✓</span>
            <div aria-hidden="true">{message}</div>
            <button
              aria-label="알림 닫기"
              onClick={() => {
                setVisible(false);
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
        )}
      </div>
    </div>
  );
}
