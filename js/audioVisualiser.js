export class AudioVisualiser {
  constructor() {
    this.audio;
    this.audioCtx = null;
    this.analyser = null;
    this.audioSource = null;
    this.dataArray;
    this.barWidth;
    this.x = 0;
    this.bufferLength;
    this.canvas = document.getElementById("audioVisCanvas");
    this.canvas.width = 64;
    this.canvas.height = 40;
    this.barWidth = 2;
    this.ctx = this.canvas.getContext("2d");
    this.audioSourceList = [];
    // this.graphStartX = 0;
    this.animationRef = null;
    this.callback = null;
  }

  setAudio(audio, index) {
    if (!audio) return;

    this.audio = audio;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
    }

    // create an audio node from the audio source
    if (!this.audioSourceList[index]) {
      this.audioSourceList[index] =
        this.audioCtx.createMediaElementSource(audio);
    }

    // analyser = audioCtx.createAnalyser();
    // connect the audio source to the analyser. Now this analyser can explore and analyses the audio data for time and frequency
    this.audioSourceList[index].connect(this.analyser);
    // connect the analyser to the destination. This is the speakers
    this.analyser.connect(this.audioCtx.destination);
    // control the size of the FFT. The FFT is a fast fourier transform. Basically the number of sound samples. Will be used to draw bars
    this.analyser.fftSize = 32;
    // the number of data values that dictate the number of bars in the canvas. Always exactly one half of the fft size
    this.bufferLength = this.analyser.frequencyBinCount;
    // covert to unsigned 8-bit integer array format because that's the format we need
    this.dataArray = new Uint8Array(this.bufferLength);

    // the width of each bar in the canvas
    //this.canvas.width / 2 / this.bufferLength;
    // this.graphStartX = 0;
  }

  play(callback) {
    this.callback = callback;
    this.audio.play();
    if (this.animationRef) {
      cancelAnimationFrame(this.animationRef);
    }
    this.callback(0, this.audio.duration);
    this.animate();
  }

  animate() {
    this.x = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // copies the frequency data into the dataArray in place. Each item contains a number between 0 and 255
    this.analyser.getByteFrequencyData(this.dataArray);
    this.drawVisualizer();

    this.callback(this.audio.currentTime, this.audio.duration);

    this.animationRef = requestAnimationFrame(() => this.animate());
  }

  drawVisualizer = () => {
    let barHeight;
    const maxBarHeight = this.canvas.height;

    for (let i = 0; i < this.bufferLength; i++) {
      const barFrac = this.dataArray[i] / 255; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      barHeight = barFrac * maxBarHeight; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar

      const barX = this.bufferLength * this.barWidth;
      //   const barX = this.graphStartX + this.bufferLength * this.barWidth;

      this.ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
      this.ctx.fillRect(
        barX - this.x, // this will start the bars at the center of the canvas and move from right to left: ;
        this.canvas.height - barHeight,
        this.barWidth,
        barHeight
      ); // draws the bar. the reason we're calculating Y weird here is because the canvas starts at the top left corner. So we need to start at the bottom left corner and draw the bars from there
      this.x += this.barWidth; // increases the x value by the width of the bar
    }

    for (let i = 0; i < this.bufferLength; i++) {
      const barFrac = this.dataArray[i] / 255;
      barHeight = barFrac * maxBarHeight;

      const barX = this.x;
      //   const barX = this.graphStartX + this.x;

      this.ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
      this.ctx.fillRect(
        barX,
        this.canvas.height - barHeight,
        this.barWidth,
        barHeight
      ); // this will continue moving from left to right
      this.x += this.barWidth; // increases the x value by the width of the bar
    }
  };
}
