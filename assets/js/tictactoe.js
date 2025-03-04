// Tic Tac Toe Script
document.addEventListener('DOMContentLoaded', function() {
    const board = document.querySelector('.tictactoe-board');
    const cells = document.querySelectorAll('[data-cell]');
    const gameStatus = document.querySelector('.game-status');
    const resetButton = document.querySelector('.reset-game');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6] // Diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (gameState[index] !== '' || !gameActive) return;

        // Play move
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        // Check win
        const winningCombo = checkWin();
        if (winningCombo) {
            celebrateWin(winningCombo);
            return;
        }

        // Check draw
        if (checkDraw()) {
            gameStatus.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }

    function checkWin() {
        return winningCombinations.find(combination => {
            return combination.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function celebrateWin(winningCombo) {
        gameActive = false;
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        gameStatus.classList.add('winner');

        // Highlight winning cells
        winningCombo.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        gameStatus.textContent = "Player X's turn";
        gameStatus.classList.remove('winner');

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    // Initialize game
    resetGame();
});