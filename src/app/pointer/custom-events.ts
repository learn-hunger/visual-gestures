import { DefaultConfig } from "../config/defalut-config";
import { getElementCoordinatesFromLandmark } from "../shared/vg-get-element";
import { EFingers } from "../utilities/vg-constants";
import {
  euclideanDistance,
  piecewiseFingerDistance,
  weightedEuclideanDistance,
} from "../utilities/vg-functions";
import { IGestureCustomProps } from "../utilities/vg-types";
import { INormalizedLandmark } from "../utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "./DTO/vg-handlandmark";
import { AVgPointerEvents } from "./abstracts/vg-pointer-events";

export class VgPointer extends AVgPointerEvents {
  distance2D!: number;
  distance3D!: number;
  relativeDist2D!: number;
  mouseInit!: MouseEventInit;
  props!: IGestureCustomProps;
  structuredLandmarks!: VgHandLandmarksDTO;
  mouseDown: boolean = false;
  upElement!: HTMLElement;

  palmHeight?: number;
  fingerHeight?: number;

  fingerKinkRatio!: number;
  stateID?: number;
  decaWindowPointer?: number; // Variable that is used to track the current index of deca, and tip windows

  decaWindow: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ] = [null, null, null, null, null]; // Window to track fingerKinkRatio
  tipWindow: [
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
  ] = [null, null, null, null, null]; // Window to track tip of Index finger
  motionWindow: [INormalizedLandmark | null, INormalizedLandmark | null] = [
    null,
    null,
  ]; // INDEX_MCP, INDEX_MCP

  constructor() {
    super();
  }

  updateProps(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    this.mouseInit = mouseProp;
    this.props = customProps;
    const { x, y, z } =
      this.props.pointer.deltaLandmark ?? DefaultConfig.instance.deltaLandmark;
    this.distance2D = euclideanDistance(x, y);
    this.distance3D = euclideanDistance(x, y, z);
    this.relativeDist2D = euclideanDistance(
      x * this.mouseInit.clientX!,
      y * this.mouseInit.clientY!,
    );
    this.trigger();
  }

  set setElement(element: Element) {
    if (!this.props.element) {
      this.props.element = {
        from: element,
      };
      this.triggerMouseLeave(this.mouseInit, this.getProps);
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
      this.props.element.to != element &&
      element
    ) {
      this.props.element.from = this.props.element.to;
      this.props.element.to = element;
      this.triggerMouseEnter(this.mouseInit, this.getProps);
      this.triggerMouseLeave(this.mouseInit, this.getProps);
    }
  }

  trigger() {
    // this.isPointerDown();
    // if (this.mouseDown == false) {
    //   this.triggerMouseMove(this.mouseInit, this.getProps);

    //   this.setElement = document.elementFromPoint(
    //     this.mouseInit.clientX!,
    //     this.mouseInit.clientY!,
    //   );
    // }

    this.testSpace();
  }

  // public state!: number;
  // public state2!: number;
  // private isPointerDown() {
  //   const landmark = this.props.structuredLandmarks?.data.INDEX;
  //   const mcp = landmark?.MCP.y;
  //   const tip = landmark?.TIP.y;
  //   const toElement = this.props.element;
  //   if (mcp && tip && this.props.time && toElement && toElement.to) {
  //     const deltaTime = this.props.time.deltaTime;
  //     const manDist = (mcp - tip) / deltaTime;
  //     const elementState = toElement.to as HTMLElement;
  //     if (manDist < 0.002) {
  //       console.log(this.upElement, "mouseDown");
  //       this.mouseDown = true;
  //     } else if (manDist > 0.002) {
  //       console.log(this.upElement, "mouseUp");
  //       if (elementState == this.upElement && this.mouseDown == true) {
  //         console.log("click", elementState);
  //         this.props.element!.clickElement = this.upElement;
  //         this.triggerMouseClick(this.mouseInit, this.getProps);
  //       } else if (this.mouseDown == true) {
  //         //mouse drag
  //         console.log("click fail", elementState, this.upElement);
  //       }
  //       this.upElement = toElement.to as HTMLElement;
  //       this.mouseDown = false;
  //     }
  //   }
  // }

  private testSpace() {
    /***
     * stateID: flag indicating current operation
     * If stateID==0 then move operation
     * else if stateID==1 then down operation
     * else if stateID==2 then up operation
     * else if stateID==3 then drag operation
     * else if stateID==4 them drag+up= drop operation
     */

    // Executes during every time-frame to generate structuredLandmarks
    this.staticEventsInitialiser();

    // Calling functions that do non-move operations
    this.pseudoDown();

    this.pseudoUp();

    this.pseudoClick();

    this.pseudoDrag();

    this.pseudoDrop();

    // Move Operation
    if (this.stateID == 0 && this.tipWindow[0]) {
      // const { x, y } = getElementCoordinatesFromLandmark(
      //   this.tipWindow[0], // This contains the INormalizedLandmark which corresponds to the movement of cursor
      //   this.props.sizes!,
      // );
      // this.mouseInit.clientX = x;
      // this.mouseInit.clientY = y;
      this.triggerMouseMove(this.mouseInit, this.getProps);
      this.setElement = document.elementFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!,
      )!;
    }

    // Cursor control during drag operation
    if (this.stateID == 3) {
      const { x, y } = getElementCoordinatesFromLandmark(
        this.tipWindow[this.decaWindowPointer!]!, // This contains the INormalizedLandmark which corresponds to the movement of cursor
        this.props.sizes!,
      );

      // this.mouseInit.clientX = x;
      // this.mouseInit.clientY = y;
      if (!this.props.element?.dragElement) {
        const dragElement = this.props.element!.to;
        if ((dragElement as HTMLElement).draggable) {
          this.props.element!.dragElement = dragElement;
        }
        // console.log("drag happening",dragElement.draggable)
      }
      if (this.props.element?.dragElement) {
        this.triggerMouseDrag(this.mouseInit, this.getProps);
      }

      // console.log("____________Drag", document.elementsFromPoint(x, y));
    }
  }

  // private isPointerMove(): boolean {
  //   if (
  //     this.relativeDist2D * (this.props.time?.deltaTime! / 1000) * 100 >
  //     DefaultConfig.instance.flickeringThreshold
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  private pseudoDown(): boolean {
    if (this.structuredLandmarks && this.fingerKinkRatio && this.stateID == 0) {
      // Significant decrement in FKR is observed
      if (
        this.decaWindow[0] &&
        this.decaWindow[0] - this.fingerKinkRatio >= 200
      ) {
        /**
         * this.decaWindow[0] contains INormalizedLandmark coordinates where down operation is triggered
         */

        this.decaWindow[1] = this.fingerKinkRatio; // Freeze the FKR at which down is triggered in 1th-index

        // Nullify the entire decaWindow after 1th- index
        this.decaWindow[2] = null;
        this.decaWindow[3] = null;
        this.decaWindow[4] = null;

        this.tipWindow[1] = this.structuredLandmarks.data["INDEX"].TIP; // Freeze the (x,y) of index_tip at which down is triggered in 1th-index

        // Nullify the entire tipWindow after 1th- index
        this.tipWindow[2] = null;
        this.tipWindow[3] = null;
        this.tipWindow[4] = null;

        this.decaWindowPointer = 1; // Update the pointer pointing to current index

        this.stateID = 1; // Update the stateID to '1' denoting 'down' operation

        this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP; // Freeze the motionWindow[0] with INormalizedLandmark of INDEX.MCP at instance where down operation is triggered
        this.motionWindow[1] = null; // Nullify the motionWindow[0] to store the successive INormalizedLandmarks of INDEX.MCP

        const { x, y } = getElementCoordinatesFromLandmark(
          this.tipWindow[0]!, // This contains the INormalizedLandmark which corresponds to the movement of cursor
          this.props.sizes!,
        );
        this.props.element!.downElement = this.getElement(x, y);
        // this.mouseInit.clientX = x;
        // this.mouseInit.clientY = y;
        // console.log("down", this.props.element?.downElement);
        this.triggerMouseDown(this.mouseInit, this.getProps);

        // console.log("_________Down ", document.elementsFromPoint(x, y));

        return true;
      }

      // Significant decrement in FKR is not observed
      else {
        // decaWindow is not completely filled
        if (this.decaWindowPointer && this.decaWindowPointer < 4) {
          this.decaWindowPointer = this.decaWindowPointer + 1; // Increment the decaWindowPointer

          this.decaWindow[this.decaWindowPointer] = this.fingerKinkRatio; // Append current FKR to decaWindow
          this.tipWindow[this.decaWindowPointer] =
            this.structuredLandmarks.data["INDEX"].TIP; // Append current INDEX.TIP to tipWindow
        }

        // decaWindow is completely filled
        else if (this.decaWindowPointer == 4) {
          // Take copy of values of decaWindow into variables
          var a = this.decaWindow[1];
          var b = this.decaWindow[2];
          var c = this.decaWindow[3];
          var d = this.decaWindow[4];

          // Update the decaWindow shifting one-index left
          this.decaWindow[0] = a;
          this.decaWindow[1] = b;
          this.decaWindow[2] = c;
          this.decaWindow[3] = d;
          this.decaWindow[4] = this.fingerKinkRatio; // Update decaWindow[4] with current FKR

          // Take copy of values of tipWindow into variables
          const p = this.tipWindow[1];
          const q = this.tipWindow[2];
          const r = this.tipWindow[3];
          const s = this.tipWindow[4];

          // Update the tipWindow shifting one-index left
          this.tipWindow[0] = p;
          this.tipWindow[1] = q;
          this.tipWindow[2] = r;
          this.tipWindow[3] = s;
          this.tipWindow[4] = this.structuredLandmarks.data["INDEX"].TIP; // Update tipWindow[4] with current INDEX.TIP

          // Note: No need to update the decaWindowPointer, keep the value as '4' only [this.decaWindowPointer= 4;]
        }

        this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP; // Update the motionWindow[0] with current INormalizedLandmark of INDEX.MCP
        this.motionWindow[1] = null; // Nullify the motionWindow[0] to store the successive INormalizedLandmark of INDEX.MCP
      }
      return false;
    }
    return false;
  }

  private pseudoUp(): boolean {
    if (this.stateID == 1 || this.stateID == 3) {
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP; // Update the motionWindow[0] with current INDEX.MCP

      // Significant increment in FKR is observed
      if (
        this.decaWindow[1] &&
        this.fingerKinkRatio - this.decaWindow[1] >= 200
      ) {
        // If previous operation is 'drag'(stateID=3) then update stateID=4 (drop operation)
        if (this.stateID == 3) {
          this.stateID = 4;
        }

        // If previous operation is 'down'(stateID=1) then trigger stateID=2 (up operation)
        else {
          this.stateID = 2;
        }

        //todo trigger up
      }

      // Significant increment in FKR is not observed
      else {
        // decaWindow is not completely filled
        if (this.decaWindowPointer && this.decaWindowPointer < 4) {
          this.decaWindowPointer = this.decaWindowPointer + 1; // Increment the decaWindowPointer

          this.decaWindow[this.decaWindowPointer] = this.fingerKinkRatio; // Append current FKR to decaWindow
          this.tipWindow[this.decaWindowPointer] =
            this.structuredLandmarks.data["INDEX"].TIP; // Append current INDEX.TIP to tipWindow
          this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP; // Nullify the motionWindow[0] to store the successive INormalizedLandmarks of INDEX.MCP
        }

        // decaWindow is completely filled
        else if (this.decaWindowPointer == 4) {
          // Take copy of values of decaWindow into variables
          var a = this.decaWindow[3];
          var b = this.decaWindow[4];

          // Update the decaWindow shifting one-index left
          this.decaWindow[2] = a;
          this.decaWindow[3] = b;
          this.decaWindow[4] = this.fingerKinkRatio; // Update decaWindow[4] with current FKR

          // Take copy of values of tipWindow into variables
          const p = this.tipWindow[3];
          const q = this.tipWindow[4];

          // Update the tipWindow shifting one-index left
          this.tipWindow[2] = p;
          this.tipWindow[3] = q;
          this.tipWindow[4] = this.structuredLandmarks.data["INDEX"].TIP; // Update tipWindow[4] with current INDEX.TIP

          // Note: No need to update the decaWindowPointer, keep the value as '4' only [this.decaWindowPointer= 4;]
        }

        // Cursor control during drag operation
        if (this.stateID == 3) {
          // const { x, y } = getElementCoordinatesFromLandmark(
          //   this.tipWindow[this.decaWindowPointer]!, // This contains the INormalizedLandmark which corresponds to the movement of cursor
          //   this.props.sizes!,
          // );

          // this.mouseInit.clientX = x;
          // this.mouseInit.clientY = y;

          this.triggerMouseMove(this.mouseInit, this.getProps);
          this.setElement = document.elementFromPoint(
            this.mouseInit.clientX!,
            this.mouseInit.clientY!,
          )!;
        }
      }
    }
    return false;
  }

  private pseudoClick(): boolean {
    if (
      (this.stateID == 2 &&
        weightedEuclideanDistance(
          this.motionWindow[0]!,
          this.motionWindow[1]!,
          [1, 1],
        ) < 0.08) ||
      (this.stateID == 4 &&
        this.motionWindow[0] &&
        this.motionWindow[1] &&
        weightedEuclideanDistance(
          this.motionWindow[0],
          this.motionWindow[1],
          [1, 1],
        ) < 0.08)
    ) {
      const { x, y } = getElementCoordinatesFromLandmark(
        this.tipWindow[0]!, // Contains the INormalizedLandmark which corresponds to the movement of cursor
        this.props.sizes!,
      );

      // this.mouseInit.clientX = x;
      // this.mouseInit.clientY = y;
      // if (!this.props.element) {
      //   this.props.element = {};
      // }
      this.props.element!.clickElement = this.props.element?.to;
      // console.log("click", this.props.element?.clickElement);

      this.triggerMouseUp(this.mouseInit, this.getProps);
      this.triggerMouseClick(this.mouseInit, this.getProps);

      // console.log("Click", document.elementsFromPoint(x,y));

      this.decaWindow[0] = this.fingerKinkRatio; // Update the decaWindow[0] with current FKR at instance where up operation is triggered

      // Nullify the entire decawindow after 1th- index
      this.decaWindow[1] = null;
      this.decaWindow[2] = null;
      this.decaWindow[3] = null;
      this.decaWindow[4] = null;

      this.tipWindow[0] = this.structuredLandmarks.data["INDEX"].TIP; // Update the tipWindow[0] with INDEX.TIP at instance where up operation is triggered

      // Nullify the entire decawindow after 1th- index
      this.tipWindow[1] = null;
      this.tipWindow[2] = null;
      this.tipWindow[3] = null;
      this.tipWindow[4] = null;

      this.decaWindowPointer = 0; // Update decaWindowPointer to '0'

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP; // Update the motionWindow[0] with current INormalizedLandmark of INDEX.MCP
      this.motionWindow[1] = null; // Nullify the motionWindow[0] to store the successive INormalizedLandmark of INDEX.MCP

      this.stateID = 0; // Update the stateID to '0' denoting 'move' as the current operation and 'click' operation is completed

      return true;
    }
    return false;
  }

  private pseudoDrag(): boolean {
    if (
      this.stateID == 1 &&
      this.motionWindow[0] &&
      this.motionWindow[1] &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.motionWindow[1],
        [1, 1],
      ) > 0.08
    ) {
      this.stateID = 3; // Update the stateID to '3' denoting 'drag' operation

      return true;
    }
    return false;
  }

  private pseudoDrop(): boolean {
    if (
      (this.stateID == 4 &&
        this.motionWindow[0] &&
        this.motionWindow[1] &&
        weightedEuclideanDistance(
          this.motionWindow[0],
          this.motionWindow[1],
          [1, 1],
        ) > 0.08) ||
      (this.stateID == 2 &&
        this.motionWindow[0] &&
        this.motionWindow[1] &&
        weightedEuclideanDistance(
          this.motionWindow[0],
          this.motionWindow[1],
          [1, 1],
        ) > 0.08)
    ) {
      const { x, y } = getElementCoordinatesFromLandmark(
        this.tipWindow[this.decaWindowPointer!]!, // Contains the INormalizedLandmark which corresponds to the movement of cursor
        this.props.sizes!,
      );

      // this.mouseInit.clientX = x;
      // this.mouseInit.clientY = y;
      this.props.element!.dropElement = this.props.element!.to;
      this.triggerMouseDrop(this.mouseInit, this.getProps);
      this.props.element!.dragElement = undefined;

      // console.log("__________Dropped", this.props.element?.dropElement);

      this.decaWindow[0] = this.fingerKinkRatio; // Update the decaWindow[0] with current FKR at instance where up operation is triggered

      // Nullify the entire sliding window after 1th- index
      this.decaWindow[1] = null;
      this.decaWindow[2] = null;
      this.decaWindow[3] = null;
      this.decaWindow[4] = null;

      this.tipWindow[0] = this.structuredLandmarks.data["INDEX"].TIP; // Update the tipWindow[0] with INDEX.TIP at instance where up operation is triggered

      // Nullify the entire sliding window after 1th- index
      this.tipWindow[1] = null;
      this.tipWindow[2] = null;
      this.tipWindow[3] = null;
      this.tipWindow[4] = null;

      this.decaWindowPointer = 0; // Update decaWindowPointer to '0'

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.motionWindow[1] = null;

      this.stateID = 0; // Update the stateID to '0' denoting 'move' as the current operation and 'drop' operation is completed

      return true;
    }
    return false;
  }

  private staticEventsInitialiser() {
    // Structuring raw landmarks
    const landmark: INormalizedLandmark[] = this.props.currentLandmarks!;
    this.structuredLandmarks = this.props.structuredLandmarks!;
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
      [0.5, 1],
    );

    this.fingerHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["INDEX"].TIP,
      this.structuredLandmarks.data["INDEX"].MCP,
      [0.5, 1],
    );

    this.fingerKinkRatio = (1000 * this.fingerHeight) / this.palmHeight; // Calculate FKR

    if (this.decaWindowPointer == undefined) {
      this.tipWindow = [null!, null!, null!, null!, null!];
      this.decaWindow = [null!, null!, null!, null!, null!];
      this.motionWindow = [null!, null!];

      this.decaWindowPointer = 0; // Initialize decaWindowPointer to 0th-index
      this.decaWindow[this.decaWindowPointer] = this.fingerKinkRatio; // Initialize the decaWindow with current FKR
      this.tipWindow[this.decaWindowPointer] =
        this.structuredLandmarks.data["INDEX"].TIP; // Initialize the tipWindow to current INormalizedLandmarks of INDEX.TIP

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP; // Initialize the motionWindow[0] with current INormalizedLandmarks of INDEX.MCP to track motion of hand

      this.stateID = 0; // Initialize the stateID to '0' which denotes current operation as cursor-move
    }
  }
  private get getProps(): IGestureCustomProps {
    this.props.calc = {
      distance2D: this.distance2D,
      distance3D: this.distance3D,
      relativeDist2D: this.relativeDist2D,
    };
    return this.props;
  }

  public resetStatesOnNoLandmarks() {
    this.decaWindow = [null, null, null, null, null];
    this.tipWindow = [null, null, null, null, null];
    this.motionWindow = [null, null];
    this.stateID = undefined;
    this.decaWindowPointer = undefined;
    if (this.props.element && this.props.element.dragElement) {
      this.props.element.dragElement = undefined;
    }
  }

  private getElement(x: number, y: number): Element {
    const element = document.elementsFromPoint(x, y);
    if (element[0] != this.props.cursorElement) {
      return element[0];
    } else {
      return element[1];
    }
  }
}
