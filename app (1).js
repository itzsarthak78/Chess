/* ==========================================================
   ChessTruffy.io — Full Chess Engine + Smart Bot
   ========================================================== */

'use strict';

// ────────────────────────────────────────────────────────────
// SVG PIECE DEFINITIONS  (Black = dark navy, Blue = steel blue)
// ────────────────────────────────────────────────────────────
const PIECE_SVG = {
  // ── PAWN ──
  bP: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22.5" cy="9" r="5.5"/>
      <path d="M22.5 15 C17 15 13 20 13 25 C13 29 15 32 18 33.5 L16 38 H29 L27 33.5 C30 32 32 29 32 25 C32 20 28 15 22.5 15Z"/>
      <rect x="12" y="38" width="21" height="5" rx="2"/>
    </g>
    <g fill="#c9a84c" stroke="none">
      <circle cx="22.5" cy="9" r="3.5"/>
    </g>
  </svg>`,

  wP: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22.5" cy="9" r="5.5"/>
      <path d="M22.5 15 C17 15 13 20 13 25 C13 29 15 32 18 33.5 L16 38 H29 L27 33.5 C30 32 32 29 32 25 C32 20 28 15 22.5 15Z"/>
      <rect x="12" y="38" width="21" height="5" rx="2"/>
    </g>
    <g fill="#4fc3f7" stroke="none">
      <circle cx="22.5" cy="9" r="3.5"/>
    </g>
  </svg>`,

  // ── ROOK ──
  bR: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="36" width="27" height="7" rx="2"/>
      <rect x="12" y="30" width="21" height="7" rx="1"/>
      <rect x="14" y="12" width="17" height="19" rx="1"/>
      <rect x="9" y="7" width="7" height="10" rx="1"/>
      <rect x="19" y="7" width="7" height="10" rx="1"/>
      <rect x="29" y="7" width="7" height="10" rx="1"/>
    </g>
    <g fill="#c9a84c" stroke="none">
      <rect x="15" y="34" width="15" height="2" rx="1"/>
    </g>
  </svg>`,

  wR: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="36" width="27" height="7" rx="2"/>
      <rect x="12" y="30" width="21" height="7" rx="1"/>
      <rect x="14" y="12" width="17" height="19" rx="1"/>
      <rect x="9" y="7" width="7" height="10" rx="1"/>
      <rect x="19" y="7" width="7" height="10" rx="1"/>
      <rect x="29" y="7" width="7" height="10" rx="1"/>
    </g>
    <g fill="#4fc3f7" stroke="none">
      <rect x="15" y="34" width="15" height="2" rx="1"/>
    </g>
  </svg>`,

  // ── KNIGHT ──
  bN: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="10" y="37" width="25" height="6" rx="2"/>
      <rect x="13" y="32" width="19" height="6" rx="1"/>
      <path d="M14 32 C14 32 12 22 19 16 C19 16 15 14 15 9 C15 7 18 6 20 6 C22 6 22 8 24 8 C28 8 30 5 32 8 C34 11 30 14 28 16 C34 18 36 27 35 32 Z"/>
      <circle cx="24" cy="10" r="2.5" fill="#c9a84c" stroke="none"/>
      <circle cx="20" cy="14" r="1.5" fill="#c9a84c" stroke="none"/>
    </g>
  </svg>`,

  wN: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="10" y="37" width="25" height="6" rx="2"/>
      <rect x="13" y="32" width="19" height="6" rx="1"/>
      <path d="M14 32 C14 32 12 22 19 16 C19 16 15 14 15 9 C15 7 18 6 20 6 C22 6 22 8 24 8 C28 8 30 5 32 8 C34 11 30 14 28 16 C34 18 36 27 35 32 Z"/>
      <circle cx="24" cy="10" r="2.5" fill="#4fc3f7" stroke="none"/>
      <circle cx="20" cy="14" r="1.5" fill="#4fc3f7" stroke="none"/>
    </g>
  </svg>`,

  // ── BISHOP ──
  bB: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="37" width="27" height="6" rx="2"/>
      <rect x="13" y="33" width="19" height="5" rx="1"/>
      <path d="M22.5 6 C16 6 12 12 12 19 C12 26 16 31 22.5 33 C29 31 33 26 33 19 C33 12 29 6 22.5 6Z"/>
      <circle cx="22.5" cy="6" r="3"/>
      <line x1="22.5" y1="3" x2="22.5" y2="9" stroke="#c9a84c" stroke-width="1.5"/>
      <line x1="19.5" y1="6" x2="25.5" y2="6" stroke="#c9a84c" stroke-width="1.5"/>
    </g>
    <ellipse cx="22.5" cy="20" rx="4" ry="5" fill="#c9a84c" opacity="0.25" stroke="none"/>
  </svg>`,

  wB: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="37" width="27" height="6" rx="2"/>
      <rect x="13" y="33" width="19" height="5" rx="1"/>
      <path d="M22.5 6 C16 6 12 12 12 19 C12 26 16 31 22.5 33 C29 31 33 26 33 19 C33 12 29 6 22.5 6Z"/>
      <circle cx="22.5" cy="6" r="3"/>
      <line x1="22.5" y1="3" x2="22.5" y2="9" stroke="#4fc3f7" stroke-width="1.5"/>
      <line x1="19.5" y1="6" x2="25.5" y2="6" stroke="#4fc3f7" stroke-width="1.5"/>
    </g>
    <ellipse cx="22.5" cy="20" rx="4" ry="5" fill="#4fc3f7" opacity="0.2" stroke="none"/>
  </svg>`,

  // ── QUEEN ──
  bQ: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="37" width="29" height="6" rx="2"/>
      <rect x="11" y="32" width="23" height="6" rx="1"/>
      <path d="M11 32 L14 15 L22.5 26 L31 15 L34 32 Z"/>
      <circle cx="9" cy="13" r="4"/>
      <circle cx="22.5" cy="8" r="4"/>
      <circle cx="36" cy="13" r="4"/>
      <polygon points="22.5,4 24,8 22.5,8 21,8" fill="#c9a84c" stroke="none"/>
    </g>
    <g fill="#c9a84c" stroke="none">
      <circle cx="9" cy="13" r="1.8"/>
      <circle cx="22.5" cy="8" r="1.8"/>
      <circle cx="36" cy="13" r="1.8"/>
    </g>
  </svg>`,

  wQ: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="37" width="29" height="6" rx="2"/>
      <rect x="11" y="32" width="23" height="6" rx="1"/>
      <path d="M11 32 L14 15 L22.5 26 L31 15 L34 32 Z"/>
      <circle cx="9" cy="13" r="4"/>
      <circle cx="22.5" cy="8" r="4"/>
      <circle cx="36" cy="13" r="4"/>
      <polygon points="22.5,4 24,8 22.5,8 21,8" fill="#4fc3f7" stroke="none"/>
    </g>
    <g fill="#4fc3f7" stroke="none">
      <circle cx="9" cy="13" r="1.8"/>
      <circle cx="22.5" cy="8" r="1.8"/>
      <circle cx="36" cy="13" r="1.8"/>
    </g>
  </svg>`,

  // ── KING ──
  bK: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a2e" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="37" width="29" height="6" rx="2"/>
      <rect x="11" y="31" width="23" height="7" rx="1"/>
      <rect x="14" y="19" width="17" height="13" rx="1"/>
      <rect x="19" y="11" width="7" height="20" rx="1"/>
      <rect x="14" y="15" width="17" height="5" rx="1"/>
      <rect x="20" y="7" width="5" height="8" rx="1"/>
      <line x1="22.5" y1="4" x2="22.5" y2="11" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="19" y1="7.5" x2="26" y2="7.5" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </svg>`,

  wK: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a4a8a" stroke="#4fc3f7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="37" width="29" height="6" rx="2"/>
      <rect x="11" y="31" width="23" height="7" rx="1"/>
      <rect x="14" y="19" width="17" height="13" rx="1"/>
      <rect x="19" y="11" width="7" height="20" rx="1"/>
      <rect x="14" y="15" width="17" height="5" rx="1"/>
      <rect x="20" y="7" width="5" height="8" rx="1"/>
      <line x1="22.5" y1="4" x2="22.5" y2="11" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="19" y1="7.5" x2="26" y2="7.5" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </svg>`
};

