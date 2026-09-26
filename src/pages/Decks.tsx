import { useEffect, useState } from "react";
import CreateDeckPopup from "@/components/CreateDeckPopup";

import {
  ArrowLeft,
  ArrowRight,
  Layers,
  PlayingCardsFan,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { createDeck, getMyDecks } from "@/services/decks";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export default function Decks() {
  const navigate = useNavigate();

  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    getMyDecks().then(setDecks);
  }, []);

  const mainDeck = decks.find((deck) => deck.is_default);
  const otherDecks = decks.filter((deck) => !deck.is_default);

  const handleCreateDeck = async (name: string) => {
    const deck = await createDeck(name);
    setDecks((current) => [...current, deck]);
    setShowCreateDeck(false);
  };

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="bible-header">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--bible-gold)]/40 bg-black/5 px-3 py-2 text-sm font-medium text-[var(--bible-header-text)] shadow-sm transition hover:bg-[var(--bible-header-control-hover)] dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My Decks
              </h1>

              <p className="mt-2 text-base text-[var(--bible-page-text)]">
                Organize your verses
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateDeck(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--bible-gold)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create Deck
            </button>
          </div>
        </div>

        {/* Main Deck */}
        {mainDeck && (
          <section className="mt-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bible-page-text)]/45">
              Main Deck
            </h2>

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                navigate(`/decks/${mainDeck.id}`);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/decks/${mainDeck.id}`);
                }
              }}
              className="cursor-pointer overflow-hidden rounded-2xl border border-[var(--bible-gold)]/45 bg-[var(--bible-card-bg)] transition hover:border-[var(--bible-gold)]/70 hover:shadow-md"
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--bible-gold)]/40 bg-[var(--bible-gold)]/10 text-[var(--bible-card-meta)]">
                    <PlayingCardsFan className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-[var(--bible-card-text)]">
                      {mainDeck.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-[var(--bible-card-text)]/55">
                      Add verses here for spaced repetition
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/decks/${mainDeck.id}`);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--bible-gold)]/60 bg-[var(--bible-gold)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--bible-card-text)] shadow-sm transition hover:bg-[var(--bible-gold)]/20 sm:w-auto"
                >
                  Open
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Other Decks */}
        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bible-page-text)]/45">
                Other Decks
              </h2>
            </div>

            {otherDecks.length > 0 && (
              <span className="text-sm text-[var(--bible-page-text)]/40">
                {otherDecks.length}
              </span>
            )}
          </div>

          {otherDecks.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--bible-gold)]/25 bg-black/5 dark:bg-white/5">
              {otherDecks.map((deck, index) => (
                <div
                  key={deck.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    navigate(`/decks/${deck.id}`);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/decks/${deck.id}`);
                    }
                  }}
                  className={`cursor-pointer flex items-center gap-4 px-4 py-4 transition hover:bg-[var(--bible-gold)]/5 sm:px-5 ${
                    index !== otherDecks.length - 1
                      ? "border-b border-[var(--bible-gold)]/15"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--bible-gold)]/25 text-[var(--bible-gold)]">
                    <Layers className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-[var(--bible-page-text)]">
                      {deck.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--bible-gold)]/50 bg-[var(--bible-gold)]/10 px-3.5 py-2 text-sm font-semibold text-[var(--bible-page-text)] shadow-sm transition hover:bg-[var(--bible-gold)]/20"
                  >
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--bible-gold)]/25 bg-black/5 px-6 py-10 text-center dark:bg-white/5">
              <Layers className="mx-auto h-6 w-6 text-[var(--bible-gold)]/60" />

              <p className="mt-4 text-sm text-[var(--bible-page-text)]/55">
                No other decks yet.
              </p>
            </div>
          )}
        </section>

        <p
          className="mt-10 text-center text-xs"
          style={{
            color: "var(--bible-page-text)",
            opacity: 0.5,
          }}
        >
          Your word is a lamp to my feet and a light to my path.
        </p>
      </div>

      {showCreateDeck && (
        <CreateDeckPopup
          onClose={() => setShowCreateDeck(false)}
          onCreate={handleCreateDeck}
        />
      )}
    </main>
  );
}
