export class Lights {
  constructor({ x, y, totalLights, spacing, size, bottomLightSpacing }) {
    this.totalLights = totalLights;
    this.spacing = spacing;
    this.bottomLightSpacing = bottomLightSpacing;
    this.size = size;
    this.canvas = document.getElementById("lightsCanvas");
    this.canvas.width = 200;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.style.left = `${x}px`;
    this.canvas.style.top = `${y}px`;

    this.currentIndex;
    this.selectBottomLight;
  }

  update({ x, y, spacing, size, bottomLightSpacing }) {
    this.canvas.style.left = `${x}px`;
    this.canvas.style.top = `${y}px`;
    this.spacing = spacing;
    this.size = size;
    this.bottomLightSpacing = bottomLightSpacing;

    this.selectLight(this.currentIndex, this.selectBottomLight);
  }

  selectLight(index, selectBottomLight) {
    this.currentIndex = index;
    this.selectBottomLight = selectBottomLight;

    this.ctx.fillStyle = "white";

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let yPos = index * (this.size + this.spacing);
    if (selectBottomLight) {
      yPos =
        this.totalLights * (this.size + this.spacing) + this.bottomLightSpacing;
    }

    this.ctx.fillRect(0, yPos, this.size, this.size);
  }

  selectAll() {
    for (let i = 0; i < this.totalLights; i++) {
      this.ctx.fillRect(
        0,
        i * (this.size + this.spacing),
        this.size,
        this.size
      );
    }
  }
}
