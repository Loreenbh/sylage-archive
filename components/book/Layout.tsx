import Format from "../layout/Format"
import FooterLayout from "../layout/Footer"

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  sidebar?: React.ReactNode

  footer?: React.ReactNode
  footer1?: React.ReactNode
}

export default function BookLayout({
  header,
  children,
  sidebar,
  footer,
  footer1
}: Props) {
  return (
    <Format>

      {/* HEADER */}
      {header && <div>{header}</div>}

      {/* BODY
          flex-1 + min-h-0 : occupe l'espace restant sans déborder du Format
          items-center justify-center : centre le bloc carré+sidebar
      */}
      <div className="flex mt-7 items-center justify-center min-h-0">

        {/*
          WRAPPER CARRÉ + SIDEBAR
          ─────────────────────────────────────────────────────────────────
          • "inline-flex" (ou "flex") sans contrainte de hauteur externe
            laisse le carré (aspect-square) dicter librement sa hauteur.
          • "items-stretch" propage cette hauteur à la sidebar.
          • Pas de h-full ici : on laisse le contenu dimensionner le bloc.
        */}
        <div className="flex items-stretch gap-1">

          {/* CARRÉ — source de vérité de la hauteur
              La largeur responsive définit à la fois la largeur ET la hauteur
              grâce à aspect-square. La sidebar hérite de cette hauteur via
              items-stretch sur le parent.
          */}
          <div
            className="
              w-[280px]
              sm:w-[550px]
              md:w-[650px]
              lg:w-[700px]
              xl:w-[780px]
              aspect-square
              shrink-0
            "
          >
            {children}
          </div>

          {/* SIDEBAR
              ──────────────────────────────────────────────────────────────
              • "flex flex-col" pour organiser ligne + texte verticalement.
              • "self-stretch" (redondant avec items-stretch du parent,
                mais explicite et robuste) : prend exactement la hauteur
                du carré en toutes circonstances.
              • La largeur est fixe et responsive.
              • Pas de h-full sur un enfant flex direct — inutile et parfois
                source de conflits ; c'est items-stretch qui gère ça.
          */}
          {sidebar && (
            <div className="
              flex flex-col
              self-stretch
              w-[40px]
              sm:w-[60px]
              md:w-[80px]
              lg:w-[100px]
              bg-red-100
            ">
              {sidebar}
            </div>
          )}

        </div>
      </div>


              {/* FOOTER */}
      {footer && (
        <FooterLayout>
          {footer}
        </FooterLayout>
      )}
      
      {footer1 && (
        <div className="w-full flex justify-end mt-auto bg-green-200">
          {footer1}
        </div>
      )}

    </Format>
  )
}