import { ScreenEffect } from "./ScreenEffect.js";

let screen;

export function setupScreen({ x, y, width, height }) {
  //
  // Video effect
  //
  const config = {
    effects: {
      roll: {
        enabled: false,
        // options: {
        //   speed: 1000,
        // },
      },
      image: {
        enabled: false,
        // options: {
        //   src: "./img/pass-s-ad.JPG",
        //   blur: 1.2,
        // },
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
      wobbley: { enabled: false },
      snow: {
        enabled: true,
        options: {
          opacity: 0.2,
        },
      },
    },
  };
  screen = new ScreenEffect("#screen", {});

  for (const prop in config.effects) {
    if (!!config.effects[prop].enabled) {
      screen.add(prop, config.effects[prop].options);
    }
  }

  screen.nodes.container.style.left = `${x}px`;
  screen.nodes.container.style.top = `${y}px`;
  screen.nodes.container.style.width = `${width}px`;
  screen.nodes.container.style.height = `${height}px`;
}

export function updateScreen({ x, y, width, height }) {
  screen.nodes.container.style.left = `${x}px`;
  screen.nodes.container.style.top = `${y}px`;
  screen.nodes.container.style.width = `${width}px`;
  screen.nodes.container.style.height = `${height}px`;
}
