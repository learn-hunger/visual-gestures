import { initialiseDetection } from './index.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>
      <video id="webcam" autoplay/>
    </div>
  </div>
`

initialiseDetection(document.querySelector<HTMLVideoElement>('#webcam')!);
