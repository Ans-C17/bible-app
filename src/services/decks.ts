// this is where react component talks to decks table
import { supabase } from "./supabase";

// show all decks of yours
export async function getMyDecks() {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// make a deck
export async function createDeck(name: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      name,
      is_default: false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// get any decks metadata, i dont think this is needed
export async function getDeck(deckId: string) {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
