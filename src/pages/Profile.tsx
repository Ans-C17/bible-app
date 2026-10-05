import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { getMyDecks } from "@/services/decks";
import { ensureMyProfile, type Profile } from "@/services/profiles";
import { supabase } from "@/services/supabase";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const load = async () => {
      try {
        const fallbackName =
          (user.user_metadata?.name as string | undefined) ??
          user.email?.split("@")[0] ??
          "Bible learner";
        const [profileData, deckData] = await Promise.all([
          ensureMyProfile(fallbackName),
          getMyDecks(),
        ]);

        if (active) {
          setProfile(profileData);
          setDecks(deckData as Deck[]);
        }
      } catch (loadError) {
        console.error("Failed to load profile:", loadError);
        if (active) setError("We could not load your profile right now.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setSigningOut(false);
      setError("We could not sign you out. Please try again.");
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="bible-header">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-white/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) transition hover:bg-(--bible-header-control-hover)"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--bible-gold)">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Profile
            </h1>
            <p className="mt-1 text-lg">Your Scripture memory journey</p>
          </div>
        </div>

        {loading && (
          <p className="bible-header-control mt-8 text-center text-sm">
            Loading profile...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        {!loading && !error && profile && (
          <div className="mt-8 space-y-5">
            <section className="rounded-2xl border border-(--bible-gold)/30 bg-(--bible-card-bg) p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--bible-gold)/35 bg-(--bible-gold)/10 text-(--bible-card-meta)">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--bible-card-meta)">
                    Signed in as
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-(--bible-card-text)">
                    {profile.name}
                  </h2>
                </div>
              </div>

              <div className="mt-5 flex min-w-0 items-center gap-2 border-t border-(--bible-card-text)/10 pt-4 text-sm text-(--bible-card-text)/60">
                <Mail className="h-4 w-4 shrink-0 text-(--bible-card-meta)" />
                <span className="min-w-0 wrap-break-word">{user?.email}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-(--bible-gold)/25 bg-white/5 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--bible-gold)/30 bg-(--bible-gold)/10 text-(--bible-gold)">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-(--bible-page-text)">
                    My decks
                  </h2>
                  <p className="mt-1 text-sm text-(--bible-page-text)/55">
                    {decks.length} {decks.length === 1 ? "deck" : "decks"}{" "}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/decks")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-(--bible-gold)/45 bg-(--bible-gold)/10 px-3 py-2.5 text-xs font-semibold text-(--bible-page-text) transition hover:bg-(--bible-gold)/20 sm:px-4"
                >
                  View my decks
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        )}

        <p
          className="mt-10 pb-2 text-center text-xs"
          style={{
            color: "var(--bible-page-text)",
            opacity: 0.5,
          }}
        >
          Create in me a clean heart, O God
        </p>
      </div>
    </main>
  );
}
