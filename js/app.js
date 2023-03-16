import { audioData } from "./audioData.js";
import { ScreenEffect } from "./ScreenEffect.js";

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

//
// Video effect
//
const config = {
  effects: {
    roll: {
      enabled: false,
      options: {
        speed: 1000,
      },
    },
    image: {
      enabled: true,
      options: {
        src: "./img/pass-s-ad.JPG",
        blur: 1.2,
      },
    },
    vignette: { enabled: true },
    scanlines: { enabled: true },
    vcr: {
      enabled: true,
      options: {
        opacity: 1,
        miny: 220,
        miny2: 220,
        num: 70,
        fps: 60,
      },
    },
    wobbley: { enabled: true },
    snow: {
      enabled: true,
      options: {
        opacity: 0.1,
      },
    },
  },
};

const screen = new ScreenEffect("#screen", {});

for (const prop in config.effects) {
  if (!!config.effects[prop].enabled) {
    screen.add(prop, config.effects[prop].options);
  }
}
