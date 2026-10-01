"use client";
import { useState } from "react";
/*STYLE*/
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
/*COMPONENTS*/
import TagPicker from "@/components/filters/TagPicker";

type HeaderItem = {
  section: string;
  clickable?: boolean;
  active?: boolean;
  onClick?: () => void;
};

type HeaderProps = {
  items: HeaderItem[];
  onFiltersChange?: (tags: string[]) => void;
};

export default function Header({ items, onFiltersChange }: HeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [ambianceTags, setAmbianceTags] = useState<string[]>([]);
  const [colorTags, setColorTags] = useState<string[]>([]);

  const handleItemClick = (item: HeaderItem) => {
    if (!item.clickable) return;

    if (item.section === "FILTER") {
      setIsFilterOpen((prev) => !prev);
    }

    item.onClick?.();
  };

  const updateStyle = (tags: string[]) => {
    setStyleTags(tags);
    onFiltersChange?.([...tags, ...ambianceTags, ...colorTags]);
  };

  const updateAmbiance = (tags: string[]) => {
    setAmbianceTags(tags);
    onFiltersChange?.([...styleTags, ...tags, ...colorTags]);
  };

  const updateColor = (tags: string[]) => {
    setColorTags(tags);
    onFiltersChange?.([...styleTags, ...ambianceTags, ...tags]);
  };

  return (
    <div
      className={`
        w-full
        transition-all
        duration-300
        ${
          isFilterOpen
            ? "sm:h-[59px] md:h-[70px] lg:h-[75px]"
            : "sm:h-[40px] md:h-[60px] lg:h-[60px]"
        }
      `}
    >
      {/* PORTFOLIO */}
      <button
        onClick={() => {
          window.location.href = "https://sylage-world.vercel.app/";
        }}
        className="
          absolute
          z-[70]
          sm:text-[10px]
          md:text-[13px]
          lg:text-[18px]
          tracking-[0.18em]
          text-black/20
          hover:text-black/50
          transition-colors
          duration-300
          cursor-pointer
        "
      >
        ← PORTFOLIO
      </button>

        <div
          className="
            relative
            z-[60]
            flex
            justify-between
            gap-3
            sm:px-4
            sm:pt-8
            md:pt-16
            lg:pt-26
          "
        >
        {items.map((item) => (
          <button
            key={item.section}
            onClick={() => handleItemClick(item)}
            disabled={Boolean(item.clickable !== true)}
            className={`
              ${typography.nav}
              pb-1
              border-b
              transition-colors
              duration-300

              ${
                item.active || (item.section === "FILTER" && isFilterOpen)
                  ? `${colors.text.charcoal} border-black cursor-default`
                  : item.clickable
                    ? `${colors.text.charcoal} border-transparent cursor-pointer hover:border-black opacity-90`
                    : `${colors.text.charcoal} border-transparent cursor-default opacity-50`
              }
            `}
          >
            {item.section}
          </button>
        ))}
      </div>

      <div
        className={`
          overflow-visible
          transition-all
          duration-300
          relative
          z-50
          ${
            isFilterOpen
              ? "max-h-[200px] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            border-b
            border-black/10
            sm:px-2
            md:px-6
            lg:px-10
          "
        >
          <TagPicker
            styleTags={styleTags}
            ambianceTags={ambianceTags}
            colorTags={colorTags}
            onChangeStyle={updateStyle}
            onChangeAmbiance={updateAmbiance}
            onChangeColor={updateColor}
            layout="scroll"
          />
        </div>
      </div>
    </div>
  );
}
