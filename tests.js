const assert = require("assert");
const { createGame, step, setDirection, spawnFood, DIRECTIONS } = require("./core");

function rngFrom(values) {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

(function testMovement() {
  let state = createGame({ cols: 10, rows: 10, rng: rngFrom([0]) });
  const head = state.snake[0];
  state = step(state);
  assert.deepStrictEqual(state.snake[0], { x: head.x + 1, y: head.y });
})();

(function testGrowth() {
  let state = createGame({ cols: 10, rows: 10, rng: rngFrom([0]) });
  const head = state.snake[0];
  state = { ...state, food: { x: head.x + 1, y: head.y } };
  state = step(state);
  assert.strictEqual(state.snake.length, 4);
  assert.strictEqual(state.score, 1);
})();

(function testWallCollision() {
  let state = createGame({ cols: 4, rows: 4, rng: rngFrom([0]) });
  state = {
    ...state,
    snake: [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ],
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
  };
  state = step(state);
  assert.strictEqual(state.gameOver, true);
})();

(function testSelfCollision() {
  let state = createGame({ cols: 6, rows: 6, rng: rngFrom([0]) });
  state = {
    ...state,
    snake: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ],
    direction: DIRECTIONS.DOWN,
    nextDirection: DIRECTIONS.DOWN,
  };
  state = step(state);
  assert.strictEqual(state.gameOver, true);
})();

(function testFoodPlacement() {
  const food = spawnFood([{ x: 0, y: 0 }], 2, 2, rngFrom([0]));
  assert.deepStrictEqual(food, { x: 1, y: 0 });
})();

(function testDirectionLock() {
  let state = createGame({ cols: 10, rows: 10, rng: rngFrom([0]) });
  state = setDirection(state, DIRECTIONS.LEFT);
  state = step(state);
  assert.deepStrictEqual(state.direction, DIRECTIONS.RIGHT);
})();

console.log("All tests passed.");
