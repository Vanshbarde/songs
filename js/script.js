// 🔥 GLOBAL SAFE PLAYLIST SETTER
window.setPlaylistAndPlay = function (playlist, index) {
  songs = playlist;
  currentSongIndex = index;
  loadSong();
  playSong();
};



if (!localStorage.getItem("userId")) {
  localStorage.setItem("userId", "1");
}

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nowPlaying = document.getElementById("nowPlaying");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const likeBtn = document.getElementById("likeBtn");
const playerThumbnail = document.getElementById("playerThumbnail");

const userId = Number(localStorage.getItem("userId")) || 1;

let songs = window.songs || [];
let currentSongIndex = 0;
let currentSongId = null;
let isPlaying = false;
let isLiked = false;

const audio = new Audio();

function formatDuration(seconds) {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}


/* 🚨 DO NOT RENDER SONG LIST ON LIKES PAGE */
const isLikesPage = document.body.classList.contains("likes-page");

/* ================= FETCH SONGS ================= */
if (!isLikesPage) {
  fetch("http://localhost:5000/api/songs")
    .then(res => res.json())
    .then(data => {
      songs = data;
      renderSongs();
    });
}

/* ================= RENDER SONGS ================= */
function renderSongs() {
  const container = document.querySelector(".song-list");
  if (!container) return;

  container.innerHTML = "";

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";

    card.innerHTML = `
<img src="http://localhost:5000${song.image_url}">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
    `;

    card.onclick = () => {
      currentSongIndex = index;
      loadSong();
      playSong();
    };

    container.appendChild(card);
  });
}

/* ================= LOAD SONG ================= */
function loadSong() {
  songs = window.songs || songs;
  const song = songs[currentSongIndex];
  if (!song) return;

  currentSongId = song.id;
  audio.src = `http://localhost:5000${song.audio_url}`;
  audio.currentTime = 0;

  // Play immediately
  audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.innerText = "⏸";
      playerThumbnail.classList.add("playing");

      // ✅ Store play after successful start
      fetch("http://localhost:5000/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          song_id: currentSongId
        })
      })
      .then(res => res.json())
      .then(() => console.log("✅ Play stored"))
      .catch(err => console.error("❌ Play not stored", err));
    })
    .catch(err => console.error("❌ Auto-play failed:", err));

  nowPlaying.innerHTML = `Now Playing: <strong>${song.title}</strong>`;
  playerThumbnail.src = `http://localhost:5000${song.image_url}`;

  durationEl.innerText = formatDuration(song.duration);

  likeBtn.innerText = "🤍";
  likeBtn.classList.remove("liked");
  isLiked = false;

  checkLikeStatus();
  checkIfLiked(song.id);
}




/* ================= PLAY / PAUSE ================= */
function playSong() {
  if (!currentSongId) return;

  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";
  playerThumbnail.classList.add("playing");

  fetch("http://localhost:5000/api/plays", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, song_id: currentSongId })
  })
  .then(res => res.json())
  .then(() => console.log("✅ Play stored"))
  .catch(err => console.error("❌ Play not stored", err));
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "▶";
  playerThumbnail.classList.remove("playing");
}


playBtn.onclick = () => {
  if (!audio.src) return;
  isPlaying ? pauseSong() : playSong();
};

/* ================= NEXT / PREV ================= */
nextBtn.onclick = () => {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong();
  playSong();
};

prevBtn.onclick = () => {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong();
  playSong();
};

/* ================= LIKE ================= */
likeBtn.onclick = async () => {
  if (!currentSongId) return;

  const res = await fetch("http://localhost:5000/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, songId: currentSongId })
  });

  const data = await res.json();
  isLiked = data.liked;

  likeBtn.innerText = isLiked ? "❤️" : "🤍";
};

/* ================= CHECK LIKE ================= */
async function checkLikeStatus() {
  const res = await fetch(
    `http://localhost:5000/api/likes/check?userId=${userId}&songId=${currentSongId}`
  );
  const data = await res.json();

  isLiked = data.liked;
  likeBtn.innerText = isLiked ? "❤️" : "🤍";
}


// ================= PROGRESS BAR & TIME =================
audio.addEventListener("timeupdate", () => {
  const current = Math.floor(audio.currentTime);
  const duration = Math.floor(audio.duration) || 0;

  currentTimeEl.innerText = formatDuration(current);
  progressBar.max = duration;
  progressBar.value = current;
});

// Seek functionality
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});


audio.addEventListener("ended", () => {
  nextBtn.onclick();
});
