import { colors } from "@/styles/colors";

type Props = {
  message: string;
};

export default function StatusMessage({ message }: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        h-full

      "
    >
      <p
        className={`
        text-center
        ${colors.text.charcoal70}
        text-[clamp(5px,1.1cqw,8px)]
        sm:text-[8px]
        md:text-[9px]
        lg:text-[10px]
        xl:text-[18px]
        tracking-[0.2em]
      `}
      >
        {message}
      </p>
    </div>
  );
}
