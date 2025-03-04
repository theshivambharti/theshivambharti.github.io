// Snake Game Script
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('snake-board');
    const scoreDisplay = document.querySelector('.score');
    const highScoreDisplay = document.querySelector('.high-score');
    const startButton = document.getElementById('start-snake');
    const pauseButton = document.getElementById('pause-snake');

    const GRID_SIZE = 20;
    const CELL_COUNT = GRID_SIZE * GRID_SIZE;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let direction = { x: 0, y: 0 };
    let lastDirection = { x: 0, y: 0 };
    let gameInterval;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let isPaused = false;
    let gameSpeed = 200;

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < CELL_COUNT; i++) {
            const cell = document.createElement('div');
            cell.className = 'snake-cell';
            board.appendChild(cell);
        }
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }

    // Update the game display
    function updateDisplay() {
        const cells = board.getElementsByClassName('snake-cell');
        // Clear the board
        Array.from(cells).forEach(cell => {
            cell.className = 'snake-cell';
        });

        // Draw snake
        snake.forEach((segment, index) => {
            const cellIndex = segment.y * GRID_SIZE + segment.x;
            if (cells[cellIndex]) {
                cells[cellIndex].classList.add('snake');
            }
        });

        // Draw food
        const foodIndex = food.y * GRID_SIZE + food.x;
        if (cells[foodIndex]) {
            cells[foodIndex].classList.add('food');
        }

        // Update score
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Generate new food position
    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        food = newFood;
    }

    // Check for collisions
    function checkCollision(position) {
        // Wall collision
        if (position.x < 0 || position.x >= GRID_SIZE ||
            position.y < 0 || position.y >= GRID_SIZE) {
            return true;
        }

        // Self collision - only check if snake length > 1
        return snake.length > 1 && snake.slice(1).some(segment =>
            segment.x === position.x && segment.y === position.y
        );
    }

    // Game loop
    function gameLoop() {
        if (isPaused) return;

        // Don't move if no direction is set
        if (direction.x === 0 && direction.y === 0) return;

        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // Check for collision
        if (checkCollision(newHead)) {
            gameOver();
            return;
        }

        // Add new head
        snake.unshift(newHead);

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreDisplay.textContent = `High Score: ${highScore}`;
            }
            generateFood();
            // Increase speed
            if (gameSpeed > 50) {
                gameSpeed -= 5;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            snake.pop();
        }

        lastDirection = {...direction };
        updateDisplay();
    }

    // Handle keyboard input
    function handleKeyPress(e) {
        if (isPaused && e.key !== 'p') return;

        let newDirection = {...direction };

        switch (e.key) {
            case 'ArrowUp':
                if (lastDirection.y !== 1) {
                    newDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (lastDirection.y !== -1) {
                    newDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (lastDirection.x !== 1) {
                    newDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (lastDirection.x !== -1) {
                    newDirection = { x: 1, y: 0 };
                }
                break;
            case 'p':
                togglePause();
                return;
        }

        // Only update direction if it changed
        if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
            direction = newDirection;
            if (!gameInterval) {
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        }
    }

    // Start game
    function startGame() {
        // Reset game state
        snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
        direction = { x: 0, y: 0 };
        lastDirection = { x: 0, y: 0 };
        score = 0;
        gameSpeed = 200;
        isPaused = false;

        // Clear previous interval
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }

        // Generate initial food
        generateFood();

        // Update button states
        startButton.textContent = 'Restart';
        pauseButton.disabled = false;

        // Update display
        updateDisplay();
    }

    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game Over! Score: ${score}`);
        pauseButton.disabled = true;
        startButton.textContent = 'Start Game';
    }

    // Toggle pause
    function togglePause() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    document.addEventListener('keydown', handleKeyPress);

    // Initialize the game
    initializeBoard();
    pauseButton.disabled = true;
});