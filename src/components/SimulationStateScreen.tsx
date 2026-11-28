"use client";
import { ChevronDown } from "lucide-react";
import { effectDefinitions } from "@/lib/effect-definitions";
import { backgroundDefinitions } from "@/lib/background-content";
import { sceneMap } from "@/demos/scenes";
import type { DemoId } from "@/lib/catalog";
import type { ScreenExample } from "@/lib/guide-content";

export default function SimulationStateScreen({
  id,
  example,
}: {
  id: DemoId;
  example: ScreenExample;
}) {
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
