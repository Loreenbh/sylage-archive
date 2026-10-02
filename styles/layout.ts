export const layout = {
  bookContent: `
    w-[75vw]
    max-w-[780px]
    aspect-square
    shrink-0
  `,

  bookBody: `
    flex
    items-center
    justify-center
    gap-1
    mt-7
    min-h-0
  `,

  coverHeader: `
    flex
    flex-col
    items-center
    justify-center
  `,

coverImage: `
  relative
  w-full
  aspect-square
`,

  sideBarLine: `
  w-px
  flex-1
  min-h-3
  bg-black
  shadow-[0_0_1px_rgba(0,0,0,0.65)]
`,

  sidebarButton: `
    flex
    flex-col
    items-center
    justify-end
    w-full
    h-full
    min-h-0
    pb-2
`,

  verticalText: `
  [writing-mode:vertical-rl]
  rotate-180
  shrink-0
  whitespace-nowrap
`,
};
