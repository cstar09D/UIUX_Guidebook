import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const directory = mkdtempSync(path.join(tmpdir(), "ui-simulation-states-"));
const result = buildSync({
  stdin: {
    contents: `import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import Screen from './src/components/SimulationStateScreen'; export {detailedGuides} from './src/lib/guide-content'; export const render=(id,example)=>renderToStaticMarkup(React.createElement(Screen,{id,example}));`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  banner: {
    js: 'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");',
  },
});
writeFileSync(path.join(directory, "states.mjs"), result.outputFiles[0].text);
const { render, detailedGuides } = await import(
  pathToFileURL(path.join(directory, "states.mjs")).href
);
rmSync(directory, { recursive: true, force: true });

test("101개 시뮬레이션의 기존 상태를 공통 체험 화면에서 손실 없이 렌더링한다", () => {
  for (const [id, guide] of Object.entries(detailedGuides)) {
    for (const example of guide.examples) {
      const html = render(id, example);
      assert.ok(html.includes("example-surface"), `${id}/${example.id}`);
      assert.ok(html.includes("example-screen-title"), `${id}/${example.id}`);
      assert.ok(
        html.includes(`tone-${example.screen.tone || "default"}`),
        `${id}/${example.id}`,
      );
    }
  }
});

test("관리자가 입력한 상태 문구는 실행 코드가 아닌 텍스트로 표시한다", () => {
  const value = '<script>alert("example")</script>';
  const html = render("skeleton", {
    id: "custom",
    label: "직접 입력",
    screen: { title: value, body: value, items: [value], action: value },
  });
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});
