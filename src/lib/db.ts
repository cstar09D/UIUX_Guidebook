import { upgradeGuide } from "./guide-upgrade";
import { upgradeHotspotGuide } from "./hotspot-guide";
import { AsyncLocalStorage } from "node:async_hooks";
import { createStorage, type StorageConnection } from "./storage";
import { schema } from "./storage-schema.mjs";
import { encodeCheckpoint, decodeCheckpoint } from "./checkpoint.mjs";
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { categories, seeds, type Term } from "./catalog";
import {
  ContentError,
  actionLabels,
  normalizeLegacy,
  publicationIssues,
  validateContent,
  validateTaxonomy,
  type Content,
  type ManagedTerm,
  type Taxonomy,
  type ContentVersion,
  type Backup,
  type ImportPreview,
  type Checkpoint,
  type AdminState,
} from "./content";
let database: StorageConnection | undefined;
let initialization: Promise<void> | undefined;
const context = new AsyncLocalStorage<StorageConnection>();
const filename = () =>
  process.env.UI_NOTES_DB_PATH ||
  path.join(process.cwd(), "data", "ui-notes.sqlite");
const backupDirectory = () => path.join(path.dirname(filename()), "backups");
const now = () => new Date().toISOString();
async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  const connection = await db();
  return connection.transaction((tx) => context.run(tx, fn));
}
async function setting(key: string) {
  const row = (await (
    await db()
  )
    .prepare("SELECT value FROM settings WHERE key=?")
    .get(key)) as
    | {
        value: string;
      }
    | undefined;
  return row?.value;
}
async function setSetting(key: string, value: unknown) {
  await (
    await db()
  )
    .prepare(
      "INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    )
    .run(key, JSON.stringify(value));
}
async function db(): Promise<StorageConnection> {
  const current = context.getStore();
  if (current) return current;
  if (!database) database = createStorage();
  if (database.remote) return database;
  if (!initialization) {
    const connection = database;
    initialization = connection
      .transaction((tx) => context.run(tx, async () => await initialize(tx)))
      .catch((error) => {
        initialization = undefined;
        throw error;
      });
  }
  await initialization;
  return database;
}
async function initialize(d: StorageConnection): Promise<void> {
  await d.exec(schema);
  if (
    !(await d.prepare("SELECT value FROM settings WHERE key=?").get("seeded"))
  ) {
    try {
      const insert = d.prepare("INSERT INTO terms(id,body) VALUES(?,?)");
      for (const seed of seeds) await insert.run(seed.id, JSON.stringify(seed));
      await d.prepare("INSERT INTO settings VALUES(?,?)").run("seeded", "1");
    } catch (error) {
      throw error;
    }
  }
  if (!(await setting("schemaVersion"))) {
    const legacy = (
      (await d.prepare("SELECT body FROM terms").all()) as {
        body: string;
      }[]
    ).map((row) => JSON.parse(row.body) as Term);
    // A recoverable legacy export is created before modifying existing content.
    if (legacy.length)
      await checkpointFile({ version: 1, terms: legacy }, "migration");
    try {
      const normalized = legacy.map(normalizeLegacy);
      await setSetting("taxonomy", {
        revision: 1,
        categories: [
          ...new Set([...categories, ...legacy.map((t) => t.category)]),
        ],
        tags: [],
      });
      for (const term of normalized) {
        await put(term, "migration");
        await publishSnapshot(term);
      }
      await setSetting("schemaVersion", 2);
    } catch (error) {
      throw error;
    }
  }
  // Add this release once. Existing ids, drafts, taxonomy edits and trash are preserved.
  for (const batch of [
    { key: "catalog-essentials-v1", start: 6, end: 14 },
    { key: "catalog-foundations-v1", start: 14, end: 26 },
    { key: "catalog-patterns-v1", start: 26, end: 38 },
    { key: "catalog-date-range-v1", start: 38, end: 39 },
    { key: "catalog-advanced-v1", start: 39, end: 51 },
    { key: "catalog-effects-v1", start: 51, end: 68 },
    { key: "catalog-backgrounds-v1", start: 68, end: 77 },
  ]) {
    if (await setting(batch.key)) continue;
    const existingIds = new Set(
      (await d.prepare("SELECT id FROM terms").all()).map((row) => row.id),
    );
    const additions = seeds.filter(
      (seed) =>
        seed.order >= batch.start &&
        seed.order < batch.end &&
        !existingIds.has(seed.id),
    );
    if (additions.length) await checkpointFile(await exportBackup(), "catalog");
    try {
      const taxonomy = await getTaxonomy();
      const required = additions.map((term) => term.category);
      const nextCategories = [
        ...new Set([...taxonomy.categories, ...required]),
      ];
      if (nextCategories.length !== taxonomy.categories.length)
        await setSetting("taxonomy", {
          ...taxonomy,
          revision: taxonomy.revision + 1,
          categories: nextCategories,
        });
      let order =
        Math.max(-1, ...(await drafts()).map((term) => term.order)) + 1;
      for (const seed of additions) {
        const term = normalizeLegacy({ ...seed, order: order++ });
        const issues = publicationIssues(term);
        if (issues.length)
          throw new Error(
            `기본 콘텐츠 검증 실패: ${term.id}: ${issues.join(", ")}`,
          );
        await put(term, "catalog");
        await publishSnapshot(term);
      }
      await setSetting(batch.key, true);
    } catch (error) {
      throw error;
    }
  }
  if (!(await setting("guide-practical-v1"))) {
    const changes = (await drafts())
      .map((term) => ({ term, guide: upgradeGuide(term.demoId, term.guide) }))
      .filter(
        ({ term, guide }) =>
          JSON.stringify(term.guide) !== JSON.stringify(guide),
      );
    if (changes.length) await checkpointFile(await exportBackup(), "catalog");
    try {
      for (const { term, guide } of changes) {
        const pub = await published(term.id);
        const next = { ...term, guide, revision: term.revision + 1 };
        await put(next, "guide-update");
        if (pub) {
          const publishedGuide = upgradeGuide(
            pub.document.demoId,
            pub.document.guide,
          );
          await publishSnapshot({
            ...pub.document,
            guide: publishedGuide,
            revision: pub.document.revision + 1,
          });
        }
      }
      await setSetting("guide-practical-v1", true);
    } catch (error) {
      throw error;
    }
  }
  if (!(await setting("date-patterns-v2"))) {
    const patch = (term: Content): Content => ({
      ...term,
      english:
        term.english === "Date Picker" ? "Date Picker (Single)" : term.english,
      korean:
        term.korean === "날짜 선택기" ? "날짜 선택기 (단일)" : term.korean,
      guide: upgradeGuide("date-picker", term.guide),
    });
    const changes = (await drafts())
      .filter((t) => t.demoId === "date-picker")
      .map((term) => ({ term, next: patch(term) }))
      .filter(
        ({ term, next }) => JSON.stringify(term) !== JSON.stringify(next),
      );
    if (changes.length) await checkpointFile(await exportBackup(), "catalog");
    try {
      for (const { term, next } of changes) {
        await put({ ...next, revision: term.revision + 1 }, "guide-update");
        const pub = await published(term.id);
        if (pub)
          await publishSnapshot({
            ...patch(pub.document),
            revision: pub.document.revision + 1,
          });
      }
      await setSetting("date-patterns-v2", true);
    } catch (error) {
      throw error;
    }
  }
  if (!(await setting("hotspot-popover-v1"))) {
    const patch = (term: Content): Content => ({
      ...term,
      guide: upgradeHotspotGuide(term.guide),
    });
    const changes = (await drafts())
      .filter((t) => t.demoId === "image-hotspot")
      .map((term) => ({ term, next: patch(term) }))
      .filter(
        ({ term, next }) => JSON.stringify(term) !== JSON.stringify(next),
      );
    if (changes.length) await checkpointFile(await exportBackup(), "catalog");
    try {
      for (const { term, next } of changes) {
        await put({ ...next, revision: term.revision + 1 }, "guide-update");
        const pub = await published(term.id);
        if (pub)
          await publishSnapshot({
            ...patch(pub.document),
            revision: pub.document.revision + 1,
          });
      }
      await setSetting("hotspot-popover-v1", true);
    } catch (error) {
      throw error;
    }
  }
}
async function drafts(): Promise<Content[]> {
  return (
    (await (await db()).prepare("SELECT body FROM terms").all()) as {
      body: string;
    }[]
  )
    .map((row) => JSON.parse(row.body))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
async function current(id: string): Promise<Content> {
  const row = (await (
    await db()
  )
    .prepare("SELECT body FROM terms WHERE id=?")
    .get(id)) as
    | {
        body: string;
      }
    | undefined;
  if (!row) throw new ContentError("콘텐츠가 존재하지 않습니다.", 404);
  return JSON.parse(row.body);
}
async function published(id: string): Promise<{
  document: Content;
  publishedAt: string;
} | null> {
  const row = (await (
    await db()
  )
    .prepare("SELECT body,published_at FROM published_terms WHERE id=?")
    .get(id)) as
    | {
        body: string;
        published_at: string;
      }
    | undefined;
  return row
    ? { document: JSON.parse(row.body), publishedAt: row.published_at }
    : null;
}
async function updatedAt(id: string) {
  return (
    (
      (await (
        await db()
      )
        .prepare("SELECT updated_at FROM content_meta WHERE term_id=?")
        .get(id)) as
        | {
            updated_at: string;
          }
        | undefined
    )?.updated_at || ""
  );
}
async function put(term: Content, action: string, createdAt = now()) {
  await (
    await db()
  )
    .prepare(
      "INSERT INTO terms(id,body) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body",
    )
    .run(term.id, JSON.stringify(term));
  await (
    await db()
  )
    .prepare(
      "INSERT INTO content_meta VALUES(?,?) ON CONFLICT(term_id) DO UPDATE SET updated_at=excluded.updated_at",
    )
    .run(term.id, createdAt);
  await (
    await db()
  )
    .prepare(
      "INSERT INTO term_versions(term_id,revision,action,created_at,body) VALUES(?,?,?,?,?)",
    )
    .run(term.id, term.revision, action, createdAt, JSON.stringify(term));
}
async function publishSnapshot(term: Content, publishedAt = now()) {
  await (
    await db()
  )
    .prepare(
      "INSERT INTO published_terms VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body,published_at=excluded.published_at",
    )
    .run(term.id, JSON.stringify(term), publishedAt);
}
function comparable(term: Content) {
  const { revision, order, hidden, deleted, ...content } = term;
  return JSON.stringify(content);
}
async function managed(term: Content): Promise<ManagedTerm> {
  const pub = await published(term.id);
  return {
    ...term,
    status: pub ? "published" : "draft",
    publishedAt: pub?.publishedAt || null,
    publishedRevision: pub?.document.revision || null,
    updatedAt: await updatedAt(term.id),
    hasUnpublishedChanges:
      !!pub && comparable(term) !== comparable(pub.document),
  };
}
function expected(term: Content, revision: unknown) {
  if (term.revision !== revision)
    throw new ContentError(
      "다른 화면에서 내용이 변경됐습니다. 새로고침 후 다시 시도하세요.",
      409,
    );
}
export async function getTaxonomy(): Promise<Taxonomy> {
  return JSON.parse((await setting("taxonomy"))!);
}
export async function listTerms(): Promise<Content[]>;
export async function listTerms(admin: true): Promise<ManagedTerm[]>;
export async function listTerms(
  admin = false,
): Promise<Content[] | ManagedTerm[]> {
  const rows = await (
    await db()
  )
    .prepare(
      `SELECT t.body, m.updated_at,
      p.body AS published_body, p.published_at
      FROM terms t LEFT JOIN content_meta m ON m.term_id=t.id
      LEFT JOIN published_terms p ON p.id=t.id`,
    )
    .all();
  return rows
    .flatMap<Content>((row) => {
      const term: Content = JSON.parse(row.body);
      const pub: Content | null = row.published_body
        ? JSON.parse(row.published_body)
        : null;
      if (admin)
        return [
          {
            ...term,
            status: pub ? "published" : "draft",
            publishedAt: row.published_at || null,
            publishedRevision: pub?.revision || null,
            updatedAt: row.updated_at || "",
            hasUnpublishedChanges:
              !!pub && comparable(term) !== comparable(pub),
          } as ManagedTerm,
        ];
      return !term.hidden && !term.deleted && pub
        ? [{ ...pub, order: term.order, hidden: false, deleted: false }]
        : [];
    })
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export async function getAdminState(): Promise<AdminState> {
  return {
    terms: await listTerms(true),
    taxonomy: await getTaxonomy(),
    checkpoints: await listCheckpoints(),
  };
}
export async function saveContent(
  input: unknown,
  mode: "save" | "publish" = "save",
): Promise<ManagedTerm> {
  return await transaction(async () => {
    const value = validateContent(input, await getTaxonomy());
    const existing = value.id ? await current(value.id) : null;
    if (existing) expected(existing, value.revision);
    else if (value.revision !== 0)
      throw new ContentError("새 콘텐츠의 버전을 확인하세요.", 409);
    const term = {
      ...value,
      id: existing?.id || randomUUID(),
      order: existing?.order ?? ((await drafts()).at(-1)?.order ?? -1) + 1,
      revision: (existing?.revision || 0) + 1,
      hidden: existing?.hidden ?? value.hidden,
      deleted: existing?.deleted ?? false,
    };
    if (mode === "publish") {
      if (term.deleted) throw new ContentError("휴지통에서 먼저 복원하세요.");
      const issues = publicationIssues(term);
      if (issues.length)
        throw new ContentError(
          `게시 전에 확인하세요: ${issues.join(", ")}`,
          422,
        );
    }
    await put(
      term,
      mode === "publish" ? "publish" : existing ? "save" : "create",
    );
    if (mode === "publish") await publishSnapshot(term);
    return await managed(term);
  });
}
export async function changeTerm(
  id: string,
  revision: number,
  action: "hide" | "show" | "trash" | "restore" | "unpublish" | "history",
  versionId?: number,
): Promise<ManagedTerm> {
  return await transaction(async () => {
    const previous = await current(id);
    expected(previous, revision);
    let term = { ...previous, revision: previous.revision + 1 };
    if (action === "history") {
      const version = (await getHistory(id)).find((v) => v.id === versionId);
      if (!version) throw new ContentError("복원할 이력이 없습니다.", 404);
      const taxonomy = await getTaxonomy();
      const old = version.document;
      // Deleted taxonomy names cannot silently reappear when restoring history.
      term = {
        ...validateContent(
          {
            ...old,
            category: taxonomy.categories.includes(old.category)
              ? old.category
              : previous.category,
            tags: old.tags.filter((tag) => taxonomy.tags.includes(tag)),
          },
          taxonomy,
        ),
        id,
        revision: term.revision,
        order: previous.order,
        hidden: previous.hidden,
        deleted: previous.deleted,
      };
    } else if (action === "hide") term.hidden = true;
    else if (action === "show") term.hidden = false;
    else if (action === "trash") term.deleted = true;
    else if (action === "restore") term.deleted = false;
    else if (action === "unpublish")
      await (
        await db()
      )
        .prepare("DELETE FROM published_terms WHERE id=?")
        .run(id);
    await put(term, action);
    return await managed(term);
  });
}
export async function reorderTerms(
  ids: string[],
  revisions: number[],
): Promise<ManagedTerm[]> {
  return await transaction(async () => {
    const all = await drafts();
    if (
      ids.length !== all.length ||
      ids.length !== revisions.length ||
      new Set(ids).size !== all.length
    )
      throw new ContentError("목록이 변경됐습니다. 새로고침하세요.", 409);
    ids.forEach((id, i) => {
      const term = all.find((t) => t.id === id);
      if (!term) throw new ContentError("목록이 변경됐습니다.", 409);
      expected(term, revisions[i]);
    });
    for (const [i, id] of ids.entries()) {
      const term = all.find((t) => t.id === id)!;
      if (term.order !== i)
        await put({ ...term, order: i, revision: term.revision + 1 }, "order");
    }
    return await listTerms(true);
  });
}
export async function getHistory(id: string): Promise<ContentVersion[]> {
  await current(id);
  return (
    (await (
      await db()
    )
      .prepare("SELECT * FROM term_versions WHERE term_id=? ORDER BY id DESC")
      .all(id)) as {
      id: number;
      term_id: string;
      revision: number;
      action: string;
      created_at: string;
      body: string;
    }[]
  ).map((v) => ({
    id: v.id,
    termId: v.term_id,
    revision: v.revision,
    action: v.action,
    createdAt: v.created_at,
    document: JSON.parse(v.body),
  }));
}
export type TaxonomyChange = {
  kind: "categories" | "tags";
  action: "add" | "rename" | "remove" | "move";
  name: string;
  nextName?: string;
  replacement?: string;
  direction?: number;
  revision: number;
};
export async function changeTaxonomy(
  change: TaxonomyChange,
): Promise<Taxonomy> {
  return await transaction(async () => {
    const old = await getTaxonomy();
    if (change.revision !== old.revision)
      throw new ContentError("분류가 변경됐습니다. 새로고침하세요.", 409);
    const kind = change.kind;
    if (!["categories", "tags"].includes(kind))
      throw new ContentError("분류 종류를 확인하세요.");
    const name = typeof change.name === "string" ? change.name.trim() : "";
    const next =
      typeof change.nextName === "string" ? change.nextName.trim() : "";
    const values = [...old[kind]];
    const index = values.indexOf(name);
    if (change.action !== "add" && index < 0)
      throw new ContentError("분류가 존재하지 않습니다.", 404);
    if (change.action === "add") {
      if (!name || values.includes(name))
        throw new ContentError("이름이 비어 있거나 이미 존재합니다.");
      values.push(name);
    } else if (change.action === "rename") {
      if (!next || values.includes(next))
        throw new ContentError("새 이름이 비어 있거나 이미 존재합니다.");
      values[index] = next;
    } else if (change.action === "remove") {
      if (kind === "categories" && values.length === 1)
        throw new ContentError("카테고리는 하나 이상 필요합니다.");
      const used = (
        await Promise.all(
          (await drafts()).map(
            async (t) =>
              t.category === name ||
              (await published(t.id))?.document.category === name,
          ),
        )
      ).some(Boolean);
      if (
        kind === "categories" &&
        used &&
        (!change.replacement ||
          change.replacement === name ||
          !values.includes(change.replacement))
      )
        throw new ContentError(
          "이 카테고리의 콘텐츠를 옮길 카테고리를 선택하세요.",
        );
      values.splice(index, 1);
    } else if (change.action === "move") {
      if (change.direction !== 1 && change.direction !== -1)
        throw new ContentError("이동 방향을 확인하세요.");
      const to = index + change.direction;
      if (to < 0 || to >= values.length)
        throw new ContentError("더 이동할 수 없습니다.");
      [values[index], values[to]] = [values[to], values[index]];
    } else throw new ContentError("지원하지 않는 분류 작업입니다.");
    const result = validateTaxonomy({
      ...old,
      [kind]: values,
      revision: old.revision + 1,
    });
    const transform = (term: Content): Content =>
      kind === "categories"
        ? {
            ...term,
            category:
              term.category === name
                ? change.action === "rename"
                  ? next
                  : change.action === "remove"
                    ? change.replacement!
                    : term.category
                : term.category,
          }
        : {
            ...term,
            tags: term.tags.flatMap((tag) =>
              tag !== name
                ? [tag]
                : change.action === "rename"
                  ? [next]
                  : change.action === "remove"
                    ? []
                    : [tag],
            ),
          };
    if (change.action === "rename" || change.action === "remove")
      for (const term of await drafts()) {
        const updated = transform(term),
          pub = await published(term.id);
        const changed = comparable(updated) !== comparable(term),
          pubChanged =
            pub &&
            comparable(transform(pub.document)) !== comparable(pub.document);
        if (changed || pubChanged) {
          await put({ ...updated, revision: term.revision + 1 }, "taxonomy");
          if (pub)
            await publishSnapshot(transform(pub.document), pub.publishedAt);
        }
      }
    await setSetting("taxonomy", result);
    return result;
  });
}
export async function exportBackup(): Promise<Backup> {
  return transaction(async () => {
    const connection = await db();
    const records = await connection
      .prepare(
        `SELECT t.body,m.updated_at,p.body AS published_body,p.published_at
        FROM terms t LEFT JOIN content_meta m ON m.term_id=t.id LEFT JOIN published_terms p ON p.id=t.id`,
      )
      .all();
    const versions = await connection
      .prepare("SELECT * FROM term_versions ORDER BY term_id,id DESC")
      .all();
    return {
      format: "ui-notes-backup",
      version: 2,
      exportedAt: now(),
      taxonomy: await getTaxonomy(),
      terms: records
        .map((row) => ({
          document: JSON.parse(row.body) as Content,
          published: row.published_body
            ? {
                document: JSON.parse(row.published_body) as Content,
                publishedAt: row.published_at,
              }
            : null,
          updatedAt: row.updated_at || "",
        }))
        .sort(
          (a, b) =>
            a.document.order - b.document.order ||
            a.document.id.localeCompare(b.document.id),
        ),
      history: records
        .map((row) => JSON.parse(row.body) as Content)
        .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
        .flatMap((term) =>
          versions
            .filter((v) => v.term_id === term.id)
            .map((v) => ({
              id: Number(v.id),
              termId: v.term_id,
              revision: v.revision,
              action: v.action,
              createdAt: v.created_at,
              document: JSON.parse(v.body),
            })),
        ),
    };
  });
}

async function checkpointFile(
  value: unknown,
  reason: string,
): Promise<Checkpoint> {
  const connection = await db();
  const checkpoint = {
    id: `${reason}-${Date.now()}-${randomUUID()}`,
    createdAt: now(),
    reason,
  };
  if (connection.remote) {
    await connection
      .prepare(
        "INSERT INTO checkpoints(id,created_at,reason,body) VALUES(?,?,?,?)",
      )
      .run(
        checkpoint.id,
        checkpoint.createdAt,
        reason,
        encodeCheckpoint(JSON.stringify(value)),
      );
  } else {
    mkdirSync(backupDirectory(), { recursive: true });
    writeFileSync(
      path.join(backupDirectory(), checkpoint.id + ".json"),
      JSON.stringify(value, null, 2),
      { flag: "wx" },
    );
  }
  return checkpoint;
}
export async function listCheckpoints(): Promise<Checkpoint[]> {
  const connection = await db();
  if (connection.remote)
    return (
      await connection
        .prepare(
          "SELECT id,created_at,reason FROM checkpoints ORDER BY created_at DESC",
        )
        .all()
    ).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      reason: row.reason,
    }));
  try {
    return readdirSync(backupDirectory())
      .filter((name) =>
        /^(migration|import|catalog)-\d+-[a-f0-9-]+\.json$/.test(name),
      )
      .map((name) => {
        const [reason, time] = name.split("-");
        return {
          id: name.slice(0, -5),
          reason,
          createdAt: new Date(Number(time)).toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}
export async function checkpointContents(id: string): Promise<string> {
  const connection = await db();
  if (connection.remote) {
    const row = await connection
      .prepare("SELECT body FROM checkpoints WHERE id=?")
      .get(id);
    if (!row) throw new ContentError("복구 지점이 없습니다.", 404);
    return decodeCheckpoint(row.body);
  }
  if (!(await listCheckpoints()).some((c) => c.id === id))
    throw new ContentError("복구 지점이 없습니다.", 404);
  return readFileSync(path.join(backupDirectory(), id + ".json"), "utf8");
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    );
  return value;
}
function hash(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(canonical(value)))
    .digest("hex");
}
function date(value: unknown): string {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value)))
    throw new ContentError("백업의 날짜 형식을 확인하세요.");
  return value;
}
function normalizeBackup(input: unknown): {
  backup: Backup;
  legacy: boolean;
} {
  if (!input || typeof input !== "object")
    throw new ContentError("백업 파일 형식을 확인하세요.");
  const value = input as Record<string, unknown>;
  if (value.version === 1 && Array.isArray(value.terms)) {
    if (value.terms.length > 1000)
      throw new ContentError("최대 1,000개까지 가져올 수 있습니다.");
    // Version 1 exports only contained basic metadata; attach the original guide.
    const records = value.terms as Term[];
    if (
      records.some(
        (t) =>
          !t ||
          !t.demoId ||
          !Object.hasOwn(
            Object.fromEntries(seeds.map((s) => [s.demoId, true])),
            t.demoId,
          ),
      )
    )
      throw new ContentError(
        "이전 백업에 등록되지 않은 시뮬레이션이 있습니다.",
      );
    const taxonomy = validateTaxonomy({
      revision: 1,
      categories: [
        ...new Set([...categories, ...records.map((t) => t.category)]),
      ],
      tags: [],
    });
    const terms = records.map((t) => ({
      document: validateContent(normalizeLegacy(t), taxonomy),
      published: {
        document: validateContent(normalizeLegacy(t), taxonomy),
        publishedAt: now(),
      },
      updatedAt: now(),
    }));
    return {
      backup: {
        format: "ui-notes-backup",
        version: 2,
        exportedAt: now(),
        taxonomy,
        terms,
        history: [],
      },
      legacy: true,
    };
  }
  if (
    value.format !== "ui-notes-backup" ||
    value.version !== 2 ||
    !Array.isArray(value.terms) ||
    value.terms.length > 1000 ||
    !Array.isArray(value.history) ||
    value.history.length > 50000
  )
    throw new ContentError("지원하는 UI Notes 백업 파일이 아닙니다.");
  const taxonomy = validateTaxonomy(value.taxonomy);
  const terms = value.terms.map((entry: unknown) => {
    if (!entry || typeof entry !== "object")
      throw new ContentError("백업 콘텐츠 형식을 확인하세요.");
    const item = entry as Record<string, unknown>;
    const document = validateContent(item.document, taxonomy);
    if (!document.id) throw new ContentError("백업 콘텐츠 id가 필요합니다.");
    let pub = null;
    if (item.published !== null) {
      const p = item.published as Record<string, unknown> | undefined;
      if (!p) throw new ContentError("게시 스냅샷 형식을 확인하세요.");
      const body = validateContent(p.document, taxonomy);
      if (body.id !== document.id || publicationIssues(body).length)
        throw new ContentError("게시 스냅샷의 내용과 id를 확인하세요.");
      pub = { document: body, publishedAt: date(p.publishedAt) };
    }
    return { document, published: pub, updatedAt: date(item.updatedAt) };
  });
  if (new Set(terms.map((t) => t.document.id)).size !== terms.length)
    throw new ContentError("백업에 중복된 콘텐츠 id가 있습니다.");
  const history = value.history.map((entry: unknown) => {
    const v = entry as ContentVersion;
    if (
      !v ||
      !terms.some((t) => t.document.id === v.termId) ||
      !Number.isSafeInteger(v.revision) ||
      v.revision < 1 ||
      typeof v.action !== "string" ||
      !Object.hasOwn(actionLabels, v.action)
    )
      throw new ContentError("백업 이력 형식을 확인하세요.");
    // Historical taxonomy can differ from today's taxonomy.
    const doc = v.document;
    const historical = validateTaxonomy({
      ...taxonomy,
      categories: [...taxonomy.categories, doc?.category],
      tags: [...taxonomy.tags, ...(doc?.tags || [])],
    });
    const document = validateContent(doc, historical);
    if (document.id !== v.termId || document.revision !== v.revision)
      throw new ContentError("이력의 콘텐츠 버전이 일치하지 않습니다.");
    return {
      id: 0,
      termId: v.termId,
      revision: v.revision,
      action: v.action,
      createdAt: date(v.createdAt),
      document,
    };
  });
  return {
    backup: {
      format: "ui-notes-backup",
      version: 2,
      exportedAt: date(value.exportedAt),
      taxonomy,
      terms,
      history,
    },
    legacy: false,
  };
}
export async function previewImport(
  input: unknown,
  mode: "merge" | "replace",
): Promise<ImportPreview> {
  if (!["merge", "replace"].includes(mode))
    throw new ContentError("가져오기 방식을 선택하세요.");
  const { backup, legacy } = normalizeBackup(input),
    all = await drafts();
  const incoming = new Set(backup.terms.map((t) => t.document.id));
  const state = await exportBackup();
  const { exportedAt, ...stable } = state;
  return {
    token: hash({ input, mode, state: stable }),
    mode,
    legacy,
    added: backup.terms
      .filter((t) => !all.some((a) => a.id === t.document.id))
      .map((t) => t.document.english),
    updated: backup.terms
      .filter((t) => all.some((a) => a.id === t.document.id))
      .map((t) => t.document.english),
    removed:
      mode === "replace"
        ? all.filter((t) => !incoming.has(t.id)).map((t) => t.english)
        : [],
    published: backup.terms.filter(
      (t) => t.published && !t.document.deleted && !t.document.hidden,
    ).length,
    drafts: backup.terms.filter((t) => !t.published).length,
    history: backup.history.length,
    categories: backup.taxonomy.categories.length,
    tags: backup.taxonomy.tags.length,
  };
}
export async function importBackup(
  input: unknown,
  mode: "merge" | "replace",
  token: string,
): Promise<{
  checkpoint: Checkpoint;
  state: AdminState;
}> {
  return await transaction(async () => {
    const preview = await previewImport(input, mode);
    if (preview.token !== token)
      throw new ContentError(
        "검토 후 데이터나 파일이 바뀌었습니다. 다시 검토하세요.",
        409,
      );
    const { backup } = normalizeBackup(input);
    const before = await exportBackup();
    const checkpoint = await checkpointFile(before, "import");
    const existing = await drafts();
    let taxonomy = backup.taxonomy;
    if (mode === "merge") {
      const old = await getTaxonomy();
      taxonomy = {
        revision: old.revision + 1,
        categories: [...new Set([...old.categories, ...taxonomy.categories])],
        tags: [...new Set([...old.tags, ...taxonomy.tags])],
      };
    } else {
      taxonomy = {
        ...taxonomy,
        revision:
          Math.max((await getTaxonomy()).revision, taxonomy.revision) + 1,
      };
      await (
        await db()
      ).exec(
        "DELETE FROM terms; DELETE FROM published_terms; DELETE FROM content_meta; DELETE FROM term_versions;",
      );
    }
    await setSetting("taxonomy", taxonomy);
    const historical = new Set(
      (mode === "merge" ? before.history : []).map((v) =>
        hash({
          termId: v.termId,
          revision: v.revision,
          action: v.action,
          createdAt: v.createdAt,
          document: v.document,
        }),
      ),
    );
    for (const v of backup.history) {
      const key = hash({
        termId: v.termId,
        revision: v.revision,
        action: v.action,
        createdAt: v.createdAt,
        document: v.document,
      });
      if (!historical.has(key)) {
        await (
          await db()
        )
          .prepare(
            "INSERT INTO term_versions(term_id,revision,action,created_at,body) VALUES(?,?,?,?,?)",
          )
          .run(
            v.termId,
            v.revision,
            v.action,
            v.createdAt,
            JSON.stringify(v.document),
          );
        historical.add(key);
      }
    }
    for (const entry of backup.terms) {
      const old = existing.find((t) => t.id === entry.document.id);
      const term = {
        ...entry.document,
        revision: Math.max(old?.revision || 0, entry.document.revision) + 1,
      };
      await put(term, "import");
      if (entry.published)
        await publishSnapshot(
          entry.published.document,
          entry.published.publishedAt,
        );
      else
        await (
          await db()
        )
          .prepare("DELETE FROM published_terms WHERE id=?")
          .run(term.id);
    }
    // Keep a deterministic unique order after merges containing duplicate positions.
    for (const [index, term] of (await drafts()).entries()) {
      if (term.order !== index)
        await put(
          { ...term, order: index, revision: term.revision + 1 },
          "order",
        );
    }
    return { checkpoint, state: await getAdminState() };
  });
}

export async function consumeLoginAttempt(time = Date.now()): Promise<boolean> {
  return transaction(async () => {
    const row = await (
      await db()
    )
      .prepare(
        `INSERT INTO admin_login_limits(key,attempts,expires_at) VALUES('administrator',1,?)
    ON CONFLICT(key) DO UPDATE SET
      attempts=CASE WHEN expires_at<=? THEN 1 ELSE attempts+1 END,
      expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END
    RETURNING attempts`,
      )
      .get(time + 15 * 60 * 1000, time, time);
    return Number(row.attempts) <= 10;
  });
}
export async function clearLoginAttempts(): Promise<void> {
  await (
    await db()
  )
    .prepare("DELETE FROM admin_login_limits WHERE key='administrator'")
    .run();
}
