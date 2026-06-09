import Format from "./Format"

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

export default function BookLayout({
  header,
  children,
  sidebar,
  footer
}: Props) {
  return (
    <Format>

      {header && (
        <div className="mb-5 bg-red-200 h-[180px]">
          {header}
        </div>
      )}

      <div className="flex flex-1 gap-0">

        <div className="flex-1 bg-pink-200">
          {children}
        </div>

        {sidebar && (
          <div className="bg-green-200">
            {sidebar}
          </div>
        )}

      </div>

      {footer && (
        <div className="mt-1 mb-5 bg-yellow-200 w-full py-7">
          {footer}
        </div>
      )}

    </Format>
  )
}