"use client";

import { useState } from "react";
import type { OnNavigate } from "@/types/navigation";
import { typography } from "@/styles/typography";
import { layout } from "@/styles/layout";
import { colors } from "@/styles/colors";

type Props = {
  text: string;
  onNavigate?: OnNavigate;
  clickable?: boolean;
  fullHeightLine?: boolean;
};

export default function Sidebar({
  text,
  onNavigate,
  clickable = true,
  fullHeightLine = false,
}: Props) {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    if (clickable) {
      setIsHovering(false);
      onNavigate?.({ to: "auth", direction: "next" });
    }
  };

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={handleClick}
      onMouseEnter={() => clickable && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        ${layout.sidebarButton}
        h-full
        min-h-0
        flex
        flex-col
        items-center
        ${fullHeightLine ? "justify-end pb-2" : "justify-center"}
        ${fullHeightLine ? "relative" : ""}
        ${clickable ? "cursor-pointer" : "cursor-default opacity-50"}
        ${isHovering && clickable ? "opacity-70" : "opacity-100"}
      `}
    >
      <div
        className={
          fullHeightLine
            ? "absolute top-0 sm:bottom-[80px] left-1/2 w-[2px] -translate-x-1/2 bg-black/60"
            : layout.sideBarLine
        }
      />

      <p
        className={`
          ${fullHeightLine ? "relative z-10" : ""}
          ${typography.sidebarTitle}
          ${colors.text.charcoal}
          ${layout.verticalText}
          whitespace-nowrap
        `}
      >
        {text}
      </p>
    </button>
  );
}
