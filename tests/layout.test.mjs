import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
const require = createRequire(import.meta.url);
const module = { exports: {} };
runInNewContext(
  buildSync({
    entryPoints: ["src/demos/expansion.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }).outputFiles[0].text,
  { module, exports: module.exports, require },
);
test("분할 비율은 키보드·버튼·포인터가 같은 25~75% 경계를 사용한다", () => {
  const { clampSplit } = module.exports;
  for (const [input, expected] of [
    [-1, 25],
    [0, 25],
    [25, 25],
    [50, 50],
    [63.5, 63.5],
    [75, 75],
    [120, 75],
  ])
    assert.equal(clampSplit(input), expected);
});
const code = buildSync({
  entryPoints: ["src/lib/db.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  banner: {
    js: 'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");',
  },
}).outputFiles[0].text;
async function repository(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), "ui-a4-test-")),
    old = process.env.UI_NOTES_DB_PATH;
  process.env.UI_NOTES_DB_PATH = path.join(dir, "test.sqlite");
  try {
    const f = path.join(dir, "repo.mjs");
    writeFileSync(f, code);
    await fn(await import(pathToFileURL(f)), process.env.UI_NOTES_DB_PATH);
  } finally {
    if (old === undefined) delete process.env.UI_NOTES_DB_PATH;
    else process.env.UI_NOTES_DB_PATH = old;
    rmSync(dir, { recursive: true, force: true });
  }
}
const ids = [
  "split-view",
  "mega-menu",
  "scroll-reveal",
  "stagger-animation",
  "scroll-snap",
  "parallax-scroll",
];
test("A4는 기존 95개 원고·게시·이력을 보존하며 6개만 초안으로 한 번 추가한다", () =>
  repository(async (r, file) => {
    await r.listTerms();
    const sql = new DatabaseSync(file);
    for (const id of ids) {
      for (const t of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${t} WHERE id=?`).run(id);
      for (const t of ["content_meta", "term_versions"])
        sql.prepare(`DELETE FROM ${t} WHERE term_id=?`).run(id);
    }
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 95);
    assert.deepEqual(
      [...(await r.addExpansionDrafts()).added].sort(),
      [...ids].sort(),
    );
    assert.deepEqual((await r.exportBackup()).terms, before.terms);
    assert.ok((await r.addExpansionDrafts(true)).checkpoint);
    const after = await r.exportBackup();
    assert.equal(after.terms.length, 101);
    assert.equal((await r.listTerms()).length, 95);
    for (const old of before.terms)
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((t) => t.id === old.id),
        old,
      );
    for (const t of (await r.listTerms(true)).filter((t) =>
      ids.includes(t.demoId),
    ))
      assert.equal(t.status, "draft");
    assert.deepEqual((await r.addExpansionDrafts(true)).added, []);
  }));
test("배치·모션 가이드 추가는 사용자 도입·게시본·다른 원고를 보존하고 중복하지 않는다", () =>
  repository(async (r) => {
    const original = (await r.listTerms(true)).find(
        (t) => t.demoId === "particles",
      ),
      guide = structuredClone(original.guide);
    guide.introduction = "사용자의 배경 효과 설명";
    guide.examples = guide.examples.filter((x) => x.id !== "success-confetti");
    guide.flow = guide.flow.filter(
      (x) => x.title !== "지속 부유와 한 번만 축하하기",
    );
    guide.practice = "사용자의 실무 과제";
    for (const role of Object.values(guide.roles))
      role.tasks = role.tasks.filter(
        (x) => !x.title.startsWith("배치·모션 보강:"),
      );
    await r.saveContent({ ...original, guide }, "save");
    const before = await r.exportBackup();
    assert.deepEqual((await r.addLayoutEnhancementDrafts()).updated, [
      original.id,
    ]);
    assert.ok((await r.addLayoutEnhancementDrafts(true)).checkpoint);
    const after = await r.exportBackup(),
      saved = after.terms.find((t) => t.document.id === original.id),
      old = before.terms.find((t) => t.document.id === original.id);
    assert.deepEqual(saved.published, old.published);
    assert.equal(saved.document.guide.introduction, guide.introduction);
    assert.ok(saved.document.guide.practice.startsWith(guide.practice));
    for (const other of before.terms.filter(
      (t) => t.document.id !== original.id,
    ))
      assert.deepEqual(
        after.terms.find((t) => t.document.id === other.document.id),
        other,
      );
    assert.deepEqual((await r.addLayoutEnhancementDrafts(true)).updated, []);
  }));

test("스크롤 리빌 상태 선택은 대기 중 관찰 응답에 덮이지 않고 조작 후 관찰을 다시 시작한다", () => {
  const events = () => ({
    handlers: new Map(),
    addEventListener(type, fn) {
      this.handlers.set(type, fn);
    },
    removeEventListener(type) {
      this.handlers.delete(type);
    },
  });
  const cards = Array.from({ length: 4 }, () => ({
      dataset: {},
      contains: () => false,
    })),
    viewport = { ...events(), scrollTop: 0 },
    mode = { ...events(), value: "once" },
    threshold = { ...events(), value: "0.2" },
    reset = events(),
    status = { textContent: "" },
    observers = [];
  const root = {
    ...events(),
    dataset: { expansion: "scroll-reveal" },
    querySelector(selector) {
      return {
        "[data-reveal-viewport]": viewport,
        "[data-reveal-mode]": mode,
        "[data-reveal-threshold]": threshold,
        "[data-reveal-reset]": reset,
        "[data-layout-status]": status,
      }[selector];
    },
    querySelectorAll() {
      return cards;
    },
  };
  const sent = [];
  const fakeWindow = {
      ...events(),
      IntersectionObserver: true,
      __DEMO__: { id: "scroll-reveal", nonce: "test" },
    },
    fakeDocument = { ...events(), hidden: false, activeElement: null };
  class Observer {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe() {}
    unobserve() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  const runtime = { exports: {} };
  runInNewContext(
    buildSync({
      entryPoints: ["src/demos/expansion.tsx"],
      bundle: true,
      platform: "node",
      format: "cjs",
      packages: "external",
      write: false,
    }).outputFiles[0].text,
    {
      module: runtime,
      exports: runtime.exports,
      require,
      window: fakeWindow,
      document: fakeDocument,
      matchMedia: () => ({ matches: false }),
      IntersectionObserver: Observer,
      parent: {
        postMessage(data) {
          sent.push(data);
        },
      },
      setTimeout,
      clearTimeout,
    },
  );
  const c = runtime.exports.attachReveal(root);
  observers[0].callback([{ target: cards[0], isIntersecting: true }]);
  assert.equal(cards[0].dataset.shown, "true");
  c.set("before");
  assert.ok(observers[0].disconnected);
  observers[0].callback([{ target: cards[1], isIntersecting: true }]);
  assert.deepEqual(
    cards.map((el) => el.dataset.shown),
    ["false", "false", "false", "false"],
  );
  viewport.handlers.get("scroll")();
  assert.equal(observers.length, 2);
  observers[1].callback([{ target: cards[3], isIntersecting: true }]);
  assert.equal(cards[3].dataset.shown, "true");
  c.set("visible");
  assert.ok(cards.every((el) => el.dataset.shown === "true"));
  viewport.handlers.get("scroll")();
  assert.equal(sent.at(-1).state, "visible");
  c.destroy();
  assert.ok(observers[1].disconnected);
});
