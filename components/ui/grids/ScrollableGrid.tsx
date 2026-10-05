import React from "react";
import { geometry } from "@/styles/geometry";

type GridItem = {
  id: string | number;
};

type Props<T extends GridItem> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
};

export default function ScrollableGrid<T extends GridItem>({
  data,
  renderItem,
  onItemClick,
}: Props<T>) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto ">
        <div className={geometry.feed.grid} style={geometry.feed.style}>
          {data.map((item) => (
            <div key={item.id} onClick={() => onItemClick?.(item)}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
