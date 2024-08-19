import { initialiseDetection } from "./index.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <video id="webcam" width="100%" height="100%" autoplay></video>
      <div id="mouseParent">
           <p> outside </p>
            <div id="mouseChild">
                 <p> inside </p>
            </div>
      </div>
`;

initialiseDetection(document.querySelector<HTMLVideoElement>("#webcam")!);
