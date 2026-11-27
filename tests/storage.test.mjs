import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { buildSync } from "esbuild";
import { mkdtempSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
const bundle = buildSync({
  entryPoints: ["src/lib/db.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  banner: {
    js: 'import { createRequire } from "node:module"; const require=createRequire(import.meta.url);',
  },
}).outputFiles[0].text;
async function usingDB(fn, legacy = false) {
  const directory = mkdtempSync(path.join(tmpdir(), "ui-notes-content-"));
  const old = process.env.UI_NOTES_DB_PATH;
  process.env.UI_NOTES_DB_PATH = path.join(directory, "content.sqlite");
  try {
    if (legacy) {
      const db = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
      db.exec(
        "CREATE TABLE terms(id TEXT PRIMARY KEY,body TEXT);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT)",
      );
      db.prepare("INSERT INTO settings VALUES(?,?)").run("seeded", "1");
      const record = {
        id: "custom",
        demoId: "accordion",
        english: "기존 편집 이름",
        pronunciation: "아코디언",
        korean: "접이식",
        category: "기존 분류",
        summary: "사용자 작성 내용 보존",
        aliases: ["내 별칭"],
        keywords: ["사용자 검색어"],
        hidden: true,
        deleted: false,
        order: 3,
        revision: 7,
      };
      db.prepare("INSERT INTO terms VALUES(?,?)").run(
        record.id,
        JSON.stringify(record),
      );
      db.close();
    }
    const file = path.join(directory, "db.mjs");
    writeFileSync(file, bundle);
    const repository = await import(pathToFileURL(file).href);
    await fn(repository, directory, file);
  } finally {
    if (old === undefined) delete process.env.UI_NOTES_DB_PATH;
    else process.env.UI_NOTES_DB_PATH = old;
    rmSync(directory, { recursive: true, force: true });
  }
}
const cloned = (value) => structuredClone(value);
const status = (code) => (error) => error.status === code;
test("기존 편집·숨김·분류·버전을 보존하며 상세 콘텐츠를 이전하고 재시작 시 유지한다", () =>
  usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true))[0];
    assert.equal(item.english, "기존 편집 이름");
    assert.equal(item.summary, "사용자 작성 내용 보존");
    assert.equal(item.revision, 7);
    assert.equal(item.hidden, true);
    assert.deepEqual(item.keywords, ["사용자 검색어"]);
    assert.ok(item.guide.introduction);
    assert.equal((await r.listTerms()).length, 71);
    assert.ok((await r.getTaxonomy()).categories.includes("기존 분류"));
    assert.equal(readdirSync(path.join(directory, "backups")).length, 8);
    const reopened = await import(pathToFileURL(file).href + "?reopen=1");
    assert.equal((await reopened.listTerms(true)).length, 72);
    assert.equal((await reopened.listTerms(true))[0].revision, 7);
    assert.equal((await reopened.getHistory("custom")).length, 1);
  }, true));
test("초안 저장·이력 복원은 게시본을 바꾸지 않으며 게시와 게시 취소를 구분한다", () =>
  usingDB(async (r) => {
    const original = (await r.listTerms(true))[0];
    const publicOriginal = (await r.listTerms())[0];
    const draft = await r.saveContent(
      {
        ...original,
        summary: "초안의 새 설명",
        guide: { ...original.guide, introduction: "초안의 상세 설명" },
      },
      "save",
    );
    assert.equal(draft.hasUnpublishedChanges, true);
    assert.equal((await r.listTerms())[0].summary, publicOriginal.summary);
    assert.equal(
      (await r.listTerms())[0].guide.introduction,
      publicOriginal.guide.introduction,
    );
    await assert.rejects(
      async () =>
        await r.saveContent({ ...original, summary: "오래된 창" }, "save"),
      status(409),
    );
    const history = (await r.getHistory(draft.id)).find(
      (v) => v.action === "migration",
    );
    const restored = await r.changeTerm(
      draft.id,
      draft.revision,
      "history",
      history.id,
    );
    assert.equal(restored.summary, original.summary);
    assert.equal(restored.revision, draft.revision + 1);
    assert.equal((await r.listTerms())[0].revision, publicOriginal.revision);
    const published = await r.saveContent(
      { ...restored, summary: "실제 게시 설명" },
      "publish",
    );
    assert.equal(published.hasUnpublishedChanges, false);
    assert.equal((await r.listTerms())[0].summary, "실제 게시 설명");
    const unpublish = await r.changeTerm(
      published.id,
      published.revision,
      "unpublish",
    );
    assert.equal(unpublish.status, "draft");
    assert.equal((await r.listTerms()).length, 76);
    assert.ok((await r.getHistory(published.id)).length >= 5);
  }));
