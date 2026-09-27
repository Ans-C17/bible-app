import { ArrowRight, Check, Layers3 } from "lucide-react";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type StudyDeckSelectionProps = {
  studyDecks: Deck[];
  selectedDeckIds: string[];
  onToggleDeck: (deckId: string) => void;
  onToggleAll: () => void;
  onStartTest: () => void;
};

export default function StudyDeckSelection({
  studyDecks,
  selectedDeckIds,
  onToggleDeck,
  onToggleAll,
  onStartTest,
}: StudyDeckSelectionProps) {
  const allSelected =
    studyDecks.length > 0 && selectedDeckIds.length === studyDecks.length;

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--bible-gold)">
          Practice
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-(--bible-header-text) sm:text-4xl">
          Study Decks
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm text-(--bible-header-text) sm:text-base">
          Choose decks to practice
        </p>
      </div>

      {studyDecks.length === 0 ? (
        <div className="mx-auto mt-8 w-full max-w-md shrink-0 rounded-2xl border border-(--bible-gold)/25 bg-(--bible-card-bg) p-8 text-center shadow-sm">
          <Layers3
            size={32}
            strokeWidth={1.5}
            className="mx-auto text-(--bible-gold)"
          />

          <h2 className="mt-4 font-semibold text-(--bible-card-text)">
            No study decks yet
          </h2>

          <p className="mt-2 text-sm text-(--bible-card-text)/55">
            Create a study deck to start practicing.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex max-h-[calc(100dvh-20rem)] flex-col overflow-hidden rounded-2xl border border-(--bible-gold)/25 bg-(--bible-card-bg) shadow-md">
            <div className="flex items-center justify-between border-b border-(--bible-gold)/15 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-(--bible-card-text)">
                  Your Study Decks
                </p>
                <p className="mt-0.5 text-xs text-(--bible-card-text)/45">
                  Select one or more
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onToggleAll}
                  className="text-xs font-medium text-(--bible-gold) transition hover:opacity-75"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>

                {selectedDeckIds.length > 0 && (
                  <span className="rounded-full bg-(--bible-gold)/10 px-3 py-1 text-xs font-medium text-(--bible-gold)">
                    {selectedDeckIds.length} selected
                  </span>
                )}
              </div>
            </div>
            <div className="overflow-y-auto">
              {studyDecks.map((deck, index) => {
                const selected = selectedDeckIds.includes(deck.id);

                return (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => onToggleDeck(deck.id)}
                    className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition sm:px-6 ${
                      index !== 0 ? "border-t border-(--bible-gold)/10" : ""
                    } ${
                      selected
                        ? "bg-(--bible-gold)/10"
                        : "hover:bg-(--bible-gold)/5"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        selected
                          ? "border-(--bible-gold) bg-(--bible-gold)"
                          : "border-(--bible-card-text)/25 group-hover:border-(--bible-gold)/60"
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
                          ? "text-(--bible-gold)"
                          : "text-(--bible-card-text)/35"
                      }`}
                    />

                    <span className="min-w-0 flex-1 truncate font-medium text-(--bible-card-text)">
                      {deck.name}
                    </span>

                    <ArrowRight
                      size={17}
                      className={`shrink-0 transition-all ${
                        selected
                          ? "text-(--bible-gold)"
                          : "text-(--bible-card-text)/15 group-hover:translate-x-0.5 group-hover:text-(--bible-card-text)/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 pt-5">
            <p className="text-sm text-(--bible-header-text)/50">
              {selectedDeckIds.length === 0
                ? "No decks selected"
                : `${selectedDeckIds.length} deck${
                    selectedDeckIds.length === 1 ? "" : "s"
                  } selected`}
            </p>

            <button
              type="button"
              onClick={onStartTest}
              disabled={selectedDeckIds.length === 0}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-(--bible-gold) px-5 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start Test
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      <p
        className="mt-10 text-center text-xs"
        style={{
          color: "var(--bible-page-text)",
          opacity: 0.5,
        }}
      >
        Death and Hades were thrown into the lake of fire.
      </p>
    </section>
  );
}