// Mini SVG for captured pieces display
const MINI_SVG = {};
for (const key in PIECE_SVG) {
  MINI_SVG[key] = PIECE_SVG[key]; // reuse, scaled by CSS
}

// ────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────
const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

const PIECE_VALUES = { P:100, N:320, B:330, R:500, Q:900, K:20000 };

// Positional tables (from white/blue perspective, flipped for black)
const PST = {
  P: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0
  ],
  N: [
   -50,-40,-30,-30,-30,-30,-40,-50,
   -40,-20,  0,  0,  0,  0,-20,-40,
   -30,  0, 10, 15, 15, 10,  0,-30,
   -30,  5, 15, 20, 20, 15,  5,-30,
   -30,  0, 15, 20, 20, 15,  0,-30,
   -30,  5, 10, 15, 15, 10,  5,-30,
   -40,-20,  0,  5,  5,  0,-20,-40,
   -50,-40,-30,-30,-30,-30,-40,-50
  ],
  B: [
   -20,-10,-10,-10,-10,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5, 10, 10,  5,  0,-10,
   -10,  5,  5, 10, 10,  5,  5,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10, 10, 10, 10, 10, 10, 10,-10,
   -10,  5,  0,  0,  0,  0,  5,-10,
   -20,-10,-10,-10,-10,-10,-10,-20
  ],
  R: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0
  ],
  Q: [
   -20,-10,-10, -5, -5,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
     0,  0,  5,  5,  5,  5,  0, -5,
   -10,  5,  5,  5,  5,  5,  0,-10,
   -10,  0,  5,  0,  0,  0,  0,-10,
   -20,-10,-10, -5, -5,-10,-10,-20
  ],
  K: [
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -20,-30,-30,-40,-40,-30,-30,-20,
   -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
  ]
};

// ────────────────────────────────────────────────────────────
// GAME STATE
// ────────────────────────────────────────────────────────────
let board = [];           // 8x8 array of piece objects or null
let currentTurn = 'w';   // 'w' = blue, 'b' = black
let selectedSquare = null;
let possibleMoves = [];
let gameMode = '2player'; // '2player' or 'bot'
let botDifficulty = 3;    // search depth
let botColor = 'b';       // bot plays black by default
let gameOver = false;
let flipped = false;

let moveHistory = [];     // full move objects
let capturedByW = [];     // pieces captured by blue (white)
let capturedByB = [];     // pieces captured by black

let enPassantTarget = null;  // square index for en passant
let castlingRights = { wK: true, wQ: true, bK: true, bQ: true };

let gameStats = { moves: 0, captures: 0, checks: 0 };
let gameStartTime = null;
let timerInterval = null;
let playerTimers = { w: 600, b: 600 }; // 10 min each
let playerTimerInterval = null;

let promotionCallback = null;
let animating = false;

