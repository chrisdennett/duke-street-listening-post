import { AudioVisualiser } from "./audioVisualiser.js";
import { Lights } from "./lights.js";
import { loadJson } from "./loadJson.js";
import { PhotoSlideshow } from "./photoSlideshow.js";
import { ProgressBar } from "./progressBar.js";
import { setupScreen, updateScreen } from "./screen.js";

const trackTitle = document.getElementById("trackTitle");
const trackNum = document.getElementById("trackNum");
const instructions = document.getElementById("instructions");

let savedVolume = parseFloat(localStorage.getItem("volume"));
if (!savedVolume) {
  savedVolume = 1;
}
console.log("savedVolume: ", savedVolume);

// Props / objects
let settings = await loadJson("./settings.json");
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
  track.audio.volume = savedVolume;
});
instructions.style.display = "inherit";

// keyboard listeners
document.addEventListener("keydown", (e) => {
  if (e.shiftKey) {
    if (e.key === "ArrowLeft") {
      settings.lights.x--;
      lights.update(settings.lights);
    }
    if (e.key === "ArrowRight") {
      settings.lights.x++;
      lights.update(settings.lights);
    }
    if (e.key === "ArrowUp") {
      settings.lights.y--;
      lights.update(settings.lights);
    }
    if (e.key === "ArrowDown") {
      settings.lights.y++;
      lights.update(settings.lights);
    }
  } else {
    if (e.key === "v") {
      // volume up
      savedVolume += 0.01;
      if (savedVolume > 1) {
        savedVolume = 1;
      }
      allTracks.forEach((track) => {
        track.audio.volume = savedVolume;
      });
      localStorage.setItem("volume", savedVolume);
    }
    if (e.key === "b") {
      // volume down
      // volume up
      savedVolume -= 0.01;
      if (savedVolume <= 0) {
        savedVolume = 0.001;
      }
      allTracks.forEach((track) => {
        track.audio.volume = savedVolume;
      });
      localStorage.setItem("volume", savedVolume);
    }
    if (e.key === "[") {
      settings.screen.width--;
      updateScreen(settings.screen);
    }
    if (e.key === "]") {
      settings.screen.width++;
      updateScreen(settings.screen);
    }
    if (e.key === ";") {
      settings.screen.height--;
      updateScreen(settings.screen);
    }
    if (e.key === "'") {
      settings.screen.height++;
      updateScreen(settings.screen);
    }
    if (e.key === "ArrowLeft") {
      settings.screen.x--;
      updateScreen(settings.screen);
    }
    if (e.key === "ArrowRight") {
      settings.screen.x++;
      updateScreen(settings.screen);
    }
    if (e.key === "ArrowUp") {
      settings.screen.y--;
      updateScreen(settings.screen);
    }
    if (e.key === "ArrowDown") {
      settings.screen.y++;
      updateScreen(settings.screen);
    }
  }

  const track = allTracks.find((t) => e.key === t.eventKey);
  if (track) {
    selectTrack(track);
    instructions.style.display = "none";
  } else if (e.key === "d") {
    if (currentTrack) {
      currentTrack.audio.pause();
      currentTrack = null;
      lights.selectLight(-1, true);
      instructions.style.display = "inherit";
    }
  } else if (e.key === "s") {
    saveCurrentSettings(settings);
  } else {
    console.log("e.key: ", e.key);
  }
});

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

function saveCurrentSettings(settings) {
  // const settings = { presets: paintingPresets };

  // save to file
  var a = document.createElement("a");
  var file = new Blob([JSON.stringify(settings, null, 2)], {
    type: "text/plain",
  });
  a.href = URL.createObjectURL(file);
  a.download = "settings.json";
  a.click();
}
