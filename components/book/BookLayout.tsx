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
      {header && <div className="w-full">{header}</div>}
      {/* BODY */}
      <div className="flex justify-center items-start flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          {/* IMAGE */}
          <div
            className={`
              w-[230px]
              mt-15
              sm:mt-24
              sm:w-[490px]
              md:w-[520px]
              md:mt-29
              lg:w-[730px]
              lg:mt-46
              aspect-square
              shrink-0
              mx-auto
              ml-6
              sm:ml-6
              ${imageClassName ?? ""}
            `}
          >
            {children}
          </div>
          {actionsBar && <div className="flex w-full">{actionsBar}</div>}
        </div>
        {sidebar && (
          <div
            className={`
              flex
              flex-col
              self-start
              w-[40px]
              sm:w-[35px]
              md:w-[50px]
              lg:w-[50px]
              mt-15
              sm:mt-24
              h-[230px]
              sm:h-[490px]
              md:h-[520px]
              md:mt-29
              lg:h-[730px]
              lg:ml-6
              lg:mt-46
              ${sidebarClassName ?? ""}
            `}
          >
            {sidebar}
          </div>
        )}
      </div>
      {/* FOOTER */}
      {(footerLeft || footerRight) && (
        <div
          className="
            w-full
            flex
            justify-between
            items-center
            px-6
            min-h-[24px]
          "
        >
          <div className="flex items-center">
            {footerLeft}
          </div>

          <div className="flex items-center">
            {footerRight}
          </div>
        </div>
      )}
    </BookFrame>
  );
}
