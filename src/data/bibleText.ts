import uFuzzy from "@leeoniya/ufuzzy";

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