// ────────────────────────────────────────────────────────────
// DOM REFS
// ────────────────────────────────────────────────────────────
const chessBoard      = document.getElementById('chessBoard');
const statusText      = document.getElementById('statusText');
const statusBar       = document.getElementById('statusBar');
const moveLog         = document.getElementById('moveLog');
const capturedByTop   = document.getElementById('capturedByTop');
const capturedByBottom= document.getElementById('capturedByBottom');
const timerTop        = document.getElementById('timerTop');
const timerBottom     = document.getElementById('timerBottom');
const statMoves       = document.getElementById('statMoves');
const statCaptures    = document.getElementById('statCaptures');
const statChecks      = document.getElementById('statChecks');
const statTime        = document.getElementById('statTime');
const evalFillBlack   = document.getElementById('evalFillBlack');
const evalFillBlue    = document.getElementById('evalFillBlue');
const evalLabelBlack  = document.getElementById('evalLabelBlack');
const evalLabelBlue   = document.getElementById('evalLabelBlue');
const promotionModal  = document.getElementById('promotionModal');
const promotionChoices= document.getElementById('promotionChoices');
const gameOverModal   = document.getElementById('gameOverModal');
const gameOverTitle   = document.getElementById('gameOverTitle');
const gameOverMsg     = document.getElementById('gameOverMsg');
const botThinking     = document.getElementById('botThinking');
const cardTop         = document.getElementById('cardTop');
const cardBottom      = document.getElementById('cardBottom');
const nameTop         = document.getElementById('nameTop');
const nameBottom      = document.getElementById('nameBottom');
const diffWrap        = document.getElementById('difficultyWrap');

// ────────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────────
function init() {
  buildCoords();
  spawnParticles();
  setupEventListeners();
  initGame();
}

function buildCoords() {
  const letters = ['a','b','c','d','e','f','g','h'];
  ['coordLettersTop','coordLettersBottom'].forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = '';
    letters.forEach(l => {
      const s = document.createElement('span');
      s.textContent = l;
      el.appendChild(s);
    });
  });
  const ranks8 = ['8','7','6','5','4','3','2','1'];
  ['coordNumsLeft','coordNumsRight'].forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = '';
    ranks8.forEach(r => {
      const s = document.createElement('span');
      s.textContent = r;
      el.appendChild(s);
    });
  });
}

function spawnParticles() {
  const container = document.getElementById('bgParticles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*20}%;
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(p);
  }
}

function setupEventListeners() {
  document.getElementById('btnNewGame').addEventListener('click', () => { confirmNewGame(); });
  document.getElementById('startBtn').addEventListener('click', () => { initGame(); });
  document.getElementById('btnUndo').addEventListener('click', undoMove);
  document.getElementById('btnFlip').addEventListener('click', () => { flipped = !flipped; renderBoard(); });
  document.getElementById('btnPlayAgain').addEventListener('click', () => { hideModal(gameOverModal); initGame(); });
  document.getElementById('btnReviewGame').addEventListener('click', () => { hideModal(gameOverModal); });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameMode = btn.dataset.mode;
      diffWrap.style.display = gameMode === 'bot' ? '' : 'none';
    });
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      botDifficulty = parseInt(btn.dataset.diff);
    });
  });

  diffWrap.style.display = 'none';
}

function confirmNewGame() {
  if (moveHistory.length > 0) {
    if (!confirm('Start a new game? Current game will be lost.')) return;
  }
  initGame();
}

// ────────────────────────────────────────────────────────────
// BOARD SETUP
// ────────────────────────────────────────────────────────────
function initGame() {
  // Reset state
  board = createInitialBoard();
  currentTurn = 'w'; // blue goes first
  selectedSquare = null;
  possibleMoves = [];
  gameOver = false;
  moveHistory = [];
  capturedByW = [];
  capturedByB = [];
  enPassantTarget = null;
  castlingRights = { wK: true, wQ: true, bK: true, bQ: true };
  gameStats = { moves: 0, captures: 0, checks: 0 };
  gameStartTime = Date.now();
  playerTimers = { w: 600, b: 600 };
  animating = false;

  clearInterval(timerInterval);
  clearInterval(playerTimerInterval);

  // Game timer
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const m = Math.floor(elapsed / 60).toString();
    const s = (elapsed % 60).toString().padStart(2, '0');
    statTime.textContent = `${m}:${s}`;
  }, 1000);

  // Player timers
  playerTimerInterval = setInterval(() => {
    if (gameOver || animating) return;
    playerTimers[currentTurn]--;
    if (playerTimers[currentTurn] <= 0) {
      playerTimers[currentTurn] = 0;
      handleTimeOut();
    }
    updateTimerDisplay();
  }, 1000);

  updatePlayerNames();
  renderBoard();
  updateStatus();
  updateMoveLog();
  updateCaptured();
  updateStats();
  updateEvalBar();
  updateTimerDisplay();

  statusBar.className = 'status-bar';
  hideModal(gameOverModal);
  hideModal(promotionModal);
}

function createInitialBoard() {
  const b = Array(64).fill(null);
  const backRank = ['R','N','B','Q','K','B','N','R'];

  // Black pieces (top)
  for (let i = 0; i < 8; i++) {
    b[i] = { color:'b', type: backRank[i], id: `b${backRank[i]}${i}` };
    b[8+i] = { color:'b', type:'P', id: `bP${i}` };
  }
  // Blue/White pieces (bottom)
  for (let i = 0; i < 8; i++) {
    b[48+i] = { color:'w', type:'P', id: `wP${i}` };
    b[56+i] = { color:'w', type: backRank[i], id: `w${backRank[i]}${i}` };
  }
  return b;
}

