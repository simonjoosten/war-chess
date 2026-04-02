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
  getDocs,
  arrayUnion,
  addDoc
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
  bannedUntil?: number  // Timestamp when ban expires (0 or undefined = not banned)
  // Stats
  stats: {
    gamesPlayed: number
    gamesWon: number
    gamesLost: number
    totalPointsScored: number
    piecesEliminated: number
    engineersCaptured: number
    timePlayed: number // in seconds
    // Combat stats for badges
    tanksDestroyed: number
    rocketsDestroyed: number
    shipsDestroyed: number
    helicoptersDestroyed: number
    hackersDestroyed: number
    // Multiplayer stats
    multiplayerWins: number
    multiplayerGames: number
    chatMessagesSent: number
    // Economy stats
    totalWarBucksEarned: number
    totalWarBucksSpent: number
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
  // Puzzle progress
  puzzleStats: {
    puzzlesSolved: number
    puzzlesAttempted: number
    perfectSolves: number  // First try solves
    dailyStreak: number
    lastPuzzleDate: number  // Timestamp of last puzzle completed
    solvedPuzzleIds: string[]  // IDs of puzzles solved today
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
  { id: 'sound_horror', name: 'Horror Sounds', description: 'Creepy scary sound effects', price: 200, type: 'sound_pack', icon: '👻', packId: 'horror' },
  { id: 'sound_medieval', name: 'Medieval Sounds', description: 'Swords, shields and battle horns', price: 175, type: 'sound_pack', icon: '🏰', packId: 'medieval' },

  // Music Packs
  { id: 'music_electronic', name: 'Electronic Beats', description: 'Pumping electronic music', price: 200, type: 'music_pack', icon: '🎧', packId: 'electronic' },
  { id: 'music_orchestral', name: 'Orchestral', description: 'Epic orchestral soundtrack', price: 250, type: 'music_pack', icon: '🎻', packId: 'orchestral' },
  { id: 'music_chiptune', name: 'Chiptune', description: 'Retro 8-bit music', price: 175, type: 'music_pack', icon: '🎮', packId: 'chiptune' },
  { id: 'music_jazz', name: 'Smooth Jazz', description: 'Relaxing jazz music', price: 200, type: 'music_pack', icon: '🎷', packId: 'jazz' },
  { id: 'music_rock', name: 'Rock & Roll', description: 'Energetic rock music', price: 225, type: 'music_pack', icon: '🎸', packId: 'rock' },
  { id: 'music_lofi', name: 'Lo-Fi Beats', description: 'Chill lo-fi hip hop vibes', price: 175, type: 'music_pack', icon: '🎵', packId: 'lofi' },
  { id: 'music_epic', name: 'Epic Battle', description: 'Intense cinematic battle music', price: 275, type: 'music_pack', icon: '⚔️', packId: 'epic' },
  { id: 'music_ambient', name: 'Ambient', description: 'Peaceful ambient soundscapes', price: 150, type: 'music_pack', icon: '🌌', packId: 'ambient' },

  // Premium Bundles
  { id: 'theme_neon', name: 'Neon City', description: 'Cyberpunk neon lights theme', price: 300, type: 'theme', icon: '🌃',
    colors: { light: '#ff00ff', dark: '#00ffff', accent: '#ffff00', water: '#ff1493' } },
  { id: 'theme_steampunk', name: 'Steampunk', description: 'Victorian steampunk aesthetic', price: 275, type: 'theme', icon: '⚙️',
    colors: { light: '#cd853f', dark: '#8b4513', accent: '#d4af37', water: '#708090' } },
  { id: 'theme_underwater', name: 'Underwater', description: 'Deep ocean floor theme', price: 225, type: 'theme', icon: '🐠',
    colors: { light: '#00ced1', dark: '#008b8b', accent: '#20b2aa', water: '#006994' } },
  { id: 'theme_autumn', name: 'Autumn Forest', description: 'Beautiful fall colors', price: 175, type: 'theme', icon: '🍂',
    colors: { light: '#daa520', dark: '#8b4513', accent: '#cd853f', water: '#4682b4' } },
  { id: 'theme_winter', name: 'Winter Wonderland', description: 'Snowy winter theme', price: 200, type: 'theme', icon: '⛄',
    colors: { light: '#f0f8ff', dark: '#b0c4de', accent: '#87ceeb', water: '#4169e1' } },

  // Extra Effects
  { id: 'effect_confetti', name: 'Confetti', description: 'Colorful confetti on wins', price: 175, type: 'effect', icon: '🎊', effectType: 'sparkle' },
  { id: 'effect_rainbow', name: 'Rainbow Trail', description: 'Rainbow colors follow your pieces', price: 250, type: 'effect', icon: '🌈', effectType: 'sparkle' },
  { id: 'effect_snow', name: 'Snowfall', description: 'Gentle snowflakes falling', price: 200, type: 'effect', icon: '❄️', effectType: 'sparkle' },
  { id: 'effect_sakura', name: 'Cherry Blossoms', description: 'Beautiful sakura petals', price: 225, type: 'effect', icon: '🌸', effectType: 'sparkle' },

  // NEW: More Themes
  { id: 'theme_tropical', name: 'Tropical Beach', description: 'Sandy beach with palm trees', price: 200, type: 'theme', icon: '🏝️',
    colors: { light: '#f4e8c1', dark: '#2e8b57', accent: '#ff6b6b', water: '#40e0d0' } },
  { id: 'theme_haunted', name: 'Haunted', description: 'Spooky halloween theme', price: 225, type: 'theme', icon: '🎃',
    colors: { light: '#2d1b4e', dark: '#1a0a2e', accent: '#ff6600', water: '#4a0080' } },
  { id: 'theme_rainbow', name: 'Rainbow', description: 'Colorful rainbow theme', price: 175, type: 'theme', icon: '🌈',
    colors: { light: '#ffb3ba', dark: '#bae1ff', accent: '#baffc9', water: '#ffffba' } },
  { id: 'theme_gold', name: 'Gold Rush', description: 'Luxurious golden theme', price: 300, type: 'theme', icon: '💎',
    colors: { light: '#ffd700', dark: '#b8860b', accent: '#daa520', water: '#cd853f' } },
  { id: 'theme_ice', name: 'Ice Cave', description: 'Frozen ice cave theme', price: 225, type: 'theme', icon: '🧊',
    colors: { light: '#e0ffff', dark: '#4169e1', accent: '#00bfff', water: '#1e90ff' } },

  // NEW: More Piece Skins
  { id: 'skin_zombie', name: 'Zombie Army', description: 'Undead zombie versions of pieces', price: 375, type: 'piece_skin', icon: '🧟',
    skinStyle: 'fantasy', pieceColor: { yellow: '#556b2f', green: '#8b4513', accent: '#ff0000' } },
  { id: 'skin_steampunk', name: 'Steampunk Units', description: 'Gears and steam powered units', price: 400, type: 'piece_skin', icon: '⚙️',
    skinStyle: 'robot', pieceColor: { yellow: '#cd853f', green: '#8b4513', accent: '#ffd700' } },
  { id: 'skin_crystal', name: 'Crystal Warriors', description: 'Beautiful crystal/diamond pieces', price: 450, type: 'piece_skin', icon: '💎',
    skinStyle: 'minimal', pieceColor: { yellow: '#e0ffff', green: '#98fb98', accent: '#ff69b4' } },

  // NEW: More Effects
  { id: 'effect_bubble', name: 'Bubble Pop', description: 'Floating bubbles effect', price: 175, type: 'effect', icon: '🫧', effectType: 'sparkle' },
  { id: 'effect_pixel', name: 'Pixel Burst', description: 'Retro pixel explosion effect', price: 200, type: 'effect', icon: '👾', effectType: 'sparkle' },
  { id: 'effect_runes', name: 'Magic Runes', description: 'Magical symbols appear', price: 250, type: 'effect', icon: '🔮', effectType: 'sparkle' },
  { id: 'effect_money', name: 'Money Rain', description: 'War Bucks falling effect', price: 300, type: 'effect', icon: '💵', effectType: 'sparkle' },

  // NEW: More Music Packs
  { id: 'music_tropical', name: 'Tropical Vibes', description: 'Chill beach music with steel drums', price: 200, type: 'music_pack', icon: '🏖️', packId: 'tropical' },
  { id: 'music_dark', name: 'Dark Orchestra', description: 'Ominous strings and brass', price: 275, type: 'music_pack', icon: '🦇', packId: 'dark' },
  { id: 'music_cyberpunk', name: 'Cyberpunk', description: 'Glitchy synths and heavy bass', price: 250, type: 'music_pack', icon: '🤖', packId: 'cyberpunk' },
  { id: 'music_western', name: 'Wild West', description: 'Dusty guitars and harmonica', price: 225, type: 'music_pack', icon: '🤠', packId: 'western' },
  { id: 'music_funk', name: 'Funky Groove', description: 'Slap bass and wah guitar', price: 225, type: 'music_pack', icon: '🕺', packId: 'funk' },
  { id: 'music_metal', name: 'Heavy Metal', description: 'Crushing riffs and double bass', price: 275, type: 'music_pack', icon: '🤘', packId: 'metal' },
  { id: 'music_synthwave', name: 'Synthwave', description: '80s synths and arpeggios', price: 250, type: 'music_pack', icon: '🌆', packId: 'synthwave' },
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
  // Easy challenges (Tier 1)
  { id: 'play_1', name: 'First Steps', description: 'Play 1 game', icon: '🎮', requirement: 1, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 25 } },
  { id: 'win_1', name: 'First Victory', description: 'Win 1 game', icon: '🏆', requirement: 1, stat: 'gamesWon',
    reward: { type: 'warBucks', amount: 50 } },
  { id: 'eliminate_5', name: 'Rookie Hunter', description: 'Eliminate 5 pieces', icon: '🎯', requirement: 5, stat: 'piecesEliminated',
    reward: { type: 'warBucks', amount: 30 } },
  { id: 'points_25', name: 'Point Starter', description: 'Score 25 total points', icon: '📊', requirement: 25, stat: 'totalPointsScored',
    reward: { type: 'warBucks', amount: 35 } },

  // Medium challenges (Tier 2)
  { id: 'play_5', name: 'Getting Started', description: 'Play 5 games', icon: '🎲', requirement: 5, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 75 } },
  { id: 'win_3', name: 'Hat Trick', description: 'Win 3 games', icon: '🥉', requirement: 3, stat: 'gamesWon',
    reward: { type: 'warBucks', amount: 100 } },
  { id: 'eliminate_25', name: 'Skilled Hunter', description: 'Eliminate 25 pieces', icon: '💥', requirement: 25, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'effect_sparkle' } },
  { id: 'engineer_3', name: 'Engineer Hunter', description: 'Capture 3 engineers', icon: '🔧', requirement: 3, stat: 'engineersCaptured',
    reward: { type: 'warBucks', amount: 100 } },
  { id: 'points_50', name: 'Point Collector', description: 'Score 50 total points', icon: '💎', requirement: 50, stat: 'totalPointsScored',
    reward: { type: 'warBucks', amount: 80 } },
  { id: 'eliminate_15', name: 'Hunter', description: 'Eliminate 15 pieces', icon: '🏹', requirement: 15, stat: 'piecesEliminated',
    reward: { type: 'warBucks', amount: 60 } },

  // Hard challenges (Tier 3)
  { id: 'play_10', name: 'Dedicated Player', description: 'Play 10 games', icon: '⭐', requirement: 10, stat: 'gamesPlayed',
    reward: { type: 'item', itemId: 'theme_desert' } },
  { id: 'win_5', name: 'Champion', description: 'Win 5 games', icon: '🏅', requirement: 5, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_pixel' } },
  { id: 'eliminate_50', name: 'Elite Hunter', description: 'Eliminate 50 pieces', icon: '🔥', requirement: 50, stat: 'piecesEliminated',
    reward: { type: 'warBucks', amount: 200 } },
  { id: 'points_100', name: 'Point Master', description: 'Score 100 total points', icon: '💯', requirement: 100, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'theme_arctic' } },
  { id: 'engineer_5', name: 'Engineer Expert', description: 'Capture 5 engineers', icon: '🛠️', requirement: 5, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'effect_smoke' } },
  { id: 'play_15', name: 'Regular Player', description: 'Play 15 games', icon: '🎯', requirement: 15, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 150 } },

  // Expert challenges (Tier 4)
  { id: 'win_10', name: 'War Hero', description: 'Win 10 games', icon: '🎖️', requirement: 10, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_robot' } },
  { id: 'eliminate_100', name: 'Legendary Hunter', description: 'Eliminate 100 pieces', icon: '👑', requirement: 100, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'effect_fire' } },
  { id: 'engineer_10', name: 'Engineer Master', description: 'Capture 10 engineers', icon: '⚙️', requirement: 10, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'theme_night' } },
  { id: 'points_500', name: 'Score Legend', description: 'Score 500 total points', icon: '🌟', requirement: 500, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'skin_scifi' } },
  { id: 'play_25', name: 'Veteran', description: 'Play 25 games', icon: '🎗️', requirement: 25, stat: 'gamesPlayed',
    reward: { type: 'item', itemId: 'theme_jungle' } },
  { id: 'win_15', name: 'Commander', description: 'Win 15 games', icon: '⚔️', requirement: 15, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'effect_lightning' } },

  // Master challenges (Tier 5)
  { id: 'eliminate_200', name: 'Destroyer', description: 'Eliminate 200 pieces', icon: '💀', requirement: 200, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'skin_fantasy' } },
  { id: 'points_1000', name: 'Point God', description: 'Score 1000 total points', icon: '🔱', requirement: 1000, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'theme_space' } },
  { id: 'win_25', name: 'General', description: 'Win 25 games', icon: '🏛️', requirement: 25, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'effect_explosion' } },
  { id: 'engineer_25', name: 'Engineer Legend', description: 'Capture 25 engineers', icon: '🔩', requirement: 25, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'theme_lava' } },
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
      timePlayed: 0,
      // Combat stats
      tanksDestroyed: 0,
      rocketsDestroyed: 0,
      shipsDestroyed: 0,
      helicoptersDestroyed: 0,
      hackersDestroyed: 0,
      // Multiplayer stats
      multiplayerWins: 0,
      multiplayerGames: 0,
      chatMessagesSent: 0,
      // Economy stats
      totalWarBucksEarned: 0,
      totalWarBucksSpent: 0
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
    },
    puzzleStats: {
      puzzlesSolved: 0,
      puzzlesAttempted: 0,
      perfectSolves: 0,
      dailyStreak: 0,
      lastPuzzleDate: 0,
      solvedPuzzleIds: []
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
  // Original badges
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
  WAR_PASS_10: { id: 'war_pass_10', name: 'War Pass Legend', description: 'Complete the War Pass 10 times', icon: '🥇' },
  // Puzzle badges
  PUZZLE_FIRST: { id: 'puzzle_first', name: 'Puzzle Beginner', description: 'Solve your first puzzle', icon: '🧩' },
  PUZZLE_10: { id: 'puzzle_10', name: 'Puzzle Solver', description: 'Solve 10 puzzles', icon: '🧠' },
  PUZZLE_50: { id: 'puzzle_50', name: 'Puzzle Master', description: 'Solve 50 puzzles', icon: '🎓' },
  PUZZLE_100: { id: 'puzzle_100', name: 'Puzzle Legend', description: 'Solve 100 puzzles', icon: '🏆' },
  PUZZLE_PERFECT_5: { id: 'puzzle_perfect_5', name: 'Quick Thinker', description: 'Solve 5 puzzles on first try', icon: '⚡' },
  PUZZLE_PERFECT_25: { id: 'puzzle_perfect_25', name: 'Genius', description: 'Solve 25 puzzles on first try', icon: '💡' },
  PUZZLE_STREAK_7: { id: 'puzzle_streak_7', name: 'Week Warrior', description: '7 day puzzle streak', icon: '📅' },
  PUZZLE_STREAK_30: { id: 'puzzle_streak_30', name: 'Month Master', description: '30 day puzzle streak', icon: '🗓️' },
  // Combat badges
  TANK_DESTROYER: { id: 'tank_destroyer', name: 'Tank Destroyer', description: 'Destroy 25 tanks', icon: '💣' },
  ROCKET_CATCHER: { id: 'rocket_catcher', name: 'Rocket Catcher', description: 'Capture 10 rockets', icon: '🚀' },
  SHIP_SINKER: { id: 'ship_sinker', name: 'Ship Sinker', description: 'Destroy 20 ships', icon: '⚓' },
  HELICOPTER_HUNTER: { id: 'helicopter_hunter', name: 'Heli Hunter', description: 'Shoot down 15 helicopters', icon: '🚁' },
  BUILDER_NEMESIS: { id: 'builder_nemesis', name: 'Builder Nemesis', description: 'Capture 25 builders', icon: '🔨' },
  HACKER_BLOCKER: { id: 'hacker_blocker', name: 'Hacker Blocker', description: 'Eliminate 10 hackers', icon: '💻' },
  // Multiplayer badges
  MP_FIRST: { id: 'mp_first', name: 'First Online Win', description: 'Win your first multiplayer game', icon: '🌐' },
  MP_10: { id: 'mp_10', name: 'Online Warrior', description: 'Win 10 multiplayer games', icon: '⚔️' },
  MP_50: { id: 'mp_50', name: 'Online Champion', description: 'Win 50 multiplayer games', icon: '🏅' },
  FRIENDLY_PLAYER: { id: 'friendly_player', name: 'Friendly Player', description: 'Send 50 chat messages', icon: '💬' },
  QUICK_MATCH: { id: 'quick_match', name: 'Speed Demon', description: 'Win a match in under 3 minutes', icon: '⏱️' },
  // Collection badges
  COLLECTOR_THEMES: { id: 'collector_themes', name: 'Theme Collector', description: 'Buy all themes', icon: '🎨' },
  COLLECTOR_SKINS: { id: 'collector_skins', name: 'Skin Collector', description: 'Buy all skins', icon: '👔' },
  COLLECTOR_EFFECTS: { id: 'collector_effects', name: 'Effect Collector', description: 'Buy all effects', icon: '✨' },
  COLLECTOR_ALL: { id: 'collector_all', name: 'Ultimate Collector', description: 'Buy EVERYTHING in the shop', icon: '👑' },
  BIG_SPENDER: { id: 'big_spender', name: 'Big Spender', description: 'Spend 5000 War Bucks', icon: '💸' },
  WAR_MILLIONAIRE: { id: 'war_millionaire', name: 'War Millionaire', description: 'Earn 10000 War Bucks total', icon: '💰' },
  // Milestone badges
  GAMES_100: { id: 'games_100', name: 'Centurion', description: 'Play 100 games', icon: '💯' },
  GAMES_500: { id: 'games_500', name: 'Dedicated', description: 'Play 500 games', icon: '🎖️' },
  WINS_50: { id: 'wins_50', name: 'Half Century', description: 'Win 50 games', icon: '5️⃣' },
  WINS_100: { id: 'wins_100', name: 'Century Winner', description: 'Win 100 games', icon: '🏆' },
  PLAYTIME_10H: { id: 'playtime_10h', name: 'Time Invested', description: 'Play for 10 hours total', icon: '⏰' },
  PLAYTIME_50H: { id: 'playtime_50h', name: 'Hardcore', description: 'Play for 50 hours total', icon: '🔥' }
}

