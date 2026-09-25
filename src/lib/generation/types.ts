export const generationStatuses = ["pending", "processing", "completed", "failed", "cancelled"] as const;
export type GenerationStatus = (typeof generationStatuses)[number];

export type GenerationSettings = {
  roomType: string;
  style: string;
  palette: string;
  intensity: string;
  changeElements: string[];
  preserveLayout: boolean;
  preserveWindowsAndDoors: boolean;
  preserveFurniture: boolean;
};

export type ImageInput = {
  bytes: Buffer;
  filename: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

export type GenerateImageInput = {
  image: ImageInput;
  settings: GenerationSettings;
  customPrompt: string;
};

export type GenerateImageResult = {
  provider: "mock" | "openai";
  status: "completed";
  generationId: string;
  imageDataUrl?: string;
  revisedPrompt?: string;
};

export interface AIImageService {
  editRoom(input: GenerateImageInput): Promise<GenerateImageResult>;
}
