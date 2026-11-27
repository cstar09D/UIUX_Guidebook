import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { createClient } from "@libsql/client/node";
import { readSource, migrateDatabase } from "../scripts/migrate-cloud.mjs";
import { encodeCheckpoint, decodeCheckpoint } from "../src/lib/checkpoint.mjs";
const banner = {
  js: 'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");',
};
async function repository(folder, name, remote = false) {
  const result = await build({
    entryPoints: ["src/lib/db.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    banner,
    plugins: remote
      ? [
          {
            name: "libsql-file-transport",
            setup(builder) {
              builder.onLoad({ filter: /src\/lib\/storage\.ts$/ }, () => {
                let text = readFileSync("src/lib/storage.ts", "utf8").replace(
                  "@libsql/client/http",
                  "@libsql/client/node",
                );
                text =
                  text.slice(
                    0,
                    text.indexOf("export function createStorage()"),
                  ) +
                  'export function createStorage():StorageConnection {return libsqlStorage(createClient({url:"file:"+process.env.UI_NOTES_DB_PATH}));}';
                return {
                  contents: text,
                  loader: "ts",
                  resolveDir: path.resolve("src/lib"),
                };
              });
            },
          },
        ]
      : [],
  });
  const filename = path.join(folder, name + ".mjs");
  writeFileSync(filename, result.outputFiles[0].text);
  return import(pathToFileURL(filename).href);
}
test("클라우드 이전은 원문·게시·이력·복구 지점을 보존하며 중복 이전·기존 DB 덮어쓰기를 막는다", async () => {
  const folder = mkdtempSync(path.join(tmpdir(), "ui-cloud-")),
    previous = process.env.UI_NOTES_DB_PATH;
  let client;
  try {
    const source = path.join(folder, "source.sqlite");
    process.env.UI_NOTES_DB_PATH = source;
    const local = await repository(folder, "local");
    await local.listTerms();
    const item = (await local.listTerms(true))[0];
    await local.saveContent(
      { ...item, summary: "원격으로 보존할 사용자 초안" },
      "save",
    );
    const tables = readSource(source),
      target = path.join(folder, "target.sqlite");
    client = createClient({ url: "file:" + target });
    assert.equal((await migrateDatabase(client, tables)).status, "ready");
    assert.equal(
      (await migrateDatabase(client, tables, true)).status,
      "migrated-and-verified",
    );
    assert.equal(
      (await migrateDatabase(client, tables, true)).status,
      "already-migrated",
    );
    const changed = structuredClone(tables);
    changed.terms[0].body = JSON.stringify({
      ...JSON.parse(changed.terms[0].body),
      summary: "덮어쓸 값",
    });
    await assert.rejects(
      () => migrateDatabase(client, changed, true),
      /덮어쓰지/,
    );
    process.env.UI_NOTES_DB_PATH = target;
    const remote = await repository(folder, "remote", true);
    assert.deepEqual(
      (await remote.exportBackup()).terms,
      (await local.exportBackup()).terms,
    );
    assert.deepEqual(
      (await remote.exportBackup()).history,
      (await local.exportBackup()).history,
    );
    const checkpoints = await remote.listCheckpoints();
    assert.equal(checkpoints.length, tables.checkpoints.length);
    assert.equal(
      await remote.checkpointContents(checkpoints[0].id),
      decodeCheckpoint(
        tables.checkpoints.find((c) => c.id === checkpoints[0].id).body,
      ),
    );
    const original = (await remote.listTerms(true))[0];
    const attempts = await Promise.allSettled([
      remote.saveContent({ ...original, summary: "첫 번째 변경" }),
      remote.saveContent({ ...original, summary: "충돌하는 변경" }),
    ]);
    assert.equal(attempts.filter((x) => x.status === "fulfilled").length, 1);
    assert.equal(
      attempts.find((x) => x.status === "rejected").reason.status,
      409,
    );
    const saved = (await remote.listTerms(true))[0],
      published = (await remote.listTerms())[0];
    assert.equal(saved.summary, "첫 번째 변경");
    assert.notEqual(saved.summary, published.summary);
    const reopened = await repository(folder, "reopened", true);
    assert.deepEqual(
      (await reopened.exportBackup()).terms,
      (await remote.exportBackup()).terms,
    );
    for (let index = 0; index < 10; index++)
      assert.equal(await reopened.consumeLoginAttempt(1000), true);
    assert.equal(await remote.consumeLoginAttempt(1001), false);
    assert.equal(await remote.consumeLoginAttempt(1000 + 15 * 60 * 1000), true);
    await remote.clearLoginAttempts();
    assert.equal(await remote.consumeLoginAttempt(1001), true);
  } finally {
    client?.close();
    if (previous === undefined) delete process.env.UI_NOTES_DB_PATH;
    else process.env.UI_NOTES_DB_PATH = previous;
    rmSync(folder, { recursive: true, force: true });
  }
});
test("복구 지점 압축은 다운로드 원문을 그대로 복원한다", () => {
  const text = JSON.stringify({ guide: "한글 안내 ".repeat(10000) });
  const encoded = encodeCheckpoint(text);
  assert.ok(encoded.length < text.length / 4);
  assert.equal(decodeCheckpoint(encoded), text);
  assert.equal(decodeCheckpoint(text), text);
});
