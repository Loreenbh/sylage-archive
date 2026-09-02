type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function GridButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-end p-4 h-full w-full text-left
        transition-all duration-300
        ${!disabled ? `
          hover:translate-y-[-2px]
          hover:shadow-sm
        ` : ""}
        ${className}
      `}
    >
      {children}
    </button>
  )
}