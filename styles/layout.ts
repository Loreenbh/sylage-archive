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
    w-[70vw]
    max-w-[750px]
    aspect-square
    mx-auto
  `,

  sideBarLine: `
  w-[1px]
  flex-1
  min-h-0
  bg-black/40
`,

  sidebarButton: `
  flex
  flex-col
  items-center
  justify-between
  w-full
  h-full
  min-h-0
`,

  verticalText: `
  [writing-mode:vertical-rl]
  rotate-180
  shrink-0
  whitespace-nowrap
`,
};
