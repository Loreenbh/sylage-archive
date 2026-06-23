type Props = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function GridButton({
  children,
  onClick,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-end p-4 h-full w-full text-left
        transition-all duration-300
        hover:translate-y-[-2px]
        hover:shadow-sm
        ${className}
      `}
    >
      {children}
    </button>
  )
}