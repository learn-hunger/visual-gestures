import { initialiseDetection } from "./index.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <video id="webcam" width="100%" height="100%" autoplay/>
`;

initialiseDetection(document.querySelector<HTMLVideoElement>("#webcam")!);
