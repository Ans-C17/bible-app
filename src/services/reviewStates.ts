// this is where React components talk to the review_states table

import { supabase } from "./supabase";

export type ReviewState = {
  id: string;
  user_id: string;
  verse_code: string;
  language: string;
  interval: number;
  repetitions: number;
  due_at: string;
  last_reviewed_at: string | null;
};

export type ReviewRating = "forgot" | "hard" | "good" | "easy";

export async function getReviewStates(
  verses: { verseCode: string; language: string }[],
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  if (verses.length === 0) {
    return [];
  }

  const conditions = verses
    .map(
      ({ verseCode, language }) =>
        `and(verse_code.eq.${verseCode},language.eq.${language})`,
    )
    .join(",");

  const { data, error } = await supabase
    .from("review_states")
    .select("*")
    .eq("user_id", user.id)
    .or(conditions);

  if (error) {
    throw error;
  }

  return data as ReviewState[];
}

// The user just reviewed this verse and chose this rating. Update that verse's review state accordingly.
export async function recordReview(
  verseCode: string,
  language: string,
  rating: ReviewRating,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { data: currentState, error: fetchError } = await supabase
    .from("review_states")
    .select("*")
    .eq("user_id", user.id)
    .eq("verse_code", verseCode)
    .eq("language", language)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  const currentInterval = currentState?.interval ?? 0;
  const currentRepetitions = currentState?.repetitions ?? 0;

  let newInterval: number;
  let newRepetitions: number;

  switch (rating) {
    case "forgot":
      newInterval = 0;
      newRepetitions = 0;
      break;

    case "hard":
      newInterval = 1;
      newRepetitions = currentRepetitions;
      break;

    case "good": {
      const increment = 3 + currentRepetitions;
      newInterval = currentInterval + increment;
      newRepetitions = currentRepetitions + 1;
      break;
    }

    case "easy": {
      const increment = 7 + currentRepetitions * 2;
      newInterval = currentInterval + increment;
      newRepetitions = currentRepetitions + 1;
      break;
    }
  }

  const now = new Date();
  const dueAt = new Date(now);
  dueAt.setDate(dueAt.getDate() + newInterval);

  const { data, error } = await supabase
    .from("review_states")
    .upsert(
      {
        user_id: user.id,
        verse_code: verseCode,
        language,
        interval: newInterval,
        repetitions: newRepetitions,
        due_at: dueAt.toISOString(),
        last_reviewed_at: now.toISOString(),
      },
      {
        onConflict: "user_id,verse_code,language",
      },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as ReviewState;
}
