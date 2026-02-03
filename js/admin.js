fetch("http://localhost:5000/api/admin/analytics")
  .then(res => res.json())
  .then(data => {
    document.getElementById("mostPlayed").innerText =
      `🔥 Most Played: ${data.mostPlayed.title}`;

    document.getElementById("mostLiked").innerText =
      `❤️ Most Liked: ${data.mostLiked.title}`;

    const table = document.getElementById("songsTable");

    data.allSongs.forEach(song => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${song.title}</td>
        <td>${song.play_count}</td>
        <td>${song.like_count}</td>
      `;
      table.appendChild(row);
    });
  });
