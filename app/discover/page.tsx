import FormatDoublePage from "@/components/FormatDoublePage"
import Header from "@/components/Header"

export default function PageDiscover() {
  return (
    <FormatDoublePage>
      <div className="w-full md:w-1/2">
        PAGE LEFT
      </div>
      <div className="w-full md:w-1/2">
        PAGE RIGHT
      </div>
      <Header />
    </FormatDoublePage>
  )
}