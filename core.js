(function (global) {
  "use strict";

  const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  };

  function isOpposite(a, b) {
    return a && b && a.x === -b.x && a.y === -b.y;
  }

  function positionsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function spawnFood(snake, rows, cols, rng) {
    const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
    const empty = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) {
          empty.push({ x, y });
        }
      }
    }
    if (empty.length === 0) {
      return null;
    }
    const index = Math.floor((rng || Math.random)() * empty.length);
    return empty[index];
  }

  function createGame(options) {
    const opts = options || {};
    const cols = typeof opts.cols === "number" ? opts.cols : 20;
    const rows = typeof opts.rows === "number" ? opts.rows : 20;
    const rng = opts.rng || Math.random;

    const startX = Math.max(2, Math.floor(cols / 2));
    const startY = Math.floor(rows / 2);
    const snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    const direction = DIRECTIONS.RIGHT;
    const food = spawnFood(snake, rows, cols, rng);

    return {
      cols,
      rows,
      rng,
      snake,
      direction,
      nextDirection: direction,
      food,
      score: 0,
      gameOver: false,
      won: false,
    };
  }

  function setDirection(state, direction) {
    if (!direction || state.gameOver) {
      return state;
    }
    if (state.snake.length > 1 && isOpposite(direction, state.direction)) {
      return state;
    }
    return {
      ...state,
      nextDirection: direction,
    };
  }

  function step(state) {
    if (state.gameOver) {
      return state;
    }

    let direction = state.nextDirection || state.direction;
    if (state.snake.length > 1 && isOpposite(direction, state.direction)) {
      direction = state.direction;
    }

    const head = state.snake[0];
    const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

    const outOfBounds =
      nextHead.x < 0 ||
      nextHead.x >= state.cols ||
      nextHead.y < 0 ||
      nextHead.y >= state.rows;

    if (outOfBounds) {
      return {
        ...state,
        direction,
        nextDirection: direction,
        gameOver: true,
      };
    }

    const eating = state.food && positionsEqual(nextHead, state.food);
    const bodyToCheck = eating ? state.snake : state.snake.slice(0, -1);
    const hitSelf = bodyToCheck.some((segment) => positionsEqual(segment, nextHead));

    if (hitSelf) {
      return {
        ...state,
        direction,
        nextDirection: direction,
        gameOver: true,
      };
    }

    const newSnake = [nextHead, ...state.snake];
    if (!eating) {
      newSnake.pop();
    }

    let score = state.score;
    let food = state.food;
    let won = state.won;
    let gameOver = state.gameOver;

    if (eating) {
      score += 1;
      food = spawnFood(newSnake, state.rows, state.cols, state.rng);
      if (!food) {
        won = true;
        gameOver = true;
      }
    }

    return {
      ...state,
      snake: newSnake,
      direction,
      nextDirection: direction,
      food,
      score,
      won,
      gameOver,
    };
  }

  const api = {
    DIRECTIONS,
    createGame,
    setDirection,
    step,
    spawnFood,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.SnakeCore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
