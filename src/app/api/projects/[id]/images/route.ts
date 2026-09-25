import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { validateImageFile } from "@/lib/validation/generation";

export const runtime = "nodejs";

const projectIdSchema = z.string().uuid();
const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type ImageRouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: ImageRouteContext) {
  const { id } = await params;
  if (!projectIdSchema.safeParse(id).success) return errorResponse("INVALID_PROJECT_ID", "The project id is invalid.", 400);
  if (!hasSupabaseEnv()) return errorResponse("SUPABASE_NOT_CONFIGURED", "Private storage is not configured yet.", 503);

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return errorResponse("UNAUTHENTICATED", "Sign in is required.", 401);

  const { data: project, error: projectError } = await supabase.from("projects").select("id").eq("id", id).maybeSingle();
  if (projectError) return errorResponse("PROJECT_READ_FAILED", "The project could not be loaded.", 500);
  if (!project) return errorResponse("PROJECT_NOT_FOUND", "The project was not found.", 404);

  const image = (await request.formData()).get("image");
  if (!(image instanceof File)) return errorResponse("IMAGE_REQUIRED", "An interior photo is required.", 400);

  let validatedImage;
  try {
    validatedImage = await validateImageFile(image);
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_IMAGE";
    const message = code === "IMAGE_TOO_LARGE" ? "The image must be smaller than 10 MB." : "Use a valid JPG, PNG or WebP image.";
    return errorResponse(code, message, 400);
  }

  const storagePath = `${userId}/${id}/original-${crypto.randomUUID()}.${extensionByMime[validatedImage.mimeType]}`;
  const { error: uploadError } = await supabase.storage.from("project-images").upload(storagePath, validatedImage.bytes, {
    contentType: validatedImage.mimeType,
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return errorResponse("IMAGE_UPLOAD_FAILED", "The image could not be saved.", 500);

  const { error: updateError } = await supabase.from("projects").update({ original_image_path: storagePath, updated_at: new Date().toISOString() }).eq("id", id);
  if (updateError) {
    await supabase.storage.from("project-images").remove([storagePath]);
    return errorResponse("PROJECT_IMAGE_LINK_FAILED", "The image could not be linked to the project.", 500);
  }

  return NextResponse.json({ projectId: id, path: storagePath }, { status: 201 });
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ code, message, requestId: crypto.randomUUID() }, { status });
}
