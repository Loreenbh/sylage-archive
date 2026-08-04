import React from "react"

type Props = {
  data: any[]
  renderItem: (item: any) => React.ReactNode
  onItemClick?: (item: any) => void
}

export default function ScrollableGrid({ data, renderItem, onItemClick }: Props) {
  return (
    <div className="h-full w-full flex flex-col">

      <div className="flex-1 min-h-0 overflow-y-auto">

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}