import test from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import vm from "node:vm";
test("서버 DB 설정 누락·오류는 로컬 SQLite 자동 저장으로 이어지지 않는다", () => {
  const env = {},
    module = { exports: {} };
  const source = buildSync({
    entryPoints: ["src/lib/storage.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    write: false,
  }).outputFiles[0].text;
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require: createRequire(import.meta.url),
    process: { env },
  });
  assert.throws(
    () => module.exports.createStorage(),
    /로컬 SQLite로 자동 전환하지 않습니다/,
  );
  env.VERCEL = "1";
  env.UI_NOTES_DB_PATH = "/private/tmp/must-not-fallback.sqlite";
  assert.throws(() => module.exports.createStorage(), /TURSO_DATABASE_URL/);
  env.TURSO_DATABASE_URL = "file:local.sqlite";
  env.TURSO_AUTH_TOKEN = "invalid";
  assert.throws(() => module.exports.createStorage(), /Turso URL과 인증 토큰/);
});
