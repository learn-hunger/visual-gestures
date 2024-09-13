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
  wristDepth?: number;  // Future Scope

  fingerKinkRatio?: number;
  stateID?: number;
  decaWindowPointer?: number;

  decaWindow: [number | null, number | null, number | null, number | null, number | null] = [null, null, null, null, null];
  tipWindow: [INormalizedLandmark | null, INormalizedLandmark | null, INormalizedLandmark | null, INormalizedLandmark | null, INormalizedLandmark | null] = [null, null, null, null, null];
  kinkWindow: [number | null, number | null] = [null, null];
  motionWindow: [INormalizedLandmark, INormalizedLandmark] = [null!, null!]; // INDEX_MCP, INDEX_MCP
  downWindow: [INormalizedLandmark, INormalizedLandmark] = [null!, null!];

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

  set setElement(element: Element | null) {
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

    this.staticEventsInitialiser();
    this.pseudoDown();
    // this.pseudoUp();
    

    if(this.stateID==1){

      // Track the current position of hand to determine click vs. drop
      this.motionWindow[1]= this.structuredLandmarks.data["INDEX"].MCP;

      console.log("________________Down - DOwn - DOwn");
      // Freezing the cursor
      const { x, y } = getElementCoordinatesFromLandmark(
        this.tipWindow[0],
        this.props.sizes!,
      );
      // console.log(document.elementsFromPoint(x,y),"elements")
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;

      this.triggerMouseDown(this.mouseInit, this.getProps);
      this.setElement = document.elementFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!
      );

      console.log( "DOWNNNNNNNNNNNNNNN", this.setElement);
    }

    this.pseudoClick();


    if(this.stateID==0){

      this.motionWindow[0]= this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1]= null;

      this.triggerMouseMove(this.mouseInit, this.getProps);
      this.setElement = document.elementFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!
      );
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

  private pseudoDown(): boolean {
    if (
      this.structuredLandmarks &&
         this.fingerKinkRatio &&
        // ____________ Not Required: this.downWindow[0] != null  &&
        // ____________ Not Required: this.downWindow[1] == null &&
       // this.motionWindow[0] != null &&
        // _____________Not Required: this.motionWindow[1] == null //&&
  
        // weightedEuclideanDistance(
        //   this.motionWindow[0],
        //   this.structuredLandmarks.data["INDEX"].MCP,
        //   [1, 1],
        // ) < 0.08 && 

        this.stateID==0
    ){
    
      if( this.decaWindowPointer < 4){

          this.decaWindow[ this.decaWindowPointer + 1] = this.fingerKinkRatio;
          this.tipWindow[ this.decaWindowPointer+ 1]= this.structuredLandmarks.data['INDEX'].TIP;

          this.decaWindowPointer= this.decaWindowPointer+1;

          // console.log("__________________+++++", this.decaWindow, this.decaWindowPointer);

          if(this.decaWindow[0]-this.decaWindow[this.decaWindowPointer] >= 200){

            this.motionWindow[0]= this.structuredLandmarks.data["INDEX"].MCP;
            this.stateID= 1;
            return true;
          }
        }
      else if(this.decaWindowPointer==4){

        this.decaWindow[0]= this.decaWindow[1];
        this.decaWindow[1]= this.decaWindow[2];
        this.decaWindow[2]= this.decaWindow[3];
        this.decaWindow[3]= this.decaWindow[4];
        this.decaWindow[4]= this.fingerKinkRatio;


        this.tipWindow[0]= this.tipWindow[1];
        this.tipWindow[1]= this.tipWindow[2];
        this.tipWindow[2]= this.tipWindow[3];
        this.tipWindow[3]= this.tipWindow[4];
        this.tipWindow[4]= this.structuredLandmarks.data['INDEX'].TIP;

        if(this.decaWindow[0]-this.decaWindow[4] >= 200){
          this.motionWindow[0]= this.structuredLandmarks.data["INDEX"].MCP;
          this.stateID= 1;
          return true;
        }
      }
    return false; 
  }
}

  private pseudoUp(): boolean{


  if( this.stateID==1){

      this.decaWindow[0]= this.decaWindow[1];
      this.decaWindow[1]= this.decaWindow[2];
      this.decaWindow[2]= this.decaWindow[3];
      this.decaWindow[3]= this.decaWindow[4];
      this.decaWindow[4]= this.fingerKinkRatio;

      if(this.decaWindow[ this.decaWindowPointer]-this.decaWindow[0] >= 200){

        console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
        return true;

      } 
      
    }
    return false;
  }

  private pseudoClick(): boolean{

    if(
      this.stateID== 1 &&
      this.pseudoUp() &&
      weightedEuclideanDistance(
        this.motionWindow[0],
        this.motionWindow[1],
        [1, 1],
      ) < 0.08
    ){

      const { x, y } = getElementCoordinatesFromLandmark(
          this.tipWindow[0],
          this.props.sizes!,
      );


    

      console.log(document.elementsFromPoint(x,y),"elements")
      
      this.mouseInit.clientX = x;
      this.mouseInit.clientY = y;

      this.triggerMouseUp(this.mouseInit, this.getProps);

      this.triggerMouseClick(this.mouseInit, this.getProps);

      // this.setElement = document.elementFromPoint(x, y);
      console.log("CLicked", this.setElement );

      this.decaWindow[0]= this.decaWindow[1];
      this.decaWindow[1]= this.decaWindow[2];
      this.decaWindow[2]= this.decaWindow[3];
      this.decaWindow[3]= this.decaWindow[4];
      this.decaWindow[4]= this.fingerKinkRatio;


      this.tipWindow[0]= this.tipWindow[1];
      this.tipWindow[1]= this.tipWindow[2];
      this.tipWindow[2]= this.tipWindow[3];
      this.tipWindow[3]= this.tipWindow[4];
      this.tipWindow[4]= this.structuredLandmarks.data['INDEX'].TIP;

      this.stateID= 0;

      return true;
      }
    return false;
  }

  private isDown(): boolean {
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
      // console.log("check down")
      const { x, y } = getElementCoordinatesFromLandmark(
        this.downWindow[0],
        this.props.sizes!,
      );
      console.log(document.elementsFromPoint(x, y), "check down ");
      this.stateID = 1;

      // this.triggerMouseDown(this.mouseInit, this.getProps);

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
      console.log("check UP");
      // this.triggerMouseUp(this.mouseInit, this.getProps);

      this.stateID = 2;

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
      console.log("check Click");
      // this.triggerMouseClick(this.mouseInit, this.getProps);
      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;
      // DONOT CHANGE - LEAVE AS IT IS TO STORE WHERE WE STARTED PERFORMING CLICKING this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;

      this.stateID = 4;

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
      console.log(
        "Inside drag funciton",
        weightedEuclideanDistance(
          this.motionWindow[0],
          this.structuredLandmarks.data["INDEX"].MCP,
          [1, 1],
        ),
      );

      // this.downWindow[1] = this.structuredLandmarks.data["INDEX"].TIP;
      console.log("Dragging");
      // this.triggerMouseDrag(this.mouseInit, this.getProps);
      this.motionWindow[1] = this.structuredLandmarks.data["INDEX"].MCP;

      this.stateID = 2;

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
      // this.triggerMouseDrop(this.mouseInit, this.getProps);

      this.kinkWindow[0] = this.fingerKinkRatio;
      this.kinkWindow[1] = null;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;
      this.downWindow[1] = null!;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;
      this.motionWindow[1] = null!;

      this.stateID = 3;

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

    this.fingerKinkRatio = (1000 * this.fingerHeight) / this.palmHeight;

    // console.log("_____________", );


    // Very first instance of detection
    if (this.kinkWindow[0] == null && this.kinkWindow[1] == null) {
      this.stateID = 0;

      this.kinkWindow[0] = this.fingerKinkRatio;

      this.downWindow[0] = this.structuredLandmarks.data["INDEX"].TIP;

      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

      // console.log("_____________________VERY FIRST INITIALIZATION");
    }

    if( this.decaWindowPointer== undefined){
      this.decaWindowPointer= 0;
      this.decaWindow[ this.decaWindowPointer ]= this.fingerKinkRatio;
      this.tipWindow[ this.decaWindowPointer ]= this.structuredLandmarks.data["INDEX"].TIP;
    }

    // if (this.decaWindow[0]== null && this.decaWindow[1]== null && this.decaWindow[2]== null && this.decaWindow[3]== null && this.decaWindow[4]== null){

      

    // }
  
  }
  private get getProps(): IGestureCustomProps {
    this.props.calc = {
      distance2D: this.distance2D,
      distance3D: this.distance3D,
      relativeDist2D: this.relativeDist2D,
    };
    return this.props;
  }
}