// Check and award badges
export function checkBadges(userData: UserData): string[] {
  const newBadges: string[] = []
  const stats = userData.stats
  const puzzleStats = userData.puzzleStats || { puzzlesSolved: 0, perfectSolves: 0, dailyStreak: 0, puzzlesAttempted: 0, lastPuzzleDate: 0 }

  // Original badges
  if (!userData.badges.includes('first_win') && stats.gamesWon >= 1) {
    newBadges.push('first_win')
  }
  if (!userData.badges.includes('engineer_hunter') && stats.engineersCaptured >= 10) {
    newBadges.push('engineer_hunter')
  }
  if (!userData.badges.includes('sharpshooter') && stats.piecesEliminated >= 100) {
    newBadges.push('sharpshooter')
  }
  if (!userData.badges.includes('veteran') && stats.gamesPlayed >= 50) {
    newBadges.push('veteran')
  }
  if (!userData.badges.includes('master') && stats.gamesWon >= 25) {
    newBadges.push('master')
  }
  if (!userData.badges.includes('rich') && userData.warBucks >= 1000) {
    newBadges.push('rich')
  }
  if (!userData.badges.includes('strategist') && stats.totalPointsScored >= 500) {
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

  // Puzzle badges
  if (!userData.badges.includes('puzzle_first') && puzzleStats.puzzlesSolved >= 1) {
    newBadges.push('puzzle_first')
  }
  if (!userData.badges.includes('puzzle_10') && puzzleStats.puzzlesSolved >= 10) {
    newBadges.push('puzzle_10')
  }
  if (!userData.badges.includes('puzzle_50') && puzzleStats.puzzlesSolved >= 50) {
    newBadges.push('puzzle_50')
  }
  if (!userData.badges.includes('puzzle_100') && puzzleStats.puzzlesSolved >= 100) {
    newBadges.push('puzzle_100')
  }
  if (!userData.badges.includes('puzzle_perfect_5') && puzzleStats.perfectSolves >= 5) {
    newBadges.push('puzzle_perfect_5')
  }
  if (!userData.badges.includes('puzzle_perfect_25') && puzzleStats.perfectSolves >= 25) {
    newBadges.push('puzzle_perfect_25')
  }
  if (!userData.badges.includes('puzzle_streak_7') && puzzleStats.dailyStreak >= 7) {
    newBadges.push('puzzle_streak_7')
  }
  if (!userData.badges.includes('puzzle_streak_30') && puzzleStats.dailyStreak >= 30) {
    newBadges.push('puzzle_streak_30')
  }

  // Combat badges
  if (!userData.badges.includes('tank_destroyer') && (stats.tanksDestroyed || 0) >= 25) {
    newBadges.push('tank_destroyer')
  }
  if (!userData.badges.includes('rocket_catcher') && (stats.rocketsDestroyed || 0) >= 10) {
    newBadges.push('rocket_catcher')
  }
  if (!userData.badges.includes('ship_sinker') && (stats.shipsDestroyed || 0) >= 20) {
    newBadges.push('ship_sinker')
  }
  if (!userData.badges.includes('helicopter_hunter') && (stats.helicoptersDestroyed || 0) >= 15) {
    newBadges.push('helicopter_hunter')
  }
  if (!userData.badges.includes('builder_nemesis') && stats.engineersCaptured >= 25) {
    newBadges.push('builder_nemesis')
  }
  if (!userData.badges.includes('hacker_blocker') && (stats.hackersDestroyed || 0) >= 10) {
    newBadges.push('hacker_blocker')
  }

  // Multiplayer badges
  if (!userData.badges.includes('mp_first') && (stats.multiplayerWins || 0) >= 1) {
    newBadges.push('mp_first')
  }
  if (!userData.badges.includes('mp_10') && (stats.multiplayerWins || 0) >= 10) {
    newBadges.push('mp_10')
  }
  if (!userData.badges.includes('mp_50') && (stats.multiplayerWins || 0) >= 50) {
    newBadges.push('mp_50')
  }
  if (!userData.badges.includes('friendly_player') && (stats.chatMessagesSent || 0) >= 50) {
    newBadges.push('friendly_player')
  }

  // Collection badges
  const allThemes = SHOP_ITEMS.filter(i => i.type === 'theme').map(i => i.id)
  const allSkins = SHOP_ITEMS.filter(i => i.type === 'piece_skin').map(i => i.id)
  const allEffects = SHOP_ITEMS.filter(i => i.type === 'effect').map(i => i.id)
  const allItems = SHOP_ITEMS.map(i => i.id)
  const owned = userData.purchasedItems || []

  if (!userData.badges.includes('collector_themes') && allThemes.every(id => owned.includes(id))) {
    newBadges.push('collector_themes')
  }
  if (!userData.badges.includes('collector_skins') && allSkins.every(id => owned.includes(id))) {
    newBadges.push('collector_skins')
  }
  if (!userData.badges.includes('collector_effects') && allEffects.every(id => owned.includes(id))) {
    newBadges.push('collector_effects')
  }
  if (!userData.badges.includes('collector_all') && allItems.every(id => owned.includes(id))) {
    newBadges.push('collector_all')
  }
  if (!userData.badges.includes('big_spender') && (stats.totalWarBucksSpent || 0) >= 5000) {
    newBadges.push('big_spender')
  }
  if (!userData.badges.includes('war_millionaire') && (stats.totalWarBucksEarned || 0) >= 10000) {
    newBadges.push('war_millionaire')
  }

  // Milestone badges
  if (!userData.badges.includes('games_100') && stats.gamesPlayed >= 100) {
    newBadges.push('games_100')
  }
  if (!userData.badges.includes('games_500') && stats.gamesPlayed >= 500) {
    newBadges.push('games_500')
  }
  if (!userData.badges.includes('wins_50') && stats.gamesWon >= 50) {
    newBadges.push('wins_50')
  }
  if (!userData.badges.includes('wins_100') && stats.gamesWon >= 100) {
    newBadges.push('wins_100')
  }
  if (!userData.badges.includes('playtime_10h') && stats.timePlayed >= 36000) { // 10 hours in seconds
    newBadges.push('playtime_10h')
  }
  if (!userData.badges.includes('playtime_50h') && stats.timePlayed >= 180000) { // 50 hours in seconds
    newBadges.push('playtime_50h')
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
  status: 'waiting' | 'playing' | 'finished' | 'abandoned'
  winner?: 'yellow' | 'green'
  timerEnabled?: boolean
  timerMinutes?: number
  yellowJoined?: boolean
  greenJoined?: boolean
  yellowLeft?: boolean // Track if yellow player left
  greenLeft?: boolean // Track if green player left
  leftBy?: 'yellow' | 'green' // Who left the game
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
    console.log('[FB SNAPSHOT] Game snapshot received for:', gameId, 'exists:', docSnap.exists())
    if (docSnap.exists()) {
      const data = docSnap.data()
      console.log('[FB SNAPSHOT] Game data:', { moveCount: data.moveCount, currentTurn: data.currentTurn, lastMoveBy: data.lastMoveBy, status: data.status })
      currentMultiplayerGame = {
        id: docSnap.id,
        ...data
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
  if (!db) {
    console.error('[FB UPDATE] No database connection')
    return false
  }

  try {
    // Get current move count and increment
    const gameDoc = await getDoc(doc(db, 'games', gameId))

    if (!gameDoc.exists()) {
      console.error('[FB UPDATE] Game document does not exist:', gameId)
      return false
    }

    const currentMoveCount = gameDoc.data().moveCount || 0
    const newMoveCount = currentMoveCount + 1

    await updateDoc(doc(db, 'games', gameId), {
      gameState,
      currentTurn,
      lastMoveBy,
      moveCount: newMoveCount,
      lastMove: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('[FB UPDATE] Error updating game:', error)
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

// Leave game - notify opponent that you left
export async function leaveGame(gameId: string, team: 'yellow' | 'green'): Promise<boolean> {
  if (!db) return false

  try {
    const updates: Record<string, unknown> = {
      status: 'abandoned',
      leftBy: team
    }

    if (team === 'yellow') {
      updates.yellowLeft = true
    } else {
      updates.greenLeft = true
    }

    await updateDoc(doc(db, 'games', gameId), updates)
    return true
  } catch (error) {
    console.error('Error leaving game:', error)
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
  console.log('[ADMIN] adminUpdateUser called', { userId, updates })

  if (!db) {
    console.error('[ADMIN] adminUpdateUser FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminUpdateUser FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminUpdateUser: Updating user document...')
    await updateDoc(doc(db, 'users', userId), updates)
    console.log('[ADMIN] adminUpdateUser SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminUpdateUser ERROR:', error)
    return false
  }
}

export async function adminGiveWarBucks(userId: string, amount: number): Promise<boolean> {
  console.log('[ADMIN] adminGiveWarBucks called', { userId, amount })

  if (!db) {
    console.error('[ADMIN] adminGiveWarBucks FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminGiveWarBucks FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminGiveWarBucks: Fetching user document...')
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      console.error('[ADMIN] adminGiveWarBucks FAILED: User not found')
      return false
    }

    const userData = userDoc.data() as UserData
    const newAmount = (userData.warBucks || 0) + amount
    console.log('[ADMIN] adminGiveWarBucks: Current:', userData.warBucks, '+ Adding:', amount, '= New:', newAmount)

    await updateDoc(doc(db, 'users', userId), { warBucks: newAmount })
    console.log('[ADMIN] adminGiveWarBucks SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminGiveWarBucks ERROR:', error)
    return false
  }
}

export async function adminGiveItem(userId: string, itemId: string): Promise<boolean> {
  console.log('[ADMIN] adminGiveItem called', { userId, itemId })

  if (!db) {
    console.error('[ADMIN] adminGiveItem FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminGiveItem FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminGiveItem: Fetching user document...')
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      console.error('[ADMIN] adminGiveItem FAILED: User not found')
      return false
    }

    const userData = userDoc.data() as UserData
    const purchasedItems = userData.purchasedItems || []

    if (!purchasedItems.includes(itemId)) {
      purchasedItems.push(itemId)
      console.log('[ADMIN] adminGiveItem: Adding item to user, new items count:', purchasedItems.length)
      await updateDoc(doc(db, 'users', userId), { purchasedItems })
    } else {
      console.log('[ADMIN] adminGiveItem: User already has this item')
    }
    console.log('[ADMIN] adminGiveItem SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminGiveItem ERROR:', error)
    return false
  }
}

export async function adminSetAdmin(userId: string, isAdmin: boolean): Promise<boolean> {
  console.log('[ADMIN] adminSetAdmin called', { userId, isAdmin })

  if (!db) {
    console.error('[ADMIN] adminSetAdmin FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminSetAdmin FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminSetAdmin: Updating admin status...')
    await updateDoc(doc(db, 'users', userId), { isAdmin })
    console.log('[ADMIN] adminSetAdmin SUCCESS: User', userId, 'isAdmin =', isAdmin)
    return true
  } catch (error) {
    console.error('[ADMIN] adminSetAdmin ERROR:', error)
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

    const resetData: Partial<UserData> = {
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalPointsScored: 0,
        piecesEliminated: 0,
        engineersCaptured: 0,
        timePlayed: 0,
        tanksDestroyed: 0,
        rocketsDestroyed: 0,
        shipsDestroyed: 0,
        helicoptersDestroyed: 0,
        hackersDestroyed: 0,
        multiplayerWins: 0,
        multiplayerGames: 0,
        chatMessagesSent: 0,
        totalWarBucksEarned: 0,
        totalWarBucksSpent: 0
      },
      badges: [],
      warBucks: 0,
      purchasedItems: [],
      equippedItems: { theme: null, pieceSkin: null, effect: null, soundPack: null, musicPack: null },
      warPass: { claimedRewards: [], completedCount: 0, lastResetTime: 0 },
      puzzleStats: { puzzlesSolved: 0, puzzlesAttempted: 0, perfectSolves: 0, dailyStreak: 0, lastPuzzleDate: 0, solvedPuzzleIds: [] }
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

// ==================== EVENTS SYSTEM ====================

export interface GameEvent {
  id: string
  type: 'announcement' | 'maintenance' | 'event' | 'reward' | 'update' | 'gamemode' | 'poll'
  title: string
  message: string
  icon: string
  createdAt: number
  expiresAt?: number // Optional expiration timestamp
  createdBy: string
  active: boolean
  // For reward events
  rewardType?: 'warBucks' | 'item'
  rewardAmount?: number
  rewardItemId?: string
  claimedBy?: string[] // User IDs who claimed the reward
  // For game mode events
  gameMode?: 'disco' | 'jumpscare' | 'chaos' | 'mirror' | 'speed' | 'giant' | 'tiny' | 'rainbow' | 'matrix' | 'earthquake'
  // For poll events
  pollOptions?: string[]
  pollVotes?: Record<string, string> // { odataId leserfout: optionIndex }
}

// Global message interface
export interface GlobalMessage {
  id: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  createdAt: number
  createdBy: string
  expiresAt: number
  seenBy: string[]
}

// Pre-defined special game modes
export const SPECIAL_GAME_MODES = {
  disco: { name: 'Disco Mode', icon: '🪩', description: 'Flashing colors and party vibes!' },
  jumpscare: { name: 'Jumpscare Mode', icon: '👻', description: 'Random scary surprises!' },
  chaos: { name: 'Chaos Mode', icon: '🌀', description: 'Everything is unpredictable!' },
  mirror: { name: 'Mirror Mode', icon: '🪞', description: 'Board is mirrored!' },
  speed: { name: 'Speed Mode', icon: '⚡', description: 'Everything moves faster!' },
  giant: { name: 'Giant Mode', icon: '🦖', description: 'Pieces are huge!' },
  tiny: { name: 'Tiny Mode', icon: '🐜', description: 'Pieces are tiny!' },
  rainbow: { name: 'Rainbow Mode', icon: '🌈', description: 'Rainbow colors everywhere!' },
  matrix: { name: 'Matrix Mode', icon: '💊', description: 'Enter the Matrix!' },
  earthquake: { name: 'Earthquake Mode', icon: '🌋', description: 'The board is shaking!' }
}

// Create a new event
export async function adminCreateEvent(event: Omit<GameEvent, 'id' | 'createdAt' | 'createdBy' | 'claimedBy'>): Promise<string | null> {
  if (!db || !isCurrentUserAdmin() || !currentUserData) return null

  try {
    const eventRef = doc(collection(db, 'events'))
    const newEvent: Omit<GameEvent, 'id'> = {
      ...event,
      createdAt: Date.now(),
      createdBy: currentUserData.username,
      claimedBy: []
    }
    await setDoc(eventRef, newEvent)
    return eventRef.id
  } catch (error) {
    console.error('Error creating event:', error)
    return null
  }
}

// Get all active events
export async function getActiveEvents(): Promise<GameEvent[]> {
  if (!db) return []

  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'))
    const now = Date.now()
    return eventsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GameEvent))
      .filter(event => event.active && (!event.expiresAt || event.expiresAt > now))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error getting events:', error)
    return []
  }
}

// Get active game modes
export async function getActiveGameModes(): Promise<string[]> {
  if (!db) return []

  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'))
    const now = Date.now()
    return eventsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GameEvent))
      .filter(event => event.active && event.type === 'gamemode' && event.gameMode && (!event.expiresAt || event.expiresAt > now))
      .map(event => event.gameMode!)
  } catch (error) {
    console.error('Error getting game modes:', error)
    return []
  }
}

// Get all events (for admin)
export async function adminGetAllEvents(): Promise<GameEvent[]> {
  if (!db || !isCurrentUserAdmin()) return []

  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'))
    return eventsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GameEvent))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error getting all events:', error)
    return []
  }
}

