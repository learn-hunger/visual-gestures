import { VgPointerEnter } from "../shared/custom-events/vg-pointer-enter";
import { VgPointerLeave } from "../shared/custom-events/vg-pointer-leave";
import { VgPointerMove } from "../shared/custom-events/vg-pointer-move";
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
