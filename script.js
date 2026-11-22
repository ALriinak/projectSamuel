const audio = document.querySelector("#audio");
const list = document.querySelector("#trackList");
const playBtn = document.querySelector("#playBtn");
const seek = document.querySelector("#seek");
const volume = document.querySelector("#volume");
const search = document.querySelector("#search");
const nowTitle = document.querySelector("#nowTitle");
const nowArtist = document.querySelector("#nowArtist");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
let tracks = [];
let currentIndex = -1;
let filteredTracks = [];

const formatTime = seconds => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

async function loadLibrary() {
  try {
    const response = await fetch("playlist.json");
    if (!response.ok) throw new Error("Could not load playlist");
    tracks = await response.json();
    if (!Array.isArray(tracks)) throw new Error("playlist.json must contain a list");
    filteredTracks = tracks.map((track, index) => ({...track, originalIndex:index}));
    renderTracks();
  } catch (error) {
    list.innerHTML = '<div class="empty-state"><span class="empty-emblem">♬</span><h3>The archives could not be opened</h3><p>Check that playlist.json exists in the same folder as index.html.</p></div>';
  }
}

function renderTracks() {
  if (!filteredTracks.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-emblem">♬</span><h3>${tracks.length ? "No matching songs" : "The shelves await their songs"}</h3><p>${tracks.length ? "Try another search, good traveler." : "No recordings have been added to the archives yet. Add your MP3 or WAV files and list them in playlist.json."}</p></div>`;
    return;
  }
  list.innerHTML = filteredTracks.map((track, visibleIndex) => `
    <button class="track-row ${track.originalIndex === currentIndex ? "active" : ""}" data-index="${track.originalIndex}" aria-label="Play ${escapeHTML(track.title || "untitled")}">
      <span class="track-number">${String(visibleIndex + 1).padStart(2,"0")}</span>
      <span><span class="track-title">${escapeHTML(track.title || "Untitled recording")}</span><span class="track-sub">${escapeHTML(track.artist || "MIDIMAN")} ${track.album ? "· " + escapeHTML(track.album) : ""}</span></span>
      <span class="track-duration">${track.duration || "♫"}</span><span class="track-play">${track.originalIndex === currentIndex && !audio.paused ? "Ⅱ" : "▶"}</span>
    </button>`).join("");
  list.querySelectorAll(".track-row").forEach(row => row.addEventListener("click", () => playTrack(Number(row.dataset.index))));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentIndex = index;
  const track = tracks[index];
  audio.src = track.file;
  audio.load();
  audio.play().then(() => { playBtn.textContent = "Ⅱ"; renderTracks(); }).catch(() => {
    nowTitle.textContent = track.title || "Untitled recording";
    nowArtist.textContent = "Could not play this file — check its path in playlist.json";
    renderTracks();
  });
  nowTitle.textContent = track.title || "Untitled recording";
  nowArtist.textContent = [track.artist || "MIDIMAN", track.album].filter(Boolean).join(" · ");
  renderTracks();
}
function togglePlayback() {
  if (currentIndex === -1) { if (tracks.length) playTrack(0); return; }
  if (audio.paused) audio.play().then(() => {playBtn.textContent="Ⅱ";renderTracks();}).catch(()=>{});
  else { audio.pause(); playBtn.textContent="▶"; renderTracks(); }
}
function nextTrack(step) {
  if (!tracks.length) return;
  const next = currentIndex < 0 ? 0 : (currentIndex + step + tracks.length) % tracks.length;
  playTrack(next);
}
playBtn.addEventListener("click", togglePlayback);
document.querySelector("#prevBtn").addEventListener("click", () => nextTrack(-1));
document.querySelector("#nextBtn").addEventListener("click", () => nextTrack(1));
volume.addEventListener("input", () => audio.volume = Number(volume.value));
audio.volume = Number(volume.value);
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration)) {
    duration.textContent = formatTime(audio.duration);
    seek.value = Math.round(audio.currentTime / audio.duration * 1000) || 0;
  }
});
audio.addEventListener("loadedmetadata", () => duration.textContent = formatTime(audio.duration));
audio.addEventListener("play", () => { playBtn.textContent = "Ⅱ"; renderTracks(); });
audio.addEventListener("pause", () => { playBtn.textContent = "▶"; renderTracks(); });
audio.addEventListener("ended", () => nextTrack(1));
seek.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value) / 1000 * audio.duration;
});
search.addEventListener("input", () => {
  const query = search.value.toLowerCase().trim();
  filteredTracks = tracks.map((track,index)=>({...track,originalIndex:index})).filter(track =>
    [track.title,track.artist,track.album].join(" ").toLowerCase().includes(query));
  renderTracks();
});
document.querySelector("#year").textContent = new Date().getFullYear();
loadLibrary();
