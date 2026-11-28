"use client";
import { DemoSelect } from "@/demos/select-controls";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Layers2,
  Monitor,
  MousePointer2,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  Repeat2,
  X,
} from "lucide-react";
import { guides, type DemoId } from "@/lib/catalog";
import { GuideContent, RoleContent } from "./GuideContent";
import { roleNames, type RoleName } from "@/lib/guide-content";
import type { Content as Term } from "@/lib/content";
import { scoreTerm } from "@/lib/search.mjs";
import { advanceLoop, createPlayback } from "@/lib/playback.mjs";
import { sceneMap } from "@/demos/scenes";
import sources from "@/generated/sources.json";
import SimulationExperience from "./SimulationExperience";

const playback = createPlayback(guides);
const serverSnapshots = Object.fromEntries(
  Object.entries(guides).map(([id, g]) => [
    id,
    { time: g.poster, status: "ready", started: false },
  ]),
);

function Logo() {
  return (
    <span className="wordmark">
      <span className="logo-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      UI Notes<span className="wordmark-ko">UI 용어 사전</span>
    </span>
  );
}
function Preview({
  term,
  onOpen,
}: {
  term: Term;
  onOpen: (trigger: HTMLAnchorElement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const g = guides[term.demoId];
  playback.register(term.id, g);
  const snapshot = useSyncExternalStore(
    (fn) => playback.subscribe(term.id, fn),
    () => playback.getSnapshot(term.id),
    () => serverSnapshots[term.demoId],
  );
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        playback.setVisible(
          term.id,
          entry.isIntersecting && entry.intersectionRatio > 0,
        ),
      { threshold: [0, 0.01] },
    );
    observer.observe(node);
    const resize = new ResizeObserver(([entry]) =>
      node.style.setProperty(
        "--preview-scale",
        String(entry.contentRect.width / 320),
      ),
    );
    resize.observe(node);
    return () => {
      observer.disconnect();
      resize.disconnect();
      playback.setVisible(term.id, false);
    };
  }, [term.id]);
  const Scene = sceneMap[term.demoId];
  return (
    <article className="term-card">
      <div className={`card-visual visual-${term.demoId}`} ref={ref}>
        <div className="mini-stage" aria-hidden="true" inert>
          <Scene preview time={snapshot.time} />
        </div>
      </div>
      <div className="card-body">
        <span className="card-category">{term.category}</span>
        <h3 className="card-title">
          <span>{term.english}</span>
        </h3>
        <div className="card-korean">
          {term.pronunciation}
          <span>·</span>
          {term.korean}
        </div>
        <p className="card-summary">{term.summary}</p>
        <div className="alias-tags">
          {[...new Set([...term.aliases, ...term.tags])]
            .slice(0, 2)
            .map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
        </div>
        <div className="card-footer">
          <span>
            {term.devices.platforms.includes("PC") && <Monitor size={12} />}{" "}
            {term.devices.platforms.includes("모바일") && (
              <Smartphone size={11} />
            )}{" "}
            {term.devices.platforms.join(" · ")}
          </span>
        </div>
      </div>
      <a
        className="card-link"
        href={`?term=${encodeURIComponent(term.id)}`}
        aria-label={`${term.english} 상세 보기`}
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          event.preventDefault();
          onOpen(event.currentTarget);
        }}
      />
    </article>
  );
}
function Observation({ id }: { id: DemoId }) {
  const guide = guides[id];
  const [time, setTime] = useState(0);
  useEffect(() => {
    let frame = 0,
      last: number | undefined,
      elapsed = 0;
    const tick = (now: number) => {
      if (document.hidden) {
        last = undefined;
      } else {
        if (last !== undefined) {
          elapsed = advanceLoop(elapsed, now - last, guide.duration);
          setTime(elapsed);
        }
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [guide.duration]);
  const Scene = sceneMap[id];
  return (
    <>
      <div className="observed-stage" aria-hidden="true" inert>
        <Scene preview time={time} />
      </div>
      <div className="observation-caption">
        <span>
          {guide.steps[Math.min(3, Math.floor((time / guide.duration) * 4))]}
        </span>
        <span>
          <Repeat2 size={13} />
          자동 반복 재생
        </span>
      </div>
    </>
  );
}

function Detail({
  term,
  onClose,
  terms,
  onRelated,
}: {
  term: Term;
  onClose: () => void;
  terms: Term[];
  onRelated: (term: Term) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState("guide");
  const [mode, setMode] = useState("live");
  const [format, setFormat] = useState<"react" | "html">("react");
  const [mobile, setMobile] = useState(false);
  const [reset, setReset] = useState(0);
  const [copyState, setCopyState] = useState("");
  const [role, setRole] = useState<RoleName>("기획");
  const [codeScope, setCodeScope] = useState<"parts" | "full">("parts");
  const [partIndex, setPartIndex] = useState(0);
  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  useEffect(() => {
    const body = dialog.current?.querySelector<HTMLElement>(".detail-body");
    if (!body) return;
    const resize = new ResizeObserver(() =>
      dialog.current?.style.setProperty(
        "--detail-available-height",
        `${body.clientHeight}px`,
      ),
    );
    resize.observe(body);
    return () => resize.disconnect();
  }, []);
  const parts = sources[term.demoId].parts[format];
  const part = parts[Math.min(partIndex, parts.length - 1)];
  const code = codeScope === "full" ? sources[term.demoId][format] : part.code;
  const filename =
    codeScope === "full"
      ? format === "html"
        ? `${term.demoId}.html`
        : "App.tsx"
      : part.filename;
  const copy = async () => {
    const previous = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = code;
    area.setAttribute("aria-label", "복사할 예제 코드");
    area.style.cssText =
      "position:fixed;opacity:0;width:1px;height:1px;left:0;top:0";
    dialog.current?.appendChild(area);
    try {
      area.focus();
      area.select();
      const copied = document.execCommand("copy");
      if (!copied) await navigator.clipboard.writeText(code);
      setCopyState("복사했어요");
    } catch {
      setCopyState("복사 권한을 확인하거나 코드를 직접 선택해 주세요.");
    } finally {
      area.remove();
      previous?.focus();
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([code], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <dialog
      ref={dialog}
      className="term-modal"
      aria-labelledby="detail-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="detail-shell">
        <header className="detail-header">
          <div>
            <span className="detail-category">{term.category}</span>
            <h2 id="detail-title">{term.english}</h2>
            <p>
              {term.pronunciation}
              <span>·</span>
              {term.korean}
            </p>
          </div>
          <button
            className="icon-button close-detail"
            aria-label="상세 닫기"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        <div className="detail-body">
          <div className="detail-columns">
            <section
              className="experience-panel"
              data-demo={term.demoId}
              aria-label="UI 직접 체험"
            >
              <div className="experience-heading">
                <div className="mode-tabs">
                  <button
                    className={mode === "live" ? "active" : ""}
                    onClick={() => setMode("live")}
                  >
                    <MousePointer2 size={14} />
                    직접 체험
                  </button>
                  <button
                    className={mode === "observe" ? "active" : ""}
                    onClick={() => setMode("observe")}
                  >
                    <Sparkles size={13} />
                    동작 살펴보기
                  </button>
                </div>
                <span className="prototype-badge">LIVE</span>
              </div>
              <div className="demo-toolbar">
                <div className="device-switch" aria-label="체험 화면 폭">
                  <button
                    aria-pressed={!mobile}
                    className={!mobile ? "active" : ""}
                    onClick={() => setMobile(false)}
                  >
                    <Monitor size={15} />
                    <span>PC</span>
                  </button>
                  <button
                    aria-pressed={mobile}
                    className={mobile ? "active" : ""}
                    onClick={() => setMobile(true)}
                  >
                    <Smartphone size={14} />
                    <span>모바일</span>
                  </button>
                </div>
                {mode === "live" && (
                  <button
                    className="icon-button"
                    aria-label="체험 초기화"
                    onClick={() => setReset((v) => v + 1)}
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
              {mode === "live" ? (
                <SimulationExperience
                  key={term.id}
                  id={term.demoId}
                  examples={term.guide.examples}
                  format={format}
                  mobile={mobile}
                  reset={reset}
                />
              ) : (
                <div
                  className={`experience-stage ${mobile ? "mobile-width" : ""}`}
                >
                  <div className="stage-inner">
                    <Observation id={term.demoId} />
                  </div>
                </div>
              )}
            </section>
            <section className="reference-panel" aria-label="용어 설명과 코드">
              <div
                className="reference-tabs"
                role="tablist"
                aria-label="상세 정보"
              >
                {[
                  ["guide", "사용 가이드"],
                  ["roles", "직무별 안내"],
                  ["code", "코드"],
                ].map(([key, label]) => (
                  <button
                    role="tab"
                    id={`tab-${key}`}
                    aria-controls={`panel-${key}`}
                    aria-selected={tab === key}
                    tabIndex={tab === key ? 0 : -1}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        const order = ["guide", "roles", "code"];
                        const next =
                          order[
                            (order.indexOf(tab) +
                              (e.key === "ArrowRight" ? 1 : 2)) %
                              3
                          ];
                        setTab(next);
                        document.getElementById(`tab-${next}`)?.focus();
                      }
                    }}
                    key={key}
                    className={tab === key ? "active" : ""}
                    onClick={() => setTab(key)}
                  >
                    {key === "code" && <Code2 size={14} />} {label}
                  </button>
                ))}
              </div>
              <div
                className="reference-content"
                role="tabpanel"
                id={`panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
              >
                {tab === "guide" ? (
                  <GuideContent
                    content={term}
                    terms={terms}
                    onNavigate={onRelated}
                  />
                ) : tab === "roles" ? (
                  <>
                    <h3>직무에 따라 살펴보세요</h3>
                    <p className="section-intro">
                      담당 직무를 선택해 구체적인 작업과 협업 전달 예시를
                      확인하세요.
                    </p>
                    <div className="role-buttons">
                      {roleNames.map((r) => (
                        <button
                          key={r}
                          aria-pressed={role === r}
                          className={role === r ? "active" : ""}
                          onClick={() => setRole(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <RoleContent guide={term.guide} role={role} />
                  </>
                ) : (
                  <>
                    <div className="code-format">
                      <button
                        aria-pressed={format === "react"}
                        className={format === "react" ? "active" : ""}
                        onClick={() => {
                          setFormat("react");
                          setPartIndex(0);
                          setCopyState("");
                        }}
                      >
                        React · TypeScript
                      </button>
                      <button
                        aria-pressed={format === "html"}
                        className={format === "html" ? "active" : ""}
                        onClick={() => {
                          setFormat("html");
                          setPartIndex(0);
                          setCopyState("");
                        }}
                      >
                        HTML · JavaScript
                      </button>
                    </div>
                    <div
                      className="code-scope"
                      role="group"
                      aria-label="코드 범위"
                    >
                      <button
                        aria-pressed={codeScope === "parts"}
                        onClick={() => {
                          setCodeScope("parts");
                          setCopyState("");
                        }}
                      >
                        UI 부분 코드
                      </button>
                      <button
                        aria-pressed={codeScope === "full"}
                        onClick={() => {
                          setCodeScope("full");
                          setCopyState("");
                        }}
                      >
                        전체 실행 예제
                      </button>
                    </div>
                    <p className="code-description">
                      {codeScope === "parts"
                        ? format === "react"
                          ? "이 UI의 컴포넌트와 필요한 CSS를 분리했습니다. 컴포넌트와 ui.css를 같은 폴더에 두고 기본 내보내기를 가져와 사용하세요."
                          : "이 UI에 필요한 HTML·CSS·JavaScript만 제공합니다. HTML은 본문에 넣고 CSS를 연결한 뒤, HTML 뒤에서 JavaScript를 실행하세요. 한 화면에 여러 개를 넣을 때는 id와 선택자를 구분하세요."
                        : format === "react"
                          ? "이 UI와 스타일을 포함한 App.tsx입니다. React 프로젝트에서 실행할 수 있으며 다른 UI 예제는 포함하지 않습니다."
                          : "스타일과 스크립트를 포함한 독립 HTML입니다. 파일로 저장한 뒤 브라우저에서 열어볼 수 있습니다."}
                    </p>
                    {codeScope === "parts" && (
                      <div
                        className="code-parts"
                        role="group"
                        aria-label="코드 파일 선택"
                      >
                        {parts.map((item, index) => (
                          <button
                            key={item.id}
                            aria-pressed={partIndex === index}
                            onClick={() => {
                              setPartIndex(index);
                              setCopyState("");
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="code-actions">
                      <span>{filename}</span>
                      <button
                        onClick={download}
                        aria-label="현재 코드 파일 저장"
                      >
                        <Download size={14} />
                      </button>
                      <button onClick={copy}>
                        {copyState === "복사했어요" ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        복사
                      </button>
                    </div>
                    <pre
                      className="code-block"
                      tabIndex={0}
                      aria-label="선택한 코드"
                    >
                      <code>{code}</code>
                    </pre>
                    <p className="copy-status" role="status">
                      {copyState}
                    </p>
                  </>
                )}
              </div>
            </section>
          </div>
          <footer className="detail-footer">
            <span>UI Notes · 동작 프로토타입</span>
            <span>예제 데이터로 동작하며 외부 서비스에 전송하지 않아요.</span>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
export default function Catalog({
  initialTerms,
  initialCategories,
  preview = false,
}: {
  initialTerms: Term[];
  initialCategories: string[];
  preview?: boolean;
}) {
  const groupNames = ["전체", ...initialCategories];
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState<Term | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const [expandedHeaderHeight, setExpandedHeaderHeight] = useState(0);
  const catalogHeader = useRef<HTMLElement>(null);
  const categoryTrigger = useRef<HTMLButtonElement>(null);
  const categoryLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCompactHeader(window.scrollY > 64);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    if (compactHeader || !catalogHeader.current) return;
    const header = catalogHeader.current;
    const measure = () =>
      setExpandedHeaderHeight(header.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [compactHeader]);
  useEffect(() => {
    const layer = categoryLayer.current;
    if (!layer) return;
    const position = () => {
      const box = categoryTrigger.current?.getBoundingClientRect();
      if (!box) return;
      const width = Math.min(320, window.innerWidth - 32);
      layer.style.width = `${width}px`;
      layer.style.left = `${Math.max(16, Math.min(box.right - width, window.innerWidth - width - 16))}px`;
      layer.style.top = `${box.bottom + 10}px`;
      layer.style.maxHeight = `${Math.max(100, window.innerHeight - box.bottom - 26)}px`;
    };
    const before = (event: Event) => {
      if ((event as ToggleEvent).newState === "open") position();
    };
    const toggle = (event: Event) =>
      setCategoriesOpen((event as ToggleEvent).newState === "open");
    layer.addEventListener("beforetoggle", before);
    layer.addEventListener("toggle", toggle);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, { passive: true });
    return () => {
      layer.removeEventListener("beforetoggle", before);
      layer.removeEventListener("toggle", toggle);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position);
    };
  }, []);
  useEffect(() => {
    categoryLayer.current?.hidePopover();
  }, [compactHeader]);
  const [notice, setNotice] = useState("");
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0,
      last: number | undefined;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      raf = 0;
      if (last !== undefined) playback.tick(now - last);
      last = now;
      if (playback.hasActive()) schedule();
      else last = undefined;
    };
    playback.setScheduler(schedule);
    const visible = () => {
      last = undefined;
      playback.setContext({ hidden: document.hidden });
    };
    document.addEventListener("visibilitychange", visible);
    visible();
    return () => {
      cancelAnimationFrame(raf);
      playback.setScheduler(() => {});
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  useEffect(() => playback.setContext({ blocked: !!selected }), [selected]);
  useEffect(() => {
    const shortcut = (event: globalThis.KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (
        event.key === "/" &&
        !selected &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(tag)
      ) {
        event.preventDefault();
        document
          .querySelector<HTMLInputElement>('[aria-label="UI 용어 검색"]')
          ?.focus();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [selected]);
  useEffect(() => {
    const read = () => {
      const id = new URLSearchParams(location.search).get("term");
      if (id) {
        const item = initialTerms.find((t) => t.id === id);
        setSelected(item || null);
        if (!item) setNotice("이 용어는 현재 표시되지 않아요.");
      } else setSelected(null);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [initialTerms]);
  const visibleTerms = useMemo(
    () =>
      initialTerms
        .filter(
          (t) =>
            !selectedCategories.length ||
            selectedCategories.includes(t.category),
        )
        .map((t) => ({ term: t, score: scoreTerm(t, query) }))
        .filter((t) => t.score > 0)
        .sort((a, b) =>
          sort === "alphabet"
            ? a.term.english.localeCompare(b.term.english)
            : query
              ? b.score - a.score || a.term.order - b.term.order
              : a.term.order - b.term.order,
        )
        .map((t) => t.term),
    [initialTerms, query, selectedCategories, sort],
  );
  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".dictionary");
    const header = document.querySelector<HTMLElement>(".catalog-header");
    if (!main || !header) return;
    const top = main.getBoundingClientRect().top;
    const bottom = header.getBoundingClientRect().bottom;
    if (top < bottom) {
      window.scrollTo({
        top: Math.max(0, window.scrollY + top - bottom - 20),
        behavior: "instant",
      });
    }
  }, [query, selectedCategories]);
  const open = (term: Term, trigger?: HTMLElement) => {
    opener.current = trigger || (document.activeElement as HTMLElement);
    setSelected(term);
    const url = new URL(location.href);
    url.searchParams.set("term", term.id);
    history.pushState({ uiNotes: true }, "", url);
  };
  const related = (term: Term) => {
    setSelected(term);
    const url = new URL(location.href);
    url.searchParams.set("term", term.id);
    history.replaceState(history.state, "", url);
  };
  const close = () => {
    setSelected(null);
    if (history.state?.uiNotes) history.back();
    else {
      const url = new URL(location.href);
      url.searchParams.delete("term");
      history.replaceState(null, "", url);
    }
    requestAnimationFrame(() => opener.current?.focus());
  };
  const search = (value: string) => {
    setQuery(value);
    setSelectedCategories([]);
  };
  const categoryButtons = groupNames.map((c) => (
    <button
      key={c}
      className={
        (
          c === "전체"
            ? !selectedCategories.length
            : selectedCategories.includes(c)
        )
          ? "selected"
          : ""
      }
      aria-pressed={
        c === "전체"
          ? !selectedCategories.length
          : selectedCategories.includes(c)
      }
      onClick={() =>
        setSelectedCategories((previous) =>
          c === "전체"
            ? []
            : previous.includes(c)
              ? previous.filter((value) => value !== c)
              : [...previous, c],
        )
      }
    >
      {c === "전체" && <Layers2 size={14} />} {c}
      {c === "전체" && <span>{initialTerms.length}</span>}
    </button>
  ));
  return (
    <>
      {preview && (
        <div className="draft-preview-banner">
          저장된 초안 미리보기 · 사이트에는 게시 전까지 반영되지 않습니다.
        </div>
      )}
      {compactHeader && (
        <div
          className="catalog-header-placeholder"
          style={{ height: expandedHeaderHeight }}
          aria-hidden="true"
        />
      )}
      <header
        ref={catalogHeader}
        className="catalog-header"
        data-compact={compactHeader}
      >
        <div className="catalog-header-inner">
          <div className="catalog-heading-row">
            <div className="catalog-heading">
              <p>실무자를 위한 인터랙티브 UI 레퍼런스</p>
              <h1>
                <a href="/" aria-label="UI 용어 사전 홈">
                  <span className="catalog-title-full">UI 용어 사전</span>
                  <span className="catalog-title-short">UI 사전</span>
                </a>{" "}
                <span>{initialTerms.length}</span>
              </h1>
            </div>
            <div className="search-box catalog-search" role="search">
              <Search size={21} aria-hidden="true" />
              <input
                type="search"
                aria-label="UI 용어 검색"
                placeholder="용어·움직임 검색: 드로어, 알림, sticky…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="검색 지우기" onClick={() => setQuery("")}>
                  <X size={17} />
                </button>
              )}
              <kbd aria-hidden="true">/</kbd>
            </div>
            <nav className="catalog-links" aria-label="사이트 메뉴">
              <button
                className="nav-info"
                aria-expanded={showInfo}
                onClick={() => setShowInfo((v) => !v)}
              >
                이용 안내
              </button>
              <button
                ref={categoryTrigger}
                className="catalog-category-trigger"
                aria-label={
                  selectedCategories.length
                    ? `카테고리 선택 · ${selectedCategories.length}개 선택됨`
                    : "카테고리 선택"
                }
                aria-expanded={categoriesOpen}
                aria-controls="catalog-category-layer"
                popoverTarget="catalog-category-layer"
                title="카테고리 선택"
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    categoryLayer.current?.showPopover();
                    categoryLayer.current
                      ?.querySelector<HTMLButtonElement>(".category-bar button")
                      ?.focus();
                  }
                }}
              >
                <Layers2 size={19} />
                {selectedCategories.length > 0 && (
                  <span className="category-selection-count">
                    {selectedCategories.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          {showInfo && (
            <aside className="prototype-info">
              <Sparkles size={18} />
              <div>
                <strong>직접 사용하며 UI 패턴을 비교해 보세요.</strong>
                <p>
                  대표 UI의 시연·직접 체험·코드 예제를 확인할 수 있어요.
                  콘텐츠는 순차적으로 확장합니다.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowInfo(false)}
                aria-label="안내 닫기"
              >
                <X size={17} />
              </button>
            </aside>
          )}
          <div
            id="catalog-categories"
            className="category-bar"
            data-expanded={categoriesOpen}
            role="group"
            aria-label="주제별 필터"
          >
            {categoryButtons}
          </div>
        </div>
      </header>
      <div
        id="catalog-category-layer"
        ref={categoryLayer}
        className="catalog-category-layer"
        popover="auto"
        aria-labelledby="catalog-category-title"
      >
        <div className="category-layer-heading">
          <strong id="catalog-category-title">카테고리 선택</strong>
          <button
            type="button"
            aria-label="카테고리 선택 닫기"
            onClick={() => categoryLayer.current?.hidePopover()}
          >
            <X size={17} />
          </button>
        </div>
        <p>여러 카테고리를 함께 선택할 수 있어요.</p>
        <div
          className="category-bar"
          role="group"
          aria-label="레이어 카테고리 필터"
        >
          {categoryButtons}
        </div>
        <button
          className="category-layer-done"
          type="button"
          onClick={() => categoryLayer.current?.hidePopover()}
        >
          선택 완료
          {selectedCategories.length > 0
            ? ` · ${selectedCategories.length}개`
            : ""}
        </button>
      </div>
      <main className="main-container catalog-main">
        <section className="dictionary" aria-label="UI 용어 목록">
          <div className="results-toolbar">
            <h2>
              {query
                ? `“${query}” 검색 결과`
                : !selectedCategories.length
                  ? "UI 컬렉션"
                  : selectedCategories.length === 1
                    ? selectedCategories[0]
                    : `카테고리 ${selectedCategories.length}개 선택`}
              <span>{visibleTerms.length}</span>
            </h2>
            <div className="list-options">
              <div className="select-wrap">
                <DemoSelect
                  aria-label="목록 정렬"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recommended">
                    {query ? "관련도순" : "기본순"}
                  </option>
                  <option value="alphabet">영문 이름순</option>
                </DemoSelect>
              </div>
            </div>
          </div>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {visibleTerms.length ? (
            <div className="terms-grid">
              {visibleTerms.map((term) => (
                <Preview
                  key={term.id}
                  term={term}
                  onOpen={(trigger) => open(term, trigger)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-search">
              <Search size={30} />
              <h3>아직 일치하는 UI가 없어요</h3>
              <p>다른 이름이나 움직임으로 찾아보세요.</p>
              <button
                onClick={() => {
                  search("");
                  setSelectedCategories([]);
                }}
              >
                전체 UI 보기
              </button>
            </div>
          )}
          <div className="collection-bottom">
            <span>
              <MousePointer2 size={14} />
              카드를 열어 직접 조작하고 코드를 확인해 보세요.
            </span>
            <span>대표 UI {initialTerms.length}개 · 인터랙티브 사전</span>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <Logo />
          <span>이름을 알고, 더 나은 화면을 만들어요.</span>
          <span className="footer-version">Prototype 0.1</span>
        </div>
      </footer>
      {selected && (
        <Detail
          key={selected.id}
          term={selected}
          terms={initialTerms}
          onRelated={related}
          onClose={close}
        />
      )}
    </>
  );
}
