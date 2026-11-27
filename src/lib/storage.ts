import { ContentError } from "./content";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  createClient,
  type Client,
  type Transaction,
} from "@libsql/client/http";

export interface StorageConnection {
  remote: boolean;
  prepare(sql: string): {
    get(...args: any[]): Promise<any>;
    all(...args: any[]): Promise<any[]>;
    run(...args: any[]): Promise<unknown>;
  };
  exec(sql: string): Promise<void>;
  transaction<T>(
    operation: (connection: StorageConnection) => Promise<T>,
  ): Promise<T>;
}

export function libsqlStorage(
  client: Client | Transaction,
  nested = false,
): StorageConnection {
  let pending: Promise<unknown> = Promise.resolve();
  const connection: StorageConnection = {
    remote: true,
    prepare(sql) {
      const execute = (args: any[]) => client.execute({ sql, args });
      return {
        async get(...args) {
          return (await execute(args)).rows[0];
        },
        async all(...args) {
          return (await execute(args)).rows;
        },
        async run(...args) {
          return execute(args);
        },
      };
    },
    async exec(sql) {
      await client.executeMultiple(sql);
    },
    async transaction(operation) {
      if (nested) return operation(connection);
      const job = pending.then(async () => {
        let tx: Transaction;
        try {
          tx = await (client as Client).transaction("write");
        } catch (error) {
          if ((error as { code?: string }).code?.startsWith("SQLITE_BUSY"))
            throw new ContentError(
              "다른 작업을 저장 중입니다. 잠시 후 다시 시도하세요.",
              409,
            );
          throw error;
        }
        try {
          const value = await operation(libsqlStorage(tx, true));
          await tx.commit();
          return value;
        } catch (error) {
          await tx.rollback().catch(() => {});
          throw error;
        } finally {
          tx.close();
        }
      });
      pending = job.catch(() => {});
      return job;
    },
  };
  return connection;
}
function localConnection(
  sqlite: DatabaseSync,
  filename: string,
  nested = false,
): StorageConnection {
  let pending: Promise<unknown> = Promise.resolve();
  const connection: StorageConnection = {
    remote: false,
    prepare(sql) {
      return {
        async get(...args) {
          return sqlite.prepare(sql).get(...args);
        },
        async all(...args) {
          return sqlite.prepare(sql).all(...args);
        },
        async run(...args) {
          return sqlite.prepare(sql).run(...args);
        },
      };
    },
    async exec(sql) {
      sqlite.exec(sql);
    },
    async transaction(operation) {
      if (nested) return operation(connection);
      // A separate WAL connection keeps readers from seeing uncommitted writes.
      const job = pending.then(async () => {
        const tx = new DatabaseSync(filename);
        tx.exec("PRAGMA busy_timeout=5000; BEGIN IMMEDIATE");
        try {
          const value = await operation(localConnection(tx, filename, true));
          tx.exec("COMMIT");
          return value;
        } catch (error) {
          tx.exec("ROLLBACK");
          throw error;
        } finally {
          tx.close();
        }
      });
      pending = job.catch(() => {});
      return job;
    },
  };
  return connection;
}
export function createStorage(): StorageConnection {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    if (!/^libsql:\/\//.test(url) || !process.env.TURSO_AUTH_TOKEN)
      throw new Error("Turso URL과 인증 토큰을 확인하세요.");
    return libsqlStorage(
      createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }),
    );
  }
  if (process.env.VERCEL)
    throw new Error(
      "Vercel에는 TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN이 필요합니다. 먼저 로컬 데이터를 이전하세요.",
    );
  const filename =
    process.env.UI_NOTES_DB_PATH ||
    path.join(process.cwd(), "data", "ui-notes.sqlite");
  mkdirSync(path.dirname(filename), { recursive: true });
  const sqlite = new DatabaseSync(filename);
  sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
  return localConnection(sqlite, filename);
}
