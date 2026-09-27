import { useEffect, useMemo, useState } from "react";

import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";

import { useBible } from "@/context/BibleContext";

import { formatBibleText } from "@/data/bibleText";

import { ArrowLeft, Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getMyDecks } from "@/services/decks";

import { addVerseToDeck } from "@/services/deckVerses";

import DeckPickerPopup from "@/components/DeckPickerPopup";

import {
  createEnglishHaystack,
  createMalayalamHaystack,
  searchEnglish,
  searchMalayalam,
} from "@/data/search";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export default function Search() {
  const navigate = useNavigate();

  const { englishVerses, malayalamVerses } = useBible();

  const [query, setQuery] = useState("");

  const [language, setLanguage] = useState<"english" | "malayalam">("english");

  const [selectedVerse, setSelectedVerse] = useState<{
    verseCode: string;
    language: "english" | "malayalam";
  } | null>(null);

  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    getMyDecks().then(setDecks);
  }, []);

  const englishHaystack = useMemo(
    () => createEnglishHaystack(englishVerses),
    [englishVerses],
  );

  const malayalamHaystack = useMemo(
    () => createMalayalamHaystack(malayalamVerses),
    [malayalamVerses],
  );

  const results =
    language === "english"
      ? searchEnglish(englishVerses, englishHaystack, query)
      : searchMalayalam(malayalamVerses, malayalamHaystack, query);

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="bible-header">
          <h1 className="text-3xl font-semibold tracking-tight">
            Search Verses
          </h1>

          <p className="mt-1 text-lg">
            Search the Bible by verse text or reference.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          {/* Back / Home */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-white/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover)"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>

          {/* Language toggle */}
          <div className="flex w-fit rounded-xl border border-(--bible-gold)/40 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setLanguage("english")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                language === "english"
                  ? "bg-(--bible-header-text) text-[#19345f] shadow-sm"
                  : "bible-header-control hover:bg-(--bible-header-control-hover)"
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setLanguage("malayalam")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                language === "malayalam"
                  ? "bg-(--bible-header-text) text-[#19345f] shadow-sm"
                  : "bible-header-control hover:bg-(--bible-header-control-hover)"
              }`}
            >
              Malayalam
            </button>
          </div>
        </div>

        <div className="mt-5">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              language === "english"
                ? "Search English verses..."
                : "Search Malayalam verses..."
            }
            className="w-full rounded-xl border border-(--bible-gold)/40 bg-(--bible-card-bg) px-4 py-3 text-(--bible-card-text) outline-none placeholder:text-(--bible-card-text)/50 focus:border-(--bible-gold) focus:ring-2 focus:ring-(--bible-gold)/20"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            {results.map(({ verse, ranges }) => (
              <div
                key={verse.code}
                className="bible-verse-card rounded-xl border p-4 shadow-sm"
              >
                <p
                  className={`bible-verse-text leading-relaxed ${
                    language === "malayalam" ? "font-anek" : "font-medium"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatBibleText(verse.text, ranges),
                  }}
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p
                    className={`bible-verse-meta text-sm ${
                      language === "malayalam" ? "font-anek" : "font-medium"
                    }`}
                  >
                    {language === "english"
                      ? `${verse.book} ${verse.chapter}:${verse.verse}`
                      : `${MALAYALAM_BOOK_NAMES[verse.bookId!]} ${verse.chapter}:${verse.verse}`}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVerse({
                        verseCode: verse.code,
                        language,
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-(--bible-gold)/70 bg-(--bible-gold)/10 px-3 py-1.5 text-sm font-medium text-(--bible-card-meta) transition hover:bg-(--bible-gold)/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="mt-8 rounded-xl border border-(--bible-gold)/30 bg-white/5 px-4 py-8 text-center">
            <p className="bible-header-control text-sm">
              {language === "malayalam" && /^[A-Za-z\s]+$/.test(query.trim())
                ? "Enter the complete English book name to search Malayalam verses."
                : "No verses found."}
            </p>
          </div>
        )}
      </div>

      {selectedVerse && (
        <DeckPickerPopup
          decks={decks}
          onClose={() => setSelectedVerse(null)}
          onAdd={async (deckId) => {
            try {
              await addVerseToDeck(
                deckId,
                selectedVerse.verseCode,
                selectedVerse.language,
              );

              setSelectedVerse(null);
            } catch (error) {
              console.error("Failed to add verse to deck:", error);
              setSelectedVerse(null);
            }
          }}
        />
      )}
    </main>
  );
}
