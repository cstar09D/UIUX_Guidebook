"use client";
import { DemoSelect } from "@/demos/select-controls";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { DemoId } from "@/lib/catalog";
import type { ScreenExample } from "@/lib/guide-content";
import sources from "@/generated/sources.json";
import styles from "@/generated/styles.json";
import MotionPreview from "./MotionPreview";
import SimulationStateScreen from "./SimulationStateScreen";
import { scenarioIds, isLiveScenario } from "@/demos/scenario-contract.mjs";

/** One renderer for the public experience and the administrator's unsaved preview. */
export default function SimulationExperience({
  id,
  examples,
  format = "react",
  mobile = false,
  reset = 0,
}: {
  id: DemoId;
  examples: ScreenExample[];
  format?: "react" | "html";
  mobile?: boolean;
  reset?: number;
}) {
  // Remount on a different demo or reset, while keeping device/format changes local.
  return (
    <Experience
      key={`${id}-${reset}`}
      id={id}
      examples={examples}
      format={format}
      mobile={mobile}
    />
  );
}
function Experience({
  id,
  examples,
  format,
  mobile,
}: {
  id: DemoId;
  examples: ScreenExample[];
  format: "react" | "html";
  mobile: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  useEffect(() => setNonce(crypto.randomUUID()), []);
  const frame = useRef<HTMLIFrameElement>(null);
  const panelId = useId();
  const selectedRef = useRef<string | null>(null);
  const ready = useRef(false);
  const example = examples.find((item) => item.id === selected);
  const live = Object.hasOwn(scenarioIds, id);
  const explanationOnly = !!example && !isLiveScenario(id, example.id);
  const selectedKey = example?.id || null;
  selectedRef.current = selectedKey;
  const sendScenario = () => {
    if (!nonce) return;
    frame.current?.contentWindow?.postMessage(
      {
        nonce,
        id,
        command: "scenario",
        value: selectedRef.current || "default",
      },
      "*",
    );
  };
  const srcDoc = useMemo(
    () =>
      !nonce
        ? ""
        : format === "html"
          ? sources[id].html.replace(
              "</head>",
              `<script>window.__DEMO__=${JSON.stringify({ id, reduced: false, nonce })};<\/script></head>`,
            )
          : `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;background:#fbfcfe}[hidden]{display:none!important}${styles.css}</style></head><body><div id="root"></div><script>window.__DEMO__=${JSON.stringify({ id, reduced: false, nonce })};<\/script><script src="${typeof window !== "undefined" ? window.location.origin : ""}/demo-bundle.js"><\/script></body></html>`,
    [id, format, nonce],
  );
  useEffect(() => {
    if (!nonce) return;
    const update = () =>
      frame.current?.contentWindow?.postMessage(
        {
          nonce,
          command: "pause",
          value: document.hidden || explanationOnly,
        },
        "*",
      );
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, [nonce, explanationOnly]);
  useEffect(() => {
    if (!nonce) return;
    ready.current = false;
    const receive = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.data?.nonce !== nonce ||
        event.data?.id !== id
      )
        return;
      if (event.data.type === "demo:ready") {
        ready.current = true;
        // A fresh frame initializes its own default. Only restore an explicit preset.
        if (selectedRef.current) sendScenario();
      }
      if (
        ready.current &&
        event.data.type === "demo:state" &&
        isLiveScenario(id, event.data.state)
      ) {
        setSelected(event.data.state === "default" ? null : event.data.state);
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [id, format, nonce]);
  useEffect(() => {
    if (live && ready.current) sendScenario();
  }, [live, selectedKey]);
  return (
    <div className="simulation-experience">
      {examples.length > 0 && (
        <label className="simulation-state-controls">
          <span>체험 상태</span>
          <DemoSelect
            aria-label="시뮬레이션 상태"
            aria-controls={panelId}
            value={example?.id || ""}
            onChange={(event) => setSelected(event.target.value || null)}
          >
            <option value="">기본 체험 · 직접 조작</option>
            {examples.map((item, index) => (
              <option key={item.id} value={item.id}>
                {item.label || `상태 ${index + 1}`}
              </option>
            ))}
          </DemoSelect>
        </label>
      )}
      <div
        className={`experience-stage ${mobile ? "mobile-width" : ""}`}
        id={panelId}
      >
        <div className="stage-inner">
          {nonce ? (
            <iframe
              ref={frame}
              onLoad={() =>
                frame.current?.contentWindow?.postMessage(
                  { nonce, id, command: "hello" },
                  "*",
                )
              }
              key={format}
              hidden={explanationOnly}
              title={`${id} ${format === "html" ? "HTML" : "React"} 직접 체험`}
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-forms"
            />
          ) : (
            <p className="simulation-loading" role="status">
              시뮬레이션을 준비하고 있어요.
            </p>
          )}
          {explanationOnly && example && (
            <div className="simulation-state-panel" key={example.id}>
              <figure className="simulation-state-figure">
                <SimulationStateScreen id={id} example={example} />
                <figcaption>
                  <span className="example-label">
                    {example.label} · 상태 확인
                  </span>
                  <strong>{example.title}</strong>
                  <dl>
                    <dt>언제 나타나나요?</dt>
                    <dd>{example.condition}</dd>
                    <dt>어떻게 처리하나요?</dt>
                    <dd>{example.explanation}</dd>
                  </dl>
                  <button
                    type="button"
                    className="simulation-return"
                    onClick={() => setSelected(null)}
                  >
                    기본 체험으로 돌아가기
                  </button>
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      </div>
      {live && example && !explanationOnly && (
        <details className="simulation-live-guide">
          <summary>{example.label} · 상태와 처리 방법</summary>
          <strong>{example.title}</strong>
          <dl>
            <dt>언제 나타나나요?</dt>
            <dd>{example.condition}</dd>
            <dt>어떻게 처리하나요?</dt>
            <dd>{example.explanation}</dd>
          </dl>
        </details>
      )}
      <div className="experience-caption">
        <span>
          {explanationOnly
            ? "선택한 상황의 화면과 처리 방법입니다. UI 조작은 기본 체험에서 확인하세요."
            : "화면 안의 UI를 직접 조작해 보세요."}
        </span>
        <span className="frame-format">
          {explanationOnly
            ? "상태 안내"
            : format === "react"
              ? "React · TS"
              : "HTML · JS"}
        </span>
      </div>
    </div>
  );
}

export function SimulationPreview({
  id,
  examples,
}: {
  id: DemoId;
  examples: ScreenExample[];
}) {
  const [view, setView] = useState("live");
  const [mobile, setMobile] = useState(false);
  const [format, setFormat] = useState<"react" | "html">("react");
  const [reset, setReset] = useState(0);
  return (
    <div className="studio-simulation-preview">
      <div className="studio-simulation-toolbar">
        <div role="group" aria-label="시뮬레이션 미리보기 방식">
          <button
            type="button"
            aria-pressed={view === "motion"}
            onClick={() => setView("motion")}
          >
            목록 애니메이션
          </button>
          <button
            type="button"
            aria-pressed={view === "live"}
            onClick={() => setView("live")}
          >
            직접 체험 · 상태
          </button>
        </div>
        {view === "live" && (
          <div role="group" aria-label="미리보기 기기와 코드">
            <button
              type="button"
              aria-pressed={!mobile}
              onClick={() => setMobile(false)}
            >
              PC
            </button>
            <button
              type="button"
              aria-pressed={mobile}
              onClick={() => setMobile(true)}
            >
              모바일
            </button>
            <label>
              <span className="sr-only">미리보기 코드 형식</span>
              <DemoSelect
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as "react" | "html")
                }
              >
                <option value="react">React · TS</option>
                <option value="html">HTML · JS</option>
              </DemoSelect>
            </label>
            <button
              type="button"
              onClick={() => setReset((value) => value + 1)}
            >
              초기화
            </button>
          </div>
        )}
      </div>
      {view === "motion" ? (
        <div className="studio-motion-preview">
          <MotionPreview key={id} id={id} />
        </div>
      ) : (
        <SimulationExperience
          id={id}
          examples={examples}
          format={format}
          mobile={mobile}
          reset={reset}
        />
      )}
      <p className="studio-simulation-help">
        기본 체험에서는 UI를 직접 조작하고, 체험 상태를 선택하면 각 상황의
        화면·발생 조건·처리 방법을 확인할 수 있습니다. 애니메이션과 실제 동작의
        구조를 변경하려면 개발 소스를 수정해야 합니다.
      </p>
    </div>
  );
}
