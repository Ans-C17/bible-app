import { useState } from "react";

import { BookOpen } from "lucide-react";

import { getVerseFontSize } from "@/data/bibleText";
import { recordReview, type ReviewRating } from "@/services/reviewStates";

type TestVerse = {
  verse_code: string;
  language: "english" | "malayalam";
  reference: string;
  text: string;
};

type MainDeckTestSessionProps = {
  verses: TestVerse[];
  onFinish: (stats: {
    forgotCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
  }) => void;
};

export default function MainDeckTestSession({
  verses,
  onFinish,
}: MainDeckTestSessionProps) {
  const [sessionVerses, setSessionVerses] = useState(verses);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotCount, setForgotCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);

  const currentVerse = sessionVerses[currentVerseIndex];

  const isLastVerse =
    sessionVerses.length > 0 && currentVerseIndex === sessionVerses.length - 1;

  if (sessionVerses.length === 0 || !currentVerse) {
    return null;
  }

  const handleRating = async (rating: ReviewRating) => {
    if (submitting) return;

    setSubmitting(true);

    const nextForgotCount = forgotCount + (rating === "forgot" ? 1 : 0);

    const nextHardCount = hardCount + (rating === "hard" ? 1 : 0);

    const nextGoodCount = goodCount + (rating === "good" ? 1 : 0);

    const nextEasyCount = easyCount + (rating === "easy" ? 1 : 0);

    if (rating === "forgot") {
      setForgotCount(nextForgotCount);
    } else if (rating === "hard") {
      setHardCount(nextHardCount);
    } else if (rating === "good") {
      setGoodCount(nextGoodCount);
    } else {
      setEasyCount(nextEasyCount);
    }

    try {
      await recordReview(
        currentVerse.verse_code,
        currentVerse.language,
        rating,
      );

      if (rating === "forgot") {
        setSessionVerses((current) => [...current, currentVerse]);
        setCurrentVerseIndex((index) => index + 1);
        setRevealed(false);
        return;
      }

      if (isLastVerse) {
        onFinish({
          forgotCount: nextForgotCount,
          hardCount: nextHardCount,
          goodCount: nextGoodCount,
          easyCount: nextEasyCount,
        });
        return;
      }

      setCurrentVerseIndex((index) => index + 1);
      setRevealed(false);
    } catch (error) {
      console.error("Failed to record review:", error);
      alert("Failed to record review. Check the console.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress =
    ((currentVerseIndex + (revealed ? 1 : 0)) / sessionVerses.length) * 100;

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 sm:px-4">
      <div className="flex w-full max-w-[540px] flex-col items-center">
        <div className="mb-6 flex h-6 items-center justify-center sm:mb-8">
          <div className="flex items-center gap-2.5 text-(--bible-page-text)/45">
            <BookOpen
              size={16}
              strokeWidth={1.7}
              className="shrink-0 text-(--bible-gold)"
            />
            <span className="text-xs font-medium tracking-[0.12em] sm:text-sm">
              {!revealed ? "Recall the verse" : "How well did you recall it?"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!revealed) {
              setRevealed(true);
            }
          }}
          className="group relative flex min-h-[310px] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-(--bible-gold)/35 bg-(--bible-card-bg) px-7 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.985] sm:min-h-[350px] sm:rounded-[2.25rem] sm:px-14 sm:py-10"
        >
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border-[3px] border-(--bible-gold)/70 sm:inset-5 sm:rounded-[1.75rem]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-(--bible-gold)/8 blur-3xl sm:h-56 sm:w-56" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--bible-gold)/6 blur-3xl sm:h-56 sm:w-56" />

          {!revealed ? (
            <div className="relative flex flex-col items-center justify-center gap-4 text-center">
              <span
                className={`text-[clamp(1.3rem,4vw,1.8rem)] font-semibold leading-tight tracking-wide text-(--bible-card-meta) ${
                  currentVerse.language === "malayalam" ? "font-anek" : ""
                }`}
              >
                {currentVerse.reference}
              </span>

              <span className="text-xs font-medium tracking-wide text-(--bible-card-text)/40 sm:text-sm">
                ( Tap to reveal )
              </span>
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center">
              <div
                className="flex max-h-[235px] w-full items-center justify-center overflow-y-auto px-3 sm:max-h-[270px] sm:px-5"
                style={{ scrollbarWidth: "none" }}
              >
                <p
                  className={`bible-verse-text w-full text-center leading-snug tracking-[-0.01em] ${
                    currentVerse.language === "malayalam" ? "font-anek" : ""
                  }`}
                  style={{
                    fontSize: getVerseFontSize(currentVerse.text),
                    overflowWrap: "anywhere",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: currentVerse.text,
                  }}
                />
              </div>

              <span
                className={`mt-5 shrink-0 text-[clamp(0.9rem,2.5vw,1.1rem)] font-semibold tracking-wide text-(--bible-card-meta) ${
                  currentVerse.language === "malayalam" ? "font-anek" : ""
                }`}
              >
                {currentVerse.reference}
              </span>
            </div>
          )}
        </button>

        {revealed && (
          <div className="mt-6 grid w-full max-w-[480px] grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["forgot", "Forgot"],
                ["hard", "Hard"],
                ["good", "Good"],
                ["easy", "Easy"],
              ] as const
            ).map(([rating, label]) => (
              <button
                key={rating}
                type="button"
                disabled={submitting}
                onClick={() => handleRating(rating)}
                className="rounded-xl border border-(--bible-gold)/30 bg-(--bible-card-bg) px-3 py-3 text-sm font-medium text-(--bible-card-text) shadow-sm transition hover:-translate-y-0.5 hover:border-(--bible-gold)/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-9 w-full max-w-[480px] px-1 sm:mt-11">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--bible-page-text)/45">
              Progress
            </span>

            <span className="text-xs font-medium text-(--bible-page-text)/45">
              {Math.min(
                currentVerseIndex + (revealed ? 1 : 0),
                sessionVerses.length,
              )}{" "}
              of {sessionVerses.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full border border-(--bible-gold)/20 bg-(--bible-header-text)/8 p-[2px]">
            <div
              className="h-full rounded-full bg-(--bible-gold) shadow-[0_0_10px_var(--bible-gold)] transition-all duration-500"
              style={{
                width: `${Math.max(progress, 4)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
