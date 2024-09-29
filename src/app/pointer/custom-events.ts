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

/**
 * Central Class to store states of the hand landmarks
 * handles triggering events
 * Core logic for hand gestures is maintained here
 */
export class VgPointer extends AVgPointerEvents {
  distance2D!: number;
  distance3D!: number;
  relativeDist2D!: number;
  mouseInit!: MouseEventInit;
  props!: IGestureCustomProps;
  structuredLandmarks!: VgHandLandmarksDTO;
  mouseDown: boolean = false;
  upElement!: HTMLElement;

  // Variable contains the height of palm (if hand landmarks are successfully detected)
  palmHeight?: number;
  // Variable contains the height of Index finger (if handlandmarks are successfully detected)
  fingerHeight?: number;

  // Variable contains the value of FingerKinkRatio
  fingerKinkRatio!: number;

  /***
   * stateID: Flagging variable indicates the current event being performed
   * If stateID==0 then move event
   * else if stateID==1 then down event
   * else if stateID==2 then up event
   * else if stateID==3 then drag event
   * else if stateID==4 them drag+up= drop event
  */
  stateID?: number;

  // Variable points to the current index of 'decaWindow' and 'tipWindow'
  decaWindowPointer?: number; 
  
  /**
   * decaWindow:  Window contains history 'fingerKinkRatio'
   * initialized with array of null values
   * length is set to five to achieve optimal results
  */ 
  decaWindow: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ] = [null, null, null, null, null];

  /**
   * tipWindow: Window contains history 'INormalizedLandmark' of TIP of INDEX finger 
   * initialized with array of null values
   * length is set to five to achieve optimal results
  */ 
  tipWindow: [
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
    INormalizedLandmark | null,
  ] = [null, null, null, null, null];

  /**
   * motionWindow: Window contains 'INormalizedLandmark' of MCP of INDEX finger
   * initialized with array of null values
   * 0th index contains the significant past 'INormalizedLandmark'
   * 1th index contains the current 'INormalizedLandmark'
  */
  motionWindow: [INormalizedLandmark | null, INormalizedLandmark | null] = [
    null,
    null,
  ];

  constructor() {
    super();
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

  private get getProps(): IGestureCustomProps {
    this.props.calc = {
      distance2D: this.distance2D,
      distance3D: this.distance3D,
      relativeDist2D: this.relativeDist2D,
    };
    return this.props;
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

  trigger() {
    // this.isPointerDown();
    // if (this.mouseDown == false) {
    //   this.triggerMouseMove(this.mouseInit, this.getProps);

    //   this.setElement = document.elementFromPoint(
    //     this.mouseInit.clientX!,
    //     this.mouseInit.clientY!,
    //   );
    // }

    this.kinkLogic();
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

  private kinkLogic() {

    /**
     * Executes during every time-frame to generate structuredLandmarks
     * Calculate 'palmHeight', 'fingerHeight', and 'fingerKinkRatio'
     * Initialize 'decaWindowPointer' pointing to '0'th index
     * Initialize decaWindow with current 'fingerKinkRatio'
     * Initialize tipWindow to current INormalizedLandmarks of INDEX.TIP
     * Initialize motionWindow[0] with current INormalizedLandmarks of INDEX.MCP to track motion of hand
     * Initialize stateID to '0' which denotes current operation as cursor-move
    */
    this.staticEventsInitialiser();

    /**
     * Calling functions that do non-move operations
     * Move and Non-Move functions are implemented, maintaining complete mutual exclusion between the both
    */ 

    // 'pseudoDown' function triggers 'onmousedown' event and updates variable set representing the cursor is being down if down
    this.pseudoDown();

    // 'pseudoUp' function triggers 'onmouseup' operation and updates variable set representing the cursor is being up if up
    this.pseudoUp();

    // 'pseudoClick' function triggers 'onmouseclick' operation and updates variable set representing the cursor is being clicked if clicked
    this.pseudoClick();

    // 'pseudoDrag' function triggers 'onmousedrag' operation and updates variable set representing the cursor is being dragged if dragged
    this.pseudoDrag();
    
    // 'pseudoDrop' function triggers 'onmousedrop' operation and updates variable set representing the cursor is being dropped if dropped
    this.pseudoDrop();

    /**
     * Move Operation
     * Flagging variale 'stateID == 0' represents current event is 'onmousemove'
     * Check tipWindow[0] is not null to ensure hand landmarks are successfully extracted from the frame captured at current instant
     * Set the cursor to current coordinates
    */ 
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

    /**
     * Cursor control during drag operation
     * Flagging variale 'stateID == 3' represents current event is 'onmousedrag'
    */ 
    if (this.stateID == 3) {
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


  /**
   * pseudoDown() function
   * Used to check whether the mouse is down at current instance of time 
   * If 'structuredLandmarks' are correctly detected, 'fingerKinkRatio' is calculated, and current 'stateID == 0' (onmousemove event)
   * * If 'decaWindow[0]' (fingerKinkRatio of previous frame) is calculated and significant decrement (magnitude= 200) in 'fingerKinkRatio' is observed
   * * * Store current 'fingerKinkRatio' at 'decaWindow[1]' [ decaWindow[0], decaWindow[1] attains hibernation ]
   * * * Nullify decaWindow after 1th-index  [ decaWIndow[2], decaWindow[3], decaWindow[4] are set to implement sliding window ]
   * * * Store current TIP of INDEX finger at 'tipWindow[1]' [ tipWindow[0], tipWindow[1] attains hibernation ]
   * * * Nullify tipWindow after 1th-index  [ tipWindow[2], tipWindow[3], tipWindow[4] are set to implement sliding window ]
   * * * Set the 'decaWindowPointer' to '1' indicating the index where 'onmousedown' event is triggered
   * * * Set stateID to '1' representing 'onmousedown' operation is triggered
   * * * Set 'motionWindow[0]' with INormalizedLandmark of INDEX.MCP at instance where down operation is triggered
   * * * Call 'triggerMouseDown' event at 'tipWindow[0]' which contains INormalizedLandmark which corresponds to the starting(initial) coordinates from where 'onmousedown' event is started
   * * * Nullify the 'motionWindow[0]' to hold the successive INormalizedLandmarks of INDEX.MCP
   * * * 'True' is returned indicating mouse is down at the current instance of time
   * * Else
   * * * If 'decaWindow' is not completely filled
   * * * * Increment decaWindowPointer by 1
   * * * * Append current 'fingerKinkRatio' to 'decaWindow'
   * * * * Append current INDEX.TIP to 'tipWindow'
   * * * Else 
   * * * * Shift-left all values of 'decaWindow' to immediate preceeding index [ Sliding Operation ]
   * * * * Update 'decaWindow[4]' with current 'fingerKinkRatio'
   * * * * Shift-left all values of 'tipWindow' to immediate preceeding index [ Sliding Operation ]
   * * * * Update 'tipWindow[4]' with current INDEX.TIP
   * * * Set 'motionWindow[0]' with current 'INormalizedLandmark' of INDEX.MCP
   * * * Nullify 'motionWindow[1]' as current event being performed is 'onmousedown' 
   * * * 'False' is returned indicating mouse is not down at the current instance of time
   * Else
   * * 'False' is returned indicating mouse is not down at the current instance of time
   */
  private pseudoDown(): boolean {
    if (this.structuredLandmarks && this.fingerKinkRatio && this.stateID == 0) {
      // 'decaWindow[0]' (fingerKinkRatio of previous frame) is calculated and significant decrement (magnitude= 200) in 'fingerKinkRatio' is observed
      if (
        this.decaWindow[0] &&
        this.decaWindow[0] - this.fingerKinkRatio >= 200
      ) {

        /**
         * Hibernation Operation
         * Freeze 'decaWindow[0]', 'decaWindow[1]', 'tipWindow[0]', 'tipWindow[1]', 'motionWindow[1]'
        */ 

        // Store current 'fingerKinkRatio' at 'decaWindow[1]' [ decaWindow[0], decaWindow[1] attains hibernation ]
        this.decaWindow[1] = this.fingerKinkRatio; // Freeze the FKR at which down is triggered in 1th-index

        // Nullify decaWindow after 1th-index  [ decaWIndow[2], decaWindow[3], decaWindow[4] are set to implement sliding window ]
        this.decaWindow[2] = null;
        this.decaWindow[3] = null;
        this.decaWindow[4] = null;

        // Store current TIP of INDEX finger at 'tipWindow[1]' [ tipWindow[0], tipWindow[1] attains hibernation ]
        this.tipWindow[1] = this.structuredLandmarks.data["INDEX"].TIP; // Freeze the (x,y) of index_tip at which down is triggered in 1th-index

        // Nullify tipWindow after 1th-index  [ tipWindow[2], tipWindow[3], tipWindow[4] are set to implement sliding window ]
        this.tipWindow[2] = null;
        this.tipWindow[3] = null;
        this.tipWindow[4] = null;

        // Set the 'decaWindowPointer' to '1' indicating the index where 'onmousedown' event is triggered
        this.decaWindowPointer = 1;

        // Set stateID to '1' representing 'onmousedown' operation is triggered
        this.stateID = 1;

        // Set 'motionWindow[0]' with INormalizedLandmark of INDEX.MCP at instance where down operation is triggered
        this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

        // Nullify the 'motionWindow[0]' to hold the successive INormalizedLandmarks of INDEX.MCP
        this.motionWindow[1] = null;

        // 'tipWindow[0]' contains INormalizedLandmark which corresponds to the starting(initial) coordinates from where 'onmousedown' event is started
        const { x, y } = getElementCoordinatesFromLandmark(
          this.tipWindow[0]!,
          this.props.sizes!,
        );
        this.props.element!.downElement = this.getElement(x, y);
        // this.mouseInit.clientX = x;
        // this.mouseInit.clientY = y;
        // console.log("down", this.props.element?.downElement);

        // Call 'triggerMouseDown' event (corresponds to onmousedown in traditional mouse-based controls)
        this.triggerMouseDown(this.mouseInit, this.getProps);

        // console.log("_________Down ", document.elementsFromPoint(x, y));

        return true;
      }

      // Significant decrement in FKR is not observed
      else {
        // 'decaWindow' is not completely filled
        if (this.decaWindowPointer && this.decaWindowPointer < 4) {

          // Increment decaWindowPointer by 1
          this.decaWindowPointer = this.decaWindowPointer + 1;

          // Append current 'fingerKinkRatio' to 'decaWindow'
          this.decaWindow[this.decaWindowPointer] = this.fingerKinkRatio;

          // Append current INDEX.TIP to 'tipWindow'
          this.tipWindow[this.decaWindowPointer] =
            this.structuredLandmarks.data["INDEX"].TIP;
        }

        // 'decaWindow' is completely filled
        else if (this.decaWindowPointer == 4) {
          
          // Take copy of values of 'decaWindow' into variables
          var a = this.decaWindow[1];
          var b = this.decaWindow[2];
          var c = this.decaWindow[3];
          var d = this.decaWindow[4];

          // Update the decaWindow shifting one-index left
          this.decaWindow[0] = a;
          this.decaWindow[1] = b;
          this.decaWindow[2] = c;
          this.decaWindow[3] = d;
          
          // Update 'decaWindow[4]' with current 'fingerKinkRatio'
          this.decaWindow[4] = this.fingerKinkRatio; 

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

          // Update 'tipWindow[4]' with current INDEX.TIP
          this.tipWindow[4] = this.structuredLandmarks.data["INDEX"].TIP;

          // Note: No need to update the decaWindowPointer, keep the value as '4' only [this.decaWindowPointer= 4;]
        }

        // Update the 'motionWindow[0]' with current 'INormalizedLandmark' of INDEX.MCP
        this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP; 

        // Nullify the 'motionWindow[1]' as current event being performed is 'onmousedown' 
        this.motionWindow[1] = null;
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

      // Calculates 'weightedEuclideanDistance' from MCP to TIP of INDEX finger
      const MCPtoTIPDistance = weightedEuclideanDistance(
        this.structuredLandmarks.data[finger].MCP,
        this.structuredLandmarks.data[finger].TIP,
        [0.5, 1],
      );

      // Calculates 'piecewiseFingerDistance' of INDEX finger
      const piecewiseDistance = piecewiseFingerDistance(
        this.structuredLandmarks.data,
        finger,
        [0.5, 1],
      );

      /**
       * Calculate WeightedFingerOpenRatio (WFOR) 
       * WFOR is defined as the ratio of weightedEuclideanDistance from Finger MCP to TIP and summation of TIP to PIP, PIP to MCP
       * Change to power(___,2) to get the probability
      */
      this.structuredLandmarks.state[finger] = Math.pow(
        MCPtoTIPDistance / piecewiseDistance,
        1,
      );
    }

    // Calculate 'palmHeight' by weighting 'y' greater than 'x' using 'weightedEuclideanDistance'
    this.palmHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["WRIST"].WRIST,
      this.structuredLandmarks.data["INDEX"].MCP,
      [0.5, 1],
    );

    // Calculate 'fingerHeight' by weighting 'y' greater than 'x' using 'weightedEuclideanDistance'
    this.fingerHeight = weightedEuclideanDistance(
      this.structuredLandmarks.data["INDEX"].TIP,
      this.structuredLandmarks.data["INDEX"].MCP,
      [0.5, 1],
    );
    
    // Calculate 'fingerKinkRatio' as thousand (1000) times the ratio of 'fingerHeight' to 'palmHeight'
    this.fingerKinkRatio = (1000 * this.fingerHeight) / this.palmHeight;

    // Initialize 'decaWindowPointer', 'decaWindow', 'tipWindow', 'motionWindow', 'stateID'
    if (this.decaWindowPointer == undefined) {
      this.tipWindow = [null!, null!, null!, null!, null!];
      this.decaWindow = [null!, null!, null!, null!, null!];
      this.motionWindow = [null!, null!];

      // Initialize decaWindowPointer to 0th-index
      this.decaWindowPointer = 0;

      // Initialize decaWindow with current 'fingerKinkRatio'
      this.decaWindow[this.decaWindowPointer] = this.fingerKinkRatio; 

      // Initialize tipWindow to current INormalizedLandmarks of INDEX.TIP
      this.tipWindow[this.decaWindowPointer] = this.structuredLandmarks.data["INDEX"].TIP;

      // Initialize motionWindow[0] with current INormalizedLandmarks of INDEX.MCP to track motion of hand
      this.motionWindow[0] = this.structuredLandmarks.data["INDEX"].MCP;

      // Initialize stateID to '0' which denotes current operation as cursor-move
      this.stateID = 0;
    }
  }

  /**
   * Reset all sliding windows (decaWindow, tipWindow, motionWindow),
   * pointer (decaWindowPointer), and
   * flag (stateID) 
   * if hand landmarks are not detected
   */
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