// Delete an event
export async function adminDeleteEvent(eventId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await deleteDoc(doc(db, 'events', eventId))
    return true
  } catch (error) {
    console.error('Error deleting event:', error)
    return false
  }
}

// Toggle event active status
export async function adminToggleEvent(eventId: string, active: boolean): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await updateDoc(doc(db, 'events', eventId), { active })
    return true
  } catch (error) {
    console.error('Error toggling event:', error)
    return false
  }
}

// Claim event reward
export async function claimEventReward(eventId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId))
    if (!eventDoc.exists()) return false

    const event = { id: eventDoc.id, ...eventDoc.data() } as GameEvent

    // Check if already claimed
    if (event.claimedBy?.includes(currentUser.uid)) return false

    // Check if event is active and not expired
    if (!event.active || (event.expiresAt && event.expiresAt < Date.now())) return false

    // Give reward
    if (event.rewardType === 'warBucks' && event.rewardAmount) {
      const newWarBucks = (currentUserData.warBucks || 0) + event.rewardAmount
      await updateDoc(doc(db, 'users', currentUser.uid), { warBucks: newWarBucks })
    } else if (event.rewardType === 'item' && event.rewardItemId) {
      const purchasedItems = currentUserData.purchasedItems || []
      if (!purchasedItems.includes(event.rewardItemId)) {
        purchasedItems.push(event.rewardItemId)
        await updateDoc(doc(db, 'users', currentUser.uid), { purchasedItems })
      }
    }

    // Mark as claimed
    const claimedBy = event.claimedBy || []
    claimedBy.push(currentUser.uid)
    await updateDoc(doc(db, 'events', eventId), { claimedBy })

    // Reload user data
    await loadUserData()

    return true
  } catch (error) {
    console.error('Error claiming reward:', error)
    return false
  }
}

// ==================== GLOBAL MESSAGES ====================

// Send a global message to all players
export async function adminSendGlobalMessage(message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info', durationMinutes: number = 60): Promise<string | null> {
  if (!db || !isCurrentUserAdmin() || !currentUserData) return null

  try {
    const msgRef = doc(collection(db, 'globalMessages'))
    await setDoc(msgRef, {
      message,
      type,
      createdAt: Date.now(),
      createdBy: currentUserData.username,
      expiresAt: Date.now() + (durationMinutes * 60 * 1000),
      seenBy: []
    })
    return msgRef.id
  } catch (error) {
    console.error('Error sending global message:', error)
    return null
  }
}

// Get active global messages for current user
export async function getActiveGlobalMessages(): Promise<GlobalMessage[]> {
  if (!db || !currentUser) return []

  try {
    const msgsSnapshot = await getDocs(collection(db, 'globalMessages'))
    const now = Date.now()
    return msgsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GlobalMessage))
      .filter(msg => msg.expiresAt > now && !msg.seenBy?.includes(currentUser!.uid))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error getting global messages:', error)
    return []
  }
}

// Mark global message as seen
export async function markMessageSeen(messageId: string): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const msgDoc = await getDoc(doc(db, 'globalMessages', messageId))
    if (!msgDoc.exists()) return false

    const seenBy = msgDoc.data().seenBy || []
    if (!seenBy.includes(currentUser.uid)) {
      seenBy.push(currentUser.uid)
      await updateDoc(doc(db, 'globalMessages', messageId), { seenBy })
    }
    return true
  } catch (error) {
    console.error('Error marking message seen:', error)
    return false
  }
}

// Delete all global messages (admin)
export async function adminDeleteAllMessages(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const msgsSnapshot = await getDocs(collection(db, 'globalMessages'))
    let count = 0
    for (const msgDoc of msgsSnapshot.docs) {
      await deleteDoc(doc(db, 'globalMessages', msgDoc.id))
      count++
    }
    return count
  } catch (error) {
    console.error('Error deleting messages:', error)
    return 0
  }
}

// ==================== POLLS / VOTING ====================

// Vote on a poll
export async function votePoll(eventId: string, optionIndex: number): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId))
    if (!eventDoc.exists()) return false

    const event = eventDoc.data() as GameEvent
    if (event.type !== 'poll') return false

    const pollVotes = event.pollVotes || {}
    pollVotes[currentUser.uid] = String(optionIndex)

    await updateDoc(doc(db, 'events', eventId), { pollVotes })
    return true
  } catch (error) {
    console.error('Error voting:', error)
    return false
  }
}

// Get poll results
export async function getPollResults(eventId: string): Promise<Record<string, number>> {
  if (!db) return {}

  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId))
    if (!eventDoc.exists()) return {}

    const event = eventDoc.data() as GameEvent
    const pollVotes = event.pollVotes || {}
    const results: Record<string, number> = {}

    // Count votes for each option
    Object.values(pollVotes).forEach(vote => {
      results[vote] = (results[vote] || 0) + 1
    })

    return results
  } catch (error) {
    console.error('Error getting poll results:', error)
    return {}
  }
}

// ==================== ADMIN DANGER ZONE ====================

// Reset all user stats
export async function adminResetAllStats(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    let count = 0

    for (const userDoc of usersSnapshot.docs) {
      await updateDoc(doc(db, 'users', userDoc.id), {
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          totalPointsScored: 0,
          piecesEliminated: 0,
          engineersCaptured: 0,
          timePlayed: 0,
          tanksDestroyed: 0,
          rocketsDestroyed: 0,
          shipsDestroyed: 0,
          helicoptersDestroyed: 0,
          hackersDestroyed: 0,
          multiplayerWins: 0,
          multiplayerGames: 0,
          chatMessagesSent: 0,
          totalWarBucksEarned: 0,
          totalWarBucksSpent: 0
        },
        puzzleStats: { puzzlesSolved: 0, puzzlesAttempted: 0, perfectSolves: 0, dailyStreak: 0, lastPuzzleDate: 0, solvedPuzzleIds: [] }
      })
      count++
    }

    return count
  } catch (error) {
    console.error('Error resetting all stats:', error)
    return 0
  }
}

// Reset all war bucks to 0
export async function adminResetAllWarBucks(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    let count = 0

    for (const userDoc of usersSnapshot.docs) {
      await updateDoc(doc(db, 'users', userDoc.id), { warBucks: 0 })
      count++
    }

    return count
  } catch (error) {
    console.error('Error resetting all war bucks:', error)
    return 0
  }
}

// Delete all events
export async function adminDeleteAllEvents(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'))
    let count = 0

    for (const eventDoc of eventsSnapshot.docs) {
      await deleteDoc(doc(db, 'events', eventDoc.id))
      count++
    }

    return count
  } catch (error) {
    console.error('Error deleting all events:', error)
    return 0
  }
}

// Delete all games
export async function adminDeleteAllGames(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const gamesSnapshot = await getDocs(collection(db, 'games'))
    let count = 0

    for (const gameDoc of gamesSnapshot.docs) {
      await deleteDoc(doc(db, 'games', gameDoc.id))
      count++
    }

    return count
  } catch (error) {
    console.error('Error deleting all games:', error)
    return 0
  }
}

// Give all items to all users
export async function adminGiveAllItemsToAll(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const allItemIds = SHOP_ITEMS.map(item => item.id)
    let count = 0

    for (const userDoc of usersSnapshot.docs) {
      await updateDoc(doc(db, 'users', userDoc.id), { purchasedItems: allItemIds })
      count++
    }

    return count
  } catch (error) {
    console.error('Error giving all items to all:', error)
    return 0
  }
}

// Create sample/default events
export async function adminCreateSampleEvents(): Promise<number> {
  if (!db || !isCurrentUserAdmin() || !currentUserData) return 0

  const sampleEvents: Array<Omit<GameEvent, 'id' | 'createdAt' | 'createdBy' | 'claimedBy'>> = [
    // Game mode events - all modes
    { type: 'gamemode', title: 'Disco Mode Active!', message: 'Party time! Flashing colors everywhere!', icon: '🪩', active: true, gameMode: 'disco' },
    { type: 'gamemode', title: 'Jumpscare Mode!', message: 'Beware of random scary surprises...', icon: '👻', active: false, gameMode: 'jumpscare' },
    { type: 'gamemode', title: 'Chaos Mode!', message: 'Everything is unpredictable!', icon: '🌀', active: false, gameMode: 'chaos' },
    { type: 'gamemode', title: 'Rainbow Mode!', message: 'Beautiful rainbow colors!', icon: '🌈', active: false, gameMode: 'rainbow' },
    { type: 'gamemode', title: 'Matrix Mode!', message: 'Enter the Matrix...', icon: '💊', active: false, gameMode: 'matrix' },
    { type: 'gamemode', title: 'Earthquake Mode!', message: 'The board is shaking!', icon: '🌋', active: false, gameMode: 'earthquake' },
    { type: 'gamemode', title: 'Mirror Mode!', message: 'Everything is reversed!', icon: '🪞', active: false, gameMode: 'mirror' },
    { type: 'gamemode', title: 'Speed Mode!', message: 'Everything moves faster!', icon: '⚡', active: false, gameMode: 'speed' },
    { type: 'gamemode', title: 'Giant Mode!', message: 'Pieces are huge!', icon: '🦖', active: false, gameMode: 'giant' },
    { type: 'gamemode', title: 'Tiny Mode!', message: 'Pieces are tiny!', icon: '🐜', active: false, gameMode: 'tiny' },

    // Reward events
    { type: 'reward', title: 'Welcome Bonus!', message: 'Claim your free War Bucks!', icon: '🎁', active: true, rewardType: 'warBucks', rewardAmount: 100 },
    { type: 'reward', title: 'Weekend Special!', message: 'Extra War Bucks for everyone!', icon: '💰', active: false, rewardType: 'warBucks', rewardAmount: 250 },
    { type: 'reward', title: 'Daily Login!', message: 'Thanks for playing today!', icon: '📅', active: true, rewardType: 'warBucks', rewardAmount: 50 },
    { type: 'reward', title: 'Lucky Day!', message: 'You got extra lucky today!', icon: '🍀', active: false, rewardType: 'warBucks', rewardAmount: 500 },
    { type: 'reward', title: 'Free Theme!', message: 'Get a free desert theme!', icon: '🏜️', active: false, rewardType: 'item', rewardItemId: 'theme_desert' },

    // Announcement events
    { type: 'announcement', title: 'Welcome to War Chess!', message: 'Thanks for playing! Have fun and good luck!', icon: '👋', active: true },
    { type: 'update', title: 'New Features!', message: 'Check out the shop for new items and skins!', icon: '🆕', active: true },
    { type: 'announcement', title: 'Multiplayer is Live!', message: 'Challenge your friends to a match!', icon: '🎮', active: true },
    { type: 'maintenance', title: 'Server Update', message: 'Brief maintenance scheduled for tonight.', icon: '🔧', active: false },
    { type: 'event', title: 'Tournament Coming!', message: 'Big tournament next week with prizes!', icon: '🏆', active: false },

    // Polls
    { type: 'poll', title: 'Favorite Game Mode?', message: 'Vote for your favorite!', icon: '📊', active: true, pollOptions: ['Disco 🪩', 'Matrix 💊', 'Chaos 🌀', 'Rainbow 🌈'] },
    { type: 'poll', title: 'Next Feature?', message: 'What should we add next?', icon: '🗳️', active: true, pollOptions: ['More maps', 'New pieces', 'Chat system', 'Tournaments'] },
    { type: 'poll', title: 'Best Team?', message: 'Which team do you prefer?', icon: '⚔️', active: false, pollOptions: ['Yellow 💛', 'Green 💚'] },
  ]

  let count = 0
  for (const event of sampleEvents) {
    try {
      const eventRef = doc(collection(db, 'events'))
      await setDoc(eventRef, {
        ...event,
        createdAt: Date.now(),
        createdBy: currentUserData.username,
        claimedBy: []
      })
      count++
    } catch (e) {
      console.error('Error creating sample event:', e)
    }
  }

  return count
}

