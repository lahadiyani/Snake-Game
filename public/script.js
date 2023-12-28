const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{
  x: 10,
  y: 10 
}];
let food = { 
  x: 5,
  y: 5 
};

let direction = 'right';
let gameRunning = false;

// Variabel untuk menyimpan posisi awal sentuhan
let touchStartX = 0;
let touchStartY = 0;

function drawSnake() {
  ctx.fillStyle = '#00F';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = '#F00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.y < 0 || head.x >= canvas.width / gridSize || head.y >= canvas.height / gridSize || checkCollision()) {
    endGame();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'right';
  generateFood();
}

function endGame() {
  gameRunning = false;
  hideKeypad();
  showPlayButton();
  resetGame(); // ini untuk mengatur ulang variabel saat game berakhir
}

function handleInput(event) {
  if (!gameRunning && event.key === 'Enter') {
    startGame();
  } else if (gameRunning) {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

function handleButtonPress(dir) {
  if (!gameRunning) {
    startGame();
  } else {
    direction = dir;
  }
}

function startGame() {
  gameRunning = true;
  hidePlayButton();
  showKeypad();
}

function showPlayButton() {
  const playButton = document.getElementById('playButton');
  playButton.style.display = 'block';
}

function hidePlayButton() {
  const playButton = document.getElementById('playButton');
  playButton.style.display = 'none';
}

function showKeypad() {
  const controls = document.getElementById('controls');
  controls.style.display = 'flex';
}

function hideKeypad() {
  const controls = document.getElementById('controls');
  controls.style.display = 'none';
}

function gameLoop() {
  if (gameRunning) {
    moveSnake();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
  }
}

document.addEventListener('keydown', handleInput);
document.getElementById('upButton').addEventListener('click', () => handleButtonPress('up'));
document.getElementById('leftButton').addEventListener('click', () => handleButtonPress('left'));
document.getElementById('downButton').addEventListener('click', () => handleButtonPress('down'));
document.getElementById('rightButton').addEventListener('click', () => handleButtonPress('right'));

generateFood();
setInterval(gameLoop, 1000 / 5);
