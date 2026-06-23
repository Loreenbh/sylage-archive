/* TYPES */
type Props = {
  children: React.ReactNode
  className?: string
}
/*-------------------------------------------------*/

export default function FooterLayout({ children, className = "" }: Props) {
  return (
    <div className={`flex w-full px-2 md:px-6 pt-1 pb-1 justify-between ${className} bg-purple-300`}>
      {children}
    </div>
  )
}