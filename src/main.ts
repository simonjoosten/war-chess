import './style.css'

const BOARD_SIZE = 11
const SQUARE_SIZE = 50
const LABEL_SIZE = 30

const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

type Team = 'yellow' | 'green'
type PieceType = 'train'

interface Piece {
  type: PieceType
  team: Team
  col: string
  row: number
  points: number
}

interface Move {
  from: string
  to: string
  piece?: string
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
type GameState = 'start' | 'playing' | 'confirmReset'
let gameState: GameState = 'start'

// Selected piece and valid moves
let selectedPiece: Piece | null = null
let validMoves: { col: string; row: number; canCapture: boolean }[] = []
let message: string | null = null
let currentTurn: Team = 'yellow' // Yellow starts

function getInitialPieces(): Piece[] {
  return [
    // Yellow trains
    { type: 'train', team: 'yellow', col: 'K', row: 1, points: 10 },
    { type: 'train', team: 'yellow', col: 'A', row: 1, points: 10 },
    // Green trains
    { type: 'train', team: 'green', col: 'A', row: 11, points: 10 },
    { type: 'train', team: 'green', col: 'K', row: 11, points: 10 },
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
  message = null
  currentTurn = 'yellow'
  gameState = 'start'
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

function selectPiece(piece: Piece) {
  // Check if it's this team's turn
  if (piece.team !== currentTurn) {
    message = `It's ${currentTurn}'s turn! You cannot move ${piece.team}'s pieces.`
    render()
    return
  }

  selectedPiece = piece
  message = null

  if (piece.type === 'train') {
    validMoves = getValidMovesForTrain(piece)
  }

  render()
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

  // Log the move
  moveLog.push({
    from: `${selectedPiece.col}${selectedPiece.row}`,
    to: `${col}${row}`,
    piece: selectedPiece.type,
    captured: capturedPiece?.type,
    capturedPoints: capturedPiece?.points
  })

  // Move the piece
  selectedPiece.col = col
  selectedPiece.row = row

  // Switch turns
  currentTurn = currentTurn === 'yellow' ? 'green' : 'yellow'

  // Deselect
  selectedPiece = null
  validMoves = []

  render()
}

function handleSquareClick(col: string, row: number) {
  const piece = getPieceAt(col, row)

  if (selectedPiece) {
    // If clicking on the same piece, deselect
    if (piece === selectedPiece) {
      selectedPiece = null
      validMoves = []
      message = null
      render()
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
  return ''
}

function createBoard(): string {
  const boardWidth = BOARD_SIZE * SQUARE_SIZE
  const boardHeight = BOARD_SIZE * SQUARE_SIZE
  const totalWidth = boardWidth + LABEL_SIZE
  const totalHeight = boardHeight + LABEL_SIZE

  let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" class="max-h-[80vh] w-auto">`

  // Special tile definitions
  const isRiver = (row: number, col: number) => row === 5 && col !== 5 // Row 6 (index 5), except F6
  const isBridge = (row: number, col: number) => row === 5 && col === 5 // F6
  const isGrey = (row: number, col: number) => {
    const colLetter = columns[col]
    const rowNum = BOARD_SIZE - row
    // e3-5, g3-5, e7-9, g7-9
    return (colLetter === 'E' && rowNum >= 3 && rowNum <= 5) ||
           (colLetter === 'G' && rowNum >= 3 && rowNum <= 5) ||
           (colLetter === 'E' && rowNum >= 7 && rowNum <= 9) ||
           (colLetter === 'G' && rowNum >= 7 && rowNum <= 9)
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
    <div class="bg-gray-800 rounded-lg p-4 w-64 flex flex-col gap-4">
      <h2 class="text-gray-200 font-bold text-lg border-b border-gray-700 pb-2">Score</h2>

      <!-- Yellow Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-yellow-400 font-bold">Yellow Team</span>
          <span class="text-yellow-400 font-bold text-xl">${yellowScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[30px]">
          ${yellowCaptured.map(p => `
            <div class="w-6 h-6 bg-green-500 rounded border border-green-700 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '🚂' : '?'}
            </div>
          `).join('')}
          ${yellowCaptured.length === 0 ? '<span class="text-gray-500 text-sm italic">No captures</span>' : ''}
        </div>
      </div>

      <!-- Green Team -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-green-400 font-bold">Green Team</span>
          <span class="text-green-400 font-bold text-xl">${greenScore}</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[30px]">
          ${greenCaptured.map(p => `
            <div class="w-6 h-6 bg-yellow-400 rounded border border-yellow-600 flex items-center justify-center text-xs" title="${p.type} (${p.points}pts)">
              ${p.type === 'train' ? '🚂' : '?'}
            </div>
          `).join('')}
          ${greenCaptured.length === 0 ? '<span class="text-gray-500 text-sm italic">No captures</span>' : ''}
        </div>
      </div>
    </div>
  `
}

function createMoveLog(): string {
  return `
    <div class="bg-gray-800 rounded-lg p-4 w-64 flex-1 flex flex-col min-h-0">
      <h2 class="text-gray-200 font-bold text-lg mb-3 border-b border-gray-700 pb-2">Move Log</h2>
      <div id="move-list" class="flex-1 overflow-y-auto space-y-1 text-sm font-mono min-h-0">
        ${moveLog.length === 0
          ? '<p class="text-gray-500 italic">No moves yet</p>'
          : moveLog.map((move, i) => `
              <div class="text-gray-300 flex flex-col">
                <div class="flex">
                  <span class="text-gray-500 w-8">${i + 1}.</span>
                  <span>${move.piece ? move.piece + ' ' : ''}${move.from} → ${move.to}</span>
                </div>
                ${move.captured ? `<span class="text-red-400 text-xs ml-8">✕ captured ${move.captured} (+${move.capturedPoints})</span>` : ''}
              </div>
            `).join('')
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
      <div class="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
        <h1 class="text-4xl font-bold text-white">War Chess</h1>
        <button id="start-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors">
          Start Game
        </button>
        <div class="flex items-start gap-8 opacity-50">
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
      <div class="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
        <div class="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-4">
          <p class="text-white text-lg">Are you sure you want to reset the game?</p>
          <div class="flex gap-4">
            <button id="confirm-reset-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Yes, Reset
            </button>
            <button id="cancel-reset-btn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              No, Cancel
            </button>
          </div>
        </div>
        <div class="flex items-start gap-8 opacity-50">
          <div class="flex-shrink-0" id="board-container">
            ${createBoard()}
          </div>
          <div class="flex flex-col gap-4 h-[80vh]">
            ${createScorePanel()}
            ${createMoveLog()}
          </div>
        </div>
      </div>
    `
    document.getElementById('confirm-reset-btn')?.addEventListener('click', resetGame)
    document.getElementById('cancel-reset-btn')?.addEventListener('click', cancelReset)
    return
  }

  // Playing state
  app.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
      <div class="flex items-center gap-4">
        <div class="bg-gray-800 px-4 py-2 rounded-lg border-2 ${turnColor}">
          <span class="${turnColor} font-bold">${currentTurn.toUpperCase()}'s turn</span>
        </div>
        ${message ? `<div class="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">${message}</div>` : ''}
        <button id="reset-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
          Reset Game
        </button>
      </div>
      <div class="flex items-start gap-8">
        <div class="flex-shrink-0" id="board-container">
          ${createBoard()}
        </div>
        <div class="flex flex-col gap-4 h-[80vh]">
          ${createScorePanel()}
          ${createMoveLog()}
        </div>
      </div>
    </div>
  `

  // Add reset button listener
  document.getElementById('reset-btn')?.addEventListener('click', showResetConfirm)

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
