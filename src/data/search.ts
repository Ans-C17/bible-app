import uFuzzy from "@leeoniya/ufuzzy";

import type { BibleVerse } from "./bible";

import { MALAYALAM_BOOK_NAMES } from "./malayalamBookNames";

export const englishUFuzzy = new uFuzzy({
  intraMode: 1,
  intraSub: 1,
  intraTrn: 1,
  intraDel: 1,
  intraIns: 1,
});

export const createEnglishHaystack = (verses: BibleVerse[]) => {
  return verses.map((verse) => {
    const text = verse.text
      // Hide headings from search while preserving character positions
      .replace(/\|\|.*?\|\|/g, (match) => " ".repeat(match.length))
      // Hide footnote markers while preserving character positions
      .replace(/\[\^\w\]/g, (match) => " ".repeat(match.length))
      // Hide backslashes while preserving character positions
      .replace(/\\/g, " ");

    return `${text} | ${verse.book} ${verse.chapter}:${verse.verse}`;
  });
};

// TODO: add malayalam range query for highlighting

export const createMalayalamHaystack = (verses: BibleVerse[]) => {
  return verses.map(
    (verse) =>
      `${verse.text} | ${MALAYALAM_BOOK_NAMES[verse.bookId!]} ${verse.chapter}:${verse.verse}`,
  );
};

export const searchEnglish = (
  verses: BibleVerse[],
  haystack: string[],
  query: string,
  maxResults = 100,
) => {
  if (query.trim().length === 0) return [];

  const idxs = englishUFuzzy.filter(haystack, query);

  if (!idxs) return [];

  const info = englishUFuzzy.info(idxs, haystack, query);
  const order = englishUFuzzy.sort(info, haystack, query);

  return order.slice(0, maxResults).map((o) => ({
    verse: verses[info.idx[o]],
    ranges: info.ranges[o],
  }));
};

export const searchMalayalam = (
  verses: BibleVerse[],
  haystack: string[],
  query: string,
  maxResults = 100,
) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (normalizedQuery.length === 0) return [];

  return verses
    .map((verse, index) => ({
      verse,
      index,
    }))
    .filter(({ index }) =>
      haystack[index].toLocaleLowerCase().includes(normalizedQuery),
    )
    .slice(0, maxResults)
    .map(({ verse }) => ({
      verse,
      ranges: undefined,
    }));
};
