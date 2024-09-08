import { DefaultConfig } from "../../config/defalut-config";
import { euclideanDistance } from "../../utilities/vg-functions";
import {
  ICalculations,
  IElementsSizes,
  IElementsStates,
  IGestureCustomProps,
  IPointer,
} from "../../utilities/vg-types";
import { INormalizedLandmark } from "../../utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "../DTO/vg-handlandmark";

export abstract class ACommonMouseProps
  extends MouseEvent
  implements IGestureCustomProps, ICalculations
{
  distance2D!: number;
  distance3D!: number;
  relativeDist2D!: number;
  time: { timeStamp: number; deltaTime: number } | undefined;

  constructor(
    eventType: string,
    mouseProp: MouseEventInit,
    customProps: IGestureCustomProps,
  ) {
    super(eventType, mouseProp);
    Object.assign(this, customProps);
    Object.assign(this, customProps.calc);
    // const { x, y, z } =
    //   this.pointer.deltaLandmark ?? DefaultConfig.instance.deltaLandmark;
    // this.dX = x;
    // this.dY = y;
    // this.dZ = z;
    // this.distance2D = euclideanDistance(x, y);
    // this.distance3D = euclideanDistance(x, y, z);
    // this.relativeDist2D = euclideanDistance(x * this.clientX, y * this.clientY);
    // this.cursorElement=
    // this.previousLandmarks=customProps.previousLandmarks;
    // this.currentLandmarks=customProps.currentLandmarks;
    // this.deltaLandmarks=customProps.deltaLandmarks;
    // this.pointer=customProps.pointer;
    // this.time=customProps.time;
    // this.timestamp=customProps.time;
    // this.deltaTime=0;
  }
  structuredLandmarks?: VgHandLandmarksDTO | undefined;
  previousStructuredLandmarks?: VgHandLandmarksDTO | undefined;
  sizes?: IElementsSizes | undefined;
  cursorSpeed!: number;
  element?: IElementsStates | undefined;
  cursorElement!: HTMLImageElement;
  previousLandmarks?: INormalizedLandmark[];
  currentLandmarks?: INormalizedLandmark[];
  deltaLandmarks?: INormalizedLandmark[];
  pointer!: IPointer;
}
