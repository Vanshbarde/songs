const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nowPlaying = document.getElementById("nowPlaying");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const likeBtn = document.getElementById("likeBtn");

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

const audio = new Audio();


// ================= FETCH SONGS =================
fetch("http://localhost:5000/api/songs")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs();
  })
  .catch(err => console.error("Fetch error:", err));


// ================= RENDER SONGS =================
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


// ================= LOAD SONG =================

const playerThumbnail = document.getElementById("playerThumbnail");

function loadSong() {
  const song = songs[currentSongIndex];
  if (!song) return;

  audio.src = song.audio_url;
  nowPlaying.innerHTML = `Now Playing: <strong>${song.title}</strong>`;

  if (playerThumbnail) {
    playerThumbnail.src = song.image_url;
  }
}


// ================= PLAY / PAUSE =================
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";

  if (playerThumbnail) {
    playerThumbnail.classList.add("playing");
  }
}


function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "▶";

  if (playerThumbnail) {
    playerThumbnail.classList.remove("playing");
  }
}


playBtn.addEventListener("click", () => {
  if (!audio.src) {
    loadSong();
    playSong();
    return;
  }
  isPlaying ? pauseSong() : playSong();
});

audio.addEventListener("ended", () => {
  if (playerThumbnail) {
    playerThumbnail.classList.remove("playing");
  }
  nextBtn.click();
});


// ================= NEXT / PREVIOUS =================
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong();
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong();
  playSong();
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});


// ================= PROGRESS BAR =================
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
  if (!time) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}


// ================= LIKE BUTTON (UI ONLY FOR NOW) =================
let liked = false;

if (likeBtn) {
  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likeBtn.innerText = liked ? "❤️" : "🤍";
  });
}
 