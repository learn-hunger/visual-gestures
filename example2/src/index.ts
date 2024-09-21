import { Main } from "@learn-hunger/visual-gestures/src/index";
import { Canvas } from "@learn-hunger/visualise-data-kit/src/blueprints/canvas/canvas";
import { ETensorflow } from "@learn-hunger/visualise-data-kit/src/utils/constants/canvas/constants";
import { invertLandmarks } from "@learn-hunger/visualise-data-kit/src/utils/functions";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import GUI from "lil-gui";
import Stats from "stats.js";
import { INormalizedLandmark } from "../../src/app/utilities/vg-types-handlandmarks";
import { eventsListeners } from "./events";
import { DebugGraph } from "./graph";
import { detect, loadWeights } from "./services/handLandmarks";
import { AnalyticsTagManager } from "./services/types/vg-analytics";
import { enableWebcam } from "./utils/camera";
import { EAnalyticsEvents, gameVar } from "./utils/constants";
let webcamElement: HTMLVideoElement;
let debugGraphRef: HTMLCanvasElement;
let visualCanvasRef: HTMLCanvasElement;
let visualCanvas: Canvas;

/**
 * monitoring
 */
const statsFps = new Stats();
/**
 * debug
 */
export const debugObject = {
  showVideo: false,
  cursorSpeed: 1,
  showCursor: true,
  showDebug: true,
  showGraph: true,
  showMonitor: true,
  landmarks: {
    drawLandmarks: true,
    pointColor: "green",
    lineColor: "green",
    showLabel: false,
  },
  resetGraph: DebugGraph.resetChart,
};
const gui = new GUI({
  title: "Controls",
  // closeFolders:true
});
gui.hide();
const vg = new Main();
// loadWeights();
export function initialiseDetection(webcamRef: HTMLVideoElement) {
  debugGraphRef = document.getElementById("debugGraphRef") as HTMLCanvasElement;
  vg.showCursor = false; //to not show cursor at loader
  webcamElement = webcamRef;
  visualCanvasRef = document.getElementById(
    "visualGraphRef",
  ) as HTMLCanvasElement;
  initialiseDebugControls();
  initialiseEventListeners();
  if (webcamElement) {
    AnalyticsTagManager.sendEvents({
      event: EAnalyticsEvents[EAnalyticsEvents.LOAD_WEIGHTS_BEGIN],
    });
    loadWeights()
      .then(() => {
        AnalyticsTagManager.sendEvents({
          event: EAnalyticsEvents[EAnalyticsEvents.LOAD_WEIGHTS_END],
        });
        AnalyticsTagManager.sendEvents({
          event: EAnalyticsEvents[EAnalyticsEvents.CAMERA_ACCESS_BEGIN],
        });
        enableWebcam(webcamElement)
          .then(() => {
            AnalyticsTagManager.sendEvents({
              event: EAnalyticsEvents[EAnalyticsEvents.CAMERA_ACCESS_END],
            });
            webcamRef.addEventListener("loadeddata", enterTheExperience);
          })
          .catch((error) => {
            //webcam error
            AnalyticsTagManager.sendEvents({
              event: EAnalyticsEvents[EAnalyticsEvents.CAMERA_ACCESS_END],
              error: error.stack,
            });
          });
      })
      .catch((error) => {
        //load weights error
        AnalyticsTagManager.sendEvents({
          event: EAnalyticsEvents[EAnalyticsEvents.LOAD_WEIGHTS_ERROR],
          error: error.stack,
        });
      });
  }
}
let lastVideoTime = -1;
function startDetection() {
  let landmarks: HandLandmarkerResult | null = null;
  try {
    if (lastVideoTime != webcamElement.currentTime) {
      statsFps.begin();
      landmarks = detect(webcamElement);
      const pointer = landmarks?.landmarks[0];
      if (pointer && debugObject.landmarks.drawLandmarks) {
        drawOnCanvas(pointer);
      }
      // if (pointer) {
      try {
        vg.detect(pointer, performance.now(), debugObject.cursorSpeed);
        //----------analytics logic being--------------------->
        if (gameVar.firstClassification == false) {
          AnalyticsTagManager.sendEvents({
            event: EAnalyticsEvents[EAnalyticsEvents.CLASSIFICATION_BEGIN],
          });
          gameVar.firstClassification = true;
        }
        //----------analytics logic end------------->
      } catch (error: any) {
        AnalyticsTagManager.sendEvents({
          event: EAnalyticsEvents[EAnalyticsEvents.CLASSIFICATION_ERROR],
          error: error.stack,
          data: "at visual gestures",
        });
      }
      // } else {
      //   //landmarks not detected
      //   AnalyticsTagManager.sendData({
      //     [EAnalyticsData[EAnalyticsData.LANDMARKS_NOT_DETECTED]]: "",
      //   });
      // }
      statsFps.end();
      lastVideoTime = webcamElement.currentTime;
    }
  } catch (error: any) {
    AnalyticsTagManager.sendEvents({
      event: EAnalyticsEvents[EAnalyticsEvents.CLASSIFICATION_ERROR],
      error: error.stack,
    });
  }
  window.requestAnimationFrame(startDetection);
}

