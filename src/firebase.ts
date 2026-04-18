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
  // Friends system
  friends: string[]  // Friend user IDs
  blockedUsers: string[]  // Blocked user IDs
}

// Shop items for sale
export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  type: 'theme' | 'piece_skin' | 'effect' | 'sound_pack' | 'music_pack'
  icon: string
  isCustom?: boolean  // Admin-created items
  // Theme colors (for themes)
  colors?: {
    light: string
    dark: string
    accent: string
    water: string
  }
  // Theme ambient particle type
  ambientEffect?: 'sand' | 'snow' | 'leaf' | 'star' | 'bubble' | 'ember' | 'sparkle' | 'firefly' | 'ray' | 'neon' | 'gear' | 'autumn' | 'none'
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
  // Custom music parameters (for admin-created music packs)
  musicParams?: {
    tempo: number         // BPM (60-200)
    scale: 'major' | 'minor' | 'pentatonic' | 'blues' | 'dorian' | 'mixolydian'
    baseNote: number      // Base frequency in Hz (130-520)
    waveform: OscillatorType  // 'sine' | 'square' | 'sawtooth' | 'triangle'
    filterFreq: number    // Lowpass filter cutoff (200-8000)
    reverb: number        // Reverb amount (0-1)
    swing: number         // Swing amount (0-0.5)
    density: number       // Note density (1-8 notes per beat)
  }
  // Custom sound pack filter config
  soundConfig?: {
    filterType: BiquadFilterType  // 'lowpass' | 'highpass' | 'bandpass' | 'peaking'
    filterFreq: number
    filterQ: number
    filterGain: number
    distortion: number    // 0-100
  }
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

  // Piece Skins - Wave 2
  { id: 'skin_vampire', name: 'Vampire Legion', description: 'Dark immortal vampires with flowing capes and crimson eyes', price: 400, type: 'piece_skin', icon: '🧛',
    skinStyle: 'fantasy', pieceColor: { yellow: '#8b0000', green: '#1a1a1a', accent: '#ffd700' } },
  { id: 'skin_exosuit', name: 'Titanium Exo-Suits', description: 'Futuristic exoskeleton mech suits with glowing power cores', price: 425, type: 'piece_skin', icon: '🦾',
    skinStyle: 'robot', pieceColor: { yellow: '#b0bec5', green: '#37474f', accent: '#64b5f6' } },
  { id: 'skin_pirate', name: 'Pirate Crew', description: 'Fearsome pirates with cutlasses, eyepatches and cannons', price: 350, type: 'piece_skin', icon: '🏴\u200d☠️',
    skinStyle: 'medieval', pieceColor: { yellow: '#5d4037', green: '#212121', accent: '#ffc107' } },
  { id: 'skin_ninja', name: 'Shadow Ninjas', description: 'Silent deadly ninjas striking from the shadows with neon blades', price: 375, type: 'piece_skin', icon: '🥷',
    skinStyle: 'military', pieceColor: { yellow: '#4a148c', green: '#1a1a2e', accent: '#00e676' } },
  { id: 'skin_frost', name: 'Frost Giants', description: 'Ancient ice giants clad in frozen crystal armor', price: 425, type: 'piece_skin', icon: '🧊',
    skinStyle: 'fantasy', pieceColor: { yellow: '#b3e5fc', green: '#e1f5fe', accent: '#4fc3f7' } },
  { id: 'skin_pumpkin', name: 'Pumpkin Army', description: 'Spooky Halloween pumpkin warriors with carved grins', price: 300, type: 'piece_skin', icon: '🎃',
    skinStyle: 'cartoon', pieceColor: { yellow: '#e65100', green: '#2e7d32', accent: '#7b1fa2' } },
  { id: 'skin_alchemist', name: 'Alchemist Order', description: 'Mysterious alchemists wielding potions and transmutation circles', price: 375, type: 'piece_skin', icon: '⚗️',
    skinStyle: 'minimal', pieceColor: { yellow: '#ffd600', green: '#00695c', accent: '#aa00ff' } },
  { id: 'skin_deepsea', name: 'Deep Sea Creatures', description: 'Bioluminescent underwater creatures with glowing tentacles', price: 400, type: 'piece_skin', icon: '🌊',
    skinStyle: 'fantasy', pieceColor: { yellow: '#006064', green: '#01579b', accent: '#76ff03' } },
  { id: 'skin_cowboy', name: 'Wild West Outlaws', description: 'Rugged cowboys with revolvers, lassos and dusty leather', price: 325, type: 'piece_skin', icon: '🤠',
    skinStyle: 'military', pieceColor: { yellow: '#a1887f', green: '#4e342e', accent: '#d84315' } },
  { id: 'skin_diamond', name: 'Diamond Elite', description: 'Ultra luxurious diamond-encrusted pieces with prismatic shine', price: 500, type: 'piece_skin', icon: '💎',
    skinStyle: 'minimal', pieceColor: { yellow: '#e0e0e0', green: '#f5f5f5', accent: '#e91e63' } },
  { id: 'skin_ww1', name: 'WW1 Trench Fighters', description: 'World War I soldiers with gas masks, bayonets and trench coats', price: 375, type: 'piece_skin', icon: '🪖',
    skinStyle: 'military', pieceColor: { yellow: '#6d4c41', green: '#455a64', accent: '#795548' } },
  { id: 'skin_coldwar', name: 'Cold War Operatives', description: 'Secret agents and spies from the Cold War era with classified tech', price: 400, type: 'piece_skin', icon: '🕵️',
    skinStyle: 'military', pieceColor: { yellow: '#37474f', green: '#263238', accent: '#b71c1c' } },

  // NEW: More Effects
  { id: 'effect_bubble', name: 'Bubble Pop', description: 'Floating bubbles effect', price: 175, type: 'effect', icon: '🫧', effectType: 'sparkle' },
  { id: 'effect_pixel', name: 'Pixel Burst', description: 'Retro pixel explosion effect', price: 200, type: 'effect', icon: '👾', effectType: 'sparkle' },
  { id: 'effect_runes', name: 'Magic Runes', description: 'Magical symbols appear', price: 250, type: 'effect', icon: '🔮', effectType: 'sparkle' },
  { id: 'effect_money', name: 'Money Rain', description: 'War Bucks falling effect', price: 300, type: 'effect', icon: '💵', effectType: 'sparkle' },

  // Effects - Wave 2
  { id: 'effect_tornado', name: 'Tornado Spin', description: 'Whirling wind particles swirl around every piece that moves', price: 225, type: 'effect', icon: '🌪️', effectType: 'sparkle' },
  { id: 'effect_soul', name: 'Soul Reaper', description: 'Dark skulls and ghostly souls rise from every captured piece', price: 300, type: 'effect', icon: '💀', effectType: 'ghost' },
  { id: 'effect_prisma', name: 'Prisma Burst', description: 'Rainbow light rays explode when tanks, rockets and artillery fire', price: 275, type: 'effect', icon: '🌈', effectType: 'sparkle' },
  { id: 'effect_butterfly', name: 'Butterfly Swarm', description: 'Colorful butterflies fly up when builders construct barricades and bridges', price: 200, type: 'effect', icon: '🦋', effectType: 'sparkle' },
  { id: 'effect_plasma', name: 'Plasma Chain', description: 'Blue plasma arcs chain between pieces when hackers freeze or capture', price: 325, type: 'effect', icon: '⚡', effectType: 'lightning' },
  { id: 'effect_moonlight', name: 'Moonlight Glow', description: 'Soft silver moonlight particles float around every piece that moves', price: 200, type: 'effect', icon: '🌙', effectType: 'stars' },
  { id: 'effect_musicnotes', name: 'Music Notes', description: 'Musical notes burst into the air when you win the game', price: 250, type: 'effect', icon: '🎵', effectType: 'sparkle' },
  { id: 'effect_toxic', name: 'Toxic Drip', description: 'Poisonous green droplets and toxic fumes rise from every kill', price: 225, type: 'effect', icon: '💉', effectType: 'smoke' },
  { id: 'effect_bluefire', name: 'Blue Inferno', description: 'Scorching blue flames erupt when tanks, rockets and ships fire their weapons', price: 300, type: 'effect', icon: '🔥', effectType: 'fire' },
  { id: 'effect_warp', name: 'Warp Drive', description: 'Space-warping streaks trail behind helicopters and fighters at high speed', price: 275, type: 'effect', icon: '💫', effectType: 'stars' },

  // Sound Packs - Wave 2
  { id: 'sound_underwater', name: 'Underwater', description: 'Muffled bubbly sounds as if fighting beneath the waves', price: 175, type: 'sound_pack', icon: '🤿', packId: 'underwater',
    soundConfig: { filterType: 'lowpass' as BiquadFilterType, filterFreq: 600, filterQ: 3, filterGain: 0, distortion: 0 } },
  { id: 'sound_walkietalkie', name: 'Walkie-Talkie', description: 'Crackling radio transmissions for your battlefield commands', price: 200, type: 'sound_pack', icon: '📡', packId: 'walkietalkie',
    soundConfig: { filterType: 'bandpass' as BiquadFilterType, filterFreq: 1500, filterQ: 6, filterGain: 0, distortion: 25 } },
  { id: 'sound_arcade2', name: 'Retro Arcade 2.0', description: 'Extra crunchy 8-bit bleeps and bloops for maximum nostalgia', price: 175, type: 'sound_pack', icon: '🎮', packId: 'arcade2',
    soundConfig: { filterType: 'lowpass' as BiquadFilterType, filterFreq: 1800, filterQ: 4, filterGain: 0, distortion: 35 } },
  { id: 'sound_stadium', name: 'Stadium', description: 'Massive echo and reverb as if playing in a huge arena', price: 225, type: 'sound_pack', icon: '🏟️', packId: 'stadium',
    soundConfig: { filterType: 'peaking' as BiquadFilterType, filterFreq: 1000, filterQ: 2, filterGain: 6, distortion: 0 } },
  { id: 'sound_alien', name: 'Alien Invasion', description: 'Strange extraterrestrial frequencies and otherworldly tones', price: 225, type: 'sound_pack', icon: '👾', packId: 'alien',
    soundConfig: { filterType: 'highpass' as BiquadFilterType, filterFreq: 3500, filterQ: 10, filterGain: 0, distortion: 15 } },
  { id: 'sound_cinematic', name: 'Cinematic', description: 'Deep dramatic bass and movie-quality impact sounds', price: 250, type: 'sound_pack', icon: '🎬', packId: 'cinematic',
    soundConfig: { filterType: 'lowpass' as BiquadFilterType, filterFreq: 800, filterQ: 1.5, filterGain: 8, distortion: 5 } },
  { id: 'sound_toybox', name: 'Toy Box', description: 'High-pitched squeaky toy sounds that are adorably funny', price: 150, type: 'sound_pack', icon: '🧸', packId: 'toybox',
    soundConfig: { filterType: 'highpass' as BiquadFilterType, filterFreq: 4000, filterQ: 3, filterGain: 6, distortion: 0 } },
  { id: 'sound_industrial', name: 'Industrial', description: 'Raw metal-on-metal grinding with heavy distortion', price: 225, type: 'sound_pack', icon: '⛓️', packId: 'industrial',
    soundConfig: { filterType: 'peaking' as BiquadFilterType, filterFreq: 900, filterQ: 12, filterGain: 4, distortion: 60 } },
  { id: 'sound_zen', name: 'Zen Garden', description: 'Ultra soft and calming filtered sounds for peaceful play', price: 175, type: 'sound_pack', icon: '🌿', packId: 'zen',
    soundConfig: { filterType: 'lowpass' as BiquadFilterType, filterFreq: 2500, filterQ: 0.3, filterGain: -4, distortion: 0 } },
  { id: 'sound_telephone', name: 'Telephone', description: 'Everything sounds like it comes through an old rotary phone', price: 175, type: 'sound_pack', icon: '📞', packId: 'telephone',
    soundConfig: { filterType: 'bandpass' as BiquadFilterType, filterFreq: 1800, filterQ: 15, filterGain: 0, distortion: 10 } },

  // Music Packs - Wave 2
  { id: 'music_tropical', name: 'Tropical Vibes', description: 'Chill beach music with steel drums', price: 200, type: 'music_pack', icon: '🏖️', packId: 'tropical' },
  { id: 'music_dark', name: 'Dark Orchestra', description: 'Ominous strings and brass', price: 275, type: 'music_pack', icon: '🦇', packId: 'dark' },
  { id: 'music_cyberpunk', name: 'Cyberpunk', description: 'Glitchy synths and heavy bass', price: 250, type: 'music_pack', icon: '🤖', packId: 'cyberpunk' },
  { id: 'music_western', name: 'Wild West', description: 'Dusty guitars and harmonica', price: 225, type: 'music_pack', icon: '🤠', packId: 'western' },
  { id: 'music_funk', name: 'Funky Groove', description: 'Slap bass and wah guitar', price: 225, type: 'music_pack', icon: '🕺', packId: 'funk' },
  { id: 'music_metal', name: 'Heavy Metal', description: 'Crushing riffs and double bass', price: 275, type: 'music_pack', icon: '🤘', packId: 'metal' },
  { id: 'music_synthwave', name: 'Synthwave', description: '80s synths and arpeggios', price: 250, type: 'music_pack', icon: '🌆', packId: 'synthwave' },

  // Music Packs - Wave 3 (Advanced with phases)
  { id: 'music_acoustic_heart', name: 'Acoustic Heartstrings', description: 'Warm acoustic guitar fingerpicking with gentle strings - intimate and emotional', price: 275, type: 'music_pack', icon: '🎸',
    packId: 'acoustic_heart', musicParams: { tempo: 92, scale: 'major', baseNote: 165, waveform: 'triangle' as OscillatorType, filterFreq: 3500, reverb: 0.6, swing: 0.15, density: 3 } },
  { id: 'music_campfire_songs', name: 'Campfire Songs', description: 'Cozy folk melodies around a crackling campfire - sing-along vibes', price: 225, type: 'music_pack', icon: '🔥',
    packId: 'campfire', musicParams: { tempo: 105, scale: 'major', baseNote: 196, waveform: 'triangle' as OscillatorType, filterFreq: 4000, reverb: 0.4, swing: 0.2, density: 4 } },
  { id: 'music_sunset_ballad', name: 'Sunset Ballad', description: 'Gentle fingerstyle guitar with soft harmonics - perfect for a golden sunset', price: 250, type: 'music_pack', icon: '🌅',
    packId: 'sunset_ballad', musicParams: { tempo: 78, scale: 'pentatonic', baseNote: 220, waveform: 'sine' as OscillatorType, filterFreq: 3000, reverb: 0.7, swing: 0.1, density: 2 } },
  { id: 'music_drill_sergeant', name: 'Drill Sergeant', description: 'Aggressive marching drums with shouted commands - military intensity', price: 275, type: 'music_pack', icon: '🪖',
    packId: 'drill', musicParams: { tempo: 140, scale: 'minor', baseNote: 110, waveform: 'sawtooth' as OscillatorType, filterFreq: 5000, reverb: 0.15, swing: 0, density: 6 } },
  { id: 'music_pirate_shanty', name: 'Pirate Shanty', description: 'Rowdy sea shanty with accordion and fiddle - yo ho ho!', price: 250, type: 'music_pack', icon: '🏴‍☠️',
    packId: 'shanty', musicParams: { tempo: 125, scale: 'mixolydian', baseNote: 196, waveform: 'sawtooth' as OscillatorType, filterFreq: 4500, reverb: 0.3, swing: 0.35, density: 5 } },
  { id: 'music_midnight_jazz', name: 'Midnight Jazz Club', description: 'Smoky late-night jazz with walking bass and brushed drums', price: 275, type: 'music_pack', icon: '🌃',
    packId: 'midnight_jazz', musicParams: { tempo: 88, scale: 'dorian', baseNote: 175, waveform: 'triangle' as OscillatorType, filterFreq: 3000, reverb: 0.55, swing: 0.4, density: 3 } },
  { id: 'music_neon_nights', name: 'Neon Nights', description: 'Pulsing synth-pop with dreamy pads and crisp beats - city lights', price: 250, type: 'music_pack', icon: '💜',
    packId: 'neon_nights', musicParams: { tempo: 118, scale: 'minor', baseNote: 220, waveform: 'sawtooth' as OscillatorType, filterFreq: 4000, reverb: 0.45, swing: 0.05, density: 4 } },
  { id: 'music_viking_war', name: 'Viking War Drums', description: 'Thundering Nordic war drums with deep chanting - prepare for battle!', price: 300, type: 'music_pack', icon: '⚔️',
    packId: 'viking', musicParams: { tempo: 95, scale: 'minor', baseNote: 98, waveform: 'sawtooth' as OscillatorType, filterFreq: 2500, reverb: 0.5, swing: 0, density: 3 } },
  { id: 'music_space_odyssey', name: 'Space Odyssey', description: 'Ethereal space ambient with cosmic pads and distant stars - infinite void', price: 250, type: 'music_pack', icon: '🌌',
    packId: 'space_odyssey', musicParams: { tempo: 65, scale: 'pentatonic', baseNote: 130, waveform: 'sine' as OscillatorType, filterFreq: 2000, reverb: 0.9, swing: 0.1, density: 1 } },
  { id: 'music_reggae_island', name: 'Reggae Island', description: 'Laid-back reggae rhythms with off-beat guitar and warm bass', price: 225, type: 'music_pack', icon: '🇯🇲',
    packId: 'reggae', musicParams: { tempo: 82, scale: 'major', baseNote: 147, waveform: 'triangle' as OscillatorType, filterFreq: 3500, reverb: 0.35, swing: 0.3, density: 4 } },
  { id: 'music_horror_ambient', name: 'Horror Ambient', description: 'Creepy dissonant drones with sudden stings - pure nightmare fuel', price: 275, type: 'music_pack', icon: '👹',
    packId: 'horror_ambient', musicParams: { tempo: 55, scale: 'minor', baseNote: 87, waveform: 'sawtooth' as OscillatorType, filterFreq: 1500, reverb: 0.85, swing: 0.2, density: 2 } },
  { id: 'music_edm_drop', name: 'EDM Festival', description: 'Build-up tension into massive drops with pounding bass and synths', price: 300, type: 'music_pack', icon: '🎆',
    packId: 'edm', musicParams: { tempo: 128, scale: 'minor', baseNote: 220, waveform: 'sawtooth' as OscillatorType, filterFreq: 6000, reverb: 0.2, swing: 0, density: 6 } },
  { id: 'music_celtic_winds', name: 'Celtic Winds', description: 'Mystical Irish melodies with tin whistle and harp - enchanting and ancient', price: 250, type: 'music_pack', icon: '🍀',
    packId: 'celtic', musicParams: { tempo: 110, scale: 'dorian', baseNote: 294, waveform: 'triangle' as OscillatorType, filterFreq: 5000, reverb: 0.5, swing: 0.15, density: 5 } },
  { id: 'music_bollywood', name: 'Bollywood Drama', description: 'Dramatic Indian-inspired melodies with tablas and sitars - colorful and intense', price: 275, type: 'music_pack', icon: '🪷',
    packId: 'bollywood', musicParams: { tempo: 115, scale: 'pentatonic', baseNote: 262, waveform: 'sawtooth' as OscillatorType, filterFreq: 4500, reverb: 0.4, swing: 0.25, density: 5 } },
  { id: 'music_samurai', name: 'Way of the Samurai', description: 'Traditional Japanese koto and shakuhachi with taiko drums - honor and discipline', price: 275, type: 'music_pack', icon: '⛩️',
    packId: 'samurai', musicParams: { tempo: 85, scale: 'pentatonic', baseNote: 330, waveform: 'triangle' as OscillatorType, filterFreq: 3500, reverb: 0.6, swing: 0.1, density: 3 } },

  // Music Packs - Artist-Inspired Styles
  { id: 'music_acoustic_love', name: 'Acoustic Love Letters', description: 'Warm fingerpicked guitar with heartfelt melodies - pure acoustic emotion', price: 250, type: 'music_pack', icon: '💌',
    packId: 'acoustic_love', musicParams: { tempo: 96, scale: 'major', baseNote: 165, waveform: 'triangle' as OscillatorType, filterFreq: 3200, reverb: 0.55, swing: 0.12, density: 3 } },
  { id: 'music_loop_station', name: 'Loop Station Live', description: 'Layered loop-pedal style with beatbox percussion and stacking harmonies', price: 275, type: 'music_pack', icon: '🎤',
    packId: 'loop_station', musicParams: { tempo: 104, scale: 'major', baseNote: 196, waveform: 'triangle' as OscillatorType, filterFreq: 4200, reverb: 0.4, swing: 0.18, density: 5 } },
  { id: 'music_ginger_folk', name: 'Ginger Folk Sessions', description: 'Soulful folk-pop with clapping rhythms and sing-along energy', price: 250, type: 'music_pack', icon: '🍂',
    packId: 'ginger_folk', musicParams: { tempo: 112, scale: 'major', baseNote: 220, waveform: 'triangle' as OscillatorType, filterFreq: 4500, reverb: 0.35, swing: 0.2, density: 4 } },
  { id: 'music_trap_king', name: 'Trap Kingdom', description: 'Hard-hitting 808 bass drops with dark hi-hats and aggressive energy', price: 275, type: 'music_pack', icon: '👑',
    packId: 'trap_king', musicParams: { tempo: 145, scale: 'minor', baseNote: 110, waveform: 'sawtooth' as OscillatorType, filterFreq: 3000, reverb: 0.2, swing: 0.05, density: 5 } },
  { id: 'music_piano_ballad', name: 'Piano Ballad', description: 'Beautiful emotional piano with orchestral swells - brings tears to your eyes', price: 300, type: 'music_pack', icon: '🎹',
    packId: 'piano_ballad', musicParams: { tempo: 72, scale: 'major', baseNote: 262, waveform: 'sine' as OscillatorType, filterFreq: 4000, reverb: 0.75, swing: 0.08, density: 2 } },
  { id: 'music_latin_fire', name: 'Latin Fire', description: 'Spicy reggaeton and latin rhythms with pulsing bass and tropical percussion', price: 250, type: 'music_pack', icon: '💃',
    packId: 'latin_fire', musicParams: { tempo: 95, scale: 'minor', baseNote: 196, waveform: 'sawtooth' as OscillatorType, filterFreq: 4500, reverb: 0.25, swing: 0.3, density: 6 } },
  { id: 'music_bedroom_pop', name: 'Bedroom Pop', description: 'Dreamy lo-fi indie vibes with soft vocals and fuzzy guitars', price: 225, type: 'music_pack', icon: '🛏️',
    packId: 'bedroom_pop', musicParams: { tempo: 108, scale: 'major', baseNote: 247, waveform: 'triangle' as OscillatorType, filterFreq: 2800, reverb: 0.6, swing: 0.15, density: 3 } },
  { id: 'music_drill_beats', name: 'Drill Beats', description: 'Dark sliding 808s with aggressive hi-hat patterns and menacing melodies', price: 275, type: 'music_pack', icon: '🔫',
    packId: 'drill_beats', musicParams: { tempo: 140, scale: 'minor', baseNote: 98, waveform: 'sawtooth' as OscillatorType, filterFreq: 2500, reverb: 0.15, swing: 0.1, density: 7 } },

  // Music Packs - Intense War Music (10+ phases, 3+ minutes each)
  { id: 'music_blitzkrieg', name: 'Blitzkrieg', description: 'Relentless mechanized warfare - pounding drums build from silence to all-out artillery assault with screaming brass', price: 325, type: 'music_pack', icon: '💣',
    packId: 'blitzkrieg', musicParams: { tempo: 155, scale: 'minor', baseNote: 98, waveform: 'sawtooth' as OscillatorType, filterFreq: 5500, reverb: 0.2, swing: 0, density: 7 } },
  { id: 'music_trench_requiem', name: 'Trench Requiem', description: 'Haunting orchestral war theme - starts with a lone melody rising into thundering cannons and heroic fanfares', price: 325, type: 'music_pack', icon: '🪖',
    packId: 'trench_requiem', musicParams: { tempo: 88, scale: 'minor', baseNote: 130, waveform: 'sawtooth' as OscillatorType, filterFreq: 3500, reverb: 0.6, swing: 0.05, density: 3 } },
  { id: 'music_air_raid', name: 'Air Raid Siren', description: 'Escalating tension that explodes into chaos - air raid sirens, rapid drums and desperate counter-attack rhythms', price: 300, type: 'music_pack', icon: '🚨',
    packId: 'air_raid', musicParams: { tempo: 170, scale: 'minor', baseNote: 110, waveform: 'square' as OscillatorType, filterFreq: 6000, reverb: 0.15, swing: 0, density: 8 } },
  { id: 'music_last_stand', name: 'Last Stand', description: 'Epic final battle music - quiet prayers become a roaring war cry with massive drums and soaring melodies at the climax', price: 350, type: 'music_pack', icon: '⚔️',
    packId: 'last_stand', musicParams: { tempo: 105, scale: 'minor', baseNote: 130, waveform: 'sawtooth' as OscillatorType, filterFreq: 4000, reverb: 0.45, swing: 0.05, density: 4 } },
  { id: 'music_nuclear_dawn', name: 'Nuclear Dawn', description: 'The end of everything - deep rumbling bass evolves through 10 phases into an apocalyptic explosion of sound', price: 350, type: 'music_pack', icon: '☢️',
    packId: 'nuclear_dawn', musicParams: { tempo: 130, scale: 'minor', baseNote: 87, waveform: 'sawtooth' as OscillatorType, filterFreq: 4500, reverb: 0.35, swing: 0, density: 6 } },

  // Board Themes - Wave 2
  { id: 'theme_cherry_blossom', name: 'Cherry Blossom Temple', description: 'A peaceful Japanese temple surrounded by falling sakura petals', price: 225, type: 'theme', icon: '🌸',
    colors: { light: '#fce4ec', dark: '#f48fb1', accent: '#ad1457', water: '#7b1fa2' }, ambientEffect: 'sparkle' },
  { id: 'theme_crystal_cavern', name: 'Crystal Cavern', description: 'A deep underground cavern glittering with magical crystals', price: 275, type: 'theme', icon: '🔮',
    colors: { light: '#ce93d8', dark: '#4a148c', accent: '#00bcd4', water: '#311b92' }, ambientEffect: 'sparkle' },
  { id: 'theme_obsidian', name: 'Obsidian Hellfire', description: 'Black obsidian cracked open with rivers of glowing magma', price: 300, type: 'theme', icon: '🌋',
    colors: { light: '#424242', dark: '#1a1a1a', accent: '#ff3d00', water: '#b71c1c' }, ambientEffect: 'ember' },
  { id: 'theme_castle', name: 'Ancient Castle', description: 'Weathered stone walls overgrown with moss and lit by fireflies', price: 200, type: 'theme', icon: '🏰',
    colors: { light: '#bcaaa4', dark: '#5d4037', accent: '#8d6e63', water: '#33691e' }, ambientEffect: 'firefly' },
  { id: 'theme_arcade', name: 'Neon Arcade', description: 'A retro arcade floor pulsing with electric neon lights', price: 250, type: 'theme', icon: '🎪',
    colors: { light: '#ff4081', dark: '#1a237e', accent: '#00e5ff', water: '#aa00ff' }, ambientEffect: 'neon' },
  { id: 'theme_toxic', name: 'Toxic Wasteland', description: 'A radioactive wasteland where toxic bubbles rise from the ground', price: 225, type: 'theme', icon: '🌿',
    colors: { light: '#76ff03', dark: '#33691e', accent: '#aeea00', water: '#1b5e20' }, ambientEffect: 'bubble' },
  { id: 'theme_bloodmoon', name: 'Blood Moon', description: 'A cursed battlefield under the glow of a crimson blood moon', price: 275, type: 'theme', icon: '🌅',
    colors: { light: '#c62828', dark: '#1a0000', accent: '#ff5252', water: '#4a0000' }, ambientEffect: 'ember' },
  { id: 'theme_thunderstorm', name: 'Thunder Storm', description: 'Dark storm clouds crackle with lightning across the battlefield', price: 250, type: 'theme', icon: '⚡',
    colors: { light: '#546e7a', dark: '#263238', accent: '#b0bec5', water: '#1a237e' }, ambientEffect: 'sparkle' },
  { id: 'theme_chocolate', name: 'Chocolate Factory', description: 'A warm and sweet battlefield made of melting chocolate and gold', price: 175, type: 'theme', icon: '🍫',
    colors: { light: '#d7ccc8', dark: '#4e342e', accent: '#a1887f', water: '#6d4c41' }, ambientEffect: 'sparkle' },
  { id: 'theme_dragon', name: "Dragon's Lair", description: 'A treasure-filled dragon cave glowing with fire and ancient gold', price: 300, type: 'theme', icon: '🐉',
    colors: { light: '#2e7d32', dark: '#1b5e20', accent: '#ffd600', water: '#e65100' }, ambientEffect: 'ember' },
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

  // Tier 6 - New Premium Challenges
  { id: 'win_50', name: 'Supreme Commander', description: 'Win 50 games', icon: '👑', requirement: 50, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_vampire' } },
  { id: 'eliminate_500', name: 'Annihilator', description: 'Eliminate 500 pieces', icon: '☠️', requirement: 500, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'effect_soul' } },
  { id: 'points_2500', name: 'Infinite Power', description: 'Score 2500 total points', icon: '⚡', requirement: 2500, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'theme_dragon' } },
  { id: 'play_50', name: 'War Addict', description: 'Play 50 games', icon: '🎮', requirement: 50, stat: 'gamesPlayed',
    reward: { type: 'item', itemId: 'music_viking' } },
  { id: 'engineer_50', name: 'Engineer Overlord', description: 'Capture 50 engineers', icon: '🔧', requirement: 50, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'skin_exosuit' } },

  // Tier 7 - Legendary Challenges
  { id: 'win_100', name: 'Immortal Warrior', description: 'Win 100 games', icon: '🔱', requirement: 100, stat: 'gamesWon',
    reward: { type: 'item', itemId: 'skin_diamond' } },
  { id: 'eliminate_1000', name: 'God of War', description: 'Eliminate 1000 pieces', icon: '⚔️', requirement: 1000, stat: 'piecesEliminated',
    reward: { type: 'item', itemId: 'theme_obsidian' } },
  { id: 'points_5000', name: 'Transcended', description: 'Score 5000 total points', icon: '🌌', requirement: 5000, stat: 'totalPointsScored',
    reward: { type: 'item', itemId: 'theme_crystal_cavern' } },
  { id: 'play_100', name: 'Eternal Soldier', description: 'Play 100 games', icon: '💎', requirement: 100, stat: 'gamesPlayed',
    reward: { type: 'warBucks', amount: 1000 } },
  { id: 'engineer_100', name: 'Engineer Deity', description: 'Capture 100 engineers', icon: '⚙️', requirement: 100, stat: 'engineersCaptured',
    reward: { type: 'item', itemId: 'effect_plasma' } },
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
    },
    friends: [],
    blockedUsers: []
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
  PLAYTIME_50H: { id: 'playtime_50h', name: 'Hardcore', description: 'Play for 50 hours total', icon: '🔥' },

  // Combat badges - Wave 2
  FIRST_BLOOD: { id: 'first_blood', name: 'First Blood', description: 'Eliminate your first piece', icon: '🗡️' },
  SERIAL_KILLER: { id: 'serial_killer', name: 'Serial Killer', description: 'Eliminate 500 pieces total', icon: '💀' },
  UNTOUCHABLE: { id: 'untouchable', name: 'Untouchable', description: 'Win a game losing fewer than 3 pieces', icon: '🛡️' },
  MASTER_HACKER: { id: 'master_hacker', name: 'Master Hacker', description: 'Hack 20 pieces with the hacker', icon: '🧠' },
  MASTER_BUILDER: { id: 'master_builder', name: 'Master Builder', description: 'Build 50 structures total', icon: '🏗️' },
  ARTILLERY_KING: { id: 'artillery_king', name: 'Artillery King', description: 'Destroy 30 pieces with artillery', icon: '🎯' },

  // Multiplayer badges - Wave 2
  WIN_STREAK_5: { id: 'win_streak_5', name: 'Win Streak', description: 'Win 5 multiplayer games in a row', icon: '🔥' },
  GLOBE_TROTTER: { id: 'globe_trotter', name: 'Globe Trotter', description: 'Play against 10 different players', icon: '🌍' },
  BLITZ_MASTER: { id: 'blitz_master', name: 'Blitz Master', description: 'Win 10 games with timer enabled', icon: '⚡' },

  // Shop & Collection badges - Wave 2
  SHOPAHOLIC: { id: 'shopaholic', name: 'Shopaholic', description: 'Buy 20 items from the shop', icon: '🛒' },
  BUNDLE_HUNTER: { id: 'bundle_hunter', name: 'Bundle Hunter', description: 'Buy 3 bundles', icon: '📦' },
  DEAL_SNIPER: { id: 'deal_sniper', name: 'Deal Sniper', description: 'Buy 10 daily deal items', icon: '🔥' },

  // Special badges
  NIGHT_OWL: { id: 'night_owl', name: 'Night Owl', description: 'Play a game after midnight', icon: '🌙' },
  COMEBACK_KING: { id: 'comeback_king', name: 'Comeback King', description: 'Win after being 20+ points behind', icon: '💪' },
  WAR_LEGEND: { id: 'war_legend', name: 'War Legend', description: 'Earn 40 other badges', icon: '👑' },

  // Extra 10 badges
  SURVIVOR_10: { id: 'survivor_10', name: 'Iron Will', description: 'Win 10 games with less than 5 points difference', icon: '🦾' },
  POINTS_1000: { id: 'points_1000', name: 'Points Machine', description: 'Score 1000 total points', icon: '📈' },
  POINTS_5000: { id: 'points_5000', name: 'Score Legend', description: 'Score 5000 total points', icon: '🏅' },
  ELIMINATOR_250: { id: 'eliminator_250', name: 'Eliminator', description: 'Eliminate 250 pieces total', icon: '☠️' },
  ELIMINATOR_1000: { id: 'eliminator_1000', name: 'War Machine', description: 'Eliminate 1000 pieces total', icon: '⚙️' },
  COLLECTOR_SOUNDS: { id: 'collector_sounds', name: 'Sound Collector', description: 'Buy all sound packs', icon: '🔊' },
  COLLECTOR_MUSIC: { id: 'collector_music', name: 'Music Collector', description: 'Buy all music packs', icon: '🎵' },
  GAMES_1000: { id: 'games_1000', name: 'Addicted', description: 'Play 1000 games', icon: '🎮' },
  WINS_250: { id: 'wins_250', name: 'Quarter Thousand', description: 'Win 250 games', icon: '🥇' },
  PLAYTIME_100H: { id: 'playtime_100h', name: 'No Life', description: 'Play for 100 hours total', icon: '💀' }
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

  // === NEW BADGES - Wave 2 ===

  // Combat
  if (!userData.badges.includes('first_blood') && stats.piecesEliminated >= 1) {
    newBadges.push('first_blood')
  }
  if (!userData.badges.includes('serial_killer') && stats.piecesEliminated >= 500) {
    newBadges.push('serial_killer')
  }
  if (!userData.badges.includes('master_hacker') && (stats.hackersDestroyed || 0) >= 20) {
    newBadges.push('master_hacker')
  }
  if (!userData.badges.includes('eliminator_250') && stats.piecesEliminated >= 250) {
    newBadges.push('eliminator_250')
  }
  if (!userData.badges.includes('eliminator_1000') && stats.piecesEliminated >= 1000) {
    newBadges.push('eliminator_1000')
  }

  // Shop
  if (!userData.badges.includes('shopaholic') && owned.length >= 20) {
    newBadges.push('shopaholic')
  }
  if (!userData.badges.includes('night_owl')) {
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5 && stats.gamesPlayed > 0) {
      newBadges.push('night_owl')
    }
  }

  // Collection - sounds & music
  const allSounds = SHOP_ITEMS.filter(i => i.type === 'sound_pack').map(i => i.id)
  const allMusic = SHOP_ITEMS.filter(i => i.type === 'music_pack').map(i => i.id)
  if (!userData.badges.includes('collector_sounds') && allSounds.every(id => owned.includes(id))) {
    newBadges.push('collector_sounds')
  }
  if (!userData.badges.includes('collector_music') && allMusic.every(id => owned.includes(id))) {
    newBadges.push('collector_music')
  }

  // Points milestones
  if (!userData.badges.includes('points_1000') && stats.totalPointsScored >= 1000) {
    newBadges.push('points_1000')
  }
  if (!userData.badges.includes('points_5000') && stats.totalPointsScored >= 5000) {
    newBadges.push('points_5000')
  }

  // Game milestones
  if (!userData.badges.includes('games_1000') && stats.gamesPlayed >= 1000) {
    newBadges.push('games_1000')
  }
  if (!userData.badges.includes('wins_250') && stats.gamesWon >= 250) {
    newBadges.push('wins_250')
  }
  if (!userData.badges.includes('playtime_100h') && stats.timePlayed >= 360000) { // 100 hours
    newBadges.push('playtime_100h')
  }

  // War Legend - earned 40+ other badges
  if (!userData.badges.includes('war_legend') && (userData.badges.length + newBadges.length) >= 40) {
    newBadges.push('war_legend')
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

// Set user as playing (with gameId for spectators)
export async function setPlaying(gameId: string): Promise<void> {
  if (!db || !currentUser || !currentUserData || isOfflineMode) return

  try {
    await setDoc(doc(db, 'online', currentUser.uid), {
      id: currentUser.uid,
      username: currentUserData.username,
      lastSeen: serverTimestamp(),
      status: 'playing',
      gameId: gameId
    })
  } catch (error) {
    console.error('Error setting playing:', error)
  }
}

// Spectator listener (separate from player game listener)
let spectatorGameUnsubscribe: (() => void) | null = null

export function listenToGameAsSpectator(gameId: string, callback: (game: MultiplayerGame | null) => void): void {
  if (!db) return

  // Clean up existing spectator listener
  if (spectatorGameUnsubscribe) {
    spectatorGameUnsubscribe()
  }

  spectatorGameUnsubscribe = onSnapshot(doc(db, 'games', gameId), (docSnap) => {
    if (docSnap.exists()) {
      callback({
        id: docSnap.id,
        ...docSnap.data()
      } as MultiplayerGame)
    } else {
      callback(null)
    }
  })
}

export function stopSpectating(): void {
  if (spectatorGameUnsubscribe) {
    spectatorGameUnsubscribe()
    spectatorGameUnsubscribe = null
  }
}

// Get a game by ID (for spectator to fetch initial state)
export async function getGameById(gameId: string): Promise<MultiplayerGame | null> {
  if (!db) return null

  try {
    const gameDoc = await getDoc(doc(db, 'games', gameId))
    if (!gameDoc.exists()) return null
    return {
      id: gameDoc.id,
      ...gameDoc.data()
    } as MultiplayerGame
  } catch (error) {
    console.error('Error getting game:', error)
    return null
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

    // === NEW: 20 Extra Events ===
    // Rewards
    { type: 'reward', title: 'New Player Gift!', message: 'Welcome to War Chess! Here are some War Bucks to get you started.', icon: '🎉', active: true, rewardType: 'warBucks', rewardAmount: 200 },
    { type: 'reward', title: 'Holiday Special!', message: 'Happy holidays! Enjoy this special bonus!', icon: '🎄', active: false, rewardType: 'warBucks', rewardAmount: 500 },
    { type: 'reward', title: 'Bug Reporter Reward', message: 'Thanks for reporting bugs! Here is your reward.', icon: '🐛', active: false, rewardType: 'warBucks', rewardAmount: 150 },
    { type: 'reward', title: 'Free Fire Trail!', message: 'Claim a free Fire Trail effect!', icon: '🔥', active: false, rewardType: 'item', rewardItemId: 'effect_fire' },
    { type: 'reward', title: 'Loyalty Bonus', message: 'You have been playing for a while! Thanks for sticking around.', icon: '💎', active: false, rewardType: 'warBucks', rewardAmount: 300 },

    // Announcements
    { type: 'announcement', title: 'New Shop Items!', message: '10 new board themes, 12 new skins, 10 new effects, 10 sound packs and 15 music packs just dropped!', icon: '🛒', active: true },
    { type: 'announcement', title: 'Daily Deals Are Live!', message: 'Check the shop every day for 2 items at 20% off plus exclusive bundles!', icon: '🔥', active: true },
    { type: 'announcement', title: 'Puzzle Mode Updated!', message: 'New daily puzzles with better rewards. Can you solve them all?', icon: '🧩', active: false },
    { type: 'announcement', title: 'Leaderboard Season Reset', message: 'A new season has begun! Climb the ranks and earn weekly rewards.', icon: '📊', active: false },
    { type: 'announcement', title: 'Community Milestone!', message: 'We just hit 100 registered players! Thanks to everyone!', icon: '🎊', active: false },

    // Events
    { type: 'event', title: 'Double War Bucks Weekend!', message: 'Earn double War Bucks from all games this weekend!', icon: '💰', active: false },
    { type: 'event', title: 'Skin Showcase Week', message: 'All skins are 25% off this week only!', icon: '⚔️', active: false },
    { type: 'event', title: 'Speed Run Challenge', message: 'Win a game in under 3 minutes for a special badge!', icon: '⏱️', active: false },
    { type: 'event', title: 'Hacker Showdown', message: 'Use your hacker pieces to dominate! Most hacks wins a prize.', icon: '💻', active: false },
    { type: 'event', title: 'Builder Marathon', message: 'Build the most structures in one game for bonus War Bucks!', icon: '🏗️', active: false },

    // Updates & Maintenance
    { type: 'update', title: 'Admin Panel Upgraded!', message: 'New Shop Items creator, AI generation, music studio and more for admins.', icon: '🔧', active: true },
    { type: 'update', title: 'Purchase Popups!', message: 'Beautiful new purchase popups with Equip Now button!', icon: '✨', active: true },
    { type: 'update', title: 'Bundles System!', message: 'Buy 3 items together and save 20%! Check the Daily Deals tab.', icon: '📦', active: true },
    { type: 'maintenance', title: 'Scheduled Maintenance', message: 'Quick server restart tonight at 3 AM. Should take 5 minutes.', icon: '🔧', active: false },
    { type: 'maintenance', title: 'Database Optimization', message: 'We are optimizing the database for faster load times.', icon: '⚡', active: false },

    // === Wave 2: 20 More Events ===
    // Rewards
    { type: 'reward', title: 'First Blood Bonus!', message: 'Win your first game today and claim bonus War Bucks!', icon: '🩸', active: true, rewardType: 'warBucks', rewardAmount: 150 },
    { type: 'reward', title: 'Puzzle Solver Reward', message: 'Complete 3 puzzles and claim this reward!', icon: '🧩', active: false, rewardType: 'warBucks', rewardAmount: 100 },
    { type: 'reward', title: 'Free Sparkle Effect!', message: 'Everyone gets a free Sparkle effect! Claim now!', icon: '✨', active: false, rewardType: 'item', rewardItemId: 'effect_sparkle' },
    { type: 'reward', title: 'Mega Jackpot!', message: 'A rare mega reward drop! Be fast before it expires!', icon: '🎰', active: false, rewardType: 'warBucks', rewardAmount: 1000 },
    { type: 'reward', title: 'Veteran Appreciation', message: 'For players who have been with us since the beginning. Thank you!', icon: '🎖️', active: false, rewardType: 'warBucks', rewardAmount: 400 },

    // Announcements
    { type: 'announcement', title: 'Artist Music Packs!', message: 'New music packs inspired by popular styles: Acoustic, Trap, Latin, Drill and more!', icon: '🎵', active: true },
    { type: 'announcement', title: 'New Skins Wave!', message: 'Vampire, Pirate, Ninja, Frost Giant and 8 more skins available now!', icon: '⚔️', active: true },
    { type: 'announcement', title: '30 Bundles Available!', message: 'Huge bundle collection! Save 20% on themed item packs in the Daily Deals tab.', icon: '📦', active: true },
    { type: 'announcement', title: 'Sound Packs Dropped!', message: 'Underwater, Stadium, Alien, Industrial and 6 more sound packs in the shop!', icon: '🔊', active: true },
    { type: 'announcement', title: 'Friends System!', message: 'Add friends, chat directly and see who is online! Check the Friends tab.', icon: '👥', active: false },

    // Game Events
    { type: 'event', title: 'Capture Marathon!', message: 'The player with the most captures this week wins 500 War Bucks!', icon: '🎯', active: false },
    { type: 'event', title: 'Tank Destroyer Event', message: 'Destroy 10 tanks in one game for a special reward!', icon: '💣', active: false },
    { type: 'event', title: 'Puzzle Sprint!', message: 'Solve 5 puzzles in a row without mistakes for 200 bonus War Bucks!', icon: '🧠', active: false },
    { type: 'event', title: 'Multiplayer Madness!', message: 'Play 5 multiplayer games this weekend for triple War Bucks!', icon: '🌐', active: false },
    { type: 'event', title: 'Collection Challenge', message: 'Buy 3 items from the shop this week and get 100 War Bucks back!', icon: '🛍️', active: false },

    // Updates
    { type: 'update', title: 'AI Shop Creator!', message: 'Admins can now create items with AI prompts! Type what you want and AI generates it.', icon: '🤖', active: true },
    { type: 'update', title: 'Music Studio!', message: 'New music creator with note sequencer, beat patterns and live preview!', icon: '🎵', active: true },
    { type: 'update', title: 'Effect Designer!', message: 'Create custom particle effects with live animated preview!', icon: '✨', active: false },

    // Polls
    { type: 'poll', title: 'Best New Theme?', message: 'Which new theme is your favorite?', icon: '🎨', active: true, pollOptions: ['Dragon Lair 🐉', 'Crystal Cavern 🔮', 'Blood Moon 🌅', 'Neon Arcade 🎪'] },
    { type: 'poll', title: 'Favorite Music Style?', message: 'What music do you play with?', icon: '🎶', active: false, pollOptions: ['Acoustic 🎸', 'EDM 🎆', 'Lo-Fi 🛏️', 'Epic Battle ⚔️'] },
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
  team: 'yellow' | 'green' | 'spectator'
  isQuickChat: boolean
  quickChatId?: string
}

// Chat listener
let chatUnsubscribe: (() => void) | null = null
let chatCallback: ((messages: GameChatMessage[]) => void) | null = null

// Send chat message
export async function sendChatMessage(gameId: string, message: string, team: 'yellow' | 'green' | 'spectator', isQuickChat: boolean = false, quickChatId?: string): Promise<boolean> {
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

// ==================== FRIENDS SYSTEM ====================

// Friend request interface
export interface FriendRequest {
  id: string
  fromUserId: string
  fromUsername: string
  toUserId: string
  toUsername: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: number
  respondedAt?: number
}

// Direct message interface
export interface DirectMessage {
  id: string
  conversationId: string
  fromUserId: string
  fromUsername: string
  toUserId: string
  message: string
  timestamp: number
  read: boolean
}

// Conversation interface
export interface Conversation {
  id: string
  participants: [string, string]
  lastMessage: string
  lastMessageTime: number
  unreadCount: Record<string, number>
}

// Friend with online status
export interface FriendWithStatus {
  odataId: string
  username: string
  status: 'online' | 'offline' | 'playing'
  lastSeen?: number
  gameId?: string  // If playing, the game ID to spectate
}

// Friends listeners
let friendRequestsUnsubscribe: (() => void) | null = null
let friendsStatusUnsubscribe: (() => void) | null = null
let directMessagesUnsubscribe: (() => void) | null = null
let conversationsUnsubscribe: (() => void) | null = null

// Generate conversation ID from two user IDs (sorted for consistency)
function getConversationId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_')
}

// Search for user by username (exact match)
export async function searchUserByUsername(username: string): Promise<{ odataId: string; username: string } | null> {
  if (!db || !currentUser) return null

  try {
    // Look up in usernames collection
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
    if (usernameDoc.exists()) {
      const data = usernameDoc.data()
      // Don't return self
      if (data.uid === currentUser.uid) return null
      return {
        odataId: data.uid,
        username: username
      }
    }
    return null
  } catch (error) {
    console.error('Error searching user:', error)
    return null
  }
}

// Search for users by username prefix (autocomplete)
export async function searchUsersByPrefix(prefix: string, limit: number = 5): Promise<Array<{ odataId: string; username: string }>> {
  if (!db || !currentUser || prefix.length < 2) return []

  try {
    const lowerPrefix = prefix.toLowerCase()
    // Firestore range query for prefix search
    // We search from 'prefix' to 'prefix' + highest unicode char
    const endPrefix = lowerPrefix + '\uf8ff'

    const q = query(
      collection(db, 'usernames'),
      where('__name__', '>=', lowerPrefix),
      where('__name__', '<=', endPrefix)
    )

    const snapshot = await getDocs(q)
    const userIds: Array<{ odataId: string; lowercaseName: string }> = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      // Don't include self or blocked users
      if (data.uid !== currentUser!.uid) {
        const blockedUsers = currentUserData?.blockedUsers || []
        if (!blockedUsers.includes(data.uid)) {
          userIds.push({
            odataId: data.uid,
            lowercaseName: docSnap.id
          })
        }
      }
    })

    // Fetch actual usernames from users collection (with proper casing)
    const results: Array<{ odataId: string; username: string }> = []
    for (const user of userIds.slice(0, limit)) {
      try {
        const userDoc = await getDoc(doc(db!, 'users', user.odataId))
        if (userDoc.exists()) {
          results.push({
            odataId: user.odataId,
            username: userDoc.data().username || user.lowercaseName
          })
        }
      } catch {
        // If we can't fetch user doc, use lowercase name
        results.push({
          odataId: user.odataId,
          username: user.lowercaseName
        })
      }
    }

    return results
  } catch (error) {
    console.error('Error searching users by prefix:', error)
    return []
  }
}

