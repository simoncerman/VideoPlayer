/**
 * Generate canvas grid for percents
 * @param {*} canvasDraw
 * @param {*} width width of canvas
 * @param {*} height height of canvas
 */
function drawPercentGrid(canvasDraw, width, height) {
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
function drawLines(canvasDraw, x0, y0, x1, y1, showPoints, lineColor) {
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
 * @param {int} canvasDraw Canvas handler
 * @param {int} x0 Starting point X
 * @param {int} y0 Starting point Y
 * @param {int} x1 Ending point X
 * @param {int} y1 Ending point Y *
 * @param {boolean} showPoints TRUE show points | FALSE dont show
 * @param {string} lineColor color of line
 */
function drawBezier(canvasDraw, x0, y0, x1, y1, showPoints, lineColor) {
  //calculate point between starting and ending point
  let pointBetween = betweenPointCalculate(x0, y0, x1, y1);
  //draw full bezier
  //*first half
  canvasDraw.strokeStyle = lineColor;
  canvasDraw.beginPath();
  canvasDraw.moveTo(x0, y0);
  canvasDraw.quadraticCurveTo(
    middleValueCalculate(x0, pointBetween[0]),
    y0,
    pointBetween[0],
    pointBetween[1]
  );
  canvasDraw.stroke();
  canvasDraw.strokeStyle = "#000000";

  if (showPoints == true) {
    //control point for first bezier
    canvasDraw.strokeStyle = "#ffffff";
    canvasDraw.strokeRect(middleValueCalculate(x0, pointBetween[0]), y0, 5, 5);
  }

  //*secound half
  canvasDraw.strokeStyle = lineColor;
  canvasDraw.beginPath();
  canvasDraw.moveTo(pointBetween[0], pointBetween[1]);
  canvasDraw.quadraticCurveTo(
    middleValueCalculate(pointBetween[0], x1),
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
function betweenPointCalculate(x0, y0, x1, y1) {
  return [x1 - (x1 - x0) / 2, (y1 - y0) / 2 + y0];
}
/**
 * Calculate middle value of two values
 * @param {*} x0 Starting point
 * @param {*} x1 Ending point
 */
function middleValueCalculate(x0, x1) {
  return x1 - (x1 - x0) / 2;
}

/**
 * Will draw square precisly on percentage dependent to values in array
 * @param {int} percents
 */
function generateOnPercent(percents) {
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

    values[dataLine] =
      1 -
      (canvasHeight -
        (dataRow[bottomCloseValue] / 100) * canvasHeight +
        (differenceValues / 100) * canvasHeight) /
        canvasHeight;

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
}
/**
 * calculate next position of dot
 * depends on four points / two main / two controls
 * and t value
 * @param {*} points [p0, p1, p2, p3]
 * @param {*} t
 */
function moveOnBezierCurve(points, t) {
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
function updateValues() {
  let valueNames = ["data1", "data2", "data3"];
  for (let i = 0; i < 3; i++) {
    document.getElementById(valueNames[i]).innerHTML =
      Math.round(values[i] * 100) + "%";
  }
}

//main data for function of program
let canvasWidth = 1000;
let canvasHeight = 700;
let data = [
  [0, 20, 10, 70, 10, 20, 10, 20, 10, 20, 10, 20, 10, 20],
  [15, 21, 60, 40, 50, 30, 50, 100, 70, 30, 40, 60, 80, 90],
  [12, 13, 15, 25, 46, 40, 50, 60, 71, 68, 10, 20, 40, 80],
];
let colors = ["green", "red", "blue"];

//loading canvas things
let docCanvas = document.getElementById("canvas");
let canvasDraw = docCanvas.getContext("2d");

//draw grid
drawPercentGrid(canvasDraw, canvasWidth, canvasHeight);
/*
//*Static curves and lines
for (let dataLine = 0; dataLine < data.length; dataLine++) {
  let dataRow = data[dataLine];
  for (let i = 0; i < dataRow.length; i++) {
    drawLines(
      canvasDraw,
      i * (canvasWidth / dataRow.length),
      canvasHeight - (dataRow[i] / 100) * canvasHeight,
      (i + 1) * (canvasWidth / dataRow.length),
      canvasHeight - (dataRow[i + 1] / 100) * canvasHeight,
      false,
      colors[dataLine]
    );
    drawBezier(
      canvasDraw,
      i * (canvasWidth / dataRow.length),
      canvasHeight - (dataRow[i] / 100) * canvasHeight,
      (i + 1) * (canvasWidth / dataRow.length),
      canvasHeight - (dataRow[i + 1] / 100) * canvasHeight,
      false,
      colors[dataLine]
    );
  }
}*/

//*Animations
//full render time in ms
let timeToRender = 60000;
//actual time
let time = new Date().getTime();
//saving starting time for later use
let startTime = time;
//t value
let t;
//segment time
let segmentTime = timeToRender / data[0].length;
// smooth index of curves
let smoothIndex = 50; //50 ideal

/**
 ** This function is handling line animations
 */
/*
function animateLine() {
  time += speed;
  let percents = time / timeToRender;
  generateOnPercent(percents);
  updateValues();
  if (time >= timeToRender) {
    clearInterval(intervalLine);
  }
}*/

/**
 * *This function is handling curve animation
 */
function animateCurve() {
  if (new Date().getTime() - startTime >= timeToRender)
    clearInterval(intervalCurve);

  let percents = (new Date().getTime() - startTime) / timeToRender;

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

    console.log();
    let ret = moveOnBezierCurve(
      [p0, c0, c1, p1],
      (new Date().getTime() - startTime) / (timeToRender / data[0].length) -
        Math.floor(
          (new Date().getTime() - startTime) / (timeToRender / data[0].length)
        )
    );
    canvasDraw.strokeStyle = colors[i];
    canvasDraw.strokeRect(ret.x, ret.y, 1, 1);
  }
}
//let intervalLine = setInterval(animateLine, 1);
let intervalCurve = setInterval(animateCurve, 1);
