import { z } from "zod";
import type { ImageInput } from "@/lib/generation/types";

const supportedMimes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxImageBytes = 10 * 1024 * 1024;

export const generationSettingsSchema = z.object({
  roomType: z.string().min(1).max(80),
  style: z.string().min(1).max(80),
  palette: z.string().min(1).max(80),
  intensity: z.string().min(1).max(40),
  changeElements: z.array(z.string().min(1).max(40)).min(1).max(10),
  preserveLayout: z.boolean(),
  preserveWindowsAndDoors: z.boolean(),
  preserveFurniture: z.boolean(),
});

export const customPromptSchema = z.string().max(1000).default("");

export async function validateImageFile(file: File): Promise<ImageInput> {
  if (!supportedMimes.includes(file.type as (typeof supportedMimes)[number])) throw new Error("UNSUPPORTED_IMAGE_TYPE");
  if (file.size === 0 || file.size > maxImageBytes) throw new Error("IMAGE_TOO_LARGE");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) throw new Error("INVALID_IMAGE_CONTENT");
  return { bytes, filename: file.name || "room-image", mimeType: file.type as ImageInput["mimeType"] };
}

function hasValidSignature(bytes: Buffer, mimeType: string) {
  const jpeg = mimeType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = mimeType === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = mimeType === "image/webp" && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return jpeg || png || webp;
}
