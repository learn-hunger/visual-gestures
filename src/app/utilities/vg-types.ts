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

export interface IGestureCustomProps {
  previousLandmarks?: INormalizedLandmark[];
  currentLandmarks?: INormalizedLandmark[];
  deltaLandmarks?: INormalizedLandmark[];
  structuredLandmarks?: VgHandLandmarksDTO;
  previousStructuredLandmarks?: VgHandLandmarksDTO;
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

export interface IPointer {
  keypoint: EHandLandmarks;
  currentLandmark: INormalizedLandmark;
  previousLandmark?: INormalizedLandmark;
  deltaLandmark?: INormalizedLandmark;
}

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

export interface IElementsStates {
  from?: Element | null;
  to?: Element;
  downElement?: Element | null;
  clickElement?: Element;
}
