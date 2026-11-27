import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import vm from "node:vm";
const module = { exports: {} };
vm.runInNewContext(
  buildSync({
    entryPoints: ["src/demos/advanced.tsx"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }).outputFiles[0].text,
  { module, exports: module.exports, require: createRequire(import.meta.url) },
);
const { sortRows, filterRows, reorderItems, easingProgress, visibleTree } =
  module.exports;
const rows = [
  { id: "a", name: "가", cost: 20, kind: "기획", owner: "나" },
  { id: "b", name: "나", cost: 10, kind: "디자인", owner: "민지" },
  { id: "c", name: "다", cost: 20, kind: "디자인", owner: "나" },
];
const ids = (arr) => Array.from(arr, (r) => r.id);
test("정렬은 원본 불변·같은 값의 안정적 순서·기본 복귀를 보장한다", () => {
  const before = structuredClone(rows);
  assert.deepEqual(ids(sortRows(rows, "low")), ["b", "a", "c"]);
  assert.deepEqual(ids(sortRows(rows, "high")), ["a", "c", "b"]);
  assert.deepEqual(ids(sortRows(rows, "name")), ["a", "b", "c"]);
  assert.deepEqual(ids(sortRows(rows, "original")), ["a", "b", "c"]);
  assert.deepEqual(rows, before);
});
test("필터의 AND 조합·0건·개별 해제는 같은 원본을 기준으로 계산한다", () => {
  assert.deepEqual(ids(filterRows(rows, "디자인", true)), ["c"]);
  assert.deepEqual(ids(filterRows(rows, "기획", true)), ["a"]);
  assert.deepEqual(ids(filterRows(rows, "개발", false)), []);
  assert.deepEqual(ids(filterRows(rows, "all", true)), ["a", "c"]);
  assert.deepEqual(ids(filterRows(rows, "all", false)), ["a", "b", "c"]);
});
test("이동은 id와 원본을 보존하고 범위 밖 이동을 무시한다", () => {
  assert.deepEqual(ids(reorderItems(rows, 0, 2)), ["b", "c", "a"]);
  assert.deepEqual(ids(reorderItems(rows, 2, 0)), ["c", "a", "b"]);
  for (const [from, to] of [
    [-1, 0],
    [0, 3],
    [3, 1],
    [1, -1],
  ])
    assert.deepEqual(ids(reorderItems(rows, from, to)), ["a", "b", "c"]);
  assert.deepEqual(ids(rows), ["a", "b", "c"]);
});
test("보이는 트리는 접힌 자식을 제외하고 부모-자식 순서를 유지한다", () => {
  assert.deepEqual(Array.from(visibleTree([])), ["projects", "archive"]);
  assert.deepEqual(Array.from(visibleTree(["projects"])), [
    "projects",
    "design",
    "research",
    "archive",
  ]);
  assert.deepEqual(Array.from(visibleTree(["projects", "design"])), [
    "projects",
    "design",
    "guide",
    "tokens",
    "research",
    "archive",
  ]);
  assert.deepEqual(Array.from(visibleTree(["design"])), [
    "projects",
    "archive",
  ]);
});
test("이징은 같은 끝점·시간 범위와 단조 증가를 유지하며 중간 속도가 다르다", () => {
  for (const curve of ["linear", "ease-in", "ease-out", "ease-in-out"]) {
    assert.equal(easingProgress(-1, curve), 0);
    assert.equal(easingProgress(0, curve), 0);
    assert.equal(easingProgress(1, curve), 1);
    assert.equal(easingProgress(2, curve), 1);
    let previous = 0;
    for (let i = 0; i <= 100; i++) {
      const p = easingProgress(i / 100, curve);
      assert.ok(p >= previous && p <= 1);
      previous = p;
    }
  }
  assert.ok(easingProgress(0.5, "ease-in") < 0.5);
  assert.ok(easingProgress(0.5, "ease-out") > 0.5);
  assert.ok(Math.abs(easingProgress(0.5, "ease-in-out") - 0.5) < 0.00001);
  assert.equal(easingProgress(0.5, "linear"), 0.5);
});

test('드래그 삽입 위치는 원본을 제외한 행의 중앙선을 기준으로 위·아래 이동을 계산한다',()=>{
 const {dragInsertIndex}=module.exports;
 assert.equal(dragInsertIndex([30,90,150],0,30),0);
 assert.equal(dragInsertIndex([30,90,150],0,100),1);
 assert.equal(dragInsertIndex([30,90,150],0,160),2);
 assert.equal(dragInsertIndex([30,90,150],2,20),0);
 assert.equal(dragInsertIndex([30,90,150],1,90),1);
 assert.equal(dragInsertIndex([30,90,150],-1,90),-1);
 assert.equal(dragInsertIndex([30,90,150],1,NaN),-1);
});
