// types/interest.ts
export interface IInterest {
    _id: string
    name: string
    type: "Type1" | "Type2"
    update: boolean
    articles: string[] // or article objects if populated
  }
  