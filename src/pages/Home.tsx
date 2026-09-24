import { useState } from "react";

import { Bell, BookOpen, CircleHelp, Moon, Sun } from "lucide-react";

import { DailyVerseCard } from "@/components/home/DailyVerseCard";
import { HomeActions } from "@/components/home/HomeActions";

import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [language, setLanguage] = useState<"english" | "malayalam">("english");

  const isLight = theme === "light";

  return (
    <main className="bible-page h-dvh overflow-hidden transition-colors duration-500">
      <div className="flex h-full w-full flex-col px-3 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <header className="mb-6 flex items-center justify-between sm:mb-8 lg:mb-10">
          <div className="bible-header flex items-center gap-2 text-sm font-medium tracking-wide sm:text-base lg:gap-3 lg:text-lg">
            <BookOpen
              className="bible-gold h-4.5 w-4.5 sm:h-5 sm:w-5 lg:h-7 lg:w-7"
              strokeWidth={1.8}
            />
            <p>Memory Bible</p>
          </div>

          <nav aria-label="Quick actions" className="flex gap-1.5 lg:gap-2">
            <button
              type="button"
              aria-label={
                isLight ? "Switch to dark mode" : "Switch to light mode"
              }
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
              className="bible-header-control flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:h-13 lg:w-13"
            >
              {isLight ? (
                <Sun className="h-4.5 w-4.5 lg:h-6 lg:w-6" strokeWidth={1.8} />
              ) : (
                <Moon className="h-4.5 w-4.5 lg:h-6 lg:w-6" strokeWidth={1.8} />
              )}
            </button>

            <button
              type="button"
              aria-label="Open tutorial"
              title="Open tutorial"
              className="bible-header-control flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:h-13 lg:w-13"
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
              className="bible-header-control flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:h-13 lg:w-13"
            >
              <Bell className="h-4.5 w-4.5 lg:h-6 lg:w-6" strokeWidth={1.8} />
            </button>
          </nav>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col justify-center">
          <DailyVerseCard language={language} />

          <section className="mt-10 sm:mt-8 lg:mt-10">
            <HomeActions language={language} onLanguageChange={setLanguage} />
          </section>
        </div>
      </div>
    </main>
  );
}
