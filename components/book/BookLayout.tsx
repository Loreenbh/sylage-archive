"use client";

import { createContext, useState } from "react";
import BookFrame from "./BookFrame";
import { geometry } from "@/styles/geometry";

export const FilterPanelContext = createContext<(height: number) => void>(
  () => {}
);

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  actionsBar?: React.ReactNode;
  imageClassName?: string;
  sidebarClassName?: string;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  onPageClick?: () => void;
  pageClickLabel?: string;
};

export default function BookLayout({
  header,
  children,
  sidebar,
  actionsBar,
  footerLeft,
  footerRight,
  onPageClick,
  pageClickLabel,
  imageClassName,
  sidebarClassName,
}: Props) {
  const [filterPanelHeight, setFilterPanelHeight] = useState(0);

  return (
    <BookFrame>
      <div
        className="relative flex h-full w-full flex-col"
        onClick={(event) => {
          if (!onPageClick) return;
          const target = event.target;
          if (
            target instanceof Element &&
            target.closest("button, a, input, select, textarea, [role='button']")
          ) {
            return;
          }
          onPageClick();
        }}
        onKeyDown={(event) => {
          if (
            onPageClick &&
            event.target === event.currentTarget &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            onPageClick();
          }
        }}
        role={onPageClick ? "region" : undefined}
        aria-label={onPageClick ? pageClickLabel : undefined}
        tabIndex={onPageClick ? 0 : undefined}
      >
        {/* HEADER */}
        {header && (
          <FilterPanelContext.Provider value={setFilterPanelHeight}>
            <div
              className={`${geometry.header.container} transition-[height] duration-300 ease-out`}
              style={{
                height: filterPanelHeight
                  ? geometry.header.expandedHeight(filterPanelHeight)
                  : "32cqw",
              }}
            >
              {header}
            </div>
          </FilterPanelContext.Provider>
        )}

        {/* BODY */}
        <div className={geometry.body.container}>
          {/* CONTENU PRINCIPAL ET SIDEBAR */}
          <div className={geometry.body.mainRegion}>
            <div className={geometry.body.mainArea}>
              <div
                className={`${geometry.body.contentSquare} ${imageClassName ?? ""}`}
              >
                {children}
              </div>
            </div>

            {/* SIDEBAR */}
            {sidebar && (
              <div
                className={`${geometry.sidebar.container} ${sidebarClassName ?? ""}`}
              >
                <div className={geometry.sidebar.content}>{sidebar}</div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        {(footerLeft || footerRight) && (
          <div className={geometry.footer.container}>
            <div className="flex items-center min-w-0">{footerLeft}</div>
            <div className="flex items-center min-w-0">{footerRight}</div>
          </div>
        )}

        {/* ACTION BAR */}
        {actionsBar && (
          <div
            className={geometry.actionBar.container}
            style={{
              translate: filterPanelHeight
                ? geometry.actionBar.filterOffset(filterPanelHeight)
                : undefined,
            }}
          >
            {actionsBar}
          </div>
        )}
      </div>
    </BookFrame>
  );
}