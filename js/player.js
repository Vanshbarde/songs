const audio = document.getElementById("audio");
const titleEl = document.getElementById("playerTitle");
const artistEl = document.getElementById("playerArtist");
const imageEl = document.getElementById("playerImage");

let playlist = [];
let currentIndex = 0;
let isPlaying = false;

/* LOAD SONG */
function loadSong(song, index, list) {
  playlist = list;
  currentIndex = index;

  titleEl.innerText = song.title;
  artistEl.innerText = song.artist;
  imageEl.src = song.image_url;
  audio.src = song.audio_url;

  audio.play();
  isPlaying = true;
}

/* PLAY / PAUSE */
function togglePlay() {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
}

/* NEXT */
function nextSong() {
  if (!playlist.length) return;

  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(playlist[currentIndex], currentIndex, playlist);
}

/* PREVIOUS */
function prevSong() {
  if (!playlist.length) return;

  currentIndex =
    (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(playlist[currentIndex], currentIndex, playlist);
}
