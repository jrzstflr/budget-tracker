"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      setError("Firebase is not configured. Please add your Firebase credentials to environment variables.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("[v0] Auth state change error:", error)
        setError(error.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase not configured")
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: "select_account",
      })
      setError(null)
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in with Google"
      setError(errorMessage)
      throw err
    }
  }

  const signInWithGithub = async () => {
    if (!auth) throw new Error("Firebase not configured")
    try {
      const provider = new GithubAuthProvider()
      provider.addScope("user:email")
      setError(null)
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in with GitHub"
      setError(errorMessage)
      throw err
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured")
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in with email"
      setError(errorMessage)
      throw err
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured")
    try {
      setError(null)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign up with email"
      setError(errorMessage)
      throw err
    }
  }

  const signOut = async () => {
    if (!auth) throw new Error("Firebase not configured")
    try {
      setError(null)
      await firebaseSignOut(auth)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign out"
      setError(errorMessage)
      throw err
    }
  }

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
