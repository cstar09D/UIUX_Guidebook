import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
const bundle = buildSync({
  entryPoints: ["src/lib/catalog.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
});
const { seeds } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
import { scoreTerm } from "../src/lib/search.mjs";
const top = (query) =>
  seeds
    .map((term) => ({ id: term.id, score: scoreTerm(term, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
test("영문·발음·한국어 명칭을 매칭한다", () => {
  for (const q of [
    "Modal Dialog",
    "MODAL-DIALOG",
    "모달 다이얼로그",
    "모달 대화상자",
  ])
    assert.equal(top(q)[0].id, "modal");
});
test("동작·모양 표현으로 찾을 수 있다", () => {
  for (const [q, id] of [
    ["아래에서 올라오는 창", "bottom-sheet"],
    ["회색 박스", "skeleton"],
    ["접었다 펴는 목록", "accordion"],
    ["엑셀 같은 표", "data-grid"],
    ["자동완성", "combobox"],
  ])
    assert.equal(top(q)[0].id, id);
});
test("모호한 통칭은 여러 결과를, 무관한 문자열은 무결과를 반환한다", () => {
  assert.deepEqual(
    top("팝업")
      .map((r) => r.id)
      .sort(),
    ["bottom-sheet", "lightbox", "modal"],
  );
  assert.equal(top("abcdefghi").length, 0);
});

test("관리 태그도 검색에 반영한다", () => {
  assert.equal(
    scoreTerm({ ...seeds[0], tags: ["레이어 테스트"] }, "레이어 테스트"),
    65,
  );
});

test("3단계 UI도 모양과 동작 표현으로 검색된다", () => {
  for (const [query, id] of [
    ["오른쪽 아래 플러스", "floating-action-button"],
    ["달력에서 선택", "date-picker"],
    ["전송 취소", "file-upload"],
    ["옆에서 나오는 메뉴", "navigation-drawer"],
    ["아래 메뉴", "bottom-navigation"],
    ["점 세개 메뉴", "menu-button"],
    ["몇 단계", "stepper"],
    ["박스 정보", "card"],
    ["세로 목록", "list"],
    ["정말 삭제", "alert-dialog"],
    ["막대 차오름", "progress-bar"],
    ["빙글빙글", "loading-spinner"],
  ])
    assert.equal(top(query)[0].id, id, query);
});

test("정확한 동작 검색어는 일반적인 호버·커서 단어보다 해당 효과를 우선한다", () => {
  for (const [query, id] of [
    ["자석 효과", "magnetic-button"],
    ["마우스 뒤 사진", "image-trail"],
    ["숨은 이미지 나타남", "hover-reveal"],
    ["커서 색 반전", "blend-cursor"],
    ["손전등", "spotlight"],
    ["카드 기울기", "tilt-card"],
    ["커서 글자", "cursor-label"],
    ["클릭 물결", "ripple"],
    ["마우스 꼬리", "cursor-trail"],
    ["핀터레스트 배치", "masonry"],
    ["썸네일 확대", "lightbox"],
    ["시공 전후", "before-after-slider"],
    ["사진 천천히 확대", "ken-burns"],
    ["제품 디테일 확대", "image-magnifier"],
    ["호버 가로 확장", "image-accordion"],
    ["인테리어 제품 정보", "image-hotspot"],
    ["인쇄 질감", "halftone"],
  ])
    assert.equal(top(query)[0].id, id, query);
});

test('배경 효과 9종은 이름 외에 질감·움직임 표현으로도 검색된다',()=>{for(const [query,id] of [['여러 색 번짐','mesh-gradient'],['빛 커튼','aurora'],['종이 질감','grain'],['모눈 점','dot-grid'],['선 따라 흐르는 빛','beams'],['도형 모핑','blob'],['발광 덩어리','glow-orb'],['공중 먼지','particles'],['우주를 나는 효과','starfield']])assert.equal(top(query)[0].id,id,query);});
