import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = crypto.randomUUID();
  const { id } = await params;
  if (!isUuid(id)) return errorResponse("INVALID_GENERATION_ID", "The generation id is invalid.", requestId, 400);
  if (!hasSupabaseEnv()) return errorResponse("SUPABASE_NOT_CONFIGURED", "Supabase is not configured.", requestId, 503);

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return errorResponse("UNAUTHENTICATED", "Sign in is required.", requestId, 401);

  const { data, error } = await supabase.from("generations").select("id,project_id,status,style_id,settings,result_image_path,error_code,created_at,completed_at").eq("id", id).maybeSingle();
  if (error) return errorResponse("GENERATION_READ_FAILED", "The generation could not be loaded.", requestId, 500);
  if (!data) return errorResponse("GENERATION_NOT_FOUND", "The generation was not found.", requestId, 404);

  let resultImageUrl: string | null = null;
  if (data.result_image_path) {
    const signed = await supabase.storage.from("project-images").createSignedUrl(data.result_image_path, 60 * 60);
    resultImageUrl = signed.data?.signedUrl ?? null;
  }
  return NextResponse.json({ requestId, generation: { ...data, resultImageUrl } });
}

function isUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }

function errorResponse(code: string, message: string, requestId: string, status: number) {
  return NextResponse.json({ code, message, requestId }, { status });
}