// Delete a user account completely
// Returns true even if user doesn't exist (so phantom accounts can be removed from UI)
export async function adminDeleteUser(userId: string): Promise<boolean> {
  console.log('[ADMIN] Attempting to delete user:', userId)

  if (!db) {
    console.error('[ADMIN] Database not initialized')
    return false
  }

  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] Not an admin, cannot delete user')
    return false
  }

  try {
    // Get user data to find username for cleanup
    const userDoc = await getDoc(doc(db, 'users', userId))
    console.log('[ADMIN] User document exists:', userDoc.exists())

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData
      console.log('[ADMIN] Deleting user:', userData.username)

      // Delete username mapping
      try {
        await deleteDoc(doc(db, 'usernames', userData.username.toLowerCase()))
        console.log('[ADMIN] Deleted username mapping')
      } catch (e) {
        console.log('[ADMIN] Could not delete username mapping (might not exist):', e)
      }

      // Delete the user document
      await deleteDoc(doc(db, 'users', userId))
      console.log('[ADMIN] Deleted user document')
    } else {
      console.log('[ADMIN] User document does not exist, nothing to delete')
    }

    // Also remove from online collection if present
    try {
      await deleteDoc(doc(db, 'online', userId))
      console.log('[ADMIN] Removed from online collection')
    } catch (e) {
      // Ignore if not online
    }

    console.log('[ADMIN] User deletion successful')
    return true
  } catch (error) {
    console.error('[ADMIN] Error deleting user:', error)

    // Even if there's an error, if the user doesn't exist we should return true
    // to allow removing phantom entries from the UI
    try {
      const checkDoc = await getDoc(doc(db, 'users', userId))
      if (!checkDoc.exists()) {
        console.log('[ADMIN] User does not exist after error, treating as success')
        return true // User doesn't exist, so "deletion" succeeded
      }
    } catch (e) {
      console.error('[ADMIN] Could not verify user existence:', e)
    }
    return false
  }
}

// ==================== CHAT SYSTEM ====================

// Bad words filter (Dutch + English)
const BAD_WORDS = [
  // Dutch
  'kut', 'lul', 'eikel', 'klootzak', 'hoer', 'slet', 'kanker', 'tyfus', 'tering', 'godver', 'kak', 'stront', 'pik', 'neuken', 'flikker', 'homo', 'mongool', 'debiel', 'idioot', 'sukkel', 'stomkop', 'drol', 'poep', 'schijt',
  // English
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'dick', 'cock', 'pussy', 'whore', 'slut', 'bastard', 'cunt', 'nigger', 'faggot', 'retard', 'idiot', 'stupid', 'dumb'
]

// Filter bad words from message
export function filterBadWords(message: string): { filtered: string; wasFiltered: boolean } {
  let filtered = message
  let wasFiltered = false

  for (const word of BAD_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    if (regex.test(filtered)) {
      wasFiltered = true
      filtered = filtered.replace(regex, '*'.repeat(word.length))
    }
  }

  return { filtered, wasFiltered }
}

// Quick chat messages
export const QUICK_CHAT_MESSAGES = [
  { id: 'gg', text: 'Good game!', textNL: 'Goed gespeeld!' },
  { id: 'nice', text: 'Nice move!', textNL: 'Goede zet!' },
  { id: 'think', text: 'Thinking...', textNL: 'Ik denk na...' },
  { id: 'gl', text: 'Good luck!', textNL: 'Succes!' },
  { id: 'thanks', text: 'Thanks!', textNL: 'Bedankt!' },
  { id: 'sorry', text: 'Sorry!', textNL: 'Sorry!' },
  { id: 'wow', text: 'Wow!', textNL: 'Wow!' },
  { id: 'oops', text: 'Oops!', textNL: 'Oeps!' }
]

// Chat message interface
export interface GameChatMessage {
  id: string
  gameId: string
  fromPlayerId: string
  fromUsername: string
  message: string
  timestamp: number
  team: 'yellow' | 'green'
  isQuickChat: boolean
  quickChatId?: string
}

// Chat listener
let chatUnsubscribe: (() => void) | null = null
let chatCallback: ((messages: GameChatMessage[]) => void) | null = null

// Send chat message
export async function sendChatMessage(gameId: string, message: string, team: 'yellow' | 'green', isQuickChat: boolean = false, quickChatId?: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    // Filter bad words if not quick chat
    let finalMessage = message
    if (!isQuickChat) {
      const { filtered } = filterBadWords(message)
      finalMessage = filtered
    }

    const chatRef = doc(collection(db, 'gameChats'))
    await setDoc(chatRef, {
      gameId,
      fromPlayerId: currentUser.uid,
      fromUsername: currentUserData.username,
      message: finalMessage,
      timestamp: Date.now(),
      team,
      isQuickChat,
      quickChatId: quickChatId || null
    })

    // Update chat messages sent stat
    const newChatCount = (currentUserData.stats.chatMessagesSent || 0) + 1
    await updateDoc(doc(db, 'users', currentUser.uid), {
      'stats.chatMessagesSent': newChatCount
    })

    return true
  } catch (error) {
    console.error('Error sending chat message:', error)
    return false
  }
}

// Listen to game chat
export function listenToGameChat(gameId: string, callback: (messages: GameChatMessage[]) => void): void {
  if (!db) return

  chatCallback = callback

  // Clean up existing listener
  if (chatUnsubscribe) {
    chatUnsubscribe()
  }

  const q = query(
    collection(db, 'gameChats'),
    where('gameId', '==', gameId)
  )

  chatUnsubscribe = onSnapshot(q, (snapshot) => {
    const messages: GameChatMessage[] = []
    snapshot.forEach((docSnap) => {
      messages.push({
        id: docSnap.id,
        ...docSnap.data()
      } as GameChatMessage)
    })
    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp)
    if (chatCallback) {
      chatCallback(messages)
    }
  })
}

// Stop listening to chat
export function stopListeningToChat(): void {
  if (chatUnsubscribe) {
    chatUnsubscribe()
    chatUnsubscribe = null
  }
}

// ==================== PUZZLE SYSTEM ====================

// Puzzle interface
export interface Puzzle {
  id: string
  name: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  maxMoves: number  // 1, 2, or 3
  objective: string  // e.g., "Capture the Tank", "Eliminate the Builder"
  objectiveType: 'capture' | 'score' | 'survive' | 'reach' | 'eliminate_all' | 'protect'
  targetPieceType?: string  // For capture objectives
  targetPosition?: { row: number; col: number }  // Specific target piece position
  targetScore?: number  // For score objectives
  targetSquare?: { row: number; col: number }  // For reach objectives
  protectPieceType?: string  // For protect objectives
  protectTurns?: number  // How many turns to protect
  timerSeconds?: number  // Optional timer in seconds (0 = no timer)
  startingTurn?: number  // Welke beurt de puzzle start (voor rocket/hacker cooldowns)
  initialBoard: Array<{ type: string; position: { row: number; col: number }; team: string }>
  aiMoves: Array<{ from: { row: number; col: number }; to: { row: number; col: number }; action?: 'move' | 'shoot' }>
  rewards: {
    warBucks: number
    xp: number
    itemId?: string  // Optional: unlock a shop item as reward
  }
  createdAt: number
  createdBy: string
  timesAttempted: number
  timesSolved: number
  rating: number  // Difficulty rating based on solve rate
  featured?: boolean  // If true, always included in daily puzzles
  noBases?: boolean  // If true, don't auto-spawn bases
  isSample?: boolean  // If true, this is a sample puzzle (can be deleted with "Reset")
}

// Check if solved puzzles should reset (new day)
export async function checkDailyPuzzleReset(): Promise<void> {
  if (!db || !currentUser || !currentUserData) return

  const puzzleStats = currentUserData.puzzleStats
  if (!puzzleStats) return

  const today = new Date().setHours(0, 0, 0, 0)
  const lastPuzzleDay = new Date(puzzleStats.lastPuzzleDate || 0).setHours(0, 0, 0, 0)

  // If it's a new day, reset solvedPuzzleIds
  if (lastPuzzleDay < today && puzzleStats.solvedPuzzleIds && puzzleStats.solvedPuzzleIds.length > 0) {
    console.log('[PUZZLE] New day detected, resetting solvedPuzzleIds')
    await updateDoc(doc(db, 'users', currentUser.uid), {
      'puzzleStats.solvedPuzzleIds': []
    })
    // Update local data
    currentUserData.puzzleStats.solvedPuzzleIds = []
  }
}

// Get daily puzzles (5 random puzzles that change each day)
export async function getDailyPuzzles(): Promise<Puzzle[]> {
  if (!db) return []

  // Check if we need to reset solved puzzles for new day
  await checkDailyPuzzleReset()

  try {
    const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'))
    const allPuzzles = puzzlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Puzzle))

    // Separate featured and non-featured puzzles
    const featuredPuzzles = allPuzzles.filter(p => p.featured)
    const regularPuzzles = allPuzzles.filter(p => !p.featured)

    // If less than 5 total puzzles exist, return all
    if (allPuzzles.length <= 5) {
      return allPuzzles
    }

    // Use today's date as a seed for consistent daily randomization
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

    // Seeded random shuffle
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000
      return x - Math.floor(x)
    }

    // Create shuffled copy of regular puzzles using seeded random
    const shuffled = [...regularPuzzles]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Start with all featured puzzles, then fill remaining slots with random ones
    const result = [...featuredPuzzles]
    const remainingSlots = 5 - result.length
    if (remainingSlots > 0) {
      result.push(...shuffled.slice(0, remainingSlots))
    }

    // Return max 5 puzzles (in case there are more than 5 featured)
    return result.slice(0, 5)
  } catch (error) {
    console.error('Error getting puzzles:', error)
    return []
  }
}

// Record puzzle attempt
export async function recordPuzzleAttempt(puzzleId: string, solved: boolean, attempts: number): Promise<{ warBucks: number; perfect: boolean; itemId?: string; itemName?: string }> {
  if (!db || !currentUser || !currentUserData) return { warBucks: 0, perfect: false }

  try {
    // Update puzzle stats
    const puzzleRef = doc(db, 'puzzles', puzzleId)
    const puzzleDoc = await getDoc(puzzleRef)
    if (puzzleDoc.exists()) {
      const puzzle = puzzleDoc.data() as Puzzle
      await updateDoc(puzzleRef, {
        timesAttempted: puzzle.timesAttempted + 1,
        timesSolved: solved ? puzzle.timesSolved + 1 : puzzle.timesSolved
      })
    }

    if (!solved) return { warBucks: 0, perfect: false }

    // Get puzzle rewards from the already fetched puzzleDoc
    const puzzleData = puzzleDoc.exists() ? puzzleDoc.data() as Puzzle : null
    const baseReward = puzzleData?.rewards?.warBucks || 50
    const itemReward = puzzleData?.rewards?.itemId

    // Calculate rewards based on attempts
    let warBucks = 0
    const perfect = attempts === 1

    if (attempts === 1) {
      warBucks = baseReward  // Perfect solve - full reward
    } else if (attempts === 2) {
      warBucks = Math.floor(baseReward * 0.6)  // 60% for 2nd attempt
    } else {
      warBucks = Math.floor(baseReward * 0.3)  // 30% for 3+ attempts
    }

    // Update user stats
    const puzzleStats = currentUserData.puzzleStats || {
      puzzlesSolved: 0,
      puzzlesAttempted: 0,
      perfectSolves: 0,
      dailyStreak: 0,
      lastPuzzleDate: 0,
      solvedPuzzleIds: []
    }

    const today = new Date().setHours(0, 0, 0, 0)
    const lastPuzzle = new Date(puzzleStats.lastPuzzleDate).setHours(0, 0, 0, 0)
    const yesterday = today - 86400000

    let newStreak = puzzleStats.dailyStreak
    if (lastPuzzle === yesterday) {
      newStreak += 1  // Continue streak
    } else if (lastPuzzle !== today) {
      newStreak = 1  // Start new streak
    }
    // If solved today already, don't change streak

    await updateDoc(doc(db, 'users', currentUser.uid), {
      warBucks: currentUserData.warBucks + warBucks,
      'stats.totalWarBucksEarned': (currentUserData.stats.totalWarBucksEarned || 0) + warBucks,
      'puzzleStats.puzzlesSolved': puzzleStats.puzzlesSolved + 1,
      'puzzleStats.puzzlesAttempted': puzzleStats.puzzlesAttempted + attempts,
      'puzzleStats.perfectSolves': perfect ? puzzleStats.perfectSolves + 1 : puzzleStats.perfectSolves,
      'puzzleStats.dailyStreak': newStreak,
      'puzzleStats.lastPuzzleDate': Date.now(),
      'puzzleStats.solvedPuzzleIds': arrayUnion(puzzleId)
    })

    // Update local user data so UI reflects changes immediately
    currentUserData.warBucks += warBucks
    currentUserData.stats.totalWarBucksEarned = (currentUserData.stats.totalWarBucksEarned || 0) + warBucks
    if (!currentUserData.puzzleStats) {
      currentUserData.puzzleStats = { puzzlesSolved: 0, puzzlesAttempted: 0, perfectSolves: 0, dailyStreak: 0, lastPuzzleDate: 0, solvedPuzzleIds: [] }
    }
    currentUserData.puzzleStats.puzzlesSolved = puzzleStats.puzzlesSolved + 1
    currentUserData.puzzleStats.puzzlesAttempted = puzzleStats.puzzlesAttempted + attempts
    currentUserData.puzzleStats.perfectSolves = perfect ? puzzleStats.perfectSolves + 1 : puzzleStats.perfectSolves
    currentUserData.puzzleStats.dailyStreak = newStreak
    currentUserData.puzzleStats.lastPuzzleDate = Date.now()
    if (!currentUserData.puzzleStats.solvedPuzzleIds.includes(puzzleId)) {
      currentUserData.puzzleStats.solvedPuzzleIds.push(puzzleId)
    }

    // Handle item reward (only on first solve / perfect)
    let unlockedItemId: string | undefined
    let unlockedItemName: string | undefined
    if (perfect && itemReward) {
      const purchasedItems = currentUserData.purchasedItems || []
      if (!purchasedItems.includes(itemReward)) {
        // Give the item
        await updateDoc(doc(db, 'users', currentUser.uid), {
          purchasedItems: arrayUnion(itemReward)
        })
        currentUserData.purchasedItems = [...purchasedItems, itemReward]
        unlockedItemId = itemReward
        // Find item name
        const shopItem = SHOP_ITEMS.find(i => i.id === itemReward)
        unlockedItemName = shopItem?.name || itemReward
        console.log('[PUZZLE] Item reward unlocked:', itemReward)
      }
    }

    return { warBucks, perfect, itemId: unlockedItemId, itemName: unlockedItemName }
  } catch (error) {
    console.error('Error recording puzzle attempt:', error)
    return { warBucks: 0, perfect: false }
  }
}

