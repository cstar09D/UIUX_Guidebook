"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  History,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { simulationRegistry } from "@/demos/registry";
import {
  detailedGuides,
  roleNames,
  type DetailedGuide,
  type GuidePoint,
  type ScreenExample,
  type RoleName,
} from "@/lib/guide-content";
import {
  actionLabels,
  publicationIssues,
  type Content,
  type ManagedTerm,
  type Taxonomy,
  type ContentVersion,
} from "@/lib/content";
import type { DemoId } from "@/lib/catalog";
import { SimulationPreview } from "./SimulationExperience";
import { scenarioIds } from "@/demos/scenario-contract.mjs";

export async function adminRequest<T>(
  url: string,
  body?: unknown,
  method = "POST",
): Promise<T> {
  let options: RequestInit = { cache: "no-store" };
  if (body !== undefined) {
    const text = JSON.stringify(body);
    if (text.length > 256 * 1024 && typeof CompressionStream !== "undefined") {
      const compressed = await new Response(
        new Blob([text]).stream().pipeThrough(new CompressionStream("gzip")),
      ).blob();
      options = {
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
        },
        body: compressed,
      };
    } else
      options = {
        method,
        headers: { "Content-Type": "application/json" },
        body: text,
      };
  }
  const response = await fetch(url, options);
  if (response.status === 401) window.location.assign("/admin/login");
  const data = await response.json();
  if (!response.ok) throw Error(data.error || "요청을 처리하지 못했습니다.");
  return data;
}
export function Field({
  label,
  value,
  onChange,
  large = false,
  help,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  large?: boolean;
  help?: string;
  required?: boolean;
}) {
  return (
    <label className="studio-field">
      <span>
        {label}
        {required && <em>필수</em>}
      </span>
      {large ? (
        <textarea
          aria-label={label}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          aria-label={label}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {help && <small>{help}</small>}
    </label>
  );
}
function Strings({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  help?: string;
}) {
  return (
    <Field
      label={label}
      large
      value={value.join("\n")}
      onChange={(v) => onChange(v ? v.split("\n") : [])}
      help={help || "한 줄에 하나씩 입력하세요."}
    />
  );
}
function Controls({
  index,
  count,
  move,
  remove,
}: {
  index: number;
  count: number;
  move: (from: number, to: number) => void;
  remove: () => void;
}) {
  return (
    <div className="studio-item-actions">
      <button
        type="button"
        className="admin-icon"
        aria-label="항목 위로"
        disabled={index === 0}
        onClick={() => move(index, index - 1)}
      >
        <ArrowUp size={15} />
      </button>
      <button
        type="button"
        className="admin-icon"
        aria-label="항목 아래로"
        disabled={index === count - 1}
        onClick={() => move(index, index + 1)}
      >
        <ArrowDown size={15} />
      </button>
      <button
        type="button"
        className="admin-icon danger"
        aria-label="항목 삭제"
        onClick={remove}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
function reordered<T>(items: T[], from: number, to: number) {
  const next = [...items];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
function PointsEditor({
  title,
  items,
  onChange,
  allowLinks = false,
}: {
  title: string;
  allowLinks?: boolean;
  items: GuidePoint[];
  onChange: (v: GuidePoint[]) => void;
}) {
  return (
    <section className="studio-section">
      <div className="studio-section-heading">
        <h3>{title}</h3>
        <button
          type="button"
          className="studio-add"
          onClick={() => onChange([...items, { title: "", body: "" }])}
        >
          <Plus size={14} />
          항목 추가
        </button>
      </div>
      {!items.length && (
        <p className="studio-muted">
          항목을 추가해 제목과 구체적인 설명을 작성하세요.
        </p>
      )}
      {items.map((item, index) => (
        <div className="studio-item" key={index}>
          <Controls
            index={index}
            count={items.length}
            move={(from, to) => onChange(reordered(items, from, to))}
            remove={() => onChange(items.filter((_, i) => i !== index))}
          />
          <Field
            label={`${title} ${index + 1} 제목`}
            value={item.title}
            onChange={(v) =>
              onChange(
                items.map((p, i) => (i === index ? { ...p, title: v } : p)),
              )
            }
          />
          {allowLinks && (
            <label className="studio-field">
              <span>연결할 대안 UI</span>
              <select
                aria-label={`대안 ${index + 1} 연결 UI`}
                value={item.targetDemoId || ""}
                onChange={(e) =>
                  onChange(
                    items.map((p, i) => {
                      if (i !== index) return p;
                      const { targetDemoId, ...rest } = p;
                      return e.target.value
                        ? {
                            ...rest,
                            targetDemoId: e.target
                              .value as GuidePoint["targetDemoId"],
                          }
                        : rest;
                    }),
                  )
                }
              >
                <option value="">연결 없음 · 설명만 표시</option>
                {simulationRegistry.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Field
            label={`${title} ${index + 1} 설명`}
            large
            value={item.body}
            onChange={(v) =>
              onChange(
                items.map((p, i) => (i === index ? { ...p, body: v } : p)),
              )
            }
          />
        </div>
      ))}
    </section>
  );
}
function SimulationStatesEditor({
  demoId,
  items,
  onChange,
}: {
  demoId: DemoId;
  items: ScreenExample[];
  onChange: (v: ScreenExample[]) => void;
}) {
  const allowed = scenarioIds[demoId];
  const nextState = allowed?.find(
    (key) => !items.some((item) => item.id === key),
  );
  const edit = (index: number, change: Partial<ScreenExample>) =>
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...change } : item)),
    );
  return (
    <section className="studio-section">
      <div className="studio-section-heading">
        <div>
          <h3>상태별 화면과 설명</h3>
          <p>
            직접 체험에서 선택할 상태입니다. 등록된 동작에 상태 이름·발생
            조건·처리 방법을 연결합니다.
          </p>
        </div>
        <button
          type="button"
          className="studio-add"
          disabled={!!allowed && !nextState}
          onClick={() =>
            onChange([
              ...items,
              allowed && nextState
                ? structuredClone(
                    detailedGuides[demoId].examples.find(
                      (item) => item.id === nextState,
                    )!,
                  )
                : {
                    id: `state-${crypto.randomUUID()}`,
                    label: "",
                    title: "",
                    condition: "",
                    explanation: "",
                    screen: { title: "", body: "" },
                  },
            ])
          }
        >
          <Plus size={14} />
          상태 추가
        </button>
      </div>
      {allowed && (
        <div className="studio-note">
          <p>
            이 UI는 상태 선택이 실제 동작에 연결됩니다. 동작·화면 구성은 개발
            소스에서 관리하고, 여기서는 안내 내용을 편집합니다.
          </p>
          <button
            type="button"
            className="admin-secondary"
            onClick={() =>
              onChange(structuredClone(detailedGuides[demoId].examples))
            }
          >
            등록된 상태 안내로 되돌리기
          </button>
        </div>
      )}
      {items.map((item, index) => (
        <div className="studio-item" key={item.id}>
          <Controls
            index={index}
            count={items.length}
            move={(from, to) => onChange(reordered(items, from, to))}
            remove={() => onChange(items.filter((_, i) => i !== index))}
          />
          {allowed && (
            <label className="studio-field">
              <span>연결할 실제 동작 상태</span>
              <select
                aria-label={`상태 ${index + 1} 동작 연결`}
                value={item.id}
                onChange={(event) => edit(index, { id: event.target.value })}
              >
                {!allowed.includes(item.id) && (
                  <option value={item.id}>
                    연결되지 않은 설명 ({item.id})
                  </option>
                )}
                {allowed.map((key) => (
                  <option
                    key={key}
                    value={key}
                    disabled={items.some(
                      (other, i) => i !== index && other.id === key,
                    )}
                  >
                    {detailedGuides[demoId].examples.find(
                      (example) => example.id === key,
                    )?.label || key}{" "}
                    · {key}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="studio-pair">
            <Field
              label={`상태 ${index + 1} 이름`}
              value={item.label}
              onChange={(v) => edit(index, { label: v })}
            />
            <Field
              label={`상태 ${index + 1} 설명 제목`}
              value={item.title}
              onChange={(v) => edit(index, { title: v })}
            />
          </div>
          <Field
            label={`상태 ${index + 1} 발생 조건`}
            large
            value={item.condition}
            onChange={(v) => edit(index, { condition: v })}
          />
          <Field
            label={`상태 ${index + 1} 처리 방법`}
            large
            value={item.explanation}
            onChange={(v) => edit(index, { explanation: v })}
          />
          {!allowed && (
            <div className="studio-screen-fields">
              <span className="studio-eyebrow">화면에 표시할 내용</span>
              <Field
                label={`상태 ${index + 1} 화면 제목`}
                value={item.screen.title}
                onChange={(v) =>
                  edit(index, { screen: { ...item.screen, title: v } })
                }
              />
              <Field
                label={`상태 ${index + 1} 화면 문구`}
                large
                value={item.screen.body}
                onChange={(v) =>
                  edit(index, { screen: { ...item.screen, body: v } })
                }
              />
              <div className="studio-pair">
                <Field
                  label={`상태 ${index + 1} 행동 문구`}
                  value={item.screen.action || ""}
                  onChange={(v) =>
                    edit(index, { screen: { ...item.screen, action: v } })
                  }
                />
                <label className="studio-field">
                  <span>화면 상태</span>
                  <select
                    value={item.screen.tone || "default"}
                    onChange={(e) => {
                      const tone = e.target.value as
                        ScreenExample["screen"]["tone"] | "default";
                      edit(index, {
                        screen: {
                          ...item.screen,
                          tone: tone === "default" ? undefined : tone,
                        },
                      });
                    }}
                  >
                    <option value="default">기본</option>
                    <option value="loading">로딩</option>
                    <option value="success">성공</option>
                    <option value="error">오류</option>
                  </select>
                </label>
              </div>
              <Strings
                label={`상태 ${index + 1} 화면 항목`}
                value={item.screen.items || []}
                onChange={(v) =>
                  edit(index, { screen: { ...item.screen, items: v } })
                }
                help="목록은 한 줄에 하나씩, 그리드의 열은 |로 구분합니다. 비워두면 목록을 표시하지 않습니다."
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
const date = (value: string) => new Date(value).toLocaleString("ko-KR");
const tabs = [
  ["basic", "기본 정보"],
  ["guide", "사용 가이드"],
  ["simulation", "시뮬레이션"],
  ["roles", "직무별 안내"],
  ["history", "변경 이력"],
] as const;
export default function ContentEditor({
  initial,
  taxonomy,
  onClose,
  onSaved,
}: {
  initial: Content | ManagedTerm;
  taxonomy: Taxonomy;
  onClose: () => void;
  onSaved: (term: ManagedTerm) => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [document, setDocument] = useState<Content>(structuredClone(initial));
  const [saved, setSaved] = useState<Content>(structuredClone(initial));
  const [metadata, setMetadata] = useState<ManagedTerm | null>(
    "status" in initial ? initial : null,
  );
  const [tab, setTab] = useState("basic");
  const [role, setRole] = useState<RoleName>("기획");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [discard, setDiscard] = useState(false);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [chosen, setChosen] = useState<ContentVersion | null>(null);
  const dirty = JSON.stringify(document) !== JSON.stringify(saved);
  const issues = publicationIssues(document);
  useEffect(() => {
    dialog.current?.showModal();
    const previous = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    const prevent = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const close = () => {
    if (busy) return;
    if (dirty) setDiscard(true);
    else onClose();
  };
  const update = (change: Partial<Content>) => {
    setDocument((value) => ({ ...value, ...change }));
    setError("");
    setNotice("");
  };
  const guide = (change: Partial<DetailedGuide>) =>
    update({ guide: { ...document.guide, ...change } });
  const loadHistory = async () => {
    if (!document.id) return;
    try {
      setVersions(
        await adminRequest<ContentVersion[]>(
          `/api/history?id=${encodeURIComponent(document.id)}`,
        ),
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const save = async (mode: "save" | "publish") => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = await adminRequest<ManagedTerm>("/api/terms", {
        document,
        mode,
      });
      setDocument(next);
      setSaved(next);
      setMetadata(next);
      await onSaved(next);
      setNotice(
        mode === "publish"
          ? "게시했습니다. 사이트에서 최신 내용을 확인할 수 있습니다."
          : "초안을 저장했습니다. 현재 게시된 내용은 유지됩니다.",
      );
      if (tab === "history") await loadHistory();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    if (!chosen) return;
    setBusy(true);
    setError("");
    try {
      const next = await adminRequest<ManagedTerm>(
        "/api/terms",
        {
          id: document.id,
          revision: document.revision,
          action: "history",
          versionId: chosen.id,
        },
        "PATCH",
      );
      setDocument(next);
      setSaved(next);
      setMetadata(next);
      await onSaved(next);
      await loadHistory();
      setChosen(null);
      setNotice(
        "선택한 이력을 새 초안으로 복원했습니다. 게시된 내용은 유지됩니다.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <dialog
      ref={dialog}
      className="studio-editor"
      aria-labelledby="content-editor-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <header className="studio-editor-header">
        <div>
          <span className="studio-eyebrow">CONTENT EDITOR</span>
          <h2 id="content-editor-title">
            {document.id ? document.english || "용어 편집" : "새 용어 추가"}
          </h2>
          <p>
            {metadata
              ? `v${metadata.revision} · ${metadata.status === "published" ? "게시본 있음" : "초안"}${metadata.hasUnpublishedChanges ? " · 미게시 변경 있음" : ""}`
              : "새 콘텐츠 · 게시 전에는 사이트에 표시되지 않습니다."}
            {dirty ? " · 저장하지 않은 변경" : ""}
          </p>
        </div>
        <button
          className="admin-icon"
          aria-label="콘텐츠 편집 닫기"
          onClick={close}
          disabled={busy}
        >
          <X size={22} />
        </button>
      </header>
      <nav className="studio-editor-tabs" aria-label="편집 항목">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={key === tab ? "active" : ""}
            aria-pressed={key === tab}
            onClick={() => {
              setTab(key);
              setError("");
              if (key === "history") void loadHistory();
            }}
          >
            {key === "history" && <History size={15} />} {label}
          </button>
        ))}
      </nav>
      <div className="studio-editor-body">
        {tab === "basic" && (
          <>
            <div className="studio-intro">
              <h3>이름과 검색 정보를 설정하세요.</h3>
              <p>
                상세 설명은 각 탭에서 편집합니다. 숨김·휴지통은 목록 화면에서
                별도로 관리합니다.
              </p>
            </div>
            <Field
              label="영문 이름"
              value={document.english}
              required
              onChange={(v) => update({ english: v })}
            />
            <div className="studio-pair">
              <Field
                label="한국어 발음"
                value={document.pronunciation}
                onChange={(v) => update({ pronunciation: v })}
              />
              <Field
                label="한국어 표현"
                value={document.korean}
                onChange={(v) => update({ korean: v })}
              />
            </div>
            <Field
              label="목록의 간단한 설명"
              value={document.summary}
              large
              onChange={(v) => update({ summary: v })}
            />
            <div className="studio-pair">
              <label className="studio-field">
                <span>카테고리</span>
                <select
                  value={document.category}
                  onChange={(e) => update({ category: e.target.value })}
                >
                  {taxonomy.categories.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="studio-pair">
              <Strings
                label="별칭"
                value={document.aliases}
                onChange={(v) => update({ aliases: v })}
                help="공식 이름 외에 실무에서 부르는 이름을 한 줄에 하나씩 입력하세요."
              />
              <Strings
                label="검색어·움직임 표현"
                value={document.keywords}
                onChange={(v) => update({ keywords: v })}
                help="예: 아래에서 올라오는 창, 끌어서 닫기. 한 줄에 하나씩 입력하세요."
              />
            </div>
            <fieldset className="studio-checks">
              <legend>태그</legend>
              {taxonomy.tags.length ? (
                taxonomy.tags.map((tag) => (
                  <label key={tag}>
                    <input
                      type="checkbox"
                      checked={document.tags.includes(tag)}
                      onChange={(e) =>
                        update({
                          tags: e.target.checked
                            ? [...document.tags, tag]
                            : document.tags.filter((t) => t !== tag),
                        })
                      }
                    />
                    {tag}
                  </label>
                ))
              ) : (
                <p>‘카테고리·태그’에서 태그를 등록하면 선택할 수 있습니다.</p>
              )}
            </fieldset>
            <Field
              label="공식 출처 URL"
              value={document.sourceUrl}
              onChange={(v) => update({ sourceUrl: v })}
            />
            <fieldset className="studio-checks">
              <legend>지원 기기</legend>
              {(["PC", "모바일"] as const).map((platform) => (
                <label key={platform}>
                  <input
                    type="checkbox"
                    checked={document.devices.platforms.includes(platform)}
                    onChange={(e) =>
                      update({
                        devices: {
                          ...document.devices,
                          platforms: e.target.checked
                            ? [...document.devices.platforms, platform]
                            : document.devices.platforms.filter(
                                (p) => p !== platform,
                              ),
                        },
                      })
                    }
                  />
                  {platform}
                </label>
              ))}
            </fieldset>
            <Strings
              label="지원 입력 방식"
              value={document.devices.inputs}
              onChange={(v) =>
                update({ devices: { ...document.devices, inputs: v } })
              }
              help="예: 마우스, 키보드, 터치. 한 줄에 하나씩 입력하세요."
            />
            <div className="studio-note">
              <strong>기본 가이드로 시작하기</strong>
              <p>
                선택한 시뮬레이션의 사용 가이드·상태별 화면·직무별 안내·출처로
                현재 편집 내용을 교체합니다. 저장 전에는 취소할 수 있습니다.
              </p>
              <button
                className="admin-secondary"
                onClick={() => {
                  update({
                    guide: structuredClone(detailedGuides[document.demoId]),
                    sourceUrl: simulationRegistry.find(
                      (d) => d.id === document.demoId,
                    )!.source,
                  });
                  setNotice(
                    "기본 가이드를 불러왔습니다. 용어에 맞게 내용을 검토한 뒤 저장하세요.",
                  );
                }}
              >
                선택한 동작의 기본 가이드 불러오기
              </button>
            </div>
          </>
        )}
        {tab === "guide" && (
          <>
            <Field
              label="어떤 UI인가요?"
              large
              value={document.guide.introduction}
              onChange={(v) => guide({ introduction: v })}
            />
            {(
              [
                ["uses", "사용 상황"],
                ["flow", "사용 흐름"],
                ["pitfalls", "주의점"],
                ["alternatives", "화면·상황별 대안"],
              ] as const
            ).map(([key, title]) => (
              <PointsEditor
                key={key}
                title={title}
                allowLinks={key === "alternatives"}
                items={document.guide[key]}
                onChange={(v) => guide({ [key]: v })}
              />
            ))}
            <Field
              label="직접 체험 방법"
              large
              value={document.guide.practice}
              onChange={(v) => guide({ practice: v })}
            />
          </>
        )}
        {tab === "simulation" && (
          <>
            <section className="studio-section">
              <h3>목록 애니메이션 · 직접 체험</h3>
              <p className="studio-simulation-intro">
                하나의 시뮬레이션에 목록 미리보기, 직접 체험, 상태별 화면을
                연결합니다. 아래 미리보기에는 저장 전 편집 내용도 바로
                반영됩니다.
              </p>
              <label className="studio-field">
                <span>연결할 시뮬레이션</span>
                <select
                  aria-label="연결할 시뮬레이션"
                  value={document.demoId}
                  onChange={(e) => update({ demoId: e.target.value as DemoId })}
                >
                  {simulationRegistry.map((demo) => (
                    <option key={demo.id} value={demo.id}>
                      {demo.name}
                    </option>
                  ))}
                </select>
                <small>
                  목록 애니메이션과 직접 체험에 같은 UI가 연결됩니다. 상태별
                  내용은 자동 교체되지 않으므로 연결한 UI에 맞게 확인하세요.
                </small>
              </label>
              <SimulationPreview
                key={document.id}
                id={document.demoId}
                examples={document.guide.examples}
              />
            </section>
            <SimulationStatesEditor
              demoId={document.demoId}
              items={document.guide.examples}
              onChange={(v) => guide({ examples: v })}
            />
          </>
        )}
        {tab === "roles" && (
          <>
            <div className="studio-role-tabs">
              {roleNames.map((name) => (
                <button
                  key={name}
                  className={name === role ? "active" : ""}
                  aria-pressed={role === name}
                  onClick={() => setRole(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <Field
              label={`${role}의 목표`}
              large
              value={document.guide.roles[role].goal}
              onChange={(v) =>
                guide({
                  roles: {
                    ...document.guide.roles,
                    [role]: { ...document.guide.roles[role], goal: v },
                  },
                })
              }
            />
            <PointsEditor
              title={`${role}의 구체적인 작업`}
              items={document.guide.roles[role].tasks}
              onChange={(v) =>
                guide({
                  roles: {
                    ...document.guide.roles,
                    [role]: { ...document.guide.roles[role], tasks: v },
                  },
                })
              }
            />
            <Field
              label={`${role}의 정책·협업 전달 예시`}
              large
              value={document.guide.roles[role].handoff}
              onChange={(v) =>
                guide({
                  roles: {
                    ...document.guide.roles,
                    [role]: { ...document.guide.roles[role], handoff: v },
                  },
                })
              }
            />
            <Strings
              label={`${role}의 완료 전 검토 질문`}
              value={document.guide.roles[role].checks}
              onChange={(v) =>
                guide({
                  roles: {
                    ...document.guide.roles,
                    [role]: { ...document.guide.roles[role], checks: v },
                  },
                })
              }
            />
          </>
        )}
        {tab === "history" && (
          <>
            <div className="studio-intro">
              <h3>변경 기록을 살펴보고 초안으로 복원하세요.</h3>
              <p>
                복원해도 현재 게시본은 유지됩니다. 이미 삭제된 카테고리·태그는
                현재 분류에 맞춰 처리합니다.
              </p>
            </div>
            {!document.id ? (
              <p className="studio-muted">
                초안을 한 번 저장하면 이력이 생성됩니다.
              </p>
            ) : (
              <div className="studio-history-layout">
                <div className="studio-history-list">
                  {versions.map((v) => (
                    <button
                      key={v.id}
                      className={chosen?.id === v.id ? "active" : ""}
                      onClick={() => setChosen(v)}
                    >
                      <strong>
                        v{v.revision} · {actionLabels[v.action] || v.action}
                      </strong>
                      <span>{date(v.createdAt)}</span>
                    </button>
                  ))}
                </div>
                <div className="studio-version">
                  {chosen ? (
                    <>
                      <span className="studio-eyebrow">
                        VERSION {chosen.revision}
                      </span>
                      <h3>{chosen.document.english}</h3>
                      <p>{chosen.document.summary}</p>
                      <dl>
                        <dt>카테고리</dt>
                        <dd>{chosen.document.category}</dd>
                        <dt>시뮬레이션</dt>
                        <dd>{chosen.document.demoId}</dd>
                        <dt>UI 정의</dt>
                        <dd>{chosen.document.guide.introduction}</dd>
                      </dl>
                      <details>
                        <summary>전체 기록 내용 보기</summary>
                        <pre>{JSON.stringify(chosen.document, null, 2)}</pre>
                      </details>
                      {dirty && (
                        <p className="studio-error">
                          작성 중인 변경을 먼저 저장하거나 되돌린 뒤 복원하세요.
                        </p>
                      )}
                      <button
                        className="admin-primary"
                        disabled={busy || dirty}
                        onClick={restore}
                      >
                        이 버전을 새 초안으로 복원
                      </button>
                    </>
                  ) : (
                    <p>왼쪽에서 복원할 기록을 선택하세요.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <footer className="studio-editor-footer">
        <div className="studio-feedback" aria-live="polite">
          {error ? (
            <p className="studio-error" role="alert">
              {error}
            </p>
          ) : notice ? (
            <p className="studio-success">{notice}</p>
          ) : (
            <p>
              {issues.length
                ? `게시 전 작성할 내용: ${issues.join(", ")}`
                : "게시할 준비가 됐습니다."}
            </p>
          )}
        </div>
        {discard ? (
          <div className="studio-discard">
            <span>저장하지 않은 변경을 닫을까요?</span>
            <button
              className="admin-secondary"
              onClick={() => setDiscard(false)}
            >
              계속 편집
            </button>
            <button className="admin-primary" onClick={onClose}>
              저장하지 않고 닫기
            </button>
          </div>
        ) : (
          <div className="studio-footer-actions">
            <button
              className="admin-secondary"
              disabled={busy}
              onClick={() => {
                setDocument(structuredClone(saved));
                setNotice("마지막 저장 내용으로 되돌렸습니다.");
                setError("");
              }}
            >
              편집 되돌리기
            </button>
            {document.id && (
              <a
                className="admin-secondary"
                href={`/admin/preview?term=${encodeURIComponent(document.id)}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={14} />
                저장된 초안 보기
              </a>
            )}
            <button
              className="admin-secondary"
              disabled={busy}
              onClick={() => save("save")}
            >
              <Save size={15} />
              초안 저장
            </button>
            <button
              className="admin-primary"
              disabled={busy || !!document.deleted}
              onClick={() => save("publish")}
            >
              {busy ? "처리 중…" : "게시"}
            </button>
          </div>
        )}
      </footer>
    </dialog>
  );
}
