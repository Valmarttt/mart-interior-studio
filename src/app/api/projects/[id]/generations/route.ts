import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { generationSettingsSchema, validateImageFile } from "@/lib/validation/generation";

export const runtime = "nodejs";

const generationSchema = z.object({
  styleId: z.string().trim().min(1).max(80),
  settings: generationSettingsSchema,
  mode: z.enum(["demo", "real"]),
  idempotencyKey: z.string().uuid(),
  resultImageDataUrl: z.string().nullable().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = crypto.randomUUID();
  try {
    const { id: projectId } = await params;
    if (!isUuid(projectId)) return errorResponse("INVALID_PROJECT_ID", "The project id is invalid.", requestId, 400);
    if (!hasSupabaseEnv()) return errorResponse("SUPABASE_NOT_CONFIGURED", "Supabase is not configured.", requestId, 503);

    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) return errorResponse("UNAUTHENTICATED", "Sign in is required.", requestId, 401);

    const body = generationSchema.safeParse(await request.json());
    if (!body.success) return errorResponse("INVALID_GENERATION", "The generation details are invalid.", requestId, 400);

    const { data: project, error: projectError } = await supabase.from("projects").select("id").eq("id", projectId).maybeSingle();
    if (projectError) return errorResponse("PROJECT_READ_FAILED", "The project could not be loaded.", requestId, 500);
    if (!project) return errorResponse("PROJECT_NOT_FOUND", "The project was not found.", requestId, 404);

    const { data: existingGeneration } = await supabase.from("generations").select("id,status,style_id,settings,result_image_path,created_at,completed_at").eq("project_id", projectId).eq("idempotency_key", body.data.idempotencyKey).maybeSingle();
    if (existingGeneration) return NextResponse.json({ requestId, generation: existingGeneration, duplicate: true }, { status: 200 });

    const generationId = crypto.randomUUID();
    let resultImagePath: string | null = null;
    if (body.data.resultImageDataUrl) {
      const resultFile = await dataUrlToFile(body.data.resultImageDataUrl);
      const validated = await validateImageFile(resultFile);
      const extension = validated.mimeType === "image/jpeg" ? "jpg" : validated.mimeType === "image/webp" ? "webp" : "png";
      resultImagePath = `${userId}/${projectId}/generations/${generationId}.${extension}`;
      const upload = await supabase.storage.from("project-images").upload(resultImagePath, validated.bytes, { contentType: validated.mimeType, cacheControl: "3600", upsert: false });
      if (upload.error) return errorResponse("RESULT_IMAGE_SAVE_FAILED", "The generated image could not be saved.", requestId, 500);
    }

    const { data: generation, error: generationError } = await supabase.from("generations").insert({
      id: generationId,
      project_id: projectId,
      status: "completed",
      style_id: body.data.styleId,
      settings: { ...body.data.settings, mode: body.data.mode },
      idempotency_key: body.data.idempotencyKey,
      result_image_path: resultImagePath,
      completed_at: new Date().toISOString(),
    }).select("id,status,style_id,settings,result_image_path,created_at,completed_at").single();

    if (generationError) {
      if (resultImagePath) await supabase.storage.from("project-images").remove([resultImagePath]);
      return errorResponse("GENERATION_SAVE_FAILED", "The generation history could not be saved.", requestId, 500);
    }

    await supabase.from("projects").update({ updated_at: new Date().toISOString() }).eq("id", projectId);
    return NextResponse.json({ requestId, generation }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "GENERATION_SAVE_FAILED";
    const message = code === "INVALID_RESULT_IMAGE" || code === "UNSUPPORTED_IMAGE_TYPE" || code === "IMAGE_TOO_LARGE" || code === "INVALID_IMAGE_CONTENT" ? "The generated image is invalid." : "The generation history could not be saved.";
    return errorResponse(code, message, requestId, 400);
  }
}

async function dataUrlToFile(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) throw new Error("INVALID_RESULT_IMAGE");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0) throw new Error("INVALID_RESULT_IMAGE");
  return new File([bytes], "generated-room", { type: match[1] });
}

function isUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }

function errorResponse(code: string, message: string, requestId: string, status: number) {
  return NextResponse.json({ code, message, requestId }, { status });
}