test("미완성 초안은 저장되고 게시 검증·숨김·휴지통·복원은 일관되게 동작한다", () =>
  usingDB(async (r) => {
    const base = (await r.listTerms(true))[0];
    let item = await r.saveContent(
      {
        ...base,
        id: "",
        revision: 0,
        english: "새 용어",
        guide: { ...base.guide, introduction: "" },
      },
      "save",
    );
    assert.equal(item.status, "draft");
    assert.equal((await r.listTerms()).length, 77);
    await assert.rejects(
      async () => await r.saveContent(item, "publish"),
      status(422),
    );
    item = await r.saveContent({ ...item, guide: base.guide }, "publish");
    assert.equal((await r.listTerms()).length, 78);
    item = await r.changeTerm(item.id, item.revision, "hide");
    assert.equal((await r.listTerms()).length, 77);
    await assert.rejects(
      async () => await r.changeTerm(item.id, item.revision - 1, "show"),
      status(409),
    );
    item = await r.changeTerm(item.id, item.revision, "show");
    assert.equal((await r.listTerms()).length, 78);
    item = await r.changeTerm(item.id, item.revision, "trash");
    assert.equal((await r.listTerms()).length, 77);
    await assert.rejects(async () => await r.saveContent(item, "publish"));
    item = await r.changeTerm(item.id, item.revision, "restore");
    assert.equal((await r.listTerms()).length, 78);
    assert.equal(item.deleted, false);
  }));
test("카테고리·태그 변경은 초안과 게시본 모두 갱신하고 이력 복원에서 폐기된 분류를 되살리지 않는다", () =>
  usingDB(async (r) => {
    let taxonomy = await r.getTaxonomy();
    taxonomy = await r.changeTaxonomy({
      kind: "tags",
      action: "add",
      name: "상태 전환",
      revision: taxonomy.revision,
    });
    let item = (await r.listTerms(true))[0];
    item = await r.saveContent({ ...item, tags: ["상태 전환"] }, "publish");
    const version = (await r.getHistory(item.id))[0];
    const oldCategory = item.category;
    taxonomy = await r.changeTaxonomy({
      kind: "categories",
      action: "rename",
      name: oldCategory,
      nextName: "레이어 패턴",
      revision: taxonomy.revision,
    });
    assert.equal((await r.listTerms())[0].category, "레이어 패턴");
    assert.equal((await r.listTerms(true))[0].category, "레이어 패턴");
    await assert.rejects(
      async () =>
        await r.changeTaxonomy({
          kind: "categories",
          action: "remove",
          name: "레이어 패턴",
          revision: taxonomy.revision,
        }),
    );
    taxonomy = await r.changeTaxonomy({
      kind: "tags",
      action: "rename",
      name: "상태 전환",
      nextName: "인터랙션",
      revision: taxonomy.revision,
    });
    assert.deepEqual((await r.listTerms())[0].tags, ["인터랙션"]);
    taxonomy = await r.changeTaxonomy({
      kind: "tags",
      action: "remove",
      name: "인터랙션",
      revision: taxonomy.revision,
    });
    assert.deepEqual((await r.listTerms())[0].tags, []);
    item = (await r.listTerms(true))[0];
    item = await r.changeTerm(item.id, item.revision, "history", version.id);
    assert.equal(item.category, "레이어 패턴");
    assert.deepEqual(item.tags, []);
    const replacement = taxonomy.categories.find((c) => c !== "레이어 패턴");
    await r.changeTaxonomy({
      kind: "categories",
      action: "remove",
      name: "레이어 패턴",
      replacement,
      revision: taxonomy.revision,
    });
    assert.equal((await r.listTerms())[0].category, replacement);
    assert.equal((await r.listTerms(true))[0].category, replacement);
    await assert.rejects(
      async () =>
        await r.changeTaxonomy({
          kind: "tags",
          action: "add",
          name: "새 태그",
          revision: 1,
        }),
      status(409),
    );
  }));
