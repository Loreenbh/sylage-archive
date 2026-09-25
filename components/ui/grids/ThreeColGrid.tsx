type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full overflow-hidden aspect-square relative">
      {children}
    </div>
  );
}

export default function ThreeColGrid({ left, center, right }: Props) {
  return (
    <div className="w-full h-full flex gap-1">
      <Cell>{left}</Cell>
      <Cell>{center}</Cell>
      <Cell>{right}</Cell>
    </div>
  );
}
