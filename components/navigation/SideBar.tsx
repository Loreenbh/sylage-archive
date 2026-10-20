"use client";

import { useState } from "react";
import type { OnNavigate } from "@/types/navigation";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { layout } from "@/styles/layout";

type Props = {
  text: string;
  onNavigate?: OnNavigate;
  clickable?: boolean;
};

export default function Sidebar({
  text,
  onNavigate,
  clickable = true,
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
        border-0 outline-none shadow-none before:hidden after:hidden
        ${clickable ? "cursor-pointer sm:translate-x-[0.5px]" : "cursor-default"}
      `}
    >

      <p
        className={`
          ${typography.sidebarTitle}
          ${colors.text.charcoal}
          ${layout.verticalText}
          whitespace-nowrap
          ${clickable ? (isHovering ? "opacity-70" : "opacity-100") : "opacity-50"}
        `}
      >
        {text}
      </p>
    </button>
  );
}