// ────────────────────────────────────────────────────────────
// RENDERING
// ────────────────────────────────────────────────────────────
function renderBoard() {
  chessBoard.innerHTML = '';

  const lastFrom = moveHistory.length ? moveHistory[moveHistory.length-1].from : -1;
  const lastTo   = moveHistory.length ? moveHistory[moveHistory.length-1].to   : -1;
  const kingIdx  = findKing(currentTurn);
  const inChk    = isInCheck(currentTurn, board);

  for (let visual = 0; visual < 64; visual++) {
    const idx = flipped ? (63 - visual) : visual;
    const row = Math.floor(idx / 8);
    const col = idx % 8;
    const isLight = (row + col) % 2 === 0;

    const sq = document.createElement('div');
    sq.className = `square ${isLight ? 'light' : 'dark'}`;
    sq.dataset.idx = idx;

    if (idx === lastFrom) sq.classList.add('last-from');
    if (idx === lastTo)   sq.classList.add('last-to');
    if (idx === selectedSquare) sq.classList.add('highlighted');
    if (idx === kingIdx && inChk) sq.classList.add('in-check');

    const move = possibleMoves.find(m => m.to === idx);
    if (move) {
      if (board[idx] && board[idx].color !== currentTurn) {
        sq.classList.add('possible-move', 'possible-capture');
      } else if (enPassantTarget === idx && move.enPassant) {
        sq.classList.add('possible-move', 'possible-capture');
      } else {
        sq.classList.add('possible-move');
      }
    }

    if (board[idx]) {
      const piece = board[idx];
      const pieceEl = document.createElement('div');
      pieceEl.className = 'piece';
      pieceEl.dataset.pieceId = piece.id;
      pieceEl.innerHTML = PIECE_SVG[piece.color + piece.type] || '';

      const canClick = !gameOver && !animating &&
        (gameMode === '2player' || currentTurn !== botColor);

      if (canClick && piece.color === currentTurn) {
        pieceEl.style.cursor = 'grab';
        pieceEl.addEventListener('click', (e) => { e.stopPropagation(); handleSquareClick(idx); });
      }
      sq.appendChild(pieceEl);
    }

    // Square click for move target
    sq.addEventListener('click', () => handleSquareClick(idx));
    chessBoard.appendChild(sq);
  }

  updateActivePlayer();
}

function updatePlayerNames() {
  if (gameMode === 'bot') {
    nameBottom.textContent = 'You (Blue)';
    nameTop.textContent = 'ChessBot AI';
    botColor = 'b';
  } else {
    nameBottom.textContent = 'Blue Force';
    nameTop.textContent = 'Dark Side';
  }
}

function updateActivePlayer() {
  if (currentTurn === 'w') {
    cardBottom.classList.add('active-player');
    cardTop.classList.remove('active-player');
  } else {
    cardTop.classList.add('active-player');
    cardBottom.classList.remove('active-player');
  }
}

function updateTimerDisplay() {
  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  timerTop.textContent = fmt(playerTimers['b']);
  timerBottom.textContent = fmt(playerTimers['w']);
  timerTop.classList.toggle('low-time', playerTimers['b'] < 30);
  timerBottom.classList.toggle('low-time', playerTimers['w'] < 30);
}

function updateStatus(msg, type) {
  if (msg) {
    statusText.textContent = msg;
    statusBar.className = 'status-bar' + (type ? ' ' + type : '');
    return;
  }
  const inChk = isInCheck(currentTurn, board);
  const moves  = getAllLegalMoves(currentTurn, board);
  if (moves.length === 0) {
    if (inChk) {
      const winner = currentTurn === 'w' ? 'Black' : 'Blue';
      statusText.textContent = `Checkmate! ${winner} wins!`;
      statusBar.className = 'status-bar checkmate-status';
      endGame(currentTurn === 'w' ? 'b' : 'w', 'checkmate');
    } else {
      statusText.textContent = 'Stalemate! Draw!';
      statusBar.className = 'status-bar';
      endGame(null, 'stalemate');
    }
    return;
  }
  if (inChk) {
    const who = currentTurn === 'w' ? 'Blue' : 'Black';
    statusText.textContent = `${who} is in Check!`;
    statusBar.className = 'status-bar check-status';
    gameStats.checks++;
    updateStats();
  } else {
    const who = currentTurn === 'w' ? 'Blue' : 'Black';
    statusText.textContent = `${who}'s turn`;
    statusBar.className = 'status-bar';
  }
}

function updateMoveLog() {
  moveLog.innerHTML = '';
  const entries = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    entries.push({ num: Math.floor(i/2)+1, w: moveHistory[i], b: moveHistory[i+1] });
  }
  entries.forEach((e, ei) => {
    const div = document.createElement('div');
    div.className = `move-entry${ei === entries.length-1 ? ' last-move' : ''}`;
    div.innerHTML = `
      <span class="move-num">${e.num}.</span>
      <span class="move-notation">${e.w ? e.w.notation : ''}</span>
      <span class="move-notation">${e.b ? e.b.notation : ''}</span>
    `;
    moveLog.appendChild(div);
  });
  moveLog.scrollTop = moveLog.scrollHeight;
}

function updateCaptured() {
  const renderCaptured = (arr, el) => {
    el.innerHTML = '';
    arr.forEach(p => {
      const div = document.createElement('div');
      div.className = 'captured-piece-icon';
      div.innerHTML = PIECE_SVG[p.color + p.type] || '';
      el.appendChild(div);
    });
  };
  // Blue captured black pieces → shown near black player (top)
  // Black captured blue pieces → shown near blue player (bottom)
  renderCaptured(capturedByW, capturedByBottom); // captured BY blue from black
  renderCaptured(capturedByB, capturedByTop);    // captured BY black from blue
}

function updateStats() {
  statMoves.textContent = gameStats.moves;
  statCaptures.textContent = gameStats.captures;
  statChecks.textContent = gameStats.checks;
}

function updateEvalBar() {
  const score = evaluateBoard(board, 'w');
  const clamped = Math.max(-800, Math.min(800, score));
  const pct = ((clamped + 800) / 1600) * 100;
  evalFillBlue.style.height = pct + '%';
  evalFillBlack.style.height = (100 - pct) + '%';
  const display = (Math.abs(score) / 100).toFixed(1);
  evalLabelBlue.textContent = score >= 0 ? `+${display}` : `0.0`;
  evalLabelBlack.textContent = score < 0 ? `+${(Math.abs(score)/100).toFixed(1)}` : `0.0`;
}

