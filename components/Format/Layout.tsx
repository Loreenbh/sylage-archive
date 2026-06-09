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
        <div className="mb-6">
          {header}
        </div>
      )}

      <div className="flex flex-1">

        <div className="flex-1">
          {children}
        </div>

        {sidebar && (
          <div className="gap-6">
            {sidebar}
          </div>
        )}

      </div>

      {footer && (
        <div className="mt-6">
          {footer}
        </div>
      )}

    </Format>
  )
}