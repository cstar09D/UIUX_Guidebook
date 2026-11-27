import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import postcss from "postcss";

const sources = JSON.parse(readFileSync("src/generated/sources.json", "utf8"));
const names = Object.values(sources).map((source) =>
  source.parts.react[0].filename.replace(/\.tsx$/, ""),
);

test("UI별 부분 코드는 문서 틀과 다른 UI를 포함하지 않고 HTML·CSS·JS로 분리된다", () => {
  for (const source of Object.values(sources)) {
    const parts = source.parts.html;
    assert.deepEqual(
      parts.map((part) => part.id),
      ["markup", "style", "script"],
    );
    assert.doesNotMatch(
      parts[0].code,
      /<!doctype\b|<(?:html|head|body|style|script)\b/i,
    );
    assert.match(source.html, /<!doctype html>/i);
    new vm.Script(parts[2].code);
    postcss.parse(parts[1].code);
    const component = source.parts.react[0].code;
    assert.equal(
      names.filter((name) => component.includes(`function ${name}(`)).length,
      1,
    );
    assert.equal(
      names.filter((name) => source.react.includes(`function ${name}(`)).length,
      1,
    );
    assert.match(component, /import '\.\/ui.css'/);
  }
});

test("등록된 모든 React 부분 코드와 전체 예제는 외부 데모 소스 없이 타입 검사된다", () => {
  const directory = mkdtempSync(path.join(process.cwd(), ".code-check-"));
  try {
    const files = [];
    for (const [id, source] of Object.entries(sources)) {
      for (const [kind, code] of [
        ["part", source.parts.react[0].code],
        ["full", source.react],
      ]) {
        const filename = path.join(directory, `${id}-${kind}.tsx`);
        writeFileSync(filename, code);
        files.push(filename);
      }
    }
    const program = ts.createProgram(files, {
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    });
    const errors = ts.getPreEmitDiagnostics(program);
    assert.equal(
      errors.length,
      0,
      ts.formatDiagnosticsWithColorAndContext(errors, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: (file) => file,
        getNewLine: () => "\n",
      }),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
