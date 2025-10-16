# Budget Tracker App

A modern budget tracking application built with Next.js, Firebase, and Tailwind CSS.

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Firebase

Create a `.env.local` file in the root directory:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

Get these values from Firebase Console > Project Settings > Your apps

### 3. Set Up Firestore Indexes

The app requires Firestore composite indexes to work properly. When you first use the app, you'll see an error with a link to create the required index.

**Quick Fix:** Click the link in the error message to create indexes automatically.

**Or deploy all indexes at once:**
\`\`\`bash
firebase deploy --only firestore:indexes
\`\`\`

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

**IMPORTANT:** After adding or modifying .env.local, restart the dev server!

### 5. Open the App

Visit http://localhost:3000

## Troubleshooting

**Firebase Configuration Error?**
- Ensure .env.local exists in root directory
- Restart dev server after creating .env.local
- Check browser console (F12) for Firebase debug messages
- Clear Next.js cache: `rm -rf .next && npm run dev`

**Firestore Index Error?**
- Click the link in the error message to create the index
- Wait 2-5 minutes for the index to build
- Check Firebase Console > Firestore Database > Indexes for status
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for more details

## Features

- User authentication (Email/Password, Google, GitHub)
- Budget planning and tracking
- Income and expense management
- Real-time data with Firebase Firestore
- Responsive design with dark mode

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Firebase
- Tailwind CSS v4
- shadcn/ui

## License

MIT
