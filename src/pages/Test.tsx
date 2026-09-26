import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  BookOpen,
  Brain,
  PlayingCardsFan,
  Layers3,
  ArrowRight,
} from "lucide-react";
import { getMyDecks } from "@/services/decks";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type TestMode = "main" | "study" | null;

export default function Test() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<TestMode>(null);
  const [mainReviewMode, setMainReviewMode] = useState<"active" | "all" | null>(
    null,
  );

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await getMyDecks();
        setDecks(data);
      } catch (error) {
        console.error("Failed to load decks:", error);
      }
    };

    loadDecks();
  }, []);

  const mainDeck = decks.find((deck) => deck.is_default);
  const studyDecks = decks.filter((deck) => !deck.is_default);

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds((current) =>
      current.includes(deckId)
        ? current.filter((id) => id !== deckId)
        : [...current, deckId],
    );
  };

  const handleBack = () => {
    if (mainReviewMode) {
      setMainReviewMode(null);
      return;
    }

    if (mode) {
      setMode(null);
      setSelectedDeckIds([]);
      return;
    }

    navigate("/");
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[var(--bible-page-bg)] px-4 py-6 text-[var(--bible-page-text)] sm:py-8">
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex items-center self-start gap-2 rounded-xl border border-[var(--bible-gold)]/40 bg-black/5 px-3 py-2 text-sm font-medium text-[var(--bible-header-text)] shadow-sm transition hover:bg-[var(--bible-header-control-hover)] dark:bg-white/5"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {!mode && (
          <section className="flex min-h-[70vh] flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bible-gold)]">
                Practice
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-[var(--bible-header-text)] sm:text-4xl">
                Test
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--bible-header-text)] sm:text-base">
                Choose how you want to practice your verses.
              </p>
            </div>

            <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => setMode("main")}
                className="group aspect-square rounded-3xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-[var(--bible-gold)]/70 hover:shadow-xl sm:p-7"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--bible-gold)]/30 bg-[var(--bible-gold)]/10 text-[var(--bible-gold)] sm:h-14 sm:w-14">
                      <PlayingCardsFan
                        size={21}
                        strokeWidth={1.7}
                        className="sm:h-6 sm:w-6"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[var(--bible-card-text)]/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--bible-gold)]"
                    />
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-lg font-semibold text-[var(--bible-card-text)] sm:text-2xl">
                      Main Deck
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--bible-card-text)]/55 sm:max-w-[230px] sm:text-sm">
                      Your memorization deck with spaced repetition
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("study")}
                className="group aspect-square rounded-3xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-[var(--bible-gold)]/70 hover:shadow-xl sm:p-7"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--bible-gold)]/30 bg-[var(--bible-gold)]/10 text-[var(--bible-gold)] sm:h-14 sm:w-14">
                      <Layers3
                        size={21}
                        strokeWidth={1.7}
                        className="sm:h-6 sm:w-6"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[var(--bible-card-text)]/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--bible-gold)]"
                    />
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-lg font-semibold text-[var(--bible-card-text)] sm:text-2xl">
                      Other Decks
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--bible-card-text)]/55 sm:max-w-[230px] sm:text-sm">
                      Your other decks without spaced repetition
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {mode === "main" && !mainReviewMode && (
          <section className="flex min-h-[70vh] flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bible-gold)]">
                Main Deck
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-[var(--bible-header-text)] sm:text-4xl">
                Choose your practice
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--bible-header-text)] sm:text-base">
                Practice your verses using your memorization schedule or review
                them all
              </p>
            </div>

            <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-5">
              {/* Active Recall */}
              <button
                type="button"
                onClick={() => setMainReviewMode("active")}
                className="group aspect-square rounded-3xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-[var(--bible-gold)]/70 hover:shadow-xl sm:p-7"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--bible-gold)]/30 bg-[var(--bible-gold)]/10 text-[var(--bible-gold)] sm:h-14 sm:w-14">
                      <Brain
                        size={21}
                        strokeWidth={1.7}
                        className="sm:h-6 sm:w-6"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[var(--bible-card-text)]/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--bible-gold)]"
                    />
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-lg font-semibold text-[var(--bible-card-text)] sm:text-2xl">
                      Active Recall
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--bible-card-text)]/55 sm:max-w-[230px] sm:text-sm">
                      Follow your spaced-repetition schedule
                    </p>
                  </div>
                </div>
              </button>

              {/* Review All */}
              <button
                type="button"
                onClick={() => setMainReviewMode("all")}
                className="group aspect-square rounded-3xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-[var(--bible-gold)]/70 hover:shadow-xl sm:p-7"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--bible-gold)]/30 bg-[var(--bible-gold)]/10 text-[var(--bible-gold)] sm:h-14 sm:w-14">
                      <BookOpen
                        size={21}
                        strokeWidth={1.7}
                        className="sm:h-6 sm:w-6"
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-[var(--bible-card-text)]/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--bible-gold)]"
                    />
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-lg font-semibold text-[var(--bible-card-text)] sm:text-2xl">
                      Review All
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--bible-card-text)]/55 sm:max-w-[230px] sm:text-sm">
                      Review every verse in your Main Deck
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {mode === "study" && (
          <section className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bible-gold)]">
                Practice
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-[var(--bible-header-text)] sm:text-4xl">
                Study Decks
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--bible-header-text)]/60 sm:text-base">
                Select the decks you want to include in your test.
              </p>
            </div>

            {studyDecks.length === 0 ? (
              <div className="mx-auto mt-8 w-full max-w-md shrink-0 rounded-2xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-8 text-center shadow-sm">
                <Layers3
                  size={32}
                  strokeWidth={1.5}
                  className="mx-auto text-[var(--bible-gold)]"
                />

                <h2 className="mt-4 font-semibold text-[var(--bible-card-text)]">
                  No study decks yet
                </h2>

                <p className="mt-2 text-sm text-[var(--bible-card-text)]/55">
                  Create a study deck to start practicing.
                </p>
              </div>
            ) : (
              <>
                {/* Scrollable deck container */}
                <div className="mt-8 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] shadow-md">
                  <div className="flex items-center justify-between border-b border-[var(--bible-gold)]/15 px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-sm font-semibold text-[var(--bible-card-text)]">
                        Your Study Decks
                      </p>

                      <p className="mt-0.5 text-xs text-[var(--bible-card-text)]/45">
                        Select one or more
                      </p>
                    </div>

                    {selectedDeckIds.length > 0 && (
                      <span className="rounded-full bg-[var(--bible-gold)]/10 px-3 py-1 text-xs font-medium text-[var(--bible-gold)]">
                        {selectedDeckIds.length} selected
                      </span>
                    )}
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    {studyDecks.map((deck, index) => {
                      const selected = selectedDeckIds.includes(deck.id);

                      return (
                        <button
                          key={deck.id}
                          type="button"
                          onClick={() => toggleDeck(deck.id)}
                          className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition sm:px-6 ${
                            index !== 0
                              ? "border-t border-[var(--bible-gold)]/10"
                              : ""
                          } ${
                            selected
                              ? "bg-[var(--bible-gold)]/10"
                              : "hover:bg-[var(--bible-gold)]/5"
                          }`}
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                              selected
                                ? "border-[var(--bible-gold)] bg-[var(--bible-gold)]"
                                : "border-[var(--bible-card-text)]/25 group-hover:border-[var(--bible-gold)]/60"
                            }`}
                          >
                            {selected && (
                              <Check
                                size={14}
                                strokeWidth={2.5}
                                className="text-white"
                              />
                            )}
                          </div>

                          <Layers3
                            size={19}
                            strokeWidth={1.7}
                            className={`shrink-0 ${
                              selected
                                ? "text-[var(--bible-gold)]"
                                : "text-[var(--bible-card-text)]/35"
                            }`}
                          />

                          <span className="min-w-0 flex-1 truncate font-medium text-[var(--bible-card-text)]">
                            {deck.name}
                          </span>

                          <ArrowRight
                            size={17}
                            className={`shrink-0 transition-all ${
                              selected
                                ? "text-[var(--bible-gold)]"
                                : "text-[var(--bible-card-text)]/15 group-hover:translate-x-0.5 group-hover:text-[var(--bible-card-text)]/40"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Always stays visible */}
                <div className="flex shrink-0 items-center justify-between gap-4 pt-5">
                  <p className="text-sm text-[var(--bible-header-text)]/50">
                    {selectedDeckIds.length === 0
                      ? "No decks selected"
                      : `${selectedDeckIds.length} deck${
                          selectedDeckIds.length === 1 ? "" : "s"
                        } selected`}
                  </p>

                  <button
                    type="button"
                    disabled={selectedDeckIds.length === 0}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--bible-gold)] px-5 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Start Test
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <p
        className="mt-6 text-center text-xs"
        style={{
          color: "var(--bible-page-text)",
          opacity: 0.5,
        }}
      >
        When they call to me, I will answer them;
      </p>
    </main>
  );
}