// Send friend request
export async function sendFriendRequest(toUserId: string, toUsername: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    // Check if already friends
    const friends = currentUserData.friends || []
    if (friends.includes(toUserId)) return false

    // Check if request already exists
    const existingQuery = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', currentUser.uid),
      where('toUserId', '==', toUserId),
      where('status', '==', 'pending')
    )
    const existingSnap = await getDocs(existingQuery)
    if (!existingSnap.empty) return false

    // Check if reverse request exists (they already sent us one)
    const reverseQuery = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', toUserId),
      where('toUserId', '==', currentUser.uid),
      where('status', '==', 'pending')
    )
    const reverseSnap = await getDocs(reverseQuery)
    if (!reverseSnap.empty) {
      // Auto-accept the reverse request
      const reverseRequestId = reverseSnap.docs[0].id
      await acceptFriendRequest(reverseRequestId)
      return true
    }

    // Create friend request
    await addDoc(collection(db, 'friendRequests'), {
      fromUserId: currentUser.uid,
      fromUsername: currentUserData.username,
      toUserId: toUserId,
      toUsername: toUsername,
      status: 'pending',
      createdAt: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error sending friend request:', error)
    return false
  }
}

// Accept friend request
export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    const requestDoc = await getDoc(doc(db, 'friendRequests', requestId))
    if (!requestDoc.exists()) return false

    const request = requestDoc.data() as FriendRequest
    if (request.toUserId !== currentUser.uid || request.status !== 'pending') return false

    // Update request status
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'accepted',
      respondedAt: Date.now()
    })

    // Add to both users' friends lists
    const myFriends = currentUserData.friends || []
    if (!myFriends.includes(request.fromUserId)) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayUnion(request.fromUserId)
      })
      currentUserData.friends = [...myFriends, request.fromUserId]
    }

    // Add to other user's friends list
    const otherUserDoc = await getDoc(doc(db, 'users', request.fromUserId))
    if (otherUserDoc.exists()) {
      const otherFriends = otherUserDoc.data().friends || []
      if (!otherFriends.includes(currentUser.uid)) {
        await updateDoc(doc(db, 'users', request.fromUserId), {
          friends: arrayUnion(currentUser.uid)
        })
      }
    }

    return true
  } catch (error) {
    console.error('Error accepting friend request:', error)
    return false
  }
}

