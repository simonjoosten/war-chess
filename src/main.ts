import './style.css'

const BOARD_SIZE = 11
const SQUARE_SIZE = 50
const LABEL_SIZE = 30

const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']

interface Move {
  from: string
  to: string
  piece?: string
}

const moveLog: Move[] = []

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

function createMoveLog(): string {
  return `
    <div class="bg-gray-800 rounded-lg p-4 w-64 h-[80vh] flex flex-col">
      <h2 class="text-gray-200 font-bold text-lg mb-3 border-b border-gray-700 pb-2">Move Log</h2>
      <div id="move-list" class="flex-1 overflow-y-auto space-y-1 text-sm font-mono">
        ${moveLog.length === 0
          ? '<p class="text-gray-500 italic">No moves yet</p>'
          : moveLog.map((move, i) => `
              <div class="text-gray-300 flex">
                <span class="text-gray-500 w-8">${i + 1}.</span>
                <span>${move.piece ? move.piece + ' ' : ''}${move.from} → ${move.to}</span>
              </div>
            `).join('')
        }
      </div>
    </div>
  `
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-8 gap-8">
      <div class="flex-shrink-0">
        ${createBoard()}
      </div>
      ${createMoveLog()}
    </div>
  `
}

render()
