export class ProgressBar {
  constructor() {
    this.canvas = document.getElementById("progressCanvas");
    this.timeText = document.getElementById("timeText");
    this.canvas.width = 240;
    this.canvas.height = 40;
    this.ctx = this.canvas.getContext("2d");
  }

  update(currTime, duration) {
    const barWidth = (currTime / duration) * this.canvas.width;

    const secondsRemaining = Math.floor(duration - currTime);

    const mins = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining - mins * 60;
    let minText = mins;
    let secondsText = seconds;

    if (mins < 10) {
      minText = "0" + mins;
    }
    if (seconds < 10) {
      secondsText = "0" + seconds;
    }

    this.timeText.innerHTML = minText + ":" + secondsText;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, barWidth, this.canvas.height);
  }
}
