const setupDiv = document.getElementById("setup");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const startBtn = document.getElementById("startBtn");

const gameDiv = document.getElementById("game");
const score1Span = document.getElementById("score1");
const score2Span = document.getElementById("score2");
const score1Label = document.getElementById("score1Label");
const score2Label = document.getElementById("score2Label");
const overlay = document.getElementById("overlay");

let player1Name = "";
let player2Name = "";
let currentPlayer = 1;
let board = [];
let score1 = 0;
let score2 = 0;

const ROWS = 6;
const COLS = 7;

function initBoard() {
  board = [];
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      board[r][c] = null;
      document.getElementById(`cell-${r}-${c}`).classList.remove("red","yellow");
    }
  }
}

function validateInput() {
  const name1 = player1Input.value.trim();
  const name2 = player2Input.value.trim();

  const regex = /^[A-Za-z]{3,5}$/;
  let validName1 = regex.test(name1);
  let validName2 = regex.test(name2);

  if (!validName1) player1Input.classList.add("invalid");
  else player1Input.classList.remove("invalid");

  if (!validName2) player2Input.classList.add("invalid");
  else player2Input.classList.remove("invalid");

  if (validName1 && validName2) {
    if (name1.toLowerCase() === name2.toLowerCase()) {
      player1Input.classList.add("invalid");
      player2Input.classList.add("invalid");
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  } else {
    startBtn.disabled = true;
  }
}

player1Input.addEventListener("input", validateInput);
player2Input.addEventListener("input", validateInput);

startBtn.addEventListener("click", () => {
  player1Name = player1Input.value.trim();
  player2Name = player2Input.value.trim();

  alert(`The match can begin!\nPlayer 1: ${player1Name} (RED)\nPlayer 2: ${player2Name} (YELLOW)\n\nGOOD LUCK!`);

  score1Label.textContent = `${player1Name} (Red): `;
  score2Label.textContent = `${player2Name} (Yellow): `;
  score1Span.textContent = score1;
  score2Span.textContent = score2;

  setupDiv.style.display = "none";
  gameDiv.style.display = "flex";

  initBoard();
  currentPlayer = 1;
});

function dropPiece(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = currentPlayer;
      const cell = document.getElementById(`cell-${row}-${col}`);
      if (currentPlayer === 1) cell.classList.add("red");
      else cell.classList.add("yellow");

      if (checkWin(row,col,currentPlayer)) {
        showOverlay(`The winner is ${currentPlayer === 1 ? player1Name : player2Name}!`);
        if (currentPlayer === 1) {
          score1++;
          score1Span.textContent = score1;
        } else {
          score2++;
          score2Span.textContent = score2;
        }
        setTimeout(newGame, 2000);
      } else if (isBoardFull()) {
        showOverlay("Drawing!");
        setTimeout(newGame, 2000);
      } else {
        currentPlayer = (currentPlayer === 1 ? 2 : 1);
      }
      return;
    }
  }
}

function isBoardFull() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}

function checkWin(row,col,player) {
  let count = 0;
  for (let c = 0; c < COLS; c++) {
    if (board[row][c] === player) {
      count++;
      if (count === 4) return true;
    } else count = 0;
  }

  count = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][col] === player) {
      count++;
      if (count === 4) return true;
    } else count = 0;
  }

  let startR = row, startC = col;
  while (startR > 0 && startC > 0) {startR--; startC--;}
  count = 0;
  while (startR < ROWS && startC < COLS) {
    if (board[startR][startC] === player) {
      count++;
      if (count === 4) return true;
    } else count = 0;
    startR++; startC++;
  }

  startR = row; startC = col;
  while (startR < ROWS-1 && startC > 0) {startR++; startC--;}
  count = 0;
  while (startR >= 0 && startC < COLS) {
    if (board[startR][startC] === player) {
      count++;
      if (count === 4) return true;
    } else count = 0;
    startR--; startC++;
  }
  return false;
}

function showOverlay(msg) {
  overlay.textContent = msg;
  overlay.classList.add("show");
}

function hideOverlay() {
  overlay.classList.remove("show");
  overlay.textContent = "";
}

function newGame() {
  hideOverlay();
  initBoard();
  currentPlayer = 1;
}

document.addEventListener("keydown", (e) => {
  if (gameDiv.style.display !== "none") {
    const key = e.key;
    if (key >= '1' && key <= '7') {
      dropPiece(parseInt(key) - 1);
    }
  }
});
