import type { AIImageService } from "@/lib/generation/types";
import { MockAIImageService } from "@/lib/ai/mock-provider";
import { OpenAIImageService } from "@/lib/ai/openai-provider";

export function createAIImageService(): AIImageService {
  const provider = process.env.AI_PROVIDER || "mock";
  if (provider === "mock") return new MockAIImageService();
  if (provider === "openai") return new OpenAIImageService();
  throw new Error("AI_PROVIDER_UNSUPPORTED");
}
