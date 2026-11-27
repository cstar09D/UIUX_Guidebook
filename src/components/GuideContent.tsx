"use client";
import { useState } from "react";
import MotionPreview from "./MotionPreview";
import { effectDefinitions } from "@/lib/effect-definitions";
import { backgroundDefinitions } from "@/lib/background-content";
import { sceneMap } from "@/demos/scenes";
import {
  BookOpen,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import { type DemoId } from "@/lib/catalog";
import type { Content } from "@/lib/content";
import {
  type DetailedGuide,
  type GuidePoint,
  type RoleName,
  type ScreenExample,
} from "@/lib/guide-content";

function Points({
  items,
  ordered = false,
  terms = [],
  onNavigate,
}: {
  items: GuidePoint[];
  ordered?: boolean;
  terms?: Content[];
  onNavigate?: (term: Content) => void;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`guide-points ${ordered ? "ordered" : ""}`}>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
          {item.targetDemoId &&
            (() => {
              const target =
                terms.find((t) => t.id === item.targetDemoId) ||
                terms.find((t) => t.demoId === item.targetDemoId);
              return target ? (
                <a
                  className="alternative-link"
                  href={`?term=${encodeURIComponent(target.id)}`}
                  onClick={(e) => {
                    if (
                      !onNavigate ||
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    )
                      return;
                    e.preventDefault();
                    onNavigate(target);
                  }}
                >
                  <MotionPreview key={target.demoId} id={target.demoId} />
                  <span className="alternative-card-caption">
                    <strong>{target.english}</strong>
                    <span>{target.korean}</span>
                  </span>
                </a>
              ) : (
                <span className="alternative-unavailable">
                  현재 공개된 대안 상세가 없습니다.
                </span>
              );
            })()}
        </li>
      ))}
    </Tag>
  );
}
function Screen({ id, example }: { id: DemoId; example: ScreenExample }) {
  const s = example.screen;
  const Effect = [...effectDefinitions, ...backgroundDefinitions].some(
    (d) => d.id === id,
  )
    ? sceneMap[id]
    : null;
  const contents = (
    <>
      <div className="example-screen-title">{s.title}</div>
      {Effect && (
        <div className="example-effect-stage" aria-hidden="true" inert>
          <Effect
            preview
            time={
              example.id === "hotspot-bubble"
                ? 2300
                : example.id === "hotspot-edge"
                  ? 3000
                  : example.id === "active"
                    ? 1700
                    : 0
            }
          />
        </div>
      )}
      {(id === "date-picker" || id === "date-range-picker") && (
        <div className="example-date-grid" aria-hidden="true">
          {Array.from({ length: 35 }, (_, i) => (
            <span
              key={i}
              className={
                example.id === "range" && i + 1 >= 16 && i + 1 <= 20
                  ? "selected"
                  : i + 1 ===
                      (example.id === "range"
                        ? 16
                        : example.id === "unavailable"
                          ? 26
                          : example.id === "applied"
                            ? 18
                            : 16)
                    ? example.id === "unavailable"
                      ? "invalid"
                      : example.id === "applied"
                        ? "selected"
                        : "active"
                    : i < 30 && (i % 7 === 0 || i + 1 === 26)
                      ? "unavailable"
                      : ""
              }
            >
              {i < 30 ? i + 1 : ""}
            </span>
          ))}
        </div>
      )}
      {id === "file-upload" && (
        <div className="example-file-zone" aria-hidden="true">
          ⇧　PDF · PNG · JPG
        </div>
      )}
      {id === "stepper" && (
        <div className="example-step-track" aria-hidden="true">
          {["기본 정보", "공개 범위", "검토"].map((title, i) => (
            <span
              key={i}
              className={
                i ===
                (example.id === "review" ? 2 : example.id === "current" ? 1 : 0)
                  ? "current"
                  : ""
              }
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}
      {id === "card" && (
        <div className="example-note-cover" aria-hidden="true">
          UI NOTES
        </div>
      )}
      {id === "floating-action-button" && example.id === "ready" && (
        <span className="example-fab-mark" aria-hidden="true">
          ＋
        </span>
      )}
      {id === "alert-dialog" && example.id !== "restored" && (
        <span className="example-alert-mark" aria-hidden="true">
          !
        </span>
      )}
      {id === "progress-bar" && (
        <div className="example-progress-track" aria-hidden="true">
          <i
            style={{
              width:
                example.id === "done"
                  ? "100%"
                  : example.id === "failed"
                    ? "60%"
                    : "40%",
            }}
          />
        </div>
      )}
      {id === "loading-spinner" && example.id === "loading" && (
        <div className="example-spinner-ring" aria-hidden="true" />
      )}
      {id === "slider" && (
        <div className="example-range-illustration" aria-hidden="true">
          <i style={{ width: example.id === "number" ? "75%" : "50%" }} />
          <b style={{ left: example.id === "number" ? "75%" : "50%" }} />
        </div>
      )}
      {id === "combobox" && (
        <div className="example-input">
          {s.body}
          <span className="example-chevron" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>
      )}
      {id === "skeleton" && example.id === "loading" && (
        <div className="example-skeleton-shapes" aria-hidden="true">
          <i />
          <b />
          <b />
          <em />
        </div>
      )}
      {id === "skeleton" && example.id === "success" && (
        <div className="example-cover" aria-hidden="true">
          DESIGN NOTES
        </div>
      )}
      {id === "switch" && (
        <div className="example-switch-state" aria-hidden="true">
          <i className={example.id === "pending" ? "is-on" : ""} />
          <span>{example.id === "pending" ? "켜짐 · 저장 중" : "꺼짐"}</span>
        </div>
      )}
      {id === "select" && (
        <div
          className={`example-native-select ${s.tone === "error" ? "invalid" : ""}`}
        >
          {example.id === "selected" ? "매주" : "주기를 선택해 주세요"}
          <span className="example-chevron" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>
      )}
      {id === "tooltip" && example.id === "focus" && (
        <div className="example-tip-bubble">
          목록에서 숨기고 보관함으로 이동합니다.
        </div>
      )}
      {id === "easing" && (
        <div className="example-easing-tracks" aria-hidden="true">
          {["일정 속도", "선택 곡선"].map((label, index) => (
            <div key={label}>
              <span>{label}</span>
              <div>
                <i
                  style={{
                    left: `${example.id === "start" ? 0 : example.id === "complete" ? 100 : index === 0 ? 50 : 32}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {id === "carousel" && (
        <div className="example-carousel-position" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i
              className={
                i ===
                (example.id === "second" ? 1 : example.id === "wrap" ? 2 : 0)
                  ? "active"
                  : ""
              }
              key={i}
            />
          ))}
        </div>
      )}
      {s.items && (
        <div className="example-items">
          {s.items.map((item, index) =>
            id === "data-grid" || id === "data-table" ? (
              <div className="example-grid-row" key={index}>
                {item.split("|").map((cell, column) => (
                  <span
                    key={column}
                    className={
                      index === 0 && column === 1
                        ? `example-cell-${example.id}`
                        : ""
                    }
                  >
                    {cell}
                  </span>
                ))}
              </div>
            ) : (
              <div
                key={index}
                className={
                  id === "combobox" && index === 1
                    ? "example-active"
                    : id === "checkbox" ||
                        id === "radio-group" ||
                        id === "popover"
                      ? "example-choice-row"
                      : id === "tabs" && index === 0
                        ? "example-tabs-row"
                        : ""
                }
              >
                {item}
              </div>
            ),
          )}
        </div>
      )}
      {id !== "combobox" && (
        <p className={s.tone === "error" ? "example-error" : ""}>{s.body}</p>
      )}
      {s.action &&
        !(id === "floating-action-button" && example.id === "ready") && (
          <span
            className={`example-action ${s.tone === "error" ? "retry" : ""}`}
          >
            {s.action}
          </span>
        )}
    </>
  );
  return (
    <div
      className={`example-screen example-${id} variant-${example.id} tone-${s.tone || "default"}`}
    >
      {(id === "modal" || id === "bottom-sheet" || id === "alert-dialog") && (
        <div className="example-background" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      )}
      <div className="example-surface">
        {id === "bottom-sheet" && (
          <i className="example-handle" aria-hidden="true" />
        )}
        {contents}
      </div>
      {id === "bottom-sheet" && example.id === "keyboard" && (
        <div className="example-keyboard" aria-hidden="true">
          가상 키보드 영역
        </div>
      )}
    </div>
  );
}
function Examples({ id, examples }: { id: DemoId; examples: ScreenExample[] }) {
  const [selected, setSelected] = useState(examples[0]?.id);
  const example = examples.find((item) => item.id === selected) || examples[0];
  if (!example) return null;
  return (
    <section className="guide-examples" aria-label="상황별 화면 예시">
      <h3>화면으로 이해하기</h3>
      <p className="section-intro">
        상태를 선택해 화면과 처리 방법을 비교해 보세요.
      </p>
      <div className="example-switch" role="group" aria-label="화면 예시 선택">
        {examples.map((item) => (
          <button
            key={item.id}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <figure>
        <Screen id={id} example={example} />
        <figcaption>
          <span className="example-label">설명용 화면 예시</span>
          <strong>{example.title}</strong>
          <dl>
            <dt>언제 나타나나요?</dt>
            <dd>{example.condition}</dd>
            <dt>어떻게 처리하나요?</dt>
            <dd>{example.explanation}</dd>
          </dl>
        </figcaption>
      </figure>
    </section>
  );
}
export function GuideContent({
  content,
  terms = [],
  onNavigate,
}: {
  content: Content;
  terms?: Content[];
  onNavigate?: (term: Content) => void;
}) {
  const { demoId: id, guide } = content;
  return (
    <div className="detailed-guide">
      <h3>어떤 UI인가요?</h3>
      <p>{guide.introduction}</p>
      <h3>이럴 때 사용해요</h3>
      <Points items={guide.uses} />
      <h3>이럴 땐 다른 UI를 추천해요</h3>
      <Points
        items={guide.alternatives}
        terms={terms}
        onNavigate={onNavigate}
      />

      <Examples key={id} id={id} examples={guide.examples} />
      <h3>사용 흐름과 처리 방법</h3>
      <Points items={guide.flow} ordered />
      <div className="practice-note">
        <BookOpen size={18} />
        <div>
          <strong>직접 확인해 보세요</strong>
          <p>{guide.practice}</p>
        </div>
      </div>
      <h3>실수하기 쉬운 부분</h3>
      <Points items={guide.pitfalls} />
      <div className="detail-device">
        {content.devices.platforms.includes("PC") && <Monitor size={15} />}{" "}
        {content.devices.platforms.includes("모바일") && (
          <Smartphone size={14} />
        )}
        <strong>{content.devices.platforms.join(" · ")}</strong>
        <span>{content.devices.inputs.join(" · ")}</span>
      </div>
      {content.sourceUrl && (
        <a
          className="source-link"
          href={content.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          공식 문서 확인
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}
export function RoleContent({
  guide: details,
  role,
}: {
  guide: DetailedGuide;
  role: RoleName;
}) {
  const guide = details.roles[role];
  return (
    <div className="role-detail">
      <div className="role-goal">
        <span>{role}의 목표</span>
        <h4>{guide.goal}</h4>
      </div>
      <h3>구체적으로 해야 할 일</h3>
      <Points items={guide.tasks} ordered />
      <div className="handoff-note">
        <strong>정책·협업 전달 예시</strong>
        <p>{guide.handoff}</p>
      </div>
      <h3>완료 전 확인하세요</h3>
      <ul className="role-checks">
        {guide.checks.map((check, index) => (
          <li key={index}>
            <CheckCircle2 size={16} />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
