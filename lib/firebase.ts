// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyOCaw444MxtqdAF4YY0bu9ORz5oyiPQ0",
  authDomain: "final-6ca77.firebaseapp.com",
  projectId: "final-6ca77",
  storageBucket: "final-6ca77.firebasestorage.app",
  messagingSenderId: "915146538563",
  appId: "1:915146538563:web:f5de9ed0499559aca8def6",
  measurementId: "G-SCXSS7V2TR",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
