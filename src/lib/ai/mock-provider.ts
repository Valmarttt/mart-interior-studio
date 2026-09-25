import type { AIImageService, GenerateImageResult } from "@/lib/generation/types";

export class MockAIImageService implements AIImageService {
  async editRoom(): Promise<GenerateImageResult> {
    return { provider: "mock", status: "completed", generationId: `mock_${crypto.randomUUID()}` };
  }
}
