/* organisation des blocs*/
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

  sidebar: `
    flex
    flex-col
    self-stretch
    w-10
    sm:w-16
    md:w-20
    lg:w-24
  `,

  coverHeader: `
    flex
    flex-col
    items-center
    justify-center
  `,

  coverImage: `
    relative
    w-[75vw]
    max-w-[750px]
    aspect-square
    mx-auto
  `,

  sideBarLine: `
    hidden
    sm:block
    sm:flex-1
    sm:min-h-0
    w-[1px]
    lg:w-[1.5px]
    bg-black/40
  `,
  
  sidebarButton: `
    flex
    flex-col
    items-center
    w-full
    h-full
  `,

    verticalText: `
    [writing-mode:vertical-rl]
    rotate-180
    shrink-0
  `,
}