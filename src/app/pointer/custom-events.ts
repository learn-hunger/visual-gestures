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
  structuredLandmarks!: VgHandLandmarksDTO;
  palmHeight?: number;
  fingerHeight?: number;
  fingerKinkRatio?: number;
  stateID?: number;

  kinkWindow: [number | null, number | null] = [null, null];
  motionWindow: [
    INormalizedLandmark,
    INormalizedLandmark,
  ] = [null!, null!]; // INDEX_MCP, INDEX_MCP
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
    // this.isPointerUp(); ___________ Pseudo Event
    this.isPointerClick();
    this.isPointerDrag();
    this.isPointerDrop();

    // Initital state no event == PointerMove event
    if(this.stateID==0)
    {
      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

      console.log("DDDDDDDDDDDDDDDD", this.stateID, this.downWindow);
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;
  
      // console.log();
  
      this.triggerMouseMove(this.mouseInit, this.props);
      this.setElement = document.elementFromPoint(x, y);
    }

    // Pointer down state
    else if(this.stateID==1){
      // console.log("NNNNNNNNNNNNNNNNNNNNNNNN", this.downWindow);
      
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;
  
      // console.log("MMMMMMMMMMMMMM", this.motionWindow );
  
      this.triggerMouseMove(this.mouseInit, this.props);
      this.setElement = document.elementFromPoint(x, y);
    }

    // Pointer drag state
    else if(this.stateID==2){
      console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRR", this.motionWindow);

      const { x:x1,y:y1 } = getElementCoordinatesFromLandmark(
        this.motionWindow[1],
        this.props.sizes!,
      );

      const { x:x2, x:y2 } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );

      const { x:x3, x:y3 } = getElementCoordinatesFromLandmark(
        this.motionWindow[0],
        this.props.sizes!,
      );

      this.mouseInit.clientX = x1+ (x2-x3);
      this.mouseInit.clientY = y1+ (y2-y3);

      // console.log("_____________________",y1, (y3-y2), this.mouseInit.clientY);
      // console.log("____________________")
      this.triggerMouseMove(this.mouseInit, this.props);
    }
  
    // Pointer drop state
    else if(this.stateID== 3){
      console.log("DROP");
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;
  
      this.triggerMouseMove(this.mouseInit, this.props);

      this.stateID= 0;
      
      // Acces the corresponding element where the real-time element is dropped
      this.setElement = document.elementFromPoint(x, y);   
    }

    // Pointer click state (executes only once) and then goes to aove move state
    else if(this.stateID== 4){

      this.stateID= 0;

      console.log("DDDDDDDDDDDDDDDD", this.stateID, this.downWindow);
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;
  
      // console.log();
  
      this.triggerMouseMove(this.mouseInit, this.props);
      this.setElement = document.elementFromPoint(x, y);

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

    }

    // if ( this.isPointerMove()) {
    //   const { x, y } = getElementCoordinatesFromLandmark(
    //     this.downWindow[0],
    //     this.props.sizes!,
    //   );
    //   this.mouseInit.clientX = x;
    //   this.mouseInit.clientY = y;
    //   this.triggerMouseMove(this.mouseInit, this.props);
      
    //   this.setElement = document.elementFromPoint(x, y);
    // }
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
      this.kinkWindow[0] - this.fingerKinkRatio >= 150
    ) {
      this.kinkWindow[1] = this.fingerKinkRatio;
      this.downWindow[1] = this.structuredLandmarks.data["INDEX"].TIP;
      // this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP;

      this.stateID= 1;

      // this.triggerMouseDown(this.mouseInit, this.props);

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
      this.fingerKinkRatio - this.kinkWindow[1] >= 150
    ) {
      console.log("UP");
      // this.triggerMouseUp(this.mouseInit, this.props);
      
      this.stateID= 2;


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
      this.fingerKinkRatio - this.kinkWindow[1] >= 150 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) < 0.08
    ) {

      console.log("__________Click");
      // this.triggerMouseClick(this.mouseInit, this.props);
      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;
      // DONOT CHANGE - LEAVE AS IT IS TO STORE WHERE WE STARTED PERFORMING CLICKING this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;

      this.stateID= 4;
      
      return true;
    }
    return false;
  }

  private isPointerDrag(): boolean {

    

    if (
      this.structuredLandmarks &&
      this.fingerKinkRatio &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      // STATIC this.structuredLandmarks.state["INDEX"]<0.85
      this.kinkWindow[0] != null &&
      this.kinkWindow[1] != null &&
      this.kinkWindow[0] - this.kinkWindow[1] >= 150 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) > 0.08
    ) {
      console.log("Inside drag funciton",  weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ));

      // this.downWindow[1] = this.structuredLandmarks.data["INDEX"].TIP;
      console.log("Dragging");
      // this.triggerMouseDrag(this.mouseInit, this.props);
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP;
      
      this.stateID= 2;
    
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
      this.fingerKinkRatio - this.kinkWindow[1] >= 150 &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.structuredLandmarks.data["INDEX"].MCP,
        [1, 1],
      ) > 0.08
    ) {
      console.log("Dropped");
      // this.triggerMouseDrop(this.mouseInit, this.props);

      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;

      this.stateID= 3;

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
      [0.5, 1],
    );

    this.fingerHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["INDEX"].TIP,
      this.structuredLandmarks.data["INDEX"].MCP,
      [0.5, 1],
    );

    this.fingerKinkRatio = (1000 * this.fingerHeight) / this.palmHeight;

    // console.log("_____________", this.fingerKinkRatio);
    // Very first instance of detection
    if (this.kinkWindow[0] == null && this.kinkWindow[1] == null) {
      
      this.stateID= 0;

      this.kinkWindow[0] = this.fingerKinkRatio;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

      console.log("_____________________VERY FIRST INITIALIZATION");
    }

    console.log("state: ", this.stateID);
  }
}
