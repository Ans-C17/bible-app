import { useEffect, useState } from "react";
import { MousePointerClick, BookOpen } from "lucide-react";
import { getVerseFontSize } from "@/data/bibleText";

type TestVerse = {
  verse_code: string;
  language: "english" | "malayalam";
  reference: string;
  text: string;
};

type TestSessionProps = {
  verses: TestVerse[];
  onFinish: () => void;
};

export default function TestSession({ verses, onFinish }: TestSessionProps) {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const currentVerse = verses[currentVerseIndex];
  const isLastVerse =
    verses.length > 0 && currentVerseIndex === verses.length - 1;

  useEffect(() => {
    if (verses.length === 0) {
      onFinish();
    }
  }, [verses.length, onFinish]);

  useEffect(() => {
    if (!revealed) {
      setCanContinue(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCanContinue(true);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [revealed, currentVerseIndex]);

  if (verses.length === 0 || !currentVerse) {
    return null;
  }

  const handleCardTap = () => {
    if (!revealed) {
      setRevealed(true);
      return;
    }

    if (isLastVerse) {
      onFinish();
      return;
    }

    setCurrentVerseIndex((index) => index + 1);
    setRevealed(false);
    setCanContinue(false);
  };

  const progress =
    ((currentVerseIndex + (revealed ? 1 : 0)) / verses.length) * 100;

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 sm:px-4">
      <div className="flex w-full max-w-[540px] flex-col items-center">
        {/* Contextual instruction */}
        <div className="mb-6 flex h-6 items-center justify-center sm:mb-8">
          {!revealed ? (
            <div className="flex items-center gap-2.5 text-(--bible-page-text)/45">
              <BookOpen
                size={16}
                strokeWidth={1.7}
                className="shrink-0 text-(--bible-gold)"
              />

              <span className="text-xs font-medium tracking-[0.12em] sm:text-sm">
                Recall the verse
              </span>
            </div>
          ) : canContinue ? (
            <div className="flex items-center gap-2 text-(--bible-page-text)/45">
              <MousePointerClick
                size={15}
                strokeWidth={1.8}
                className="shrink-0 text-(--bible-gold)"
              />

              <span className="text-xs font-medium tracking-[0.12em] sm:text-sm">
                {isLastVerse ? "Tap to finish" : "Tap for next"}
              </span>
            </div>
          ) : (
            <span className="text-xs text-(--bible-page-text)/25 sm:text-sm" />
          )}
        </div>

        {/* Card */}
        <button
          type="button"
          onClick={handleCardTap}
          className="group relative flex min-h-[310px] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-(--bible-gold)/35 bg-(--bible-card-bg) px-7 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.985] sm:min-h-[350px] sm:rounded-[2.25rem] sm:px-14 sm:py-10"
        >
          {/* Thick inner frame */}
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border-[3px] border-(--bible-gold)/70 sm:inset-5 sm:rounded-[1.75rem]" />

          {/* Ambient light */}
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
              {/* Verse */}
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

              {/* Reference */}
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

        {/* Progress */}
        <div className="mt-9 w-full max-w-[480px] px-1 sm:mt-11">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--bible-page-text)/45">
              Progress
            </span>

            <span className="text-xs font-medium text-(--bible-page-text)/45">
              {Math.min(currentVerseIndex + (revealed ? 1 : 0), verses.length)}{" "}
              of {verses.length}
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
