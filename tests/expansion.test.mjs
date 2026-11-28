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
import {
  scenarioIds,
  isLiveScenario,
} from "../src/demos/scenario-contract.mjs";
const require = createRequire(import.meta.url);
const compiled = buildSync({
  entryPoints: ["src/demos/expansion.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  packages: "external",
  write: false,
});
function runtime() {
  const sent = [],
    listeners = new Map(),
    fakeParent = { postMessage: (data) => sent.push(data) };
  const fakeWindow = {
    __DEMO__: { id: "badge", nonce: "test-nonce" },
    innerWidth: 600,
    innerHeight: 600,
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type) => listeners.delete(type),
  };
  const module = { exports: {} };
  runInNewContext(compiled.outputFiles[0].text, {
    module,
    exports: module.exports,
    require,
    window: fakeWindow,
    document: { addEventListener() {}, removeEventListener() {} },
    parent: fakeParent,
    setTimeout,
    clearTimeout,
  });
  return {
    sent,
    listeners,
    fakeParent,
    window: fakeWindow,
    attachContext: module.exports.attachContext,
    create: module.exports.createScenarioController,
  };
}
test("등록된 상태 키·대상 iframe·nonce가 일치할 때만 실제 상태를 변경한다", () => {
  const r = runtime();
  let value = 0;
  const c = r.create(
    { dataset: { expansion: "badge" } },
    { default: () => (value = 0), unread: () => (value = 5) },
  );
  c.set("default", true);
  assert.equal(r.sent.length, 0);
  c.ready();
  assert.equal(r.sent[0].type, "demo:ready");
  const receive = r.listeners.get("message");
  for (const event of [
    {
      source: {},
      data: {
        nonce: "test-nonce",
        id: "badge",
        command: "scenario",
        value: "unread",
      },
    },
    {
      source: r.fakeParent,
      data: {
        nonce: "wrong",
        id: "badge",
        command: "scenario",
        value: "unread",
      },
    },
    {
      source: r.fakeParent,
      data: {
        nonce: "test-nonce",
        id: "avatar",
        command: "scenario",
        value: "unread",
      },
    },
    {
      source: r.fakeParent,
      data: {
        nonce: "test-nonce",
        id: "badge",
        command: "scenario",
        value: "constructor",
      },
    },
  ])
    receive(event);
  assert.equal(value, 0);
  receive({
    source: r.fakeParent,
    data: {
      nonce: "test-nonce",
      id: "badge",
      command: "scenario",
      value: "unread",
    },
  });
  assert.equal(value, 5);
  assert.equal(r.sent.at(-1).state, "unread");
  c.state("unread");
  value = 9;
  c.set("unread");
  assert.equal(
    value,
    9,
    "feedback from the parent must not reset a user-edited value",
  );
  c.destroy();
  assert.equal(r.listeners.size, 0);
});
test("미리보기는 라이브 이벤트·타이머를 실행하지 않고 상태 전환은 남은 처리를 취소한다", async () => {
  const r = runtime();
  let calls = 0;
  const c = r.create(
    { dataset: { expansion: "badge" } },
    { default: () => calls++ },
    true,
  );
  c.on({}, "click", () => {});
  c.later(() => calls++, 1);
  c.ready();
  await new Promise((resolve) => setTimeout(resolve, 8));
  assert.equal(calls, 0);
  assert.equal(r.listeners.size, 0);
  assert.equal(r.sent.length, 0);
  const live = r.create(
    { dataset: { expansion: "badge" } },
    { default: () => {}, unread: () => {} },
  );
  live.later(() => calls++, 1);
  live.set("unread");
  await new Promise((resolve) => setTimeout(resolve, 8));
  assert.equal(calls, 0);
  live.destroy();
});
test("신규 24개 상태 계약은 기존 77개 설명 화면에 잘못 적용되지 않는다", () => {
  assert.equal(Object.keys(scenarioIds).length, 24);
  assert.equal(isLiveScenario("badge", "unread"), true);
  assert.equal(isLiveScenario("badge", "default"), true);
  assert.equal(isLiveScenario("badge", "unregistered"), false);
  assert.equal(isLiveScenario("modal", "error"), false);
});
const repositoryCode = buildSync({
  entryPoints: ["src/lib/db.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  banner: {
    js: 'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");',
  },
}).outputFiles[0].text;
test("신규 추가는 기존 77개·게시본·이력을 보존하며 초안 24개를 한 번만 저장한다", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ui-a1-"));
  const previous = process.env.UI_NOTES_DB_PATH;
  process.env.UI_NOTES_DB_PATH = path.join(dir, "test.sqlite");
  try {
    const file = path.join(dir, "repository.mjs");
    writeFileSync(file, repositoryCode);
    const r = await import(pathToFileURL(file));
    await r.listTerms();
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const id of Object.keys(scenarioIds)) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
      for (const table of ["content_meta", "term_versions"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(id);
    }
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 77);
    const preview = await r.addExpansionDrafts();
    assert.equal(preview.applied, false);
    assert.equal(preview.added.length, 24);
    assert.deepEqual((await r.exportBackup()).terms, before.terms);
    const result = await r.addExpansionDrafts(true);
    assert.equal(result.added.length, 24);
    assert.ok(result.checkpoint);
    assert.equal((await r.listTerms()).length, 77);
    assert.equal((await r.listTerms(true)).length, 101);
    const after = await r.exportBackup();
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
    for (const id of Object.keys(scenarioIds))
      assert.equal(
        (await r.listTerms(true)).find((t) => t.id === id).status,
        "draft",
      );
    const second = await r.addExpansionDrafts(true);
    assert.equal(second.added.length, 0);
    assert.deepEqual((await r.exportBackup()).terms, after.terms);
    assert.deepEqual((await r.exportBackup()).history, after.history);
  } finally {
    if (previous === undefined) delete process.env.UI_NOTES_DB_PATH;
    else process.env.UI_NOTES_DB_PATH = previous;
    rmSync(dir, { recursive: true, force: true });
  }
});

