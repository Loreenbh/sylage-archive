import Format from "./Format"

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export default function BookLayout({
  header,
  children,
  sidebar,
}: Props) {
  return (
    <Format>
      {/* HEADER — flexible, responsive padding */}
      {header && <div className="mb-1 sm:mb-2 md:mb-3 lg:mb-6 bg-red-200">{header}</div>}

      {/* MAIN CONTENT — flex pour distribuer, responsive gap */}
      <div className="flex flex-1 sm:gap-2 min-h-0 bg-blue-200">
        
        {/* CENTER */}
        <div className="flex-1 min-h-0 bg-yellow-200 ">
          {children}
        </div>

        {/* SIDEBAR — responsive width */}
        {sidebar && (
          <div className="min-h-0 w-[40px] sm:w-[50px] md:w-[60px] bg-green-200">
            {sidebar}
          </div>
        )}
      </div>
    </Format>
  )
}