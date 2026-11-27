import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
const code = buildSync({
  stdin: {
    contents:
      "export {seeds,DEMO_IDS} from './src/lib/catalog';export {normalizeLegacy,validateGuide} from './src/lib/content';export {upgradeGuide} from './src/lib/guide-upgrade';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
}).outputFiles[0].text;
const { seeds, DEMO_IDS, normalizeLegacy, validateGuide, upgradeGuide } =
  await import(
    "data:text/javascript;base64," + Buffer.from(code).toString("base64")
  );
test("77개 사용 상황은 실무 예시를 담고 대안은 존재하는 다른 UI로 연결된다", () => {
  for (const seed of seeds) {
    const term = normalizeLegacy(seed),
      guide = term.guide;
    assert.ok(guide.uses.length >= 2);
    assert.doesNotMatch(JSON.stringify(guide.uses), /GOV\.UK|USWDS|APG|Carbon/);
    for (const item of guide.alternatives) {
      assert.ok(DEMO_IDS.includes(item.targetDemoId));
      assert.notEqual(item.targetDemoId, seed.demoId);
      assert.ok(item.body.length > 25);
    }
    assert.deepEqual(validateGuide(guide), guide);
    assert.deepEqual(upgradeGuide(seed.demoId, guide), guide);
  }
});
test("대안 연결 id는 저장·가져오기에서 보존되고 등록되지 않은 id는 거절한다", () => {
  const guide = normalizeLegacy(seeds[0]).guide;
  assert.equal(
    validateGuide(guide).alternatives[0].targetDemoId,
    guide.alternatives[0].targetDemoId,
  );
  guide.alternatives[0].targetDemoId = "not-a-demo";
  assert.throws(() => validateGuide(guide), /등록 id/);
});
