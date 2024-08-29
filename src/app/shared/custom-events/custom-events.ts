import { DefaultConfig } from "../../config/defalut-config";
import {
  euclideanDistance,
  piecewiseFingerDistance,
  weightedEuclideanDistance,
} from "../../utilities/vg-functions";
import { IGestureCustomProps, IMouseMove } from "../../utilities/vg-types";
import { AVgPointerEvents } from "./vg-events";
import {
  IFingerKeypoints,
  INormalizedLandmark,
} from "../../utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "../DTO/vg-handlandmark";
import { EFingers } from "../../utilities/vg-constants";

export class VgPointer
  extends AVgPointerEvents
  implements IMouseMove, AVgPointerEvents
{
  dX!: number;
  dY!: number;
  dZ?: number | undefined;
  distance2D!: number;
  distance3D!: number;
  relativeDist2D!: number;
  time: { timeStamp: number; deltaTime: number } | undefined;
  mouseInit!: MouseEventInit;
  props!: IGestureCustomProps;

  MCPWindow: [INormalizedLandmark] = [null!];
  upWindow: [number, number] = [NaN, NaN];
  downWindow: [number, number] = [NaN, NaN];

  constructor() {
    super();
    // super(EVgMouseEvents.MOUSE_MOVE,mouseProp,customProps);
    // Object.assign(mouseProp);
    // this.mouseInit=mouseProp;
    // this.customProps=customProps;
    // this.trigger();
  }

  updateProps(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    this.mouseInit = mouseProp;
    this.props = customProps;
    const { x, y, z } =
      this.props.pointer.deltaLandmark ?? DefaultConfig.instance.deltaLandmark;
    this.dX = x;
    this.dY = y;
    this.dZ = z;
    this.distance2D = euclideanDistance(x, y);
    this.distance3D = euclideanDistance(x, y, z);
    this.relativeDist2D = euclideanDistance(
      x * this.mouseInit.clientX!,
      y * this.mouseInit.clientY!,
    );
    this.trigger();
  }

  set setElement(element: Element | null) {
    if (!this.props.element) {
      console.log("hello");
      this.props.element = {
        from: element,
      };
      this.triggerMouseLeave(this.mouseInit, this.props);
      return;
    }
    if (element == this.props.cursorElement) {
      element = document.elementsFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!,
      )[1];
      console.log(
        "hi",
        document.elementsFromPoint(
          this.mouseInit.clientX!,
          this.mouseInit.clientY!,
        ),
      );
    }
    if (
      element != this.props.cursorElement &&
      this.props.element.to != element
    ) {
      this.props.element.from = this.props.element.to;
      this.props.element.to = element;
      this.triggerMouseEnter(this.mouseInit, this.props);
      this.triggerMouseLeave(this.mouseInit, this.props);
    }
  }

  trigger() {
    if (this.isPointerMove()) {
      //mouse move ,enter,leave events
      this.setElement = document.elementFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!,
      );
      this.triggerMouseMove(this.mouseInit, this.props);
    }
    console.log("mouse is not moving");
    //mouse up ,down,click events
    // Structuring raw landmarks
    const landmark: INormalizedLandmark[] = this.props.currentLandmarks;
    const handProps = new VgHandLandmarksDTO(landmark);

    for (let finger of Object.keys(handProps.data) as Array<
      keyof typeof EFingers
    >) {
      if (finger == "WRIST") {
        continue;
      } else if (finger == "THUMB") {
        handProps.state[finger] =
          weightedEuclideanDistance(
            handProps.data["THUMB"].TIP,
            handProps.data["PINKY"].MCP,
            [1, 0.25],
          ) /
          (weightedEuclideanDistance(
            handProps.data["THUMB"].TIP,
            handProps.data["INDEX"].MCP,
            [1, 0.25],
          ) +
            weightedEuclideanDistance(
              handProps.data["INDEX"].MCP,
              handProps.data["PINKY"].MCP,
              [1, 0.25],
            ));
        continue;
      }

      const MCPtoTIPDistance = weightedEuclideanDistance(
        handProps.data[finger].MCP,
        handProps.data[finger].TIP,
        [0.5, 1],
      );
      const piecewiseDistance = piecewiseFingerDistance(
        handProps.data,
        finger,
        [0.5, 1],
      );

      handProps.state[finger] = Math.pow(
        MCPtoTIPDistance / piecewiseDistance,
        2,
      );
    }

    // Dynamic run-time Initialization
    this.MCPWindow[0] = handProps.data["INDEX"].MCP;

    // Hand is kept constant
    if (
      this.MCPWindow[0] != null &&
      weightedEuclideanDistance(
        this.MCPWindow[0],
        handProps.data["INDEX"].MCP,
        [1, 1],
      ) < 0.08
    ) {
      // No Pressure: Finger is erected
      if (
        // isNaN(this.downWindow[0]) &&
        isNaN(this.downWindow[1]) &&
        isNaN(this.upWindow[0]) &&
        isNaN(this.upWindow[1]) &&
        handProps.state["INDEX"] > 0.985
      ) {
        this.downWindow[0] = (this.dX, this.dY);
      }

      // Applied Pressure: Finger is closed
      if (
        !isNaN(this.downWindow[0]) &&
        isNaN(this.downWindow[1]) &&
        handProps.state["INDEX"] < 0.85
      ) {
        this.downWindow[1] = (this.dX, this.dY);
        // console.log("closed_______", this.downWindow);
        console.log(
          "**************ON POINTER DOWN EVENT TRIGGERED!!!!!**************",
        );
        this.upWindow[0] = (this.dX, this.dY);
      }

      // Pressure released: FINGER OPen
      if (
        !isNaN(this.downWindow[0]) &&
        !isNaN(this.downWindow[1]) &&
        !isNaN(this.upWindow[0]) &&
        isNaN(this.upWindow[1]) &&
        handProps.state["INDEX"] > 0.85
      ) {
        (this.upWindow[1] = this.dX), this.dY;
        // console.log("OPEn", this.upWindow);
        console.log(
          "*************ON POINTER UP TRIGGERED!!!!!********************",
        );
        this.downWindow[0] = (this.dX, this.dY);
        this.downWindow[1] = NaN;
        this.upWindow[0] = NaN;
        this.upWindow[1] = NaN;
      }
    }
  }

  private isPointerMove(): boolean {
    if (
      this.relativeDist2D * (this.props.time?.deltaTime! / 1000) * 100 >
      DefaultConfig.instance.flickeringThreshold
    ) {
      return true;
    }
    return false;
  }
}
