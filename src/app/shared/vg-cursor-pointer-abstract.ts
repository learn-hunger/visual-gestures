import { CursorObject } from "../cursor/vg-cursor";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";

export abstract class AVgCommon extends CursorObject {
  abstract detect(landmark: INormalizedLandmark[], timestamp: number): void;

  dispose() {
    window.removeEventListener("resize", this.initialiseSizes);
  }
}
