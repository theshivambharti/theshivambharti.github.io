// Minesweeper Script
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('minesweeper-board');
    const difficultySelect = document.getElementById('difficulty');
    const newGameButton = document.getElementById('new-game');
    const mineCountDisplay = document.querySelector('.mine-count');
    const timerDisplay = document.querySelector('.timer');

    let gameConfig = {
        beginner: { rows: 10, cols: 10, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 }
    };

    let cells = [];
    let mines = [];
    let gameActive = false;
    let flaggedCells = new Set();
    let revealedCells = new Set();
    let timer;
    let time = 0;

    function initializeGame() {
        const difficulty = difficultySelect.value;
        const config = gameConfig[difficulty];

        // Reset game state
        cells = [];
        mines = [];
        flaggedCells.clear();
        revealedCells.clear();
        gameActive = true;
        time = 0;
        clearInterval(timer);
        timerDisplay.textContent = '⏱️ 0';

        // Update mine count display
        mineCountDisplay.textContent = `💣 ${config.mines}`;

        // Create board
        board.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
        board.innerHTML = '';

        // Create cells
        for (let i = 0; i < config.rows; i++) {
            for (let j = 0; j < config.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'minesweeper-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                board.appendChild(cell);
                cells.push(cell);

                // Add event listeners
                cell.addEventListener('click', handleClick);
                cell.addEventListener('contextmenu', handleRightClick);
            }
        }

        // Place mines
        placeMines(config);

        // Start timer
        timer = setInterval(() => {
            if (gameActive) {
                time++;
                timerDisplay.textContent = `⏱️ ${time}`;
            }
        }, 1000);
    }

    function placeMines(config) {
        const totalCells = config.rows * config.cols;
        const minePositions = new Set();

        while (minePositions.size < config.mines) {
            const position = Math.floor(Math.random() * totalCells);
            minePositions.add(position);
        }

        mines = Array.from(minePositions);
    }

    function handleClick(e) {
        if (!gameActive) return;

        const cell = e.target;
        const index = cells.indexOf(cell);

        if (flaggedCells.has(index)) return;

        if (mines.includes(index)) {
            gameOver(false);
            return;
        }

        revealCell(index);
        checkWin();
    }

    function handleRightClick(e) {
        e.preventDefault();
        if (!gameActive) return;

        const cell = e.target;
        const index = cells.indexOf(cell);

        if (revealedCells.has(index)) return;

        if (flaggedCells.has(index)) {
            flaggedCells.delete(index);
            cell.textContent = '';
        } else {
            flaggedCells.add(index);
            cell.textContent = '🚩';
        }

        const config = gameConfig[difficultySelect.value];
        mineCountDisplay.textContent = `💣 ${config.mines - flaggedCells.size}`;
    }

    function revealCell(index) {
        if (revealedCells.has(index)) return;

        const cell = cells[index];
        const config = gameConfig[difficultySelect.value];
        const row = Math.floor(index / config.cols);
        const col = index % config.cols;

        revealedCells.add(index);
        cell.classList.add('revealed');

        const adjacentMines = countAdjacentMines(row, col, config);

        if (adjacentMines === 0) {
            // Reveal adjacent cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;

                    if (newRow >= 0 && newRow < config.rows &&
                        newCol >= 0 && newCol < config.cols) {
                        const newIndex = newRow * config.cols + newCol;
                        if (!revealedCells.has(newIndex) && !flaggedCells.has(newIndex)) {
                            revealCell(newIndex);
                        }
                    }
                }
            }
        } else {
            cell.textContent = adjacentMines;
            cell.dataset.number = adjacentMines;
        }
    }

    function countAdjacentMines(row, col, config) {
        let count = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;

                if (newRow >= 0 && newRow < config.rows &&
                    newCol >= 0 && newCol < config.cols) {
                    const index = newRow * config.cols + newCol;
                    if (mines.includes(index)) count++;
                }
            }
        }

        return count;
    }

    function gameOver(won) {
        gameActive = false;
        clearInterval(timer);

        // Reveal all mines
        mines.forEach(index => {
            const cell = cells[index];
            if (won) {
                if (!flaggedCells.has(index)) {
                    cell.textContent = '🚩';
                    flaggedCells.add(index);
                }
            } else {
                cell.textContent = '💣';
                if (!flaggedCells.has(index)) {
                    cell.classList.add('mine');
                }
            }
        });

        // Show incorrectly flagged cells
        flaggedCells.forEach(index => {
            if (!mines.includes(index)) {
                const cell = cells[index];
                cell.textContent = '❌';
                cell.classList.add('mine');
            }
        });

        // Update mine count display
        const config = gameConfig[difficultySelect.value];
        mineCountDisplay.textContent = `💣 ${config.mines - flaggedCells.size}`;

        // Show game result message with a delay
        setTimeout(() => {
            const message = won ?
                `Congratulations! You won in ${time} seconds!` :
                `Game Over! You lasted ${time} seconds.`;
            alert(message);
        }, 500);
    }

    function checkWin() {
        const config = gameConfig[difficultySelect.value];
        const totalCells = config.rows * config.cols;

        // Win condition: All non-mine cells are revealed
        if (revealedCells.size === totalCells - mines.length) {
            gameOver(true);
        }
    }

    // Event listeners
    newGameButton.addEventListener('click', initializeGame);
    difficultySelect.addEventListener('change', initializeGame);

    // Prevent context menu on right click
    board.addEventListener('contextmenu', e => e.preventDefault());

    // Initialize first game
    initializeGame();
});