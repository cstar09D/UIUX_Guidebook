import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { effectRegistry } from "./registry.ts";
const require = createRequire(import.meta.url),
  module = { exports: {} };
runInNewContext(
  buildSync({
    entryPoints: ["src/demos/effects.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }).outputFiles[0].text,
  { module, exports: module.exports, require },
);
export const effectMarkup = Object.fromEntries(
  effectRegistry.map((d) => [
    d.id,
    renderToStaticMarkup(createElement(module.exports[d.component])),
  ]),
);
function trackPointer(surface, draw) {
  let sample = false;
  const update = (e) => {
    const r = surface.getBoundingClientRect();
    draw(
      Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
      true,
    );
  };
  surface.addEventListener("pointermove", update);
  surface.addEventListener("pointerdown", update);
  surface.addEventListener("pointercancel", () => {
    sample = false;
    draw(50, 50, false);
  });
  surface.addEventListener("pointerleave", () => {
    sample = false;
    draw(50, 50, false);
  });
  const button = surface.closest(".fx-card").querySelector(".fx-help button");
  button?.addEventListener("click", () => {
    sample = !sample;
    draw(sample ? 72 : 50, sample ? 35 : 50, sample);
  });
}
function setupMagnet() {
  const root = document.querySelector(".scene-magnetic-button"),
    b = root.querySelector(".fx-magnet");
  trackPointer(root.querySelector(".fx-surface"), (x, y, on) => {
    b.style.transform = `translate(${on ? (x - 50) * 0.55 : 0}px,${on ? (y - 50) * 0.55 : 0}px)`;
  });
  b.onclick = () => {
    root.querySelector(".fx-status").textContent =
      "프로젝트 소개를 선택했어요. 버튼의 클릭 영역도 함께 이동합니다.";
  };
}
function setupImageTrail(artSources) {
  const root = document.querySelector(".scene-image-trail"),
    s = root.querySelector(".fx-surface");
  let last = { x: -100, y: -100 },
    sequence = 0;
  function add(x, y) {
    const item = document.createElement("div");
    item.className = "fx-trail-image";
    item.style.cssText = `left:${x}%;top:${y}%;transform:translate(-50%,-50%) rotate(${sequence % 2 ? 8 : -9}deg)`;
    const img = document.createElement("img");
    img.src = artSources[sequence++ % 3];
    img.alt = "";
    img.className = "fx-art";
    item.append(img);
    s.append(item);
    const nodes = s.querySelectorAll(".fx-trail-image");
    if (nodes.length > 8) nodes[0].remove();
    setTimeout(() => item.remove(), 850);
  }
  s.onpointermove = (e) => {
    const r = s.getBoundingClientRect(),
      x = ((e.clientX - r.left) / r.width) * 100,
      y = ((e.clientY - r.top) / r.height) * 100;
    if (Math.hypot(x - last.x, y - last.y) < 9) return;
    last = { x, y };
    add(x, y);
  };
  s.onpointerleave = () => {
    last = { x: -100, y: -100 };
  };
  root.querySelector(".fx-help button").onclick = () => {
    for (let i = 0; i < 5; i++) add(20 + i * 14, 45 + (i % 2) * 16);
  };
}
function setupHoverReveal() {
  const buttons = document.querySelectorAll(".fx-reveal-list>button");
  function show(index) {
    buttons.forEach((b, i) => {
      b.setAttribute("aria-expanded", String(i === index));
      b.querySelector("img").classList.toggle("is-revealed", i === index);
    });
  }
  buttons.forEach((b, i) => {
    b.onpointerenter = () => show(i);
    b.onpointerleave = () => show(-1);
    b.onfocus = () => show(i);
    b.onblur = () => show(-1);
    b.onclick = () => show(i);
  });
}
function setupBlend() {
  const root = document.querySelector(".scene-blend-cursor"),
    lens = root.querySelector(".fx-blend-lens");
  trackPointer(root.querySelector(".fx-surface"), (x, y, on) => {
    lens.style.left = x + "%";
    lens.style.top = y + "%";
    lens.style.opacity = on ? "1" : "0";
  });
}
function setupSpotlight() {
  const root = document.querySelector(".scene-spotlight"),
    mask = root.querySelector(".fx-spot-mask");
  trackPointer(root.querySelector(".fx-surface"), (x, y) => {
    mask.style.background = `radial-gradient(circle 85px at ${x}% ${y}%,transparent 0%,rgba(15,29,45,.88) 100%)`;
  });
}
function setupTilt() {
  const root = document.querySelector(".scene-tilt-card"),
    card = root.querySelector(".fx-tilt-card");
  trackPointer(root.querySelector(".fx-surface"), (x, y, on) => {
    card.style.transform = `perspective(700px) rotateX(${on ? (50 - y) * 0.22 : 0}deg) rotateY(${on ? (x - 50) * 0.22 : 0}deg)`;
  });
  let saved = false;
  card.onclick = () => {
    saved = !saved;
    card.setAttribute("aria-pressed", String(saved));
    card.setAttribute(
      "aria-label",
      saved ? "여행 기록 저장 해제" : "여행 기록 저장",
    );
    card.querySelector("small").textContent = saved
      ? "저장됨"
      : "산과 호수 · 여행 기록";
    root.querySelector(".fx-status").textContent = saved
      ? "여행 기록을 저장했어요."
      : "카드를 눌러 저장해 보세요. 포인터를 떼면 평평하게 돌아와요.";
  };
}
function setupCursorLabel() {
  const root = document.querySelector(".scene-cursor-label"),
    label = root.querySelector(".fx-cursor-label"),
    button = root.querySelector(".fx-label-link");
  trackPointer(root.querySelector(".fx-surface"), (x, y, on) => {
    label.style.left = x + "%";
    label.style.top = y + "%";
    label.style.opacity = on ? "1" : "0";
  });
  let open = false;
  button.onclick = () => {
    open = !open;
    button.querySelector("span").textContent = open
      ? "프로젝트 소개를 열었어요"
      : "해안의 기록 · 프로젝트 보기";
  };
}
function setupRipple() {
  const root = document.querySelector(".scene-ripple"),
    button = root.querySelector(".fx-ripple-button");
  let count = 0;
  button.onclick = (e) => {
    const r = button.getBoundingClientRect(),
      wave = document.createElement("i");
    wave.className = "fx-wave";
    wave.style.left =
      (e.detail ? ((e.clientX - r.left) / r.width) * 100 : 50) + "%";
    wave.style.top =
      (e.detail ? ((e.clientY - r.top) / r.height) * 100 : 50) + "%";
    button.append(wave);
    wave.onanimationend = () => wave.remove();
    const all = button.querySelectorAll(".fx-wave");
    if (all.length > 5) all[0].remove();
    root.querySelector(".fx-status").textContent =
      `${++count}회 눌렀어요. 물결은 입력 피드백이며 서버 저장 완료를 의미하지 않아요.`;
  };
}
function setupCursorTrail() {
  const root = document.querySelector(".scene-cursor-trail"),
    surface = root.querySelector(".fx-surface");
  let frame = 0,
    position = { x: 50, y: 50 },
    dots = [];
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    dots.forEach((d) => d.el.remove());
    dots = [];
  }
  function tick() {
    dots.forEach((d, i) => {
      const target = i ? dots[i - 1] : position;
      d.x += (target.x - d.x) * 0.32;
      d.y += (target.y - d.y) * 0.32;
      d.el.style.left = d.x + "%";
      d.el.style.top = d.y + "%";
    });
    frame = requestAnimationFrame(tick);
  }
  function draw(x, y, on) {
    position = { x, y };
    if (!on) {
      stop();
      return;
    }
    if (!dots.length) {
      dots = Array.from({ length: 8 }, (_, i) => {
        const el = document.createElement("i");
        el.className = "fx-tail";
        el.style.cssText = `width:${24 - i * 2}px;height:${24 - i * 2}px;opacity:${1 - i * 0.11}`;
        surface.append(el);
        return { el, x, y };
      });
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }
  trackPointer(surface, draw);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  window.addEventListener("pagehide", stop, { once: true });
}
function setupMasonry() {
  const root = document.querySelector(".scene-masonry"),
    list = root.querySelector(".fx-masonry");
  root.querySelector(".fx-card>button").onclick = (e) => {
    const selected = list.classList.toggle("fx-masonry-two");
    e.currentTarget.setAttribute("aria-pressed", String(selected));
  };
  root.querySelectorAll(".fx-masonry>button").forEach(
    (b, i) =>
      (b.onclick = () => {
        root.querySelector(".fx-status").textContent =
          `${i + 1}번 ${b.querySelector("img").alt}을 선택했어요.`;
      }),
  );
}
function setupLightbox() {
  const root = document.querySelector(".scene-lightbox"),
    dialog = root.querySelector("dialog"),
    images = [...root.querySelectorAll(".fx-gallery img")],
    buttons = root.querySelectorAll(".fx-gallery button");
  let index = 0,
    trigger;
  function render() {
    dialog.querySelector("h3").textContent = images[index].alt;
    dialog.querySelector("img").src = images[index].src;
    dialog.querySelector("img").alt = images[index].alt;
    dialog.querySelector("[aria-live]").textContent = `${index + 1} / 3`;
  }
  function move(delta) {
    index = (index + delta + 3) % 3;
    render();
  }
  function close() {
    dialog.close();
    trigger?.focus();
  }
  buttons.forEach(
    (b, i) =>
      (b.onclick = () => {
        index = i;
        trigger = b;
        render();
        dialog.showModal();
      }),
  );
  dialog.querySelector('[aria-label="확대 사진 닫기"]').onclick = close;
  dialog.querySelector('[aria-label="이전 사진"]').onclick = () => move(-1);
  dialog.querySelector('[aria-label="다음 사진"]').onclick = () => move(1);
  dialog.oncancel = (e) => {
    e.preventDefault();
    close();
  };
  dialog.onkeydown = (e) => {
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowLeft") move(-1);
  };
  dialog.onclick = (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      close();
  };
}
function setupCompare() {
  const root = document.querySelector(".scene-before-after-slider"),
    input = root.querySelector("input");
  input.oninput = () => {
    const value = Number(input.value);
    root.querySelector(".fx-before").style.clipPath =
      `inset(0 ${100 - value}% 0 0)`;
    root.querySelector(".fx-compare-divider").style.left = value + "%";
    root.querySelector(".fx-status").textContent =
      `보정 전 ${value}% · 보정 후 ${100 - value}% — 핸들을 끌거나 방향키로 1%, Home·End로 양 끝을 비교하세요.`;
  };
}
function setupKenBurns() {
  const root = document.querySelector(".scene-ken-burns"),
    image = root.querySelector("img"),
    button = root.querySelector(".fx-help button");
  let elapsed = 0,
    last = 0,
    frame = 0,
    running = true;
  function tick(at) {
    frame = 0;
    if (!running || document.hidden || window.__DEMO__?.reduced) {
      last = 0;
      return;
    }
    if (last) elapsed = (elapsed + Math.min(at - last, 80)) % 10000;
    last = at;
    const p = (1 - Math.cos((elapsed / 10000) * Math.PI * 2)) / 2;
    image.style.transform = `scale(${1 + p * 0.22}) translate(${p * -3}%,${p * 2}%)`;
    frame = requestAnimationFrame(tick);
  }
  function start() {
    cancelAnimationFrame(frame);
    last = 0;
    if (running && !document.hidden) frame = requestAnimationFrame(tick);
  }
  button.onclick = () => {
    running = !running;
    button.setAttribute("aria-pressed", String(!running));
    button.textContent = running ? "움직임 멈추기" : "움직임 이어가기";
    start();
  };
  document.addEventListener("visibilitychange", start);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), {
    once: true,
  });
  start();
}
function setupMagnifier() {
  const root = document.querySelector(".scene-image-magnifier"),
    surface = root.querySelector(".fx-magnifier-surface"),
    lens = root.querySelector(".fx-magnifier-lens"),
    input = root.querySelector("input"),
    button = root.querySelector("button");
  let x = 50,
    y = 50,
    active = false,
    fixed = false;
  function draw() {
    const r = surface.getBoundingClientRect(),
      half = lens.offsetWidth / 2;
    const zoom = Number(input.value);
    lens.style.left = x + "%";
    lens.style.top = y + "%";
    lens.style.opacity = active || fixed ? "1" : "0";
    lens.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
    lens.style.backgroundPosition = `${half - (x / 100) * r.width * zoom}px ${half - (y / 100) * r.height * zoom}px`;
  }
  const move = (e) => {
    const r = surface.getBoundingClientRect();
    x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    active = true;
    draw();
  };
  surface.onpointermove = move;
  surface.onpointerdown = move;
  surface.onpointerleave = () => {
    x = y = 50;
    active = false;
    draw();
  };
  input.oninput = () => {
    root.querySelector("output").textContent = input.value + "배";
    draw();
  };
  button.onclick = () => {
    fixed = !fixed;
    button.setAttribute("aria-pressed", String(fixed));
    button.textContent = `중앙 돋보기 ${fixed ? "닫기" : "열기"}`;
    draw();
  };
  new ResizeObserver(draw).observe(surface);
  draw();
}
function setupImageAccordion() {
  const root = document.querySelector(".scene-image-accordion"),
    buttons = root.querySelectorAll(".fx-image-accordion button");
  function choose(i) {
    buttons.forEach((b, j) => {
      b.classList.toggle("fx-image-expanded", i === j);
      b.setAttribute("aria-pressed", String(i === j));
    });
    root.querySelector(".fx-status").textContent =
      buttons[i].querySelector("img").alt +
      " 선택됨 — 마우스·Tab·터치 모두 같은 장면을 펼칠 수 있어요.";
  }
  buttons.forEach((b, i) => {
    b.onpointerenter = (e) => {
      if (e.pointerType === "mouse") choose(i);
    };
    b.onfocus = () => choose(i);
    b.onclick = () => choose(i);
  });
}
function setupHotspot() {
  const root = document.querySelector(".scene-image-hotspot"),
    image = root.querySelector(".fx-hotspot-image"),
    buttons = [...root.querySelectorAll(".fx-hotspot")],
    detail = root.querySelector(".fx-hotspot-detail"),
    modes = root.querySelectorAll("[data-hotspot-mode]"),
    names = ["라운지 체어", "사이드 테이블", "아치형 창"],
    descriptions = [
      "편안한 라운지 체어 · 좌석 높이 42cm",
      "원목 사이드 테이블 · 지름 48cm",
      "곡선 창과 자연 채광 · 남향",
    ],
    points = [
      [28, 62],
      [56, 72],
      [71, 34],
    ],
    bubble = document.createElement("div"),
    hint = document.createElement("p");
  bubble.className = "fx-hotspot-bubble";
  bubble.id = detail.id.replace(/-detail$/, "-bubble");
  bubble.setAttribute("role", "dialog");
  bubble.setAttribute("aria-label", "지점 설명");
  bubble.hidden = true;
  image.append(bubble);
  hint.className = "fx-status";
  hint.textContent =
    "지점 위에 마우스·Tab 초점을 두면 말풍선이 나타나요. 클릭·터치로 고정하고 다시 누르기·닫기·Esc·바깥 클릭으로 닫아요.";
  hint.hidden = true;
  detail.after(hint);
  let active = -1,
    pinned = -1,
    mode = "panel",
    suppress = false;
  function place() {
    if (mode !== "bubble" || active < 0 || bubble.hidden) return;
    const pos = hotspotPlacement(
      image.clientWidth,
      image.clientHeight,
      points[active][0],
      points[active][1],
      bubble.offsetWidth,
      bubble.offsetHeight,
    );
    bubble.style.left = pos.left + "px";
    bubble.style.top = pos.top + "px";
  }
  function close(restore = true) {
    const previous = active;
    pinned = -1;
    show(-1);
    if (restore && previous >= 0) {
      suppress = true;
      buttons[previous].focus();
      suppress = false;
    }
  }
  function show(index) {
    active = index;
    buttons.forEach((b, i) => {
      b.classList.toggle("is-active", active === i);
      b.setAttribute("aria-expanded", String(active === i));
      b.setAttribute(
        "aria-controls",
        mode === "bubble" ? bubble.id : detail.id,
      );
      if (mode === "bubble") {
        b.setAttribute("aria-haspopup", "dialog");
        b.replaceChildren(
          Object.assign(document.createElement("span"), {
            className: "fx-hotspot-dot",
          }),
        );
      } else {
        b.removeAttribute("aria-haspopup");
        b.textContent = i + 1;
      }
    });
    detail.hidden = mode === "bubble";
    hint.hidden = mode !== "bubble";
    bubble.hidden = mode !== "bubble" || active < 0;
    const host = mode === "bubble" ? bubble : detail;
    host.replaceChildren();
    if (active < 0) {
      detail.textContent =
        "사진 위의 번호를 눌러 제품과 공간의 설명을 확인하세요.";
      return;
    }
    const title = document.createElement("strong"),
      p = document.createElement("p"),
      button = document.createElement("button");
    title.textContent = names[active];
    p.textContent = descriptions[active];
    button.type = "button";
    if (mode === "bubble") {
      button.setAttribute("aria-label", "말풍선 닫기");
      button.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    } else button.textContent = "설명 닫기";
    button.onclick = () => close();
    host.append(title, p, button);
    place();
  }
  modes.forEach(
    (b) =>
      (b.onclick = () => {
        mode = b.dataset.hotspotMode;
        pinned = -1;
        modes.forEach((m) => m.setAttribute("aria-pressed", String(m === b)));
        show(-1);
      }),
  );
  buttons.forEach((b, i) => {
    b.onpointerenter = (e) => {
      if (mode === "bubble" && e.pointerType === "mouse" && pinned < 0) show(i);
    };
    b.onfocus = () => {
      if (suppress) {
        suppress = false;
        return;
      }
      if (mode === "bubble") show(i);
    };
    b.onclick = () => {
      if (mode === "bubble") {
        if (pinned === i) {
          pinned = -1;
          show(-1);
        } else {
          pinned = i;
          show(i);
        }
      } else show(active === i ? -1 : i);
    };
  });
  image.onpointerleave = () => {
    if (mode === "bubble" && pinned < 0) show(-1);
  };
  image.onfocusout = (e) => {
    if (mode === "bubble" && pinned < 0 && !image.contains(e.relatedTarget))
      show(-1);
  };
  image.onkeydown = (e) => {
    if (e.key === "Escape" && active >= 0) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("pointerdown", (e) => {
    if (mode === "bubble" && active >= 0 && !image.contains(e.target))
      close(false);
  });
  image.addEventListener("click", (e) => {
    if (
      mode === "bubble" &&
      !e.target.closest(".fx-hotspot,.fx-hotspot-bubble")
    )
      close(false);
  });
  const observer = new ResizeObserver(place);
  observer.observe(image);
  observer.observe(bubble);
  window.addEventListener("pagehide", () => observer.disconnect(), {
    once: true,
  });
}
function setupHalftone() {
  const root = document.querySelector(".scene-halftone"),
    canvas = root.querySelector("canvas"),
    image = root.querySelector("img"),
    input = root.querySelector("input"),
    button = root.querySelector("button"),
    scratch = document.createElement("canvas");
  scratch.width = 320;
  scratch.height = 200;
  let original = false;
  function draw() {
    if (!image.complete || !image.naturalWidth) return;
    const ctx = canvas.getContext("2d"),
      src = scratch.getContext("2d"),
      size = Number(input.value);
    src.drawImage(image, 0, 0, 320, 200);
    const pixels = src.getImageData(0, 0, 320, 200).data;
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
  }
  image.addEventListener("load", draw);
  input.oninput = () => {
    root.querySelector("output").textContent = input.value + "px";
    draw();
  };
  button.onclick = () => {
    original = !original;
    button.setAttribute("aria-pressed", String(original));
    button.textContent = original ? "하프톤 보기" : "원본 보기";
    canvas.style.opacity = original ? "0" : "1";
    root.querySelector(".fx-halftone-tag").textContent = original
      ? "원본"
      : "HALFTONE";
  };
  draw();
}
const functions = {
  "magnetic-button": setupMagnet,
  "image-trail": setupImageTrail,
  "hover-reveal": setupHoverReveal,
  "blend-cursor": setupBlend,
  spotlight: setupSpotlight,
  "tilt-card": setupTilt,
  "cursor-label": setupCursorLabel,
  ripple: setupRipple,
  "cursor-trail": setupCursorTrail,
  masonry: setupMasonry,
  lightbox: setupLightbox,
  "before-after-slider": setupCompare,
  "ken-burns": setupKenBurns,
  "image-magnifier": setupMagnifier,
  "image-accordion": setupImageAccordion,
  "image-hotspot": setupHotspot,
  halftone: setupHalftone,
};
const pointerIds = [
  "magnetic-button",
  "blend-cursor",
  "spotlight",
  "tilt-card",
  "cursor-label",
  "cursor-trail",
];
// Trail images are ordered using the same original artwork as the gallery thumbnails.
const galleryImages = [...effectMarkup.lightbox.matchAll(/src="([^"]+)"/g)].map(
  (m) => m[1].replace(/&amp;/g, "&"),
);
export const effectScript = Object.fromEntries(
  Object.entries(functions).map(([id, fn]) => [
    id,
    `${pointerIds.includes(id) ? trackPointer.toString() : ""}
${id === "image-hotspot" ? module.exports.hotspotPlacement.toString() : ""}\n(${fn.toString()})(${id === "image-trail" ? JSON.stringify(galleryImages) : ""});`,
  ]),
);
