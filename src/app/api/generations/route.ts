import { NextResponse } from "next/server";
import { createAIImageService } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { validateImageFile, customPromptSchema, generationSettingsSchema } from "@/lib/validation/generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) return errorResponse("INVALID_CONTENT_TYPE", "Use multipart/form-data for image uploads.", requestId, 400);
    const formData = await request.formData();
    const image = formData.get("image");
    const rawSettings = formData.get("settings");
    const rawPrompt = formData.get("customPrompt");
    if (!(image instanceof File)) return errorResponse("IMAGE_REQUIRED", "An interior photo is required.", requestId, 400);
    if (typeof rawSettings !== "string") return errorResponse("SETTINGS_REQUIRED", "Generation settings are required.", requestId, 400);

    const settings = generationSettingsSchema.parse(JSON.parse(rawSettings));
    const customPrompt = customPromptSchema.parse(typeof rawPrompt === "string" ? rawPrompt : "");
    const validatedImage = await validateImageFile(image);
    const provider = process.env.AI_PROVIDER || "mock";
    if (provider === "openai") {
      if (process.env.ENABLE_REAL_GENERATION !== "true") {
        return errorResponse("REAL_GENERATION_DISABLED", "Real generation is disabled until authentication and private storage are connected.", requestId, 503);
      }
      if (!hasSupabaseEnv()) {
        return errorResponse("SUPABASE_NOT_CONFIGURED", "Real generation requires an authenticated Supabase session.", requestId, 503);
      }
      const supabase = await createClient();
      const { data: claims } = await supabase.auth.getClaims();
      if (!claims?.claims?.sub) {
        return errorResponse("UNAUTHENTICATED", "Sign in is required before using real generation.", requestId, 401);
      }
    }

    const result = await createAIImageService().editRoom({ image: validatedImage, settings, customPrompt });
    return NextResponse.json({ requestId, ...result, mode: provider === "mock" ? "demo" : "real" });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.name === "ZodError") return errorResponse("INVALID_REQUEST", "Some generation settings are invalid.", requestId, 400);
    const code = error instanceof Error ? error.message : "GENERATION_FAILED";
    const message = code === "OPENAI_API_KEY_MISSING" ? "The OpenAI provider is not configured on the server." : "The generation service could not complete this request.";
    return errorResponse(code, message, requestId, 500);
  }
}

function errorResponse(code: string, message: string, requestId: string, status: number) {
  return NextResponse.json({ code, message, requestId }, { status });
}
