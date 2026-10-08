import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "@/components/LoadingState";
import { useBible } from "@/context/BibleContext";
import { ArrowLeft } from "lucide-react";
import { getMyDecks, getMainDeck } from "@/services/decks";
import {
  getDeckVerses,
  getDeckVersesForManyDecks,
} from "@/services/deckVerses";
import TestSession from "@/components/test/TestSession";
import TestComplete from "@/components/test/TestComplete";
import TestModeSelection from "@/components/test/TestModeSelection";
import MainDeckSelection from "@/components/test/MainDeckSelection";
import StudyDeckSelection from "@/components/test/StudyDeckSelection";
import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";
import { formatBibleText } from "@/data/bibleText";
import { getReviewStates } from "@/services/reviewStates";
import MainDeckTestSession from "@/components/test/MainDeckTestSession";
import ActiveRecallComplete from "@/components/test/ActiveRecallComplete";

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

  const [testType, setTestType] = useState<"main" | "study" | null>(null);

  const [testVerses, setTestVerses] = useState<TestVerse[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testDuration, setTestDuration] = useState(0);
  const [activeRecallStats, setActiveRecallStats] = useState({
    forgotCount: 0,
    hardCount: 0,
    goodCount: 0,
    easyCount: 0,
  });

  const [decks, setDecks] = useState<Deck[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);
  const [decksError, setDecksError] = useState(false);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [mainDeckEmpty, setMainDeckEmpty] = useState(false);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await getMyDecks();
        setDecks(data);
      } catch (error) {
        console.error("Failed to load decks:", error);
        setDecksError(true);
      } finally {
        setDecksLoading(false);
      }
    };

    loadDecks();
  }, []);

  const studyDecks = decks.filter((deck) => !deck.is_default);

  const handleStartTest = async () => {
    if (selectedDeckIds.length === 0) return;
    setTestType("study");

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
      setTestCompleted(false);
      setTestDuration(0);
      setTestStartTime(Date.now());
      setTestStarted(true);
    } catch (error) {
      console.error("Failed to load test verses:", error);
    }
  };

  const handleStartMainTest = async () => {
    setTestType("main");

    try {
      const mainDeck = await getMainDeck();
      const verses = await getDeckVerses(mainDeck.id);

      const reviewStates = await getReviewStates(
        verses.map((verse) => ({
          verseCode: verse.verse_code,
          language: verse.language,
        })),
      );

      const reviewStateMap = new Map(
        reviewStates.map((state) => [
          `${state.verse_code}-${state.language}`,
          state,
        ]),
      );

      const activeVerses = verses.filter((verse) => {
        const state = reviewStateMap.get(
          `${verse.verse_code}-${verse.language}`,
        );

        // No review state = brand-new verse
        if (!state) {
          return true;
        }

        // Existing state = include only if due
        return new Date(state.due_at) <= new Date();
      });

      const testVerses = activeVerses
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

      if (testVerses.length === 0) {
        setMainDeckEmpty(true);
        setTestStarted(false);
        return;
      }

      setMainDeckEmpty(false);
      setTestVerses(testVerses);
      setTestCompleted(false);
      setTestDuration(0);
      setTestStartTime(Date.now());
      setTestStarted(true);
    } catch (error) {
      console.error("Failed to load Main Deck test:", error);
    }
  };

  const handleStartMainReviewAll = async () => {
    setTestType("main");

    try {
      const mainDeck = await getMainDeck();
      const verses = await getDeckVerses(mainDeck.id);

      const testVerses = verses
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
      setTestCompleted(false);
      setTestDuration(0);
      setTestStartTime(Date.now());
      setTestStarted(true);
    } catch (error) {
      console.error("Failed to load Main Deck review:", error);
    }
  };

  const handleTestFinish = (stats?: {
    forgotCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
  }) => {
    if (testStartTime !== null) {
      const duration = Math.floor((Date.now() - testStartTime) / 1000);

      setTestDuration(duration);
    }

    if (stats) {
      setActiveRecallStats(stats);
    }

    setTestStarted(false);
    setTestCompleted(true);
  };

  const handleTestAgain = () => {
    setTestCompleted(false);
    setTestDuration(0);
    setTestStartTime(Date.now());
    setTestStarted(true);
  };

  const handleDone = () => {
    setTestCompleted(false);
    setTestStarted(false);
    setTestDuration(0);
    setTestStartTime(null);
    setMainReviewMode(null);
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
    if (testCompleted) {
      handleDone();
      return;
    }

    if (testStarted) {
      setTestStarted(false);
      setMainReviewMode(null);
      setMainDeckEmpty(false);
      return;
    }

    if (mainReviewMode) {
      setMainReviewMode(null);
      setMainDeckEmpty(false);
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
          className="mb-8 inline-flex shrink-0 items-center self-start gap-2 rounded-xl border border-(--bible-gold)/40 bg-white/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover)"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {!mode && <TestModeSelection onSelect={setMode} />}

        {mode === "main" &&
          !mainReviewMode &&
          !testStarted &&
          !testCompleted && (
            <MainDeckSelection
              onSelect={(selectedMode) => {
                setMainReviewMode(selectedMode);

                if (selectedMode === "active") {
                  handleStartMainTest();
                } else {
                  handleStartMainReviewAll();
                }
              }}
            />
          )}

        {mode === "study" && !testStarted && !testCompleted && decksLoading && (
          <LoadingState message="Loading your study decks" />
        )}

        {mode === "study" &&
          !testStarted &&
          !testCompleted &&
          !decksLoading &&
          decksError && (
            <p className="mx-auto mt-8 max-w-md rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
              We could not load your study decks right now.
            </p>
          )}

        {mode === "study" &&
          !testStarted &&
          !testCompleted &&
          !decksLoading &&
          !decksError && (
            <StudyDeckSelection
              studyDecks={studyDecks}
              selectedDeckIds={selectedDeckIds}
              onToggleDeck={toggleDeck}
              onToggleAll={toggleAllDecks}
              onStartTest={handleStartTest}
            />
          )}

        {mode === "main" && mainReviewMode === "active" && mainDeckEmpty && (
          <section className="flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4">
            <div className="w-full max-w-120 rounded-[2rem] border border-(--bible-gold)/35 bg-(--bible-card-bg) px-7 py-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:px-12 sm:py-12">
              <h2 className="text-xl font-semibold text-(--bible-card-text) sm:text-2xl">
                You're all caught up
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-(--bible-page-text)/55 sm:text-base">
                There are no verses due for review right now.
              </p>
            </div>
          </section>
        )}

        {testStarted && testType === "study" && (
          <TestSession verses={testVerses} onFinish={handleTestFinish} />
        )}

        {testStarted && testType === "main" && mainReviewMode === "active" && (
          <MainDeckTestSession
            verses={testVerses}
            onFinish={handleTestFinish}
          />
        )}

        {testStarted && testType === "main" && mainReviewMode === "all" && (
          <TestSession verses={testVerses} onFinish={handleTestFinish} />
        )}

        {testCompleted && mainReviewMode === "active" && (
          <ActiveRecallComplete
            verseCount={testVerses.length}
            forgotCount={activeRecallStats.forgotCount}
            hardCount={activeRecallStats.hardCount}
            goodCount={activeRecallStats.goodCount}
            easyCount={activeRecallStats.easyCount}
            elapsedSeconds={testDuration}
            onDone={handleDone}
          />
        )}

        {testCompleted && mainReviewMode !== "active" && (
          <TestComplete
            verseCount={testVerses.length}
            deckCount={selectedDeckIds.length}
            elapsedSeconds={testDuration}
            onTestAgain={handleTestAgain}
            onDone={handleDone}
          />
        )}
      </div>
    </main>
  );
}
