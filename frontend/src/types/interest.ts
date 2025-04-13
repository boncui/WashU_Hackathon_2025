// types/interest.ts
export interface IInterest {
    _id: string
    name: string
    type: "transactional" | "informational"
    update: boolean
    articles: string[] // or article objects if populated
  }
  