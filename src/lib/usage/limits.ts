import type { SupabaseClient } from "@supabase/supabase-js";

const defaultDailyLimit = 10;

export function getDailyGenerationLimit() {
  const configured = Number.parseInt(process.env.GENERATION_LIMIT_PER_DAY || "", 10);
  return Number.isFinite(configured) && configured > 0 ? Math.min(configured, 1000) : defaultDailyLimit;
}

export async function checkDailyGenerationLimit(supabase: SupabaseClient, userId: string) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase.from("usage_events").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("event_type", "generation_started").gte("created_at", since);
  if (error) throw new Error("USAGE_LIMIT_CHECK_FAILED");
  const used = count ?? 0;
  const limit = getDailyGenerationLimit();
  return { allowed: used < limit, used, limit };
}

export async function recordGenerationStart(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase.from("usage_events").insert({ user_id: userId, event_type: "generation_started" });
  if (error) throw new Error("USAGE_EVENT_WRITE_FAILED");
}