test("상태 안내로 iframe이 리사이즈되어도 열린 작업 메뉴를 닫지 않고 안쪽에 재배치한다", () => {
  const r = runtime();
  r.window.__DEMO__.id = "context-menu";
  const element = (width = 300, height = 100) => ({
    hidden: true,
    checked: false,
    disabled: false,
    dataset: {},
    style: {},
    setAttribute() {},
    removeAttribute() {},
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, right: width, bottom: height, width, height };
    },
  });
  const selectors = [
    "target",
    "open",
    "menu",
    "undo",
    "lock",
    "note",
    "editor",
    "name",
    "save-name",
    "cancel-name",
  ];
  const nodes = Object.fromEntries(
    selectors.map((key) => [`[data-context-${key}]`, element()]),
  );
  nodes["[data-status]"] = element();
  nodes["[data-name-metrics]"] = element();
  nodes['[data-context-action="archive"]'] = element();
  const menu = nodes["[data-context-menu]"];
  menu.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 190,
    height: 120,
  });
  menu.querySelectorAll = () =>
    [element(), element(), nodes['[data-context-action="archive"]']].filter(
      (e) => !e.disabled,
    );
  const root = {
    ...element(),
    dataset: { expansion: "context-menu" },
    querySelector: (selector) => nodes[selector],
  };
  const controller = r.attachContext(root);
  controller.set("open");
  assert.equal(menu.hidden, false);
  assert.equal(r.sent.at(-1).state, "open");
  r.window.innerWidth = 200;
  r.listeners.get("resize")();
  assert.equal(menu.hidden, false);
  assert.equal(r.sent.at(-1).state, "open");
  assert.ok(parseFloat(menu.style.left) + 190 <= 200);
  controller.destroy();
});

test("수량은 편집 중 빈 값과 확정 가능한 정수를 구분하고 시간은 형식·간격·예약 불가를 검증한다", () => {
  const module = { exports: {} };
  runInNewContext(compiled.outputFiles[0].text, {module,exports:module.exports,require});
  const {validateQuantity,validateTime}=module.exports;
  for(const n of ['1','4','10']) assert.equal(validateQuantity(n),'');
  for(const n of ['',' ','0','11','-1','1.5','NaN','Infinity']) assert.notEqual(validateQuantity(n),'',n);
  for(const t of ['09:00','09:30','11:30','13:00','18:00']) assert.equal(validateTime(t),'',t);
  for(const t of ['','9:00','24:00','09:77','08:30','18:30','09:15','12:00','12:30']) assert.notEqual(validateTime(t),'',t);
  assert.match(validateTime('12:00'),/13:00/);
  assert.match(validateTime('09:15'),/30분/);
});

test("입력 가이드 보강은 사용자 원고·게시본을 보존하며 초안에만 한 번 추가한다", async () => {
  const dir=mkdtempSync(path.join(tmpdir(),'ui-a2-guides-')), previous=process.env.UI_NOTES_DB_PATH;
  process.env.UI_NOTES_DB_PATH=path.join(dir,'test.sqlite');
  try {
    const file=path.join(dir,'repository.mjs');writeFileSync(file,repositoryCode);
    const r=await import(pathToFileURL(file));
    const original=(await r.listTerms(true)).find(t=>t.demoId==='checkbox');
    const guide=structuredClone(original.guide);
    guide.introduction='사용자가 편집한 고유한 도입 문구';
    guide.examples=guide.examples.filter(e=>e.id!=='required-consent');
    guide.flow=guide.flow.filter(e=>e.title!=='필수 2개와 선택 1개 동의');
    guide.practice='사용자가 작성한 체험 순서';
    for(const role of Object.values(guide.roles))role.tasks=role.tasks.filter(t=>!t.title.startsWith('입력 보강 검토:'));
    await r.saveContent({...original,guide},'save');
    const before=await r.exportBackup();
    const preview=await r.addInputEnhancementDrafts();assert.deepEqual(preview.updated,[original.id]);assert.equal(preview.applied,false);
    assert.deepEqual((await r.exportBackup()).terms,before.terms);
    const result=await r.addInputEnhancementDrafts(true);assert.ok(result.checkpoint);
    const after=await r.exportBackup(),updated=after.terms.find(t=>t.document.id===original.id),old=before.terms.find(t=>t.document.id===original.id);
    assert.deepEqual(updated.published,old.published);
    assert.equal(updated.document.guide.introduction,guide.introduction);
    assert.equal(updated.document.revision,old.document.revision+1);
    assert.ok(updated.document.guide.practice.startsWith(guide.practice));
    for(const other of before.terms.filter(t=>t.document.id!==original.id)) assert.deepEqual(after.terms.find(t=>t.document.id===other.document.id),other);
    const second=await r.addInputEnhancementDrafts(true);assert.equal(second.updated.length,0);
    assert.deepEqual((await r.exportBackup()).terms,after.terms);
  } finally {if(previous===undefined)delete process.env.UI_NOTES_DB_PATH;else process.env.UI_NOTES_DB_PATH=previous;rmSync(dir,{recursive:true,force:true});}
});
