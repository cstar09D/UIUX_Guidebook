export const contentTables = ['terms', 'settings', 'content_meta', 'published_terms', 'term_versions', 'checkpoints'];
export const schema = `
CREATE TABLE IF NOT EXISTS terms(id TEXT PRIMARY KEY,body TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
CREATE TABLE IF NOT EXISTS content_meta(term_id TEXT PRIMARY KEY,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS published_terms(id TEXT PRIMARY KEY,body TEXT NOT NULL,published_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS term_versions(id INTEGER PRIMARY KEY AUTOINCREMENT,term_id TEXT NOT NULL,revision INTEGER NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL,body TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS versions_term ON term_versions(term_id,id DESC);
CREATE TABLE IF NOT EXISTS checkpoints(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,reason TEXT NOT NULL,body TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admin_login_limits(key TEXT PRIMARY KEY,attempts INTEGER NOT NULL,expires_at INTEGER NOT NULL);
`;
