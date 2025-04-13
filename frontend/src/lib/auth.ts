interface User {
  _id: string
  fullName: string
  email: string
}

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
    localStorage.setItem(AUTH_TOKEN_KEY, token)
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

    return data // data is the new user (without token)
  } catch (err: any) {
    throw new Error(err.message || "Unexpected error during signup")
  }
}

// 👤 GET CURRENT USER
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null

    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// 🚪 LOGOUT
export async function signOut(): Promise<void> {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}
