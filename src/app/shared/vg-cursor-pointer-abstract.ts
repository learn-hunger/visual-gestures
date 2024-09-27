import { CursorObject } from "../cursor/vg-cursor";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";

/**
 * Common interface to have common functionalities across all types of gestures or interactions
 * It is created to adapt with the eye,audio gestures
 * One can add common code here
 */
export abstract class AVgCommon extends CursorObject {
  /**
   * common interface to capture landmarks from the developer
   * across all types of media gestures
   * @param landmark
   * @param timestamp
   */
  abstract detect(landmark: INormalizedLandmark[], timestamp: number): void;

  /**
   * It is used to clear the resources by  user calling it explicitly
   */
  dispose() {
    window.removeEventListener("resize", this.initialiseSizes);
  }
}
