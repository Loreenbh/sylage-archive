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

export default function Privacy({ onNavigate, onBack }: Props) {
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
      sidebar={<Sidebar text="PRIVACY & TERMS" clickable={false} />}
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
              ${colors.bg.stone}
              border
              border-black/10
              flex
              items-center
              justify-center
              p-1
              sm:p-2
              md:p-3
              lg:p-4
              xl:p-6
            `}
          >
            <div className="w-full max-w-[600px] max-h-full overflow-y-auto text-center">
              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Every vision has a place here.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Profiles are open.
                <br />
                What you share can be seen by others.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Keep the space thoughtful.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                No hate.
                <br />
                No harassment.
                <br />
                No harmful, abusive or explicit content.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Share only what you have the right to share.
                <br />
                Use images that are free to use or properly licensed.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Content that does not belong here may be removed.
                <br />
                Accounts may be removed when necessary.
              </p>

              <p
                className={`
                  ${typography.privacy}
                  mt-1
                  sm:mt-2
                  md:mt-3
                  lg:mt-4
                  xl:mt-6
                  leading-[1.35]
                  text-black/70
                `}
              >
                Keep it open.
                <br />
                Keep it respectful.
                <br />
                Keep creating.
              </p>
            </div>
          </div>
        }
      />
    </BookLayout>
  );
}
