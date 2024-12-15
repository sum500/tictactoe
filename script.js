const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.querySelector('.restart');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

const checkWin = () => {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      drawWinningLine(a, b, c); // Pass the indices to draw the line
      statusText.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      return true;
    }
  }
  if (!gameState.includes('')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return false;
  }
  return false;
};

const drawWinningLine = (a, b, c) => {
  const startCell = cells[a].getBoundingClientRect();
  const endCell = cells[c].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  // Calculate the line's start and end positions relative to the board
  const startX = startCell.left + startCell.width / 2 - boardRect.left;
  const startY = startCell.top + startCell.height / 2 - boardRect.top;
  const endX = endCell.left + endCell.width / 2 - boardRect.left;
  const endY = endCell.top + endCell.height / 2 - boardRect.top;

  // Calculate the line's length and angle
  const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  // Create and style the line
  const line = document.createElement('div');
  line.classList.add('winning-line');
  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.top = `${startY}px`;
  line.style.left = `${startX}px`;

  board.appendChild(line);
};

const handleCellClick = (e) => {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (gameState[index] !== '' || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (!checkWin()) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
};

const restartGame = () => {
  currentPlayer = 'X';
  gameActive = true;
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusText.textContent = `Player X's turn`;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  // Remove any existing winning lines
  const winningLine = document.querySelector('.winning-line');
  if (winningLine) winningLine.remove();
};

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
