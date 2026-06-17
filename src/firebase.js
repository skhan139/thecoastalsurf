import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'coastalsurf',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasRequiredConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
)

let db = null
let analytics = null
let auth = null

if (hasRequiredConfig) {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)

  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    try {
      analytics = getAnalytics(app)
    } catch {
      analytics = null
    }
  }
  try {
    auth = getAuth(app)
  } catch {
    auth = null
  }
}

if (!hasRequiredConfig) {
  // Helpful debug output when env vars are missing or not loaded by Vite
  // Do not log secret values — only indicate presence/absence.
  // Restart the dev server after adding `.env.local` so Vite picks up the vars.
  // eslint-disable-next-line no-console
  console.warn('Firebase config incomplete. Set VITE_FIREBASE_* env vars and restart dev server.')
} else {
  // eslint-disable-next-line no-console
  console.info('Firebase configuration loaded.')
}

export { db, analytics, hasRequiredConfig, auth }
