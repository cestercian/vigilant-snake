# Vigilant Snake

Classic Snake implemented with vanilla HTML, CSS, and JavaScript.

**Run**
- Open `index.html` directly in a browser.
- Or start a static server: `python3 -m http.server` then open `http://localhost:8000`.

**Controls**
- Arrow keys or WASD to move.
- Space to pause/resume.
- Enter to restart.
- On-screen buttons for touch devices.

**Tests**
- `node tests.js`

**Manual verification checklist**
- Start, pause/resume, and restart work.
- Keyboard and on-screen controls move the snake.
- Snake grows and score increments after eating food.
- Food never spawns on the snake.
- Game over triggers on wall collision and self collision.
- Winning state triggers when the board is full.
