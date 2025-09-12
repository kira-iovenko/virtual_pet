const size = 4; // 4x4 grid
const board = document.getElementById("board");
let tiles = [];

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
  }
}

// Add click events
board.addEventListener("click", e => {
  if (e.target.classList.contains("tile") &&
      !e.target.classList.contains("empty")) {
    moveTile(e.target);
  }
});

init();