// Decline friend request
export async function declineFriendRequest(requestId: string): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const requestDoc = await getDoc(doc(db, 'friendRequests', requestId))
    if (!requestDoc.exists()) return false

    const request = requestDoc.data() as FriendRequest
    if (request.toUserId !== currentUser.uid || request.status !== 'pending') return false

    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'declined',
      respondedAt: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error declining friend request:', error)
    return false
  }
}

// Listen to incoming friend requests
export function listenToFriendRequests(callback: (requests: FriendRequest[]) => void): void {
  if (!db || !currentUser) return

  if (friendRequestsUnsubscribe) {
    friendRequestsUnsubscribe()
  }

  const q = query(
    collection(db, 'friendRequests'),
    where('toUserId', '==', currentUser.uid),
    where('status', '==', 'pending')
  )

  friendRequestsUnsubscribe = onSnapshot(q, (snapshot) => {
    const requests: FriendRequest[] = []
    snapshot.forEach((docSnap) => {
      requests.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FriendRequest)
    })
    callback(requests)
  })
}

// Stop listening to friend requests
export function stopListeningToFriendRequests(): void {
  if (friendRequestsUnsubscribe) {
    friendRequestsUnsubscribe()
    friendRequestsUnsubscribe = null
  }
}

// Remove friend
export async function removeFriend(friendId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    // Remove from my friends list
    const myFriends = currentUserData.friends || []
    const updatedFriends = myFriends.filter(f => f !== friendId)
    await updateDoc(doc(db, 'users', currentUser.uid), {
      friends: updatedFriends
    })
    currentUserData.friends = updatedFriends

    // Remove from their friends list
    const friendDoc = await getDoc(doc(db, 'users', friendId))
    if (friendDoc.exists()) {
      const theirFriends = friendDoc.data().friends || []
      await updateDoc(doc(db, 'users', friendId), {
        friends: theirFriends.filter((f: string) => f !== currentUser!.uid)
      })
    }

    return true
  } catch (error) {
    console.error('Error removing friend:', error)
    return false
  }
}

