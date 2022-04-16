class Overlay {
  constructor() {
    var videoElement = document.getElementById("main-video");
    videoElement.addEventListener("loadedmetadata", () => {
      let vidWidth = videoElement.videoHeight;
      let vidHeight = videoElement.videoWidth;
      this.GenerateTrackPad(vidWidth, vidHeight);
    });

    this.data = [
      [10, 20, 30, 40, 50, 60],
      [20, 30, 40, 50, 60, 70],
    ];
  }
  GenerateTrackPad(w, h) {
    let indentation = 50;
    let overlay = document.createElement("div");

    overlay.classList.add("overlay");
    overlay.style.top = indentation;
    overlay.style.height = h - indentation * 2;

    document.getElementById("video-player").appendChild(overlay);
  }
  GenerateDotField() {
    console.log(w);
    console.log(h);
  }
}
function generateOverlay() {
  let Overlayer = new Overlay();
}
