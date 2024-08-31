import { DefaultConfig } from "../../config/defalut-config";
import {
  euclideanDistance,
  piecewiseFingerDistance,
  weightedEuclideanDistance,
} from "../../utilities/vg-functions";
import { IGestureCustomProps, IMouseMove } from "../../utilities/vg-types";
import { AVgPointerEvents } from "./vg-events";
import { INormalizedLandmark } from "../../utilities/vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "../DTO/vg-handlandmark";
import { EFingers } from "../../utilities/vg-constants";
import { threadId } from "worker_threads";
import { timeStamp } from "console";

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
  structuredLandmarks?:VgHandLandmarksDTO;
  palmHeight?: number;
  fingerHeight?: number;
  fingerKinkRatio?: number;

  kinkWindow: [number, number]= [null!, null!];
  motionWindow: [INormalizedLandmark, INormalizedLandmark, INormalizedLandmark] = [null!, null!, null!]; // INDEX_MCP, INDEX_MCP, INDEX_TIP
  downWindow: [INormalizedLandmark, INormalizedLandmark] = [null!, null!];


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



    // console.log( "__________", this.structuredLandmarks?.state['INDEX']);

    // // Applied Pressure: Finger is closed
    // if (
    //   this.downWindow[0] != null &&
    //   this.downWindow[1] == null &&
    //   this.structuredLandmarks.state["INDEX"] < 0.85
    // ) {
    //   this.downWindow[1] = this.structuredLandmarks.data['INDEX'].TIP;
    //   this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
    //   this.motionWindow[1]= this.structuredLandmarks.data['INDEX'].MCP;
    //   console.log(
    //     "**************ON POINTER DOWN EVENT TRIGGERED!!!!!**************",this.downWindow[0]      );


    // }

    // if( this.downWindow[0]!=null && this.downWindow[1]!=null && this.structuredLandmarks.state["INDEX"]<0.85){

    //   this.downWindow[1] = this.structuredLandmarks.data['INDEX'].TIP;
    //   //_______Drag the closed finger
    //   if( weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data['INDEX'].MCP, [1, 1]) > 0.08 ){
            
    //     console.log( "______________________________________Dragging the finger_down", this.downWindow[1])

    //     // Move the cursor with this logic
    //     // this.downWindow[0] + (this.structuredLandmarks.data['INDEX'].MCP - this.motionWindow[0])

    //     // _________________***_____
    //     this.motionWindow[1]= this.structuredLandmarks.data['INDEX'].MCP;
    // }
    // }

    // Pressure released: FINGER OPen
    // if (
    //   this.downWindow[0] != null &&
    //   this.downWindow[1] != null &&
    //   this.motionWindow[0] != null &&
    //   this.structuredLandmarks.state["INDEX"] > 0.85
    // ) {
    //   console.log(
    //     "*************ON POINTER UP TRIGGERED!!!!!********************",
    //   );


    // }

    // if (this.downWindow[0]!= null && this.downWindow[1]!=null && this.motionWindow[0] !=null && this.structuredLandmarks.state["INDEX"]>0.85 &&
    //   weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data['INDEX'].MCP, [1,1]) < 0.08
    //  ){
    //     console.log("___________Click**************");
    //     this.downWindow[1]= null!;
    //     this.motionWindow[1]= null!;
    // }

    // if(this.downWindow[0]!= null && this.downWindow[1]!= null && this.motionWindow[0]!= null && this.structuredLandmarks.state["INDEX"]> 0.85 &&
    //   weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data["INDEX"].MCP, [1,1]) > 0.08
    // )
    // {
    //   console.log("__________________Drop***************");
      
    //   this.downWindow[0]= this.structuredLandmarks.data['INDEX'].TIP;
    //   this.downWindow[1]= null!;

    //   this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
    //   this.motionWindow[1]= null!;
    // }

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
    this.staticEventsInitialiser();
    this.isPointerDown();
    // this.isPointerUp();
    // this.isPointerClick();
    // this.isPointerDrag();
    // this.isPointerDrop();
    // if(this.isPointerDown() || this.isPointerUp()){

    // }else 
    if (this.isPointerDown()==false && this.isPointerMove()) {
      this.setElement = document.elementFromPoint(
        this.mouseInit.clientX!,
        this.mouseInit.clientY!,
      );
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

  private isPointerDown():boolean{

    // console.log("KKKKKKKKKK",this.kinkWindow);
    // Applied Pressure: Finger is closed
    if (
      this.structuredLandmarks &&
      this.downWindow[0] != null &&
      this.downWindow[1] == null &&
      // ____STATIC ALGORITHM__________  this.structuredLandmarks.state["INDEX"] < 0.85
      this.kinkWindow[0]!= null && 
      this.kinkWindow[1]== null &&
      this.kinkWindow[0]- this.fingerKinkRatio >= 100
    ) {

      
      this.kinkWindow[1]= this.fingerKinkRatio; 

      this.downWindow[1] = this.structuredLandmarks.data['INDEX'].TIP;
      this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
      this.motionWindow[1]= this.structuredLandmarks.data['INDEX'].MCP;
      console.log(
        "**************ON POINTER DOWN EVENT TRIGGERED!!!!!**************",this.kinkWindow     );
        return true;

    }

    return false;
  };

  private isPointerUp():boolean{
    if (
      this.structuredLandmarks &&
      this.downWindow[0] != null &&
      this.downWindow[1] != null &&
      this.motionWindow[0] != null &&
      // ____STATIC ALGORITHM__________  this.structuredLandmarks.state["INDEX"] > 0.85
      this.kinkWindow[0]!= null &&
      this.kinkWindow[1]!= null &&
      (this.fingerKinkRatio! - this.kinkWindow[1]) >= 100
    ) {
      console.log(
        "*************ON POINTER UP TRIGGERED!!!!!********************",
      );
      return true

    }

    return false;
  }

  // private isPointerClick():boolean{
  //   if (this.structuredLandmarks && this.downWindow[0]!= null && this.downWindow[1]!=null && this.motionWindow[0] !=null && 
  //    // STACTIC: this.structuredLandmarks.state["INDEX"]>0.85 &&
  //    this.kinkWindow[0]!= null &&
  //    this.kinkWindow[1]!= null &&
  //    this.fingerKinkRatio - this.kinkWindow[1] >= 100 &&
  //     weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data['INDEX'].MCP, [1,1]) < 0.08
  //    ){
  //       console.log("___________Click**************");
  //       this.kinkWindow[0]= this.fingerKinkRatio;
  //       this.kinkWindow[1]= null;
  //       this.downWindow[1]= null!;
  //       this.motionWindow[1]= null!;
  //       return true;
  //   }
  //   return false;

  // }

  private isPointerDrop():boolean{
    if( this.structuredLandmarks && this.downWindow[0]!= null && this.downWindow[1]!= null && this.motionWindow[0]!= null && this.structuredLandmarks.state["INDEX"]> 0.85 &&
      weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data["INDEX"].MCP, [1,1]) > 0.08
    )
    {
      console.log("__________________Drop***************");
      
      this.downWindow[0]= this.structuredLandmarks.data['INDEX'].TIP;
      this.downWindow[1]= null!;

      this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
      this.motionWindow[1]= null!;
      return true;
    }
    return false;
  }

  private isPointerDrag():boolean{
    if( this.structuredLandmarks && this.downWindow[0]!=null && this.downWindow[1]!=null && this.structuredLandmarks.state["INDEX"]<0.85){

      this.downWindow[1] = this.structuredLandmarks.data['INDEX'].TIP;
      //_______Drag the closed finger
      if( weightedEuclideanDistance( this.motionWindow[0], this.structuredLandmarks.data['INDEX'].MCP, [1, 1]) > 0.08 ){
        console.log( "______________________________________Dragging the finger_down", this.downWindow[1])
        
        // Move the cursor with this logic
        // this.downWindow[0] + (this.structuredLandmarks.data['INDEX'].MCP - this.motionWindow[0])
        
        // _________________***_____
        this.motionWindow[1]= this.structuredLandmarks.data['INDEX'].MCP;
        return true;    
    }
    }
    return false;
  }

  private staticEventsInitialiser(){

    // Structuring raw landmarks
    const landmark: INormalizedLandmark[] = this.props.currentLandmarks;
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
        1,     // Change to power(_,2) to get the probability
      );
    }
    
    

    this.palmHeight= weightedEuclideanDistance( this.structuredLandmarks.data['WRIST'].WRIST, this.structuredLandmarks.data['INDEX'].MCP, [1,1]);
    this.fingerHeight= weightedEuclideanDistance( this.structuredLandmarks.data["INDEX"].TIP, this.structuredLandmarks.data["INDEX"].MCP, [1,1]);
    
    this.fingerKinkRatio= 1000* this.fingerHeight/ this.palmHeight;
    console.log("RRRRRRRRRRRRRRRRRRr", this.fingerKinkRatio);
    
  
    
    


    // console.log( "___________________filter",this.mouseInit.clientY,this.structuredLandmarks.state['INDEX'],this.structuredLandmarks.state['INDEX']*document.body.clientHeight);


    // ______________________________________________
    //           FLUID ALGORITHM
    //_______________________________________________
    // Very first instance of detection
    if(this.kinkWindow[0]== null && this.kinkWindow[1]== null){
        this.kinkWindow[0]= this.fingerKinkRatio;
        this.downWindow[0] = this.structuredLandmarks.data['INDEX'].TIP;
        this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
    }

    // ______________________________________________
    //           STATIC ALGORITHM
    //_______________________________________________
    // // No Pressure: Finger is erected
    // if ( this.structuredLandmarks.state["INDEX"] > 0.985) {
    //     // Freeze the pointer at INDEX_TIP
    //     if( this.downWindow[0] == null){
    //       this.downWindow[0] = this.structuredLandmarks.data['INDEX'].TIP;
    //     }

    //     if(this.motionWindow[0]== null){
    //       this.motionWindow[0]= this.structuredLandmarks.data['INDEX'].MCP;
    //     }
    //   }
    
  }
}
