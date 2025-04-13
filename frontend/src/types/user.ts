// types/user.ts

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
  articles?: Article[]
}

export interface User {
  _id: string
  fullName: string
  email: string
  interests?: Interest[]
  following?: string[]        // User IDs
  followers?: string[]        // User IDs
  friends?: string[]          // Mutual User IDs
}
