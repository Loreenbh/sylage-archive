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
        text-[11px]
        sm:text-[14px]
        md:text-[16px]
        lg:text-[18px]
        tracking-[0.2em]
      `}
      >
        {message}
      </p>
    </div>
  );
}