// Block user
export async function blockUser(userId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    const blockedUsers = currentUserData.blockedUsers || []
    if (!blockedUsers.includes(userId)) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        blockedUsers: arrayUnion(userId)
      })
      currentUserData.blockedUsers = [...blockedUsers, userId]
    }

    // Also remove from friends if they were friends
    await removeFriend(userId)
    return true
  } catch (error) {
    console.error('Error blocking user:', error)
    return false
  }
}

// Unblock user
export async function unblockUser(userId: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    const blockedUsers = currentUserData.blockedUsers || []
    const updated = blockedUsers.filter(u => u !== userId)
    await updateDoc(doc(db, 'users', currentUser.uid), {
      blockedUsers: updated
    })
    currentUserData.blockedUsers = updated
    return true
  } catch (error) {
    console.error('Error unblocking user:', error)
    return false
  }
}

// Get friends with their online status
export async function getFriendsWithStatus(): Promise<FriendWithStatus[]> {
  if (!db || !currentUser || !currentUserData) return []

  const friends = currentUserData.friends || []
  if (friends.length === 0) return []

  const result: FriendWithStatus[] = []

  try {
    for (const friendId of friends) {
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', friendId))
      if (!userDoc.exists()) continue

      const userData = userDoc.data()

      // Check online status
      const onlineDoc = await getDoc(doc(db, 'online', friendId))
      let status: 'online' | 'offline' | 'playing' = 'offline'
      let lastSeen: number | undefined
      let gameId: string | undefined

      if (onlineDoc.exists()) {
        const onlineData = onlineDoc.data()
        status = onlineData.status === 'playing' ? 'playing' : 'online'
        lastSeen = onlineData.lastSeen?.toMillis() || Date.now()
        gameId = onlineData.gameId  // Get gameId if playing
      }

      result.push({
        odataId: friendId,
        username: userData.username,
        status,
        lastSeen,
        gameId
      })
    }

    // Sort: online first, then playing, then offline
    result.sort((a, b) => {
      const statusOrder = { online: 0, playing: 1, offline: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })

    return result
  } catch (error) {
    console.error('Error getting friends status:', error)
    return []
  }
}

// Listen to friends' online status changes
export function listenToFriendsStatus(friendIds: string[], callback: (statuses: Record<string, 'online' | 'offline' | 'playing'>) => void): void {
  if (!db || friendIds.length === 0) return

  if (friendsStatusUnsubscribe) {
    friendsStatusUnsubscribe()
  }

  // Note: Firestore 'in' queries support max 30 items
  // For simplicity, we'll listen to the online collection and filter
  const q = query(collection(db, 'online'))
  friendsStatusUnsubscribe = onSnapshot(q, (snapshot) => {
    const statuses: Record<string, 'online' | 'offline' | 'playing'> = {}

    // Default all friends to offline
    friendIds.forEach(id => { statuses[id] = 'offline' })

    // Update with actual online status
    snapshot.forEach((docSnap) => {
      if (friendIds.includes(docSnap.id)) {
        const data = docSnap.data()
        statuses[docSnap.id] = data.status === 'playing' ? 'playing' : 'online'
      }
    })

    callback(statuses)
  })
}

// Stop listening to friends status
export function stopListeningToFriendsStatus(): void {
  if (friendsStatusUnsubscribe) {
    friendsStatusUnsubscribe()
    friendsStatusUnsubscribe = null
  }
}

// Send direct message
export async function sendDirectMessage(toUserId: string, message: string): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  const filteredMessage = filterBadWords(message).filtered
  if (!filteredMessage.trim()) return false

  const conversationId = getConversationId(currentUser.uid, toUserId)

  try {
    // Create/update conversation
    const convRef = doc(db, 'conversations', conversationId)
    const convDoc = await getDoc(convRef)

    if (convDoc.exists()) {
      // Update existing conversation
      const convData = convDoc.data()
      const unreadCount = convData.unreadCount || {}
      unreadCount[toUserId] = (unreadCount[toUserId] || 0) + 1

      await updateDoc(convRef, {
        lastMessage: filteredMessage,
        lastMessageTime: Date.now(),
        unreadCount
      })
    } else {
      // Create new conversation
      await setDoc(convRef, {
        participants: [currentUser.uid, toUserId].sort(),
        lastMessage: filteredMessage,
        lastMessageTime: Date.now(),
        unreadCount: { [toUserId]: 1 }
      })
    }

    // Add message
    await addDoc(collection(db, 'directMessages'), {
      conversationId,
      fromUserId: currentUser.uid,
      fromUsername: currentUserData.username,
      toUserId,
      message: filteredMessage,
      timestamp: Date.now(),
      read: false
    })

    return true
  } catch (error) {
    console.error('Error sending direct message:', error)
    return false
  }
}

