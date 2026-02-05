function formatDuration(seconds) {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

fetch("http://localhost:5000/api/admin/analytics")
  .then(res => res.json())
  .then(data => {
    document.getElementById("mostPlayed").innerText =
      `🔥 Most Played: ${data.mostPlayed?.title || "N/A"}`;

    document.getElementById("mostLiked").innerText =
      `❤️ Most Liked: ${data.mostLiked?.title || "N/A"}`;

    const table = document.getElementById("songsTable");
    table.innerHTML = "";

    data.allSongs.forEach(song => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${song.title}</td>
        <td>${song.play_count}</td>
        <td>${song.like_count}</td>
        <td>${formatDuration(song.duration)}</td>
       <td>${Math.floor(song.duration / 60)}:${song.duration % 60}</td>


      `;
      table.appendChild(row);
    });
  })
  .catch(err => console.error("Analytics error:", err));
