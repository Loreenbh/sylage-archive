export const MOODBOARD_TAGS = [
    "STREETWEAR",
    "VINTAGE",
    "BOHEME",
    "ROCK",
    "MINIMAL",
    "WORKWEAR",
    "FUTURIST"
] as const


export type MoodboardTag = (typeof MOODBOARD_TAGS)[number]

export const MAX_TAG_PER_MOODBOARD = 5