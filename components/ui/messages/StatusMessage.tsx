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
        sm:text-[9px]
        md:text-[11px]
        lg:text-[14px]
        xl:text-[18px]
        tracking-[0.2em]
      `}
      >
        {message}
      </p>
    </div>
  );
}
