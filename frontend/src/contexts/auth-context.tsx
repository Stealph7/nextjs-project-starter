"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  region?: string
  address?: string
  role: "buyer" | "seller" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: "buyer" | "seller"
  phone?: string
  region?: string
  address?: string
}

interface UpdateProfileData {
  name: string
  email: string
  phone?: string
  region?: string
  address?: string
  oldPassword?: string
  newPassword?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/users/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Échec de la connexion")
    }

    const data = await response.json()
    setUser(data.user)
    router.push("/dashboard")
  }

  const register = async (data: RegisterData) => {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Échec de l'inscription")
    }

    const result = await response.json()
    setUser(result.user)
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    const response = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Échec de la mise à jour du profil")
    }

    const updatedUser = await response.json()
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
