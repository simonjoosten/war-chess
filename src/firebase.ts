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
// Admin emails - these users have admin access
export const ADMIN_EMAILS = [
  'lijndersromijn@gmail.com',
  'sptjoosten@icloud.com'
]

export interface UserData {
  username: string
  email: string
  createdAt: number
  lastLogin: number
  isAdmin?: boolean
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
  // Purchased shop items
  purchasedItems: string[]
  // Equipped items (active cosmetics)
  equippedItems: {
    theme: string | null
    pieceSkin: string | null
    effect: string | null
    soundPack: string | null
    musicPack: string | null
  }
  // War Pass progress
  warPass: {
    claimedRewards: string[]  // Challenge IDs that have been claimed
    completedCount: number    // How many times completed all challenges
    lastResetTime: number     // Timestamp of last reset
  }
}

// Shop items for sale
export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  type: 'theme' | 'piece_skin' | 'effect' | 'sound_pack' | 'music_pack'
  icon: string
  // Theme colors (for themes)
  colors?: {
    light: string
    dark: string
    accent: string
    water: string
  }
  // Piece skin style (for skins) - changes actual piece appearance
  skinStyle?: 'robot' | 'medieval' | 'scifi' | 'pixel' | 'minimal' | 'cartoon' | 'military' | 'fantasy'
  // Piece color modifier (for skins)
  pieceColor?: {
    yellow: string
    green: string
    accent?: string
  }
  // Effect type
  effectType?: 'fire' | 'lightning' | 'sparkle' | 'smoke' | 'hearts' | 'stars' | 'explosion' | 'ghost'
  // Sound/music pack ID
  packId?: string
}

