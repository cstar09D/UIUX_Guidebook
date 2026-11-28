/** Developer-owned state keys. Stored labels never become executable commands. */
/** @type {Record<string, string[]>} */
export const scenarioIds = {
  "split-view": ["balanced", "dragging", "minimum", "maximum", "compact"],
  "mega-menu": ["closed", "products", "resources", "selected", "mobile"],
  "scroll-reveal": ["before", "revealing", "visible", "repeat", "static"],
  "stagger-animation": ["simultaneous", "sequential", "restart", "static"],
  "scroll-snap": ["free", "proximity", "mandatory", "last"],
  "parallax-scroll": ["static", "weak", "strong", "compact"],

  "notification-center": ["unread", "read", "empty", "loading", "error"],
  "hover-card": ["closed", "open", "pinned", "missing", "image-error"],
  "inline-edit": ["reading", "editing", "saving", "error", "success"],
  "infinite-scroll": ["initial", "ready", "loading", "error", "end"],
  "swipe-actions": [
    "closed",
    "dragging",
    "open",
    "pending",
    "deleted",
    "error",
  ],
  "pull-to-refresh": [
    "idle",
    "pulling",
    "armed",
    "loading",
    "success",
    "error",
  ],
  "password-field": ["empty", "masked", "visible", "invalid", "valid"],
  "otp-input": ["editing", "complete", "error", "expired", "success"],
  "multi-select": ["search", "empty", "selected", "limit"],
  "number-stepper": ["minimum", "normal", "maximum", "invalid"],
  "time-picker": ["empty", "available", "unavailable", "invalid"],
  rating: ["empty", "hover", "selected", "readonly", "disabled"],
  badge: ["unread", "overflow", "zero", "status"],
  "chip-tag": ["selected", "removable", "limit", "readonly"],
  avatar: ["fallback", "missing", "group", "expanded"],
  "command-palette": ["open", "empty", "loading", "error"],
  "context-menu": ["open", "disabled", "archived", "edge"],
  "split-button": ["open", "saving", "success", "error"],
};
export function isLiveScenario(id, key) {
  return (
    Object.hasOwn(scenarioIds, id) &&
    (key === "default" || scenarioIds[id].includes(key))
  );
}
