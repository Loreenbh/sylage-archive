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

      {/* HEADER */}
      {header && <div>{header}</div>}

      {/* BODY */}
      <div className="flex mt-7 items-center justify-center min-h-0 gap-1">

        {/* LEFT COLUMN = carré + actions */}
        <div className="flex flex-col bg-blue-300">

          {/* CARRÉ */}
          <div
            className="
              w-[280px]
              sm:w-[550px]
              md:w-[540px]
              lg:w-[700px]
              xl:w-[780px]
              aspect-square
              shrink-0
            "
          >
            {children}
          </div>

          {/* ACTIONS BAR (aligné à la largeur du carré uniquement) */}
          {actionsBar && (
            <div className="flex w-full px-2 md:px-4 pt-2 justify-between">
              {actionsBar}
            </div>
          )}

        </div>

        {/* SIDEBAR */}
        {sidebar && (
          <div className="
            flex flex-col
            self-stretch
            w-[40px]
            sm:w-[60px]
            md:w-[80px]
            lg:w-[100px]
            bg-red-100
          ">
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
            px-4
            mt-auto
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