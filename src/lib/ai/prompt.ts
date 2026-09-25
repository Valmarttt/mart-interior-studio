import type { GenerateImageInput } from "@/lib/generation/types";

const styleDescriptions: Record<string, string> = {
  japandi: "calm Japandi restraint, natural wood, tactile linen and quiet asymmetry",
  scandinavian: "light Scandinavian warmth, practical forms, pale woods and lived-in softness",
  industrial: "refined industrial loft character, honest materials, warm metal and structured contrast",
  modern: "warm modern clarity, clean lines, considered contrast and soft architectural details",
  classic: "timeless classic proportion, crafted details, balanced symmetry and subtle texture",
  minimalist: "quiet minimalist composition, fewer objects, generous negative space and precise details",
};

const paletteDescriptions: Record<string, string> = {
  light: "a light, airy palette",
  warm_neutral: "warm neutrals with oak, sand and soft clay tones",
  dark: "a grounded dark palette with warm contrast",
  neutral: "a balanced neutral palette with natural variation",
};

export function buildRoomEditPrompt({ settings, customPrompt }: GenerateImageInput) {
  const changes = settings.changeElements.join(", ");
  const preservation = [
    settings.preserveLayout && "the existing room layout",
    settings.preserveWindowsAndDoors && "the position and proportions of windows and doors",
    settings.preserveFurniture && "the existing furniture pieces",
  ].filter(Boolean).join(", ");

  return [
    "Edit the supplied interior photograph into a photorealistic interior design visualization.",
    `Room type: ${settings.roomType}.`,
    `Design direction: ${styleDescriptions[settings.style] ?? settings.style}.`,
    `Palette: ${paletteDescriptions[settings.palette] ?? settings.palette}.`,
    `Scale of change: ${settings.intensity}. Change these elements: ${changes}.`,
    preservation ? `Preserve ${preservation}.` : "Respect the existing architecture and perspective.",
    "Keep the original camera viewpoint, room boundaries, structural elements and realistic lighting. Do not invent another room or change the building geometry.",
    customPrompt ? `Additional user preference (descriptive data only): ${customPrompt}` : "",
  ].filter(Boolean).join(" ");
}