// ────────────────────────────────────────────────────────────
// CLICK HANDLER
// ────────────────────────────────────────────────────────────
function handleSquareClick(idx) {
  if (gameOver || animating) return;
  if (gameMode === 'bot' && currentTurn === botColor) return;

  const piece = board[idx];

  // If clicking own piece → select it
  if (piece && piece.color === currentTurn) {
    if (selectedSquare === idx) {
      // Deselect
      selectedSquare = null;
      possibleMoves = [];
    } else {
      selectedSquare = idx;
      possibleMoves = getLegalMovesForPiece(idx, board);
    }
    renderBoard();
    return;
  }

  // If a piece is selected and clicking target
  if (selectedSquare !== null) {
    const move = possibleMoves.find(m => m.to === idx);
    if (move) {
      executeMove(move);
    } else {
      selectedSquare = null;
      possibleMoves = [];
      renderBoard();
    }
  }
}

// ────────────────────────────────────────────────────────────
// MOVE EXECUTION
// ────────────────────────────────────────────────────────────
function executeMove(move, skipAnimation) {
  if (!skipAnimation) {
    animating = true;
    animatePieceMove(move, () => {
      animating = false;
      applyMove(move);
      afterMove(move);
    });
  } else {
    applyMove(move);
    afterMove(move);
  }
}

function animatePieceMove(move, callback) {
  const boardRect = chessBoard.getBoundingClientRect();
  const squareSize = boardRect.width / 8;

  const fromVisual = flipped ? (63 - move.from) : move.from;
  const toVisual   = flipped ? (63 - move.to)   : move.to;

  const fromRow = Math.floor(fromVisual / 8);
  const fromCol = fromVisual % 8;
  const toRow   = Math.floor(toVisual / 8);
  const toCol   = toVisual % 8;

  const fromX = fromCol * squareSize + squareSize / 2;
  const fromY = fromRow * squareSize + squareSize / 2;
  const toX   = toCol * squareSize + squareSize / 2;
  const toY   = toRow * squareSize + squareSize / 2;

  // Get the piece element from the board
  const fromSq = chessBoard.children[fromVisual];
  const pieceEl = fromSq ? fromSq.querySelector('.piece') : null;

  if (!pieceEl) { callback(); return; }

  // If capturing, animate out the captured piece
  const capturedSq = chessBoard.children[toVisual];
  const capturedEl = capturedSq ? capturedSq.querySelector('.piece') : null;
  if (capturedEl) {
    capturedEl.style.animation = 'pieceCapture 0.2s ease-out forwards';
  }

  // Clone the moving piece for animation
  const clone = pieceEl.cloneNode(true);
  clone.style.cssText = `
    position:absolute;
    width:${squareSize * 0.85}px;
    height:${squareSize * 0.85}px;
    left:${fromX - squareSize*0.425}px;
    top:${fromY - squareSize*0.425}px;
    z-index:200;
    pointer-events:none;
    transition:left 0.22s cubic-bezier(.4,.2,.2,1), top 0.22s cubic-bezier(.4,.2,.2,1);
    display:flex; align-items:center; justify-content:center;
    filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6));
  `;
  chessBoard.style.position = 'relative';
  chessBoard.appendChild(clone);

  // Hide original
  pieceEl.style.opacity = '0';

  // Animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.left = `${toX - squareSize*0.425}px`;
      clone.style.top  = `${toY - squareSize*0.425}px`;
    });
  });

  setTimeout(() => {
    clone.remove();
    callback();
  }, 240);
}

function applyMove(move) {
  const piece = board[move.from];
  if (!piece) return;

  // Handle capture
  if (move.capture) {
    const captIdx = move.enPassant ? move.enPassantCaptureIdx : move.to;
    const captured = board[captIdx];
    if (captured) {
      if (captured.color === 'w') capturedByB.push(captured);
      else capturedByW.push(captured);
      board[captIdx] = null;
      gameStats.captures++;
    }
  }

  // Move piece
  board[move.to] = piece;
  board[move.from] = null;

  // Castling: move rook
  if (move.castling === 'K') {
    const rookFrom = move.from + 3;
    const rookTo   = move.from + 1;
    board[rookTo] = board[rookFrom];
    board[rookFrom] = null;
  } else if (move.castling === 'Q') {
    const rookFrom = move.from - 4;
    const rookTo   = move.from - 1;
    board[rookTo] = board[rookFrom];
    board[rookFrom] = null;
  }

  // En passant target
  enPassantTarget = null;
  if (piece.type === 'P' && Math.abs(move.to - move.from) === 16) {
    enPassantTarget = (move.from + move.to) / 2;
  }

  // Update castling rights
  if (piece.type === 'K') {
    castlingRights[piece.color + 'K'] = false;
    castlingRights[piece.color + 'Q'] = false;
  }
  if (piece.type === 'R') {
    const col = move.from % 8;
    if (col === 7) castlingRights[piece.color + 'K'] = false;
    if (col === 0) castlingRights[piece.color + 'Q'] = false;
  }

  // Promotion
  if (move.promotion) {
    board[move.to] = { color: piece.color, type: move.promotion, id: piece.id + 'Q' };
  }

  gameStats.moves++;
  moveHistory.push(move);
}

function afterMove(move) {
  selectedSquare = null;
  possibleMoves = [];
  currentTurn = currentTurn === 'w' ? 'b' : 'w';

  renderBoard();
  updateStatus();
  updateMoveLog();
  updateCaptured();
  updateStats();
  updateEvalBar();

  if (!gameOver && gameMode === 'bot' && currentTurn === botColor) {
    triggerBotMove();
  }
}

// ────────────────────────────────────────────────────────────
// PROMOTION
// ────────────────────────────────────────────────────────────
function promptPromotion(color, callback) {
  const types = ['Q','R','B','N'];
  promotionChoices.innerHTML = '';
  types.forEach(t => {
    const btn = document.createElement('div');
    btn.className = 'promo-choice';
    btn.innerHTML = PIECE_SVG[color + t] || '';
    btn.addEventListener('click', () => {
      hideModal(promotionModal);
      callback(t);
    });
    promotionChoices.appendChild(btn);
  });
  showModal(promotionModal);
}

