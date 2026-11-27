import { DatabaseSync, backup } from "node:sqlite";
import { createClient } from "@libsql/client/http";
import { mkdirSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { encodeCheckpoint } from "../src/lib/checkpoint.mjs";
import { schema, contentTables } from "../src/lib/storage-schema.mjs";

function fingerprint(rows) {
  const canonical = rows
    .map((row) =>
      JSON.stringify(
        Object.fromEntries(
          Object.entries(row).sort(([a], [b]) => a.localeCompare(b)),
        ),
      ),
    )
    .sort();
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
export function readSource(filename) {
  const db = new DatabaseSync(filename, { readOnly: true });
  db.exec("BEGIN");
  try {
    const tables = {};
    const existing = new Set(
      db
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all()
        .map((r) => r.name),
    );
    for (const table of contentTables)
      tables[table] = existing.has(table)
        ? db.prepare(`SELECT * FROM ${table}`).all()
        : [];
    if (
      !tables.settings.some((r) => r.key === "hotspot-popover-v1") ||
      tables.terms.length < 1
    )
      throw new Error(
        "현재 앱을 실행해 데이터 이전을 마친 뒤 다시 시도하세요.",
      );
    const directory = path.join(path.dirname(filename), "backups");
    if (existsSync(directory))
      for (const file of readdirSync(directory).filter((f) =>
        /^(migration|import|catalog)-\d+-[a-f0-9-]+\.json$/.test(f),
      )) {
        const id = file.slice(0, -5),
          [reason, time] = id.split("-");
        if (!tables.checkpoints.some((c) => c.id === id))
          tables.checkpoints.push({
            id,
            created_at: new Date(Number(time)).toISOString(),
            reason,
            body: encodeCheckpoint(
              readFileSync(path.join(directory, file), "utf8"),
            ),
          });
      }
    return tables;
  } finally {
    db.exec("ROLLBACK");
    db.close();
  }
}
export async function migrateDatabase(client, tables, apply = false) {
  // Schema creation is non-destructive. All content checks and inserts share one write transaction.
  await client.executeMultiple(schema);
  const tx = await client.transaction("write");
  try {
    const current = {};
    for (const table of contentTables)
      current[table] = (await tx.execute(`SELECT * FROM ${table}`)).rows.map(
        (row) => Object.fromEntries(Object.entries(row)),
      );
    const identical = contentTables.every(
      (t) => fingerprint(tables[t]) === fingerprint(current[t]),
    );
    if (identical) {
      await tx.rollback();
      return {
        status: "already-migrated",
        counts: Object.fromEntries(
          contentTables.map((t) => [t, tables[t].length]),
        ),
      };
    }
    if (contentTables.some((t) => current[t].length))
      throw new Error(
        "대상 DB에 데이터가 있습니다. 기존 데이터를 덮어쓰지 않았습니다. 새 빈 DB를 선택하세요.",
      );
    if (!apply) {
      await tx.rollback();
      return {
        status: "ready",
        counts: Object.fromEntries(
          contentTables.map((t) => [t, tables[t].length]),
        ),
      };
    }
    const statements = [];
    for (const table of contentTables)
      for (const row of tables[table]) {
        const columns = Object.keys(row);
        statements.push({
          sql: `INSERT INTO ${table}(${columns.join(",")}) VALUES(${columns.map(() => "?").join(",")})`,
          args: columns.map((c) => row[c]),
        });
      }
    await tx.batch(statements);
    for (const table of contentTables) {
      const saved = (await tx.execute(`SELECT * FROM ${table}`)).rows.map(
        (row) => Object.fromEntries(Object.entries(row)),
      );
      if (fingerprint(saved) !== fingerprint(tables[table]))
        throw new Error(`이전 검증 실패: ${table}. 모든 입력을 취소합니다.`);
    }
    await tx.commit();
    return {
      status: "migrated-and-verified",
      counts: Object.fromEntries(
        contentTables.map((t) => [t, tables[t].length]),
      ),
    };
  } catch (error) {
    await tx.rollback().catch(() => {});
    throw error;
  } finally {
    tx.close();
  }
}
async function main() {
  const filename =
    process.env.UI_NOTES_DB_PATH ||
    path.join(process.cwd(), "data", "ui-notes.sqlite");
  const tables = readSource(filename);
  console.log(
    "이전할 데이터:",
    Object.fromEntries(contentTables.map((t) => [t, tables[t].length])),
  );
  if (
    !/^libsql:\/\//.test(process.env.TURSO_DATABASE_URL || "") ||
    !process.env.TURSO_AUTH_TOKEN
  )
    throw new Error(
      ".env.deploy.local에 TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN을 설정하세요.",
    );
  const apply = process.argv.includes("--apply");
  if (apply) {
    const folder = path.join(path.dirname(filename), "deployment");
    mkdirSync(folder, { recursive: true });
    const source = new DatabaseSync(filename, { readOnly: true });
    try {
      await backup(
        source,
        path.join(folder, `before-upload-${Date.now()}.sqlite`),
      );
    } finally {
      source.close();
    }
  }
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  try {
    console.log(await migrateDatabase(client, tables, apply));
  } finally {
    client.close();
  }
  if (!apply)
    console.log(
      "검토만 완료했습니다. 실제 이전: npm run db:migrate:cloud -- --apply",
    );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
