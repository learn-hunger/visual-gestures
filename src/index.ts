import { DefaultConfig } from "./app/config/defalut-config";
import { AVgCommon } from "./app/shared/vg-cursor-pointer-abstract";
import { VgPointer } from "./app/pointer/custom-events";
import { EHandLandmarks } from "./app/utilities/vg-constants";
import { IGestureCustomProps } from "./app/utilities/vg-types";
import { INormalizedLandmark } from "./app/utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "./app/pointer/DTO/vg-handlandmark";
/**
 * Central Class to Hold all kinds of gestures such as hand for now and
 * may be audio gestures for future
 */
export class VisualGestures extends AVgCommon {
  /**
   * props are the properties being sent to the
   * event handlers and its corresponding custom event classes
   * It contains common properties
   */
  public props: IGestureCustomProps;
  /**
   * It is the composition of VgPointer class
   * It is the central handler for all hand gesture events
   * Core logic for hand gestures is maintainted in this class
   */
  public mouseEvents: VgPointer;
  constructor(
    container: HTMLElement = DefaultConfig.instance.cursorContainer,
    pointer: EHandLandmarks = DefaultConfig.instance.pointer,
  ) {
    super(container);
    //initialise the central hand gesture class
    this.mouseEvents = new VgPointer();
    //initialise the constant properties of the cursor etc
    this.props = {
      pointer: {
        keypoint: pointer,
        currentLandmark: DefaultConfig.instance.cursorPosition,
      },
      cursorElement: this.cursor,
      cursorSpeed: 1,
    };
    this.props.element = {};
  }

  /**
   * here common properties gets updated whenever landmarks gets detected
   * on each frame
   * @private
   * @type {{}}
   */
  private set setLandmarks(landmarks: INormalizedLandmark[]) {
    if (landmarks.length > 0) {
      this.props.previousLandmarks = this.props.currentLandmarks;
      this.props.currentLandmarks = landmarks;
      this.props.previousStructuredLandmarks = this.props.structuredLandmarks;
      this.props.structuredLandmarks = new VgHandLandmarksDTO(landmarks);
      this.props.pointer.previousLandmark = this.props.pointer.currentLandmark;
      this.props.pointer.currentLandmark =
        landmarks[this.props.pointer.keypoint];

      //update delta landmarks of pointer
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

      //update delta landmarks of all landmarks
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

  /**
   * Calculates and normalizes the position of the cursor position
   * to fit within the viewport of the container element
   * called only when landmarks got detected
   * @private
   * @readonly
   * @type {MouseEventInit}
   */
  private get mouseInit(): MouseEventInit {
    let { x: pointerX, y: pointerY } = this.props.pointer.currentLandmark;
    const { clientWidth: cursorX, clientHeight: cursorY } = this.sizes.cursor;
    const { clientWidth: containerX, clientHeight: containerY } =
      this.sizes.container;
    //normalise x ,y to 0-1
    //here x is 1 to 0 from left to right wrt screen
    const speed = this.props.cursorSpeed;
    // const temp=pointerX
    pointerX = pointerX * speed > 1 ? 1 : pointerX * speed;
    pointerX = pointerX * speed < 0 ? 0 : pointerX * speed;
    pointerY = pointerY * speed < 0 ? 0 : pointerY * speed;
    pointerY = pointerY * speed > 1 ? 1 : pointerY * speed;
    //TODO Z axis

    //screen wise normalisation to fit into view port lower boundaries

    //right operator here is to make the cursor inside the viewport of upper boundaries
    const clientX = Math.min(
      Math.max((1 - pointerX) * containerX, 0),
      containerX - cursorX,
    );
    const clientY = Math.min(
      Math.max(pointerY * containerY, 0),
      containerY - cursorY,
    );
    const m: MouseEventInit = {
      clientX: clientX,
      clientY: clientY,
    };
    return m;
  }

  /**
   * It assigns the timestamp of the current frame and previous frame
   * which will be used in core logic of the gestures in vgPointer class
   * @private
   * @type {number}
   */
  private set setTimer(timeStamp: number) {
    if (!this.props.time) {
      //setting the initial timestamps ie timer at first frame
      this.props.time = {
        deltaTime: timeStamp,
        timeStamp: timeStamp,
      };
      return;
    }

    //timestamps after first frame
    this.props.time.deltaTime = timeStamp - this.props.time.timeStamp;
    this.props.time.timeStamp = timeStamp;
  }

  /**
   * This is the handler which gets called by the end developer
   * based on the handlandmarks detected setLandmarks and mouseInit gets called
   * Timer gets called every time to update the timestamp irrespective of handlandmarks detected or not
   * @param landmark
   * @param timeStamp
   * @param cursorSpeed
   */
  detect(
    landmark: INormalizedLandmark[] | undefined,
    timeStamp: number,
    cursorSpeed: number = 1,
  ): void {
    this.setTimer = timeStamp;
    if (landmark) {
      //update landmarks and cursor position and delta landmarks as per detected landmarks
      this.setLandmarks = landmark;
      /**
       * callibrate with cursor sizes in the first frame
       * call actual detection only after the first frame
       * in first frame no events get fired
       */
      const isCallibrated = this.props.sizes;
      if (isCallibrated) {
        try {
          this.props.cursorSpeed = cursorSpeed;
          this.mouseEvents.updateProps(this.mouseInit, this.props);
        } catch (err) {
          console.log(err);
        }
      } else {
        //first frame callibration
        this.initialiseSizes();
        this.props.sizes = this.sizes;
      }
    } else {
      //whenever landmarks are not detected , reset the states in vgPointer class
      this.mouseEvents.resetStatesOnNoLandmarks();
    }
  }
}
