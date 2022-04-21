class curveAnaliticGenerator {
  constructor(canvas, data, timeToRender) {
    //loading canvas things
    this.canvasDraw = canvas.getContext("2d");

    //main data for function of program
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.data = data;
    this.colors = ["green", "red", "blue"];

    //draw full grid
    this.drawPercentGrid(this.canvasDraw, this.canvasWidth, this.canvasHeight);

    //*animation setup
    //full render time in ms
    this.timeToRender = timeToRender;
    // smooth index of curves
    this.smoothIndex = 50; //50 ideal
    this.currentTime = 0;
    //actual time
    this.time = new Date().getTime();
    //saving starting time for later use
    this.startTime = this.time;
    this.stopTime;
    //actual time in video
    this.timeInVideo = 0;
    //t value
    this.t;
    //segment time
    this.segmentTime = this.timeToRender / this.data[0].length;

    /**
     * This is for starting animations right after loading curve
     * So use it only for debug
     */
    //animations
    if (false) {
      this.animateCurve();
    }
    if (false) {
      this.animateLine();
    }
    //static
    if (false) {
      this.generateStaticCurveLine();
    }
  }
  /**
   * Generate canvas grid for percents
   * @param {*} canvasDraw
   * @param {*} width width of canvas
   * @param {*} height height of canvas
   */
  drawPercentGrid(canvasDraw, width, height) {
    canvasDraw.lineWidth = 0.25;
    canvasDraw.beginPath();
    for (let i = 0; i < 11; i++) {
      canvasDraw.moveTo(0, (height / 10) * i);
      canvasDraw.font = "15px Arial";
      canvasDraw.fillText(100 - i * 10 + "%", 0, (height / 10) * i);
      canvasDraw.lineTo(width, (height / 10) * i);
    }
    canvasDraw.stroke();
    canvasDraw.lineWidth = 1;
  }
  /**
   * Draw static bezier between two points
   * @param {int} canvasDraw Canvas handler
   * @param {int} x0 Starting point X
   * @param {int} y0 Starting point Y
   * @param {int} x1 Ending point X
   * @param {int} y1 Ending point Y *
   * @param {boolean} showPoints TRUE show points | FALSE dont show
   * @param {string} lineColor color of line
   */
  drawLines(canvasDraw, x0, y0, x1, y1, showPoints, lineColor) {
    //draw default path
    canvasDraw.strokeStyle = lineColor;
    canvasDraw.beginPath();
    canvasDraw.moveTo(x0, y0);
    canvasDraw.lineTo(x1, y1);
    canvasDraw.stroke();

    if (showPoints == true) {
      //main points
      canvasDraw.strokeStyle = "#ffffff";
      canvasDraw.strokeRect(x0, y0, 4, 4);
      canvasDraw.strokeStyle = "#000000";

      //point between main points
      let pointBetween = betweenPointCalculate(x0, y0, x1, y1);
      canvasDraw.strokeStyle = "#ffffff";
      canvasDraw.strokeRect(pointBetween[0], pointBetween[1], 4, 4);
      canvasDraw.strokeStyle = "#000000";
    }
  }
  /**
   * Will render bezier curve
   * TODO: Need to rework
   * @param {int} canvasDraw Canvas handler
   * @param {int} x0 Starting point X
   * @param {int} y0 Starting point Y
   * @param {int} x1 Ending point X
   * @param {int} y1 Ending point Y *
   * @param {boolean} showPoints TRUE show points | FALSE dont show
   * @param {string} lineColor color of line
   */
  drawBezier(canvasDraw, x0, y0, x1, y1, showPoints, lineColor) {
    //calculate point between starting and ending point
    let pointBetween = this.betweenPointCalculate(x0, y0, x1, y1);
    //draw full bezier
    //*first half
    canvasDraw.strokeStyle = lineColor;
    canvasDraw.beginPath();
    canvasDraw.moveTo(x0, y0);
    canvasDraw.quadraticCurveTo(
      this.middleValueCalculate(x0, pointBetween[0]),
      y0,
      pointBetween[0],
      pointBetween[1]
    );
    canvasDraw.stroke();
    canvasDraw.strokeStyle = "#000000";

    if (showPoints == true) {
      //control point for first bezier
      canvasDraw.strokeStyle = "#ffffff";
      canvasDraw.strokeRect(
        this.middleValueCalculate(x0, pointBetween[0]),
        y0,
        5,
        5
      );
    }

    //*secound half
    canvasDraw.strokeStyle = lineColor;
    canvasDraw.beginPath();
    canvasDraw.moveTo(pointBetween[0], pointBetween[1]);
    canvasDraw.quadraticCurveTo(
      this.middleValueCalculate(pointBetween[0], x1),
      y1,
      x1,
      y1
    );
    canvasDraw.stroke();
    canvasDraw.strokeStyle = "#000000";

    if (showPoints == true) {
      //control point for secound bezier
      canvasDraw.strokeStyle = "#ffffff";
      canvasDraw.strokeRect(pointBetween[0], y1, 5, 5);
      canvasDraw.strokeStyle = "#000000";
    }
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

    //Calculate new X & Y positions of ball
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

    //if you are on the end of video
    /*
      if (this.timeInVideo >= timeToRender) {
        clearInterval(this.intervalCurve);
      }*/

    let percents = currentTime / timeToRender;

    for (let i = 0; i < data.length; i++) {
      let dataRow = data[i];

      //upper closest value of index to percents in array
      let topCloseValue = Math.ceil(dataRow.length * percents);
      //bottom closest value of index to percents in array
      let bottomCloseValue = Math.floor(dataRow.length * percents);

      if (topCloseValue == bottomCloseValue) {
        bottomCloseValue -= 1;
      }

      //going from point
      let p0 = {
        x: (canvasWidth / data[i].length) * bottomCloseValue,
        y: ((100 - dataRow[bottomCloseValue]) / 100) * canvasHeight,
      };
      //going to point
      let p1 = {
        x: (canvasWidth / data[i].length) * topCloseValue,
        y: ((100 - dataRow[topCloseValue]) / 100) * canvasHeight,
      };

      //control point 0
      let c0 = {
        x: (canvasWidth / data[i].length) * bottomCloseValue + smoothIndex,
        y: ((100 - dataRow[bottomCloseValue]) / 100) * canvasHeight,
      };
      //control point 1
      let c1 = {
        x: (canvasWidth / data[i].length) * topCloseValue - smoothIndex,
        y: ((100 - dataRow[topCloseValue]) / 100) * canvasHeight,
      };

      let percentageForStep = 100 / data[0].length / 100;
      console.log(bottomCloseValue * percentageForStep);
      let ret = this.moveOnBezierCurve(
        [p0, c0, c1, p1],
        (percents - bottomCloseValue * percentageForStep) /
          (topCloseValue * percentageForStep -
            bottomCloseValue * percentageForStep)
      );

      canvasDraw.strokeStyle = colors[i];
      canvasDraw.strokeRect(ret.x, ret.y, 1, 1);
    }
  }

  animateLine() {
    let data = this.data;
    let canvasHeight = this.canvasHeight;
    let canvasWidth = this.canvasWidth;
    let canvasDraw = this.canvasDraw;
    let colors = this.colors;

    this.intervalLine = setInterval(() => {
      if (new Date().getTime() - this.startTime >= this.timeToRender)
        clearInterval(this.intervalLine);

      let percents =
        (new Date().getTime() - this.startTime) / this.timeToRender;

      for (let dataLine = 0; dataLine < data.length; dataLine++) {
        canvasDraw.strokeStyle = colors[dataLine];
        let dataRow = data[dataLine];
        //upper closest value of index to percents in array
        let topCloseValue = Math.ceil(dataRow.length * percents);
        //bottom closest value of index to percents in array
        let bottomCloseValue = Math.floor(dataRow.length * percents);

        let fullPercents =
          topCloseValue / dataRow.length - bottomCloseValue / dataRow.length;

        let differenceValues =
          (dataRow[bottomCloseValue] - dataRow[topCloseValue]) *
          ((percents - bottomCloseValue / dataRow.length) / fullPercents);

        //draw point
        canvasDraw.strokeRect(
          percents * canvasWidth,
          canvasHeight -
            (dataRow[bottomCloseValue] / 100) * canvasHeight +
            (differenceValues / 100) * canvasHeight,
          1,
          1
        );
      }
    }, 1);
  }
}
