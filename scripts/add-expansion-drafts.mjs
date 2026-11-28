// Turso only. Run without --apply to inspect missing draft additions first.
import { build } from "esbuild";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
if (
  !process.env.TURSO_DATABASE_URL?.startsWith("libsql://") ||
  !process.env.TURSO_AUTH_TOKEN
)
  throw new Error("Turso DB 서버 연결 설정이 필요합니다.");
if (process.argv.slice(2).some((arg) => arg !== "--apply"))
  throw new Error("지원하는 옵션: --apply");
const directory = await mkdtemp(path.join(tmpdir(), "ui-expansion-"));
try {
  const result = await build({
    entryPoints: ["src/lib/db.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    banner: {
      js: 'import {createRequire} from "node:module";const require=createRequire(process.cwd()+"/package.json");',
    },
  });
  const filename = path.join(directory, "repository.mjs");
  await writeFile(filename, result.outputFiles[0].text, { mode: 0o600 });
  const { addExpansionDrafts } = await import(pathToFileURL(filename).href);
  console.log(
    JSON.stringify(
      await addExpansionDrafts(process.argv.includes("--apply")),
      null,
      2,
    ),
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
