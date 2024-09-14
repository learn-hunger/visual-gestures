// Import the shared drawing function (compiled JS)

importScripts("canvas-shared-drawing.js");
let canvasContext;

// Handle messages from the main thread
self.onmessage = function (e) {
  // If this message contains the OffscreenCanvas, set up the context
  if (e.data.canvas) {
    const canvas = e.data.canvas;
    canvasContext = canvas.getContext("2d"); // Get the 2D context from the OffscreenCanvas
    return; // Exit early to prevent any further handling of this message
  }

  if (e.data.action === "clear") {
    // Clear the OffscreenCanvas in the worker
    canvasContext.clearRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height,
    );
    return;
  }

  // Handle drawing data
  const {
    dataPoints,
    metricX,
    metricY,
    landmarksStyle,
    connections,
    labelStyle,
    showLabels,
  } = e.data;
  const data = {
    dataPoints,
    metricX,
    metricY,
    landmarksStyle,
    connections,
    labelStyle,
  };

  // Draw using the shared function
  drawLandmarks(
    canvasContext,
    data,
    canvasContext.canvas.width,
    canvasContext.canvas.height,
    showLabels,
  );
};
