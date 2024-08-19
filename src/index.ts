import { DefaultConfig } from "./app/config/defalut-config";
import { AVgCommon } from "./app/shared/blueprints/vg-cursor";
import { VgPointer } from "./app/shared/custom-events/custom-events";
import { EHandLandmarks } from "./app/utilities/vg-constants";
import { IGestureCustomProps } from "./app/utilities/vg-types";
import { INormalizedLandmark } from "./app/utilities/vg-types-handlandmarks";
export class Main extends AVgCommon {
  public props: IGestureCustomProps;
  public mouseEvents: VgPointer;
  constructor(
    container: HTMLElement = DefaultConfig.instance.cursorContainer,
    pointer: EHandLandmarks = DefaultConfig.instance.pointer,
  ) {
    super(container);
    this.mouseEvents = new VgPointer();
    this.props = {
      pointer: {
        keypoint: pointer,
        currentLandmark: DefaultConfig.instance.cursorPosition,
      },
      cursorElement: this.cursor,
    };
  }

  private set setLandmarks(landmarks: INormalizedLandmark[]) {
    if (landmarks.length > 0) {
      this.props.previousLandmarks = this.props.currentLandmarks;
      this.props.currentLandmarks = landmarks;

      this.props.pointer.previousLandmark = this.props.pointer.currentLandmark;
      this.props.pointer.currentLandmark =
        landmarks[this.props.pointer.keypoint];
      this.props.pointer.deltaLandmark = (() => {
        const prev = this.props.pointer.previousLandmark
          ? this.props.pointer.previousLandmark
          : { x: 0, y: 0, z: 0 };
        const { x, y, z } = this.props.pointer.currentLandmark;
        const deltaLandmarks: INormalizedLandmark = {
          x: x - prev.x,
          y: y - prev.y,
          z: z - prev.z,
        };
        return deltaLandmarks;
      })();
      this.props.deltaLandmarks = this.props.currentLandmarks.map(
        (i, index) => {
          const prev = this.props.previousLandmarks
            ? this.props.previousLandmarks[index]
            : { x: 0, y: 0, z: 0 };
          const { x, y, z } = i;
          const deltaLandmarks: INormalizedLandmark = {
            x: x - prev.x,
            y: y - prev.y,
            z: z - prev.z,
          };
          return deltaLandmarks;
        },
      );
    }
  }

  private get mouseInit(): MouseEventInit {
    const {
      x: pointerX,
      y: pointerY,
      z: pointerZ,
    } = this.props.pointer.currentLandmark;
    const { clientWidth: cursorX, clientHeight: cursorY } = this.sizes.cursor;
    const { clientWidth: containerX, clientHeight: containerY } =
      this.sizes.container;
    const clientX = Math.min((1 - pointerX) * containerX, containerX - cursorX);
    const clientY = Math.min(pointerY * containerY, containerY - cursorY);
    const m: MouseEventInit = {
      clientX: clientX,
      clientY: clientY,
    };
    return m;
  }

  private set setTimer(timeStamp: number) {
    if (!this.props.time) {
      this.props.time = {
        deltaTime: timeStamp,
        timeStamp: timeStamp,
      };
      return;
    }
    this.props.time.deltaTime = timeStamp - this.props.time.timeStamp;
    this.props.time.timeStamp = timeStamp;
  }
  detect(landmark: INormalizedLandmark[], timeStamp: number): void {
    this.setLandmarks = landmark;
    const isCallibrated = this.props.time;
    this.setTimer = timeStamp;
    if (isCallibrated) {
      try {
        this.mouseEvents.updateProps(this.mouseInit, this.props);
      } catch (err) {
        console.log(err);
      }
    } else {
      this.initialiseSizes();
    }
  }
}
