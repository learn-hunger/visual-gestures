import { DefaultConfig } from "../../config/defalut-config";
import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "../abstracts/vg-pointer-props-abstract";

/**
 * custom Event which is fired when the user enter into the new element
 * it is triggered from AvgPointerEvents class
 * it is fired when the user enters the element
 */
export class VgPointerEnter extends ACommonMouseProps {
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_ENTER, mouseProp, customProps);
    // this.setCursor();
  }

  /**
   * to set the cursor path or image like hand pointer image etc
   * TODO since the fluctations are high between the events ,
   * the image is getting fluctuated so currently hold
   */
  setCursor(): void {
    const { path, scale, showCursor } =
      DefaultConfig.instance.cursor.vgpointerenter;
    const { baseURI } = DefaultConfig.instance.cursor;
    if (showCursor && this.cursorElement.src != baseURI + path) {
      this.cursorElement.src = path;
      this.cursorElement.style.scale = scale.toString();
    }
  }
}
