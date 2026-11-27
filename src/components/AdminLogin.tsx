"use client";
import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
export default function AdminLogin({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <LockKeyhole size={24} />
        </div>
        <p className="admin-login-eyebrow">UI NOTES · STUDIO</p>
        <h1>관리자 로그인</h1>
        <p>콘텐츠를 편집하고 게시하려면 로그인하세요.</p>
        {!configured ? (
          <p role="alert" className="admin-login-error">
            관리자 로그인이 아직 설정되지 않았습니다. 배포 환경 변수를 설정한 후
            다시 접속하세요.
          </p>
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              const password = new FormData(event.currentTarget).get(
                "password",
              );
              try {
                const response = await fetch("/api/session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password }),
                });
                const result = await response.json();
                if (!response.ok)
                  throw new Error(result.error || "로그인하지 못했습니다.");
                window.location.assign("/admin");
              } catch (error) {
                setError(
                  error instanceof Error
                    ? error.message
                    : "로그인하지 못했습니다.",
                );
                setBusy(false);
              }
            }}
          >
            <label htmlFor="admin-password">비밀번호</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
              disabled={busy}
            />
            {error && (
              <p className="admin-login-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy}>
              {busy ? "확인 중…" : "로그인"}
              <ArrowRight size={18} />
            </button>
          </form>
        )}
        <a href="/">사전으로 돌아가기</a>
      </section>
    </main>
  );
}
