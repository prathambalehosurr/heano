import { supabase } from "./supabase";

export async function submitScore(params: {
  userId: string;
  score: number;
  mode: string;
  difficulty: string;
  colorResults: Array<{
    hue: number;
    saturation: number;
    brightness: number;
    score: number;
    deltaE: number;
  }>;
}) {
  const { data, error } = await supabase.from("scores").insert({
    user_id: params.userId,
    score: params.score,
    mode: params.mode,
    difficulty: params.difficulty,
    color_results: params.colorResults,
  }).select().single();

  return { data, error: error?.message || null };
}

export async function getLeaderboard(params?: {
  mode?: string;
  difficulty?: string;
  limit?: number;
}) {
  let query = supabase
    .from("scores")
    .select(`
      id,
      score,
      mode,
      difficulty,
      created_at,
      user_id,
      profiles!inner (
        name
      )
    `)
    .order("score", { ascending: false })
    .limit(params?.limit || 50);

  if (params?.mode) {
    query = query.eq("mode", params.mode);
  }
  if (params?.difficulty) {
    query = query.eq("difficulty", params.difficulty);
  }

  const { data, error } = await query;
  return { data, error: error?.message || null };
}

export async function getUserBest(userId: string, mode?: string) {
  let query = supabase
    .from("scores")
    .select("score")
    .eq("user_id", userId)
    .order("score", { ascending: false })
    .limit(1);

  if (mode) {
    query = query.eq("mode", mode);
  }

  const { data, error } = await query;
  return { best: data?.[0]?.score ?? 0, error: error?.message || null };
}

export async function getLeaderboardAndUserBest(params: {
  mode?: string;
  difficulty?: string;
  limit?: number;
  userId?: string;
}) {
  const leaderboardPromise = getLeaderboard({
    mode: params.mode,
    difficulty: params.difficulty,
    limit: params.limit,
  });

  const userBestPromise = params.userId
    ? getUserBest(params.userId, params.mode)
    : Promise.resolve({ best: 0, error: null });

  const [leaderboard, userBest] = await Promise.all([
    leaderboardPromise,
    userBestPromise,
  ]);

  return {
    leaderboard,
    userBest,
  };
}

export async function updateProfile(userId: string, updates: { name?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates }, { onConflict: "id" })
    .select()
    .single();

  return { data, error: error?.message || null };
}

export async function clearLeaderboard() {
  // Require RLS to enforce who can actually perform this
  const { error } = await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return { error: error?.message || null };
}