// ────────────────────────────────────────────────────────────
// MOVE GENERATION
// ────────────────────────────────────────────────────────────
function idx(r, c) { return r * 8 + c; }
function rowOf(i)  { return Math.floor(i / 8); }
function colOf(i)  { return i % 8; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getRawMoves(sqIdx, b, epTarget) {
  const piece = b[sqIdx];
  if (!piece) return [];
  const moves = [];
  const r = rowOf(sqIdx), c = colOf(sqIdx);
  const color = piece.color;
  const enemy = color === 'w' ? 'b' : 'w';

  const addSlide = (dr, dc) => {
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc)) {
      const ti = idx(nr, nc);
      if (b[ti]) {
        if (b[ti].color === enemy) moves.push({ from:sqIdx, to:ti, capture:true });
        break;
      }
      moves.push({ from:sqIdx, to:ti, capture:false });
      nr += dr; nc += dc;
    }
  };
  const addJump = (dr, dc) => {
    const nr = r + dr, nc = c + dc;
    if (!inBounds(nr, nc)) return;
    const ti = idx(nr, nc);
    if (!b[ti] || b[ti].color === enemy)
      moves.push({ from:sqIdx, to:ti, capture:!!b[ti] });
  };

  switch (piece.type) {
    case 'P': {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const promoRow = color === 'w' ? 0 : 7;

      // Forward
      const fwd = idx(r+dir, c);
      if (inBounds(r+dir,c) && !b[fwd]) {
        const isPromo = r+dir === promoRow;
        if (isPromo) {
          ['Q','R','B','N'].forEach(pt => moves.push({ from:sqIdx, to:fwd, capture:false, promotionPending:pt }));
        } else {
          moves.push({ from:sqIdx, to:fwd, capture:false });
          // Double push
          if (r === startRow) {
            const dbl = idx(r+2*dir, c);
            if (!b[dbl]) moves.push({ from:sqIdx, to:dbl, capture:false });
          }
        }
      }
      // Captures
      [-1,1].forEach(dc2 => {
        if (!inBounds(r+dir, c+dc2)) return;
        const ti = idx(r+dir, c+dc2);
        const isPromo = r+dir === promoRow;
        if (b[ti] && b[ti].color === enemy) {
          if (isPromo)
            ['Q','R','B','N'].forEach(pt => moves.push({ from:sqIdx, to:ti, capture:true, promotionPending:pt }));
          else
            moves.push({ from:sqIdx, to:ti, capture:true });
        }
        // En passant
        if (epTarget === ti) {
          moves.push({ from:sqIdx, to:ti, capture:true, enPassant:true, enPassantCaptureIdx: idx(r, c+dc2) });
        }
      });
      break;
    }
    case 'N':
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
        .forEach(([dr,dc]) => addJump(dr,dc));
      break;
    case 'B':
      [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => addSlide(dr,dc));
      break;
    case 'R':
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => addSlide(dr,dc));
      break;
    case 'Q':
      [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]
        .forEach(([dr,dc]) => addSlide(dr,dc));
      break;
    case 'K': {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
        .forEach(([dr,dc]) => addJump(dr,dc));
      // Castling
      if (castlingRights[color+'K']) {
        if (!b[sqIdx+1] && !b[sqIdx+2] && b[sqIdx+3] &&
            b[sqIdx+3].type==='R' && b[sqIdx+3].color===color) {
          if (!isSquareAttacked(sqIdx, enemy, b) &&
              !isSquareAttacked(sqIdx+1, enemy, b) &&
              !isSquareAttacked(sqIdx+2, enemy, b))
            moves.push({ from:sqIdx, to:sqIdx+2, capture:false, castling:'K' });
        }
      }
      if (castlingRights[color+'Q']) {
        if (!b[sqIdx-1] && !b[sqIdx-2] && !b[sqIdx-3] && b[sqIdx-4] &&
            b[sqIdx-4].type==='R' && b[sqIdx-4].color===color) {
          if (!isSquareAttacked(sqIdx, enemy, b) &&
              !isSquareAttacked(sqIdx-1, enemy, b) &&
              !isSquareAttacked(sqIdx-2, enemy, b))
            moves.push({ from:sqIdx, to:sqIdx-2, capture:false, castling:'Q' });
        }
      }
      break;
    }
  }
  return moves;
}

function isSquareAttacked(sqIdx, byColor, b) {
  for (let i = 0; i < 64; i++) {
    if (!b[i] || b[i].color !== byColor) continue;
    const rawMoves = getRawMoves(i, b, null);
    if (rawMoves.some(m => m.to === sqIdx)) return true;
  }
  return false;
}

function findKing(color, b = board) {
  return b.findIndex(p => p && p.type === 'K' && p.color === color);
}

function isInCheck(color, b) {
  const kingIdx = findKing(color, b);
  if (kingIdx === -1) return false;
  const enemy = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(kingIdx, enemy, b);
}

function applyMoveToBoard(move, b) {
  const nb = b.slice();
  const piece = nb[move.from];
  if (!piece) return nb;

  if (move.enPassant) {
    nb[move.enPassantCaptureIdx] = null;
  }
  nb[move.to] = piece;
  nb[move.from] = null;

  if (move.castling === 'K') {
    nb[move.from+1] = nb[move.from+3];
    nb[move.from+3] = null;
  } else if (move.castling === 'Q') {
    nb[move.from-1] = nb[move.from-4];
    nb[move.from-4] = null;
  }
  if (move.promotion) {
    nb[move.to] = { color: piece.color, type: move.promotion, id: piece.id + 'P' };
  }
  return nb;
}