// Listen to direct messages with a specific friend
export function listenToDirectMessages(friendId: string, callback: (messages: DirectMessage[]) => void): void {
  if (!db || !currentUser) return

  if (directMessagesUnsubscribe) {
    directMessagesUnsubscribe()
  }

  const conversationId = getConversationId(currentUser.uid, friendId)
  const q = query(
    collection(db, 'directMessages'),
    where('conversationId', '==', conversationId)
  )

  directMessagesUnsubscribe = onSnapshot(q, (snapshot) => {
    const messages: DirectMessage[] = []
    snapshot.forEach((docSnap) => {
      messages.push({
        id: docSnap.id,
        ...docSnap.data()
      } as DirectMessage)
    })
    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp)
    callback(messages)
  })
}

// Stop listening to direct messages
export function stopListeningToDirectMessages(): void {
  if (directMessagesUnsubscribe) {
    directMessagesUnsubscribe()
    directMessagesUnsubscribe = null
  }
}

// Mark messages as read
export async function markMessagesAsRead(friendId: string): Promise<void> {
  if (!db || !currentUser) return

  const conversationId = getConversationId(currentUser.uid, friendId)

  try {
    // Update conversation unread count
    const convRef = doc(db, 'conversations', conversationId)
    const convDoc = await getDoc(convRef)
    if (convDoc.exists()) {
      const unreadCount = convDoc.data().unreadCount || {}
      unreadCount[currentUser.uid] = 0
      await updateDoc(convRef, { unreadCount })
    }

    // Mark all messages as read
    const q = query(
      collection(db, 'directMessages'),
      where('conversationId', '==', conversationId),
      where('toUserId', '==', currentUser.uid),
      where('read', '==', false)
    )
    const snapshot = await getDocs(q)
    const batch: Promise<void>[] = []
    snapshot.forEach((docSnap) => {
      batch.push(updateDoc(doc(db!, 'directMessages', docSnap.id), { read: true }))
    })
    await Promise.all(batch)
  } catch (error) {
    console.error('Error marking messages as read:', error)
  }
}

