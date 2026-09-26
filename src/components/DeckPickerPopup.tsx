import { useState } from "react";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type DeckPickerPopupProps = {
  verseCode: string;
  language: "english" | "malayalam";
  decks: Deck[];
  onClose: () => void;
  onAdd: (deckId: string) => void;
};

export default function DeckPickerPopup({
  verseCode,
  language,
  decks,
  onClose,
  onAdd,
}: DeckPickerPopupProps) {
  const mainDeck = decks.find((deck) => deck.is_default);
  const otherDecks = decks.filter((deck) => !deck.is_default);

  const [selectedDeckId, setSelectedDeckId] = useState(mainDeck?.id ?? "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--bible-gold)] bg-[var(--bible-card-bg)] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--bible-card-text)]">
              Add to Deck
            </h2>

            <p className="mt-1 text-sm text-[var(--bible-card-text)]/70">
              Add verses here for spaced repetition
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--bible-card-text)]/60 transition hover:bg-[var(--bible-gold)]/10 hover:text-[var(--bible-card-text)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bible-card-text)]/45">
            Main Deck
          </p>

          {mainDeck && (
            <button
              type="button"
              onClick={() => setSelectedDeckId(mainDeck.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedDeckId === mainDeck.id
                  ? "border-[var(--bible-gold)] bg-[var(--bible-gold)]/10"
                  : "border-[var(--bible-gold)]/30 hover:bg-[var(--bible-gold)]/5"
              }`}
            >
              <p className="font-medium text-[var(--bible-card-text)]">
                {mainDeck.name}
              </p>

              <p className="mt-1 text-sm text-[var(--bible-card-text)]/65">
                Your memorization deck
              </p>
            </button>
          )}
        </div>

        {otherDecks.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bible-card-text)]/45">
              Other Decks
            </p>

            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {otherDecks.map((deck) => (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedDeckId === deck.id
                      ? "border-[var(--bible-gold)] bg-[var(--bible-gold)]/10"
                      : "border-[var(--bible-gold)]/25 hover:bg-[var(--bible-gold)]/5"
                  }`}
                >
                  <p className="font-medium text-[var(--bible-card-text)]">
                    {deck.name}
                  </p>

                  <p className="mt-0.5 text-sm text-[var(--bible-card-text)]/60">
                    Study collection
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--bible-card-text)]/70 transition hover:bg-[var(--bible-gold)]/10 hover:text-[var(--bible-card-text)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onAdd(selectedDeckId)}
            disabled={!selectedDeckId}
            className="rounded-lg bg-[var(--bible-gold)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
