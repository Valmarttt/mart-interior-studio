import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function GET() {
  const requestId = crypto.randomUUID();
  if (!hasSupabaseEnv()) return NextResponse.json({ code: "SUPABASE_NOT_CONFIGURED", message: "Styles are not configured yet.", requestId }, { status: 503 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("styles").select("slug,name,prompt_description,image_path").eq("enabled", true).order("name");
  if (error) return NextResponse.json({ code: "STYLES_READ_FAILED", message: "Styles could not be loaded.", requestId }, { status: 500 });
  return NextResponse.json({ requestId, styles: data });
}
