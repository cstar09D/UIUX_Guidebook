"use client";
import { useEffect, useRef, useState } from "react";
import { guides, type DemoId } from "@/lib/catalog";
import { sceneMap } from "@/demos/scenes";

/** Recommendations have their own clock while the catalogue is paused by the modal. */
export default function MotionPreview({ id }: { id: DemoId }) {
  const ref = useRef<HTMLDivElement>(null),
    guide = guides[id];
  const [time, setTime] = useState(guide.poster);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = new ResizeObserver(() =>
      el.style.setProperty("--related-scale", String(el.clientWidth / 320)),
    );
    resize.observe(el);
    let visible = false,
      frame = 0,
      last: number | undefined,
      elapsed = guide.poster;
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) {
        last = undefined;
        return;
      }
      if (last !== undefined) elapsed = (elapsed + now - last) % guide.duration;
      last = now;
      setTime(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      if (visible && !document.hidden && !frame)
        frame = requestAnimationFrame(tick);
      else if (!visible || document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = undefined;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      resize.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", update);
    };
  }, [id, guide.duration, guide.poster]);
  const Scene = sceneMap[id];
  return (
    <div ref={ref} className="related-preview" aria-hidden="true" inert>
      <div className="related-mini-stage">
        <Scene preview time={time} />
      </div>
    </div>
  );
}
