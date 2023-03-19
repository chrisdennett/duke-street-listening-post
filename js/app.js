import { AudioVisualiser } from "./audioVisualiser.js";
import { Lights } from "./lights.js";
import { loadJson } from "./loadJson.js";
import { PhotoSlideshow } from "./photoSlideshow.js";
import { ProgressBar } from "./progressBar.js";
import { setupScreen } from "./screen.js";

const trackTitle = document.getElementById("trackTitle");
const trackNum = document.getElementById("trackNum");

// Props / objects
const settings = await loadJson("./settings.json");
let allTracks = [...settings.tracks];
let currentTrack = null;
const audioVis = new AudioVisualiser();
const progressBar = new ProgressBar();
const photoSlideshow = new PhotoSlideshow({ ...settings.screen });

const lights = new Lights({
  ...settings.lights,
  totalLights: allTracks.length,
});

// setup
lights.selectLight(-1, true);
setupScreen({ ...settings.screen });
allTracks.forEach((track) => {
  track.audio = new Audio(`./audio/${track.soundFile}`);
});

// keyboard listeners
document.addEventListener("keydown", (e) => {
  const track = allTracks.find((t) => e.key === t.eventKey);
  if (track) {
    selectTrack(track);
  } else if (e.key === "c") {
    if (currentTrack) {
      currentTrack.audio.pause();
      currentTrack = null;
      lights.selectLight(-1, true);
    }
  }
});
1;

function selectTrack(selectedTrack) {
  if (currentTrack && currentTrack.index === selectedTrack.index) return;

  if (currentTrack) {
    currentTrack.audio.pause();
  }

  photoSlideshow.setup({
    photoData: selectedTrack.img,
    duration: selectedTrack.audio.duration,
  });

  selectedTrack.audio.loop = true;
  selectedTrack.audio.currentTime = 0;
  trackNum.innerHTML = selectedTrack.index + 1;
  trackTitle.innerHTML = selectedTrack.title;

  lights.selectLight(selectedTrack.index);
  audioVis.setAudio(selectedTrack.audio, selectedTrack.index);
  audioVis.play(onAnimationStep);

  currentTrack = selectedTrack;
}

function onAnimationStep(currTime, duration) {
  progressBar.update(currTime, duration);
  photoSlideshow.update(currTime, duration);
}
