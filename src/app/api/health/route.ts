import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const runtime = "nodejs";

export function GET() {
  const provider = process.env.AI_PROVIDER || "mock";
  const supabaseConfigured = hasSupabaseEnv();
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const realGenerationEnabled = provider === "openai" && process.env.ENABLE_REAL_GENERATION === "true";
  const body = {
    status: "ok",
    provider,
    realGenerationEnabled,
    realGenerationReady: realGenerationEnabled && openaiConfigured && supabaseConfigured,
    supabaseConfigured,
    openaiConfigured,
  } as const;

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
