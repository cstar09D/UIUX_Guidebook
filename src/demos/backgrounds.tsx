import { DemoSelect } from "./select-controls";
import { useEffect, useRef, useState, type ReactNode } from "react";
type SceneProps = {
  preview?: boolean;
  time?: number;
  paused?: boolean;
  reduced?: boolean;
};
function useBackgroundTime(
  preview: boolean,
  time: number,
  paused: boolean,
  reduced: boolean,
) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (preview || paused || reduced) return;
    let frame = 0,
      last = 0;
    const tick = (at: number) => {
      if (last) setElapsed((v) => v + Math.min(at - last, 80));
      last = at;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [preview, paused, reduced]);
  return (preview ? time * 2 : elapsed) / 1000;
}
function BackgroundFrame({
  kind,
  title,
  preview,
  children,
  controls,
  dark = false,
}: {
  kind: string;
  title: string;
  preview: boolean;
  children: ReactNode;
  controls: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`scene bg-scene scene-${kind} ${preview ? "is-preview" : ""}`}
    >
      <div className="bg-card">
        <h2>{title}</h2>
        <div className={`bg-window ${dark ? "bg-dark" : ""}`}>
          <div className="bg-art" aria-hidden="true">
            {children}
          </div>
          <div className="bg-caption">
            <span>BACKGROUND STUDY</span>
            <strong>
              Design
              <br />
              in motion.
            </strong>
            <span>배경 위의 내용은 선명하게</span>
          </div>
        </div>
        {!preview && (
          <div className="bg-controls">
            {controls}
            <p>배경은 장식 레이어이며 글자와 버튼의 조작을 가로채지 않아요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
function BackgroundRange({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  unit?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>
        {value}
        {unit}
      </output>
    </label>
  );
}
export function MeshGradientScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const t = useBackgroundTime(preview, time, paused, reduced),
    [hue, setHue] = useState(0);
  return (
    <BackgroundFrame
      kind="mesh-gradient"
      title="부드럽게 섞이는 색면"
      preview={preview}
      controls={
        <BackgroundRange
          label="색상 회전"
          value={hue}
          min={0}
          max={180}
          onChange={setHue}
          unit="°"
        />
      }
    >
      <div
        className="bg-mesh"
        style={{
          filter: `hue-rotate(${hue}deg)`,
          background: `radial-gradient(ellipse at ${25 + Math.sin(t * 0.78) * 15}% ${30 + Math.cos(t * 0.78) * 20}%,#78b7de 0%,transparent 65%),radial-gradient(ellipse at ${75 + Math.cos(t * 0.78) * 18}% ${60 + Math.sin(t * 0.78) * 18}%,#97cdbd 0%,transparent 65%),radial-gradient(ellipse at 45% 100%,#e7b8ca 0%,transparent 65%),#e8e8f4`,
        }}
      />
    </BackgroundFrame>
  );
}
export function AuroraScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const clock = useBackgroundTime(preview, time, paused, reduced),
    [speed, setSpeed] = useState(1),
    t = clock * speed;
  return (
    <BackgroundFrame
      kind="aurora"
      title="커튼처럼 일렁이는 빛"
      preview={preview}
      dark
      controls={
        <BackgroundRange
          label="오로라 속도"
          value={speed}
          min={0.5}
          max={2}
          step={0.5}
          onChange={setSpeed}
          unit="배"
        />
      }
    >
      <div className="bg-aurora">
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            style={{
              left: `${i * 28 - 8}%`,
              transform: `translateY(${Math.sin(t * 0.78 + i) * 22}%) rotate(${20 + Math.sin(t * 0.78 + i) * 10}deg) skewX(${Math.cos(t * 0.78 + i) * 14}deg)`,
              background: ["#4dbfab", "#6a98e2", "#aa80d3"][i],
            }}
          />
        ))}
      </div>
    </BackgroundFrame>
  );
}
const grainSource = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="3" seed="7" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".8"/></svg>')}`;
export function GrainScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const t = useBackgroundTime(preview, time, paused, reduced),
    [strength, setStrength] = useState(22);
  return (
    <BackgroundFrame
      kind="grain"
      title="표면에 더하는 미세한 질감"
      preview={preview}
      controls={
        <BackgroundRange
          label="입자 강도"
          value={strength}
          min={0}
          max={55}
          onChange={setStrength}
          unit="%"
        />
      }
    >
      <div className="bg-grain-base" />
      <div
        className="bg-grain-noise"
        style={{
          backgroundImage: `url("${grainSource}")`,
          opacity: (preview ? 14 + Math.sin(t * 0.78) * 8 : strength) / 100,
          transform: `translate(${Math.sin(t * 2.35) * 2}%,${Math.cos(t * 2.35) * 2}%)`,
        }}
      />
    </BackgroundFrame>
  );
}
export function DotGridScene({ preview = false, time = 1700 }: SceneProps) {
  const [gap, setGap] = useState(22),
    spacing = preview
      ? 18 + Math.round((Math.sin((time / 4000) * Math.PI * 2) + 1) * 5)
      : gap;
  return (
    <BackgroundFrame
      kind="dot-grid"
      title="일정한 간격으로 놓인 점"
      preview={preview}
      controls={
        <BackgroundRange
          label="점 간격"
          value={gap}
          min={12}
          max={40}
          onChange={setGap}
          unit="px"
        />
      }
    >
      <div
        className="bg-dots"
        style={{ backgroundSize: `${spacing}px ${spacing}px` }}
      />
    </BackgroundFrame>
  );
}
export function BeamsScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const clock = useBackgroundTime(preview, time, paused, reduced),
    [speed, setSpeed] = useState(1),
    t = clock * speed;
  return (
    <BackgroundFrame
      kind="beams"
      title="선을 따라 흐르는 빛줄기"
      preview={preview}
      dark
      controls={
        <BackgroundRange
          label="빛줄기 속도"
          value={speed}
          min={0.5}
          max={2}
          step={0.5}
          onChange={setSpeed}
          unit="배"
        />
      }
    >
      <div className="bg-beams">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ left: `${10 + i * 14}%` }}>
            <b style={{ top: `${((t / 3 + i * 0.19) % 1) * 150 - 25}%` }} />
          </i>
        ))}
      </div>
    </BackgroundFrame>
  );
}
export function BlobScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const clock = useBackgroundTime(preview, time, paused, reduced),
    [speed, setSpeed] = useState(1),
    t = clock * speed;
  return (
    <BackgroundFrame
      kind="blob"
      title="윤곽을 바꾸는 유기적인 덩어리"
      preview={preview}
      controls={
        <BackgroundRange
          label="형태 변화 속도"
          value={speed}
          min={0.5}
          max={2}
          step={0.5}
          onChange={setSpeed}
          unit="배"
        />
      }
    >
      <div className="bg-blobs">
        {[0, 1].map((i) => (
          <i
            key={i}
            style={{
              left: `${i ? 45 : 0}%`,
              background: i ? "#a8cdbf" : "#9cbbdf",
              transform: `translate(${Math.sin(t * 0.78 + i * 2) * 14}%,${Math.cos(t * 0.78 + i) * 15}%) rotate(${Math.sin(t * 0.78) * 25}deg)`,
              borderRadius: `${45 + Math.sin(t * 0.78 + i) * 15}% ${55 - Math.sin(t * 0.78 + i) * 15}% 40% 60% / 55% 35% 65% 45%`,
            }}
          />
        ))}
      </div>
    </BackgroundFrame>
  );
}
export function GlowOrbScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const t = useBackgroundTime(preview, time, paused, reduced),
    [strength, setStrength] = useState(65);
  return (
    <BackgroundFrame
      kind="glow-orb"
      title="경계 없이 번지는 빛의 구"
      preview={preview}
      dark
      controls={
        <BackgroundRange
          label="빛의 강도"
          value={strength}
          min={20}
          max={100}
          onChange={setStrength}
          unit="%"
        />
      }
    >
      <div className="bg-orbs">
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            style={{
              left: `${i * 30}%`,
              top: `${25 + Math.sin(t * 0.78 + i) * 25}%`,
              background: ["#3d88dc", "#6d7be4", "#4bbda8"][i],
              opacity: strength / 100,
              transform: `translateX(${Math.cos(t * 0.78 + i) * 24}%) scale(${1 + Math.sin(t * 0.78 + i) * 0.14})`,
            }}
          />
        ))}
      </div>
    </BackgroundFrame>
  );
}
function backgroundSeed(i: number) {
  return ((i * 7919 + 104729) % 997) / 997;
}
export function ParticlesScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const t = useBackgroundTime(preview, time, paused, reduced),
    [mode, setMode] = useState("floating"),
    [burst, setBurst] = useState(0),
    [celebrated, setCelebrated] = useState(false),
    [density, setDensity] = useState(24),
    count = preview ? 18 : density;
  const confetti = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => setBurst(0), 1200);
    const stop = () => setBurst(0),
      visibility = () => {
        if (document.hidden) stop();
      };
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) stop();
    });
    if (confetti.current) observer.observe(confetti.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [burst]);
  return (
    <BackgroundFrame
      kind="particles"
      title="가볍게 떠다니는 작은 입자"
      preview={preview}
      dark
      controls={
        <>
          <label className="bg-option">
            입자 용도
            <DemoSelect
              data-particle-mode
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setBurst(0);
              }}
            >
              <option value="floating">지속 부유 배경</option>
              <option value="confetti">한 번만 축하하기</option>
            </DemoSelect>
          </label>
          <button
            data-confetti-start
            disabled={burst > 0}
            onClick={() => {
              setCelebrated(true);
              if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
                setBurst((v) => v + 1);
            }}
          >
            작업 완료 · 축하
          </button>
          <p data-confetti-status role="status">
            {celebrated
              ? "작업 완료! 축하 동작은 모의이며 데이터를 저장하지 않습니다."
              : "배경과 일회성 성공 모션의 차이를 비교하세요."}
          </p>
          <BackgroundRange
            label="입자 수"
            value={density}
            min={8}
            max={48}
            step={4}
            onChange={setDensity}
            unit="개"
          />
        </>
      }
    >
      <div className="bg-particles" hidden={!preview && mode === "confetti"}>
        {Array.from({ length: count }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${5 + backgroundSeed(i) * 90 + Math.sin(t * 0.78 + i) * 3}%`,
              top: `${5 + backgroundSeed(i + 31) * 85 + Math.cos(t * 0.78 + i * 0.7) * 4}%`,
              width: 2 + backgroundSeed(i + 8) * 4,
              height: 2 + backgroundSeed(i + 8) * 4,
              opacity: 0.25 + backgroundSeed(i + 12) * 0.6,
            }}
          />
        ))}
      </div>
      {!preview && burst > 0 && (
        <div className="bg-confetti" key={burst} ref={confetti}>
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${10 + i * 3.4}%`,
                background: ["#6fa5ff", "#f3b658", "#ec8ea8", "#80d0b3"][i % 4],
                animationDelay: `${i * 8}ms`,
                rotate: `${i * 37}deg`,
              }}
            />
          ))}
        </div>
      )}
    </BackgroundFrame>
  );
}
export function StarfieldScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const clock = useBackgroundTime(preview, time, paused, reduced),
    [speed, setSpeed] = useState(1),
    t = clock * speed;
  return (
    <BackgroundFrame
      kind="starfield"
      title="앞으로 다가오는 별의 깊이"
      preview={preview}
      dark
      controls={
        <BackgroundRange
          label="전진 속도"
          value={speed}
          min={0.5}
          max={2}
          step={0.5}
          onChange={setSpeed}
          unit="배"
        />
      }
    >
      <div className="bg-stars">
        {Array.from({ length: 36 }, (_, i) => {
          const angle = backgroundSeed(i) * Math.PI * 2,
            z = (backgroundSeed(i + 20) + t * 0.09) % 1,
            depth = z * z;
          return (
            <i
              key={i}
              style={{
                left: `${Number((50 + Math.cos(angle) * depth * 85).toFixed(3))}%`,
                top: `${Number((50 + Math.sin(angle) * depth * 90).toFixed(3))}%`,
                width: Number((0.6 + depth * 4).toFixed(3)),
                height: Number((0.6 + depth * 4).toFixed(3)),
                opacity: Number(z.toFixed(3)),
                transform: `rotate(${Number(angle.toFixed(3))}rad) scaleX(${Number((1 + depth * 1.2).toFixed(3))})`,
              }}
            />
          );
        })}
      </div>
    </BackgroundFrame>
  );
}
