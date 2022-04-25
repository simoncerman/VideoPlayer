class AnaliticVideoPlayer {
  constructor(data, colors) {
    //load videoPlayer (works like holder for all elements)
    this.videoPlayer = document.getElementById("video-player");
    this.videoPlayer.style.position = "relative";

    this.canvasHolder = document.createElement("div");
    this.data = data;
    this.colors = colors;
    this.dotRadius = 10;

    //video
    this.video = document.getElementById("main-video");

    var videoElement = this.video;
    videoElement.addEventListener("loadedmetadata", () => {
      this.vidWidth = videoElement.videoWidth;
      this.vidHeight = videoElement.videoHeight;
      this.vidDuration = videoElement.duration * 1000;
      this.vidStopTime = 0;

      //prepare canvas
      this.canvas = this.prepareCanvas(this.vidWidth, this.vidHeight);

      //prepare canvasHandler
      this.curveHandler = this.loadAnaliticGenerator(
        this.canvas,
        this.vidWidth,
        this.vidHeight
      );
      /*
      for (let o = 0; o < 60000; o++) {
        let actualPosition = this.curveHandler.animate(o);
        this.updateDots(actualPosition);
      }*/
    });
    //prepare dots
    this.dots = [];
    this.prepareDots(data, colors);

    //start animation on start
    this.video.addEventListener("play", () => {
      if (this.video.currentTime < this.vidStopTime) {
        clearCanvasAfter(); //TODO
      }
      this.intervalAnimation = setInterval(() => {
        let actualPosition = this.curveHandler.animate(
          this.video.currentTime * 1000
        );
        this.updateDots(actualPosition);
      }, 1);
    });
    //pause animation on pause
    this.video.addEventListener("pause", () => {
      clearInterval(this.intervalAnimation);
      this.vidStopTime = this.video.currentTime;
    });
  }
  /**
   * Prepare moving dots
   * @param {*} data
   * @param {*} colors
   */
  prepareDots(data, colors) {
    let count = data.length;
    for (let y = 0; y < count; y++) {
      let dot = document.createElement("span");
      dot.classList.add("dot");
      dot.id = "dot" + y;
      dot.style.left = 0;
      dot.style.top = 0;

      dot.style.width = this.dotRadius * 2 + "px";
      dot.style.height = this.dotRadius * 2 + "px";

      dot.style.backgroundColor = colors[y];
      this.dots[y] = dot;
      this.canvasHolder.appendChild(dot);
    }
  }
  updateDots(actualPosition) {
    for (let i = 0; i < this.dots.length; i++) {
      let dot = this.dots[i];
      dot.style.left = actualPosition[i].x - this.dotRadius + "px";
      dot.style.top = actualPosition[i].y - this.dotRadius + "px";
    }
  }
  /**
   * Canvas setup and loading to screen
   * @param {*} width
   * @param {*} height
   */
  prepareCanvas(width, height, padding = 0) {
    let canvas = document.createElement("canvas");

    //holder for canvas
    this.canvasHolder.classList.add("canvas-holder");
    this.canvasHolder.style.width = width + "px";
    this.canvasHolder.style.height = height + "px";

    canvas.width = width - 2 * padding;
    canvas.height = height - 2 * padding;
    canvas.style.width = width - 2 * padding;
    canvas.style.height = height - 2 * padding;
    canvas.style.position = "relative";
    canvas.style.zIndex = 999;
    canvas.style.pointerEvents = "none";
    canvas.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    this.canvasHolder.appendChild(canvas);

    this.videoPlayer.appendChild(this.canvasHolder);
    return canvas;
  }
  /**
   * Prepare curve handler
   * @param {*} canvas
   * @returns object of curveAnaliticGenerator class
   */
  loadAnaliticGenerator(canvas) {
    let curveHandler = new curveAnaliticGenerator(
      canvas,
      this.data,
      this.vidDuration,
      this.colors
    );
    return curveHandler;
  }
}

let colors = ["green", "red", "blue", "yellow"];
/*let data = [
  [0, 20, 10, 70, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20],
  [15, 21, 60, 40, 50, 30, 50, 100, 70, 30, 40, 60, 80, 90],
  [12, 13, 15, 25, 46, 40, 50, 60, 71, 68, 10, 20, 40, 80],
  [5, 6, 7, 8, 9, 10, 11, 15, 17, 19, 20, 21, 17, 13],
];*/
let data = [
  [10, 10, 10],
  [10, 50, 10],
];
let playerHandler = new AnaliticVideoPlayer(data, colors);