test("순서 변경은 즉시 게시 목록에 반영되며 오래된 목록 요청은 거부한다", () =>
  usingDB(async (r) => {
    const all = await r.listTerms(true);
    const reversed = [...all].reverse();
    await r.reorderTerms(
      reversed.map((t) => t.id),
      reversed.map((t) => t.revision),
    );
    assert.deepEqual(
      (await r.listTerms()).map((t) => t.id),
      reversed.map((t) => t.id),
    );
    const state = await r.exportBackup();
    await assert.rejects(
      async () =>
        await r.reorderTerms(
          all.map((t) => t.id),
          all.map((t) => t.revision),
        ),
      status(409),
    );
    assert.deepEqual((await r.exportBackup()).terms, state.terms);
  }));
test("백업은 초안·게시본·이력을 분리 보존하고 검토 후 변경·오류 파일은 적용하지 않는다", () =>
  usingDB(async (r) => {
    const original = (await r.listTerms(true))[0];
    await r.saveContent({ ...original, summary: "게시 전 수정" }, "save");
    const backup = await r.exportBackup();
    assert.notEqual(
      backup.terms[0].document.summary,
      backup.terms[0].published.document.summary,
    );
    const review = await r.previewImport(backup, "replace");
    const item = (await r.listTerms(true))[1];
    await r.saveContent({ ...item, summary: "검토 후 변경" }, "save");
    const before = await r.exportBackup();
    await assert.rejects(
      async () => await r.importBackup(backup, "replace", review.token),
      status(409),
    );
    assert.deepEqual((await r.exportBackup()).terms, before.terms);
    for (const id of ["constructor", "__proto__", "toString"]) {
      const bad = cloned(backup);
      bad.terms[0].document.demoId = id;
      await assert.rejects(async () => await r.previewImport(bad, "merge"));
    }
    const invalid = cloned(backup);
    invalid.terms[0].document.demoId = "missing-demo";
    await assert.rejects(async () => await r.previewImport(invalid, "merge"));
    assert.deepEqual((await r.exportBackup()).terms, before.terms);
    const latestReview = await r.previewImport(backup, "replace");
    const result = await r.importBackup(backup, "replace", latestReview.token);
    assert.ok(result.checkpoint);
    assert.equal((await r.listTerms(true))[0].summary, "게시 전 수정");
    assert.notEqual((await r.listTerms())[0].summary, "게시 전 수정");
    assert.ok(
      (await r.getHistory(original.id)).some((v) => v.action === "import"),
    );
    const checkpoint = JSON.parse(
      await r.checkpointContents(result.checkpoint.id),
    );
    assert.equal(
      checkpoint.terms.find((t) => t.document.id === item.id).document.summary,
      "검토 후 변경",
    );
  }));