export const SHOP_ITEMS: ShopItem[] = [
  // Board Themes
  { id: 'theme_desert', name: 'Desert Camo', description: 'Sandy desert battlefield theme', price: 100, type: 'theme', icon: '🏜️',
    colors: { light: '#d4a574', dark: '#8b6914', accent: '#c4a35a', water: '#4a90a4' } },
  { id: 'theme_arctic', name: 'Arctic Snow', description: 'Cold snowy battlefield theme', price: 100, type: 'theme', icon: '❄️',
    colors: { light: '#e8f4f8', dark: '#a8c8d8', accent: '#c0dce8', water: '#5588aa' } },
  { id: 'theme_jungle', name: 'Jungle Warfare', description: 'Dense jungle battlefield theme', price: 150, type: 'theme', icon: '🌴',
    colors: { light: '#7cb342', dark: '#33691e', accent: '#558b2f', water: '#00695c' } },
  { id: 'theme_night', name: 'Night Ops', description: 'Dark nighttime tactical theme', price: 200, type: 'theme', icon: '🌙',
    colors: { light: '#37474f', dark: '#1a237e', accent: '#263238', water: '#0d47a1' } },
  { id: 'theme_ocean', name: 'Ocean Assault', description: 'Deep sea naval theme', price: 150, type: 'theme', icon: '🌊',
    colors: { light: '#4fc3f7', dark: '#0277bd', accent: '#29b6f6', water: '#01579b' } },
  { id: 'theme_lava', name: 'Volcanic', description: 'Fiery volcanic battlefield', price: 200, type: 'theme', icon: '🌋',
    colors: { light: '#ff7043', dark: '#bf360c', accent: '#e64a19', water: '#ff5722' } },
  { id: 'theme_space', name: 'Space Battle', description: 'Galactic warfare theme', price: 250, type: 'theme', icon: '🚀',
    colors: { light: '#7c4dff', dark: '#311b92', accent: '#651fff', water: '#6200ea' } },
  { id: 'theme_candy', name: 'Candy Land', description: 'Sweet colorful theme', price: 150, type: 'theme', icon: '🍬',
    colors: { light: '#ffb6c1', dark: '#ff69b4', accent: '#ff1493', water: '#87ceeb' } },
  { id: 'theme_forest', name: 'Enchanted Forest', description: 'Magical forest theme', price: 175, type: 'theme', icon: '🌲',
    colors: { light: '#90ee90', dark: '#228b22', accent: '#006400', water: '#20b2aa' } },
  { id: 'theme_sunset', name: 'Sunset', description: 'Beautiful sunset colors', price: 125, type: 'theme', icon: '🌅',
    colors: { light: '#ffa07a', dark: '#ff6347', accent: '#ff4500', water: '#4169e1' } },

  // Piece Skins - with actual different designs
  { id: 'skin_robot', name: 'Robot Army', description: 'Mechanical robot pieces with gears and lights', price: 350, type: 'piece_skin', icon: '🤖',
    skinStyle: 'robot', pieceColor: { yellow: '#00ffff', green: '#ff00ff', accent: '#ffffff' } },
  { id: 'skin_medieval', name: 'Medieval Knights', description: 'Classic medieval armor and weapons', price: 300, type: 'piece_skin', icon: '⚔️',
    skinStyle: 'medieval', pieceColor: { yellow: '#c0c0c0', green: '#8b4513', accent: '#ffd700' } },
  { id: 'skin_scifi', name: 'Sci-Fi Troopers', description: 'Futuristic space soldiers with laser weapons', price: 400, type: 'piece_skin', icon: '🚀',
    skinStyle: 'scifi', pieceColor: { yellow: '#00ff00', green: '#0080ff', accent: '#ff0080' } },
  { id: 'skin_pixel', name: 'Pixel Warriors', description: 'Retro 8-bit pixelated pieces', price: 250, type: 'piece_skin', icon: '👾',
    skinStyle: 'pixel', pieceColor: { yellow: '#ffff00', green: '#00ff00', accent: '#ff0000' } },
  { id: 'skin_minimal', name: 'Minimalist', description: 'Clean simple geometric shapes', price: 200, type: 'piece_skin', icon: '⬜',
    skinStyle: 'minimal', pieceColor: { yellow: '#ffd700', green: '#32cd32', accent: '#000000' } },
  { id: 'skin_cartoon', name: 'Cartoon Army', description: 'Fun cartoon style with big eyes', price: 275, type: 'piece_skin', icon: '😊',
    skinStyle: 'cartoon', pieceColor: { yellow: '#ffcc00', green: '#66cc66', accent: '#ffffff' } },
  { id: 'skin_military', name: 'Modern Military', description: 'Realistic military equipment', price: 325, type: 'piece_skin', icon: '🎖️',
    skinStyle: 'military', pieceColor: { yellow: '#556b2f', green: '#2f4f4f', accent: '#d2691e' } },
  { id: 'skin_fantasy', name: 'Fantasy Heroes', description: 'Magical wizards, dragons and heroes', price: 450, type: 'piece_skin', icon: '🧙',
    skinStyle: 'fantasy', pieceColor: { yellow: '#9400d3', green: '#00ced1', accent: '#ffd700' } },

  // Effects
  { id: 'effect_fire', name: 'Fire Trail', description: 'Pieces leave fire particles when moving', price: 250, type: 'effect', icon: '🔥', effectType: 'fire' },
  { id: 'effect_lightning', name: 'Lightning Strike', description: 'Electric bolts on captures', price: 300, type: 'effect', icon: '⚡', effectType: 'lightning' },
  { id: 'effect_sparkle', name: 'Sparkle', description: 'Sparkly star effects on moves', price: 150, type: 'effect', icon: '✨', effectType: 'sparkle' },
  { id: 'effect_smoke', name: 'Smoke Trail', description: 'Smoky trail behind pieces', price: 175, type: 'effect', icon: '💨', effectType: 'smoke' },
  { id: 'effect_hearts', name: 'Love Trail', description: 'Hearts appear when moving', price: 200, type: 'effect', icon: '❤️', effectType: 'hearts' },
  { id: 'effect_stars', name: 'Stardust', description: 'Star particles on all actions', price: 225, type: 'effect', icon: '⭐', effectType: 'stars' },
  { id: 'effect_explosion', name: 'Big Boom', description: 'Extra explosion effects on captures', price: 275, type: 'effect', icon: '💥', effectType: 'explosion' },
  { id: 'effect_ghost', name: 'Ghost Trail', description: 'Ghostly afterimages when moving', price: 300, type: 'effect', icon: '👻', effectType: 'ghost' },

  // Sound Packs
  { id: 'sound_retro', name: 'Retro Sounds', description: '8-bit arcade style sound effects', price: 150, type: 'sound_pack', icon: '🕹️', packId: 'retro' },
  { id: 'sound_scifi', name: 'Sci-Fi Sounds', description: 'Futuristic laser and tech sounds', price: 175, type: 'sound_pack', icon: '🛸', packId: 'scifi' },
  { id: 'sound_cartoon', name: 'Cartoon Sounds', description: 'Fun bouncy cartoon sounds', price: 125, type: 'sound_pack', icon: '🎪', packId: 'cartoon' },
  { id: 'sound_war', name: 'War Sounds', description: 'Realistic military sound effects', price: 200, type: 'sound_pack', icon: '💣', packId: 'war' },
  { id: 'sound_nature', name: 'Nature Sounds', description: 'Calm natural ambient sounds', price: 150, type: 'sound_pack', icon: '🌿', packId: 'nature' },

  // Music Packs
  { id: 'music_electronic', name: 'Electronic Beats', description: 'Pumping electronic music', price: 200, type: 'music_pack', icon: '🎧', packId: 'electronic' },
  { id: 'music_orchestral', name: 'Orchestral', description: 'Epic orchestral soundtrack', price: 250, type: 'music_pack', icon: '🎻', packId: 'orchestral' },
  { id: 'music_chiptune', name: 'Chiptune', description: 'Retro 8-bit music', price: 175, type: 'music_pack', icon: '🎮', packId: 'chiptune' },
  { id: 'music_jazz', name: 'Smooth Jazz', description: 'Relaxing jazz music', price: 200, type: 'music_pack', icon: '🎷', packId: 'jazz' },
  { id: 'music_rock', name: 'Rock & Roll', description: 'Energetic rock music', price: 225, type: 'music_pack', icon: '🎸', packId: 'rock' },
]

