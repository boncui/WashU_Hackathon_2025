// types/interest.ts
// export interface IInterest {
//     _id: string
//     name: string
//     type: "transactional" | "informational"
//     update: boolean
//     articles: string[] // or article objects if populated
//   }
  

  interface Article {
    _id: string
    name: string
    summary: string
    link: string
    tags: string[]
    image: string
  }
  
  interface Interest {
    _id: string
    name: string
    type: "transactional" | "informational"
    update: boolean
    articles?: Article[]
  }
  
  export interface User {
    _id: string
    fullName: string
    email: string
    interests?: Interest[]
  }
  