// Listen to all conversations for unread indicator
export function listenToConversations(callback: (conversations: Conversation[]) => void): void {
  if (!db || !currentUser) return

  if (conversationsUnsubscribe) {
    conversationsUnsubscribe()
  }

  // Query conversations where current user is a participant
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', currentUser.uid)
  )

  conversationsUnsubscribe = onSnapshot(q, (snapshot) => {
    const conversations: Conversation[] = []
    snapshot.forEach((docSnap) => {
      conversations.push({
        id: docSnap.id,
        ...docSnap.data()
      } as Conversation)
    })
    // Sort by last message time
    conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
    callback(conversations)
  })
}

// Stop listening to conversations
export function stopListeningToConversations(): void {
  if (conversationsUnsubscribe) {
    conversationsUnsubscribe()
    conversationsUnsubscribe = null
  }
}

// Get total unread message count
export function getTotalUnreadCount(conversations: Conversation[]): number {
  if (!currentUser) return 0
  return conversations.reduce((total, conv) => {
    return total + (conv.unreadCount[currentUser!.uid] || 0)
  }, 0)
}

// ============ LEADERBOARD FUNCTIONS ============

export interface LeaderboardEntry {
  odataId: string
  username: string
  value: number
  rank: number
}

// Get leaderboard data
export async function getLeaderboard(
  category: 'playtime' | 'wins' | 'warbucks',
  period: 'daily' | 'weekly' | 'monthly' | 'alltime'
): Promise<LeaderboardEntry[]> {
  if (!db) return []

  try {
    // Get all users
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)

    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const weekMs = 7 * dayMs
    const monthMs = 30 * dayMs

    // Get period start time
    let periodStart = 0
    if (period === 'daily') {
      periodStart = now - dayMs
    } else if (period === 'weekly') {
      periodStart = now - weekMs
    } else if (period === 'monthly') {
      periodStart = now - monthMs
    }

    const entries: LeaderboardEntry[] = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserData
      if (!data.username || !data.stats) return

      // For all-time, use lifetime stats
      // For periods, we need periodic stats (stored in periodStats)
      let value = 0

      if (period === 'alltime') {
        // Use all-time stats
        if (category === 'playtime') {
          value = data.stats.timePlayed || 0
        } else if (category === 'wins') {
          value = data.stats.gamesWon || 0
        } else if (category === 'warbucks') {
          value = data.stats.totalWarBucksEarned || 0
        }
      } else {
        // Use periodic stats if available
        const periodStats = (data as unknown as { periodStats?: Record<string, { playtime: number; wins: number; warbucks: number; lastReset: number }> }).periodStats
        const periodKey = period

        if (periodStats && periodStats[periodKey]) {
          const ps = periodStats[periodKey]
          // Check if period is still valid
          if (ps.lastReset >= periodStart) {
            if (category === 'playtime') {
              value = ps.playtime || 0
            } else if (category === 'wins') {
              value = ps.wins || 0
            } else if (category === 'warbucks') {
              value = ps.warbucks || 0
            }
          }
        }
      }

      // Only include users with value > 0
      if (value > 0) {
        entries.push({
          odataId: docSnap.id,
          username: data.username,
          value,
          rank: 0
        })
      }
    })

    // Sort by value descending
    entries.sort((a, b) => b.value - a.value)

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Return top 50
    return entries.slice(0, 50)
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

