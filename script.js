class AnaliticVideoPlayer {
  constructor() {
    //load videoPlayer (works like holder for all elements)
    this.videoPlayer = document.getElementById("video-player");
    this.videoPlayer.style.position = "relative";

    //video
    this.video = document.getElementById("main-video");

    var videoElement = this.video;
    videoElement.addEventListener("loadedmetadata", () => {
      this.vidWidth = videoElement.videoWidth;
      this.vidHeight = videoElement.videoHeight;
      this.vidDuration = videoElement.duration * 1000;

      this.canvas = this.prepareCanvas(this.vidWidth, this.vidHeight);

      this.curveHandler = this.loadAnaliticGenerator(
        this.canvas,
        this.vidWidth,
        this.vidHeight
      );
    });

    //start animation on start
    this.video.addEventListener("play", () => {
      this.intervalAnimation = setInterval(() => {
        this.curveHandler.animate(this.video.currentTime * 1000);
      }, 1);
    });
    //pause animation on pause
    this.video.addEventListener("pause", () => {
      clearInterval(this.intervalAnimation);
    });
  }
  /**
   * Canvas setup and loading to screen
   * @param {*} width
   * @param {*} height
   */
  prepareCanvas(width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 999;
    canvas.style.pointerEvents = "none";
    canvas.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    this.videoPlayer.appendChild(canvas);
    return canvas;
  }

  loadAnaliticGenerator(canvas) {
    let data = [
      [0, 20, 10, 70, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20],
      [15, 21, 60, 40, 50, 30, 50, 100, 70, 30, 40, 60, 80, 90],
      [12, 13, 15, 25, 46, 40, 50, 60, 71, 68, 10, 20, 40, 80],
    ];
    let curveHandler = new curveAnaliticGenerator(
      canvas,
      data,
      this.vidDuration
    );
    return curveHandler;
  }
}

let playerHandler = new AnaliticVideoPlayer();
