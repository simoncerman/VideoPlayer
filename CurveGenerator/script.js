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
let values = [0, 0, 0];
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

let canvasWidth = 1000;
let canvasHeight = 700;
let data = [
  [0, 20, 10, 70, 10, 20, 10, 20, 10, 20],
  [15, 21, 60, 40, 50, 62, 50, 100, 70, 30],
  [12, 13, 15, 25, 46, 40, 50, 70, 71, 68],
];
let colors = ["green", "red", "blue"];
let docCanvas = document.getElementById("canvas");
let canvasDraw = docCanvas.getContext("2d");

drawPercentGrid(canvasDraw, canvasWidth, canvasHeight);

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
}
function updateValues() {
  let valueNames = ["data1", "data2", "data3"];
  for (let i = 0; i < 3; i++) {
    document.getElementById(valueNames[i]).innerHTML = Math.round(values[i]*100) + "%";

  }
}
//Drawing lines animation setup
let timeToRender = 60000;
let time = 0;
let speed = 10;
function animateLine() {
  time += speed;
  let percents = time / timeToRender;
  generateOnPercent(percents);
  updateValues();
  if (time >= 60000) {
    clearInterval(interval);
  }
}
let interval = setInterval(animateLine, 1);
