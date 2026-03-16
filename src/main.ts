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

// Audio context for sound effects
let audioContext: AudioContext | null = null

function initAudio() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
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

function playSound(type: 'move' | 'capture' | 'shoot' | 'explosion' | 'click' | 'win' | 'tick') {
  if (!soundEnabled || !audioContext) return

  const now = audioContext.currentTime

  switch (type) {
    case 'move': {
      // Chess piece "clack" - wooden tap sound
      const osc1 = audioContext.createOscillator()
      const osc2 = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.value = 2000

      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(800, now)
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.05)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(400, now)
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.05)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(audioContext.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.1)
      osc2.stop(now + 0.1)
      break
    }

    case 'capture': {
      // Impact "thump" with crunch - piece being taken
      const osc = audioContext.createOscillator()
      const noise = audioContext.createBufferSource()
      const gainOsc = audioContext.createGain()
      const gainNoise = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      // Low thump
      osc.type = 'sine'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15)
      gainOsc.gain.setValueAtTime(0.3, now)
      gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      // Crunch noise
      noise.buffer = createNoiseBuffer(0.1)
      filter.type = 'bandpass'
      filter.frequency.value = 1000
      filter.Q.value = 1
      gainNoise.gain.setValueAtTime(0.15, now)
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gainOsc)
      gainOsc.connect(audioContext.destination)
      noise.connect(filter)
      filter.connect(gainNoise)
      gainNoise.connect(audioContext.destination)

      osc.start(now)
      noise.start(now)
      osc.stop(now + 0.25)
      noise.stop(now + 0.15)
      break
    }

    case 'shoot': {
      // Realistic gunshot with shell casing ejection
      // Part 1: BANG - "sptjge" - the gunshot
      const bang = audioContext.createBufferSource()
      const bangFilter = audioContext.createBiquadFilter()
      const bangGain = audioContext.createGain()
      const punch = audioContext.createOscillator()
      const punchGain = audioContext.createGain()

      // Sharp crack
      bang.buffer = createNoiseBuffer(0.12)
      bangFilter.type = 'bandpass'
      bangFilter.frequency.setValueAtTime(3000, now)
      bangFilter.frequency.exponentialRampToValueAtTime(800, now + 0.05)
      bangFilter.Q.value = 2
      bangGain.gain.setValueAtTime(0.35, now)
      bangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      // Low thump of the shot
      punch.type = 'sine'
      punch.frequency.setValueAtTime(200, now)
      punch.frequency.exponentialRampToValueAtTime(40, now + 0.1)
      punchGain.gain.setValueAtTime(0.3, now)
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      bang.connect(bangFilter)
      bangFilter.connect(bangGain)
      bangGain.connect(audioContext.destination)
      punch.connect(punchGain)
      punchGain.connect(audioContext.destination)

      bang.start(now)
      punch.start(now)
      bang.stop(now + 0.12)
      punch.stop(now + 0.15)

      // Part 2: Shell casing - "tjsjt" - metallic tink after delay
      const shellDelay = 0.15 // delay after shot

      // High metallic ping (shell hitting ground)
      const shell1 = audioContext.createOscillator()
      const shell1Gain = audioContext.createGain()
      shell1.type = 'triangle'
      shell1.frequency.setValueAtTime(4500, now + shellDelay)
      shell1.frequency.exponentialRampToValueAtTime(2000, now + shellDelay + 0.05)
      shell1Gain.gain.setValueAtTime(0.08, now + shellDelay)
      shell1Gain.gain.exponentialRampToValueAtTime(0.001, now + shellDelay + 0.08)
      shell1.connect(shell1Gain)
      shell1Gain.connect(audioContext.destination)
      shell1.start(now + shellDelay)
      shell1.stop(now + shellDelay + 0.1)

      // Second bounce (quieter)
      const shell2 = audioContext.createOscillator()
      const shell2Gain = audioContext.createGain()
      shell2.type = 'triangle'
      shell2.frequency.setValueAtTime(3800, now + shellDelay + 0.08)
      shell2.frequency.exponentialRampToValueAtTime(1500, now + shellDelay + 0.12)
      shell2Gain.gain.setValueAtTime(0.04, now + shellDelay + 0.08)
      shell2Gain.gain.exponentialRampToValueAtTime(0.001, now + shellDelay + 0.15)
      shell2.connect(shell2Gain)
      shell2Gain.connect(audioContext.destination)
      shell2.start(now + shellDelay + 0.08)
      shell2.stop(now + shellDelay + 0.18)

      // Tiny metallic rattle
      const rattle = audioContext.createBufferSource()
      const rattleFilter = audioContext.createBiquadFilter()
      const rattleGain = audioContext.createGain()
      rattle.buffer = createNoiseBuffer(0.1)
      rattleFilter.type = 'highpass'
      rattleFilter.frequency.value = 6000
      rattleGain.gain.setValueAtTime(0.03, now + shellDelay + 0.05)
      rattleGain.gain.exponentialRampToValueAtTime(0.001, now + shellDelay + 0.12)
      rattle.connect(rattleFilter)
      rattleFilter.connect(rattleGain)
      rattleGain.connect(audioContext.destination)
      rattle.start(now + shellDelay + 0.05)
      rattle.stop(now + shellDelay + 0.15)
      break
    }

    case 'explosion': {
      // Deep explosion with rumble and debris
      const noise = audioContext.createBufferSource()
      const osc = audioContext.createOscillator()
      const gainNoise = audioContext.createGain()
      const gainOsc = audioContext.createGain()
      const filterNoise = audioContext.createBiquadFilter()

      // Rumbling noise
      noise.buffer = createNoiseBuffer(0.8)
      filterNoise.type = 'lowpass'
      filterNoise.frequency.setValueAtTime(1000, now)
      filterNoise.frequency.exponentialRampToValueAtTime(100, now + 0.5)
      gainNoise.gain.setValueAtTime(0.4, now)
      gainNoise.gain.setValueAtTime(0.3, now + 0.1)
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

      // Deep boom
      osc.type = 'sine'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.4)
      gainOsc.gain.setValueAtTime(0.4, now)
      gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      noise.connect(filterNoise)
      filterNoise.connect(gainNoise)
      gainNoise.connect(audioContext.destination)

      osc.connect(gainOsc)
      gainOsc.connect(audioContext.destination)

      noise.start(now)
      osc.start(now)
      noise.stop(now + 0.8)
      osc.stop(now + 0.6)
      break
    }

    case 'click': {
      // Soft UI click - like a button press
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1800, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03)

      filter.type = 'lowpass'
      filter.frequency.value = 3000

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(audioContext.destination)

      osc.start(now)
      osc.stop(now + 0.05)
      break
    }

    case 'win': {
      // Victory fanfare - triumphant chord progression
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = audioContext!.createOscillator()
        const osc2 = audioContext!.createOscillator()
        const gain = audioContext!.createGain()

        osc.type = 'triangle'
        osc.frequency.value = freq
        osc2.type = 'sine'
        osc2.frequency.value = freq * 2 // Octave up

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

      // C major arpeggio then final chord
      playNote(523, now, 0.15)        // C5
      playNote(659, now + 0.1, 0.15)  // E5
      playNote(784, now + 0.2, 0.15)  // G5
      playNote(1047, now + 0.3, 0.4)  // C6 (longer)
      // Final chord
      playNote(523, now + 0.35, 0.5)
      playNote(659, now + 0.35, 0.5)
      playNote(784, now + 0.35, 0.5)
      break
    }

    case 'tick': {
      // Clock tick - mechanical click
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
      gain.connect(audioContext.destination)

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
    on: 'On',
    off: 'Off',
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
    on: 'Aan',
    off: 'Uit',
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
    on: 'An',
    off: 'Aus',
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
    on: 'Activé',
    off: 'Désactivé',
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
    on: 'Encendido',
    off: 'Apagado',
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
const MAX_ARTILLERY_TOTAL = 2  // Max artillery a builder can ever build
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
  render()

  // After explosion animation, complete the action
  setTimeout(() => {
    if (target.piece && destructibleTypes.includes(target.piece.type)) {
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
  }, 500)
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

function startGame() {
  gameState = 'playing'
  initAudio()

  // Initialize timer if enabled
  if (timerEnabled) {
    yellowTimeRemaining = timerMinutes * 60
    greenTimeRemaining = timerMinutes * 60
    startTimer()
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
      }, 500)
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

  // Play sound
  if (capturedPiece) {
    playSound('capture')
  } else {
    playSound('move')
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

  const moveDuration = 250
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
        }, 500)
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

  const launchDuration = 600
  const flyDuration = 400
  const explosionDuration = 800
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

function drawPiece(piece: Piece, x: number, y: number): string {
  const teamColor = piece.team === 'yellow' ? '#fbbf24' : '#22c55e'
  const strokeColor = piece.team === 'yellow' ? '#b45309' : '#15803d'

  if (piece.type === 'train') {
    const highlight = piece.team === 'yellow' ? '#fde047' : '#4ade80'
    const shadow = piece.team === 'yellow' ? '#92400e' : '#166534'
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
        fill = isLight ? '#86a876' : '#d4c87a' // Mellow green at A1, mellow yellow alternating
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
              <div class="flex gap-2">
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
      document.getElementById('sound-on-btn')?.addEventListener('click', () => {
        soundEnabled = true
        initAudio()
        render()
      })
      document.getElementById('sound-test-btn')?.addEventListener('click', () => {
        initAudio()
        playSound('capture')
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

  // Hack action buttons
  const hackActionsHtml = showHackActions && selectedHackTarget ? `
    <div class="bg-purple-900 px-2 sm:px-4 py-2 rounded-lg flex flex-wrap gap-1 sm:gap-2 items-center">
      <span class="text-purple-200 text-xs sm:text-sm">Hack ${selectedHackTarget.type}:</span>
      <button id="hack-forward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ↑ Forward
      </button>
      <button id="hack-backward" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        ↓ Backward
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
