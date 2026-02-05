
console.log("🔥 search.js loaded");


const searchInput = document.getElementById("searchInput");
const songContainer = document.getElementById("allSongs");

let allSongs = [];

/* ========== FETCH ALL SONGS ========== */
fetch("http://localhost:5000/api/songs")
  .then(res => res.json())
  .then(data => {
    allSongs = data;
    renderSongs(allSongs);
  });

/* ========== RENDER SONGS ========== */
function renderSongs(songs) {
  songContainer.innerHTML = "";

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";

    card.innerHTML = `
      <img src="http://localhost:5000${song.image_url}">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
    `;

    card.addEventListener("click", () => {
      loadSong(song, index, songs);
    });

    songContainer.appendChild(card);
  });
}

/* ========== SEARCH FILTER ========== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allSongs.filter(song =>
    song.title.toLowerCase().includes(value) ||
    song.artist.toLowerCase().includes(value)
  );

  console.log("Search value:", value);
  console.log("All songs:", allSongs.map(s => s.title));
  console.log("Filtered:", filtered.map(s => s.title));

  renderSongs(filtered);
});


