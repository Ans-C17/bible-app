"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function DailyVerseCard() {
  const verse =
    "നിങ്ങള്‍ ആദ്യം അവിടുത്തെ രാജ്യവും അവിടുത്തെനീതിയും അന്വേഷിക്കുക. അതോടൊപ്പം മറ്റുള്ളവയെല്ലാം നിങ്ങള്‍ക്കു ലഭിക്കും.";

  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(22);

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

    // refit once the real webfont has swapped in — the first measurement
    // above happens against the fallback font's metrics, so it can be wrong
    document.fonts?.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [verse]);

  return (
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
          className="flex min-h-0 items-center justify-center overflow-y-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <p
            ref={textRef}
            style={{ fontSize }}
            className="bible-verse-text text-center font-anek leading-snug tracking-[-0.01em]"
          >
            "{verse}"
          </p>
        </div>

        <div className="flex justify-end pb-3 sm:pb-4 lg:pb-5">
          <p className="bible-verse-meta text-xs font-bold tracking-wide underline decoration-[#d4a93a]/60 underline-offset-2 sm:text-sm lg:text-base">
            Jeremiah 29:11
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
