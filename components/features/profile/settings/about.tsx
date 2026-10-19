import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";
import BackButton from "@/components/ui/buttons/BackButton";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import { typography } from "@/styles/typography";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import SimpleGrid from "@/components/ui/grids/SimpleGrid";
import { colors } from "@/styles/colors";

type Props = {
  onNavigate: (params: any) => void;
  onBack?: () => void;
};

export default function About({ onNavigate, onBack }: Props) {
  const { user: currentUser } = useCurrentUser();

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
          <span className={typography.username}>{currentUser?.username}</span>
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
        p-1
        sm:p-2
        md:p-4
        lg:p-6
        xl:p-10
      `}
          >
            <div className="w-full max-w-[600px] max-h-full overflow-y-auto text-center">
              <p
                className={`
            ${typography.about}
            leading-[1.5]
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
            ${colors.text.charcoal}
          `}
              >
                An idea begins with a mood.
              </p>

              <p
                className={`
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
            leading-[1.5]
            ${colors.text.charcoal}
          `}
              >
                A feeling.
                <br />
                A colour.
                <br />
                A silhouette.
                <br />A world.
              </p>

              <p
                className={`
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
            leading-[1.5]
            ${colors.text.charcoal}
          `}
              >
                Share it.
              </p>

              <p
                className={`
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
            leading-[1.5]
            ${colors.text.charcoal}
          `}
              >
                Let someone else see it differently.
              </p>

              <p
                className={`
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
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
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
            leading-[1.5]
            ${colors.text.charcoal}
          `}
              >
                One universe meets another.
              </p>

              <p
                className={`
            ${typography.about}
            mt-1
            sm:mt-2
            md:mt-3
            lg:mt-4
            xl:mt-6
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
  );
}
