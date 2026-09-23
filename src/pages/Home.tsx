import { Bell, BookOpen, CircleHelp, Moon } from "lucide-react";

import { DailyVerseCard } from "@/components/home/DailyVerseCard";
import { HomeActions } from "@/components/home/HomeActions";

export default function Home() {
  return (
    <main className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,#49679d_0%,#263650_38%,#1f2836_68%,#101722_100%)] text-[#fffaf0]">
      <div className="flex h-full w-full flex-col px-3 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <header className="mb-6 flex items-center justify-between sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-[#f5df9b]/80 sm:text-base lg:gap-3 lg:text-lg">
            <BookOpen
              className="h-4.5 w-4.5 text-[#e6bd55] sm:h-5 sm:w-5 lg:h-7 lg:w-7"
              strokeWidth={1.8}
            />
            <p>Memory Bible</p>
          </div>

          <nav aria-label="Quick actions" className="flex gap-1.5 lg:gap-2">
            <button
              type="button"
              aria-label="Switch theme"
              title="Switch theme"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#f5df9b]/70 transition-colors hover:bg-[#e6bd55]/15 hover:text-[#fffaf0] lg:h-13 lg:w-13"
            >
              <Moon className="h-4.5 w-4.5 lg:h-6 lg:w-6" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Open tutorial"
              title="Open tutorial"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#f5df9b]/70 transition-colors hover:bg-[#e6bd55]/15 hover:text-[#fffaf0] lg:h-13 lg:w-13"
            >
              <CircleHelp
                className="h-4.5 w-4.5 lg:h-6 lg:w-6"
                strokeWidth={1.8}
              />
            </button>
            <button
              type="button"
              aria-label="View notifications"
              title="View notifications"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#f5df9b]/70 transition-colors hover:bg-[#e6bd55]/15 hover:text-[#fffaf0] lg:h-13 lg:w-13"
            >
              <Bell className="h-4.5 w-4.5 lg:h-6 lg:w-6" strokeWidth={1.8} />
            </button>
          </nav>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <DailyVerseCard />

          <section className="mt-6 sm:mt-8 lg:mt-10">
            <HomeActions />
          </section>
        </div>
      </div>
    </main>
  );
}