test("병합은 파일에 없는 콘텐츠를 유지하고 전체 교체는 제거 대상을 검토하며 이전 백업도 변환한다", () =>
  usingDB(async (r) => {
    const saved = await r.exportBackup();
    let added = await r.saveContent(
      {
        ...(await r.listTerms(true))[0],
        id: "",
        revision: 0,
        english: "추가 초안",
      },
      "save",
    );
    const merge = await r.previewImport(saved, "merge");
    assert.deepEqual(merge.removed, []);
    await r.importBackup(saved, "merge", merge.token);
    assert.ok((await r.listTerms(true)).some((t) => t.id === added.id));
    const replace = await r.previewImport(saved, "replace");
    assert.deepEqual(replace.removed, ["추가 초안"]);
    await r.importBackup(saved, "replace", replace.token);
    assert.ok(!(await r.listTerms(true)).some((t) => t.id === added.id));
    const legacy = {
      version: 1,
      terms: saved.terms.map((t) => {
        const { guide, tags, sourceUrl, devices, ...term } = t.document;
        return term;
      }),
    };
    const preview = await r.previewImport(legacy, "merge");
    assert.equal(preview.legacy, true);
    await r.importBackup(legacy, "merge", preview.token);
    assert.equal((await r.listTerms()).length, 77);
  }));
// Simulate an already-managed catalog: expansion must never overwrite existing ids or revisions.
test("콘텐츠 확장은 기존 초안·게시본·휴지통·분류를 보존하고 한 번만 추가한다", () =>
  usingDB(async (r, directory, file) => {
    const existing = (await r.listTerms(true)).find((t) => t.id === "tooltip");
    let edited = await r.saveContent(
      { ...existing, summary: "사용자 초안 보존" },
      "save",
    );
    edited = await r.changeTerm(edited.id, edited.revision, "trash");
    const before = await r.exportBackup();
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    sql
      .prepare("DELETE FROM settings WHERE key=?")
      .run("catalog-essentials-v1");
    sql.exec(
      "DELETE FROM published_terms WHERE id='tabs';DELETE FROM term_versions WHERE term_id='tabs';DELETE FROM content_meta WHERE term_id='tabs';DELETE FROM terms WHERE id='tabs';",
    );
    sql.close();
    const reopened = await import(pathToFileURL(file).href + "?expansion=1");
    const result = await reopened.exportBackup();
    for (const original of before.terms.filter((t) => t.document.id !== "tabs"))
      assert.deepEqual(
        result.terms.find((t) => t.document.id === original.document.id),
        original,
      );
    assert.equal((await reopened.listTerms(true)).length, 77);
    assert.equal(
      (await reopened.listTerms(true)).find((t) => t.id === "tooltip").deleted,
      true,
    );
    assert.equal((await reopened.getHistory("tabs"))[0].action, "catalog");
    assert.ok(
      (await reopened.listCheckpoints()).some((c) => c.reason === "catalog"),
    );
    const next = await import(pathToFileURL(file).href + "?expansion=2");
    assert.deepEqual((await next.exportBackup()).terms, result.terms);
    assert.equal((await next.getHistory("tabs")).length, 1);
  }));
test("2단계 이전은 기존 14개 편집·게시·휴지통을 보존하고 12개만 한 번 추가한다", () =>
  usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true)).find((t) => t.id === "popover");
    item = await r.saveContent(
      { ...item, summary: "2단계 이전에도 남아야 할 사용자 초안" },
      "save",
    );
    await r.changeTerm(item.id, item.revision, "trash");
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const term of (await r.listTerms(true)).filter((t) => t.order >= 26)) {
      sql.prepare("DELETE FROM published_terms WHERE id=?").run(term.id);
      sql.prepare("DELETE FROM term_versions WHERE term_id=?").run(term.id);
      sql.prepare("DELETE FROM content_meta WHERE term_id=?").run(term.id);
      sql.prepare("DELETE FROM terms WHERE id=?").run(term.id);
    }
    const newIds = (await r.listTerms(true))
      .filter((t) => t.order >= 14 && t.order < 26)
      .map((t) => t.id);
    for (const id of newIds) {
      sql.prepare("DELETE FROM published_terms WHERE id=?").run(id);
      sql.prepare("DELETE FROM term_versions WHERE term_id=?").run(id);
      sql.prepare("DELETE FROM content_meta WHERE term_id=?").run(id);
      sql.prepare("DELETE FROM terms WHERE id=?").run(id);
    }
    sql
      .prepare("DELETE FROM settings WHERE key=?")
      .run("catalog-foundations-v1");
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 14);
    const next = await import(pathToFileURL(file).href + "?stage2=1");
    const result = await next.exportBackup();
    assert.equal(result.terms.length, 26);
    for (const original of before.terms)
      assert.deepEqual(
        result.terms.find((t) => t.document.id === original.document.id),
        original,
      );
    for (const id of newIds) {
      assert.equal((await next.getHistory(id)).length, 1);
      assert.equal((await next.getHistory(id))[0].action, "catalog");
    }
    const third = await import(pathToFileURL(file).href + "?stage2=2");
    assert.deepEqual((await third.exportBackup()).terms, result.terms);
  }));
