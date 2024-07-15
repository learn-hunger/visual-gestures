import {
    HandLandmarker,
    FilesetResolver
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
  
  // const demosSection = document.getElementById("demos");
  
  let handLandmarker = undefined;
  let runningMode = "VIDEO";
  // let enableWebcamButton;
  let webcamRunning = false;
  
  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });
    // demosSection.classList.remove("invisible");
    console.log(handLandmarker,"handlandmarker")
    enableWebCam();

  };

  function enableWebCam(){
    navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
      const video=document.getElementById("videoElement");
      video.srcObject=stream;
      video.play();
      setTimeout(()=>{
        getLandmarks();

      },1000)

    })
  }

  async function getLandmarks(){
    const video=document.getElementById("videoElement");
    console.log(video,)
    const landmarks=await handLandmarker.detectForVideo(video,performance.now())
    console.log(landmarks,"landmarks");
    window.requestAnimationFrame(getLandmarks);
  }
  createHandLandmarker();
  
  
