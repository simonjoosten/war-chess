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
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  getDocs
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
    // Check if username is already taken
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
    if (usernameDoc.exists()) {
      return { success: false, error: 'Username already taken' }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    const userData = getDefaultUserData(username, email)
    await setDoc(doc(db, 'users', user.uid), userData)

    // Create username -> email mapping (public, for login lookup)
    await setDoc(doc(db, 'usernames', username.toLowerCase()), {
      email: email,
      uid: user.uid
    })

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

// Find email by username (uses public usernames collection)
async function findEmailByUsername(username: string): Promise<string | null> {
  if (!db) return null

  try {
    // Look up in the public usernames collection
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
    if (usernameDoc.exists()) {
      return usernameDoc.data().email
    }
    return null
  } catch (error) {
    console.error('Error finding email by username:', error)
    return null
  }
}

// Login user (accepts username or email)
export async function loginUser(usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase not initialized' }
  }

  try {
    // Check if input is email or username
    let email = usernameOrEmail
    if (!usernameOrEmail.includes('@')) {
      // It's a username, look up the email
      const foundEmail = await findEmailByUsername(usernameOrEmail)
      if (!foundEmail) {
        return { success: false, error: 'User not found' }
      }
      email = foundEmail
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      currentUserData = userDoc.data() as UserData
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), { lastLogin: Date.now() })

      // Auto-create username mapping if it doesn't exist (for existing users)
      const usernameDoc = await getDoc(doc(db, 'usernames', currentUserData.username.toLowerCase()))
      if (!usernameDoc.exists()) {
        await setDoc(doc(db, 'usernames', currentUserData.username.toLowerCase()), {
          email: currentUserData.email,
          uid: user.uid
        })
      }
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
      errorMessage = 'Invalid username or password'
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

// ==================== MULTIPLAYER ====================

// Online player type
export interface OnlinePlayer {
  id: string
  username: string
  lastSeen: number
  status: 'available' | 'playing'
}

// Game invite type
export interface GameInvite {
  id: string
  fromUserId: string
  fromUsername: string
  toUserId: string
  createdAt: Timestamp
  status: 'pending' | 'accepted' | 'declined'
}

// Multiplayer game state
export interface MultiplayerGame {
  id: string
  yellowPlayerId: string
  yellowUsername: string
  greenPlayerId: string
  greenUsername: string
  gameState: unknown
  currentTurn: 'yellow' | 'green'
  createdAt: Timestamp
  lastMove: Timestamp
  status: 'playing' | 'finished'
  winner?: 'yellow' | 'green'
}

// Listeners
let onlinePlayersUnsubscribe: (() => void) | null = null
let invitesUnsubscribe: (() => void) | null = null
let gameUnsubscribe: (() => void) | null = null

// Online players list
let onlinePlayers: OnlinePlayer[] = []
let onlinePlayersCallback: ((players: OnlinePlayer[]) => void) | null = null

// Game invites
let gameInvites: GameInvite[] = []
let invitesCallback: ((invites: GameInvite[]) => void) | null = null

// Current multiplayer game
let currentMultiplayerGame: MultiplayerGame | null = null
let gameCallback: ((game: MultiplayerGame | null) => void) | null = null

// Set user as online
export async function setOnline(): Promise<void> {
  if (!db || !currentUser || !currentUserData || isOfflineMode) return

  try {
    await setDoc(doc(db, 'online', currentUser.uid), {
      id: currentUser.uid,
      username: currentUserData.username,
      lastSeen: serverTimestamp(),
      status: 'available'
    })
  } catch (error) {
    console.error('Error setting online:', error)
  }
}

// Set user as offline
export async function setOffline(): Promise<void> {
  if (!db || !currentUser) return

  try {
    await deleteDoc(doc(db, 'online', currentUser.uid))
  } catch (error) {
    console.error('Error setting offline:', error)
  }
}

// Listen for online players
export function listenToOnlinePlayers(callback: (players: OnlinePlayer[]) => void): void {
  if (!db) return

  onlinePlayersCallback = callback

  // Clean up existing listener
  if (onlinePlayersUnsubscribe) {
    onlinePlayersUnsubscribe()
  }

  const q = query(collection(db, 'online'))
  onlinePlayersUnsubscribe = onSnapshot(q, (snapshot) => {
    onlinePlayers = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      // Don't include self
      if (currentUser && doc.id !== currentUser.uid) {
        onlinePlayers.push({
          id: doc.id,
          username: data.username,
          lastSeen: data.lastSeen?.toMillis() || Date.now(),
          status: data.status
        } as OnlinePlayer)
      }
    })
    if (onlinePlayersCallback) {
      onlinePlayersCallback(onlinePlayers)
    }
  })
}

