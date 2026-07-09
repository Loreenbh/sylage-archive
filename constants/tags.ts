/* Chaque catégorie est une liste indépendante, triée alphabétiquement —
   pour ajouter ou retirer un tag, modifie juste le tableau correspondant. */

export const STYLE_TAGS = [
  "ATHLEISURE",
  "AVANT-GARDE",
  "BOHEMIAN",
  "CLASSIC",
  "GOTHIC",
  "GRUNGE",
  "MAXIMALIST",
  "MINIMALIST",
  "PREPPY",
  "STREETWEAR",
  "UTILITARIAN",
  "ROMANTIC",
  "OLD MONEY"
] as const

export const AMBIANCE_TAGS = [
  "COZY",
  "DREAMY",
  "EDITORIAL",
  "ELEGANT",
  "ETHEREAL",
  "FUTURISTIC",
  "MOODY",
  "NOSTALGIC",
  "PLAYFUL",
  "RAW",
  "REBELLIOUS",
  "SENSUAL",
] as const

export const COLOR_TAGS = [
  "BEIGE",
  "BLACK",
  "BLUE",
  "BROWN",
  "BURGUNDY",
  "CAMEL",
  "CREAM",
  "GOLD",
  "GREEN",
  "KHAKI",
  "MONOCHROME",
  "NAVY",
  "NEON",
  "PASTEL",
  "RED",
  "SILVER",
  "WHITE",
] as const

/* Couleur CSS réelle utilisée pour la pastille à côté de chaque tag couleur.
   Pour les concepts abstraits (MONOCHROME, NEON, PASTEL), une teinte représentative. */
export const COLOR_SWATCHES: Record<string, string> = {
  BEIGE: "#E8DCC8",
  BLACK: "#000000",
  BLUE: "#2E5C8A",
  BROWN: "#6B4423",
  BURGUNDY: "#722F37",
  CAMEL: "#C19A6B",
  CREAM: "#FFFDD0",
  GOLD: "#D4AF37",
  GREEN: "#4B6043",
  KHAKI: "#8B8768",
  MONOCHROME: "linear-gradient(90deg, #000 50%, #fff 50%)",
  NAVY: "#1F2A44",
  NEON: "#CCFF00",
  PASTEL: "#FFD1DC",
  RED: "#C0392B",
  SILVER: "#C0C0C0",
  WHITE: "#FFFFFF",
}

export type StyleTag = (typeof STYLE_TAGS)[number]
export type AmbianceTag = (typeof AMBIANCE_TAGS)[number]
export type ColorTag = (typeof COLOR_TAGS)[number]

export const MAX_STYLE_TAGS = 2
export const MAX_AMBIANCE_TAGS = 2
export const MAX_COLOR_TAGS = 3

export const MIN_TAGS_TOTAL = 3
export const MAX_TAGS_TOTAL = MAX_STYLE_TAGS + MAX_AMBIANCE_TAGS + MAX_COLOR_TAGS