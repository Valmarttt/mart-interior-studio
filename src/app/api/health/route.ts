import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const runtime = "nodejs";

export function GET() {
  const provider = process.env.AI_PROVIDER || "mock";
  const body = {
    status: "ok",
    provider,
    realGenerationEnabled: provider === "openai" && process.env.ENABLE_REAL_GENERATION === "true",
    supabaseConfigured: hasSupabaseEnv(),
  } as const;

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
