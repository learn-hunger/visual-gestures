import { DefaultConfig } from "../config/defalut-config";
import { getElementCoordinatesFromLandmark } from "../shared/vg-get-element";
import { EFingers } from "../utilities/vg-constants";
import {
  euclideanDistance,
  piecewiseFingerDistance,
  weightedEuclideanDistance,
} from "../utilities/vg-functions";
import { IGestureCustomProps, IMouseMove } from "../utilities/vg-types";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "./DTO/vg-handlandmark";
import { AVgPointerEvents } from "./abstracts/vg-pointer-events";

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
  structuredLandmarks?: VgHandLandmarksDTO;
  palmHeight?: number;
  fingerHeight?: number;
  fingerKinkRatio?: number;

  kinkWindow: [number | null, number | null] = [null, null];
  motionWindow: [
    INormalizedLandmark,
    INormalizedLandmark,
    INormalizedLandmark,
  ] = [null!, null!, null!]; // INDEX_MCP, INDEX_MCP, INDEX_TIP
  downWindow: [INormalizedLandmark, INormalizedLandmark] = [null!, null!];

  constructor() {
    super();
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
    this.staticEventsInitialiser();
    this.isPointerDown();
    this.isPointerUp();
    this.isPointerClick();
    this.isPointerDrag();
    this.isPointerDrop();
    if (this.isPointerMove()) {
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;
      this.setElement = document.elementFromPoint(x, y);
      this.triggerMouseMove(this.mouseInit, this.props);
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

  private isPointerDown(): boolean {
    if (
      this.structuredLandmarks &&
      this.fingerKinkRatio &&
      this.downWindow[0] != null &&
      this.downWindow[1] == null &&
      // ____STATIC ALGORITHM__________  this.structuredLandmarks.state["INDEX"] < 0.85
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] == null &&
      this.kinkWindow[0] - this.fingerKinkRatio >= 200
    ) {
      this.kinkWindow[1] = this.fingerKinkRatio;

      this.downWindow[1] = this.structuredLandmarks.data["INDEX"].TIP;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP;

      console.log("Down", this.downWindow);
      this.triggerMouseDown(this.mouseInit, this.props);
      return true;
    }

    return false;
  }

  private isPointerUp(): boolean {
    if (
      this.structuredLandmarks &&
      this.fingerKinkRatio &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      // ____STATIC ALGORITHM__________  this.structuredLandmarks.state["INDEX"] > 0.85
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] != null &&
      this.fingerKinkRatio - this.kinkWindow[1] >= 200
    ) {
      // console.log("UP");
      this.triggerMouseUp(this.mouseInit, this.props);
      return true;
    }

    return false;
  }

  private isPointerClick(): boolean {
    if (
      this.structuredLandmarks &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      this.fingerKinkRatio &&
      // STACTIC: this.structuredLandmarks.state["INDEX"]>0.85 &&
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] != null &&
      this.fingerKinkRatio - this.kinkWindow[1] >= 200 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) < 0.08
    ) {
      this.triggerMouseClick(this.mouseInit, this.props);
      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;
      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;

      return true;
    }
    return false;
  }

  private isPointerDrop(): boolean {
    if (
      this.structuredLandmarks &&
      this.fingerKinkRatio &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      // STACTIC: this.structuredLandmarks.state["INDEX"]> 0.85 &&
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] != null &&
      this.fingerKinkRatio - this.kinkWindow[1] >= 200 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) > 0.08
    ) {
      // console.log("Dropped");
      this.triggerMouseDrop(this.mouseInit, this.props);

      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;
      return true;
    }
    return false;
  }

  private isPointerDrag(): boolean {
    if (
      this.structuredLandmarks &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      // STATIC this.structuredLandmarks.state["INDEX"]<0.85
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] != null &&
      this.kinkWindow[0] - this.kinkWindow[1] >= 200 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) > 0.08
    ) {
      this.downWindow[1] = this.structuredLandmarks.data["INDEX"].TIP;
      // console.log("Dragging");
      this.triggerMouseDrag(this.mouseInit, this.props);
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP;

      // After filling above windows, Logic:
      //
      // Attach cursor to w.r.t 'x'
      //
      //  cursor_x= motionWindow[1].x + (downWindow[0].x - motionWindow[0].x)
      //  cursor_y= motionWindow[1].y + (downWindow[0].y - motionWindow[0].y)

      return true;
    }
    return false;
  }

  private staticEventsInitialiser() {
    // Structuring raw landmarks
    const landmark: INormalizedLandmark[] = this.props.currentLandmarks!;
    this.structuredLandmarks = new VgHandLandmarksDTO(landmark);
    for (let finger of Object.keys(this.structuredLandmarks.data) as Array<
      keyof typeof EFingers
    >) {
      if (finger == "WRIST") {
        continue;
      } else if (finger == "THUMB") {
        this.structuredLandmarks.state[finger] =
          weightedEuclideanDistance(
            this.structuredLandmarks.data["THUMB"].TIP,
            this.structuredLandmarks.data["PINKY"].MCP,
            [1, 0.25],
          ) /
          (weightedEuclideanDistance(
            this.structuredLandmarks.data["THUMB"].TIP,
            this.structuredLandmarks.data["INDEX"].MCP,
            [1, 0.25],
          ) +
            weightedEuclideanDistance(
              this.structuredLandmarks.data["INDEX"].MCP,
              this.structuredLandmarks.data["PINKY"].MCP,
              [1, 0.25],
            ));
        continue;
      }

      const MCPtoTIPDistance = weightedEuclideanDistance(
        this.structuredLandmarks.data[finger].MCP,
        this.structuredLandmarks.data[finger].TIP,
        [0.5, 1],
      );
      const piecewiseDistance = piecewiseFingerDistance(
        this.structuredLandmarks.data,
        finger,
        [0.5, 1],
      );

      this.structuredLandmarks.state[finger] = Math.pow(
        MCPtoTIPDistance / piecewiseDistance,
        1, // Change to power(_,2) to get the probability
      );
    }

    this.palmHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["WRIST"].WRIST,
      this.structuredLandmarks.data["INDEX"].MCP,
      [1, 1],
    );
    this.fingerHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["INDEX"].TIP,
      this.structuredLandmarks.data["INDEX"].MCP,
      [1, 1],
    );

    this.fingerKinkRatio = (1000 * this.fingerHeight) / this.palmHeight;
    // Very first instance of detection
    if (this.kinkWindow[0] == null && this.kinkWindow[1] == null) {
      this.kinkWindow[0] = this.fingerKinkRatio;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
    }

    if (
      !this.isPointerDown() &&
      !this.isPointerUp() &&
      !this.isPointerClick() &&
      !this.isPointerDrag()
    ) {
      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
    }
  }
}
