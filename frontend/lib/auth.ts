// This is a mock authentication service for demo purposes
// In a real application, you would use a proper authentication system like NextAuth.js, Clerk, or Auth0

// Remove the import from next/headers
// import { cookies } from "next/headers"

interface User {
  id: string
  name: string
  email: string
}

interface SignInCredentials {
  email: string
  password: string
}

interface SignUpCredentials {
  name: string
  email: string
  password: string
}

// Mock user database
const MOCK_USER: User = {
  id: "user_1",
  name: "Demo User",
  email: "demo@shouldiq.com",
}

// Client-side storage key
const AUTH_TOKEN_KEY = "shouldiq-auth-token"

// Mock authentication functions
export async function signIn({ email, password }: SignInCredentials): Promise<User> {
  // In a real app, you would validate credentials against a database
  // For demo purposes, we'll accept any credentials
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  // Set a token in localStorage to simulate authentication
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, "mock-jwt-token")
  }

  return MOCK_USER
}

export async function signUp({ name, email, password }: SignUpCredentials): Promise<User> {
  // In a real app, you would create a new user in the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  // Set a token in localStorage to simulate authentication
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, "mock-jwt-token")
  }

  return {
    ...MOCK_USER,
    name,
    email,
  }
}

export async function signOut(): Promise<void> {
  // Delete the auth token from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // In a real app, you would verify the JWT token and fetch the user from the database
  // For client-side, check localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (!token) {
      return null
    }

    // For demo purposes, we'll return the mock user
    return MOCK_USER
  }

  return null
}