// Admin: Create puzzle
export async function adminCreatePuzzle(puzzle: Omit<Puzzle, 'id' | 'createdAt' | 'createdBy' | 'timesAttempted' | 'timesSolved' | 'rating'>): Promise<string | null> {
  console.log('[ADMIN] adminCreatePuzzle called', { puzzleName: puzzle.name, difficulty: puzzle.difficulty })

  if (!db) {
    console.error('[ADMIN] adminCreatePuzzle FAILED: Database not initialized')
    return null
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminCreatePuzzle FAILED: User is not admin')
    return null
  }
  if (!currentUserData) {
    console.error('[ADMIN] adminCreatePuzzle FAILED: No user data')
    return null
  }

  try {
    console.log('[ADMIN] adminCreatePuzzle: Creating puzzle document...')
    const puzzleRef = doc(collection(db, 'puzzles'))

    // Filter out undefined values (Firestore doesn't accept them)
    const cleanPuzzle = Object.fromEntries(
      Object.entries(puzzle).filter(([_, v]) => v !== undefined)
    )

    await setDoc(puzzleRef, {
      ...cleanPuzzle,
      createdAt: Date.now(),
      createdBy: currentUserData.username,
      timesAttempted: 0,
      timesSolved: 0,
      rating: puzzle.difficulty === 'easy' ? 1 : puzzle.difficulty === 'medium' ? 2 : 3
    })
    console.log('[ADMIN] adminCreatePuzzle SUCCESS: Created puzzle with ID', puzzleRef.id)
    return puzzleRef.id
  } catch (error) {
    console.error('[ADMIN] adminCreatePuzzle ERROR:', error)
    return null
  }
}

// Admin: Get all puzzles
export async function adminGetAllPuzzles(): Promise<Puzzle[]> {
  console.log('[ADMIN] adminGetAllPuzzles called')

  if (!db) {
    console.error('[ADMIN] adminGetAllPuzzles FAILED: Database not initialized')
    return []
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminGetAllPuzzles FAILED: User is not admin')
    return []
  }

  try {
    console.log('[ADMIN] adminGetAllPuzzles: Fetching puzzles collection...')
    const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'))
    const puzzles = puzzlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Puzzle))
    console.log('[ADMIN] adminGetAllPuzzles SUCCESS: Found', puzzles.length, 'puzzles')
    return puzzles
  } catch (error) {
    console.error('[ADMIN] adminGetAllPuzzles ERROR:', error)
    return []
  }
}

// Admin: Toggle puzzle featured status
export async function adminTogglePuzzleFeatured(puzzleId: string, featured: boolean): Promise<boolean> {
  console.log('[ADMIN] adminTogglePuzzleFeatured called', { puzzleId, featured })

  if (!db) {
    console.error('[ADMIN] adminTogglePuzzleFeatured FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminTogglePuzzleFeatured FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminTogglePuzzleFeatured: Updating puzzle...')
    await updateDoc(doc(db, 'puzzles', puzzleId), { featured })
    console.log('[ADMIN] adminTogglePuzzleFeatured SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminTogglePuzzleFeatured ERROR:', error)
    return false
  }
}

// Admin: Delete puzzle
export async function adminDeletePuzzle(puzzleId: string): Promise<boolean> {
  console.log('[ADMIN] adminDeletePuzzle called', { puzzleId })

  if (!db) {
    console.error('[ADMIN] adminDeletePuzzle FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminDeletePuzzle FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminDeletePuzzle: Deleting puzzle document...')
    await deleteDoc(doc(db, 'puzzles', puzzleId))
    console.log('[ADMIN] adminDeletePuzzle SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminDeletePuzzle ERROR:', error)
    return false
  }
}

// Admin: Update existing puzzle
export async function adminUpdatePuzzle(puzzleId: string, puzzleData: {
  name: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  maxMoves: number
  startingTurn?: number
  timerSeconds?: number
  objective: string
  objectiveType: 'capture' | 'score' | 'survive' | 'reach' | 'eliminate_all' | 'protect'
  targetPieceType?: string
  targetPosition?: { row: number; col: number }
  targetScore?: number
  targetSquare?: { row: number; col: number }
  protectPieceType?: string
  protectTurns?: number
  initialBoard: Array<{ type: string; position: { row: number; col: number }; team: string }>
  aiMoves: Array<{ from: { row: number; col: number }; to: { row: number; col: number }; action?: 'move' | 'shoot' }>
  rewards: { warBucks: number; xp: number }
}): Promise<boolean> {
  console.log('[ADMIN] adminUpdatePuzzle called', { puzzleId, puzzleData })

  if (!db) {
    console.error('[ADMIN] adminUpdatePuzzle FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminUpdatePuzzle FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminUpdatePuzzle: Updating puzzle document...')

    // Build update object without undefined values (Firestore doesn't accept undefined)
    const updateData: Record<string, unknown> = {
      name: puzzleData.name,
      icon: puzzleData.icon,
      difficulty: puzzleData.difficulty,
      maxMoves: puzzleData.maxMoves,
      startingTurn: puzzleData.startingTurn || 1,
      objective: puzzleData.objective,
      objectiveType: puzzleData.objectiveType,
      initialBoard: puzzleData.initialBoard,
      aiMoves: puzzleData.aiMoves,
      rewards: puzzleData.rewards
    }

    // Only add optional fields if they're defined
    if (puzzleData.targetPieceType !== undefined) {
      updateData.targetPieceType = puzzleData.targetPieceType
    }
    if (puzzleData.targetPosition !== undefined) {
      updateData.targetPosition = puzzleData.targetPosition
    }
    if (puzzleData.targetScore !== undefined) {
      updateData.targetScore = puzzleData.targetScore
    }
    if (puzzleData.timerSeconds !== undefined) {
      updateData.timerSeconds = puzzleData.timerSeconds
    }
    if (puzzleData.targetSquare !== undefined) {
      updateData.targetSquare = puzzleData.targetSquare
    }
    if (puzzleData.protectPieceType !== undefined) {
      updateData.protectPieceType = puzzleData.protectPieceType
    }
    if (puzzleData.protectTurns !== undefined) {
      updateData.protectTurns = puzzleData.protectTurns
    }

    await updateDoc(doc(db, 'puzzles', puzzleId), updateData)
    console.log('[ADMIN] adminUpdatePuzzle SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminUpdatePuzzle ERROR:', error)
    return false
  }
}

// Admin: Delete sample puzzles by name
export async function adminDeleteAllPuzzles(): Promise<number> {
  if (!db || !isCurrentUserAdmin()) return 0

  // Namen van sample puzzles die verwijderd moeten worden
  const sampleNames = [
    'Find the Sniper', 'Tank Destroyer', 'Helicopter Hunt',
    'Point Grab', 'High Value Targets', 'Maximum Damage',
    'Guard the Builder', 'Defend the Tank',
    'Clean Sweep', 'Total Destruction', 'Annihilation',
    'Escape Route', 'Infiltration', 'Deep Strike',
    // Oude sample names
    'Sniper Shot', 'Tank Blast', 'Helicopter Strike',
    'Tank Rush', 'Naval Battle', 'Hacker Mission',
    'Air Superiority', 'Naval Domination', 'Cyber Warfare',
    'Win a Game'
  ]

  try {
    const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'))
    let count = 0
    for (const puzzleDoc of puzzlesSnapshot.docs) {
      const data = puzzleDoc.data()
      // Delete if it's a sample puzzle (by name or flag)
      if (data.isSample === true || sampleNames.includes(data.name)) {
        await deleteDoc(doc(db, 'puzzles', puzzleDoc.id))
        count++
      }
    }
    console.log(`[ADMIN] Deleted ${count} sample puzzles`)
    return count
  } catch (error) {
    console.error('[ADMIN] Error deleting puzzles:', error)
    return 0
  }
}

