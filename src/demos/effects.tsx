import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
type SceneProps = {
  preview?: boolean;
  time?: number;
  reduced?: boolean;
  paused?: boolean;
};
const artNames = ["바다와 해안", "산과 호수", "햇빛이 드는 집"];
function artSource(index = 0) {
  const scenes = [
    '<rect width="640" height="400" fill="#bfdedc"/><path d="M0 110Q220 40 640 160V400H0" fill="#6da9ac"/><path d="M0 210Q220 130 640 250V400H0" fill="#3f8791"/><path d="M640 90Q220 200 160 400H640" fill="#f2ddbd"/><path d="M640 100Q200 220 150 400" stroke="#fff9ed" stroke-width="12" fill="none"/><circle cx="102" cy="77" r="29" fill="#fff3d6"/><path d="m450 307 33-48 35 48z" fill="#f9faf2"/><path d="M483 255v76" stroke="#a88468" stroke-width="5"/>',
    '<rect width="640" height="400" fill="#e5e4db"/><circle cx="470" cy="78" r="34" fill="#f0c999"/><path d="M0 225 156 68 300 237 425 135 640 260V400H0" fill="#a4b5b8"/><path d="M0 289 235 133 408 294 540 210 640 267V400H0" fill="#63858b"/><path d="M0 338Q280 266 640 348V400H0" fill="#365b65"/><path d="M240 333 426 400H37Z" fill="#b8d2d1"/><path d="m260 352 55 4m-115 18h93" stroke="#eff6ef" stroke-width="3"/>',
    '<rect width="640" height="400" fill="#e7d9c5"/><path d="M0 320h640v80H0" fill="#bfaa91"/><rect x="350" y="60" width="200" height="215" rx="95" fill="#f5eee0"/><path d="M450 60v215M350 160h200" stroke="#d1bfa8" stroke-width="8"/><path d="m350 275 200-115v190H350z" fill="#fdf6e6" opacity=".55"/><rect x="90" y="213" width="180" height="105" rx="24" fill="#91a59c"/><rect x="110" y="177" width="140" height="90" rx="28" fill="#a8bbb0"/><path d="M113 318v25m132-25v25" stroke="#7b6a55" stroke-width="9"/><ellipse cx="357" cy="290" rx="48" ry="12" fill="#a18160"/><path d="M357 290v53" stroke="#927353" stroke-width="12"/><path d="M350 272v-71m0 35-20-22m20 8 20-25" stroke="#6d836b" stroke-width="5"/><ellipse cx="330" cy="211" rx="14" ry="7" fill="#84977a"/><ellipse cx="370" cy="198" rx="14" ry="7" fill="#84977a"/>',
  ];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">${scenes[index % 3]}</svg>`)}`;
}
function Artwork({
  index = 0,
  className = "",
  style,
  alt,
}: {
  index?: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}) {
  return (
    <img
      className={`fx-art ${className}`}
      src={artSource(index)}
      alt={alt ?? artNames[index % 3]}
      style={style}
      draggable={false}
    />
  );
}
function EffectFrame({
  title,
  kind,
  preview = false,
  children,
}: {
  title: string;
  kind: string;
  preview?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`scene fx-scene scene-${kind} ${preview ? "is-preview" : ""}`}
    >
      <div className="fx-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
function useEffectPointer(preview: boolean, time: number) {
  const [position, setPosition] = useState({ x: 50, y: 50, active: false });
  const ref = useRef<HTMLDivElement>(null);
  const point = preview
    ? {
        x: 50 + Math.sin(time / 570) * 30,
        y: 50 + Math.cos(time / 690) * 22,
        active: time > 250 && time < 3600,
      }
    : position;
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (preview) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
      active: true,
    });
  };
  return {
    ref,
    point,
    handlers: {
      onPointerMove: move,
      onPointerLeave: () => setPosition({ x: 50, y: 50, active: false }),
      onPointerDown: move,
      onPointerCancel: () => setPosition({ x: 50, y: 50, active: false }),
    },
    sample: () =>
      setPosition((p) =>
        p.active
          ? { x: 50, y: 50, active: false }
          : { x: 72, y: 35, active: true },
      ),
  };
}
function EffectArrow({
  direction = "up",
}: {
  direction?: "up" | "left" | "right";
}) {
  return (
    <svg
      className="fx-action-arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          direction === "left"
            ? "m15 6-6 6 6 6"
            : direction === "right"
              ? "m9 6 6 6-6 6"
              : "M7 17 17 7M7 7h10v10"
        }
      />
    </svg>
  );
}
function DemoPointer({
  x,
  y,
  active = true,
}: {
  x: number;
  y: number;
  active?: boolean;
}) {
  return (
    <svg
      className="fx-pointer"
      viewBox="0 0 24 30"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%`, opacity: active ? 1 : 0 }}
    >
      <path
        d="M3 2v23l6-6 5 10 5-2-5-9h9z"
        fill="#243c60"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PointerHelp({
  sample,
  children,
}: {
  sample: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="fx-help">
      <p>
        {children ||
          "영역 안에서 포인터를 움직여 보세요. 터치·키보드에서는 예시 위치를 전환할 수 있어요."}
      </p>
      <button type="button" onClick={sample}>
        예시 위치 전환
      </button>
    </div>
  );
}
export function MagneticButtonScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const p = useEffectPointer(preview, time),
    [sent, setSent] = useState(false);
  return (
    <EffectFrame
      title="가까이 오면 끌리는 버튼"
      kind="magnetic-button"
      preview={preview}
    >
      <div className="fx-surface fx-magnetic" ref={p.ref} {...p.handlers}>
        <i className="fx-orbit" />
        <button
          className="fx-primary fx-magnet"
          style={{
            transform: `translate(${p.point.active ? (p.point.x - 50) * 0.55 : 0}px,${p.point.active ? (p.point.y - 50) * 0.55 : 0}px)`,
          }}
          onClick={() => setSent(true)}
        >
          프로젝트 살펴보기 <EffectArrow />
        </button>
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <>
          <p className="fx-status" role="status">
            {sent
              ? "프로젝트 소개를 선택했어요. 버튼의 클릭 영역도 함께 이동합니다."
              : "버튼 중심을 기준으로 최대 28px만 이동해요."}
          </p>
          <PointerHelp sample={p.sample} />
        </>
      )}
    </EffectFrame>
  );
}
export function ImageTrailScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time),
    [trail, setTrail] = useState<
      { x: number; y: number; at: number; id: number }[]
    >([]),
    next = useRef(0),
    last = useRef({ x: -100, y: -100 });
  useEffect(() => {
    if (preview || !trail.length) return;
    const timer = setInterval(
      () => setTrail((a) => a.filter((v) => performance.now() - v.at < 850)),
      100,
    );
    return () => clearInterval(timer);
  }, [preview, trail.length]);
  const shown = preview
    ? Array.from({ length: 5 }, (_, i) => ({
        x: 20 + i * 13 + Math.sin(time / 600) * 6,
        y: 40 + Math.sin(time / 700 + i / 2) * 17,
        id: i,
        at: i,
      }))
    : trail;
  return (
    <EffectFrame
      title="움직임을 따라 남는 장면"
      kind="image-trail"
      preview={preview}
    >
      <div
        className="fx-surface fx-trail"
        {...p.handlers}
        onPointerMove={(e) => {
          p.handlers.onPointerMove(e);
          const r = e.currentTarget.getBoundingClientRect(),
            x = ((e.clientX - r.left) / r.width) * 100,
            y = ((e.clientY - r.top) / r.height) * 100;
          if (Math.hypot(x - last.current.x, y - last.current.y) < 9) return;
          last.current = { x, y };
          setTrail((a) => [
            ...a.slice(-7),
            { x, y, at: performance.now(), id: next.current++ },
          ]);
        }}
        onPointerLeave={() => {
          p.handlers.onPointerLeave();
          last.current = { x: -100, y: -100 };
        }}
      >
        <strong className="fx-background-title">
          COLLECT
          <br />
          MOMENTS.
        </strong>
        {shown.map((v, i) => (
          <div
            key={v.id}
            className={`fx-trail-image ${preview ? "fx-trail-preview" : ""}`}
            style={{
              left: `${v.x}%`,
              top: `${v.y}%`,
              transform: `translate(-50%,-50%) rotate(${i % 2 ? 8 : -9}deg)`,
              opacity: preview ? 0.25 + i * 0.15 : undefined,
            }}
          >
            <Artwork index={i % 3} alt="" />
          </div>
        ))}
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <div className="fx-help">
          <p>
            포인터가 충분히 이동할 때만 장면을 남기며 0.85초 뒤 지워요. 최대
            8개만 유지합니다.
          </p>
          <button
            onClick={() => {
              const at = performance.now();
              setTrail(
                Array.from({ length: 5 }, (_, i) => ({
                  x: 20 + i * 14,
                  y: 45 + (i % 2) * 16,
                  at,
                  id: next.current++,
                })),
              );
            }}
          >
            트레일 체험
          </button>
        </div>
      )}
    </EffectFrame>
  );
}
export function HoverRevealScene({ preview = false, time = 1700 }: SceneProps) {
  const [active, setActive] = useState(-1),
    shown = preview ? Math.floor(time / 1100) % 3 : active;
  return (
    <EffectFrame
      title="제목 옆으로 드러나는 이미지"
      kind="hover-reveal"
      preview={preview}
    >
      <div className="fx-reveal-list">
        {["바다에서 보낸 하루", "산책의 기록", "머무르고 싶은 공간"].map(
          (n, i) => (
            <button
              key={n}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(-1)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
              onClick={() => setActive(i)}
              aria-expanded={shown === i}
              aria-label={`${n} 미리보기`}
            >
              <span>0{i + 1}</span>
              <strong>{n}</strong>
              <EffectArrow />
              <Artwork
                index={i}
                className={
                  shown === i
                    ? "fx-reveal-image is-revealed"
                    : "fx-reveal-image"
                }
              />
            </button>
          ),
        )}
      </div>
      {!preview && (
        <p className="fx-status">
          제목에 마우스·Tab 초점을 두거나 터치하면 해당 이미지가 나타나요.
          제목은 항상 읽을 수 있어요.
        </p>
      )}
    </EffectFrame>
  );
}
export function BlendCursorScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time);
  return (
    <EffectFrame
      title="겹치는 색을 반전하는 커서"
      kind="blend-cursor"
      preview={preview}
    >
      <div className="fx-surface fx-blend" {...p.handlers}>
        <div className="fx-blend-block" />
        <strong>
          DESIGN
          <br />
          IN CONTRAST.
        </strong>
        <i
          className="fx-blend-lens"
          style={{
            left: `${p.point.x}%`,
            top: `${p.point.y}%`,
            opacity: p.point.active ? 1 : 0,
          }}
        />
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <PointerHelp sample={p.sample}>
          흰 원이 글자·배경과 겹치는 곳만 difference 혼합으로 반전돼요. 실제
          시스템 커서는 유지합니다.
        </PointerHelp>
      )}
    </EffectFrame>
  );
}
export function SpotlightScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time);
  return (
    <EffectFrame
      title="포인터를 따라 비추는 빛"
      kind="spotlight"
      preview={preview}
    >
      <div className="fx-surface fx-spotlight" {...p.handlers}>
        <Artwork index={2} />
        <div
          className="fx-spot-mask"
          style={{
            background: `radial-gradient(circle 85px at ${p.point.x}% ${p.point.y}%, transparent 0%, rgba(15,29,45,.88) 100%)`,
          }}
        />
        <strong>
          FIND YOUR
          <br />
          QUIET PLACE.
        </strong>
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <PointerHelp sample={p.sample}>
          가려진 사진 위에서 빛을 움직여 보세요. 제목과 조작 안내는 어두운
          마스크 위에 항상 표시합니다.
        </PointerHelp>
      )}
    </EffectFrame>
  );
}
export function TiltCardScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time),
    [saved, setSaved] = useState(false);
  return (
    <EffectFrame
      title="포인터 방향으로 기우는 카드"
      kind="tilt-card"
      preview={preview}
    >
      <div className="fx-surface fx-tilt-stage" {...p.handlers}>
        <button
          className="fx-tilt-card"
          aria-label={saved ? "여행 기록 저장 해제" : "여행 기록 저장"}
          aria-pressed={saved}
          onClick={() => setSaved((v) => !v)}
          style={{
            transform: `perspective(700px) rotateX(${p.point.active ? (50 - p.point.y) * 0.22 : 0}deg) rotateY(${p.point.active ? (p.point.x - 50) * 0.22 : 0}deg)`,
          }}
        >
          <Artwork index={1} />
          <span>
            <strong>느리게 걷는 여행</strong>
            <small>{saved ? "저장됨" : "산과 호수 · 여행 기록"}</small>
          </span>
        </button>
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <>
          <p role="status" className="fx-status">
            {saved
              ? "여행 기록을 저장했어요."
              : "카드를 눌러 저장해 보세요. 포인터를 떼면 평평하게 돌아와요."}
          </p>
          <PointerHelp sample={p.sample} />
        </>
      )}
    </EffectFrame>
  );
}
export function CursorLabelScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time),
    [opened, setOpened] = useState(false);
  return (
    <EffectFrame
      title="다음 행동을 설명하는 커서 라벨"
      kind="cursor-label"
      preview={preview}
    >
      <div className="fx-surface fx-label-surface" {...p.handlers}>
        <button
          className="fx-label-link"
          aria-label="해안의 기록 프로젝트 보기"
          onClick={() => setOpened((v) => !v)}
        >
          <Artwork index={0} />
          <span>
            {opened
              ? "프로젝트 소개를 열었어요"
              : "해안의 기록 · 프로젝트 보기"}
          </span>
        </button>
        <span
          className="fx-cursor-label"
          aria-hidden="true"
          style={{
            left: `${p.point.x}%`,
            top: `${p.point.y}%`,
            opacity: p.point.active ? 1 : 0,
          }}
        >
          VIEW <EffectArrow />
        </span>
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <PointerHelp sample={p.sample}>
          커서 라벨은 보충 설명입니다. 키보드·모바일에서도 카드에 적힌 ‘프로젝트
          보기’ 버튼으로 같은 행동을 실행할 수 있어요.
        </PointerHelp>
      )}
    </EffectFrame>
  );
}
export function RippleScene({ preview = false, time = 1700 }: SceneProps) {
  const [waves, setWaves] = useState<{ id: number; x: number; y: number }[]>(
      [],
    ),
    [count, setCount] = useState(0),
    seq = useRef(0);
  const click = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect(),
      id = seq.current++;
    setWaves((a) => [
      ...a.slice(-4),
      {
        id,
        x: e.detail ? ((e.clientX - r.left) / r.width) * 100 : 50,
        y: e.detail ? ((e.clientY - r.top) / r.height) * 100 : 50,
      },
    ]);
    setCount((n) => n + 1);
  };
  const phase = time % 1700,
    shown = preview ? [{ id: 0, x: 35, y: 52 }] : waves;
  return (
    <EffectFrame
      title="누른 자리에서 퍼지는 물결"
      kind="ripple"
      preview={preview}
    >
      <div className="fx-surface fx-ripple-stage">
        <button className="fx-ripple-button" onClick={click}>
          <span>저장하기</span>
          {shown.map((v) => (
            <i
              key={v.id}
              className={preview ? "fx-wave fx-wave-preview" : "fx-wave"}
              style={{
                left: `${v.x}%`,
                top: `${v.y}%`,
                ...(preview
                  ? {
                      transform: `translate(-50%,-50%) scale(${(phase / 1700) * 7})`,
                      opacity: 1 - phase / 1700,
                    }
                  : {}),
              }}
              onAnimationEnd={() =>
                setWaves((a) => a.filter((w) => w.id !== v.id))
              }
            />
          ))}
        </button>
        {preview && <DemoPointer x={44} y={56} />}
      </div>
      {!preview && (
        <p className="fx-status" role="status">
          {count
            ? `${count}회 눌렀어요. 물결은 입력 피드백이며 서버 저장 완료를 의미하지 않아요.`
            : "클릭·터치 위치에서 퍼져요. Enter·Space로 누르면 버튼 중앙에서 시작해요."}
        </p>
      )}
    </EffectFrame>
  );
}
export function CursorTrailScene({
  preview = false,
  time = 1700,
  paused = false,
}: SceneProps) {
  const p = useEffectPointer(preview, time),
    [tails, setTails] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (preview || paused) return;
    let frame = 0,
      last = 0;
    const tick = (at: number) => {
      if (at - last > 24) {
        last = at;
        setTails((a) => {
          const head = p.point.active ? p.point : { x: 50, y: 50 };
          return [head, ...a.slice(0, 7)].map((v, i) =>
            i
              ? {
                  x: v.x + (head.x - v.x) * 0.12,
                  y: v.y + (head.y - v.y) * 0.12,
                }
              : v,
          );
        });
      }
      frame = requestAnimationFrame(tick);
    };
    if (p.point.active) frame = requestAnimationFrame(tick);
    else setTails([]);
    return () => cancelAnimationFrame(frame);
  }, [preview, paused, p.point.x, p.point.y, p.point.active]);
  const shown = preview
    ? Array.from({ length: 8 }, (_, i) => ({
        x: p.point.x - i * 3.6,
        y: p.point.y + i * 2.4,
      }))
    : tails;
  return (
    <EffectFrame
      title="포인터 뒤를 따라오는 꼬리"
      kind="cursor-trail"
      preview={preview}
    >
      <div className="fx-surface fx-cursor-trail" {...p.handlers}>
        <strong>
          FOLLOW
          <br />
          THE FLOW.
        </strong>
        {shown.map((v, i) => (
          <i
            key={i}
            className="fx-tail"
            style={{
              left: `${v.x}%`,
              top: `${v.y}%`,
              width: 24 - i * 2,
              height: 24 - i * 2,
              opacity: 1 - i * 0.11,
            }}
          />
        ))}
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <PointerHelp sample={p.sample}>
          큰 점이 포인터 위치를 따라오고 작은 점은 지연되어 이어져요. 영역을
          벗어나면 꼬리를 지웁니다.
        </PointerHelp>
      )}
    </EffectFrame>
  );
}
export function MasonryScene({ preview = false, time = 1700 }: SceneProps) {
  const [wide, setWide] = useState(false),
    [chosen, setChosen] = useState(""),
    compact = preview ? time < 2000 : wide;
  return (
    <EffectFrame
      title="서로 다른 비율의 갤러리"
      kind="masonry"
      preview={preview}
    >
      {!preview && (
        <button onClick={() => setWide((v) => !v)} aria-pressed={wide}>
          열 수 전환
        </button>
      )}
      <div className={`fx-masonry ${compact ? "fx-masonry-two" : ""}`}>
        {[0, 2, 1, 1, 0, 2].map((n, i) => (
          <button
            key={i}
            onClick={() => setChosen(`${i + 1}번 ${artNames[n]}`)}
          >
            <Artwork
              index={n}
              style={{
                aspectRatio: ["4/5", "4/3", "3/4", "4/3", "4/5", "1"][i],
              }}
            />
            <span>
              {String(i + 1).padStart(2, "0")} · {artNames[n]}
            </span>
          </button>
        ))}
      </div>
      {!preview && (
        <p className="fx-status" role="status">
          {chosen
            ? `${chosen}을 선택했어요.`
            : "CSS columns로 위→아래, 다음 열 순서로 읽어요. 화면이 좁아지면 2열로 정리합니다."}
        </p>
      )}
    </EffectFrame>
  );
}
export function LightboxScene({ preview = false, time = 1700 }: SceneProps) {
  const [selected, setSelected] = useState(-1),
    dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement | null>(null),
    title = useId(),
    shown = preview && time > 850 && time < 3100,
    index = preview ? Math.floor(time / 1700) % 3 : Math.max(0, selected);
  useEffect(() => {
    if (preview) return;
    const d = dialog.current;
    if (selected >= 0 && !d?.open) d?.showModal();
    else if (selected < 0 && d?.open) d.close();
  }, [selected, preview]);
  const close = () => {
    setSelected(-1);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  return (
    <EffectFrame title="사진을 크게 살펴보기" kind="lightbox" preview={preview}>
      <div className="fx-gallery">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            aria-label={`${artNames[i]} 크게 보기`}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setSelected(i);
            }}
          >
            <Artwork index={i} />
          </button>
        ))}
      </div>
      {preview ? (
        shown && (
          <div className="fx-mini-lightbox">
            <Artwork index={index} />
            <span>{index + 1} / 3 · 크게 보기</span>
          </div>
        )
      ) : (
        <>
          <p className="fx-status">
            사진 선택 → 좌우 이동 → 닫기·Esc로 원래 사진에 돌아와요.
          </p>
          <dialog
            ref={dialog}
            className="fx-lightbox"
            aria-labelledby={title}
            onCancel={(e) => {
              e.preventDefault();
              close();
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                const r = e.currentTarget.getBoundingClientRect();
                if (
                  e.clientX < r.left ||
                  e.clientX > r.right ||
                  e.clientY < r.top ||
                  e.clientY > r.bottom
                )
                  close();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setSelected((i) => (i + 1) % 3);
              if (e.key === "ArrowLeft") setSelected((i) => (i + 2) % 3);
            }}
          >
            <div className="fx-lightbox-head">
              <h3 id={title}>{artNames[index]}</h3>
              <button aria-label="확대 사진 닫기" onClick={close}>
                닫기
              </button>
            </div>
            <Artwork index={index} />
            <div className="fx-lightbox-controls">
              <button
                aria-label="이전 사진"
                onClick={() => setSelected((i) => (i + 2) % 3)}
              >
                이전
              </button>
              <span aria-live="polite">{index + 1} / 3</span>
              <button
                aria-label="다음 사진"
                onClick={() => setSelected((i) => (i + 1) % 3)}
              >
                다음
              </button>
            </div>
          </dialog>
        </>
      )}
    </EffectFrame>
  );
}
export function BeforeAfterScene({ preview = false, time = 1700 }: SceneProps) {
  const [value, setValue] = useState(50),
    shown = preview ? 50 + Math.sin(time / 650) * 33 : value;
  return (
    <EffectFrame
      title="한 장면의 보정 전·후 비교"
      kind="before-after-slider"
      preview={preview}
    >
      <div className="fx-compare">
        <Artwork index={0} />
        <Artwork
          index={0}
          className="fx-before"
          style={{ clipPath: `inset(0 ${100 - shown}% 0 0)` }}
        />
        <span className="fx-compare-label fx-before-label">보정 전</span>
        <span className="fx-compare-label fx-after-label">보정 후</span>
        <div className="fx-compare-divider" style={{ left: `${shown}%` }}>
          <span aria-hidden="true">
            <EffectArrow direction="left" />
            <EffectArrow direction="right" />
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={shown}
          aria-label="보정 전 이미지 표시 비율"
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
      {!preview && (
        <p role="status" className="fx-status">
          보정 전 {value}% · 보정 후 {100 - value}% — 핸들을 끌거나 방향키로 1%,
          Home·End로 양 끝을 비교하세요.
        </p>
      )}
    </EffectFrame>
  );
}
export function KenBurnsScene({
  preview = false,
  time = 1700,
  paused = false,
  reduced = false,
}: SceneProps) {
  const [elapsed, setElapsed] = useState(0),
    [running, setRunning] = useState(true);
  useEffect(() => {
    if (preview || paused || reduced || !running) return;
    let frame = 0,
      last = 0;
    const tick = (at: number) => {
      if (last) setElapsed((v) => (v + Math.min(at - last, 80)) % 10000);
      last = at;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [preview, paused, reduced, running]);
  const progress = preview
    ? (1 - Math.cos((time / 4000) * Math.PI * 2)) / 2
    : (1 - Math.cos((elapsed / 10000) * Math.PI * 2)) / 2;
  return (
    <EffectFrame
      title="사진 안에서 천천히 이동"
      kind="ken-burns"
      preview={preview}
    >
      <div className="fx-ken-window">
        <Artwork
          index={1}
          style={{
            transform: `scale(${1 + progress * 0.22}) translate(${progress * -3}%,${progress * 2}%)`,
          }}
        />
        <span className="fx-photo-caption">
          A SLOW JOURNEY
          <br />
          <strong>머물러 보는 풍경</strong>
        </span>
      </div>
      {!preview && (
        <div className="fx-help">
          <p>같은 사진을 최대 1.22배 확대하고 시점을 천천히 이동해요.</p>
          <button aria-pressed={!running} onClick={() => setRunning((v) => !v)}>
            {running ? "움직임 멈추기" : "움직임 이어가기"}
          </button>
        </div>
      )}
    </EffectFrame>
  );
}
export function MagnifierScene({ preview = false, time = 1700 }: SceneProps) {
  const p = useEffectPointer(preview, time),
    [zoom, setZoom] = useState(2),
    [fixed, setFixed] = useState(false),
    [size, setSize] = useState({ width: 400, height: 250 }),
    active = p.point.active || fixed;
  useEffect(() => {
    const el = p.ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <EffectFrame
      title="원하는 부분을 확대하는 돋보기"
      kind="image-magnifier"
      preview={preview}
    >
      <div className="fx-magnifier-surface" ref={p.ref} {...p.handlers}>
        <Artwork index={2} />
        <div
          className="fx-magnifier-lens"
          aria-hidden="true"
          style={{
            left: `${p.point.x}%`,
            top: `${p.point.y}%`,
            opacity: active ? 1 : 0,
            backgroundImage: `url("${artSource(2)}")`,
            backgroundSize: `${size.width * zoom}px ${size.height * zoom}px`,
            backgroundPosition: `${(preview ? 41 : 66) - (p.point.x / 100) * size.width * zoom}px ${(preview ? 41 : 66) - (p.point.y / 100) * size.height * zoom}px`,
          }}
        />
        {preview && <DemoPointer {...p.point} />}
      </div>
      {!preview && (
        <div className="fx-help">
          <label>
            확대 배율{" "}
            <input
              type="range"
              min="2"
              max="4"
              step=".5"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <output>{zoom}배</output>
          </label>
          <button aria-pressed={fixed} onClick={() => setFixed((v) => !v)}>
            중앙 돋보기 {fixed ? "닫기" : "열기"}
          </button>
          <p>
            터치는 이미지 위를 움직이고, 키보드는 중앙 돋보기와 배율을
            사용하세요. 작은 화면에서 렌즈가 잘리는 부분은 사진 경계입니다.
          </p>
        </div>
      )}
    </EffectFrame>
  );
}
export function ImageAccordionScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const [active, setActive] = useState(0),
    shown = preview ? Math.floor(time / 1250) % 3 : active;
  return (
    <EffectFrame
      title="선택한 장면에 공간을 더하기"
      kind="image-accordion"
      preview={preview}
    >
      <div className="fx-image-accordion">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={shown === i ? "fx-image-expanded" : ""}
            aria-pressed={shown === i}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setActive(i);
            }}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <Artwork index={i} />
            <span>
              0{i + 1}
              <strong>{artNames[i]}</strong>
            </span>
          </button>
        ))}
      </div>
      {!preview && (
        <p className="fx-status" role="status">
          {artNames[shown]} 선택됨 — 마우스·Tab·터치 모두 같은 장면을 펼칠 수
          있어요.
        </p>
      )}
    </EffectFrame>
  );
}
export function hotspotPlacement(
  width: number,
  height: number,
  x: number,
  y: number,
  bubbleWidth: number,
  bubbleHeight: number,
) {
  const px = (width * x) / 100,
    py = (height * y) / 100,
    gap = 24,
    pad = 8;
  let left = px + gap,
    top = py - bubbleHeight / 2;
  if (left + bubbleWidth > width - pad) left = px - gap - bubbleWidth;
  if (left < pad) {
    left = px - bubbleWidth / 2;
    top = py + gap;
    if (top + bubbleHeight > height - pad) top = py - gap - bubbleHeight;
  }
  return {
    left: Math.max(pad, Math.min(left, width - bubbleWidth - pad)),
    top: Math.max(pad, Math.min(top, height - bubbleHeight - pad)),
  };
}
export function ImageHotspotScene({
  preview = false,
  time = 1700,
}: SceneProps) {
  const [active, setActive] = useState(-1),
    [mode, setMode] = useState<"panel" | "bubble">("panel"),
    [pinned, setPinned] = useState(-1),
    [position, setPosition] = useState({ left: 8, top: 8 });
  const shown = preview ? Math.floor(time / 1200) % 3 : active,
    bubbleMode = preview ? time >= 2000 : mode === "bubble",
    details = [
      "편안한 라운지 체어 · 좌석 높이 42cm",
      "원목 사이드 테이블 · 지름 48cm",
      "곡선 창과 자연 채광 · 남향",
    ],
    names = ["라운지 체어", "사이드 테이블", "아치형 창"],
    points = [
      [28, 62],
      [56, 72],
      [71, 34],
    ],
    uid = useId(),
    buttons = useRef<(HTMLButtonElement | null)[]>([]),
    image = useRef<HTMLDivElement>(null),
    bubble = useRef<HTMLDivElement>(null),
    suppressFocus = useRef(false);
  useEffect(() => {
    if (!bubbleMode || shown < 0) return;
    const el = image.current,
      box = bubble.current;
    if (!el || !box) return;
    const place = () =>
      setPosition(
        hotspotPlacement(
          el.clientWidth,
          el.clientHeight,
          points[shown][0],
          points[shown][1],
          box.offsetWidth,
          box.offsetHeight,
        ),
      );
    place();
    const observer = new ResizeObserver(place);
    observer.observe(el);
    observer.observe(box);
    return () => observer.disconnect();
  }, [shown, bubbleMode]);
  const close = (restore = true) => {
    const previous = active;
    setActive(-1);
    setPinned(-1);
    if (restore && previous >= 0) {
      requestAnimationFrame(() => {
        suppressFocus.current = true;
        buttons.current[previous]?.focus();
        suppressFocus.current = false;
      });
    }
  };
  useEffect(() => {
    if (preview || !bubbleMode || active < 0) return;
    const outside = (event: globalThis.PointerEvent) => {
      if (!image.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [preview, bubbleMode, active]);
  return (
    <EffectFrame
      title="사진 속 요소에 설명 붙이기"
      kind="image-hotspot"
      preview={preview}
    >
      {!preview && (
        <div
          className="fx-hotspot-modes"
          role="group"
          aria-label="설명 표시 방식"
        >
          {(
            [
              ["panel", "하단 설명"],
              ["bubble", "지점 옆 말풍선"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              data-hotspot-mode={value}
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setActive(-1);
                setPinned(-1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div
        className="fx-hotspot-image"
        ref={image}
        onPointerLeave={() => {
          if (bubbleMode && pinned < 0) setActive(-1);
        }}
        onBlur={(e) => {
          if (
            bubbleMode &&
            pinned < 0 &&
            !e.currentTarget.contains(e.relatedTarget as Node | null)
          )
            setActive(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && active >= 0) {
            e.preventDefault();
            e.stopPropagation();
            close();
          }
        }}
        onClick={(e) => {
          if (
            bubbleMode &&
            !(e.target as Element).closest(".fx-hotspot,.fx-hotspot-bubble")
          )
            close(false);
        }}
      >
        <Artwork index={2} />
        {points.map(([x, y], i) => (
          <button
            key={i}
            type="button"
            className={shown === i ? "fx-hotspot is-active" : "fx-hotspot"}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={["의자 설명", "테이블 설명", "창 설명"][i]}
            aria-expanded={shown === i}
            aria-controls={`${uid}-${bubbleMode ? "bubble" : "detail"}`}
            aria-haspopup={bubbleMode ? "dialog" : undefined}
            onPointerEnter={(e) => {
              if (bubbleMode && e.pointerType === "mouse" && pinned < 0)
                setActive(i);
            }}
            onFocus={() => {
              if (suppressFocus.current) {
                suppressFocus.current = false;
                return;
              }
              if (bubbleMode) setActive(i);
            }}
            onClick={() => {
              if (bubbleMode) {
                if (pinned === i) {
                  setPinned(-1);
                  setActive(-1);
                } else {
                  setPinned(i);
                  setActive(i);
                }
              } else setActive((v) => (v === i ? -1 : i));
            }}
          >
            {bubbleMode ? (
              <span className="fx-hotspot-dot" aria-hidden="true" />
            ) : (
              i + 1
            )}
          </button>
        ))}
        {bubbleMode && shown >= 0 && (
          <div
            className="fx-hotspot-bubble"
            id={`${uid}-bubble`}
            ref={bubble}
            role={preview ? undefined : "dialog"}
            aria-label="지점 설명"
            style={position}
          >
            <strong>{names[shown]}</strong>
            {!preview && (
              <>
                <p>{details[shown]}</p>
                <button
                  type="button"
                  aria-label="말풍선 닫기"
                  onClick={() => close()}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {!bubbleMode ? (
        <div
          className="fx-hotspot-detail"
          id={`${uid}-detail`}
          role={preview ? undefined : "status"}
        >
          {shown < 0 ? (
            "사진 위의 번호를 눌러 제품과 공간의 설명을 확인하세요."
          ) : (
            <>
              <strong>{names[shown]}</strong>
              <p>{details[shown]}</p>
              {!preview && (
                <button type="button" onClick={() => close()}>
                  설명 닫기
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        !preview && (
          <p className="fx-status">
            지점 위에 마우스·Tab 초점을 두면 말풍선이 나타나요. 클릭·터치로
            고정하고 다시 누르기·닫기·Esc·바깥 클릭으로 닫아요.
          </p>
        )
      )}
    </EffectFrame>
  );
}
function drawHalftone(canvas: HTMLCanvasElement, size: number) {
  const image = new Image();
  image.onload = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scratch = document.createElement("canvas");
    scratch.width = 320;
    scratch.height = 200;
    const original = scratch.getContext("2d");
    if (!original) return;
    original.drawImage(image, 0, 0, 320, 200);
    const pixels = original.getImageData(0, 0, 320, 200).data;
    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = "#283d53";
    for (let y = size / 2; y < 200; y += size)
      for (let x = size / 2; x < 320; x += size) {
        const at = (Math.floor(y) * 320 + Math.floor(x)) * 4,
          light =
            (pixels[at] * 0.2126 +
              pixels[at + 1] * 0.7152 +
              pixels[at + 2] * 0.0722) /
            255;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          Math.max(0.4, size * 0.65 * Math.sqrt(1 - light)),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
  };
  image.src = artSource(2);
  return () => {
    image.onload = null;
  };
}
export function HalftoneScene({ preview = false, time = 1700 }: SceneProps) {
  const [size, setSize] = useState(6),
    [original, setOriginal] = useState(false),
    canvas = useRef<HTMLCanvasElement>(null),
    shown = preview ? (time < 1800 ? 5 : 9) : size;
  useEffect(() => {
    if (canvas.current) return drawHalftone(canvas.current, shown);
  }, [shown]);
  return (
    <EffectFrame
      title="명암을 크고 작은 점으로"
      kind="halftone"
      preview={preview}
    >
      <div className="fx-halftone">
        <Artwork index={2} />
        <canvas
          ref={canvas}
          width="320"
          height="200"
          role="img"
          aria-label="밝기에 따라 점 크기가 달라지는 공간 이미지"
          style={{
            opacity: original ? 0 : 1,
            clipPath: preview
              ? `inset(0 0 0 ${48 + Math.sin(time / 700) * 20}%)`
              : undefined,
          }}
        />
        <span className="fx-halftone-tag">
          {original ? "원본" : "HALFTONE"}
        </span>
      </div>
      {!preview && (
        <div className="fx-help">
          <label>
            점 간격{" "}
            <input
              aria-label="하프톤 점 간격"
              type="range"
              min="3"
              max="12"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
            <output>{size}px</output>
          </label>
          <button
            aria-pressed={original}
            onClick={() => setOriginal((v) => !v)}
          >
            {original ? "하프톤 보기" : "원본 보기"}
          </button>
          <p>
            원본 밝기를 읽어 어두운 부분은 큰 점, 밝은 부분은 작은 점으로
            그립니다. 이미지 속 필수 정보는 설명 텍스트로도 제공하세요.
          </p>
        </div>
      )}
    </EffectFrame>
  );
}
