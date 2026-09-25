export const STYLE_TAGS = [
  "ATHLEISURE",
  "AVANT-GARDE",
  "BOHEMIAN",
  "CLASSIC",
  "GOTHIC",
  "GRUNGE",
  "KITSCH",
  "MAXIMALIST",
  "MINIMALIST",
  "PREPPY",
  "STREETWEAR",
  "UTILITARIAN",
  "ROMANTIC",
  "OLD MONEY",
  "WORKWEAR",
  "Y2K",
  "GLAM",
  "VINTAGE",
  "ECLECTIC",
  "EXTRAVAGANT",
] as const;

export const AMBIANCE_TAGS = [
  "COZY",
  "DREAMY",
  "EDITORIAL",
  "ELEGANT",
  "ETHEREAL",
  "FESTIVE",
  "FUTURISTIC",
  "INTIMATE",
  "MELANCHOLIC",
  "MYSTERIOUS",
  "MOODY",
  "NOSTALGIC",
  "PLAYFUL",
  "RAW",
  "REBELLIOUS",
  "ROMANTIC",
  "SERENE",
  "SENSUAL",
  "SOPHISTICATED",
  "SURREAL",
  "DARK",
  "LIGHT",
  "URBAN",
] as const;

export const COLOR_TAGS = [
  "BEIGE",
  "BLACK",
  "BLUE",
  "BROWN",
  "BURGUNDY",
  "CAMEL",
  "GOLD",
  "GREEN",
  "GREY",
  "KHAKI",
  "MONOCHROME",
  "NAVY",
  "NEON",
  "ORANGE",
  "PINK",
  "PURPLE",
  "RED",
  "SILVER",
  "TAUPE",
  "WHITE",
  "YELLOW",
] as const;

export const COLOR_SWATCHES: Record<string, string> = {
  BEIGE: "#D8CBB8",
  BLACK: "#1C1A18",
  BLUE: "#526B7A",
  BROWN: "#665044",
  BURGUNDY: "#70484B",
  CAMEL: "#B79A78",
  GOLD: "#B59A5B",
  GREEN: "#5D6858",
  GREY: "#85827D",
  KHAKI: "#85816D",
  MONOCHROME: "linear-gradient(90deg, #1C1A18 50%, #E8E0D2 50%)",
  NAVY: "#384454",
  NEON: "#B7C94A",
  ORANGE: "#B8795E",
  PINK: "#B98F91",
  PURPLE: "#766A78",
  RED: "#925F58",
  SILVER: "#A9AAA7",
  TAUPE: "#8C8177",
  WHITE: "#F2EFE8",
  YELLOW: "#B5A56D",
};

export type StyleTag = (typeof STYLE_TAGS)[number];
export type AmbianceTag = (typeof AMBIANCE_TAGS)[number];
export type ColorTag = (typeof COLOR_TAGS)[number];

export const MAX_STYLE_TAGS = 2;
export const MAX_AMBIANCE_TAGS = 2;
export const MAX_COLOR_TAGS = 3;

export const MIN_TAGS_TOTAL = 3;
export const MAX_TAGS_TOTAL =
  MAX_STYLE_TAGS + MAX_AMBIANCE_TAGS + MAX_COLOR_TAGS;
