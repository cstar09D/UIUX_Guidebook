import {
  scrypt as scryptCallback,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
const scrypt = promisify(scryptCallback);
export const sessionCookie = "ui-notes-admin";
export const sessionSeconds = 8 * 60 * 60;
export function authConfigured(env = process.env) {
  return (
    /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(
      env.ADMIN_PASSWORD_HASH || "",
    ) && (env.ADMIN_SESSION_SECRET || "").length >= 32
  );
}
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt$${salt}$${key.toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  if (
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 1024 ||
    !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(encoded || "")
  )
    return false;
  const [, salt, expected] = encoded.split("$");
  const actual = await scrypt(password, salt, 64, {
    N: 32768,
    maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
function signingKey(env) {
  if (!authConfigured(env))
    throw new Error("관리자 로그인 환경 변수가 필요합니다.");
  // Rotating either the password or session secret invalidates existing sessions.
  return createHash("sha256")
    .update(env.ADMIN_SESSION_SECRET)
    .update("\0")
    .update(env.ADMIN_PASSWORD_HASH)
    .digest();
}
export async function createSession(
  env = process.env,
  currentTime = Date.now(),
) {
  const seconds = Math.floor(currentTime / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("administrator")
    .setIssuer("ui-notes")
    .setAudience("ui-notes-admin")
    .setIssuedAt(seconds)
    .setExpirationTime(seconds + sessionSeconds)
    .sign(signingKey(env));
}
export async function validSession(
  token,
  env = process.env,
  currentTime = Date.now(),
) {
  if (!token || !authConfigured(env)) return false;
  try {
    const { payload } = await jwtVerify(token, signingKey(env), {
      algorithms: ["HS256"],
      issuer: "ui-notes",
      audience: "ui-notes-admin",
      subject: "administrator",
      currentDate: new Date(currentTime),
    });
    return (
      typeof payload.iat === "number" &&
      typeof payload.exp === "number" &&
      payload.exp - payload.iat === sessionSeconds &&
      payload.iat <= Math.floor(currentTime / 1000)
    );
  } catch {
    return false;
  }
}
