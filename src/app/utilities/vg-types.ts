import { VgPointerEnter } from "../pointer/custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../pointer/custom-events/vg-pointer-leave";
import { VgPointerMove } from "../pointer/custom-events/vg-pointer-move";
import { EHandLandmarks } from "./vg-constants";
import { INormalizedLandmark } from "./vg-types-handlandmarks";

export interface ICursorProp {
  path: string;
  scale: number;
  showCursor: boolean;
}

export interface IGestureCustomProps {
  previousLandmarks?: INormalizedLandmark[];
  currentLandmarks?: INormalizedLandmark[];
  deltaLandmarks?: INormalizedLandmark[];
  pointer: IPointer;
  time?: {
    timeStamp: number;
    deltaTime: number;
  };
  element?: IElementsStates;
  cursorElement: HTMLElement;
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
  onPointerMove: (event?: VgPointerMove) => any;
  onPointerEnter: (event?: VgPointerEnter) => any;
  onPointerLeave: (event?: VgPointerLeave) => any;
}

export interface IElementsSizes {
  container: ISizesProps;
  cursor: ISizesProps;
}

interface ISizesProps {
  clientWidth: number;
  clientHeight: number;
}

export interface IMouseMove {
  dX: number;
  dY: number;
  dZ?: number;
  distance2D: number;
  distance3D: number;
  relativeDist2D: number;
}

export interface IElementsStates {
  from?: Element | null;
  to?: Element | null;
}
