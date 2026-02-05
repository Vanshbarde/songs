const userId = Number(localStorage.getItem("userId")) || 1;
const container = document.querySelector(".song-list");
const searchInput = document.getElementById("searchInput");

let likedSongs = [];

// 🔹 FETCH LIKED SONGS
async function fetchLikedSongs() {
  try {
    const res = await fetch(`http://localhost:5000/api/likes/user/${userId}`);
    const songs = await res.json();
    likedSongs = songs;
    renderSongs(likedSongs);
  } catch (err) {
    console.error("❌ Failed to fetch liked songs:", err);
  }
}

// 🔹 RENDER SONGS
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

    card.onclick = () => {
      window.setPlaylistAndPlay(songs, index);
    };

    container.appendChild(card);
  });
}

// 🔹 SEARCH
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = likedSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(value) ||
      song.artist.toLowerCase().includes(value)
  );
  renderSongs(filtered);
});

// 🔹 REFRESH WHEN LIKE/UNLIKE
window.addEventListener("likeToggled", () => {
  fetchLikedSongs();
});

// 🔹 INITIAL FETCH
fetchLikedSongs();
