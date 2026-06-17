type Props = {
  children: React.ReactNode
  className?: string
}

export default function FooterLayout({ children, className = "" }: Props) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 ${className}`}>
      {children}
    </div>
  )
}