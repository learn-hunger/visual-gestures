import { initialiseDetection } from "./index.ts";
import { AnalyticsTagManager } from "./services/types/vg-analytics.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="loader-container">
    <div id="loader-img-container">
        <img id="loader-img" src="pwa-512x512.png" alt="">
    </div>
    <div id="loader-txt-container">
        <p id="loader-txt">Loading....</p>
        <button id="loaded-txt">Fly your mouse in air !</button>
    </div>
</div>

<div id="container">

    <video id="webcam" class="video-live" width="100%" height="100%" autoplay></video>
    <canvas id="debugGraphRef"></canvas>
    <canvas id="visualGraphRef"></canvas>
    <div id="folders" >
        <img class="contents folders" src="experience/folder.png" alt="" draggable="true">
        <img class="contents folders" src="experience/js-file.png" alt="" draggable="true">
        <img class="contents folders" src="experience/python-file.png" alt="" draggable="true">
        <img class="contents pdf" src="experience/pdf.png" alt="" draggable="true">
        <img class="contents pdf" src="experience/html-file.png" alt="">

    </div>
    <div id="dustbin">
        <div id="dustbin-container" >
        <img class="bin" id="bin-hover-img" src="experience/bin-hover.png" alt="">
        <img class="bin" id="bin-default-img" src="experience/bin-default.png" alt="">
        </div>
    </div>
</div>

<div id="modal">
    <div id="close">X &nbsp;&nbsp;&nbsp;Close</div>
    <div id="preview">
        <div id="preview-img">
            <img id="modal-img" src="experience/modal-preview-img.png"/>
        </div>
        <p id="preview-content" alt="">hello world</p>
        <p id="preview-static-content">Clicked !</p>
        </div>
</div>
      <div id="mouseParent" style="display:none">
           <p> outside </p>
            <div id="mouseChild">
                 <p> inside </p>
            </div>
      </div>
`;
//intialise analytics manager
AnalyticsTagManager;
initialiseDetection(document.querySelector<HTMLVideoElement>("#webcam")!);
