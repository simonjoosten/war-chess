// Firebase configuration and authentication
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpqBsE7bqflFdor3544DSc6HbYEAT_uxw",
  authDomain: "war-chess-fa10a.firebaseapp.com",
  projectId: "war-chess-fa10a",
  storageBucket: "war-chess-fa10a.firebasestorage.app",
  messagingSenderId: "27892295459",
  appId: "1:27892295459:web:0d5ce47d3a4f226e86ce96"
}

// Initialize Firebase
let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null

export function initFirebase(): boolean {
  try {
    // Check if config is set up
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.warn('Firebase not configured - running in offline mode')
      return false
    }
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    return true
  } catch (error) {
    console.error('Firebase init error:', error)
    return false
  }
}

// User data structure
export interface UserData {
  username: string
  email: string
  createdAt: number
  lastLogin: number
  // Stats
  stats: {
    gamesPlayed: number
    gamesWon: number
    gamesLost: number
    totalPointsScored: number
    piecesEliminated: number
    engineersCaptured: number
    timePlayed: number // in seconds
  }
  // Badges
  badges: string[]
  // War Bucks
  warBucks: number
  // Settings
  settings: {
    language: string
    soundEnabled: boolean
    musicEnabled: boolean
    masterVolume: number
    musicVolume: number
    sfxVolume: number
    musicStyle: string
    boardTheme: string
    animationSpeed: string
    screenShakeEnabled: boolean
    showCoordinates: boolean
    colorBlindMode: boolean
    highContrastMode: boolean
    largeUIMode: boolean
  }
  // Bot learning data
  botLearning: Record<string, unknown>
}

// Default user data
export function getDefaultUserData(username: string, email: string): UserData {
  return {
    username,
    email,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalPointsScored: 0,
      piecesEliminated: 0,
      engineersCaptured: 0,
      timePlayed: 0
    },
    badges: [],
    warBucks: 0,
    settings: {
      language: 'en',
      soundEnabled: true,
      musicEnabled: false,
      masterVolume: 0.8,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      musicStyle: 'epic',
      boardTheme: 'classic',
      animationSpeed: 'normal',
      screenShakeEnabled: true,
      showCoordinates: true,
      colorBlindMode: false,
      highContrastMode: false,
      largeUIMode: false
    },
    botLearning: {}
  }
}

// Auth state
let currentUser: User | null = null
let currentUserData: UserData | null = null
let isOfflineMode = false
let authStateCallback: ((user: User | null) => void) | null = null

export function setAuthStateCallback(callback: (user: User | null) => void) {
  authStateCallback = callback
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      currentUser = user
      callback(user)
    })
  }
}

export function getCurrentUser(): User | null {
  return currentUser
}

export function getCurrentUserData(): UserData | null {
  return currentUserData
}

export function isOffline(): boolean {
  return isOfflineMode
}

export function setOfflineMode(offline: boolean) {
  isOfflineMode = offline
}

// Register new user
export async function registerUser(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase not initialized' }
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    const userData = getDefaultUserData(username, email)
    await setDoc(doc(db, 'users', user.uid), userData)

    currentUser = user
    currentUserData = userData

    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    let errorMessage = 'Registration failed'
    if (firebaseError.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use'
    } else if (firebaseError.code === 'auth/weak-password') {
      errorMessage = 'Password too weak (min 6 characters)'
    } else if (firebaseError.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address'
    }
    return { success: false, error: errorMessage }
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase not initialized' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      currentUserData = userDoc.data() as UserData
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), { lastLogin: Date.now() })
    } else {
      // Create user data if it doesn't exist (shouldn't happen normally)
      currentUserData = getDefaultUserData(email.split('@')[0], email)
      await setDoc(doc(db, 'users', user.uid), currentUserData)
    }

    currentUser = user

    return { success: true }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    let errorMessage = 'Login failed'
    if (firebaseError.code === 'auth/user-not-found') {
      errorMessage = 'User not found'
    } else if (firebaseError.code === 'auth/wrong-password') {
      errorMessage = 'Wrong password'
    } else if (firebaseError.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address'
    } else if (firebaseError.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password'
    }
    return { success: false, error: errorMessage }
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  if (auth) {
    await signOut(auth)
  }
  currentUser = null
  currentUserData = null
}

