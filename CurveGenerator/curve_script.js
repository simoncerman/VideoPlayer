class curveAnaliticGenerator {
  constructor(canvas, data, timeToRender, colors) {
    //loading canvas things
    this.canvasDraw = canvas.getContext("2d");

    //padding for canvas
    this.canvasPadding = canvas.width * 0.05;

    //main data for function of program
    this.canvasWidth = canvas.width - this.canvasPadding * 2;
    this.canvasHeight = canvas.height;

    this.data = data;
    this.colors = colors;

    //draw full grid
    this.drawPercentGrid(this.canvasDraw, this.canvasWidth, this.canvasHeight);

    //full render time in ms
    this.timeToRender = timeToRender;
    // smooth index of curves
    this.smoothIndex = 100; //50 ideal
    //actual time
    this.time = new Date().getTime();
    //saving starting time for later use
    this.startTime = this.time;
    this.stopTime;
  }
  /**
   * Generate canvas grid for percents
   * @param {*} canvasDraw
   * @param {*} width width of canvas
   * @param {*} height height of canvas
   */
  drawPercentGrid(canvasDraw, width, height) {
    canvasDraw.lineWidth = 0.1;
    canvasDraw.beginPath();
    for (let i = 0; i < 11; i++) {
      canvasDraw.moveTo(20, (height / 10) * i + this.canvasPadding);
      canvasDraw.font = "15px Arial";
      canvasDraw.fillText(
        100 - i * 10 + "%",
        10,
        (height / 10) * i + this.canvasPadding
      );
      canvasDraw.lineTo(width, (height / 10) * i + this.canvasPadding);
    }
    canvasDraw.stroke();
    canvasDraw.lineWidth = 1;
  }
  /**
   * Function will calculate point between points
   * @param {*} x0 Starting point X
   * @param {*} y0 Starting point Y
   * @param {*} x1 Ending point X
   * @param {*} y1 Ending point Y
   * @returns
   */
  betweenPointCalculate(x0, y0, x1, y1) {
    return [x1 - (x1 - x0) / 2, (y1 - y0) / 2 + y0];
  }
  /**
   * Calculate middle value of two values
   * @param {*} x0 Starting point
   * @param {*} x1 Ending point
   */
  middleValueCalculate(x0, x1) {
    return x1 - (x1 - x0) / 2;
  }
  /**
   * calculate next position of dot
   * depends on four points / two main / two controls
   * and t value
   * @param {*} points [p0, p1, p2, p3]
   * @param {*} t
   */
  moveOnBezierCurve(points, t) {
    let [p0, p1, p2, p3] = points;
    //Calculate the coefficients based on where the ball currently is in the animation
    let cx = 3 * (p1.x - p0.x);
    let bx = 3 * (p2.x - p1.x) - cx;
    let ax = p3.x - p0.x - cx - bx;

    let cy = 3 * (p1.y - p0.y);
    let by = 3 * (p2.y - p1.y) - cy;
    let ay = p3.y - p0.y - cy - by;

    //Calculate new X & Y positions of dot
    let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
    let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

    //return new position
    return { x: xt, y: yt };
  }

  /**
   * Helper function for drawing data into output view
   */
  updateValues() {
    let valueNames = ["data1", "data2", "data3"];
    for (let i = 0; i < 3; i++) {
      document.getElementById(valueNames[i]).innerHTML =
        Math.round(values[i] * 100) + "%";
    }
  }
  generateStaticCurveLine() {
    let data = this.data;
    let canvasHeight = this.canvasHeight;
    let canvasWidth = this.canvasWidth;
    let canvasDraw = this.canvasDraw;
    let colors = this.colors;

    for (let dataLine = 0; dataLine < data.length; dataLine++) {
      let dataRow = data[dataLine];
      for (let i = 0; i < dataRow.length; i++) {
        this.drawLines(
          canvasDraw,
          i * (canvasWidth / dataRow.length),
          canvasHeight - (dataRow[i] / 100) * canvasHeight,
          (i + 1) * (canvasWidth / dataRow.length),
          canvasHeight - (dataRow[i + 1] / 100) * canvasHeight,
          false,
          colors[dataLine]
        );
        this.drawBezier(
          canvasDraw,
          i * (canvasWidth / dataRow.length),
          canvasHeight - (dataRow[i] / 100) * canvasHeight,
          (i + 1) * (canvasWidth / dataRow.length),
          canvasHeight - (dataRow[i + 1] / 100) * canvasHeight,
          false,
          colors[dataLine]
        );
      }
    }
  }
  animate(currentTime) {
    //preload data
    let data = this.data;
    let canvasHeight = this.canvasHeight;
    let canvasWidth = this.canvasWidth;
    let smoothIndex = this.smoothIndex;
    let timeToRender = this.timeToRender;
    let canvasDraw = this.canvasDraw;
    let colors = this.colors;

    let returnPositions = [];

    let percents = currentTime / timeToRender;
    for (let i = 0; i < data.length; i++) {
      let dataRow = data[i];
      //upper closest value of index to percents in array
      let topCloseValue = Math.ceil((dataRow.length - 1) * percents);
      //bottom closest value of index to percents in array
      let bottomCloseValue = Math.floor((dataRow.length - 1) * percents);

      console.log(topCloseValue, bottomCloseValue);

      if (topCloseValue == bottomCloseValue) {
        bottomCloseValue -= 1;
      }

      //going from point
      let p0 = {
        x: (canvasWidth / (data[i].length - 1)) * bottomCloseValue,
        y: ((100 - dataRow[bottomCloseValue]) / 100) * canvasHeight,
      };
      //going to point
      let p1 = {
        x: (canvasWidth / (data[i].length - 1)) * topCloseValue,
        y: ((100 - dataRow[topCloseValue]) / 100) * canvasHeight,
      };

      //control point 0
      let c0 = {
        x:
          (canvasWidth / (data[i].length - 1)) * bottomCloseValue + smoothIndex,
        y: ((100 - dataRow[bottomCloseValue]) / 100) * canvasHeight,
      };
      //control point 1
      let c1 = {
        x: (canvasWidth / (data[i].length - 1)) * topCloseValue - smoothIndex,
        y: ((100 - dataRow[topCloseValue]) / 100) * canvasHeight,
      };

      let percentageForStep = 100 / (data[0].length - 1) / 100;
      let ret = this.moveOnBezierCurve(
        [p0, c0, c1, p1],
        (percents - bottomCloseValue * percentageForStep) /
          (topCloseValue * percentageForStep -
            bottomCloseValue * percentageForStep)
      );
      this.drawHelpPoints(canvasDraw, p0, p1, c0, c1);
      canvasDraw.strokeStyle = colors[i];
      //use circles
      if (true) {
        canvasDraw.beginPath();
        canvasDraw.arc(
          ret.x + this.canvasPadding,
          ret.y + this.canvasPadding,
          0.25,
          0,
          2 * Math.PI,
          false
        );
        canvasDraw.fillStyle = "green";
        canvasDraw.stroke();
      }
      //use rectangles
      if (false) {
        canvasDraw.strokeRect(
          ret.x + this.canvasPadding,
          ret.y + this.canvasPadding,
          0.25,
          0.25
        );
      }
      returnPositions[i] = {
        x: ret.x + this.canvasPadding,
        y: ret.y + this.canvasPadding,
      };
    }
    return returnPositions;
  }
  /**
   * For debug
   * Below is just set of normal points {p0,p1} and control points {c0,c1}
   * @param {*} p0
   * @param {*} p1
   * @param {*} c0
   * @param {*} c1
   */
  drawHelpPoints(canvasDraw, p0, p1, c0, c1) {
    canvasDraw.strokeStyle = "black";
    canvasDraw.strokeRect(
      p0.x + this.canvasPadding,
      p0.y + this.canvasPadding - 5,
      1,
      10
    );
    canvasDraw.strokeRect(
      p1.x + this.canvasPadding,
      p1.y + this.canvasPadding - 5,
      1,
      10
    );
    canvasDraw.strokeStyle = "yellow";
    canvasDraw.strokeRect(
      c0.x + this.canvasPadding,
      c0.y + this.canvasPadding - 5,
      5,
      5
    );
    canvasDraw.strokeRect(
      c1.x + this.canvasPadding,
      c1.y + this.canvasPadding - 5,
      5,
      5
    );
  }
}
