import { EHandLandmarks } from "../utilities/vg-constants";
import { ICursorProp } from "../utilities/vg-types";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";

export class DefaultConfig {
  private static defaultConfig: DefaultConfig;
  cursor: ICursorProp;
  cursorContainer: HTMLElement;
  pointer: EHandLandmarks;
  cursorPosition: INormalizedLandmark;
  deltaLandmark: INormalizedLandmark;
  flickeringThreshold: number;

  private constructor() {
    this.cursor = {
      path: "https://img.icons8.com/?size=100&id=s3JOUU9Yp36E&format=png&color=000000",
      scale: 1,
      showCursor: true,
    };
    this.cursorContainer = document.body;
    this.pointer = EHandLandmarks.INDEX_TIP;
    this.cursorPosition = { x: 0.5, y: 0.5, z: 0.5 };
    this.deltaLandmark = { x: 0, y: 0, z: 0 };
    this.flickeringThreshold = 15;
  }

  static get instance() {
    if (!DefaultConfig.defaultConfig) {
      DefaultConfig.defaultConfig = new DefaultConfig();
    }
    return DefaultConfig.defaultConfig;
  }
}