// War Pass Challenges
export interface WarPassChallenge {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  stat: 'gamesWon' | 'gamesPlayed' | 'piecesEliminated' | 'engineersCaptured' | 'totalPointsScored'
  reward: {
    type: 'warBucks' | 'item'
    amount?: number
    itemId?: string
  }
}

export const WAR_PASS_CHALLENGES: WarPassChallenge[] = [
  // Easy challenges
  { id: 'play_1', name: 'First Steps', description: 'Play 1 game', icon: '🎮', requirement: 1, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 25 } },
  { id: 'win_1', name: 'First Victory', description: 'Win 1 game', icon: '🏆', requirement: 1, stat: 'gamesWon',
    reward: { type: 'warBucks', amount: 50 } },
  { id: 'eliminate_5', name: 'Rookie Hunter', description: 'Eliminate 5 pieces', icon: '🎯', requirement: 5, stat: 'piecesEliminated',
    reward: { type: 'warBucks', amount: 30 } },
  // Medium challenges
  { id: 'play_5', name: 'Getting Started', description: 'Play 5 games', icon: '🎲', requirement: 5, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 75 } },
  { id: 'win_3', name: 'Hat Trick', description: 'Win 3 games', icon: '🥉', requirement: 3, stat: 'gamesWon',
    reward: { type: 'warBucks', amount: 100 } },
  { id: 'eliminate_25', name: 'Skilled Hunter', description: 'Eliminate 25 pieces', icon: '💥', requirement: 25, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'effect_sparkle' } },
  { id: 'engineer_3', name: 'Engineer Hunter', description: 'Capture 3 engineers', icon: '🔧', requirement: 3, stat: 'engineersCaptured',
    reward: { type: 'warBucks', amount: 100 } },
  // Hard challenges
  { id: 'play_10', name: 'Dedicated Player', description: 'Play 10 games', icon: '⭐', requirement: 10, stat: 'gamesPlayed',
    reward: { type: 'item', itemId: 'theme_desert' } },
  { id: 'win_5', name: 'Champion', description: 'Win 5 games', icon: '🏅', requirement: 5, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_stealth' } },
  { id: 'eliminate_50', name: 'Elite Hunter', description: 'Eliminate 50 pieces', icon: '🔥', requirement: 50, stat: 'piecesEliminated',
    reward: { type: 'warBucks', amount: 200 } },
  { id: 'points_100', name: 'Point Master', description: 'Score 100 total points', icon: '💯', requirement: 100, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'theme_arctic' } },
  // Expert challenges
  { id: 'win_10', name: 'War Hero', description: 'Win 10 games', icon: '🎖️', requirement: 10, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_gold' } },
  { id: 'eliminate_100', name: 'Legendary Hunter', description: 'Eliminate 100 pieces', icon: '👑', requirement: 100, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'effect_fire' } },
  { id: 'engineer_10', name: 'Engineer Master', description: 'Capture 10 engineers', icon: '⚙️', requirement: 10, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'theme_night' } },
  { id: 'points_500', name: 'Score Legend', description: 'Score 500 total points', icon: '🌟', requirement: 500, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'skin_rainbow' } },
]

