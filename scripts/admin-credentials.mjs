import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { hashPassword } from "../src/lib/admin-session.mjs";
const passwordFile = "data/deployment/admin-password.txt";
if (existsSync(passwordFile) || existsSync(".env.deploy.local")) {
  console.error("기존 배포 설정이나 비밀번호가 있습니다. 덮어쓰지 않았습니다.");
  process.exitCode = 1;
} else {
  mkdirSync("data/deployment", { recursive: true });
  const password = randomBytes(24).toString("base64url");
  const hash = await hashPassword(password);
  const secret = randomBytes(48).toString("base64url");
  writeFileSync(passwordFile, password + "\n", { mode: 0o600, flag: "wx" });
  // This file is loaded by Node --env-file, which preserves literal $.
  const envHash = hash;
  writeFileSync(
    ".env.deploy.local",
    `ADMIN_PASSWORD_HASH=${envHash}\nADMIN_SESSION_SECRET=${secret}\nTURSO_DATABASE_URL=\nTURSO_AUTH_TOKEN=\n`,
    { mode: 0o600, flag: "wx" },
  );
  console.log(
    "관리자 비밀번호: " +
      passwordFile +
      "\n배포 환경 변수: .env.deploy.local\n두 파일은 Git에서 제외됩니다. 비밀번호나 토큰을 채팅에 붙여넣지 마세요.",
  );
}