// Admin: Create sample puzzles
export async function adminCreateSamplePuzzles(): Promise<number> {
  console.log('[ADMIN] adminCreateSamplePuzzles called')
  console.log('[ADMIN] db:', !!db, 'isAdmin:', isCurrentUserAdmin(), 'userData:', !!currentUserData)

  if (!db) {
    console.error('[ADMIN] adminCreateSamplePuzzles FAILED: No database')
    return 0
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminCreateSamplePuzzles FAILED: Not admin')
    return 0
  }
  if (!currentUserData) {
    console.error('[ADMIN] adminCreateSamplePuzzles FAILED: No user data')
    return 0
  }

  console.log('[ADMIN] All checks passed, creating puzzles...')

  const samplePuzzles: Omit<Puzzle, 'id' | 'createdAt' | 'createdBy' | 'timesAttempted' | 'timesSolved' | 'rating'>[] = [
    // ========================================
    // CAPTURE PUZZLES - Find and destroy target
    // ========================================
    {
      name: 'Find the Sniper',
      icon: '🎯',
      difficulty: 'easy',
      maxMoves: 1,
      objective: 'Shoot the enemy soldier at E7!',
      objectiveType: 'capture',
      targetPieceType: 'soldier',
      targetPosition: { row: 7, col: 4 },  // E7
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'soldier', position: { row: 5, col: 4 }, team: 'blue' },  // E5 - can shoot E7
        // Target (marked with position)
        { type: 'soldier', position: { row: 7, col: 4 }, team: 'red' },   // E7 - TARGET
        // Decoration enemies (not the target)
        { type: 'soldier', position: { row: 7, col: 2 }, team: 'red' },   // C7
        { type: 'soldier', position: { row: 7, col: 6 }, team: 'red' },   // G7
        { type: 'soldier', position: { row: 8, col: 4 }, team: 'red' },   // E8
      ],
      aiMoves: [],
      rewards: { warBucks: 40, xp: 20 }
    },
    {
      name: 'Tank Destroyer',
      icon: '💥',
      difficulty: 'easy',
      maxMoves: 1,
      objective: 'Destroy the tank at F8!',
      objectiveType: 'capture',
      targetPieceType: 'tank',
      targetPosition: { row: 8, col: 5 },  // F8 (niet in tunnel!)
      noBases: true,
      initialBoard: [
        // Player tank - kan 2 omhoog schieten
        { type: 'tank', position: { row: 5, col: 5 }, team: 'blue' },     // F5
        // Target tank - 2 boven tunnel (row 7 skip, row 8 target)
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },      // F8 - TARGET
        // Decoration rond het doel
        { type: 'soldier', position: { row: 8, col: 3 }, team: 'red' },   // D8
        { type: 'soldier', position: { row: 8, col: 7 }, team: 'red' },   // H8
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },   // F9
      ],
      aiMoves: [],
      rewards: { warBucks: 40, xp: 20 }
    },
    {
      name: 'Helicopter Hunt',
      icon: '🚁',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Find and capture the helicopter at H8!',
      objectiveType: 'capture',
      targetPieceType: 'helicopter',
      targetPosition: { row: 8, col: 7 },  // H8
      noBases: true,
      initialBoard: [
        // Player helicopter
        { type: 'helicopter', position: { row: 3, col: 3 }, team: 'blue' }, // D3
        // Target helicopter
        { type: 'helicopter', position: { row: 8, col: 7 }, team: 'red' },  // H8 - TARGET
        // Lots of decoration to confuse
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 6 }, team: 'red' },
        { type: 'tank', position: { row: 4, col: 8 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 60, xp: 35 }
    },

    // ========================================
    // SCORE PUZZLES - Get enough points
    // ========================================
    {
      name: 'Point Grab',
      icon: '⭐',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Score at least 6 points!',
      objectiveType: 'score',
      targetScore: 6,
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },  // E4
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },  // G4
        // Easy targets (soldiers = 3 points each)
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },   // E6 - 3 pts
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },   // G6 - 3 pts
        // Decoration
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 50, xp: 25 }
    },
    {
      name: 'High Value Targets',
      icon: '💰',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Score at least 12 points!',
      objectiveType: 'score',
      targetScore: 12,
      noBases: true,
      initialBoard: [
        // Player tank
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },     // F3
        // High value targets
        { type: 'tank', position: { row: 5, col: 5 }, team: 'red' },      // F5 - 6 pts
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },      // F7 - 6 pts
        // Decoy low value
        { type: 'soldier', position: { row: 5, col: 3 }, team: 'red' },   // 3 pts
        { type: 'soldier', position: { row: 5, col: 7 }, team: 'red' },   // 3 pts
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 70, xp: 40 }
    },
    {
      name: 'Maximum Damage',
      icon: '🔥',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Score at least 20 points!',
      objectiveType: 'score',
      targetScore: 20,
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'helicopter', position: { row: 2, col: 4 }, team: 'blue' }, // E2
        { type: 'soldier', position: { row: 3, col: 6 }, team: 'blue' },    // G3
        // Targets spread out
        { type: 'tank', position: { row: 6, col: 3 }, team: 'red' },        // D6 - 6 pts
        { type: 'tank', position: { row: 7, col: 7 }, team: 'red' },        // H7 - 6 pts
        { type: 'helicopter', position: { row: 5, col: 5 }, team: 'red' },  // F5 - 5 pts
        { type: 'soldier', position: { row: 8, col: 4 }, team: 'red' },     // E8 - 3 pts
        { type: 'soldier', position: { row: 4, col: 2 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 60 }
    },

    // ========================================
    // PROTECT PUZZLES - Keep piece alive
    // ========================================
    {
      name: 'Guard the Builder',
      icon: '🛡️',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Protect your builder for 2 turns!',
      objectiveType: 'protect',
      protectPieceType: 'builder',
      protectTurns: 2,
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'builder', position: { row: 5, col: 5 }, team: 'blue' },   // F5 - PROTECT THIS
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },   // F4
        { type: 'soldier', position: { row: 5, col: 4 }, team: 'blue' },   // E5
        // Attackers
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },    // F7 - will try to attack
        { type: 'soldier', position: { row: 5, col: 7 }, team: 'red' },    // H5
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
      ],
      aiMoves: [
        { from: { row: 7, col: 5 }, to: { row: 6, col: 5 }, action: 'move' },  // Enemy moves closer
        { from: { row: 5, col: 7 }, to: { row: 5, col: 6 }, action: 'move' },  // Other enemy moves
      ],
      rewards: { warBucks: 75, xp: 45 }
    },
    {
      name: 'Defend the Tank',
      icon: '🏰',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Keep your tank alive for 3 turns!',
      objectiveType: 'protect',
      protectPieceType: 'tank',
      protectTurns: 3,
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'tank', position: { row: 5, col: 5 }, team: 'blue' },      // F5 - PROTECT THIS
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },   // E4
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },   // G4
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'blue' },   // E6
        // Many attackers
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },       // F8
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 3, col: 5 }, team: 'red' },
      ],
      aiMoves: [
        { from: { row: 8, col: 5 }, to: { row: 7, col: 5 }, action: 'move' },
        { from: { row: 7, col: 3 }, to: { row: 6, col: 3 }, action: 'move' },
        { from: { row: 7, col: 5 }, to: { row: 6, col: 5 }, action: 'move' },
      ],
      rewards: { warBucks: 100, xp: 60 }
    },

    // ========================================
    // ELIMINATE ALL PUZZLES - Clear the board
    // ========================================
    {
      name: 'Clean Sweep',
      icon: '🧹',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Eliminate all enemies!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },   // E4
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },   // G4
        // Enemies to eliminate (just 2)
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },    // E6
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },    // G6
      ],
      aiMoves: [],
      rewards: { warBucks: 50, xp: 25 }
    },
    {
      name: 'Total Destruction',
      icon: '💀',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Destroy all enemy forces!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        // Player tank - can crush multiple
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },      // F3
        // Enemies in a line
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },    // F5
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },    // F7
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },    // F9
      ],
      aiMoves: [],
      rewards: { warBucks: 70, xp: 40 }
    },
    {
      name: 'Annihilation',
      icon: '☠️',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Leave no enemies standing!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        // Player pieces
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' }, // F2
        { type: 'soldier', position: { row: 3, col: 3 }, team: 'blue' },    // D3
        // Enemies spread around
        { type: 'soldier', position: { row: 5, col: 2 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 4 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 60 }
    },

    // ========================================
    // REACH PUZZLES - Get to target square
    // ========================================
    {
      name: 'Escape Route',
      icon: '🏃',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Reach the target square at H8!',
      objectiveType: 'reach',
      targetSquare: { row: 8, col: 7 },  // H8
      noBases: true,
      initialBoard: [
        // Player soldier
        { type: 'soldier', position: { row: 6, col: 5 }, team: 'blue' },   // F6
        // Blocking enemies
        { type: 'soldier', position: { row: 7, col: 6 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 45, xp: 20 }
    },
    {
      name: 'Infiltration',
      icon: '🥷',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Sneak your soldier to B10!',
      objectiveType: 'reach',
      targetSquare: { row: 10, col: 1 },  // B10
      noBases: true,
      initialBoard: [
        // Player soldier
        { type: 'soldier', position: { row: 7, col: 4 }, team: 'blue' },   // E7
        // Enemy patrol
        { type: 'soldier', position: { row: 8, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 2 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 10, col: 4 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 65, xp: 35 }
    },
    {
      name: 'Deep Strike',
      icon: '⚡',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Fly your helicopter to K11!',
      objectiveType: 'reach',
      targetSquare: { row: 11, col: 10 },  // K11
      noBases: true,
      initialBoard: [
        // Player helicopter
        { type: 'helicopter', position: { row: 3, col: 2 }, team: 'blue' }, // C3
        // Enemy air defense spread out
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 9 }, team: 'red' },
        { type: 'tank', position: { row: 6, col: 8 }, team: 'red' },
        { type: 'tank', position: { row: 10, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 90, xp: 55 }
    },
  ]

  // ========================================
  // ITEM REWARD PUZZLES - Unlock special items!
  // ========================================
  const itemRewardPuzzles: typeof samplePuzzles = [
    // EFFECT REWARDS
    {
      name: 'Fire Master',
      icon: '🔥',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Destroy 2 tanks to unlock the Fire Trail effect!',
      objectiveType: 'score',
      targetScore: 12,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 50, itemId: 'effect_fire' }
    },
    {
      name: 'Lightning Strike',
      icon: '⚡',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Eliminate all enemies to unlock Lightning effects!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 3, col: 3 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 2 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 150, xp: 75, itemId: 'effect_lightning' }
    },
    {
      name: 'Sparkle Party',
      icon: '✨',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Capture the soldier at F7 to get Sparkle effect!',
      objectiveType: 'capture',
      targetPieceType: 'soldier',
      targetPosition: { row: 7, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 60, xp: 30, itemId: 'effect_sparkle' }
    },
    {
      name: 'Heart Collector',
      icon: '❤️',
      difficulty: 'easy',
      maxMoves: 1,
      objective: 'One shot, one love! Capture to unlock Hearts!',
      objectiveType: 'capture',
      targetPieceType: 'soldier',
      targetPosition: { row: 6, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 50, xp: 25, itemId: 'effect_hearts' }
    },
    {
      name: 'Ghost Hunter',
      icon: '👻',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Find and destroy the hidden tank to get Ghost Trail!',
      objectiveType: 'capture',
      targetPieceType: 'tank',
      targetPosition: { row: 9, col: 8 },
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 2 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 6 }, team: 'red' },
        { type: 'tank', position: { row: 9, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 175, xp: 85, itemId: 'effect_ghost' }
    },
    {
      name: 'Rainbow Road',
      icon: '🌈',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Reach H10 to unlock Rainbow Trail!',
      objectiveType: 'reach',
      targetSquare: { row: 10, col: 7 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 7, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 6 }, team: 'red' },
        { type: 'tank', position: { row: 10, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 125, xp: 60, itemId: 'effect_rainbow' }
    },
    {
      name: 'Cherry Blossom',
      icon: '🌸',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Protect your builder for 1 turn to unlock Sakura!',
      objectiveType: 'protect',
      protectPieceType: 'builder',
      protectTurns: 1,
      noBases: true,
      initialBoard: [
        { type: 'builder', position: { row: 5, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 5, col: 7 }, team: 'red' },
      ],
      aiMoves: [
        { from: { row: 7, col: 5 }, to: { row: 6, col: 5 }, action: 'move' },
      ],
      rewards: { warBucks: 100, xp: 50, itemId: 'effect_sakura' }
    },

    // THEME REWARDS
    {
      name: 'Desert Storm',
      icon: '🏜️',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Score 6 points to unlock Desert Camo theme!',
      objectiveType: 'score',
      targetScore: 6,
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 75, xp: 35, itemId: 'theme_desert' }
    },
    {
      name: 'Arctic Assault',
      icon: '❄️',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Capture the tank at G8 to unlock Arctic theme!',
      objectiveType: 'capture',
      targetPieceType: 'tank',
      targetPosition: { row: 8, col: 6 },
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 5, col: 6 }, team: 'blue' },
        { type: 'tank', position: { row: 8, col: 6 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 90, xp: 45, itemId: 'theme_arctic' }
    },
    {
      name: 'Jungle Warfare',
      icon: '🌴',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Eliminate all 4 enemies to unlock Jungle theme!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 5, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 120, xp: 60, itemId: 'theme_jungle' }
    },
    {
      name: 'Night Operations',
      icon: '🌙',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Score 15 points in the dark to unlock Night Ops!',
      objectiveType: 'score',
      targetScore: 15,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 3 }, team: 'blue' },
        { type: 'tank', position: { row: 6, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 150, xp: 75, itemId: 'theme_night' }
    },
    {
      name: 'Ocean Battle',
      icon: '🌊',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Reach the shore at J9 to unlock Ocean theme!',
      objectiveType: 'reach',
      targetSquare: { row: 9, col: 9 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'blue' },
        { type: 'soldier', position: { row: 8, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 65, xp: 30, itemId: 'theme_ocean' }
    },
    {
      name: 'Volcanic Victory',
      icon: '🌋',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Protect your tank for 3 turns in the volcano!',
      objectiveType: 'protect',
      protectPieceType: 'tank',
      protectTurns: 3,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 5, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
      ],
      aiMoves: [
        { from: { row: 8, col: 5 }, to: { row: 7, col: 5 }, action: 'move' },
        { from: { row: 7, col: 3 }, to: { row: 6, col: 4 }, action: 'move' },
        { from: { row: 7, col: 5 }, to: { row: 6, col: 5 }, action: 'move' },
      ],
      rewards: { warBucks: 175, xp: 90, itemId: 'theme_lava' }
    },
    {
      name: 'Space Commander',
      icon: '🚀',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Destroy the alien helicopter to unlock Space theme!',
      objectiveType: 'capture',
      targetPieceType: 'helicopter',
      targetPosition: { row: 9, col: 9 },
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 2 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 6, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 8 }, team: 'red' },
        { type: 'helicopter', position: { row: 9, col: 9 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 200, xp: 100, itemId: 'theme_space' }
    },
    {
      name: 'Candy Crush',
      icon: '🍬',
      difficulty: 'easy',
      maxMoves: 1,
      objective: 'Sweet victory! Capture the candy soldier!',
      objectiveType: 'capture',
      targetPieceType: 'soldier',
      targetPosition: { row: 6, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 50, xp: 25, itemId: 'theme_candy' }
    },
    {
      name: 'Neon Nights',
      icon: '🌃',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Score 18 points in the neon city!',
      objectiveType: 'score',
      targetScore: 18,
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 5, col: 3 }, team: 'red' },
        { type: 'tank', position: { row: 5, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'helicopter', position: { row: 8, col: 8 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 175, xp: 85, itemId: 'theme_neon' }
    },
    {
      name: 'Golden Glory',
      icon: '💎',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Eliminate all for the ultimate Gold Rush theme!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'helicopter', position: { row: 2, col: 8 }, team: 'blue' },
        { type: 'tank', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'tank', position: { row: 6, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 225, xp: 110, itemId: 'theme_gold' }
    },

    // MUSIC PACK REWARDS
    {
      name: 'Electronic Beats',
      icon: '🎧',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Drop the beat! Score 10 points!',
      objectiveType: 'score',
      targetScore: 10,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 50, itemId: 'music_electronic' }
    },
    {
      name: 'Epic Orchestra',
      icon: '🎻',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Conduct an epic battle! Eliminate all!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 3, col: 3 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 150, xp: 75, itemId: 'music_orchestral' }
    },
    {
      name: 'Retro Gaming',
      icon: '🎮',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Classic gameplay! Reach E8!',
      objectiveType: 'reach',
      targetSquare: { row: 8, col: 4 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 60, xp: 30, itemId: 'music_chiptune' }
    },
    {
      name: 'Jazz Night',
      icon: '🎷',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Smooth moves! Protect your builder for 2 turns!',
      objectiveType: 'protect',
      protectPieceType: 'builder',
      protectTurns: 2,
      noBases: true,
      initialBoard: [
        { type: 'builder', position: { row: 5, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },
      ],
      aiMoves: [
        { from: { row: 7, col: 5 }, to: { row: 6, col: 5 }, action: 'move' },
        { from: { row: 8, col: 5 }, to: { row: 7, col: 5 }, action: 'move' },
      ],
      rewards: { warBucks: 110, xp: 55, itemId: 'music_jazz' }
    },
    {
      name: 'Rock Star',
      icon: '🎸',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Rock out! Destroy the enemy tank!',
      objectiveType: 'capture',
      targetPieceType: 'tank',
      targetPosition: { row: 7, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 50, itemId: 'music_rock' }
    },
    {
      name: 'Lo-Fi Chill',
      icon: '🎵',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Relax and score 6 points!',
      objectiveType: 'score',
      targetScore: 6,
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 3 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 60, xp: 30, itemId: 'music_lofi' }
    },
    {
      name: 'Epic Battle',
      icon: '⚔️',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Ultimate showdown! Score 25 points!',
      objectiveType: 'score',
      targetScore: 25,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'helicopter', position: { row: 2, col: 8 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 3 }, team: 'blue' },
        { type: 'tank', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'tank', position: { row: 6, col: 7 }, team: 'red' },
        { type: 'helicopter', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 6 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 200, xp: 100, itemId: 'music_epic' }
    },
    {
      name: 'Heavy Metal',
      icon: '🤘',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Destroy everything! Eliminate all enemies!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 150, xp: 75, itemId: 'music_metal' }
    },
    {
      name: 'Synthwave Sunset',
      icon: '🌆',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'Drive into the sunset! Reach J10!',
      objectiveType: 'reach',
      targetSquare: { row: 10, col: 9 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 7, col: 6 }, team: 'blue' },
        { type: 'soldier', position: { row: 8, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 8 }, team: 'red' },
        { type: 'tank', position: { row: 10, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 125, xp: 60, itemId: 'music_synthwave' }
    },

    // SOUND PACK REWARDS
    {
      name: 'Retro Arcade',
      icon: '🕹️',
      difficulty: 'easy',
      maxMoves: 1,
      objective: 'Insert coin! Quick capture!',
      objectiveType: 'capture',
      targetPieceType: 'soldier',
      targetPosition: { row: 6, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 50, xp: 25, itemId: 'sound_retro' }
    },
    {
      name: 'Sci-Fi Sounds',
      icon: '🛸',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Alien encounter! Capture the UFO (helicopter)!',
      objectiveType: 'capture',
      targetPieceType: 'helicopter',
      targetPosition: { row: 7, col: 7 },
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 3, col: 3 }, team: 'blue' },
        { type: 'helicopter', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 90, xp: 45, itemId: 'sound_scifi' }
    },
    {
      name: 'Cartoon Fun',
      icon: '🎪',
      difficulty: 'easy',
      maxMoves: 2,
      objective: 'Boing! Score 6 cartoon points!',
      objectiveType: 'score',
      targetScore: 6,
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 4, col: 4 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 6 }, team: 'blue' },
        { type: 'soldier', position: { row: 6, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 55, xp: 25, itemId: 'sound_cartoon' }
    },
    {
      name: 'War Zone',
      icon: '💣',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Total war! Score 20 points!',
      objectiveType: 'score',
      targetScore: 20,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'helicopter', position: { row: 2, col: 8 }, team: 'blue' },
        { type: 'tank', position: { row: 6, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 7 }, team: 'red' },
        { type: 'helicopter', position: { row: 5, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 160, xp: 80, itemId: 'sound_war' }
    },
    {
      name: 'Spooky Sounds',
      icon: '👻',
      difficulty: 'medium',
      maxMoves: 2,
      objective: 'Boo! Sneak to the haunted square G9!',
      objectiveType: 'reach',
      targetSquare: { row: 9, col: 6 },
      noBases: true,
      initialBoard: [
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 8, col: 6 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 85, xp: 40, itemId: 'sound_horror' }
    },
    {
      name: 'Medieval Battle',
      icon: '🏰',
      difficulty: 'medium',
      maxMoves: 3,
      objective: 'For the kingdom! Eliminate all foes!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 100, xp: 50, itemId: 'sound_medieval' }
    },

    // PIECE SKIN REWARDS
    {
      name: 'Robot Uprising',
      icon: '🤖',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Become the machine! Eliminate all humans!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'helicopter', position: { row: 2, col: 2 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 5, col: 7 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 250, xp: 125, itemId: 'skin_robot' }
    },
    {
      name: 'Knight Tournament',
      icon: '⚔️',
      difficulty: 'hard',
      maxMoves: 3,
      objective: 'Win the joust! Score 18 points!',
      objectiveType: 'score',
      targetScore: 18,
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 3, col: 5 }, team: 'blue' },
        { type: 'soldier', position: { row: 4, col: 3 }, team: 'blue' },
        { type: 'tank', position: { row: 6, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 7, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 225, xp: 110, itemId: 'skin_medieval' }
    },
    {
      name: 'Space Marines',
      icon: '🚀',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Galactic conquest! Score 30 points!',
      objectiveType: 'score',
      targetScore: 30,
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 3, col: 3 }, team: 'blue' },
        { type: 'tank', position: { row: 3, col: 7 }, team: 'blue' },
        { type: 'helicopter', position: { row: 5, col: 5 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 3 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 7 }, team: 'red' },
        { type: 'soldier', position: { row: 8, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 4 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 6 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 300, xp: 150, itemId: 'skin_scifi' }
    },
    {
      name: 'Pixel Perfect',
      icon: '👾',
      difficulty: 'medium',
      maxMoves: 2,
      objective: '8-bit glory! Capture the pixel boss!',
      objectiveType: 'capture',
      targetPieceType: 'tank',
      targetPosition: { row: 7, col: 5 },
      noBases: true,
      initialBoard: [
        { type: 'tank', position: { row: 4, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 3 }, team: 'red' },
        { type: 'soldier', position: { row: 6, col: 7 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 175, xp: 85, itemId: 'skin_pixel' }
    },
    {
      name: 'Crystal Quest',
      icon: '💎',
      difficulty: 'hard',
      maxMoves: 4,
      objective: 'Find all crystals! Eliminate all enemies!',
      objectiveType: 'eliminate_all',
      noBases: true,
      initialBoard: [
        { type: 'helicopter', position: { row: 2, col: 5 }, team: 'blue' },
        { type: 'tank', position: { row: 3, col: 3 }, team: 'blue' },
        { type: 'soldier', position: { row: 5, col: 2 }, team: 'red' },
        { type: 'soldier', position: { row: 5, col: 8 }, team: 'red' },
        { type: 'tank', position: { row: 7, col: 5 }, team: 'red' },
        { type: 'helicopter', position: { row: 8, col: 8 }, team: 'red' },
        { type: 'soldier', position: { row: 9, col: 5 }, team: 'red' },
      ],
      aiMoves: [],
      rewards: { warBucks: 325, xp: 160, itemId: 'skin_crystal' }
    },
  ]

  // Combine all puzzles
  const allPuzzles = [...samplePuzzles, ...itemRewardPuzzles]

  // Create all puzzles
  let created = 0
  for (const puzzleData of allPuzzles) {
    try {
      const puzzleDoc = await addDoc(collection(db, 'puzzles'), {
        ...puzzleData,
        createdAt: Date.now(),
        createdBy: currentUserData.username,
        timesAttempted: 0,
        timesSolved: 0,
        rating: puzzleData.difficulty === 'easy' ? 800 : puzzleData.difficulty === 'medium' ? 1200 : 1600,
        isSample: true
      })
      console.log('[ADMIN] Created puzzle:', puzzleData.name, puzzleDoc.id)
      created++
    } catch (error) {
      console.error('[ADMIN] Failed to create puzzle:', puzzleData.name, error)
    }
  }

  console.log('[ADMIN] adminCreateSamplePuzzles complete:', created, 'puzzles created')
  return created
}

