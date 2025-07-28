import {
  FilesetResolver,
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
let handDetector: HandLandmarker;
export async function loadWeights() {
  if (handDetector) {
    return handDetector;
  }
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  handDetector = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  return handDetector;
}

export function detect(video: HTMLVideoElement): HandLandmarkerResult | null {
  if (handDetector) {
    video.paused && video.play();
    const landmarks = handDetector.detectForVideo(video, performance.now());
    return landmarks;
  }
  return null;
}
