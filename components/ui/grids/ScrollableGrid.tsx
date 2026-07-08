import React from "react"

type Props = {
  data: any[]
  renderItem: (item: any) => React.ReactNode
  onItemClick?: (item: any) => void
}

export default function ScrollableGrid({ data, renderItem, onItemClick }: Props) {
  const rows: any[][] = []

  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2))
  }

  return (
    <div className="h-full w-full flex flex-col">

      {/* SCROLL AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto">

        <div className="flex flex-col gap-4">

          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-2 gap-4"
            >
              {row.map((item) => (
                <div key={item.id}
                  onClick={() => onItemClick?.(item)}>
                  {renderItem(item)}
                </div>
              ))}
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}