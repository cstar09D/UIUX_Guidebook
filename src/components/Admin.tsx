"use client";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Database,
  Eye,
  EyeOff,
  ExternalLink,
  History,
  Layers2,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Tags,
  Trash2,
} from "lucide-react";
import {
  type AdminState,
  type Content,
  type ManagedTerm,
  newContent,
} from "@/lib/content";
import { scoreTerm } from "@/lib/search.mjs";
import ContentEditor, { adminRequest } from "./ContentEditor";
import { BackupPanel, RegistryPanel, TaxonomyPanel } from "./StudioPanels";
const pages = [
  ["terms", "용어 관리", BookOpen],
  ["taxonomy", "카테고리·태그", Tags],
  ["simulations", "시뮬레이션", Layers2],
  ["backup", "백업·가져오기", Database],
  ["trash", "휴지통", Trash2],
] as const;
export default function Admin({
  initialState,
  cloud = false,
  loginEnabled = false,
}: {
  initialState: AdminState;
  cloud?: boolean;
  loginEnabled?: boolean;
}) {
  const [state, setState] = useState(initialState);
  const [page, setPage] = useState("terms");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Content | ManagedTerm | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const { terms, taxonomy } = state;
  const trash = page === "trash";
  const listed = terms.filter(
    (t) =>
      !!t.deleted === trash &&
      (!category || t.category === category) &&
      scoreTerm(t, query) > 0 &&
      (status === "all" ||
        (status === "draft" && t.status === "draft") ||
        (status === "published" && t.status === "published") ||
        (status === "changed" && t.hasUnpublishedChanges) ||
        (status === "hidden" && t.hidden)),
  );
  const refresh = async () => {
    const next = await adminRequest<AdminState>("/api/admin");
    setState(next);
    if (category && !next.taxonomy.categories.includes(category))
      setCategory("");
  };
  const operation = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const change = (term: ManagedTerm, action: string) =>
    operation(async () => {
      await adminRequest(
        "/api/terms",
        { id: term.id, revision: term.revision, action },
        "PATCH",
      );
      setMessage(
        action === "unpublish"
          ? "게시를 취소했습니다. 초안과 이력은 유지됩니다."
          : "변경 내용을 반영했습니다.",
      );
    });
  const edit = (term: Content | ManagedTerm) => {
    setEditing(structuredClone(term));
    setEditorKey((v) => v + 1);
    setError("");
  };
  const move = (term: ManagedTerm, direction: number) => {
    const visible = listed.indexOf(term);
    const other = listed[visible + direction];
    if (!other) return;
    const ordered = [...terms];
    const from = ordered.indexOf(term),
      to = ordered.indexOf(other);
    [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
    void operation(async () => {
      await adminRequest(
        "/api/terms",
        {
          action: "order",
          ids: ordered.map((t) => t.id),
          revisions: ordered.map((t) => t.revision),
        },
        "PATCH",
      );
      setMessage("목록 순서를 저장했습니다.");
    });
  };
  const title = pages.find((p) => p[0] === page)?.[1] || "용어 관리";
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">
          <span className="admin-brand-icon">
            <Layers2 size={20} />
          </span>
          <span>
            UI Notes<small>CONTENT STUDIO</small>
          </span>
        </a>
        <span className="sidebar-label">WORKSPACE</span>
        <nav aria-label="관리 메뉴">
          {pages.map(([key, label, Icon]) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              aria-label={label}
              onClick={() => {
                setPage(key);
                setError("");
                setMessage("");
                setStatus("all");
                setQuery("");
                setCategory("");
              }}
            >
              <Icon size={18} />
              <span className="studio-nav-label">{label}</span>
              {(key === "terms" || key === "trash") && (
                <span>
                  {
                    terms.filter((t) => !!t.deleted === (key === "trash"))
                      .length
                  }
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div>
            <span className="local-indicator" />
            {cloud ? "온라인 작업 공간" : "로컬 작업 공간"}
          </div>
          <p>
            초안과 게시본을 분리해
            <br />
            {cloud
              ? "영구 데이터베이스에 보관합니다."
              : "이 컴퓨터에 보관합니다."}
          </p>
          {loginEnabled && (
            <button
              type="button"
              className="studio-logout"
              onClick={async () => {
                try {
                  const response = await fetch("/api/session", {
                    method: "DELETE",
                  });
                  if (response.ok) window.location.assign("/admin/login");
                  else setError("로그아웃하지 못했습니다. 다시 시도하세요.");
                } catch {
                  setError("연결을 확인한 후 다시 시도하세요.");
                }
              }}
            >
              로그아웃
            </button>
          )}
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
            사이트 보기
          </a>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>
            작업 공간 <span>/</span> {title}
          </span>
          <a
            className="studio-site-link"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} />
            사이트 보기
          </a>
        </header>
        <main className="admin-content">
          {page === "taxonomy" ? (
            <TaxonomyPanel state={state} refresh={refresh} />
          ) : page === "backup" ? (
            <BackupPanel state={state} refresh={refresh} />
          ) : page === "simulations" ? (
            <RegistryPanel state={state} />
          ) : (
            <>
              <div className="admin-page-heading">
                <div>
                  <span>CONTENT LIBRARY</span>
                  <h1>{title}</h1>
                  <p>
                    {trash
                      ? "휴지통의 콘텐츠와 기존 이력을 보존하고 필요할 때 복원합니다."
                      : "초안을 작성하고 검토한 뒤 게시하세요. 숨김과 순서 변경은 즉시 반영됩니다."}
                  </p>
                </div>
                {!trash && (
                  <button
                    className="admin-primary"
                    onClick={() => edit(newContent(taxonomy.categories[0]))}
                  >
                    <Plus size={16} />
                    용어 추가
                  </button>
                )}
              </div>
              <div className="admin-stats">
                <div>
                  <span>전체 콘텐츠</span>
                  <strong>
                    {terms.filter((t) => !t.deleted).length}
                    <small>개</small>
                  </strong>
                  <BookOpen size={21} />
                </div>
                <div>
                  <span>게시·노출 중</span>
                  <strong>
                    {
                      terms.filter(
                        (t) =>
                          !t.deleted && !t.hidden && t.status === "published",
                      ).length
                    }
                    <small>개</small>
                  </strong>
                  <Eye size={21} />
                </div>
                <div>
                  <span>검토할 초안·변경</span>
                  <strong>
                    {
                      terms.filter(
                        (t) =>
                          !t.deleted &&
                          (t.status === "draft" || t.hasUnpublishedChanges),
                      ).length
                    }
                    <small>개</small>
                  </strong>
                  <History size={21} />
                </div>
              </div>
              <div className="admin-library">
                <div className="admin-table-toolbar">
                  <div className="admin-search">
                    <Search size={16} />
                    <input
                      aria-label="관리자 용어 검색"
                      placeholder="이름·별칭·검색어·태그 검색"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <select
                    aria-label="관리 카테고리 필터"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">전체 카테고리</option>
                    {taxonomy.categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    aria-label="콘텐츠 상태 필터"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">모든 상태</option>
                    <option value="draft">초안</option>
                    <option value="published">게시본 있음</option>
                    <option value="changed">미게시 변경</option>
                    <option value="hidden">숨김</option>
                  </select>
                  <button
                    className="admin-icon"
                    disabled={busy}
                    aria-label="관리 목록 새로고침"
                    onClick={() => operation(async () => {})}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>순서</th>
                        <th>용어</th>
                        <th>카테고리</th>
                        <th>상태</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listed.map((term, index) => (
                        <tr key={term.id}>
                          <td>
                            <div className="order-controls">
                              <button
                                disabled={
                                  busy || !!query || index === 0 || trash
                                }
                                aria-label={`${term.english} 위로 이동`}
                                onClick={() => move(term, -1)}
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                disabled={
                                  busy ||
                                  !!query ||
                                  index === listed.length - 1 ||
                                  trash
                                }
                                aria-label={`${term.english} 아래로 이동`}
                                onClick={() => move(term, 1)}
                              >
                                <ArrowDown size={13} />
                              </button>
                            </div>
                          </td>
                          <td>
                            <button
                              className="admin-term-name"
                              onClick={() => edit(term)}
                            >
                              {term.english}
                              <span>
                                {term.pronunciation} · {term.korean}
                              </span>
                            </button>
                            <span className="studio-term-version">
                              v{term.revision} ·{" "}
                              {new Date(term.updatedAt).toLocaleDateString(
                                "ko-KR",
                              )}
                            </span>
                          </td>
                          <td>
                            <span className="admin-category">
                              {term.category}
                            </span>
                          </td>
                          <td>
                            <div className="studio-statuses">
                              <span
                                className={`admin-status ${term.deleted ? "trashed" : term.status === "published" ? "visible" : "draft"}`}
                              >
                                {term.deleted
                                  ? "휴지통"
                                  : term.status === "published"
                                    ? "게시본 있음"
                                    : "초안"}
                              </span>
                              {term.hidden && (
                                <span className="admin-status hidden">
                                  숨김
                                </span>
                              )}
                              {term.hasUnpublishedChanges && (
                                <span className="admin-status changed">
                                  미게시 변경
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="row-actions">
                              {trash ? (
                                <button
                                  className="admin-restore"
                                  disabled={busy}
                                  onClick={() => change(term, "restore")}
                                >
                                  <RotateCcw size={14} />
                                  복원
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="admin-icon"
                                    aria-label={`${term.english} ${term.hidden ? "노출" : "숨기기"}`}
                                    disabled={busy}
                                    onClick={() =>
                                      change(
                                        term,
                                        term.hidden ? "show" : "hide",
                                      )
                                    }
                                  >
                                    {term.hidden ? (
                                      <Eye size={16} />
                                    ) : (
                                      <EyeOff size={16} />
                                    )}
                                  </button>
                                  <button
                                    className="admin-icon"
                                    aria-label={`${term.english} 편집`}
                                    onClick={() => edit(term)}
                                  >
                                    <Settings2 size={16} />
                                  </button>
                                  <button
                                    className="admin-icon danger"
                                    aria-label={`${term.english} 휴지통으로 이동`}
                                    disabled={busy}
                                    onClick={() => change(term, "trash")}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  {term.status === "published" && (
                                    <button
                                      className="studio-text-button"
                                      disabled={busy}
                                      onClick={() => change(term, "unpublish")}
                                    >
                                      게시 취소
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!listed.length && (
                    <div className="admin-empty">
                      {trash
                        ? "휴지통이 비어 있습니다."
                        : "조건에 맞는 콘텐츠가 없습니다."}
                    </div>
                  )}
                </div>
                <div className="admin-table-bottom">
                  <span>
                    {listed.length}개 · 카테고리를 선택하면 해당 분류 안에서
                    순서를 조정할 수 있습니다.
                  </span>
                  <span>{cloud ? "클라우드 저장" : "로컬 저장"}</span>
                </div>
              </div>
              {error && (
                <p className="studio-error" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p className="studio-success" role="status">
                  {message}
                </p>
              )}
              <div className="admin-scope-note">
                <strong>초안과 게시본</strong>
                <p>
                  초안 저장은 사이트에 반영되지 않습니다. 게시하면 최신 내용이
                  반영되며, 게시 취소는 초안과 이력을 유지합니다. 숨김·휴지통은
                  즉시 목록과 검색에서 제외합니다.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
      {editing && (
        <ContentEditor
          key={editorKey}
          initial={editing}
          taxonomy={taxonomy}
          onClose={() => setEditing(null)}
          onSaved={async () => refresh()}
        />
      )}
    </div>
  );
}
