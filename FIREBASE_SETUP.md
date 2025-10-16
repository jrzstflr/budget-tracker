# Firebase Setup Guide

## Firestore Indexes Required

This app uses composite queries that require Firestore indexes. You need to create these indexes before the app will work properly.

### Option 1: Quick Setup (Recommended)

When you see the index error in the console, Firebase provides a direct link to create the index. Simply:

1. Click the link in the error message (it looks like: `https://console.firebase.google.com/v1/r/project/...`)
2. Click "Create Index" in the Firebase Console
3. Wait 2-5 minutes for the index to build
4. Refresh your app

You'll need to do this for each collection (expenses, incomes, investments) the first time you use them.

### Option 2: Deploy All Indexes at Once

If you have Firebase CLI installed, you can deploy all indexes at once:

\`\`\`bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the indexes
firebase deploy --only firestore:indexes
\`\`\`

This will create all the required indexes from the `firestore.indexes.json` file.

### Required Indexes

The app needs the following composite indexes:

1. **expenses** collection:
   - userId (Ascending) + date (Descending)

2. **incomes** collection:
   - userId (Ascending) + date (Descending)

3. **investments** collection:
   - userId (Ascending) + date (Descending)

### Index Build Time

- Indexes typically take 2-5 minutes to build
- You can check the status in Firebase Console → Firestore Database → Indexes
- The app will work once all indexes show "Enabled" status

### Troubleshooting

If you still see index errors after creating indexes:

1. Wait a few more minutes - index building can take time
2. Check Firebase Console → Firestore Database → Indexes to see if they're still building
3. Make sure you're creating indexes for the correct project
4. Clear your browser cache and refresh the app
