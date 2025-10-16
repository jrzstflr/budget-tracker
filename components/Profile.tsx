"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { useState } from "react"

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Please log in to view your profile</p>
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

  const createdDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown"

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your personal details and account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member since {createdDate}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
              </Label>
              <Input
                id="displayName"
                value={user.displayName || ""}
                disabled={!isEditing}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Email Verified
              </Label>
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    user.emailVerified
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Sign In
              </Label>
              <div className="px-3 py-2 rounded-md bg-muted text-sm">
                {user.metadata.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleString()
                  : "Unknown"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Method Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Authentication
          </CardTitle>
          <CardDescription>Your sign-in method and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Sign-in Provider</p>
                <p className="text-sm text-muted-foreground">
                  {user.providerData[0]?.providerId === "google.com"
                    ? "Google"
                    : user.providerData[0]?.providerId === "github.com"
                    ? "GitHub"
                    : "Email/Password"}
                </p>
              </div>
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Active
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Security Tip:</strong> Keep your account secure by using a strong password and enabling
                two-factor authentication when available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User ID Card (for developers) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Developer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-xs">User ID</Label>
            <div className="p-2 bg-muted rounded font-mono text-xs break-all">{user.uid}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}