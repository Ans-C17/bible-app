import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { upsertMyProfile } from "@/services/profiles";
import { supabase } from "@/services/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
          options: {
            data: {
              name: name.trim(),
            },
          },
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

    if (isSignup && result.data.session) {
      try {
        await upsertMyProfile(name);
      } catch (profileError) {
        console.error("Failed to save profile:", profileError);
        setError("Your account was created, but your name could not be saved.");
        return;
      }
    }

    navigate("/");

    console.log(isSignup ? "Signup successful!" : "Logged in!");
  };

  return (
    // <main className="bible-page min-h-dvh flex items-center justify-center px-5 py-10 sm:px-8">
    <main className="bible-page flex min-h-dvh items-center justify-center overflow-y-auto px-5 py-6 sm:px-8">
      <div className={`w-full ${isSignup ? "max-w-sm" : "max-w-md"}`}>
        {/* Header */}
        <div
          className={`bible-gold flex items-center justify-center gap-2 text-sm font-medium tracking-wide sm:text-base lg:gap-3 lg:text-lg ${
            isSignup ? "mb-5" : "mb-8"
          }`}
        >
          <BookOpen
            className="bible-gold h-4.5 w-4.5 sm:h-5 sm:w-5 lg:h-7 lg:w-7"
            strokeWidth={1.8}
          />

          <p>Memory Bible</p>
        </div>

        {/* Heading */}
        <div className={isSignup ? "mb-5 text-center" : "mb-8 text-center"}>
          <h1
            className={`font-semibold tracking-tight ${
              isSignup ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
            }`}
            style={{ color: "var(--bible-page-text)" }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          <p className={isSignup ? "mt-1 text-xs sm:text-sm" : "mt-2 text-sm sm:text-base"}>
            {isSignup
              ? "Start building your Scripture memory journey."
              : "Continue your Scripture memory journey."}
          </p>
        </div>

        {/* Card */}
        <div
          className={`rounded-3xl border shadow-xl ${
            isSignup ? "p-5 sm:p-6" : "p-6 sm:p-8"
          }`}
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
            className={isSignup ? "space-y-3.5" : "space-y-5"}
          >
            {/* Name */}
            {isSignup && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className={`w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                    isSignup ? "py-2.5" : "py-3"
                  }`}
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--bible-card-text) 7%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--bible-card-text) 20%, transparent)",
                    color: "var(--bible-card-text)",
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
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
                className={`w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  isSignup ? "py-2.5" : "py-3"
                }`}
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
                className={`w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  isSignup ? "py-2.5" : "py-3"
                }`}
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
            className="w-full cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-white/5"
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
