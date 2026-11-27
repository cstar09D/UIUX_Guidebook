import test from "node:test";
import assert from "node:assert/strict";
import {
  authConfigured,
  hashPassword,
  verifyPassword,
  createSession,
  validSession,
  sessionSeconds,
} from "../src/lib/admin-session.mjs";
test("관리자 비밀번호를 해시로 검증하고 잘못된 입력·환경 변수를 거부한다", async () => {
  const hash = await hashPassword("test-admin-password-strong");
  assert.equal(await verifyPassword("test-admin-password-strong", hash), true);
  for (const value of ["incorrect", "", null, "x".repeat(1025)])
    assert.equal(await verifyPassword(value, hash), false);
  assert.equal(
    authConfigured({
      ADMIN_PASSWORD_HASH: hash,
      ADMIN_SESSION_SECRET: "s".repeat(32),
    }),
    true,
  );
  assert.equal(
    authConfigured({
      ADMIN_PASSWORD_HASH: "raw-password",
      ADMIN_SESSION_SECRET: "s".repeat(32),
    }),
    false,
  );
  assert.equal(
    authConfigured({
      ADMIN_PASSWORD_HASH: hash,
      ADMIN_SESSION_SECRET: "short",
    }),
    false,
  );
});
test("관리자 세션은 변조·만료·암호 변경·시크릿 변경 시 거부한다", async () => {
  const env = {
    ADMIN_PASSWORD_HASH: await hashPassword("test-admin-password-strong"),
    ADMIN_SESSION_SECRET: "s".repeat(48),
  };
  const time = Date.now(),
    token = await createSession(env, time);
  assert.equal(await validSession(token, env, time), true);
  assert.equal(
    await validSession(token, env, time + (sessionSeconds + 1) * 1000),
    false,
  );
  assert.equal(await validSession(token + "broken", env, time), false);
  assert.equal(
    await validSession(
      token,
      { ...env, ADMIN_SESSION_SECRET: "t".repeat(48) },
      time,
    ),
    false,
  );
  assert.equal(
    await validSession(
      token,
      { ...env, ADMIN_PASSWORD_HASH: await hashPassword("changed-password") },
      time,
    ),
    false,
  );
  assert.equal(await validSession(token, {}, time), false);
});
