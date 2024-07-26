import GUI from "lil-gui";
import Stats from "stats.js";
import { detect, loadWeights } from "./services/handLandmarks";
import { enableWebcam } from "./utils/camera";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

let webcamElement = document.getElementById("webcam") as HTMLVideoElement;
/**
 * monitoring
 */
const statsFps=new Stats();
monitor();
/**
 * debug
*/
const gui=new GUI({title:"Controls",closeFolders:true});
debug();


loadWeights();
export function initialiseDetection(webcamRef: HTMLVideoElement) {
    webcamElement = webcamRef;
    if (webcamElement) {
        enableWebcam(webcamElement).then(() => {
            loadWeights().then(() => {
                startDetection();
            })
        })
        
    }
}
let lastVideoTime=-1;
function startDetection() {
    let landmarks:HandLandmarkerResult | null=null;
    if(lastVideoTime!=webcamElement.currentTime){
        lastVideoTime=webcamElement.currentTime;
        statsFps.begin();
        landmarks = detect(webcamElement);
        statsFps.end();
    }
    window.requestAnimationFrame(startDetection);
}

function debug(){
   const cam= gui.addFolder('camera Controls');
    gui.close();
}

function monitor(){
    statsFps.showPanel(0);
    statsFps.dom.setAttribute('id','monitor')
    document.body.append(statsFps.dom);
}
