"use client";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Plus,
  Upload,
} from "lucide-react";
import { simulationRegistry } from "@/demos/registry";
import {
  type AdminState,
  type ImportPreview,
  type Taxonomy,
} from "@/lib/content";
import { adminRequest, Field } from "./ContentEditor";

export function TaxonomyPanel({
  state,
  refresh,
}: {
  state: AdminState;
  refresh: () => Promise<void>;
}) {
  const [kind, setKind] = useState<"categories" | "tags">("categories");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState("");
  const [nextName, setNextName] = useState("");
  const [replacement, setReplacement] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const change = async (
    action: string,
    item: string,
    extra: Record<string, unknown> = {},
  ) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await adminRequest<Taxonomy>("/api/taxonomy", {
        kind,
        action,
        name: item,
        revision: state.taxonomy.revision,
        ...extra,
      });
      await refresh();
      setEditing("");
      setName("");
      setNotice("분류와 연결된 콘텐츠를 반영했습니다.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="studio-page-intro">
        <h2>카테고리·태그</h2>
        <p>
          카테고리는 주제별 탐색에, 태그는 여러 용어를 함께 찾는 데 사용합니다.
          별칭과 움직임 검색어는 용어 편집에서 관리합니다.
        </p>
      </div>
      <div className="studio-role-tabs">
        {[
          ["categories", "카테고리"],
          ["tags", "태그"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={kind === key ? "active" : ""}
            onClick={() => {
              setKind(key as typeof kind);
              setEditing("");
              setError("");
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <form
        className="studio-inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          void change("add", name);
        }}
      >
        <label>
          <span>{kind === "categories" ? "새 카테고리" : "새 태그"}</span>
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </label>
        <button className="admin-primary" disabled={busy || !name.trim()}>
          <Plus size={15} />
          추가
        </button>
      </form>
      <div className="studio-taxonomy-list">
        {state.taxonomy[kind].map((item, index) => {
          const used = state.terms.filter((t) =>
            kind === "categories" ? t.category === item : t.tags.includes(item),
          ).length;
          return (
            <div className="studio-taxonomy-row" key={item}>
              <div className="studio-taxonomy-summary">
                <div>
                  <strong>{item}</strong>
                  <span>편집본 {used}개에 연결</span>
                </div>
                <div className="studio-row-actions">
                  <button
                    className="admin-icon"
                    aria-label={`${item} 분류 위로 이동`}
                    disabled={busy || index === 0}
                    onClick={() => change("move", item, { direction: -1 })}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="admin-icon"
                    aria-label={`${item} 분류 아래로 이동`}
                    disabled={busy || index === state.taxonomy[kind].length - 1}
                    onClick={() => change("move", item, { direction: 1 })}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    className="admin-secondary"
                    onClick={() => {
                      setEditing(editing === item ? "" : item);
                      setNextName(item);
                      setReplacement("");
                    }}
                  >
                    관리
                  </button>
                </div>
              </div>
              {editing === item && (
                <div className="studio-taxonomy-edit">
                  <form
                    className="studio-inline-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void change("rename", item, { nextName });
                    }}
                  >
                    <Field
                      label={`${item} 새 이름`}
                      value={nextName}
                      onChange={setNextName}
                    />
                    <button
                      className="admin-secondary"
                      disabled={busy || nextName === item}
                    >
                      이름 변경
                    </button>
                  </form>
                  <div className="studio-note">
                    <strong>삭제와 연결 콘텐츠 처리</strong>
                    <p>
                      {kind === "categories"
                        ? "현재 초안 또는 게시본에서 사용하는 카테고리는 다른 분류를 선택한 뒤 삭제합니다. 연결된 콘텐츠의 분류도 함께 이동합니다."
                        : "삭제하면 현재 초안과 게시본의 태그 연결도 제거됩니다. 지난 이력은 보존됩니다."}
                    </p>
                    {kind === "categories" && (
                      <label className="studio-field">
                        <span>콘텐츠를 옮길 카테고리</span>
                        <select
                          value={replacement}
                          onChange={(e) => setReplacement(e.target.value)}
                        >
                          <option value="">이동할 분류 선택</option>
                          {state.taxonomy.categories
                            .filter((c) => c !== item)
                            .map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                        </select>
                      </label>
                    )}
                    <button
                      className="admin-secondary studio-danger"
                      disabled={
                        busy ||
                        (kind === "categories" &&
                          state.taxonomy.categories.length === 1)
                      }
                      onClick={() => change("remove", item, { replacement })}
                    >
                      {kind === "categories"
                        ? "이동 후 카테고리 삭제"
                        : "태그와 연결 삭제"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!state.taxonomy[kind].length && (
          <div className="admin-empty">아직 등록된 태그가 없습니다.</div>
        )}
      </div>
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="studio-success" role="status">
          {notice}
        </p>
      )}
    </>
  );
}
export function BackupPanel({
  state,
  refresh,
}: {
  state: AdminState;
  refresh: () => Promise<void>;
}) {
  const [fileName, setFileName] = useState("");
  const [payload, setPayload] = useState<unknown>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inspect = async () => {
    setBusy(true);
    setError("");
    try {
      setPreview(
        await adminRequest<ImportPreview>("/api/backup", {
          operation: "preview",
          backup: payload,
          mode,
        }),
      );
      setConfirmed(false);
    } catch (e) {
      setError((e as Error).message);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  };
  const apply = async () => {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      await adminRequest("/api/backup", {
        operation: "import",
        backup: payload,
        mode,
        token: preview.token,
      });
      await refresh();
      setPreview(null);
      setNotice(
        "가져오기를 완료했습니다. 적용 직전의 전체 콘텐츠는 복구 지점에 보관했습니다.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="studio-page-intro">
        <h2>백업·가져오기</h2>
        <p>
          초안·게시본·휴지통·카테고리·태그·변경 이력을 JSON으로 보관합니다. 실행
          코드와 시뮬레이션 소스는 프로젝트 폴더에서 함께 보관하세요.
        </p>
      </div>
      <section className="studio-panel">
        <h3>전체 콘텐츠 내보내기</h3>
        <p>
          현재 작업 공간을 파일로 내려받습니다. 다른 컴퓨터로 이전할 때 같은
          시뮬레이션이 등록된 프로젝트에서 가져오세요.
        </p>
        <a className="admin-primary" href="/api/backup" download>
          <Download size={16} />
          전체 콘텐츠 백업 다운로드
        </a>
      </section>
      <section className="studio-panel">
        <h3>백업 파일 가져오기</h3>
        <p>
          파일을 검토한 뒤 적용합니다. 이전 프로토타입의 version 1 JSON도 가져올
          수 있습니다.
        </p>
        <label className="studio-upload">
          <Upload size={22} />
          <strong>{fileName || "JSON 백업 파일 선택"}</strong>
          <span>최대 25MB</span>
          <input
            aria-label="JSON 백업 파일 선택"
            type="file"
            accept=".json,application/json"
            disabled={busy}
            onChange={async (e) => {
              setPreview(null);
              setPayload(null);
              setError("");
              setNotice("");
              const file = e.target.files?.[0];
              setFileName(file?.name || "");
              if (!file) return;
              try {
                if (file.size > 25 * 1024 * 1024)
                  throw Error("25MB 이하 파일을 선택하세요.");
                setPayload(JSON.parse(await file.text()));
              } catch (error) {
                setError(
                  error instanceof SyntaxError
                    ? "JSON 형식이 올바르지 않습니다."
                    : (error as Error).message,
                );
              }
            }}
          />
        </label>
        <fieldset className="studio-import-modes">
          <legend>가져오기 방식</legend>
          <label>
            <input
              type="radio"
              name="import-mode"
              checked={mode === "merge"}
              onChange={() => {
                setMode("merge");
                setPreview(null);
              }}
            />
            <span>
              <strong>병합</strong>
              <small>
                같은 id는 파일의 내용으로 갱신하고, 새 id는 추가합니다. 파일에
                없는 기존 콘텐츠는 유지합니다.
              </small>
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="import-mode"
              checked={mode === "replace"}
              onChange={() => {
                setMode("replace");
                setPreview(null);
              }}
            />
            <span>
              <strong>전체 교체</strong>
              <small>
                초안·게시본·분류·이력을 파일 기준으로 교체합니다. 파일에 없는
                콘텐츠는 제거됩니다.
              </small>
            </span>
          </label>
        </fieldset>
        <button
          className="admin-secondary"
          disabled={busy || payload === null}
          onClick={inspect}
        >
          변경 내용 검토
        </button>
        {preview && (
          <div className="studio-import-preview">
            <h4>적용할 변경 내용</h4>
            {preview.legacy && (
              <p>이전 형식입니다. 당시 기본 가이드를 연결해 변환합니다.</p>
            )}
            <div className="studio-summary-grid">
              <span>
                새 용어 <strong>{preview.added.length}</strong>
              </span>
              <span>
                덮어쓸 용어 <strong>{preview.updated.length}</strong>
              </span>
              <span>
                제거할 용어 <strong>{preview.removed.length}</strong>
              </span>
              <span>
                노출될 게시본 <strong>{preview.published}</strong>
              </span>
              <span>
                초안 <strong>{preview.drafts}</strong>
              </span>
              <span>
                이력 <strong>{preview.history}</strong>
              </span>
            </div>
            {[
              ["추가", preview.added],
              ["덮어쓰기", preview.updated],
              ["제거", preview.removed],
            ].map(
              ([label, names]) =>
                (names as string[]).length > 0 && (
                  <details key={String(label)} open>
                    <summary>{String(label)} 대상</summary>
                    <p>{(names as string[]).join(" · ")}</p>
                  </details>
                ),
            )}
            <p>
              카테고리 {preview.categories}개 · 태그 {preview.tags}개.{" "}
              {mode === "merge"
                ? "기존 분류와 함께 유지합니다."
                : "파일의 분류로 교체합니다."}
            </p>
            <label className="studio-confirm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>
                위 변경 내용과 {mode === "replace" ? "전체 교체" : "덮어쓰기"}{" "}
                대상을 확인했습니다.
              </span>
            </label>
            <button
              className="admin-primary"
              disabled={busy || !confirmed}
              onClick={apply}
            >
              {busy ? "적용 중…" : "검토한 내용 가져오기"}
            </button>
          </div>
        )}
        {error && (
          <p className="studio-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="studio-success" role="status">
            <Check size={16} />
            {notice}
          </p>
        )}
      </section>
      <section className="studio-panel">
        <h3>자동 복구 지점</h3>
        <p>
          기존 데이터 구조를 이전하거나 백업을 가져오기 전에 생성합니다.
          내려받은 파일을 위에서 검토하고 가져오면 복원할 수 있습니다.
        </p>
        {state.checkpoints.length ? (
          <ul className="studio-checkpoint-list">
            {state.checkpoints.map((point) => (
              <li key={point.id}>
                <div>
                  <strong>
                    {point.reason === "migration"
                      ? "기존 프로토타입 이전 전"
                      : point.reason === "catalog"
                        ? "콘텐츠 확장 전"
                        : "가져오기 적용 전"}
                  </strong>
                  <span>
                    {new Date(point.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <a
                  className="admin-secondary"
                  href={`/api/backup?checkpoint=${encodeURIComponent(point.id)}`}
                  download
                >
                  <Download size={14} />
                  다운로드
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="studio-muted">아직 생성된 복구 지점이 없습니다.</p>
        )}
      </section>
    </>
  );
}
export function RegistryPanel({ state }: { state: AdminState }) {
  return (
    <>
      <div className="studio-page-intro">
        <h2>시뮬레이션 등록부</h2>
        <p>
          등록된 동작을 용어의 기본 정보에서 선택할 수 있습니다. 실행 코드와
          복사 예제는 같은 원본에서 생성합니다.
        </p>
      </div>
      <div className="studio-registry-grid">
        {simulationRegistry.map((demo) => (
          <section key={demo.id} className="studio-panel">
            <span className="studio-eyebrow">{demo.id}</span>
            <h3>{demo.name}</h3>
            <p>{demo.description}</p>
            <dl>
              <dt>연결 콘텐츠</dt>
              <dd>
                {
                  state.terms.filter((t) => t.demoId === demo.id && !t.deleted)
                    .length
                }
                개
              </dd>
              <dt>시연 주기</dt>
              <dd>{(demo.duration / 1000).toFixed(1)}초</dd>
              <dt>코드</dt>
              <dd>React·TypeScript / HTML·CSS·JavaScript</dd>
            </dl>
          </section>
        ))}
      </div>
      <section className="studio-panel">
        <h3>개발자의 새 동작 등록 절차</h3>
        <ol className="studio-steps">
          <li>
            <strong>동작 구현</strong>
            <p>
              React 체험과 자동 시연을 만들고 HTML·JavaScript 예제 및 스타일을
              추가합니다.
            </p>
          </li>
          <li>
            <strong>등록부 연결</strong>
            <p>
              registry.ts에 고유 id, 이름, 컴포넌트, 주기·대표 장면·단계 설명을
              등록하고 sceneMap에 연결합니다.
            </p>
          </li>
          <li>
            <strong>콘텐츠 작성과 검사</strong>
            <p>
              기본 가이드를 준비한 뒤 npm run demos, npm test, npm run build로
              등록·예제·타입을 확인합니다.
            </p>
          </li>
          <li>
            <strong>관리자에서 연결</strong>
            <p>
              서버를 다시 실행하면 선택 목록에 나타납니다. 용어를 작성해 저장된
              초안을 확인하고 게시합니다.
            </p>
          </li>
        </ol>
        <p className="studio-muted">
          파일별 절차와 검사 기준은 프로젝트의 docs/simulation-registration.md에
          정리했습니다.
        </p>
      </section>
    </>
  );
}
