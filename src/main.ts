import './style.css'

// Language settings
type Language = 'en' | 'nl' | 'de' | 'fr' | 'es'
let currentLanguage: Language = 'en'
let showSettings = false

// Timer settings (chess clock style)
let timerEnabled = false
let timerMinutes = 10 // Default 10 minutes per player
let yellowTimeRemaining = 0 // in seconds
let greenTimeRemaining = 0 // in seconds
let timerInterval: number | null = null

// Score penalties (for timeout)
let yellowPenalty = 0
let greenPenalty = 0
const TIMEOUT_PENALTY = 10

// Audio settings
let soundEnabled = true
let musicEnabled = false
let masterVolume = 0.8 // 0-1
let musicVolume = 0.5 // 0-1
let sfxVolume = 0.8 // 0-1
type MusicStyle = 'epic' | 'ambient' | 'tension' | 'electronic' | 'orchestral' | 'retro'
let musicStyle: MusicStyle = 'epic'
let musicGainNode: GainNode | null = null
let musicInterval: number | null = null
let musicPhase = 0 // Track musical sections

// Visual settings
type BoardTheme = 'classic' | 'dark' | 'light' | 'wood'
let boardTheme: BoardTheme = 'classic'
let animationSpeed: 'fast' | 'normal' | 'slow' = 'normal'
let screenShakeEnabled = true
let showCoordinates = true

// Accessibility settings
let colorBlindMode = false
let highContrastMode = false
let largeUIMode = false

// Bot mode
let botMode = false
let botDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
let botThinking = false

// Fullscreen
let isFullscreen = false

// Theme color palettes
function getThemeColors(): { light: string; dark: string } {
  switch (boardTheme) {
    case 'dark':
      return { light: '#4a5568', dark: '#2d3748' }
    case 'light':
      return { light: '#e2e8f0', dark: '#cbd5e0' }
    case 'wood':
      return { light: '#d4a574', dark: '#8b6914' }
    case 'classic':
    default:
      return { light: '#86a876', dark: '#d4c87a' }
  }
}

// Team colors (colorblind-friendly alternatives)
function getTeamColor(team: 'yellow' | 'green'): string {
  if (colorBlindMode) {
    // Blue vs Orange - more distinguishable
    return team === 'yellow' ? '#f97316' : '#3b82f6'
  }
  return team === 'yellow' ? '#eab308' : '#22c55e'
}

function getTeamBgColor(team: 'yellow' | 'green'): string {
  if (colorBlindMode) {
    return team === 'yellow' ? 'bg-orange-500' : 'bg-blue-500'
  }
  return team === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
}

function getTeamTextColor(team: 'yellow' | 'green'): string {
  if (colorBlindMode) {
    return team === 'yellow' ? 'text-orange-500' : 'text-blue-500'
  }
  return team === 'yellow' ? 'text-yellow-500' : 'text-green-500'
}

// Animation duration based on speed setting
function getAnimationDuration(): number {
  switch (animationSpeed) {
    case 'fast': return 150
    case 'slow': return 500
    case 'normal':
    default: return 250
  }
}

// Speed multiplier for animations (fast = 0.5x, normal = 1x, slow = 2x)
function getSpeedMultiplier(): number {
  switch (animationSpeed) {
    case 'fast': return 0.5
    case 'slow': return 2
    case 'normal':
    default: return 1
  }
}

// Screen shake effect
function triggerScreenShake() {
  if (!screenShakeEnabled) return
  const app = document.getElementById('app')
  if (app) {
    app.classList.add('shake')
    setTimeout(() => app.classList.remove('shake'), 300)
  }
}

// Calculate pixel position from board coordinates
function getBoardPixelPosition(col: string, row: number): { x: number; y: number } {
  const colIndex = columns.indexOf(col)
  const rowIndex = BOARD_SIZE - row
  return {
    x: LABEL_SIZE + colIndex * SQUARE_SIZE + SQUARE_SIZE / 2,
    y: rowIndex * SQUARE_SIZE + SQUARE_SIZE / 2
  }
}

// Trigger shooting visual effect
function triggerShootingEffect(shooterCol: string, shooterRow: number, targetCol: string, targetRow: number) {
  const shooterPos = getBoardPixelPosition(shooterCol, shooterRow)
  const targetPos = getBoardPixelPosition(targetCol, targetRow)

  // Create initial sparks at impact point
  const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = []
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5
    const speed = 2 + Math.random() * 4
    sparks.push({
      x: targetPos.x,
      y: targetPos.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0
    })
  }

  // Create smoke particles
  const smokeParticles: { x: number; y: number; size: number; opacity: number; vy: number }[] = []
  for (let i = 0; i < 5; i++) {
    smokeParticles.push({
      x: targetPos.x + (Math.random() - 0.5) * 15,
      y: targetPos.y + (Math.random() - 0.5) * 10,
      size: 8 + Math.random() * 12,
      opacity: 0.7,
      vy: -0.5 - Math.random() * 1.5
    })
  }

  // Create shell casing ejection
  shellCasings.push({
    x: shooterPos.x + 5,
    y: shooterPos.y - 5,
    vx: 3 + Math.random() * 2,
    vy: -4 - Math.random() * 2,
    rotation: 0,
    rotationSpeed: 15 + Math.random() * 10,
    life: 1.0
  })

  shootingEffect = {
    shooterCol,
    shooterRow,
    targetCol,
    targetRow,
    phase: 'muzzleFlash',
    progress: 0,
    bulletTrailPoints: [],
    sparks,
    smokeParticles
  }

  animateShootingEffect()
}

// Animate the shooting effect over time
function animateShootingEffect() {
  if (!shootingEffect) return

  const speedMult = getSpeedMultiplier()
  const PHASE_DURATIONS = {
    muzzleFlash: 80 * speedMult,
    bulletTravel: 150 * speedMult,
    impact: 100 * speedMult,
    smoke: 400 * speedMult
  }

  const shooterPos = getBoardPixelPosition(shootingEffect.shooterCol, shootingEffect.shooterRow)
  const targetPos = getBoardPixelPosition(shootingEffect.targetCol, shootingEffect.targetRow)

  let frameCount = 0
  const animationDuration = getAnimationDuration()

  function animate() {
    if (!shootingEffect) return

    frameCount++

    // Update based on current phase
    switch (shootingEffect.phase) {
      case 'muzzleFlash':
        shootingEffect.progress += 1 / (PHASE_DURATIONS.muzzleFlash / 16)
        if (shootingEffect.progress >= 1) {
          shootingEffect.phase = 'bulletTravel'
          shootingEffect.progress = 0
        }
        break

      case 'bulletTravel':
        shootingEffect.progress += 1 / (PHASE_DURATIONS.bulletTravel / 16)
        // Add bullet trail point
        const bulletX = shooterPos.x + (targetPos.x - shooterPos.x) * shootingEffect.progress
        const bulletY = shooterPos.y + (targetPos.y - shooterPos.y) * shootingEffect.progress
        shootingEffect.bulletTrailPoints.push({ x: bulletX, y: bulletY, opacity: 1 })
        // Fade old trail points
        shootingEffect.bulletTrailPoints.forEach(p => p.opacity *= 0.85)
        shootingEffect.bulletTrailPoints = shootingEffect.bulletTrailPoints.filter(p => p.opacity > 0.1)
        if (shootingEffect.progress >= 1) {
          shootingEffect.phase = 'impact'
          shootingEffect.progress = 0
          triggerScreenShake()
        }
        break

      case 'impact':
        shootingEffect.progress += 1 / (PHASE_DURATIONS.impact / 16)
        // Update sparks
        shootingEffect.sparks.forEach(spark => {
          spark.x += spark.vx
          spark.y += spark.vy
          spark.vy += 0.3 // gravity
          spark.life -= 0.05
        })
        shootingEffect.sparks = shootingEffect.sparks.filter(s => s.life > 0)
        if (shootingEffect.progress >= 1) {
          shootingEffect.phase = 'smoke'
          shootingEffect.progress = 0
        }
        break

      case 'smoke':
        shootingEffect.progress += 1 / (PHASE_DURATIONS.smoke / 16)
        // Update smoke particles
        shootingEffect.smokeParticles.forEach(p => {
          p.y += p.vy
          p.size *= 1.02
          p.opacity -= 0.02
        })
        shootingEffect.smokeParticles = shootingEffect.smokeParticles.filter(p => p.opacity > 0)
        if (shootingEffect.progress >= 1 || shootingEffect.smokeParticles.length === 0) {
          shootingEffect = null
          render()
          return
        }
        break
    }

    // Update shell casings
    shellCasings.forEach(casing => {
      casing.x += casing.vx
      casing.y += casing.vy
      casing.vy += 0.5 // gravity
      casing.rotation += casing.rotationSpeed
      casing.life -= 0.02
    })
    shellCasings = shellCasings.filter(c => c.life > 0)

    render()

    if (shootingEffect) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// UI size class
function getUISize(): string {
  return largeUIMode ? 'text-lg' : 'text-base'
}

function getButtonSize(): string {
  return largeUIMode ? 'py-4 px-6 text-xl' : 'py-2 px-4 text-base'
}

let measureCount = 0 // Track measures for structure

// Audio context for sound effects
let audioContext: AudioContext | null = null

async function initAudio(): Promise<void> {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  // Resume audio context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
}

// Ensure audio works on first user interaction
async function ensureAudioReady(): Promise<void> {
  await initAudio()
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume()
  }
}

// Music generation based on style
async function startMusic() {
  // Ensure audio context is ready
  await ensureAudioReady()
  if (!audioContext || musicInterval) return

  musicGainNode = audioContext.createGain()
  musicGainNode.gain.value = 0.12 * musicVolume * masterVolume
  musicGainNode.connect(audioContext.destination)

  measureCount = 0
  musicPhase = 0

  // Start the appropriate music style
  switch (musicStyle) {
    case 'ambient':
      startAmbientMusic()
      break
    case 'tension':
      startTensionMusic()
      break
    case 'electronic':
      startElectronicMusic()
      break
    case 'orchestral':
      startOrchestralMusic()
      break
    case 'retro':
      startRetroMusic()
      break
    case 'epic':
    default:
      startEpicMusic()
      break
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AMBIENT MUSIC - Calm, peaceful background
// ═══════════════════════════════════════════════════════════════════════════
function startAmbientMusic() {
  if (!audioContext || !musicGainNode) return

  // Peaceful C major / A minor scale
  const scale = {
    C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
  }

  // Rich evolving pad with multiple oscillators
  function playAmbientPad() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Beautiful chord progressions
    const chords = [
      [scale.C3, scale.E3, scale.G3, scale.B3],    // Cmaj7
      [scale.A2, scale.C3, scale.E3, scale.G3],    // Am7
      [scale.F2, scale.A2, scale.C3, scale.E3],    // Fmaj7
      [scale.G2, scale.B2, scale.D3, scale.F3],    // G7
      [scale.E2, scale.G2, scale.B2, scale.D3],    // Em7
      [scale.D2, scale.F2, scale.A2, scale.C3],    // Dm7
    ]
    const chord = chords[measureCount % chords.length]

    chord.forEach((freq, i) => {
      // Layer 1: Pure sine foundation
      const osc1 = audioContext!.createOscillator()
      const gain1 = audioContext!.createGain()
      osc1.type = 'sine'
      osc1.frequency.value = freq
      gain1.gain.setValueAtTime(0.001, now + i * 0.15)
      gain1.gain.linearRampToValueAtTime(0.03, now + 2.5)
      gain1.gain.linearRampToValueAtTime(0.025, now + 6)
      gain1.gain.linearRampToValueAtTime(0.001, now + 8)
      osc1.connect(gain1)
      gain1.connect(musicGainNode!)
      osc1.start(now + i * 0.15)
      osc1.stop(now + 8.5)

      // Layer 2: Octave shimmer
      const osc2 = audioContext!.createOscillator()
      const gain2 = audioContext!.createGain()
      const filter2 = audioContext!.createBiquadFilter()
      osc2.type = 'sine'
      osc2.frequency.value = freq * 2
      filter2.type = 'lowpass'
      filter2.frequency.value = 1000
      gain2.gain.setValueAtTime(0.001, now + i * 0.15 + 0.5)
      gain2.gain.linearRampToValueAtTime(0.015, now + 3)
      gain2.gain.linearRampToValueAtTime(0.001, now + 7.5)
      osc2.connect(filter2)
      filter2.connect(gain2)
      gain2.connect(musicGainNode!)
      osc2.start(now + i * 0.15 + 0.5)
      osc2.stop(now + 8)
    })
  }

  // Gentle harp-like arpeggios
  function playAmbientArpeggio() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const patterns = [
      [scale.C4, scale.E4, scale.G4, scale.C5, scale.G4, scale.E4],
      [scale.A3, scale.C4, scale.E4, scale.A4, scale.E4, scale.C4],
      [scale.F3, scale.A3, scale.C4, scale.F4, scale.C4, scale.A3],
      [scale.G3, scale.B3, scale.D4, scale.G4, scale.D4, scale.B3],
    ]
    const notes = patterns[measureCount % patterns.length]

    notes.forEach((freq, i) => {
      const osc = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.value = freq

      filter.type = 'lowpass'
      filter.frequency.value = 2000
      filter.Q.value = 1

      // Gentle pluck envelope
      gain.gain.setValueAtTime(0.001, now + i * 0.35)
      gain.gain.linearRampToValueAtTime(0.04, now + i * 0.35 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.35 + 1.2)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)
      osc.start(now + i * 0.35)
      osc.stop(now + i * 0.35 + 1.5)
    })
  }

  // Soft wind chimes
  function playWindChimes() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const chimeNotes = [scale.C5, scale.E5, scale.G5, scale.D5]
    const numChimes = 2 + Math.floor(Math.random() * 3)

    for (let i = 0; i < numChimes; i++) {
      const freq = chimeNotes[Math.floor(Math.random() * chimeNotes.length)]
      const startTime = now + Math.random() * 2

      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.02, startTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2)

      osc.connect(gain)
      gain.connect(musicGainNode)
      osc.start(startTime)
      osc.stop(startTime + 2.5)
    }
  }

  // Deep soft bass
  function playAmbientBass() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const bassNotes = [scale.C2, scale.A2, scale.F2, scale.G2]
    const freq = bassNotes[measureCount % bassNotes.length]

    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.value = freq

    filter.type = 'lowpass'
    filter.frequency.value = 100

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 1)
    gain.gain.setValueAtTime(0.06, now + 3)
    gain.gain.linearRampToValueAtTime(0.001, now + 4)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(musicGainNode)
    osc.start(now)
    osc.stop(now + 4.5)
  }

  // Start with pad and bass
  playAmbientPad()
  playAmbientBass()

  const measureDuration = 4000 // 4 seconds per measure

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }
    measureCount++

    // Pad every 2 measures
    if (measureCount % 2 === 0) {
      playAmbientPad()
    }

    // Arpeggios every 3 measures
    if (measureCount % 3 === 0) {
      playAmbientArpeggio()
    }

    // Bass every measure
    playAmbientBass()

    // Wind chimes occasionally
    if (measureCount % 4 === 2) {
      playWindChimes()
    }
  }, measureDuration)
}

// ═══════════════════════════════════════════════════════════════════════════
// TENSION MUSIC - Suspenseful, building, cinematic
// ═══════════════════════════════════════════════════════════════════════════
function startTensionMusic() {
  if (!audioContext || !musicGainNode) return

  // Diminished/tense scale for maximum suspense
  const scale = {
    C2: 65.41, Db2: 69.30, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, Gb2: 92.50, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
    C3: 130.81, Db3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Gb3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Gb4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25
  }

  // Deep ominous drone with evolving filter
  function playTensionDrone() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Layer 1: Sub bass drone
    const drone1 = audioContext.createOscillator()
    const droneGain1 = audioContext.createGain()
    const droneFilter1 = audioContext.createBiquadFilter()
    drone1.type = 'sawtooth'
    drone1.frequency.value = scale.C2
    droneFilter1.type = 'lowpass'
    droneFilter1.frequency.setValueAtTime(80, now)
    droneFilter1.frequency.linearRampToValueAtTime(150, now + 2)
    droneFilter1.frequency.linearRampToValueAtTime(60, now + 3.8)
    droneFilter1.Q.value = 2
    droneGain1.gain.setValueAtTime(0.001, now)
    droneGain1.gain.linearRampToValueAtTime(0.1, now + 0.8)
    droneGain1.gain.setValueAtTime(0.08, now + 3)
    droneGain1.gain.linearRampToValueAtTime(0.001, now + 4)
    drone1.connect(droneFilter1)
    droneFilter1.connect(droneGain1)
    droneGain1.connect(musicGainNode)
    drone1.start(now)
    drone1.stop(now + 4.2)

    // Layer 2: Slightly detuned for unease
    const drone2 = audioContext.createOscillator()
    const droneGain2 = audioContext.createGain()
    drone2.type = 'sine'
    drone2.frequency.value = scale.C2 * 1.01 // Slight detune for discomfort
    droneGain2.gain.setValueAtTime(0.001, now + 0.3)
    droneGain2.gain.linearRampToValueAtTime(0.04, now + 1)
    droneGain2.gain.linearRampToValueAtTime(0.001, now + 3.8)
    drone2.connect(droneGain2)
    droneGain2.connect(musicGainNode)
    drone2.start(now + 0.3)
    drone2.stop(now + 4)
  }

  // Heartbeat pulse - double beat like a real heart
  function playTensionPulse() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Double heartbeat pattern: lub-dub ... lub-dub
    const heartbeatTimes = [0, 0.15, 1.0, 1.15] // Two double-beats
    heartbeatTimes.forEach((offset, i) => {
      const pulse = audioContext!.createOscillator()
      const pulseGain = audioContext!.createGain()
      const isLub = i % 2 === 0 // 'lub' is slightly louder than 'dub'

      pulse.type = 'sine'
      pulse.frequency.setValueAtTime(isLub ? 50 : 40, now + offset)
      pulse.frequency.exponentialRampToValueAtTime(isLub ? 30 : 25, now + offset + 0.12)

      pulseGain.gain.setValueAtTime(isLub ? 0.25 : 0.15, now + offset)
      pulseGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2)

      pulse.connect(pulseGain)
      pulseGain.connect(musicGainNode!)
      pulse.start(now + offset)
      pulse.stop(now + offset + 0.25)
    })
  }

  // Clock tick-tock for building tension
  function playTickTock() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    for (let i = 0; i < 4; i++) {
      const tick = audioContext.createOscillator()
      const tickGain = audioContext.createGain()

      tick.type = 'sine'
      tick.frequency.value = i % 2 === 0 ? 1200 : 900 // Tick vs tock

      tickGain.gain.setValueAtTime(0.08, now + i * 0.5)
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.5 + 0.03)

      tick.connect(tickGain)
      tickGain.connect(musicGainNode)
      tick.start(now + i * 0.5)
      tick.stop(now + i * 0.5 + 0.05)
    }
  }

  // Rising tension tone - slow pitch rise
  function playRisingTone() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const rise = audioContext.createOscillator()
    const riseGain = audioContext.createGain()
    const riseFilter = audioContext.createBiquadFilter()

    rise.type = 'sawtooth'
    rise.frequency.setValueAtTime(scale.C3, now)
    rise.frequency.exponentialRampToValueAtTime(scale.C4, now + 3)

    riseFilter.type = 'lowpass'
    riseFilter.frequency.setValueAtTime(200, now)
    riseFilter.frequency.linearRampToValueAtTime(800, now + 2.5)
    riseFilter.Q.value = 3

    riseGain.gain.setValueAtTime(0.001, now)
    riseGain.gain.linearRampToValueAtTime(0.05, now + 1)
    riseGain.gain.linearRampToValueAtTime(0.08, now + 2.5)
    riseGain.gain.linearRampToValueAtTime(0.001, now + 3)

    rise.connect(riseFilter)
    riseFilter.connect(riseGain)
    riseGain.connect(musicGainNode)
    rise.start(now)
    rise.stop(now + 3.2)
  }

  // Dissonant stinger - cluster chord
  function playTensionStinger() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Dissonant cluster
    const notes = [scale.C3, scale.Db3, scale.D3, scale.Gb3, scale.Ab3]
    notes.forEach((freq, i) => {
      const osc = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.value = freq

      filter.type = 'lowpass'
      filter.frequency.value = 600

      gain.gain.setValueAtTime(0.001, now + i * 0.02)
      gain.gain.linearRampToValueAtTime(0.04, now + i * 0.02 + 0.05)
      gain.gain.linearRampToValueAtTime(0.001, now + 2)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)
      osc.start(now + i * 0.02)
      osc.stop(now + 2.2)
    })
  }

  // Scratchy string tremolo
  function playStringTremolo() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const stringOsc = audioContext.createOscillator()
    const stringGain = audioContext.createGain()
    const lfo = audioContext.createOscillator()
    const lfoGain = audioContext.createGain()

    stringOsc.type = 'sawtooth'
    stringOsc.frequency.value = scale.A3

    // LFO for tremolo effect
    lfo.type = 'sine'
    lfo.frequency.value = 8 // Fast tremolo
    lfoGain.gain.value = 0.015

    lfo.connect(lfoGain)
    lfoGain.connect(stringGain.gain)

    stringGain.gain.setValueAtTime(0.001, now)
    stringGain.gain.linearRampToValueAtTime(0.03, now + 0.3)
    stringGain.gain.setValueAtTime(0.03, now + 1.5)
    stringGain.gain.linearRampToValueAtTime(0.001, now + 2)

    stringOsc.connect(stringGain)
    stringGain.connect(musicGainNode)

    lfo.start(now)
    stringOsc.start(now)
    lfo.stop(now + 2.1)
    stringOsc.stop(now + 2.1)
  }

  // Start with drone and pulse
  playTensionDrone()
  playTensionPulse()
  playTickTock()

  const measureDuration = 2000

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }
    measureCount++

    // Heartbeat every measure
    playTensionPulse()

    // Tick-tock alternating
    if (measureCount % 2 === 0) {
      playTickTock()
    }

    // Drone every 2 measures
    if (measureCount % 2 === 0) {
      playTensionDrone()
    }

    // Rising tone for building tension
    if (measureCount % 4 === 2) {
      playRisingTone()
    }

    // String tremolo
    if (measureCount % 3 === 0) {
      playStringTremolo()
    }

    // Stinger at climax points
    if (measureCount % 8 === 7) {
      playTensionStinger()
    }
  }, measureDuration)
}

// ═══════════════════════════════════════════════════════════════════════════
// ELECTRONIC MUSIC - House/Techno with acid basslines
// ═══════════════════════════════════════════════════════════════════════════
function startElectronicMusic() {
  if (!audioContext || !musicGainNode) return

  // Extended electronic scale
  const scale = {
    A1: 55.00, C2: 65.41, D2: 73.42, E2: 82.41, G2: 98.00,
    A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00,
    A3: 220.00, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00,
    A4: 440.00, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
  }

  // Acid-style bass with filter wobble
  function playAcidBass() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const patterns = [
      [scale.A2, scale.A2, scale.C3, scale.D3, scale.A2, scale.E3, scale.D3, scale.C3],
      [scale.A2, scale.C3, scale.A2, scale.G2, scale.A2, scale.D3, scale.C3, scale.A2],
      [scale.A2, scale.A2, scale.A2, scale.G2, scale.E2, scale.G2, scale.A2, scale.C3],
    ]
    const pattern = patterns[measureCount % patterns.length]

    pattern.forEach((freq, i) => {
      const bass = audioContext!.createOscillator()
      const bassGain = audioContext!.createGain()
      const bassFilter = audioContext!.createBiquadFilter()

      bass.type = 'sawtooth'
      bass.frequency.value = freq

      // Acid wobble filter
      bassFilter.type = 'lowpass'
      bassFilter.Q.value = 15 // High resonance for acid sound
      bassFilter.frequency.setValueAtTime(2000, now + i * 0.125)
      bassFilter.frequency.exponentialRampToValueAtTime(300, now + i * 0.125 + 0.08)
      bassFilter.frequency.exponentialRampToValueAtTime(800, now + i * 0.125 + 0.12)

      bassGain.gain.setValueAtTime(0.12, now + i * 0.125)
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.125 + 0.12)

      bass.connect(bassFilter)
      bassFilter.connect(bassGain)
      bassGain.connect(musicGainNode!)
      bass.start(now + i * 0.125)
      bass.stop(now + i * 0.125 + 0.15)
    })
  }

  // Punchy 4-on-the-floor kick with click
  function playElectroKick() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    for (let i = 0; i < 4; i++) {
      // Sub kick
      const kick = audioContext.createOscillator()
      const kickGain = audioContext.createGain()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(150, now + i * 0.25)
      kick.frequency.exponentialRampToValueAtTime(35, now + i * 0.25 + 0.1)
      kickGain.gain.setValueAtTime(0.35, now + i * 0.25)
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.2)
      kick.connect(kickGain)
      kickGain.connect(musicGainNode)
      kick.start(now + i * 0.25)
      kick.stop(now + i * 0.25 + 0.25)

      // Click layer for punch
      const click = audioContext.createOscillator()
      const clickGain = audioContext.createGain()
      const clickFilter = audioContext.createBiquadFilter()
      click.type = 'triangle'
      click.frequency.value = 1500
      clickFilter.type = 'highpass'
      clickFilter.frequency.value = 800
      clickGain.gain.setValueAtTime(0.15, now + i * 0.25)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.02)
      click.connect(clickFilter)
      clickFilter.connect(clickGain)
      clickGain.connect(musicGainNode)
      click.start(now + i * 0.25)
      click.stop(now + i * 0.25 + 0.03)
    }
  }

  // Open and closed hi-hats
  function playElectroHiHat() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    for (let i = 0; i < 8; i++) {
      const isOpen = i === 2 || i === 6 // Open hats on off-beats
      const hat = audioContext.createBufferSource()
      const hatGain = audioContext.createGain()
      const hatFilter = audioContext.createBiquadFilter()

      hat.buffer = createNoiseBuffer(isOpen ? 0.15 : 0.03)
      hatFilter.type = 'highpass'
      hatFilter.frequency.value = isOpen ? 6000 : 9000

      hatGain.gain.setValueAtTime(isOpen ? 0.06 : 0.1, now + i * 0.125)
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.125 + (isOpen ? 0.12 : 0.03))

      hat.connect(hatFilter)
      hatFilter.connect(hatGain)
      hatGain.connect(musicGainNode)
      hat.start(now + i * 0.125)
      hat.stop(now + i * 0.125 + (isOpen ? 0.15 : 0.05))
    }
  }

  // Clap on 2 and 4
  function playElectroClap() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    ;[0.25, 0.75].forEach(offset => {
      // Multiple noise bursts for realistic clap
      for (let j = 0; j < 3; j++) {
        const clap = audioContext!.createBufferSource()
        const clapGain = audioContext!.createGain()
        const clapFilter = audioContext!.createBiquadFilter()

        clap.buffer = createNoiseBuffer(0.08)
        clapFilter.type = 'bandpass'
        clapFilter.frequency.value = 1500
        clapFilter.Q.value = 0.5

        clapGain.gain.setValueAtTime(0.15, now + offset + j * 0.01)
        clapGain.gain.exponentialRampToValueAtTime(0.001, now + offset + j * 0.01 + 0.06)

        clap.connect(clapFilter)
        clapFilter.connect(clapGain)
        clapGain.connect(musicGainNode!)
        clap.start(now + offset + j * 0.01)
        clap.stop(now + offset + j * 0.01 + 0.08)
      }
    })
  }

  // Synth stab chords
  function playElectroStab() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const chords = [
      [scale.A3, scale.C4, scale.E4],
      [scale.G3, scale.C4, scale.E4],
      [scale.A3, scale.D4, scale.E4],
    ]
    const chord = chords[measureCount % chords.length]

    const offsets = [0, 0.375, 0.5] // Rhythmic stab pattern

    offsets.forEach(offset => {
      chord.forEach(freq => {
        const stab = audioContext!.createOscillator()
        const stabGain = audioContext!.createGain()
        const stabFilter = audioContext!.createBiquadFilter()

        stab.type = 'sawtooth'
        stab.frequency.value = freq

        stabFilter.type = 'lowpass'
        stabFilter.frequency.setValueAtTime(3000, now + offset)
        stabFilter.frequency.exponentialRampToValueAtTime(500, now + offset + 0.1)

        stabGain.gain.setValueAtTime(0.03, now + offset)
        stabGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08)

        stab.connect(stabFilter)
        stabFilter.connect(stabGain)
        stabGain.connect(musicGainNode!)
        stab.start(now + offset)
        stab.stop(now + offset + 0.12)
      })
    })
  }

  // Arpeggiator lead
  function playArpeggio() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const arps = [
      [scale.A4, scale.E4, scale.C4, scale.E4, scale.A4, scale.C5, scale.A4, scale.E4],
      [scale.A4, scale.C5, scale.E5, scale.C5, scale.A4, scale.E4, scale.G4, scale.E4],
    ]
    const notes = arps[measureCount % arps.length]

    notes.forEach((freq, i) => {
      const arp = audioContext!.createOscillator()
      const arpGain = audioContext!.createGain()
      const arpFilter = audioContext!.createBiquadFilter()

      arp.type = 'square'
      arp.frequency.value = freq

      arpFilter.type = 'lowpass'
      arpFilter.frequency.value = 2500 + Math.sin(i * 0.5) * 1000

      arpGain.gain.setValueAtTime(0.001, now + i * 0.125)
      arpGain.gain.linearRampToValueAtTime(0.04, now + i * 0.125 + 0.01)
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.125 + 0.1)

      arp.connect(arpFilter)
      arpFilter.connect(arpGain)
      arpGain.connect(musicGainNode!)
      arp.start(now + i * 0.125)
      arp.stop(now + i * 0.125 + 0.12)
    })
  }

  // Riser for builds
  function playRiser() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const riser = audioContext.createOscillator()
    const riserGain = audioContext.createGain()
    const riserFilter = audioContext.createBiquadFilter()

    riser.type = 'sawtooth'
    riser.frequency.setValueAtTime(200, now)
    riser.frequency.exponentialRampToValueAtTime(2000, now + 2)

    riserFilter.type = 'lowpass'
    riserFilter.frequency.setValueAtTime(500, now)
    riserFilter.frequency.exponentialRampToValueAtTime(4000, now + 2)
    riserFilter.Q.value = 5

    riserGain.gain.setValueAtTime(0.001, now)
    riserGain.gain.linearRampToValueAtTime(0.08, now + 1.8)
    riserGain.gain.linearRampToValueAtTime(0.001, now + 2)

    riser.connect(riserFilter)
    riserFilter.connect(riserGain)
    riserGain.connect(musicGainNode)
    riser.start(now)
    riser.stop(now + 2.2)
  }

  // Start the groove
  playElectroKick()
  playAcidBass()
  playElectroHiHat()

  const measureDuration = 1000 // 120 BPM

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }
    measureCount++

    // Always kick
    playElectroKick()

    // Hi-hats every measure
    playElectroHiHat()

    // Acid bass every measure
    playAcidBass()

    // Claps on even measures
    if (measureCount % 2 === 0) {
      playElectroClap()
    }

    // Stabs every 2 measures
    if (measureCount % 2 === 1) {
      playElectroStab()
    }

    // Arpeggio every 4 measures
    if (measureCount % 4 === 0) {
      playArpeggio()
    }

    // Riser before drops
    if (measureCount % 8 === 6) {
      playRiser()
    }
  }, measureDuration)
}

// ═══════════════════════════════════════════════════════════════════════════
// ORCHESTRAL MUSIC - Classical melodic orchestra
// ═══════════════════════════════════════════════════════════════════════════
function startOrchestralMusic() {
  if (!audioContext || !musicGainNode) return

  // G major scale - bright and heroic
  const scale = {
    G2: 98.00, A2: 110.00, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, Fs3: 185.00, G3: 196.00,
    A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00,
    B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
  }

  // Violin melody
  function playViolinMelody() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const melodies = [
      [scale.G4, scale.A4, scale.B4, scale.D5, scale.B4, scale.A4, scale.G4, scale.Fs4],
      [scale.E4, scale.Fs4, scale.G4, scale.A4, scale.G4, scale.Fs4, scale.E4, scale.D4],
      [scale.D4, scale.E4, scale.Fs4, scale.G4, scale.A4, scale.B4, scale.A4, scale.G4],
      [scale.B4, scale.A4, scale.G4, scale.Fs4, scale.E4, scale.D4, scale.E4, scale.G4],
    ]
    const melody = melodies[measureCount % melodies.length]

    melody.forEach((freq, i) => {
      // Main violin
      const vln1 = audioContext!.createOscillator()
      const vln2 = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      vln1.type = 'sawtooth'
      vln1.frequency.value = freq
      vln2.type = 'sawtooth'
      vln2.frequency.value = freq * 1.002 // Slight detune for richness

      filter.type = 'lowpass'
      filter.frequency.value = 3000
      filter.Q.value = 1

      // Expressive envelope
      const startTime = now + i * 0.25
      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.03)
      gain.gain.setValueAtTime(0.04, startTime + 0.15)
      gain.gain.linearRampToValueAtTime(0.001, startTime + 0.23)

      vln1.connect(filter)
      vln2.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)
      vln1.start(startTime)
      vln2.start(startTime)
      vln1.stop(startTime + 0.25)
      vln2.stop(startTime + 0.25)
    })
  }

  // Cello bass line
  function playCello() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const bassNotes = [scale.G2, scale.D3, scale.E3, scale.C3]
    const note = bassNotes[measureCount % bassNotes.length]

    const cello = audioContext.createOscillator()
    const cello2 = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    cello.type = 'sawtooth'
    cello.frequency.value = note
    cello2.type = 'triangle'
    cello2.frequency.value = note

    filter.type = 'lowpass'
    filter.frequency.value = 800
    filter.Q.value = 0.5

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1)
    gain.gain.setValueAtTime(0.06, now + 1.5)
    gain.gain.linearRampToValueAtTime(0.001, now + 2)

    cello.connect(filter)
    cello2.connect(filter)
    filter.connect(gain)
    gain.connect(musicGainNode)
    cello.start(now)
    cello2.start(now)
    cello.stop(now + 2.1)
    cello2.stop(now + 2.1)
  }

  // French horn fanfare
  function playHornFanfare() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const fanfare = [scale.G3, scale.B3, scale.D4, scale.G4]

    fanfare.forEach((freq, i) => {
      const horn = audioContext!.createOscillator()
      const horn2 = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      horn.type = 'sine'
      horn.frequency.value = freq
      horn2.type = 'sine'
      horn2.frequency.value = freq * 2

      filter.type = 'lowpass'
      filter.frequency.value = 1200

      const startTime = now + i * 0.3
      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.05)
      gain.gain.setValueAtTime(0.05, startTime + 0.4)
      gain.gain.linearRampToValueAtTime(0.001, startTime + 0.5)

      horn.connect(filter)
      horn2.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)
      horn.start(startTime)
      horn2.start(startTime)
      horn.stop(startTime + 0.55)
      horn2.stop(startTime + 0.55)
    })
  }

  // Timpani roll
  function playTimpani() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    for (let i = 0; i < 8; i++) {
      const timp = audioContext.createOscillator()
      const gain = audioContext.createGain()

      timp.type = 'sine'
      timp.frequency.setValueAtTime(80, now + i * 0.08)
      timp.frequency.exponentialRampToValueAtTime(60, now + i * 0.08 + 0.1)

      gain.gain.setValueAtTime(0.15 + i * 0.02, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12)

      timp.connect(gain)
      gain.connect(musicGainNode)
      timp.start(now + i * 0.08)
      timp.stop(now + i * 0.08 + 0.15)
    }
  }

  // Harp glissando
  function playHarpGliss() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const notes = [scale.G3, scale.A3, scale.B3, scale.C4, scale.D4, scale.E4, scale.Fs4, scale.G4, scale.A4, scale.B4]

    notes.forEach((freq, i) => {
      const harp = audioContext!.createOscillator()
      const gain = audioContext!.createGain()

      harp.type = 'sine'
      harp.frequency.value = freq

      const startTime = now + i * 0.08
      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6)

      harp.connect(gain)
      gain.connect(musicGainNode!)
      harp.start(startTime)
      harp.stop(startTime + 0.7)
    })
  }

  // String chord sustain
  function playStringChord() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const chords = [
      [scale.G3, scale.B3, scale.D4, scale.G4],
      [scale.E3, scale.G3, scale.B3, scale.E4],
      [scale.C3, scale.E3, scale.G3, scale.C4],
      [scale.D3, scale.Fs3, scale.A3, scale.D4],
    ]
    const chord = chords[measureCount % chords.length]

    chord.forEach((freq, i) => {
      const str1 = audioContext!.createOscillator()
      const str2 = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      str1.type = 'sawtooth'
      str1.frequency.value = freq
      str2.type = 'sawtooth'
      str2.frequency.value = freq * 1.003

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(500, now)
      filter.frequency.linearRampToValueAtTime(1200, now + 1)
      filter.frequency.linearRampToValueAtTime(600, now + 3)

      gain.gain.setValueAtTime(0.001, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.03, now + i * 0.1 + 0.5)
      gain.gain.setValueAtTime(0.025, now + 3)
      gain.gain.linearRampToValueAtTime(0.001, now + 4)

      str1.connect(filter)
      str2.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)
      str1.start(now + i * 0.1)
      str2.start(now + i * 0.1)
      str1.stop(now + 4.2)
      str2.stop(now + 4.2)
    })
  }

  // Start with strings and cello
  playStringChord()
  playCello()

  const measureDuration = 2000

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }
    measureCount++

    // Violin melody every measure
    playViolinMelody()

    // Cello every measure
    playCello()

    // String chords every 2 measures
    if (measureCount % 2 === 0) {
      playStringChord()
    }

    // Horn fanfare every 4 measures
    if (measureCount % 4 === 3) {
      playHornFanfare()
    }

    // Timpani on climax
    if (measureCount % 8 === 7) {
      playTimpani()
    }

    // Harp glissando occasionally
    if (measureCount % 6 === 5) {
      playHarpGliss()
    }
  }, measureDuration)
}

// ═══════════════════════════════════════════════════════════════════════════
// RETRO 8-BIT MUSIC - Chiptune style
// ═══════════════════════════════════════════════════════════════════════════
function startRetroMusic() {
  if (!audioContext || !musicGainNode) return

  // C major pentatonic for classic game feel
  const scale = {
    C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00,
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00
  }

  // Square wave lead melody (classic chiptune)
  function playChipLead() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const melodies = [
      [scale.C4, scale.E4, scale.G4, scale.E4, scale.C4, scale.D4, scale.E4, scale.G4],
      [scale.A4, scale.G4, scale.E4, scale.D4, scale.C4, scale.E4, scale.G4, scale.A4],
      [scale.G4, scale.A4, scale.C5, scale.A4, scale.G4, scale.E4, scale.D4, scale.E4],
      [scale.E4, scale.G4, scale.A4, scale.G4, scale.E4, scale.D4, scale.C4, scale.D4],
    ]
    const melody = melodies[measureCount % melodies.length]

    melody.forEach((freq, i) => {
      const lead = audioContext!.createOscillator()
      const gain = audioContext!.createGain()

      lead.type = 'square'
      lead.frequency.value = freq

      // Sharp chip attack
      const startTime = now + i * 0.125
      gain.gain.setValueAtTime(0.08, startTime)
      gain.gain.setValueAtTime(0.06, startTime + 0.02)
      gain.gain.setValueAtTime(0.001, startTime + 0.12)

      lead.connect(gain)
      gain.connect(musicGainNode!)
      lead.start(startTime)
      lead.stop(startTime + 0.13)
    })
  }

  // Triangle wave bass (NES style)
  function playChipBass() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const bassPattern = [scale.C3, scale.C3, scale.G3, scale.G3, scale.A3, scale.A3, scale.G3, 0]

    bassPattern.forEach((freq, i) => {
      if (freq === 0) return

      const bass = audioContext!.createOscillator()
      const gain = audioContext!.createGain()

      bass.type = 'triangle'
      bass.frequency.value = freq

      const startTime = now + i * 0.125
      gain.gain.setValueAtTime(0.12, startTime)
      gain.gain.setValueAtTime(0.001, startTime + 0.12)

      bass.connect(gain)
      gain.connect(musicGainNode!)
      bass.start(startTime)
      bass.stop(startTime + 0.13)
    })
  }

  // Noise drum pattern
  function playChipDrums() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Kick on 1, 3, 5, 7 - snare on 2, 4, 6, 8
    for (let i = 0; i < 8; i++) {
      const isKick = i % 2 === 0
      const startTime = now + i * 0.125

      if (isKick) {
        // Chip kick - low square pulse
        const kick = audioContext.createOscillator()
        const kickGain = audioContext.createGain()
        kick.type = 'square'
        kick.frequency.setValueAtTime(150, startTime)
        kick.frequency.exponentialRampToValueAtTime(50, startTime + 0.05)
        kickGain.gain.setValueAtTime(0.15, startTime)
        kickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08)
        kick.connect(kickGain)
        kickGain.connect(musicGainNode)
        kick.start(startTime)
        kick.stop(startTime + 0.1)
      } else {
        // Chip snare - noise burst
        const snare = audioContext.createBufferSource()
        const snareGain = audioContext.createGain()
        const snareFilter = audioContext.createBiquadFilter()
        snare.buffer = createNoiseBuffer(0.06)
        snareFilter.type = 'highpass'
        snareFilter.frequency.value = 4000
        snareGain.gain.setValueAtTime(0.1, startTime)
        snareGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05)
        snare.connect(snareFilter)
        snareFilter.connect(snareGain)
        snareGain.connect(musicGainNode)
        snare.start(startTime)
        snare.stop(startTime + 0.07)
      }
    }
  }

  // Arpeggio effect (common in chip music)
  function playChipArp() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const arps = [
      [scale.C4, scale.E4, scale.G4],
      [scale.A3, scale.C4, scale.E4],
      [scale.G3, scale.C4, scale.E4],
      [scale.G3, scale.D4, scale.G4],
    ]
    const arpNotes = arps[measureCount % arps.length]

    // Fast arpeggio cycle
    for (let cycle = 0; cycle < 8; cycle++) {
      arpNotes.forEach((freq, i) => {
        const arp = audioContext!.createOscillator()
        const gain = audioContext!.createGain()

        arp.type = 'square'
        arp.frequency.value = freq

        const startTime = now + cycle * 0.125 + i * 0.04
        gain.gain.setValueAtTime(0.04, startTime)
        gain.gain.setValueAtTime(0.001, startTime + 0.035)

        arp.connect(gain)
        gain.connect(musicGainNode!)
        arp.start(startTime)
        arp.stop(startTime + 0.04)
      })
    }
  }

  // Power-up sound effect style
  function playPowerUp() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const notes = [scale.C4, scale.E4, scale.G4, scale.C5, scale.E5, scale.G5]

    notes.forEach((freq, i) => {
      const osc = audioContext!.createOscillator()
      const gain = audioContext!.createGain()

      osc.type = 'square'
      osc.frequency.value = freq

      const startTime = now + i * 0.08
      gain.gain.setValueAtTime(0.06, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)

      osc.connect(gain)
      gain.connect(musicGainNode!)
      osc.start(startTime)
      osc.stop(startTime + 0.18)
    })
  }

  // Pulse wave harmony (duty cycle variation feel)
  function playPulseHarmony() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const chords = [
      [scale.C4, scale.G4],
      [scale.A3, scale.E4],
      [scale.G3, scale.D4],
      [scale.G3, scale.E4],
    ]
    const chord = chords[measureCount % chords.length]

    chord.forEach((freq) => {
      const pulse = audioContext!.createOscillator()
      const gain = audioContext!.createGain()

      pulse.type = 'square'
      pulse.frequency.value = freq

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1)
      gain.gain.setValueAtTime(0.03, now + 0.8)
      gain.gain.linearRampToValueAtTime(0.001, now + 1)

      pulse.connect(gain)
      gain.connect(musicGainNode!)
      pulse.start(now)
      pulse.stop(now + 1.1)
    })
  }

  // Start the groove
  playChipDrums()
  playChipBass()

  const measureDuration = 1000 // Fast like classic games

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }
    measureCount++

    // Drums always
    playChipDrums()

    // Bass always
    playChipBass()

    // Lead melody every measure
    playChipLead()

    // Arpeggio every 2 measures
    if (measureCount % 2 === 0) {
      playChipArp()
    }

    // Harmony every 2 measures (offset)
    if (measureCount % 2 === 1) {
      playPulseHarmony()
    }

    // Power-up sound every 8 measures
    if (measureCount % 8 === 7) {
      playPowerUp()
    }
  }, measureDuration)
}

// ═══════════════════════════════════════════════════════════════════════════
// EPIC WAR MUSIC - Cinematic orchestral
// ═══════════════════════════════════════════════════════════════════════════
function startEpicMusic() {
  if (!audioContext || !musicGainNode) return

  // D minor scale frequencies for war/dark feel
  const scale = {
    D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, Bb2: 116.54, C3: 130.81,
    D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08, C4: 261.63,
    D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00
  }

  // ═══════════════════════════════════════════════════════════════
  // EPIC WAR DRUMS - Multiple layers
  // ═══════════════════════════════════════════════════════════════
  function playEpicDrums(pattern: number) {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime
    const beatTime = 0.5 // 120 BPM

    // Pattern variations for different intensities
    const patterns = [
      // Pattern 0: Basic march - BOOM - - BOOM BOOM
      [1, 0, 0, 1, 1, 0, 0, 0],
      // Pattern 1: Building - BOOM - BOOM - BOOM BOOM -
      [1, 0, 1, 0, 1, 1, 0, 0],
      // Pattern 2: Intense - BOOM BOOM - BOOM BOOM BOOM - BOOM
      [1, 1, 0, 1, 1, 1, 0, 1],
      // Pattern 3: Epic climax
      [1, 1, 1, 0, 1, 1, 1, 1]
    ]
    const currentPattern = patterns[pattern % patterns.length]

    currentPattern.forEach((hit, i) => {
      if (hit) {
        const time = now + (i * beatTime / 2)

        // Main taiko-style kick
        const kick = audioContext!.createOscillator()
        const kickGain = audioContext!.createGain()
        const kickFilter = audioContext!.createBiquadFilter()
        kick.type = 'sine'
        kick.frequency.setValueAtTime(100, time)
        kick.frequency.exponentialRampToValueAtTime(35, time + 0.2)
        kickFilter.type = 'lowpass'
        kickFilter.frequency.value = 150
        kickGain.gain.setValueAtTime(0.5, time)
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3)
        kick.connect(kickFilter)
        kickFilter.connect(kickGain)
        kickGain.connect(musicGainNode!)
        kick.start(time)
        kick.stop(time + 0.35)

        // Add body/resonance layer
        const body = audioContext!.createOscillator()
        const bodyGain = audioContext!.createGain()
        body.type = 'triangle'
        body.frequency.setValueAtTime(55, time)
        body.frequency.exponentialRampToValueAtTime(30, time + 0.25)
        bodyGain.gain.setValueAtTime(0.3, time)
        bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4)
        body.connect(bodyGain)
        bodyGain.connect(musicGainNode!)
        body.start(time)
        body.stop(time + 0.45)
      }
    })

    // Snare/rim hits on off-beats (pattern dependent)
    if (pattern >= 1) {
      [1, 3, 5, 7].forEach((i) => {
        if (Math.random() > 0.5) {
          const time = now + (i * beatTime / 2)
          const snare = audioContext!.createBufferSource()
          const snareGain = audioContext!.createGain()
          const snareFilter = audioContext!.createBiquadFilter()
          snare.buffer = createNoiseBuffer(0.1)
          snareFilter.type = 'highpass'
          snareFilter.frequency.value = 2000
          snareGain.gain.setValueAtTime(0.15, time)
          snareGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08)
          snare.connect(snareFilter)
          snareFilter.connect(snareGain)
          snareGain.connect(musicGainNode!)
          snare.start(time)
          snare.stop(time + 0.12)
        }
      })
    }

    // Tom fills on climax
    if (pattern >= 2 && measureCount % 4 === 3) {
      const tomFreqs = [180, 150, 120, 90]
      tomFreqs.forEach((freq, i) => {
        const time = now + 1.5 + (i * 0.12)
        const tom = audioContext!.createOscillator()
        const tomGain = audioContext!.createGain()
        tom.type = 'sine'
        tom.frequency.setValueAtTime(freq, time)
        tom.frequency.exponentialRampToValueAtTime(freq * 0.6, time + 0.15)
        tomGain.gain.setValueAtTime(0.25, time)
        tomGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2)
        tom.connect(tomGain)
        tomGain.connect(musicGainNode!)
        tom.start(time)
        tom.stop(time + 0.25)
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STRING PADS - Rich, evolving harmonies
  // ═══════════════════════════════════════════════════════════════
  function playStringPad(chordIndex: number) {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // D minor chord progressions
    const chords = [
      [scale.D3, scale.F3, scale.A3],           // Dm
      [scale.Bb2, scale.D3, scale.F3],          // Bb
      [scale.C3, scale.E3, scale.G3],           // C
      [scale.A2, scale.C3, scale.E3],           // Am
      [scale.G2, scale.Bb2, scale.D3],          // Gm
      [scale.D3, scale.F3, scale.A3, scale.D4], // Dm (octave)
    ]

    const chord = chords[chordIndex % chords.length]
    const duration = 4 // 4 seconds per chord

    chord.forEach((freq, i) => {
      // Main string voice
      const osc1 = audioContext!.createOscillator()
      const osc2 = audioContext!.createOscillator()
      const osc3 = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      // Slightly detuned oscillators for richness
      osc1.type = 'sawtooth'
      osc1.frequency.value = freq
      osc2.type = 'sawtooth'
      osc2.frequency.value = freq * 1.003 // Slight detune
      osc3.type = 'triangle'
      osc3.frequency.value = freq * 0.998 // Slight detune other way

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(400, now)
      filter.frequency.linearRampToValueAtTime(800, now + 1)
      filter.frequency.linearRampToValueAtTime(500, now + duration - 0.5)
      filter.Q.value = 1

      // Swell envelope
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.8)
      gain.gain.setValueAtTime(0.05, now + duration - 1)
      gain.gain.linearRampToValueAtTime(0.001, now + duration)

      osc1.connect(filter)
      osc2.connect(filter)
      osc3.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)

      osc1.start(now + i * 0.05) // Slight stagger for realism
      osc2.start(now + i * 0.05)
      osc3.start(now + i * 0.05)
      osc1.stop(now + duration + 0.5)
      osc2.stop(now + duration + 0.5)
      osc3.stop(now + duration + 0.5)
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // WAR HORNS - Deep, powerful horn sounds (no harmonica!)
  // ═══════════════════════════════════════════════════════════════
  function playWarHorn(type: 'short' | 'epic') {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const playHornNote = (freq: number, startTime: number, duration: number, volume: number) => {
      // French horn-like tone using sine waves with natural harmonics
      // NO square waves to avoid harmonica sound
      const fundamental = audioContext!.createOscillator()
      const second = audioContext!.createOscillator()
      const third = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      const filter = audioContext!.createBiquadFilter()

      // Use only sine waves for warm, round horn tone
      fundamental.type = 'sine'
      fundamental.frequency.value = freq
      second.type = 'sine'
      second.frequency.value = freq * 2 // Octave (quieter)
      third.type = 'sine'
      third.frequency.value = freq * 3 // 12th (very quiet, adds brightness)

      // Warm lowpass filter - keeps it from sounding nasal
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(500, startTime)
      filter.frequency.linearRampToValueAtTime(900, startTime + 0.08)
      filter.frequency.linearRampToValueAtTime(600, startTime + duration)
      filter.Q.value = 0.5

      // Horn-like envelope with slight attack
      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.06)
      gain.gain.setValueAtTime(volume * 0.9, startTime + duration * 0.5)
      gain.gain.linearRampToValueAtTime(0.001, startTime + duration)

      // Connect with different volumes for natural harmonic balance
      const fundGain = audioContext!.createGain()
      const secGain = audioContext!.createGain()
      const thirdGain = audioContext!.createGain()
      fundGain.gain.value = 1.0
      secGain.gain.value = 0.3
      thirdGain.gain.value = 0.1

      fundamental.connect(fundGain)
      second.connect(secGain)
      third.connect(thirdGain)
      fundGain.connect(filter)
      secGain.connect(filter)
      thirdGain.connect(filter)
      filter.connect(gain)
      gain.connect(musicGainNode!)

      fundamental.start(startTime)
      second.start(startTime)
      third.start(startTime)
      fundamental.stop(startTime + duration + 0.1)
      second.stop(startTime + duration + 0.1)
      third.stop(startTime + duration + 0.1)
    }

    if (type === 'short') {
      // Short war horn blast - lower notes for power
      playHornNote(scale.D3, now, 0.4, 0.15)
      playHornNote(scale.A2, now, 0.4, 0.12)
    } else {
      // Epic horn call - like a battle horn
      playHornNote(scale.D3, now, 0.5, 0.12)
      playHornNote(scale.A2, now, 0.5, 0.10)
      playHornNote(scale.D3, now + 0.5, 0.3, 0.14)
      playHornNote(scale.F3, now + 0.8, 0.7, 0.16)
      playHornNote(scale.D3, now + 0.8, 0.7, 0.12)
      playHornNote(scale.A2, now + 0.8, 0.7, 0.10)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // BASS LINE - Deep, powerful foundation
  // ═══════════════════════════════════════════════════════════════
  function playBassLine(noteIndex: number) {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    const bassNotes = [scale.D2, scale.Bb2, scale.C3, scale.A2, scale.G2, scale.D2]
    const freq = bassNotes[noteIndex % bassNotes.length]

    // Deep sub bass
    const sub = audioContext.createOscillator()
    const subGain = audioContext.createGain()
    sub.type = 'sine'
    sub.frequency.value = freq
    subGain.gain.setValueAtTime(0.001, now)
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.1)
    subGain.gain.setValueAtTime(0.15, now + 1.5)
    subGain.gain.linearRampToValueAtTime(0.001, now + 2)
    sub.connect(subGain)
    subGain.connect(musicGainNode)
    sub.start(now)
    sub.stop(now + 2.1)

    // Growly upper bass
    const upper = audioContext.createOscillator()
    const upperGain = audioContext.createGain()
    const upperFilter = audioContext.createBiquadFilter()
    upper.type = 'sawtooth'
    upper.frequency.value = freq * 2
    upperFilter.type = 'lowpass'
    upperFilter.frequency.value = 250
    upperGain.gain.setValueAtTime(0.001, now)
    upperGain.gain.linearRampToValueAtTime(0.08, now + 0.1)
    upperGain.gain.linearRampToValueAtTime(0.001, now + 1.8)
    upper.connect(upperFilter)
    upperFilter.connect(upperGain)
    upperGain.connect(musicGainNode)
    upper.start(now)
    upper.stop(now + 2)
  }

  // ═══════════════════════════════════════════════════════════════
  // ATMOSPHERIC ELEMENTS - Wind, tension
  // ═══════════════════════════════════════════════════════════════
  function playAtmosphere() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Wind/breath sound
    const wind = audioContext.createBufferSource()
    const windGain = audioContext.createGain()
    const windFilter = audioContext.createBiquadFilter()
    wind.buffer = createNoiseBuffer(6)
    windFilter.type = 'bandpass'
    windFilter.frequency.setValueAtTime(400, now)
    windFilter.frequency.linearRampToValueAtTime(800, now + 3)
    windFilter.frequency.linearRampToValueAtTime(300, now + 5.5)
    windFilter.Q.value = 2
    windGain.gain.setValueAtTime(0.001, now)
    windGain.gain.linearRampToValueAtTime(0.04, now + 1)
    windGain.gain.setValueAtTime(0.03, now + 4)
    windGain.gain.linearRampToValueAtTime(0.001, now + 5.8)
    wind.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(musicGainNode)
    wind.start(now)
    wind.stop(now + 6)
  }

  // ═══════════════════════════════════════════════════════════════
  // CINEMATIC HIT - Big impact moments
  // ═══════════════════════════════════════════════════════════════
  function playCinematicHit() {
    if (!audioContext || !musicEnabled || !musicGainNode) return
    const now = audioContext.currentTime

    // Sub boom
    const boom = audioContext.createOscillator()
    const boomGain = audioContext.createGain()
    boom.type = 'sine'
    boom.frequency.setValueAtTime(60, now)
    boom.frequency.exponentialRampToValueAtTime(20, now + 0.5)
    boomGain.gain.setValueAtTime(0.5, now)
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    boom.connect(boomGain)
    boomGain.connect(musicGainNode)
    boom.start(now)
    boom.stop(now + 0.9)

    // Crash layer
    const crash = audioContext.createBufferSource()
    const crashGain = audioContext.createGain()
    const crashFilter = audioContext.createBiquadFilter()
    crash.buffer = createNoiseBuffer(1.5)
    crashFilter.type = 'highpass'
    crashFilter.frequency.value = 1000
    crashGain.gain.setValueAtTime(0.25, now)
    crashGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    crash.connect(crashFilter)
    crashFilter.connect(crashGain)
    crashGain.connect(musicGainNode)
    crash.start(now)
    crash.stop(now + 1.5)

    // Brass accent
    playWarHorn('short')
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN MUSIC LOOP - Orchestrates everything
  // ═══════════════════════════════════════════════════════════════

  // Initial atmosphere
  playAtmosphere()
  playStringPad(0)
  playBassLine(0)

  const measureDuration = 2000 // 2 seconds per measure (120 BPM)

  musicInterval = window.setInterval(() => {
    if (!musicEnabled) {
      stopMusic()
      return
    }

    measureCount++

    // Determine intensity phase (cycles every 16 measures)
    const cyclePosition = measureCount % 16
    if (cyclePosition < 4) musicPhase = 0       // Calm/building
    else if (cyclePosition < 8) musicPhase = 1  // Medium intensity
    else if (cyclePosition < 12) musicPhase = 2 // High intensity
    else musicPhase = 3                          // Climax/release

    // Always play drums with increasing intensity
    playEpicDrums(musicPhase)

    // String pads every 2 measures
    if (measureCount % 2 === 0) {
      playStringPad(Math.floor(measureCount / 2) % 6)
    }

    // Bass line every measure
    playBassLine(measureCount % 6)

    // Brass fanfares at key moments
    if (cyclePosition === 7) {
      playWarHorn('short')
    }
    if (cyclePosition === 11) {
      playWarHorn('epic')
    }

    // Cinematic hit at climax
    if (cyclePosition === 15) {
      playCinematicHit()
    }

    // Atmosphere refresh every 8 measures
    if (measureCount % 8 === 0) {
      playAtmosphere()
    }

  }, measureDuration)
}

function stopMusic() {
  if (musicInterval) {
    clearInterval(musicInterval)
    musicInterval = null
  }
  measureCount = 0
  musicPhase = 0
}

// Create white noise buffer for explosion/gunshot sounds
function createNoiseBuffer(duration: number): AudioBuffer {
  const sampleRate = audioContext!.sampleRate
  const bufferSize = sampleRate * duration
  const buffer = audioContext!.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

type SoundType = 'move' | 'capture' | 'shoot' | 'explosion' | 'click' | 'win' | 'tick' |
  'walk' | 'engine' | 'train' | 'hack' | 'build' | 'boat' | 'helicopter' | 'plane' | 'rocket'

// Master gain node for SFX
let sfxGainNode: GainNode | null = null

function getSfxGain(): GainNode | null {
  if (!audioContext) return null
  if (!sfxGainNode) {
    sfxGainNode = audioContext.createGain()
    sfxGainNode.connect(audioContext.destination)
  }
  sfxGainNode.gain.value = sfxVolume * masterVolume
  return sfxGainNode
}

async function playSound(type: SoundType) {
  if (!soundEnabled) return

  // Ensure audio context is ready
  await ensureAudioReady()
  if (!audioContext) return

  const sfxOutput = getSfxGain()
  if (!sfxOutput) return
  const now = audioContext.currentTime

  switch (type) {
    case 'move':
    case 'walk': {
      // Soldier footsteps - march sound
      for (let i = 0; i < 3; i++) {
        const step = audioContext.createBufferSource()
        const stepFilter = audioContext.createBiquadFilter()
        const stepGain = audioContext.createGain()
        step.buffer = createNoiseBuffer(0.08)
        stepFilter.type = 'lowpass'
        stepFilter.frequency.value = 800
        stepGain.gain.setValueAtTime(0.15, now + i * 0.12)
        stepGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.08)
        step.connect(stepFilter)
        stepFilter.connect(stepGain)
        stepGain.connect(sfxOutput)
        step.start(now + i * 0.12)
        step.stop(now + i * 0.12 + 0.1)
      }
      break
    }

    case 'engine': {
      // Motor start + running - vroom vroom
      const engineOsc = audioContext.createOscillator()
      const engineOsc2 = audioContext.createOscillator()
      const engineGain = audioContext.createGain()
      const engineFilter = audioContext.createBiquadFilter()

      // Engine start - rising frequency
      engineOsc.type = 'sawtooth'
      engineOsc.frequency.setValueAtTime(40, now)
      engineOsc.frequency.exponentialRampToValueAtTime(80, now + 0.15)
      engineOsc.frequency.setValueAtTime(70, now + 0.2)
      engineOsc.frequency.exponentialRampToValueAtTime(90, now + 0.4)

      engineOsc2.type = 'square'
      engineOsc2.frequency.setValueAtTime(20, now)
      engineOsc2.frequency.exponentialRampToValueAtTime(40, now + 0.15)

      engineFilter.type = 'lowpass'
      engineFilter.frequency.value = 300

      engineGain.gain.setValueAtTime(0.001, now)
      engineGain.gain.exponentialRampToValueAtTime(0.25, now + 0.1)
      engineGain.gain.setValueAtTime(0.2, now + 0.25)
      engineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      engineOsc.connect(engineFilter)
      engineOsc2.connect(engineFilter)
      engineFilter.connect(engineGain)
      engineGain.connect(sfxOutput)

      engineOsc.start(now)
      engineOsc2.start(now)
      engineOsc.stop(now + 0.55)
      engineOsc2.stop(now + 0.55)
      break
    }

    case 'capture': {
      // Impact "thump" with crunch
      const osc = audioContext.createOscillator()
      const noise = audioContext.createBufferSource()
      const gainOsc = audioContext.createGain()
      const gainNoise = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15)
      gainOsc.gain.setValueAtTime(0.3, now)
      gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      noise.buffer = createNoiseBuffer(0.1)
      filter.type = 'bandpass'
      filter.frequency.value = 1000
      filter.Q.value = 1
      gainNoise.gain.setValueAtTime(0.15, now)
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gainOsc)
      gainOsc.connect(sfxOutput)
      noise.connect(filter)
      filter.connect(gainNoise)
      gainNoise.connect(sfxOutput)

      osc.start(now)
      noise.start(now)
      osc.stop(now + 0.25)
      noise.stop(now + 0.15)
      break
    }

    case 'shoot': {
      // Gunshot with shell casing
      const bang = audioContext.createBufferSource()
      const bangFilter = audioContext.createBiquadFilter()
      const bangGain = audioContext.createGain()
      const punch = audioContext.createOscillator()
      const punchGain = audioContext.createGain()

      bang.buffer = createNoiseBuffer(0.12)
      bangFilter.type = 'bandpass'
      bangFilter.frequency.setValueAtTime(3000, now)
      bangFilter.frequency.exponentialRampToValueAtTime(800, now + 0.05)
      bangFilter.Q.value = 2
      bangGain.gain.setValueAtTime(0.35, now)
      bangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      punch.type = 'sine'
      punch.frequency.setValueAtTime(200, now)
      punch.frequency.exponentialRampToValueAtTime(40, now + 0.1)
      punchGain.gain.setValueAtTime(0.3, now)
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      bang.connect(bangFilter)
      bangFilter.connect(bangGain)
      bangGain.connect(sfxOutput)
      punch.connect(punchGain)
      punchGain.connect(sfxOutput)

      bang.start(now)
      punch.start(now)
      bang.stop(now + 0.12)
      punch.stop(now + 0.15)

      // Shell casing
      const shellDelay = 0.18
      const eject = audioContext.createOscillator()
      const ejectGain = audioContext.createGain()
      eject.type = 'square'
      eject.frequency.setValueAtTime(1200, now + shellDelay)
      eject.frequency.exponentialRampToValueAtTime(400, now + shellDelay + 0.03)
      ejectGain.gain.setValueAtTime(0.2, now + shellDelay)
      ejectGain.gain.exponentialRampToValueAtTime(0.001, now + shellDelay + 0.05)
      eject.connect(ejectGain)
      ejectGain.connect(sfxOutput)
      eject.start(now + shellDelay)
      eject.stop(now + shellDelay + 0.06)

      const shell1 = audioContext.createOscillator()
      const shell1Gain = audioContext.createGain()
      shell1.type = 'triangle'
      shell1.frequency.setValueAtTime(2500, now + shellDelay + 0.08)
      shell1.frequency.exponentialRampToValueAtTime(800, now + shellDelay + 0.15)
      shell1Gain.gain.setValueAtTime(0.25, now + shellDelay + 0.08)
      shell1Gain.gain.exponentialRampToValueAtTime(0.001, now + shellDelay + 0.2)
      shell1.connect(shell1Gain)
      shell1Gain.connect(sfxOutput)
      shell1.start(now + shellDelay + 0.08)
      shell1.stop(now + shellDelay + 0.25)
      break
    }

    case 'explosion': {
      // Deep "PSJGOOP" explosion - heavy emphasis on the GOOP
      // Initial PSJ - sharp attack
      const attack = audioContext.createBufferSource()
      const attackFilter = audioContext.createBiquadFilter()
      const attackGain = audioContext.createGain()
      attack.buffer = createNoiseBuffer(0.1)
      attackFilter.type = 'highpass'
      attackFilter.frequency.value = 1500
      attackGain.gain.setValueAtTime(0.5, now)
      attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      attack.connect(attackFilter)
      attackFilter.connect(attackGain)
      attackGain.connect(sfxOutput)
      attack.start(now)
      attack.stop(now + 0.1)

      // GOOP - deep resonant boom
      const goop1 = audioContext.createOscillator()
      const goop2 = audioContext.createOscillator()
      const goopGain = audioContext.createGain()
      goop1.type = 'sine'
      goop1.frequency.setValueAtTime(60, now + 0.03)
      goop1.frequency.exponentialRampToValueAtTime(25, now + 0.6)
      goop2.type = 'sine'
      goop2.frequency.setValueAtTime(45, now + 0.03)
      goop2.frequency.exponentialRampToValueAtTime(18, now + 0.7)
      goopGain.gain.setValueAtTime(0.5, now + 0.03)
      goopGain.gain.setValueAtTime(0.6, now + 0.1)
      goopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
      goop1.connect(goopGain)
      goop2.connect(goopGain)
      goopGain.connect(sfxOutput)
      goop1.start(now + 0.03)
      goop2.start(now + 0.03)
      goop1.stop(now + 0.9)
      goop2.stop(now + 0.9)

      // Rumble debris
      const rumble = audioContext.createBufferSource()
      const rumbleFilter = audioContext.createBiquadFilter()
      const rumbleGain = audioContext.createGain()
      rumble.buffer = createNoiseBuffer(1)
      rumbleFilter.type = 'lowpass'
      rumbleFilter.frequency.setValueAtTime(400, now)
      rumbleFilter.frequency.exponentialRampToValueAtTime(80, now + 0.8)
      rumbleGain.gain.setValueAtTime(0.4, now + 0.05)
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1)
      rumble.connect(rumbleFilter)
      rumbleFilter.connect(rumbleGain)
      rumbleGain.connect(sfxOutput)
      rumble.start(now + 0.05)
      rumble.stop(now + 1.1)
      break
    }

    case 'rocket': {
      // Rocket launch and fly - "trggooprgorgorogrgo"
      // Launch whoosh
      const launch = audioContext.createBufferSource()
      const launchFilter = audioContext.createBiquadFilter()
      const launchGain = audioContext.createGain()
      launch.buffer = createNoiseBuffer(1.5)
      launchFilter.type = 'bandpass'
      launchFilter.frequency.setValueAtTime(200, now)
      launchFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.3)
      launchFilter.frequency.setValueAtTime(1500, now + 0.5)
      launchFilter.Q.value = 2
      launchGain.gain.setValueAtTime(0.001, now)
      launchGain.gain.exponentialRampToValueAtTime(0.4, now + 0.2)
      launchGain.gain.setValueAtTime(0.3, now + 0.8)
      launchGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)
      launch.connect(launchFilter)
      launchFilter.connect(launchGain)
      launchGain.connect(sfxOutput)
      launch.start(now)
      launch.stop(now + 1.5)

      // Rocket engine rumble - oscillating
      for (let i = 0; i < 8; i++) {
        const rumble = audioContext.createOscillator()
        const rumbleGain = audioContext.createGain()
        rumble.type = 'sawtooth'
        rumble.frequency.setValueAtTime(80 + i * 10, now + i * 0.12)
        rumble.frequency.setValueAtTime(60 + i * 5, now + i * 0.12 + 0.06)
        rumbleGain.gain.setValueAtTime(0.12, now + i * 0.12)
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1)
        rumble.connect(rumbleGain)
        rumbleGain.connect(sfxOutput)
        rumble.start(now + i * 0.12)
        rumble.stop(now + i * 0.12 + 0.12)
      }
      break
    }

    case 'train': {
      // Train sound - choo choo + wheels
      // Steam whistle
      const whistle = audioContext.createOscillator()
      const whistle2 = audioContext.createOscillator()
      const whistleGain = audioContext.createGain()
      whistle.type = 'sine'
      whistle.frequency.setValueAtTime(800, now)
      whistle.frequency.setValueAtTime(750, now + 0.3)
      whistle2.type = 'sine'
      whistle2.frequency.setValueAtTime(600, now)
      whistle2.frequency.setValueAtTime(570, now + 0.3)
      whistleGain.gain.setValueAtTime(0.001, now)
      whistleGain.gain.exponentialRampToValueAtTime(0.2, now + 0.05)
      whistleGain.gain.setValueAtTime(0.18, now + 0.4)
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      whistle.connect(whistleGain)
      whistle2.connect(whistleGain)
      whistleGain.connect(sfxOutput)
      whistle.start(now)
      whistle2.start(now)
      whistle.stop(now + 0.55)
      whistle2.stop(now + 0.55)

      // Chug chug wheels
      for (let i = 0; i < 4; i++) {
        const chug = audioContext.createBufferSource()
        const chugFilter = audioContext.createBiquadFilter()
        const chugGain = audioContext.createGain()
        chug.buffer = createNoiseBuffer(0.1)
        chugFilter.type = 'lowpass'
        chugFilter.frequency.value = 400
        chugGain.gain.setValueAtTime(0.2, now + 0.1 + i * 0.15)
        chugGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + i * 0.15 + 0.1)
        chug.connect(chugFilter)
        chugFilter.connect(chugGain)
        chugGain.connect(sfxOutput)
        chug.start(now + 0.1 + i * 0.15)
        chug.stop(now + 0.1 + i * 0.15 + 0.12)
      }
      break
    }

    case 'hack': {
      // Typing + send + hack/error beep
      // Rapid typing
      for (let i = 0; i < 8; i++) {
        const key = audioContext.createOscillator()
        const keyGain = audioContext.createGain()
        key.type = 'square'
        key.frequency.value = 1800 + Math.random() * 400
        keyGain.gain.setValueAtTime(0.06, now + i * 0.04)
        keyGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.02)
        key.connect(keyGain)
        keyGain.connect(sfxOutput)
        key.start(now + i * 0.04)
        key.stop(now + i * 0.04 + 0.03)
      }

      // Send beep
      const send = audioContext.createOscillator()
      const sendGain = audioContext.createGain()
      send.type = 'sine'
      send.frequency.setValueAtTime(1200, now + 0.35)
      send.frequency.setValueAtTime(1600, now + 0.4)
      sendGain.gain.setValueAtTime(0.15, now + 0.35)
      sendGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      send.connect(sendGain)
      sendGain.connect(sfxOutput)
      send.start(now + 0.35)
      send.stop(now + 0.55)

      // Error/hack confirmation sound
      const hack1 = audioContext.createOscillator()
      const hack2 = audioContext.createOscillator()
      const hackGain = audioContext.createGain()
      hack1.type = 'square'
      hack1.frequency.value = 440
      hack2.type = 'square'
      hack2.frequency.value = 880
      hackGain.gain.setValueAtTime(0.12, now + 0.55)
      hackGain.gain.setValueAtTime(0.001, now + 0.6)
      hackGain.gain.setValueAtTime(0.12, now + 0.65)
      hackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75)
      hack1.connect(hackGain)
      hack2.connect(hackGain)
      hackGain.connect(sfxOutput)
      hack1.start(now + 0.55)
      hack2.start(now + 0.55)
      hack1.stop(now + 0.8)
      hack2.stop(now + 0.8)
      break
    }

    case 'build': {
      // Construction sound - hammering + drilling
      // Hammer hits
      for (let i = 0; i < 3; i++) {
        const hammer = audioContext.createOscillator()
        const hammerNoise = audioContext.createBufferSource()
        const hammerGain = audioContext.createGain()
        const noiseGain = audioContext.createGain()

        hammer.type = 'sine'
        hammer.frequency.setValueAtTime(200, now + i * 0.18)
        hammer.frequency.exponentialRampToValueAtTime(100, now + i * 0.18 + 0.05)
        hammerGain.gain.setValueAtTime(0.25, now + i * 0.18)
        hammerGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.08)

        hammerNoise.buffer = createNoiseBuffer(0.05)
        noiseGain.gain.setValueAtTime(0.2, now + i * 0.18)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.05)

        hammer.connect(hammerGain)
        hammerGain.connect(sfxOutput)
        hammerNoise.connect(noiseGain)
        noiseGain.connect(sfxOutput)

        hammer.start(now + i * 0.18)
        hammerNoise.start(now + i * 0.18)
        hammer.stop(now + i * 0.18 + 0.1)
        hammerNoise.stop(now + i * 0.18 + 0.06)
      }

      // Completion ding
      const ding = audioContext.createOscillator()
      const dingGain = audioContext.createGain()
      ding.type = 'sine'
      ding.frequency.value = 1200
      dingGain.gain.setValueAtTime(0.15, now + 0.6)
      dingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      ding.connect(dingGain)
      dingGain.connect(sfxOutput)
      ding.start(now + 0.6)
      ding.stop(now + 0.95)
      break
    }

    case 'boat': {
      // Boat/submarine - water splash + motor
      // Water splash
      const splash = audioContext.createBufferSource()
      const splashFilter = audioContext.createBiquadFilter()
      const splashGain = audioContext.createGain()
      splash.buffer = createNoiseBuffer(0.4)
      splashFilter.type = 'bandpass'
      splashFilter.frequency.setValueAtTime(1000, now)
      splashFilter.frequency.exponentialRampToValueAtTime(300, now + 0.3)
      splashFilter.Q.value = 1
      splashGain.gain.setValueAtTime(0.25, now)
      splashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      splash.connect(splashFilter)
      splashFilter.connect(splashGain)
      splashGain.connect(sfxOutput)
      splash.start(now)
      splash.stop(now + 0.4)

      // Underwater motor hum
      const motor = audioContext.createOscillator()
      const motorGain = audioContext.createGain()
      const motorFilter = audioContext.createBiquadFilter()
      motor.type = 'sawtooth'
      motor.frequency.setValueAtTime(60, now + 0.1)
      motor.frequency.setValueAtTime(80, now + 0.3)
      motor.frequency.setValueAtTime(70, now + 0.5)
      motorFilter.type = 'lowpass'
      motorFilter.frequency.value = 200
      motorGain.gain.setValueAtTime(0.001, now + 0.1)
      motorGain.gain.exponentialRampToValueAtTime(0.2, now + 0.2)
      motorGain.gain.setValueAtTime(0.15, now + 0.5)
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      motor.connect(motorFilter)
      motorFilter.connect(motorGain)
      motorGain.connect(sfxOutput)
      motor.start(now + 0.1)
      motor.stop(now + 0.75)
      break
    }

    case 'helicopter': {
      // Helicopter rotor - thup thup thup
      for (let i = 0; i < 6; i++) {
        const blade = audioContext.createOscillator()
        const bladeGain = audioContext.createGain()
        const bladeFilter = audioContext.createBiquadFilter()

        blade.type = 'sawtooth'
        blade.frequency.setValueAtTime(80, now + i * 0.08)
        blade.frequency.exponentialRampToValueAtTime(40, now + i * 0.08 + 0.04)

        bladeFilter.type = 'lowpass'
        bladeFilter.frequency.value = 300

        bladeGain.gain.setValueAtTime(0.2, now + i * 0.08)
        bladeGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06)

        blade.connect(bladeFilter)
        bladeFilter.connect(bladeGain)
        bladeGain.connect(sfxOutput)

        blade.start(now + i * 0.08)
        blade.stop(now + i * 0.08 + 0.08)
      }

      // High whine
      const whine = audioContext.createOscillator()
      const whineGain = audioContext.createGain()
      whine.type = 'sine'
      whine.frequency.setValueAtTime(400, now)
      whine.frequency.setValueAtTime(500, now + 0.2)
      whine.frequency.setValueAtTime(450, now + 0.4)
      whineGain.gain.setValueAtTime(0.08, now)
      whineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      whine.connect(whineGain)
      whineGain.connect(sfxOutput)
      whine.start(now)
      whine.stop(now + 0.55)
      break
    }

    case 'plane': {
      // Fighter jet - whoosh + bomb drop
      // Jet engine whoosh
      const jet = audioContext.createBufferSource()
      const jetFilter = audioContext.createBiquadFilter()
      const jetGain = audioContext.createGain()
      jet.buffer = createNoiseBuffer(0.8)
      jetFilter.type = 'bandpass'
      jetFilter.frequency.setValueAtTime(500, now)
      jetFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.2)
      jetFilter.frequency.exponentialRampToValueAtTime(800, now + 0.6)
      jetFilter.Q.value = 2
      jetGain.gain.setValueAtTime(0.001, now)
      jetGain.gain.exponentialRampToValueAtTime(0.35, now + 0.15)
      jetGain.gain.setValueAtTime(0.3, now + 0.4)
      jetGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      jet.connect(jetFilter)
      jetFilter.connect(jetGain)
      jetGain.connect(sfxOutput)
      jet.start(now)
      jet.stop(now + 0.8)

      // Bomb whistle
      const bomb = audioContext.createOscillator()
      const bombGain = audioContext.createGain()
      bomb.type = 'sine'
      bomb.frequency.setValueAtTime(1500, now + 0.3)
      bomb.frequency.exponentialRampToValueAtTime(300, now + 0.7)
      bombGain.gain.setValueAtTime(0.001, now + 0.3)
      bombGain.gain.exponentialRampToValueAtTime(0.2, now + 0.4)
      bombGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      bomb.connect(bombGain)
      bombGain.connect(sfxOutput)
      bomb.start(now + 0.3)
      bomb.stop(now + 0.75)
      break
    }

    case 'click': {
      // Crisp tick sound - like a chess piece being placed
      const tick = audioContext.createOscillator()
      const tickGain = audioContext.createGain()
      const tickFilter = audioContext.createBiquadFilter()
      tick.type = 'square'
      tick.frequency.setValueAtTime(3000, now)
      tick.frequency.exponentialRampToValueAtTime(1500, now + 0.008)
      tickFilter.type = 'highpass'
      tickFilter.frequency.value = 1000
      tickGain.gain.setValueAtTime(0.12, now)
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)
      tick.connect(tickFilter)
      tickFilter.connect(tickGain)
      tickGain.connect(sfxOutput)
      tick.start(now)
      tick.stop(now + 0.02)

      // Small resonance for body
      const body = audioContext.createOscillator()
      const bodyGain = audioContext.createGain()
      body.type = 'sine'
      body.frequency.setValueAtTime(800, now)
      body.frequency.exponentialRampToValueAtTime(400, now + 0.02)
      bodyGain.gain.setValueAtTime(0.06, now)
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      body.connect(bodyGain)
      bodyGain.connect(sfxOutput)
      body.start(now)
      body.stop(now + 0.03)
      break
    }

    case 'win': {
      // Victory fanfare
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = audioContext!.createOscillator()
        const osc2 = audioContext!.createOscillator()
        const gain = audioContext!.createGain()
        osc.type = 'triangle'
        osc.frequency.value = freq
        osc2.type = 'sine'
        osc2.frequency.value = freq * 2
        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02)
        gain.gain.setValueAtTime(0.1, startTime + duration * 0.7)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
        osc.connect(gain)
        osc2.connect(gain)
        gain.connect(audioContext!.destination)
        osc.start(startTime)
        osc2.start(startTime)
        osc.stop(startTime + duration)
        osc2.stop(startTime + duration)
      }
      playNote(523, now, 0.15)
      playNote(659, now + 0.1, 0.15)
      playNote(784, now + 0.2, 0.15)
      playNote(1047, now + 0.3, 0.4)
      playNote(523, now + 0.35, 0.5)
      playNote(659, now + 0.35, 0.5)
      playNote(784, now + 0.35, 0.5)
      break
    }

    case 'tick': {
      // Clock tick
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()
      osc.type = 'square'
      osc.frequency.setValueAtTime(2500, now)
      osc.frequency.setValueAtTime(1500, now + 0.01)
      filter.type = 'bandpass'
      filter.frequency.value = 2000
      filter.Q.value = 5
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(sfxOutput)
      osc.start(now)
      osc.stop(now + 0.03)
      break
    }
  }
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Start screen
    startTitle: 'War Chess',
    startButton: 'Start Game',
    startVsPlayer: 'vs Player',
    startVsBot: 'vs Bot',
    botDifficultyLabel: 'Bot Difficulty',
    botEasy: 'Easy',
    botMedium: 'Medium',
    botHard: 'Hard',
    botThinking: 'Bot is thinking...',
    settingsButton: 'Settings',
    backButton: 'Back',
    languageLabel: 'Language',
    // Timer settings
    timerLabel: 'Chess Clock',
    timerOff: 'Off',
    timerOn: 'On',
    timerMinutesLabel: 'Minutes per player',
    timeUp: 'Time is up!',
    timeUpPenalty: '{team} ran out of time! (-10 points)',
    // Audio settings
    soundLabel: 'Sound Effects',
    musicLabel: 'Music',
    masterVolumeLabel: 'Master Volume',
    musicVolumeLabel: 'Music Volume',
    sfxVolumeLabel: 'Effects Volume',
    musicStyleLabel: 'Music Style',
    styleEpic: 'Epic War',
    styleAmbient: 'Calm',
    styleTension: 'Suspense',
    styleElectronic: 'Electronic',
    styleOrchestral: 'Orchestral',
    styleRetro: '8-Bit Retro',
    on: 'On',
    off: 'Off',
    // Visual settings
    visualSettingsTitle: 'Visual',
    boardThemeLabel: 'Board Theme',
    themeClassic: 'Classic',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeWood: 'Wood',
    animationSpeedLabel: 'Animation Speed',
    speedFast: 'Fast',
    speedNormal: 'Normal',
    speedSlow: 'Slow',
    screenShakeLabel: 'Screen Shake',
    showCoordinatesLabel: 'Show Coordinates',
    // Accessibility settings
    accessibilityTitle: 'Accessibility',
    colorBlindLabel: 'Colorblind Mode',
    highContrastLabel: 'High Contrast',
    largeUILabel: 'Large UI',
    // Fullscreen
    fullscreenLabel: 'Fullscreen',
    // Game
    yellowTurn: "YELLOW's turn",
    greenTurn: "GREEN's turn",
    resetButton: 'Reset',
    moveButton: 'Move',
    shootButton: 'Shoot',
    exitButton: 'Exit',
    launchHelicopter: 'Launch Helicopter',
    // Messages
    noTargetsInRange: 'No targets in range!',
    selectTarget: 'Select target to shoot',
    mustLeaveTrench: 'Soldier MUST leave the trench! Click a valid destination.',
    enteredTrench: 'Entered the trench!',
    enteredTrenchTurn: 'Entered the trench! (Turn {0}/3)',
    leftTrench: 'Left the trench!',
    enteredTunnel: 'Entered the tunnel!',
    exitedTunnel: 'Exited the tunnel!',
    soldierTrapped: 'Soldier trapped in trench - eliminated!',
    helicopterLaunched: 'Helicopter launched!',
    helicopterLanded: 'Helicopter landed on carrier!',
    selectHelipad: 'Select helipad to land helicopter',
    noHelipads: 'No available helipads to land on!',
    cannotMoveThere: 'You cannot move there!',
    cannotShootThere: 'You cannot shoot there!',
    noTargetToShoot: 'No target to shoot!',
    teamPieceBlocking: 'There is already a piece of your team there!',
    notYourTurn: "It's not your turn!",
    pieceFrozen: 'This piece is frozen!',
    rocketNotReady: 'Rocket not ready yet!',
    rocketUsed: 'This rocket has already been used!',
    selectRocketTarget: 'Select target for rocket (3x3 explosion area)',
    rocketLaunching: 'Rocket launching...',
    rocketExploded: 'Rocket exploded!',
    selectHackTarget: 'Select enemy piece to hack',
    noHackTargets: 'No targets to hack',
    selectBombTarget: 'Select enemy piece to bomb',
    noBombTargets: 'No targets in range',
    // Hack errors
    cannotHackWater: 'Cannot hack into water!',
    cannotHackOccupied: 'Cannot hack - square occupied!',
    cannotHackEdge: 'Cannot hack - edge of board!',
    hackerCooldown: 'Hacker on cooldown!',
    hackerNotReady: 'Hacker not ready yet!',
    // Fighter
    fighterIncoming: 'Fighter incoming...',
    droppingBomb: 'Dropping bomb!',
    targetDestroyed: 'Target destroyed!',
    // Builder
    builderChooseAction: 'Builder: choose action',
    builderWaitCooldown: 'Builder: move or wait for cooldown',
    selectWhereToMove: 'Select where to move',
    cannotBuildBarricade: 'Cannot build barricade now',
    selectPlaceBarricade: 'Select where to place barricade',
    cannotBuildArtillery: 'Cannot build artillery now',
    selectPlaceArtillery: 'Select where to place artillery',
    cannotBuildSpike: 'Cannot build spike now',
    selectPlaceSpike: 'Select where to place spike',
    // Artillery
    artilleryNoTargets: 'Artillery has no valid targets!',
    clickToFireArtillery: 'Click to fire artillery (random target)',
    // Barricade
    barricadeInfo: 'Barricade: blocks movement and shots',
    // Other
    noValidMoves: 'No valid moves',
    charging: 'Charging...',
    gameOverPoints: 'wins by points!',
    gameOverBuilder: 'wins by capturing the Builder!',
    // Confirm dialogs
    confirmReset: 'Are you sure you want to reset the game?',
    confirmYes: 'Yes',
    confirmNo: 'No',
    confirmEnterTunnel: 'Enter the tunnel?',
    confirmExitTunnel: 'Exit the tunnel?',
    // Score
    score: 'Score',
    moves: 'Moves',
    captured: 'Captured',
    // Team names
    yellowTeam: 'Yellow',
    greenTeam: 'Green',
    yellowTurns: 'Yellow turns',
    greenTurns: 'Green turns',
  },
  nl: {
    startTitle: 'Oorlog Schaak',
    startButton: 'Start Spel',
    startVsPlayer: 'vs Speler',
    startVsBot: 'vs Bot',
    botDifficultyLabel: 'Bot Moeilijkheid',
    botEasy: 'Makkelijk',
    botMedium: 'Gemiddeld',
    botHard: 'Moeilijk',
    botThinking: 'Bot is aan het denken...',
    settingsButton: 'Instellingen',
    backButton: 'Terug',
    languageLabel: 'Taal',
    timerLabel: 'Schaakklok',
    timerOff: 'Uit',
    timerOn: 'Aan',
    timerMinutesLabel: 'Minuten per speler',
    timeUp: 'Tijd is op!',
    timeUpPenalty: '{team} heeft geen tijd meer! (-10 punten)',
    soundLabel: 'Geluidseffecten',
    musicLabel: 'Muziek',
    masterVolumeLabel: 'Hoofdvolume',
    musicVolumeLabel: 'Muziekvolume',
    sfxVolumeLabel: 'Effectenvolume',
    musicStyleLabel: 'Muziekstijl',
    styleEpic: 'Episch',
    styleAmbient: 'Rustig',
    styleTension: 'Spanning',
    styleElectronic: 'Elektronisch',
    styleOrchestral: 'Orkest',
    styleRetro: '8-Bit Retro',
    on: 'Aan',
    off: 'Uit',
    visualSettingsTitle: 'Visueel',
    boardThemeLabel: 'Bordthema',
    themeClassic: 'Klassiek',
    themeDark: 'Donker',
    themeLight: 'Licht',
    themeWood: 'Hout',
    animationSpeedLabel: 'Animatiesnelheid',
    speedFast: 'Snel',
    speedNormal: 'Normaal',
    speedSlow: 'Langzaam',
    screenShakeLabel: 'Scherm Schudden',
    showCoordinatesLabel: 'Coördinaten Tonen',
    accessibilityTitle: 'Toegankelijkheid',
    colorBlindLabel: 'Kleurenblind Modus',
    highContrastLabel: 'Hoog Contrast',
    largeUILabel: 'Grote UI',
    fullscreenLabel: 'Volledig Scherm',
    yellowTurn: 'GEEL aan zet',
    greenTurn: 'GROEN aan zet',
    resetButton: 'Reset',
    moveButton: 'Bewegen',
    shootButton: 'Schieten',
    exitButton: 'Uitgang',
    launchHelicopter: 'Lanceer Helicopter',
    noTargetsInRange: 'Geen doelen in bereik!',
    selectTarget: 'Selecteer doel om te schieten',
    mustLeaveTrench: 'Soldaat MOET de loopgraaf verlaten! Klik op een geldige bestemming.',
    enteredTrench: 'Loopgraaf betreden!',
    enteredTrenchTurn: 'Loopgraaf betreden! (Beurt {0}/3)',
    leftTrench: 'Loopgraaf verlaten!',
    enteredTunnel: 'Tunnel betreden!',
    exitedTunnel: 'Tunnel verlaten!',
    soldierTrapped: 'Soldaat vast in loopgraaf - uitgeschakeld!',
    helicopterLaunched: 'Helicopter gelanceerd!',
    helicopterLanded: 'Helicopter geland op carrier!',
    selectHelipad: 'Selecteer helipad om te landen',
    noHelipads: 'Geen beschikbare helipads om te landen!',
    cannotMoveThere: 'Je kunt daar niet heen!',
    cannotShootThere: 'Je kunt daar niet schieten!',
    noTargetToShoot: 'Geen doel om te schieten!',
    teamPieceBlocking: 'Er staat al een stuk van jouw team!',
    notYourTurn: 'Het is niet jouw beurt!',
    pieceFrozen: 'Dit stuk is bevroren!',
    rocketNotReady: 'Raket nog niet klaar!',
    rocketUsed: 'Deze raket is al gebruikt!',
    selectRocketTarget: 'Selecteer doel voor raket (3x3 explosie)',
    rocketLaunching: 'Raket lanceren...',
    rocketExploded: 'Raket ontploft!',
    selectHackTarget: 'Selecteer vijandelijk stuk om te hacken',
    noHackTargets: 'Geen doelen om te hacken',
    selectBombTarget: 'Selecteer vijandelijk stuk om te bombarderen',
    noBombTargets: 'Geen doelen in bereik',
    cannotHackWater: 'Kan niet in water hacken!',
    cannotHackOccupied: 'Kan niet hacken - veld bezet!',
    cannotHackEdge: 'Kan niet hacken - rand van bord!',
    hackerCooldown: 'Hacker aan het opladen!',
    hackerNotReady: 'Hacker nog niet klaar!',
    fighterIncoming: 'Gevechtsvliegtuig nadert...',
    droppingBomb: 'Bom laten vallen!',
    targetDestroyed: 'Doel vernietigd!',
    builderChooseAction: 'Bouwer: kies actie',
    builderWaitCooldown: 'Bouwer: bewegen of wachten',
    selectWhereToMove: 'Selecteer waar te bewegen',
    cannotBuildBarricade: 'Kan nu geen barricade bouwen',
    selectPlaceBarricade: 'Selecteer plek voor barricade',
    cannotBuildArtillery: 'Kan nu geen artillerie bouwen',
    selectPlaceArtillery: 'Selecteer plek voor artillerie',
    cannotBuildSpike: 'Kan nu geen spike bouwen',
    selectPlaceSpike: 'Selecteer plek voor spike',
    artilleryNoTargets: 'Artillerie heeft geen doelen!',
    clickToFireArtillery: 'Klik om artillerie te vuren',
    barricadeInfo: 'Barricade: blokkeert beweging en schoten',
    noValidMoves: 'Geen geldige zetten',
    charging: 'Opladen...',
    gameOverPoints: 'wint op punten!',
    gameOverBuilder: 'wint door de Bouwer te vangen!',
    confirmReset: 'Weet je zeker dat je het spel wilt resetten?',
    confirmYes: 'Ja',
    confirmNo: 'Nee',
    confirmEnterTunnel: 'Tunnel betreden?',
    confirmExitTunnel: 'Tunnel verlaten?',
    score: 'Score',
    moves: 'Zetten',
    captured: 'Gevangen',
    yellowTeam: 'Geel',
    greenTeam: 'Groen',
    yellowTurns: 'Gele beurten',
    greenTurns: 'Groene beurten',
  },
  de: {
    startTitle: 'Kriegsschach',
    startButton: 'Spiel Starten',
    startVsPlayer: 'vs Spieler',
    startVsBot: 'vs Bot',
    botDifficultyLabel: 'Bot Schwierigkeit',
    botEasy: 'Einfach',
    botMedium: 'Mittel',
    botHard: 'Schwer',
    botThinking: 'Bot denkt nach...',
    settingsButton: 'Einstellungen',
    backButton: 'Zurück',
    languageLabel: 'Sprache',
    timerLabel: 'Schachuhr',
    timerOff: 'Aus',
    timerOn: 'An',
    timerMinutesLabel: 'Minuten pro Spieler',
    timeUp: 'Zeit ist um!',
    timeUpPenalty: '{team} hat keine Zeit mehr! (-10 Punkte)',
    soundLabel: 'Soundeffekte',
    musicLabel: 'Musik',
    masterVolumeLabel: 'Gesamtlautstärke',
    musicVolumeLabel: 'Musiklautstärke',
    sfxVolumeLabel: 'Effektlautstärke',
    musicStyleLabel: 'Musikstil',
    styleEpic: 'Episch',
    styleAmbient: 'Ruhig',
    styleTension: 'Spannung',
    styleElectronic: 'Elektronisch',
    styleOrchestral: 'Orchester',
    styleRetro: '8-Bit Retro',
    on: 'An',
    off: 'Aus',
    visualSettingsTitle: 'Visuell',
    boardThemeLabel: 'Spielbrettthema',
    themeClassic: 'Klassisch',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    themeWood: 'Holz',
    animationSpeedLabel: 'Animationsgeschwindigkeit',
    speedFast: 'Schnell',
    speedNormal: 'Normal',
    speedSlow: 'Langsam',
    screenShakeLabel: 'Bildschirmschütteln',
    showCoordinatesLabel: 'Koordinaten anzeigen',
    accessibilityTitle: 'Barrierefreiheit',
    colorBlindLabel: 'Farbenblindmodus',
    highContrastLabel: 'Hoher Kontrast',
    largeUILabel: 'Große UI',
    fullscreenLabel: 'Vollbild',
    yellowTurn: 'GELB ist dran',
    greenTurn: 'GRÜN ist dran',
    resetButton: 'Zurücksetzen',
    moveButton: 'Bewegen',
    shootButton: 'Schießen',
    exitButton: 'Ausgang',
    launchHelicopter: 'Hubschrauber starten',
    noTargetsInRange: 'Keine Ziele in Reichweite!',
    selectTarget: 'Ziel zum Schießen auswählen',
    mustLeaveTrench: 'Soldat MUSS den Graben verlassen! Klicke auf ein gültiges Ziel.',
    enteredTrench: 'Graben betreten!',
    enteredTrenchTurn: 'Graben betreten! (Zug {0}/3)',
    leftTrench: 'Graben verlassen!',
    enteredTunnel: 'Tunnel betreten!',
    exitedTunnel: 'Tunnel verlassen!',
    soldierTrapped: 'Soldat im Graben gefangen - eliminiert!',
    helicopterLaunched: 'Hubschrauber gestartet!',
    helicopterLanded: 'Hubschrauber auf Träger gelandet!',
    selectHelipad: 'Hubschrauberlandeplatz auswählen',
    noHelipads: 'Keine verfügbaren Landeplätze!',
    cannotMoveThere: 'Du kannst dich nicht dorthin bewegen!',
    cannotShootThere: 'Du kannst dort nicht schießen!',
    noTargetToShoot: 'Kein Ziel zum Schießen!',
    teamPieceBlocking: 'Dort steht bereits eine Figur deines Teams!',
    notYourTurn: 'Du bist nicht dran!',
    pieceFrozen: 'Diese Figur ist eingefroren!',
    rocketNotReady: 'Rakete noch nicht bereit!',
    rocketUsed: 'Diese Rakete wurde bereits benutzt!',
    selectRocketTarget: 'Ziel für Rakete auswählen (3x3 Explosion)',
    rocketLaunching: 'Rakete startet...',
    rocketExploded: 'Rakete explodiert!',
    selectHackTarget: 'Feindliche Figur zum Hacken auswählen',
    noHackTargets: 'Keine Ziele zum Hacken',
    selectBombTarget: 'Feindliche Figur zum Bombardieren auswählen',
    noBombTargets: 'Keine Ziele in Reichweite',
    cannotHackWater: 'Kann nicht ins Wasser hacken!',
    cannotHackOccupied: 'Kann nicht hacken - Feld besetzt!',
    cannotHackEdge: 'Kann nicht hacken - Rand des Spielfelds!',
    hackerCooldown: 'Hacker lädt auf!',
    hackerNotReady: 'Hacker noch nicht bereit!',
    fighterIncoming: 'Kampfjet im Anflug...',
    droppingBomb: 'Bombe abwerfen!',
    targetDestroyed: 'Ziel zerstört!',
    builderChooseAction: 'Bauer: Aktion wählen',
    builderWaitCooldown: 'Bauer: bewegen oder warten',
    selectWhereToMove: 'Wähle wohin bewegen',
    cannotBuildBarricade: 'Kann jetzt keine Barrikade bauen',
    selectPlaceBarricade: 'Wähle Platz für Barrikade',
    cannotBuildArtillery: 'Kann jetzt keine Artillerie bauen',
    selectPlaceArtillery: 'Wähle Platz für Artillerie',
    cannotBuildSpike: 'Kann jetzt keine Spikes bauen',
    selectPlaceSpike: 'Wähle Platz für Spikes',
    artilleryNoTargets: 'Artillerie hat keine Ziele!',
    clickToFireArtillery: 'Klicken um Artillerie zu feuern',
    barricadeInfo: 'Barrikade: blockiert Bewegung und Schüsse',
    noValidMoves: 'Keine gültigen Züge',
    charging: 'Aufladen...',
    gameOverPoints: 'gewinnt nach Punkten!',
    gameOverBuilder: 'gewinnt durch Eroberung des Bauers!',
    confirmReset: 'Möchtest du das Spiel wirklich zurücksetzen?',
    confirmYes: 'Ja',
    confirmNo: 'Nein',
    confirmEnterTunnel: 'Tunnel betreten?',
    confirmExitTunnel: 'Tunnel verlassen?',
    score: 'Punktzahl',
    moves: 'Züge',
    captured: 'Erobert',
    yellowTeam: 'Gelb',
    greenTeam: 'Grün',
    yellowTurns: 'Gelbe Züge',
    greenTurns: 'Grüne Züge',
  },
  fr: {
    startTitle: 'Échecs de Guerre',
    startButton: 'Commencer',
    startVsPlayer: 'vs Joueur',
    startVsBot: 'vs Bot',
    botDifficultyLabel: 'Difficulté Bot',
    botEasy: 'Facile',
    botMedium: 'Moyen',
    botHard: 'Difficile',
    botThinking: 'Le bot réfléchit...',
    settingsButton: 'Paramètres',
    backButton: 'Retour',
    languageLabel: 'Langue',
    timerLabel: 'Pendule d\'échecs',
    timerOff: 'Désactivé',
    timerOn: 'Activé',
    timerMinutesLabel: 'Minutes par joueur',
    timeUp: 'Temps écoulé!',
    timeUpPenalty: '{team} n\'a plus de temps! (-10 points)',
    soundLabel: 'Effets sonores',
    musicLabel: 'Musique',
    masterVolumeLabel: 'Volume principal',
    musicVolumeLabel: 'Volume musique',
    sfxVolumeLabel: 'Volume effets',
    musicStyleLabel: 'Style musique',
    styleEpic: 'Épique',
    styleAmbient: 'Calme',
    styleTension: 'Suspense',
    styleElectronic: 'Électronique',
    styleOrchestral: 'Orchestral',
    styleRetro: '8-Bit Rétro',
    on: 'Activé',
    off: 'Désactivé',
    visualSettingsTitle: 'Visuel',
    boardThemeLabel: 'Thème du plateau',
    themeClassic: 'Classique',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    themeWood: 'Bois',
    animationSpeedLabel: 'Vitesse animation',
    speedFast: 'Rapide',
    speedNormal: 'Normal',
    speedSlow: 'Lent',
    screenShakeLabel: 'Secousse écran',
    showCoordinatesLabel: 'Afficher coordonnées',
    accessibilityTitle: 'Accessibilité',
    colorBlindLabel: 'Mode daltonien',
    highContrastLabel: 'Contraste élevé',
    largeUILabel: 'Grande interface',
    fullscreenLabel: 'Plein écran',
    yellowTurn: 'Tour de JAUNE',
    greenTurn: 'Tour de VERT',
    resetButton: 'Réinitialiser',
    moveButton: 'Déplacer',
    shootButton: 'Tirer',
    exitButton: 'Sortie',
    launchHelicopter: 'Lancer Hélicoptère',
    noTargetsInRange: 'Pas de cibles à portée!',
    selectTarget: 'Sélectionnez une cible',
    mustLeaveTrench: 'Le soldat DOIT quitter la tranchée! Cliquez sur une destination.',
    enteredTrench: 'Tranchée entrée!',
    enteredTrenchTurn: 'Tranchée entrée! (Tour {0}/3)',
    leftTrench: 'Tranchée quittée!',
    enteredTunnel: 'Tunnel entré!',
    exitedTunnel: 'Tunnel quitté!',
    soldierTrapped: 'Soldat piégé dans la tranchée - éliminé!',
    helicopterLaunched: 'Hélicoptère lancé!',
    helicopterLanded: 'Hélicoptère atterri sur le porte-avions!',
    selectHelipad: 'Sélectionnez un héliport',
    noHelipads: 'Pas d\'héliports disponibles!',
    cannotMoveThere: 'Vous ne pouvez pas aller là!',
    cannotShootThere: 'Vous ne pouvez pas tirer là!',
    noTargetToShoot: 'Pas de cible à tirer!',
    teamPieceBlocking: 'Il y a déjà une pièce de votre équipe!',
    notYourTurn: 'Ce n\'est pas votre tour!',
    pieceFrozen: 'Cette pièce est gelée!',
    rocketNotReady: 'Fusée pas encore prête!',
    rocketUsed: 'Cette fusée a déjà été utilisée!',
    selectRocketTarget: 'Sélectionnez la cible (explosion 3x3)',
    rocketLaunching: 'Fusée en lancement...',
    rocketExploded: 'Fusée explosée!',
    selectHackTarget: 'Sélectionnez une pièce ennemie à pirater',
    noHackTargets: 'Pas de cibles à pirater',
    selectBombTarget: 'Sélectionnez une pièce ennemie à bombarder',
    noBombTargets: 'Pas de cibles à portée',
    cannotHackWater: 'Impossible de pirater dans l\'eau!',
    cannotHackOccupied: 'Impossible de pirater - case occupée!',
    cannotHackEdge: 'Impossible de pirater - bord du plateau!',
    hackerCooldown: 'Pirate en recharge!',
    hackerNotReady: 'Pirate pas encore prêt!',
    fighterIncoming: 'Chasseur en approche...',
    droppingBomb: 'Largage de bombe!',
    targetDestroyed: 'Cible détruite!',
    builderChooseAction: 'Constructeur: choisir action',
    builderWaitCooldown: 'Constructeur: déplacer ou attendre',
    selectWhereToMove: 'Sélectionnez où déplacer',
    cannotBuildBarricade: 'Impossible de construire maintenant',
    selectPlaceBarricade: 'Sélectionnez où placer barricade',
    cannotBuildArtillery: 'Impossible de construire artillerie',
    selectPlaceArtillery: 'Sélectionnez où placer artillerie',
    cannotBuildSpike: 'Impossible de construire spike',
    selectPlaceSpike: 'Sélectionnez où placer spike',
    artilleryNoTargets: 'L\'artillerie n\'a pas de cibles!',
    clickToFireArtillery: 'Cliquez pour tirer artillerie',
    barricadeInfo: 'Barricade: bloque mouvement et tirs',
    noValidMoves: 'Pas de mouvements valides',
    charging: 'Chargement...',
    gameOverPoints: 'gagne aux points!',
    gameOverBuilder: 'gagne en capturant le Constructeur!',
    confirmReset: 'Voulez-vous vraiment réinitialiser?',
    confirmYes: 'Oui',
    confirmNo: 'Non',
    confirmEnterTunnel: 'Entrer dans le tunnel?',
    confirmExitTunnel: 'Quitter le tunnel?',
    score: 'Score',
    moves: 'Coups',
    captured: 'Capturé',
    yellowTeam: 'Jaune',
    greenTeam: 'Vert',
    yellowTurns: 'Tours jaunes',
    greenTurns: 'Tours verts',
  },
  es: {
    startTitle: 'Ajedrez de Guerra',
    startButton: 'Iniciar Juego',
    startVsPlayer: 'vs Jugador',
    startVsBot: 'vs Bot',
    botDifficultyLabel: 'Dificultad Bot',
    botEasy: 'Fácil',
    botMedium: 'Medio',
    botHard: 'Difícil',
    botThinking: 'El bot está pensando...',
    settingsButton: 'Configuración',
    backButton: 'Volver',
    languageLabel: 'Idioma',
    timerLabel: 'Reloj de ajedrez',
    timerOff: 'Apagado',
    timerOn: 'Encendido',
    timerMinutesLabel: 'Minutos por jugador',
    timeUp: '¡Se acabó el tiempo!',
    timeUpPenalty: '¡{team} se quedó sin tiempo! (-10 puntos)',
    soundLabel: 'Efectos de sonido',
    musicLabel: 'Música',
    masterVolumeLabel: 'Volumen principal',
    musicVolumeLabel: 'Volumen música',
    sfxVolumeLabel: 'Volumen efectos',
    musicStyleLabel: 'Estilo música',
    styleEpic: 'Épico',
    styleAmbient: 'Tranquilo',
    styleTension: 'Suspenso',
    styleElectronic: 'Electrónico',
    styleOrchestral: 'Orquestal',
    styleRetro: '8-Bit Retro',
    on: 'Encendido',
    off: 'Apagado',
    visualSettingsTitle: 'Visual',
    boardThemeLabel: 'Tema del tablero',
    themeClassic: 'Clásico',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    themeWood: 'Madera',
    animationSpeedLabel: 'Velocidad animación',
    speedFast: 'Rápido',
    speedNormal: 'Normal',
    speedSlow: 'Lento',
    screenShakeLabel: 'Vibración pantalla',
    showCoordinatesLabel: 'Mostrar coordenadas',
    accessibilityTitle: 'Accesibilidad',
    colorBlindLabel: 'Modo daltónico',
    highContrastLabel: 'Alto contraste',
    largeUILabel: 'UI grande',
    fullscreenLabel: 'Pantalla completa',
    yellowTurn: 'Turno de AMARILLO',
    greenTurn: 'Turno de VERDE',
    resetButton: 'Reiniciar',
    moveButton: 'Mover',
    shootButton: 'Disparar',
    exitButton: 'Salida',
    launchHelicopter: 'Lanzar Helicóptero',
    noTargetsInRange: '¡No hay objetivos en rango!',
    selectTarget: 'Selecciona un objetivo',
    mustLeaveTrench: '¡El soldado DEBE salir de la trinchera! Haz clic en un destino.',
    enteredTrench: '¡Trinchera entrada!',
    enteredTrenchTurn: '¡Trinchera entrada! (Turno {0}/3)',
    leftTrench: '¡Trinchera abandonada!',
    enteredTunnel: '¡Túnel entrado!',
    exitedTunnel: '¡Túnel salido!',
    soldierTrapped: '¡Soldado atrapado en trinchera - eliminado!',
    helicopterLaunched: '¡Helicóptero lanzado!',
    helicopterLanded: '¡Helicóptero aterrizó en el portaaviones!',
    selectHelipad: 'Selecciona un helipuerto',
    noHelipads: '¡No hay helipuertos disponibles!',
    cannotMoveThere: '¡No puedes ir ahí!',
    cannotShootThere: '¡No puedes disparar ahí!',
    noTargetToShoot: '¡No hay objetivo para disparar!',
    teamPieceBlocking: '¡Ya hay una pieza de tu equipo ahí!',
    notYourTurn: '¡No es tu turno!',
    pieceFrozen: '¡Esta pieza está congelada!',
    rocketNotReady: '¡Cohete no está listo!',
    rocketUsed: '¡Este cohete ya fue usado!',
    selectRocketTarget: 'Selecciona objetivo (explosión 3x3)',
    rocketLaunching: 'Cohete lanzando...',
    rocketExploded: '¡Cohete explotó!',
    selectHackTarget: 'Selecciona pieza enemiga para hackear',
    noHackTargets: 'No hay objetivos para hackear',
    selectBombTarget: 'Selecciona pieza enemiga para bombardear',
    noBombTargets: 'No hay objetivos en rango',
    cannotHackWater: '¡No se puede hackear al agua!',
    cannotHackOccupied: '¡No se puede hackear - casilla ocupada!',
    cannotHackEdge: '¡No se puede hackear - borde del tablero!',
    hackerCooldown: '¡Hacker recargando!',
    hackerNotReady: '¡Hacker no está listo!',
    fighterIncoming: 'Caza en camino...',
    droppingBomb: '¡Lanzando bomba!',
    targetDestroyed: '¡Objetivo destruido!',
    builderChooseAction: 'Constructor: elegir acción',
    builderWaitCooldown: 'Constructor: mover o esperar',
    selectWhereToMove: 'Selecciona dónde mover',
    cannotBuildBarricade: 'No se puede construir barricada ahora',
    selectPlaceBarricade: 'Selecciona dónde colocar barricada',
    cannotBuildArtillery: 'No se puede construir artillería ahora',
    selectPlaceArtillery: 'Selecciona dónde colocar artillería',
    cannotBuildSpike: 'No se puede construir spike ahora',
    selectPlaceSpike: 'Selecciona dónde colocar spike',
    artilleryNoTargets: '¡La artillería no tiene objetivos!',
    clickToFireArtillery: 'Haz clic para disparar artillería',
    barricadeInfo: 'Barricada: bloquea movimiento y disparos',
    noValidMoves: 'No hay movimientos válidos',
    charging: 'Cargando...',
    gameOverPoints: '¡gana por puntos!',
    gameOverBuilder: '¡gana capturando al Constructor!',
    confirmReset: '¿Seguro que quieres reiniciar?',
    confirmYes: 'Sí',
    confirmNo: 'No',
    confirmEnterTunnel: '¿Entrar al túnel?',
    confirmExitTunnel: '¿Salir del túnel?',
    score: 'Puntuación',
    moves: 'Movimientos',
    captured: 'Capturado',
    yellowTeam: 'Amarillo',
    greenTeam: 'Verde',
    yellowTurns: 'Turnos amarillos',
    greenTurns: 'Turnos verdes',
  }
}

const languageNames: Record<Language, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español'
}

function t(key: string): string {
  return translations[currentLanguage][key] || translations['en'][key] || key
}

const BOARD_SIZE = 11
const SQUARE_SIZE = 50
const LABEL_SIZE = 30

const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

type Team = 'yellow' | 'green'
type PieceType = 'train' | 'soldier' | 'tank' | 'ship' | 'carrier' | 'helicopter' | 'rocket' | 'machinegun' | 'suv' | 'hacker' | 'sub' | 'fighter' | 'builder' | 'barricade' | 'artillery' | 'spike'

interface Piece {
  type: PieceType
  team: Team
  col: string
  row: number
  points: number
  // Soldier specific
  inTrench?: boolean
  trenchEnteredOnTurn?: number  // The team's turn number when entered trench
  inTunnel?: boolean
  // Carrier specific
  hp?: number  // Aircraft carrier has 2 HP
  hasHelicopter?: boolean  // Whether helicopter is on the carrier
  // Helicopter specific
  onCarrier?: Piece  // Reference to carrier the helicopter is on
  // Rocket specific
  used?: boolean  // Rocket can only be used once
  // Hacker specific
  cooldownTurns?: number  // Number of turns until hacker can be used again
  // Frozen by hacker
  frozenTurns?: number  // Number of turns this piece is frozen
  // Builder specific
  barricadesBuilt?: number  // Total barricades built (max 5)
  artilleryBuilt?: number  // Total artillery built (max 2)
  spikesBuilt?: number  // Total spikes built (max 3)
  barricadeCooldown?: number  // Turns until can build barricade again
  artilleryCooldown?: number  // Turns until can build artillery again
  spikeCooldown?: number  // Turns until can build spike again
  // Spike specific
  turnsRemaining?: number  // Turns until spike disappears
}

// Action mode for soldiers
type ActionMode = 'move' | 'shoot' | null
let actionMode: ActionMode = null

interface Move {
  from: string
  to: string
  piece?: string
  team?: Team
  captured?: string
  capturedPoints?: number
}

function getTeamScore(team: Team): number {
  const capturePoints = capturedPieces
    .filter(p => p.team !== team)
    .reduce((sum, p) => sum + p.points, 0)
  const penalty = team === 'yellow' ? yellowPenalty : greenPenalty
  return capturePoints - penalty
}

let moveLog: Move[] = []
let capturedPieces: Piece[] = []

// Game state
type GameState = 'start' | 'playing' | 'confirmReset' | 'confirmTunnel' | 'confirmTunnelExit' | 'gameOver'
let gameState: GameState = 'start'
let winner: Team | null = null
let winReason: 'points' | 'builder' | null = null

// Max turns per team before point-based win
const MAX_TURNS_PER_TEAM = 80

// Track team turn numbers for trench mechanics
let yellowTurnCount = 0
let greenTurnCount = 0

// Selected piece and valid moves
let selectedPiece: Piece | null = null
let validMoves: { col: string; row: number; canCapture: boolean }[] = []
let shootTargets: { col: string; row: number }[] = []
let message: string | null = null
let currentTurn: Team = 'yellow' // Yellow starts
let showSoldierActions = false

// Pending tunnel entry/exit
let pendingTunnelMove: { col: string; row: number } | null = null
let pendingTunnelExit: Piece | null = null

// Forced trench exit
let forcedTrenchSoldier: Piece | null = null

// Animation state
let explosionAt: { col: string; row: number } | null = null
let lastMovedPiece: Piece | null = null
let bulletAnimation: {
  fromCol: string
  fromRow: number
  toCol: string
  toRow: number
  progress: number
} | null = null

// Enhanced shooting visual effects
let shootingEffect: {
  shooterCol: string
  shooterRow: number
  targetCol: string
  targetRow: number
  phase: 'muzzleFlash' | 'bulletTravel' | 'impact' | 'smoke' | 'done'
  progress: number // 0-1 within each phase
  bulletTrailPoints: { x: number; y: number; opacity: number }[]
  sparks: { x: number; y: number; vx: number; vy: number; life: number }[]
  smokeParticles: { x: number; y: number; size: number; opacity: number; vy: number }[]
} | null = null

// Shell casing ejection effect
let shellCasings: {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  life: number
}[] = []

let trainHitAnimation: {
  train: Piece
  targetCol: string
  targetRow: number
  phase: 'moving' | 'impact' | 'done'
} | null = null
let aimingPiece: Piece | null = null
let moveAnimation: {
  piece: Piece
  fromCol: string
  fromRow: number
  toCol: string
  toRow: number
  progress: number
} | null = null

// Rocket state
let rocketTargetArea: { col: string; row: number }[] = []
let rocketAnimation: {
  rocket: Piece
  targetCol: string
  targetRow: number
  phase: 'launching' | 'flying' | 'exploding'
  progress: number
} | null = null

let fighterAnimation: {
  fighter: Piece
  startCol: string
  startRow: number
  targetCol: string
  targetRow: number
  landingCol: string
  landingRow: number
  target: Piece
  phase: 'flyToTarget' | 'bombing' | 'flyToLanding'
  progress: number
} | null = null

const ROCKET_READY_TURN = 45  // Rocket can be used after this many team turns
const HACKER_READY_TURN = 10  // Hacker can be used after this many team turns
const HACKER_COOLDOWN_TURNS = 15  // 15 turns cooldown
const FIGHTER_READY_TURN = 10  // Fighter can be used after this many team turns
const FIGHTER_COOLDOWN_TURNS = 7  // 7 turns cooldown
const FIGHTER_BOMB_RANGE = 4  // Can bomb targets up to 4 squares away
const FIGHTER_LANDING_RANGE = 3  // Can land 0-3 squares from target

// Builder constants
const BUILDER_READY_TURN = 3  // Builder can build barricades after this many team turns
const ARTILLERY_READY_TURN = 10  // Builder can build artillery after this many team turns
const BARRICADE_COOLDOWN = 5  // Turns between barricade builds
const ARTILLERY_COOLDOWN = 10  // Turns between artillery builds
const BUILDER_RANGE = 5  // Range for placing barricades/artillery
const MAX_BARRICADES_TOTAL = 5  // Max barricades a builder can ever build
const MAX_BARRICADES_ON_BOARD = 3  // Max barricades on board per team
const MAX_ARTILLERY_TOTAL = 5  // Max artillery a builder can ever build
const MAX_ARTILLERY_ON_BOARD = 1  // Max artillery on board per team
const ARTILLERY_TARGET_RANGE = 4  // Artillery target must be within this range
const SPIKE_READY_TURN = 10  // Builder can build spikes after this many team turns
const SPIKE_COOLDOWN = 15  // Turns between spike builds
const SPIKE_DURATION = 5  // Turns until spike disappears
const MAX_SPIKES_TOTAL = 3  // Max spikes a builder can ever build
const MAX_SPIKES_ON_BOARD = 1  // Max spikes on board per team

// Hacker state
let hackTargets: Piece[] = []  // Enemy pieces that can be hacked
let selectedHackTarget: Piece | null = null  // Currently selected piece to hack
let showHackActions = false  // Show hack action buttons

// Fighter state
let bombTargets: Piece[] = []  // Enemy pieces that can be bombed
let selectedBombTarget: Piece | null = null  // Currently selected piece to bomb
let landingSpots: { col: string; row: number }[] = []  // Valid landing spots after bombing

// Builder state
let showBuilderActions = false  // Show builder action buttons
let showCarrierActions = false  // Show carrier action buttons (launch helicopter)
let builderPlacementMode: 'barricade' | 'artillery' | 'spike' | null = null

// Carrier helicopter launch state
let helicopterLaunchMode = false
let helicopterLaunchSpots: { col: string; row: number }[] = []
let builderPlacementSpots: { col: string; row: number }[] = []  // Valid spots for placement

// Check if rockets are ready for a specific team
function isRocketReadyForTeam(team: Team): boolean {
  const teamTurns = team === 'yellow' ? yellowTurnCount : greenTurnCount
  return teamTurns >= ROCKET_READY_TURN
}

// Check if hacker is ready for a specific team
function isHackerReadyForTeam(team: Team): boolean {
  const teamTurns = team === 'yellow' ? yellowTurnCount : greenTurnCount
  return teamTurns >= HACKER_READY_TURN
}

// Decrement frozen turns for pieces of the given team at start of their turn
function decrementFrozenTurns(team: Team) {
  for (const piece of pieces) {
    if (piece.team === team && piece.frozenTurns && piece.frozenTurns > 0) {
      piece.frozenTurns -= 1
      if (piece.frozenTurns === 0) {
        piece.frozenTurns = undefined
      }
    }
  }
}

// Decrement cooldowns for hacker and fighter of a team
function decrementCooldowns(team: Team) {
  for (const piece of pieces) {
    if ((piece.type === 'hacker' || piece.type === 'fighter') && piece.team === team && piece.cooldownTurns && piece.cooldownTurns > 0) {
      piece.cooldownTurns -= 1
      if (piece.cooldownTurns === 0) {
        piece.cooldownTurns = undefined
      }
    }
  }
}

// Decrement builder cooldowns
function decrementBuilderCooldowns(team: Team) {
  for (const piece of pieces) {
    if (piece.type === 'builder' && piece.team === team) {
      if (piece.barricadeCooldown && piece.barricadeCooldown > 0) {
        piece.barricadeCooldown -= 1
        if (piece.barricadeCooldown === 0) piece.barricadeCooldown = undefined
      }
      if (piece.artilleryCooldown && piece.artilleryCooldown > 0) {
        piece.artilleryCooldown -= 1
        if (piece.artilleryCooldown === 0) piece.artilleryCooldown = undefined
      }
      if (piece.spikeCooldown && piece.spikeCooldown > 0) {
        piece.spikeCooldown -= 1
        if (piece.spikeCooldown === 0) piece.spikeCooldown = undefined
      }
    }
  }
}

// Decrement spike timers and remove expired spikes
function decrementSpikeTimers(team: Team) {
  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i]
    if (piece.type === 'spike' && piece.team === team && piece.turnsRemaining) {
      piece.turnsRemaining -= 1
      if (piece.turnsRemaining <= 0) {
        pieces.splice(i, 1)
      }
    }
  }
}

// Bot AI - makes moves for the green team
type BotMove = {
  piece: Piece
  action: 'move' | 'shoot' | 'launch' | 'artillery' | 'hack' | 'bomb' | 'build'
  target?: { col: string; row: number }
  hackAction?: 'forward' | 'backward' | 'freeze'
  hackTarget?: Piece
  buildType?: 'barricade' | 'artillery' | 'spike'
  bombTarget?: Piece
  landingSpot?: { col: string; row: number }
  score: number
}

function makeBotMove() {
  if (gameState !== 'playing' || currentTurn !== 'green' || !botMode) return

  botThinking = true
  message = t('botThinking')
  render()

  // Get all green pieces that can move
  const greenPieces = pieces.filter(p => p.team === 'green' && !p.frozenTurns)
  const yellowPieces = pieces.filter(p => p.team === 'yellow')

  // Collect all possible moves
  const possibleMoves: BotMove[] = []

  // Check which of our pieces are under attack
  const threatenedPieces = getThreatenedPieces('green')

  for (const piece of greenPieces) {
    // Get valid moves for this piece
    let validMoves: { col: string; row: number; canCapture?: boolean }[] = []

    switch (piece.type) {
      case 'soldier':
        if (!piece.inTunnel) {
          validMoves = getValidMovesForSoldier(piece)
        }
        break
      case 'train':
        validMoves = getValidMovesForTrain(piece)
        break
      case 'tank':
        validMoves = getValidMovesForTank(piece)
        // Tank shooting
        const tankTargets = getShootTargetsForTank(piece)
        for (const target of tankTargets) {
          const targetPiece = getPieceAt(target.col, target.row)
          if (targetPiece && targetPiece.team === 'yellow') {
            possibleMoves.push({
              piece,
              action: 'shoot',
              target,
              score: evaluateCapture(targetPiece) * 1.5 // Shooting is safer than moving
            })
          }
        }
        break
      case 'ship':
        validMoves = getValidMovesForShip(piece)
        break
      case 'carrier':
        validMoves = getValidMovesForCarrier(piece)
        break
      case 'helicopter':
        validMoves = getValidMovesForHelicopter(piece)
        break
      case 'machinegun':
        // Machine gun shoots, doesn't move
        const mgTargets = getShootTargetsForMachineGun(piece)
        for (const target of mgTargets) {
          const targetPiece = getPieceAt(target.col, target.row)
          if (targetPiece && targetPiece.team === 'yellow') {
            possibleMoves.push({
              piece,
              action: 'shoot',
              target,
              score: evaluateCapture(targetPiece) * 1.5
            })
          }
        }
        break
      case 'suv':
        validMoves = getValidMovesForSuv(piece)
        break
      case 'sub':
        validMoves = getValidMovesForSub(piece)
        break
      case 'rocket':
        // Rocket can launch
        const rocketTargets = getValidTargetsForRocket(piece)
        for (const target of rocketTargets) {
          const area = getRocketExplosionArea(target.col, target.row)
          let targetScore = 0
          for (const sq of area) {
            const p = getPieceAt(sq.col, sq.row)
            if (p && p.team === 'yellow') {
              targetScore += evaluateCapture(p)
            }
          }
          if (targetScore > 0) {
            possibleMoves.push({
              piece,
              action: 'launch',
              target,
              score: targetScore * 1.2
            })
          }
        }
        break
      case 'artillery':
        possibleMoves.push({
          piece,
          action: 'artillery',
          score: 8
        })
        break
      case 'fighter':
        // Fighter bombing
        if (isFighterReadyForTeam('green') && !isFighterOnCooldown(piece)) {
          const bombTargets = getValidBombTargets(piece)
          for (const target of bombTargets) {
            const validLandingSpots = getValidLandingSpots(target.col, target.row)
            if (validLandingSpots.length > 0) {
              // Pick safest landing spot (furthest from enemies)
              let bestSpot = validLandingSpots[0]
              let bestScore = -1000
              for (const spot of validLandingSpots) {
                let spotScore = 0
                // Prefer spots not threatened
                if (!wouldBeThreatenedAt(piece, spot.col, spot.row)) {
                  spotScore += 10
                }
                // Prefer spots closer to our side
                spotScore += spot.row * 0.5
                if (spotScore > bestScore) {
                  bestScore = spotScore
                  bestSpot = spot
                }
              }
              possibleMoves.push({
                piece,
                action: 'bomb',
                bombTarget: target,
                landingSpot: bestSpot,
                score: evaluateCapture(target) * 2 // Bombing is powerful
              })
            }
          }
        }
        break
      case 'hacker':
        // Hacker hacking
        if (isHackerReadyForTeam('green') && !isHackerOnCooldown(piece)) {
          const hackableTargets = yellowPieces.filter(p =>
            p.type !== 'hacker' && p.type !== 'rocket' && p.type !== 'machinegun' &&
            !(p.type === 'soldier' && p.inTunnel)
          )
          for (const target of hackableTargets) {
            // Freeze is good for high-value targets
            possibleMoves.push({
              piece,
              action: 'hack',
              hackTarget: target,
              hackAction: 'freeze',
              score: evaluateCapture(target) * 0.8
            })
            // Push towards water or edge
            if (target.type !== 'sub' && target.type !== 'ship' && target.type !== 'carrier') {
              // Try to push into water (row 6)
              const targetForward = target.team === 'yellow' ? 1 : -1
              const forwardRow = target.row + targetForward
              const backwardRow = target.row - targetForward
              if (forwardRow === 6 && target.col !== 'F') {
                possibleMoves.push({
                  piece,
                  action: 'hack',
                  hackTarget: target,
                  hackAction: 'forward',
                  score: evaluateCapture(target) * 1.5 // Push into water!
                })
              }
              if (backwardRow === 6 && target.col !== 'F') {
                possibleMoves.push({
                  piece,
                  action: 'hack',
                  hackTarget: target,
                  hackAction: 'backward',
                  score: evaluateCapture(target) * 1.5
                })
              }
            }
          }
        }
        break
      case 'builder':
        // Builder building
        if (canBuilderBuildBarricade(piece)) {
          // Build barricade to protect pieces
          const builderMoves = getValidMovesForBuilder(piece)
          for (const spot of builderMoves) {
            // Prefer building in front of valuable pieces
            let buildScore = 5
            // Check if this protects our pieces
            for (const greenPiece of greenPieces) {
              if (greenPiece.col === spot.col && Math.abs(greenPiece.row - spot.row) <= 2) {
                buildScore += evaluateCapture(greenPiece) * 0.3
              }
            }
            possibleMoves.push({
              piece,
              action: 'build',
              target: spot,
              buildType: 'barricade',
              score: buildScore
            })
          }
        }
        if (canBuilderBuildArtillery(piece)) {
          const builderMoves = getValidMovesForBuilder(piece)
          for (const spot of builderMoves) {
            possibleMoves.push({
              piece,
              action: 'build',
              target: spot,
              buildType: 'artillery',
              score: 15 // Artillery is valuable
            })
          }
        }
        break
    }

    // Add movement options
    for (const move of validMoves) {
      let score = 0
      const targetPiece = getPieceAt(move.col, move.row)

      // Capture bonus
      if (targetPiece && targetPiece.team === 'yellow') {
        score += evaluateCapture(targetPiece)
      }

      // Check if this piece is threatened and can escape
      const isThreatened = threatenedPieces.some(t => t.piece === piece)
      if (isThreatened) {
        const stillThreatened = wouldBeThreatenedAt(piece, move.col, move.row)
        if (!stillThreatened) {
          score += evaluateCapture(piece) * 0.5 // Bonus for escaping
        }
      }

      // Penalty for moving into danger
      const movingIntoDanger = wouldBeThreatenedAt(piece, move.col, move.row)
      if (movingIntoDanger && !targetPiece) {
        score -= evaluateCapture(piece) * 0.3
      }

      // Prefer advancing towards enemy side
      if (piece.type === 'soldier' || piece.type === 'tank') {
        score += (11 - move.row) * 0.5
      }

      // Small randomness
      const randomFactor = botDifficulty === 'easy' ? 15 : botDifficulty === 'medium' ? 8 : 2
      score += Math.random() * randomFactor

      possibleMoves.push({
        piece,
        action: 'move',
        target: move,
        score
      })
    }
  }

  // Sort by score
  possibleMoves.sort((a, b) => b.score - a.score)

  // Pick move based on difficulty
  let chosenMove: BotMove | null = null

  if (possibleMoves.length > 0) {
    if (botDifficulty === 'easy') {
      // 30% chance to pick best move, otherwise random from top 60%
      if (Math.random() < 0.3) {
        chosenMove = possibleMoves[0]
      } else {
        const pool = possibleMoves.slice(0, Math.max(1, Math.floor(possibleMoves.length * 0.6)))
        chosenMove = pool[Math.floor(Math.random() * pool.length)]
      }
    } else if (botDifficulty === 'medium') {
      // 60% chance to pick best move, otherwise random from top 30%
      if (Math.random() < 0.6) {
        chosenMove = possibleMoves[0]
      } else {
        const pool = possibleMoves.slice(0, Math.max(1, Math.floor(possibleMoves.length * 0.3)))
        chosenMove = pool[Math.floor(Math.random() * pool.length)]
      }
    } else {
      // Hard: 90% best move, 10% second best (to avoid being too predictable)
      if (Math.random() < 0.9 || possibleMoves.length === 1) {
        chosenMove = possibleMoves[0]
      } else {
        chosenMove = possibleMoves[1]
      }
    }
  }

  // Execute the chosen move
  setTimeout(() => {
    botThinking = false
    executeBotMove(chosenMove)
  }, 300 * getSpeedMultiplier())
}

// Execute the bot's chosen move
function executeBotMove(chosenMove: BotMove | null) {
  if (!chosenMove) {
    // No valid moves - skip turn
    if (currentTurn === 'green') greenTurnCount++
    switchTurn()
    render()
    return
  }

  if (chosenMove.action === 'move' && chosenMove.target) {
    selectedPiece = chosenMove.piece
    const capturedPiece = getPieceAt(chosenMove.target.col, chosenMove.target.row)
    completMove(chosenMove.target.col, chosenMove.target.row, capturedPiece || null)
  } else if (chosenMove.action === 'shoot' && chosenMove.target) {
    selectedPiece = chosenMove.piece
    if (chosenMove.piece.type === 'tank') {
      shootTargets = getShootTargetsForTank(chosenMove.piece)
    } else if (chosenMove.piece.type === 'machinegun') {
      shootTargets = getShootTargetsForMachineGun(chosenMove.piece)
    }
    shootPiece(chosenMove.target.col, chosenMove.target.row)
  } else if (chosenMove.action === 'launch' && chosenMove.target) {
    launchRocket(chosenMove.piece, chosenMove.target.col, chosenMove.target.row)
  } else if (chosenMove.action === 'artillery') {
    fireArtillery(chosenMove.piece)
  } else if (chosenMove.action === 'hack' && chosenMove.hackTarget && chosenMove.hackAction) {
    selectedPiece = chosenMove.piece
    selectedHackTarget = chosenMove.hackTarget
    executeHack(chosenMove.hackAction)
  } else if (chosenMove.action === 'bomb' && chosenMove.bombTarget && chosenMove.landingSpot) {
    selectedPiece = chosenMove.piece
    executeBombing(chosenMove.piece, chosenMove.bombTarget, chosenMove.landingSpot.col, chosenMove.landingSpot.row)
  } else if (chosenMove.action === 'build' && chosenMove.target && chosenMove.buildType) {
    selectedPiece = chosenMove.piece
    builderPlacementMode = chosenMove.buildType
    placeBuilderItem(chosenMove.target.col, chosenMove.target.row)
  }
}

// Get pieces that are threatened by enemy
function getThreatenedPieces(team: Team): { piece: Piece; threats: Piece[] }[] {
  const threatened: { piece: Piece; threats: Piece[] }[] = []
  const myPieces = pieces.filter(p => p.team === team)
  const enemyPieces = pieces.filter(p => p.team !== team)

  for (const piece of myPieces) {
    const threats: Piece[] = []
    for (const enemy of enemyPieces) {
      if (canAttack(enemy, piece.col, piece.row)) {
        threats.push(enemy)
      }
    }
    if (threats.length > 0) {
      threatened.push({ piece, threats })
    }
  }
  return threatened
}

// Check if a piece can attack a position
function canAttack(attacker: Piece, col: string, row: number): boolean {
  if (attacker.frozenTurns) return false

  switch (attacker.type) {
    case 'soldier': {
      const moves = getValidMovesForSoldier(attacker)
      return moves.some(m => m.col === col && m.row === row && m.canCapture)
    }
    case 'tank': {
      const moves = getValidMovesForTank(attacker)
      const shoots = getShootTargetsForTank(attacker)
      return moves.some(m => m.col === col && m.row === row) ||
             shoots.some(s => s.col === col && s.row === row)
    }
    case 'train': {
      const moves = getValidMovesForTrain(attacker)
      return moves.some(m => m.col === col && m.row === row && m.canCapture)
    }
    case 'machinegun': {
      const targets = getShootTargetsForMachineGun(attacker)
      return targets.some(t => t.col === col && t.row === row)
    }
    case 'helicopter': {
      const moves = getValidMovesForHelicopter(attacker)
      return moves.some(m => m.col === col && m.row === row && m.canCapture)
    }
    default:
      return false
  }
}

// Check if a piece would be threatened at a new position
function wouldBeThreatenedAt(piece: Piece, newCol: string, newRow: number): boolean {
  const enemyPieces = pieces.filter(p => p.team !== piece.team)
  for (const enemy of enemyPieces) {
    if (canAttack(enemy, newCol, newRow)) {
      return true
    }
  }
  return false
}

// Evaluate capture value for bot
function evaluateCapture(piece: Piece): number {
  const baseValue: Record<string, number> = {
    soldier: 5,
    tank: 15,
    ship: 12,
    carrier: 20,
    helicopter: 10,
    train: 15,
    machinegun: 10,
    suv: 8,
    sub: 12,
    rocket: 18,
    fighter: 15,
    hacker: 15,
    builder: 100, // Very high - winning move!
    artillery: 8,
    barricade: 2,
    spike: 1
  }
  return baseValue[piece.type] || piece.points
}

// Switch turn to the other team and handle frozen pieces
function switchTurn() {
  const newTeam: Team = currentTurn === 'yellow' ? 'green' : 'yellow'
  currentTurn = newTeam
  // Decrement frozen turns for the team that is now playing
  decrementFrozenTurns(newTeam)
  // Decrement cooldowns for hacker and fighter of the team that is now playing
  decrementCooldowns(newTeam)
  // Decrement builder cooldowns
  decrementBuilderCooldowns(newTeam)
  // Decrement spike timers
  decrementSpikeTimers(newTeam)

  // Check for max turns win condition (after both teams have made 80 moves)
  if (yellowTurnCount >= MAX_TURNS_PER_TEAM && greenTurnCount >= MAX_TURNS_PER_TEAM) {
    const yellowScore = getTeamScore('yellow')
    const greenScore = getTeamScore('green')
    if (yellowScore > greenScore) {
      winner = 'yellow'
    } else if (greenScore > yellowScore) {
      winner = 'green'
    } else {
      // Tie goes to yellow (first player) or could be a draw
      winner = 'yellow'
    }
    winReason = 'points'
    gameState = 'gameOver'
    stopTimer()
    playSound('win')
  }

  // Trigger bot move if it's green's turn and bot mode is enabled
  if (botMode && currentTurn === 'green' && gameState === 'playing') {
    setTimeout(() => {
      makeBotMove()
    }, 500 * getSpeedMultiplier())
  }
}

// Check if builder was captured - call this when a piece is captured
function checkBuilderCaptured(capturedPiece: Piece, capturingTeam: Team) {
  if (capturedPiece.type === 'builder') {
    winner = capturingTeam
    winReason = 'builder'
    gameState = 'gameOver'
    stopTimer()
    playSound('win')
  }
}

// Check if hacker is on cooldown
function isHackerOnCooldown(hacker: Piece): boolean {
  return (hacker.cooldownTurns ?? 0) > 0
}

// Get remaining cooldown in turns
function getHackerCooldownRemaining(hacker: Piece): number {
  return hacker.cooldownTurns ?? 0
}

// Check if fighter is ready for a specific team
function isFighterReadyForTeam(team: Team): boolean {
  const teamTurns = team === 'yellow' ? yellowTurnCount : greenTurnCount
  return teamTurns >= FIGHTER_READY_TURN
}

// Check if fighter is on cooldown
function isFighterOnCooldown(fighter: Piece): boolean {
  return (fighter.cooldownTurns ?? 0) > 0
}

// Get remaining cooldown in turns for fighter
function getFighterCooldownRemaining(fighter: Piece): number {
  return fighter.cooldownTurns ?? 0
}

// Get valid bomb targets for fighter (enemies within range in 8 directions)
function getValidBombTargets(fighter: Piece): Piece[] {
  const targets: Piece[] = []
  const fighterColIndex = columns.indexOf(fighter.col)

  // All 8 directions
  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
    { dc: 1, dr: 1 },   // up-right
    { dc: -1, dr: 1 },  // up-left
    { dc: 1, dr: -1 },  // down-right
    { dc: -1, dr: -1 }, // down-left
  ]

  for (const dir of directions) {
    for (let distance = 1; distance <= FIGHTER_BOMB_RANGE; distance++) {
      const colIndex = fighterColIndex + dir.dc * distance
      const row = fighter.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]
      const pieceAtTarget = getPieceAt(col, row)

      if (pieceAtTarget) {
        if (pieceAtTarget.team !== fighter.team) {
          targets.push(pieceAtTarget)
        }
        break // Can't see past pieces
      }
    }
  }

  return targets
}

// Get valid landing spots after bombing (0-3 squares from target, not occupied)
function getValidLandingSpots(targetCol: string, targetRow: number): { col: string; row: number }[] {
  const spots: { col: string; row: number }[] = []
  const targetColIndex = columns.indexOf(targetCol)

  // Check all squares within landing range
  for (let dr = -FIGHTER_LANDING_RANGE; dr <= FIGHTER_LANDING_RANGE; dr++) {
    for (let dc = -FIGHTER_LANDING_RANGE; dc <= FIGHTER_LANDING_RANGE; dc++) {
      const row = targetRow + dr
      const colIndex = targetColIndex + dc

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

      // Check if within range (Chebyshev distance for 8-directional)
      const distance = Math.max(Math.abs(dr), Math.abs(dc))
      if (distance > FIGHTER_LANDING_RANGE) continue

      const col = columns[colIndex]

      // Cannot land on water (row 6, except bridge)
      if (row === 6 && col !== 'F') continue

      // Cannot land on other pieces
      const pieceAtSpot = getPieceAt(col, row)
      if (pieceAtSpot) continue

      spots.push({ col, row })
    }
  }

  return spots
}

// Builder movement: 1 square in all 8 directions
function getValidMovesForBuilder(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  // All 8 directions, 1 square only
  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
    { dc: 1, dr: 1 },   // up-right
    { dc: -1, dr: 1 },  // up-left
    { dc: 1, dr: -1 },  // down-right
    { dc: -1, dr: -1 }, // down-left
  ]

  for (const dir of directions) {
    const colIndex = pieceColIndex + dir.dc
    const row = piece.row + dir.dr

    if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

    const col = columns[colIndex]

    // Cannot go on water (row 6, except bridge)
    if (row === 6 && col !== 'F') continue

    const pieceAtTarget = getPieceAtAboveGround(col, row)

    // Builder cannot capture normally - just check for empty squares or move behind friendly barricade
    // Can move onto squares with tunnel soldiers (they're underground)
    if (!pieceAtTarget) {
      moves.push({ col, row, canCapture: false })
    } else if (canMoveBehindBarricade(piece, col, row)) {
      moves.push({ col, row, canCapture: false })
    }
  }

  return moves
}

// Check if builder can build barricades
function canBuilderBuildBarricade(builder: Piece): boolean {
  const teamTurns = builder.team === 'yellow' ? yellowTurnCount : greenTurnCount
  if (teamTurns < BUILDER_READY_TURN) return false
  if ((builder.barricadesBuilt ?? 0) >= MAX_BARRICADES_TOTAL) return false
  if ((builder.barricadeCooldown ?? 0) > 0) return false

  // Check max barricades on board
  const barricadesOnBoard = pieces.filter(p => p.type === 'barricade' && p.team === builder.team).length
  if (barricadesOnBoard >= MAX_BARRICADES_ON_BOARD) return false

  return true
}

// Check if builder can build artillery
function canBuilderBuildArtillery(builder: Piece): boolean {
  const teamTurns = builder.team === 'yellow' ? yellowTurnCount : greenTurnCount
  if (teamTurns < ARTILLERY_READY_TURN) return false
  if ((builder.artilleryBuilt ?? 0) >= MAX_ARTILLERY_TOTAL) return false
  if ((builder.artilleryCooldown ?? 0) > 0) return false

  // Check max artillery on board
  const artilleryOnBoard = pieces.filter(p => p.type === 'artillery' && p.team === builder.team).length
  if (artilleryOnBoard >= MAX_ARTILLERY_ON_BOARD) return false

  return true
}

// Get valid placement spots for barricade/artillery
function getValidPlacementSpots(builder: Piece): { col: string; row: number }[] {
  const spots: { col: string; row: number }[] = []
  const builderColIndex = columns.indexOf(builder.col)

  for (let dr = -BUILDER_RANGE; dr <= BUILDER_RANGE; dr++) {
    for (let dc = -BUILDER_RANGE; dc <= BUILDER_RANGE; dc++) {
      const row = builder.row + dr
      const colIndex = builderColIndex + dc

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

      // Check if within range (Chebyshev distance)
      const distance = Math.max(Math.abs(dr), Math.abs(dc))
      if (distance > BUILDER_RANGE || distance === 0) continue

      const col = columns[colIndex]

      // Cannot place on water (row 6, except bridge)
      if (row === 6 && col !== 'F') continue

      // Cannot place on other pieces
      const pieceAtSpot = getPieceAt(col, row)
      if (pieceAtSpot) continue

      spots.push({ col, row })
    }
  }

  return spots
}

// Count barricades on board for a team
function getBarricadesOnBoard(team: Team): number {
  return pieces.filter(p => p.type === 'barricade' && p.team === team).length
}

// Count artillery on board for a team
function getArtilleryOnBoard(team: Team): number {
  return pieces.filter(p => p.type === 'artillery' && p.team === team).length
}

// Count spikes on board for a team
function getSpikesOnBoard(team: Team): number {
  return pieces.filter(p => p.type === 'spike' && p.team === team).length
}

// Check if builder can build spikes
function canBuilderBuildSpike(builder: Piece): boolean {
  const teamTurns = builder.team === 'yellow' ? yellowTurnCount : greenTurnCount
  if (teamTurns < SPIKE_READY_TURN) return false
  if ((builder.spikesBuilt ?? 0) >= MAX_SPIKES_TOTAL) return false
  if ((builder.spikeCooldown ?? 0) > 0) return false

  // Check max spikes on board
  const spikesOnBoard = getSpikesOnBoard(builder.team)
  if (spikesOnBoard >= MAX_SPIKES_ON_BOARD) return false

  return true
}

// Check if a square is a special square (cannot place spikes)
function isSpecialSquare(col: string, row: number): boolean {
  const colLetter = col

  // River (row 6)
  if (row === 6) return true

  // Bridge and adjacent squares (E6, F6, G6 - but F5, F7 are 1 before/after bridge)
  if (col === 'F' && (row === 5 || row === 6 || row === 7)) return true
  if ((col === 'E' || col === 'G') && row === 6) return true

  // Helipads (C5, C7, I5, I7)
  if ((colLetter === 'C' || colLetter === 'I') && (row === 5 || row === 7)) return true

  // Tunnels (E4, E8, G4, G8)
  if ((colLetter === 'E' || colLetter === 'G') && (row === 4 || row === 8)) return true

  // Trenches (F3, F9)
  if (colLetter === 'F' && (row === 3 || row === 9)) return true

  // Rail tracks
  if ((colLetter === 'A' || colLetter === 'K') && (row === 1 || row === 2 || row === 10 || row === 11)) return true

  // Bushes
  if (['A', 'B', 'C'].includes(colLetter) && (row >= 3 && row <= 4)) return true
  if (['I', 'J', 'K'].includes(colLetter) && (row >= 3 && row <= 4)) return true
  if (['A', 'B', 'C'].includes(colLetter) && (row >= 8 && row <= 9)) return true
  if (['I', 'J', 'K'].includes(colLetter) && (row >= 8 && row <= 9)) return true

  return false
}

// Get valid spike placement spots
function getValidSpikePlacementSpots(builder: Piece): { col: string; row: number }[] {
  const spots: { col: string; row: number }[] = []
  const builderColIndex = columns.indexOf(builder.col)

  for (let dr = -BUILDER_RANGE; dr <= BUILDER_RANGE; dr++) {
    for (let dc = -BUILDER_RANGE; dc <= BUILDER_RANGE; dc++) {
      const row = builder.row + dr
      const colIndex = builderColIndex + dc

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

      // Check if within range (Chebyshev distance)
      const distance = Math.max(Math.abs(dr), Math.abs(dc))
      if (distance > BUILDER_RANGE || distance === 0) continue

      const col = columns[colIndex]

      // Cannot place on special squares
      if (isSpecialSquare(col, row)) continue

      // Cannot place on other pieces
      const pieceAtSpot = getPieceAt(col, row)
      if (pieceAtSpot) continue

      spots.push({ col, row })
    }
  }

  return spots
}

// Check if a square is blocked by a barricade (for movement)
function isBlockedByBarricade(col: string, row: number): boolean {
  const piece = getPieceAt(col, row)
  return piece?.type === 'barricade'
}

// Check if a shot path is blocked by a barricade
function isShotBlockedByBarricade(fromCol: string, fromRow: number, toCol: string, toRow: number): boolean {
  const fromColIndex = columns.indexOf(fromCol)
  const toColIndex = columns.indexOf(toCol)

  const dc = Math.sign(toColIndex - fromColIndex)
  const dr = Math.sign(toRow - fromRow)

  let currentCol = fromColIndex + dc
  let currentRow = fromRow + dr

  while (currentCol !== toColIndex || currentRow !== toRow) {
    // Check for barricade specifically (handles multiple pieces on same square)
    if (getBarricadeAt(columns[currentCol], currentRow)) return true
    currentCol += dc
    currentRow += dr
  }

  // Also check the target square for barricade (blocks shots to pieces behind it)
  if (getBarricadeAt(toCol, toRow)) return true

  return false
}

// Fire artillery at random position over the river
function fireArtillery(artillery: Piece) {
  const artilleryTeam = artillery.team

  // Determine enemy side of the river
  const enemyRows = artilleryTeam === 'yellow' ? [7, 8, 9, 10, 11] : [1, 2, 3, 4, 5]

  // Find all valid targets within range of artillery
  const artilleryColIndex = columns.indexOf(artillery.col)
  const validTargets: { col: string; row: number; piece?: Piece }[] = []

  for (const row of enemyRows) {
    for (let colIndex = 0; colIndex < 11; colIndex++) {
      const col = columns[colIndex]

      // Check if within range of artillery
      const distance = Math.max(Math.abs(colIndex - artilleryColIndex), Math.abs(row - artillery.row))
      if (distance > ARTILLERY_TARGET_RANGE) continue

      // Skip water
      if (row === 6 && col !== 'F') continue

      const piece = getPieceAt(col, row)
      validTargets.push({ col, row, piece: piece || undefined })
    }
  }

  if (validTargets.length === 0) {
    message = t('artilleryNoTargets')
    return
  }

  // Pick random target
  const target = validTargets[Math.floor(Math.random() * validTargets.length)]

  // Check if there's a piece that can be destroyed
  const destructibleTypes: PieceType[] = ['train', 'helicopter', 'tank', 'ship', 'sub', 'soldier', 'suv']

  // Remove the artillery immediately (single use)
  const artilleryIndex = pieces.indexOf(artillery)
  if (artilleryIndex !== -1) {
    pieces.splice(artilleryIndex, 1)
  }

  // Show explosion at target
  explosionAt = { col: target.col, row: target.row }
  selectedPiece = null
  playSound('explosion')
  triggerScreenShake()
  render()

  // After explosion animation, complete the action
  setTimeout(() => {
    // 1 in 3 chance to hit (33%)
    const hitChance = Math.random()
    const didHit = hitChance < 0.33

    if (didHit && target.piece && destructibleTypes.includes(target.piece.type)) {
      // Destroy the piece
      const targetIndex = pieces.indexOf(target.piece)
      if (targetIndex !== -1) {
        pieces.splice(targetIndex, 1)
        capturedPieces.push(target.piece)
        message = `Artillery hit ${target.piece.type} at ${target.col}${target.row}! (+${target.piece.points} points)`
      }
    } else {
      message = `Artillery fired at ${target.col}${target.row} - miss!`
    }

    explosionAt = null

    // Increment turn count
    if (artilleryTeam === 'yellow') yellowTurnCount++
    else greenTurnCount++

    // Switch turns
    switchTurn()

    render()
  }, 500 * getSpeedMultiplier())
}

// Check if any soldier of the current team must leave the trench
function checkForcedTrenchExit(): Piece | null {
  const currentTeamTurn = currentTurn === 'yellow' ? yellowTurnCount : greenTurnCount

  for (const piece of pieces) {
    if (piece.team === currentTurn && piece.type === 'soldier' && piece.inTrench && piece.trenchEnteredOnTurn !== undefined) {
      const turnsInTrench = currentTeamTurn - piece.trenchEnteredOnTurn
      if (turnsInTrench >= 3) {
        return piece
      }
    }
  }
  return null
}

function getInitialPieces(): Piece[] {
  return [
    // Yellow trains
    { type: 'train', team: 'yellow', col: 'K', row: 1, points: 10 },
    { type: 'train', team: 'yellow', col: 'A', row: 1, points: 10 },
    // Green trains
    { type: 'train', team: 'green', col: 'A', row: 11, points: 10 },
    { type: 'train', team: 'green', col: 'K', row: 11, points: 10 },
    // Yellow tanks
    { type: 'tank', team: 'yellow', col: 'B', row: 2, points: 15 },
    { type: 'tank', team: 'yellow', col: 'J', row: 2, points: 15 },
    // Green tanks
    { type: 'tank', team: 'green', col: 'B', row: 10, points: 15 },
    { type: 'tank', team: 'green', col: 'J', row: 10, points: 15 },
    // Yellow ships (behind tanks)
    { type: 'ship', team: 'yellow', col: 'B', row: 1, points: 12 },
    { type: 'ship', team: 'yellow', col: 'J', row: 1, points: 12 },
    // Green ships (behind tanks)
    { type: 'ship', team: 'green', col: 'B', row: 11, points: 12 },
    { type: 'ship', team: 'green', col: 'J', row: 11, points: 12 },
    // Yellow aircraft carriers
    { type: 'carrier', team: 'yellow', col: 'C', row: 1, points: 20, hp: 2, hasHelicopter: false },
    { type: 'carrier', team: 'yellow', col: 'I', row: 1, points: 20, hp: 2, hasHelicopter: false },
    // Green aircraft carriers
    { type: 'carrier', team: 'green', col: 'C', row: 11, points: 20, hp: 2, hasHelicopter: false },
    { type: 'carrier', team: 'green', col: 'I', row: 11, points: 20, hp: 2, hasHelicopter: false },
    // Yellow helicopters (in front of trains)
    { type: 'helicopter', team: 'yellow', col: 'A', row: 2, points: 8 },
    { type: 'helicopter', team: 'yellow', col: 'K', row: 2, points: 8 },
    // Green helicopters (in front of trains)
    { type: 'helicopter', team: 'green', col: 'A', row: 10, points: 8 },
    { type: 'helicopter', team: 'green', col: 'K', row: 10, points: 8 },
    // Yellow rockets (next to carriers)
    { type: 'rocket', team: 'yellow', col: 'D', row: 1, points: 25, used: false },
    { type: 'rocket', team: 'yellow', col: 'H', row: 1, points: 25, used: false },
    // Green rockets (next to carriers)
    { type: 'rocket', team: 'green', col: 'D', row: 11, points: 25, used: false },
    { type: 'rocket', team: 'green', col: 'H', row: 11, points: 25, used: false },
    // Yellow machine guns (in front of rockets)
    { type: 'machinegun', team: 'yellow', col: 'D', row: 2, points: 25 },
    { type: 'machinegun', team: 'yellow', col: 'H', row: 2, points: 25 },
    // Green machine guns (in front of rockets)
    { type: 'machinegun', team: 'green', col: 'D', row: 10, points: 25 },
    { type: 'machinegun', team: 'green', col: 'H', row: 10, points: 25 },
    // Yellow SUVs (next to tanks and soldiers)
    { type: 'suv', team: 'yellow', col: 'C', row: 2, points: 20 },
    { type: 'suv', team: 'yellow', col: 'I', row: 2, points: 20 },
    // Green SUVs (next to tanks and soldiers)
    { type: 'suv', team: 'green', col: 'C', row: 10, points: 20 },
    { type: 'suv', team: 'green', col: 'I', row: 10, points: 20 },
    // Yellow hacker
    { type: 'hacker', team: 'yellow', col: 'E', row: 1, points: 30 },
    // Green hacker
    { type: 'hacker', team: 'green', col: 'E', row: 11, points: 30 },
    // Yellow submarine
    { type: 'sub', team: 'yellow', col: 'A', row: 6, points: 12 },
    // Green submarine
    { type: 'sub', team: 'green', col: 'K', row: 6, points: 12 },
    // Yellow fighter jet
    { type: 'fighter', team: 'yellow', col: 'G', row: 1, points: 40 },
    // Green fighter jet
    { type: 'fighter', team: 'green', col: 'G', row: 11, points: 40 },
    // Yellow builder
    { type: 'builder', team: 'yellow', col: 'F', row: 1, points: 0, barricadesBuilt: 0, artilleryBuilt: 0, spikesBuilt: 0 },
    // Green builder
    { type: 'builder', team: 'green', col: 'F', row: 11, points: 0, barricadesBuilt: 0, artilleryBuilt: 0, spikesBuilt: 0 },
    // Yellow soldiers
    { type: 'soldier', team: 'yellow', col: 'E', row: 2, points: 5 },
    { type: 'soldier', team: 'yellow', col: 'F', row: 2, points: 5 },
    { type: 'soldier', team: 'yellow', col: 'G', row: 2, points: 5 },
    // Green soldiers
    { type: 'soldier', team: 'green', col: 'E', row: 10, points: 5 },
    { type: 'soldier', team: 'green', col: 'F', row: 10, points: 5 },
    { type: 'soldier', team: 'green', col: 'G', row: 10, points: 5 },
  ]
}

async function startGame() {
  gameState = 'playing'
  await initAudio()

  // Initialize timer if enabled
  if (timerEnabled) {
    yellowTimeRemaining = timerMinutes * 60
    greenTimeRemaining = timerMinutes * 60
    startTimer()
  }

  // Start music if enabled
  if (musicEnabled) {
    await startMusic()
  }

  render()
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  timerInterval = window.setInterval(() => {
    if (gameState !== 'playing') return

    // Decrement current player's time
    if (currentTurn === 'yellow') {
      yellowTimeRemaining--
      if (yellowTimeRemaining <= 10 && yellowTimeRemaining > 0) {
        playSound('tick')
      }
      if (yellowTimeRemaining <= 0) {
        yellowTimeRemaining = 0
        handleTimeOut('yellow')
      }
    } else {
      greenTimeRemaining--
      if (greenTimeRemaining <= 10 && greenTimeRemaining > 0) {
        playSound('tick')
      }
      if (greenTimeRemaining <= 0) {
        greenTimeRemaining = 0
        handleTimeOut('green')
      }
    }

    render()
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function handleTimeOut(team: Team) {
  stopTimer()
  playSound('explosion') // Dramatic sound for timeout
  triggerScreenShake()

  // Apply -10 penalty to the team that ran out of time
  if (team === 'yellow') {
    yellowPenalty += TIMEOUT_PENALTY
  } else {
    greenPenalty += TIMEOUT_PENALTY
  }

  const yellowScore = getTeamScore('yellow')
  const greenScore = getTeamScore('green')

  // Winner is determined by points (after penalty)
  if (yellowScore > greenScore) {
    winner = 'yellow'
  } else if (greenScore > yellowScore) {
    winner = 'green'
  } else {
    // Tie goes to the team that didn't run out of time
    winner = team === 'yellow' ? 'green' : 'yellow'
  }

  winReason = 'points'
  gameState = 'gameOver'
  message = t('timeUpPenalty').replace('{team}', team === 'yellow' ? t('yellowTeam') : t('greenTeam'))
  playSound('win')
  render()
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function showResetConfirm() {
  gameState = 'confirmReset'
  render()
}

function cancelReset() {
  gameState = 'playing'
  render()
}

function resetGame() {
  // Reset all game state
  pieces.length = 0
  pieces.push(...getInitialPieces())
  moveLog = []
  capturedPieces = []
  selectedPiece = null
  validMoves = []
  shootTargets = []
  rocketTargetArea = []
  rocketAnimation = null
  fighterAnimation = null
  hackTargets = []
  selectedHackTarget = null
  showHackActions = false
  bombTargets = []
  selectedBombTarget = null
  landingSpots = []
  showBuilderActions = false
  showCarrierActions = false
  builderPlacementMode = null
  builderPlacementSpots = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []
  message = null
  currentTurn = 'yellow'
  gameState = 'start'
  actionMode = null
  showSoldierActions = false
  yellowTurnCount = 0
  greenTurnCount = 0
  winner = null
  winReason = null

  // Reset timer
  stopTimer()
  yellowTimeRemaining = timerMinutes * 60
  greenTimeRemaining = timerMinutes * 60

  // Reset penalties
  yellowPenalty = 0
  greenPenalty = 0

  // Stop music
  stopMusic()

  render()
}

// Train zones: left side (A-C) and right side (I-K)
function getTrainZone(piece: Piece): 'left' | 'right' {
  const colIndex = columns.indexOf(piece.col)
  return colIndex <= 2 ? 'left' : 'right'
}

// All squares where trains can be (rails + bushes)
function isTrainSquare(col: string, row: number, zone: 'left' | 'right'): boolean {
  const colIndex = columns.indexOf(col)

  if (zone === 'left') {
    // Left zone: columns A-C (indices 0-2)
    if (colIndex > 2) return false
    // Rails: A1, A2, A10, A11
    if (col === 'A' && (row === 1 || row === 2 || row === 10 || row === 11)) return true
    // Bushes: A3-C4, A8-C9
    if (row >= 3 && row <= 4 && colIndex <= 2) return true
    if (row >= 8 && row <= 9 && colIndex <= 2) return true
    return false
  } else {
    // Right zone: columns I-K (indices 8-10)
    if (colIndex < 8) return false
    // Rails: K1, K2, K10, K11
    if (col === 'K' && (row === 1 || row === 2 || row === 10 || row === 11)) return true
    // Bushes: I3-K4, I8-K9
    if (row >= 3 && row <= 4 && colIndex >= 8) return true
    if (row >= 8 && row <= 9 && colIndex >= 8) return true
    return false
  }
}

function getValidMovesForTrain(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const zone = getTrainZone(piece)
  const pieceColIndex = columns.indexOf(piece.col)

  // Check all 4 directions: up, down, left, right
  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    let colIndex = pieceColIndex + dir.dc
    let row = piece.row + dir.dr

    // Keep moving in this direction until blocked
    while (colIndex >= 0 && colIndex < 11 && row >= 1 && row <= 11) {
      const col = columns[colIndex]

      // Check if this square is in the train's zone
      if (!isTrainSquare(col, row, zone)) break

      const pieceAtTarget = getPieceAtAboveGround(col, row)

      if (pieceAtTarget) {
        // Can move behind friendly barricade
        if (canMoveBehindBarricade(piece, col, row)) {
          moves.push({ col, row, canCapture: false })
        } else if (pieceAtTarget.team !== piece.team) {
          // Can capture enemy piece
          moves.push({ col, row, canCapture: true })
        }
        // Blocked by a piece, stop in this direction
        break
      } else {
        moves.push({ col, row, canCapture: false })
      }

      colIndex += dir.dc
      row += dir.dr
    }
  }

  return moves
}

// Check if a square is a tunnel square (E4-E8 or G4-G8)
function isTunnelSquare(col: string, row: number): boolean {
  return (col === 'E' && row >= 4 && row <= 8) ||
         (col === 'G' && row >= 4 && row <= 8)
}

// Check if a square is a trench (F3 or F9)
function isTrenchSquare(col: string, row: number): boolean {
  return col === 'F' && (row === 3 || row === 9)
}

function getValidMovesForSoldier(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  // If in tunnel, can move within tunnel or exit at entrances
  // Can move under pieces that are NOT in the tunnel
  if (piece.inTunnel) {
    const tunnelCol = piece.col // E or G
    // Can move to adjacent tunnel squares (up or down within E4-E8 or G4-G8)
    const upRow = piece.row + 1
    const downRow = piece.row - 1

    if (isTunnelSquare(tunnelCol, upRow)) {
      const pieceAtTarget = getPieceAt(tunnelCol, upRow)
      // Can move if no piece there, OR if the piece is NOT in the tunnel (we go under it)
      // But blocked by other soldiers that ARE in the tunnel
      if (!pieceAtTarget || !pieceAtTarget.inTunnel) {
        moves.push({ col: tunnelCol, row: upRow, canCapture: false })
      }
    }
    if (isTunnelSquare(tunnelCol, downRow)) {
      const pieceAtTarget = getPieceAt(tunnelCol, downRow)
      // Can move if no piece there, OR if the piece is NOT in the tunnel (we go under it)
      // But blocked by other soldiers that ARE in the tunnel
      if (!pieceAtTarget || !pieceAtTarget.inTunnel) {
        moves.push({ col: tunnelCol, row: downRow, canCapture: false })
      }
    }
    return moves
  }

  // Normal movement: 1 square horizontal or vertical
  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    const colIndex = pieceColIndex + dir.dc
    const row = piece.row + dir.dr

    if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

    const col = columns[colIndex]
    const pieceAtTarget = getPieceAtAboveGround(col, row)

    // Cannot move onto water (row 6, except bridge at F6)
    if (row === 6 && col !== 'F') continue

    // Soldiers cannot capture by moving, but can move behind friendly barricade
    // Can move onto squares with tunnel soldiers (they're underground)
    if (pieceAtTarget) {
      if (canMoveBehindBarricade(piece, col, row)) {
        moves.push({ col, row, canCapture: false })
      }
      continue
    }

    moves.push({ col, row, canCapture: false })
  }

  return moves
}

// Check if soldier in tunnel can exit (at E4, E8, G4, G8)
function canExitTunnel(piece: Piece): boolean {
  if (!piece.inTunnel) return false
  return isTunnelEntrance(piece.col, piece.row)
}

function getShootTargetsForSoldier(piece: Piece): { col: string; row: number }[] {
  const targets: { col: string; row: number }[] = []

  // If in tunnel, can only shoot at other soldiers in the same tunnel
  if (piece.inTunnel) {
    const tunnelCol = piece.col // E or G
    // Can shoot 1 or 2 squares forward within tunnel
    const directionSign = piece.team === 'yellow' ? 1 : -1

    for (const distance of [1, 2]) {
      const targetRow = piece.row + (distance * directionSign)

      if (!isTunnelSquare(tunnelCol, targetRow)) continue

      const pieceAtTarget = getPieceAt(tunnelCol, targetRow)

      // Can only shoot enemy soldiers that are also in the tunnel
      if (pieceAtTarget && pieceAtTarget.team !== piece.team &&
          pieceAtTarget.type === 'soldier' && pieceAtTarget.inTunnel) {
        targets.push({ col: tunnelCol, row: targetRow })
      }
    }
    return targets
  }

  // Can shoot 1 or 2 squares forward (yellow shoots up, green shoots down)
  const directionSign = piece.team === 'yellow' ? 1 : -1

  for (const distance of [1, 2]) {
    const targetRow = piece.row + (distance * directionSign)

    if (targetRow < 1 || targetRow > 11) continue

    const pieceAtTarget = getPieceAt(piece.col, targetRow)

    // Can only shoot if there's an enemy piece there
    if (pieceAtTarget && pieceAtTarget.team !== piece.team) {
      // Check if target is in trench (cannot be shot) or in tunnel (cannot be shot)
      if (!pieceAtTarget.inTrench && !pieceAtTarget.inTunnel) {
        targets.push({ col: piece.col, row: targetRow })
      }
    }
  }

  return targets
}

// Tank movement: 1 or 2 squares horizontal or vertical
function getValidMovesForTank(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    // Check 1 and 2 squares in each direction
    for (let distance = 1; distance <= 2; distance++) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]

      // Cannot go on water (row 6, except bridge at F6)
      if (row === 6 && col !== 'F') break

      // Check if path is blocked (for distance 2, check the middle square)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir.dc
        const midRow = piece.row + dir.dr
        const midCol = columns[midColIndex]

        // Cannot pass through water
        if (midRow === 6 && midCol !== 'F') break

        const pieceInPath = getPieceAtAboveGround(midCol, midRow)
        if (pieceInPath) break
      }

      const pieceAtTarget = getPieceAtAboveGround(col, row)

      // Tanks cannot capture by moving (they shoot), but can move behind friendly barricade
      // Can move onto squares with tunnel soldiers (they're underground)
      if (pieceAtTarget) {
        if (canMoveBehindBarricade(piece, col, row)) {
          moves.push({ col, row, canCapture: false })
        }
        break
      }

      moves.push({ col, row, canCapture: false })
    }
  }

  return moves
}

/// SUV movement: 1-2 squares in all 8 directions, can ram horizontally/vertically
function getValidMovesForSuv(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  // Horizontal and vertical directions (can ram)
  const straightDirections = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  // Diagonal directions (cannot ram)
  const diagonalDirections = [
    { dc: 1, dr: 1 },   // up-right
    { dc: -1, dr: 1 },  // up-left
    { dc: 1, dr: -1 },  // down-right
    { dc: -1, dr: -1 }, // down-left
  ]

  // Horizontal/vertical movement with ramming
  for (const dir of straightDirections) {
    for (let distance = 1; distance <= 2; distance++) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]

      // Cannot go on water (row 6, except bridge at F6)
      if (row === 6 && col !== 'F') break

      // Check if path is blocked (for distance 2, check the middle square)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir.dc
        const midRow = piece.row + dir.dr
        const midCol = columns[midColIndex]

        // Cannot pass through water
        if (midRow === 6 && midCol !== 'F') break

        const pieceInPath = getPieceAtAboveGround(midCol, midRow)
        if (pieceInPath) break
      }

      const pieceAtTarget = getPieceAtAboveGround(col, row)

      if (pieceAtTarget) {
        // Can move behind friendly barricade
        if (canMoveBehindBarricade(piece, col, row)) {
          moves.push({ col, row, canCapture: false })
        } else if (pieceAtTarget.team !== piece.team) {
          // Can ram enemy pieces horizontally/vertically
          moves.push({ col, row, canCapture: true })
        }
        break
      }

      moves.push({ col, row, canCapture: false })
    }
  }

  // Diagonal movement (no ramming)
  for (const dir of diagonalDirections) {
    for (let distance = 1; distance <= 2; distance++) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]

      // Cannot go on water (row 6, except bridge at F6)
      if (row === 6 && col !== 'F') break

      // Check if path is blocked (for distance 2, check the middle square)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir.dc
        const midRow = piece.row + dir.dr
        const midCol = columns[midColIndex]

        // Cannot pass through water
        if (midRow === 6 && midCol !== 'F') break

        const pieceInPath = getPieceAtAboveGround(midCol, midRow)
        if (pieceInPath) break
      }

      const pieceAtTarget = getPieceAtAboveGround(col, row)

      // Cannot capture diagonally, but can move behind friendly barricade
      // Can move onto squares with tunnel soldiers (they're underground)
      if (pieceAtTarget) {
        if (canMoveBehindBarricade(piece, col, row)) {
          moves.push({ col, row, canCapture: false })
        }
        break
      }

      moves.push({ col, row, canCapture: false })
    }
  }

  return moves
}

// Submarine movement: moves 1-2 squares horizontally on water (row 6), can go under bridge, can ram ships
function getValidMovesForSub(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  // Sub can only move on water (row 6)
  // Moves left or right, 1 or 2 squares
  const directions = [-1, 1]  // left, right

  for (const dir of directions) {
    for (let distance = 1; distance <= 2; distance++) {
      const targetColIndex = pieceColIndex + (distance * dir)

      // Check if target is on the board
      if (targetColIndex < 0 || targetColIndex >= 11) break

      const targetCol = columns[targetColIndex]

      // Check if path is blocked (for distance 2, check the middle square)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir
        const midCol = columns[midColIndex]
        const pieceInPath = getPieceAt(midCol, 6)

        // Sub goes under the bridge (F6) - can pass through
        if (pieceInPath && midCol !== 'F') {
          // Blocked by piece (unless it's the bridge square)
          break
        }
      }

      const pieceAtTarget = getPieceAt(targetCol, 6)

      if (pieceAtTarget) {
        // Can ram any enemy piece on water
        if (pieceAtTarget.team !== piece.team) {
          moves.push({ col: targetCol, row: 6, canCapture: true })
        }
        // Can't move past other pieces
        break
      } else {
        moves.push({ col: targetCol, row: 6, canCapture: false })
      }
    }
  }

  return moves
}

// Tank shooting: diagonal 1-2 squares
function getShootTargetsForTank(piece: Piece): { col: string; row: number }[] {
  const targets: { col: string; row: number }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  // Diagonal directions
  const diagonals = [
    { dc: 1, dr: 1 },   // up-right
    { dc: -1, dr: 1 },  // up-left
    { dc: 1, dr: -1 },  // down-right
    { dc: -1, dr: -1 }, // down-left
  ]

  // Can shoot 1 or 2 squares diagonally
  for (const dir of diagonals) {
    for (const distance of [1, 2]) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

      const col = columns[colIndex]
      const pieceAtTarget = getPieceAt(col, row)

      // Can only shoot if there's an enemy piece there
      if (pieceAtTarget && pieceAtTarget.team !== piece.team) {
        // Check if target is in trench or tunnel (cannot be shot)
        if (!pieceAtTarget.inTrench && !pieceAtTarget.inTunnel) {
          targets.push({ col, row })
        }
      }
    }
  }

  return targets
}

// Ship movement: 1 or 2 squares horizontal or vertical (CAN go on water)
function getValidMovesForShip(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    for (let distance = 1; distance <= 2; distance++) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]

      // Check if path is blocked (for distance 2)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir.dc
        const midRow = piece.row + dir.dr
        const midCol = columns[midColIndex]

        const pieceInPath = getPieceAt(midCol, midRow)
        if (pieceInPath) break
      }

      const pieceAtTarget = getPieceAt(col, row)

      // Ships cannot capture by moving (they shoot)
      if (pieceAtTarget) break

      moves.push({ col, row, canCapture: false })
    }
  }

  return moves
}

// Ship shooting: 1 or 2 squares in all 4 directions (not diagonal)
function getShootTargetsForShip(piece: Piece): { col: string; row: number }[] {
  const targets: { col: string; row: number }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    for (const distance of [1, 2]) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) continue

      const col = columns[colIndex]
      const pieceAtTarget = getPieceAt(col, row)

      if (pieceAtTarget && pieceAtTarget.team !== piece.team) {
        if (!pieceAtTarget.inTrench && !pieceAtTarget.inTunnel) {
          targets.push({ col, row })
        }
      }
    }
  }

  return targets
}

// Aircraft carrier movement: 1 or 2 squares horizontal or vertical (CAN go on water, CAN capture by moving)
function getValidMovesForCarrier(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []
  const pieceColIndex = columns.indexOf(piece.col)

  const directions = [
    { dc: 0, dr: 1 },   // up
    { dc: 0, dr: -1 },  // down
    { dc: 1, dr: 0 },   // right
    { dc: -1, dr: 0 },  // left
  ]

  for (const dir of directions) {
    for (let distance = 1; distance <= 2; distance++) {
      const colIndex = pieceColIndex + dir.dc * distance
      const row = piece.row + dir.dr * distance

      if (colIndex < 0 || colIndex >= 11 || row < 1 || row > 11) break

      const col = columns[colIndex]

      // Check if path is blocked (for distance 2)
      if (distance === 2) {
        const midColIndex = pieceColIndex + dir.dc
        const midRow = piece.row + dir.dr
        const midCol = columns[midColIndex]

        const pieceInPath = getPieceAt(midCol, midRow)
        if (pieceInPath) break
      }

      const pieceAtTarget = getPieceAt(col, row)

      if (pieceAtTarget) {
        if (pieceAtTarget.team !== piece.team) {
          // Can capture enemy by ramming
          moves.push({ col, row, canCapture: true })
        }
        break // Stop in this direction after hitting any piece
      }

      moves.push({ col, row, canCapture: false })
    }
  }

  return moves
}

// Check if a square is a helipad
function isHelipadSquare(col: string, row: number): boolean {
  return (col === 'C' && (row === 5 || row === 7)) ||
         (col === 'I' && (row === 5 || row === 7))
}

// Machine gun shooting: 1-4 squares forward (vertical), only if path is clear
function getShootTargetsForMachineGun(piece: Piece): { col: string; row: number }[] {
  const targets: { col: string; row: number }[] = []

  // Direction: yellow shoots up (+1), green shoots down (-1)
  const directionSign = piece.team === 'yellow' ? 1 : -1

  // Check up to 4 squares in the forward direction
  for (let distance = 1; distance <= 4; distance++) {
    const targetRow = piece.row + (distance * directionSign)

    if (targetRow < 1 || targetRow > 11) break

    const pieceAtTarget = getPieceAt(piece.col, targetRow)

    if (pieceAtTarget) {
      // Found a piece - can shoot if enemy
      if (pieceAtTarget.team !== piece.team) {
        // Check if target is in trench or tunnel (cannot be shot)
        if (!pieceAtTarget.inTrench && !pieceAtTarget.inTunnel) {
          targets.push({ col: piece.col, row: targetRow })
        }
      }
      // Path is blocked after this piece, stop checking further
      break
    }
  }

  return targets
}

// Rocket targeting: select center of 3x3 explosion area (anywhere on board except edges)
function getValidTargetsForRocket(piece: Piece): { col: string; row: number }[] {
  // Rocket can't be used if already used
  if (piece.used) return []

  // Rocket can only be used after 45 team turns
  if (!isRocketReadyForTeam(piece.team)) return []

  const targets: { col: string; row: number }[] = []

  // Can target any square where a 3x3 area fits (rows 2-10, columns B-J)
  for (let row = 2; row <= 10; row++) {
    for (let colIndex = 1; colIndex <= 9; colIndex++) {
      const col = columns[colIndex]
      targets.push({ col, row })
    }
  }

  return targets
}

// Get 3x3 area around center
function getRocketExplosionArea(centerCol: string, centerRow: number): { col: string; row: number }[] {
  const area: { col: string; row: number }[] = []
  const centerColIndex = columns.indexOf(centerCol)

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const row = centerRow + dr
      const colIndex = centerColIndex + dc
      if (row >= 1 && row <= 11 && colIndex >= 0 && colIndex < 11) {
        area.push({ col: columns[colIndex], row })
      }
    }
  }

  return area
}

// Helicopter movement: can fly to helipads or own team's carriers
function getValidMovesForHelicopter(piece: Piece): { col: string; row: number; canCapture: boolean }[] {
  const moves: { col: string; row: number; canCapture: boolean }[] = []

  // All helipad locations
  const helipads = [
    { col: 'C', row: 5 },
    { col: 'C', row: 7 },
    { col: 'I', row: 5 },
    { col: 'I', row: 7 },
  ]

  // Check each helipad
  for (const pad of helipads) {
    // Can't move to current position
    if (pad.col === piece.col && pad.row === piece.row) continue

    const pieceAtTarget = getPieceAtAboveGround(pad.col, pad.row)

    if (pieceAtTarget) {
      // Can capture enemy on helipad, but NOT other helicopters
      if (pieceAtTarget.team !== piece.team && pieceAtTarget.type !== 'helicopter') {
        moves.push({ col: pad.col, row: pad.row, canCapture: true })
      }
      // Can't land if own piece is there, or if enemy helicopter
    } else {
      moves.push({ col: pad.col, row: pad.row, canCapture: false })
    }
  }

  // Check own team's carriers
  for (const p of pieces) {
    if (p.type === 'carrier' && p.team === piece.team) {
      // Can't move to current position
      if (p.col === piece.col && p.row === piece.row) continue

      // Can land on own carrier if it doesn't have a helicopter already
      if (!p.hasHelicopter) {
        moves.push({ col: p.col, row: p.row, canCapture: false })
      }
    }
  }

  return moves
}

// Launch helicopter from carrier - show valid landing spots
function launchHelicopterFromCarrier() {
  if (!selectedPiece || selectedPiece.type !== 'carrier' || !selectedPiece.hasHelicopter) return

  // Get valid helipad destinations
  const helipads = [
    { col: 'C', row: 5 },
    { col: 'C', row: 7 },
    { col: 'I', row: 5 },
    { col: 'I', row: 7 },
  ]

  helicopterLaunchSpots = []
  for (const pad of helipads) {
    const pieceAtPad = getPieceAtAboveGround(pad.col, pad.row)
    // Can land on empty helipad or capture enemy (except other helicopters)
    if (!pieceAtPad || (pieceAtPad.team !== selectedPiece.team && pieceAtPad.type !== 'helicopter')) {
      helicopterLaunchSpots.push(pad)
    }
  }

  if (helicopterLaunchSpots.length === 0) {
    message = t('noHelipads')
    render()
    return
  }

  helicopterLaunchMode = true
  showCarrierActions = false
  validMoves = []
  message = t('selectHelipad')
  render()
}

// Complete helicopter launch to selected helipad
function completeHelicopterLaunch(col: string, row: number) {
  if (!selectedPiece || selectedPiece.type !== 'carrier' || !helicopterLaunchMode) return

  // Play helicopter sound
  playSound('helicopter')

  const carrier = selectedPiece
  const pieceAtTarget = getPieceAtAboveGround(col, row)

  // Capture enemy if present
  if (pieceAtTarget && pieceAtTarget.team !== carrier.team) {
    const index = pieces.indexOf(pieceAtTarget)
    if (index !== -1) {
      pieces.splice(index, 1)
      capturedPieces.push(pieceAtTarget)
      checkBuilderCaptured(pieceAtTarget, carrier.team)
    }
  }

  // Create helicopter at destination
  const newHelicopter: Piece = {
    type: 'helicopter',
    team: carrier.team,
    col: col,
    row: row,
    points: 8
  }
  pieces.push(newHelicopter)

  // Remove helicopter from carrier
  carrier.hasHelicopter = false

  // Log the launch
  moveLog.push({
    from: `${carrier.col}${carrier.row}`,
    to: `${col}${row}`,
    piece: 'helicopter',
    team: carrier.team,
    captured: pieceAtTarget ? pieceAtTarget.type : 'launched'
  })

  message = pieceAtTarget ? `Helicopter launched and captured ${pieceAtTarget.type}!` : "Helicopter launched!"

  // Increment turn count
  if (carrier.team === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Clear selection
  selectedPiece = null
  validMoves = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []
  showCarrierActions = false

  render()
}

function selectPiece(piece: Piece) {
  // Check if it's this team's turn
  if (piece.team !== currentTurn) {
    message = `It's ${currentTurn}'s turn! You cannot move ${piece.team}'s pieces.`
    render()
    return
  }

  // Check if piece is frozen
  if (piece.frozenTurns && piece.frozenTurns > 0) {
    message = `This piece is frozen! (${piece.frozenTurns} turns left)`
    render()
    return
  }

  // Check if there's a forced trench soldier that must move
  const forcedSoldier = checkForcedTrenchExit()
  if (forcedSoldier && piece !== forcedSoldier) {
    message = `Soldier at ${forcedSoldier.col}${forcedSoldier.row} MUST leave the trench first!`
    render()
    return
  }

  selectedPiece = piece
  message = null
  actionMode = null
  shootTargets = []
  hackTargets = []
  playSound('click')
  selectedHackTarget = null
  showHackActions = false
  bombTargets = []
  selectedBombTarget = null
  landingSpots = []
  showBuilderActions = false
  showCarrierActions = false
  builderPlacementMode = null
  builderPlacementSpots = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []

  if (piece.type === 'train') {
    validMoves = getValidMovesForTrain(piece)
  } else if (piece.type === 'soldier') {
    // Calculate turns in trench based on team turn count
    const currentTeamTurn = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
    const turnsInTrench = piece.inTrench && piece.trenchEnteredOnTurn !== undefined
      ? currentTeamTurn - piece.trenchEnteredOnTurn
      : 0

    // Check if soldier must leave trench (after 3 team turns)
    if (piece.inTrench && turnsInTrench >= 3) {
      // Force move mode - cannot shoot, must leave
      actionMode = 'move'
      showSoldierActions = false
      validMoves = getValidMovesForSoldier(piece).filter(m => !isTrenchSquare(m.col, m.row))

      if (validMoves.length === 0) {
        // Cannot leave trench - soldier is eliminated
        message = t('soldierTrapped')
        const index = pieces.indexOf(piece)
        pieces.splice(index, 1)
        capturedPieces.push(piece)
        // Log the elimination
        moveLog.push({
          from: `${piece.col}${piece.row}`,
          to: `${piece.col}${piece.row}`,
          piece: piece.type,
          team: piece.team,
          captured: 'trapped'
        })
        selectedPiece = null
        forcedTrenchSoldier = null
        // Switch turns and increment turn count
        if (currentTurn === 'yellow') yellowTurnCount++
        else greenTurnCount++
        switchTurn()
        render()
        return
      } else {
        message = `⚠️ MUST leave trench NOW! (3 turns reached)`
      }
    } else if (piece.inTrench) {
      // Show how many turns left in trench
      showSoldierActions = true
      validMoves = []
      message = `In trench (${turnsInTrench}/3 turns)`
    } else {
      // Auto-select move action, but keep buttons visible to switch
      showSoldierActions = true
      actionMode = 'move'
      validMoves = getValidMovesForSoldier(piece)
    }
  } else if (piece.type === 'tank') {
    // Auto-select move action, but keep buttons visible to switch
    showSoldierActions = true
    actionMode = 'move'
    validMoves = getValidMovesForTank(piece)
  } else if (piece.type === 'ship') {
    // Auto-select move action, but keep buttons visible to switch
    showSoldierActions = true
    actionMode = 'move'
    validMoves = getValidMovesForShip(piece)
  } else if (piece.type === 'carrier') {
    // Carrier can move (captures by ramming)
    validMoves = getValidMovesForCarrier(piece)
    showSoldierActions = false
    // Show launch button if helicopter is on carrier
    showCarrierActions = piece.hasHelicopter === true
  } else if (piece.type === 'helicopter') {
    // Helicopter can fly to helipads or own carriers
    validMoves = getValidMovesForHelicopter(piece)
    showSoldierActions = false
  } else if (piece.type === 'rocket') {
    // Rocket can target 3x3 area
    if (piece.used) {
      message = t('rocketUsed')
      validMoves = []
    } else if (!isRocketReadyForTeam(piece.team)) {
      const teamTurns = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      message = `Rocket not ready yet! (${teamTurns}/${ROCKET_READY_TURN} turns)`
      validMoves = []
    } else {
      rocketTargetArea = getValidTargetsForRocket(piece).map(t => ({ col: t.col, row: t.row }))
      message = t('selectRocketTarget')
      validMoves = []
    }
    showSoldierActions = false
  } else if (piece.type === 'machinegun') {
    // Machine gun can only shoot, cannot move
    validMoves = []
    shootTargets = getShootTargetsForMachineGun(piece)
    if (shootTargets.length === 0) {
      message = t('noBombTargets')
    } else {
      message = t('selectTarget')
    }
    showSoldierActions = false
    actionMode = 'shoot'
  } else if (piece.type === 'suv') {
    // SUV can only move, cannot shoot
    validMoves = getValidMovesForSuv(piece)
    showSoldierActions = false
  } else if (piece.type === 'sub') {
    // Submarine moves 2 forward, can ram ships
    validMoves = getValidMovesForSub(piece)
    showSoldierActions = false
    if (validMoves.length === 0) {
      message = t('noValidMoves')
    }
  } else if (piece.type === 'hacker') {
    // Hacker can hack enemy pieces
    validMoves = []
    showSoldierActions = false
    hackTargets = []
    selectedHackTarget = null
    showHackActions = false

    if (!isHackerReadyForTeam(piece.team)) {
      const teamTurns = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      message = `Hacker not ready yet! (${teamTurns}/${HACKER_READY_TURN} turns)`
    } else if (isHackerOnCooldown(piece)) {
      const remaining = getHackerCooldownRemaining(piece)
      message = `Hacker on cooldown! (${remaining} turns)`
    } else {
      // Get all enemy pieces that can be hacked (rockets, machine gunners, and soldiers in tunnels are immune)
      hackTargets = pieces.filter(p => p.team !== piece.team && p.type !== 'hacker' && p.type !== 'rocket' && p.type !== 'machinegun' && !(p.type === 'soldier' && p.inTunnel))
      if (hackTargets.length === 0) {
        message = t('noHackTargets')
      } else {
        message = t('selectHackTarget')
      }
    }
  } else if (piece.type === 'fighter') {
    // Fighter can bomb enemy pieces and then land nearby
    validMoves = []
    showSoldierActions = false
    bombTargets = []
    selectedBombTarget = null
    landingSpots = []

    if (!isFighterReadyForTeam(piece.team)) {
      const teamTurns = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      message = `Fighter not ready yet! (${teamTurns}/${FIGHTER_READY_TURN} turns)`
    } else if (isFighterOnCooldown(piece)) {
      const remaining = getFighterCooldownRemaining(piece)
      message = `Fighter on cooldown! (${remaining} turns)`
    } else {
      // Get all enemy pieces that can be bombed
      bombTargets = getValidBombTargets(piece)
      if (bombTargets.length === 0) {
        message = t('noBombTargets')
      } else {
        message = t('selectBombTarget')
      }
    }
  } else if (piece.type === 'builder') {
    // Builder can move and build barricades/artillery/spikes
    validMoves = getValidMovesForBuilder(piece)
    showSoldierActions = false
    showBuilderActions = true
    builderPlacementMode = null
    builderPlacementSpots = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []

    const canBarricade = canBuilderBuildBarricade(piece)
    const canArtillery = canBuilderBuildArtillery(piece)
    const canSpike = canBuilderBuildSpike(piece)

    if (!canBarricade && !canArtillery && !canSpike) {
      const teamTurns = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      if (teamTurns < BUILDER_READY_TURN) {
        message = `Builder ready at turn ${BUILDER_READY_TURN} (${teamTurns}/${BUILDER_READY_TURN})`
      } else {
        message = t('builderWaitCooldown')
      }
    } else {
      message = t('builderChooseAction')
    }
  } else if (piece.type === 'artillery') {
    // Artillery can fire at random position
    validMoves = []
    showSoldierActions = false

    const teamTurns = piece.team === 'yellow' ? yellowTurnCount : greenTurnCount
    if (teamTurns < ARTILLERY_READY_TURN) {
      message = `Artillery ready at turn ${ARTILLERY_READY_TURN} (${teamTurns}/${ARTILLERY_READY_TURN})`
    } else {
      message = t('clickToFireArtillery')
      // Will handle firing in handleSquareClick
    }
  } else if (piece.type === 'barricade') {
    // Barricade cannot move
    validMoves = []
    showSoldierActions = false
    message = t('barricadeInfo')
  }

  render()
}

function selectSoldierAction(action: 'move' | 'shoot') {
  if (!selectedPiece) return
  if (selectedPiece.type !== 'soldier' && selectedPiece.type !== 'tank' && selectedPiece.type !== 'ship') return

  actionMode = action
  // Keep showing action buttons so user can switch

  if (action === 'move') {
    if (selectedPiece.type === 'soldier') {
      validMoves = getValidMovesForSoldier(selectedPiece)
    } else if (selectedPiece.type === 'tank') {
      validMoves = getValidMovesForTank(selectedPiece)
    } else if (selectedPiece.type === 'ship') {
      validMoves = getValidMovesForShip(selectedPiece)
    }
    shootTargets = []
    message = null
  } else if (action === 'shoot') {
    validMoves = []
    if (selectedPiece.type === 'soldier') {
      shootTargets = getShootTargetsForSoldier(selectedPiece)
    } else if (selectedPiece.type === 'tank') {
      shootTargets = getShootTargetsForTank(selectedPiece)
    } else if (selectedPiece.type === 'ship') {
      shootTargets = getShootTargetsForShip(selectedPiece)
    }
    if (shootTargets.length === 0) {
      message = t('noTargetsInRange')
    } else {
      message = null
    }
  }

  render()
}

// Check if square is a tunnel entrance (E4, E8, G4, G8)
function isTunnelEntrance(col: string, row: number): boolean {
  return (col === 'E' || col === 'G') && (row === 4 || row === 8)
}

function movePiece(col: string, row: number) {
  if (!selectedPiece) return

  const move = validMoves.find(m => m.col === col && m.row === row)

  if (!move) {
    message = t('cannotMoveThere')
    render()
    return
  }

  const pieceAtTarget = getPieceAt(col, row)

  if (pieceAtTarget) {
    // Special case: helicopter landing on own carrier
    if (selectedPiece.type === 'helicopter' && pieceAtTarget.type === 'carrier' && pieceAtTarget.team === selectedPiece.team) {
      // Land on carrier
      pieceAtTarget.hasHelicopter = true
      const heliIndex = pieces.indexOf(selectedPiece)
      pieces.splice(heliIndex, 1)

      message = t('helicopterLanded')

      // Log the move
      moveLog.push({
        from: `${selectedPiece.col}${selectedPiece.row}`,
        to: `${col}${row}`,
        piece: selectedPiece.type,
        team: selectedPiece.team
      })

      // Increment turn count
      if (selectedPiece.team === 'yellow') yellowTurnCount++
      else greenTurnCount++

      // Switch turns
      switchTurn()

      // Deselect
      selectedPiece = null
      validMoves = []

      render()
      return
    }

    // Special case: moving behind friendly barricade
    if (pieceAtTarget.type === 'barricade' && pieceAtTarget.team === selectedPiece.team) {
      // Move the piece to the same square as the barricade
      completMove(col, row, null)
      return
    }

    // Special case: soldier in tunnel moving under an enemy piece (no capture)
    if (selectedPiece.type === 'soldier' && selectedPiece.inTunnel && !move.canCapture) {
      // Move under the enemy piece without capturing
      completMove(col, row, null)
      return
    }

    // Special case: enemy soldier is in tunnel (underground) - cannot be captured, move above them
    if (pieceAtTarget.type === 'soldier' && pieceAtTarget.inTunnel) {
      // Move on top of the tunnel soldier without capturing
      completMove(col, row, null)
      return
    }

    if (pieceAtTarget.team === selectedPiece.team) {
      message = t('teamPieceBlocking')
      render()
      return
    } else if (selectedPiece.type === 'train') {
      // Train hit animation
      animateTrainHit(selectedPiece, pieceAtTarget, col, row)
      return
    } else if (selectedPiece.type === 'carrier') {
      // Carrier rams enemy - capture and move to 1 square before target
      const index = pieces.indexOf(pieceAtTarget)
      pieces.splice(index, 1)
      capturedPieces.push(pieceAtTarget)
      checkBuilderCaptured(pieceAtTarget, selectedPiece.team)
      message = `Rammed enemy ${pieceAtTarget.type} (+${pieceAtTarget.points} points)!`

      // Calculate position 1 square before target
      const fromColIndex = columns.indexOf(selectedPiece.col)
      const toColIndex = columns.indexOf(col)
      const colDiff = toColIndex - fromColIndex
      const rowDiff = row - selectedPiece.row

      // Move to 1 square before target (half the distance if moving 2, or stay if moving 1)
      let newCol = col
      let newRow = row
      if (Math.abs(colDiff) === 2) {
        newCol = columns[fromColIndex + colDiff / 2]
      } else if (Math.abs(rowDiff) === 2) {
        newRow = selectedPiece.row + rowDiff / 2
      }
      // If moving 1 square, carrier stays at original position
      else {
        newCol = selectedPiece.col
        newRow = selectedPiece.row
      }

      // Log the move
      moveLog.push({
        from: `${selectedPiece.col}${selectedPiece.row}`,
        to: `${newCol}${newRow}`,
        piece: selectedPiece.type,
        team: selectedPiece.team,
        captured: pieceAtTarget.type,
        capturedPoints: pieceAtTarget.points
      })

      // Move carrier to new position
      selectedPiece.col = newCol
      selectedPiece.row = newRow

      // Increment turn count
      if (selectedPiece.team === 'yellow') yellowTurnCount++
      else greenTurnCount++

      // Switch turns
      switchTurn()

      // Deselect
      selectedPiece = null
      validMoves = []

      render()
      return
    } else if (pieceAtTarget.type === 'carrier') {
      // Ramming a carrier - carrier has HP system
      if (pieceAtTarget.hp && pieceAtTarget.hp > 1) {
        // First hit - destroy helicopter if present, reduce HP
        pieceAtTarget.hp -= 1
        if (pieceAtTarget.hasHelicopter) {
          pieceAtTarget.hasHelicopter = false
          message = `Rammed carrier! Helicopter destroyed! (${pieceAtTarget.hp} HP left)`
        } else {
          message = `Rammed carrier! (${pieceAtTarget.hp} HP left)`
        }

        // Log the hit
        moveLog.push({
          from: `${selectedPiece.col}${selectedPiece.row}`,
          to: `${col}${row}`,
          piece: selectedPiece.type,
          team: selectedPiece.team,
          captured: 'hit'
        })

        // Attacker moves back 1 square (stays at position before target)
        const fromColIndex = columns.indexOf(selectedPiece.col)
        const toColIndex = columns.indexOf(col)
        const colDiff = toColIndex - fromColIndex
        const rowDiff = row - selectedPiece.row

        // Calculate 1 square before target
        let newCol = selectedPiece.col
        let newRow = selectedPiece.row
        if (Math.abs(colDiff) === 2) {
          newCol = columns[fromColIndex + colDiff / 2]
        } else if (Math.abs(rowDiff) === 2) {
          newRow = selectedPiece.row + rowDiff / 2
        }
        // If moving 1 square, attacker stays at original position

        selectedPiece.col = newCol
        selectedPiece.row = newRow

        // Increment turn count
        if (selectedPiece.team === 'yellow') yellowTurnCount++
        else greenTurnCount++

        switchTurn()
        selectedPiece = null
        validMoves = []

        render()
        return
      } else {
        // Final hit - destroy carrier
        const index = pieces.indexOf(pieceAtTarget)
        pieces.splice(index, 1)
        capturedPieces.push(pieceAtTarget)
        message = `Destroyed carrier! (+${pieceAtTarget.points} points)!`
      }
    } else {
      // Capture enemy piece (helicopter, etc.)
      const index = pieces.indexOf(pieceAtTarget)
      pieces.splice(index, 1)
      capturedPieces.push(pieceAtTarget)
      message = `Captured enemy ${pieceAtTarget.type} (+${pieceAtTarget.points} points)!`
    }
  }

  // Check if soldier is moving to a tunnel entrance
  if (selectedPiece.type === 'soldier' && !selectedPiece.inTunnel && isTunnelEntrance(col, row)) {
    // Store the pending move and show confirmation
    pendingTunnelMove = { col, row }
    gameState = 'confirmTunnel'
    render()
    return
  }

  // Complete the move
  completMove(col, row, null)
}

function animateTrainHit(train: Piece, target: Piece, targetCol: string, targetRow: number) {
  const movingTeam = train.team
  const startCol = train.col
  const startRow = train.row

  // Phase 1: Train charges towards target
  trainHitAnimation = {
    train: train,
    targetCol: targetCol,
    targetRow: targetRow,
    phase: 'moving'
  }
  message = t('charging')
  render()

  const chargeDuration = 400
  const startTime = Date.now()
  const startColIndex = columns.indexOf(startCol)
  const targetColIndex = columns.indexOf(targetCol)

  function animateCharge() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / chargeDuration, 1)

    // Update train position visually (we'll use a transform)
    if (trainHitAnimation) {
      trainHitAnimation.phase = 'moving'
      // Store progress in a way we can read it
      ;(trainHitAnimation as any).progress = progress
    }
    render()

    if (progress < 1) {
      requestAnimationFrame(animateCharge)
    } else {
      // Phase 2: Impact
      trainHitAnimation = { ...trainHitAnimation!, phase: 'impact' }
      explosionAt = { col: targetCol, row: targetRow }
      playSound('explosion')
      triggerScreenShake()

      // Remove target
      const index = pieces.indexOf(target)
      pieces.splice(index, 1)
      capturedPieces.push(target)
      checkBuilderCaptured(target, movingTeam)

      render()

      // Phase 3: Complete move
      setTimeout(() => {
        trainHitAnimation = null
        explosionAt = null

        // Move train to target position
        train.col = targetCol
        train.row = targetRow

        message = `Ran over enemy ${target.type} (+${target.points} points)!`

        // Log the move
        moveLog.push({
          from: `${startCol}${startRow}`,
          to: `${targetCol}${targetRow}`,
          piece: train.type,
          team: movingTeam,
          captured: target.type,
          capturedPoints: target.points
        })

        // Increment turn count
        if (movingTeam === 'yellow') yellowTurnCount++
        else greenTurnCount++

        // Switch turns
        switchTurn()

        // Deselect
        selectedPiece = null
        validMoves = []
        actionMode = null
        showSoldierActions = false

        render()
      }, 500 * getSpeedMultiplier())
    }
  }

  requestAnimationFrame(animateCharge)
}

function completMove(col: string, row: number, capturedPiece: Piece | null) {
  if (!selectedPiece) return

  const piece = selectedPiece
  const movingTeam = piece.team
  const fromCol = piece.col
  const fromRow = piece.row

  // Play sound based on piece type
  if (capturedPiece) {
    playSound('capture')
  } else {
    // Play appropriate move sound based on piece type
    switch (piece.type) {
      case 'soldier':
        playSound('walk')
        break
      case 'tank':
      case 'suv':
        playSound('engine')
        break
      case 'train':
        playSound('train')
        break
      case 'ship':
      case 'sub':
      case 'carrier':
        playSound('boat')
        break
      case 'helicopter':
        playSound('helicopter')
        break
      case 'hacker':
        playSound('hack')
        break
      case 'builder':
        playSound('build')
        break
      default:
        playSound('move')
    }
  }

  // Start movement animation
  moveAnimation = {
    piece: piece,
    fromCol: fromCol,
    fromRow: fromRow,
    toCol: col,
    toRow: row,
    progress: 0
  }

  // Clear selection immediately so squares don't show as valid
  selectedPiece = null
  validMoves = []
  actionMode = null
  showSoldierActions = false

  render()

  const moveDuration = getAnimationDuration()
  const startTime = Date.now()

  function animateMove() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / moveDuration, 1)

    if (moveAnimation) {
      moveAnimation.progress = progress
    }
    render()

    if (progress < 1) {
      requestAnimationFrame(animateMove)
    } else {
      // Animation complete - finalize the move
      moveAnimation = null

      // Log the move
      moveLog.push({
        from: `${fromCol}${fromRow}`,
        to: `${col}${row}`,
        piece: piece.type,
        team: movingTeam,
        captured: capturedPiece?.type,
        capturedPoints: capturedPiece?.points
      })

      // Check if soldier is entering trench
      if (piece.type === 'soldier' && !piece.inTrench && isTrenchSquare(col, row)) {
        const currentTeamTurn = movingTeam === 'yellow' ? yellowTurnCount : greenTurnCount
        piece.inTrench = true
        piece.trenchEnteredOnTurn = currentTeamTurn
        message = t('enteredTrenchTurn').replace('{0}', '0')
      }
      // If soldier was in trench and is leaving
      else if (piece.type === 'soldier' && piece.inTrench && !isTrenchSquare(col, row)) {
        piece.inTrench = false
        piece.trenchEnteredOnTurn = undefined
        message = t('leftTrench')
      }

      // Move the piece
      piece.col = col
      piece.row = row

      // Increment turn count for the team that just moved
      if (movingTeam === 'yellow') yellowTurnCount++
      else greenTurnCount++

      // Switch turns
      switchTurn()

      render()

      // Clear explosion after animation
      if (explosionAt) {
        setTimeout(() => {
          explosionAt = null
          render()
        }, 500 * getSpeedMultiplier())
      }
    }
  }

  requestAnimationFrame(animateMove)
}

function confirmEnterTunnel() {
  if (!selectedPiece || !pendingTunnelMove) return

  const movingTeam = selectedPiece.team
  const fromPos = `${selectedPiece.col}${selectedPiece.row}`

  // Move to tunnel and enter it
  selectedPiece.col = pendingTunnelMove.col
  selectedPiece.row = pendingTunnelMove.row
  selectedPiece.inTunnel = true

  // Log the move
  moveLog.push({
    from: fromPos,
    to: `${pendingTunnelMove.col}${pendingTunnelMove.row}`,
    piece: selectedPiece.type,
    team: movingTeam
  })

  message = t('enteredTunnel')

  // Increment turn count
  if (movingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Reset state
  selectedPiece = null
  validMoves = []
  actionMode = null
  showSoldierActions = false
  pendingTunnelMove = null
  gameState = 'playing'

  render()
}

function declineEnterTunnel() {
  if (!selectedPiece || !pendingTunnelMove) return

  // Clear state before completing move
  message = null
  gameState = 'playing'

  const col = pendingTunnelMove.col
  const row = pendingTunnelMove.row
  pendingTunnelMove = null

  // Just move to the square without entering tunnel
  completMove(col, row, null)
}

function showTunnelExitConfirm() {
  if (!selectedPiece || !canExitTunnel(selectedPiece)) return
  pendingTunnelExit = selectedPiece
  gameState = 'confirmTunnelExit'
  render()
}

function confirmExitTunnel() {
  if (!pendingTunnelExit) return

  const movingTeam = pendingTunnelExit.team

  // Exit the tunnel (stay on same square but no longer in tunnel)
  pendingTunnelExit.inTunnel = false

  // Log the exit
  moveLog.push({
    from: `${pendingTunnelExit.col}${pendingTunnelExit.row} (tunnel)`,
    to: `${pendingTunnelExit.col}${pendingTunnelExit.row}`,
    piece: pendingTunnelExit.type,
    team: movingTeam
  })

  message = t('exitedTunnel')

  // Increment turn count
  if (movingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Reset state
  selectedPiece = null
  validMoves = []
  actionMode = null
  showSoldierActions = false
  pendingTunnelExit = null
  gameState = 'playing'

  render()
}

function declineExitTunnel() {
  pendingTunnelExit = null
  gameState = 'playing'
  render()
}

function shootPiece(col: string, row: number) {
  if (!selectedPiece) return

  const target = shootTargets.find(t => t.col === col && t.row === row)
  if (!target) {
    message = t('cannotShootThere')
    render()
    return
  }

  // Check for barricade first - barricades block shots to pieces behind them
  const barricadeAtTarget = getBarricadeAt(col, row)
  const pieceAtTarget = barricadeAtTarget || getPieceExcludingBarricade(col, row)
  if (!pieceAtTarget) {
    message = t('noTargetToShoot')
    render()
    return
  }

  const shooter = selectedPiece
  const shootingTeam = shooter.team

  playSound('shoot')

  // Trigger visual shooting effect - bullet from gun to target
  triggerShootingEffect(shooter.col, shooter.row, col, row)

  // Handle shooting barricade - destroy it
  if (pieceAtTarget.type === 'barricade') {
    const index = pieces.indexOf(pieceAtTarget)
    pieces.splice(index, 1)
    message = `Destroyed enemy barricade!`

    // Log the shot
    moveLog.push({
      from: `${shooter.col}${shooter.row}`,
      to: `${col}${row}`,
      piece: shooter.type,
      team: shootingTeam,
      captured: 'barricade'
    })

    // Increment turn count
    if (shootingTeam === 'yellow') yellowTurnCount++
    else greenTurnCount++

    // Switch turns
    switchTurn()

    // Deselect
    selectedPiece = null
    validMoves = []
    shootTargets = []
    actionMode = null

    render()
    return
  }

  // Handle carrier with HP
  if (pieceAtTarget.type === 'carrier' && pieceAtTarget.hp && pieceAtTarget.hp > 1) {
    // First hit - reduce HP, destroy helicopter if present
    pieceAtTarget.hp -= 1
    if (pieceAtTarget.hasHelicopter) {
      pieceAtTarget.hasHelicopter = false
      message = `Hit carrier! Helicopter destroyed! (${pieceAtTarget.hp} HP left)`
    } else {
      message = `Hit carrier! (${pieceAtTarget.hp} HP left)`
    }

    // Log the hit
    moveLog.push({
      from: `${shooter.col}${shooter.row}`,
      to: `${col}${row}`,
      piece: shooter.type,
      team: shootingTeam,
      captured: 'hit'
    })
  } else {
    // Normal kill or final carrier hit
    const index = pieces.indexOf(pieceAtTarget)
    pieces.splice(index, 1)
    capturedPieces.push(pieceAtTarget)
    checkBuilderCaptured(pieceAtTarget, shootingTeam)
    message = `Shot enemy ${pieceAtTarget.type} (+${pieceAtTarget.points} points)!`

    // Log the shot
    moveLog.push({
      from: `${shooter.col}${shooter.row}`,
      to: `${col}${row}`,
      piece: shooter.type,
      team: shootingTeam,
      captured: pieceAtTarget.type,
      capturedPoints: pieceAtTarget.points
    })
  }

  // Increment turn count
  if (shootingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Deselect
  selectedPiece = null
  validMoves = []
  shootTargets = []
  actionMode = null
  showSoldierActions = false

  render()
}

// Launch rocket at target location
function launchRocket(rocket: Piece, targetCol: string, targetRow: number) {
  const launchingTeam = rocket.team

  // Play rocket sound
  playSound('rocket')

  // Start rocket animation
  rocketAnimation = {
    rocket: rocket,
    targetCol: targetCol,
    targetRow: targetRow,
    phase: 'launching',
    progress: 0
  }

  message = t('rocketLaunching')
  render()

  const speedMult = getSpeedMultiplier()
  const launchDuration = 600 * speedMult
  const flyDuration = 400 * speedMult
  const explosionDuration = 800 * speedMult
  const startTime = Date.now()

  function animate() {
    const elapsed = Date.now() - startTime

    if (elapsed < launchDuration) {
      // Phase 1: Launching (rocket goes up)
      rocketAnimation!.phase = 'launching'
      rocketAnimation!.progress = elapsed / launchDuration
      render()
      requestAnimationFrame(animate)
    } else if (elapsed < launchDuration + flyDuration) {
      // Phase 2: Flying (rocket moves to target)
      rocketAnimation!.phase = 'flying'
      rocketAnimation!.progress = (elapsed - launchDuration) / flyDuration
      render()
      requestAnimationFrame(animate)
    } else if (elapsed < launchDuration + flyDuration + explosionDuration) {
      // Phase 3: Exploding
      rocketAnimation!.phase = 'exploding'
      rocketAnimation!.progress = (elapsed - launchDuration - flyDuration) / explosionDuration

      // Apply damage on first frame of explosion
      if (rocketAnimation!.progress < 0.1) {
        applyRocketDamage(targetCol, targetRow, launchingTeam)
      }

      render()
      requestAnimationFrame(animate)
    } else {
      // Animation complete
      rocketAnimation = null

      // Remove rocket from the board (it's been launched)
      const rocketIndex = pieces.indexOf(rocket)
      if (rocketIndex !== -1) {
        pieces.splice(rocketIndex, 1)
      }

      // Log the launch
      moveLog.push({
        from: `${rocket.col}${rocket.row}`,
        to: `${targetCol}${targetRow}`,
        piece: rocket.type,
        team: launchingTeam,
        captured: 'explosion'
      })

      // Increment turn count
      if (launchingTeam === 'yellow') yellowTurnCount++
      else greenTurnCount++

      // Switch turns
      switchTurn()

      // Clear selection
      selectedPiece = null
      rocketTargetArea = []
      message = null

      render()
    }
  }

  requestAnimationFrame(animate)
}

// Apply rocket explosion damage in 3x3 area
function applyRocketDamage(centerCol: string, centerRow: number, launchingTeam: Team) {
  const area = getRocketExplosionArea(centerCol, centerRow)
  const piecesHit: Piece[] = []

  for (const square of area) {
    const pieceAtSquare = getPieceAt(square.col, square.row)
    if (pieceAtSquare) {
      piecesHit.push(pieceAtSquare)
    }
  }

  let totalPoints = 0

  for (const piece of piecesHit) {
    // Skip friendly pieces - rockets don't damage own team
    if (piece.team === launchingTeam) {
      continue
    }
    // Protected pieces: builder, fighter, hacker, rocket cannot be destroyed by rockets
    if (piece.type === 'builder' || piece.type === 'fighter' || piece.type === 'hacker' || piece.type === 'rocket') {
      continue  // Skip these pieces - they are immune to rocket damage
    }
    // Soldiers, helicopters, ships, trains, tanks, machine guns, SUVs, and subs die immediately
    if (piece.type === 'soldier' || piece.type === 'helicopter' || piece.type === 'ship' || piece.type === 'train' || piece.type === 'tank' || piece.type === 'machinegun' || piece.type === 'suv' || piece.type === 'sub') {
      const index = pieces.indexOf(piece)
      if (index !== -1) {
        pieces.splice(index, 1)
        capturedPieces.push(piece)
        checkBuilderCaptured(piece, launchingTeam)
        if (piece.team !== launchingTeam) {
          totalPoints += piece.points
        }
      }
    }
    // Carrier takes 1 damage
    else if (piece.type === 'carrier') {
      if (piece.hp && piece.hp > 1) {
        piece.hp -= 1
        // Also destroy helicopter if present
        if (piece.hasHelicopter) {
          piece.hasHelicopter = false
        }
      } else {
        // Carrier destroyed
        const index = pieces.indexOf(piece)
        if (index !== -1) {
          pieces.splice(index, 1)
          capturedPieces.push(piece)
          if (piece.team !== launchingTeam) {
            totalPoints += piece.points
          }
        }
      }
    }
    // Other pieces (rocket) are not affected for now
  }

  playSound('explosion')
  triggerScreenShake()

  if (totalPoints > 0) {
    message = `Rocket exploded! (+${totalPoints} points)`
  } else {
    message = t('rocketExploded')
  }
}

// Execute hack action on target
function executeHack(action: 'forward' | 'backward' | 'freeze') {
  if (!selectedPiece || selectedPiece.type !== 'hacker' || !selectedHackTarget) return

  const hacker = selectedPiece
  const target = selectedHackTarget
  const hackerTeam = hacker.team

  // Submarine moves left/right instead of forward/backward
  if (target.type === 'sub') {
    if (action === 'forward') {
      // For sub, "forward" means right
      const colIndex = columns.indexOf(target.col)
      const newColIndex = colIndex + 1
      if (newColIndex < 11) {
        const newCol = columns[newColIndex]
        const pieceAtNew = getPieceAt(newCol, 6)
        if (!pieceAtNew) {
          target.col = newCol
          target.frozenTurns = 1
          message = `Hacked ${target.type} right! (frozen 1 turn)`
        } else {
          message = t('cannotHackOccupied')
          render()
          return
        }
      } else {
        message = t('cannotHackEdge')
        render()
        return
      }
    } else if (action === 'backward') {
      // For sub, "backward" means left
      const colIndex = columns.indexOf(target.col)
      const newColIndex = colIndex - 1
      if (newColIndex >= 0) {
        const newCol = columns[newColIndex]
        const pieceAtNew = getPieceAt(newCol, 6)
        if (!pieceAtNew) {
          target.col = newCol
          target.frozenTurns = 1
          message = `Hacked ${target.type} left! (frozen 1 turn)`
        } else {
          message = t('cannotHackOccupied')
          render()
          return
        }
      } else {
        message = t('cannotHackEdge')
        render()
        return
      }
    } else if (action === 'freeze') {
      target.frozenTurns = 5
      message = `Froze ${target.type} for 5 turns!`
    }
  } else {
    // Normal pieces move forward/backward
    // Determine forward/backward direction for the target piece
    const targetForward = target.team === 'yellow' ? 1 : -1

    if (action === 'forward') {
      const newRow = target.row + targetForward
      if (newRow >= 1 && newRow <= 11) {
        const pieceAtNew = getPieceAt(target.col, newRow)
        if (!pieceAtNew) {
          // Check water
          if (newRow === 6 && target.col !== 'F' && target.type !== 'ship' && target.type !== 'carrier') {
            message = t('cannotHackWater')
            render()
            return
          }
          target.row = newRow
          target.frozenTurns = 1  // Freeze for 1 turn when hacked
          message = `Hacked ${target.type} forward! (frozen 1 turn)`
        } else {
          message = t('cannotHackOccupied')
          render()
          return
        }
      } else {
        message = t('cannotHackEdge')
        render()
        return
      }
    } else if (action === 'backward') {
      const newRow = target.row - targetForward
      if (newRow >= 1 && newRow <= 11) {
        const pieceAtNew = getPieceAt(target.col, newRow)
        if (!pieceAtNew) {
          // Check water
          if (newRow === 6 && target.col !== 'F' && target.type !== 'ship' && target.type !== 'carrier') {
            message = t('cannotHackWater')
            render()
            return
          }
          target.row = newRow
          target.frozenTurns = 1  // Freeze for 1 turn when hacked
          message = `Hacked ${target.type} backward! (frozen 1 turn)`
        } else {
          message = t('cannotHackOccupied')
          render()
          return
        }
      } else {
        message = t('cannotHackEdge')
        render()
        return
      }
    } else if (action === 'freeze') {
      target.frozenTurns = 5
      message = `Froze ${target.type} for 5 turns!`
    }
  }

  // Play hack sound
  playSound('hack')

  // Log the hack
  moveLog.push({
    from: `${hacker.col}${hacker.row}`,
    to: `${target.col}${target.row}`,
    piece: hacker.type,
    team: hackerTeam,
    captured: `hack-${action}`
  })

  // Set cooldown (15 turns)
  hacker.cooldownTurns = HACKER_COOLDOWN_TURNS

  // Increment turn count
  if (hackerTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Clear state
  selectedPiece = null
  hackTargets = []
  selectedHackTarget = null
  showHackActions = false

  render()
}

// Cancel hack target selection
function cancelHackTarget() {
  selectedHackTarget = null
  showHackActions = false
  message = t('selectHackTarget')
  render()
}

// Start bombing animation with fighter jet
function executeBombing(fighter: Piece, target: Piece, landingCol: string, landingRow: number) {
  // Store original position
  const startCol = fighter.col
  const startRow = fighter.row

  // Clear selection state
  selectedPiece = null
  bombTargets = []
  selectedBombTarget = null
  landingSpots = []

  // Play plane sound
  playSound('plane')

  // Start animation
  fighterAnimation = {
    fighter,
    startCol,
    startRow,
    targetCol: target.col,
    targetRow: target.row,
    landingCol,
    landingRow,
    target,
    phase: 'flyToTarget',
    progress: 0
  }

  message = t('fighterIncoming')
  animateFighter()
}

// Animate fighter jet bombing run
function animateFighter() {
  if (!fighterAnimation) return

  const { fighter, startCol, startRow, targetCol, targetRow, landingCol, landingRow, target, phase } = fighterAnimation

  fighterAnimation.progress += 0.05

  if (phase === 'flyToTarget') {
    if (fighterAnimation.progress >= 1) {
      // Reached target, start bombing
      fighterAnimation.phase = 'bombing'
      fighterAnimation.progress = 0
      message = t('droppingBomb')
    }
  } else if (phase === 'bombing') {
    if (fighterAnimation.progress >= 1) {
      // Bomb dropped, destroy target
      const targetIndex = pieces.indexOf(target)
      if (targetIndex !== -1) {
        pieces.splice(targetIndex, 1)
        capturedPieces.push(target)
        checkBuilderCaptured(target, fighter.team)
      }
      // Start flying to landing
      fighterAnimation.phase = 'flyToLanding'
      fighterAnimation.progress = 0
      message = t('targetDestroyed')
    }
  } else if (phase === 'flyToLanding') {
    if (fighterAnimation.progress >= 1) {
      // Landed, finish animation
      finishBombing()
      return
    }
  }

  render()
  requestAnimationFrame(animateFighter)
}

// Finish bombing after animation
function finishBombing() {
  if (!fighterAnimation) return

  const { fighter, startCol, startRow, landingCol, landingRow, target } = fighterAnimation
  const fighterTeam = fighter.team

  // Move fighter to landing spot
  fighter.col = landingCol
  fighter.row = landingRow

  // Log the action
  moveLog.push({
    from: `${startCol}${startRow}`,
    to: `${landingCol}${landingRow}`,
    piece: fighter.type,
    team: fighterTeam,
    captured: target.type,
    capturedPoints: target.points
  })

  message = `Fighter bombed ${target.type}! (+${target.points} points)`

  // Set cooldown
  fighter.cooldownTurns = FIGHTER_COOLDOWN_TURNS

  // Increment turn count
  if (fighterTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Clear animation
  fighterAnimation = null

  render()
}

// Cancel bomb target selection
function cancelBombTarget() {
  selectedBombTarget = null
  landingSpots = []
  message = t('selectBombTarget')
  render()
}

// Select builder action
function selectBuilderAction(action: 'move' | 'barricade' | 'artillery' | 'spike') {
  if (!selectedPiece || selectedPiece.type !== 'builder') return

  if (action === 'move') {
    builderPlacementMode = null
    builderPlacementSpots = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []
    validMoves = getValidMovesForBuilder(selectedPiece)
    message = t('selectWhereToMove')
  } else if (action === 'barricade') {
    if (!canBuilderBuildBarricade(selectedPiece)) {
      message = t('cannotBuildBarricade')
      render()
      return
    }
    builderPlacementMode = 'barricade'
    builderPlacementSpots = getValidPlacementSpots(selectedPiece)
    validMoves = []
    message = t('selectPlaceBarricade')
  } else if (action === 'artillery') {
    if (!canBuilderBuildArtillery(selectedPiece)) {
      message = t('cannotBuildArtillery')
      render()
      return
    }
    builderPlacementMode = 'artillery'
    builderPlacementSpots = getValidPlacementSpots(selectedPiece)
    validMoves = []
    message = t('selectPlaceArtillery')
  } else if (action === 'spike') {
    if (!canBuilderBuildSpike(selectedPiece)) {
      message = t('cannotBuildSpike')
      render()
      return
    }
    builderPlacementMode = 'spike'
    builderPlacementSpots = getValidSpikePlacementSpots(selectedPiece)
    validMoves = []
    message = t('selectPlaceSpike')
  }

  render()
}

// Place barricade/artillery/spike
function placeBuilderItem(col: string, row: number) {
  if (!selectedPiece || selectedPiece.type !== 'builder' || !builderPlacementMode) return

  const builder = selectedPiece
  const team = builder.team

  // Play build sound
  playSound('build')

  if (builderPlacementMode === 'barricade') {
    // Create barricade
    pieces.push({
      type: 'barricade',
      team: team,
      col: col,
      row: row,
      points: 0
    })

    builder.barricadesBuilt = (builder.barricadesBuilt ?? 0) + 1
    builder.barricadeCooldown = BARRICADE_COOLDOWN

    message = `Barricade placed at ${col}${row}!`

    moveLog.push({
      from: `${builder.col}${builder.row}`,
      to: `${col}${row}`,
      piece: 'builder',
      team: team,
      captured: 'build-barricade'
    })
  } else if (builderPlacementMode === 'artillery') {
    // Create artillery
    pieces.push({
      type: 'artillery',
      team: team,
      col: col,
      row: row,
      points: 0
    })

    builder.artilleryBuilt = (builder.artilleryBuilt ?? 0) + 1
    builder.artilleryCooldown = ARTILLERY_COOLDOWN

    message = `Artillery placed at ${col}${row}!`

    moveLog.push({
      from: `${builder.col}${builder.row}`,
      to: `${col}${row}`,
      piece: 'builder',
      team: team,
      captured: 'build-artillery'
    })
  } else if (builderPlacementMode === 'spike') {
    // Create spike
    pieces.push({
      type: 'spike',
      team: team,
      col: col,
      row: row,
      points: 0,
      turnsRemaining: SPIKE_DURATION
    })

    builder.spikesBuilt = (builder.spikesBuilt ?? 0) + 1
    builder.spikeCooldown = SPIKE_COOLDOWN

    message = `Spike placed at ${col}${row}! (${SPIKE_DURATION} turns)`

    moveLog.push({
      from: `${builder.col}${builder.row}`,
      to: `${col}${row}`,
      piece: 'builder',
      team: team,
      captured: 'build-spike'
    })
  }

  // Increment turn count
  if (team === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  switchTurn()

  // Clear state
  selectedPiece = null
  validMoves = []
  showBuilderActions = false
  showCarrierActions = false
  builderPlacementMode = null
  builderPlacementSpots = []
  helicopterLaunchMode = false
  helicopterLaunchSpots = []

  render()
}

function handleSquareClick(col: string, row: number) {
  // Get pieces at this location (handles barricade + piece behind it, or tunnel soldier + above ground piece)
  const piecesHere = getPiecesAt(col, row)
  // Prefer selecting: 1) current team's piece, 2) non-barricade piece, 3) first piece
  // This handles tunnel soldiers under enemy pieces - select the one matching current turn
  const piece = piecesHere.find(p => p.team === currentTurn && p.type !== 'barricade')
    || piecesHere.find(p => p.type !== 'barricade')
    || piecesHere[0]

  if (selectedPiece) {
    // If in helicopter launch mode, try to land on clicked helipad
    if (helicopterLaunchMode && selectedPiece.type === 'carrier') {
      const isValidLaunchSpot = helicopterLaunchSpots.some(s => s.col === col && s.row === row)
      if (isValidLaunchSpot) {
        completeHelicopterLaunch(col, row)
        return
      }
    }

    // If artillery is selected and clicking on it again, fire it
    if (selectedPiece.type === 'artillery' && piece === selectedPiece) {
      const teamTurns = selectedPiece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      if (teamTurns >= ARTILLERY_READY_TURN) {
        fireArtillery(selectedPiece)
        return
      }
    }

    // If clicking on the same piece, deselect (unless forced to leave trench)
    if (piece === selectedPiece) {
      // Check if this is a forced trench soldier - cannot deselect
      const forcedSoldier = checkForcedTrenchExit()
      if (forcedSoldier && piece === forcedSoldier) {
        message = `⚠️ Soldier MUST leave the trench! Click a valid destination.`
        render()
        return
      }

      selectedPiece = null
      validMoves = []
      shootTargets = []
      rocketTargetArea = []
      hackTargets = []
      selectedHackTarget = null
      showHackActions = false
      bombTargets = []
      selectedBombTarget = null
      landingSpots = []
      message = null
      actionMode = null
      showSoldierActions = false
      render()
      return
    }

    // If rocket is selected and has targets, try to launch
    if (selectedPiece.type === 'rocket' && rocketTargetArea.length > 0) {
      const isValidTarget = rocketTargetArea.some(t => t.col === col && t.row === row)
      if (isValidTarget) {
        launchRocket(selectedPiece, col, row)
        return
      }
    }

    // If hacker is selected and clicking on hackable target
    if (selectedPiece.type === 'hacker' && hackTargets.length > 0 && piece) {
      const isHackable = hackTargets.some(t => t === piece)
      if (isHackable) {
        selectedHackTarget = piece
        showHackActions = true
        message = `Hack ${piece.type}: choose action`
        render()
        return
      }
    }

    // If fighter is selected
    if (selectedPiece.type === 'fighter') {
      // If we already selected a bomb target, now select landing spot
      if (selectedBombTarget && landingSpots.length > 0) {
        const isValidLanding = landingSpots.some(s => s.col === col && s.row === row)
        if (isValidLanding) {
          executeBombing(selectedPiece, selectedBombTarget, col, row)
          return
        }
      }
      // Select bomb target
      if (bombTargets.length > 0 && piece) {
        const isBombable = bombTargets.some(t => t === piece)
        if (isBombable) {
          selectedBombTarget = piece
          landingSpots = getValidLandingSpots(piece.col, piece.row)
          message = `Bomb ${piece.type}: select landing spot (0-3 squares)`
          render()
          return
        }
      }
    }

    // If builder is in placement mode
    if (selectedPiece.type === 'builder' && builderPlacementMode && builderPlacementSpots.length > 0) {
      const isValidSpot = builderPlacementSpots.some(s => s.col === col && s.row === row)
      if (isValidSpot) {
        placeBuilderItem(col, row)
        return
      }
    }

    // If artillery is selected and ready to fire
    if (selectedPiece.type === 'artillery') {
      const teamTurns = selectedPiece.team === 'yellow' ? yellowTurnCount : greenTurnCount
      if (teamTurns >= ARTILLERY_READY_TURN) {
        // Clicking on artillery again fires it
        if (piece === selectedPiece) {
          fireArtillery(selectedPiece)
          selectedPiece = null
          return
        }
      }
    }

    // If in shoot mode, try to shoot
    if (actionMode === 'shoot') {
      shootPiece(col, row)
      return
    }

    // Try to move to the clicked square
    movePiece(col, row)
  } else if (piece) {
    // Select the piece
    selectPiece(piece)
  }
}

// Pieces array
const pieces: Piece[] = getInitialPieces()

function getPieceAt(col: string, row: number): Piece | undefined {
  return pieces.find(p => p.col === col && p.row === row)
}

// Get piece at position, ignoring soldiers in tunnels (they're underground)
function getPieceAtAboveGround(col: string, row: number): Piece | undefined {
  return pieces.find(p => p.col === col && p.row === row && !(p.type === 'soldier' && p.inTunnel))
}

// Get all pieces at a position (for barricade + piece behind it)
function getPiecesAt(col: string, row: number): Piece[] {
  return pieces.filter(p => p.col === col && p.row === row)
}

// Get the non-barricade piece at a position (the piece standing behind barricade)
function getPieceExcludingBarricade(col: string, row: number): Piece | undefined {
  return pieces.find(p => p.col === col && p.row === row && p.type !== 'barricade')
}

// Get the barricade at a position
function getBarricadeAt(col: string, row: number): Piece | undefined {
  return pieces.find(p => p.col === col && p.row === row && p.type === 'barricade')
}

// Check if a piece can move behind a friendly barricade
function canMoveBehindBarricade(piece: Piece, col: string, row: number): boolean {
  const piecesAtTarget = getPiecesAt(col, row)
  // Only allowed if there's exactly one piece and it's a friendly barricade
  if (piecesAtTarget.length === 1 && piecesAtTarget[0].type === 'barricade' && piecesAtTarget[0].team === piece.team) {
    return true
  }
  return false
}

// Colorblind symbol helper - circle for yellow/orange, triangle for green/blue
function getColorblindSymbol(team: 'yellow' | 'green', x: number, y: number): string {
  if (!colorBlindMode) return ''

  const symbolColor = team === 'yellow' ? '#ffffff' : '#ffffff'
  const bgColor = team === 'yellow' ? '#ea580c' : '#2563eb'

  if (team === 'yellow') {
    // Circle for yellow/orange team
    return `
      <circle cx="${x + 8}" cy="${y + 8}" r="6" fill="${bgColor}" stroke="${symbolColor}" stroke-width="1.5" class="pointer-events-none" />
      <circle cx="${x + 8}" cy="${y + 8}" r="3" fill="${symbolColor}" class="pointer-events-none" />
    `
  } else {
    // Triangle for green/blue team
    return `
      <polygon points="${x + 8},${y + 3} ${x + 14},${y + 13} ${x + 2},${y + 13}" fill="${bgColor}" stroke="${symbolColor}" stroke-width="1.5" class="pointer-events-none" />
    `
  }
}

function drawPiece(piece: Piece, x: number, y: number): string {
  const teamColor = getTeamColor(piece.team)
  const strokeColor = colorBlindMode
    ? (piece.team === 'yellow' ? '#c2410c' : '#1d4ed8')
    : (piece.team === 'yellow' ? '#b45309' : '#15803d')
  const strokeWidth = highContrastMode ? 3 : 2
  const colorblindSymbol = getColorblindSymbol(piece.team, x, y)

  if (piece.type === 'train') {
    const highlight = colorBlindMode
      ? (piece.team === 'yellow' ? '#fb923c' : '#60a5fa')
      : (piece.team === 'yellow' ? '#fde047' : '#4ade80')
    const shadow = colorBlindMode
      ? (piece.team === 'yellow' ? '#9a3412' : '#1e40af')
      : (piece.team === 'yellow' ? '#92400e' : '#166534')
    // Train locomotive shape
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 44}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Wheels -->
        <circle cx="${x + 14}" cy="${y + 38}" r="6" fill="#1f1f1f" />
        <circle cx="${x + 14}" cy="${y + 38}" r="4" fill="#3f3f3f" />
        <circle cx="${x + 14}" cy="${y + 38}" r="1.5" fill="#6b6b6b" />
        <circle cx="${x + 28}" cy="${y + 38}" r="6" fill="#1f1f1f" />
        <circle cx="${x + 28}" cy="${y + 38}" r="4" fill="#3f3f3f" />
        <circle cx="${x + 28}" cy="${y + 38}" r="1.5" fill="#6b6b6b" />
        <circle cx="${x + 40}" cy="${y + 38}" r="5" fill="#1f1f1f" />
        <circle cx="${x + 40}" cy="${y + 38}" r="3" fill="#3f3f3f" />
        <!-- Boiler -->
        <rect x="${x + 6}" y="${y + 22}" width="26" height="14" rx="7" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1.5" />
        <rect x="${x + 8}" y="${y + 24}" width="22" height="4" rx="2" fill="${highlight}" opacity="0.5" />
        <!-- Cabin -->
        <rect x="${x + 30}" y="${y + 14}" width="14" height="22" rx="2" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1.5" />
        <rect x="${x + 32}" y="${y + 16}" width="10" height="6" rx="1" fill="${shadow}" />
        <rect x="${x + 33}" y="${y + 17}" width="8" height="4" rx="1" fill="#87ceeb" opacity="0.7" />
        <!-- Roof -->
        <rect x="${x + 29}" y="${y + 12}" width="16" height="4" rx="1" fill="${strokeColor}" />
        <!-- Chimney -->
        <rect x="${x + 10}" y="${y + 14}" width="6" height="9" rx="1" fill="${strokeColor}" />
        <ellipse cx="${x + 13}" cy="${y + 14}" rx="4" ry="2" fill="${shadow}" />
        <!-- Smoke puffs -->
        <circle cx="${x + 13}" cy="${y + 9}" r="3" fill="#d1d5db" opacity="0.6" />
        <circle cx="${x + 16}" cy="${y + 5}" r="2.5" fill="#e5e7eb" opacity="0.4" />
        <circle cx="${x + 11}" cy="${y + 4}" r="2" fill="#f3f4f6" opacity="0.3" />
        <!-- Front light -->
        <circle cx="${x + 7}" cy="${y + 26}" r="2.5" fill="#fef9c3" stroke="#eab308" stroke-width="0.5" />
        <!-- Cow catcher -->
        <path d="M${x + 4} ${y + 36} L${x + 6} ${y + 32} L${x + 10} ${y + 36} Z" fill="#4b5563" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'soldier') {
    const inTrench = piece.inTrench
    const inTunnel = piece.inTunnel
    const uniformColor = piece.team === 'yellow' ? '#5c4a1f' : '#2d4a2d' // Khaki for yellow, olive for green
    const uniformDark = piece.team === 'yellow' ? '#3d3214' : '#1e331e'
    const helmetColor = piece.team === 'yellow' ? '#6b5a2f' : '#3d5a3d'
    // Military soldier appearance
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 47}" rx="12" ry="3" fill="rgba(0,0,0,0.4)" />
        <!-- Combat boots -->
        <rect x="${x + 17}" y="${y + 42}" width="6" height="5" rx="1" fill="#1a1a1a" />
        <rect x="${x + 27}" y="${y + 42}" width="6" height="5" rx="1" fill="#1a1a1a" />
        <!-- Legs with cargo pants -->
        <rect x="${x + 17}" y="${y + 32}" width="6" height="11" fill="${uniformColor}" />
        <rect x="${x + 27}" y="${y + 32}" width="6" height="11" fill="${uniformColor}" />
        <rect x="${x + 18}" y="${y + 36}" width="4" height="3" fill="${uniformDark}" /> <!-- Pocket -->
        <rect x="${x + 28}" y="${y + 36}" width="4" height="3" fill="${uniformDark}" /> <!-- Pocket -->
        <!-- Belt -->
        <rect x="${x + 14}" y="${y + 30}" width="22" height="3" fill="#2d2d2d" />
        <rect x="${x + 23}" y="${y + 30}" width="4" height="3" fill="#b8860b" /> <!-- Buckle -->
        <!-- Body/Torso with tactical vest -->
        <rect x="${x + 14}" y="${y + 18}" width="22" height="13" rx="2" fill="${uniformColor}" stroke="${uniformDark}" stroke-width="1" />
        <!-- Vest details -->
        <rect x="${x + 15}" y="${y + 19}" width="8" height="5" fill="${uniformDark}" rx="1" /> <!-- Left pocket -->
        <rect x="${x + 27}" y="${y + 19}" width="8" height="5" fill="${uniformDark}" rx="1" /> <!-- Right pocket -->
        <line x1="${x + 25}" y1="${y + 18}" x2="${x + 25}" y2="${y + 30}" stroke="${uniformDark}" stroke-width="1" />
        <!-- Shoulders/epaulettes -->
        <rect x="${x + 12}" y="${y + 18}" width="4" height="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="0.5" />
        <rect x="${x + 34}" y="${y + 18}" width="4" height="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="0.5" />
        <!-- Arms -->
        <rect x="${x + 8}" y="${y + 20}" width="6" height="10" rx="2" fill="${uniformColor}" stroke="${uniformDark}" stroke-width="0.5" />
        <rect x="${x + 36}" y="${y + 20}" width="6" height="10" rx="2" fill="${uniformColor}" stroke="${uniformDark}" stroke-width="0.5" />
        <!-- Hands -->
        <circle cx="${x + 11}" cy="${y + 32}" r="2.5" fill="#d4a574" />
        <circle cx="${x + 39}" cy="${y + 32}" r="2.5" fill="#d4a574" />
        <!-- Combat helmet -->
        <ellipse cx="${x + 25}" cy="${y + 12}" rx="11" ry="8" fill="${helmetColor}" />
        <ellipse cx="${x + 25}" cy="${y + 10}" rx="9" ry="6" fill="${helmetColor}" />
        <path d="M${x + 14} ${y + 14} Q${x + 25} ${y + 8} ${x + 36} ${y + 14}" stroke="${uniformDark}" stroke-width="1.5" fill="none" /> <!-- Helmet rim -->
        <!-- Helmet band -->
        <rect x="${x + 15}" y="${y + 11}" width="20" height="2" fill="${uniformDark}" />
        <!-- Face -->
        <ellipse cx="${x + 25}" cy="${y + 17}" rx="5" ry="4" fill="#d4a574" />
        <!-- Eyes -->
        <circle cx="${x + 23}" cy="${y + 16}" r="1" fill="#1f1f1f" />
        <circle cx="${x + 27}" cy="${y + 16}" r="1" fill="#1f1f1f" />
        <!-- Assault Rifle -->
        <g transform="rotate(-25 ${x + 10} ${y + 28})">
          <!-- Stock -->
          <rect x="${x - 2}" y="${y + 28}" width="10" height="4" rx="1" fill="#3d2817" />
          <rect x="${x - 4}" y="${y + 29}" width="4" height="5" rx="1" fill="#3d2817" />
          <!-- Receiver/Body -->
          <rect x="${x + 6}" y="${y + 26}" width="14" height="6" rx="1" fill="#2d2d2d" />
          <!-- Barrel -->
          <rect x="${x + 18}" y="${y + 27}" width="12" height="3" fill="#1a1a1a" />
          <!-- Front sight -->
          <rect x="${x + 28}" y="${y + 25}" width="2" height="3" fill="#1a1a1a" />
          <!-- Magazine -->
          <rect x="${x + 10}" y="${y + 31}" width="4" height="8" rx="1" fill="#2d2d2d" />
          <!-- Grip -->
          <rect x="${x + 4}" y="${y + 31}" width="3" height="6" rx="1" fill="#3d2817" />
          <!-- Scope/sight rail -->
          <rect x="${x + 8}" y="${y + 24}" width="10" height="2" fill="#1f1f1f" />
          <!-- Trigger guard -->
          <path d="M${x + 6} ${y + 32} Q${x + 8} ${y + 36} ${x + 10} ${y + 32}" stroke="#2d2d2d" stroke-width="1.5" fill="none" />
        </g>
        <!-- Team indicator dot -->
        <circle cx="${x + 25}" cy="${y + 5}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${inTrench ? `<rect x="${x + 20}" y="${y + 44}" width="10" height="4" fill="#5c4033" rx="1" /><text x="${x + 25}" y="${y + 47}" text-anchor="middle" font-size="6" fill="#fff">⚔</text>` : ''}
        ${inTunnel ? `<rect x="${x + 20}" y="${y + 44}" width="10" height="4" fill="#333" rx="1" /><text x="${x + 25}" y="${y + 47}" text-anchor="middle" font-size="6" fill="#fff">🚇</text>` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'tank') {
    const bodyColor = piece.team === 'yellow' ? '#6b5a2f' : '#3d5a3d'
    const bodyDark = piece.team === 'yellow' ? '#4a3d1f' : '#2d4a2d'
    const trackColor = '#2d2d2d'
    // Tank design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
        <!-- Tracks -->
        <rect x="${x + 4}" y="${y + 34}" width="42" height="10" rx="5" fill="${trackColor}" />
        <rect x="${x + 6}" y="${y + 36}" width="38" height="6" rx="3" fill="#1a1a1a" />
        <!-- Track wheels -->
        <circle cx="${x + 12}" cy="${y + 39}" r="3" fill="#3f3f3f" />
        <circle cx="${x + 25}" cy="${y + 39}" r="3" fill="#3f3f3f" />
        <circle cx="${x + 38}" cy="${y + 39}" r="3" fill="#3f3f3f" />
        <!-- Track details -->
        <line x1="${x + 8}" y1="${y + 36}" x2="${x + 8}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 15}" y1="${y + 36}" x2="${x + 15}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 22}" y1="${y + 36}" x2="${x + 22}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 29}" y1="${y + 36}" x2="${x + 29}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 36}" y1="${y + 36}" x2="${x + 36}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 42}" y1="${y + 36}" x2="${x + 42}" y2="${y + 42}" stroke="#4a4a4a" stroke-width="1" />
        <!-- Hull -->
        <path d="M${x + 6} ${y + 34} L${x + 10} ${y + 24} L${x + 40} ${y + 24} L${x + 44} ${y + 34} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Hull top -->
        <rect x="${x + 12}" y="${y + 20}" width="26" height="6" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Turret -->
        <ellipse cx="${x + 25}" cy="${y + 18}" rx="12" ry="8" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1.5" />
        <ellipse cx="${x + 25}" cy="${y + 16}" rx="10" ry="6" fill="${bodyDark}" />
        <!-- Cannon -->
        <rect x="${x + 32}" y="${y + 14}" width="16" height="4" rx="2" fill="#4a4a4a" />
        <rect x="${x + 46}" y="${y + 15}" width="4" height="2" fill="#2d2d2d" />
        <!-- Hatch -->
        <ellipse cx="${x + 25}" cy="${y + 14}" rx="4" ry="3" fill="${bodyDark}" stroke="#1a1a1a" stroke-width="0.5" />
        <!-- Commander cupola -->
        <circle cx="${x + 20}" cy="${y + 12}" r="3" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Machine gun -->
        <rect x="${x + 18}" y="${y + 10}" width="8" height="2" fill="#3f3f3f" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 5}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Antenna -->
        <line x1="${x + 35}" y1="${y + 12}" x2="${x + 38}" y2="${y + 4}" stroke="#4a4a4a" stroke-width="1" />
        <circle cx="${x + 38}" cy="${y + 4}" r="1" fill="#ef4444" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'ship') {
    const hullColor = piece.team === 'yellow' ? '#6b5a2f' : '#3d5a3d'
    const hullDark = piece.team === 'yellow' ? '#4a3d1f' : '#2d4a2d'
    const deckColor = piece.team === 'yellow' ? '#8b7355' : '#5a7a5a'
    // Battleship design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Water ripples -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="22" ry="4" fill="#6bb3e8" opacity="0.5" />
        <ellipse cx="${x + 25}" cy="${y + 44}" rx="18" ry="3" fill="#7ec8f0" opacity="0.4" />
        <!-- Hull (boat shape) -->
        <path d="M${x + 5} ${y + 38} L${x + 10} ${y + 44} L${x + 40} ${y + 44} L${x + 45} ${y + 38} L${x + 42} ${y + 30} L${x + 8} ${y + 30} Z" fill="${hullColor}" stroke="${hullDark}" stroke-width="1.5" />
        <!-- Hull stripe -->
        <path d="M${x + 8} ${y + 36} L${x + 42} ${y + 36}" stroke="${hullDark}" stroke-width="1" />
        <!-- Deck -->
        <rect x="${x + 10}" y="${y + 26}" width="30" height="6" rx="1" fill="${deckColor}" stroke="${hullDark}" stroke-width="1" />
        <!-- Bridge/Command tower -->
        <rect x="${x + 20}" y="${y + 16}" width="12" height="12" rx="1" fill="${hullColor}" stroke="${hullDark}" stroke-width="1" />
        <rect x="${x + 22}" y="${y + 18}" width="8" height="4" rx="1" fill="#87ceeb" opacity="0.7" />
        <!-- Bridge roof -->
        <rect x="${x + 19}" y="${y + 14}" width="14" height="3" rx="1" fill="${hullDark}" />
        <!-- Main cannon (front) -->
        <rect x="${x + 12}" y="${y + 22}" width="6" height="6" rx="1" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="0.5" />
        <rect x="${x + 6}" y="${y + 24}" width="8" height="2" rx="1" fill="#3d3d3d" />
        <!-- Main cannon (back) -->
        <rect x="${x + 32}" y="${y + 22}" width="6" height="6" rx="1" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="0.5" />
        <rect x="${x + 36}" y="${y + 24}" width="8" height="2" rx="1" fill="#3d3d3d" />
        <!-- Side guns -->
        <rect x="${x + 8}" y="${y + 28}" width="4" height="2" fill="#3d3d3d" />
        <rect x="${x + 38}" y="${y + 28}" width="4" height="2" fill="#3d3d3d" />
        <!-- Radar/Antenna -->
        <line x1="${x + 26}" y1="${y + 14}" x2="${x + 26}" y2="${y + 8}" stroke="#4a4a4a" stroke-width="1.5" />
        <ellipse cx="${x + 26}" cy="${y + 7}" rx="4" ry="2" fill="none" stroke="#4a4a4a" stroke-width="1" />
        <!-- Flag -->
        <line x1="${x + 40}" y1="${y + 26}" x2="${x + 40}" y2="${y + 18}" stroke="#4a4a4a" stroke-width="1" />
        <rect x="${x + 40}" y="${y + 18}" width="6" height="4" fill="${teamColor}" stroke="${strokeColor}" stroke-width="0.5" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 5}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'carrier') {
    const hullColor = piece.team === 'yellow' ? '#5a5a5a' : '#4a5a4a'
    const hullDark = piece.team === 'yellow' ? '#3a3a3a' : '#2a3a2a'
    const deckColor = piece.team === 'yellow' ? '#7a7a7a' : '#5a6a5a'
    const damaged = piece.hp === 1
    // Aircraft carrier design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Water ripples -->
        <ellipse cx="${x + 25}" cy="${y + 47}" rx="24" ry="4" fill="#6bb3e8" opacity="0.5" />
        <ellipse cx="${x + 25}" cy="${y + 45}" rx="20" ry="3" fill="#7ec8f0" opacity="0.4" />
        <!-- Hull (long flat carrier shape) -->
        <path d="M${x + 2} ${y + 40} L${x + 6} ${y + 45} L${x + 44} ${y + 45} L${x + 48} ${y + 40} L${x + 48} ${y + 28} L${x + 2} ${y + 28} Z" fill="${hullColor}" stroke="${hullDark}" stroke-width="1.5" />
        <!-- Flight deck (flat top) -->
        <rect x="${x + 4}" y="${y + 22}" width="42" height="8" rx="1" fill="${deckColor}" stroke="${hullDark}" stroke-width="1" />
        <!-- Deck markings (landing strip) -->
        <line x1="${x + 8}" y1="${y + 26}" x2="${x + 42}" y2="${y + 26}" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,2" />
        <rect x="${x + 10}" y="${y + 24}" width="8" height="4" fill="none" stroke="#ffffff" stroke-width="0.5" />
        <!-- Helipad circle -->
        <circle cx="${x + 30}" cy="${y + 26}" r="3" fill="none" stroke="#ffffff" stroke-width="0.5" />
        <text x="${x + 30}" y="${y + 27.5}" text-anchor="middle" font-size="4" fill="#ffffff">H</text>
        <!-- Command tower (island) - on the side -->
        <rect x="${x + 38}" y="${y + 12}" width="8" height="12" rx="1" fill="${hullColor}" stroke="${hullDark}" stroke-width="1" />
        <rect x="${x + 39}" y="${y + 14}" width="6" height="3" rx="0.5" fill="#87ceeb" opacity="0.7" />
        <!-- Radar on tower -->
        <line x1="${x + 42}" y1="${y + 12}" x2="${x + 42}" y2="${y + 6}" stroke="#4a4a4a" stroke-width="1" />
        <ellipse cx="${x + 42}" cy="${y + 5}" rx="3" ry="1.5" fill="none" stroke="#4a4a4a" stroke-width="1" />
        <!-- Small gun on deck -->
        <rect x="${x + 6}" y="${y + 20}" width="4" height="3" fill="#4a4a4a" />
        <rect x="${x + 3}" y="${y + 21}" width="4" height="1.5" fill="#3d3d3d" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 5}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Damage indicator -->
        ${damaged ? `
          <line x1="${x + 15}" y1="${y + 20}" x2="${x + 25}" y2="${y + 30}" stroke="#ef4444" stroke-width="2" />
          <line x1="${x + 25}" y1="${y + 20}" x2="${x + 15}" y2="${y + 30}" stroke="#ef4444" stroke-width="2" />
          <circle cx="${x + 20}" cy="${y + 25}" r="6" fill="#ef4444" opacity="0.3" />
        ` : ''}
        <!-- Helicopter on deck (if present) -->
        ${piece.hasHelicopter ? `
          <!-- Mini helicopter on carrier deck -->
          <ellipse cx="${x + 20}" cy="${y + 26}" rx="8" ry="5" fill="#3d3d3d" stroke="#2d2d2d" stroke-width="1" />
          <ellipse cx="${x + 17}" cy="${y + 25}" rx="4" ry="3" fill="#87ceeb" opacity="0.6" />
          <rect x="${x + 26}" y="${y + 25}" width="8" height="2" fill="#3d3d3d" />
          <line x1="${x + 10}" y1="${y + 23}" x2="${x + 30}" y2="${y + 23}" stroke="#5a5a5a" stroke-width="1.5" />
          <line x1="${x + 15}" y1="${y + 21}" x2="${x + 25}" y2="${y + 25}" stroke="#5a5a5a" stroke-width="1.5" />
          <circle cx="${x + 20}" cy="${y + 18}" r="2" fill="${teamColor}" />
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'helicopter') {
    const bodyColor = piece.team === 'yellow' ? '#4a4a4a' : '#3a4a3a'
    const bodyDark = piece.team === 'yellow' ? '#2a2a2a' : '#1a2a1a'
    // Helicopter design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Tail boom -->
        <rect x="${x + 35}" y="${y + 28}" width="12" height="3" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Tail rotor -->
        <rect x="${x + 45}" y="${y + 24}" width="2" height="10" fill="${bodyDark}" />
        <ellipse cx="${x + 46}" cy="${y + 24}" rx="1" ry="4" fill="#6b7280" />
        <ellipse cx="${x + 46}" cy="${y + 34}" rx="1" ry="4" fill="#6b7280" />
        <!-- Main body -->
        <ellipse cx="${x + 25}" cy="${y + 32}" rx="14" ry="10" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Cockpit window -->
        <ellipse cx="${x + 20}" cy="${y + 30}" rx="6" ry="5" fill="#87ceeb" opacity="0.8" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Cockpit frame -->
        <line x1="${x + 20}" y1="${y + 25}" x2="${x + 20}" y2="${y + 35}" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Skids (landing gear) -->
        <rect x="${x + 12}" y="${y + 40}" width="26" height="2" rx="1" fill="${bodyDark}" />
        <rect x="${x + 14}" y="${y + 38}" width="2" height="4" fill="${bodyDark}" />
        <rect x="${x + 34}" y="${y + 38}" width="2" height="4" fill="${bodyDark}" />
        <!-- Main rotor mast -->
        <rect x="${x + 24}" y="${y + 18}" width="2" height="6" fill="${bodyDark}" />
        <!-- Main rotor blades -->
        <ellipse cx="${x + 25}" cy="${y + 17}" rx="20" ry="3" fill="#6b7280" opacity="0.7" />
        <line x1="${x + 5}" y1="${y + 17}" x2="${x + 45}" y2="${y + 17}" stroke="#4b5563" stroke-width="2" />
        <line x1="${x + 15}" y1="${y + 12}" x2="${x + 35}" y2="${y + 22}" stroke="#4b5563" stroke-width="2" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 5}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Side marking -->
        <circle cx="${x + 30}" cy="${y + 32}" r="3" fill="${teamColor}" opacity="0.8" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'machinegun') {
    const baseColor = piece.team === 'yellow' ? '#5c4a1f' : '#2d4a2d'
    const baseDark = piece.team === 'yellow' ? '#3d3214' : '#1e331e'
    const metalColor = '#4a4a4a'
    const metalDark = '#2d2d2d'
    // Machine gun design (stationary)
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Sandbag base -->
        <ellipse cx="${x + 15}" cy="${y + 42}" rx="10" ry="5" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${x + 35}" cy="${y + 42}" rx="10" ry="5" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${x + 25}" cy="${y + 40}" rx="12" ry="6" fill="#c2a878" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${x + 20}" cy="${y + 38}" rx="8" ry="4" fill="#d4b896" stroke="#8b7355" stroke-width="1" />
        <ellipse cx="${x + 30}" cy="${y + 38}" rx="8" ry="4" fill="#d4b896" stroke="#8b7355" stroke-width="1" />
        <!-- Tripod legs -->
        <line x1="${x + 25}" y1="${y + 30}" x2="${x + 12}" y2="${y + 38}" stroke="${metalDark}" stroke-width="3" />
        <line x1="${x + 25}" y1="${y + 30}" x2="${x + 38}" y2="${y + 38}" stroke="${metalDark}" stroke-width="3" />
        <line x1="${x + 25}" y1="${y + 30}" x2="${x + 25}" y2="${y + 36}" stroke="${metalDark}" stroke-width="3" />
        <!-- Gun body -->
        <rect x="${x + 18}" y="${y + 22}" width="14" height="10" rx="2" fill="${metalColor}" stroke="${metalDark}" stroke-width="1" />
        <!-- Barrel -->
        <rect x="${x + 22}" y="${y + 8}" width="6" height="16" rx="2" fill="${metalColor}" stroke="${metalDark}" stroke-width="1" />
        <rect x="${x + 23}" y="${y + 6}" width="4" height="4" fill="${metalDark}" />
        <!-- Barrel holes (muzzle) -->
        <circle cx="${x + 25}" cy="${y + 7}" r="1.5" fill="#1a1a1a" />
        <!-- Ammunition box -->
        <rect x="${x + 32}" y="${y + 24}" width="8" height="6" rx="1" fill="${baseColor}" stroke="${baseDark}" stroke-width="1" />
        <!-- Handle -->
        <rect x="${x + 10}" y="${y + 24}" width="8" height="4" rx="1" fill="${baseDark}" />
        <circle cx="${x + 12}" cy="${y + 26}" r="2" fill="${metalDark}" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 14}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'suv') {
    const bodyColor = piece.team === 'yellow' ? '#8b7355' : '#5a6b5a'
    const bodyDark = piece.team === 'yellow' ? '#6b5a3d' : '#3a4b3a'
    const windowColor = '#87ceeb'
    // SUV design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Wheels -->
        <circle cx="${x + 12}" cy="${y + 40}" r="6" fill="#1f1f1f" />
        <circle cx="${x + 12}" cy="${y + 40}" r="4" fill="#3f3f3f" />
        <circle cx="${x + 12}" cy="${y + 40}" r="2" fill="#5f5f5f" />
        <circle cx="${x + 38}" cy="${y + 40}" r="6" fill="#1f1f1f" />
        <circle cx="${x + 38}" cy="${y + 40}" r="4" fill="#3f3f3f" />
        <circle cx="${x + 38}" cy="${y + 40}" r="2" fill="#5f5f5f" />
        <!-- Body -->
        <rect x="${x + 6}" y="${y + 26}" width="38" height="16" rx="3" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1.5" />
        <!-- Roof -->
        <rect x="${x + 10}" y="${y + 16}" width="30" height="12" rx="2" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Front windshield -->
        <path d="M${x + 10} ${y + 26} L${x + 12} ${y + 18} L${x + 22} ${y + 18} L${x + 22} ${y + 26} Z" fill="${windowColor}" opacity="0.8" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Rear window -->
        <path d="M${x + 28} ${y + 26} L${x + 28} ${y + 18} L${x + 38} ${y + 18} L${x + 40} ${y + 26} Z" fill="${windowColor}" opacity="0.8" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Side windows -->
        <rect x="${x + 23}" y="${y + 18}" width="4" height="7" fill="${windowColor}" opacity="0.7" />
        <!-- Front grille -->
        <rect x="${x + 6}" y="${y + 30}" width="4" height="8" rx="1" fill="#2d2d2d" />
        <line x1="${x + 7}" y1="${y + 32}" x2="${x + 9}" y2="${y + 32}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 7}" y1="${y + 34}" x2="${x + 9}" y2="${y + 34}" stroke="#4a4a4a" stroke-width="1" />
        <line x1="${x + 7}" y1="${y + 36}" x2="${x + 9}" y2="${y + 36}" stroke="#4a4a4a" stroke-width="1" />
        <!-- Headlights -->
        <circle cx="${x + 8}" cy="${y + 28}" r="2" fill="#fef9c3" stroke="#eab308" stroke-width="0.5" />
        <!-- Taillights -->
        <rect x="${x + 42}" y="${y + 28}" width="2" height="3" fill="#ef4444" />
        <rect x="${x + 42}" y="${y + 33}" width="2" height="3" fill="#ef4444" />
        <!-- Door handles -->
        <rect x="${x + 18}" y="${y + 30}" width="3" height="1" fill="#4a4a4a" />
        <rect x="${x + 29}" y="${y + 30}" width="3" height="1" fill="#4a4a4a" />
        <!-- Roof rack -->
        <line x1="${x + 14}" y1="${y + 16}" x2="${x + 36}" y2="${y + 16}" stroke="${bodyDark}" stroke-width="2" />
        <line x1="${x + 16}" y1="${y + 14}" x2="${x + 16}" y2="${y + 16}" stroke="${bodyDark}" stroke-width="1.5" />
        <line x1="${x + 34}" y1="${y + 14}" x2="${x + 34}" y2="${y + 16}" stroke="${bodyDark}" stroke-width="1.5" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 8}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'rocket') {
    const bodyColor = piece.team === 'yellow' ? '#5a5a5a' : '#4a5a4a'
    const bodyDark = piece.team === 'yellow' ? '#3a3a3a' : '#2a3a2a'
    const noseColor = '#ef4444'
    const used = piece.used
    // Rocket/missile design
    return `
      <g class="cursor-pointer ${used ? 'opacity-50' : ''}" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="10" ry="3" fill="rgba(0,0,0,0.3)" />
        <!-- Launch platform/base -->
        <rect x="${x + 12}" y="${y + 40}" width="26" height="6" rx="2" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <rect x="${x + 14}" y="${y + 42}" width="22" height="2" fill="#3d3d3d" />
        <!-- Rocket body -->
        <rect x="${x + 20}" y="${y + 14}" width="10" height="28" rx="3" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Body stripes -->
        <rect x="${x + 20}" y="${y + 26}" width="10" height="3" fill="${teamColor}" />
        <rect x="${x + 20}" y="${y + 32}" width="10" height="3" fill="${teamColor}" />
        <!-- Nose cone -->
        <path d="M${x + 20} ${y + 14} L${x + 25} ${y + 4} L${x + 30} ${y + 14} Z" fill="${noseColor}" stroke="#b91c1c" stroke-width="1" />
        <!-- Fins -->
        <path d="M${x + 18} ${y + 38} L${x + 20} ${y + 34} L${x + 20} ${y + 40} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <path d="M${x + 32} ${y + 38} L${x + 30} ${y + 34} L${x + 30} ${y + 40} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <path d="M${x + 25} ${y + 42} L${x + 25} ${y + 34} L${x + 28} ${y + 40} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Exhaust nozzle -->
        <ellipse cx="${x + 25}" cy="${y + 42}" rx="4" ry="2" fill="#2d2d2d" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 20}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${used ? `
          <!-- Used X mark -->
          <line x1="${x + 15}" y1="${y + 15}" x2="${x + 35}" y2="${y + 35}" stroke="#ef4444" stroke-width="3" />
          <line x1="${x + 35}" y1="${y + 15}" x2="${x + 15}" y2="${y + 35}" stroke="#ef4444" stroke-width="3" />
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'sub') {
    const hullColor = piece.team === 'yellow' ? '#4a4a4a' : '#3a4a3a'
    const hullDark = piece.team === 'yellow' ? '#2d2d2d' : '#1d2d1d'
    const frozen = piece.frozenTurns && piece.frozenTurns > 0
    // Submarine design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Water/bubbles -->
        <circle cx="${x + 10}" cy="${y + 12}" r="2" fill="#87ceeb" opacity="0.6" />
        <circle cx="${x + 15}" cy="${y + 8}" r="1.5" fill="#87ceeb" opacity="0.5" />
        <circle cx="${x + 8}" cy="${y + 6}" r="1" fill="#87ceeb" opacity="0.4" />
        <!-- Hull (submarine body) -->
        <ellipse cx="${x + 25}" cy="${y + 30}" rx="20" ry="10" fill="${hullColor}" stroke="${hullDark}" stroke-width="1.5" />
        <!-- Hull top highlight -->
        <ellipse cx="${x + 25}" cy="${y + 26}" rx="16" ry="5" fill="${hullColor}" opacity="0.8" />
        <!-- Conning tower (sail) -->
        <rect x="${x + 18}" y="${y + 16}" width="14" height="12" rx="2" fill="${hullColor}" stroke="${hullDark}" stroke-width="1" />
        <!-- Periscope -->
        <rect x="${x + 24}" y="${y + 6}" width="2" height="12" fill="#3d3d3d" />
        <rect x="${x + 22}" y="${y + 4}" width="6" height="4" rx="1" fill="#2d2d2d" />
        <!-- Periscope lens -->
        <rect x="${x + 23}" y="${y + 5}" width="4" height="2" fill="#87ceeb" opacity="0.8" />
        <!-- Windows on tower -->
        <circle cx="${x + 22}" cy="${y + 20}" r="2" fill="#87ceeb" opacity="0.6" />
        <circle cx="${x + 28}" cy="${y + 20}" r="2" fill="#87ceeb" opacity="0.6" />
        <!-- Hull details -->
        <line x1="${x + 8}" y1="${y + 30}" x2="${x + 42}" y2="${y + 30}" stroke="${hullDark}" stroke-width="1" />
        <!-- Propeller area -->
        <ellipse cx="${x + 44}" cy="${y + 30}" rx="3" ry="6" fill="${hullDark}" />
        <!-- Front torpedo tubes -->
        <circle cx="${x + 6}" cy="${y + 28}" r="2" fill="#2d2d2d" />
        <circle cx="${x + 6}" cy="${y + 32}" r="2" fill="#2d2d2d" />
        <!-- Dive planes -->
        <rect x="${x + 5}" y="${y + 26}" width="6" height="2" fill="${hullDark}" />
        <rect x="${x + 39}" y="${y + 26}" width="6" height="2" fill="${hullDark}" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 10}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${frozen ? `
          <!-- Frozen indicator -->
          <rect x="${x + 5}" y="${y + 5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${x + 25}" y="${y + 28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'fighter') {
    const bodyColor = piece.team === 'yellow' ? '#5a5a5a' : '#4a5a4a'
    const bodyDark = piece.team === 'yellow' ? '#3a3a3a' : '#2a3a2a'
    const cockpitColor = '#87ceeb'
    const frozen = piece.frozenTurns && piece.frozenTurns > 0
    const onCooldown = piece.cooldownTurns && piece.cooldownTurns > 0
    // Fighter jet design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Fuselage (body) -->
        <ellipse cx="${x + 25}" cy="${y + 28}" rx="8" ry="18" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Nose cone -->
        <path d="M${x + 20} ${y + 10} L${x + 25} ${y + 2} L${x + 30} ${y + 10} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Cockpit -->
        <ellipse cx="${x + 25}" cy="${y + 16}" rx="5" ry="6" fill="${cockpitColor}" stroke="#5a9ab8" stroke-width="1" opacity="0.9" />
        <ellipse cx="${x + 25}" cy="${y + 14}" rx="3" ry="3" fill="white" opacity="0.3" />
        <!-- Wings -->
        <path d="M${x + 17} ${y + 26} L${x + 3} ${y + 34} L${x + 5} ${y + 38} L${x + 17} ${y + 32} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <path d="M${x + 33} ${y + 26} L${x + 47} ${y + 34} L${x + 45} ${y + 38} L${x + 33} ${y + 32} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Wing missiles -->
        <ellipse cx="${x + 8}" cy="${y + 36}" rx="2" ry="5" fill="#ef4444" stroke="#b91c1c" stroke-width="0.5" />
        <ellipse cx="${x + 42}" cy="${y + 36}" rx="2" ry="5" fill="#ef4444" stroke="#b91c1c" stroke-width="0.5" />
        <!-- Tail fins -->
        <path d="M${x + 22} ${y + 42} L${x + 18} ${y + 48} L${x + 22} ${y + 46} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <path d="M${x + 28} ${y + 42} L${x + 32} ${y + 48} L${x + 28} ${y + 46} Z" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="0.5" />
        <!-- Vertical stabilizer -->
        <path d="M${x + 23} ${y + 38} L${x + 25} ${y + 32} L${x + 27} ${y + 38} Z" fill="${bodyDark}" />
        <!-- Engine exhaust -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="4" ry="2" fill="#2d2d2d" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 6}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Cooldown indicator -->
        ${onCooldown ? `
          <circle cx="${x + 40}" cy="${y + 10}" r="6" fill="#ef4444" opacity="0.8" />
          <text x="${x + 40}" y="${y + 13}" text-anchor="middle" font-size="8" fill="white">${piece.cooldownTurns}</text>
        ` : ''}
        ${frozen ? `
          <!-- Frozen indicator -->
          <rect x="${x + 5}" y="${y + 5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${x + 25}" y="${y + 28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'hacker') {
    const bodyColor = piece.team === 'yellow' ? '#1a1a2e' : '#1a2e1a'
    const bodyDark = piece.team === 'yellow' ? '#0f0f1a' : '#0f1a0f'
    const screenColor = '#00ff00'
    const frozen = piece.frozenTurns && piece.frozenTurns > 0
    // Hacker design - person at computer
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Desk -->
        <rect x="${x + 8}" y="${y + 36}" width="34" height="8" rx="1" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />
        <!-- Chair back -->
        <rect x="${x + 14}" y="${y + 24}" width="22" height="14" rx="2" fill="#2d2d2d" stroke="#1a1a1a" stroke-width="1" />
        <!-- Monitor -->
        <rect x="${x + 18}" y="${y + 26}" width="14" height="10" rx="1" fill="#1a1a1a" stroke="#333" stroke-width="1" />
        <!-- Screen -->
        <rect x="${x + 19}" y="${y + 27}" width="12" height="8" fill="${bodyColor}" />
        <!-- Code on screen -->
        <line x1="${x + 20}" y1="${y + 29}" x2="${x + 26}" y2="${y + 29}" stroke="${screenColor}" stroke-width="1" opacity="0.8" />
        <line x1="${x + 20}" y1="${y + 31}" x2="${x + 29}" y2="${y + 31}" stroke="${screenColor}" stroke-width="1" opacity="0.6" />
        <line x1="${x + 20}" y1="${y + 33}" x2="${x + 24}" y2="${y + 33}" stroke="${screenColor}" stroke-width="1" opacity="0.7" />
        <!-- Monitor stand -->
        <rect x="${x + 23}" y="${y + 36}" width="4" height="2" fill="#333" />
        <!-- Keyboard -->
        <rect x="${x + 10}" y="${y + 38}" width="12" height="4" rx="1" fill="#333" />
        <rect x="${x + 11}" y="${y + 39}" width="10" height="2" fill="#4a4a4a" />
        <!-- Person body (hoodie) -->
        <ellipse cx="${x + 25}" cy="${y + 20}" rx="8" ry="6" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Hood -->
        <path d="M${x + 17} ${y + 22} Q${x + 25} ${y + 10} ${x + 33} ${y + 22}" fill="${bodyColor}" stroke="${bodyDark}" stroke-width="1" />
        <!-- Face (shadowed) -->
        <ellipse cx="${x + 25}" cy="${y + 18}" rx="5" ry="4" fill="#2d2d2d" />
        <!-- Glasses/eyes glow -->
        <rect x="${x + 21}" y="${y + 16}" width="3" height="2" fill="${screenColor}" opacity="0.8" />
        <rect x="${x + 26}" y="${y + 16}" width="3" height="2" fill="${screenColor}" opacity="0.8" />
        <!-- Arms on keyboard -->
        <ellipse cx="${x + 16}" cy="${y + 34}" rx="3" ry="2" fill="${bodyColor}" />
        <ellipse cx="${x + 34}" cy="${y + 34}" rx="3" ry="2" fill="${bodyColor}" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 6}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Cooldown indicator -->
        ${piece.cooldownTurns && piece.cooldownTurns > 0 ? `
          <circle cx="${x + 40}" cy="${y + 10}" r="6" fill="#ef4444" opacity="0.8" />
          <text x="${x + 40}" y="${y + 13}" text-anchor="middle" font-size="8" fill="white">${piece.cooldownTurns}</text>
        ` : ''}
        ${frozen ? `
          <!-- Frozen indicator -->
          <rect x="${x + 5}" y="${y + 5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${x + 25}" y="${y + 28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'builder') {
    const vestColor = piece.team === 'yellow' ? '#f59e0b' : '#22c55e'
    const vestDark = piece.team === 'yellow' ? '#d97706' : '#16a34a'
    const skinColor = '#e8c39e'
    const skinDark = '#d4a574'
    const frozen = piece.frozenTurns && piece.frozenTurns > 0
    // Builder design - construction worker with tools
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 47}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />

        <!-- Boots -->
        <ellipse cx="${x + 19}" cy="${y + 45}" rx="5" ry="3" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />
        <ellipse cx="${x + 31}" cy="${y + 45}" rx="5" ry="3" fill="#4a3728" stroke="#2d1f14" stroke-width="1" />

        <!-- Legs (jeans) -->
        <rect x="${x + 16}" y="${y + 34}" width="7" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.5" />
        <rect x="${x + 27}" y="${y + 34}" width="7" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.5" />

        <!-- Torso (safety vest) -->
        <rect x="${x + 14}" y="${y + 20}" width="22" height="16" rx="2" fill="${vestColor}" stroke="${vestDark}" stroke-width="1" />
        <!-- Reflective stripes -->
        <rect x="${x + 14}" y="${y + 24}" width="22" height="2" fill="#fef9c3" opacity="0.9" />
        <rect x="${x + 14}" y="${y + 30}" width="22" height="2" fill="#fef9c3" opacity="0.9" />
        <!-- Vest opening (shirt underneath) -->
        <rect x="${x + 22}" y="${y + 20}" width="6" height="8" fill="#374151" />

        <!-- Arms -->
        <rect x="${x + 8}" y="${y + 22}" width="6" height="12" rx="2" fill="${vestColor}" stroke="${vestDark}" stroke-width="0.5" />
        <rect x="${x + 36}" y="${y + 22}" width="6" height="12" rx="2" fill="${vestColor}" stroke="${vestDark}" stroke-width="0.5" />
        <!-- Hands -->
        <ellipse cx="${x + 11}" cy="${y + 36}" rx="3" ry="2.5" fill="${skinColor}" stroke="${skinDark}" stroke-width="0.5" />
        <ellipse cx="${x + 39}" cy="${y + 36}" rx="3" ry="2.5" fill="${skinColor}" stroke="${skinDark}" stroke-width="0.5" />

        <!-- Neck -->
        <rect x="${x + 22}" y="${y + 14}" width="6" height="6" fill="${skinColor}" />

        <!-- Head -->
        <ellipse cx="${x + 25}" cy="${y + 12}" rx="7" ry="6" fill="${skinColor}" stroke="${skinDark}" stroke-width="0.5" />

        <!-- Hard hat -->
        <ellipse cx="${x + 25}" cy="${y + 8}" rx="9" ry="4" fill="#fcd34d" stroke="#f59e0b" stroke-width="1" />
        <rect x="${x + 16}" y="${y + 6}" width="18" height="4" rx="1" fill="#fcd34d" stroke="#f59e0b" stroke-width="1" />
        <!-- Hard hat brim -->
        <rect x="${x + 14}" y="${y + 10}" width="22" height="2" fill="#f59e0b" />

        <!-- Face -->
        <circle cx="${x + 22}" cy="${y + 12}" r="1" fill="#1a1a1a" />
        <circle cx="${x + 28}" cy="${y + 12}" r="1" fill="#1a1a1a" />
        <path d="M${x + 23} ${y + 15} Q${x + 25} ${y + 16} ${x + 27} ${y + 15}" fill="none" stroke="#1a1a1a" stroke-width="0.8" />

        <!-- Tool belt -->
        <rect x="${x + 13}" y="${y + 34}" width="24" height="3" fill="#5c4033" stroke="#3d2817" stroke-width="0.5" />
        <rect x="${x + 15}" y="${y + 33}" width="4" height="5" fill="#6b7280" rx="1" />
        <rect x="${x + 31}" y="${y + 33}" width="4" height="5" fill="#6b7280" rx="1" />

        <!-- Hammer in hand -->
        <rect x="${x + 38}" y="${y + 28}" width="2" height="10" fill="#8b4513" stroke="#5c3d1e" stroke-width="0.5" />
        <rect x="${x + 36}" y="${y + 26}" width="6" height="4" rx="1" fill="#6b7280" stroke="#4b5563" stroke-width="0.5" />

        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 2}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />

        ${frozen ? `
          <rect x="${x + 5}" y="${y + 5}" width="40" height="40" fill="#60a5fa" opacity="0.3" rx="4" />
          <text x="${x + 25}" y="${y + 28}" text-anchor="middle" font-size="16" fill="#3b82f6">❄</text>
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'barricade') {
    const woodColor = piece.team === 'yellow' ? '#92400e' : '#065f46'
    const woodDark = piece.team === 'yellow' ? '#78350f' : '#064e3b'
    // Barricade design - wooden barrier
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="18" ry="3" fill="rgba(0,0,0,0.3)" />
        <!-- Vertical posts -->
        <rect x="${x + 8}" y="${y + 15}" width="6" height="30" fill="${woodColor}" stroke="${woodDark}" stroke-width="1" />
        <rect x="${x + 36}" y="${y + 15}" width="6" height="30" fill="${woodColor}" stroke="${woodDark}" stroke-width="1" />
        <!-- Horizontal planks -->
        <rect x="${x + 6}" y="${y + 18}" width="38" height="6" rx="1" fill="${woodColor}" stroke="${woodDark}" stroke-width="1" />
        <rect x="${x + 6}" y="${y + 28}" width="38" height="6" rx="1" fill="${woodColor}" stroke="${woodDark}" stroke-width="1" />
        <rect x="${x + 6}" y="${y + 38}" width="38" height="6" rx="1" fill="${woodColor}" stroke="${woodDark}" stroke-width="1" />
        <!-- Wood grain -->
        <line x1="${x + 10}" y1="${y + 20}" x2="${x + 40}" y2="${y + 20}" stroke="${woodDark}" stroke-width="0.5" opacity="0.5" />
        <line x1="${x + 10}" y1="${y + 30}" x2="${x + 40}" y2="${y + 30}" stroke="${woodDark}" stroke-width="0.5" opacity="0.5" />
        <line x1="${x + 10}" y1="${y + 40}" x2="${x + 40}" y2="${y + 40}" stroke="${woodDark}" stroke-width="0.5" opacity="0.5" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 8}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'artillery') {
    const metalColor = piece.team === 'yellow' ? '#4a4a4a' : '#3a4a3a'
    const metalDark = piece.team === 'yellow' ? '#2d2d2d' : '#1d2d1d'
    // Artillery cannon design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Shadow -->
        <ellipse cx="${x + 25}" cy="${y + 46}" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
        <!-- Base/platform -->
        <rect x="${x + 8}" y="${y + 38}" width="34" height="8" rx="2" fill="${metalColor}" stroke="${metalDark}" stroke-width="1" />
        <!-- Wheels -->
        <circle cx="${x + 14}" cy="${y + 44}" r="5" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <circle cx="${x + 36}" cy="${y + 44}" r="5" fill="#4a4a4a" stroke="#2d2d2d" stroke-width="1" />
        <circle cx="${x + 14}" cy="${y + 44}" r="2" fill="#2d2d2d" />
        <circle cx="${x + 36}" cy="${y + 44}" r="2" fill="#2d2d2d" />
        <!-- Cannon base -->
        <rect x="${x + 18}" y="${y + 28}" width="14" height="12" rx="2" fill="${metalColor}" stroke="${metalDark}" stroke-width="1" />
        <!-- Cannon barrel -->
        <rect x="${x + 20}" y="${y + 8}" width="10" height="24" rx="2" fill="${metalColor}" stroke="${metalDark}" stroke-width="1.5" />
        <ellipse cx="${x + 25}" cy="${y + 8}" rx="6" ry="3" fill="${metalDark}" />
        <!-- Muzzle -->
        <ellipse cx="${x + 25}" cy="${y + 6}" rx="4" ry="2" fill="#1a1a1a" />
        <!-- Team indicator -->
        <circle cx="${x + 40}" cy="${y + 10}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        ${colorblindSymbol}
      </g>
    `
  }

  if (piece.type === 'spike') {
    const spikeColor = '#6b7280'
    const spikeDark = '#4b5563'
    // Spike trap design
    return `
      <g class="cursor-pointer" data-piece="${piece.type}" data-team="${piece.team}" data-col="${piece.col}" data-row="${piece.row}">
        <!-- Base -->
        <rect x="${x + 8}" y="${y + 38}" width="34" height="8" rx="1" fill="#4b5563" stroke="#374151" stroke-width="1" />
        <!-- Spikes -->
        <polygon points="${x + 12},${y + 38} ${x + 15},${y + 18} ${x + 18},${y + 38}" fill="${spikeColor}" stroke="${spikeDark}" stroke-width="1" />
        <polygon points="${x + 20},${y + 38} ${x + 23},${y + 14} ${x + 26},${y + 38}" fill="${spikeColor}" stroke="${spikeDark}" stroke-width="1" />
        <polygon points="${x + 28},${y + 38} ${x + 31},${y + 18} ${x + 34},${y + 38}" fill="${spikeColor}" stroke="${spikeDark}" stroke-width="1" />
        <!-- Sharp tips -->
        <circle cx="${x + 15}" cy="${y + 16}" r="2" fill="#ef4444" />
        <circle cx="${x + 23}" cy="${y + 12}" r="2" fill="#ef4444" />
        <circle cx="${x + 31}" cy="${y + 16}" r="2" fill="#ef4444" />
        <!-- Team indicator -->
        <circle cx="${x + 25}" cy="${y + 6}" r="3" fill="${teamColor}" stroke="${strokeColor}" stroke-width="1" />
        <!-- Timer -->
        ${piece.turnsRemaining ? `
          <circle cx="${x + 40}" cy="${y + 10}" r="6" fill="#6b7280" opacity="0.8" />
          <text x="${x + 40}" y="${y + 13}" text-anchor="middle" font-size="8" fill="white">${piece.turnsRemaining}</text>
        ` : ''}
        ${colorblindSymbol}
      </g>
    `
  }

  return ''
}

function createBoard(): string {
  const boardWidth = BOARD_SIZE * SQUARE_SIZE
  const boardHeight = BOARD_SIZE * SQUARE_SIZE
  const totalWidth = boardWidth + LABEL_SIZE
  const totalHeight = boardHeight + LABEL_SIZE

  let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" class="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[80vh] w-auto touch-manipulation">`

  // Special tile definitions
  const isRiver = (row: number, col: number) => row === 5 && col !== 5 // Row 6 (index 5), except F6
  const isBridge = (row: number, col: number) => row === 5 && col === 5 // F6
  const isGrey = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // e4-5, g4-5, e7-8, g7-8 (tunnel path squares, NOT e3, e9, g3, g9)
    return (colLetter === 'E' && rowNum >= 4 && rowNum <= 5) ||
           (colLetter === 'G' && rowNum >= 4 && rowNum <= 5) ||
           (colLetter === 'E' && rowNum >= 7 && rowNum <= 8) ||
           (colLetter === 'G' && rowNum >= 7 && rowNum <= 8)
  }
  const isBush = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // a3-c4, i3-k4, a8-c9, i8-k9
    return (['A', 'B', 'C'].includes(colLetter) && rowNum >= 3 && rowNum <= 4) ||
           (['I', 'J', 'K'].includes(colLetter) && rowNum >= 3 && rowNum <= 4) ||
           (['A', 'B', 'C'].includes(colLetter) && rowNum >= 8 && rowNum <= 9) ||
           (['I', 'J', 'K'].includes(colLetter) && rowNum >= 8 && rowNum <= 9)
  }
  const isHelipad = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // c5, c7, i5, i7
    return (colLetter === 'C' && (rowNum === 5 || rowNum === 7)) ||
           (colLetter === 'I' && (rowNum === 5 || rowNum === 7))
  }
  const isRailTrack = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // a1-2, k1-2, a10-11, k10-11
    return (colLetter === 'A' && (rowNum === 1 || rowNum === 2)) ||
           (colLetter === 'K' && (rowNum === 1 || rowNum === 2)) ||
           (colLetter === 'A' && (rowNum === 10 || rowNum === 11)) ||
           (colLetter === 'K' && (rowNum === 10 || rowNum === 11))
  }
  const isTunnel = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // e4, e8, g4, g8
    return (colLetter === 'E' && (rowNum === 4 || rowNum === 8)) ||
           (colLetter === 'G' && (rowNum === 4 || rowNum === 8))
  }
  const isTrench = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // f3, f9
    return colLetter === 'F' && (rowNum === 3 || rowNum === 9)
  }

  // Draw squares
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const x = LABEL_SIZE + col * SQUARE_SIZE
      const y = row * SQUARE_SIZE
      const isLight = (row + col) % 2 === 0

      let fill: string
      if (isRiver(row, col)) {
        fill = '#4a90d9' // Water blue
      } else if (isBridge(row, col)) {
        fill = '#8b7355' // Bridge brown
      } else if (isGrey(row, col)) {
        fill = '#6b7280' // Grey
      } else if (isBush(row, col)) {
        fill = '#f59e0b' // Orange
      } else if (isHelipad(row, col)) {
        fill = '#ffffff' // White
      } else {
        const themeColors = getThemeColors()
        fill = isLight ? themeColors.light : themeColors.dark
      }

      svg += `<rect
        x="${x}"
        y="${y}"
        width="${SQUARE_SIZE}"
        height="${SQUARE_SIZE}"
        fill="${fill}"
        data-row="${BOARD_SIZE - row}"
        data-col="${columns[col]}"
        class="cursor-pointer hover:brightness-110 transition-all"
      />`

      // Add water ripple effect for river tiles
      if (isRiver(row, col)) {
        svg += `<path
          d="M${x + 3} ${y + 12} q8 -4 16 0 q8 4 16 0"
          stroke="#6bb3e8"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`
        svg += `<path
          d="M${x + 8} ${y + 25} q10 -5 20 0 q10 5 15 0"
          stroke="#7ec8f0"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`
        svg += `<path
          d="M${x + 2} ${y + 38} q12 -4 24 0 q12 4 18 0"
          stroke="#6bb3e8"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`
      }

      // Add bridge planks for bridge tile (with water underneath)
      if (isBridge(row, col)) {
        // Draw water underneath first
        svg += `<rect
          x="${x}"
          y="${y}"
          width="${SQUARE_SIZE}"
          height="${SQUARE_SIZE}"
          fill="#4a90d9"
          class="pointer-events-none"
        />`
        svg += `<path
          d="M${x + 3} ${y + 15} q8 -4 16 0 q8 4 16 0"
          stroke="#6bb3e8"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`
        svg += `<path
          d="M${x + 5} ${y + 35} q10 -4 20 0 q10 4 15 0"
          stroke="#7ec8f0"
          stroke-width="1.5"
          fill="none"
          class="pointer-events-none"
        />`
        // Draw bridge planks on top
        for (let i = 0; i < 5; i++) {
          svg += `<rect
            x="${x + 5}"
            y="${y + 5 + i * 10}"
            width="40"
            height="6"
            fill="#a08060"
            stroke="#6b5344"
            stroke-width="1"
            class="pointer-events-none"
          />`
        }
      }

      // Add squiggly black bushes for bush tiles
      if (isBush(row, col)) {
        svg += `<path
          d="M${x + 10} ${y + 40} q5 -15 0 -20 q-5 -5 5 -10 q3 5 8 0 q5 5 0 10 q-5 5 0 20"
          stroke="#1a1a1a"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`
        svg += `<path
          d="M${x + 30} ${y + 42} q3 -10 -2 -15 q-4 -8 4 -12 q4 4 8 2 q6 6 2 12 q-3 8 -4 15"
          stroke="#1a1a1a"
          stroke-width="2"
          fill="none"
          class="pointer-events-none"
        />`
        svg += `<circle cx="${x + 12}" cy="${y + 15}" r="4" fill="#2d2d2d" class="pointer-events-none" />`
        svg += `<circle cx="${x + 38}" cy="${y + 18}" r="3" fill="#2d2d2d" class="pointer-events-none" />`
        svg += `<circle cx="${x + 25}" cy="${y + 12}" r="5" fill="#1a1a1a" class="pointer-events-none" />`
      }

      // Add helipad marking
      if (isHelipad(row, col)) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="#333" stroke-width="2" class="pointer-events-none" />`
        svg += `<text
          x="${cx}"
          y="${cy + 6}"
          text-anchor="middle"
          font-size="20"
          font-weight="bold"
          fill="#333"
          class="pointer-events-none select-none"
        >H</text>`
      }

      // Add vertical train rails
      if (isRailTrack(row, col)) {
        // Two vertical rails
        svg += `<line x1="${x + 15}" y1="${y}" x2="${x + 15}" y2="${y + SQUARE_SIZE}" stroke="#4a4a4a" stroke-width="3" class="pointer-events-none" />`
        svg += `<line x1="${x + 35}" y1="${y}" x2="${x + 35}" y2="${y + SQUARE_SIZE}" stroke="#4a4a4a" stroke-width="3" class="pointer-events-none" />`
        // Horizontal sleepers/ties
        for (let i = 0; i < 5; i++) {
          const ty = y + 5 + i * 10
          svg += `<rect x="${x + 10}" y="${ty}" width="30" height="4" fill="#8b5a2b" class="pointer-events-none" />`
        }
      }

      // Add tunnel holes
      if (isTunnel(row, col)) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        // Dark tunnel hole (ellipse for depth effect)
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="14" fill="#1a1a1a" class="pointer-events-none" />`
        svg += `<ellipse cx="${cx}" cy="${cy - 2}" rx="16" ry="11" fill="#2d2d2d" class="pointer-events-none" />`
        svg += `<ellipse cx="${cx}" cy="${cy - 4}" rx="12" ry="7" fill="#0a0a0a" class="pointer-events-none" />`
        // Stone arch around the hole
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="20" ry="16" fill="none" stroke="#6b6b6b" stroke-width="3" class="pointer-events-none" />`
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="18" fill="none" stroke="#4a4a4a" stroke-width="2" class="pointer-events-none" />`
      }

      // Add trenches (loopgraven)
      if (isTrench(row, col)) {
        // Brown dirt trench
        svg += `<rect x="${x + 5}" y="${y + 15}" width="40" height="20" fill="#5c4033" class="pointer-events-none" />`
        svg += `<rect x="${x + 7}" y="${y + 17}" width="36" height="16" fill="#3d2817" class="pointer-events-none" />`
        // Sandbags on edges
        svg += `<ellipse cx="${x + 12}" cy="${y + 14}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
        svg += `<ellipse cx="${x + 25}" cy="${y + 13}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
        svg += `<ellipse cx="${x + 38}" cy="${y + 14}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
        svg += `<ellipse cx="${x + 12}" cy="${y + 36}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
        svg += `<ellipse cx="${x + 25}" cy="${y + 37}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
        svg += `<ellipse cx="${x + 38}" cy="${y + 36}" rx="6" ry="4" fill="#c2a878" stroke="#8b7355" stroke-width="1" class="pointer-events-none" />`
      }

      // Draw pieces if present (handles barricade + piece behind it)
      const colLetter = columns[col]
      const rowNum = BOARD_SIZE - row
      const piecesHere = getPiecesAt(colLetter, rowNum)

      // Separate barricade from other pieces
      const barricade = piecesHere.find(p => p.type === 'barricade')
      const otherPiece = piecesHere.find(p => p.type !== 'barricade')

      // Draw the piece behind barricade first (so barricade appears on top)
      if (otherPiece) {
        // Check if this piece is the charging train
        if (trainHitAnimation && trainHitAnimation.train === otherPiece && trainHitAnimation.phase === 'moving') {
          const progress = (trainHitAnimation as any).progress || 0
          const targetColIndex = columns.indexOf(trainHitAnimation.targetCol)
          const targetX = LABEL_SIZE + targetColIndex * SQUARE_SIZE
          const targetY = (BOARD_SIZE - trainHitAnimation.targetRow) * SQUARE_SIZE

          const animX = x + (targetX - x) * progress
          const animY = y + (targetY - y) * progress

          // Draw train at animated position with shake effect
          const shakeX = progress > 0.8 ? Math.sin(progress * 50) * 3 : 0
          svg += drawPiece(otherPiece, animX + shakeX, animY)
        }
        // Check if this piece is moving
        else if (moveAnimation && moveAnimation.piece === otherPiece) {
          // Don't draw here - we'll draw at animated position below
        }
        // Check if fighter is in bombing animation
        else if (fighterAnimation && fighterAnimation.fighter === otherPiece) {
          // Don't draw here - we'll draw at animated position
        } else {
          // Highlight selected piece
          if (selectedPiece === otherPiece) {
            svg += `<rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="none" stroke="#3b82f6" stroke-width="3" rx="4" class="pointer-events-none" />`
          }
          // Draw piece slightly back/smaller when behind barricade
          if (barricade) {
            svg += drawPiece(otherPiece, x, y - 8) // Draw piece shifted up (behind barricade)
          } else {
            svg += drawPiece(otherPiece, x, y)
          }
        }
      }

      // Draw barricade on top
      if (barricade) {
        if (selectedPiece === barricade) {
          svg += `<rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="none" stroke="#3b82f6" stroke-width="3" rx="4" class="pointer-events-none" />`
        }
        svg += drawPiece(barricade, x, y + 10) // Draw barricade at bottom of square
      }

      // Draw piece that is currently in move animation (at its animated position)
      if (moveAnimation && moveAnimation.fromCol === colLetter && moveAnimation.fromRow === rowNum) {
        const progress = moveAnimation.progress
        const toColIndex = columns.indexOf(moveAnimation.toCol)
        const toX = LABEL_SIZE + toColIndex * SQUARE_SIZE
        const toY = (BOARD_SIZE - moveAnimation.toRow) * SQUARE_SIZE

        // Ease out animation
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        const animX = x + (toX - x) * easedProgress
        const animY = y + (toY - y) * easedProgress

        // Add slight bounce at the end
        const bounce = progress > 0.8 ? Math.sin((progress - 0.8) * 25) * 2 * (1 - progress) : 0

        svg += drawPiece(moveAnimation.piece, animX, animY + bounce)
      }

      // Draw valid move indicator (X mark)
      const isValidMove = validMoves.some(m => m.col === colLetter && m.row === rowNum)
      if (isValidMove) {
        const move = validMoves.find(m => m.col === colLetter && m.row === rowNum)!
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        const color = move.canCapture ? '#ef4444' : '#3b82f6'
        svg += `<g class="pointer-events-none">
          <line x1="${cx - 10}" y1="${cy - 10}" x2="${cx + 10}" y2="${cy + 10}" stroke="${color}" stroke-width="4" stroke-linecap="round" />
          <line x1="${cx + 10}" y1="${cy - 10}" x2="${cx - 10}" y2="${cy + 10}" stroke="${color}" stroke-width="4" stroke-linecap="round" />
        </g>`
      }

      // Draw shoot target indicator (crosshair)
      const isShootTarget = shootTargets.some(t => t.col === colLetter && t.row === rowNum)
      if (isShootTarget) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <circle cx="${cx}" cy="${cy}" r="15" fill="none" stroke="#ef4444" stroke-width="3" />
          <circle cx="${cx}" cy="${cy}" r="5" fill="#ef4444" />
          <line x1="${cx - 20}" y1="${cy}" x2="${cx - 8}" y2="${cy}" stroke="#ef4444" stroke-width="3" />
          <line x1="${cx + 8}" y1="${cy}" x2="${cx + 20}" y2="${cy}" stroke="#ef4444" stroke-width="3" />
          <line x1="${cx}" y1="${cy - 20}" x2="${cx}" y2="${cy - 8}" stroke="#ef4444" stroke-width="3" />
          <line x1="${cx}" y1="${cy + 8}" x2="${cx}" y2="${cy + 20}" stroke="#ef4444" stroke-width="3" />
        </g>`
      }

      // Draw rocket target indicator (3x3 area preview)
      const isRocketTarget = rocketTargetArea.some(t => t.col === colLetter && t.row === rowNum)
      if (isRocketTarget) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 5}" y="${y + 5}" width="${SQUARE_SIZE - 10}" height="${SQUARE_SIZE - 10}" fill="#ef4444" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="bold">💥</text>
        </g>`
      }

      // Draw hack target indicator
      const isHackTarget = hackTargets.some(t => t.col === colLetter && t.row === rowNum)
      if (isHackTarget) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 3}" y="${y + 3}" width="${SQUARE_SIZE - 6}" height="${SQUARE_SIZE - 6}" fill="#a855f7" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,3" />
        </g>`
      }

      // Draw selected hack target indicator
      if (selectedHackTarget && selectedHackTarget.col === colLetter && selectedHackTarget.row === rowNum) {
        svg += `<g class="pointer-events-none">
          <rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="none" stroke="#a855f7" stroke-width="3" rx="4" />
        </g>`
      }

      // Draw bomb target indicator (fighter)
      const isBombTarget = bombTargets.some(t => t.col === colLetter && t.row === rowNum)
      if (isBombTarget) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 3}" y="${y + 3}" width="${SQUARE_SIZE - 6}" height="${SQUARE_SIZE - 6}" fill="#f97316" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="3,3" />
          <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" fill="#f97316">💣</text>
        </g>`
      }

      // Draw selected bomb target indicator
      if (selectedBombTarget && selectedBombTarget.col === colLetter && selectedBombTarget.row === rowNum) {
        svg += `<g class="pointer-events-none">
          <rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="#f97316" opacity="0.4" stroke="#f97316" stroke-width="3" rx="4" />
        </g>`
      }

      // Draw landing spot indicator (fighter)
      const isLandingSpot = landingSpots.some(s => s.col === colLetter && s.row === rowNum)
      if (isLandingSpot) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 4}" y="${y + 4}" width="${SQUARE_SIZE - 8}" height="${SQUARE_SIZE - 8}" fill="#22c55e" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#22c55e" stroke-width="2" />
          <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10" fill="#22c55e">✈</text>
        </g>`
      }

      // Draw builder placement spot indicator
      const isBuilderSpot = builderPlacementSpots.some(s => s.col === colLetter && s.row === rowNum)
      if (isBuilderSpot) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        const spotColor = builderPlacementMode === 'barricade' ? '#8b4513' :
                         builderPlacementMode === 'artillery' ? '#4a4a4a' : '#ef4444'
        const spotIcon = builderPlacementMode === 'barricade' ? '🧱' :
                        builderPlacementMode === 'artillery' ? '💥' : '⚠'
        svg += `<g class="pointer-events-none">
          <rect x="${x + 4}" y="${y + 4}" width="${SQUARE_SIZE - 8}" height="${SQUARE_SIZE - 8}" fill="${spotColor}" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${spotColor}" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14">${spotIcon}</text>
        </g>`
      }

      // Draw helicopter launch spot indicator
      const isHelicopterLaunchSpot = helicopterLaunchSpots.some(s => s.col === colLetter && s.row === rowNum)
      if (isHelicopterLaunchSpot) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 4}" y="${y + 4}" width="${SQUARE_SIZE - 8}" height="${SQUARE_SIZE - 8}" fill="#0ea5e9" opacity="0.3" rx="4" />
          <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,2" />
          <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14">🚁</text>
        </g>`
      }

      // Draw frozen indicator for pieces
      if (otherPiece && otherPiece.frozenTurns && otherPiece.frozenTurns > 0) {
        const cx = x + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none">
          <rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="#60a5fa" opacity="0.4" rx="4" />
          <text x="${cx}" y="${y + 12}" text-anchor="middle" font-size="10" fill="#1e40af">❄${otherPiece.frozenTurns}</text>
        </g>`
      }

      // Draw rocket explosion animation (3x3 area)
      if (rocketAnimation && rocketAnimation.phase === 'exploding') {
        const explosionArea = getRocketExplosionArea(rocketAnimation.targetCol, rocketAnimation.targetRow)
        const isInExplosion = explosionArea.some(e => e.col === colLetter && e.row === rowNum)
        if (isInExplosion) {
          const cx = x + SQUARE_SIZE / 2
          const cy = y + SQUARE_SIZE / 2
          const scale = 0.5 + rocketAnimation.progress * 0.5
          const opacity = 1 - rocketAnimation.progress * 0.7
          svg += `<g class="pointer-events-none">
            <circle cx="${cx}" cy="${cy}" r="${20 * scale}" fill="#ef4444" opacity="${opacity * 0.8}" />
            <circle cx="${cx}" cy="${cy}" r="${15 * scale}" fill="#f97316" opacity="${opacity * 0.9}" />
            <circle cx="${cx}" cy="${cy}" r="${8 * scale}" fill="#fbbf24" opacity="${opacity}" />
          </g>`
        }
      }

      // Draw explosion animation
      if (explosionAt && explosionAt.col === colLetter && explosionAt.row === rowNum) {
        const cx = x + SQUARE_SIZE / 2
        const cy = y + SQUARE_SIZE / 2
        svg += `<g class="pointer-events-none animate-explosion">
          <circle cx="${cx}" cy="${cy}" r="20" fill="#ef4444" opacity="0.8" />
          <circle cx="${cx}" cy="${cy}" r="15" fill="#f97316" opacity="0.9" />
          <circle cx="${cx}" cy="${cy}" r="8" fill="#fbbf24" />
          <!-- Explosion particles -->
          <circle cx="${cx - 12}" cy="${cy - 8}" r="4" fill="#ef4444" opacity="0.7" />
          <circle cx="${cx + 10}" cy="${cy - 10}" r="3" fill="#f97316" opacity="0.6" />
          <circle cx="${cx + 8}" cy="${cy + 12}" r="5" fill="#ef4444" opacity="0.7" />
          <circle cx="${cx - 10}" cy="${cy + 8}" r="3" fill="#fbbf24" opacity="0.8" />
          <!-- Smoke -->
          <circle cx="${cx}" cy="${cy - 5}" r="8" fill="#6b7280" opacity="0.6" class="animate-smoke" />
          <circle cx="${cx - 8}" cy="${cy}" r="6" fill="#4b5563" opacity="0.5" class="animate-smoke" />
          <circle cx="${cx + 8}" cy="${cy + 3}" r="7" fill="#6b7280" opacity="0.5" class="animate-smoke" />
        </g>`
      }

    }
  }

  // Draw rocket animation (on top of everything)
  if (rocketAnimation) {
    const rocketPiece = rocketAnimation.rocket
    const rocketColIndex = columns.indexOf(rocketPiece.col)
    const rocketX = LABEL_SIZE + rocketColIndex * SQUARE_SIZE
    const rocketY = (BOARD_SIZE - rocketPiece.row) * SQUARE_SIZE

    const targetColIndex = columns.indexOf(rocketAnimation.targetCol)
    const targetX = LABEL_SIZE + targetColIndex * SQUARE_SIZE
    const targetY = (BOARD_SIZE - rocketAnimation.targetRow) * SQUARE_SIZE

    if (rocketAnimation.phase === 'launching') {
      // Rocket goes up with fire trail
      const progress = rocketAnimation.progress
      const rocketAnimY = rocketY - (progress * 200) // Go up 200 pixels
      const scale = 1 - progress * 0.3

      // Fire trail
      for (let i = 0; i < 5; i++) {
        const trailY = rocketAnimY + 40 + i * 15
        const trailOpacity = (1 - i * 0.15) * (1 - progress * 0.5)
        svg += `<circle cx="${rocketX + 25}" cy="${trailY}" r="${8 - i}" fill="#f97316" opacity="${trailOpacity}" class="pointer-events-none" />`
        svg += `<circle cx="${rocketX + 25}" cy="${trailY + 5}" r="${6 - i}" fill="#fbbf24" opacity="${trailOpacity * 0.8}" class="pointer-events-none" />`
      }

      // Rocket body (simplified)
      svg += `<g class="pointer-events-none" transform="translate(${rocketX}, ${rocketAnimY}) scale(${scale})">
        <rect x="20" y="14" width="10" height="28" rx="3" fill="#5a5a5a" stroke="#3a3a3a" stroke-width="1" />
        <path d="M20 14 L25 4 L30 14 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1" />
        <ellipse cx="25" cy="42" rx="4" ry="2" fill="#f97316" />
      </g>`
    } else if (rocketAnimation.phase === 'flying') {
      // Rocket flies from top to target
      const progress = rocketAnimation.progress
      const startY = rocketY - 200 // Where it ended up after launch
      const animX = rocketX + (targetX - rocketX) * progress
      const animY = startY + (targetY - startY) * progress

      // Fire trail
      for (let i = 0; i < 3; i++) {
        const trailX = animX - (targetX - rocketX) * 0.1 * i
        const trailY = animY - (targetY - startY) * 0.1 * i + 30
        svg += `<circle cx="${trailX + 25}" cy="${trailY}" r="${6 - i * 2}" fill="#f97316" opacity="${0.6 - i * 0.15}" class="pointer-events-none" />`
      }

      // Rocket body (smaller, pointed down)
      svg += `<g class="pointer-events-none" transform="translate(${animX}, ${animY})">
        <rect x="22" y="10" width="6" height="20" rx="2" fill="#5a5a5a" />
        <path d="M22 30 L25 38 L28 30 Z" fill="#ef4444" />
      </g>`
    }
  }

  // Draw fighter animation (on top of everything)
  if (fighterAnimation) {
    const { fighter, startCol, startRow, targetCol, targetRow, landingCol, landingRow, phase, progress } = fighterAnimation

    // Calculate positions
    const startColIndex = columns.indexOf(startCol)
    const startX = LABEL_SIZE + startColIndex * SQUARE_SIZE
    const startY = (BOARD_SIZE - startRow) * SQUARE_SIZE

    const targetColIndex = columns.indexOf(targetCol)
    const targetX = LABEL_SIZE + targetColIndex * SQUARE_SIZE
    const targetY = (BOARD_SIZE - targetRow) * SQUARE_SIZE

    const landingColIndex = columns.indexOf(landingCol)
    const landingX = LABEL_SIZE + landingColIndex * SQUARE_SIZE
    const landingY = (BOARD_SIZE - landingRow) * SQUARE_SIZE

    const teamColor = fighter.team === 'yellow' ? '#fbbf24' : '#22c55e'
    const bodyColor = fighter.team === 'yellow' ? '#5a5a5a' : '#4a5a4a'

    let currentX: number
    let currentY: number

    if (phase === 'flyToTarget') {
      // Fly from start to target
      currentX = startX + (targetX - startX) * progress
      currentY = startY + (targetY - startY) * progress
    } else if (phase === 'bombing') {
      // Hover over target
      currentX = targetX
      currentY = targetY
    } else {
      // Fly from target to landing
      currentX = targetX + (landingX - targetX) * progress
      currentY = targetY + (landingY - targetY) * progress
    }

    // Draw fighter jet
    svg += `<g class="pointer-events-none" transform="translate(${currentX}, ${currentY})">
      <!-- Fuselage -->
      <ellipse cx="25" cy="28" rx="8" ry="18" fill="${bodyColor}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Nose -->
      <path d="M20 10 L25 2 L30 10 Z" fill="${bodyColor}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Cockpit -->
      <ellipse cx="25" cy="16" rx="5" ry="6" fill="#87ceeb" stroke="#5a9ab8" stroke-width="1" opacity="0.9" />
      <!-- Wings -->
      <path d="M17 26 L3 34 L5 38 L17 32 Z" fill="${bodyColor}" stroke="#3a3a3a" stroke-width="1" />
      <path d="M33 26 L47 34 L45 38 L33 32 Z" fill="${bodyColor}" stroke="#3a3a3a" stroke-width="1" />
      <!-- Team indicator -->
      <circle cx="25" cy="6" r="3" fill="${teamColor}" stroke="${fighter.team === 'yellow' ? '#b45309' : '#15803d'}" stroke-width="1" />
    </g>`

    // Draw bomb during bombing phase
    if (phase === 'bombing') {
      const bombY = targetY + 10 + progress * 30
      const bombOpacity = 1 - progress * 0.3
      svg += `<g class="pointer-events-none">
        <ellipse cx="${targetX + 25}" cy="${bombY}" rx="4" ry="6" fill="#1a1a1a" opacity="${bombOpacity}" />
        <path d="M${targetX + 21} ${bombY - 4} L${targetX + 25} ${bombY - 10} L${targetX + 29} ${bombY - 4}" fill="#ef4444" opacity="${bombOpacity}" />
      </g>`

      // Draw explosion at end of bombing
      if (progress > 0.7) {
        const explosionScale = (progress - 0.7) / 0.3
        const cx = targetX + 25
        const cy = targetY + 25
        svg += `<g class="pointer-events-none">
          <circle cx="${cx}" cy="${cy}" r="${15 * explosionScale}" fill="#ef4444" opacity="${0.8 * (1 - explosionScale * 0.5)}" />
          <circle cx="${cx}" cy="${cy}" r="${10 * explosionScale}" fill="#f97316" opacity="${0.9 * (1 - explosionScale * 0.3)}" />
          <circle cx="${cx}" cy="${cy}" r="${5 * explosionScale}" fill="#fbbf24" opacity="1" />
        </g>`
      }
    }
  }

  // Draw column labels (A-K) at bottom
  for (let col = 0; col < BOARD_SIZE; col++) {
    const x = LABEL_SIZE + col * SQUARE_SIZE + SQUARE_SIZE / 2
    const y = boardHeight + LABEL_SIZE / 2 + 6
    svg += `<text
      x="${x}"
      y="${y}"
      text-anchor="middle"
      class="fill-gray-300 text-sm font-semibold select-none"
    >${columns[col]}</text>`
  }

  // Draw row labels (1-11) on left side
  for (let row = 0; row < BOARD_SIZE; row++) {
    const x = LABEL_SIZE / 2
    const y = row * SQUARE_SIZE + SQUARE_SIZE / 2 + 5
    const rowNumber = BOARD_SIZE - row
    svg += `<text
      x="${x}"
      y="${y}"
      text-anchor="middle"
      class="fill-gray-300 text-sm font-semibold select-none"
    >${rowNumber}</text>`
  }

  // ═══════════════════════════════════════════════════════════════
  // SHOOTING VISUAL EFFECTS
  // ═══════════════════════════════════════════════════════════════
  if (shootingEffect) {
    const shooterPos = getBoardPixelPosition(shootingEffect.shooterCol, shootingEffect.shooterRow)
    const targetPos = getBoardPixelPosition(shootingEffect.targetCol, shootingEffect.targetRow)

    // Calculate angle from shooter to target for muzzle flash direction
    const angle = Math.atan2(targetPos.y - shooterPos.y, targetPos.x - shooterPos.x)

    // Muzzle Flash Effect
    if (shootingEffect.phase === 'muzzleFlash' || shootingEffect.phase === 'bulletTravel') {
      const flashSize = shootingEffect.phase === 'muzzleFlash' ? 15 * (1 - shootingEffect.progress * 0.5) : 5
      const flashOpacity = shootingEffect.phase === 'muzzleFlash' ? 1 - shootingEffect.progress : 0.3
      const flashX = shooterPos.x + Math.cos(angle) * 15
      const flashY = shooterPos.y + Math.sin(angle) * 15

      // Main flash
      svg += `<circle cx="${flashX}" cy="${flashY}" r="${flashSize}" fill="#ffd700" opacity="${flashOpacity}" class="pointer-events-none">
        <animate attributeName="r" values="${flashSize};${flashSize * 1.5};${flashSize}" dur="0.1s" repeatCount="1" />
      </circle>`

      // Flash glow
      svg += `<circle cx="${flashX}" cy="${flashY}" r="${flashSize * 2}" fill="#ff8c00" opacity="${flashOpacity * 0.5}" class="pointer-events-none" />`

      // Flash sparks radiating outward
      if (shootingEffect.phase === 'muzzleFlash') {
        for (let i = 0; i < 6; i++) {
          const sparkAngle = angle + (Math.random() - 0.5) * 0.8
          const sparkDist = 10 + Math.random() * 15 * shootingEffect.progress
          const sx = shooterPos.x + Math.cos(sparkAngle) * sparkDist
          const sy = shooterPos.y + Math.sin(sparkAngle) * sparkDist
          svg += `<circle cx="${sx}" cy="${sy}" r="${2 + Math.random() * 2}" fill="#ffff00" opacity="${0.8 - shootingEffect.progress * 0.6}" class="pointer-events-none" />`
        }
      }
    }

    // Bullet Trail Effect
    if (shootingEffect.phase === 'bulletTravel' || shootingEffect.phase === 'impact') {
      // Draw bullet trail
      shootingEffect.bulletTrailPoints.forEach((point, i) => {
        const size = 3 + (i / shootingEffect!.bulletTrailPoints.length) * 4
        svg += `<circle cx="${point.x}" cy="${point.y}" r="${size}" fill="#ffcc00" opacity="${point.opacity * 0.8}" class="pointer-events-none" />`
        // Tracer glow
        svg += `<circle cx="${point.x}" cy="${point.y}" r="${size * 1.5}" fill="#ff6600" opacity="${point.opacity * 0.3}" class="pointer-events-none" />`
      })

      // Current bullet position
      if (shootingEffect.phase === 'bulletTravel') {
        const bulletX = shooterPos.x + (targetPos.x - shooterPos.x) * shootingEffect.progress
        const bulletY = shooterPos.y + (targetPos.y - shooterPos.y) * shootingEffect.progress
        // Bullet core
        svg += `<ellipse cx="${bulletX}" cy="${bulletY}" rx="6" ry="3" transform="rotate(${angle * 180 / Math.PI} ${bulletX} ${bulletY})" fill="#ffd700" class="pointer-events-none" />`
        // Bullet glow
        svg += `<ellipse cx="${bulletX}" cy="${bulletY}" rx="10" ry="5" transform="rotate(${angle * 180 / Math.PI} ${bulletX} ${bulletY})" fill="#ff8800" opacity="0.5" class="pointer-events-none" />`
      }
    }

    // Impact Sparks Effect
    if (shootingEffect.phase === 'impact' || shootingEffect.phase === 'smoke') {
      shootingEffect.sparks.forEach(spark => {
        const sparkColor = spark.life > 0.5 ? '#ffff00' : '#ff6600'
        svg += `<circle cx="${spark.x}" cy="${spark.y}" r="${2 + spark.life * 3}" fill="${sparkColor}" opacity="${spark.life}" class="pointer-events-none" />`
      })

      // Impact flash at target
      if (shootingEffect.phase === 'impact') {
        const impactSize = 20 * (1 - shootingEffect.progress)
        svg += `<circle cx="${targetPos.x}" cy="${targetPos.y}" r="${impactSize}" fill="#ffffff" opacity="${0.8 - shootingEffect.progress * 0.8}" class="pointer-events-none" />`
        svg += `<circle cx="${targetPos.x}" cy="${targetPos.y}" r="${impactSize * 1.5}" fill="#ff4400" opacity="${0.5 - shootingEffect.progress * 0.5}" class="pointer-events-none" />`
      }
    }

    // Smoke Effect
    if (shootingEffect.phase === 'smoke' || shootingEffect.phase === 'impact') {
      shootingEffect.smokeParticles.forEach(p => {
        svg += `<circle cx="${p.x}" cy="${p.y}" r="${p.size}" fill="#555555" opacity="${p.opacity}" class="pointer-events-none" />`
        svg += `<circle cx="${p.x + 3}" cy="${p.y - 2}" r="${p.size * 0.7}" fill="#666666" opacity="${p.opacity * 0.7}" class="pointer-events-none" />`
      })
    }
  }

  // Shell Casings Effect (continues after shooting effect ends)
  shellCasings.forEach(casing => {
    const casingColor = '#c9a227' // Brass color
    // Rotating shell casing
    svg += `<g transform="translate(${casing.x}, ${casing.y}) rotate(${casing.rotation})" opacity="${casing.life}">
      <ellipse cx="0" cy="0" rx="4" ry="2" fill="${casingColor}" class="pointer-events-none" />
      <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#e6c84a" class="pointer-events-none" />
    </g>`
  })

  svg += '</svg>'
  return svg
}

function createScorePanel(): string {
  const yellowScore = getTeamScore('yellow')
  const greenScore = getTeamScore('green')
  const yellowCaptured = capturedPieces.filter(p => p.team === 'green')
  const greenCaptured = capturedPieces.filter(p => p.team === 'yellow')

  return `
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex flex-col gap-3 sm:gap-4">
      <h2 class="text-gray-200 font-bold text-base sm:text-lg border-b border-gray-700 pb-2">${t('score')}</h2>

      <!-- Yellow Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-yellow-400 font-bold text-sm sm:text-base">${t('yellowTeam')}</span>
          <span class="text-yellow-400 font-bold text-lg sm:text-xl">${yellowScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${yellowCaptured.map(p => `
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded border border-green-700 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '💥' : p.type === 'soldier' ? '🩹' : p.type === 'tank' ? '💣' : p.type === 'ship' ? '⚓' : p.type === 'carrier' ? '🛫' : p.type === 'helicopter' ? '🚁' : p.type === 'rocket' ? '🚀' : p.type === 'machinegun' ? '🔫' : p.type === 'suv' ? '🚙' : p.type === 'hacker' ? '💻' : '?'}
            </div>
          `).join('')}
          ${yellowCaptured.length === 0 ? '<span class="text-gray-500 text-xs sm:text-sm italic">-</span>' : ''}
        </div>
      </div>

      <!-- Green Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-green-400 font-bold text-sm sm:text-base">${t('greenTeam')}</span>
          <span class="text-green-400 font-bold text-lg sm:text-xl">${greenScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${greenCaptured.map(p => `
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded border border-yellow-600 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '💥' : p.type === 'soldier' ? '🩹' : p.type === 'tank' ? '💣' : p.type === 'ship' ? '⚓' : p.type === 'carrier' ? '🛫' : p.type === 'helicopter' ? '🚁' : p.type === 'rocket' ? '🚀' : p.type === 'machinegun' ? '🔫' : p.type === 'suv' ? '🚙' : p.type === 'hacker' ? '💻' : '?'}
            </div>
          `).join('')}
          ${greenCaptured.length === 0 ? '<span class="text-gray-500 text-xs sm:text-sm italic">-</span>' : ''}
        </div>
      </div>

      <!-- Turns Remaining -->
      <div class="border-t border-gray-700 pt-2 mt-1">
        <div class="flex items-center justify-between text-xs sm:text-sm">
          <span class="text-gray-400">Turns</span>
          <span class="text-gray-300">${Math.max(yellowTurnCount, greenTurnCount)} / ${MAX_TURNS_PER_TEAM}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${Math.min(100, (Math.max(yellowTurnCount, greenTurnCount) / MAX_TURNS_PER_TEAM) * 100)}%"></div>
        </div>
      </div>
    </div>
  `
}

function createMoveLog(): string {
  return `
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex-1 flex flex-col min-h-0 max-h-40 lg:max-h-none">
      <h2 class="text-gray-200 font-bold text-base sm:text-lg mb-2 sm:mb-3 border-b border-gray-700 pb-2">${t('moveButton')}s</h2>
      <div id="move-list" class="flex-1 overflow-y-auto space-y-1 text-xs sm:text-sm font-mono min-h-0">
        ${moveLog.length === 0
          ? '<p class="text-gray-500 italic text-xs sm:text-sm">No moves yet</p>'
          : moveLog.map((move, i) => {
              const textColor = move.team === 'yellow' ? 'text-yellow-400' : move.team === 'green' ? 'text-green-400' : 'text-gray-300'
              const pieceIcon = move.piece === 'train' ? '🚂' : move.piece === 'soldier' ? '🎖️' : move.piece === 'tank' ? '🛡️' : move.piece === 'ship' ? '🚢' : move.piece === 'carrier' ? '🛫' : move.piece === 'helicopter' ? '🚁' : move.piece === 'rocket' ? '🚀' : move.piece === 'machinegun' ? '🔫' : move.piece === 'suv' ? '🚙' : move.piece === 'hacker' ? '💻' : ''
              return `
              <div class="${textColor} flex flex-col">
                <div class="flex">
                  <span class="text-gray-500 w-6 sm:w-8">${i + 1}.</span>
                  <span>${move.piece} ${pieceIcon} ${move.from}→${move.to}</span>
                </div>
                ${move.captured === 'trapped' ? `<span class="text-red-400 text-xs ml-6 sm:ml-8">☠ trapped</span>` : move.captured ? `<span class="text-red-400 text-xs ml-6 sm:ml-8">✕ ${move.captured}</span>` : ''}
              </div>
            `}).join('')
        }
      </div>
    </div>
  `
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!

  // Apply accessibility classes
  app.classList.toggle('large-ui', largeUIMode)
  app.classList.toggle('high-contrast', highContrastMode)

  const turnColor = currentTurn === 'yellow' ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'

  // Start screen
  // Game over screen
  if (gameState === 'gameOver' && winner) {
    const yellowScore = getTeamScore('yellow')
    const greenScore = getTeamScore('green')
    const winnerColor = winner === 'yellow' ? '#fbbf24' : '#22c55e'
    const winnerName = winner === 'yellow' ? t('yellowTeam') : t('greenTeam')
    const reasonText = winReason === 'builder'
      ? `${winnerName} ${t('gameOverBuilder')}`
      : `${winnerName} ${t('gameOverPoints')}`

    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        <h1 class="text-3xl sm:text-5xl font-bold" style="color: ${winnerColor}">
          ${winnerName} Wins!
        </h1>
        <p class="text-white text-lg sm:text-xl text-center">${reasonText}</p>
        <div class="flex gap-8 text-white text-lg">
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #fbbf24">${yellowScore}</div>
            <div class="text-sm opacity-70">${t('yellowTeam')}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #22c55e">${greenScore}</div>
            <div class="text-sm opacity-70">${t('greenTeam')}</div>
          </div>
        </div>
        <div class="text-white text-sm opacity-70">
          ${t('yellowTurns')}: ${yellowTurnCount} | ${t('greenTurns')}: ${greenTurnCount}
        </div>
        <button id="play-again-btn" class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
          Play Again
        </button>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      resetGame()
      startGame()
    })
    return
  }

  if (gameState === 'start') {
    if (showSettings) {
      // Settings screen
      app.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8 overflow-y-auto">
          <h1 class="text-2xl sm:text-4xl font-bold text-white">${t('settingsButton')}</h1>
          <div class="bg-gray-800 p-6 rounded-lg flex flex-col gap-6 min-w-[280px] max-w-[400px]">

            <!-- Language -->
            <div class="flex flex-col gap-2">
              <label class="text-white font-bold">${t('languageLabel')}</label>
              <div class="flex flex-wrap gap-2">
                ${(Object.keys(languageNames) as Language[]).map(lang => `
                  <button
                    data-lang="${lang}"
                    class="lang-btn py-2 px-4 rounded ${currentLanguage === lang ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                  >
                    ${languageNames[lang]}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Chess Clock Timer -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">⏱️ ${t('timerLabel')}</label>
              <div class="flex gap-2">
                <button
                  id="timer-off-btn"
                  class="py-2 px-4 rounded ${!timerEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('timerOff')}
                </button>
                <button
                  id="timer-on-btn"
                  class="py-2 px-4 rounded ${timerEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('timerOn')}
                </button>
              </div>
              ${timerEnabled ? `
                <div class="flex flex-col gap-2 mt-2">
                  <label class="text-gray-300 text-sm">${t('timerMinutesLabel')}</label>
                  <div class="flex gap-2">
                    ${[1, 3, 5, 10, 15, 30].map(mins => `
                      <button
                        data-minutes="${mins}"
                        class="timer-mins-btn py-1 px-3 rounded text-sm ${timerMinutes === mins ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                      >
                        ${mins}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Sound Effects -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">🔊 ${t('soundLabel')}</label>
              <div class="flex gap-2 items-center">
                <button
                  id="sound-off-btn"
                  class="py-2 px-4 rounded ${!soundEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('off')}
                </button>
                <button
                  id="sound-on-btn"
                  class="py-2 px-4 rounded ${soundEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('on')}
                </button>
                <button
                  id="sound-test-btn"
                  class="py-2 px-4 rounded bg-purple-600 hover:bg-purple-500 text-white transition-colors text-sm"
                >
                  🔈 Test
                </button>
              </div>
            </div>

            <!-- Music setting -->
            <div class="flex flex-col gap-2">
              <label class="text-white font-bold">🎵 ${t('musicLabel')}</label>
              <div class="flex gap-2">
                <button
                  id="music-off-btn"
                  class="py-2 px-4 rounded ${!musicEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('off')}
                </button>
                <button
                  id="music-on-btn"
                  class="py-2 px-4 rounded ${musicEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors"
                >
                  ${t('on')}
                </button>
              </div>
            </div>

            <!-- Volume Controls with + - buttons -->
            <div class="flex flex-col gap-4 ${!soundEnabled && !musicEnabled ? 'opacity-50' : ''}">
              <!-- Master Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${t('masterVolumeLabel')}</label>
                <div class="flex items-center gap-2">
                  <button id="master-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-blue-500 transition-all" style="width: ${masterVolume * 100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(masterVolume * 100)}%</span>
                  </div>
                  <button id="master-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>

              <!-- Music Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${t('musicVolumeLabel')}</label>
                <div class="flex items-center gap-2">
                  <button id="music-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-purple-500 transition-all" style="width: ${musicVolume * 100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(musicVolume * 100)}%</span>
                  </div>
                  <button id="music-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>

              <!-- SFX Volume -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${t('sfxVolumeLabel')}</label>
                <div class="flex items-center gap-2">
                  <button id="sfx-vol-down" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">−</button>
                  <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                    <div class="h-full bg-green-500 transition-all" style="width: ${sfxVolume * 100}%"></div>
                    <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <button id="sfx-vol-up" class="w-10 h-10 rounded bg-gray-600 hover:bg-gray-500 text-white text-xl font-bold">+</button>
                </div>
              </div>
            </div>

            <!-- Music Style -->
            <div class="flex flex-col gap-2">
              <label class="text-gray-300 text-sm">${t('musicStyleLabel')}</label>
              <div class="flex flex-wrap gap-2">
                <button data-style="epic" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'epic' ? 'bg-red-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleEpic')}</button>
                <button data-style="ambient" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'ambient' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleAmbient')}</button>
                <button data-style="tension" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'tension' ? 'bg-orange-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleTension')}</button>
                <button data-style="electronic" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'electronic' ? 'bg-cyan-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleElectronic')}</button>
                <button data-style="orchestral" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'orchestral' ? 'bg-purple-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleOrchestral')}</button>
                <button data-style="retro" class="style-btn py-1 px-3 rounded text-sm ${musicStyle === 'retro' ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('styleRetro')}</button>
              </div>
            </div>

            <!-- Visual Settings -->
            <div class="flex flex-col gap-3 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">🎨 ${t('visualSettingsTitle')}</label>

              <!-- Board Theme -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${t('boardThemeLabel')}</label>
                <div class="flex flex-wrap gap-2">
                  <button data-theme="classic" class="theme-btn py-1 px-3 rounded text-sm ${boardTheme === 'classic' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('themeClassic')}</button>
                  <button data-theme="dark" class="theme-btn py-1 px-3 rounded text-sm ${boardTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('themeDark')}</button>
                  <button data-theme="light" class="theme-btn py-1 px-3 rounded text-sm ${boardTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('themeLight')}</button>
                  <button data-theme="wood" class="theme-btn py-1 px-3 rounded text-sm ${boardTheme === 'wood' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('themeWood')}</button>
                </div>
              </div>

              <!-- Animation Speed -->
              <div class="flex flex-col gap-1">
                <label class="text-gray-300 text-sm">${t('animationSpeedLabel')}</label>
                <div class="flex gap-2">
                  <button data-speed="fast" class="speed-btn py-1 px-3 rounded text-sm ${animationSpeed === 'fast' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('speedFast')}</button>
                  <button data-speed="normal" class="speed-btn py-1 px-3 rounded text-sm ${animationSpeed === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('speedNormal')}</button>
                  <button data-speed="slow" class="speed-btn py-1 px-3 rounded text-sm ${animationSpeed === 'slow' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}">${t('speedSlow')}</button>
                </div>
              </div>

              <!-- Screen Shake -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${t('screenShakeLabel')}</label>
                <button id="screen-shake-btn" class="py-1 px-3 rounded text-sm ${screenShakeEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}">${screenShakeEnabled ? t('on') : t('off')}</button>
              </div>

              <!-- Show Coordinates -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${t('showCoordinatesLabel')}</label>
                <button id="show-coords-btn" class="py-1 px-3 rounded text-sm ${showCoordinates ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}">${showCoordinates ? t('on') : t('off')}</button>
              </div>
            </div>

            <!-- Accessibility Settings -->
            <div class="flex flex-col gap-3 border-t border-gray-700 pt-4">
              <label class="text-white font-bold">♿ ${t('accessibilityTitle')}</label>

              <!-- Colorblind Mode -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${t('colorBlindLabel')}</label>
                <button id="colorblind-btn" class="py-1 px-3 rounded text-sm ${colorBlindMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}">${colorBlindMode ? t('on') : t('off')}</button>
              </div>

              <!-- High Contrast -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${t('highContrastLabel')}</label>
                <button id="high-contrast-btn" class="py-1 px-3 rounded text-sm ${highContrastMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}">${highContrastMode ? t('on') : t('off')}</button>
              </div>

              <!-- Large UI -->
              <div class="flex items-center justify-between">
                <label class="text-gray-300 text-sm">${t('largeUILabel')}</label>
                <button id="large-ui-btn" class="py-1 px-3 rounded text-sm ${largeUIMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}">${largeUIMode ? t('on') : t('off')}</button>
              </div>
            </div>

            <!-- Fullscreen -->
            <div class="flex flex-col gap-2 border-t border-gray-700 pt-4">
              <div class="flex items-center justify-between">
                <label class="text-white font-bold">🖥️ ${t('fullscreenLabel')}</label>
                <button id="fullscreen-btn" class="py-2 px-4 rounded ${isFullscreen ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'} transition-colors">${isFullscreen ? t('on') : t('off')}</button>
              </div>
            </div>

          </div>
          <button id="back-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors touch-manipulation">
            ${t('backButton')}
          </button>
        </div>
      `

      // Language buttons
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const lang = (e.target as HTMLElement).getAttribute('data-lang') as Language
          currentLanguage = lang
          render()
        })
      })

      // Timer buttons
      document.getElementById('timer-off-btn')?.addEventListener('click', () => {
        timerEnabled = false
        render()
      })
      document.getElementById('timer-on-btn')?.addEventListener('click', () => {
        timerEnabled = true
        render()
      })
      document.querySelectorAll('.timer-mins-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const mins = parseInt((e.target as HTMLElement).getAttribute('data-minutes') || '10')
          timerMinutes = mins
          render()
        })
      })

      // Sound buttons
      document.getElementById('sound-off-btn')?.addEventListener('click', () => {
        soundEnabled = false
        render()
      })
      document.getElementById('sound-on-btn')?.addEventListener('click', async () => {
        soundEnabled = true
        await initAudio()
        render()
      })
      document.getElementById('sound-test-btn')?.addEventListener('click', async () => {
        await initAudio()
        await playSound('capture')
      })

      // Music buttons
      document.getElementById('music-off-btn')?.addEventListener('click', () => {
        musicEnabled = false
        stopMusic()
        render()
      })
      document.getElementById('music-on-btn')?.addEventListener('click', async () => {
        musicEnabled = true
        await initAudio()
        await startMusic()
        render()
      })

      // Volume buttons with +/- controls
      document.getElementById('master-vol-down')?.addEventListener('click', () => {
        masterVolume = Math.max(0, masterVolume - 0.1)
        if (musicGainNode) musicGainNode.gain.value = 0.12 * musicVolume * masterVolume
        render()
      })
      document.getElementById('master-vol-up')?.addEventListener('click', () => {
        masterVolume = Math.min(1, masterVolume + 0.1)
        if (musicGainNode) musicGainNode.gain.value = 0.12 * musicVolume * masterVolume
        render()
      })
      document.getElementById('music-vol-down')?.addEventListener('click', () => {
        musicVolume = Math.max(0, musicVolume - 0.1)
        if (musicGainNode) musicGainNode.gain.value = 0.12 * musicVolume * masterVolume
        render()
      })
      document.getElementById('music-vol-up')?.addEventListener('click', () => {
        musicVolume = Math.min(1, musicVolume + 0.1)
        if (musicGainNode) musicGainNode.gain.value = 0.12 * musicVolume * masterVolume
        render()
      })
      document.getElementById('sfx-vol-down')?.addEventListener('click', () => {
        sfxVolume = Math.max(0, sfxVolume - 0.1)
        render()
      })
      document.getElementById('sfx-vol-up')?.addEventListener('click', () => {
        sfxVolume = Math.min(1, sfxVolume + 0.1)
        render()
      })

      // Music style buttons
      document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const newStyle = (e.target as HTMLElement).getAttribute('data-style') as MusicStyle
          musicStyle = newStyle
          if (musicEnabled) {
            stopMusic()
            startMusic()
          }
          render()
        })
      })

      // Theme buttons
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          boardTheme = (e.target as HTMLElement).getAttribute('data-theme') as BoardTheme
          render()
        })
      })

      // Animation speed buttons
      document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          animationSpeed = (e.target as HTMLElement).getAttribute('data-speed') as 'fast' | 'normal' | 'slow'
          render()
        })
      })

      // Screen shake toggle
      document.getElementById('screen-shake-btn')?.addEventListener('click', () => {
        screenShakeEnabled = !screenShakeEnabled
        render()
      })

      // Show coordinates toggle
      document.getElementById('show-coords-btn')?.addEventListener('click', () => {
        showCoordinates = !showCoordinates
        render()
      })

      // Colorblind mode toggle
      document.getElementById('colorblind-btn')?.addEventListener('click', () => {
        colorBlindMode = !colorBlindMode
        render()
      })

      // High contrast toggle
      document.getElementById('high-contrast-btn')?.addEventListener('click', () => {
        highContrastMode = !highContrastMode
        render()
      })

      // Large UI toggle
      document.getElementById('large-ui-btn')?.addEventListener('click', () => {
        largeUIMode = !largeUIMode
        render()
      })

      // Fullscreen toggle
      document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
          isFullscreen = true
        } else {
          document.exitFullscreen()
          isFullscreen = false
        }
        render()
      })

      // Back button
      document.getElementById('back-btn')?.addEventListener('click', () => {
        showSettings = false
        render()
      })
      return
    }

    // Start screen
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        <h1 class="text-2xl sm:text-4xl font-bold text-white">${t('startTitle')}</h1>

        <!-- Game Mode Selection -->
        <div class="bg-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <div class="flex gap-2">
            <button id="mode-player-btn" class="${!botMode ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-2 px-4 rounded-lg transition-colors touch-manipulation">
              👥 ${t('startVsPlayer')}
            </button>
            <button id="mode-bot-btn" class="${botMode ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-2 px-4 rounded-lg transition-colors touch-manipulation">
              🤖 ${t('startVsBot')}
            </button>
          </div>

          ${botMode ? `
          <div class="flex flex-col gap-2">
            <span class="text-gray-300 text-sm">${t('botDifficultyLabel')}:</span>
            <div class="flex gap-2">
              <button id="diff-easy-btn" class="${botDifficulty === 'easy' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${t('botEasy')}
              </button>
              <button id="diff-medium-btn" class="${botDifficulty === 'medium' ? 'bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${t('botMedium')}
              </button>
              <button id="diff-hard-btn" class="${botDifficulty === 'hard' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-1 px-3 rounded transition-colors touch-manipulation text-sm">
                ${t('botHard')}
              </button>
            </div>
          </div>
          ` : ''}
        </div>

        <div class="flex flex-col gap-3">
          <button id="start-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
            ${t('startButton')}
          </button>
          <button id="settings-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-base transition-colors touch-manipulation">
            ⚙️ ${t('settingsButton')}
          </button>
        </div>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('start-btn')?.addEventListener('click', startGame)
    document.getElementById('mode-player-btn')?.addEventListener('click', () => {
      botMode = false
      render()
    })
    document.getElementById('mode-bot-btn')?.addEventListener('click', () => {
      botMode = true
      render()
    })
    document.getElementById('diff-easy-btn')?.addEventListener('click', () => {
      botDifficulty = 'easy'
      render()
    })
    document.getElementById('diff-medium-btn')?.addEventListener('click', () => {
      botDifficulty = 'medium'
      render()
    })
    document.getElementById('diff-hard-btn')?.addEventListener('click', () => {
      botDifficulty = 'hard'
      render()
    })
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      showSettings = true
      render()
    })
    return
  }

  // Confirm reset dialog
  if (gameState === 'confirmReset') {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 mx-4">
          <p class="text-white text-base sm:text-lg text-center">${t('confirmReset')}</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              ${t('confirmYes')}
            </button>
            <button id="cancel-reset-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              ${t('confirmNo')}
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('confirm-reset-btn')?.addEventListener('click', resetGame)
    document.getElementById('cancel-reset-btn')?.addEventListener('click', cancelReset)
    return
  }

  // Confirm tunnel entry dialog
  if (gameState === 'confirmTunnel') {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 border-2 border-gray-600 mx-4">
          <p class="text-white text-base sm:text-lg text-center">🚇 Enter the tunnel?</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-tunnel-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              Yes
            </button>
            <button id="decline-tunnel-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              No
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('confirm-tunnel-btn')?.addEventListener('click', confirmEnterTunnel)
    document.getElementById('decline-tunnel-btn')?.addEventListener('click', declineEnterTunnel)
    return
  }

  // Confirm tunnel exit dialog
  if (gameState === 'confirmTunnelExit') {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 border-2 border-gray-600 mx-4">
          <p class="text-white text-base sm:text-lg text-center">🚇 Exit the tunnel?</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-exit-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              Yes
            </button>
            <button id="decline-exit-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              No
            </button>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('confirm-exit-btn')?.addEventListener('click', confirmExitTunnel)
    document.getElementById('decline-exit-btn')?.addEventListener('click', declineExitTunnel)
    return
  }

  // Check for forced trench exit and auto-select
  const forcedSoldier = checkForcedTrenchExit()
  if (forcedSoldier && !selectedPiece) {
    // Auto-select the forced soldier
    selectedPiece = forcedSoldier
    actionMode = 'move'
    showSoldierActions = false
    validMoves = getValidMovesForSoldier(forcedSoldier).filter(m => !isTrenchSquare(m.col, m.row))
    message = `⚠️ Soldier at ${forcedSoldier.col}${forcedSoldier.row} MUST leave the trench! (3 turns reached)`

    // Check if soldier can't leave - eliminate
    if (validMoves.length === 0) {
      message = t('soldierTrapped')
      const index = pieces.indexOf(forcedSoldier)
      pieces.splice(index, 1)
      capturedPieces.push(forcedSoldier)
      moveLog.push({
        from: `${forcedSoldier.col}${forcedSoldier.row}`,
        to: `${forcedSoldier.col}${forcedSoldier.row}`,
        piece: forcedSoldier.type,
        team: forcedSoldier.team,
        captured: 'trapped'
      })
      selectedPiece = null
      if (currentTurn === 'yellow') yellowTurnCount++
      else greenTurnCount++
      switchTurn()
      // Re-render after elimination
      setTimeout(() => render(), 100)
    }
  }

  // Warning banner for forced trench exit
  const forcedTrenchWarning = forcedSoldier ? `
    <div class="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg animate-pulse text-center">
      ⚠️ Soldier ${forcedSoldier.col}${forcedSoldier.row} MUST leave trench!
    </div>
  ` : ''

  // Rocket ready notification (show at turn 45 for current team)
  const currentTeamTurns = currentTurn === 'yellow' ? yellowTurnCount : greenTurnCount
  const rocketJustBecameReady = currentTeamTurns === ROCKET_READY_TURN
  const hasUnusedRockets = pieces.some(p => p.type === 'rocket' && p.team === currentTurn)
  const rocketReadyMessage = (rocketJustBecameReady || (isRocketReadyForTeam(currentTurn) && hasUnusedRockets && selectedPiece?.type === 'rocket')) ? `
    <div class="bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg text-center">
      🚀 Rocket is ready for use!
    </div>
  ` : ''

  // Action buttons HTML - show when soldier or tank is selected (but not when forced out of trench)
  const showActionButtons = (selectedPiece?.type === 'soldier' || selectedPiece?.type === 'tank' || selectedPiece?.type === 'ship') && !forcedSoldier
  const canExit = selectedPiece && canExitTunnel(selectedPiece)
  const moveButtonClass = actionMode === 'move' ? 'bg-blue-800 ring-2 ring-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
  const shootButtonClass = actionMode === 'shoot' ? 'bg-red-800 ring-2 ring-red-400' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
  const actionButtonsHtml = showActionButtons ? `
    <div class="bg-gray-800 px-2 sm:px-4 py-2 rounded-lg flex gap-1 sm:gap-2">
      <button id="action-move" class="${moveButtonClass} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${t('moveButton')}
      </button>
      ${!selectedPiece?.inTunnel ? `
        <button id="action-shoot" class="${shootButtonClass} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          ${t('shootButton')}
        </button>
      ` : ''}
      ${canExit ? `
        <button id="action-exit" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          ${t('exitButton')}
        </button>
      ` : ''}
    </div>
  ` : ''

  // Hack action buttons - submarine uses left/right instead of forward/backward
  const isSubmarineHack = selectedHackTarget?.type === 'sub'
  const hackActionsHtml = showHackActions && selectedHackTarget ? `
    <div class="bg-purple-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <span class="text-purple-200 text-xs sm:text-sm">Hack ${selectedHackTarget.type}:</span>
      <button id="hack-forward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${isSubmarineHack ? '→ Right' : '↑ Forward'}
      </button>
      <button id="hack-backward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ${isSubmarineHack ? '← Left' : '↓ Backward'}
      </button>
      <button id="hack-freeze" class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ❄ Freeze 5
      </button>
      <button id="hack-cancel" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        Cancel
      </button>
    </div>
  ` : ''

  // Builder action buttons
  const builderActionsHtml = showBuilderActions && selectedPiece?.type === 'builder' ? `
    <div class="bg-amber-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <button id="builder-move" class="${builderPlacementMode === null ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🚶 Move
      </button>
      <button id="builder-barricade" class="${builderPlacementMode === 'barricade' ? 'bg-amber-700' : canBuilderBuildBarricade(selectedPiece) ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🧱 Barricade ${selectedPiece.barricadesBuilt || 0}/${MAX_BARRICADES_TOTAL}
      </button>
      <button id="builder-artillery" class="${builderPlacementMode === 'artillery' ? 'bg-gray-700' : canBuilderBuildArtillery(selectedPiece) ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        💥 Artillery ${selectedPiece.artilleryBuilt || 0}/${MAX_ARTILLERY_TOTAL}
      </button>
      <button id="builder-spike" class="${builderPlacementMode === 'spike' ? 'bg-red-700' : canBuilderBuildSpike(selectedPiece) ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold py-2 px-3 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ⚠ Spike ${selectedPiece.spikesBuilt || 0}/${MAX_SPIKES_TOTAL}
      </button>
    </div>
  ` : ''

  // Carrier action buttons (launch helicopter)
  const carrierActionsHtml = showCarrierActions && selectedPiece?.type === 'carrier' && selectedPiece.hasHelicopter ? `
    <div class="bg-sky-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <button id="carrier-launch" class="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        🚁 ${t('launchHelicopter')}
      </button>
    </div>
  ` : ''

  // Playing state
  app.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-8 gap-2 sm:gap-4">
      ${forcedTrenchWarning}
      ${rocketReadyMessage}
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div class="bg-gray-800 px-3 py-2 rounded-lg border-2 ${turnColor} flex items-center gap-3">
          <span class="${turnColor} font-bold text-sm sm:text-base">${currentTurn === 'yellow' ? t('yellowTurn') : t('greenTurn')}</span>
          ${timerEnabled ? `
            <div class="flex gap-2 text-xs sm:text-sm">
              <span class="px-2 py-1 rounded ${currentTurn === 'yellow' ? 'bg-yellow-600 text-black font-bold' : 'bg-gray-700 text-yellow-400'}">${formatTime(yellowTimeRemaining)}</span>
              <span class="px-2 py-1 rounded ${currentTurn === 'green' ? 'bg-green-600 text-black font-bold' : 'bg-gray-700 text-green-400'}">${formatTime(greenTimeRemaining)}</span>
            </div>
          ` : ''}
        </div>
        ${actionButtonsHtml}
        ${hackActionsHtml}
        ${builderActionsHtml}
        ${carrierActionsHtml}
        ${message && !forcedSoldier ? `<div class="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm">${message}</div>` : ''}
        <button id="reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors">
          ${t('resetButton')}
        </button>
      </div>
      <div class="flex flex-col lg:flex-row items-center lg:items-start gap-4 w-full max-w-4xl">
        <div class="flex-shrink-0 w-full lg:w-auto flex justify-center" id="board-container">
          ${createBoard()}
        </div>
        <div class="flex flex-row lg:flex-col gap-4 w-full lg:w-64 lg:h-[80vh]">
          ${createScorePanel()}
          ${createMoveLog()}
        </div>
      </div>
    </div>
  `

  // Add reset button listener
  document.getElementById('reset-btn')?.addEventListener('click', showResetConfirm)

  // Add soldier action listeners
  document.getElementById('action-move')?.addEventListener('click', () => selectSoldierAction('move'))
  document.getElementById('action-shoot')?.addEventListener('click', () => selectSoldierAction('shoot'))
  document.getElementById('action-exit')?.addEventListener('click', showTunnelExitConfirm)

  // Add hack action listeners
  document.getElementById('hack-forward')?.addEventListener('click', () => executeHack('forward'))
  document.getElementById('hack-backward')?.addEventListener('click', () => executeHack('backward'))
  document.getElementById('hack-freeze')?.addEventListener('click', () => executeHack('freeze'))
  document.getElementById('hack-cancel')?.addEventListener('click', cancelHackTarget)

  // Add builder action listeners
  document.getElementById('builder-move')?.addEventListener('click', () => selectBuilderAction('move'))
  document.getElementById('builder-barricade')?.addEventListener('click', () => selectBuilderAction('barricade'))
  document.getElementById('builder-artillery')?.addEventListener('click', () => selectBuilderAction('artillery'))
  document.getElementById('builder-spike')?.addEventListener('click', () => selectBuilderAction('spike'))

  // Add carrier action listeners
  document.getElementById('carrier-launch')?.addEventListener('click', launchHelicopterFromCarrier)

  // Add click event listeners for game board
  const svg = document.querySelector('#board-container svg')
  if (svg) {
    // Click on squares
    svg.querySelectorAll('rect[data-row]').forEach(rect => {
      rect.addEventListener('click', (e) => {
        const target = e.currentTarget as SVGRectElement
        const col = target.getAttribute('data-col')!
        const row = parseInt(target.getAttribute('data-row')!)
        handleSquareClick(col, row)
      })
    })

    // Click on pieces
    svg.querySelectorAll('g[data-piece]').forEach(group => {
      group.addEventListener('click', (e) => {
        e.stopPropagation()
        const target = e.currentTarget as SVGGElement
        const col = target.getAttribute('data-col')!
        const row = parseInt(target.getAttribute('data-row')!)
        handleSquareClick(col, row)
      })
    })
  }
}

render()
