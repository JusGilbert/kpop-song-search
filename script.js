const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const results = document.getElementById("results");
const artistBox = document.getElementById("artist-box");
const resetButton = document.getElementById("reset-button");
const featured = document.getElementById("featured");
const carousel = document.getElementById("carousel");



function resetSearch() {
  searchInput.value = "";
  results.innerHTML = "";
  artistBox.innerHTML = "";
  featured.hidden = false;
}

async function searchSongs() {
  const term = searchInput.value.trim();
  if (term === "") {
    resetSearch();
    return;
  }
  featured.hidden = true;

  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=10`,
  );
  const data = await response.json();
  if (data.results.length === 0) {
    artistBox.innerHTML = "";
    results.innerHTML =
      '<p class="message">No songs found. Try another artist!</p>';
    return;
  }

  const artist = data.results[0].artistName;
  artistBox.innerHTML = `
  <div class="artist-card">
    <h2>${artist}</h2>
    <a href="https://open.spotify.com/search/${encodeURIComponent(artist)}" target="_blank" rel="noopener noreferrer">Spotify</a>
    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(artist)}" target="_blank" rel="noopener noreferrer">YouTube</a>
  </div>
`;

  results.innerHTML = data.results
    .map(
      (song) => `
      <article class="song-card">
        <img src="${song.artworkUrl100}" alt="${song.trackName} cover" />
        <h2>${song.trackName}</h2>
        <p>${song.artistName}</p>
        <audio controls>
          <source src="${song.previewUrl}" type="audio/mpeg" />
        </audio>
      </article>
    `,
    )
    .join("");
}

resetButton.addEventListener("click", resetSearch);
searchButton.addEventListener("click", searchSongs);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchSongs();
  }
});

const featuredArtists = [
  "BTS",
  "BLACKPINK",
  "ILLIT",
  "NewJeans",
  "TWICE",
  "TOMORROW X TOGETHER",
  "Katseye",
  "Stray Kids",
];

async function loadCarousel() {
  const cards = await Promise.all(
    featuredArtists.map(async (name) => {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=song&limit=1`,
      );
      const data = await response.json();
      const art = data.results.length > 0
  ? data.results[0].artworkUrl100.replace("100x100", "400x400")
  : "";
      return `
        <button class="carousel-card" data-artist="${name}">
          <img src="${art}" alt="${name}" />
          <span>${name}</span>
        </button>
      `;
    }),
  );
  carousel.innerHTML = cards.join("");
}

carousel.addEventListener("click", (event) => {
  const card = event.target.closest(".carousel-card");
  if (!card) return;
  searchInput.value = card.dataset.artist;
  searchSongs();
});

loadCarousel();