test("3단계 이전은 기존 26개 초안·게시·휴지통·이력을 보존하고 12개만 한 번 추가한다", () =>
  usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true)).find((t) => t.id === "select");
    item = await r.saveContent(
      { ...item, summary: "이전에도 보존할 사용자 셀렉트 초안" },
      "save",
    );
    await r.changeTerm(item.id, item.revision, "trash");
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    const removed = (await r.listTerms(true))
      .filter((t) => t.order >= 26)
      .map((t) => t.id);
    const added = (await r.listTerms(true))
      .filter((t) => t.order >= 26 && t.order < 38)
      .map((t) => t.id);
    for (const id of removed) {
      sql.prepare("DELETE FROM published_terms WHERE id=?").run(id);
      sql.prepare("DELETE FROM term_versions WHERE term_id=?").run(id);
      sql.prepare("DELETE FROM content_meta WHERE term_id=?").run(id);
      sql.prepare("DELETE FROM terms WHERE id=?").run(id);
    }
    sql.prepare("DELETE FROM settings WHERE key=?").run("catalog-patterns-v1");
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 26);
    const next = await import(pathToFileURL(file).href + "?stage3=1");
    const result = await next.exportBackup();
    assert.equal(result.terms.length, 38);
    for (const original of before.terms)
      assert.deepEqual(
        result.terms.find((t) => t.document.id === original.document.id),
        original,
      );
    for (const history of before.history)
      assert.deepEqual(
        result.history.find(
          (h) => h.termId === history.termId && h.revision === history.revision,
        ),
        history,
      );
    for (const id of added) {
      assert.equal((await next.getHistory(id)).length, 1);
      assert.equal((await next.getHistory(id))[0].action, "catalog");
    }
    const again = await import(pathToFileURL(file).href + "?stage3=2");
    assert.deepEqual((await again.exportBackup()).terms, result.terms);
    assert.deepEqual((await again.exportBackup()).history, result.history);
  }));
