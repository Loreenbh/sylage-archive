/* TYPES */
type Props = {
  children: React.ReactNode
  className?: string
}
/*-------------------------------------------------*/

export default function FooterLayout({ children, className = "" }: Props) {
  return (
    <div className={`flex items-start justify-between px-4 mt-2 sm:px-6 sm:mt-16 ${className}`}>
      {children}
    </div>
  )
}