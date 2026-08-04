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
      <div className="flex mt-5 items-stretch justify-center flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="flex flex-col ml-6">
          {/* IMAGE */}
          <div
            className="
              w-[270px]
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
          {actionsBar && (
            <div className="flex w-full md:px-4">
              {actionsBar}
            </div>
          )}
        </div>
        {/* SIDEBAR */}
        {sidebar && (
          <div className="
            flex 
            flex-col
            self-stretch
            w-[40px]
            sm:w-[60px]
            md:w-[80px]
            lg:w-[100px]
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
            px-2
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