// Get scaled War Pass challenges based on completion count
// Each completion increases requirements by 50%
export function getScaledWarPassChallenges(completedCount: number): WarPassChallenge[] {
  const multiplier = 1 + (completedCount * 0.5) // 1x, 1.5x, 2x, 2.5x, etc.

  return WAR_PASS_CHALLENGES.map(challenge => ({
    ...challenge,
    requirement: Math.ceil(challenge.requirement * multiplier),
    // Update description with new requirement
    description: challenge.description.replace(/\d+/, String(Math.ceil(challenge.requirement * multiplier)))
  }))
}

// Default user data
export function getDefaultUserData(username: string, email: string): UserData {
  return {
    username,
    email,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
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
    botLearning: {},
    purchasedItems: [],
    equippedItems: {
      theme: null,
      pieceSkin: null,
      effect: null,
      soundPack: null,
      musicPack: null
    },
    warPass: {
      claimedRewards: [],
      completedCount: 0,
      lastResetTime: Date.now()
    }
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
    // Create Firebase auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    const userData = getDefaultUserData(username, email)
    await setDoc(doc(db, 'users', user.uid), userData)

    // Try to create username -> email mapping (optional, for login by username)
    try {
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        email: email,
        uid: user.uid
      })
    } catch (e) {
      console.log('Could not create username mapping')
    }

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
      // It's a username, try to look up the email
      const foundEmail = await findEmailByUsername(usernameOrEmail)
      if (!foundEmail) {
        // Username lookup failed, tell user to use email instead
        return { success: false, error: 'Username not found. Try your email.' }
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
      // Wrapped in try-catch so login doesn't fail if this fails
      try {
        const usernameDoc = await getDoc(doc(db, 'usernames', currentUserData.username.toLowerCase()))
        if (!usernameDoc.exists()) {
          await setDoc(doc(db, 'usernames', currentUserData.username.toLowerCase()), {
            email: currentUserData.email,
            uid: user.uid
          })
        }
      } catch (e) {
        console.log('Could not create username mapping, will retry later')
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
  DOMINATOR: { id: 'dominator', name: 'Dominator', description: 'Win with over 50 points difference', icon: '🔥' },
  // War Pass badges
  WAR_PASS_1: { id: 'war_pass_1', name: 'War Pass Rookie', description: 'Complete the War Pass 1 time', icon: '🎖️' },
  WAR_PASS_5: { id: 'war_pass_5', name: 'War Pass Veteran', description: 'Complete the War Pass 5 times', icon: '🏅' },
  WAR_PASS_10: { id: 'war_pass_10', name: 'War Pass Legend', description: 'Complete the War Pass 10 times', icon: '🥇' }
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
  // War Pass badges
  const warPassCount = userData.warPass?.completedCount || 0
  if (!userData.badges.includes('war_pass_1') && warPassCount >= 1) {
    newBadges.push('war_pass_1')
  }
  if (!userData.badges.includes('war_pass_5') && warPassCount >= 5) {
    newBadges.push('war_pass_5')
  }
  if (!userData.badges.includes('war_pass_10') && warPassCount >= 10) {
    newBadges.push('war_pass_10')
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
  timerEnabled?: boolean
  timerMinutes?: number
  gameId?: string
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
  lastMoveBy?: 'yellow' | 'green' // Track who made the last move
  moveCount?: number // Track total moves for sync verification
  createdAt: Timestamp
  lastMove: Timestamp
  status: 'waiting' | 'playing' | 'finished'
  winner?: 'yellow' | 'green'
  timerEnabled?: boolean
  timerMinutes?: number
  yellowJoined?: boolean
  greenJoined?: boolean
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

// Send game invite with optional timer settings
export async function sendGameInvite(toUserId: string, timerEnabled: boolean = false, timerMinutes: number = 10): Promise<string | null> {
  if (!db || !currentUser || !currentUserData) return null

  try {
    const inviteRef = doc(collection(db, 'invites'))
    await setDoc(inviteRef, {
      fromUserId: currentUser.uid,
      fromUsername: currentUserData.username,
      toUserId: toUserId,
      createdAt: serverTimestamp(),
      status: 'pending',
      timerEnabled: timerEnabled,
      timerMinutes: timerMinutes
    })
    return inviteRef.id
  } catch (error) {
    console.error('Error sending invite:', error)
    return null
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

// Sent invites listener
let sentInvitesUnsubscribe: (() => void) | null = null
let sentInvitesCallback: ((invite: GameInvite & { gameId?: string }) => void) | null = null

// Listen for updates to invites YOU sent
export function listenToSentInvites(callback: (invite: GameInvite & { gameId?: string }) => void): void {
  if (!db || !currentUser) return

  sentInvitesCallback = callback

  if (sentInvitesUnsubscribe) {
    sentInvitesUnsubscribe()
  }

  const q = query(
    collection(db, 'invites'),
    where('fromUserId', '==', currentUser.uid)
  )

  sentInvitesUnsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const data = change.doc.data()
        if (data.status === 'accepted' || data.status === 'declined') {
          if (sentInvitesCallback) {
            sentInvitesCallback({
              id: change.doc.id,
              ...data
            } as GameInvite & { gameId?: string })
          }
        }
      }
    })
  })
}

