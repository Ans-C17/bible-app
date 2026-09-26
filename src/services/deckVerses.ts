// this is where react component talks to deckVerses table

import { supabase } from "./supabase";

export async function addVerseToDeck(
  deckId: string,
  verseCode: string,
  language: string,
) {
  const { data, error } = await supabase.from("deck_verses").insert({
    deck_id: deckId,
    verse_code: verseCode,
    language,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getDeckVerses(deckId: string) {
  const { data, error } = await supabase
    .from("deck_verses")
    .select("*")
    .eq("deck_id", deckId)
    .order("added_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getDeckVersesForManyDecks(deckIds: string[]) {
  const { data, error } = await supabase
    .from("deck_verses")
    .select("*")
    .in("deck_id", deckIds)
    .order("added_at", { ascending: true });

  if (error) throw error;
  return data;
}
