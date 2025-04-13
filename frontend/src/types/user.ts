// types/user.ts
import type { Interest } from "./interest"

export interface User {
  _id: string
  fullName: string
  email: string
  interests?: Interest[]
  following?: string[]
  followers?: string[]
  friends?: string[]
}
