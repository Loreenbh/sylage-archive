import BookFrame from "./BookFrame"

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  sidebar?: React.ReactNode
  actionsBar?: React.ReactNode

  footerLeft?: React.ReactNode
  footerRight?: React.ReactNode

}

export default function BookLayout({
  header,
  children,
  sidebar,
  actionsBar,
  footerLeft,
  footerRight
  }: Props) {
  return (
    <BookFrame>
      {header && (
        <div className="w-full">
          {header}
        </div>
      )}
      {/* BODY */}
      <div className="flex justify-center items-start flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          {/* IMAGE */}
          <div
            className="
              w-[255px]
              sm:w-[490px]
              md:w-[520px]
              lg:w-[680px]
              aspect-square
              shrink-0
              mt-6
              lg:mt-12
              mx-auto
              bg-green-200
            "
          >
            {children}
          </div>
          {actionsBar && (
            <div className="flex w-full">
              {actionsBar}
            </div>
          )}
        </div>
        {sidebar && (
          <div
            className="
              flex
              flex-col
              self-start
              w-[30px]
              sm:w-[35px]
              md:w-[50px]
              lg:w-[50px]
              mt-6
              lg:mt-12
              h-[248px]
              sm:h-[490px]
              md:h-[530px]
              lg:h-[690px]
            "
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
            px-2
          "
        >
          <div>
            {footerLeft}
          </div>
          <div>
            {footerRight}
          </div>

        </div>
      )}
    </BookFrame>
  )
}