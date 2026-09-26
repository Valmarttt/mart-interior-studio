import { NextResponse } from "next/server";
import { createAIImageService } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { validateImageFile, customPromptSchema, generationSettingsSchema } from "@/lib/validation/generation";
import { checkDailyGenerationLimit, recordGenerationStart } from "@/lib/usage/limits";

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
    let authenticatedUserId: string | null = null;
    let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
    if (provider === "openai") {
      if (process.env.ENABLE_REAL_GENERATION !== "true") {
        return errorResponse("REAL_GENERATION_DISABLED", "Real generation is disabled until authentication and private storage are connected.", requestId, 503);
      }
      if (!hasSupabaseEnv()) {
        return errorResponse("SUPABASE_NOT_CONFIGURED", "Real generation requires an authenticated Supabase session.", requestId, 503);
      }
      supabase = await createClient();
      const { data: claims } = await supabase.auth.getClaims();
      authenticatedUserId = claims?.claims?.sub ?? null;
      if (!authenticatedUserId) {
        return errorResponse("UNAUTHENTICATED", "Sign in is required before using real generation.", requestId, 401);
      }
      const usage = await checkDailyGenerationLimit(supabase, authenticatedUserId);
      if (!usage.allowed) return NextResponse.json({ code: "GENERATION_LIMIT_REACHED", message: "Your daily generation limit has been reached.", requestId, used: usage.used, limit: usage.limit }, { status: 429 });
      await recordGenerationStart(supabase, authenticatedUserId);
    }

    const result = await createAIImageService().editRoom({ image: validatedImage, settings, customPrompt });
    return NextResponse.json({ requestId, ...result, mode: provider === "mock" ? "demo" : "real" });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.name === "ZodError") return errorResponse("INVALID_REQUEST", "Some generation settings are invalid.", requestId, 400);
    const internalCode = error instanceof Error ? error.message : "GENERATION_FAILED";
    const knownErrors: Record<string, { message: string; status: number }> = {
      UNSUPPORTED_IMAGE_TYPE: { message: "Use a JPG, PNG or WebP room image.", status: 400 },
      IMAGE_TOO_LARGE: { message: "The room image must be smaller than 10 MB.", status: 400 },
      INVALID_IMAGE_CONTENT: { message: "The uploaded file is not a valid room image.", status: 400 },
      OPENAI_API_KEY_MISSING: { message: "The OpenAI provider is not configured on the server.", status: 503 },
      OPENAI_IMAGE_MISSING: { message: "The image provider returned no image.", status: 502 },
      AI_PROVIDER_UNSUPPORTED: { message: "The configured image provider is unsupported.", status: 503 },
      USAGE_LIMIT_CHECK_FAILED: { message: "Usage limits are temporarily unavailable.", status: 503 },
      USAGE_EVENT_WRITE_FAILED: { message: "Usage limits are temporarily unavailable.", status: 503 },
    };
    const safeError = knownErrors[internalCode] ?? { message: "The generation service could not complete this request.", status: 500 };
    return errorResponse(knownErrors[internalCode] ? internalCode : "GENERATION_FAILED", safeError.message, requestId, safeError.status);
  }
}

function errorResponse(code: string, message: string, requestId: string, status: number) {
  return NextResponse.json({ code, message, requestId }, { status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } });
}
