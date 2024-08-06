import GUI from "lil-gui";
import Stats from "stats.js";
import { detect, loadWeights } from "./services/handLandmarks";
import { enableWebcam } from "./utils/camera";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { CursorObject } from "visual-gestures/src/app/shared/blueprints/vg-cursor";
let webcamElement = document.getElementById("webcam") as HTMLVideoElement;
/**
 * monitoring
 */
const statsFps = new Stats();
monitor();
/**
 * debug
 */
const debugObject = {
  showVideo: true,
  cursorSpeed: 1,
};
const gui = new GUI({
  title: "Controls",
  // closeFolders:true
});
debug();

// loadWeights();
export function initialiseDetection(webcamRef: HTMLVideoElement) {
  webcamElement = webcamRef;
  if (webcamElement) {
    loadWeights().then(() => {
      enableWebcam(webcamElement).then(() => {
        webcamRef.addEventListener("loadeddata", startDetection);
      });
    });
  }
}
let lastVideoTime = -1;
function startDetection() {
  let landmarks: HandLandmarkerResult | null = null;
  if (lastVideoTime != webcamElement.currentTime) {
    lastVideoTime = webcamElement.currentTime;
    statsFps.begin();
    landmarks = detect(webcamElement);
    const pointer = landmarks?.landmarks[0];
    // console.log(landmarks?.landmarks[0]?landmarks?.landmarks[0][8]:null)
    if (pointer) {
      // console.log(pointer[8].x/window.innerWidth)
      const x =
        Math.min(
          (1 - pointer[8].x) * a.container.clientWidth,
          a.container.clientWidth - a.cursor.clientWidth,
        ) * debugObject.cursorSpeed;
      const y =
        Math.min(
          pointer[8].y * a.container.clientHeight,
          a.container.clientHeight - a.cursor.clientHeight,
        ) * debugObject.cursorSpeed;
      a.cursor.style.left = x.toString() + "px";
      a.cursor.style.top = y.toString() + "px";
      // console.log(pointer[8].z)
    }
    statsFps.end();
  }
  window.requestAnimationFrame(startDetection);
}

function debug() {
  const cam = gui.addFolder("camera Controls");
  const cursor = gui.addFolder("cursor Controls");
  cam.add(debugObject, "showVideo").onChange(() => {
    const webcamStyle = webcamElement.style;
    debugObject.showVideo
      ? (webcamStyle.visibility = "visible")
      : (webcamStyle.visibility = "hidden");
  });

  cursor.add(debugObject, "cursorSpeed").max(2).min(1).step(0.1);
  // gui.close();
}

function monitor() {
  statsFps.showPanel(0);
  statsFps.dom.setAttribute("id", "monitor");
  document.body.append(statsFps.dom);
}

const a = new CursorObject();
// console.log(a,"hell")
