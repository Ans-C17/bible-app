import uFuzzy from "@leeoniya/ufuzzy";

import type { BibleVerse } from "./bible";

import { MALAYALAM_BOOK_NAMES } from "./malayalamBookNames";
import { ENGLISH_TO_MALAYALAM_BOOK_NAMES } from "./englishToMalayalamBookNameMappings";

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

const MALAYALAM_CHILLU_FOLDS: Record<string, string> = {
  "\u0D7A": "\u0D23\u0D4D",
  "\u0D7B": "\u0D28\u0D4D",
  "\u0D7C": "\u0D30\u0D4D",
  "\u0D7D": "\u0D32\u0D4D",
  "\u0D7E": "\u0D33\u0D4D",
  "\u0D7F": "\u0D15\u0D4D",
};

const normalizeMalayalamSearchText = (value: string) =>
  value
    .normalize("NFKC")
    .replace(
      /[\u0D7A-\u0D7F]/g,
      (character) => MALAYALAM_CHILLU_FOLDS[character],
    )
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();

export const createMalayalamHaystack = (verses: BibleVerse[]) => {
  return verses.map((verse) =>
    normalizeMalayalamSearchText(
      `${verse.text} | ${MALAYALAM_BOOK_NAMES[verse.bookId!]} ${verse.chapter}:${verse.verse}`,
    ),
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

const normalizeBookName = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();

const findMalayalamBookName = (bookQuery: string) => {
  const normalizedBookQuery = normalizeBookName(bookQuery);

  return (
    Object.entries(ENGLISH_TO_MALAYALAM_BOOK_NAMES).find(
      ([englishBook]) => normalizeBookName(englishBook) === normalizedBookQuery,
    )?.[1] ??
    Object.values(MALAYALAM_BOOK_NAMES).find(
      (malayalamBook) =>
        normalizeBookName(malayalamBook) === normalizedBookQuery,
    )
  );
};

const searchMalayalamReference = (verses: BibleVerse[], query: string) => {
  const match = query.trim().match(/^(.+?)\s+(\d+)\s*(?::\s*(\d+))?$/);

  if (!match) return null;

  const [, bookQuery, chapterString, verseString] = match;
  const chapter = Number(chapterString);
  const verseNumber = verseString ? Number(verseString) : undefined;

  const targetMalayalamBook = findMalayalamBookName(bookQuery);

  if (!targetMalayalamBook) return null;

  return verses
    .filter((verse) => {
      if (!verse.bookId) return false;

      return (
        normalizeBookName(MALAYALAM_BOOK_NAMES[verse.bookId] ?? "") ===
          normalizeBookName(targetMalayalamBook) &&
        verse.chapter === chapter &&
        (verseNumber === undefined || verse.verse === verseNumber)
      );
    })
    .map((verse) => ({
      verse,
      ranges: undefined,
    }));
};

const searchMalayalamBook = (verses: BibleVerse[], query: string) => {
  const targetMalayalamBook = findMalayalamBookName(query);

  if (!targetMalayalamBook) return null;

  return verses
    .filter(
      (verse) =>
        verse.bookId &&
        normalizeBookName(MALAYALAM_BOOK_NAMES[verse.bookId] ?? "") ===
          normalizeBookName(targetMalayalamBook),
    )
    .map((verse) => ({
      verse,
      ranges: undefined,
    }));
};

export const searchMalayalam = (
  verses: BibleVerse[],
  haystack: string[],
  query: string,
  maxResults = 100,
) => {
  const normalizedQuery = normalizeMalayalamSearchText(query);

  if (normalizedQuery.length === 0) return [];

  const referenceResults = searchMalayalamReference(verses, query);

  if (referenceResults !== null) {
    return referenceResults.slice(0, maxResults);
  }

  const bookResults = searchMalayalamBook(verses, query.trim());

  if (bookResults !== null) {
    return bookResults.slice(0, maxResults);
  }

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
