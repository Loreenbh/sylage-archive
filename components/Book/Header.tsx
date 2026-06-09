"use client"
import Link from "next/link"
import { typography } from "@/styles/typography"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "FILTER", href: "/filter" },
  { label: "CREATE", href: "/create" },
]

export default function Header({ active, locked = false }) {
  return (
    <div className="flex w-full justify-between mt-10 px-10">
      {navItems.map(({ label, href }) => {
        const isActive = active === label

        if (locked) {
          return (
            <span
              key={label}
              className={`
                ${typography.subtitle}
                relative group cursor-not-allowed
                text-black/20
                transition-colors duration-300
                hover:text-black/35
              `}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-px bg-black/20 w-0 group-hover:w-full transition-all duration-300"
              />
            </span>
          )
        }

        return (
          <Link
            key={label}
            href={href}
            className={`
              ${typography.subtitle}
              relative group
              transition-colors duration-300
              ${isActive ? "text-black" : "text-black/40 hover:text-black/80"}
            `}
          >
            {label}
            <span
              className={`
                absolute -bottom-1 left-0 h-px bg-black
                transition-all duration-300
                ${isActive ? "w-full" : "w-0 group-hover:w-full"}
              `}
            />
          </Link>
        )
      })}
    </div>
  )
}