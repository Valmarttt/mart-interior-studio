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

  const { data: generation, error } = await supabase.from("generations").select("id,result_image_path").eq("id", id).maybeSingle();
  if (error) return errorResponse("GENERATION_READ_FAILED", "The generation could not be loaded.", requestId, 500);
  if (!generation) return errorResponse("GENERATION_NOT_FOUND", "The generation was not found.", requestId, 404);
  if (!generation.result_image_path) return errorResponse("RESULT_NOT_AVAILABLE", "This generation has no downloadable result.", requestId, 404);

  const downloaded = await supabase.storage.from("project-images").download(generation.result_image_path);
  if (downloaded.error || !downloaded.data) return errorResponse("RESULT_READ_FAILED", "The result could not be downloaded.", requestId, 500);
  return new Response(downloaded.data, { status: 200, headers: { "Content-Type": downloaded.data.type || "application/octet-stream", "Content-Disposition": `attachment; filename="atelier-ai-${id}.png"`, "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
}

function isUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }

function errorResponse(code: string, message: string, requestId: string, status: number) {
  return NextResponse.json({ code, message, requestId }, { status });
}