// Update periodic stats for a user (call this when game ends or stats change)
export async function updatePeriodicStats(
  playtimeAdded: number,
  winsAdded: number,
  warbucksAdded: number
): Promise<void> {
  if (!db || !currentUser) return

  try {
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) return

    const data = userDoc.data() as UserData
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const weekMs = 7 * dayMs
    const monthMs = 30 * dayMs

    // Initialize or update periodic stats
    const periodStats = ((data as unknown as { periodStats?: Record<string, { playtime: number; wins: number; warbucks: number; lastReset: number }> }).periodStats) || {}

    const periods = ['daily', 'weekly', 'monthly'] as const
    const periodDurations = { daily: dayMs, weekly: weekMs, monthly: monthMs }

    for (const period of periods) {
      if (!periodStats[period] || (now - periodStats[period].lastReset) > periodDurations[period]) {
        // Reset period
        periodStats[period] = {
          playtime: playtimeAdded,
          wins: winsAdded,
          warbucks: warbucksAdded,
          lastReset: now
        }
      } else {
        // Add to existing period
        periodStats[period].playtime += playtimeAdded
        periodStats[period].wins += winsAdded
        periodStats[period].warbucks += warbucksAdded
      }
    }

    await updateDoc(userRef, { periodStats })
  } catch (error) {
    console.error('Error updating periodic stats:', error)
  }
}

// Get weekly leaderboard winners and distribute rewards
// Check and distribute rewards for all periods (daily, weekly, monthly)
export async function checkAndDistributeWeeklyRewards(): Promise<void> {
  if (!db) return

  try {
    const rewardsRef = doc(db, 'system', 'leaderboardRewards')
    const rewardsDoc = await getDoc(rewardsRef)
    const rewardsData = rewardsDoc.exists() ? rewardsDoc.data() : {}

    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const weekMs = 7 * dayMs
    const monthMs = 30 * dayMs

    const categories = ['playtime', 'wins', 'warbucks'] as const

    // Reward amounts: { period: { category: amount } }
    const rewardAmounts = {
      daily: { playtime: 100, wins: 150, warbucks: 200 },
      weekly: { playtime: 500, wins: 750, warbucks: 1000 },
      monthly: { playtime: 1500, wins: 2250, warbucks: 3000 }
    }

    const periods = [
      { name: 'daily' as const, duration: dayMs, lastKey: 'lastDailyReward' },
      { name: 'weekly' as const, duration: weekMs, lastKey: 'lastWeeklyReward' },
      { name: 'monthly' as const, duration: monthMs, lastKey: 'lastMonthlyReward' }
    ]

    for (const period of periods) {
      const lastReward = rewardsData[period.lastKey] || 0

      // Check if this period's rewards are due
      if ((now - lastReward) >= period.duration) {
        console.log(`Distributing ${period.name} rewards...`)

        for (const category of categories) {
          const leaderboard = await getLeaderboard(category, period.name)
          if (leaderboard.length > 0) {
            const winner = leaderboard[0]
            const rewardAmount = rewardAmounts[period.name][category]

            // Award War Bucks to winner
            const winnerRef = doc(db, 'users', winner.odataId)
            const winnerDoc = await getDoc(winnerRef)

            if (winnerDoc.exists()) {
              const winnerData = winnerDoc.data() as UserData
              await updateDoc(winnerRef, {
                warBucks: (winnerData.warBucks || 0) + rewardAmount,
                'stats.totalWarBucksEarned': (winnerData.stats.totalWarBucksEarned || 0) + rewardAmount
              })
              console.log(`Awarded ${rewardAmount} War Bucks to ${winner.username} for ${period.name} ${category} leaderboard`)
            }
          }
        }

        // Mark this period's rewards as distributed
        rewardsData[period.lastKey] = now
      }
    }

    // Save updated reward times
    await setDoc(rewardsRef, rewardsData, { merge: true })
  } catch (error) {
    console.error('Error distributing leaderboard rewards:', error)
  }
}

// ==================== BUNDLES & DAILY DEALS ====================

export interface Bundle {
  id: string
  name: string
  icon: string
  description: string
  itemIds: string[]  // 3 shop item IDs
  originalPrice: number  // Sum of individual prices
  bundlePrice: number  // Discounted price (20% off)
  active: boolean
  createdAt: number
  createdBy: string
}

export interface DailyDeal {
  id: string
  itemId: string  // Shop item ID
  originalPrice: number
  dealPrice: number  // 20% off
  date: string  // YYYY-MM-DD format
  createdBy: string
}

export interface DailyDealsConfig {
  deals: Array<{ itemId: string }>  // 2 items
  lastUpdated: number
  updatedBy: string
}

// Get today's date string
function getTodayString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// Get daily deals - auto-generates 2 random deals if none set for today
export async function getDailyDeals(): Promise<Array<ShopItem & { dealPrice: number; originalPrice: number }>> {
  if (!db) return []

  try {
    const today = getTodayString()
    const dealsRef = doc(db, 'dailyDeals', today)
    const dealsDoc = await getDoc(dealsRef)

    let dealItemIds: string[] = []

    if (dealsDoc.exists()) {
      const data = dealsDoc.data() as DailyDealsConfig
      dealItemIds = data.deals.map(d => d.itemId)
    } else {
      // Auto-generate 2 random deals for today
      const availableItems = [...SHOP_ITEMS]
      const shuffled = availableItems.sort(() => Math.random() - 0.5)
      dealItemIds = shuffled.slice(0, 2).map(item => item.id)

      // Save auto-generated deals
      await setDoc(dealsRef, {
        deals: dealItemIds.map(id => ({ itemId: id })),
        lastUpdated: Date.now(),
        updatedBy: 'auto'
      })
    }

    // Map to shop items with deal prices
    return dealItemIds
      .map(id => {
        const item = SHOP_ITEMS.find(i => i.id === id)
        if (!item) return null
        return {
          ...item,
          originalPrice: item.price,
          dealPrice: Math.floor(item.price * 0.8)  // 20% off
        }
      })
      .filter((item): item is ShopItem & { dealPrice: number; originalPrice: number } => item !== null)
  } catch (error) {
    console.error('Error getting daily deals:', error)
    return []
  }
}

// Admin: Set daily deals for today
export async function adminSetDailyDeals(itemIds: string[]): Promise<boolean> {
  if (!db || !currentUser) return false

  try {
    const today = getTodayString()
    const dealsRef = doc(db, 'dailyDeals', today)
    await setDoc(dealsRef, {
      deals: itemIds.map(id => ({ itemId: id })),
      lastUpdated: Date.now(),
      updatedBy: currentUserData?.username || 'admin'
    })
    return true
  } catch (error) {
    console.error('Error setting daily deals:', error)
    return false
  }
}

// Get all bundles
export async function getAllBundles(): Promise<Bundle[]> {
  if (!db) return []

  try {
    const bundlesRef = collection(db, 'bundles')
    const snapshot = await getDocs(bundlesRef)
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bundle))
  } catch (error) {
    console.error('Error getting bundles:', error)
    return []
  }
}

// Max 4 active bundles in the shop at once
export const MAX_ACTIVE_BUNDLES = 4

// Get active bundles only (max 4)
export async function getActiveBundles(): Promise<Bundle[]> {
  if (!db) return []

  try {
    const bundlesRef = collection(db, 'bundles')
    const q = query(bundlesRef, where('active', '==', true))
    const snapshot = await getDocs(q)
    const bundles = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bundle))
    return bundles.slice(0, MAX_ACTIVE_BUNDLES)
  } catch (error) {
    console.error('Error getting active bundles:', error)
    return []
  }
}

// Count currently active bundles
export async function getActiveBundleCount(): Promise<number> {
  if (!db) return 0
  try {
    const bundlesRef = collection(db, 'bundles')
    const q = query(bundlesRef, where('active', '==', true))
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    return 0
  }
}

// Admin: Create a new bundle
export async function adminCreateBundle(bundle: {
  name: string
  icon: string
  description: string
  itemIds: string[]
}): Promise<string | null> {
  if (!db || !currentUser) return null

  try {
    // Calculate prices from items
    const items = bundle.itemIds.map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean) as ShopItem[]
    const originalPrice = items.reduce((sum, item) => sum + item.price, 0)
    const bundlePrice = Math.floor(originalPrice * 0.8)  // 20% off

    // Only set active if under the limit
    const activeCount = await getActiveBundleCount()
    const canBeActive = activeCount < MAX_ACTIVE_BUNDLES

    const bundleData: Omit<Bundle, 'id'> = {
      name: bundle.name,
      icon: bundle.icon,
      description: bundle.description,
      itemIds: bundle.itemIds,
      originalPrice,
      bundlePrice,
      active: canBeActive,
      createdAt: Date.now(),
      createdBy: currentUserData?.username || 'admin'
    }

    const docRef = await addDoc(collection(db, 'bundles'), bundleData)
    return docRef.id
  } catch (error) {
    console.error('Error creating bundle:', error)
    return null
  }
}

// Admin: Delete a bundle
export async function adminDeleteBundle(bundleId: string): Promise<boolean> {
  if (!db) return false

  try {
    await deleteDoc(doc(db, 'bundles', bundleId))
    return true
  } catch (error) {
    console.error('Error deleting bundle:', error)
    return false
  }
}

// Admin: Toggle bundle active status (max 4 active)
export async function adminToggleBundle(bundleId: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  if (!db) return { success: false, error: 'No database' }

  try {
    // Check limit when activating
    if (active) {
      const count = await getActiveBundleCount()
      if (count >= MAX_ACTIVE_BUNDLES) {
        return { success: false, error: `Max ${MAX_ACTIVE_BUNDLES} active bundles allowed. Disable one first.` }
      }
    }
    await updateDoc(doc(db, 'bundles', bundleId), { active })
    return { success: true }
  } catch (error) {
    console.error('Error toggling bundle:', error)
    return { success: false, error: 'Failed to toggle bundle' }
  }
}

