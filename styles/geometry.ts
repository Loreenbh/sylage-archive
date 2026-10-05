const pageAspectRatio = 2 / 3;
const spreadAspectRatio = pageAspectRatio * 2;

export const geometry = {
  viewport: {
    className: "relative",
    style: {
      width: `min(90vw, calc((100lvh - 16px) * ${spreadAspectRatio}))`,
      aspectRatio: String(spreadAspectRatio),
    },
  },

  page: {
    container:
      "relative flex h-full w-full flex-col [container-type:inline-size] [container-name:book-page]",
    surface:
      "absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-sm p-[2.5cqw]",
  },

  header: {
    container: "relative h-[32cqw] w-full shrink-0",
    expandedHeight: (panelHeight: number) =>
      `max(33cqw, calc(25.5cqw + ${panelHeight}px))`,
    content: "relative flex h-full w-full items-center justify-center",
    portfolio: "absolute left-[2.7cqw] top-[6cqw] z-[70]",
    navigation:
      "absolute inset-x-[7cqw] top-[17.5cqw] z-[60] flex justify-between gap-[3cqw]",
    filterPanel:
      "absolute inset-x-[2.5cqw] top-[24.5cqw] z-50 overflow-hidden transition-all duration-300",
    coverTitle: "flex flex-col items-center justify-center",
    coverImage: "relative h-[10.5cqw] w-[42cqw]",
    coverSubtitle: "mt-[1cqw] self-end",
  },

  body: {
    container: "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden",
    mainRegion: "relative flex min-h-0 w-full flex-none overflow-hidden",
    mainArea: "flex h-full w-[88%] min-w-0 flex-col justify-start gap-[0.3cqw]",
    contentSquare: "relative aspect-square min-h-0 w-full",
  },

  sidebar: {
    container:
      "absolute inset-y-0 right-0 flex w-[12%] flex-col items-center justify-between pointer-events-none",
    content:
      "h-full w-full pointer-events-auto flex flex-col items-center justify-between",
  },

  actionBar: {
    container:
      "absolute left-0 top-[119cqw] md:top-[116cqw] z-20 flex h-[9cqw] w-[88%] min-w-0 items-center overflow-hidden transition-[translate] duration-300 ease-out",
    filterOffset: (panelHeight: number) =>
      `0 max(1cqw, calc(25.5cqw + ${panelHeight}px - 32cqw))`,
  },

  footer: {
    container:
      "mt-auto flex h-[14cqw] w-full shrink-0 items-center justify-between px-[2.5cqw]",
  },

  feed: {
    grid: "grid book-feed-grid",
    style: {
      gap: "2cqw",
    },
  },
};
