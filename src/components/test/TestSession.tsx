import { useState } from "react";

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

  if (verses.length === 0) {
    onFinish();
    return null;
  }

  const currentVerse = verses[currentVerseIndex];
  const isLastVerse = currentVerseIndex === verses.length - 1;

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
  };

  const progress =
    ((currentVerseIndex + (revealed ? 1 : 0)) / verses.length) * 100;

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <button
        type="button"
        onClick={handleCardTap}
        className="group relative flex aspect-square w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--bible-gold)]/25 bg-[var(--bible-card-bg)] p-7 text-left shadow-2xl transition-transform duration-300 active:scale-[0.985] sm:rounded-[2.5rem] sm:p-10"
      >
        {/* Reference */}
        <div className="absolute inset-x-0 top-0 flex justify-center pt-7 sm:pt-9">
          <span
            className={`text-sm font-semibold tracking-wide text-[var(--bible-card-meta)] sm:text-base ${
              currentVerse.language === "malayalam" ? "font-anek" : ""
            }`}
          >
            {currentVerse.reference}
          </span>
        </div>

        {!revealed ? (
          <span className="text-sm font-medium tracking-wide text-[var(--bible-card-text)]/50 transition-opacity group-hover:text-[var(--bible-card-text)]/70">
            Tap to reveal
          </span>
        ) : (
          <div
            className="flex max-h-full w-full items-center justify-center overflow-y-auto px-2 pt-8"
            style={{
              scrollbarWidth: "none",
            }}
          >
            <p
              className={`bible-verse-text w-full text-center leading-snug tracking-[-0.01em] ${
                currentVerse.language === "malayalam" ? "font-anek" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: currentVerse.text,
              }}
            />
          </div>
        )}
      </button>

      {/* Progress */}
      <div className="mt-7 w-full max-w-[560px] px-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bible-header-text)]/10">
          <div
            className="h-full rounded-full bg-[var(--bible-gold)] transition-all duration-500"
            style={{
              width: `${Math.max(progress, 3)}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
