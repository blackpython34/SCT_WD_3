# Tic Tac Toe — Fresh Web App

Professional, accessible, and lightweight Tic Tac Toe implementation using plain HTML, CSS and JavaScript.

This project is intended as a compact example of a small web game with good UX, accessibility, and clear, testable game logic.

Table of contents

- [Demo](#demo)
- [Features](#features)
- [Quick start](#quick-start)
- [How to play](#how-to-play)
- [Architecture & implementation notes](#architecture--implementation-notes)
- [Developer workflow](#developer-workflow)
- [Tests](#tests)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

Demo
----

Open `index.html` in your browser or serve the folder using a static server (recommended for best behaviour):

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000
```

Features
--------

- Two play modes: Player vs Player (local) and Player vs Computer
- Three difficulty levels for the computer opponent:
	- Easy — random moves
	- Medium — simple heuristics (win/block/center/corner)
	- Hard — minimax algorithm (optimal play)
- Choose which symbol you (the human) play as (X or O)
- Persistent scoreboard using browser localStorage (X / O / Draws)
- Keyboard support: focus a cell and press Enter or Space to play
- Responsive layout and clear focus/hover states for accessibility

How to play
-----------

1. Choose a mode (PvP or PvC).
2. Optionally choose which symbol you want to play as (X or O).
3. Select difficulty (for PvC).
4. Click (or focus + Enter/Space) a cell to make a move. The game announces wins/draws and updates the scoreboard.

Project structure
-----------------

- `index.html` — main UI and control elements
- `styles.css` — responsive styling and visual polish
- `app.js` — game logic (state management, event handlers, AI, persistence)
- `README.md` — this file

Architecture & implementation notes
----------------------------------

- Game state is maintained as a simple 9-element array representing the board.
- Win detection uses the standard eight tic-tac-toe win combinations.
- AI:
	- Easy: picks a random empty square.
	- Medium: attempts to win on the next move, then block the opponent, then take center/corners.
	- Hard: uses minimax recursion to choose an optimal move (fine for 3x3 board performance-wise).
- Persistence: scoreboard and basic UI settings are stored in localStorage under keys `ttt:fresh:scores` and `ttt:fresh:settings`.

Developer workflow
------------------

Recommended environment: a modern browser and Node/Python for running a local static server.

1. Install dependencies (none required for this small app).
2. Run a static server from the project folder:

```bash
python3 -m http.server 8000
# or, if you prefer, use an npm static server like 'serve'
```

3. Open http://127.0.0.1:8000 in your browser. Edit files and refresh to see changes.

Running in development with live reload
-------------------------------------

If you prefer live-reload while editing, install a simple dev server, for example:

```bash
# optional: install 'live-server' for automatic reload during development
npm install -g live-server
live-server --port=8000
```

Testing
-------

This repository currently doesn't include automated tests, but the game logic is structured so you can add unit tests for:

- Win/draw detection (check all winning combos and draw states)
- Minimax correctness (ensure bestMove returns winning/blocking moves in simple positions)

To add tests you can use a test runner such as Jest or Mocha and export the core functions from `app.js` into a module for testing.

Accessibility
-------------

- All board cells are implemented as focusable buttons and support keyboard activation with Enter and Space.
- Status text uses `aria-live` to announce updates to assistive technologies.
- Color contrast and focus outlines are tuned for readability; if you need further enhancements (high-contrast mode, larger fonts), I can add them.

Troubleshooting
---------------

- If the scoreboard isn't saving: ensure your browser allows localStorage for the page (private/incognito modes sometimes block storage).
- If the page appears unstyled: confirm `styles.css` is reachable and not blocked by the browser.

Contributing
------------

Contributions are welcome. Suggested small tasks:

- Add unit tests for core game logic
- Add animations for winning lines
- Add an undo/redo feature or move history
- Improve AI (e.g., alpha-beta pruning or adjustable difficulty blending)

Please open an issue or a pull request with a clear description and small incremental changes.

License
-------

This project is provided under the MIT License (see LICENSE file if present). Use it freely for learning and small projects.

Contact
-------

If you need a specific feature, prefer a different UX, or want this packaged as a reusable component, tell me what you'd like and I can implement it.