// Save user data to Firestore
export async function saveUserData(data: Partial<UserData>): Promise<boolean> {
  if (!db || !currentUser || isOfflineMode) {
    return false
  }

  try {
    await updateDoc(doc(db, 'users', currentUser.uid), data)
    // Update local copy
    if (currentUserData) {
      currentUserData = { ...currentUserData, ...data }
    }
    return true
  } catch (error) {
    console.error('Error saving user data:', error)
    return false
  }
}

// Load user data from Firestore
export async function loadUserData(): Promise<UserData | null> {
  if (!db || !currentUser) {
    return null
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    if (userDoc.exists()) {
      currentUserData = userDoc.data() as UserData
      return currentUserData
    }
    return null
  } catch (error) {
    console.error('Error loading user data:', error)
    return null
  }
}

// Badge definitions
export const BADGES = {
  FIRST_WIN: { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆' },
  ENGINEER_HUNTER: { id: 'engineer_hunter', name: 'Engineer Hunter', description: 'Capture 10 Engineers', icon: '🔧' },
  SHARPSHOOTER: { id: 'sharpshooter', name: 'Sharpshooter', description: 'Eliminate 100 pieces', icon: '🎯' },
  VETERAN: { id: 'veteran', name: 'Veteran', description: 'Play 50 games', icon: '⭐' },
  MASTER: { id: 'master', name: 'Master', description: 'Win 25 games', icon: '👑' },
  RICH: { id: 'rich', name: 'War Profiteer', description: 'Earn 1000 War Bucks', icon: '💰' },
  STRATEGIST: { id: 'strategist', name: 'Strategist', description: 'Score 500 total points', icon: '🧠' },
  SPEEDRUNNER: { id: 'speedrunner', name: 'Speedrunner', description: 'Win a game in under 5 minutes', icon: '⚡' },
  SURVIVOR: { id: 'survivor', name: 'Survivor', description: 'Win with less than 10 points difference', icon: '💪' },
  DOMINATOR: { id: 'dominator', name: 'Dominator', description: 'Win with over 50 points difference', icon: '🔥' }
}

// Check and award badges
export function checkBadges(userData: UserData): string[] {
  const newBadges: string[] = []

  if (!userData.badges.includes('first_win') && userData.stats.gamesWon >= 1) {
    newBadges.push('first_win')
  }
  if (!userData.badges.includes('engineer_hunter') && userData.stats.engineersCaptured >= 10) {
    newBadges.push('engineer_hunter')
  }
  if (!userData.badges.includes('sharpshooter') && userData.stats.piecesEliminated >= 100) {
    newBadges.push('sharpshooter')
  }
  if (!userData.badges.includes('veteran') && userData.stats.gamesPlayed >= 50) {
    newBadges.push('veteran')
  }
  if (!userData.badges.includes('master') && userData.stats.gamesWon >= 25) {
    newBadges.push('master')
  }
  if (!userData.badges.includes('rich') && userData.warBucks >= 1000) {
    newBadges.push('rich')
  }
  if (!userData.badges.includes('strategist') && userData.stats.totalPointsScored >= 500) {
    newBadges.push('strategist')
  }

  return newBadges
}

// Calculate War Bucks reward
export function calculateWarBucks(won: boolean, pointDifference: number): number {
  let bucks = 10 // Base reward for playing
  if (won) {
    bucks += 25 // Win bonus
    bucks += Math.floor(pointDifference / 5) // Bonus for point difference
  }
  return bucks
}
