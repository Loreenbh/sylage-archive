export type MoodboardSlot = {
  url: string;
  scale: number;
  offsetX: number;
  offsetY: number;
} | null;

export type MoodboardSlotPatch = Partial<{
  scale: number;
  offsetX: number;
  offsetY: number;
}>;