test("실무 가이드 이전은 요청한 필드만 갱신하고 초안·게시 차이와 이전 이력·상태를 보존한다", async () => {
  await usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true))[0];
    const pubBefore = cloned((await r.listTerms())[0]);
    item = await r.saveContent(
      {
        ...item,
        english: "사용자가 작성한 초안 이름",
        summary: "이 설명은 보존해야 합니다.",
      },
      "save",
    );
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const table of ["terms", "published_terms"]) {
      const row = sql
        .prepare(`SELECT body FROM ${table} WHERE id=?`)
        .get(item.id);
      const body = JSON.parse(row.body);
      body.guide.uses = [{ title: "이전 사용 상황", body: "이전 설명입니다." }];
      body.guide.alternatives = [
        { title: "이전 대안", body: "이전 설명입니다." },
      ];
      sql
        .prepare(`UPDATE ${table} SET body=? WHERE id=?`)
        .run(JSON.stringify(body), item.id);
    }
    sql.prepare("DELETE FROM settings WHERE key=?").run("guide-practical-v1");
    sql.close();
    const before = await r.exportBackup();
    const updated = await import(pathToFileURL(file).href + "?guide-upgrade=1");
    const result = await updated.exportBackup();
    const draft = (await updated.listTerms(true)).find((t) => t.id === item.id),
      pub = (await updated.listTerms()).find((t) => t.id === item.id);
    assert.equal(draft.english, item.english);
    assert.equal(draft.summary, item.summary);
    assert.equal(draft.revision, item.revision + 1);
    assert.equal(pub.english, pubBefore.english);
    assert.equal(draft.hasUnpublishedChanges, true);
    assert.ok(draft.guide.alternatives.every((p) => p.targetDemoId));
    assert.equal(draft.hidden, item.hidden);
    assert.equal(draft.order, item.order);
    for (const history of before.history)
      assert.deepEqual(
        result.history.find((h) => h.id === history.id),
        history,
      );
    assert.equal(result.history.length, before.history.length + 1);
    assert.ok(
      readdirSync(path.join(directory, "backups")).some((name) =>
        name.startsWith("catalog-"),
      ),
    );
    const again = await import(pathToFileURL(file).href + "?guide-upgrade=2");
    assert.deepEqual((await again.exportBackup()).terms, result.terms);
    assert.deepEqual((await again.exportBackup()).history, result.history);
  });
});
test("기간 선택 분리는 기존 38개를 유지하며 새 항목을 한 번 추가하고 단일 날짜 가이드만 정리한다", () =>
  usingDB(async (r, directory, file) => {
    await r.listTerms(true);
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const term of (await r.listTerms(true)).filter((t) => t.order >= 39)) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(term.id);
      for (const table of ["term_versions", "content_meta"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(term.id);
    }
    for (const table of ["terms", "published_terms"]) {
      const old = JSON.parse(
        sql.prepare(`SELECT body FROM ${table} WHERE id=?`).get("date-picker")
          .body,
      );
      old.english = "Date Picker";
      old.korean = "날짜 선택기";
      old.guide.examples.push({ ...old.guide.examples[0], id: "range" });
      old.guide.flow.push({
        title: "기간 선택과 취소",
        body: "이전 기간 선택 안내입니다.",
      });
      sql
        .prepare(`UPDATE ${table} SET body=? WHERE id=?`)
        .run(JSON.stringify(old), "date-picker");
    }
    for (const table of ["terms", "published_terms"])
      sql.prepare(`DELETE FROM ${table} WHERE id=?`).run("date-range-picker");
    sql
      .prepare("DELETE FROM term_versions WHERE term_id=?")
      .run("date-range-picker");
    sql
      .prepare("DELETE FROM content_meta WHERE term_id=?")
      .run("date-range-picker");
    for (const key of ["catalog-date-range-v1", "date-patterns-v2"])
      sql.prepare("DELETE FROM settings WHERE key=?").run(key);
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 38);
    const next = await import(pathToFileURL(file).href + "?split-date=1"),
      after = await next.exportBackup();
    assert.equal(after.terms.length, 39);
    for (const old of before.terms.filter(
      (t) => t.document.id !== "date-picker",
    ))
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    const single = (await next.listTerms(true)).find(
      (t) => t.id === "date-picker",
    );
    assert.equal(single.english, "Date Picker (Single)");
    assert.ok(single.guide.examples.every((e) => e.id !== "range"));
    assert.ok(single.guide.flow.every((p) => p.title !== "기간 선택과 취소"));
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((h) => h.id === old.id),
        old,
      );
    const again = await import(pathToFileURL(file).href + "?split-date=2");
    assert.deepEqual((await again.exportBackup()).terms, after.terms);
    assert.deepEqual((await again.exportBackup()).history, after.history);
  }));
