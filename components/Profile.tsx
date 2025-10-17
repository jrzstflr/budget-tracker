"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Mail, User } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const initials =
    user.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0].toUpperCase() ||
    "U"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-primary/20">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{user.displayName || "User"}</h2>
              <p className="text-sm text-muted-foreground">Account ID: {user.uid}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4 pt-6 border-t border-border">
            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-foreground">{user.email}</p>
              </div>
            </div>

            {/* Display Name */}
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                <p className="text-foreground">{user.displayName || "Not set"}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 text-muted-foreground">📅</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                <p className="text-foreground">
                  {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-border">
            <p className="text-sm text-foreground">
              Your profile information is securely stored and managed by Firebase Authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
