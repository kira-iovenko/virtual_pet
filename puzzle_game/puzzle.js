const size = 4; // 4x4 grid
const board = document.getElementById("board");
let tiles = [];
let isShuffling = false;

// Create tiles
function init() {
  tiles = [];
  board.innerHTML = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.index = index;

      if (index === size * size - 1) {
        tile.classList.add("empty");
      } else {
        tile.style.backgroundPosition =
          `-${col * 100}px -${row * 100}px`;
      }

      board.appendChild(tile);
      tiles.push(tile);
    }
  }
}

// Swap tile with empty if adjacent
function moveTile(tile) {
  const emptyTile = tiles.find(t => t.classList.contains("empty"));
  const emptyIndex = Array.from(board.children).indexOf(emptyTile);
  const tileIndex = Array.from(board.children).indexOf(tile);

  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;
  const tileRow = Math.floor(tileIndex / size);
  const tileCol = tileIndex % size;

  const isAdjacent =
    (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
    (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);

  if (isAdjacent) {
    // Swap them in the DOM
    const emptyClone = emptyTile.cloneNode(true);
    const tileClone = tile.cloneNode(true);

    board.replaceChild(tileClone, emptyTile);
    board.replaceChild(emptyClone, tile);

    // Re-hook event listener on the cloned tile
    tileClone.addEventListener("click", () => moveTile(tileClone));

    // Update tiles array
    tiles = Array.from(board.children);

    // Check win after every move
    if (!isShuffling && checkSolved()) {
      setTimeout(() => alert("🎉 Puzzle Solved!"), 100);
    }

  }
}

// --- Instant Shuffle (solvable random state) ---
function instantShuffle(times = 200) {
  isShuffling = true;
  for (let i = 0; i < times; i++) {
    const emptyTile = tiles.find(t => t.classList.contains("empty"));
    const emptyIndex = Array.from(board.children).indexOf(emptyTile);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    // Collect adjacent tiles
    const neighbors = tiles.filter((tile, idx) => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
      );
    });

    // Pick a random neighbor and move it
    const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
    moveTile(randomTile);
  }
  isShuffling = false;
}

// --- Animated Shuffle (step-by-step) ---
function animatedShuffle(times = 50, speed = 100) {
  isShuffling = true;
  let moves = 0;

  function doMove() {
    if (moves >= times) {
      isShuffling = false;
      return;
    }
    const emptyTile = tiles.find(t => t.classList.contains("empty"));
    const emptyIndex = Array.from(board.children).indexOf(emptyTile);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const neighbors = tiles.filter((tile, idx) => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
      );
    });

    const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
    moveTile(randomTile);

    moves++;
    setTimeout(doMove, speed);
  }

  doMove();
}

// --- Hook up buttons ---
document.getElementById("animatedShuffleBtn")
  .addEventListener("click", () => animatedShuffle(50, 100));

document.getElementById("instantShuffleBtn")
  .addEventListener("click", () => instantShuffle(100));

// Check if puzzle is solved
function checkSolved() {
  for (let i = 0; i < tiles.length; i++) {
    if (parseInt(tiles[i].dataset.index) !== i) {
      return false;
    }
  }
  return true;
}

// Add click events
board.addEventListener("click", e => {
  if (e.target.classList.contains("tile") &&
      !e.target.classList.contains("empty")) {
    moveTile(e.target);
  }
});

// Initialize and shuffle on load
init();
shuffle();