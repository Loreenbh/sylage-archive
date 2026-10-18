type Props = {
  square: React.ReactNode;
};

export default function SimpleGrid({ square }: Props) {
  return (
    <div className="flex w-full min-w-0 justify-center">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden">{square}</div>
    </div>
  );
}
