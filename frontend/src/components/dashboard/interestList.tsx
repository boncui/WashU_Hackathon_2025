"use client"

import { useEffect, useState } from "react"
import InterestCard from "./interestCard"
import { Interest } from "@/types/interest"
import { Loader } from "lucide-react"

export function InterestList() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInterests() {
      try {
        const res = await fetch("/api/interests")
        const data = await res.json()
        setInterests(data)
      } catch (err) {
        console.error("Error fetching interests:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInterests()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {interests.map((interest) => (
        <InterestCard key={interest._id} interest={interest} />
      ))}
    </div>
  )
}
