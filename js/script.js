const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nowPlaying = document.getElementById("nowPlaying");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const likeBtn = document.getElementById("likeBtn");
const playerThumbnail = document.getElementById("playerThumbnail");

const userId = localStorage.getItem("userId") || 1; // TEMP user
let songs = [];
let currentSongIndex = 0;
let currentSongId = null;
let isPlaying = false;
let isLiked = false;

const audio = new Audio();

/* ================= FETCH SONGS ================= */
fetch("http://localhost:5000/api/songs")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs();
  });

/* ================= RENDER SONGS ================= */
function renderSongs() {
  const container = document.querySelector(".song-list");
  container.innerHTML = "";

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";

    card.innerHTML = `
      <img src="${song.image_url}">
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
  const song = songs[currentSongIndex];
  if (!song) return;

  currentSongId = song.id;

  audio.src = song.audio_url;
  nowPlaying.innerHTML = `Now Playing: <strong>${song.title}</strong>`;
  playerThumbnail.src = song.image_url;

  // reset like UI first
  likeBtn.innerText = "🤍";
  likeBtn.classList.remove("liked");
  isLiked = false;

  // sync with DB
  checkLikeStatus();
}

/* ================= PLAY / PAUSE ================= */
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";
  playerThumbnail.classList.add("playing");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "▶";
  playerThumbnail.classList.remove("playing");
}

playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  isPlaying ? pauseSong() : playSong();
});

/* ================= NEXT / PREV ================= */
nextBtn.addEventListener("click", () => {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong();
  playSong();
});

prevBtn.addEventListener("click", () => {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong();
  playSong();
});

/* ================= PROGRESS ================= */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.innerText = formatTime(audio.currentTime);
  durationEl.innerText = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

/* ================= LIKE SONG ================= */
likeBtn.addEventListener("click", async () => {
  if (!currentSongId) return;

  try {
    const res = await fetch("http://localhost:5000/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, songId: currentSongId })
    });

    const data = await res.json();
    isLiked = data.liked;

    if (isLiked) {
      likeBtn.innerText = "❤️";
      likeBtn.classList.add("liked");
    } else {
      likeBtn.innerText = "🤍";
      likeBtn.classList.remove("liked");
    }

  } catch (err) {
    console.error("Like error:", err);
  }
});

/* ================= CHECK LIKE STATUS ================= */
async function checkLikeStatus() {
  if (!currentSongId) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/likes/check?userId=${userId}&songId=${currentSongId}`
    );
    const data = await res.json();
    isLiked = data.liked;

    if (isLiked) {
      likeBtn.innerText = "❤️";
      likeBtn.classList.add("liked");
    } else {
      likeBtn.innerText = "🤍";
      likeBtn.classList.remove("liked");
    }

  } catch (err) {
    console.error("Check like error:", err);
  }
}