// Purchase a bundle - gives all items in the bundle
export async function purchaseBundle(bundle: Bundle): Promise<boolean> {
  if (!db || !currentUser || !currentUserData) return false

  try {
    if (currentUserData.warBucks < bundle.bundlePrice) return false

    const newWarBucks = currentUserData.warBucks - bundle.bundlePrice
    const newPurchasedItems = [...(currentUserData.purchasedItems || [])]

    // Add all bundle items that aren't already owned
    for (const itemId of bundle.itemIds) {
      if (!newPurchasedItems.includes(itemId)) {
        newPurchasedItems.push(itemId)
      }
    }

    await updateDoc(doc(db, 'users', currentUser.uid), {
      warBucks: newWarBucks,
      purchasedItems: newPurchasedItems,
      'stats.totalWarBucksSpent': (currentUserData.stats.totalWarBucksSpent || 0) + bundle.bundlePrice
    })

    if (currentUserData) {
      currentUserData.warBucks = newWarBucks
      currentUserData.purchasedItems = newPurchasedItems
    }

    return true
  } catch (error) {
    console.error('Error purchasing bundle:', error)
    return false
  }
}

// ==================== CUSTOM SHOP ITEMS ====================

// Load custom shop items from Firestore and merge into SHOP_ITEMS
export async function loadCustomShopItems(): Promise<number> {
  if (!db) return 0

  try {
    const customRef = collection(db, 'customShopItems')
    const snapshot = await getDocs(customRef)
    let count = 0

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data() as ShopItem
      const item: ShopItem = { ...data, id: docSnap.id, isCustom: true }

      // Don't add duplicates
      if (!SHOP_ITEMS.find(i => i.id === item.id)) {
        SHOP_ITEMS.push(item)
        count++
      }
    })

    return count
  } catch (error) {
    console.error('Error loading custom shop items:', error)
    return 0
  }
}

// Admin: Create a custom shop item
export async function adminCreateShopItem(item: Omit<ShopItem, 'id' | 'isCustom'>): Promise<string | null> {
  if (!db || !currentUser) return null

  try {
    const itemData = { ...item, isCustom: true, createdAt: Date.now(), createdBy: currentUserData?.username || 'admin' }
    const docRef = await addDoc(collection(db, 'customShopItems'), itemData)

    // Add to local SHOP_ITEMS array immediately
    const newItem: ShopItem = { ...item, id: docRef.id, isCustom: true }
    SHOP_ITEMS.push(newItem)

    return docRef.id
  } catch (error) {
    console.error('Error creating shop item:', error)
    return null
  }
}

// Admin: Delete a custom shop item
export async function adminDeleteShopItem(itemId: string): Promise<boolean> {
  if (!db) return false

  try {
    await deleteDoc(doc(db, 'customShopItems', itemId))

    // Remove from local SHOP_ITEMS array
    const idx = SHOP_ITEMS.findIndex(i => i.id === itemId)
    if (idx >= 0) SHOP_ITEMS.splice(idx, 1)

    return true
  } catch (error) {
    console.error('Error deleting shop item:', error)
    return false
  }
}

// Admin: Get all custom shop items
export async function adminGetCustomShopItems(): Promise<ShopItem[]> {
  if (!db) return []

  try {
    const customRef = collection(db, 'customShopItems')
    const snapshot = await getDocs(customRef)
    return snapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id, isCustom: true } as ShopItem))
  } catch (error) {
    console.error('Error getting custom shop items:', error)
    return []
  }
}

// Admin: Create 4 pre-designed bundles
export async function adminCreateSampleBundles(): Promise<number> {
  if (!db || !currentUser) return 0

  const bundles = [
    // Original 4
    { name: 'Shadow Ops Bundle', icon: '🌑', description: 'Dominate from the darkness - stealth theme, ghostly effects and creepy sounds', itemIds: ['theme_night', 'effect_ghost', 'sound_horror'] },
    { name: 'Space Commander Bundle', icon: '🚀', description: 'Command the galaxy - cosmic visuals, stardust particles and sci-fi audio', itemIds: ['theme_space', 'effect_stars', 'sound_scifi'] },
    { name: 'Medieval Kingdom Bundle', icon: '⚔️', description: 'Rule the realm - enchanted forests, legendary knight skins and clashing swords', itemIds: ['theme_forest', 'skin_medieval', 'sound_medieval'] },
    { name: 'Cyber Warfare Bundle', icon: '💜', description: 'Hack the battlefield - neon cyberpunk visuals, chrome robots and glitchy synths', itemIds: ['theme_neon', 'skin_robot', 'music_cyberpunk'] },

    // New themed bundles using Wave 2 items
    { name: 'Vampire Castle Bundle', icon: '🧛', description: 'Eternal night awaits - cursed blood moon, vampire legions and soul-reaping effects', itemIds: ['theme_bloodmoon', 'skin_vampire', 'effect_soul'] },
    { name: 'Pirate Adventure Bundle', icon: '🏴‍☠️', description: 'Set sail for treasure - ocean assault, fearsome pirate crew and a roaring shanty', itemIds: ['theme_ocean', 'skin_pirate', 'music_pirate_shanty'] },
    { name: 'Arctic Explorer Bundle', icon: '🧊', description: 'Survive the frozen north - icy caves, frost giants and zen tranquility', itemIds: ['theme_ice', 'skin_frost', 'sound_zen'] },
    { name: 'Ninja Stealth Bundle', icon: '🥷', description: 'Strike from the shadows - obsidian darkness, ninja warriors and plasma attacks', itemIds: ['theme_obsidian', 'skin_ninja', 'effect_plasma'] },
    { name: 'Dragon Slayer Bundle', icon: '🐉', description: 'Enter the dragon lair with fantasy heroes and blue inferno flames', itemIds: ['theme_dragon', 'skin_fantasy', 'effect_bluefire'] },
    { name: 'Retro Gamer Bundle', icon: '🎮', description: 'Pure nostalgia - neon arcade, pixel warriors and crunchy 8-bit sounds', itemIds: ['theme_arcade', 'skin_pixel', 'sound_arcade2'] },
    { name: 'Halloween Horror Bundle', icon: '🎃', description: 'Spooky scary - haunted battlefield, pumpkin army and toxic drips', itemIds: ['theme_haunted', 'skin_pumpkin', 'effect_toxic'] },
    { name: 'Crystal Mage Bundle', icon: '🔮', description: 'Mystical power - crystal caverns, diamond elite pieces and prisma burst effects', itemIds: ['theme_crystal_cavern', 'skin_diamond', 'effect_prisma'] },
    { name: 'Wild West Bundle', icon: '🤠', description: 'Saddle up partner - desert camo, outlaw cowboys and dusty western tunes', itemIds: ['theme_desert', 'skin_cowboy', 'music_western'] },
    { name: 'Deep Sea Bundle', icon: '🌊', description: 'Dive into the abyss - underwater theme, sea creatures and bubbly sounds', itemIds: ['theme_underwater', 'skin_deepsea', 'sound_underwater'] },
    { name: 'World War Bundle', icon: '🪖', description: 'Historical warfare - ancient castle, WW1 trench fighters and cinematic sounds', itemIds: ['theme_castle', 'skin_ww1', 'sound_cinematic'] },
    { name: 'Cold War Spy Bundle', icon: '🕵️', description: 'Classified operations - night ops, cold war agents and walkie-talkie comms', itemIds: ['theme_night', 'skin_coldwar', 'sound_walkietalkie'] },
    { name: 'Zen Master Bundle', icon: '⛩️', description: 'Inner peace and discipline - cherry blossoms, samurai music and zen sounds', itemIds: ['theme_cherry_blossom', 'music_samurai', 'sound_zen'] },
    { name: 'EDM Party Bundle', icon: '🎆', description: 'Drop the bass - neon arcade, tornado spin effects and EDM festival beats', itemIds: ['theme_arcade', 'effect_tornado', 'music_edm_drop'] },
    { name: 'Chocolate Dream Bundle', icon: '🍫', description: 'Sweet indulgence - chocolate factory, butterfly effects and campfire songs', itemIds: ['theme_chocolate', 'effect_butterfly', 'music_campfire'] },
    { name: 'Viking Conquest Bundle', icon: '⚔️', description: 'For Valhalla! - lava battlefield, medieval knights and thundering war drums', itemIds: ['theme_lava', 'skin_medieval', 'music_viking'] },
    { name: 'Sci-Fi Explorer Bundle', icon: '🛸', description: 'Beyond the stars - space odyssey music, exo-suit soldiers and warp drive effects', itemIds: ['skin_exosuit', 'effect_warp', 'music_space_odyssey'] },
    { name: 'Stormy Night Bundle', icon: '⚡', description: 'Thunder and lightning - storm battlefield, lightning effects and stadium echo', itemIds: ['theme_thunderstorm', 'effect_lightning', 'sound_stadium'] },
    { name: 'Alchemist Lab Bundle', icon: '⚗️', description: 'Transmute the battlefield - gold rush theme, alchemist pieces and magic rune effects', itemIds: ['theme_gold', 'skin_alchemist', 'effect_runes'] },
    { name: 'Moonlight Serenade Bundle', icon: '🌙', description: 'Romance under the stars - sunset ballad, moonlight glow and acoustic heartstrings', itemIds: ['effect_moonlight', 'music_sunset_ballad', 'music_acoustic_heart'] },
    { name: 'Acoustic Session Bundle', icon: '🎸', description: 'Intimate acoustic vibes - campfire folk, love letters guitar and warm sunset colors', itemIds: ['music_acoustic_love', 'music_campfire', 'theme_sunset'] },
    { name: 'Loop Artist Bundle', icon: '🎤', description: 'Layer your sounds - loop station beats, ginger folk sessions and music note effects', itemIds: ['music_loop_station', 'music_ginger_folk', 'effect_musicnotes'] },
    { name: 'Street Heat Bundle', icon: '👑', description: 'Dominate the streets - trap beats, drill sounds and industrial audio', itemIds: ['music_trap_king', 'music_drill_beats', 'sound_industrial'] },
    { name: 'Latin Summer Bundle', icon: '💃', description: 'Hot summer vibes - latin fire beats, tropical beach and butterfly effects', itemIds: ['music_latin_fire', 'theme_tropical', 'effect_butterfly'] },
    { name: 'Dreamer Bundle', icon: '🛏️', description: 'Soft and dreamy - bedroom pop, piano ballad and moonlight particles', itemIds: ['music_bedroom_pop', 'music_piano_ballad', 'effect_moonlight'] },
    { name: 'Toxic Warfare Bundle', icon: '☢️', description: 'Radioactive destruction - toxic wasteland, toxic drip effects and alien sounds', itemIds: ['theme_toxic', 'effect_toxic', 'sound_alien'] },
    { name: 'Samurai Honor Bundle', icon: '⛩️', description: 'The way of the warrior - cherry blossoms, samurai melodies and ninja stealth', itemIds: ['theme_cherry_blossom', 'music_samurai', 'skin_ninja'] },
  ]

  let created = 0
  for (const bundle of bundles) {
    const id = await adminCreateBundle(bundle)
    if (id) created++
  }
  return created
}
