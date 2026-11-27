import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { sceneMap } from "./scenes";
declare global {
  interface Window {
    __DEMO__: { id: keyof typeof sceneMap; reduced: boolean; nonce: string };
  }
}
function DemoApp() {
  const config = window.__DEMO__;
  const [reset, setReset] = useState(0);
  const [reduced, setReduced] = useState(config.reduced);
  const [paused, setPaused] = useState(document.hidden);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== parent || event.data?.nonce !== config.nonce) return;
      if (event.data.command === "reset") setReset((v) => v + 1);
      if (
        event.data.command === "reduce" &&
        typeof event.data.value === "boolean"
      )
        setReduced(event.data.value);
      if (
        event.data.command === "pause" &&
        typeof event.data.value === "boolean"
      )
        setPaused(event.data.value);
    };
    const visible = () => setPaused(document.hidden);
    window.addEventListener("message", receive);
    document.addEventListener("visibilitychange", visible);
    visible();
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [config.nonce]);
  const Scene = sceneMap[config.id];
  return <Scene key={reset} reduced={reduced} paused={paused} />;
}
createRoot(document.getElementById("root")!).render(<DemoApp />);
