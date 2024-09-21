import { EHandLandmarks, EVgMouseEvents } from "../utilities/vg-constants";
import { TCursors } from "../utilities/vg-types";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";

export class DefaultConfig {
  private static defaultConfig: DefaultConfig;
  cursor: TCursors;
  cursorContainer: HTMLElement;
  pointer: EHandLandmarks;
  cursorPosition: INormalizedLandmark;
  deltaLandmark: INormalizedLandmark;
  flickeringThreshold: number;

  private constructor() {
    this.cursor = this.setCursor();
    this.cursorContainer = document.body;
    this.pointer = EHandLandmarks.INDEX_TIP;
    this.cursorPosition = { x: 0.5, y: 0.5, z: 0.5 };
    this.deltaLandmark = { x: 0, y: 0, z: 0 };
    this.flickeringThreshold = 15;
  }

  private setCursor(): TCursors {
    return {
      showCursor: true,
      baseURI: window.location.href,
      default: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_MOVE]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_LEAVE]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_ENTER]: {
        path: "pointer_enter.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_DOWN]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_UP]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_CLICK]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_DROP]: {
        path: "pointer_move.png",
        scale: 1,
        showCursor: true,
      },
      [EVgMouseEvents.MOUSE_DRAG]: {
        path: "pointer_drag.png",
        scale: 1,
        showCursor: true,
      },
    };
  }

  static get instance() {
    if (!DefaultConfig.defaultConfig) {
      DefaultConfig.defaultConfig = new DefaultConfig();
    }
    return DefaultConfig.defaultConfig;
  }
}
