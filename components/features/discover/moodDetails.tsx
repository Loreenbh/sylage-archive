"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"

/* STYLE */
import { typography

 } from "@/styles/typography"
type Props = {
  onNavigate: OnNavigate
params?: Record<string, any> | null
}

export default function MoodDetails({ onNavigate, params }: Props) {
const user = params?.user
  return (
    <BookLayout
      header={
        <Header
          items={[
            { label: "HOME" },
            { label: "FILTER" },
            { label: "CREATE" },
          ]}
        />
      }
      sidebar={<Sidebar text={params?.user ?? "DETAILS"} clickable={false} />}
      actionsBar={        
          <div className="flex items-center">
            
            <button 
            onClick={() => onNavigate({ to: "discover", direction: "prev" })}
            className={typography.buttonBody}>back </button>
          </div>
        }
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
      <div className="flex flex-col h-full min-h-0 gap-1">

      <SimpleGrid
        square={
            <div className="relative w-[280px] sm:w-[500px] md:w-[550px] lg:w-[750px] aspect-square mx-auto bg-red-200">
            </div>
          }
        />

      </div>
    </BookLayout>
  )
}
