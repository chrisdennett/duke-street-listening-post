import { loadImage } from "./loadImage.js";

export class PhotoSlideshow {
  constructor({ width, height }) {
    this.photos = [];
    this.canvas = document.getElementById("photoCanvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "rgb(0,90,0)";
    this.ctx.fillRect(0, 0, width, height);
    this.currPhotoIndex = 0;
    this.isSetup = false;
  }

  async setup({ photoData, timings, duration }) {
    this.isSetup = false;
    this.ctx.fillStyle = "rgb(55,55,55)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.photos = [];
    for (let p of photoData) {
      const img = await loadImage(`./img/${p}`);
      this.photos.push(img);
    }

    if (!timings) {
      const totalPhotos = this.photos.length;
      this.timings = this.getDefaultTimings(totalPhotos, duration);
    } else {
      this.timings = timings;
    }

    this.currPhotoIndex = 0;
    this.ctx.drawImage(this.photos[this.currPhotoIndex], 0, 0);
    this.isSetup = true;
  }

  update(currTime, duration) {
    if (!this.isSetup) return;

    // at the start or end reset the current photo index
    if (currTime >= duration || currTime === 0) {
      this.currPhotoIndex = 0;
    } else {
      const showingLastPhoto = this.currPhotoIndex === this.photos.length - 1;
      const timeToChangePhoto = showingLastPhoto
        ? duration
        : this.timings[this.currPhotoIndex];

      if (currTime >= timeToChangePhoto) {
        this.currPhotoIndex++;
      }
    }

    this.ctx.drawImage(this.photos[this.currPhotoIndex], 0, 0);
  }

  getDefaultTimings(totalPhotos, duration) {
    const timings = [];
    const photoDuration = duration / totalPhotos;
    let timeToChangePhoto = photoDuration;
    for (let i = 0; i < totalPhotos; i++) {
      timings.push(timeToChangePhoto);
      timeToChangePhoto += photoDuration;
    }

    return timings;
  }
}
