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
      <img src="${song.image_url}">
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

  renderSongs(filtered);
});
card.onclick = () => {
  currentSongId = song.id;
  audio.src = song.audio_url;
  nowPlaying.innerHTML = `Now Playing: <strong>${song.title}</strong>`;
  playerThumbnail.src = song.image_url;
  playSong();
};
