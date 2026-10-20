type Props = {
  square: React.ReactNode;
};

export default function SimpleGrid({ square }: Props) {
  return (
    <div className="flex h-full w-full min-w-0 min-h-0 justify-center overflow-hidden">
      <div className="relative aspect-square h-full w-auto max-h-full max-w-full min-w-0 shrink-0 overflow-hidden">
        {square}
      </div>
    </div>
  );
}
