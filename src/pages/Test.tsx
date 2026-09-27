import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBible } from "@/context/BibleContext";
import { ArrowLeft } from "lucide-react";

import { getMyDecks } from "@/services/decks";
import { getDeckVersesForManyDecks } from "@/services/deckVerses";

import TestSession from "@/components/test/TestSession";
import TestModeSelection from "@/components/test/TestModeSelection";
import MainDeckSelection from "@/components/test/MainDeckSelection";
import StudyDeckSelection from "@/components/test/StudyDeckSelection";

import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";
import { formatBibleText } from "@/data/bibleText";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

type TestVerse = {
  verse_code: string;
  language: "english" | "malayalam";
  reference: string;
  text: string;
};

type TestMode = "main" | "study" | null;
type MainReviewMode = "active" | "all" | null;

export default function Test() {
  const navigate = useNavigate();
  const { englishMap, malayalamMap } = useBible();

  const [mode, setMode] = useState<TestMode>(null);
  const [mainReviewMode, setMainReviewMode] = useState<MainReviewMode>(null);

  const [testVerses, setTestVerses] = useState<TestVerse[]>([]);
  const [testStarted, setTestStarted] = useState(false);

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

  const studyDecks = decks.filter((deck) => !deck.is_default);

  const handleStartTest = async () => {
    if (selectedDeckIds.length === 0) return;

    try {
      const verses = await getDeckVersesForManyDecks(selectedDeckIds);

      const uniqueVerses = Array.from(
        new Map(
          verses.map((verse) => [
            `${verse.verse_code}-${verse.language}`,
            verse,
          ]),
        ).values(),
      );

      const testVerses = uniqueVerses
        .map((verse) => {
          const bibleVerse =
            verse.language === "english"
              ? englishMap.get(verse.verse_code)
              : malayalamMap.get(verse.verse_code);

          if (!bibleVerse) {
            return null;
          }

          const reference =
            verse.language === "english"
              ? `${bibleVerse.book} ${bibleVerse.chapter}:${bibleVerse.verse}`
              : `${MALAYALAM_BOOK_NAMES[bibleVerse.bookId!]} ${bibleVerse.chapter}:${bibleVerse.verse}`;

          return {
            verse_code: verse.verse_code,
            language: verse.language as "english" | "malayalam",
            reference,
            text: formatBibleText(bibleVerse.text),
          };
        })
        .filter((verse): verse is TestVerse => verse !== null);

      setTestVerses(testVerses);
      setTestStarted(true);
    } catch (error) {
      console.error("Failed to load test verses:", error);
    }
  };

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds((current) =>
      current.includes(deckId)
        ? current.filter((id) => id !== deckId)
        : [...current, deckId],
    );
  };

  const toggleAllDecks = () => {
    setSelectedDeckIds((current) =>
      current.length === studyDecks.length
        ? []
        : studyDecks.map((deck) => deck.id),
    );
  };

  const handleBack = () => {
    if (testStarted) {
      setTestStarted(false);
      return;
    }

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
    <main className="flex h-dvh flex-col overflow-hidden bg-(--bible-page-bg) px-4 py-6 text-(--bible-page-text) sm:py-8">
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex items-center self-start shrink-0 gap-2 rounded-xl border border-(--bible-gold)/40 bg-black/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover) dark:bg-white/5"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {!mode && <TestModeSelection onSelect={setMode} />}

        {mode === "main" && !mainReviewMode && !testStarted && (
          <MainDeckSelection onSelect={setMainReviewMode} />
        )}

        {mode === "study" && !testStarted && (
          <StudyDeckSelection
            studyDecks={studyDecks}
            selectedDeckIds={selectedDeckIds}
            onToggleDeck={toggleDeck}
            onToggleAll={toggleAllDecks}
            onStartTest={handleStartTest}
          />
        )}

        {testStarted && (
          <TestSession
            verses={testVerses}
            onFinish={() => setTestStarted(false)}
          />
        )}
      </div>

      {/* <p
        className="mt-6 text-center text-xs"
        style={{
          color: "var(--bible-page-text)",
          opacity: 0.5,
        }}
      >
        When they call to me, I will answer them;
      </p> */}
    </main>
  );
}
