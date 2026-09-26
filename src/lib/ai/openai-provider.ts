import OpenAI, { toFile } from "openai";
import type { AIImageService, GenerateImageInput, GenerateImageResult } from "@/lib/generation/types";
import { buildRoomEditPrompt } from "@/lib/ai/prompt";

export class OpenAIImageService implements AIImageService {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly size: ImageSize;
  private readonly quality: ImageQuality;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY_MISSING");
    this.client = new OpenAI({ apiKey, timeout: readTimeout(), maxRetries: 1 });
    this.model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst";
    this.size = readSize(process.env.OPENAI_IMAGE_SIZE);
    this.quality = readQuality(process.env.OPENAI_IMAGE_QUALITY);
  }

  async editRoom(input: GenerateImageInput): Promise<GenerateImageResult> {
    const image = await toFile(input.image.bytes, input.image.filename, { type: input.image.mimeType });
    const response = await this.client.images.edit({ model: this.model, image, prompt: buildRoomEditPrompt(input), size: this.size, quality: this.quality, output_format: "png" });
    const imageBase64 = response.data?.[0]?.b64_json;
    if (!imageBase64) throw new Error("OPENAI_IMAGE_MISSING");
    return { provider: "openai", status: "completed", generationId: `openai_${crypto.randomUUID()}`, imageDataUrl: `data:image/png;base64,${imageBase64}`, revisedPrompt: response.data?.[0]?.revised_prompt };
  }
}

type ImageSize = "auto" | "1024x1024" | "1536x1024" | "1024x1536";
type ImageQuality = "auto" | "low" | "medium" | "high" | "standard";

function readSize(value: string | undefined): ImageSize {
  return value === "1024x1024" || value === "1024x1536" || value === "1536x1024" ? value : "1536x1024";
}

function readQuality(value: string | undefined): ImageQuality {
  return value === "auto" || value === "low" || value === "medium" || value === "high" || value === "standard" ? value : "medium";
}

function readTimeout() {
  const value = Number.parseInt(process.env.OPENAI_REQUEST_TIMEOUT_MS || "120000", 10);
  return Number.isFinite(value) ? Math.min(Math.max(value, 30_000), 180_000) : 120_000;
}
