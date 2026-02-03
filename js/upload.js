const form = document.getElementById("uploadForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch("http://localhost:5000/api/songs/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    statusText.style.color = "lightgreen";
    statusText.innerText = "✅ Song uploaded successfully!";
    console.log("🎵 Song uploaded:", data.song);

    form.reset();
  } catch (err) {
    statusText.style.color = "red";
    statusText.innerText = "❌ Song upload failed";
    console.error("Upload error:", err.message);
  }
});
