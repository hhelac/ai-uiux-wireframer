"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMessage(
            "Account created. Check your email to confirm your account."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode(newMode: "login" | "signup") {
    setMode(newMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main
      className={`${robotoMono.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-[#55DDE8]`}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#55DDE8 1px, transparent 1px), linear-gradient(90deg, #55DDE8 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-[#55DDE8]/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[470px]">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#55DDE8] text-2xl text-black">
            ⚙
          </div>

          <span className="text-3xl font-bold tracking-tight">
            DesAIgn
          </span>
        </button>

        {/* Main box */}
        <div className="rounded-[28px] border border-[#55DDE8]/70 bg-black/80 p-8 shadow-[0_0_40px_rgba(85,221,232,0.06)]">
          {/* Small terminal header */}
          <div className="mb-7 flex items-center justify-between border-b border-[#55DDE8]/20 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#55DDE8]/50">
                USER ACCESS
              </p>

              <h1 className="mt-2 text-2xl font-bold">
                {mode === "login"
                  ? "WELCOME BACK_"
                  : "CREATE ACCOUNT_"}
              </h1>
            </div>

            <div className="h-3 w-3 animate-pulse rounded-full bg-[#55DDE8]" />
          </div>

          {/* Mode switch */}
          <div className="mb-7 grid grid-cols-2 rounded-full border border-[#55DDE8]/30 bg-[#111] p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                mode === "login"
                  ? "bg-[#55DDE8] text-black"
                  : "text-[#55DDE8]/60 hover:text-[#55DDE8]"
              }`}
            >
              LOGIN
            </button>

            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                mode === "signup"
                  ? "bg-[#55DDE8] text-black"
                  : "text-[#55DDE8]/60 hover:text-[#55DDE8]"
              }`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold tracking-[0.18em] text-[#55DDE8]/70">
                EMAIL_ADDRESS
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-2xl border border-transparent bg-[#282828] px-5 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#55DDE8]"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold tracking-[0.18em] text-[#55DDE8]/70">
                PASSWORD
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-transparent bg-[#282828] px-5 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#55DDE8]"
              />
            </div>

            {/* Confirm password */}
            {mode === "signup" && (
              <div className="mb-5">
                <label className="mb-2 block text-xs font-bold tracking-[0.18em] text-[#55DDE8]/70">
                  CONFIRM_PASSWORD
                </label>

                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-transparent bg-[#282828] px-5 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#55DDE8]"
                />
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                ERROR: {error}
              </div>
            )}

            {message && (
              <div className="mb-5 rounded-xl border border-[#55DDE8]/30 bg-[#55DDE8]/10 px-4 py-3 text-xs text-[#55DDE8]">
                STATUS: {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#55DDE8] py-4 text-sm font-bold tracking-[0.12em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "PROCESSING..."
                : mode === "login"
                  ? "ACCESS WORKSPACE"
                  : "INITIALIZE ACCOUNT"}
            </button>
          </form>

          <div className="mt-7 border-t border-[#55DDE8]/15 pt-5 text-center text-[10px] tracking-[0.2em] text-[#55DDE8]/35">
            DesAIgn // AUTH SYSTEM // ONLINE
          </div>
        </div>
      </div>
    </main>
  );
}