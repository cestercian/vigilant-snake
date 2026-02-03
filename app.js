(function () {
  "use strict";

  const { createGame, setDirection, step, DIRECTIONS } = window.SnakeCore;

  const config = {
    cols: 20,
    rows: 20,
    cellSize: 24,
    tickMs: 140,
  };
  const boardWidth = config.cols * config.cellSize;
  const boardHeight = config.rows * config.cellSize;

  const colors = {
    background: "#0b0b0b",
    grid: "#1e1e1e",
    snake: "#7acb5c",
    head: "#a7e35a",
    food: "#e5534b",
  };

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const restartBtn = document.getElementById("restart");
  const dpad = document.querySelector(".dpad");

  let state = createGame({ cols: config.cols, rows: config.rows });
  let hasStarted = false;
  let isPaused = false;
  let lastTick = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = boardWidth * dpr;
    canvas.height = boardHeight * dpr;
    canvas.style.width = `${boardWidth}px`;
    canvas.style.height = `${boardHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetGame() {
    state = createGame({ cols: config.cols, rows: config.rows });
    hasStarted = false;
    isPaused = false;
    lastTick = 0;
    updateStatus();
  }

  function startGame() {
    if (state.gameOver) {
      resetGame();
    }
    hasStarted = true;
    isPaused = false;
    updateStatus();
  }

  function togglePause() {
    if (state.gameOver) {
      return;
    }
    if (!hasStarted) {
      startGame();
      return;
    }
    isPaused = !isPaused;
    updateStatus();
  }

  function updateStatus() {
    scoreEl.textContent = String(state.score);

    if (state.won) {
      statusEl.textContent = "You Win";
    } else if (state.gameOver) {
      statusEl.textContent = "Game Over";
    } else if (!hasStarted) {
      statusEl.textContent = "Ready";
    } else if (isPaused) {
      statusEl.textContent = "Paused";
    } else {
      statusEl.textContent = "Running";
    }

    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  }

  function handleDirection(direction) {
    if (!hasStarted) {
      startGame();
    }
    state = setDirection(state, direction);
  }

  function drawCell(position, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      position.x * config.cellSize,
      position.y * config.cellSize,
      config.cellSize,
      config.cellSize
    );
  }

  function drawGrid() {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    for (let x = 0; x <= config.cols; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * config.cellSize, 0);
      ctx.lineTo(x * config.cellSize, config.rows * config.cellSize);
      ctx.stroke();
    }

    for (let y = 0; y <= config.rows; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * config.cellSize);
      ctx.lineTo(config.cols * config.cellSize, y * config.cellSize);
      ctx.stroke();
    }
  }

  function render() {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, boardWidth, boardHeight);

    drawGrid();

    if (state.food) {
      drawCell(state.food, colors.food);
    }

    state.snake.forEach((segment, index) => {
      drawCell(segment, index === 0 ? colors.head : colors.snake);
    });
  }

  function tick(timestamp) {
    if (hasStarted && !isPaused && !state.gameOver) {
      if (!lastTick) {
        lastTick = timestamp;
      }
      while (timestamp - lastTick >= config.tickMs) {
        state = step(state);
        updateStatus();
        lastTick += config.tickMs;
      }
    }

    render();
    requestAnimationFrame(tick);
  }

  function handleKey(event) {
    const key = event.key.toLowerCase();
    let handled = true;

    switch (key) {
      case "arrowup":
      case "w":
        handleDirection(DIRECTIONS.UP);
        break;
      case "arrowdown":
      case "s":
        handleDirection(DIRECTIONS.DOWN);
        break;
      case "arrowleft":
      case "a":
        handleDirection(DIRECTIONS.LEFT);
        break;
      case "arrowright":
      case "d":
        handleDirection(DIRECTIONS.RIGHT);
        break;
      case " ":
        togglePause();
        break;
      case "enter":
        resetGame();
        startGame();
        break;
      default:
        handled = false;
        break;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  function handleDpad(event) {
    const button = event.target.closest("button[data-dir]");
    if (!button) {
      return;
    }
    const dir = button.getAttribute("data-dir");
    if (dir === "up") {
      handleDirection(DIRECTIONS.UP);
    } else if (dir === "down") {
      handleDirection(DIRECTIONS.DOWN);
    } else if (dir === "left") {
      handleDirection(DIRECTIONS.LEFT);
    } else if (dir === "right") {
      handleDirection(DIRECTIONS.RIGHT);
    }
  }

  startBtn.addEventListener("click", () => startGame());
  pauseBtn.addEventListener("click", () => togglePause());
  restartBtn.addEventListener("click", () => {
    resetGame();
    startGame();
  });
  dpad.addEventListener("click", handleDpad);
  window.addEventListener("keydown", handleKey);
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  updateStatus();
  requestAnimationFrame(tick);
})();
