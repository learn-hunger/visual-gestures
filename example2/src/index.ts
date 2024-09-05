import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import GUI from "lil-gui";
import Stats from "stats.js";
import { Main } from "visual-gestures/src/index";
import { EVgMouseEvents } from "../../src/app/utilities/vg-constants";
import { detect, loadWeights } from "./services/handLandmarks";
import { enableWebcam } from "./utils/camera";
import { AnalyticsTagManager } from "./services/types/vg-analytics";
import { EAnalyticsData, EAnalyticsEvents, gameVar } from "./utils/constants";
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
            webcamRef.addEventListener("loadeddata", startDetection);
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
  if (lastVideoTime != webcamElement.currentTime) {
    statsFps.begin();
    landmarks = detect(webcamElement);
    const pointer = landmarks?.landmarks[0];
    if (pointer) {
      try {
        a.detect(pointer, performance.now());
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
        });
      }
    } else {
      //landmarks not detected
      AnalyticsTagManager.sendData({
        [EAnalyticsData[EAnalyticsData.LANDMARKS_NOT_DETECTED]]: "",
      });
    }
    statsFps.end();
    lastVideoTime = webcamElement.currentTime;
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
  // console.log("moving2");
};
function initialiseEventListeners() {
  const parent = document.getElementById("mouseParent");
  const child = document.getElementById("mouseChild");
  parent?.addEventListener(EVgMouseEvents.MOUSE_ENTER, (event) => {
    // console.log("pointer enter");
    parent.children[0].innerHTML = "mouse Entered";
  });

  parent?.addEventListener(EVgMouseEvents.MOUSE_LEAVE, (event) => {
    parent.children[0].innerHTML = "mouse Leaved";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_LEAVE, (event) => {
    child.children[0].innerHTML = "mouse Leaved";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_ENTER, (event) => {
    child.children[0].innerHTML = "mouse Entered";
  });

  //mouse down
  parent?.addEventListener(EVgMouseEvents.MOUSE_DOWN, (event) => {
    parent.children[0].innerHTML = "mouse Down";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_DOWN, (event) => {
    child.children[0].innerHTML = "mouse Down";
  });

  //mouse up
  parent?.addEventListener(EVgMouseEvents.MOUSE_UP, (event) => {
    parent.children[0].innerHTML = "mouse up";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_UP, (event) => {
    child.children[0].innerHTML = "mouse up";
  });

  //mouse click
  parent?.addEventListener(EVgMouseEvents.MOUSE_CLICK, (event) => {
    parent.children[0].innerHTML = "mouse clicked";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_CLICK, (event) => {
    child.children[0].innerHTML = "mouse clicked";
  });
  //mouse drop
  parent?.addEventListener(EVgMouseEvents.MOUSE_DROP, (event) => {
    parent.children[0].innerHTML = "mouse drop";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_DROP, (event) => {
    child.children[0].innerHTML = "mouse drop";
  });
  //mouse drag
  parent?.addEventListener(EVgMouseEvents.MOUSE_DRAG, (event) => {
    parent.children[0].innerHTML = "mouse drag";
  });

  child?.addEventListener(EVgMouseEvents.MOUSE_DRAG, (event) => {
    child.children[0].innerHTML = "mouse drag";
  });

  //callbacks
  a.mouseEvents.onPointerEnter = () => {
    console.log("callback pointer entered");
  };
  a.mouseEvents.onPointerLeave = () => {
    console.log("callback pointer leave");
  };
  a.mouseEvents.onPointerMove = () => {
    console.log("callback pointer moved");
  };

  a.mouseEvents.onPointerDown = () => {
    console.log("callback pointer down");
  };
  a.mouseEvents.onPointerUp = () => {
    console.log("callback pointer up");
  };
  a.mouseEvents.onPointerClick = () => {
    console.log("callback pointer Click");
  };
  a.mouseEvents.onPointerDrop = () => {
    console.log("callback pointer drop");
  };
  a.mouseEvents.onPointerDrag = () => {
    console.log("callback pointer drag");
  };

  window.addEventListener("beforeunload", () => {
    // removeEventListeners();
  });
}
