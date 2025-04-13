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

export interface Interest {
  _id: string
  name: string
  type: InterestType
  update: boolean
  articles: Article[]
}

/**
 * Alias for consistency with older components
 * Can be removed later once all components migrate to `Interest`
 */
export type IInterest = Interest
