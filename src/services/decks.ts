// this is where react component talks to decks table
import { supabase } from "./supabase";

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
