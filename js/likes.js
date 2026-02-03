const userId = localStorage.getItem("userId") || 1;
const container = document.querySelector(".song-list");
const searchInput = document.getElementById("searchInput");

let likedSongs = [];

/* ================= FETCH LIKED SONGS ================= */
fetch(`http://localhost:5000/api/likes/user/${userId}`)
  .then(res => res.json())
  .then(songs => {
    likedSongs = songs;
    renderSongs(likedSongs);
  });

/* ================= RENDER ================= */
function renderSongs(songs) {
  container.innerHTML = "";

  if (songs.length === 0) {
    container.innerHTML = "<p>No liked songs ❤️</p>";
    return;
  }

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";

    card.innerHTML = `
      <img src="${song.image_url}">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
    `;

    // ✅ CONNECT TO GLOBAL PLAYER
    card.addEventListener("click", () => {
      // override global playlist
      window.songs = songs;
      window.currentSongIndex = index;

      loadSong();
      playSong();
    });

    container.appendChild(card);
  });
}

/* ================= SEARCH ================= */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = likedSongs.filter(song =>
    song.title.toLowerCase().includes(value) ||
    song.artist.toLowerCase().includes(value)
  );

  renderSongs(filtered);
});
