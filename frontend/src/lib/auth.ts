// lib/auth.ts
import { User } from "@/types/user"


interface SignInCredentials {
  email: string
  password: string
}

interface SignUpCredentials {
  fullName: string
  email: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/users"
const AUTH_TOKEN_KEY = "omnivia-auth-token"

// 🔐 LOGIN
export async function signIn({ email, password }: SignInCredentials): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Login failed")

    const { token, user } = data
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }

    return user
  } catch (err: any) {
    throw new Error(err.message || "Unexpected error during login")
  }
}

// 📝 SIGN UP
export async function signUp({ fullName, email, password }: SignUpCredentials): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Signup failed")

    return data // data is the new user object
  } catch (err: any) {
    throw new Error(err.message || "Unexpected error during signup")
  }
}

//help the InterestList(card)
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("omnivia-auth-token")
}

// 👤 GET CURRENT USER (using token from localStorage)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null
    if (!token) return null

    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) return null

    const user: User = await res.json()
    return user
  } catch (err) {
    console.error("❌ Failed to fetch current user:", err)
    return null
  }
}

// 🚪 LOGOUT
export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}
