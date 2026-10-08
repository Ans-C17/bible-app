import { useState } from "react";

import LoadingState from "@/components/LoadingState";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type DeckPickerPopupProps = {
  decks: Deck[];
  loading?: boolean;
  onClose: () => void;
  onAdd: (deckId: string) => void;
};

export default function DeckPickerPopup({
  decks,
  loading = false,
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
        className="w-full max-w-md rounded-2xl border border-(--bible-gold) bg-(--bible-card-bg) p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-(--bible-card-text)">
              Add to Deck
            </h2>

            <p className="mt-1 text-sm text-(--bible-card-text)/70">
              Add verses here for spaced repetition
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-(--bible-card-text)/60 transition hover:bg-(--bible-gold)/10 hover:text-(--bible-card-text)"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {loading ? (
          <LoadingState message="Loading your decks" />
        ) : (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--bible-card-text)/45">
              Main Deck
            </p>

            {mainDeck && (
              <button
                type="button"
                onClick={() => setSelectedDeckId(mainDeck.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedDeckId === mainDeck.id
                    ? "border-(--bible-gold) bg-(--bible-gold)/10"
                    : "border-(--bible-gold)/30 hover:bg-(--bible-gold)/5"
                }`}
              >
                <p className="font-medium text-(--bible-card-text)">
                  {mainDeck.name}
                </p>

                <p className="mt-1 text-sm text-(--bible-card-text)/65">
                  Your memorization deck
                </p>
              </button>
            )}
          </div>
        )}

        {!loading && otherDecks.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--bible-card-text)/45">
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
                      ? "border-(--bible-gold) bg-(--bible-gold)/10"
                      : "border-(--bible-gold)/25 hover:bg-(--bible-gold)/5"
                  }`}
                >
                  <p className="font-medium text-(--bible-card-text)">
                    {deck.name}
                  </p>

                  <p className="mt-0.5 text-sm text-(--bible-card-text)/60">
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-(--bible-card-text)/70 transition hover:bg-(--bible-gold)/10 hover:text-(--bible-card-text)"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onAdd(selectedDeckId)}
            disabled={!selectedDeckId}
            className="rounded-lg bg-(--bible-gold) px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
