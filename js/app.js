import { AudioVisualiser } from "./audioVisualiser.js";
import { Lights } from "./lights.js";
import { loadJson } from "./loadJson.js";
import { ProgressBar } from "./progressBar.js";
import { setupScreen } from "./screen.js";

const trackTitle = document.getElementById("trackTitle");
const trackNum = document.getElementById("trackNum");

// Props
const settings = await loadJson("./settings.json");
let allTracks = [...settings.tracks];
let currentTrack = null;
const audioVis = new AudioVisualiser();
const progressBar = new ProgressBar();
const lights = new Lights({
  ...settings.lights,
  totalLights: allTracks.length,
});
lights.selectLight(-1, true);
setupScreen({ ...settings.screen });

// setup
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
  // console.log("currTime: ", currTime);
  // console.log("duration: ", duration);
  progressBar.update(currTime, duration);
}

/**
 let jsonStr = `{ "tracks":[`;
for (let i = 0; i < allTracks.length; i++) {
  const track = allTracks[i];

  jsonStr += `
  {
    "eventKey": "${track.key}",
    "index": ${i},
    "title": "${track.soundFile.split("_")[1].split(".")[0]}",
    "soundFile": "${track.soundFile}",
    "img": []
  },
  `;
}
jsonStr += `]}`;
console.log(jsonStr);
 * 
 */
