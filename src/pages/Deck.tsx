import { useEffect, useState } from "react";

import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmPopup from "@/components/ConfirmPopup";
import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";
import { formatBibleText } from "@/data/bibleText";
import { useBible } from "@/context/BibleContext";
import { getDeck } from "@/services/decks";
import {
  deleteDeckVerses,
  getDeckVerses as fetchDeckVerses,
} from "@/services/deckVerses";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type DeckVerse = {
  id: string;
  deck_id: string;
  verse_code: string;
  language: "english" | "malayalam";
  added_at: string;
};

export default function Deck() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const { englishMap, malayalamMap } = useBible();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [verses, setVerses] = useState<DeckVerse[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedVerseIds, setSelectedVerseIds] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) return;

    getDeck(deckId).then(setDeck);
    fetchDeckVerses(deckId).then(setVerses);
  }, [deckId]);

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedVerseIds([]);
    setShowDeleteConfirmation(false);
    setDeleteError(null);
  };

  const toggleVerseSelection = (verseId: string) => {
    setSelectedVerseIds((current) =>
      current.includes(verseId)
        ? current.filter((id) => id !== verseId)
        : [...current, verseId],
    );
  };

  const handleDeleteAll = () => {
    setSelectedVerseIds(verses.map((verse) => verse.id));
    setShowDeleteConfirmation(true);
  };

  const handleDeleteVerses = async () => {
    if (!deckId || selectedVerseIds.length === 0 || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDeckVerses(deckId, selectedVerseIds);

      setVerses((current) =>
        current.filter((verse) => !selectedVerseIds.includes(verse.id)),
      );
      cancelSelection();
    } catch (error) {
      console.error("Failed to delete deck verses:", error);
      setDeleteError("Failed to delete verses. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="bible-header">
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-white/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover)"
          >
            <ArrowLeft className="h-4 w-4" />
            My Decks
          </button>

          <div className="mt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {deck?.name ?? "Unnamed Deck"}
                </h1>

                <p className="mt-1 text-lg">
                  {verses.length} {verses.length === 1 ? "verse" : "verses"}
                </p>
              </div>

              {!isSelectionMode && verses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSelectionMode(true);
                    setDeleteError(null);
                  }}
                  aria-label="Select verses to delete"
                  title="Delete verses"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {isSelectionMode && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--bible-gold)/25 bg-white/5 px-3 py-3">
                <p className="text-sm font-medium text-(--bible-header-text)">
                  Select verses
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    title="Delete all verses"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    Delete all
                  </button>

                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-(--bible-header-text) transition hover:bg-(--bible-gold)/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(true)}
                    disabled={selectedVerseIds.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete {selectedVerseIds.length}{" "}
                    {selectedVerseIds.length === 1 ? "verse" : "verses"}
                  </button>
                </div>
              </div>
            )}

            {deleteError && (
              <p className="mt-3 text-sm text-red-300">{deleteError}</p>
            )}
          </div>
        </div>

        {verses.length > 0 && (
          <div className="mt-6 space-y-3">
            {verses.map((deckVerse) => {
              const verse =
                deckVerse.language === "english"
                  ? englishMap.get(deckVerse.verse_code)
                  : malayalamMap.get(deckVerse.verse_code);

              if (!verse) return null;

              return (
                <div
                  key={deckVerse.id}
                  className={`bible-verse-card rounded-xl border p-4 shadow-sm ${
                    isSelectionMode ? "flex items-start gap-3" : ""
                  }`}
                >
                  {isSelectionMode && (
                    <button
                      type="button"
                      onClick={() => toggleVerseSelection(deckVerse.id)}
                      aria-label={`Select ${
                        deckVerse.language === "english"
                          ? `${verse.book} ${verse.chapter}:${verse.verse}`
                          : `${MALAYALAM_BOOK_NAMES[verse.bookId!]}`
                      }`}
                      aria-pressed={selectedVerseIds.includes(deckVerse.id)}
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        selectedVerseIds.includes(deckVerse.id)
                          ? "border-(--bible-gold) bg-(--bible-gold) text-white"
                          : "border-(--bible-card-text)/30 text-transparent hover:border-(--bible-gold)/70"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`bible-verse-text leading-relaxed ${
                        deckVerse.language === "malayalam"
                          ? "font-anek"
                          : "font-medium"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatBibleText(verse.text),
                      }}
                    />

                    <div className="mt-3 flex justify-end">
                      <p
                        className={`bible-verse-meta text-sm underline underline-offset-2 ${
                          deckVerse.language === "malayalam"
                            ? "font-anek"
                            : "font-medium"
                        }`}
                      >
                        {deckVerse.language === "english"
                          ? `${verse.book} ${verse.chapter}:${verse.verse}`
                          : `${MALAYALAM_BOOK_NAMES[verse.bookId!]} ${verse.chapter}:${verse.verse}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {verses.length === 0 && (
          <div className="mt-8 rounded-xl border border-(--bible-gold)/30 bg-white/5 px-4 py-10 text-center">
            <p className="bible-header-control text-sm">
              This deck has no verses yet
            </p>

            <button
              type="button"
              onClick={() => navigate("/search")}
              className="mt-4 rounded-xl bg-(--bible-gold) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Add Verses
            </button>
          </div>
        )}

        <p
          className="mt-10 text-center text-xs"
          style={{
            color: "var(--bible-page-text)",
            opacity: 0.5,
          }}
        >
          And remember, I am with you always, to the end of the age.
        </p>
      </div>

      {showDeleteConfirmation && selectedVerseIds.length > 0 && (
        <ConfirmPopup
          title={`Delete ${selectedVerseIds.length} ${selectedVerseIds.length === 1 ? "verse" : "verses"}?`}
          message="These verses will be removed from this deck."
          confirmText="Delete"
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteVerses}
        />
      )}
    </main>
  );
}
