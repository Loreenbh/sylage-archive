// styles/spacing.ts — Clean, organized, semantic names

export const spacing = {
  // ============ COVER PAGE ============
  cover: {
    header: "text-center sm:space-y-3 md:space-y-4",
    title: "mt-2",
    subtitle: "pt-2 ml-25 sm:ml-20 md:ml-32 lg:ml-48",
    image: "bg-blue-200 mt-6 sm:mt-15 md:mt-20 lg:mt-30",
    label: "pt-6",
  },

  // ============ AUTH PAGE ============
  auth: {
    formColumn: "flex flex-col justify-between px-2 sm:px-4 md:px-8 pb-2 sm:pb-4",
    inputSpacing: "space-y-2 sm:space-y-3 md:space-y-4 mt-3 sm:mt-4",
    button: "text-sm sm:text-base md:text-xl tracking-[0.50em] uppercase",
    label:"pt-2 pl-6"
  },

  // ============ DISCOVER PAGE ============
  discover: {
    filterContainer: "flex items-center justify-center px-2 pt-4 pb-2 mt-2",
    filterGap: "gap-6 md:gap-8",
    profileButton: "absolute right-2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full",
  },

  // ============ PROFILE PAGE ============
  profile: {
    footer: "flex items-center justify-between px-2 pt-4 pb-2",
    footerGap: "gap-6",
    avatar: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full",
  },

  // ============ GLOBAL ============
  responsive: {
    px: "px-2 sm:px-4 md:px-6 lg:px-10",
    py: "py-2 sm:py-3 md:py-4",
    gap: "gap-1 sm:gap-2 md:gap-3",
    mt: "mt-2 sm:mt-4 md:mt-6 lg:mt-10",
    mb: "mb-2 sm:mb-3 md:mb-4",
  },
}