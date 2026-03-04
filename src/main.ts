import './style.css'

const BOARD_SIZE = 11
const SQUARE_SIZE = 50
const LABEL_SIZE = 30

const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

type Team = 'yellow' | 'green'
type PieceType = 'train' | 'soldier'

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
  return capturedPieces
    .filter(p => p.team !== team)
    .reduce((sum, p) => sum + p.points, 0)
}

let moveLog: Move[] = []
let capturedPieces: Piece[] = []

// Game state
type GameState = 'start' | 'playing' | 'confirmReset' | 'confirmTunnel' | 'confirmTunnelExit'
let gameState: GameState = 'start'

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
  render()
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
  message = null
  currentTurn = 'yellow'
  gameState = 'start'
  actionMode = null
  showSoldierActions = false
  yellowTurnCount = 0
  greenTurnCount = 0
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

      const pieceAtTarget = getPieceAt(col, row)

      if (pieceAtTarget) {
        if (pieceAtTarget.team !== piece.team) {
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
  if (piece.inTunnel) {
    const tunnelCol = piece.col // E or G
    // Can move to adjacent tunnel squares (up or down within E4-E8 or G4-G8)
    const upRow = piece.row + 1
    const downRow = piece.row - 1

    if (isTunnelSquare(tunnelCol, upRow)) {
      const pieceAtTarget = getPieceAt(tunnelCol, upRow)
      if (!pieceAtTarget) {
        moves.push({ col: tunnelCol, row: upRow, canCapture: false })
      }
    }
    if (isTunnelSquare(tunnelCol, downRow)) {
      const pieceAtTarget = getPieceAt(tunnelCol, downRow)
      if (!pieceAtTarget) {
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
    const pieceAtTarget = getPieceAt(col, row)

    // Soldiers cannot capture by moving
    if (pieceAtTarget) continue

    // Cannot move onto water (row 6, except bridge at F6)
    if (row === 6 && col !== 'F') continue

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

  // Cannot shoot from tunnel
  if (piece.inTunnel) return targets

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

function selectPiece(piece: Piece) {
  // Check if it's this team's turn
  if (piece.team !== currentTurn) {
    message = `It's ${currentTurn}'s turn! You cannot move ${piece.team}'s pieces.`
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
        message = "Soldier trapped in trench - eliminated!"
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
        currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'
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
      // Show action selection for soldier
      showSoldierActions = true
      validMoves = []
    }
  }

  render()
}

function selectSoldierAction(action: 'move' | 'shoot') {
  if (!selectedPiece || selectedPiece.type !== 'soldier') return

  actionMode = action
  // Keep showing action buttons so user can switch

  if (action === 'move') {
    validMoves = getValidMovesForSoldier(selectedPiece)
    shootTargets = []
    message = null
  } else if (action === 'shoot') {
    validMoves = []
    shootTargets = getShootTargetsForSoldier(selectedPiece)
    message = null
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
    message = "You cannot move there!"
    render()
    return
  }

  const pieceAtTarget = getPieceAt(col, row)
  let capturedPiece: Piece | null = null

  if (pieceAtTarget) {
    if (pieceAtTarget.team === selectedPiece.team) {
      message = "There is already a piece of your team there!"
      render()
      return
    } else {
      // Capture enemy piece
      capturedPiece = pieceAtTarget
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
  completMove(col, row, capturedPiece)
}

function completMove(col: string, row: number, capturedPiece: Piece | null) {
  if (!selectedPiece) return

  const movingTeam = selectedPiece.team

  // Log the move
  moveLog.push({
    from: `${selectedPiece.col}${selectedPiece.row}`,
    to: `${col}${row}`,
    piece: selectedPiece.type,
    team: movingTeam,
    captured: capturedPiece?.type,
    capturedPoints: capturedPiece?.points
  })

  // Check if soldier is entering trench
  if (selectedPiece.type === 'soldier' && !selectedPiece.inTrench && isTrenchSquare(col, row)) {
    const currentTeamTurn = movingTeam === 'yellow' ? yellowTurnCount : greenTurnCount
    selectedPiece.inTrench = true
    selectedPiece.trenchEnteredOnTurn = currentTeamTurn
    message = "Entered the trench! (Turn 0/3)"
  }
  // If soldier was in trench and is leaving
  else if (selectedPiece.type === 'soldier' && selectedPiece.inTrench && !isTrenchSquare(col, row)) {
    selectedPiece.inTrench = false
    selectedPiece.trenchEnteredOnTurn = undefined
    message = "Left the trench!"
  }

  // Move the piece
  selectedPiece.col = col
  selectedPiece.row = row

  // Increment turn count for the team that just moved
  if (movingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'

  // Deselect
  selectedPiece = null
  validMoves = []
  actionMode = null
  showSoldierActions = false

  render()
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

  message = "Entered the tunnel!"

  // Increment turn count
  if (movingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'

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

  message = "Exited the tunnel!"

  // Increment turn count
  if (movingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Switch turns
  currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'

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
    message = "You cannot shoot there!"
    render()
    return
  }

  const pieceAtTarget = getPieceAt(col, row)
  if (!pieceAtTarget) {
    message = "No target to shoot!"
    render()
    return
  }

  const shootingTeam = selectedPiece.team

  // Capture the shot piece
  const index = pieces.indexOf(pieceAtTarget)
  pieces.splice(index, 1)
  capturedPieces.push(pieceAtTarget)
  message = `Shot enemy ${pieceAtTarget.type} (+${pieceAtTarget.points} points)!`

  // Log the shot
  moveLog.push({
    from: `${selectedPiece.col}${selectedPiece.row}`,
    to: `${col}${row}`,
    piece: selectedPiece.type,
    team: shootingTeam,
    captured: pieceAtTarget.type,
    capturedPoints: pieceAtTarget.points
  })

  // Increment turn count for the team that just shot
  if (shootingTeam === 'yellow') yellowTurnCount++
  else greenTurnCount++

  // Soldier stays in place after shooting
  // Switch turns
  currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'

  // Deselect
  selectedPiece = null
  validMoves = []
  shootTargets = []
  actionMode = null
  showSoldierActions = false

  render()
}

function handleSquareClick(col: string, row: number) {
  const piece = getPieceAt(col, row)

  if (selectedPiece) {
    // If clicking on the same piece, deselect
    if (piece === selectedPiece) {
      selectedPiece = null
      validMoves = []
      shootTargets = []
      message = null
      actionMode = null
      showSoldierActions = false
      render()
      return
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

      // Draw piece if present
      const colLetter = columns[col]
      const rowNum = BOARD_SIZE - row
      const piece = getPieceAt(colLetter, rowNum)
      if (piece) {
        // Highlight selected piece
        if (selectedPiece === piece) {
          svg += `<rect x="${x + 2}" y="${y + 2}" width="${SQUARE_SIZE - 4}" height="${SQUARE_SIZE - 4}" fill="none" stroke="#3b82f6" stroke-width="3" rx="4" class="pointer-events-none" />`
        }
        svg += drawPiece(piece, x, y)
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
      <h2 class="text-gray-200 font-bold text-base sm:text-lg border-b border-gray-700 pb-2">Score</h2>

      <!-- Yellow Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-yellow-400 font-bold text-sm sm:text-base">Yellow</span>
          <span class="text-yellow-400 font-bold text-lg sm:text-xl">${yellowScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${yellowCaptured.map(p => `
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded border border-green-700 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '💥' : p.type === 'soldier' ? '🩹' : '?'}
            </div>
          `).join('')}
          ${yellowCaptured.length === 0 ? '<span class="text-gray-500 text-xs sm:text-sm italic">-</span>' : ''}
        </div>
      </div>

      <!-- Green Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-green-400 font-bold text-sm sm:text-base">Green</span>
          <span class="text-green-400 font-bold text-lg sm:text-xl">${greenScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[24px]">
          ${greenCaptured.map(p => `
            <div class="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded border border-yellow-600 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '💥' : p.type === 'soldier' ? '🩹' : '?'}
            </div>
          `).join('')}
          ${greenCaptured.length === 0 ? '<span class="text-gray-500 text-xs sm:text-sm italic">-</span>' : ''}
        </div>
      </div>
    </div>
  `
}

function createMoveLog(): string {
  return `
    <div class="bg-gray-800 rounded-lg p-3 sm:p-4 w-full lg:w-64 flex-1 flex flex-col min-h-0 max-h-40 lg:max-h-none">
      <h2 class="text-gray-200 font-bold text-base sm:text-lg mb-2 sm:mb-3 border-b border-gray-700 pb-2">Moves</h2>
      <div id="move-list" class="flex-1 overflow-y-auto space-y-1 text-xs sm:text-sm font-mono min-h-0">
        ${moveLog.length === 0
          ? '<p class="text-gray-500 italic text-xs sm:text-sm">No moves yet</p>'
          : moveLog.map((move, i) => {
              const textColor = move.team === 'yellow' ? 'text-yellow-400' : move.team === 'green' ? 'text-green-400' : 'text-gray-300'
              return `
              <div class="${textColor} flex flex-col">
                <div class="flex">
                  <span class="text-gray-500 w-6 sm:w-8">${i + 1}.</span>
                  <span>${move.from}→${move.to}</span>
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
  if (gameState === 'start') {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
        <h1 class="text-2xl sm:text-4xl font-bold text-white">War Chess</h1>
        <button id="start-btn" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors touch-manipulation">
          Start Game
        </button>
        <div class="flex items-start gap-4 sm:gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
        </div>
      </div>
    `
    document.getElementById('start-btn')?.addEventListener('click', startGame)
    return
  }

  // Confirm reset dialog
  if (gameState === 'confirmReset') {
    app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <div class="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col items-center gap-4 mx-4">
          <p class="text-white text-base sm:text-lg text-center">Reset the game?</p>
          <div class="flex gap-3 sm:gap-4">
            <button id="confirm-reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              Yes
            </button>
            <button id="cancel-reset-btn" class="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation">
              No
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
      message = "Soldier trapped in trench - eliminated!"
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
      currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'
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

  // Soldier action buttons HTML - show when soldier is selected (but not when forced out of trench)
  const showSoldierButtons = selectedPiece?.type === 'soldier' && !forcedSoldier
  const canExit = selectedPiece && canExitTunnel(selectedPiece)
  const moveButtonClass = actionMode === 'move' ? 'bg-blue-800 ring-2 ring-blue-400' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
  const shootButtonClass = actionMode === 'shoot' ? 'bg-red-800 ring-2 ring-red-400' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
  const soldierActionsHtml = showSoldierButtons ? `
    <div class="bg-gray-800 px-2 sm:px-4 py-2 rounded-lg flex gap-1 sm:gap-2">
      <button id="action-move" class="${moveButtonClass} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
        Move
      </button>
      ${!selectedPiece?.inTunnel ? `
        <button id="action-shoot" class="${shootButtonClass} text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          Shoot
        </button>
      ` : ''}
      ${canExit ? `
        <button id="action-exit" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-3 sm:px-4 rounded text-xs sm:text-sm transition-colors touch-manipulation">
          Exit
        </button>
      ` : ''}
    </div>
  ` : ''

  // Playing state
  app.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-8 gap-2 sm:gap-4">
      ${forcedTrenchWarning}
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div class="bg-gray-800 px-3 py-2 rounded-lg border-2 ${turnColor}">
          <span class="${turnColor} font-bold text-sm sm:text-base">${currentTurn.toUpperCase()}'s turn</span>
        </div>
        ${soldierActionsHtml}
        ${message && !forcedSoldier ? `<div class="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm">${message}</div>` : ''}
        <button id="reset-btn" class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors">
          Reset
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
