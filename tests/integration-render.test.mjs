import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  module = { exports: {} };
const code = buildSync({
  stdin: {
    contents: `import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import View from './src/components/SimulationExperience';export const render=(format)=>renderToStaticMarkup(React.createElement(View,{id:'badge',examples:[],format}));`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
}).outputFiles[0].text;
new Function("module", "exports", "require", code)(
  module,
  module.exports,
  require,
);
test("두 형식의 서버 미리보기는 재렌더해도 동일하며 브라우저 준비 전에 임의 nonce·iframe을 만들지 않는다", () => {
  for (const format of ["react", "html"]) {
    const first = module.exports.render(format),
      second = module.exports.render(format);
    assert.equal(first, second);
    assert.ok(first.includes('role="status"'));
    assert.ok(!first.includes("<iframe"));
    assert.ok(
      !/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(
        first,
      ),
    );
  }
});
