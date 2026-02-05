const uploadForm = document.getElementById("uploadForm");
const statusEl = document.getElementById("status");

// ✅ Ensure userId is set
const userId = Number(localStorage.getItem("userId")) || 1;

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  // Append userId if needed in backend
  formData.append("userId", userId);

  statusEl.innerText = "Uploading... ⏳";

  try {
    const res = await fetch("http://localhost:5000/api/songs/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      statusEl.innerText = `✅ Song "${data.title}" uploaded successfully!`;

      // 🔹 Add the new song to the global playlist
      if (window.songs) {
        window.songs.push(data);
      } else {
        window.songs = [data];
      }

      // 🔹 Automatically play the newly uploaded song
      if (typeof loadSong === "function") {
        loadSong(data, window.songs.length - 1, window.songs);
      }

      // Reset the form
      uploadForm.reset();
    } else {
      statusEl.innerText = `❌ Upload failed: ${data.error || "Unknown error"}`;
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    statusEl.innerText = `❌ Upload error: ${err.message}`;
  }
});




const selectedGenresEl = document.getElementById("selectedGenres");
const dropdown = document.getElementById("genreDropdown");
const genreInput = document.getElementById("genreInput");

let selectedGenres = [];

// Toggle dropdown
selectedGenresEl.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Add genre
dropdown.querySelectorAll("div").forEach(item => {
  item.addEventListener("click", () => {
    const value = item.dataset.value;

    if (!selectedGenres.includes(value)) {
      selectedGenres.push(value);
      renderGenres();
    }
  });
});

// Render selected genres
function renderGenres() {
  selectedGenresEl.innerHTML = "";

  selectedGenres.forEach(genre => {
    const pill = document.createElement("div");
    pill.className = "genre-pill";
    pill.innerHTML = `${genre} <span>×</span>`;

    pill.querySelector("span").onclick = () => {
      selectedGenres = selectedGenres.filter(g => g !== genre);
      renderGenres();
    };

    selectedGenresEl.appendChild(pill);
  });

  if (!selectedGenres.length) {
    selectedGenresEl.innerHTML =
      `<span class="placeholder">Select genres</span>`;
  }

  genreInput.value = selectedGenres.join(", ");
}

// Close dropdown when clicking outside
document.addEventListener("click", e => {
  if (!e.target.closest(".genre-select")) {
    dropdown.style.display = "none";
  }
});

