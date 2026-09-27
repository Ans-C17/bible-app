type ActiveRecallCompleteProps = {
  verseCount: number;
  forgotCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  elapsedSeconds: number;
  onDone: () => void;
};

export default function ActiveRecallComplete({
  verseCount,
  forgotCount,
  hardCount,
  goodCount,
  easyCount,
  elapsedSeconds,
  onDone,
}: ActiveRecallCompleteProps) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <section className="flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <div className="w-full max-w-[500px] rounded-[1.75rem] border border-(--bible-gold)/35 bg-(--bible-card-bg) px-5 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:rounded-[2rem] sm:px-9 sm:py-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--bible-card-meta) sm:text-xs">
            Active recall
          </p>

          <h2 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-(--bible-card-text) sm:text-3xl">
            Review complete
          </h2>
        </div>

        {/* Main stat */}
        <div className="mt-7 text-center sm:mt-8">
          <p className="text-5xl font-bold tracking-tight text-(--bible-gold) sm:text-[3.25rem]">
            {verseCount}
          </p>

          <p className="mt-1 text-sm font-medium text-(--bible-card-text)/55">
            verses reviewed
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-2xl border-2 border-(--bible-card-text)/15 sm:mt-8">
          <div className="min-w-0 border-r-2 border-(--bible-card-text)/15 px-1.5 py-3.5 text-center sm:px-2 sm:py-4">
            <p className="text-lg font-semibold text-(--bible-card-text) sm:text-xl">
              {forgotCount}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-(--bible-card-text)/45 sm:text-[10px] sm:tracking-[0.12em]">
              Forgot
            </p>
          </div>

          <div className="min-w-0 border-r-2 border-(--bible-card-text)/15 px-1.5 py-3.5 text-center sm:px-2 sm:py-4">
            <p className="text-lg font-semibold text-(--bible-card-text) sm:text-xl">
              {hardCount}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-(--bible-card-text)/45 sm:text-[10px] sm:tracking-[0.12em]">
              Hard
            </p>
          </div>

          <div className="min-w-0 border-r-2 border-(--bible-card-text)/15 px-1.5 py-3.5 text-center sm:px-2 sm:py-4">
            <p className="text-lg font-semibold text-(--bible-card-text) sm:text-xl">
              {goodCount}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-(--bible-card-text)/45 sm:text-[10px] sm:tracking-[0.12em]">
              Good
            </p>
          </div>

          <div className="min-w-0 px-1.5 py-3.5 text-center sm:px-2 sm:py-4">
            <p className="text-lg font-semibold text-(--bible-card-text) sm:text-xl">
              {easyCount}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-(--bible-card-text)/45 sm:text-[10px] sm:tracking-[0.12em]">
              Easy
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:mt-7">
          <span className="text-sm text-(--bible-card-text)/45">
            Time spent
          </span>

          <span className="text-sm font-semibold text-(--bible-card-text)">
            {minutes}m {seconds.toString().padStart(2, "0")}s
          </span>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={onDone}
          className="mt-7 w-full rounded-xl bg-(--bible-gold) px-4 py-3 text-sm font-semibold text-(--bible-page-bg) transition hover:opacity-90 active:scale-[0.99] sm:mt-8"
        >
          Done
        </button>
      </div>
    </section>
  );
}
