import BookFrame from "./BookFrame";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  actionsBar?: React.ReactNode;
  imageClassName?: string;
  sidebarClassName?: string;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  isCover?: boolean;
};

export default function BookLayout({
  header,
  children,
  sidebar,
  actionsBar,
  footerLeft,
  footerRight,
  imageClassName,
  sidebarClassName,
  isCover = false,
}: Props) {
  return (
    <BookFrame>
      {/* HEADER */}
      {header && <div className="w-full shrink-0">{header}</div>}

{/* BODY */}
<div className="flex flex-1 min-h-0 w-full overflow-hidden">
  {isCover ? (
    /* COVER */
    <div className="relative w-full min-h-0">
      {/* IMAGE + ACTIONS */}
      <div className="flex flex-col items-center w-full min-w-0">
        <div
          className={`
            aspect-square
            w-[70%]
            md:w-[65%]
            lg:w-[65%]
            ${imageClassName ?? ""}
          `}
        >
          {children}
        </div>

        {actionsBar && (
          <div className="w-[110%]">
            {actionsBar}
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      {sidebar && (
        <div
          className={`
            absolute
            top-0
            right-0
            shrink-0
            flex
            flex-col
            self-start
            h-[30vw]
            md:h-[45vw]
            lg:h-[48vw]
            w-[30px]
            md:w-[35px]
            lg:w-[45px]
            ${sidebarClassName ?? ""}
          `}
        >
          {sidebar}
        </div>
      )}
    </div>
  ) : (
    /* PAGES NORMALES */
    <div
      className={`
        flex
        items-start
        min-w-0
        w-full
        sm:mt-10
        md:mt-28
        lg:mt-45
      `}
    >
      {/* IMAGE + ACTIONS */}
      <div className="flex flex-col min-w-0 flex-1">
        <div
          className={`
            aspect-square
            sm:ml-[4vw]
            md:ml-0
            sm:w-[90%]
            md:w-[72%]
            lg:w-[75%]
            ${imageClassName ?? ""}
          `}
        >
          {children}
        </div>

        {actionsBar && (
          <div className="w-[110%]">
            {actionsBar}
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      {sidebar && (
        <div
          className={`
            shrink-0
            flex
            flex-col
            self-start
            sm:h-[30vw]
            md:h-[52vw]
            lg:h-[55vw]
            sm:w-[30px]
            md:w-[40px]
            lg:w-[50px]
            ${sidebarClassName ?? ""}
          `}
        >
          {sidebar}
        </div>
      )}
    </div>
  )}
</div>

      {/* FOOTER */}
      {(footerLeft || footerRight) && (
        <div
          className="
            shrink-0
            w-full
            flex
            justify-between
            items-center
            px-3
            sm:px-4
            min-h-[20px]
          "
        >
          <div className="flex items-center min-w-0">
            {footerLeft}
          </div>

          <div className="flex items-center min-w-0">
            {footerRight}
          </div>
        </div>
      )}
    </BookFrame>
  );
}