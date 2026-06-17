import React from "react"

type Props = {
  data: any[]
  renderItem: (item: any) => React.ReactNode
}

export default function ScrollableGrid({
  data,
  renderItem,
}: Props) {
  const rows = []

  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2))
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-purple-500">
      <div className="flex flex-col gap-0.5">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-2 gap-0.5">
            {row.map((item) => (
              <div key={item.id}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}