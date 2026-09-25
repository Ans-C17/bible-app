// this is where react component talks to deckVerses table

import { supabase } from "./supabase";

export async function addVerseToDeck(
  deckId: string,
  verseCode: string,
  language: string,
) {
  const { data, error } = await supabase
    .from("deck_verses")
    .insert({
      deck_id: deckId,
      verse_code: verseCode,
      language,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
