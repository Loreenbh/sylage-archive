import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"
import BackButton from "@/components/ui/buttons/BackButton"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import { typography } from "@/styles/typography"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"
import { colors } from "@/styles/colors"

type Props = {
  onNavigate: (params: any) => void
  onBack?: () => void
}

export default function About({ onNavigate, onBack }: Props) {
  const { user: currentUser } = useCurrentUser()

  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate({
                  to: "discover",
                  direction: "prev",
                }),
            },
            {
              section: "FILTER",
              clickable: false,
            },
            {
              section: "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                }),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="ABOUT" clickable={false} />}
      footerLeft={<BackButton onBack={onBack} />}
      footerRight={
        <div className="flex items-center gap-4">
          <span className={typography.username}>
            {currentUser?.username}
          </span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
<SimpleGrid
  square={
    <div
      className={`
        h-full
        w-full
        ${colors.bg.earth}
        border
        border-black/10
        flex
        items-center
        justify-center
        p-4
        sm:p-8
        md:p-10
        lg:p-12
      `}
    >
      <div className="max-w-[600px] text-center">
        <p
          className={`
            ${typography.buttonBody}
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          An idea begins with a mood.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          A feeling.
          <br />
          A colour.
          <br />
          A silhouette.
          <br />
          A world.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          Share it.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          Let someone else see it differently.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          A look appears.
          <br />
          Then another.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          One universe meets another.
        </p>

        <p
          className={`
            ${typography.buttonBody}
            mt-3
            leading-[1.5]
            ${colors.text.charcoal}
          `}
        >
          SYLAGE is a quiet exchange between visions.
        </p>
      </div>
    </div>
  }
/>
    </BookLayout>
  )
}