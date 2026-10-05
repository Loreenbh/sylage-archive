"use client";
import { useContext, useEffect, useRef, useState } from "react";
/*STYLE*/
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { geometry } from "@/styles/geometry";
import { FilterPanelContext } from "@/components/book/BookLayout";
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
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reportPanelHeight = useContext(FilterPanelContext);

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

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const updateHeight = () => {
      const height = isFilterOpen ? panel.getBoundingClientRect().height : 0;
      reportPanelHeight(height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(panel);

    return () => observer.disconnect();
  }, [isFilterOpen, reportPanelHeight]);

  return (
    <div className={geometry.header.content}>
      {/* PORTFOLIO */}
      <button
        onClick={() => {
          window.location.href = "https://sylage-world.vercel.app/";
        }}
        className={`${geometry.header.portfolio} ${typography.portfolio} text-black/20 hover:text-black/50 transition-colors duration-300 cursor-pointer`}
      >
        ← PORTFOLIO
      </button>

      <div className={geometry.header.navigation}>
        {items.map((item) => (
          <button
            key={item.section}
            onClick={() => handleItemClick(item)}
            disabled={Boolean(item.clickable !== true)}
            className={`
              ${typography.nav}
              pb-[0.6cqw]
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
        ref={panelRef}
        className={`${geometry.header.filterPanel} ${
          isFilterOpen
            ? "max-h-[36cqw] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="
            border-b
            border-black/10
            px-[1cqw]
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
            compact
          />
        </div>
      </div>
    </div>
  );
}
