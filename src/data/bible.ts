export type BibleVerse = {
  code: string;
  text: string;
  verse: number;
  chapter: number;

  // English
  book?: string;
  footnotes?: Record<string, string>;

  // Malayalam
  bookId?: string;
  testamentId?: string;
};

export const loadBible = async () => {
  const [englishResponse, malayalamResponse] = await Promise.all([
    fetch("/bible/parsed_english_bible.json"),
    fetch("/bible/parsed_malayalam_bible.json"),
  ]);

  const englishVerses: BibleVerse[] = await englishResponse.json();
  const malayalamVerses: BibleVerse[] = await malayalamResponse.json();

  const englishMap = new Map(englishVerses.map((verse) => [verse.code, verse]));

  const malayalamMap = new Map(
    malayalamVerses.map((verse) => [verse.code, verse]),
  );

  return {
    englishVerses,
    malayalamVerses,
    englishMap,
    malayalamMap,
  };
};
