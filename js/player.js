const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const playerThumbnail = document.getElementById("playerThumbnail");

// Update progress bar & current time
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent;

  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);
  currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Total duration
  const durMinutes = Math.floor(audio.duration / 60);
  const durSeconds = Math.floor(audio.duration % 60);
  durationEl.textContent = `${durMinutes}:${durSeconds.toString().padStart(2, "0")}`;
});

// Seek functionality
progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Rotate thumbnail on play/pause
audio.addEventListener("play", () => playerThumbnail.classList.add("playing"));
audio.addEventListener("pause", () => playerThumbnail.classList.remove("playing"));
audio.addEventListener("ended", () => playerThumbnail.classList.remove("playing"));
