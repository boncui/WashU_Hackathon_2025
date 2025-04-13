// This is a mock authentication service for demo purposes
// In a real application, you would use a proper authentication system like NextAuth.js, Clerk, or Auth0

import { cookies } from "next/headers"

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

// Mock authentication functions
export async function signIn({ email, password }: SignInCredentials): Promise<User> {
  // In a real app, you would validate credentials against a database
  // For demo purposes, we'll accept any credentials
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  // Set a cookie to simulate authentication
  cookies().set("auth-token", "mock-jwt-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return MOCK_USER
}

export async function signUp({ name, email, password }: SignUpCredentials): Promise<User> {
  // In a real app, you would create a new user in the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  // Set a cookie to simulate authentication
  cookies().set("auth-token", "mock-jwt-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    ...MOCK_USER,
    name,
    email,
  }
}

export async function signOut(): Promise<void> {
  // Delete the auth cookie
  cookies().delete("auth-token")
}

export async function getCurrentUser(): Promise<User | null> {
  // In a real app, you would verify the JWT token and fetch the user from the database
  const token = cookies().get("auth-token")

  if (!token) {
    return null
  }

  // For demo purposes, we'll return the mock user
  return MOCK_USER
}
