export class AudioVisualiser {
  constructor() {
    this.audio;
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.audioSource = null;
    this.dataArray;
    this.barWidth;
    this.x = 0;
    this.bufferLength;
    this.canvas = document.getElementById("audioVisCanvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.audioSourceList = [];
  }

  setAudio(audio, index) {
    if (!audio) return;

    this.audio = audio;

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
    this.barWidth = this.canvas.width / 2 / this.bufferLength;
  }

  play() {
    this.audio.play();
    this.animate();
  }

  animate() {
    this.x = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // copies the frequency data into the dataArray in place. Each item contains a number between 0 and 255
    this.analyser.getByteFrequencyData(this.dataArray);
    this.drawVisualizer();
    requestAnimationFrame(() => this.animate());
  }

  drawVisualizer = () => {
    let barHeight;
    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i]; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      this.ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      this.ctx.fillRect(
        this.canvas.width / 2 - this.x, // this will start the bars at the center of the canvas and move from right to left
        this.canvas.height - barHeight,
        this.barWidth,
        barHeight
      ); // draws the bar. the reason we're calculating Y weird here is because the canvas starts at the top left corner. So we need to start at the bottom left corner and draw the bars from there
      this.x += this.barWidth; // increases the x value by the width of the bar
    }

    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i]; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      this.ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      this.ctx.fillRect(
        this.x,
        this.canvas.height - barHeight,
        this.barWidth,
        barHeight
      ); // this will continue moving from left to right
      this.x += this.barWidth; // increases the x value by the width of the bar
    }
  };
}