function getLegalMovesForPiece(sqIdx, b) {
  const piece = b[sqIdx];
  if (!piece) return [];
  const raw = getRawMoves(sqIdx, b, enPassantTarget);
  return raw.filter(m => {
    const nb = applyMoveToBoard(m, b);
    return !isInCheck(piece.color, nb);
  }).map(m => {
    if (m.promotionPending && !m.promotion) m.promotion = 'Q';
    m.notation = buildNotation(m, b);
    return m;
  });
}

function getAllLegalMoves(color, b) {
  const moves = [];
  for (let i = 0; i < 64; i++) {
    if (b[i] && b[i].color === color) {
      moves.push(...getLegalMovesForPiece(i, b));
    }
  }
  return moves;
}

function buildNotation(move, b) {
  const piece = b[move.from];
  if (!piece) return '';
  let n = '';
  if (move.castling === 'K') return 'O-O';
  if (move.castling === 'Q') return 'O-O-O';
  if (piece.type !== 'P') n += piece.type;
  if (move.capture) {
    if (piece.type === 'P') n += FILES[colOf(move.from)];
    n += 'x';
  }
  n += FILES[colOf(move.to)] + (8 - rowOf(move.to));
  if (move.promotion) n += '=' + move.promotion;
  return n;
}

// ────────────────────────────────────────────────────────────
// GAME END
// ────────────────────────────────────────────────────────────
function endGame(winner, reason) {
  gameOver = true;
  clearInterval(timerInterval);
  clearInterval(playerTimerInterval);

  setTimeout(() => {
    if (reason === 'checkmate') {
      const wName = winner === 'w' ? 'Blue Force' : 'Dark Side';
      gameOverTitle.textContent = 'Checkmate!';
      gameOverMsg.textContent = `${wName} wins by checkmate!`;
    } else if (reason === 'stalemate') {
      gameOverTitle.textContent = 'Stalemate!';
      gameOverMsg.textContent = 'The game is a draw.';
    } else if (reason === 'timeout') {
      const wName = winner === 'w' ? 'Blue Force' : 'Dark Side';
      gameOverTitle.textContent = 'Time\'s Up!';
      gameOverMsg.textContent = `${wName} wins on time!`;
    }
    showModal(gameOverModal);
  }, 600);
}

function handleTimeOut() {
  const loser = currentTurn;
  const winner = loser === 'w' ? 'b' : 'w';
  updateStatus(`Time's up! ${winner === 'w' ? 'Blue' : 'Black'} wins!`);
  endGame(winner, 'timeout');
}

// ────────────────────────────────────────────────────────────
// UNDO
// ────────────────────────────────────────────────────────────
function undoMove() {
  if (animating || gameOver) return;
  const movesToUndo = gameMode === 'bot' ? 2 : 1;
  for (let i = 0; i < movesToUndo; i++) {
    if (moveHistory.length === 0) break;
    const move = moveHistory.pop();
    undoApply(move);
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
  }
  selectedSquare = null;
  possibleMoves = [];
  gameOver = false;
  renderBoard();
  updateStatus();
  updateMoveLog();
  updateCaptured();
  updateStats();
  updateEvalBar();
}

function undoApply(move) {
  const piece = board[move.to];

  // Restore captured piece
  if (move.capture) {
    const cap = move.enPassant ? move.enPassantCaptureIdx : move.to;
    // pop from captured list
    if (piece && piece.color === 'w') capturedByB.pop();
    else if (piece) capturedByW.pop();
    // restore to original square - simplified: re-place generic enemy piece
    if (move.capturedPiece) board[cap] = move.capturedPiece;
  }

  // Reverse promotion
  if (move.promotion) {
    board[move.from] = { color: piece.color, type: 'P', id: piece.id };
  } else {
    board[move.from] = piece;
  }
  board[move.to] = null;

  // Reverse castling
  if (move.castling === 'K') {
    board[move.from+3] = board[move.from+1];
    board[move.from+1] = null;
  } else if (move.castling === 'Q') {
    board[move.from-4] = board[move.from-1];
    board[move.from-1] = null;
  }

  gameStats.moves = Math.max(0, gameStats.moves - 1);
  if (move.capture) gameStats.captures = Math.max(0, gameStats.captures - 1);
}

// ────────────────────────────────────────────────────────────
// AI BOT – MINIMAX + ALPHA-BETA + ITERATIVE DEEPENING
// ────────────────────────────────────────────────────────────
function triggerBotMove() {
  botThinking.classList.add('visible');
  const delay = 300 + Math.random() * 400;
  setTimeout(() => {
    const move = getBotMove();
    botThinking.classList.remove('visible');
    if (move) {
      // Handle promotion auto-pick for bot
      if (move.promotionPending) move.promotion = 'Q';
      move.notation = buildNotation(move, board);
      // Store captured piece for undo
      if (move.capture) {
        const capIdx = move.enPassant ? move.enPassantCaptureIdx : move.to;
        move.capturedPiece = board[capIdx] ? { ...board[capIdx] } : null;
      }
      executeMove(move);
    }
  }, delay);
}

