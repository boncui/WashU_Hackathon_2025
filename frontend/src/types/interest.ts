// types/interest.ts
export type InterestType = "transactional" | "informational"

export interface Article {
  _id: string
  name: string
  summary: string
  link: string
  tags: string[]
  image: string
}

export interface Interest {          // the canonical “Interest” shape
  _id: string
  name: string
  type: InterestType
  update: boolean
  /**  – If the backend populates articles, you’ll get full objects.
   *   – If not populated you’ll get string IDs.
   */
  articles?: Article[] | string[]
}

/* Optional: re‑export with the “IInterest” alias so existing code keeps compiling */
export type IInterest = Interest
