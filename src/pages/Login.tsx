import { useState } from "react";

import { BookOpen } from "lucide-react";

import { supabase } from "@/services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const result = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    console.log(isSignup ? "Signup successful!" : "Logged in!");
  };

  return (
    // <main className="bible-page min-h-dvh flex items-center justify-center px-5 py-10 sm:px-8">
    <main className="bible-page h-dvh overflow-hidden flex items-center justify-center px-5 py-6 sm:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bible-gold mb-8 flex items-center justify-center gap-2 text-sm font-medium tracking-wide sm:text-base lg:gap-3 lg:text-lg">
          <BookOpen
            className="bible-gold h-4.5 w-4.5 sm:h-5 sm:w-5 lg:h-7 lg:w-7"
            strokeWidth={1.8}
          />

          <p>Memory Bible</p>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--bible-page-text)" }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-2 text-sm sm:text-base">
            {isSignup
              ? "Start building your Scripture memory journey."
              : "Continue your Scripture memory journey."}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border p-6 shadow-xl sm:p-8"
          style={{
            background:
              "radial-gradient(circle at top, #fffaf0 0%, #f3e5cf 100%)",
            color: "var(--bible-card-text)",
            borderColor:
              "color-mix(in srgb, var(--bible-gold) 35%, transparent)",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--bible-card-text) 7%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--bible-card-text) 20%, transparent)",
                  color: "var(--bible-card-text)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--bible-card-text) 7%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--bible-card-text) 20%, transparent)",
                  color: "var(--bible-card-text)",
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgb(220 38 38 / 30%)",
                  backgroundColor: "rgb(220 38 38 / 8%)",
                  color: "var(--bible-card-text)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-4 py-3 font-medium transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              style={{
                backgroundColor: "var(--bible-gold)",
                color: "#fffaf0",
              }}
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--bible-card-text) 15%, transparent)",
              }}
            />

            <span className="text-xs" style={{ opacity: 0.5 }}>
              {isSignup ? "Already have an account?" : "New here?"}
            </span>

            <div
              className="h-px flex-1"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--bible-card-text) 15%, transparent)",
              }}
            />
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsSignup((current) => !current);
              setError("");
            }}
            className="w-full cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              borderColor:
                "color-mix(in srgb, var(--bible-card-text) 20%, transparent)",
              color: "var(--bible-card-text)",
            }}
          >
            {isSignup ? "Log in instead" : "Create an account"}
          </button>
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{
            color: "var(--bible-page-text)",
            opacity: 0.5,
          }}
        >
          {isSignup
            ? 'God said, "Let there be light."'
            : "In the beginning was the word."}
        </p>
      </div>
    </main>
  );
}
