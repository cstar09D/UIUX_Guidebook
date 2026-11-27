import test from "node:test";
import assert from "node:assert/strict";
import { isLocalRequest } from "../src/lib/local-request.mjs";
const headers = (host, origin) =>
  new Headers({ ...(host ? { host } : {}), ...(origin ? { origin } : {}) });
test("실제 Host의 로컬 주소와 같은 출처는 개발·검증 포트에서 허용한다", () => {
  for (const host of ["127.0.0.1:3000", "127.0.0.1:3001", "localhost:3000"]) {
    assert.equal(isLocalRequest(headers(host, `http://${host}`)), true);
    assert.equal(isLocalRequest(headers(host)), true);
  }
});
test("외부 출처·외부 Host·위장 주소·null 출처는 거부한다", () => {
  for (const [host, origin] of [
    ["127.0.0.1:3000", "https://evil.example"],
    ["localhost:3000", "null"],
    ["localhost.evil.example:3000", null],
    ["user@localhost:3000", null],
    ["127.0.0.1:3000/path", null],
    ["evil.example", "http://evil.example"],
    [null, null],
  ])
    assert.equal(isLocalRequest(headers(host, origin)), false);
});
