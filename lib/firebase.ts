import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate required Firebase config
const isConfigValid = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
)

if (!isConfigValid) {
  console.error("Firebase configuration is incomplete. Please check your .env.local file and restart the dev server.")
}

// Initialize Firebase (singleton pattern)
let app = null
if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Initialize services
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// Initialize Analytics (client-side only)
export const analytics =
  app && typeof window !== "undefined" ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)) : null

export default app