// ==================== ADMIN BAN SYSTEM ====================

// Ban a user
export async function adminBanUser(userId: string, durationMinutes: number): Promise<boolean> {
  console.log('[ADMIN] adminBanUser called', { userId, durationMinutes })

  if (!db) {
    console.error('[ADMIN] adminBanUser FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminBanUser FAILED: User is not admin')
    return false
  }

  try {
    const banUntil = durationMinutes === 0 ? 0 : Date.now() + (durationMinutes * 60 * 1000)
    console.log('[ADMIN] adminBanUser: Setting ban until', banUntil === 0 ? 'never (unban)' : new Date(banUntil).toISOString())
    await updateDoc(doc(db, 'users', userId), { bannedUntil: banUntil })
    console.log('[ADMIN] adminBanUser SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminBanUser ERROR:', error)
    return false
  }
}

// Check if user is banned
export function isUserBanned(userData: UserData): boolean {
  if (!userData.bannedUntil) return false
  return userData.bannedUntil > Date.now()
}

// Get ban remaining time in minutes
export function getBanRemainingMinutes(userData: UserData): number {
  if (!userData.bannedUntil || userData.bannedUntil <= Date.now()) return 0
  return Math.ceil((userData.bannedUntil - Date.now()) / 60000)
}

// Admin: Reset user's daily puzzle progress
export async function adminResetPuzzleProgress(userId: string): Promise<boolean> {
  console.log('[ADMIN] adminResetPuzzleProgress called', { userId })

  if (!db) {
    const err = new Error('Database not initialized')
    console.error('[ADMIN] adminResetPuzzleProgress FAILED:', err.message)
    throw err
  }
  if (!isCurrentUserAdmin()) {
    const err = new Error('User is not admin (client-side check failed)')
    console.error('[ADMIN] adminResetPuzzleProgress FAILED:', err.message)
    throw err
  }

  try {
    console.log('[ADMIN] adminResetPuzzleProgress: Resetting solvedPuzzleIds for user', userId)
    await updateDoc(doc(db, 'users', userId), {
      'puzzleStats.solvedPuzzleIds': []
    })

    // Also update local data if it's the current user
    if (currentUser && currentUser.uid === userId && currentUserData?.puzzleStats) {
      currentUserData.puzzleStats.solvedPuzzleIds = []
    }

    console.log('[ADMIN] adminResetPuzzleProgress SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminResetPuzzleProgress ERROR:', error)
    const code = (error as { code?: string })?.code || 'unknown'
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`Firebase error [${code}]: ${msg}`)
  }
}

// Admin: Set user War Bucks directly
export async function adminSetWarBucks(userId: string, amount: number): Promise<boolean> {
  console.log('[ADMIN] adminSetWarBucks called', { userId, amount })

  if (!db) {
    const err = new Error('Database not initialized')
    console.error('[ADMIN] adminSetWarBucks FAILED:', err.message)
    throw err
  }
  if (!isCurrentUserAdmin()) {
    const err = new Error('User is not admin (client-side check failed)')
    console.error('[ADMIN] adminSetWarBucks FAILED:', err.message)
    throw err
  }

  try {
    console.log('[ADMIN] adminSetWarBucks: Setting War Bucks to', amount, 'for user', userId)
    await updateDoc(doc(db, 'users', userId), { warBucks: amount })
    console.log('[ADMIN] adminSetWarBucks SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminSetWarBucks ERROR:', error)
    // Re-throw with more context
    const code = (error as { code?: string })?.code || 'unknown'
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`Firebase error [${code}]: ${msg}`)
  }
}

// Admin: Get chat logs for a game
export async function adminGetChatLogs(gameId: string): Promise<GameChatMessage[]> {
  if (!db || !isCurrentUserAdmin()) return []

  try {
    const q = query(
      collection(db, 'gameChats'),
      where('gameId', '==', gameId)
    )
    const snapshot = await getDocs(q)
    const messages: GameChatMessage[] = []
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() } as GameChatMessage)
    })
    return messages.sort((a, b) => a.timestamp - b.timestamp)
  } catch (error) {
    console.error('Error getting chat logs:', error)
    return []
  }
}

// ==================== TOURNAMENT SYSTEM ====================

// Tournament status
export type TournamentStatus = 'registration' | 'starting' | 'in_progress' | 'finished' | 'cancelled'

// Tournament match
export interface TournamentMatch {
  id: string
  tournamentId: string
  round: number  // 1 = finals, 2 = semi-finals, etc.
  matchNumber: number  // Position in round
  player1Id: string | null
  player1Username: string | null
  player2Id: string | null
  player2Username: string | null
  winnerId: string | null
  winnerUsername: string | null
  gameId: string | null  // Link to multiplayer game
  status: 'pending' | 'ready' | 'playing' | 'finished' | 'bye'
  scheduledTime?: number
}

// Tournament interface
export interface Tournament {
  id: string
  name: string
  description: string
  icon: string
  createdBy: string
  createdAt: number
  startTime: number  // When registration closes and tournament starts
  status: TournamentStatus
  maxPlayers: 4 | 8 | 16 | 32  // Power of 2 for bracket
  currentPlayers: number
  registeredPlayers: Array<{ odataId: string; odataUsername: string; registeredAt: number }>
  // Prizes
  prizes: {
    first: { warBucks: number; itemId?: string }
    second: { warBucks: number; itemId?: string }
    third: { warBucks: number; itemId?: string }
  }
  // Settings
  timerEnabled: boolean
  timerMinutes: number
  // Results
  winnerId?: string
  winnerUsername?: string
  secondPlaceId?: string
  secondPlaceUsername?: string
  thirdPlaceId?: string
  thirdPlaceUsername?: string
}

// Tournament listener
let tournamentUnsubscribe: (() => void) | null = null
let tournamentCallback: ((tournament: Tournament | null) => void) | null = null

// Get all active tournaments
export async function getActiveTournaments(): Promise<Tournament[]> {
  if (!db) return []

  try {
    const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'))
    const now = Date.now()
    return tournamentsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Tournament))
      .filter(t => t.status !== 'cancelled' && t.status !== 'finished')
      .sort((a, b) => a.startTime - b.startTime)
  } catch (error) {
    console.error('Error getting tournaments:', error)
    return []
  }
}

// Get all tournaments (including finished)
export async function getAllTournaments(): Promise<Tournament[]> {
  if (!db) return []

  try {
    const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'))
    return tournamentsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Tournament))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error getting tournaments:', error)
    return []
  }
}

// Get tournament by ID
export async function getTournament(tournamentId: string): Promise<Tournament | null> {
  if (!db) return null

  try {
    const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId))
    if (!tournamentDoc.exists()) return null
    return { id: tournamentDoc.id, ...tournamentDoc.data() } as Tournament
  } catch (error) {
    console.error('Error getting tournament:', error)
    return null
  }
}

// Listen to tournament updates
export function listenToTournament(tournamentId: string, callback: (tournament: Tournament | null) => void): void {
  if (!db) return

  tournamentCallback = callback

  if (tournamentUnsubscribe) {
    tournamentUnsubscribe()
  }

  tournamentUnsubscribe = onSnapshot(doc(db, 'tournaments', tournamentId), (docSnap) => {
    if (docSnap.exists()) {
      const tournament = { id: docSnap.id, ...docSnap.data() } as Tournament
      if (tournamentCallback) {
        tournamentCallback(tournament)
      }
    } else {
      if (tournamentCallback) {
        tournamentCallback(null)
      }
    }
  })
}

// Stop listening to tournament
export function stopListeningToTournament(): void {
  if (tournamentUnsubscribe) {
    tournamentUnsubscribe()
    tournamentUnsubscribe = null
  }
}

// Register for tournament
export async function registerForTournament(tournamentId: string): Promise<{ success: boolean; error?: string }> {
  if (!db || !currentUser || !currentUserData) {
    return { success: false, error: 'Not logged in' }
  }

  try {
    const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId))
    if (!tournamentDoc.exists()) {
      return { success: false, error: 'Tournament not found' }
    }

    const tournament = tournamentDoc.data() as Tournament

    // Check if registration is open
    if (tournament.status !== 'registration') {
      return { success: false, error: 'Registration is closed' }
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { success: false, error: 'Tournament is full' }
    }

    // Check if already registered
    if (tournament.registeredPlayers.some(p => p.odataId === currentUser!.uid)) {
      return { success: false, error: 'Already registered' }
    }

    // Register player
    const updatedPlayers = [...tournament.registeredPlayers, {
      odataId: currentUser.uid,
      odataUsername: currentUserData.username,
      registeredAt: Date.now()
    }]

    await updateDoc(doc(db, 'tournaments', tournamentId), {
      registeredPlayers: updatedPlayers,
      currentPlayers: updatedPlayers.length
    })

    return { success: true }
  } catch (error) {
    console.error('Error registering for tournament:', error)
    return { success: false, error: 'Failed to register' }
  }
}

// Unregister from tournament
export async function unregisterFromTournament(tournamentId: string): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId))
    if (!tournamentDoc.exists()) return false

    const tournament = tournamentDoc.data() as Tournament

    // Can only unregister during registration
    if (tournament.status !== 'registration') return false

    const updatedPlayers = tournament.registeredPlayers.filter(p => p.odataId !== currentUser!.uid)

    await updateDoc(doc(db, 'tournaments', tournamentId), {
      registeredPlayers: updatedPlayers,
      currentPlayers: updatedPlayers.length
    })

    return true
  } catch (error) {
    console.error('Error unregistering from tournament:', error)
    return false
  }
}

// Get tournament matches
export async function getTournamentMatches(tournamentId: string): Promise<TournamentMatch[]> {
  if (!db) return []

  try {
    const q = query(
      collection(db, 'tournamentMatches'),
      where('tournamentId', '==', tournamentId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as TournamentMatch))
      .sort((a, b) => {
        // Sort by round (descending - finals first), then by match number
        if (a.round !== b.round) return b.round - a.round
        return a.matchNumber - b.matchNumber
      })
  } catch (error) {
    console.error('Error getting tournament matches:', error)
    return []
  }
}

// Check if user is in a tournament match that's ready
export async function getMyTournamentMatch(tournamentId: string): Promise<TournamentMatch | null> {
  if (!db || !currentUser) return null

  try {
    const matches = await getTournamentMatches(tournamentId)
    return matches.find(m =>
      (m.player1Id === currentUser!.uid || m.player2Id === currentUser!.uid) &&
      (m.status === 'ready' || m.status === 'playing')
    ) || null
  } catch (error) {
    console.error('Error getting my tournament match:', error)
    return null
  }
}

