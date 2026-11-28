import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { measureText, formatTextMetrics } from "./input-metrics.mjs";
const require = createRequire(import.meta.url);
const compiled = buildSync({
  entryPoints: ["src/demos/expansion.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  packages: "external",
  write: false,
});
const module = { exports: {} };
runInNewContext(compiled.outputFiles[0].text, {
  module,
  exports: module.exports,
  require,
});
const entries = {
  "split-view": ["PanelsScene", "attachPanels"],
  "mega-menu": ["MegaMenuScene", "attachMega"],
  "scroll-reveal": ["RevealScene", "attachReveal"],
  "stagger-animation": ["StaggerScene", "attachStagger"],
  "scroll-snap": ["SnapScene", "attachSnap"],
  "parallax-scroll": ["ParallaxScene", "attachParallax"],

  "notification-center": ["NotificationScene", "attachNotification"],
  "hover-card": ["HoverCardScene", "attachHoverCard"],
  "inline-edit": ["InlineEditScene", "attachInlineEdit"],
  "infinite-scroll": ["InfiniteScrollScene", "attachInfinite"],
  "swipe-actions": ["SwipeActionsScene", "attachSwipe"],
  "pull-to-refresh": ["PullRefreshScene", "attachRefresh"],

  "password-field": ["PasswordScene", "attachPassword"],
  "otp-input": ["OtpScene", "attachOtp"],
  "multi-select": ["MultiSelectScene", "attachMultiSelect"],
  "number-stepper": ["NumberScene", "attachNumber"],
  "time-picker": ["TimeScene", "attachTime"],
  rating: ["RatingScene", "attachRating"],

  badge: ["BadgeScene", "attachBadge"],
  "chip-tag": ["ChipScene", "attachChips"],
  avatar: ["AvatarScene", "attachAvatar"],
  "command-palette": ["CommandScene", "attachCommand"],
  "context-menu": ["ContextScene", "attachContext"],
  "split-button": ["SplitButtonScene", "attachSplit"],
};
export const expansionMarkup = Object.fromEntries(
  Object.entries(entries).map(([id, [name]]) => [
    id,
    renderToStaticMarkup(createElement(module.exports[name])),
  ]),
);
export const expansionScript = Object.fromEntries(
  Object.entries(entries).map(([id, [, attach]]) => [
    id,
    `(()=>{${measureText.toString()};${formatTextMetrics.toString()};${module.exports.createScenarioController.toString()};${id === "split-view" ? module.exports.clampSplit.toString() + ";" : ""}${id === "number-stepper" ? module.exports.validateQuantity.toString() + ";" : id === "time-picker" ? module.exports.validateTime.toString() + ";" : ""}${["swipe-actions", "pull-to-refresh"].includes(id) ? module.exports.gestureIntent.toString() + ";" : ""}${id === "swipe-actions" ? module.exports.swipeOffset.toString() + ";" : id === "pull-to-refresh" ? module.exports.pullDistance.toString() + ";" : ""}${module.exports[attach].toString()};${attach}(document.querySelector('[data-expansion="${id}"]'));})();`,
  ]),
);