// Stop listening to sent invites
export function stopListeningToSentInvites(): void {
  if (sentInvitesUnsubscribe) {
    sentInvitesUnsubscribe()
    sentInvitesUnsubscribe = null
  }
}

// Accept invite and create game
export async function acceptInvite(inviteId: string): Promise<{ gameId: string; myTeam: 'yellow' | 'green' } | null> {
  if (!db || !currentUser || !currentUserData) return null

  try {
    // Get invite data
    const inviteDoc = await getDoc(doc(db, 'invites', inviteId))
    if (!inviteDoc.exists()) return null

    const inviteData = inviteDoc.data()

    // Random team assignment
    const accepterIsYellow = Math.random() < 0.5

    const yellowPlayerId = accepterIsYellow ? currentUser.uid : inviteData.fromUserId
    const yellowUsername = accepterIsYellow ? currentUserData.username : inviteData.fromUsername
    const greenPlayerId = accepterIsYellow ? inviteData.fromUserId : currentUser.uid
    const greenUsername = accepterIsYellow ? inviteData.fromUsername : currentUserData.username

    // Create game with timer settings from invite
    const gameRef = doc(collection(db, 'games'))
    await setDoc(gameRef, {
      yellowPlayerId,
      yellowUsername,
      greenPlayerId,
      greenUsername,
      currentTurn: 'yellow',
      createdAt: serverTimestamp(),
      lastMove: serverTimestamp(),
      status: 'waiting', // Waiting for both players to join
      gameState: null,
      timerEnabled: inviteData.timerEnabled || false,
      timerMinutes: inviteData.timerMinutes || 10,
      yellowJoined: false,
      greenJoined: false
    })

    // Update invite status with game info
    await updateDoc(doc(db, 'invites', inviteId), {
      status: 'accepted',
      gameId: gameRef.id
    })

    return {
      gameId: gameRef.id,
      myTeam: accepterIsYellow ? 'yellow' : 'green'
    }
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
export async function updateGameState(gameId: string, gameState: unknown, currentTurn: 'yellow' | 'green', lastMoveBy: 'yellow' | 'green'): Promise<boolean> {
  if (!db) return false

  try {
    // Get current move count and increment
    const gameDoc = await getDoc(doc(db, 'games', gameId))
    const currentMoveCount = gameDoc.exists() ? (gameDoc.data().moveCount || 0) : 0

    await updateDoc(doc(db, 'games', gameId), {
      gameState,
      currentTurn,
      lastMoveBy,
      moveCount: currentMoveCount + 1,
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

// Get my team in a game
export function getMyTeamInGame(game: MultiplayerGame): 'yellow' | 'green' | null {
  if (!currentUser) return null
  if (game.yellowPlayerId === currentUser.uid) return 'yellow'
  if (game.greenPlayerId === currentUser.uid) return 'green'
  return null
}

// Join a game (mark as ready)
export async function joinGame(gameId: string): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const gameDoc = await getDoc(doc(db, 'games', gameId))
    if (!gameDoc.exists()) return false

    const gameData = gameDoc.data()

    // Determine which player joined
    const isYellow = gameData.yellowPlayerId === currentUser.uid
    const updateData: Record<string, unknown> = {}

    if (isYellow) {
      updateData.yellowJoined = true
    } else {
      updateData.greenJoined = true
    }

    // Check if both players have joined
    const otherJoined = isYellow ? gameData.greenJoined : gameData.yellowJoined
    if (otherJoined) {
      updateData.status = 'playing'
    }

    await updateDoc(doc(db, 'games', gameId), updateData)
    return true
  } catch (error) {
    console.error('Error joining game:', error)
    return false
  }
}

// Admin functions
export function isCurrentUserAdmin(): boolean {
  if (!currentUserData) return false
  // Check both the stored isAdmin field and the email list (in case someone was added to ADMIN_EMAILS)
  return currentUserData.isAdmin === true || ADMIN_EMAILS.includes(currentUserData.email.toLowerCase())
}

export async function getAllUsers(): Promise<Array<UserData & { odataId: string }>> {
  if (!db || !isCurrentUserAdmin()) return []

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map(doc => ({
      odataId: doc.id,
      ...doc.data() as UserData
    }))
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

export async function adminUpdateUser(userId: string, updates: Partial<UserData>): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await updateDoc(doc(db, 'users', userId), updates)
    return true
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

export async function adminGiveWarBucks(userId: string, amount: number): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return false

    const userData = userDoc.data() as UserData
    const newAmount = (userData.warBucks || 0) + amount

    await updateDoc(doc(db, 'users', userId), { warBucks: newAmount })
    return true
  } catch (error) {
    console.error('Error giving war bucks:', error)
    return false
  }
}

export async function adminGiveItem(userId: string, itemId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return false

    const userData = userDoc.data() as UserData
    const purchasedItems = userData.purchasedItems || []

    if (!purchasedItems.includes(itemId)) {
      purchasedItems.push(itemId)
      await updateDoc(doc(db, 'users', userId), { purchasedItems })
    }
    return true
  } catch (error) {
    console.error('Error giving item:', error)
    return false
  }
}

export async function adminSetAdmin(userId: string, isAdmin: boolean): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await updateDoc(doc(db, 'users', userId), { isAdmin })
    return true
  } catch (error) {
    console.error('Error setting admin:', error)
    return false
  }
}

