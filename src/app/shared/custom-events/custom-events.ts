import { DefaultConfig } from "../../config/defalut-config";
import { euclideanDistance } from "../../utilities/vg-functions";
import { IGestureCustomProps, IMouseMove } from "../../utilities/vg-types";
import { AVgPointerEvents } from "./vg-events";

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
}
