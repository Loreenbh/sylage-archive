export const MOODBOARD_TAGS = [
    "STREETWEAR",
    "VINTAGE",
    "BOHEME",
    "ROCK",
    "MINIMAL",
    "WORKWEAR",
    "FUTURIST",
    "SPORTWEAR",
    "RETRO"
] as const


export type MoodboardTag = (typeof MOODBOARD_TAGS)[number]

export const MAX_TAGS_PER_MOODBOARD = 5