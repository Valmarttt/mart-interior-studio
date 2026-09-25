import OpenAI, { toFile } from "openai";
import type { AIImageService, GenerateImageInput, GenerateImageResult } from "@/lib/generation/types";
import { buildRoomEditPrompt } from "@/lib/ai/prompt";

export class OpenAIImageService implements AIImageService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY_MISSING");
    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst";
  }

  async editRoom(input: GenerateImageInput): Promise<GenerateImageResult> {
    const image = await toFile(input.image.bytes, input.image.filename, { type: input.image.mimeType });
    const response = await this.client.images.edit({ model: this.model, image, prompt: buildRoomEditPrompt(input), size: "1536x1024", quality: "medium", output_format: "png" });
    const imageBase64 = response.data?.[0]?.b64_json;
    if (!imageBase64) throw new Error("OPENAI_IMAGE_MISSING");
    return { provider: "openai", status: "completed", generationId: `openai_${crypto.randomUUID()}`, imageDataUrl: `data:image/png;base64,${imageBase64}`, revisedPrompt: response.data?.[0]?.revised_prompt };
  }
}
