"use client"

import { useEffect, useState } from "react"
import InterestCard from "./interestCard"
import { IInterest } from "@/types/interest"
import { Loader } from "lucide-react"

/* Strip the trailing “…/users” if it’s there */
const API_ROOT =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001").replace(
    /\/users\/?$/i,
    "",
  )

export function InterestList({
  userId,
  token,
}: {
  userId: string
  token: string
}) {
  const [interests, setInterests] = useState<IInterest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInterests() {
      try {
        const res = await fetch(`${API_ROOT}/users/${userId}/interests`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Backend error ${res.status}: ${text}`)
        }

        setInterests(await res.json()) // already populated with articles
      } catch (err) {
        console.error("Error fetching interests:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInterests()
  }, [userId, token])

  /* ------------- UI states ------------- */
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )

  if (interests.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        You haven’t added any interests yet.
      </p>
    )

  /* ------------- Render cards ----------- */
  return (
    <div className="flex flex-col gap-6 w-full">
      {interests.map((i) => (
        <InterestCard key={i._id} interest={i} />
      ))}
    </div>
  )
}