// Give all shop items to a user
export async function adminGiveAllItems(userId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    const allItemIds = SHOP_ITEMS.map(item => item.id)
    await updateDoc(doc(db, 'users', userId), { purchasedItems: allItemIds })
    return true
  } catch (error) {
    console.error('Error giving all items:', error)
    return false
  }
}

// Reset a user's account (keep username/email, reset stats and items)
export async function adminResetUser(userId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return false

    const userData = userDoc.data() as UserData
    const resetData: Partial<UserData> = {
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
      purchasedItems: [],
      equippedItems: { theme: null, pieceSkin: null, effect: null, soundPack: null, musicPack: null },
      warPass: { claimedRewards: [], completedCount: 0, lastResetTime: 0 }
    }

    await updateDoc(doc(db, 'users', userId), resetData)
    return true
  } catch (error) {
    console.error('Error resetting user:', error)
    return false
  }
}

// Give all users an item
export async function adminGiveItemToAll(itemId: string): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    let count = 0

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data() as UserData
      const purchasedItems = userData.purchasedItems || []

      if (!purchasedItems.includes(itemId)) {
        purchasedItems.push(itemId)
        await updateDoc(doc(db, 'users', userDoc.id), { purchasedItems })
        count++
      }
    }

    return count
  } catch (error) {
    console.error('Error giving item to all:', error)
    return 0
  }
}

// Give all users war bucks
export async function adminGiveWarBucksToAll(amount: number): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    let count = 0

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data() as UserData
      const newWarBucks = (userData.warBucks || 0) + amount
      await updateDoc(doc(db, 'users', userDoc.id), { warBucks: newWarBucks })
      count++
    }

    return count
  } catch (error) {
    console.error('Error giving war bucks to all:', error)
    return 0
  }
}
