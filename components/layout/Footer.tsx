/* TYPES */
type Props = {
  children: React.ReactNode
  className?: string
}
/*-------------------------------------------------*/

export default function FooterLayout({ children, className = "" }: Props) {
  return (
    <div className={`flex px-2 md:px-6 pt-1 pb-1 justify-between mt-0 ${className} bg-red-300`}>
      {children}
    </div>
  )
}