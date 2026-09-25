type Props = {
  left: React.ReactNode;
  topRight: React.ReactNode;
  bottomRight: React.ReactNode;
};

export default function LovesGrid({ left, topRight, bottomRight }: Props) {
  return (
    <div className="h-full w-full flex gap-1">
      <div className="flex-1 aspect-square h-full overflow-hidden">{left}</div>

      <div className="flex-1 h-full flex flex-col gap-1">
        <div className="flex-1 overflow-hidden">{topRight}</div>

        <div className="flex-1 overflow-hidden">{bottomRight}</div>
      </div>
    </div>
  );
}
