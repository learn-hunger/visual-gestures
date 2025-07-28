function drawLandmarks(
  canvasContext,
  data,
  canvasWidth,
  canvasHeight,
  showLabels,
) {
  var _a, _b, _c, _d, _e;
  const overlayWidth = canvasWidth / data.metricX;
  const overlayHeight = canvasHeight / data.metricY;
  // Draw landmarks (points)
  canvasContext.strokeStyle =
    (_a = data.landmarksStyle.point.color) !== null && _a !== void 0
      ? _a
      : "red";
  canvasContext.lineWidth =
    (_b = data.landmarksStyle.point.width) !== null && _b !== void 0 ? _b : "2";
  for (const handLandmark of data.dataPoints) {
    canvasContext.beginPath();
    canvasContext.arc(
      handLandmark.x * overlayWidth,
      handLandmark.y * overlayHeight,
      data.landmarksStyle.point.radius,
      0,
      2 * Math.PI,
    );
    canvasContext.stroke();
  }
  // Draw connections (lines)
  canvasContext.strokeStyle =
    (_c = data.landmarksStyle.line.color) !== null && _c !== void 0
      ? _c
      : "darkcyan";
  canvasContext.lineWidth =
    (_d = data.landmarksStyle.line.width) !== null && _d !== void 0 ? _d : "2";
  for (const [startIdx, endIdx] of data.connections) {
    const startLandmark = data.dataPoints[startIdx];
    const endLandmark = data.dataPoints[endIdx];
    canvasContext.beginPath();
    canvasContext.moveTo(
      startLandmark.x * overlayWidth,
      startLandmark.y * overlayHeight,
    );
    canvasContext.lineTo(
      endLandmark.x * overlayWidth,
      endLandmark.y * overlayHeight,
    );
    canvasContext.stroke();
  }
  // Draw labels if enabled
  if (showLabels) {
    canvasContext.fillStyle =
      (_e = data.labelStyle.style.color) !== null && _e !== void 0 ? _e : "red";
    canvasContext.font = data.labelStyle.style.font;
    canvasContext.fillText(
      data.labelStyle.name,
      data.labelStyle.position.x,
      data.labelStyle.position.y,
      data.labelStyle.style.boundingBoxMaxWidth,
    );
  }
}
//# sourceMappingURL=canvas-shared-drawing.js.map
