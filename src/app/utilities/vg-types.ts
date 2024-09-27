import { VgPointerClick } from "../pointer/custom-events/vg-pointer-click";
import { VgPointerDown } from "../pointer/custom-events/vg-pointer-down";
import { VgPointerDrag } from "../pointer/custom-events/vg-pointer-drag";
import { VgPointerDrop } from "../pointer/custom-events/vg-pointer-drop";
import { VgPointerEnter } from "../pointer/custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../pointer/custom-events/vg-pointer-leave";
import { VgPointerMove } from "../pointer/custom-events/vg-pointer-move";
import { VgPointerUp } from "../pointer/custom-events/vg-pointer-up";
import { VgHandLandmarksDTO } from "../pointer/DTO/vg-handlandmark";
import { EHandLandmarks, EVgMouseEvents } from "./vg-constants";
import { INormalizedLandmark } from "./vg-types-handlandmarks";

export interface ICursorProp {
  path: string;
  scale: number;
  showCursor: boolean;
}
export type TCursors = {
  [value in EVgMouseEvents]: ICursorProp;
} & { showCursor: boolean; default: ICursorProp; baseURI: string };

/**
 * These are the properties being sent to the
 * event handlers and its corresponding custom event classes
 */
export interface IGestureCustomProps {
  /**
   * Landmarks from previous detected frame
   */
  previousLandmarks?: INormalizedLandmark[];
  /**
   * landmarks from current detected frame
   */
  currentLandmarks?: INormalizedLandmark[];
  /**
   * Change in the previous and current detected frame
   */
  deltaLandmarks?: INormalizedLandmark[];
  /**
   * Data type object to manage and extract landmarks
   * as a group
   * example :
   * const l:INormalizedLandmark[]=[{x:0,y:0,z:0}];
   * const n=new VgHandLandmarksDTO(l)
   * n.data.INDEX.DIP.x
   */
  structuredLandmarks?: VgHandLandmarksDTO;
  /**
   * similarily data type object for previous landmarks
   */
  previousStructuredLandmarks?: VgHandLandmarksDTO;
  /**
   * It contains various information about
   * the visual cursor or pointer
   */
  pointer: IPointer;
  time?: {
    timeStamp: number;
    deltaTime: number;
  };
  element?: IElementsStates;
  cursorElement: HTMLElement;
  sizes?: IElementsSizes;
  cursorSpeed: number;
  calc?: ICalculations;
}

// // DataType that contains coordinates and properties(open/close) of finger
// export interface IFingerData {
//   [key: string]: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
//   // 'WRIST': { CMC: INormalizedLandmark },
//   THUMB: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
//   INDEX: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
//   MIDDLE: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
//   RING: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
//   PINKY: {
//     CMC: INormalizedLandmark;
//     MCP: INormalizedLandmark;
//     IP: INormalizedLandmark;
//     TIP: INormalizedLandmark;
//   };
// }

// export interface IFingerStateRatio {
//   [key: string]: number;
//   THUMB: number;
//   INDEX: number;
//   MIDDLE: number;
//   RING: number;
//   PINKY: number;
// }

/**
 * It contains various information about
 * the visual cursor or pointer
 */
export interface IPointer {
  /**
   * It is the index of the hand landmark used as the visual cursor or pointer
   * By default it is the index finger ie index 8
   */
  keypoint: EHandLandmarks;
  /**
   * contains landmark co-ordinates of the pointer or cursor of the
   * current detected frame
   */
  currentLandmark: INormalizedLandmark;
  /**
   * contains landmark co-ordinates of the pointer or cursor of the
   * previously detected frame
   */
  previousLandmark?: INormalizedLandmark;
  /**
   * contains difference in values landmark between current and
   * previously detected frame
   * by default it is 0 for x,y,z coordinates
   */
  deltaLandmark?: INormalizedLandmark;
}

/**
 * IEvents contains all the vg events callbacks
 * which were directly been listened from vg instance
 */
export interface IEvents {
  onPointerMove: (event: VgPointerMove) => any;
  onPointerEnter: (event: VgPointerEnter) => any;
  onPointerLeave: (event: VgPointerLeave) => any;

  onPointerDown: (event: VgPointerDown) => any;
  onPointerUp: (event: VgPointerUp) => any;
  onPointerClick: (event: VgPointerClick) => any;
  onPointerDrop: (event: VgPointerDrop) => any;
  onPointerDrag: (event: VgPointerDrag) => any;
}

/**
 * width and height of the cursor and whole container
 *by default container is body
 * @public
 * @type {IElementsSizes}
 */
export interface IElementsSizes {
  container: ISizesProps;
  cursor: ISizesProps;
}

interface ISizesProps {
  clientWidth: number;
  clientHeight: number;
}

export interface ICalculations {
  distance2D: number;
  distance3D: number;
  relativeDist2D: number;
}

/**
 * properties represets the element or dispatcher on which
 * events are dispatched or triggered
 */
export interface IElementsStates {
  from?: Element;
  to?: Element;
  downElement?: Element;
  clickElement?: Element;
  dropElement?: Element;
  dragElement?: Element;
}
