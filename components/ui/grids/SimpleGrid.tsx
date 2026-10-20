type Props = {
  square: React.ReactNode;
};

export default function SimpleGrid({ square }: Props) {
  return (
    <div className="flex h-full w-full min-w-0 min-h-0 justify-center overflow-hidden">
      <div className="relative aspect-square h-auto max-h-full w-full max-w-full min-w-0 shrink-0 overflow-hidden">
        {square}
      </div>
    </div>
  );
}