test("4단계 추가는 기존 39개 초안·게시·휴지통·순서·이력을 보존하고 12개만 한 번 추가한다", () =>
  usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true)).find((t) => t.id === "select");
    item = await r.saveContent(
      { ...item, summary: "4단계에도 유지할 사용자 초안" },
      "save",
    );
    await r.changeTerm(item.id, item.revision, "trash");
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    const removed = (await r.listTerms(true))
      .filter((t) => t.order >= 39)
      .map((t) => t.id);
    const ids = (await r.listTerms(true))
      .filter((t) => t.order >= 39 && t.order < 51)
      .map((t) => t.id);
    for (const id of removed) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
      for (const table of ["term_versions", "content_meta"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(id);
    }
    sql.prepare("DELETE FROM settings WHERE key=?").run("catalog-advanced-v1");
    const taxonomy = JSON.parse(
      sql.prepare("SELECT value FROM settings WHERE key=?").get("taxonomy")
        .value,
    );
    taxonomy.categories = taxonomy.categories.filter(
      (c) => c !== "레이아웃과 모션",
    );
    sql
      .prepare("UPDATE settings SET value=? WHERE key=?")
      .run(JSON.stringify(taxonomy), "taxonomy");
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 39);
    const next = await import(pathToFileURL(file).href + "?stage4=1"),
      after = await next.exportBackup();
    assert.equal(after.terms.length, 51);
    for (const old of before.terms)
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((h) => h.id === old.id),
        old,
      );
    assert.deepEqual(after.taxonomy.categories, [
      ...before.taxonomy.categories,
      "레이아웃과 모션",
    ]);
    assert.deepEqual(after.taxonomy.tags, before.taxonomy.tags);
    for (const id of ids) {
      const item = (await next.listTerms(true)).find((t) => t.id === id);
      assert.equal(item.revision, 1);
      assert.equal(item.status, "published");
      assert.equal((await next.getHistory(id)).length, 1);
      assert.equal((await next.getHistory(id))[0].action, "catalog");
    }
    assert.ok(readdirSync(path.join(directory, "backups")).length > 0);
    const again = await import(pathToFileURL(file).href + "?stage4=2");
    assert.deepEqual((await again.exportBackup()).terms, after.terms);
    assert.deepEqual((await again.exportBackup()).history, after.history);
    assert.deepEqual(await again.getTaxonomy(), after.taxonomy);
  }));
test("효과 17개 추가는 기존 51개 원문·게시·이력과 분류 편집을 보존하고 재시작해도 중복하지 않는다", () =>
  usingDB(async (r, directory, file) => {
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const item of (await r.listTerms(true)).filter((t) => t.order >= 68)) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(item.id);
      for (const table of ["content_meta", "term_versions"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(item.id);
    }
    const added = (await r.listTerms(true))
      .filter((t) => t.order >= 51)
      .map((t) => t.id);
    assert.equal(added.length, 17);
    for (const id of added) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
      for (const table of ["content_meta", "term_versions"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(id);
    }
    sql.prepare("DELETE FROM settings WHERE key=?").run("catalog-effects-v1");
    const taxonomy = JSON.parse(
      sql.prepare("SELECT value FROM settings WHERE key=?").get("taxonomy")
        .value,
    );
    taxonomy.categories = taxonomy.categories.filter(
      (c) => !["커서와 인터랙션", "이미지와 갤러리"].includes(c),
    );
    taxonomy.categories.push("사용자 분류 유지");
    sql
      .prepare("UPDATE settings SET value=? WHERE key=?")
      .run(JSON.stringify(taxonomy), "taxonomy");
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 51);
    const next = await import(pathToFileURL(file).href + "?effects=1"),
      after = await next.exportBackup();
    assert.equal(after.terms.length, 68);
    for (const old of before.terms)
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((h) => h.id === old.id),
        old,
      );
    assert.deepEqual(after.taxonomy.categories, [
      ...before.taxonomy.categories,
      "커서와 인터랙션",
      "이미지와 갤러리",
    ]);
    for (const id of added) {
      assert.equal((await next.getHistory(id)).length, 1);
      assert.equal((await next.getHistory(id))[0].action, "catalog");
      assert.ok((await next.listTerms()).find((t) => t.id === id));
    }
    const again = await import(pathToFileURL(file).href + "?effects=2");
    assert.deepEqual((await again.exportBackup()).terms, after.terms);
    assert.deepEqual((await again.exportBackup()).history, after.history);
  }));
