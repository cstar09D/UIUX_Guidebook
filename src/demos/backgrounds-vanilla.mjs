import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { backgroundRegistry } from "./registry.ts";
const require = createRequire(import.meta.url),
  module = { exports: {} };
runInNewContext(
  buildSync({
    entryPoints: ["src/demos/backgrounds.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }).outputFiles[0].text,
  { module, exports: module.exports, require },
);
export const backgroundMarkup = Object.fromEntries(
  backgroundRegistry.map((d) => [
    d.id,
    renderToStaticMarkup(createElement(module.exports[d.component])),
  ]),
);
function backgroundClock(root, render) {
  const input = root.querySelector("input"),
    output = root.querySelector("output"),
    unit = output.textContent.replace(/[\d.\s]/g, "");
  let frame = 0,
    last = 0,
    elapsed = 0;
  function update() {
    output.textContent = input.value + unit;
    render(elapsed / 1000, Number(input.value));
  }
  function tick(at) {
    frame = 0;
    if (document.hidden || window.__DEMO__?.reduced) {
      last = 0;
      return;
    }
    if (last) elapsed += Math.min(at - last, 80);
    last = at;
    update();
    frame = requestAnimationFrame(tick);
  }
  function start() {
    cancelAnimationFrame(frame);
    last = 0;
    if (!document.hidden && !window.__DEMO__?.reduced)
      frame = requestAnimationFrame(tick);
  }
  input.oninput = update;
  document.addEventListener("visibilitychange", start);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), {
    once: true,
  });
  update();
  start();
}
function backgroundSeed(i) {
  return ((i * 7919 + 104729) % 997) / 997;
}
function setupMesh() {
  const root = document.querySelector(".scene-mesh-gradient"),
    layer = root.querySelector(".bg-mesh");
  backgroundClock(root, (t, hue) => {
    layer.style.filter = `hue-rotate(${hue}deg)`;
    layer.style.background = `radial-gradient(ellipse at ${25 + Math.sin(t * 0.78) * 15}% ${30 + Math.cos(t * 0.78) * 20}%,#78b7de 0%,transparent 65%),radial-gradient(ellipse at ${75 + Math.cos(t * 0.78) * 18}% ${60 + Math.sin(t * 0.78) * 18}%,#97cdbd 0%,transparent 65%),radial-gradient(ellipse at 45% 100%,#e7b8ca 0%,transparent 65%),#e8e8f4`;
  });
}
function setupAurora() {
  const root = document.querySelector(".scene-aurora"),
    layers = root.querySelectorAll(".bg-aurora>i");
  backgroundClock(root, (clock, speed) => {
    const t = clock * speed;
    layers.forEach(
      (el, i) =>
        (el.style.transform = `translateY(${Math.sin(t * 0.78 + i) * 22}%) rotate(${20 + Math.sin(t * 0.78 + i) * 10}deg) skewX(${Math.cos(t * 0.78 + i) * 14}deg)`),
    );
  });
}
function setupGrain() {
  const root = document.querySelector(".scene-grain"),
    layer = root.querySelector(".bg-grain-noise");
  backgroundClock(root, (t, n) => {
    layer.style.opacity = n / 100;
    layer.style.transform = `translate(${Math.sin(t * 2.35) * 2}%,${Math.cos(t * 2.35) * 2}%)`;
  });
}
function setupDots() {
  const root = document.querySelector(".scene-dot-grid"),
    input = root.querySelector("input"),
    output = root.querySelector("output"),
    layer = root.querySelector(".bg-dots");
  input.oninput = () => {
    output.textContent = input.value + "px";
    layer.style.backgroundSize = `${input.value}px ${input.value}px`;
  };
}
function setupBeams() {
  const root = document.querySelector(".scene-beams"),
    layers = root.querySelectorAll(".bg-beams b");
  backgroundClock(root, (clock, speed) =>
    layers.forEach(
      (el, i) =>
        (el.style.top =
          (((clock * speed) / 3 + i * 0.19) % 1) * 150 - 25 + "%"),
    ),
  );
}
function setupBlob() {
  const root = document.querySelector(".scene-blob"),
    layers = root.querySelectorAll(".bg-blobs>i");
  backgroundClock(root, (clock, speed) => {
    const t = clock * speed;
    layers.forEach((el, i) => {
      el.style.transform = `translate(${Math.sin(t * 0.78 + i * 2) * 14}%,${Math.cos(t * 0.78 + i) * 15}%) rotate(${Math.sin(t * 0.78) * 25}deg)`;
      el.style.borderRadius = `${45 + Math.sin(t * 0.78 + i) * 15}% ${55 - Math.sin(t * 0.78 + i) * 15}% 40% 60% / 55% 35% 65% 45%`;
    });
  });
}
function setupOrb() {
  const root = document.querySelector(".scene-glow-orb"),
    layers = root.querySelectorAll(".bg-orbs>i");
  backgroundClock(root, (t, strength) =>
    layers.forEach((el, i) => {
      el.style.top = 25 + Math.sin(t * 0.78 + i) * 25 + "%";
      el.style.opacity = strength / 100;
      el.style.transform = `translateX(${Math.cos(t * 0.78 + i) * 24}%) scale(${1 + Math.sin(t * 0.78 + i) * 0.14})`;
    }),
  );
}
function setupParticles() {
  const root = document.querySelector(".scene-particles"),
    layer = root.querySelector(".bg-particles");
  const mode = root.querySelector("[data-particle-mode]"),
    button = root.querySelector("[data-confetti-start]"),
    status = root.querySelector("[data-confetti-status]");
  let timer = 0;
  mode.onchange = () => {
    layer.hidden = mode.value === "confetti";
    root.querySelector(".bg-confetti")?.remove();
    clearTimeout(timer);
    button.disabled = false;
  };
  button.onclick = () => {
    status.textContent =
      "작업 완료! 축하 동작은 모의이며 데이터를 저장하지 않습니다.";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.querySelector(".bg-confetti")?.remove();
    const burst = document.createElement("div");
    burst.className = "bg-confetti";
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement("i");
      dot.style.cssText = `left:${10 + i * 3.4}%;background:${["#6fa5ff", "#f3b658", "#ec8ea8", "#80d0b3"][i % 4]};animation-delay:${i * 8}ms;rotate:${i * 37}deg`;
      burst.append(dot);
    }
    root.querySelector(".bg-art").append(burst);
    button.disabled = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      burst.remove();
      button.disabled = false;
    }, 1200);
  };
  const stopBurst = () => {
    clearTimeout(timer);
    root.querySelector(".bg-confetti")?.remove();
    button.disabled = false;
  };
  const visibility = () => {
    if (document.hidden) stopBurst();
  };
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting) stopBurst();
  });
  observer.observe(root);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener(
    "pagehide",
    () => {
      stopBurst();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    },
    { once: true },
  );
  backgroundClock(root, (t, count) => {
    if (mode.value === "confetti") return;
    while (layer.children.length > count) layer.lastChild.remove();
    while (layer.children.length < count)
      layer.append(document.createElement("i"));
    [...layer.children].forEach((el, i) => {
      el.style.cssText = `left:${5 + backgroundSeed(i) * 90 + Math.sin(t * 0.78 + i) * 3}%;top:${5 + backgroundSeed(i + 31) * 85 + Math.cos(t * 0.78 + i * 0.7) * 4}%;width:${2 + backgroundSeed(i + 8) * 4}px;height:${2 + backgroundSeed(i + 8) * 4}px;opacity:${0.25 + backgroundSeed(i + 12) * 0.6}`;
    });
  });
}
function setupStarfield() {
  const root = document.querySelector(".scene-starfield"),
    layers = root.querySelectorAll(".bg-stars>i");
  backgroundClock(root, (clock, speed) =>
    layers.forEach((el, i) => {
      const angle = backgroundSeed(i) * Math.PI * 2,
        z = (backgroundSeed(i + 20) + clock * speed * 0.09) % 1,
        depth = z * z;
      el.style.cssText = `left:${Number((50 + Math.cos(angle) * depth * 85).toFixed(3))}%;top:${Number((50 + Math.sin(angle) * depth * 90).toFixed(3))}%;width:${Number((0.6 + depth * 4).toFixed(3))}px;height:${Number((0.6 + depth * 4).toFixed(3))}px;opacity:${Number(z.toFixed(3))};transform:rotate(${Number(angle.toFixed(3))}rad) scaleX(${Number((1 + depth * 1.2).toFixed(3))})`;
    }),
  );
}
const functions = {
  "mesh-gradient": setupMesh,
  aurora: setupAurora,
  grain: setupGrain,
  "dot-grid": setupDots,
  beams: setupBeams,
  blob: setupBlob,
  "glow-orb": setupOrb,
  particles: setupParticles,
  starfield: setupStarfield,
};
export const backgroundScript = Object.fromEntries(
  Object.entries(functions).map(([id, fn]) => [
    id,
    `${id === "dot-grid" ? "" : backgroundClock.toString()}\n${["particles", "starfield"].includes(id) ? backgroundSeed.toString() : ""}\n(${fn.toString()})();`,
  ]),
);
