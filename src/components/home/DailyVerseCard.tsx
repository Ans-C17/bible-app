"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";

import { Plus, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useBible } from "@/context/BibleContext";

import { MALAYALAM_BOOK_NAMES } from "@/data/malayalamBookNames";

import { formatBibleText } from "@/data/bibleText";

import { getMyDecks } from "@/services/decks";

import { addVerseToDeck } from "@/services/deckVerses";

import DeckPickerPopup from "@/components/DeckPickerPopup";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type DailyVerseCardProps = {
  language: "english" | "malayalam";
};

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export function DailyVerseCard({ language }: DailyVerseCardProps) {
  const { englishMap, malayalamMap } = useBible();

  const [dailyVerseCodes, setDailyVerseCodes] = useState<string[]>([]);

  const [decks, setDecks] = useState<Deck[]>([]);

  const [showDeckPicker, setShowDeckPicker] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const [fontSize, setFontSize] = useState(22);

  useEffect(() => {
    fetch("/daily-verses/daily_verses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load daily verses.");
        }

        return response.json();
      })
      .then((codes: string[]) => {
        setDailyVerseCodes(codes);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getMyDecks()
      .then(setDecks)
      .catch((error) => {
        console.error("Failed to load decks:", error);
      });
  }, []);

  const dailyVerse = (() => {
    if (dailyVerseCodes.length === 0 || englishMap.size === 0) {
      return null;
    }

    const startDate = new Date(2026, 0, 1);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const index =
      ((daysSinceStart % dailyVerseCodes.length) + dailyVerseCodes.length) %
      dailyVerseCodes.length;

    const code = dailyVerseCodes[index];

    return language === "english"
      ? (englishMap.get(code) ?? null)
      : (malayalamMap.get(code) ?? null);
  })();

  const verse = dailyVerse?.text ?? "";

  const reference = dailyVerse
    ? `${language === "english" ? dailyVerse.book : MALAYALAM_BOOK_NAMES[dailyVerse.bookId!]} ${dailyVerse.chapter}:${dailyVerse.verse}`
    : "";

  useIsomorphicLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;

    if (!box || !text) return;

    const MAX = 22;
    const MIN = 9;
    const STEP = 0.5;

    const fit = () => {
      let size = MAX;

      text.style.fontSize = `${size}px`;

      while (size > MIN && text.scrollHeight > box.clientHeight) {
        size -= STEP;
        text.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    fit();

    document.fonts?.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(box);

    return () => ro.disconnect();
  }, [verse]);

  if (!dailyVerse) return null;

  return (
    <>
      <Card className="bible-verse-card relative h-64 overflow-hidden rounded-[2rem] border-2 shadow-[0_0_45px_-15px_rgba(212,169,58,0.45)] sm:h-72 lg:h-80">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

        <CardContent className="relative grid h-full grid-rows-[auto_minmax(0,1fr)_auto] px-5 py-0 sm:px-7 lg:px-8">
          <div className="pt-3 sm:pt-4 lg:pt-5">
            <div className="bible-verse-meta flex items-center gap-2 text-xs font-medium sm:text-sm lg:text-base">
              <Sparkles className="h-4 w-4" />
              Today's Verse
            </div>
          </div>

          <div
            ref={boxRef}
            className="flex min-h-0 items-center justify-center overflow-y-auto py-2 [scrollbar-none] [&::-webkit-scrollbar]:hidden"
          >
            <p
              ref={textRef}
              style={{ fontSize }}
              className="bible-verse-text text-center font-anek leading-snug tracking-[-0.01em]"
              dangerouslySetInnerHTML={{
                __html: formatBibleText(verse),
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 lg:pb-5">
            <button
              type="button"
              onClick={() => setShowDeckPicker(true)}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-(--bible-card-meta)/70 transition hover:text-(--bible-card-meta) sm:text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Add to Deck
            </button>

            <p
              className={`${
                language === "english" ? "font-medium" : "font-anek"
              } bible-verse-meta text-right text-xs font-semibold tracking-wide underline decoration-[#d4a93a]/60 underline-offset-2 sm:text-sm lg:text-base`}
            >
              {reference}
            </p>
          </div>
        </CardContent>
      </Card>

      {showDeckPicker && (
        <DeckPickerPopup
          decks={decks}
          onClose={() => setShowDeckPicker(false)}
          onAdd={async (deckId) => {
            try {
              await addVerseToDeck(deckId, dailyVerse.code, language);

              setShowDeckPicker(false);
            } catch (error) {
              console.error("Failed to add verse to deck:", error);
              setShowDeckPicker(false);
            }
          }}
        />
      )}
    </>
  );
}
