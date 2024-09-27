import { DefaultConfig } from "../../config/defalut-config";
import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "../abstracts/vg-pointer-props-abstract";
import { IVgCommonMethods } from "../interfaces/vg-common-event-methods";

/**
 * custom Event which is fired when the user do finger motion visual action
 * it is triggered from AvgPointerMove class
 * when the user moves his hand(by default index finger is taken as pointer)
 * it gets dispatched
 */
export class VgPointerMove
  extends ACommonMouseProps
  implements IVgCommonMethods
{
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_MOVE, mouseProp, customProps);
    // this.setCursor();
    this.moveCursor();
  }

  /**
   * to set the cursor path or image like hand pointer image etc
   * TODO since the fluctations are high between the events ,
   * the image is getting fluctuated so currently hold
   */
  setCursor(): void {
    const { path, scale, showCursor } =
      DefaultConfig.instance.cursor.vgpointermove;
    const { baseURI } = DefaultConfig.instance.cursor;
    if (showCursor && this.cursorElement.src != baseURI + path) {
      // console.log(this.cursorElement.src, baseURI + path, "cursor");
      this.cursorElement.src = path;
      this.cursorElement.style.scale = scale.toString();
    }
  }

  /**
   * move the cursor in between the viewport using position values
   */
  moveCursor() {
    this.cursorElement.style.left = this.clientX.toString() + "px";
    this.cursorElement.style.top = this.clientY.toString() + "px";
  }
}