function enterTheExperience() {
  const loadedText = document.getElementById("loaded-txt");
  const loaderText = document.getElementById("loader-txt");
  loaderText!.style.display = "none";
  loadedText!.style.display = "block";
  const onClickExperience = () => {
    startDetection();
    document.getElementById("folders")!.style.visibility = "visible";
    vg.showCursor = debugObject.showCursor;
    const loaderContainer = document.getElementById("loader-container");
    loaderContainer!.style.display = "none";
    loadedText!.onclick = null;
    webcamElement.style.display = "block";
  };
  const onEnterExperience = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      AnalyticsTagManager.sendEvents({
        event: EAnalyticsEvents[EAnalyticsEvents.ENTER_INTO_EXPERIENCE],
        data: "entered using enter",
      });
      loadedText!.style.backgroundColor = "#0a1066";
      onClickExperience();
      document.removeEventListener("keydown", onEnterExperience);
    }
  };

  //check weather it is for debug , if so just show the dashboard screen
  const url = window.location.hash;
  if (url.includes("#debug")) {
    AnalyticsTagManager.sendEvents({
      event: EAnalyticsEvents[EAnalyticsEvents.ENTER_INTO_DEBUG_MODE],
    });
    onClickExperience();
  } else {
    loadedText!.onclick = () => {
      AnalyticsTagManager.sendEvents({
        event: EAnalyticsEvents[EAnalyticsEvents.ENTER_INTO_EXPERIENCE],
        data: "entered using click",
      });
      onClickExperience();
    };
    document.addEventListener("keydown", onEnterExperience);
  }
}
function camDebug() {
  const cam = gui.addFolder("camera Controls");
  const container = document.getElementById("container");
  if (debugObject.showVideo) {
    webcamElement.style.visibility = "visible";
  } else {
    webcamElement.style.visibility = "none";
    container!.style.backgroundImage =
      "linear-gradient(to top, #000d24 0%, #01306a 100%)";
  }
  cam.add(debugObject, "showVideo").onChange((toggle: boolean) => {
    if (toggle) {
      webcamElement.style.visibility = "visible";
      container!.style.backgroundImage = "none";
    } else {
      webcamElement.style.visibility = "hidden";
      container!.style.backgroundImage =
        "linear-gradient(to top, #000d24 0%, #01306a 100%)";
    }
  });
}

function debug() {
  gui.show();
  gui.add(debugObject, "showMonitor").onChange((toggle: boolean) => {
    monitor!.style.display = toggle ? "block" : "none";
  });
  const cursor = gui.addFolder("cursor Controls");
  const landmarks = gui.addFolder("landmarks");
  const debugGraph = gui.addFolder("debug graph");
  const monitor = document.getElementById("monitor");

  //cursor
  cursor.add(debugObject, "showCursor").onChange(() => {
    vg.showCursor = !vg._showCursor;
  });

  cursor.add(debugObject, "cursorSpeed").max(2).min(1).step(0.1);

  //landmarks
  landmarks.add(debugObject.landmarks, "drawLandmarks").onChange(() => {
    visualCanvas.clear();
  });
  landmarks.add(debugObject.landmarks, "showLabel");

  landmarks.addColor(debugObject.landmarks, "pointColor");
  landmarks.addColor(debugObject.landmarks, "lineColor");

  //debug graph
  debugGraph.add(debugObject, "showGraph").onChange((toggle: boolean) => {
    debugGraphRef.style.display = toggle ? "block" : "none";
  });
  debugGraph.add(debugObject, "resetGraph");
}

