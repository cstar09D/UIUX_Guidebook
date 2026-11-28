import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
const directory = mkdtempSync(path.join(tmpdir(), "ui-notes-catalog-"));
const code = buildSync({
  stdin: {
    contents:
      "export {seeds,DEMO_IDS} from './src/lib/catalog'; export {normalizeLegacy,validateContent,publicationIssues} from './src/lib/content';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
}).outputFiles[0].text;
writeFileSync(path.join(directory, "catalog.mjs"), code);
const { seeds, DEMO_IDS, normalizeLegacy, validateContent, publicationIssues } =
  await import(pathToFileURL(path.join(directory, "catalog.mjs")).href);
rmSync(directory, { recursive: true, force: true });
test("등록된 101개 UI는 명칭·검색어·전체 가이드·두 코드 형식을 갖춘다", () => {
  assert.equal(seeds.length, 101);
  assert.equal(new Set(DEMO_IDS).size, 101);
  const sources = JSON.parse(
    readFileSync("src/generated/sources.json", "utf8"),
  );
  const taxonomy = {
    revision: 1,
    categories: [...new Set(seeds.map((s) => s.category))],
    tags: [],
  };
  for (const seed of seeds) {
    const content = validateContent(normalizeLegacy(seed), taxonomy);
    assert.deepEqual(publicationIssues(content), [], seed.id);
    assert.ok(
      content.english &&
        content.pronunciation &&
        content.korean &&
        content.keywords.length >= 3,
    );
    assert.ok(content.guide.examples.length >= 3, seed.id);
    for (const example of content.guide.examples)
      assert.ok(
        example.condition.length > 10 && example.explanation.length > 45,
        `${seed.id}/${example.id}`,
      );
    for (const role of Object.values(content.guide.roles)) {
      assert.ok(
        role.tasks.length >= 3 &&
          role.handoff.length > 30 &&
          role.checks.length >= 2,
        seed.id,
      );
      for (const task of role.tasks)
        assert.ok(task.body.length > 30, `${seed.id}/${task.title}`);
    }
    assert.ok(
      sources[seed.demoId]?.parts.react.length &&
        sources[seed.demoId]?.parts.html.length,
    );
  }
});
test("첫 출시 50개는 후보 id가 유일하고 기본 구현 50개와 추가 형태 1개와 단계별 수가 일치한다", () => {
  const release = JSON.parse(
    readFileSync("docs/planning/release-50.json", "utf8"),
  );
  assert.equal(release.terms.length, 50);
  assert.equal(new Set(release.terms.map((t) => t.candidateId)).size, 50);
  assert.deepEqual(
    [0, 1, 2, 3, 4].map(
      (batch) => release.terms.filter((t) => t.batch === batch).length,
    ),
    [6, 8, 12, 12, 12],
  );
  assert.deepEqual(
    [...release.terms, ...release.variants, ...release.additions]
      .filter((t) => t.implemented)
      .map((t) => t.demoId)
      .sort(),
    [...DEMO_IDS].sort(),
  );
});
