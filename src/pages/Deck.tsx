import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";
import { formatBibleText } from "@/data/bibleText";
import { useBible } from "@/context/BibleContext";
import { getDeck } from "@/services/decks";
import { getDeckVerses as fetchDeckVerses } from "@/services/deckVerses";

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

  useEffect(() => {
    if (!deckId) return;

    getDeck(deckId).then(setDeck);
    fetchDeckVerses(deckId).then(setVerses);
  }, [deckId]);

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="bible-header">
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-black/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover) dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            My Decks
          </button>

          <div className="mt-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {deck?.name ?? "Unnamed Deck"}
            </h1>

            <p className="mt-1 text-lg">
              {verses.length} {verses.length === 1 ? "verse" : "verses"}
            </p>
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
                  className="bible-verse-card rounded-xl border p-4 shadow-sm"
                >
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
              );
            })}
          </div>
        )}

        {verses.length === 0 && (
          <div className="mt-8 rounded-xl border border-(--bible-gold)/30 bg-black/5 px-4 py-10 text-center dark:bg-white/5">
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
    </main>
  );
}