// Admin: Create tournament
export async function adminCreateTournament(tournament: Omit<Tournament, 'id' | 'createdAt' | 'createdBy' | 'currentPlayers' | 'registeredPlayers' | 'status'>): Promise<string | null> {
  console.log('[ADMIN] adminCreateTournament called', { tournamentName: tournament.name })

  if (!db) {
    console.error('[ADMIN] adminCreateTournament FAILED: Database not initialized')
    return null
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminCreateTournament FAILED: User is not admin')
    return null
  }
  if (!currentUserData) {
    console.error('[ADMIN] adminCreateTournament FAILED: No user data')
    return null
  }

  try {
    console.log('[ADMIN] adminCreateTournament: Creating tournament document...')
    const tournamentRef = doc(collection(db, 'tournaments'))
    await setDoc(tournamentRef, {
      ...tournament,
      createdAt: Date.now(),
      createdBy: currentUserData.username,
      currentPlayers: 0,
      registeredPlayers: [],
      status: 'registration'
    })
    console.log('[ADMIN] adminCreateTournament SUCCESS: Created tournament with ID', tournamentRef.id)
    return tournamentRef.id
  } catch (error) {
    console.error('[ADMIN] adminCreateTournament ERROR:', error)
    return null
  }
}

// Admin: Start tournament (generate bracket)
export async function adminStartTournament(tournamentId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId))
    if (!tournamentDoc.exists()) return false

    const tournament = tournamentDoc.data() as Tournament

    // Need at least 2 players
    if (tournament.currentPlayers < 2) return false

    // Shuffle players for random seeding
    const players = [...tournament.registeredPlayers]
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[players[i], players[j]] = [players[j], players[i]]
    }

    // Calculate number of rounds needed
    const numPlayers = players.length
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(numPlayers)))
    const numRounds = Math.ceil(Math.log2(bracketSize))

    // Create first round matches
    const firstRoundMatches: Omit<TournamentMatch, 'id'>[] = []
    const numFirstRoundMatches = bracketSize / 2

    for (let i = 0; i < numFirstRoundMatches; i++) {
      const player1 = players[i * 2] || null
      const player2 = players[i * 2 + 1] || null

      // If only one player, they get a bye
      const isBye = !player1 || !player2
      const byeWinner = player1 || player2

      firstRoundMatches.push({
        tournamentId,
        round: numRounds,
        matchNumber: i + 1,
        player1Id: player1?.odataId || null,
        player1Username: player1?.odataUsername || null,
        player2Id: player2?.odataId || null,
        player2Username: player2?.odataUsername || null,
        winnerId: isBye ? byeWinner?.odataId || null : null,
        winnerUsername: isBye ? byeWinner?.odataUsername || null : null,
        gameId: null,
        status: isBye ? 'bye' : 'ready'
      })
    }

    // Create matches for all rounds (empty for future rounds)
    for (const match of firstRoundMatches) {
      const matchRef = doc(collection(db, 'tournamentMatches'))
      await setDoc(matchRef, match)
    }

    // Create empty matches for subsequent rounds
    for (let round = numRounds - 1; round >= 1; round--) {
      const matchesInRound = Math.pow(2, round - 1)
      for (let i = 0; i < matchesInRound; i++) {
        const matchRef = doc(collection(db, 'tournamentMatches'))
        await setDoc(matchRef, {
          tournamentId,
          round,
          matchNumber: i + 1,
          player1Id: null,
          player1Username: null,
          player2Id: null,
          player2Username: null,
          winnerId: null,
          winnerUsername: null,
          gameId: null,
          status: 'pending'
        })
      }
    }

    // Update tournament status
    await updateDoc(doc(db, 'tournaments', tournamentId), {
      status: 'in_progress'
    })

    // Process any byes - advance winners to next round
    await processRoundByes(tournamentId, numRounds)

    return true
  } catch (error) {
    console.error('Error starting tournament:', error)
    return false
  }
}

// Process byes and advance winners
async function processRoundByes(tournamentId: string, round: number): Promise<void> {
  if (!db) return

  const matches = await getTournamentMatches(tournamentId)
  const roundMatches = matches.filter(m => m.round === round && m.status === 'bye')

  for (const match of roundMatches) {
    if (match.winnerId && match.winnerUsername) {
      await advanceWinner(tournamentId, match, round)
    }
  }
}

// Advance winner to next round
async function advanceWinner(tournamentId: string, match: TournamentMatch, currentRound: number): Promise<void> {
  if (!db || !match.winnerId) return

  const nextRound = currentRound - 1
  if (nextRound < 1) return // Tournament finished

  const matches = await getTournamentMatches(tournamentId)
  const nextRoundMatches = matches.filter(m => m.round === nextRound)

  // Find the next match this winner should go to
  const nextMatchNumber = Math.ceil(match.matchNumber / 2)
  const nextMatch = nextRoundMatches.find(m => m.matchNumber === nextMatchNumber)

  if (!nextMatch) return

  // Determine if winner goes to player1 or player2 slot
  const isPlayer1 = match.matchNumber % 2 === 1

  const updates: Record<string, unknown> = {}
  if (isPlayer1) {
    updates.player1Id = match.winnerId
    updates.player1Username = match.winnerUsername
  } else {
    updates.player2Id = match.winnerId
    updates.player2Username = match.winnerUsername
  }

  // Check if both players are now set
  const existingPlayer1 = isPlayer1 ? match.winnerId : nextMatch.player1Id
  const existingPlayer2 = isPlayer1 ? nextMatch.player2Id : match.winnerId

  if (existingPlayer1 && existingPlayer2) {
    updates.status = 'ready'
  }

  await updateDoc(doc(db, 'tournamentMatches', nextMatch.id), updates)
}

// Record match result
export async function recordTournamentMatchResult(matchId: string, winnerId: string, winnerUsername: string): Promise<boolean> {
  if (!db) return false

  try {
    const matchDoc = await getDoc(doc(db, 'tournamentMatches', matchId))
    if (!matchDoc.exists()) return false

    const match = { id: matchDoc.id, ...matchDoc.data() } as TournamentMatch

    // Update match
    await updateDoc(doc(db, 'tournamentMatches', matchId), {
      winnerId,
      winnerUsername,
      status: 'finished'
    })

    // Advance winner to next round
    await advanceWinner(match.tournamentId, { ...match, winnerId, winnerUsername }, match.round)

    // Check if tournament is finished (finals completed)
    if (match.round === 1) {
      await finishTournament(match.tournamentId, winnerId, winnerUsername, match)
    }

    return true
  } catch (error) {
    console.error('Error recording match result:', error)
    return false
  }
}

// Finish tournament and award prizes
async function finishTournament(tournamentId: string, winnerId: string, winnerUsername: string, finalsMatch: TournamentMatch): Promise<void> {
  if (!db) return

  try {
    const tournament = await getTournament(tournamentId)
    if (!tournament) return

    // Determine second place (finals loser)
    const secondPlaceId = finalsMatch.player1Id === winnerId ? finalsMatch.player2Id : finalsMatch.player1Id
    const secondPlaceUsername = finalsMatch.player1Id === winnerId ? finalsMatch.player2Username : finalsMatch.player1Username

    // Update tournament
    await updateDoc(doc(db, 'tournaments', tournamentId), {
      status: 'finished',
      winnerId,
      winnerUsername,
      secondPlaceId,
      secondPlaceUsername
    })

    // Award prizes
    if (tournament.prizes.first.warBucks && winnerId) {
      await adminGiveWarBucks(winnerId, tournament.prizes.first.warBucks)
      if (tournament.prizes.first.itemId) {
        await adminGiveItem(winnerId, tournament.prizes.first.itemId)
      }
    }
    if (tournament.prizes.second.warBucks && secondPlaceId) {
      await adminGiveWarBucks(secondPlaceId, tournament.prizes.second.warBucks)
      if (tournament.prizes.second.itemId) {
        await adminGiveItem(secondPlaceId, tournament.prizes.second.itemId)
      }
    }
  } catch (error) {
    console.error('Error finishing tournament:', error)
  }
}

// Admin: Cancel tournament
export async function adminCancelTournament(tournamentId: string): Promise<boolean> {
  console.log('[ADMIN] adminCancelTournament called', { tournamentId })

  if (!db) {
    console.error('[ADMIN] adminCancelTournament FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminCancelTournament FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminCancelTournament: Cancelling tournament...')
    await updateDoc(doc(db, 'tournaments', tournamentId), {
      status: 'cancelled'
    })
    console.log('[ADMIN] adminCancelTournament SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminCancelTournament ERROR:', error)
    return false
  }
}

// Admin: Delete tournament
export async function adminDeleteTournament(tournamentId: string): Promise<boolean> {
  console.log('[ADMIN] adminDeleteTournament called', { tournamentId })

  if (!db) {
    console.error('[ADMIN] adminDeleteTournament FAILED: Database not initialized')
    return false
  }
  if (!isCurrentUserAdmin()) {
    console.error('[ADMIN] adminDeleteTournament FAILED: User is not admin')
    return false
  }

  try {
    console.log('[ADMIN] adminDeleteTournament: Deleting tournament matches...')
    const matches = await getTournamentMatches(tournamentId)
    console.log('[ADMIN] adminDeleteTournament: Found', matches.length, 'matches to delete')
    for (const match of matches) {
      await deleteDoc(doc(db, 'tournamentMatches', match.id))
    }

    console.log('[ADMIN] adminDeleteTournament: Deleting tournament document...')
    await deleteDoc(doc(db, 'tournaments', tournamentId))
    console.log('[ADMIN] adminDeleteTournament SUCCESS')
    return true
  } catch (error) {
    console.error('[ADMIN] adminDeleteTournament ERROR:', error)
    return false
  }
}

// Create tournament game for a match
export async function createTournamentGame(matchId: string): Promise<string | null> {
  if (!db || !currentUser || !currentUserData) return null

  try {
    const matchDoc = await getDoc(doc(db, 'tournamentMatches', matchId))
    if (!matchDoc.exists()) return null

    const match = matchDoc.data() as TournamentMatch
    if (!match.player1Id || !match.player2Id) return null

    const tournament = await getTournament(match.tournamentId)
    if (!tournament) return null

    // Create the game
    const gameRef = doc(collection(db, 'games'))
    await setDoc(gameRef, {
      yellowPlayerId: match.player1Id,
      yellowUsername: match.player1Username,
      greenPlayerId: match.player2Id,
      greenUsername: match.player2Username,
      currentTurn: 'yellow',
      createdAt: serverTimestamp(),
      lastMove: serverTimestamp(),
      status: 'waiting',
      gameState: null,
      timerEnabled: tournament.timerEnabled,
      timerMinutes: tournament.timerMinutes,
      yellowJoined: false,
      greenJoined: false,
      tournamentMatchId: matchId  // Link to tournament match
    })

    // Update match with game ID
    await updateDoc(doc(db, 'tournamentMatches', matchId), {
      gameId: gameRef.id,
      status: 'playing'
    })

    return gameRef.id
  } catch (error) {
    console.error('Error creating tournament game:', error)
    return null
  }
}

// ============================================
// FEEDBACK & TIPS SYSTEM
// ============================================

export interface FeedbackTip {
  id: string
  userId: string
  username: string
  type: 'tip' | 'feedback' | 'bug' | 'feature'
  title: string
  content: string
  category: 'gameplay' | 'strategy' | 'pieces' | 'puzzles' | 'general' | 'ui'
  likes: number
  likedBy: string[]  // User IDs who liked this
  createdAt: number
  approved: boolean  // Admin moet goedkeuren voordat zichtbaar
}

// Submit a tip or feedback
export async function submitFeedback(
  type: FeedbackTip['type'],
  title: string,
  content: string,
  category: FeedbackTip['category']
): Promise<string | null> {
  console.log('[FEEDBACK] submitFeedback called', { type, title, category })

  if (!db) {
    console.error('[FEEDBACK] submitFeedback FAILED: Database not initialized')
    return null
  }
  if (!currentUser) {
    console.error('[FEEDBACK] submitFeedback FAILED: User not logged in')
    return null
  }
  if (!currentUserData) {
    console.error('[FEEDBACK] submitFeedback FAILED: No user data')
    return null
  }

  try {
    console.log('[FEEDBACK] Creating feedback document...')
    const feedbackRef = doc(collection(db, 'feedback'))
    await setDoc(feedbackRef, {
      userId: currentUser.uid,
      username: currentUserData.username,
      type,
      title,
      content,
      category,
      likes: 0,
      likedBy: [],
      createdAt: Date.now(),
      approved: false  // Needs admin approval
    })
    console.log('[FEEDBACK] submitFeedback SUCCESS:', feedbackRef.id)
    return feedbackRef.id
  } catch (error) {
    console.error('[FEEDBACK] submitFeedback ERROR:', error)
    return null
  }
}

// Get approved tips (for display to all users)
export async function getApprovedTips(category?: FeedbackTip['category']): Promise<FeedbackTip[]> {
  if (!db) return []

  try {
    let q
    if (category) {
      q = query(
        collection(db, 'feedback'),
        where('approved', '==', true),
        where('category', '==', category)
      )
    } else {
      q = query(
        collection(db, 'feedback'),
        where('approved', '==', true)
      )
    }

    const snapshot = await getDocs(q)
    const tips: FeedbackTip[] = []
    snapshot.forEach(doc => {
      tips.push({ id: doc.id, ...doc.data() } as FeedbackTip)
    })

    // Sort by likes descending
    tips.sort((a, b) => b.likes - a.likes)
    return tips
  } catch (error) {
    console.error('Error getting tips:', error)
    return []
  }
}

// Like a tip
export async function likeTip(tipId: string): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const tipRef = doc(db, 'feedback', tipId)
    const tipSnap = await getDoc(tipRef)

    if (!tipSnap.exists()) return false

    const tip = tipSnap.data() as FeedbackTip
    if (tip.likedBy.includes(currentUser!.uid)) {
      // Already liked - unlike it
      await updateDoc(tipRef, {
        likes: tip.likes - 1,
        likedBy: tip.likedBy.filter(id => id !== currentUser!.uid)
      })
    } else {
      // Like it
      await updateDoc(tipRef, {
        likes: tip.likes + 1,
        likedBy: arrayUnion(currentUser!.uid)
      })
    }
    return true
  } catch (error) {
    console.error('Error liking tip:', error)
    return false
  }
}

// Admin: Get all feedback (including unapproved)
export async function adminGetAllFeedback(): Promise<FeedbackTip[]> {
  if (!db || !isCurrentUserAdmin()) return []

  try {
    const snapshot = await getDocs(collection(db, 'feedback'))
    const feedback: FeedbackTip[] = []
    snapshot.forEach(doc => {
      feedback.push({ id: doc.id, ...doc.data() } as FeedbackTip)
    })

    // Sort by createdAt descending (newest first)
    feedback.sort((a, b) => b.createdAt - a.createdAt)
    return feedback
  } catch (error) {
    console.error('Error getting all feedback:', error)
    return []
  }
}

// Admin: Approve a tip
export async function adminApproveTip(tipId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await updateDoc(doc(db, 'feedback', tipId), { approved: true })
    return true
  } catch (error) {
    console.error('Error approving tip:', error)
    return false
  }
}

// Admin: Delete feedback
export async function adminDeleteFeedback(tipId: string): Promise<boolean> {
  if (!db || !isCurrentUserAdmin()) return false

  try {
    await deleteDoc(doc(db, 'feedback', tipId))
    return true
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return false
  }
}
