import { ArrowRight, BookOpen, Brain } from "lucide-react";

type MainReviewMode = "active" | "all";

type MainDeckSelectionProps = {
  onSelect: (mode: MainReviewMode) => void;
};

export default function MainDeckSelection({
  onSelect,
}: MainDeckSelectionProps) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--bible-gold)">
          Main Deck
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-(--bible-header-text) sm:text-4xl">
          Choose your practice
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm text-(--bible-header-text) sm:text-base">
          Practice your verses using your memorization schedule or review them
          all
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-5">
        {/* Active Recall */}
        <button
          type="button"
          onClick={() => onSelect("active")}
          className="group aspect-square rounded-3xl border border-(--bible-gold)/25 bg-(--bible-card-bg) p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-(--bible-gold)/70 hover:shadow-xl sm:p-7"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--bible-gold)/30 bg-(--bible-gold)/10 text-(--bible-gold) sm:h-14 sm:w-14">
                <Brain size={21} strokeWidth={1.7} className="sm:h-6 sm:w-6" />
              </div>

              <ArrowRight
                size={18}
                className="text-(--bible-card-text)/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-(--bible-gold)"
              />
            </div>

            <div className="mt-auto">
              <h2 className="text-lg font-semibold text-(--bible-card-text) sm:text-2xl">
                Active Recall
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-(--bible-card-text)/55 sm:max-w-[230px] sm:text-sm">
                Follow your spaced-repetition schedule
              </p>
            </div>
          </div>
        </button>

        {/* Review All */}
        <button
          type="button"
          onClick={() => onSelect("all")}
          className="group aspect-square rounded-3xl border border-(--bible-gold)/25 bg-(--bible-card-bg) p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-(--bible-gold)/70 hover:shadow-xl sm:p-7"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--bible-gold)/30 bg-(--bible-gold)/10 text-(--bible-gold) sm:h-14 sm:w-14">
                <BookOpen
                  size={21}
                  strokeWidth={1.7}
                  className="sm:h-6 sm:w-6"
                />
              </div>

              <ArrowRight
                size={18}
                className="text-(--bible-card-text)/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-(--bible-gold)"
              />
            </div>

            <div className="mt-auto">
              <h2 className="text-lg font-semibold text-(--bible-card-text) sm:text-2xl">
                Review All
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-(--bible-card-text)/55 sm:max-w-[230px] sm:text-sm">
                Review every verse in your Main Deck
              </p>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