// Stop listening to online players
export function stopListeningToOnlinePlayers(): void {
  if (onlinePlayersUnsubscribe) {
    onlinePlayersUnsubscribe()
    onlinePlayersUnsubscribe = null
  }
}

// Send game invite
export async function sendGameInvite(toUserId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    const inviteRef = doc(collection(db, 'invites'))
    await setDoc(inviteRef, {
      fromUserId: currentUser.uid,
      fromUsername: currentUserData.username,
      toUserId: toUserId,
      createdAt: serverTimestamp(),
      status: 'pending'
    })
    return true
  } catch (error) {
    console.error('Error sending invite:', error)
    return false
  }
}

// Listen for incoming invites
export function listenToInvites(callback: (invites: GameInvite[]) => void): void {
  if (!db || !currentUser) return

  invitesCallback = callback

  // Clean up existing listener
  if (invitesUnsubscribe) {
    invitesUnsubscribe()
  }

  const q = query(
    collection(db, 'invites'),
    where('toUserId', '==', currentUser.uid),
    where('status', '==', 'pending')
  )

  invitesUnsubscribe = onSnapshot(q, (snapshot) => {
    gameInvites = []
    snapshot.forEach((docSnap) => {
      gameInvites.push({
        id: docSnap.id,
        ...docSnap.data()
      } as GameInvite)
    })
    if (invitesCallback) {
      invitesCallback(gameInvites)
    }
  })
}

// Stop listening to invites
export function stopListeningToInvites(): void {
  if (invitesUnsubscribe) {
    invitesUnsubscribe()
    invitesUnsubscribe = null
  }
}

// Accept invite and create game
export async function acceptInvite(inviteId: string): Promise<string | null> {
  if (!db || !currentUser || !currentUserData) return null

  try {
    // Get invite data
    const inviteDoc = await getDoc(doc(db, 'invites', inviteId))
    if (!inviteDoc.exists()) return null

    const inviteData = inviteDoc.data()

    // Create game
    const gameRef = doc(collection(db, 'games'))
    await setDoc(gameRef, {
      yellowPlayerId: inviteData.fromUserId,
      yellowUsername: inviteData.fromUsername,
      greenPlayerId: currentUser.uid,
      greenUsername: currentUserData.username,
      currentTurn: 'yellow',
      createdAt: serverTimestamp(),
      lastMove: serverTimestamp(),
      status: 'playing',
      gameState: null // Will be set when game starts
    })

    // Update invite status
    await updateDoc(doc(db, 'invites', inviteId), {
      status: 'accepted',
      gameId: gameRef.id
    })

    return gameRef.id
  } catch (error) {
    console.error('Error accepting invite:', error)
    return null
  }
}

// Decline invite
export async function declineInvite(inviteId: string): Promise<void> {
  if (!db) return

  try {
    await updateDoc(doc(db, 'invites', inviteId), {
      status: 'declined'
    })
  } catch (error) {
    console.error('Error declining invite:', error)
  }
}

// Listen to a specific game
export function listenToGame(gameId: string, callback: (game: MultiplayerGame | null) => void): void {
  if (!db) return

  gameCallback = callback

  // Clean up existing listener
  if (gameUnsubscribe) {
    gameUnsubscribe()
  }

  gameUnsubscribe = onSnapshot(doc(db, 'games', gameId), (docSnap) => {
    if (docSnap.exists()) {
      currentMultiplayerGame = {
        id: docSnap.id,
        ...docSnap.data()
      } as MultiplayerGame
    } else {
      currentMultiplayerGame = null
    }
    if (gameCallback) {
      gameCallback(currentMultiplayerGame)
    }
  })
}

// Stop listening to game
export function stopListeningToGame(): void {
  if (gameUnsubscribe) {
    gameUnsubscribe()
    gameUnsubscribe = null
  }
  currentMultiplayerGame = null
}

// Update game state
export async function updateGameState(gameId: string, gameState: unknown, currentTurn: 'yellow' | 'green'): Promise<boolean> {
  if (!db) return false

  try {
    await updateDoc(doc(db, 'games', gameId), {
      gameState,
      currentTurn,
      lastMove: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating game:', error)
    return false
  }
}

// End game
export async function endGame(gameId: string, winner: 'yellow' | 'green'): Promise<boolean> {
  if (!db) return false

  try {
    await updateDoc(doc(db, 'games', gameId), {
      status: 'finished',
      winner
    })
    return true
  } catch (error) {
    console.error('Error ending game:', error)
    return false
  }
}

// Get online players count
export function getOnlinePlayers(): OnlinePlayer[] {
  return onlinePlayers
}

// Get current invites
export function getInvites(): GameInvite[] {
  return gameInvites
}

// Get current multiplayer game
export function getCurrentGame(): MultiplayerGame | null {
  return currentMultiplayerGame
}
