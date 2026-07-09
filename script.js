/* ============================================================
   Where does it go?  —  tile + search interactivity
   Tapping a tile (or searching) reveals the answer by flooding
   the answer card with the matching bin's color.
   ============================================================ */

const answer       = document.getElementById("answer");
const answerStream = document.getElementById("answer-stream");
const answerReason = document.getElementById("answer-reason");
const tiles        = document.querySelectorAll(".tile");
const searchInput  = document.getElementById("search-input");
const searchBtn    = document.getElementById("search-btn");

const STREAMS = ["recycle", "compost", "garbage"];
const LABELS  = { recycle: "Recycle", compost: "Compost", garbage: "Garbage" };

/* Reveal an answer: swap the color, set the text, highlight the tile. */
function reveal(stream, reason, tileEl) {
  answer.classList.remove(...STREAMS);
  answer.classList.add(stream);
  answerStream.textContent = LABELS[stream];
  answerReason.textContent = reason;

  tiles.forEach((t) => t.classList.remove("is-selected"));
  if (tileEl) tileEl.classList.add("is-selected");

  answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* Wire up every tile. */
tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    reveal(tile.dataset.stream, tile.dataset.reason, tile);
  });
});

/* Basic search fallback over the common items.
   (This is a simple text match for now — the full fuzzy search
   over the complete catalog is a later step.) */
const items = Array.from(tiles).map((t) => ({
  name: t.dataset.name.toLowerCase(),
  stream: t.dataset.stream,
  reason: t.dataset.reason,
}));

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;

  const hit = items.find((it) => it.name.includes(q) || q.includes(it.name));

  if (hit) {
    reveal(hit.stream, hit.reason, null);
  } else {
    reveal(
      "garbage",
      "Not sure about this one \u2014 when in doubt it goes in garbage. Check Seattle Public Utilities for the exact rule.",
      null
    );
  }
}

searchBtn.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});