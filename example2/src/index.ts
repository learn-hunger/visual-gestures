import GUI from "lil-gui";
import Stats from "stats.js";
import { detect, loadWeights } from "./services/handLandmarks";
import { enableWebcam } from "./utils/camera";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { Main } from "visual-gestures/src/index";
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
  showCursor: true,
};
const gui = new GUI({
  title: "Controls",
  // closeFolders:true
});
debug();

// loadWeights();
export function initialiseDetection(webcamRef: HTMLVideoElement) {
  initialiseEventListeners();
  a.showCursor = debugObject.showCursor;
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
    if (pointer) {
      a.detect(pointer, performance.now());
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
  //cursor
  cursor.add(debugObject, "showCursor").onChange(() => {
    a.showCursor = !a._showCursor;
  });

  cursor.add(debugObject, "cursorSpeed").max(2).min(1).step(0.1);
  // gui.close();
}

function monitor() {
  statsFps.showPanel(0);
  statsFps.dom.setAttribute("id", "monitor");
  document.body.append(statsFps.dom);
}

// console.log(a,"hell")
const a = new Main();
a.mouseEvents.onPointerMove = () => {
  console.log("moving2");
};
function initialiseEventListeners() {
  const parent = document.getElementById("mouseParent");
  const child = document.getElementById("mouseChild");
  parent?.addEventListener("vgPointerEnter", (event) => {
    parent.children[0].innerHTML = "mouse Entered";
  });

  parent?.addEventListener("vgPointerLeave", (event) => {
    parent.children[0].innerHTML = "mouse Leaved";
  });

  child?.addEventListener("vgPointerLeave", (event) => {
    child.children[0].innerHTML = "mouse Leaved";
  });

  child?.addEventListener("vgPointerEnter", (event) => {
    child.children[0].innerHTML = "mouse Entered";
  });
}
