import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
const bundle = buildSync({
  entryPoints: ["src/demos/patterns.tsx"],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
});
const { appointmentDateError, uploadFileError } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
test("예약 날짜는 형식·실재성·기간·휴무를 나누고 유효한 날짜만 허용한다", () => {
  for (const value of [
    "",
    "2026-1-02",
    "2026-11-31",
    "2026-02-29",
    "2026-12-32",
  ])
    assert.match(appointmentDateError(value), /실제 날짜/);
  for (const value of ["2026-10-31", "2027-01-01"])
    assert.match(appointmentDateError(value), /예약 기간/);
  for (const value of ["2026-11-01", "2026-11-22", "2026-11-26", "2026-12-06"])
    assert.match(appointmentDateError(value), /예약할 수 없어요/);
  for (const value of ["2026-11-02", "2026-11-18", "2026-12-01", "2026-12-31"])
    assert.equal(appointmentDateError(value), "");
});
test("첨부 파일은 빈 파일·2MB 경계·이중 확장자·알려진 MIME 불일치를 검사한다", () => {
  assert.match(uploadFileError(undefined), /먼저/);
  const valid = {
    name: "자료.PDF",
    size: 2 * 1024 * 1024,
    type: "application/pdf",
  };
  assert.equal(uploadFileError(valid), "");
  assert.match(uploadFileError({ ...valid, size: 0 }), /비어 있지 않은/);
  assert.match(uploadFileError({ ...valid, size: 2 * 1024 * 1024 + 1 }), /2MB/);
  assert.match(uploadFileError({ ...valid, name: "자료.pdf.exe" }), /PDF/);
  assert.match(
    uploadFileError({ ...valid, type: "image/png" }),
    /형식과 확장자/,
  );
  assert.equal(uploadFileError({ ...valid, type: "" }), "");
  assert.equal(
    uploadFileError({ name: "화면.jpg", size: 123, type: "image/jpeg" }),
    "",
  );
});
const { travelDateError, travelRangeError } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
test("여행 기간은 실제 날짜·순서·최소 1박·월 경계를 검사하고 예약일 휴무와 구분한다", () => {
  assert.equal(travelRangeError("2026-11-16", "2026-11-20"), "");
  assert.equal(travelRangeError("2026-11-30", "2026-12-02"), "");
  assert.equal(travelRangeError("2026-11-22", "2026-11-26"), "");
  assert.match(travelRangeError("2026-11-20", "2026-11-16"), /종료일/);
  assert.match(travelRangeError("2026-11-16", "2026-11-16"), /다음 날/);
  assert.match(travelRangeError("2026-11-16", ""), /실제 날짜/);
  assert.match(travelRangeError("2026-11-31", "2026-12-02"), /실제 날짜/);
  assert.match(travelDateError("2027-01-01"), /여행 기간/);
});
