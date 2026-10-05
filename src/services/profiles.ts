import { supabase } from "./supabase";

export type Profile = {
  user_id: string;
  name: string;
  created_at: string;
};

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  return user;
}

export async function getMyProfile() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Profile | null;
}

export async function upsertMyProfile(name: string) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        name: name.trim(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}

export async function ensureMyProfile(fallbackName: string) {
  const existingProfile = await getMyProfile();

  if (existingProfile) {
    return existingProfile;
  }

  return upsertMyProfile(fallbackName.trim() || "Bible learner");
}