test("배경 효과 9개는 기존 68개 콘텐츠와 이력을 보존해 한 번만 추가한다", () =>
  usingDB(async (r, directory, file) => {
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH),
      added = (await r.listTerms(true))
        .filter((t) => t.order >= 68)
        .map((t) => t.id);
    assert.equal(added.length, 9);
    for (const id of added) {
      for (const table of ["terms", "published_terms"])
        sql.prepare(`DELETE FROM ${table} WHERE id=?`).run(id);
      for (const table of ["content_meta", "term_versions"])
        sql.prepare(`DELETE FROM ${table} WHERE term_id=?`).run(id);
    }
    sql
      .prepare("DELETE FROM settings WHERE key=?")
      .run("catalog-backgrounds-v1");
    sql.close();
    const before = await r.exportBackup();
    assert.equal(before.terms.length, 68);
    const next = await import(pathToFileURL(file).href + "?backgrounds=1"),
      after = await next.exportBackup();
    assert.equal(after.terms.length, 77);
    for (const old of before.terms)
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((h) => h.id === old.id),
        old,
      );
    const again = await import(pathToFileURL(file).href + "?backgrounds=2");
    assert.deepEqual((await again.exportBackup()).terms, after.terms);
    assert.deepEqual((await again.exportBackup()).history, after.history);
  }));
test("핫스팟 안내 추가는 사용자 초안·게시 차이와 이전 이력을 보존하고 중복하지 않는다", () =>
  usingDB(async (r, directory, file) => {
    let item = (await r.listTerms(true)).find((t) => t.id === "image-hotspot");
    item = await r.saveContent(
      { ...item, summary: "사용자 핫스팟 초안 설명" },
      "save",
    );
    const sql = new DatabaseSync(process.env.UI_NOTES_DB_PATH);
    for (const table of ["terms", "published_terms"]) {
      const row = sql
          .prepare(`SELECT body FROM ${table} WHERE id=?`)
          .get(item.id),
        body = JSON.parse(row.body);
      body.guide.flow = body.guide.flow.filter(
        (p) => p.title !== "지점 옆 말풍선",
      );
      body.guide.pitfalls = body.guide.pitfalls.filter(
        (p) => p.title !== "말풍선의 가장자리 처리",
      );
      body.guide.examples = body.guide.examples.filter(
        (e) => !e.id.startsWith("hotspot-"),
      );
      for (const role of Object.values(body.guide.roles))
        role.tasks = role.tasks.filter(
          (p) => p.title !== "하단 패널과 지점 옆 말풍선",
        );
      sql
        .prepare(`UPDATE ${table} SET body=? WHERE id=?`)
        .run(JSON.stringify(body), item.id);
    }
    sql.prepare("DELETE FROM settings WHERE key=?").run("hotspot-popover-v1");
    sql.close();
    const before = await r.exportBackup(),
      next = await import(pathToFileURL(file).href + "?hotspot-bubble=1"),
      after = await next.exportBackup();
    for (const old of before.terms.filter((t) => t.document.id !== item.id))
      assert.deepEqual(
        after.terms.find((t) => t.document.id === old.document.id),
        old,
      );
    for (const old of before.history)
      assert.deepEqual(
        after.history.find((h) => h.id === old.id),
        old,
      );
    const draft = (await next.listTerms(true)).find((t) => t.id === item.id),
      pub = (await next.listTerms()).find((t) => t.id === item.id);
    assert.equal(draft.summary, "사용자 핫스팟 초안 설명");
    assert.notEqual(pub.summary, draft.summary);
    assert.equal(draft.hasUnpublishedChanges, true);
    assert.equal(
      draft.guide.examples.filter((e) => e.id.startsWith("hotspot-")).length,
      2,
    );
    assert.equal(
      draft.guide.flow.filter((p) => p.title === "지점 옆 말풍선").length,
      1,
    );
    const again = await import(pathToFileURL(file).href + "?hotspot-bubble=2");
    assert.deepEqual((await again.exportBackup()).terms, after.terms);
    assert.deepEqual((await again.exportBackup()).history, after.history);
  }));