function monitor() {
  statsFps.showPanel(0);
  statsFps.dom.setAttribute("id", "monitor");
  document.body.append(statsFps.dom);
}

function initialiseEventListeners() {
  eventsListeners();

  //callbacks
  vg.mouseEvents.onPointerEnter = () => {
    // console.log("callback pointer entered");
  };
  vg.mouseEvents.onPointerLeave = () => {
    // console.log("callback pointer leave");
  };
  //@ts-ignore
  let dt: number = 0;
  //@ts-ignore
  let dydt: number = 0;
  let eleState: any;
  let mouseDown = false;
  vg.mouseEvents.onPointerMove = (event) => {
    if (event.time?.timeStamp && event.structuredLandmarks) {
      const landmark = event.structuredLandmarks?.data.INDEX;
      const mcp = landmark?.MCP.y;
      const tip = landmark?.TIP.y;
      let z = event.structuredLandmarks.data.INDEX.TIP.z * 10 ** 6;
      z = Math.max(0.1, z);
      if (mcp && tip && event.sizes) {
        const deltaTime = event.time.deltaTime;
        const manDist = (mcp - tip) / deltaTime;
        const ele = event.element?.to;
        dydt = manDist;
        dt = deltaTime;
        if (manDist < 0.001) {
          mouseDown = true;
        } else if (manDist > 0.002) {
          if (eleState == ele && mouseDown == true) {
          } else if (mouseDown == true) {
          }
          eleState = ele;
          mouseDown = false;
        }
        DebugGraph.updateChart(event?.time?.timeStamp, manDist);
        // DebugGraph.updateData(1,sd,'red');
      }
    }
  };

  vg.mouseEvents.onPointerDown = (event) => {
    // console.log("callback pointer down");
  };
  vg.mouseEvents.onPointerUp = () => {
    // console.log("callback pointer up");
  };
  vg.mouseEvents.onPointerClick = () => {
    // console.log("callback pointer Click");
  };
  vg.mouseEvents.onPointerDrop = () => {
    // console.log("callback pointer drop");
  };
  vg.mouseEvents.onPointerDrag = () => {
    // console.log("callback pointer drag");
  };
}

function initialiseDebugControls() {
  const url = window.location.hash;
  if (url.includes("#debug")) {
    debugObject.showVideo = true;
    monitor();
    debug();
    camDebug();
    webcamElement.classList.remove("video-live");
    DebugGraph.initialiseGraph();
    const container = document.getElementById("container");
    container!.style.backgroundImage = "none";
  } else {
    debugGraphRef.style.display = "none";
    (debugObject.showVideo = false),
      (debugObject.showDebug = false),
      (debugObject.showGraph = false),
      (debugObject.showMonitor = false),
      (debugObject.landmarks.drawLandmarks = false);
    // gui.hide();
  }
}

function drawOnCanvas(landmarks: INormalizedLandmark[]) {
  landmarks = invertLandmarks(landmarks, "x");
  if (!visualCanvas) {
    visualCanvas = new Canvas(visualCanvasRef, webcamElement);
    visualCanvas.useWorker = { canvasWorkerPath: "canvas-worker.js" };
  }
  visualCanvas.clear();
  visualCanvas.setShowAllLabels = debugObject.landmarks.showLabel;
  visualCanvas.draw({
    type: ETensorflow.HAND,
    dataPoints: landmarks,
    landmarksStyle: {
      point: { color: debugObject.landmarks.pointColor },
      line: { color: debugObject.landmarks.lineColor },
    },
  });
}
function destory() {
  const removeEventListeners = () => {
    window.removeEventListener("loadeddata", enterTheExperience);
    vg.dispose();
    vg.mouseEvents.dispose();
    visualCanvas.destroy();
  };

  // Object.values(document.getElementsByClassName("contents") as HTMLCollectionOf<HTMLElement>).forEach((folder)=>{
  //   folder.removeEventListener()
  // })
  window.addEventListener("beforeunload", removeEventListeners);
  window.addEventListener("unload", removeEventListeners);
}
destory();
