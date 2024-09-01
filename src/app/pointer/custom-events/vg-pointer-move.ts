import { EVgMouseEvents } from "../../utilities/vg-constants";
import { IGestureCustomProps } from "../../utilities/vg-types";
import { ACommonMouseProps } from "../abstracts/vg-pointer-props-abstract";

export class VgPointerMove extends ACommonMouseProps {
  constructor(mouseProp: MouseEventInit, customProps: IGestureCustomProps) {
    super(EVgMouseEvents.MOUSE_MOVE, mouseProp, customProps);
    this.moveCursor();
  }

  moveCursor() {
    this.cursorElement.style.left = this.clientX.toString() + "px";
    this.cursorElement.style.top = this.clientY.toString() + "px";
  }
}
