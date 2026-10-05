import uFuzzy from "@leeoniya/ufuzzy";

export const getVerseFontSize = (text: string) => {
  const visibleTextLength = text.replace(/<[^>]*>/g, "").length;

  if (visibleTextLength > 900) {
    return "clamp(0.52rem, 1.25vw, 0.68rem)";
  }

  if (visibleTextLength > 700) {
    return "clamp(0.6rem, 1.45vw, 0.78rem)";
  }

  if (visibleTextLength > 500) {
    return "clamp(0.68rem, 1.65vw, 0.88rem)";
  }

  if (visibleTextLength > 350) {
    return "clamp(0.78rem, 1.9vw, 0.98rem)";
  }

  if (visibleTextLength > 220) {
    return "clamp(0.88rem, 2.1vw, 1.08rem)";
  }

  return "clamp(0.98rem, 2.5vw, 1.2rem)";
};

export const formatBibleText = (text: string, ranges?: number[]) => {
  let h = text;

  if (ranges) {
    const verseRanges: number[] = [];

    for (let i = 0; i < ranges.length; i += 2) {
      const start = ranges[i];
      const end = ranges[i + 1];

      // Only highlight ranges that are completely inside verse.text.
      // uFuzzy ranges are based on the full haystack:
      // verse.text + " | " + reference
      if (start >= 0 && end <= text.length && start < end) {
        verseRanges.push(start, end);
      }
    }

    if (verseRanges.length > 0) {
      h = uFuzzy.highlight(text, verseRanges);
    }
  }

  h = h.replace(/<\/mark>\s+<mark>/g, " ");

  // Remove headings like ||Gabriel Interprets the Vision||
  h = h.replace(/\|\|.*?\|\|/g, "");

  // Remove footnote markers like [^a]*
  h = h.replace(/\[\^\w\]/g, "");

  // Remove backslashes
  h = h.replace(/\\/g, "");

  return h;
};
