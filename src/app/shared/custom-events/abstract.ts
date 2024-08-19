import { DefaultConfig } from "../../config/defalut-config";
import { euclideanDistance } from "../../utilities/vg-functions";
import {
  IElementsStates,
  IGestureCustomProps,
  IPointer,
} from "../../utilities/vg-types";
import { INormalizedLandmark } from "../../utilities/vg-types-handlandmarks";

export abstract class ACommonMouseProps
  extends MouseEvent
  implements IGestureCustomProps
{
  dX: number;
  dY: number;
  dZ?: number | undefined;
  distance2D: number;
  distance3D: number;
  relativeDist2D: number;
  time: { timeStamp: number; deltaTime: number } | undefined;
  constructor(
    eventType: string,
    mouseProp: MouseEventInit,
    customProps: IGestureCustomProps,
  ) {
    super(eventType, mouseProp);
    Object.assign(this, customProps);
    const { x, y, z } =
      this.pointer.deltaLandmark ?? DefaultConfig.instance.deltaLandmark;
    this.dX = x;
    this.dY = y;
    this.dZ = z;
    this.distance2D = euclideanDistance(x, y);
    this.distance3D = euclideanDistance(x, y, z);
    this.relativeDist2D = euclideanDistance(x * this.clientX, y * this.clientY);
    // this.cursorElement=
    // this.previousLandmarks=customProps.previousLandmarks;
    // this.currentLandmarks=customProps.currentLandmarks;
    // this.deltaLandmarks=customProps.deltaLandmarks;
    // this.pointer=customProps.pointer;
    // this.time=customProps.time;
    // this.timestamp=customProps.time;
    // this.deltaTime=0;
  }
  element?: IElementsStates | undefined;
  cursorElement!: HTMLElement;
  previousLandmarks?: INormalizedLandmark[];
  currentLandmarks?: INormalizedLandmark[];
  deltaLandmarks?: INormalizedLandmark[];
  pointer!: IPointer;
}
