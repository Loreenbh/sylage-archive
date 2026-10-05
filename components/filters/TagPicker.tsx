"use client";

import { useState } from "react";
import {
  STYLE_TAGS,
  AMBIANCE_TAGS,
  COLOR_TAGS,
  COLOR_SWATCHES,
  MAX_STYLE_TAGS,
  MAX_AMBIANCE_TAGS,
  MAX_COLOR_TAGS,
} from "@/constants/tags";
import { colors } from "@/styles/colors";

type Category = "style" | "ambiance" | "colors";

type Props = {
  styleTags: string[];
  ambianceTags: string[];
  colorTags: string[];
  onChangeStyle: (tags: string[]) => void;
  onChangeAmbiance: (tags: string[]) => void;
  onChangeColor: (tags: string[]) => void;
  layout?: "wrap" | "scroll";
  compact?: boolean;
};

function toggleIn(current: string[], max: number, tag: string): string[] {
  if (current.includes(tag)) return current.filter((t) => t !== tag);
  if (current.length >= max) return current;
  return [...current, tag];
}

export default function TagPicker({
  styleTags,
  ambianceTags,
  colorTags,
  onChangeStyle,
  onChangeAmbiance,
  onChangeColor,
  layout = "wrap",
  compact = false,
}: Props) {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);

  const categories = [
    {
      key: "style" as const,
      label: "STYLE",
      tags: STYLE_TAGS,
      selected: styleTags,
      max: MAX_STYLE_TAGS,
      onToggle: (tag: string) =>
        onChangeStyle(toggleIn(styleTags, MAX_STYLE_TAGS, tag)),
    },
    {
      key: "ambiance" as const,
      label: "AMBIANCE",
      tags: AMBIANCE_TAGS,
      selected: ambianceTags,
      max: MAX_AMBIANCE_TAGS,
      onToggle: (tag: string) =>
        onChangeAmbiance(toggleIn(ambianceTags, MAX_AMBIANCE_TAGS, tag)),
    },
    {
      key: "colors" as const,
      label: "COLORS",
      tags: COLOR_TAGS,
      selected: colorTags,
      max: MAX_COLOR_TAGS,
      onToggle: (tag: string) =>
        onChangeColor(toggleIn(colorTags, MAX_COLOR_TAGS, tag)),
    },
  ];

  const allSelected = [...styleTags, ...ambianceTags, ...colorTags];

  return (
    <div
      className={`flex flex-col items-center ${
        compact ? "gap-[0.8cqw]" : "sm:gap-3 lg:gap-4"
      }`}
    >
      <div className={`flex ${compact ? "gap-[1.5cqw]" : "sm:gap-3 lg:gap-3 xl:gap-10"}`}>
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() =>
              setOpenCategory((prev) =>
                prev === category.key ? null : category.key,
              )
            }
            className={`
              sm:text-[7px]
              md:text-[8px]
              lg:text-[9px]
              xl:text-[14px]
              tracking-[0.2em] 
              uppercase 
              border-b 
              transition
              ${openCategory === category.key
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/70"
              }
            `}
          >
            {category.label} ({category.selected.length}/{category.max})
          </button>
        ))}
      </div>

      {categories.map((category) =>
        openCategory === category.key ? (
          <div
            key={category.key}
            className={
              layout === "scroll"
                ? `
                  flex
                  flex-nowrap
                  ${compact ? "gap-[0.8cqw]" : "gap-1"}
                  overflow-x-auto
                  w-full
                  pb-1
                  scrollbar-none
                `
                : `
                  flex
                  flex-wrap
                  justify-center
                  ${compact ? "gap-[0.8cqw]" : "gap-y-1 gap-x-1"}
                  max-w-md
                `
            }
          >
            {category.tags.map((tag) => {
              const isSelected = category.selected.includes(tag);
              const isDisabled =
                !isSelected && category.selected.length >= category.max;
              const swatch =
                category.key === "colors" ? COLOR_SWATCHES[tag] : undefined;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => category.onToggle(tag)}
                  disabled={isDisabled}
                  className={`
                    flex 
                    items-center 
                    ${compact ? "gap-[0.8cqw] px-[1cqw]" : "gap-2 px-4"}
                    whitespace-nowrap
                    tracking-[0.15em] 
                    uppercase 
                    lg:py-1 
                    sm:text-[7px]
                    md:text-[8px]
                    lg:text-[9px]
                    xl:text-[13px]
                    border transition

                    ${isSelected
                      ? `${colors.bg.charcoal} text-white border-black`
                      : isDisabled
                        ? "border-black/10 text-black/20 cursor-not-allowed"
                        : "border-black/20 text-black/40 hover:text-black/70"
                    }
                  `}
                >
                  {tag}
                  {isSelected && (
                    <span className=" text-[12px] text-white/70">×</span>
                  )}
                  {swatch && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ background: swatch }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : null,
      )}
    </div>
  );
}
