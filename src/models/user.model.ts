export interface User {
    _id?: string
    username: string
    email?: string
    password?: string
    bggUsername?: string | null
    isGuest: boolean
    createdAt: number
  }

  interface RegisterUserInput {
    username: string
    email: string
    password: string
    bggUsername?: string
  }
  
  