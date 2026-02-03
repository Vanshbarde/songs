const userId = localStorage.getItem("userId");

fetch(`http://localhost:5000/api/likes/user/${userId}`)
  .then(res => res.json())
  .then(songs => {
    const container = document.querySelector(".song-list");
    container.innerHTML = "";

    if (songs.length === 0) {
      container.innerHTML = "<p>No liked songs yet ❤️</p>";
      return;
    }

    songs.forEach(song => {
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.image_url}">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      `;

      container.appendChild(card);
    });
  });
