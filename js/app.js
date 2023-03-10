import { audioData } from "./audioData.js";

// Props
let allTracks = [...audioData.tracks];
let currentTrack = null;

// setup
allTracks.forEach((track) => {
  track.audio = new Audio(`./audio/${track.soundFile}`);
});

// keyboard listeners
document.addEventListener("keydown", (e) => {
  const track = allTracks.find((t) => e.key === t.key);
  if (track) {
    selectTrack(track);
  } else if (e.key === "c") {
    if (currentTrack) {
      currentTrack.audio.pause();
      currentTrack = null;
    }
  }
});

function selectTrack(selectedTrack) {
  if (currentTrack && currentTrack.index === selectedTrack.index) return;

  if (currentTrack) {
    currentTrack.audio.pause();
  }

  selectedTrack.audio.loop = true;
  selectedTrack.audio.currentTime = 0;
  selectedTrack.audio.play();

  currentTrack = selectedTrack;
}