function getBotMove() {
  const depth = botDifficulty;
  let bestMove = null;
  let bestScore = -Infinity;

  const moves = getAllLegalMoves(botColor, board);
  if (moves.length === 0) return null;

  // Order moves for better pruning
  const ordered = orderMoves(moves, board);

  const maxThink = depth >= 5 ? 4000 : 2000;
  const startT = Date.now();

  for (const move of ordered) {
    if (Date.now() - startT > maxThink) break;
    const nb = applyMoveToBoard(move, board);
    if (move.promotionPending) move.promotion = 'Q';
    const score = minimax(nb, depth - 1, -Infinity, Infinity, false, startT, maxThink);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  // Add slight randomness at easy level
  if (botDifficulty === 1 && Math.random() < 0.35) {
    return ordered[Math.floor(Math.random() * Math.min(5, ordered.length))];
  }

  return bestMove;
}

function minimax(b, depth, alpha, beta, isMaximizing, startT, maxT) {
  if (Date.now() - startT > maxT) return evaluateBoard(b, botColor);
  if (depth === 0) return quiesce(b, alpha, beta, botColor);

  const color = isMaximizing ? botColor : (botColor === 'w' ? 'b' : 'w');
  const moves = getAllLegalMovesOnBoard(color, b);

  if (moves.length === 0) {
    if (isInCheck(color, b)) return isMaximizing ? -99999 : 99999;
    return 0; // stalemate
  }

  const ordered = orderMoves(moves, b);

  if (isMaximizing) {
    let best = -Infinity;
    for (const m of ordered) {
      if (m.promotionPending) m.promotion = 'Q';
      const nb = applyMoveToBoard(m, b);
      const score = minimax(nb, depth-1, alpha, beta, false, startT, maxT);
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of ordered) {
      if (m.promotionPending) m.promotion = 'Q';
      const nb = applyMoveToBoard(m, b);
      const score = minimax(nb, depth-1, alpha, beta, true, startT, maxT);
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function quiesce(b, alpha, beta, color) {
  const stand = evaluateBoard(b, color);
  if (stand >= beta) return beta;
  if (alpha < stand) alpha = stand;

  const moves = getAllLegalMovesOnBoard(color, b).filter(m => m.capture);
  for (const m of moves) {
    if (m.promotionPending) m.promotion = 'Q';
    const nb = applyMoveToBoard(m, b);
    const score = -quiesce(nb, -beta, -alpha, color === 'w' ? 'b' : 'w');
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function getAllLegalMovesOnBoard(color, b) {
  const moves = [];
  const savedCR = { ...castlingRights };
  const savedEP = enPassantTarget;
  for (let i = 0; i < 64; i++) {
    if (!b[i] || b[i].color !== color) continue;
    const raw = getRawMoves(i, b, enPassantTarget);
    for (const m of raw) {
      if (m.promotionPending) m.promotion = 'Q';
      const nb = applyMoveToBoard(m, b);
      if (!isInCheck(color, nb)) moves.push(m);
    }
  }
  castlingRights = savedCR;
  enPassantTarget = savedEP;
  return moves;
}

function orderMoves(moves, b) {
  return moves.slice().sort((a, b2) => {
    let sa = 0, sb2 = 0;
    // Captures first (MVV-LVA)
    if (a.capture && b[a.to]) sa += PIECE_VALUES[b[a.to].type] - (PIECE_VALUES[b[a.from] ? b[a.from].type : 'P'] / 10);
    if (b2.capture && b[b2.to]) sb2 += PIECE_VALUES[b[b2.to].type] - (PIECE_VALUES[b[b2.from] ? b[b2.from].type : 'P'] / 10);
    if (a.promotion) sa += 800;
    if (b2.promotion) sb2 += 800;
    if (a.castling) sa += 50;
    if (b2.castling) sb2 += 50;
    return sb2 - sa;
  });
}

// ────────────────────────────────────────────────────────────
// EVALUATION
// ────────────────────────────────────────────────────────────
function evaluateBoard(b, forColor) {
  let score = 0;
  for (let i = 0; i < 64; i++) {
    const p = b[i];
    if (!p) continue;
    const val = PIECE_VALUES[p.type];
    const pstIdx = p.color === 'w' ? i : (7 - Math.floor(i/8)) * 8 + (i % 8);
    const pst = PST[p.type] ? PST[p.type][pstIdx] : 0;
    const pieceScore = val + pst;
    if (p.color === forColor) score += pieceScore;
    else score -= pieceScore;
  }
  // Mobility bonus
  const myMoves = getAllLegalMovesOnBoard(forColor, b).length;
  const theirMoves = getAllLegalMovesOnBoard(forColor === 'w' ? 'b' : 'w', b).length;
  score += (myMoves - theirMoves) * 5;
  return score;
}

// ────────────────────────────────────────────────────────────
// PROMOTION FLOW
// ────────────────────────────────────────────────────────────
// Override executeMove to handle promotion dialog for human moves
const _origExecuteMove = executeMove;
window._executeMove = executeMove;

function executeMove(move, skipAnim) {
  if (!gameOver && move.promotionPending && !move.promotion &&
      (gameMode === '2player' || move.from < 64 /* always human check */)) {
    // It's a human promotion (bot sets .promotion before calling)
    const piece = board[move.from];
    if (piece && piece.color !== botColor) {
      animating = true;
      animatePieceMove(move, () => {
        promptPromotion(piece.color, (chosen) => {
          move.promotion = chosen;
          move.notation = buildNotation(move, board);
          if (move.capture && !move.capturedPiece) {
            const capIdx = move.enPassant ? move.enPassantCaptureIdx : move.to;
            move.capturedPiece = board[capIdx] ? { ...board[capIdx] } : null;
          }
          applyMove(move);
          animating = false;
          afterMove(move);
        });
      });
      return;
    }
  }
  // Store captured for undo
  if (move.capture && !move.capturedPiece) {
    const capIdx = move.enPassant ? move.enPassantCaptureIdx : move.to;
    move.capturedPiece = board[capIdx] ? { ...board[capIdx] } : null;
  }
  if (move.promotionPending && !move.promotion) move.promotion = 'Q';
  if (!move.notation) move.notation = buildNotation(move, board);

  if (!skipAnim) {
    animating = true;
    animatePieceMove(move, () => {
      animating = false;
      applyMove(move);
      afterMove(move);
    });
  } else {
    applyMove(move);
    afterMove(move);
  }
}

// ────────────────────────────────────────────────────────────
// MODAL HELPERS
// ────────────────────────────────────────────────────────────
function showModal(el) { el.classList.add('visible'); }
function hideModal(el) { el.classList.remove('visible'); }

// ────────────────────────────────────────────────────────────
// START
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
