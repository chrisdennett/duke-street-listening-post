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
    this.totalPhotos;
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
    this.totalPhotos = this.photos.length;

    if (!timings) {
      this.timings = this.getDefaultTimings(this.totalPhotos, duration);
    } else {
      this.timings = timings;
    }

    this.currPhotoIndex = 0;
    const thisImg = this.photos[this.currPhotoIndex];

    this.ctx.drawImage(thisImg, 0, 0);
    this.isSetup = true;
  }

  update(currTime, duration) {
    if (!this.isSetup) return;
    const showingLastPhoto = this.currPhotoIndex === this.photos.length - 1;

    // at the start or end reset the current photo index
    if (currTime >= duration || currTime === 0) {
      this.currPhotoIndex = 0;
    }

    const timeToChangePhoto = showingLastPhoto
      ? duration
      : this.timings[this.currPhotoIndex];

    if (currTime >= timeToChangePhoto) {
      this.currPhotoIndex++;
    }

    if(this.currPhotoIndex > this.photos.length - 1){
      this.currPhotoIndex = 0;
    }

    // grab from timings if provided
    const currImg = this.photos[this.currPhotoIndex];
    const nextImg =
      this.currPhotoIndex < this.photos.length - 1
        ? this.photos[this.currPhotoIndex + 1]
        : this.photos[0];

    let currImgOpacity = 1;
    let showNextImage = true;

    // if a second from next change point
    if (timeToChangePhoto - currTime < 1) {
      currImgOpacity = timeToChangePhoto - currTime;
      showNextImage = true;
    }

    // if a second from start fade in current image from black
    if (currTime < 1) {
      currImgOpacity = currTime;
      showNextImage = false;
    }

    // if a second from the end fade out current image
    if (duration - currTime < 1) {
      currImgOpacity = duration - currTime;
      showNextImage = false;
    }

    // zoom int the current image in a linear fashion up to a max zoom
    const maxScaleIncrease = 0.5;
    const currPhotoStart =
      this.currPhotoIndex === 0 ? 0 : this.timings[this.currPhotoIndex - 1];

    const zoomProgress = (currTime - currPhotoStart) / timeToChangePhoto;
    const currImgScale = 1 + maxScaleIncrease * zoomProgress;

    this.ctx.save();
    // start by clearing with black
    this.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the next image behind if needed
    if (showNextImage) {
      this.ctx.drawImage(nextImg, 0, 0);
    }

    try{

      this.ctx.globalAlpha = currImgOpacity;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(currImgScale, currImgScale);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      this.ctx.drawImage(currImg, 0, 0);
      this.ctx.restore();
    }
    catch(e){
      console.log('ERROR - cannot draw img: ', e);
      console.log('currImg: ', currImg);
      console.log('this.currPhotoIndex: ', this.currPhotoIndex)
    }
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
