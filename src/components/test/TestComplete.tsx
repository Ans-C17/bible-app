import { CheckCircle2, Clock3, Layers3, RotateCcw } from "lucide-react";

type TestCompleteProps = {
  verseCount: number;
  deckCount: number;
  elapsedSeconds: number;
  onTestAgain: () => void;
  onDone: () => void;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export default function TestComplete({
  verseCount,
  deckCount,
  elapsedSeconds,
  onTestAgain,
  onDone,
}: TestCompleteProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-[540px]">
        {/* Completion icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-(--bible-gold)/35 bg-(--bible-gold)/10">
            <CheckCircle2
              size={34}
              strokeWidth={1.6}
              className="text-(--bible-gold)"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="mt-2 text-3xl font-semibold text-(--bible-header-text) sm:text-4xl">
            Test complete
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm text-(--bible-header-text) sm:text-base">
            You made it through the whole set.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-9 grid grid-cols-3 overflow-hidden rounded-2xl border border-(--bible-gold)/25 bg-(--bible-card-bg) shadow-md">
          <div className="flex min-w-0 flex-col items-center px-2 py-5 sm:px-4 sm:py-6">
            <span className="text-2xl font-semibold text-(--bible-card-meta) sm:text-3xl">
              {verseCount}
            </span>

            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-(--bible-card-text)/45 sm:text-xs">
              Verses
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center border-x border-(--bible-gold)/15 px-2 py-5 sm:px-4 sm:py-6">
            <span className="text-2xl font-semibold text-(--bible-card-meta) sm:text-3xl">
              {deckCount}
            </span>

            <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-(--bible-card-text)/45 sm:text-xs">
              <Layers3 size={12} strokeWidth={1.7} />
              Decks
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center px-2 py-5 sm:px-4 sm:py-6">
            <span className="text-2xl font-semibold text-(--bible-card-meta) sm:text-3xl">
              {formatDuration(elapsedSeconds)}
            </span>

            <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-(--bible-card-text)/45 sm:text-xs">
              <Clock3 size={12} strokeWidth={1.7} />
              Time
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onTestAgain}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-(--bible-card-bg) px-5 py-3 text-sm font-medium text-(--bible-card-text) shadow-sm transition hover:-translate-y-0.5 hover:border-(--bible-gold)/60"
          >
            <RotateCcw size={17} />
            Test Again
          </button>

          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center justify-center rounded-xl bg-(--bible-gold) px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </section>
  );
}
