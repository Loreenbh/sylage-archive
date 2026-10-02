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
}: Props) {
  return (
    <BookFrame>
      {/* HEADER */}
      {header && <div className="w-full shrink-0">{header}</div>}

      {/* BODY */}
      <div className="relative flex flex-1 min-h-0 w-full overflow-hidden">
        <div
          className="
            flex
            items-start
            min-w-0
            w-full
            sm:mt-10
            lg:mt-11
            xl:mt-16
          "
        >
          {/* IMAGE + ACTIONS */}
          <div className="flex flex-col min-w-0 flex-1">
            <div
              className={`
                aspect-square
                min-h-0
                sm:ml-[4vw]
                md:ml-[3vw]
                lg:ml-[2.5vw]
                sm:w-[80%]
                md:w-[80%]
                lg:w-[85%]
                xl:w-[85%]
                ${imageClassName ?? ""}
              `}
            >
              {children}
            </div>

            {actionsBar && <div>{actionsBar}</div>}
          </div>
        </div>

        {/* SIDEBAR — UNIQUE */}
        {sidebar && (
          <div
            className={`
                absolute
                top-0
                sm:top-10
                lg:top-11
                xl:top-16
                right-0
                h-[30vw]
                md:h-[25vw]
                lg:h-[35vw]
                xl:h-[40vw]
                w-[30px]
                md:w-[32px]
                lg:w-[32px]
                xl:w-[60px]
                pointer-events-none
                ${sidebarClassName ?? ""}
              `}
            >
              <div className="h-full w-full pointer-events-auto">
                {sidebar}
              </div>
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