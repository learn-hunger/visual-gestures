import { initialiseDetection } from "./index.ts";
import { AnalyticsTagManager } from "./services/types/vg-analytics.ts";
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
//intialise analytics manager
AnalyticsTagManager;
initialiseDetection(document.querySelector<HTMLVideoElement>("#webcam")!);
